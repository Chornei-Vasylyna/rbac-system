import {
	ConflictException,
	Inject,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { asc, eq, inArray } from "drizzle-orm";
import type { Database } from "../db/drizzle.provider.js";
import { DRIZZLE } from "../db/drizzle.provider.js";
import {
	permissions,
	roles,
	rolesToPermissions,
	usersToRoles,
} from "../db/schema/index.js";
import { CreateRoleDto } from "./dto/create-role.dto.js";
import { UpdateRoleDto } from "./dto/update-role.dto.js";
import { UpdateRolePermissionsDto } from "./dto/update-role-permissions.dto.js";

@Injectable()
export class RolesService {
	constructor(@Inject(DRIZZLE) private readonly db: Database) {}

	findPermissions() {
		return this.db.select().from(permissions).orderBy(asc(permissions.slug));
	}

	async findAll() {
		const rows = await this.db
			.select({
				role: roles,
				permission: permissions,
			})
			.from(roles)
			.leftJoin(
				rolesToPermissions,
				eq(rolesToPermissions.roleId, roles.id),
			)
			.leftJoin(
				permissions,
				eq(rolesToPermissions.permissionId, permissions.id),
			);

		const rolesById = new Map<
			string,
			{ role: typeof roles.$inferSelect; permissions: typeof permissions.$inferSelect[] }
		>();

		for (const row of rows) {
			const current = rolesById.get(row.role.id) ?? {
				role: row.role,
				permissions: [],
			};

			if (row.permission) {
				current.permissions.push(row.permission);
			}

			rolesById.set(row.role.id, current);
		}

		return [...rolesById.values()].map(({ role, permissions: rolePermissions }) => ({
			...role,
			permissions: rolePermissions,
		}));
	}

	async create(dto: CreateRoleDto) {
		const [role] = await this.db
			.insert(roles)
			.values({
				name: dto.name.trim(),
				description: dto.description?.trim() || null,
			})
			.onConflictDoNothing({ target: roles.name })
			.returning();

		if (!role) {
			throw new ConflictException("Role name is already in use");
		}

		return role;
	}

	async update(roleId: string, dto: UpdateRoleDto) {
		const [existingRole] = await this.db
			.select({ id: roles.id, name: roles.name })
			.from(roles)
			.where(eq(roles.id, roleId))
			.limit(1);

		if (!existingRole) throw new NotFoundException("Role not found");
		if (dto.name && ["admin", "user"].includes(existingRole.name)) {
			throw new ConflictException("System roles cannot be renamed");
		}

		try {
			const [role] = await this.db
				.update(roles)
				.set({
					...(dto.name === undefined ? {} : { name: dto.name.trim() }),
					...(dto.description === undefined
						? {}
						: { description: dto.description.trim() || null }),
				})
				.where(eq(roles.id, roleId))
				.returning();
			return role;
		} catch (error) {
			if (error instanceof Error && error.message.includes("roles_name_unique")) {
				throw new ConflictException("Role name is already in use");
			}
			throw error;
		}
	}

	async remove(roleId: string) {
		const [role] = await this.db
			.select({ id: roles.id, name: roles.name })
			.from(roles)
			.where(eq(roles.id, roleId))
			.limit(1);

		if (!role) throw new NotFoundException("Role not found");
		if (["admin", "user"].includes(role.name)) {
			throw new ConflictException("System roles cannot be deleted");
		}

		const [assignment] = await this.db
			.select({ userId: usersToRoles.userId })
			.from(usersToRoles)
			.where(eq(usersToRoles.roleId, roleId))
			.limit(1);
		if (assignment) {
			throw new ConflictException("Role is assigned to users");
		}

		await this.db.delete(roles).where(eq(roles.id, roleId));
		return { id: roleId, removed: true };
	}

	async updatePermissions(roleId: string, dto: UpdateRolePermissionsDto) {
		return this.db.transaction(async (tx) => {
			const [role] = await tx
				.select()
				.from(roles)
				.where(eq(roles.id, roleId))
				.limit(1);

			if (!role) {
				throw new NotFoundException("Role not found");
			}

			const rolePermissions = dto.permissionIds.length
				? await tx
						.select()
						.from(permissions)
						.where(inArray(permissions.id, dto.permissionIds))
				: [];

			if (rolePermissions.length !== dto.permissionIds.length) {
				throw new NotFoundException("One or more permissions were not found");
			}

			await tx
				.delete(rolesToPermissions)
				.where(eq(rolesToPermissions.roleId, roleId));

			if (dto.permissionIds.length) {
				await tx.insert(rolesToPermissions).values(
					dto.permissionIds.map((permissionId) => ({
						roleId,
						permissionId,
					})),
				);
			}

			return { role, permissions: rolePermissions };
		});
	}
}