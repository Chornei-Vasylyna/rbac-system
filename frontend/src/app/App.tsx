import { RouterProvider } from "react-router-dom";
import { AppProviders } from "@/app/providers/AppProviders.tsx";
import { router } from "@/app/router/router.tsx";

export const App = () => (
	<AppProviders>
		<RouterProvider router={router} />
	</AppProviders>
);
