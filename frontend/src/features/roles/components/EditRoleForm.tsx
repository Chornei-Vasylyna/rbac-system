import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Role } from "../api/roles.types.ts";

type EditRoleFormProps = {
	role: Role;
	isPending: boolean;
	onCancel: () => void;
	onSubmit: (values: { name: string; description: string }) => void;
};

export const EditRoleForm = ({ role, isPending, onCancel, onSubmit }: EditRoleFormProps) => {
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
		<form onSubmit={handleSubmit(onSubmit)}>
			<input disabled={isSystemRole} maxLength={50} {...register("name", { required: true })} />
			<input maxLength={500} {...register("description")} />
			<button disabled={isPending} type="submit">{isPending ? "Saving..." : "Save role"}</button>
			<button disabled={isPending} onClick={onCancel} type="button">Cancel</button>
			{isSystemRole && <small>System role names cannot be changed.</small>}
		</form>
	);
};