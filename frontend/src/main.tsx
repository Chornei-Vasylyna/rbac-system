import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./app/index.css";
import { App } from "./app/App.tsx";
import { useAuthStore } from "./features/auth/model/authStore.ts";
import { baseApi, setupInterceptors } from "./shared/api/index.ts";

setupInterceptors(baseApi, {
	getAccessToken: () => useAuthStore.getState().accessToken,
	setAccessToken: (accessToken) =>
		useAuthStore.getState().setAccessToken(accessToken),
	onAuthFailed: () => {
		useAuthStore.getState().clearAuth();
		window.location.assign("/login");
	},
});

void useAuthStore.getState().checkAuth();

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
