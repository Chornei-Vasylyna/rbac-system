import { defineRelations } from "drizzle-orm";
import { permissions } from "./permissions.js";
import { refreshTokens } from "./refresh-tokens.js";
import { roles } from "./roles.js";
import { rolesToPermissions } from "./roles-to-permissions.js";
import { users } from "./users.js";
import { usersToRoles } from "./users-to-roles.js";

const schema = {
	permissions,
	refreshTokens,
	roles,
	rolesToPermissions,
	users,
	usersToRoles,
};

export const relations = defineRelations(schema, (r) => ({
	permissions: {
		rolePermissions: r.many.rolesToPermissions(),
	},
	refreshTokens: {
		user: r.one.users({
			from: r.refreshTokens.userId,
			to: r.users.id,
		}),
	},
	roles: {
		userRoles: r.many.usersToRoles(),
		rolePermissions: r.many.rolesToPermissions(),
	},
	rolesToPermissions: {
		role: r.one.roles({
			from: r.rolesToPermissions.roleId,
			to: r.roles.id,
		}),
		permission: r.one.permissions({
			from: r.rolesToPermissions.permissionId,
			to: r.permissions.id,
		}),
	},
	users: {
		userRoles: r.many.usersToRoles(),
		refreshTokens: r.many.refreshTokens(),
	},
	usersToRoles: {
		user: r.one.users({
			from: r.usersToRoles.userId,
			to: r.users.id,
		}),
		role: r.one.roles({
			from: r.usersToRoles.roleId,
			to: r.roles.id,
		}),
	},
}));
