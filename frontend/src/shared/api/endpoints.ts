export const apiEndpoints = {
	auth: {
		register: "/auth/register",
		login: "/auth/login",
		refresh: "/auth/refresh",
		logout: "/auth/logout",
	},
	roles: {
		list: "/roles",
		permissionsList: "/roles/permissions",
		create: "/roles",
		permissions: (roleId: string) => `/roles/${roleId}/permissions`,
		update: (roleId: string) => `/roles/${roleId}`,
		remove: (roleId: string) => `/roles/${roleId}`,
	},
	users: {
		list: "/users",
		assignRole: (userId: string) => `/users/${userId}/roles`,
		removeRole: (userId: string, roleId: string) =>
			`/users/${userId}/roles/${roleId}`,
		updateStatus: (userId: string) => `/users/${userId}/status`,
	},
};