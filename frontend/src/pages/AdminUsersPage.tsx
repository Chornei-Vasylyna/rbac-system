import { UserList } from "@/features/users/components/UserList.tsx";

export const AdminUsersPage = () => (
	<section className="space-y-5">
		<header>
			<p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
				Administration
			</p>
			<h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
				Users
			</h1>
			<p className="mt-1 text-sm text-slate-500">
				Review accounts and their current access state.
			</p>
		</header>
		<UserList />
	</section>
);
