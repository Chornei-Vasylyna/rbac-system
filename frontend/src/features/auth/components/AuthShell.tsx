import type { PropsWithChildren } from "react";

type AuthShellProps = {
	title: string;
};

export const AuthShell = ({ title, children }: PropsWithChildren<AuthShellProps>) => (
	<main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 text-slate-900 sm:px-6">
		<section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
			<p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">RBAC System</p>
			<h1 className="mb-8 text-2xl font-semibold tracking-tight text-slate-950">{title}</h1>
			{children}
		</section>
	</main>
);
