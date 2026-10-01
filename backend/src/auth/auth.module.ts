import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule, type JwtSignOptions } from "@nestjs/jwt";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { JwtAuthGuard } from "./guards/jwt-auth.guard.js";
import { PermissionsGuard } from "./guards/permissions.guard.js";
import { RolesGuard } from "./guards/roles.guard.js";
import { TokenService } from "./token.service.js";

@Module({
	imports: [
		ConfigModule,
		JwtModule.registerAsync({
			global: true,
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				secret: configService.getOrThrow<string>("JWT_ACCESS_SECRET"),
				signOptions: {
					expiresIn: (configService.get<string>("JWT_ACCESS_EXPIRES_IN") ||
						"15m") as JwtSignOptions["expiresIn"],
				},
			}),
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, TokenService, JwtAuthGuard, RolesGuard, PermissionsGuard],
	exports: [JwtAuthGuard, RolesGuard, PermissionsGuard],
})
export class AuthModule {}
