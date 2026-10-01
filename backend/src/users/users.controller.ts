import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	Query,
	UseGuards,
} from "@nestjs/common";
import { Permissions } from "../auth/decorators/permissions.decorator.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { PermissionsGuard } from "../auth/guards/permissions.guard.js";
import { AssignRoleDto } from "./dto/assign-role.dto.js";
import { ListUsersDto } from "./dto/list-users.dto.js";
import { UpdateUserStatusDto } from "./dto/update-user-status.dto.js";
import { UsersService } from "./users.service.js";

@Controller("users")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	@Permissions("users:read")
	findAll(@Query() query: ListUsersDto) {
		return this.usersService.findAll(query);
	}

	@Post(":id/roles")
	@Permissions("users:manage")
	assignRole(
		@Param("id", new ParseUUIDPipe()) userId: string,
		@Body() dto: AssignRoleDto,
	) {
		return this.usersService.assignRole(userId, dto);
	}

	@Delete(":id/roles/:roleId")
	@Permissions("users:manage")
	removeRole(
		@Param("id", new ParseUUIDPipe()) userId: string,
		@Param("roleId", new ParseUUIDPipe()) roleId: string,
	) {
		return this.usersService.removeRole(userId, roleId);
	}

	@Patch(":id/status")
	@Permissions("users:manage")
	updateStatus(
		@Param("id", new ParseUUIDPipe()) userId: string,
		@Body() dto: UpdateUserStatusDto,
	) {
		return this.usersService.updateStatus(userId, dto);
	}
}