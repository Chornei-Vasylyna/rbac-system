import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DrizzleModule } from "./db/drizzle.module.js";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			expandVariables: true,
		}),
		DrizzleModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
