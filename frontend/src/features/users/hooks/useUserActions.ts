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
	UsersResponse,
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

	const handleUpdate = async (
		payload: UpdateUserDto,
	): Promise<void> => {
		try {
			const updatedUser = await updateMutation.mutateAsync(payload);
			await invalidateUsers();
			queryClient.setQueriesData<UsersResponse>(
				{ queryKey: usersKeys.all },
				(current) =>
					current
						? {
								...current,
								data: current.data.map((user) =>
									user.id === updatedUser.id
										? { ...user, email: updatedUser.email }
										: user,
								),
							}
						: current,
			);
			onUpdateSuccess?.();
		} catch (error) {
			const message = getApiErrorMessage(
				error,
				"Could not update user. Please check the email and try again.",
			);
			toast.error(message);
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
