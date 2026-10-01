import {
	ConflictException,
	Inject,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { and, asc, count, eq, ilike, inArray } from "drizzle-orm";
import type { Database } from "../db/drizzle.provider.js";
import { DRIZZLE } from "../db/drizzle.provider.js";
import {
	refreshTokens,
	roles,
	users,
	usersToRoles,
} from "../db/schema/index.js";
import { AssignRoleDto } from "./dto/assign-role.dto.js";
import { ListUsersDto } from "./dto/list-users.dto.js";
import { UpdateUserStatusDto } from "./dto/update-user-status.dto.js";
import { UpdateUserDto } from "./dto/update-user.dto.js";

@Injectable()
export class UsersService {
	constructor(@Inject(DRIZZLE) private readonly db: Database) {}

	async findAll({ page, pageSize, search }: ListUsersDto) {
		const filter = search ? ilike(users.email, `%${search}%`) : undefined;
		const offset = (page - 1) * pageSize;

		const [userRows, [{ total }]] = await Promise.all([
			this.db
				.select({
					id: users.id,
					email: users.email,
					fullName: users.fullName,
					isActive: users.isActive,
					createdAt: users.createdAt,
					updatedAt: users.updatedAt,
				})
				.from(users)
				.where(filter)
				.orderBy(asc(users.createdAt), asc(users.id))
				.limit(pageSize)
				.offset(offset),
			this.db.select({ total: count() }).from(users).where(filter),
		]);

		const userIds = userRows.map((user) => user.id);
		const roleRows = userIds.length
			? await this.db
					.select({ userId: usersToRoles.userId, role: roles })
					.from(usersToRoles)
					.innerJoin(roles, eq(usersToRoles.roleId, roles.id))
					.where(inArray(usersToRoles.userId, userIds))
			: [];

		const rolesByUserId = new Map<string, typeof roles.$inferSelect[]>();
		for (const row of roleRows) {
			const userRoles = rolesByUserId.get(row.userId) ?? [];
			userRoles.push(row.role);
			rolesByUserId.set(row.userId, userRoles);
		}

		return {
			data: userRows.map((user) => ({
				...user,
				roles: rolesByUserId.get(user.id) ?? [],
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
		const [user] = await this.db
			.select({ id: users.id })
			.from(users)
			.where(eq(users.id, userId))
			.limit(1);
		if (!user) throw new NotFoundException("User not found");

		const [role] = await this.db
			.select({ id: roles.id, name: roles.name })
			.from(roles)
			.where(eq(roles.id, dto.roleId))
			.limit(1);
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
			const [user] = await this.db
				.update(users)
				.set({
					email: dto.email.toLowerCase(),
					fullName: dto.fullName?.trim() || null,
					updatedAt: new Date(),
				})
				.where(eq(users.id, userId))
				.returning({
					id: users.id,
					email: users.email,
					fullName: users.fullName,
					isActive: users.isActive,
					updatedAt: users.updatedAt,
				});

			if (!user) throw new NotFoundException("User not found");
			return user;
		} catch (error) {
			if (error instanceof Error && error.message.includes("users_email_unique")) {
				throw new ConflictException("Email is already in use");
			}
			throw error;
		}
	}

	async removeRole(userId: string, roleId: string) {
		const [assignment] = await this.db
			.delete(usersToRoles)
			.where(
				and(
					eq(usersToRoles.userId, userId),
					eq(usersToRoles.roleId, roleId),
				),
			)
			.returning();

		if (!assignment) throw new NotFoundException("Role assignment not found");
		return { userId, roleId, removed: true };
	}

	async updateStatus(userId: string, dto: UpdateUserStatusDto) {
		const user = await this.db.transaction(async (tx) => {
			const [updatedUser] = await tx
				.update(users)
				.set({ isActive: dto.isActive, updatedAt: new Date() })
				.where(eq(users.id, userId))
				.returning({
					id: users.id,
					email: users.email,
					isActive: users.isActive,
					updatedAt: users.updatedAt,
				});

			if (updatedUser && !updatedUser.isActive) {
				await tx.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
			}

			return updatedUser;
		});

		if (!user) throw new NotFoundException("User not found");
		return user;
	}
}