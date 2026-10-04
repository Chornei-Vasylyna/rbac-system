import { createBrowserRouter } from "react-router-dom";
import { GlobalErrorFallback } from "@/app/GlobalErrorBoundary.tsx";
import { AppLayout } from "@/app/layout/AppLayout.tsx";
import {
	AdminUsersRoute,
	PermissionRoute,
	ProtectedRoute,
} from "@/app/router/guards.tsx";
import { AdminRolesPage } from "@/pages/AdminRolesPage.tsx";
import { AdminUsersPage } from "@/pages/AdminUsersPage.tsx";
import { DashboardPage } from "@/pages/DashboardPage.tsx";
import { ForbiddenPage } from "@/pages/ForbiddenPage.tsx";
import { LoginPage } from "@/pages/LoginPage.tsx";
import { NotFoundPage } from "@/pages/NotFoundPage.tsx";
import { RegisterPage } from "@/pages/RegisterPage.tsx";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <ProtectedRoute />,
		errorElement: <GlobalErrorFallback />,
		children: [
			{
				element: <AppLayout />,
				children: [
					{ index: true, element: <DashboardPage /> },
					{
						element: <AdminUsersRoute />,
						children: [{ path: "admin/users", element: <AdminUsersPage /> }],
					},
					{
						element: <PermissionRoute permission="roles:manage" />,
						children: [{ path: "admin/roles", element: <AdminRolesPage /> }],
					},
				],
			},
		],
	},
	{ path: "/login", element: <LoginPage />, errorElement: <GlobalErrorFallback /> },
	{ path: "/register", element: <RegisterPage />, errorElement: <GlobalErrorFallback /> },
	{ path: "/403", element: <ForbiddenPage />, errorElement: <GlobalErrorFallback /> },
	{ path: "*", element: <NotFoundPage />, errorElement: <GlobalErrorFallback /> },
]);
