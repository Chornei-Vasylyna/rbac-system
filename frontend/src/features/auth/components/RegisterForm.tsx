import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useRegisterMutation } from "../api/auth.mutations.ts";
import {
	registerSchema,
	type RegisterFormValues,
} from "../schemas/registerSchema.ts";
import axios from "axios";

export const RegisterForm = () => {
	const navigate = useNavigate();
	const registerMutation = useRegisterMutation();
	const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
		resolver: zodResolver(registerSchema),
	});

	const submit = async (form: RegisterFormValues) => {
		try {
			await registerMutation.mutateAsync(form);
			toast.success("Account created. You can sign in now.");
			navigate("/login", { replace: true });
		} catch (error) {
			const message = axios.isAxiosError(error) && typeof error.response?.data?.message === "string"
				? error.response.data.message
				: "Could not create the account.";
			toast.error(message);
		}
	};

	return (
		<>
			<form className="space-y-5" onSubmit={handleSubmit(submit)}>
				<label className="block text-sm font-medium text-slate-300">Full name
					<input className="mt-2 block w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20" {...register("fullName")} />
				</label>
				{errors.fullName && <span className="-mt-3 block text-sm text-rose-400" role="alert">{errors.fullName.message}</span>}
				<label className="block text-sm font-medium text-slate-300">Email
					<input className="mt-2 block w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20" type="email" {...register("email")} />
				</label>
				{errors.email && <span className="-mt-3 block text-sm text-rose-400" role="alert">{errors.email.message}</span>}
				<label className="block text-sm font-medium text-slate-300">Password
					<input className="mt-2 block w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20" type="password" {...register("password")} />
				</label>
				{errors.password && <span className="-mt-3 block text-sm text-rose-400" role="alert">{errors.password.message}</span>}
				<button className="w-full rounded-lg bg-cyan-400 px-4 py-2.5 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60" disabled={registerMutation.isPending} type="submit">{registerMutation.isPending ? "Creating..." : "Create account"}</button>
			</form>
			<p className="mt-6 text-center text-sm text-slate-400">Already registered? <Link className="font-medium text-cyan-400 hover:text-cyan-300" to="/login">Sign in</Link></p>
		</>
	);
};
