import { ConfigService } from "@nestjs/config";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema/index.js";

export const DRIZZLE = Symbol("DRIZZLE_CONNECTION");

export const drizzleProvider = {
	provide: DRIZZLE,
	inject: [ConfigService],
	useFactory: (configService: ConfigService) => {
		const connectionString = configService.get<string>("DATABASE_URL");
		const pool = new Pool({
			connectionString,
		});

		return drizzle({ client: pool, relations: schema.relations });
	},
};

export type Database = NodePgDatabase<typeof schema.relations>;
