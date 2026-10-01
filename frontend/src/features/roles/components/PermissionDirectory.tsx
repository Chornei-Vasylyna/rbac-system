import { usePermissionsQuery } from "../api/roles.queries.ts";

export const PermissionDirectory = () => {
	const { data, isLoading, error } = usePermissionsQuery();

	return (
		<section>
			<h2>Access permissions directory</h2>
			<p>System permissions available for assignment to roles.</p>
			{isLoading && <p>Loading permissions...</p>}
			{error && <p>Could not load permissions.</p>}
			{data?.map((permission) => (
				<div key={permission.id}>
					<strong>{permission.description ?? permission.slug}</strong>
					<span>{permission.slug}</span>
					{permission.description && <p>{permission.description}</p>}
				</div>
			))}
		</section>
	);
};