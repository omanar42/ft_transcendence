import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

		if (request.url.startsWith('/auth/google/callback') && request.query.error) {
      return response.redirect(process.env.FRONTEND_URL + '/login');
    }

		if (request.url.startsWith('/auth/42/callback') && request.query.error) {
      return response.redirect(process.env.FRONTEND_URL + '/login');
    }

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}
