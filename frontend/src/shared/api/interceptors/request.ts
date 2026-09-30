import type { InternalAxiosRequestConfig } from "axios";

export const createRequestInterceptor = (
	getAccessToken: () => string | null,
) => (config: InternalAxiosRequestConfig) => {
	const accessToken = getAccessToken();

	if (accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`;
	}

	return config;
};
