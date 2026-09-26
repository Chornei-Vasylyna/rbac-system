export interface AuthenticatedUser {
	id: string;
	email: string;
	roles: string[];
}

export interface JwtPayload {
	sub: string;
	email: string;
	roles: string[];
	type: "access";
}

export interface RefreshTokenPayload {
	sub: string;
	type: "refresh";
	jti: string;
}
