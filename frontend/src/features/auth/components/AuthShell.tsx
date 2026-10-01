import type { PropsWithChildren } from "react";

type AuthShellProps = {
	title: string;
};

export const AuthShell = ({ title, children }: PropsWithChildren<AuthShellProps>) => (
	<main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6">
		<section className="mx-auto w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-black/20 sm:p-8">
			<p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">RBAC Console</p>
			<h1 className="mb-8 text-3xl font-semibold tracking-tight text-white">{title}</h1>
			{children}
		</section>
	</main>
);
