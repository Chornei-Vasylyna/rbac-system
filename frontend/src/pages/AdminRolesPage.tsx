import { Plus } from "lucide-react";
import { useState } from "react";
import { useController, useForm } from "react-hook-form";
import { usePermissionsQuery } from "@/features/roles/api/roles.queries.ts";
import type { CreateRoleDto } from "@/features/roles/api/roles.types.ts";
import { PermissionDirectory } from "@/features/roles/components/PermissionDirectory.tsx";
import { RoleList } from "@/features/roles/components/RoleList.tsx";
import { useRoleActions } from "@/features/roles/hooks/useRoleActions.ts";
import { Button } from "@/shared/components/ui/Button";
import { Checkbox } from "@/shared/components/ui/Checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/shared/components/ui/Dialog";
import { Input } from "@/shared/components/ui/Input";
import { Label } from "@/shared/components/ui/Label";

export const AdminRolesPage = () => {
	const permissionsQuery = usePermissionsQuery();
	const [activeTab, setActiveTab] = useState<"roles" | "permissions">("roles");
	const [isCreateOpen, setIsCreateOpen] = useState(false);

	type CreateRoleFormValues = CreateRoleDto & { permissionIds: string[] };
	const { control, register, handleSubmit, reset } =
		useForm<CreateRoleFormValues>({
			defaultValues: { name: "", description: "", permissionIds: [] },
		});

	const { field: permissionField } = useController({
		control,
		name: "permissionIds",
	});

	const handleCloseModal = () => {
		reset({ name: "", description: "", permissionIds: [] });
		setIsCreateOpen(false);
	};

	const { handleCreate: handleCreateRole, isCreating } = useRoleActions({
		onCreateSuccess: handleCloseModal,
	});

	const handleCreate = async ({
		name,
		description,
		permissionIds,
	}: CreateRoleFormValues) => {
		await handleCreateRole({ name, description, permissionIds });
	};

	const groupedPermissions = permissionsQuery.data?.reduce<
		Record<string, typeof permissionsQuery.data>
	>((groups, permission) => {
		const category = permission.slug.split(":")[0] ?? "other";
		if (!groups[category]) groups[category] = [];
		groups[category].push(permission);
		return groups;
	}, {});

	const togglePermission = (permissionId: string, checked: boolean) => {
		permissionField.onChange(
			checked
				? [...permissionField.value, permissionId]
				: permissionField.value.filter((id) => id !== permissionId),
		);
	};

	return (
		<section className="space-y-6">
			<header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
						Administration
					</p>
					<h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
						Roles & permissions
					</h1>
					<p className="mt-1 text-sm text-slate-500">
						Manage access groups and the capabilities assigned to them.
					</p>
				</div>
				{activeTab === "roles" && (
					<Button
						className="h-9 inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-slate-800"
						onClick={() => setIsCreateOpen(true)}
					>
						<Plus aria-hidden="true" className="size-4" />
						Create role
					</Button>
				)}
			</header>

			<nav
				className="flex gap-6 border-b border-slate-200"
				aria-label="Roles and permissions sections"
			>
				{(
					[
						["roles", "Roles"],
						["permissions", "Permission directory"],
					] as const
				).map(([tab, label]) => (
					<button
						type="button"
						key={tab}
						onClick={() => setActiveTab(tab)}
						className={`-mb-px pb-3 text-sm font-medium transition-colors border-b-2 ${
							activeTab === tab
								? "border-slate-900 text-slate-950 font-semibold"
								: "border-transparent text-slate-500 hover:text-slate-800"
						}`}
					>
						{label}
					</button>
				))}
			</nav>

			<main className="mt-4">
				{activeTab === "roles" ? <RoleList /> : <PermissionDirectory />}
			</main>

			<Dialog
				open={isCreateOpen}
				onOpenChange={(open) => !open && handleCloseModal()}
			>
				<DialogContent className="max-w-xl">
					<DialogHeader>
						<DialogTitle>Create role</DialogTitle>
						<DialogDescription>
							Define a role and the permissions it should start with.
						</DialogDescription>
					</DialogHeader>

					<form className="space-y-5" onSubmit={handleSubmit(handleCreate)}>
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-1.5">
								<Label htmlFor="role-name">Role name</Label>
								<Input
									id="role-name"
									maxLength={50}
									placeholder="e.g. reviewer"
									{...register("name", { required: true })}
								/>
							</div>
							<div className="space-y-1.5">
								<Label htmlFor="role-description">Description</Label>
								<Input
									id="role-description"
									maxLength={500}
									placeholder="What can this role do?"
									{...register("description")}
								/>
							</div>
						</div>

						<fieldset className="space-y-2">
							<legend className="text-xs font-semibold uppercase tracking-wider text-slate-400">
								Permissions
							</legend>

							{permissionsQuery.isLoading && (
								<p className="text-sm text-slate-500">Loading permissions...</p>
							)}

							<div className="max-h-70 space-y-4 overflow-y-auto pr-1">
								{Object.entries(groupedPermissions ?? {}).map(
									([category, permissions]) => (
										<div key={category} className="space-y-2">
											<h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
												{category}
											</h3>
											<div className="grid gap-2 sm:grid-cols-2">
												{permissions.map((permission) => {
													const isChecked = permissionField.value.includes(
														permission.id,
													);
													return (
														<Label
															htmlFor={`create-permission-${permission.id}`}
															key={permission.id}
															className={`flex cursor-pointer items-start gap-2.5 rounded-md border p-2.5 transition-colors ${
																isChecked
																	? "border-slate-900/40 bg-slate-50"
																	: "border-slate-200 hover:bg-slate-50/50"
															}`}
														>
															<Checkbox
																id={`create-permission-${permission.id}`}
																checked={isChecked}
																onCheckedChange={(checked) =>
																	togglePermission(
																		permission.id,
																		checked === true,
																	)
																}
																className="mt-0.5"
															/>
															<div className="space-y-0.5">
																<code className="block font-mono text-xs font-medium text-slate-800">
																	{permission.slug}
																</code>
																<span className="block text-xs font-normal text-slate-500">
																	{permission.description || "No description"}
																</span>
															</div>
														</Label>
													);
												})}
											</div>
										</div>
									),
								)}
							</div>
						</fieldset>

						<DialogFooter className="gap-2 sm:gap-0">
							<Button
								onClick={handleCloseModal}
								type="button"
								variant="outline"
							>
								Cancel
							</Button>
							<Button disabled={isCreating} type="submit">
								{isCreating ? "Creating..." : "Create role"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</section>
	);
};
