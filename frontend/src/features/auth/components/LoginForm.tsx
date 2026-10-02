import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuthActions } from "@/features/auth/hooks/useAuthActions.ts";
import {
	type LoginFormValues,
	loginSchema,
} from "@/features/auth/schemas/loginSchema.ts";
import { Input } from "@/shared/components/ui/Input.tsx";
import { Label } from "@/shared/components/ui/Label.tsx";

export const LoginForm = () => {
	const navigate = useNavigate();
	const { handleLogin, isLoggingIn } = useAuthActions();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
	});

	const submit = async ({ email, password }: LoginFormValues) => {
		const response = await handleLogin({ email, password });
		if (response) {
			const destination =
				response.user.permissions.includes("users:read") ||
				response.user.permissions.includes("roles:manage")
					? "/admin/users"
					: "/";
			navigate(destination, { replace: true });
		}
	};

	return (
		<>
			<form className="space-y-5" onSubmit={handleSubmit(submit)}>
				<div>
					<Label htmlFor="login-email">Email</Label>
					<Input
						className="mt-2"
						id="login-email"
						type="email"
						placeholder="name@example.com"
						{...register("email")}
					/>
				</div>
				{errors.email && (
					<span className="-mt-3 block text-sm text-rose-400" role="alert">
						{errors.email.message}
					</span>
				)}
				<div>
					<Label htmlFor="login-password">Password</Label>
					<Input
						className="mt-2"
						id="login-password"
						type="password"
						placeholder="••••••••"
						{...register("password")}
					/>
				</div>
				{errors.password && (
					<span className="-mt-3 block text-sm text-rose-400" role="alert">
						{errors.password.message}
					</span>
				)}
				<button
					className="w-full rounded-md bg-slate-900 px-4 py-2.5 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
					disabled={isLoggingIn}
					type="submit"
				>
					{isLoggingIn ? "Signing in..." : "Sign in"}
				</button>
			</form>
			<p className="mt-6 text-center text-sm text-slate-500">
				New here?{" "}
				<Link
					className="font-medium text-slate-900 hover:underline"
					to="/register"
				>
					Create an account
				</Link>
			</p>
		</>
	);
};
