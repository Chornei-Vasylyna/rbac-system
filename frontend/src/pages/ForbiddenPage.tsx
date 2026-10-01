import { Link } from "react-router-dom";
import { AuthShell } from "../features/auth/components/AuthShell.tsx";

export const ForbiddenPage = () => (
	<AuthShell title="403 - Access denied">
		<p>You do not have permission to view this area.</p>
		<Link to="/">Back home</Link>
	</AuthShell>
);