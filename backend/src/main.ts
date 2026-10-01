import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module.js";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter.js";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const configService = app.get(ConfigService);

	app.use(cookieParser());
	app.enableCors({
		origin: configService.get<string>("FRONTEND_URL") ?? "http://localhost:5173",
		credentials: true,
	});

	app.setGlobalPrefix("api");

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
			exceptionFactory: (errors) => {
				const formattedErrors = errors.reduce(
					(acc, error) => {
						acc[error.property] = Object.values(error.constraints ?? {})[0];
						return acc;
					},
					{} as Record<string, string>,
				);

				return new BadRequestException({
					statusCode: 400,
					errors: formattedErrors,
				});
			},
		}),
	);

	app.useGlobalFilters(new HttpExceptionFilter());

	const port = configService.get<number>("PORT") ?? 3000;

	await app.listen(port);
}
await bootstrap();
