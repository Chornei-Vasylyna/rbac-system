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

export const PermissionRoute = ({ permission }: { permission: string }) => {
	const user = useAuthStore((state) => state.user);

	if (!user?.permissions.includes(permission)) {
		return <Navigate to="/403" replace />;
	}

	return <Outlet />;
};