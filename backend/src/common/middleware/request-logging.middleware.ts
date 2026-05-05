import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestLoggingMiddleware.name);

  use(request: Request, response: Response, next: NextFunction) {
    const startedAt = process.hrtime.bigint();

    response.on('finish', () => {
      const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
      const method = request.method;
      const path = request.originalUrl || request.url;
      const status = response.statusCode;
      const level = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'log';

      this.logger[level](`${method} ${path} ${status} ${durationMs.toFixed(1)}ms`);
    });

    next();
  }
}
