import { forwardRef } from 'react';
import { cn } from '@/lib/cn';

/**
 * Button reutilizable basado en design tokens.
 * Variants: primary | outline | ghost | subtle
 * Size: sm | md | lg
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      className,
      loading,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...rest
    },
    ref,
  ) => {
    const base =
      'btn-base focus-ring font-medium disabled:opacity-50 disabled:cursor-not-allowed';
    const variants: Record<string, string> = {
      primary: 'btn-primary btn-shadow-sm',
      outline: 'btn-outline',
      ghost: 'btn-ghost',
      subtle: 'btn-subtle',
    };
    const sizes: Record<string, string> = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-5 text-sm',
      lg: 'h-12 px-7 text-sm',
    };
    const isDisabled = disabled || loading;
    return (
      <button
        ref={ref}
        className={cn(
          base,
          variants[variant],
          sizes[size],
          isDisabled && 'btn-disabled',
          className,
        )}
        disabled={isDisabled}
        {...rest}
      >
        {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        <span className="inline-flex items-center gap-2">
          {loading && (
            <span
              aria-hidden="true"
              className="size-3 rounded-full border-2 border-current border-r-transparent animate-spin"
            />
          )}
          {children}
        </span>
        {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </button>
    );
  },
);
Button.displayName = 'Button';
