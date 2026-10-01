import { useRolesQuery } from "../api/roles.queries.ts";

export const RoleList = () => {
	const { data, isLoading, error } = useRolesQuery();

	return (
		<>
			{isLoading && <p>Loading roles...</p>}
			{error && <p>Could not load roles.</p>}
			<div>
				{data?.map((role) => (
					<div key={role.id}>
						<div><strong>{role.name}</strong><span>{role.permissions?.join(", ") || "No permissions"}</span></div>
						<span>{role.permissions?.length ?? 0} permissions</span>
					</div>
				))}
			</div>
		</>
	);
};
