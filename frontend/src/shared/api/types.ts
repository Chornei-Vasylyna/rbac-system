export type AuthRefreshResponse = {
	accessToken: string;
};

export type AuthInterceptorCallbacks = {
	getAccessToken: () => string | null;
	setAccessToken: (accessToken: string) => void;
	onAuthFailed: () => void;
};
