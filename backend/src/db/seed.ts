import "dotenv/config";
import { hash } from "bcryptjs";
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
	{ slug: "profile:read", description: "Read own profile" },
	{ slug: "users:read", description: "Read user data" },
	{ slug: "users:manage", description: "Manage users" },
	{ slug: "roles:manage", description: "Manage roles and permissions" },
];

async function seed() {
	const adminEmail = (
		process.env.TEST_USER_EMAIL ?? "admin@example.com"
	).toLowerCase();
	const testUserPassword = process.env.TEST_USER_PASSWORD ?? "12345678";
	const seededUserEmails = [
		"test@gmail.com",
		"test2@gmail.com",
		"test3@gmail.com",
		"test4@gmail.com",
		"test5@gmail.com",
		"test6@gmail.com",
		"test7@gmail.com",
	].filter((email) => email !== adminEmail);
	const seedUsers: Array<{ email: string; roleId: "admin" | "user" }> = [
		{ email: adminEmail, roleId: "admin" },
		...seededUserEmails.map(
			(email): { email: string; roleId: "user" } => ({
				email,
				roleId: "user",
			}),
		),
	];

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

		const profilePermissions = seededPermissions.filter(
			(permission) => permission.slug === "profile:read",
		);
		await tx
			.delete(rolesToPermissions)
			.where(eq(rolesToPermissions.roleId, userRole.id));
		await tx
			.insert(rolesToPermissions)
			.values(
				profilePermissions.map((permission) => ({
					roleId: userRole.id,
					permissionId: permission.id,
				})),
			)
			.onConflictDoNothing();

		const passwordHash = await hash(testUserPassword, 12);
		const roleIds = {
			admin: adminRole.id,
			user: userRole.id,
		} as const;

		for (const seedUser of seedUsers) {
			let [user] = await tx
				.select({ id: users.id })
				.from(users)
				.where(eq(users.email, seedUser.email))
				.limit(1);

			if (!user) {
				[user] = await tx
					.insert(users)
					.values({
						email: seedUser.email,
						passwordHash,
					})
					.returning({ id: users.id });
			}

			if (!user) {
				throw new Error(`Failed to create seed user ${seedUser.email}`);
			}

			await tx
				.update(users)
				.set({ passwordHash, updatedAt: new Date() })
				.where(eq(users.id, user.id));

			await tx
				.insert(usersToRoles)
				.values({ userId: user.id, roleId: roleIds[seedUser.roleId] })
				.onConflictDoNothing();
		}
	});

	console.log(
		`RBAC seed completed for ${seedUsers.length} users. Admin: ${adminEmail}`,
	);
}

try {
	await seed();
} finally {
	await pool.end();
}