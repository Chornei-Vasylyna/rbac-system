import { useAuthStore } from "../features/auth/model/authStore.ts";
import { AccessSummary } from "../features/dashboard/components/AccessSummary.tsx";

export const DashboardPage = () => {
	const user = useAuthStore((state) => state.user);

	if (!user) return null;
    
	return <section><p>Workspace</p><h1>Your access, at a glance.</h1><p>Signed in as <strong>{user.email}</strong>. Your permissions are represented by the roles attached to this account.</p><AccessSummary user={user} /></section>;
};