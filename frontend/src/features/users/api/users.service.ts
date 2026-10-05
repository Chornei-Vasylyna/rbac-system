import type {
	UpdateUserDto,
	UpdateUserStatusDto,
	UpdatedUser,
	UserRoleDto,
	UsersResponse,
} from "@/features/users/api/users.types.ts";
import { apiEndpoints, baseApi } from "@/shared/api/index.ts";

export const usersService = {
	list: async (page = 1, search = ""): Promise<UsersResponse> => {
		const { data } = await baseApi.get<UsersResponse>(apiEndpoints.users.list, {
			params: { page, pageSize: 5, ...(search ? { search } : {}) },
		});
		return data;
	},

	update: async ({ userId, email }: UpdateUserDto): Promise<UpdatedUser> => {
		const { data } = await baseApi.patch<UpdatedUser>(
			apiEndpoints.users.update(userId),
			{
			email,
			},
		);
		return data;
	},

	assignRole: async ({ userId, roleId }: UserRoleDto): Promise<void> => {
		await baseApi.post(apiEndpoints.users.assignRole(userId), { roleId });
	},

	removeRole: async ({ userId, roleId }: UserRoleDto): Promise<void> => {
		await baseApi.delete(apiEndpoints.users.removeRole(userId, roleId));
	},

	updateStatus: async ({
		userId,
		isActive,
	}: UpdateUserStatusDto): Promise<void> => {
		await baseApi.patch(apiEndpoints.users.updateStatus(userId), { isActive });
	},
};
