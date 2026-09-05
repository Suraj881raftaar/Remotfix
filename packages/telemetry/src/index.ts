/**
 * @remotfix/telemetry — Monorepo Foundation Telemetry (M1)
 *
 * Provides shared logger abstraction and structured event formats.
 * External production providers (Sentry, PostHog) are NOT activated in M1.
 */

export interface LogContext {
  organizationId?: string;
  userId?: string;
  requestId?: string;
  [key: string]: unknown;
}

export interface ILogger {
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, error?: Error | unknown, context?: LogContext): void;
  debug(message: string, context?: LogContext): void;
}

/**
 * Standard structured console logger for local and container logging.
 */
export class ConsoleLogger implements ILogger {
  constructor(private readonly serviceName: string = 'remotfix') {}

  private format(level: string, message: string, context?: LogContext): string {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      service: this.serviceName,
      level,
      message,
      ...context,
    });
  }

  info(message: string, context?: LogContext): void {
    console.log(this.format('INFO', message, context));
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.format('WARN', message, context));
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorDetails = error instanceof Error
      ? { errorName: error.name, errorMessage: error.message, stack: error.stack }
      : { errorPayload: error };

    console.error(this.format('ERROR', message, { ...context, ...errorDetails }));
  }

  debug(message: string, context?: LogContext): void {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(this.format('DEBUG', message, context));
    }
  }
}
