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
