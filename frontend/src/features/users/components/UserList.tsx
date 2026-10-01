import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUsersQuery } from "../api/users.queries.ts";
import { usersKeys } from "../api/users.keys.ts";
import { usersService } from "../api/users.service.ts";
import { useRolesQuery } from "../../roles/api/roles.queries.ts";

export const UserList = () => {
	const { data, isLoading, error } = useUsersQuery();
	const rolesQuery = useRolesQuery();
	const queryClient = useQueryClient();
	const statusMutation = useMutation({
		mutationFn: ({ userId, isActive }: { userId: string; isActive: boolean }) =>
			usersService.updateStatus(userId, isActive),
		onSuccess: () => {
				void queryClient.invalidateQueries({ queryKey: usersKeys.list });
			},
	});
	const assignRoleMutation = useMutation({
		mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) =>
			usersService.assignRole(userId, roleId),
		onSuccess: () => {
				void queryClient.invalidateQueries({ queryKey: usersKeys.list });
			},
	});

	return (
		<>
			{isLoading && <p>Loading users...</p>}
			{error && <p>Could not load users.</p>}
			<div>
				{data?.data.map((user) => (
					<div key={user.id}>
							<div>
								<strong>{user.email}</strong>
								<span>
									{user.roles.length
										? user.roles.map((role) => role.name).join(", ")
										: "No roles"}
								</span>
							</div>
							<span>{user.isActive ? "Active" : "Inactive"}</span>
							<button
								disabled={statusMutation.isPending}
								onClick={() => statusMutation.mutate({ userId: user.id, isActive: !user.isActive })}
								type="button"
							>
								{user.isActive ? "Deactivate" : "Activate"}
							</button>
							<select
								defaultValue=""
								disabled={assignRoleMutation.isPending}
								onChange={(event) => {
									if (event.target.value) {
										assignRoleMutation.mutate({ userId: user.id, roleId: event.target.value });
									}
								}}
							>
								<option value="">Assign role</option>
								{rolesQuery.data?.map((role) => (
									<option key={role.id} value={role.id}>{role.name}</option>
								))}
							</select>
					</div>
				))}
			</div>
		</>
	);
};
