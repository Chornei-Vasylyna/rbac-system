import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { RoleList } from "../features/roles/components/RoleList.tsx";
import { rolesKeys } from "../features/roles/api/roles.keys.ts";
import { rolesService } from "../features/roles/api/roles.service.ts";
import { PermissionDirectory } from "../features/roles/components/PermissionDirectory.tsx";

export const AdminRolesPage = () => {
	const queryClient = useQueryClient();
	const { register, handleSubmit, reset } = useForm<{
		name: string;
		description: string;
	}>({ defaultValues: { name: "", description: "" } });
	const createMutation = useMutation({
		mutationFn: ({ name, description }: { name: string; description: string }) =>
			rolesService.create(name, description),
		onError: (mutationError) => toast.error(mutationError.message),
		onSuccess: () => {
			reset();
			void queryClient.invalidateQueries({ queryKey: rolesKeys.list });
		},
	});

	return (
		<section>
			<p>Administration</p>
			<h1>Roles</h1>
			<p>Available roles and their permission sets.</p>
			<form onSubmit={handleSubmit((values) => createMutation.mutate(values))}>
				<input maxLength={50} placeholder="Role name" {...register("name", { required: true })} />
				<input maxLength={500} placeholder="Description" {...register("description")} />
				<button disabled={createMutation.isPending} type="submit">
					{createMutation.isPending ? "Creating..." : "Create role"}
				</button>
			</form>
			<RoleList />
			<PermissionDirectory />
		</section>
	);
};