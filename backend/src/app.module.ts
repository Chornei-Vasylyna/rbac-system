import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module.js";
import { DrizzleModule } from "./db/drizzle.module.js";
import { RolesModule } from "./roles/roles.module.js";
import { UsersModule } from "./users/users.module.js";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			expandVariables: true,
		}),
		DrizzleModule,
		AuthModule,
		RolesModule,
		UsersModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
