import {
	type CanActivate,
	type ExecutionContext,
	ForbiddenException,
	Inject,
	Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { eq } from "drizzle-orm";
import type { Request } from "express";
import type { Database } from "../../db/drizzle.provider.js";
import { DRIZZLE } from "../../db/drizzle.provider.js";
import {
	permissions,
	rolesToPermissions,
	usersToRoles,
} from "../../db/schema/index.js";
import type { AuthenticatedUser } from "../auth.types.js";
import { PERMISSIONS_KEY } from "../decorators/permissions.decorator.js";

type AuthenticatedRequest = Request & { user: AuthenticatedUser };

@Injectable()
export class PermissionsGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		@Inject(DRIZZLE) private readonly db: Database,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
			PERMISSIONS_KEY,
			[context.getHandler(), context.getClass()],
		);

		if (!requiredPermissions?.length) {
			return true;
		}

		const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
		const permissionRows = await this.db
			.select({ slug: permissions.slug })
			.from(usersToRoles)
			.innerJoin(
				rolesToPermissions,
				eq(rolesToPermissions.roleId, usersToRoles.roleId),
			)
			.innerJoin(
				permissions,
				eq(permissions.id, rolesToPermissions.permissionId),
			)
			.where(eq(usersToRoles.userId, request.user.id));

		const grantedPermissions = new Set(
			permissionRows.map((permission) => permission.slug),
		);
		const hasPermissions = requiredPermissions.every((permission) =>
			grantedPermissions.has(permission),
		);

		if (!hasPermissions) {
			throw new ForbiddenException("Insufficient permissions");
		}

		return true;
	}
}