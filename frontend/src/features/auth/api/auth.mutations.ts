import { useMutation } from "@tanstack/react-query";
import { authService } from "@/features/auth/api/auth.service.ts";
import type {
	AuthResponse,
	LoginCredentials,
	RegisterCredentials,
} from "@/features/auth/api/auth.types.ts";

export const useLoginMutation = () =>
	useMutation<AuthResponse, Error, LoginCredentials>({
		mutationFn: authService.login,
	});

export const useRegisterMutation = () =>
	useMutation<AuthResponse, Error, RegisterCredentials>({
		mutationFn: authService.register,
	});

export const useLogoutMutation = () =>
	useMutation<void, Error>({
		mutationFn: authService.logout,
	});
