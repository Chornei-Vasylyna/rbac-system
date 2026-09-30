import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./app/index.css";
import { App } from "./app/App.tsx";
import { useAuthStore } from "./features/auth/store/auth.store.ts";
import { baseApi, setupInterceptors } from "./shared/api/index.ts";

setupInterceptors(baseApi, {
	getAccessToken: () => useAuthStore.getState().accessToken,
	setAccessToken: (accessToken) =>
		useAuthStore.getState().setAccessToken(accessToken),
	onAuthFailed: () => {
		useAuthStore.getState().clearSession();
		window.location.assign("/login");
	},
});

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
