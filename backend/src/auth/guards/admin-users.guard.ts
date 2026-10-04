import {
	type CanActivate,
	type ExecutionContext,
	ForbiddenException,
	Inject,
	Injectable,
} from "@nestjs/common";
import type { Request } from "express";
import type { Database } from "../../db/drizzle.provider.js";
import { DRIZZLE } from "../../db/drizzle.provider.js";
import type { AuthenticatedUser } from "../auth.types.js";

type AuthenticatedRequest = Request & { user: AuthenticatedUser };

@Injectable()
export class AdminUsersGuard implements CanActivate {
	constructor(@Inject(DRIZZLE) private readonly db: Database) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
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

		const canReadUsers = userRoles.some(({ role }) =>
			role?.rolePermissions.some(
				({ permission }) => permission?.slug === "users:read",
			),
		);

		if (!canReadUsers) {
			throw new ForbiddenException("Insufficient permissions");
		}

		return true;
	}
}
