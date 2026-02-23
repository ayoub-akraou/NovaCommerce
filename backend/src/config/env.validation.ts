type RawEnv = Record<string, unknown>;

const ALLOWED_NODE_ENV = ['development', 'test', 'production'] as const;

function readString(env: RawEnv, key: string): string | undefined {
  const value = env[key];
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function readPort(env: RawEnv, defaultValue: number): number {
  const raw = readString(env, 'PORT');
  if (!raw) {
    return defaultValue;
  }

  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed <= 0 || parsed > 65535) {
    throw new Error('Environment variable PORT must be an integer between 1 and 65535.');
  }

  return parsed;
}

export function validateEnv(env: RawEnv): RawEnv {
  const nodeEnv = readString(env, 'NODE_ENV') ?? 'development';
  if (!ALLOWED_NODE_ENV.includes(nodeEnv as (typeof ALLOWED_NODE_ENV)[number])) {
    throw new Error('Environment variable NODE_ENV must be development, test, or production.');
  }

  const databaseUrl = readString(env, 'DATABASE_URL');
  if (!databaseUrl) {
    throw new Error('Environment variable DATABASE_URL is required.');
  }

  const jwtSecret =
    readString(env, 'JWT_SECRET') ?? 'dev-only-secret-change-this-before-production';
  if (jwtSecret.length < 16) {
    throw new Error('Environment variable JWT_SECRET must have at least 16 characters.');
  }

  const corsOrigin = readString(env, 'CORS_ORIGIN') ?? 'http://localhost:3000';
  const port = readPort(env, 3000);

  return {
    ...env,
    NODE_ENV: nodeEnv,
    DATABASE_URL: databaseUrl,
    JWT_SECRET: jwtSecret,
    CORS_ORIGIN: corsOrigin,
    PORT: port,
  };
}
