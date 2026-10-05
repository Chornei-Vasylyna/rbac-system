import { Controller, type FieldErrors, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { User } from "@/features/users/api/users.types.ts";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";

type EditUserFormProps = {
	user: User;
	isPending: boolean;
	onCancel: () => void;
	onSubmit: (values: { email: string }) => Promise<void>;
};

export const EditUserForm = ({
	user,
	isPending,
	onCancel,
	onSubmit,
}: EditUserFormProps) => {
	const { control, handleSubmit } = useForm<{ email: string }>({
		defaultValues: { email: user.email },
	});

	const submit = handleSubmit(
		async ({ email }) => onSubmit({ email: email.trim() }),
		(errors: FieldErrors<{ email: string }>) => {
			const message = errors.email?.message;
			toast.error(
				typeof message === "string" ? message : "Please enter a valid email.",
			);
		},
	);

	return (
		<form
			className="flex flex-col gap-3 sm:flex-row sm:items-end"
			onSubmit={(event) => void submit(event)}
		>
			<label
				className="flex-1 text-xs font-medium text-slate-600"
				htmlFor="edit-user-email"
			>
				Email address
				<Controller
					control={control}
					name="email"
					rules={{
						required: "Email is required",
						pattern: {
							value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
							message: "Enter a valid email address",
						},
					}}
					render={({ field }) => (
						<Input
							{...field}
							className="mt-1.5 h-9"
							id="edit-user-email"
							type="email"
						/>
					)}
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
