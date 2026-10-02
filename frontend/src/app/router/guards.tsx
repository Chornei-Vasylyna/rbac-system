import { LoaderCircle } from "lucide-react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/features/auth/model/authStore.ts";

export const ProtectedRoute = () => {
	const location = useLocation();
	const { isAuthenticated, isInitialized } = useAuthStore();

	if (!isInitialized) {
		return (
			<main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 text-slate-900 sm:px-6">
				<section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
					<div className="flex items-center justify-center gap-2 text-sm font-medium text-slate-700">
						<LoaderCircle className="animate-spin text-slate-400" size={16} />
						Checking your session...
					</div>
					<p className="mt-2 text-xs text-slate-500">
						Verifying your access permissions
					</p>
				</section>
			</main>
		);
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
