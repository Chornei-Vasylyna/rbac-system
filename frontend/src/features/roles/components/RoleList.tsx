import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePermissionsQuery, useRolesQuery } from "../api/roles.queries.ts";
import { rolesKeys } from "../api/roles.keys.ts";
import { rolesService } from "../api/roles.service.ts";

export const RoleList = () => {
	const { data, isLoading, error } = useRolesQuery();
	const permissionsQuery = usePermissionsQuery();
	const queryClient = useQueryClient();
	const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
	const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([]);
	const updateMutation = useMutation({
		mutationFn: ({ roleId, permissionIds }: { roleId: string; permissionIds: string[] }) =>
			rolesService.updatePermissions(roleId, permissionIds),
		onSuccess: () => {
				setEditingRoleId(null);
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
								setSelectedPermissionIds(role.permissions.map((permission) => permission.id));
							}}
						>
							Edit permissions
						</button>
						{editingRoleId === role.id && (
							<form
								onSubmit={(event) => {
									event.preventDefault();
									updateMutation.mutate({ roleId: role.id, permissionIds: selectedPermissionIds });
								}}
							>
								{permissionsQuery.data?.map((permission) => (
									<label key={permission.id}>
										<input
											type="checkbox"
											checked={selectedPermissionIds.includes(permission.id)}
											onChange={(event) => {
												setSelectedPermissionIds((current) =>
													event.target.checked
														? [...current, permission.id]
														: current.filter((id) => id !== permission.id),
											);
											}}
										/>
										{permission.slug}
									</label>
								))}
								<button disabled={updateMutation.isPending} type="submit">
									{updateMutation.isPending ? "Saving..." : "Save permissions"}
								</button>
							</form>
						)}
					</div>
				))}
			</div>
		</>
	);
};
