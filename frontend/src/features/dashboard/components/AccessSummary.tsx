import { Link } from "react-router-dom";
import type { AuthUser } from "../../../shared/types/index.ts";

type AccessSummaryProps = {
	user: AuthUser;
};

export const AccessSummary = ({ user }: AccessSummaryProps) => {
	const canManageUsers = user.permissions.includes("users:read");

	return (
		<div>
			<article><span>Account</span><strong>Active</strong><span>Ready for protected resources</span></article>
			<article><span>Roles</span><strong>{user.roles.length}</strong><span>{user.roles.join(", ")}</span></article>
			{canManageUsers && <article><span>Administration</span><strong>Enabled</strong><Link to="/admin/users">Open admin tools</Link></article>}
		</div>
	);
};
