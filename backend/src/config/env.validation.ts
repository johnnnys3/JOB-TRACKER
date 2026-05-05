const PRODUCTION_PLACEHOLDERS = [
  'your-super-secret-jwt-key-change-this-in-production',
  'your-super-secure-jwt-secret-for-production-min-32-chars',
  'replace-with-a-random-secret-at-least-32-characters',
];

const parsePositiveInteger = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

export function validateEnvironment(config: Record<string, string | undefined>) {
  const nodeEnv = config.NODE_ENV || 'development';
  const jwtSecret = config.JWT_SECRET;
  const databaseUrl = config.DATABASE_URL;
  const bcryptRounds = parsePositiveInteger(config.BCRYPT_ROUNDS, nodeEnv === 'production' ? 12 : 10);
  const slowQueryThresholdMs = parsePositiveInteger(config.SLOW_QUERY_THRESHOLD_MS, 250);

  if (!databaseUrl) {
    throw new Error('DATABASE_URL must be set');
  }

  if (!jwtSecret) {
    throw new Error('JWT_SECRET must be set');
  }

  if (nodeEnv === 'production') {
    if (jwtSecret.length < 32 || PRODUCTION_PLACEHOLDERS.includes(jwtSecret)) {
      throw new Error('JWT_SECRET must be a non-placeholder value with at least 32 characters in production');
    }

    if (!config.FRONTEND_URL && !config.CORS_ORIGIN) {
      throw new Error('FRONTEND_URL or CORS_ORIGIN must be set in production');
    }

    if (databaseUrl.includes('localhost') || databaseUrl.includes('username:password')) {
      throw new Error('DATABASE_URL must point to a production database in production');
    }

    if (!databaseUrl.includes('connection_limit=')) {
      throw new Error('DATABASE_URL must include connection_limit for production pooling control');
    }

    if (bcryptRounds < 12) {
      throw new Error('BCRYPT_ROUNDS must be at least 12 in production');
    }

    const requiredMailConfig = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'MAIL_FROM'];
    for (const key of requiredMailConfig) {
      if (!config[key]) {
        throw new Error(`${key} must be set in production`);
      }
    }
  }

  return {
    ...config,
    NODE_ENV: nodeEnv,
    BCRYPT_ROUNDS: bcryptRounds.toString(),
    SLOW_QUERY_THRESHOLD_MS: slowQueryThresholdMs.toString(),
  };
}
