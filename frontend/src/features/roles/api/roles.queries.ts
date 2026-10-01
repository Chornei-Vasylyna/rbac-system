import { useQuery } from "@tanstack/react-query";
import { rolesKeys } from "./roles.keys.ts";
import { rolesService } from "./roles.service.ts";
import type { Role } from "./roles.types.ts";

export const useRolesQuery = () =>
	useQuery<Role[], Error>({
		queryKey: rolesKeys.list,
		queryFn: rolesService.list,
	});
