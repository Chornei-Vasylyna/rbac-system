import { apiEndpoints, baseApi } from "../../../shared/api/index.ts";
import type { User } from "./users.types.ts";

export const usersService = {
	list: async (): Promise<User[]> => {
		const { data } = await baseApi.get<User[]>(apiEndpoints.users.list);
		return data;
	},
};
