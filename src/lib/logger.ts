/**
 * @fileoverview Logger system for the Clawz Lab application
 * Provides structured logging with different levels and contexts
 * @author Clawz Lab Team
 * @version 1.0.0
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type LogContext = 'auth' | 'db' | 'api' | 'ui' | 'payment' | 'admin' | 'general';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context: LogContext;
  message: string;
  data?: unknown;
  error?: Error;
  userId?: string;
  sessionId?: string;
}

/**
 * Comprehensive logging system for the Clawz Lab application
 *
 * @example
 * ```typescript
 * const logger = new Logger();
 * logger.info('auth', 'User logged in', { userId: '123' });
 * logger.error('db', 'Database connection failed', undefined, error);
 * ```
 */
class Logger {
  private readonly isDevelopment: boolean;
  private readonly sessionId: string;

  /**
   * Creates a new Logger instance
   * Automatically detects development environment and generates a session ID
   */
  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.sessionId = this.generateSessionId();
  }

  /**
   * Generate a unique session ID for tracking logs
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Format log entry for consistent output
   */
  private formatLogEntry(entry: LogEntry): string {
    const { timestamp, level, context, message, userId } = entry;
    const userInfo = userId ? `[User: ${userId}]` : '[Anonymous]';
    return `[${timestamp}] [${level.toUpperCase()}] [${context}] ${userInfo} ${message}`;
  }

  /**
   * Send logs to external service in production
   */
  private async sendToExternalService(entry: LogEntry): Promise<void> {
    if (this.isDevelopment) return;

    try {
      // In production, send to logging service (e.g., Sentry, LogRocket, etc.)
      if (typeof window !== 'undefined' && 'fetch' in window) {
        await fetch('/api/logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry),
        });
      }
    } catch (error) {
      // Fallback to console if external service fails
      console.error('Failed to send log to external service:', error);
    }
  }

  /**
   * Core logging method
   */
  private log(
    level: LogLevel,
    context: LogContext,
    message: string,
    data?: unknown,
    error?: Error,
    userId?: string,
  ): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      context,
      message,
      data,
      error,
      userId,
      sessionId: this.sessionId,
    };

    const formattedMessage = this.formatLogEntry(entry);

    // Console output based on level
    switch (level) {
      case 'debug':
        if (this.isDevelopment) {
          console.debug(formattedMessage, data);
        }
        break;
      case 'info':
        console.info(formattedMessage, data);
        break;
      case 'warn':
        console.warn(formattedMessage, data);
        break;
      case 'error':
        console.error(formattedMessage, error || data);
        break;
    }

    // Send to external service in production
    this.sendToExternalService(entry).catch(console.error);
  }

  /**
   * Debug level logging (only in development)
   */
  debug(context: LogContext, message: string, data?: unknown, userId?: string): void {
    this.log('debug', context, message, data, undefined, userId);
  }

  /**
   * Info level logging
   */
  info(context: LogContext, message: string, data?: unknown, userId?: string): void {
    this.log('info', context, message, data, undefined, userId);
  }

  /**
   * Warning level logging
   */
  warn(context: LogContext, message: string, data?: unknown, userId?: string): void {
    this.log('warn', context, message, data, undefined, userId);
  }

  /**
   * Error level logging
   */
  error(
    context: LogContext,
    message: string,
    error?: Error,
    data?: unknown,
    userId?: string,
  ): void {
    this.log('error', context, message, data, error, userId);
  }

  /**
   * Authentication specific logging
   */
  auth = {
    loginSuccess: (userId: string) => {
      this.info('auth', 'User login successful', { userId }, userId);
    },
    loginFailed: (error: Error, userId?: string) => {
      this.error('auth', 'User login failed', error, { userId }, userId);
    },
    logout: (userId: string) => {
      this.info('auth', 'User logout', { userId }, userId);
    },
    registerSuccess: (userId: string) => {
      this.info('auth', 'User registration successful', { userId }, userId);
    },
    registerFailed: (error: Error, userId?: string) => {
      this.error('auth', 'User registration failed', error, { userId });
    },
  };

  /**
   * Database specific logging
   */
  db = {
    query: (table: string, operation: string, userId?: string) => {
      this.debug('db', `Database ${operation} on ${table}`, { table, operation }, userId);
    },
    error: (table: string, operation: string, error: Error, userId?: string) => {
      this.error(
        'db',
        `Database ${operation} failed on ${table}`,
        error,
        { table, operation },
        userId,
      );
    },
  };

  /**
   * API specific logging
   */
  api = {
    request: (method: string, path: string, userId?: string) => {
      this.debug('api', `API ${method} ${path}`, { method, path }, userId);
    },
    response: (method: string, path: string, status: number, userId?: string) => {
      this.info(
        'api',
        `API ${method} ${path} - ${status}`,
        { method, path, status },
        userId,
      );
    },
    error: (method: string, path: string, error: Error, userId?: string) => {
      this.error('api', `API ${method} ${path} failed`, error, { method, path }, userId);
    },
  };

  /**
   * UI specific logging
   */
  ui = {
    interaction: (component: string, action: string, userId?: string) => {
      this.debug(
        'ui',
        `User interaction: ${action} on ${component}`,
        { component, action },
        userId,
      );
    },
    error: (component: string, error: Error, userId?: string) => {
      this.error('ui', `UI error in ${component}`, error, { component }, userId);
    },
  };
}

// Export singleton instance
export const logger = new Logger();

/**
 * Error boundary helper for React components
 */
export class ErrorReporter {
  static reportError(
    error: Error,
    context: LogContext,
    userId?: string,
    additionalData?: unknown,
  ): void {
    logger.error(context, error.message, error, additionalData, userId);
  }

  static reportUIError(error: Error, componentName: string, userId?: string): void {
    logger.ui.error(componentName, error, userId);
  }
}

export default logger;
