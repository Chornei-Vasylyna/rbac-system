import { useMutation } from "@tanstack/react-query";
import { rolesService } from "@/features/roles/api/roles.service.ts";
import type {
	CreateRoleDto,
	Role,
	UpdateRoleDto,
	UpdateRolePermissionsDto,
} from "@/features/roles/api/roles.types.ts";

export type {
	CreateRoleDto,
	UpdateRoleDto,
	UpdateRolePermissionsDto,
} from "@/features/roles/api/roles.types.ts";

export const useCreateRoleMutation = () =>
	useMutation<Role, Error, CreateRoleDto>({
		mutationFn: rolesService.create,
	});

export const useUpdateRoleMutation = () =>
	useMutation<Role, Error, UpdateRoleDto>({
		mutationFn: rolesService.update,
	});

export const useUpdateRolePermissionsMutation = () =>
	useMutation<Role, Error, UpdateRolePermissionsDto>({
		mutationFn: rolesService.updatePermissions,
	});

export const useRemoveRoleMutation = () =>
	useMutation<void, Error, string>({
		mutationFn: rolesService.remove,
	});
