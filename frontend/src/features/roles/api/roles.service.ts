import type {
	CreateRoleDto,
	Permission,
	Role,
	UpdateRoleDto,
	UpdateRolePermissionsDto,
} from "@/features/roles/api/roles.types.ts";
import { apiEndpoints, baseApi } from "@/shared/api/index.ts";

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
	updatePermissions: async ({
		roleId,
		permissionIds,
	}: UpdateRolePermissionsDto): Promise<Role> => {
		const { data } = await baseApi.post<Role>(
			apiEndpoints.roles.permissions(roleId),
			{ permissionIds },
		);
		return data;
	},
	create: async ({ name, description }: CreateRoleDto): Promise<Role> => {
		const { data } = await baseApi.post<Role>(apiEndpoints.roles.create, {
			name,
			description: description || undefined,
		});
		return data;
	},
	update: async ({
		roleId,
		name,
		description,
	}: UpdateRoleDto): Promise<Role> => {
		const { data } = await baseApi.patch<Role>(
			apiEndpoints.roles.update(roleId),
			{
				name,
				description: description || undefined,
			},
		);
		return data;
	},
	remove: async (roleId: string) => {
		await baseApi.delete(apiEndpoints.roles.remove(roleId));
	},
};
