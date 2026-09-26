import {
	type CanActivate,
	type ExecutionContext,
	Inject,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";
import type { AuthenticatedUser, JwtPayload } from "../auth.types.js";

type AuthenticatedRequest = Request & { user?: AuthenticatedUser };

@Injectable()
export class JwtAuthGuard implements CanActivate {
	constructor(@Inject(JwtService) private readonly jwtService: JwtService) {}

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

			request.user = {
				id: payload.sub,
				email: payload.email,
				roles: payload.roles,
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
