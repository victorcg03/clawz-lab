/**
 * @fileoverview Toast notification component for user feedback
 * @author Clawz Lab Team
 * @version 1.0.0
 */

import { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/cn';

/**
 * Toast notification type
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * Props for the Toast component
 */
interface ToastProps {
  /** Toast message content */
  message: string;
  /** Type of notification */
  type: ToastType;
  /** Duration in milliseconds before auto-dismiss */
  duration?: number;
  /** Whether the toast is visible */
  isVisible: boolean;
  /** Callback when toast is dismissed */
  onDismiss: () => void;
  /** Custom className for additional styling */
  className?: string;
}

/**
 * Toast notification component for user feedback
 *
 * @example
 * ```tsx
 * <Toast
 *   message="Profile saved successfully"
 *   type="success"
 *   isVisible={showToast}
 *   onDismiss={() => setShowToast(false)}
 * />
 * ```
 */
export function Toast({
  message,
  type,
  duration = 4000,
  isVisible,
  onDismiss,
  className,
}: Readonly<ToastProps>) {
  const [isExiting, setIsExiting] = useState(false);

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setIsExiting(false);
      onDismiss();
    }, 300);
  }, [onDismiss]);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      handleDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [isVisible, duration, handleDismiss]);

  if (!isVisible && !isExiting) return null;

  const typeStyles = {
    success:
      'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200',
    error:
      'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200',
    warning:
      'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200',
    info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200',
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 max-w-sm w-full p-4 rounded-lg border shadow-lg transition-all duration-300 ease-in-out',
        typeStyles[type],
        isVisible && !isExiting
          ? 'transform translate-x-0 opacity-100'
          : 'transform translate-x-full opacity-0',
        className,
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <span className="text-lg font-medium" aria-hidden="true">
          {icons[type]}
        </span>
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-current hover:opacity-70 transition-opacity"
          aria-label="Cerrar notificación"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
