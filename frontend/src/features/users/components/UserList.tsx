import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useUsersQuery } from "../api/users.queries.ts";
import { usersKeys } from "../api/users.keys.ts";
import { usersService } from "../api/users.service.ts";
import { useRolesQuery } from "../../roles/api/roles.queries.ts";

export const UserList = () => {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const { data, isLoading, error } = useUsersQuery(page, search);
	const rolesQuery = useRolesQuery();
	const queryClient = useQueryClient();
	const statusMutation = useMutation({
		mutationFn: ({ userId, isActive }: { userId: string; isActive: boolean }) =>
			usersService.updateStatus(userId, isActive),
		onSuccess: () => {
				void queryClient.invalidateQueries({ queryKey: usersKeys.all });
			},
		onError: (mutationError) => toast.error(mutationError.message),
	});
	const assignRoleMutation = useMutation({
		mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) =>
			usersService.assignRole(userId, roleId),
		onSuccess: () => {
				void queryClient.invalidateQueries({ queryKey: usersKeys.all });
			},
		onError: (mutationError) => toast.error(mutationError.message),
	});
	const removeRoleMutation = useMutation({
		mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) =>
			usersService.removeRole(userId, roleId),
		onSuccess: () => {
				void queryClient.invalidateQueries({ queryKey: usersKeys.all });
			},
		onError: (mutationError) => toast.error(mutationError.message),
	});

	return (
		<>
			{isLoading && <p>Loading users...</p>}
			{error && <p>Could not load users.</p>}
			<input
				aria-label="Search users by email"
				onChange={(event) => {
					setPage(1);
					setSearch(event.target.value);
				}}
				placeholder="Search by email"
				value={search}
			/>
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
							{user.roles.map((role) => (
								<button
									disabled={removeRoleMutation.isPending}
									key={role.id}
									onClick={() => removeRoleMutation.mutate({ userId: user.id, roleId: role.id })}
									type="button"
								>
									Remove {role.name}
								</button>
							))}
					</div>
				))}
			</div>
			{data && data.meta.totalPages > 1 && (
				<div>
					<button disabled={page === 1} onClick={() => setPage((current) => current - 1)} type="button">Previous</button>
					<span>Page {data.meta.page} of {data.meta.totalPages}</span>
					<button disabled={page === data.meta.totalPages} onClick={() => setPage((current) => current + 1)} type="button">Next</button>
				</div>
			)}
		</>
	);
};
