import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import {
	usePermissionsQuery,
	useRolesQuery,
} from "@/features/roles/api/roles.queries.ts";
import { RoleDeleteDialog } from "@/features/roles/components/RoleDeleteDialog.tsx";
import { RoleEditDialog } from "@/features/roles/components/RoleEditDialog.tsx";
import { useRoleActions } from "@/features/roles/hooks/useRoleActions.ts";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/components/ui/Table";

export const RoleList = () => {
	const { data, isLoading, error } = useRolesQuery();
	const permissionsQuery = usePermissionsQuery();
	const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
	const [deletingRoleId, setDeletingRoleId] = useState<string | null>(null);
	const { handleRemove, handleUpdate, isDeleting, isUpdating } = useRoleActions(
		{ onUpdateSuccess: () => setEditingRoleId(null) },
	);

	const editingRole = data?.find((role) => role.id === editingRoleId);
	const deletingRole = data?.find((role) => role.id === deletingRoleId);

	const handleDelete = async () => {
		if (!deletingRole) return;

		const succeeded = await handleRemove(deletingRole.id);
		if (succeeded) setDeletingRoleId(null);
	};

	return (
		<div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
			{isLoading && (
				<p className="p-6 text-sm text-slate-500">Loading roles...</p>
			)}
			{error && (
				<p className="p-6 text-sm text-red-600">Could not load roles.</p>
			)}

			<Table>
				<TableHeader className="bg-slate-50/80">
					<TableRow className="border-b border-slate-200">
						<TableHead className="w-72 py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
							Role
						</TableHead>
						<TableHead className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
							Permissions
						</TableHead>
						<TableHead className="w-36 py-3 px-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
							Actions
						</TableHead>
					</TableRow>
				</TableHeader>
				
				<TableBody className="divide-y divide-slate-100">
					{data?.map((role) => {
						const isSystemRole = role.name === "admin" || role.name === "user";
						const visiblePermissions = role.permissions.slice(0, 2);

						return (
							<TableRow key={role.id}>
								<TableCell className="py-3.5 px-4 align-top">
									<span className="block font-medium text-slate-900 text-sm">
										{role.name}
									</span>
									<span className="mt-0.5 block text-xs text-slate-500 line-clamp-1">
										{role.description || "No description"}
									</span>
								</TableCell>

								<TableCell className="py-3.5 px-4 align-top">
									<div className="flex flex-wrap items-center gap-1.5 pt-0.5">
										{visiblePermissions.map((permission) => (
											<Badge
												key={permission.id}
												className="rounded bg-slate-100 px-1.5 py-1 font-mono text-xs text-slate-600"
											>
												{permission.slug}
											</Badge>
										))}
										{role.permissions.length > 2 && (
											<Badge className="rounded bg-slate-100 px-1.5 py-1 font-mono text-xs text-slate-600">
												+{role.permissions.length - 2} more
											</Badge>
										)}
										{!role.permissions.length && (
											<span className="text-xs text-slate-400">
												No permissions assigned
											</span>
										)}
									</div>
								</TableCell>

								<TableCell className="py-3.5 px-4 text-right align-top">
									<div className="inline-flex items-center justify-end gap-1.5">
										<Button
											aria-label="Edit"
											className="group inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 shadow-xs transition-colors hover:bg-slate-50 hover:text-slate-900"
											onClick={() => setEditingRoleId(role.id)}
										>
											<Pencil className="size-3.5 text-slate-400 group-hover:text-slate-600" />
											Edit
										</Button>

										<Button
											aria-label={
												isSystemRole
													? `${role.name} is a system role`
													: `Delete ${role.name}`
											}
											className="size-8 rounded-md border border-transparent text-slate-400 transition-colors hover:border-red-100 hover:bg-red-50 hover:text-red-600 disabled:border-transparent disabled:bg-transparent disabled:text-slate-300"
											disabled={isSystemRole || isDeleting}
											onClick={() => setDeletingRoleId(role.id)}
											title={
												isSystemRole
													? "System roles cannot be deleted"
													: "Delete role"
											}
											size="icon"
											variant="ghost"
										>
											<Trash2 className="size-4" />
										</Button>
									</div>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>

			<RoleEditDialog
				isPending={isUpdating}
				onClose={() => setEditingRoleId(null)}
				onSubmit={(values) => void handleUpdate(values)}
				permissions={permissionsQuery.data}
				role={editingRole}
			/>

			<RoleDeleteDialog
				isDeleting={isDeleting}
				onClose={() => setDeletingRoleId(null)}
				onConfirm={handleDelete}
				onOpenChange={(open) => {
					if (!open && !isDeleting) setDeletingRoleId(null);
				}}
				open={Boolean(deletingRole)}
				roleName={deletingRole?.name}
			/>
		</div>
	);
};
