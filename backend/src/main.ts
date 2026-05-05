import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { NextFunction, Request, Response } from 'express';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.getHttpAdapter().getInstance().set('trust proxy', 1);
  
  // Use cookie parser middleware
  app.use(cookieParser());

  const corsOrigins = (process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:3000')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);

  // Enable CORS
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  if (process.env.NODE_ENV === 'production') {
    app.use((request: Request, response: Response, next: NextFunction) => {
      if (SAFE_METHODS.has(request.method)) {
        next();
        return;
      }

      const requestOrigin = getRequestOrigin(request);
      if (!requestOrigin || !corsOrigins.includes(requestOrigin)) {
        response.status(403).json({
          statusCode: 403,
          message: 'Forbidden origin',
          error: 'Forbidden',
        });
        return;
      }

      next();
    });
  }

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Application is running on port ${port}`);
}
bootstrap();

function getRequestOrigin(request: Request) {
  const origin = request.headers.origin;
  if (typeof origin === 'string' && origin) {
    return origin;
  }

  const referer = request.headers.referer;
  if (typeof referer !== 'string' || !referer) {
    return null;
  }

  try {
    return new URL(referer).origin;
  } catch {
    return null;
  }
}
