import { AuthShell } from "../features/auth/components/AuthShell.tsx";
import { LoginForm } from "../features/auth/components/LoginForm.tsx";

export const LoginPage = () => (
	<AuthShell title="Welcome back">
		<LoginForm />
	</AuthShell>
);