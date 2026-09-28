import "dotenv/config";
import { eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
	permissions,
	roles,
	rolesToPermissions,
	users,
	usersToRoles,
} from "./schema/index.js";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });

const roleDefinitions = [
	{ name: "admin", description: "Full access to the application" },
	{ name: "user", description: "Standard application access" },
];

const permissionDefinitions = [
	{ slug: "users:read", description: "Read user data" },
	{ slug: "users:manage", description: "Manage users" },
	{ slug: "roles:manage", description: "Manage roles and permissions" },
];

async function seed() {
	const testUserEmail = (
		process.env.TEST_USER_EMAIL ?? "test@example.com"
	).toLowerCase();

	await db.transaction(async (tx) => {
		for (const role of roleDefinitions) {
			await tx.insert(roles).values(role).onConflictDoNothing();
		}

		for (const permission of permissionDefinitions) {
			await tx.insert(permissions).values(permission).onConflictDoNothing();
		}

		const seededRoles = await tx
			.select({ id: roles.id, name: roles.name })
			.from(roles)
			.where(inArray(roles.name, roleDefinitions.map((role) => role.name)));
		const seededPermissions = await tx
			.select({ id: permissions.id, slug: permissions.slug })
			.from(permissions);

		const adminRole = seededRoles.find((role) => role.name === "admin");
		const userRole = seededRoles.find((role) => role.name === "user");
		if (!adminRole || !userRole) {
			throw new Error("Failed to load seeded roles");
		}

		await tx
			.insert(rolesToPermissions)
			.values(
				seededPermissions.map((permission) => ({
					roleId: adminRole.id,
					permissionId: permission.id,
				})),
			)
			.onConflictDoNothing();

		const readPermissions = seededPermissions.filter(
			(permission) => permission.slug === "users:read",
		);
		await tx
			.insert(rolesToPermissions)
			.values(
				readPermissions.map((permission) => ({
					roleId: userRole.id,
					permissionId: permission.id,
				})),
			)
			.onConflictDoNothing();

		const [testUser] = await tx
			.select({ id: users.id })
			.from(users)
			.where(eq(users.email, testUserEmail))
			.limit(1);
		if (!testUser) {
			throw new Error(
				`Test user ${testUserEmail} was not found. Set TEST_USER_EMAIL to an existing user.`,
			);
		}

		await tx
			.insert(usersToRoles)
			.values({ userId: testUser.id, roleId: adminRole.id })
			.onConflictDoNothing();
	});

	console.log(`RBAC seed completed for ${testUserEmail}`);
}

try {
	await seed();
} finally {
	await pool.end();
}