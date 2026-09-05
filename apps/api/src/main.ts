import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConsoleLogger } from '@remotfix/telemetry';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new ConsoleLogger('remotfix-api');
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  // ADR-0010: Base API path must be /api/v1
  app.setGlobalPrefix('api/v1');

  // Enable CORS for local development
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
