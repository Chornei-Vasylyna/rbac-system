import { RoleList } from "../features/roles/components/RoleList.tsx";

export const AdminRolesPage = () => (
	<section>
		<p>Administration</p>
		<h1>Roles</h1>
		<p>Available roles and their permission sets.</p>
		<RoleList />
	</section>
);