import {
	type CanActivate,
	type ExecutionContext,
	Inject,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { eq } from "drizzle-orm";
import type { Request } from "express";
import type { Database } from "../../db/drizzle.provider.js";
import { DRIZZLE } from "../../db/drizzle.provider.js";
import { users } from "../../db/schema/index.js";
import type { AuthenticatedUser, JwtPayload } from "../auth.types.js";

type AuthenticatedRequest = Request & { user?: AuthenticatedUser };

@Injectable()
export class JwtAuthGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		@Inject(DRIZZLE) private readonly db: Database,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
		const token = this.extractToken(request);

		if (!token) {
			throw new UnauthorizedException("Bearer token is required");
		}

		try {
			const payload = await this.jwtService.verifyAsync<JwtPayload>(token);

			if (payload.type !== "access") {
				throw new UnauthorizedException("Invalid access token");
			}

			const [user] = await this.db
				.select({ id: users.id, email: users.email, isActive: users.isActive })
				.from(users)
				.where(eq(users.id, payload.sub))
				.limit(1);

			if (!user?.isActive) {
				throw new UnauthorizedException("User is inactive");
			}

			request.user = {
				id: user.id,
				email: user.email,
				roles: payload.roles,
				permissions: [],
			};

			return true;
		} catch {
			throw new UnauthorizedException("Invalid or expired token");
		}
	}

	private extractToken(request: Request): string | undefined {
		const [scheme, token] = request.headers.authorization?.split(" ") ?? [];
		return scheme === "Bearer" ? token : undefined;
	}
}
