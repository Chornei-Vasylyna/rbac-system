import { useQuery } from "@tanstack/react-query";
import { rolesKeys } from "@/features/roles/api/roles.keys.ts";
import { rolesService } from "@/features/roles/api/roles.service.ts";
import type { Permission, Role } from "@/features/roles/api/roles.types.ts";

export const useRolesQuery = (enabled = true) =>
	useQuery<Role[], Error>({
		queryKey: rolesKeys.list,
		queryFn: rolesService.list,
		enabled,
	});

export const usePermissionsQuery = () =>
	useQuery<Permission[], Error>({
		queryKey: rolesKeys.permissions,
		queryFn: rolesService.listPermissions,
	});
