import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Role } from "@/features/roles/api/roles.types.ts";

type EditRoleFormProps = {
	role: Role;
	isPending: boolean;
	onCancel: () => void;
	onSubmit: (values: { name: string; description: string }) => void;
};

export const EditRoleForm = ({
	role,
	isPending,
	onCancel,
	onSubmit,
}: EditRoleFormProps) => {
	const { register, handleSubmit, reset } = useForm<{
		name: string;
		description: string;
	}>({
		defaultValues: { name: role.name, description: role.description ?? "" },
	});

	useEffect(() => {
		reset({ name: role.name, description: role.description ?? "" });
	}, [reset, role]);

	const isSystemRole = role.name === "admin" || role.name === "user";

	return (
		<form
			className="col-span-full grid gap-2 border-t border-slate-100 pt-4 sm:grid-cols-2"
			onSubmit={handleSubmit(onSubmit)}
		>
			<input
				className="h-9 rounded-md border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-slate-300 disabled:bg-slate-100"
				disabled={isSystemRole}
				maxLength={50}
				{...register("name", { required: true })}
			/>
			<input
				className="h-9 rounded-md border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-slate-300"
				maxLength={500}
				{...register("description")}
			/>
			<div className="flex gap-2 sm:col-span-2">
				<button
					className="rounded-md bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-700 disabled:opacity-50"
					disabled={isPending}
					type="submit"
				>
					{isPending ? "Saving..." : "Save role"}
				</button>
				<button
					className="rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
					disabled={isPending}
					onClick={onCancel}
					type="button"
				>
					Cancel
				</button>
				{isSystemRole && (
					<small className="self-center text-xs text-slate-500">
						System role names cannot be changed.
					</small>
				)}
			</div>
		</form>
	);
};
