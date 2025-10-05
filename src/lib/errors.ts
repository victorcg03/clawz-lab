/**
 * @fileoverview Error management system with user-friendly messages
 * Provides consistent error handling across the application
 * @author Clawz Lab Team
 * @version 1.0.0
 */

import { logger } from './logger';

/**
 * Error types for categorization
 */
export type ErrorType =
  | 'VALIDATION_ERROR'
  | 'AUTHENTICATION_ERROR'
  | 'AUTHORIZATION_ERROR'
  | 'NETWORK_ERROR'
  | 'DATABASE_ERROR'
  | 'FILE_UPLOAD_ERROR'
  | 'PAYMENT_ERROR'
  | 'RATE_LIMIT_ERROR'
  | 'UNKNOWN_ERROR';

/**
 * Error severity levels
 */
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

/**
 * User-friendly error messages in Spanish
 */
const ERROR_MESSAGES: Record<
  ErrorType,
  { title: string; description: string; action: string }
> = {
  VALIDATION_ERROR: {
    title: 'Datos incompletos',
    description: 'Por favor, verifica la información ingresada',
    action: 'Revisa los campos marcados en rojo',
  },
  AUTHENTICATION_ERROR: {
    title: 'Error de autenticación',
    description: 'No pudimos verificar tu identidad',
    action: 'Intenta iniciar sesión nuevamente',
  },
  AUTHORIZATION_ERROR: {
    title: 'Acceso denegado',
    description: 'No tienes permisos para realizar esta acción',
    action: 'Contacta al administrador si crees que es un error',
  },
  NETWORK_ERROR: {
    title: 'Problema de conexión',
    description: 'No pudimos conectar con nuestros servidores',
    action: 'Verifica tu conexión a internet e inténtalo de nuevo',
  },
  DATABASE_ERROR: {
    title: 'Error del sistema',
    description: 'Ocurrió un problema interno en nuestros servidores',
    action: 'Intenta de nuevo en unos momentos',
  },
  FILE_UPLOAD_ERROR: {
    title: 'Error al subir archivo',
    description: 'No pudimos procesar el archivo seleccionado',
    action: 'Verifica que el archivo sea válido y no supere 10MB',
  },
  PAYMENT_ERROR: {
    title: 'Error en el pago',
    description: 'No pudimos procesar tu método de pago',
    action: 'Verifica los datos de tu tarjeta o intenta otro método',
  },
  RATE_LIMIT_ERROR: {
    title: 'Demasiadas solicitudes',
    description: 'Has realizado muchas acciones muy rápido',
    action: 'Espera unos momentos antes de intentar nuevamente',
  },
  UNKNOWN_ERROR: {
    title: 'Error inesperado',
    description: 'Algo salió mal, pero estamos trabajando para solucionarlo',
    action: 'Intenta de nuevo o contacta soporte si persiste',
  },
};

/**
 * Application error class with enhanced information and user-friendly messages
 *
 * @example
 * ```typescript
 * throw new AppError(
 *   'VALIDATION_ERROR',
 *   'Invalid email format',
 *   'medium',
 *   'auth'
 * );
 * ```
 */
export class AppError extends Error {
  /** Error category for proper handling */
  public readonly type: ErrorType;
  /** Severity level for prioritization */
  public readonly severity: ErrorSeverity;
  /** User-friendly error message in Spanish */
  public readonly userMessage: { title: string; description: string; action: string };
  /** When the error occurred */
  public readonly timestamp: Date;
  /** Application context where error occurred */
  public readonly context?: string;
  /** User ID if available */
  public readonly userId?: string;

  constructor(
    type: ErrorType,
    message: string,
    severity: ErrorSeverity = 'medium',
    context?: string,
    userId?: string,
    originalError?: Error,
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.severity = severity;
    this.userMessage = ERROR_MESSAGES[type];
    this.timestamp = new Date();
    this.context = context;
    this.userId = userId;

    if (originalError) {
      this.stack = originalError.stack;
    }

    // Log the error immediately
    logger.error(
      (context as 'auth' | 'db' | 'api' | 'ui' | 'payment' | 'admin' | 'general') ||
        'general',
      message,
      originalError || this,
      { type, severity },
      userId,
    );
  }
}

/**
 * Error factory for common error types
 */
export class ErrorFactory {
  /**
   * Create validation error
   */
  static validation(message: string, context?: string, userId?: string): AppError {
    return new AppError('VALIDATION_ERROR', message, 'low', context, userId);
  }

  /**
   * Create authentication error
   */
  static authentication(message: string, context?: string, userId?: string): AppError {
    return new AppError('AUTHENTICATION_ERROR', message, 'medium', context, userId);
  }

  /**
   * Create authorization error
   */
  static authorization(message: string, context?: string, userId?: string): AppError {
    return new AppError('AUTHORIZATION_ERROR', message, 'medium', context, userId);
  }

  /**
   * Create network error
   */
  static network(
    message: string,
    context?: string,
    userId?: string,
    originalError?: Error,
  ): AppError {
    return new AppError('NETWORK_ERROR', message, 'high', context, userId, originalError);
  }

  /**
   * Create database error
   */
  static database(
    message: string,
    context?: string,
    userId?: string,
    originalError?: Error,
  ): AppError {
    return new AppError(
      'DATABASE_ERROR',
      message,
      'critical',
      context,
      userId,
      originalError,
    );
  }

  /**
   * Create file upload error
   */
  static fileUpload(message: string, context?: string, userId?: string): AppError {
    return new AppError('FILE_UPLOAD_ERROR', message, 'medium', context, userId);
  }

  /**
   * Create payment error
   */
  static payment(
    message: string,
    context?: string,
    userId?: string,
    originalError?: Error,
  ): AppError {
    return new AppError('PAYMENT_ERROR', message, 'high', context, userId, originalError);
  }

  /**
   * Create rate limit error
   */
  static rateLimit(message: string, context?: string, userId?: string): AppError {
    return new AppError('RATE_LIMIT_ERROR', message, 'low', context, userId);
  }

  /**
   * Create unknown error from any error
   */
  static fromError(error: unknown, context?: string, userId?: string): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof Error) {
      return new AppError(
        'UNKNOWN_ERROR',
        error.message,
        'medium',
        context,
        userId,
        error,
      );
    }

    return new AppError('UNKNOWN_ERROR', String(error), 'medium', context, userId);
  }
}

/**
 * Error boundary utility for async operations
 */
export class ErrorBoundary {
  /**
   * Wrap async function with error handling
   */
  static async wrapAsync<T>(
    fn: () => Promise<T>,
    context: string,
    userId?: string,
  ): Promise<{ success: true; data: T } | { success: false; error: AppError }> {
    try {
      const data = await fn();
      return { success: true, data };
    } catch (error) {
      const appError = ErrorFactory.fromError(error, context, userId);
      return { success: false, error: appError };
    }
  }

  /**
   * Wrap sync function with error handling
   */
  static wrap<T>(
    fn: () => T,
    context: string,
    userId?: string,
  ): { success: true; data: T } | { success: false; error: AppError } {
    try {
      const data = fn();
      return { success: true, data };
    } catch (error) {
      const appError = ErrorFactory.fromError(error, context, userId);
      return { success: false, error: appError };
    }
  }
}

/**
 * Utility to check if error is retryable
 */
export function isRetryableError(error: AppError): boolean {
  const retryableTypes: ErrorType[] = ['NETWORK_ERROR', 'RATE_LIMIT_ERROR'];
  return retryableTypes.includes(error.type);
}

/**
 * Utility to get error notification color
 */
export function getErrorColor(severity: ErrorSeverity): string {
  const colors = {
    low: 'yellow',
    medium: 'orange',
    high: 'red',
    critical: 'red',
  };
  return colors[severity];
}

/**
 * Convert Supabase errors to AppErrors
 */
export function handleSupabaseError(
  error: unknown,
  context: string,
  userId?: string,
): AppError {
  if (!error) {
    return ErrorFactory.fromError(new Error('Unknown Supabase error'), context, userId);
  }

  // Type guard for error-like objects
  const isErrorLike = (err: unknown): err is { message?: string; code?: string } => {
    return typeof err === 'object' && err !== null;
  };

  if (!isErrorLike(error)) {
    return ErrorFactory.fromError(error, context, userId);
  }

  const message = error.message || 'Unknown error';
  const code = error.code;

  // Authentication errors
  if (message.includes('Invalid login credentials')) {
    return ErrorFactory.authentication('Credenciales incorrectas', context, userId);
  }

  if (message.includes('Email not confirmed')) {
    return ErrorFactory.authentication('Email no confirmado', context, userId);
  }

  // Authorization errors
  if (code === 'PGRST301' || message.includes('RLS')) {
    return ErrorFactory.authorization(
      'No tienes permisos para acceder a este recurso',
      context,
      userId,
    );
  }

  // Network errors
  if (code === 'NETWORK_ERROR' || message.includes('fetch')) {
    return ErrorFactory.network(
      'Error de conexión con la base de datos',
      context,
      userId,
      error as Error,
    );
  }

  // Database errors
  if (code?.startsWith('PG') || message.includes('database')) {
    return ErrorFactory.database(
      'Error en la base de datos',
      context,
      userId,
      error as Error,
    );
  }

  // Default to database error for unhandled Supabase errors
  return ErrorFactory.database(message, context, userId, error as Error);
}

export default ErrorFactory;
