import { create } from "zustand";
import { authService } from "@/features/auth/api/auth.service.ts";
import type { AuthUser } from "@/features/auth/api/auth.types.ts";

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
			const data = await authService.refresh();
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
