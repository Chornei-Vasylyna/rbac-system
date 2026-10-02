import { useMutation } from "@tanstack/react-query";
import { usersService } from "@/features/users/api/users.service.ts";
import type {
	UpdateUserDto,
	UpdateUserStatusDto,
	UserRoleDto,
} from "@/features/users/api/users.types.ts";

export const useUpdateUserMutation = () => {
	return useMutation<void, Error, UpdateUserDto>({
		mutationFn: usersService.update,
	});
};

export const useUpdateUserStatusMutation = () => {
	return useMutation<void, Error, UpdateUserStatusDto>({
		mutationFn: usersService.updateStatus,
	});
};

export const useAssignUserRoleMutation = () => {
	return useMutation<void, Error, UserRoleDto>({
		mutationFn: usersService.assignRole,
	});
};

export const useRemoveUserRoleMutation = () => {
	return useMutation<void, Error, UserRoleDto>({
		mutationFn: usersService.removeRole,
	});
};
