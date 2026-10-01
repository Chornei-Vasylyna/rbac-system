import { UserList } from "../features/users/components/UserList.tsx";

export const AdminUsersPage = () => (
	<section>
		<p>Administration</p>
		<h1>Users</h1>
		<p>Review accounts and their current access state.</p>
		<UserList />
	</section>
);