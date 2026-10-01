export type AuthUser = {
	id: string;
	email: string;
	roles: string[];
	permissions: string[];
};

export type LoginCredentials = {
	email: string;
	password: string;
};

export type RegisterCredentials = {
	fullName: string;
	email: string;
	password: string;
};

export type AuthResponse = {
	accessToken: string;
	user: AuthUser;
};

export type AuthRefreshResponse = AuthResponse;
