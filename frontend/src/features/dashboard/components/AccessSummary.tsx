import { Link } from "react-router-dom";
import type { AuthUser } from "@/shared/types/index.ts";

type AccessSummaryProps = {
	user: AuthUser;
};

export const AccessSummary = ({ user }: AccessSummaryProps) => {
	const canManageUsers = user.permissions.includes("users:read");

	return (
		<div className="grid gap-4 md:grid-cols-3">
			<article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
				<span className="text-xs font-medium text-slate-500">Account</span>
				<strong className="mt-3 block text-xl font-semibold text-slate-950">
					Active
				</strong>
				<span className="mt-1 block text-xs text-slate-500">
					Ready for protected resources
				</span>
			</article>
			<article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
				<span className="text-xs font-medium text-slate-500">
					Assigned roles
				</span>
				<strong className="mt-3 block text-xl font-semibold text-slate-950">
					{user.roles.length}
				</strong>
				<span className="mt-1 block text-xs text-slate-500">
					{user.roles.join(", ") || "No roles assigned"}
				</span>
			</article>
			{canManageUsers && (
				<article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
					<span className="text-xs font-medium text-slate-500">
						Administration
					</span>
					<strong className="mt-3 block text-xl font-semibold text-slate-950">
						Enabled
					</strong>
					<Link
						className="mt-2 inline-block text-xs font-medium text-slate-700 hover:underline"
						to="/admin/users"
					>
						Open admin tools
					</Link>
				</article>
			)}
		</div>
	);
};
