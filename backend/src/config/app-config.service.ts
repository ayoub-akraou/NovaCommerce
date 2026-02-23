import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV', 'development');
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get port(): number {
    return this.configService.get<number>('PORT', 3000);
  }

  get databaseUrl(): string {
    return this.configService.getOrThrow<string>('DATABASE_URL');
  }

  get jwtSecret(): string {
    return this.configService.getOrThrow<string>('JWT_SECRET');
  }

  get corsOrigins(): string[] {
    const raw = this.configService.get<string>('CORS_ORIGIN', 'http://localhost:3000');
    return raw
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);
  }

  get loggerLevels(): Array<'log' | 'error' | 'warn' | 'debug' | 'verbose'> {
    return this.isProduction
      ? ['error', 'warn', 'log']
      : ['error', 'warn', 'log', 'debug', 'verbose'];
  }
}
