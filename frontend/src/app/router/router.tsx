import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/app/layout/AppLayout.tsx";
import { PermissionRoute, ProtectedRoute } from "@/app/router/guards.tsx";
import { AdminRolesPage } from "@/pages/AdminRolesPage.tsx";
import { AdminUsersPage } from "@/pages/AdminUsersPage.tsx";
import { DashboardPage } from "@/pages/DashboardPage.tsx";
import { ForbiddenPage } from "@/pages/ForbiddenPage.tsx";
import { LoginPage } from "@/pages/LoginPage.tsx";
import { RegisterPage } from "@/pages/RegisterPage.tsx";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <ProtectedRoute />,
		children: [
			{
				element: <AppLayout />,
				children: [
					{ index: true, element: <DashboardPage /> },
					{
						element: <PermissionRoute permission="users:read" />,
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
	{ path: "/login", element: <LoginPage /> },
	{ path: "/register", element: <RegisterPage /> },
	{ path: "/403", element: <ForbiddenPage /> },
]);
