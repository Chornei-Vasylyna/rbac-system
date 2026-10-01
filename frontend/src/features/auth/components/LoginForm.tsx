import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLoginMutation } from "../api/auth.mutations.ts";
import { useAuthStore } from "../model/authStore.ts";
import { loginSchema, type LoginFormValues } from "../schemas/loginSchema.ts";

export const LoginForm = () => {
	const navigate = useNavigate();
	const setAuth = useAuthStore((state) => state.setAuth);
	const loginMutation = useLoginMutation();
	const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
	});
	const getServerError = (error: unknown) => {
		if (!axios.isAxiosError(error)) return "Unable to sign in. Please try again.";
		const message = error.response?.data?.message;
		return typeof message === "string" ? message : "Unable to sign in. Please try again.";
	};

	const submit = async ({ email, password }: LoginFormValues) => {
		try {
			const data = await loginMutation.mutateAsync({ email, password });
			setAuth(data.user, data.accessToken);
			const destination = data.user.roles.includes("admin")
				? "/admin/users"
				: "/";
			navigate(destination, { replace: true });
		} catch (error) {
			toast.error(getServerError(error));
		}
	};

	return (
		<>
			<form className="space-y-5" onSubmit={handleSubmit(submit)}>
				<label className="block text-sm font-medium text-slate-300">Email
					<input className="mt-2 block w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20" type="email" {...register("email")} />
				</label>
				{errors.email && <span className="-mt-3 block text-sm text-rose-400" role="alert">{errors.email.message}</span>}
				<label className="block text-sm font-medium text-slate-300">Password
					<input className="mt-2 block w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20" type="password" {...register("password")} />
				</label>
				{errors.password && <span className="-mt-3 block text-sm text-rose-400" role="alert">{errors.password.message}</span>}
				<button className="w-full rounded-lg bg-cyan-400 px-4 py-2.5 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60" disabled={loginMutation.isPending} type="submit">{loginMutation.isPending ? "Signing in..." : "Sign in"}</button>
			</form>
			<p className="mt-6 text-center text-sm text-slate-400">New here? <Link className="font-medium text-cyan-400 hover:text-cyan-300" to="/register">Create an account</Link></p>
		</>
	);
};
