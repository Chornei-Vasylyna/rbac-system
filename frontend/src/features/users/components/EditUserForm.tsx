import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { User } from "../api/users.types.ts";

type EditUserFormProps = {
	user: User;
	isPending: boolean;
	onCancel: () => void;
	onSubmit: (values: { email: string; fullName: string }) => void;
};

export const EditUserForm = ({ user, isPending, onCancel, onSubmit }: EditUserFormProps) => {
	const { register, handleSubmit, reset } = useForm<{
		email: string;
		fullName: string;
	}>({
		defaultValues: { email: user.email, fullName: user.fullName ?? "" },
	});

	useEffect(() => {
		reset({ email: user.email, fullName: user.fullName ?? "" });
	}, [reset, user]);

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<input type="email" {...register("email", { required: true })} />
			<input maxLength={255} placeholder="Full name" {...register("fullName")} />
			<button disabled={isPending} type="submit">{isPending ? "Saving..." : "Save user"}</button>
			<button disabled={isPending} onClick={onCancel} type="button">Cancel</button>
		</form>
	);
};