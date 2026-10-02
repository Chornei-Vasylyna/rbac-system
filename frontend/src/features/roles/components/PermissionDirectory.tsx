import { usePermissionsQuery } from "@/features/roles/api/roles.queries.ts";
import { Badge } from "@/shared/components/ui/Badge";

export const PermissionDirectory = () => {
	const { data, isLoading, error } = usePermissionsQuery();
	const groupedPermissions = data?.reduce<Record<string, typeof data>>(
		(groups, permission) => {
			const category = permission.slug.split(":")[0] ?? "other";
			if (!groups[category]) groups[category] = [];
			groups[category].push(permission);
			return groups;
		},
		{},
	);

	return (
		<section className="space-y-4" id="permissions">
			<div>
				<h2 className="text-lg font-semibold text-slate-950">
					Permission directory
				</h2>
				<p className="mt-1 text-sm text-slate-500">
					System permissions available for assignment to roles.
				</p>
			</div>
			{isLoading && (
				<p className="text-sm text-slate-500">Loading permissions...</p>
			)}
			{error && (
				<p className="text-sm text-red-600">Could not load permissions.</p>
			)}
			<div className="grid gap-4 md:grid-cols-2">
				{Object.entries(groupedPermissions ?? {}).map(
					([category, permissions]) => (
						<section
							className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
							key={category}
						>
							<h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
								{category}
							</h3>
							<div className="space-y-3">
								{permissions?.map((permission) => (
									<div
										className="border-b border-slate-100 pb-3 last:border-0 last:pb-0"
										key={permission.id}
									>
										<Badge className="rounded bg-slate-100 px-1.5 py-1 font-mono text-xs text-slate-600">
											{permission.slug}
										</Badge>
										<p className="mt-2 text-sm text-slate-600">
											{permission.description || "No description"}
										</p>
									</div>
								))}
							</div>
						</section>
					),
				)}
			</div>
		</section>
	);
};
