import type {
	AxiosError,
	AxiosInstance,
	InternalAxiosRequestConfig,
} from "axios";
import type {
	AuthInterceptorCallbacks,
	AuthRefreshResponse,
} from "../types.ts";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
	_retry?: boolean;
};

export const createResponseInterceptor = (
	api: AxiosInstance,
	{ setAccessToken, onAuthFailed }: AuthInterceptorCallbacks,
) => async (error: AxiosError<unknown>) => {
	const originalRequest = error.config as RetryableRequestConfig | undefined;

	if (
		error.response?.status !== 401 ||
		!originalRequest ||
		originalRequest._retry
	) {
		return Promise.reject(error);
	}

	originalRequest._retry = true;

	try {
		const refreshConfig = { _retry: true } as RetryableRequestConfig;
		const { data } = await api.post<AuthRefreshResponse>(
			"/auth/refresh",
			undefined,
			refreshConfig,
		);
		setAccessToken(data.accessToken);
		originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

		return api(originalRequest);
	} catch (refreshError) {
		onAuthFailed();

		return Promise.reject(refreshError);
	}
};
