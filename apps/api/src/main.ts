import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConsoleLogger } from '@remotfix/telemetry';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new ConsoleLogger('remotfix-api');
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  // Enable trusted proxy for accurate client IP resolution behind reverse proxies (SEC-08)
  const httpAdapter = app.getHttpAdapter();
  if (typeof httpAdapter.getInstance === 'function') {
    const expressInstance = httpAdapter.getInstance();
    if (expressInstance && typeof expressInstance.set === 'function') {
      expressInstance.set('trust proxy', 1);
    }
  }

  // Enable cookie parser for secure HTTP-only refresh tokens (D-M4-01)
  app.use(cookieParser());

  // ADR-0010: Base API path must be /api/v1
  app.setGlobalPrefix('api/v1');

  // Enable CORS for web client
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  // ADR-0010: OpenAPI 3.x contract definition
  const config = new DocumentBuilder()
    .setTitle('REMOTFIX API')
    .setDescription('REMOTFIX Modular Monolith API Specification')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.info(`REMOTFIX API started successfully on port ${port}`, {
    apiPrefix: '/api/v1',
    docsPath: '/api/docs',
    port,
  });
}

bootstrap().catch((err) => {
  const logger = new ConsoleLogger('remotfix-api');
  logger.error('Failed to bootstrap REMOTFIX API', err);
  process.exit(1);
});
