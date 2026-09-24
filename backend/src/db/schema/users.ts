import { relations } from "drizzle-orm/_relations";
import {
	boolean,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { refreshTokens } from "./refresh-tokens.js";
import { usersToRoles } from "./users-to-roles.js";

export const users = pgTable("users", {
	id: uuid("id").defaultRandom().primaryKey(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	passwordHash: text("password_hash").notNull(),
	fullName: varchar("full_name", { length: 255 }),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
	userRoles: many(usersToRoles),
	refreshTokens: many(refreshTokens),
}));
