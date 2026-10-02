import type { Role } from "@/features/roles/api/roles.types.ts";

export type User = {
	id: string;
	email: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
	roles: Role[];
};

export type UsersResponse = {
	data: User[];
	meta: {
		page: number;
		pageSize: number;
		total: number;
		totalPages: number;
	};
};

export type UpdateUserDto = {
	userId: string;
	email: string;
};

export type UpdateUserStatusDto = {
	userId: string;
	isActive: boolean;
};

export type UserRoleDto = {
	userId: string;
	roleId: string;
};
