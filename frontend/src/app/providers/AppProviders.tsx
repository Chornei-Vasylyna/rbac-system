import type { PropsWithChildren } from "react";
import { QueryProvider } from "@/app/providers/QueryProvider.tsx";
import { ToastProvider } from "@/app/providers/ToastProvider.tsx";

export const AppProviders = ({ children }: PropsWithChildren) => (
	<QueryProvider>
		<ToastProvider>{children}</ToastProvider>
	</QueryProvider>
);
