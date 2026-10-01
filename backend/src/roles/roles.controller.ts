import {
	Body,
	Controller,
	Get,
	Param,
	ParseUUIDPipe,
	Post,
	UseGuards,
} from "@nestjs/common";
import { Permissions } from "../auth/decorators/permissions.decorator.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { PermissionsGuard } from "../auth/guards/permissions.guard.js";
import { CreateRoleDto } from "./dto/create-role.dto.js";
import { UpdateRolePermissionsDto } from "./dto/update-role-permissions.dto.js";
import { RolesService } from "./roles.service.js";

@Controller("roles")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RolesController {
	constructor(private readonly rolesService: RolesService) {}

	@Get()
	@Permissions("roles:manage")
	findAll() {
		return this.rolesService.findAll();
	}

	@Get("permissions")
	@Permissions("roles:manage")
	findPermissions() {
		return this.rolesService.findPermissions();
	}

	@Post()
	@Permissions("roles:manage")
	create(@Body() dto: CreateRoleDto) {
		return this.rolesService.create(dto);
	}

	@Post(":id/permissions")
	@Permissions("roles:manage")
	updatePermissions(
		@Param("id", new ParseUUIDPipe()) roleId: string,
		@Body() dto: UpdateRolePermissionsDto,
	) {
		return this.rolesService.updatePermissions(roleId, dto);
	}
}