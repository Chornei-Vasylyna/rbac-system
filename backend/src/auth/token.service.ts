import { randomUUID } from "node:crypto";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService, type JwtSignOptions } from "@nestjs/jwt";
import { compare, hash } from "bcryptjs";
import { and, eq } from "drizzle-orm";
import ms from "ms";
import type { Database } from "../db/drizzle.provider.js";
import { DRIZZLE } from "../db/drizzle.provider.js";
import {
	permissions,
	refreshTokens,
	roles,
	rolesToPermissions,
	users,
	usersToRoles,
} from "../db/schema/index.js";
import type {
	AuthenticatedUser,
	JwtPayload,
	RefreshTokenPayload,
} from "./auth.types.js";

@Injectable()
export class TokenService {
	constructor(
		@Inject(DRIZZLE) private readonly db: Database,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {}

	async issueTokens(
		user: Omit<AuthenticatedUser, "permissions"> & {
			permissions?: string[];
		},
	) {
		const authenticatedUser: AuthenticatedUser = {
			...user,
			permissions: user.permissions ?? (await this.getUserPermissions(user.id)),
		};
		const payload: JwtPayload = {
			sub: authenticatedUser.id,
			email: authenticatedUser.email,
			roles: authenticatedUser.roles,
			type: "access",
		};

		const accessToken = await this.jwtService.signAsync(payload);

		const refreshExpiresIn =
			this.configService.get<string>("JWT_REFRESH_EXPIRES_IN") || "7d";
		const refreshExpiresInMs = ms(refreshExpiresIn as ms.StringValue);

		if (refreshExpiresInMs === undefined) {
			throw new Error("JWT_REFRESH_EXPIRES_IN must be a valid ms duration");
		}

		const refreshTokenId = randomUUID();
		const refreshToken = await this.jwtService.signAsync(
			{ sub: user.id, type: "refresh", jti: refreshTokenId },
			{
				secret: this.configService.getOrThrow<string>("JWT_REFRESH_SECRET"),
				expiresIn: refreshExpiresIn as JwtSignOptions["expiresIn"],
			},
		);

		await this.db.insert(refreshTokens).values({
			id: refreshTokenId,
			userId: authenticatedUser.id,
			tokenHash: await hash(refreshToken, 12),
			expiresAt: new Date(Date.now() + refreshExpiresInMs),
		});

		const expiresIn =
			this.configService.get<string>("JWT_ACCESS_EXPIRES_IN") || "15m";

		return {
			accessToken,
			refreshToken,
			expiresIn,
			user: authenticatedUser,
		};
	}

	async refresh(token: string) {
		let payload: RefreshTokenPayload;

		try {
			payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(token, {
				secret: this.configService.getOrThrow<string>("JWT_REFRESH_SECRET"),
			});
		} catch {
			throw new UnauthorizedException("Invalid or expired refresh token");
		}

		if (payload.type !== "refresh") {
			throw new UnauthorizedException("Invalid refresh token");
		}

		const [storedToken] = await this.db
			.select()
			.from(refreshTokens)
			.where(
				and(
					eq(refreshTokens.id, payload.jti),
					eq(refreshTokens.userId, payload.sub),
				),
			);

		if (
			!storedToken ||
			storedToken.expiresAt <= new Date() ||
			!(await compare(token, storedToken.tokenHash))
		) {
			throw new UnauthorizedException("Invalid or expired refresh token");
		}

		const [user] = await this.db
			.select({ id: users.id, email: users.email, isActive: users.isActive })
			.from(users)
			.where(eq(users.id, payload.sub))
			.limit(1);

		if (!user?.isActive) {
			throw new UnauthorizedException("User is inactive");
		}

		await this.db
			.delete(refreshTokens)
			.where(eq(refreshTokens.id, storedToken.id));

		return this.issueTokens({
			id: user.id,
			email: user.email,
			roles: await this.getUserRoles(user.id),
		});
	}

	async logout(token: string) {
		try {
			const payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(
				token,
				{
					secret: this.configService.getOrThrow<string>("JWT_REFRESH_SECRET"),
				},
			);
			const [storedToken] = await this.db
				.select()
				.from(refreshTokens)
				.where(
					and(
						eq(refreshTokens.id, payload.jti),
						eq(refreshTokens.userId, payload.sub),
					),
				);

			if (storedToken && (await compare(token, storedToken.tokenHash))) {
				await this.db
					.delete(refreshTokens)
					.where(eq(refreshTokens.id, storedToken.id));
			}
		} catch {
			return { success: true };
		}

		return { success: true };
	}

	private async getUserRoles(userId: string) {
		const userRoles = await this.db
			.select({ name: roles.name })
			.from(usersToRoles)
			.innerJoin(roles, eq(usersToRoles.roleId, roles.id))
			.where(eq(usersToRoles.userId, userId));

		return userRoles.map((role) => role.name);
	}

	private async getUserPermissions(userId: string) {
		const userPermissions = await this.db
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
			.where(eq(usersToRoles.userId, userId));

		return [...new Set(userPermissions.map((permission) => permission.slug))];
	}
}
