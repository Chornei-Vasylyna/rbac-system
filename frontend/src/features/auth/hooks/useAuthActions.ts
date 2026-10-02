import { toast } from "sonner";
import {
	useLoginMutation,
	useLogoutMutation,
	useRegisterMutation,
} from "@/features/auth/api/auth.mutations.ts";
import type {
	AuthResponse,
	LoginCredentials,
	RegisterCredentials,
} from "@/features/auth/api/auth.types.ts";
import { useAuthStore } from "@/features/auth/model/authStore.ts";
import { getApiErrorMessage } from "@/shared/api/getApiErrorMessage.ts";

export const useAuthActions = () => {
	const setAuth = useAuthStore((state) => state.setAuth);
	const clearAuth = useAuthStore((state) => state.clearAuth);
	
	const loginMutation = useLoginMutation();
	const registerMutation = useRegisterMutation();
	const logoutMutation = useLogoutMutation();

	const handleLogin = async (
		credentials: LoginCredentials,
	): Promise<AuthResponse | null> => {
		try {
			const response = await loginMutation.mutateAsync(credentials);
			setAuth(response.user, response.accessToken);
			return response;
		} catch (error) {
			toast.error(
				getApiErrorMessage(error, "Unable to sign in. Please try again."),
			);
			return null;
		}
	};

	const handleRegister = async (
		credentials: RegisterCredentials,
	): Promise<boolean> => {
		try {
			await registerMutation.mutateAsync(credentials);
			toast.success("Account created. You can sign in now.");
			return true;
		} catch (error) {
			toast.error(getApiErrorMessage(error, "Could not create the account."));
			return false;
		}
	};

	const handleLogout = async (): Promise<boolean> => {
		try {
			await logoutMutation.mutateAsync();
			return true;
		} catch (error) {
			toast.error(getApiErrorMessage(error, "Could not log out. Please try again."));
			return false;
		} finally {
			clearAuth();
		}
	};

	return {
		handleLogin,
		handleLogout,
		handleRegister,
		isLoggingIn: loginMutation.isPending,
		isLoggingOut: logoutMutation.isPending,
		isRegistering: registerMutation.isPending,
	};
};
