import React, { forwardRef } from 'react';
import clsx from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center rounded px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none',
          variant === 'primary' && 'bg-black text-white hover:bg-neutral-800',
          variant === 'outline' && 'border border-neutral-300 hover:bg-neutral-50',
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';
