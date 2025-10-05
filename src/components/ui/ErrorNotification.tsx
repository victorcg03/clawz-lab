/**
 * @fileoverview Error notification component for user-friendly error display
 * @author Clawz Lab Team
 * @version 1.0.0
 */

'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { Button } from '@/components/layout/ui/Button';
import { cn } from '@/lib/cn';
import { AppError, ErrorSeverity, isRetryableError } from '@/lib/errors';
import { X, AlertTriangle, AlertCircle, XCircle, Info } from 'lucide-react';

/**
 * Notification item interface
 */
interface NotificationItem {
  id: string;
  error: AppError;
  timestamp: Date;
  dismissed: boolean;
}

/**
 * Context for error notifications
 */
interface ErrorNotificationContext {
  notifications: NotificationItem[];
  showError: (error: AppError) => void;
  dismissError: (id: string) => void;
  clearAll: () => void;
}

const ErrorNotificationContext = createContext<ErrorNotificationContext | null>(null);

/**
 * Hook to use error notifications
 */
export function useErrorNotification() {
  const context = useContext(ErrorNotificationContext);
  if (!context) {
    throw new Error('useErrorNotification must be used within ErrorNotificationProvider');
  }
  return context;
}

/**
 * Error notification provider component
 */
interface ErrorNotificationProviderProps {
  children: ReactNode;
  maxNotifications?: number;
  autoRemoveDelay?: number;
}

// Helper function to create auto-removal timeout
function createAutoRemovalTimeout(
  id: string,
  delay: number,
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>,
): void {
  setTimeout(() => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, delay);
}

export function ErrorNotificationProvider({
  children,
  maxNotifications = 5,
  autoRemoveDelay = 10000,
}: Readonly<ErrorNotificationProviderProps>) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const showError = useCallback(
    (error: AppError) => {
      const id = `error-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newNotification: NotificationItem = {
        id,
        error,
        timestamp: new Date(),
        dismissed: false,
      };

      setNotifications((prev) => [newNotification, ...prev].slice(0, maxNotifications));

      // Auto-remove after delay for non-critical errors
      if (error.severity !== 'critical') {
        createAutoRemovalTimeout(id, autoRemoveDelay, setNotifications);
      }
    },
    [maxNotifications, autoRemoveDelay],
  );

  const dismissError = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = useMemo<ErrorNotificationContext>(
    () => ({
      notifications,
      showError,
      dismissError,
      clearAll,
    }),
    [notifications, showError, dismissError, clearAll],
  );

  return (
    <ErrorNotificationContext.Provider value={value}>
      {children}
      <ErrorNotificationContainer />
    </ErrorNotificationContext.Provider>
  );
}

/**
 * Get icon for error severity
 */
function getErrorIcon(severity: ErrorSeverity) {
  switch (severity) {
    case 'low':
      return Info;
    case 'medium':
      return AlertTriangle;
    case 'high':
      return AlertCircle;
    case 'critical':
      return XCircle;
    default:
      return AlertTriangle;
  }
}

/**
 * Individual error notification component
 */
interface ErrorNotificationProps {
  notification: NotificationItem;
  onDismiss: () => void;
  onRetry?: () => void;
}

function ErrorNotification({
  notification,
  onDismiss,
  onRetry,
}: Readonly<ErrorNotificationProps>) {
  const { error } = notification;
  const Icon = getErrorIcon(error.severity);
  const canRetry = isRetryableError(error) && onRetry;

  const severityClasses = {
    low: 'border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200',
    medium:
      'border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-200',
    high: 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200',
    critical:
      'border-red-300 bg-red-100 text-red-900 dark:border-red-700 dark:bg-red-900/30 dark:text-red-100',
  };

  const iconClasses = {
    low: 'text-yellow-600 dark:text-yellow-400',
    medium: 'text-orange-600 dark:text-orange-400',
    high: 'text-red-600 dark:text-red-400',
    critical: 'text-red-700 dark:text-red-300',
  };

  return (
    <div
      className={cn(
        'rounded-lg border p-4 shadow-sm transition-all duration-300 ease-in-out',
        'animate-in slide-in-from-right-5 fade-in-0',
        severityClasses[error.severity],
      )}
    >
      <div className="flex items-start gap-3">
        <Icon
          className={cn('h-5 w-5 flex-shrink-0 mt-0.5', iconClasses[error.severity])}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className="font-semibold text-sm mb-1">{error.userMessage.title}</h4>
              <p className="text-sm opacity-90 mb-2">{error.userMessage.description}</p>
              <p className="text-xs opacity-75 font-medium">{error.userMessage.action}</p>
            </div>

            <button
              onClick={onDismiss}
              className="flex-shrink-0 p-1 rounded-md opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Cerrar notificación"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {canRetry && (
            <div className="mt-3 flex gap-2">
              <Button variant="outline" size="sm" onClick={onRetry} className="text-xs">
                Reintentar
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Container for error notifications
 */
function ErrorNotificationContainer() {
  const { notifications, dismissError } = useErrorNotification();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 w-full max-w-sm space-y-2 pointer-events-none">
      {notifications
        .filter((n) => !n.dismissed)
        .map((notification) => (
          <div key={notification.id} className="pointer-events-auto">
            <ErrorNotification
              notification={notification}
              onDismiss={() => dismissError(notification.id)}
            />
          </div>
        ))}
    </div>
  );
}

/**
 * Hook to show errors easily
 */
export function useErrorHandler() {
  const { showError } = useErrorNotification();

  const handleError = useCallback(
    (error: unknown, context?: string, userId?: string) => {
      if (error instanceof AppError) {
        showError(error);
      } else {
        // Convert unknown errors to AppError
        const appError = new (class extends AppError {})(
          'UNKNOWN_ERROR',
          String(error),
          'medium',
          context,
          userId,
        );
        showError(appError);
      }
    },
    [showError],
  );

  return { handleError, showError };
}

export default ErrorNotificationProvider;
