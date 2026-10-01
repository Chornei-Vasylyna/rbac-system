import type { AxiosInstance } from "axios";
import type { AuthInterceptorCallbacks } from "../types/index.ts";
import { createRequestInterceptor } from "./interceptors/request.ts";
import { createResponseInterceptor } from "./interceptors/response.ts";

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
