/**
 * @fileoverview Card component for content organization
 * @author Clawz Lab Team
 * @version 1.0.0
 */

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Props for the Card component
 */
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Card content */
  children: ReactNode;
  /** Visual variant of the card */
  variant?: 'default' | 'elevated' | 'outlined';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the card is interactive (hover effects) */
  interactive?: boolean;
}

/**
 * Card component for organizing content with consistent styling
 *
 * @example
 * ```tsx
 * <Card variant="elevated" interactive>
 *   <CardHeader>
 *     <CardTitle>Product Name</CardTitle>
 *   </CardHeader>
 *   <CardContent>
 *     <p>Product description</p>
 *   </CardContent>
 * </Card>
 * ```
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = 'default',
      size = 'md',
      interactive = false,
      className,
      ...props
    },
    ref,
  ) => {
    const variantClasses = {
      default: 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800',
      elevated:
        'bg-white dark:bg-gray-900 shadow-lg border border-gray-100 dark:border-gray-800',
      outlined: 'bg-transparent border-2 border-gray-300 dark:border-gray-700',
    };

    const sizeClasses = {
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg transition-all duration-200',
          variantClasses[variant],
          sizeClasses[size],
          interactive && 'hover:shadow-md hover:scale-[1.02] cursor-pointer',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';

/**
 * Props for card sub-components
 */
interface CardSubComponentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/**
 * Card header component
 */
export const CardHeader = forwardRef<HTMLDivElement, CardSubComponentProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 pb-3', className)} {...props}>
      {children}
    </div>
  ),
);

CardHeader.displayName = 'CardHeader';

/**
 * Card title component
 */
export const CardTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement> & { children: ReactNode }
>(({ children, className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  >
    {children}
  </h3>
));

CardTitle.displayName = 'CardTitle';

/**
 * Card description component
 */
export const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement> & { children: ReactNode }
>(({ children, className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-gray-600 dark:text-gray-400', className)}
    {...props}
  >
    {children}
  </p>
));

CardDescription.displayName = 'CardDescription';

/**
 * Card content component
 */
export const CardContent = forwardRef<HTMLDivElement, CardSubComponentProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn('pt-0', className)} {...props}>
      {children}
    </div>
  ),
);

CardContent.displayName = 'CardContent';

/**
 * Card footer component
 */
export const CardFooter = forwardRef<HTMLDivElement, CardSubComponentProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center pt-3', className)} {...props}>
      {children}
    </div>
  ),
);

CardFooter.displayName = 'CardFooter';
