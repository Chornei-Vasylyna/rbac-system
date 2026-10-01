import type {
	AxiosError,
	AxiosInstance,
	AxiosRequestConfig,
	InternalAxiosRequestConfig,
} from "axios";
import type {
	AuthInterceptorCallbacks,
	AuthRefreshResponse,
} from "../../types/index.ts";
import { apiEndpoints } from "../endpoints.ts";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
	_retry?: boolean;
};

export const createResponseInterceptor = (
	api: AxiosInstance,
	{ setAccessToken, onAuthFailed }: AuthInterceptorCallbacks,
) => async (error: AxiosError<unknown>) => {
	const originalRequest: RetryableRequestConfig | undefined = error.config;

	if (
		error.response?.status !== 401 ||
		!originalRequest ||
		originalRequest._retry
	) {
		return Promise.reject(error);
	}

	originalRequest._retry = true;

	try {
		const refreshConfig: AxiosRequestConfig & { _retry: boolean } = {
			_retry: true,
		};
		const { data } = await api.post<AuthRefreshResponse>(
			apiEndpoints.auth.refresh,
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
