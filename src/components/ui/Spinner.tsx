/**
 * @fileoverview Loading spinner component with multiple variants
 * @author Clawz Lab Team
 * @version 1.0.0
 */

import { cn } from '@/lib/cn';

/**
 * Props for the Spinner component
 */
interface SpinnerProps extends React.HTMLAttributes<HTMLElement> {
  /** Size variant of the spinner */
  size?: 'sm' | 'md' | 'lg';
  /** Custom className for additional styling */
  className?: string;
}

/**
 * Loading spinner component with size variants
 *
 * @example
 * ```tsx
 * <Spinner size="lg" className="text-blue-500" />
 * ```
 */
export function Spinner({ size = 'md', className, ...props }: Readonly<SpinnerProps>) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <output
      className={cn(
        'animate-spin rounded-full border-2 border-gray-300 border-t-gray-600 dark:border-gray-600 dark:border-t-gray-300',
        sizeClasses[size],
        className,
      )}
      aria-label="Loading"
      {...props}
    >
      <span className="sr-only">Cargando...</span>
    </output>
  );
}
