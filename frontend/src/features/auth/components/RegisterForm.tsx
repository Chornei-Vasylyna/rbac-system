import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuthActions } from "@/features/auth/hooks/useAuthActions.ts";
import {
	type RegisterFormValues,
	registerSchema,
} from "@/features/auth/schemas/registerSchema.ts";
import { Input } from "@/shared/components/ui/Input.tsx";
import { Label } from "@/shared/components/ui/Label.tsx";

export const RegisterForm = () => {
	const navigate = useNavigate();
	const { handleRegister, isRegistering } = useAuthActions();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterFormValues>({
		resolver: zodResolver(registerSchema),
	});

	const submit = async (form: RegisterFormValues) => {
		if (await handleRegister(form)) {
			navigate("/login", { replace: true });
		}
	};

	return (
		<>
			<form className="space-y-5" onSubmit={handleSubmit(submit)}>
				<div>
					<Label htmlFor="register-email">Email</Label>
					<Input
						className="mt-2"
						id="register-email"
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
					<Label htmlFor="register-password">Password</Label>
					<Input
						className="mt-2"
						id="register-password"
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
					disabled={isRegistering}
					type="submit"
				>
					{isRegistering ? "Creating..." : "Create account"}
				</button>
			</form>
			<p className="mt-6 text-center text-sm text-slate-500">
				Already registered?{" "}
				<Link
					className="font-medium text-slate-900 hover:underline"
					to="/login"
				>
					Sign in
				</Link>
			</p>
		</>
	);
};
