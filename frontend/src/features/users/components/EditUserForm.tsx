import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { User } from "@/features/users/api/users.types.ts";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";

type EditUserFormProps = {
	user: User;
	isPending: boolean;
	onCancel: () => void;
	onSubmit: (values: { email: string }) => void;
};

export const EditUserForm = ({
	user,
	isPending,
	onCancel,
	onSubmit,
}: EditUserFormProps) => {
	const { register, handleSubmit, reset } = useForm<{ email: string }>({
		defaultValues: { email: user.email },
	});

	useEffect(() => {
		reset({ email: user.email });
	}, [reset, user]);

	return (
		<form
			className="flex flex-col gap-3 sm:flex-row sm:items-end"
			onSubmit={handleSubmit(onSubmit)}
		>
			<label
				className="flex-1 text-xs font-medium text-slate-600"
				htmlFor="edit-user-email"
			>
				Email address
				<Input
					id="edit-user-email"
					type="email"
					{...register("email", { required: true })}
				/>
			</label>
			<div className="flex gap-2">
				<Button disabled={isPending} size="sm" type="submit">
					{isPending ? "Saving..." : "Save user"}
				</Button>
				<Button
					disabled={isPending}
					onClick={onCancel}
					size="sm"
					type="button"
					variant="outline"
				>
					Cancel
				</Button>
			</div>
		</form>
	);
};
