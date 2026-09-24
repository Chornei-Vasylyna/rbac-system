import { relations } from "drizzle-orm/_relations";
import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { rolesToPermissions } from "./roles-to-permissions.js";

export const permissions = pgTable("permissions", {
	id: uuid("id").defaultRandom().primaryKey(),
	slug: varchar("slug", { length: 100 }).notNull().unique(),
	description: text("description"),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export const permissionsRelations = relations(permissions, ({ many }) => ({
	rolePermissions: many(rolesToPermissions),
}));
