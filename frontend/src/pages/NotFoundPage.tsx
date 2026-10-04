import { ArrowLeft, SearchX } from "lucide-react";
import { Link } from "react-router-dom";

export const NotFoundPage = () => (
	<main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 text-slate-900 sm:px-6">
		<section className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
			<div className="mx-auto flex size-16 items-center justify-center rounded-full bg-slate-100 text-slate-500">
				<SearchX size={30} strokeWidth={1.8} />
			</div>
			<p className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
				Error 404
			</p>
			<h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
				Page not found
			</h1>
			<p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
				The page you are looking for does not exist or has been moved.
			</p>
			<Link
				className="mt-7 inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
				to="/"
			>
				<ArrowLeft size={16} />
				Back to dashboard
			</Link>
		</section>
	</main>
);
