import { Global, Module } from "@nestjs/common";
import { DRIZZLE, drizzleProvider } from "./drizzle.provider.js";

@Global()
@Module({
	providers: [drizzleProvider],
	exports: [DRIZZLE],
})
export class DrizzleModule {}
