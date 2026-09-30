import type { AxiosInstance } from "axios";
import { createRequestInterceptor } from "./interceptors/request.ts";
import { createResponseInterceptor } from "./interceptors/response.ts";
import type { AuthInterceptorCallbacks } from "./types.ts";

export const setupInterceptors = (
	api: AxiosInstance,
	callbacks: AuthInterceptorCallbacks,
) => {
	api.interceptors.request.use(
		createRequestInterceptor(callbacks.getAccessToken),
	);
	api.interceptors.response.use(
		(response) => response,
		createResponseInterceptor(api, callbacks),
	);
};
