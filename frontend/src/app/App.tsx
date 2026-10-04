import { RouterProvider } from "react-router-dom";
import { GlobalErrorBoundary } from "@/app/GlobalErrorBoundary.tsx";
import { AppProviders } from "@/app/providers/AppProviders.tsx";
import { router } from "@/app/router/router.tsx";

export const App = () => (
	<GlobalErrorBoundary>
		<AppProviders>
			<RouterProvider router={router} />
		</AppProviders>
	</GlobalErrorBoundary>
);
