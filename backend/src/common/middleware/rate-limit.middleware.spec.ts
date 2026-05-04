import { HttpException, HttpStatus } from '@nestjs/common';
import { RateLimitMiddleware } from './rate-limit.middleware';

describe('RateLimitMiddleware', () => {
  const originalRateLimitMax = process.env.RATE_LIMIT_MAX;
  const originalRateLimitWindowMs = process.env.RATE_LIMIT_WINDOW_MS;

  beforeEach(() => {
    process.env.RATE_LIMIT_MAX = '2';
    process.env.RATE_LIMIT_WINDOW_MS = '1000';
    jest.spyOn(Date, 'now').mockReturnValue(1_000);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    process.env.RATE_LIMIT_MAX = originalRateLimitMax;
    process.env.RATE_LIMIT_WINDOW_MS = originalRateLimitWindowMs;
  });

  const createRequest = (ip: string) => ({
    ip,
    headers: {},
    socket: {},
  });

  const createResponse = () => ({
    setHeader: jest.fn(),
  });

  it('allows requests within the configured limit and sets rate limit headers', () => {
    const middleware = new RateLimitMiddleware();
    const request = createRequest('127.0.0.1') as any;
    const response = createResponse() as any;
    const next = jest.fn();

    middleware.use(request, response, next);
    middleware.use(request, response, next);

    expect(next).toHaveBeenCalledTimes(2);
    expect(response.setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', '2');
    expect(response.setHeader).toHaveBeenCalledWith('X-RateLimit-Remaining', '0');
    expect(response.setHeader).toHaveBeenCalledWith('X-RateLimit-Reset', '2');
  });

  it('rejects requests after the configured limit is reached', () => {
    const middleware = new RateLimitMiddleware();
    const request = createRequest('127.0.0.1') as any;
    const response = createResponse() as any;
    const next = jest.fn();

    middleware.use(request, response, next);
    middleware.use(request, response, next);

    expect(() => middleware.use(request, response, next)).toThrow(HttpException);
    expect(() => middleware.use(request, response, next)).toThrow('Rate limit exceeded');
    try {
      middleware.use(request, response, next);
    } catch (error) {
      expect((error as HttpException).getStatus()).toBe(HttpStatus.TOO_MANY_REQUESTS);
    }
    expect(next).toHaveBeenCalledTimes(2);
  });

  it('starts a new request window after the reset time', () => {
    const middleware = new RateLimitMiddleware();
    const request = createRequest('127.0.0.1') as any;
    const response = createResponse() as any;
    const next = jest.fn();

    middleware.use(request, response, next);
    middleware.use(request, response, next);
    (Date.now as jest.Mock).mockReturnValue(2_001);
    middleware.use(request, response, next);

    expect(next).toHaveBeenCalledTimes(3);
  });

  it('tracks forwarded client addresses independently', () => {
    const middleware = new RateLimitMiddleware();
    const response = createResponse() as any;
    const next = jest.fn();
    const firstClient = {
      ...createRequest('127.0.0.1'),
      headers: { 'x-forwarded-for': '203.0.113.10, 10.0.0.1' },
    } as any;
    const secondClient = {
      ...createRequest('127.0.0.1'),
      headers: { 'x-forwarded-for': '203.0.113.11' },
    } as any;

    middleware.use(firstClient, response, next);
    middleware.use(firstClient, response, next);
    middleware.use(secondClient, response, next);

    expect(next).toHaveBeenCalledTimes(3);
  });
});
