import { ConfigService } from "@nestjs/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

export const DRIZZLE = Symbol("DRIZZLE_CONNECTION");

export const drizzleProvider = {
	provide: DRIZZLE,
	inject: [ConfigService],
	useFactory: (configService: ConfigService) => {
		const connectionString = configService.get<string>("DATABASE_URL");
		const pool = new Pool({
			connectionString,
		});

		return drizzle({ client: pool });
	},
};
