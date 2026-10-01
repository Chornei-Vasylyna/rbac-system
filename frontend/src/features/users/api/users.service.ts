import { apiEndpoints, baseApi } from "../../../shared/api/index.ts";
import type { UsersResponse } from "./users.types.ts";

export const usersService = {
	list: async (page = 1, search = ""): Promise<UsersResponse> => {
		const { data } = await baseApi.get<UsersResponse>(apiEndpoints.users.list, {
			params: { page, pageSize: 10, ...(search ? { search } : {}) },
		});
		return data;
	},
	update: async (userId: string, email: string, fullName: string) => {
		await baseApi.patch(apiEndpoints.users.update(userId), {
			email,
			fullName: fullName || null,
		});
	},
	assignRole: async (userId: string, roleId: string) => {
		await baseApi.post(apiEndpoints.users.assignRole(userId), { roleId });
	},
	removeRole: async (userId: string, roleId: string) => {
		await baseApi.delete(apiEndpoints.users.removeRole(userId, roleId));
	},
	updateStatus: async (userId: string, isActive: boolean) => {
		await baseApi.patch(apiEndpoints.users.updateStatus(userId), { isActive });
	},
};
