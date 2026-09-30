import { create } from "zustand";
import type { AxiosRequestConfig } from "axios";
import { baseApi } from "../../../shared/api/client.ts";

export type AuthUser = {
	id: string;
	email: string;
	roles: string[];
};

type AuthRefreshResponse = {
	accessToken: string;
	user: AuthUser;
};

type AuthState = {
	user: AuthUser | null;
	accessToken: string | null;
	isAuthenticated: boolean;
	isInitialized: boolean;
	setAuth: (user: AuthUser, token: string) => void;
	clearAuth: () => void;
	setAccessToken: (token: string) => void;
	checkAuth: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	accessToken: null,
	isAuthenticated: false,
	isInitialized: false,
	setAuth: (user, accessToken) =>
		set({ user, accessToken, isAuthenticated: true }),
	clearAuth: () =>
		set({ user: null, accessToken: null, isAuthenticated: false }),
	setAccessToken: (accessToken) => set({ accessToken }),
	checkAuth: async () => {
		try {
			const refreshConfig = { _retry: true } as AxiosRequestConfig & {
				_retry: boolean;
			};
			const { data } = await baseApi.post<AuthRefreshResponse>(
				"/auth/refresh",
				undefined,
				refreshConfig,
			);
			set({
				user: data.user,
				accessToken: data.accessToken,
				isAuthenticated: true,
			});
		} catch {
			set({ user: null, accessToken: null, isAuthenticated: false });
		} finally {
			set({ isInitialized: true });
		}
	},
}));