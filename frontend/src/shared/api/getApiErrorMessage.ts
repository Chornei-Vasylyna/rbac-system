import axios from "axios";

type ApiErrorResponse = {
	message?: unknown;
};

export const getApiErrorMessage = (error: unknown, fallback: string) => {
	if (!axios.isAxiosError<ApiErrorResponse>(error)) return fallback;

	const message = error.response?.data?.message;
	return typeof message === "string" ? message : fallback;
};
