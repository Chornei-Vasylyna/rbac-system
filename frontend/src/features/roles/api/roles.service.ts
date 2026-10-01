import { apiEndpoints, baseApi } from "../../../shared/api/index.ts";
import type { Permission, Role } from "./roles.types.ts";

export const rolesService = {
	list: async (): Promise<Role[]> => {
		const { data } = await baseApi.get<Role[]>(apiEndpoints.roles.list);
		return data;
	},
	listPermissions: async (): Promise<Permission[]> => {
		const { data } = await baseApi.get<Permission[]>(
			apiEndpoints.roles.permissionsList,
		);
		return data;
	},
	updatePermissions: async (roleId: string, permissionIds: string[]) => {
		const { data } = await baseApi.post<Role>(
			apiEndpoints.roles.permissions(roleId),
			{ permissionIds },
		);
		return data;
	},
	create: async (name: string, description: string) => {
		const { data } = await baseApi.post<Role>(apiEndpoints.roles.create, {
			name,
			description: description || undefined,
		});
		return data;
	},
	remove: async (roleId: string) => {
		await baseApi.delete(apiEndpoints.roles.remove(roleId));
	},
};
