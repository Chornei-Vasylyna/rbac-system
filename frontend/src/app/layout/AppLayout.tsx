import {
	BookOpen,
	LayoutDashboard,
	LogOut,
	ShieldCheck,
	Users,
} from "lucide-react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthActions } from "@/features/auth/hooks/useAuthActions.ts";
import { useAuthStore } from "@/features/auth/model/authStore.ts";

export const AppLayout = () => {
	const navigate = useNavigate();
	const { user } = useAuthStore();
	const { handleLogout: logoutAction, isLoggingOut } = useAuthActions();
	const canReadUsers = user?.permissions.includes("users:read") ?? false;
	const canManageRoles = user?.permissions.includes("roles:manage") ?? false;
	const initials = user?.email.slice(0, 2).toUpperCase() ?? "??";

	const handleLogout = async () => {
		if (await logoutAction()) {
			navigate("/login", { replace: true });
		}
	};

	return (
		<div className="min-h-screen bg-slate-50">
			<aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
				<div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
					<div className="flex size-8 items-center justify-center rounded-md bg-slate-900 text-white">
						<ShieldCheck size={17} />
					</div>
					<div>
						<p className="text-sm font-semibold text-slate-950">RBAC System</p>
						<p className="text-[11px] text-slate-500">Access administration</p>
					</div>
				</div>
				<nav aria-label="Main navigation" className="flex-1 space-y-1 p-3">
					<p className="mb-2 px-3 pt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
						Workspace
					</p>
					<NavLink
						className={({ isActive }) =>
							`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${isActive ? "bg-slate-100 text-slate-950" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"}`
						}
						to="/"
						end
					>
						<LayoutDashboard size={16} />
						Overview
					</NavLink>
					{canReadUsers && (
						<NavLink
							className={({ isActive }) =>
								`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${isActive ? "bg-slate-100 text-slate-950" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"}`
							}
							to="/admin/users"
						>
							<Users size={16} />
							Users
						</NavLink>
					)}
					{canManageRoles && (
						<NavLink
							className={({ isActive }) =>
								`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${isActive ? "bg-slate-100 text-slate-950" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"}`
							}
							to="/admin/roles"
						>
							<BookOpen size={16} />
							Roles & permissions
						</NavLink>
					)}
				</nav>
				<div className="border-t border-slate-200 p-3">
					<div className="flex items-center gap-3 rounded-md px-2 py-2">
						<div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
							{initials}
						</div>
						<div className="min-w-0 flex-1">
							<p className="truncate text-sm font-medium text-slate-800">
								{user?.email}
							</p>
							<div className="mt-1 flex flex-wrap gap-1">
								{user?.roles.map((role) => (
									<span
										className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500"
										key={role}
									>
										{role}
									</span>
								))}
							</div>
						</div>
					</div>
					<button
						className="mt-2 flex w-full items-center gap-2 rounded-md px-2 py-2 text-xs text-slate-500 hover:bg-slate-50 hover:text-slate-900"
						disabled={isLoggingOut}
						onClick={() => void handleLogout()}
						type="button"
					>
						<LogOut size={14} />
						Sign out
					</button>
				</div>
			</aside>
			<div className="lg:pl-64">
				<header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
					<Link className="text-sm font-semibold text-slate-950" to="/">
						RBAC System
					</Link>
					<nav className="flex items-center gap-3 text-xs font-medium text-slate-600">
						<NavLink to="/" end>
							Overview
						</NavLink>
						{canReadUsers && <NavLink to="/admin/users">Users</NavLink>}
						{canManageRoles && <NavLink to="/admin/roles">Roles</NavLink>}
					</nav>
				</header>
				<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
					<Outlet />
				</main>
			</div>
		</div>
	);
};
