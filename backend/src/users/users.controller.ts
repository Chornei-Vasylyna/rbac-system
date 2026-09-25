import {
	Controller,
	Get,
	Req,
	UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import type { AuthenticatedUser } from "../auth/auth.types.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";

type AuthenticatedRequest = Request & { user: AuthenticatedUser };

@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
	@Get("me")
	getCurrentUser(@Req() request: AuthenticatedRequest) {
		return request.user;
	}

	@Get("admin-check")
	@Roles("admin")
	adminCheck() {
		return { authorized: true };
	}
}