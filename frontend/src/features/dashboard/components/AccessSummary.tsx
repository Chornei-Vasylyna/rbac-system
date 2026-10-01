import { Link } from "react-router-dom";
import type { AuthUser } from "../../../shared/types/index.ts";

type AccessSummaryProps = {
	user: AuthUser;
};

export const AccessSummary = ({ user }: AccessSummaryProps) => {
	const isAdmin = user.roles.includes("admin");

	return (
		<div>
			<article><span>Account</span><strong>Active</strong><span>Ready for protected resources</span></article>
			<article><span>Roles</span><strong>{user.roles.length}</strong><span>{user.roles.join(", ")}</span></article>
			{isAdmin && <article><span>Administration</span><strong>Enabled</strong><Link to="/admin/users">Open admin tools</Link></article>}
		</div>
	);
};
