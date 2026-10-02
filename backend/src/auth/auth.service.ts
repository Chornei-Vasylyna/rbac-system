import {
	ConflictException,
	Inject,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { compare, hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import type { Database } from "../db/drizzle.provider.js";
import { DRIZZLE } from "../db/drizzle.provider.js";
import { roles, users, usersToRoles } from "../db/schema/index.js";
import { LoginDto } from "./dto/login.dto.js";
import { RegisterDto } from "./dto/register.dto.js";
import { TokenService } from "./token.service.js";

@Injectable()
export class AuthService {
	constructor(
		@Inject(DRIZZLE) private readonly db: Database,
		private readonly tokenService: TokenService,
	) {}

	async register(dto: RegisterDto) {
		const email = dto.email.toLowerCase();

		const [existingUser] = await this.db
			.select({ id: users.id })
			.from(users)
			.where(eq(users.email, email))
			.limit(1);

		if (existingUser) {
			throw new ConflictException("Email is already registered");
		}

		const user = await this.db.transaction(async (tx) => {
			const [createdUser] = await tx
				.insert(users)
				.values({
					email,
					passwordHash: await hash(dto.password, 12),
				})
				.returning({ id: users.id, email: users.email });

			const [userRole] = await tx
				.select({ id: roles.id })
				.from(roles)
				.where(eq(roles.name, "user"))
				.limit(1);

			if (!userRole) {
				throw new Error('Default role "user" was not found');
			}

			await tx.insert(usersToRoles).values({
				userId: createdUser.id,
				roleId: userRole.id,
			});

			return createdUser;
		});

		return this.tokenService.issueTokens({
			id: user.id,
			email: user.email,
			roles: ["user"],
		});
	}

	async login(dto: LoginDto) {
		const email = dto.email.toLowerCase();

		const [user] = await this.db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.limit(1);

		if (!user?.isActive || !(await compare(dto.password, user.passwordHash))) {
			throw new UnauthorizedException("Invalid email or password");
		}

		const userRoles = await this.db
			.select({ name: roles.name })
			.from(usersToRoles)
			.innerJoin(roles, eq(usersToRoles.roleId, roles.id))
			.where(eq(usersToRoles.userId, user.id));

		return this.tokenService.issueTokens({
			id: user.id,
			email: user.email,
			roles: userRoles.map((role) => role.name),
		});
	}

	refresh(token: string) {
		return this.tokenService.refresh(token);
	}

	logout(token: string) {
		return this.tokenService.logout(token);
	}
}