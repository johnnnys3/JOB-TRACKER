import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const isHttpException = exception instanceof HttpException;
    const status = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = isHttpException ? exception.getResponse() : null;
    const message = this.getMessage(exceptionResponse, exception);
    const error = this.getError(exceptionResponse, status);

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.originalUrl || request.url} failed with ${status}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    response.status(status).json({
      statusCode: status,
      message,
      error,
      path: request.originalUrl || request.url,
      timestamp: new Date().toISOString(),
    });
  }

  private getMessage(exceptionResponse: unknown, exception: unknown) {
    if (typeof exceptionResponse === 'object' && exceptionResponse !== null && 'message' in exceptionResponse) {
      return (exceptionResponse as { message: unknown }).message;
    }

    if (exception instanceof Error) {
      return exception.message;
    }

    return 'Internal server error';
  }

  private getError(exceptionResponse: unknown, status: number) {
    if (typeof exceptionResponse === 'object' && exceptionResponse !== null && 'error' in exceptionResponse) {
      return (exceptionResponse as { error: unknown }).error;
    }

    return status === HttpStatus.INTERNAL_SERVER_ERROR ? 'Internal Server Error' : 'Error';
  }
}
