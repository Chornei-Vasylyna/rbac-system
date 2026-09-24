import { relations } from "drizzle-orm/_relations";
import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { rolesToPermissions } from "./roles-to-permissions.js";
import { usersToRoles } from "./users-to-roles.js";

export const roles = pgTable("roles", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: varchar("name", { length: 50 }).notNull().unique(),
	description: text("description"),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export const rolesRelations = relations(roles, ({ many }) => ({
	userRoles: many(usersToRoles),
	rolePermissions: many(rolesToPermissions),
}));
