import {
	type CanActivate,
	type ExecutionContext,
	ForbiddenException,
	Inject,
	Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Request } from "express";
import type { Database } from "../../db/drizzle.provider.js";
import { DRIZZLE } from "../../db/drizzle.provider.js";
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
		const userRoles = await this.db.query.usersToRoles.findMany({
			columns: {},
			where: { userId: request.user.id },
			with: {
				role: {
					columns: {},
					with: {
						rolePermissions: {
							columns: {},
							with: { permission: { columns: { slug: true } } },
						},
					},
				},
			},
		});

		const grantedPermissions = new Set(
			userRoles.flatMap(({ role }) =>
				role
					? role.rolePermissions.flatMap(({ permission }) =>
							permission ? [permission.slug] : [],
						)
					: [],
			),
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