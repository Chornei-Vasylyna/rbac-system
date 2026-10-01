import type { PropsWithChildren } from "react";
import { Toaster } from "sonner";

export const ToastProvider = ({ children }: PropsWithChildren) => (
	<>
		{children}
		<Toaster position="top-right" richColors />
	</>
);
