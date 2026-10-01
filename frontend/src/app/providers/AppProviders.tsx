import type { PropsWithChildren } from "react";
import { QueryProvider } from "./QueryProvider.tsx";
import { ToastProvider } from "./ToastProvider.tsx";

export const AppProviders = ({ children }: PropsWithChildren) => (
	<QueryProvider>
		<ToastProvider>{children}</ToastProvider>
	</QueryProvider>
);