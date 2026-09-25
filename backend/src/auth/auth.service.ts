import {
	ConflictException,
	Inject,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import type { JwtService } from "@nestjs/jwt";
import { compare, hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import type { Database } from "../db/drizzle.provider.js";
import { DRIZZLE } from "../db/drizzle.provider.js";
import {
	roles,
	users,
	usersToRoles,
} from "../db/schema/index.js";
import type { AuthenticatedUser, JwtPayload } from "./auth.types.js";
import type { LoginDto } from "./dto/login.dto.js";
import type { RegisterDto } from "./dto/register.dto.js";

@Injectable()
export class AuthService {
	constructor(
		@Inject(DRIZZLE) private readonly db: Database,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
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

		const [user] = await this.db
			.insert(users)
			.values({
				email,
				passwordHash: await hash(dto.password, 12),
				fullName: dto.fullName,
			})
			.returning({ id: users.id, email: users.email });

		return this.issueToken({ id: user.id, email: user.email, roles: [] });
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

		return this.issueToken({
			id: user.id,
			email: user.email,
			roles: userRoles.map((role) => role.name),
		});
	}

	private async issueToken(user: AuthenticatedUser) {
		const payload: JwtPayload = {
			sub: user.id,
			email: user.email,
			roles: user.roles,
		};
		const accessToken = await this.jwtService.signAsync(payload);

		const expiresIn =
			this.configService.get<string>("JWT_ACCESS_EXPIRES_IN") || "15m";

		return {
			accessToken,
			expiresIn,
			user,
		};
	}
}