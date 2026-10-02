export type Permission = {
	id: string;
	slug: string;
	description: string | null;
};

export type Role = {
	id: string;
	name: string;
	description: string | null;
	permissions: Permission[];
};

export type CreateRoleDto = {
	name: string;
	description: string;
};

export type UpdateRoleDto = CreateRoleDto & {
	roleId: string;
};

export type UpdateRolePermissionsDto = {
	roleId: string;
	permissionIds: string[];
};
