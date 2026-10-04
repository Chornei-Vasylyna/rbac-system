import { Component, type ErrorInfo, type PropsWithChildren } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

type GlobalErrorBoundaryState = {
	hasError: boolean;
};

export const GlobalErrorFallback = () => {
	const handleReload = () => {
		window.location.reload();
	};

	return (
		<main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 text-slate-900 sm:px-6">
			<section className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
				<div className="mx-auto flex size-16 items-center justify-center rounded-full bg-amber-50 text-amber-600">
					<AlertTriangle size={30} strokeWidth={1.8} />
				</div>
				<p className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-amber-600">
					Application error
				</p>
				<h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
					Something went wrong
				</h1>
				<p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
					The application could not display this page. Try reloading it.
				</p>
				<button
					className="mt-7 inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
					onClick={handleReload}
					type="button"
				>
					<RefreshCw size={16} />
					Reload application
				</button>
			</section>
		</main>
	);
};

export class GlobalErrorBoundary extends Component<
	PropsWithChildren,
	GlobalErrorBoundaryState
> {
	state: GlobalErrorBoundaryState = { hasError: false };

	static getDerivedStateFromError(): GlobalErrorBoundaryState {
		return { hasError: true };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("Unhandled application error", error, errorInfo);
	}

	render() {
		if (!this.state.hasError) {
			return this.props.children;
		}

		return <GlobalErrorFallback />;
	}
}
