import { useMutation } from "@tanstack/react-query";
import { authKeys } from "./auth.keys.ts";
import { authService } from "./auth.service.ts";
import type {
	AuthResponse,
	LoginCredentials,
	RegisterCredentials,
} from "./auth.types.ts";

export const useLoginMutation = () =>
	useMutation<AuthResponse, Error, LoginCredentials>({
		mutationKey: authKeys.login,
		mutationFn: authService.login,
	});

export const useRegisterMutation = () =>
	useMutation<AuthResponse, Error, RegisterCredentials>({
		mutationKey: authKeys.register,
		mutationFn: authService.register,
	});

export const useLogoutMutation = () =>
	useMutation<void, Error>({
		mutationKey: authKeys.logout,
		mutationFn: authService.logout,
	});
