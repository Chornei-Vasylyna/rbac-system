import { useEffect } from "react";
import { useController, useForm } from "react-hook-form";
import type { Permission, Role } from "@/features/roles/api/roles.types.ts";
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

type RoleFormValues = {
	name: string;
	description: string;
	permissionIds: string[];
};

type RoleEditDialogProps = {
	role: Role | undefined;
	permissions: Permission[] | undefined;
	isPending: boolean;
	onClose: () => void;
	onSubmit: (values: RoleFormValues & { roleId: string }) => void;
};

export const RoleEditDialog = ({
	role,
	permissions,
	isPending,
	onClose,
	onSubmit,
}: RoleEditDialogProps) => {
	const { control, register, handleSubmit, reset } = useForm<RoleFormValues>({
		defaultValues: { name: "", description: "", permissionIds: [] },
	});

	const { field: permissionField } = useController({
		control,
		name: "permissionIds",
	});

	const isSystemRole = role?.name === "admin" || role?.name === "user";

	useEffect(() => {
		if (role) {
			reset({
				name: role.name,
				description: role.description ?? "",
				permissionIds: role.permissions.map((permission) => permission.id),
			});
		}
	}, [reset, role]);

	const groupedPermissions = permissions?.reduce<Record<string, Permission[]>>(
		(groups, permission) => {
			const category = permission.slug.split(":")[0] ?? "other";
			if (!groups[category]) groups[category] = [];
			groups[category].push(permission);
			return groups;
		},
		{},
	);

	const togglePermission = (permissionId: string, checked: boolean) => {
		permissionField.onChange(
			checked
				? [...permissionField.value, permissionId]
				: permissionField.value.filter((id) => id !== permissionId),
		);
	};

	return (
		<Dialog open={Boolean(role)} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-w-xl">
				<DialogHeader>
					<DialogTitle>Edit role: {role?.name}</DialogTitle>
					<DialogDescription>
						Update role details and assigned capabilities.
					</DialogDescription>
				</DialogHeader>

				{role && (
					<form
						className="space-y-5"
						onSubmit={handleSubmit((values) =>
							onSubmit({ ...values, roleId: role.id }),
						)}
					>
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-1.5">
								<Label htmlFor="edit-role-name">Role name</Label>
								<Input
									id="edit-role-name"
									disabled={isSystemRole}
									maxLength={50}
									{...register("name", { required: true })}
									className={
										isSystemRole
											? "bg-slate-50 text-slate-500 cursor-not-allowed"
											: ""
									}
								/>
								{isSystemRole && (
									<p className="text-[11px] text-slate-500">
										System role names cannot be changed.
									</p>
								)}
							</div>

							<div className="space-y-1.5">
								<Label htmlFor="edit-role-description">Description</Label>
								<Input
									id="edit-role-description"
									maxLength={500}
									placeholder="What can this role do?"
									{...register("description")}
									className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-xs focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
								/>
							</div>
						</div>

						<fieldset className="space-y-2">
							<legend className="text-xs font-semibold uppercase tracking-wider text-slate-400">
								Permissions
							</legend>

							<div className="max-h-70 space-y-4 overflow-y-auto pr-1">
								{Object.entries(groupedPermissions ?? {}).map(
									([category, categoryPermissions]) => (
										<div key={category} className="space-y-2">
											<h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
												{category}
											</h3>
											<div className="grid gap-2 sm:grid-cols-2">
												{categoryPermissions.map((permission) => {
													const isChecked = permissionField.value.includes(
														permission.id,
													);
													return (
														<Label
															htmlFor={`edit-permission-${permission.id}`}
															key={permission.id}
															className={`flex cursor-pointer items-start gap-2.5 rounded-md border p-2.5 transition-colors ${
																isChecked
																	? "border-slate-900/40 bg-slate-50"
																	: "border-slate-200 hover:bg-slate-50/50"
															}`}
														>
															<Checkbox
																id={`edit-permission-${permission.id}`}
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
							<Button onClick={onClose} type="button" variant="outline">
								Cancel
							</Button>
							<Button disabled={isPending} type="submit">
								{isPending ? "Saving..." : "Save changes"}
							</Button>
						</DialogFooter>
					</form>
				)}
			</DialogContent>
		</Dialog>
	);
};
