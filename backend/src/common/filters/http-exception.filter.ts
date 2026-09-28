import {
	type ArgumentsHost,
	Catch,
	type ExceptionFilter,
	HttpException,
	HttpStatus,
} from "@nestjs/common";
import type { Request, Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const request = ctx.getRequest<Request>();
		const response = ctx.getResponse<Response>();

		const status =
			exception instanceof HttpException
				? exception.getStatus()
				: HttpStatus.INTERNAL_SERVER_ERROR;

		if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
            console.error("Internal Server Error caught by filter:", exception);
        }

		const exceptionResponse =
			exception instanceof HttpException
				? exception.getResponse()
				: "Internal Server Error";

		const responseBody =
			typeof exceptionResponse === "string"
				? { message: exceptionResponse }
				: (exceptionResponse as Record<string, unknown>);

		response.status(status).json({
			...responseBody,
			statusCode: status,
			timestamp: new Date().toISOString(),
			path: request.url,
		});
	}
}
