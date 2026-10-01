import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "../../features/auth/model/authStore.ts";

export const AppLayout = () => {
	const navigate = useNavigate();
	const { user, logout } = useAuthStore();
	const isAdmin = user?.roles.includes("admin") ?? false;

	const handleLogout = async () => {
		try {
			await logout();
			navigate("/login", { replace: true });
		} catch {
			toast.error("Could not log out. Please try again.");
		}
	};

	return (
		<div>
			<header>
				<Link to="/">
					RBAC <span>Console</span>
				</Link>
				<nav aria-label="Main navigation">
					<NavLink to="/" end>Overview</NavLink>
					{isAdmin && <NavLink to="/admin/users">Users</NavLink>}
					{isAdmin && <NavLink to="/admin/roles">Roles</NavLink>}
				</nav>
				<div>
					<div>
						<strong>{user?.email}</strong>
						<div>
							{user?.roles.map((role) => <span key={role}>{role}</span>)}
						</div>
					</div>
					<button onClick={() => void handleLogout()} type="button">Logout</button>
				</div>
			</header>
			<main><Outlet /></main>
		</div>
	);
};