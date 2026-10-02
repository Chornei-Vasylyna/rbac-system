import { useState } from "react";
import { useAuthStore } from "@/features/auth/model/authStore.ts";
import { useRolesQuery } from "@/features/roles/api/roles.queries.ts";
import { useUsersQuery } from "@/features/users/api/users.queries.ts";
import { UserPagination } from "@/features/users/components/UserPagination.tsx";
import { UserRoleRemoveDialog } from "@/features/users/components/UserRoleRemoveDialog.tsx";
import { UserSearchHeader } from "@/features/users/components/UserSearchHeader.tsx";
import { UserTableRow } from "@/features/users/components/UserTableRow.tsx";
import { useUserActions } from "@/features/users/hooks/useUserActions.ts";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/components/ui/Table";

export const UserList = () => {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const [editingUserId, setEditingUserId] = useState<string | null>(null);
	const [roleRemoval, setRoleRemoval] = useState<{
		roleId: string;
		roleName: string;
		userEmail: string;
		userId: string;
	} | null>(null);

	const canManageUsers = useAuthStore(
		(state) => state.user?.permissions.includes("users:manage") ?? false,
	);
	const { data, isLoading, error } = useUsersQuery(page, search);
	const rolesQuery = useRolesQuery(canManageUsers);

	const {
		handleAssignRole,
		handleRemoveRole,
		handleStatusChange,
		handleUpdate,
		isAssigningRole,
		isRemovingRole,
		isUpdating,
		isUpdatingStatus,
	} = useUserActions({
		onUpdateSuccess: () => setEditingUserId(null),
	});

	const availableRoles = rolesQuery.data ?? [];
	const totalColumns = canManageUsers ? 4 : 3;
	const confirmRoleRemoval = async () => {
		if (!roleRemoval) return;

		const succeeded = await handleRemoveRole({
			roleId: roleRemoval.roleId,
			userId: roleRemoval.userId,
		});
		if (succeeded) setRoleRemoval(null);
	};

	return (
		<div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
			<UserSearchHeader
				onSearchChange={(value) => {
					setPage(1);
					setSearch(value);
				}}
				search={search}
				total={data?.meta.total ?? 0}
			/>

			<Table>
				<colgroup>
					<col className="w-[30%]" />
					<col className="w-[18%]" />
					<col />
					{canManageUsers && <col className="w-[34%]" />}
				</colgroup>
				<TableHeader className="bg-slate-50/80">
					<TableRow className="border-b border-slate-200">
						<TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
							User
						</TableHead>
						<TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
							Status
						</TableHead>
						<TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
							Roles
						</TableHead>
						{canManageUsers && (
							<TableHead className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
								Actions
							</TableHead>
						)}
					</TableRow>
				</TableHeader>
				<TableBody className="divide-y divide-slate-100">
					{isLoading && (
						<TableRow>
							<TableCell
								className="px-4 py-10 text-center text-sm text-slate-500"
								colSpan={totalColumns}
							>
								Loading users...
							</TableCell>
						</TableRow>
					)}

					{error && !isLoading && (
						<TableRow>
							<TableCell
								className="px-4 py-10 text-center text-sm text-red-600"
								colSpan={totalColumns}
							>
								Could not load users.
							</TableCell>
						</TableRow>
					)}

					{!isLoading &&
						!error &&
						data?.data.map((user) => (
							<UserTableRow
								key={user.id}
								assignRolePending={isAssigningRole}
								availableRoles={availableRoles}
								canManageUsers={canManageUsers}
								editing={editingUserId === user.id}
								onAssignRole={(roleId) =>
									handleAssignRole({ userId: user.id, roleId })
								}
								onCancelEdit={() => setEditingUserId(null)}
								onEdit={() => setEditingUserId(user.id)}
								onRemoveRole={(roleId, roleName) =>
									setRoleRemoval({
										roleId,
										roleName,
										userEmail: user.email,
										userId: user.id,
									})
								}
								onToggleStatus={() =>
									handleStatusChange({
										userId: user.id,
										isActive: !user.isActive,
									})
								}
								onUpdate={({ email }) =>
									handleUpdate({ userId: user.id, email })
								}
								removeRolePending={isRemovingRole}
								statusPending={isUpdatingStatus}
								updatePending={isUpdating}
								user={user}
							/>
						))}

					{!isLoading && !error && data?.data.length === 0 && (
						<TableRow>
							<TableCell
								className="px-4 py-10 text-center text-sm text-slate-500"
								colSpan={totalColumns}
							>
								No users found.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			{!isLoading && !error && data && (
				<UserPagination
					onPageChange={setPage}
					page={data.meta.page}
					totalPages={data.meta.totalPages}
				/>
			)}

			<UserRoleRemoveDialog
				onClose={() => setRoleRemoval(null)}
				onConfirm={() => void confirmRoleRemoval()}
				onOpenChange={(open) => {
					if (!open) setRoleRemoval(null);
				}}
				open={Boolean(roleRemoval)}
				roleName={roleRemoval?.roleName}
				userEmail={roleRemoval?.userEmail}
			/>
		</div>
	);
};
