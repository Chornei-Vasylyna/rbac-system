import {
	ConflictException,
	Inject,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { and, count, eq, ilike } from "drizzle-orm";
import type { Database } from "../db/drizzle.provider.js";
import { DRIZZLE } from "../db/drizzle.provider.js";
import { refreshTokens, users, usersToRoles } from "../db/schema/index.js";
import type { AssignRoleDto } from "./dto/assign-role.dto.js";
import type { ListUsersDto } from "./dto/list-users.dto.js";
import type { UpdateUserDto } from "./dto/update-user.dto.js";
import type { UpdateUserStatusDto } from "./dto/update-user-status.dto.js";

@Injectable()
export class UsersService {
	constructor(@Inject(DRIZZLE) private readonly db: Database) {}

	async findAll({ page, pageSize, search }: ListUsersDto) {
		const filter = search ? ilike(users.email, `%${search}%`) : undefined;
		const offset = (page - 1) * pageSize;

		const [userRows, [{ total }]] = await Promise.all([
			this.db.query.users.findMany({
				columns: {
					id: true,
					email: true,
					isActive: true,
					createdAt: true,
					updatedAt: true,
				},
				with: {
					userRoles: {
						columns: {},
						with: {
							role: true,
						},
					},
				},
				where: search ? { email: { ilike: `%${search}%` } } : undefined,
				orderBy: { createdAt: "asc", id: "asc" },
				limit: pageSize,
				offset,
			}),

			this.db.select({ total: count() }).from(users).where(filter),
		]);

		return {
			data: userRows.map((user) => ({
				id: user.id,
				email: user.email,
				isActive: user.isActive,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
				roles: user.userRoles.map(({ role }) => role),
			})),
			meta: {
				page,
				pageSize,
				total: Number(total),
				totalPages: Math.ceil(Number(total) / pageSize),
			},
		};
	}

	async assignRole(userId: string, dto: AssignRoleDto) {
		const user = await this.db.query.users.findFirst({
			columns: { id: true },
			where: { id: userId },
		});

		if (!user) throw new NotFoundException("User not found");

		const role = await this.db.query.roles.findFirst({
			columns: { id: true, name: true },
			where: { id: dto.roleId },
		});
		if (!role) throw new NotFoundException("Role not found");

		const [assignment] = await this.db
			.insert(usersToRoles)
			.values({ userId, roleId: dto.roleId })
			.onConflictDoNothing()
			.returning();

		if (!assignment) throw new ConflictException("Role is already assigned");
		return { userId, role };
	}

	async update(userId: string, dto: UpdateUserDto) {
		try {
			const existingUser = await this.db.query.users.findFirst({
				columns: { id: true },
				where: { id: userId },
			});

			if (!existingUser) throw new NotFoundException("User not found");

			await this.db
				.update(users)
				.set({
					email: dto.email.toLowerCase(),
					updatedAt: new Date(),
				})
				.where(eq(users.id, userId));

			return this.db.query.users.findFirst({
				columns: {
					id: true,
					email: true,
					isActive: true,
					updatedAt: true,
				},
				where: { id: userId },
			});
		} catch (error) {
			if (
				error instanceof Error &&
				error.message.includes("users_email_unique")
			) {
				throw new ConflictException("Email is already in use");
			}
			throw error;
		}
	}

	async removeRole(userId: string, roleId: string) {
		return this.db.transaction(async (tx) => {
			const role = await tx.query.roles.findFirst({
				columns: { name: true },
				where: { id: roleId },
			});

			if (role?.name === "admin") {
				const activeAdmins = await tx.query.users.findMany({
					columns: { id: true },
					where: { isActive: true },
					with: {
						userRoles: {
							columns: {},
							where: { roleId },
							with: { role: { columns: { name: true } } },
						},
					},
				});
				const activeAdminCount = activeAdmins.filter(({ userRoles }) =>
					userRoles.some(({ role }) => role?.name === "admin"),
				).length;

				const targetAssignment = await tx.query.usersToRoles.findFirst({
					columns: {},
					where: { userId, roleId },
					with: { user: { columns: { isActive: true } } },
				});

				const removesOnlyActiveAdmin =
					targetAssignment?.user?.isActive && activeAdminCount <= 1;
				const leavesNoActiveAdmins = activeAdminCount === 0;

				if (removesOnlyActiveAdmin || leavesNoActiveAdmins) {
					throw new ConflictException("At least one active admin is required");
				}
			}

			const assignment = await tx.query.usersToRoles.findFirst({
				columns: { userId: true },
				where: { userId, roleId },
			});

			if (!assignment) {
				throw new NotFoundException("Role assignment not found");
			}

			const userRoles = await tx.query.usersToRoles.findMany({
				columns: { roleId: true },
				where: { userId },
			});

			if (userRoles.length <= 1) {
				throw new ConflictException("User must have at least one role");
			}

			await tx
				.delete(usersToRoles)
				.where(
					and(eq(usersToRoles.userId, userId), eq(usersToRoles.roleId, roleId)),
				);
			return { userId, roleId, removed: true };
		});
	}

	async updateStatus(userId: string, dto: UpdateUserStatusDto) {
		const user = await this.db.transaction(async (tx) => {
			const existingUser = await tx.query.users.findFirst({
				columns: { id: true },
				where: { id: userId },
			});

			if (!existingUser) throw new NotFoundException("User not found");

			if (!dto.isActive) {
				const adminAssignment = await tx.query.usersToRoles.findFirst({
					columns: {},
					where: { userId },
					with: { role: { columns: { name: true } } },
				});

				if (adminAssignment?.role?.name === "admin") {
					const activeAdmins = await tx.query.users.findMany({
						columns: { id: true },
						where: { isActive: true },
						with: {
							userRoles: {
								columns: {},
								with: { role: { columns: { name: true } } },
							},
						},
					});
					const total = activeAdmins.filter(({ userRoles }) =>
						userRoles.some(({ role }) => role?.name === "admin"),
					).length;

					if (total <= 1) {
						throw new ConflictException(
							"The last active admin cannot be deactivated",
						);
					}
				}
			}

			await tx
				.update(users)
				.set({ isActive: dto.isActive, updatedAt: new Date() })
				.where(eq(users.id, userId));

			if (!dto.isActive) {
				await tx.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
			}

			return tx.query.users.findFirst({
				columns: {
					id: true,
					email: true,
					isActive: true,
					updatedAt: true,
				},
				where: { id: userId },
			});
		});

		return user;
	}
}
