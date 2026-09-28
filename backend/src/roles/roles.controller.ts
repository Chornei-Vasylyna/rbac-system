import {
	Body,
	Controller,
	Get,
	Param,
	ParseUUIDPipe,
	Post,
	UseGuards,
} from "@nestjs/common";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { CreateRoleDto } from "./dto/create-role.dto.js";
import { UpdateRolePermissionsDto } from "./dto/update-role-permissions.dto.js";
import { RolesService } from "./roles.service.js";

@Controller("roles")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin")
export class RolesController {
	constructor(private readonly rolesService: RolesService) {}

	@Get()
	findAll() {
		return this.rolesService.findAll();
	}

	@Post()
	create(@Body() dto: CreateRoleDto) {
		return this.rolesService.create(dto);
	}

	@Post(":id/permissions")
	updatePermissions(
		@Param("id", new ParseUUIDPipe()) roleId: string,
		@Body() dto: UpdateRolePermissionsDto,
	) {
		return this.rolesService.updatePermissions(roleId, dto);
	}
}