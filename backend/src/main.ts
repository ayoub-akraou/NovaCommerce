import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppConfigService } from './config/app-config.service.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const config = app.get(AppConfigService);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('NovaCommerce API')
    .setDescription('Backend API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  app.useLogger(config.loggerLevels);
  app.enableCors({
    origin: config.corsOrigins,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  try {
    await app.listen(config.port);
    Logger.log(
      `API started on port ${config.port} (${config.nodeEnv})`,
      'Bootstrap',
    );
  } catch (error) {
    const stack = error instanceof Error ? error.stack : String(error);
    Logger.error('Application failed to start', stack, 'Bootstrap');
    process.exit(1);
  }
}
bootstrap();
