import { apiEndpoints, baseApi } from "../../../shared/api/index.ts";
import type { Role } from "./roles.types.ts";

export const rolesService = {
	list: async (): Promise<Role[]> => {
		const { data } = await baseApi.get<Role[]>(apiEndpoints.roles.list);
		return data;
	},
};
