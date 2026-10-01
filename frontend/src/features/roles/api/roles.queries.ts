import { useQuery } from "@tanstack/react-query";
import { rolesKeys } from "./roles.keys.ts";
import { rolesService } from "./roles.service.ts";
import type { Permission, Role } from "./roles.types.ts";

export const useRolesQuery = () =>
	useQuery<Role[], Error>({
		queryKey: rolesKeys.list,
		queryFn: rolesService.list,
	});

export const usePermissionsQuery = () =>
	useQuery<Permission[], Error>({
		queryKey: [...rolesKeys.all, "permissions"],
		queryFn: rolesService.listPermissions,
	});
