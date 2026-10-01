import { apiEndpoints, baseApi } from "../../../shared/api/index.ts";
import type { UsersResponse } from "./users.types.ts";

export const usersService = {
	list: async (): Promise<UsersResponse> => {
		const { data } = await baseApi.get<UsersResponse>(apiEndpoints.users.list);
		return data;
	},
	assignRole: async (userId: string, roleId: string) => {
		await baseApi.post(apiEndpoints.users.assignRole(userId), { roleId });
	},
	updateStatus: async (userId: string, isActive: boolean) => {
		await baseApi.patch(apiEndpoints.users.updateStatus(userId), { isActive });
	},
};
