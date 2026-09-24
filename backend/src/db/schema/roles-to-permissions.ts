import { relations } from "drizzle-orm/_relations";
import { pgTable, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core";
import { permissions } from "./permissions.js";
import { roles } from "./roles.js";

export const rolesToPermissions = pgTable(
	"roles_to_permissions",
	{
		roleId: uuid("role_id")
			.notNull()
			.references(() => roles.id, { onDelete: "cascade" }),
		permissionId: uuid("permission_id")
			.notNull()
			.references(() => permissions.id, { onDelete: "cascade" }),
		assignedAt: timestamp("assigned_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(t) => [primaryKey({ columns: [t.roleId, t.permissionId] })],
);

export const rolesToPermissionsRelations = relations(
	rolesToPermissions,
	({ one }) => ({
		role: one(roles, {
			fields: [rolesToPermissions.roleId],
			references: [roles.id],
		}),
		permission: one(permissions, {
			fields: [rolesToPermissions.permissionId],
			references: [permissions.id],
		}),
	}),
);
