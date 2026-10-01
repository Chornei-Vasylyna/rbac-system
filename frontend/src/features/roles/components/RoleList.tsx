import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { usePermissionsQuery, useRolesQuery } from "../api/roles.queries.ts";
import { rolesKeys } from "../api/roles.keys.ts";
import { rolesService } from "../api/roles.service.ts";
import { EditRoleForm } from "./EditRoleForm.tsx";

export const RoleList = () => {
	const { data, isLoading, error } = useRolesQuery();
	const permissionsQuery = usePermissionsQuery();
	const queryClient = useQueryClient();
	const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
	const [editingDetailsRoleId, setEditingDetailsRoleId] = useState<string | null>(null);
	const { register, handleSubmit, reset } = useForm<{ permissionIds: string[] }>({
		defaultValues: { permissionIds: [] },
	});
	const updateRoleMutation = useMutation({
		mutationFn: ({ roleId, name, description }: { roleId: string; name: string; description: string }) =>
			rolesService.update(roleId, name, description),
		onError: (mutationError) => toast.error(mutationError.message),
		onSuccess: () => {
			setEditingDetailsRoleId(null);
			void queryClient.invalidateQueries({ queryKey: rolesKeys.list });
		},
	});
	const updateMutation = useMutation({
		mutationFn: ({ roleId, permissionIds }: { roleId: string; permissionIds: string[] }) =>
			rolesService.updatePermissions(roleId, permissionIds),
		onError: (mutationError) => toast.error(mutationError.message),
		onSuccess: () => {
				setEditingRoleId(null);
				void queryClient.invalidateQueries({ queryKey: rolesKeys.list });
			},
	});
	const removeMutation = useMutation({
		mutationFn: rolesService.remove,
		onError: (mutationError) => toast.error(mutationError.message),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: rolesKeys.list });
		},
	});

	return (
		<>
			{isLoading && <p>Loading roles...</p>}
			{error && <p>Could not load roles.</p>}
			<div>
				{data?.map((role) => (
					<div key={role.id}>
						<div>
							<strong>{role.name}</strong>
							<span>
								{role.permissions.length
									? role.permissions.map((permission) => permission.slug).join(", ")
									: "No permissions"}
							</span>
						</div>
						<span>{role.permissions.length} permissions</span>
						<button
							type="button"
							onClick={() => {
								setEditingRoleId(role.id);
								reset({
									permissionIds: role.permissions.map((permission) => permission.id),
								});
							}}
						>
							Edit permissions
						</button>
						<button
							onClick={() => setEditingDetailsRoleId(role.id)}
							type="button"
						>
							Edit role
						</button>
						<button
							disabled={removeMutation.isPending}
							onClick={() => {
								if (window.confirm(`Delete role ${role.name}?`)) {
									removeMutation.mutate(role.id);
								}
							}}
							type="button"
						>
							Delete role
						</button>
						{editingRoleId === role.id && (
							<form onSubmit={handleSubmit(({ permissionIds }) => updateMutation.mutate({ roleId: role.id, permissionIds }))}>
								{permissionsQuery.data?.map((permission) => (
									<label key={permission.id}>
										<input
											type="checkbox"
											value={permission.id}
											{...register("permissionIds")}
										/>
										{permission.slug}
									</label>
								))}
								<button disabled={updateMutation.isPending} type="submit">
									{updateMutation.isPending ? "Saving..." : "Save permissions"}
								</button>
							</form>
						)}
						{editingDetailsRoleId === role.id && (
							<EditRoleForm
								isPending={updateRoleMutation.isPending}
								onCancel={() => setEditingDetailsRoleId(null)}
								onSubmit={({ name, description }) =>
									updateRoleMutation.mutate({ roleId: role.id, name, description })
								}
								role={role}
							/>
						)}
					</div>
				))}
			</div>
		</>
	);
};
