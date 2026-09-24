import { relations } from "drizzle-orm/_relations";
import { pgTable, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core";
import { roles } from "./roles.js";
import { users } from "./users.js";

export const usersToRoles = pgTable(
	"users_to_roles",
	{
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		roleId: uuid("role_id")
			.notNull()
			.references(() => roles.id, { onDelete: "cascade" }),
		assignedAt: timestamp("assigned_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(t) => [primaryKey({ columns: [t.userId, t.roleId] })],
);

export const usersToRolesRelations = relations(usersToRoles, ({ one }) => ({
	user: one(users, {
		fields: [usersToRoles.userId],
		references: [users.id],
	}),
	role: one(roles, {
		fields: [usersToRoles.roleId],
		references: [roles.id],
	}),
}));
