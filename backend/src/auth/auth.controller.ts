import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import type { LoginDto } from "./dto/login.dto.js";
import type { RefreshTokenDto } from "./dto/refresh-token.dto.js";
import type { RegisterDto } from "./dto/register.dto.js";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("register")
	register(@Body() dto: RegisterDto) {
		return this.authService.register(dto);
	}

	@Post("login")
	login(@Body() dto: LoginDto) {
		return this.authService.login(dto);
	}

	@Post("refresh")
	refresh(@Body() dto: RefreshTokenDto) {
		return this.authService.refresh(dto.refreshToken);
	}

	@Post("logout")
	logout(@Body() dto: RefreshTokenDto) {
		return this.authService.logout(dto.refreshToken);
	}
}
