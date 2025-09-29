import React, { forwardRef } from 'react';
import { cn } from '@/lib/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  variant?: 'default' | 'glass';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, variant = 'default', ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={cn(
            // Base styles
            'w-full px-4 py-3 text-sm transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            // Variant styles
            variant === 'default' &&
              'border border-neutral-300 rounded-lg bg-white focus:ring-purple-500 focus:border-purple-500 placeholder:text-neutral-500',
            variant === 'glass' &&
              'bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder:text-white/60 focus:ring-pink-400 focus:border-pink-400',
            // Error states
            error &&
              variant === 'default' &&
              'border-red-300 focus:ring-red-500 focus:border-red-500',
            error &&
              variant === 'glass' &&
              'border-red-400/60 focus:ring-red-400 focus:border-red-400',
            className,
          )}
          {...props}
        />
        {error && (
          <p
            className={cn(
              'mt-1 text-xs',
              variant === 'default' && 'text-red-600',
              variant === 'glass' && 'text-red-200',
            )}
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';
