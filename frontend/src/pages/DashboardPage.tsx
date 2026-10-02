import { useAuthStore } from "@/features/auth/model/authStore.ts";
import { AccessSummary } from "@/features/dashboard/components/AccessSummary.tsx";

export const DashboardPage = () => {
	const user = useAuthStore((state) => state.user);

	if (!user) return null;

	return (
		<section className="space-y-6">
			<header>
				<p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
					Workspace
				</p>
				<h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
					Your access, at a glance
				</h1>
				<p className="mt-1 text-sm text-slate-500">
					Signed in as{" "}
					<strong className="font-medium text-slate-700">{user.email}</strong>.
					Review your current access scope.
				</p>
			</header>
			<AccessSummary user={user} />
		</section>
	);
};
