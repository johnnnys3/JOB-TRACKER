import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

type ClientWindow = {
  count: number;
  resetAt: number;
};

const DEFAULT_WINDOW_MS = 60 * 1000;
const DEFAULT_MAX_REQUESTS = 100;

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private readonly clients = new Map<string, ClientWindow>();
  private readonly windowMs = this.readPositiveNumber(process.env.RATE_LIMIT_WINDOW_MS, DEFAULT_WINDOW_MS);
  private readonly maxRequests = this.readPositiveNumber(process.env.RATE_LIMIT_MAX, DEFAULT_MAX_REQUESTS);

  use(request: Request, response: Response, next: NextFunction) {
    const now = Date.now();
    const clientId = this.getClientId(request);
    const currentWindow = this.clients.get(clientId);

    if (!currentWindow || currentWindow.resetAt <= now) {
      this.clients.set(clientId, {
        count: 1,
        resetAt: now + this.windowMs,
      });
      this.setRateLimitHeaders(response, this.maxRequests - 1, now + this.windowMs);
      next();
      return;
    }

    if (currentWindow.count >= this.maxRequests) {
      this.setRateLimitHeaders(response, 0, currentWindow.resetAt);
      throw new HttpException('Rate limit exceeded', HttpStatus.TOO_MANY_REQUESTS);
    }

    currentWindow.count += 1;
    this.setRateLimitHeaders(response, this.maxRequests - currentWindow.count, currentWindow.resetAt);
    next();
  }

  private getClientId(request: Request) {
    const forwardedFor = request.headers['x-forwarded-for'];

    if (typeof forwardedFor === 'string' && forwardedFor.trim()) {
      return forwardedFor.split(',')[0].trim();
    }

    return request.ip || request.socket.remoteAddress || 'unknown';
  }

  private setRateLimitHeaders(response: Response, remaining: number, resetAt: number) {
    response.setHeader('X-RateLimit-Limit', this.maxRequests.toString());
    response.setHeader('X-RateLimit-Remaining', Math.max(remaining, 0).toString());
    response.setHeader('X-RateLimit-Reset', Math.ceil(resetAt / 1000).toString());
  }

  private readPositiveNumber(value: string | undefined, fallback: number) {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  }
}
