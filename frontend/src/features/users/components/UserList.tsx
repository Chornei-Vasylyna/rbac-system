import { useUsersQuery } from "../api/users.queries.ts";

export const UserList = () => {
	const { data, isLoading, error } = useUsersQuery();

	return (
		<>
			{isLoading && <p>Loading users...</p>}
			{error && <p>Could not load users.</p>}
			<div>
				{data?.map((user) => (
					<div key={user.id}>
						<div><strong>{user.email}</strong><span>{user.roles?.join(", ") || "No roles"}</span></div>
						<span>{user.isActive === false ? "Inactive" : "Active"}</span>
					</div>
				))}
			</div>
		</>
	);
};
