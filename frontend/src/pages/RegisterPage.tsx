import { AuthShell } from "@/features/auth/components/AuthShell.tsx";
import { RegisterForm } from "@/features/auth/components/RegisterForm.tsx";

export const RegisterPage = () => (
	<AuthShell title="Create your account">
		<RegisterForm />
	</AuthShell>
);
