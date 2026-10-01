import { useQuery } from "@tanstack/react-query";
import { usersKeys } from "./users.keys.ts";
import { usersService } from "./users.service.ts";
import type { UsersResponse } from "./users.types.ts";

export const useUsersQuery = () =>
	useQuery<UsersResponse, Error>({
		queryKey: usersKeys.list,
		queryFn: usersService.list,
	});
