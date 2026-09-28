import {
	Body,
	Controller,
	Post,
	Req,
	Res,
	UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import type { AuthenticatedUser } from "./auth.types.js";
import { LoginDto } from "./dto/login.dto.js";
import { RegisterDto } from "./dto/register.dto.js";

const REFRESH_TOKEN_COOKIE = "refreshToken";
const REFRESH_TOKEN_COOKIE_PATH = "/api/auth";

@Controller("auth")
export class AuthController {
	constructor(
		private readonly configService: ConfigService,
		private readonly authService: AuthService,
	) {}

	@Post("register")
	async register(
		@Body() dto: RegisterDto,
		@Res({ passthrough: true }) response: Response,
	) {
		return this.respondWithTokens(
			response,
			await this.authService.register(dto),
		);
	}

	@Post("login")
	async login(
		@Body() dto: LoginDto,
		@Res({ passthrough: true }) response: Response,
	) {
		return this.respondWithTokens(response, await this.authService.login(dto));
	}

	@Post("refresh")
	async refresh(
		@Req() request: Request,
		@Res({ passthrough: true }) response: Response,
	) {
		const refreshToken = request.cookies?.[REFRESH_TOKEN_COOKIE];

		if (!refreshToken) {
			throw new UnauthorizedException("Refresh token is required");
		}

		return this.respondWithTokens(
			response,
			await this.authService.refresh(refreshToken),
		);
	}

	@Post("logout")
	async logout(
		@Req() request: Request,
		@Res({ passthrough: true }) response: Response,
	) {
		const refreshToken = request.cookies?.[REFRESH_TOKEN_COOKIE];

		if (refreshToken) {
			await this.authService.logout(refreshToken);
		}

		response.clearCookie(REFRESH_TOKEN_COOKIE, {
			path: REFRESH_TOKEN_COOKIE_PATH,
		});

		return { success: true };
	}

	private respondWithTokens(
		response: Response,
		tokens: {
			accessToken: string;
			refreshToken: string;
			expiresIn: string;
			user: AuthenticatedUser;
		},
	) {
		const { refreshToken, ...responseBody } = tokens;

		response.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
			httpOnly: true,
			secure:
				this.configService.get<string>("NODE_ENV") === "production",
			sameSite: "lax",
			path: REFRESH_TOKEN_COOKIE_PATH,
		});

		return responseBody;
	}
}
