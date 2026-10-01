import type { Role } from "../../roles/api/roles.types.ts";

export type User = {
	id: string;
	email: string;
	fullName: string | null;
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
