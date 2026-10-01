import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../features/auth/model/authStore.ts";

export const ProtectedRoute = () => {
	const location = useLocation();
	const { isAuthenticated, isInitialized } = useAuthStore();

	if (!isInitialized) {
		return <div>Checking your session...</div>;
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" replace state={{ from: location }} />;
	}

	return <Outlet />;
};

export const AdminRoute = () => {
	const { user } = useAuthStore();

	if (!user?.roles.includes("admin")) {
		return <Navigate to="/" replace />;
	}

	return <Outlet />;
};