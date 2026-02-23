import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ForbiddenException, Logger, ValidationPipe } from '@nestjs/common';
import { AppConfigService } from './config/app-config.service.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const config = app.get(AppConfigService);

  app.useLogger(config.loggerLevels);
  app.enableCors({
    origin: config.corsOrigins,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  )
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
