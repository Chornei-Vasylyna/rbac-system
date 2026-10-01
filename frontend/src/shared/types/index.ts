export type AuthUser = {
	id: string;
	email: string;
	roles: string[];
};

export type AuthResponse = {
	accessToken: string;
	user: AuthUser;
};

export type AuthRefreshResponse = AuthResponse;

export type AuthInterceptorCallbacks = {
	getAccessToken: () => string | null;
	setAccessToken: (accessToken: string) => void;
	onAuthFailed: () => void;
};

export type Role = {
	id: string;
	name: string;
	permissions?: string[];
};

export type User = {
	id: string;
	email: string;
	roles?: string[];
	isActive?: boolean;
};