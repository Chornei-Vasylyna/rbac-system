import { cn } from "cn";
import { X } from "lucide-react";
import type { Role } from "@/features/roles/api/roles.types.ts";
import type { User } from "@/features/users/api/users.types.ts";
import { EditUserForm } from "@/features/users/components/EditUserForm.tsx";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { TableCell, TableRow } from "@/shared/components/ui/Table";

export interface UserTableRowProps {
	user: User;
	availableRoles: Role[];
	canManageUsers: boolean;
	editing: boolean;
	updatePending: boolean;
	statusPending: boolean;
	assignRolePending: boolean;
	removeRolePending: boolean;
	onEdit: () => void;
	onCancelEdit: () => void;
	onUpdate: (values: { email: string }) => void;
	onToggleStatus: () => void;
	onAssignRole: (roleId: string) => void;
	onRemoveRole: (roleId: string, roleName: string) => void;
}

export const UserTableRow = ({
	user,
	availableRoles,
	canManageUsers,
	editing,
	updatePending,
	statusPending,
	assignRolePending,
	removeRolePending,
	onEdit,
	onCancelEdit,
	onUpdate,
	onToggleStatus,
	onAssignRole,
	onRemoveRole,
}: UserTableRowProps) => (
	<>
		<TableRow>
			<TableCell className="px-4 py-3.5 align-top">
				<span className="block truncate font-medium text-slate-900">
					{user.email}
				</span>
				<span className="mt-1 block text-xs text-slate-500">
					Account ID {user.id.slice(0, 8)}
				</span>
			</TableCell>
			<TableCell className="px-4 py-3.5 align-top">
				<Badge
					className={
						user.isActive
							? "bg-emerald-50 text-emerald-700"
							: "bg-slate-100 text-slate-600"
					}
				>
					{user.isActive ? "Active" : "Deactivated"}
				</Badge>
			</TableCell>

			<TableCell className="px-4 py-3.5 align-top">
				<div className="flex flex-wrap items-center gap-1.5">
					{user.roles.length ? (
						user.roles.map((role) => (
							<Badge
								key={role.id}
								onClick={
									canManageUsers
										? () => onRemoveRole(role.id, role.name)
										: undefined
								}
								className={cn(
									"rounded bg-slate-100 px-2 py-0.5 font-sans text-xs text-slate-700",
									canManageUsers &&
										"group relative cursor-pointer select-none transition-colors hover:bg-red-100 hover:text-red-600",
									removeRolePending && "pointer-events-none opacity-50",
								)}
							>
								<span
									className={cn(
										canManageUsers &&
											"transition-opacity group-hover:opacity-0",
									)}
								>
									{role.name}
								</span>

								
								{canManageUsers && (
									<span
										aria-hidden="true"
										className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
									>
										<X className="size-3" />
									</span>
								)}
							</Badge>
						))
					) : (
						<span className="text-xs text-slate-400">No roles</span>
					)}
				</div>
			</TableCell>

			{canManageUsers && (
				<TableCell className="px-4 py-3.5 text-right align-top">
					<div className="flex flex-wrap items-center justify-end gap-1.5">
						<Button
							className="h-8 rounded-md border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 shadow-xs transition-colors hover:bg-slate-50 hover:text-slate-900"
							disabled={statusPending}
							onClick={onToggleStatus}
							size="sm"
							variant="outline"
						>
							{user.isActive ? "Deactivate" : "Activate"}
						</Button>
						<Button
							className="h-8 rounded-md border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 shadow-xs transition-colors hover:bg-slate-50 hover:text-slate-900"
							onClick={onEdit}
							size="sm"
							variant="outline"
						>
							Edit
						</Button>
						<select
							aria-label={`Assign role to ${user.email}`}
							className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 outline-none focus:ring-2 focus:ring-slate-300 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
							defaultValue=""
							disabled={assignRolePending}
							onChange={(event) => {
								if (event.target.value) onAssignRole(event.target.value);
							}}
						>
							<option value="">Assign role</option>
							{availableRoles.map((role) => (
								<option key={role.id} value={role.id}>
									{role.name}
								</option>
							))}
						</select>
					</div>
				</TableCell>
			)}
		</TableRow>

		{editing && canManageUsers && (
			<TableRow>
				<TableCell className="px-4 py-3.5 align-top" colSpan={4}>
					<EditUserForm
						isPending={updatePending}
						onCancel={onCancelEdit}
						onSubmit={onUpdate}
						user={user}
					/>
				</TableCell>
			</TableRow>
		)}
	</>
);
