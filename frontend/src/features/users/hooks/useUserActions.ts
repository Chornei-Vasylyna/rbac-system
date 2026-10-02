import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usersKeys } from "@/features/users/api/users.keys.ts";
import {
	useAssignUserRoleMutation,
	useRemoveUserRoleMutation,
	useUpdateUserMutation,
	useUpdateUserStatusMutation,
} from "@/features/users/api/users.mutations.ts";
import type {
	UpdateUserDto,
	UpdateUserStatusDto,
	UserRoleDto,
} from "@/features/users/api/users.types.ts";
import { getApiErrorMessage } from "@/shared/api/getApiErrorMessage.ts";

type UserActionOptions = {
	onUpdateSuccess?: () => void;
};

export const useUserActions = ({
	onUpdateSuccess,
}: UserActionOptions = {}) => {
	const queryClient = useQueryClient();
	const updateMutation = useUpdateUserMutation();
	const statusMutation = useUpdateUserStatusMutation();
	const assignRoleMutation = useAssignUserRoleMutation();
	const removeRoleMutation = useRemoveUserRoleMutation();

	const invalidateUsers = () =>
		queryClient.invalidateQueries({ queryKey: usersKeys.all });

	const runMutation = async <TPayload>(
		mutation: {
			mutateAsync: (payload: TPayload) => Promise<unknown>;
		},
		payload: TPayload,
		fallbackMessage: string,
	): Promise<boolean> => {
		try {
			await mutation.mutateAsync(payload);
			await invalidateUsers();
			return true;
		} catch (error) {
			toast.error(getApiErrorMessage(error, fallbackMessage));
			return false;
		}
	};

	const handleUpdate = async (payload: UpdateUserDto) => {
		const succeeded = await runMutation(
			updateMutation,
			payload,
			"Could not update user.",
		);
		if (succeeded) {
			onUpdateSuccess?.();
		}
	};

	const handleStatusChange = (payload: UpdateUserStatusDto) =>
		runMutation(statusMutation, payload, "Could not update user status.");

	const handleAssignRole = (payload: UserRoleDto) =>
		runMutation(assignRoleMutation, payload, "Could not assign user role.");

	const handleRemoveRole = (payload: UserRoleDto) =>
		runMutation(removeRoleMutation, payload, "Could not remove user role.");

	return {
		handleAssignRole,
		handleRemoveRole,
		handleStatusChange,
		handleUpdate,
		isAssigningRole: assignRoleMutation.isPending,
		isRemovingRole: removeRoleMutation.isPending,
		isUpdating: updateMutation.isPending,
		isUpdatingStatus: statusMutation.isPending,
	};
};
