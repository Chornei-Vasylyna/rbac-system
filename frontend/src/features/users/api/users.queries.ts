import { useQuery } from "@tanstack/react-query";
import { usersKeys } from "@/features/users/api/users.keys.ts";
import { usersService } from "@/features/users/api/users.service.ts";
import type { UsersResponse } from "@/features/users/api/users.types.ts";

export const useUsersQuery = (page: number, search: string) =>
	useQuery<UsersResponse, Error>({
		queryKey: usersKeys.list(page, search),
		queryFn: () => usersService.list(page, search),
	});
