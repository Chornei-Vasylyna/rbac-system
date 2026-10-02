import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { rolesKeys } from "@/features/roles/api/roles.keys.ts";
import {
	useCreateRoleMutation,
	useRemoveRoleMutation,
	useUpdateRoleMutation,
	useUpdateRolePermissionsMutation,
} from "@/features/roles/api/roles.mutations.ts";
import type {
	CreateRoleDto,
	UpdateRoleDto,
	UpdateRolePermissionsDto,
} from "@/features/roles/api/roles.types.ts";
import { getApiErrorMessage } from "@/shared/api/getApiErrorMessage.ts";

type RoleActionOptions = {
	onCreateSuccess?: () => void;
	onUpdateSuccess?: () => void;
};

export const useRoleActions = ({
	onCreateSuccess,
	onUpdateSuccess,
}: RoleActionOptions = {}) => {
	const queryClient = useQueryClient();
	const createMutation = useCreateRoleMutation();
	const updateMutation = useUpdateRoleMutation();
	const updatePermissionsMutation = useUpdateRolePermissionsMutation();
	const removeMutation = useRemoveRoleMutation();

	const invalidateRoles = () =>
		queryClient.invalidateQueries({ queryKey: rolesKeys.all });

	const handleCreate = async (
		payload: CreateRoleDto & Pick<UpdateRolePermissionsDto, "permissionIds">,
	) => {
		try {
			const role = await createMutation.mutateAsync(payload);
			if (payload.permissionIds.length) {
				await updatePermissionsMutation.mutateAsync({
					roleId: role.id,
					permissionIds: payload.permissionIds,
				});
			}
			await invalidateRoles();
			onCreateSuccess?.();
			return true;
		} catch (error) {
			toast.error(getApiErrorMessage(error, "Could not create role."));
			return false;
		}
	};

	const handleUpdate = async (
		payload: UpdateRoleDto & Pick<UpdateRolePermissionsDto, "permissionIds">,
	) => {
		try {
			await updateMutation.mutateAsync(payload);
			await updatePermissionsMutation.mutateAsync(payload);
			await invalidateRoles();
			onUpdateSuccess?.();
			return true;
		} catch (error) {
			toast.error(getApiErrorMessage(error, "Could not update role."));
			return false;
		}
	};

	const handleRemove = async (roleId: string) => {
		try {
			await removeMutation.mutateAsync(roleId);
			await invalidateRoles();
			return true;
		} catch (error) {
			toast.error(getApiErrorMessage(error, "Could not delete role."));
			return false;
		}
	};

	return {
		handleCreate,
		handleRemove,
		handleUpdate,
		isCreating: createMutation.isPending || updatePermissionsMutation.isPending,
		isDeleting: removeMutation.isPending,
		isUpdating:
			updateMutation.isPending || updatePermissionsMutation.isPending,
	};
};
