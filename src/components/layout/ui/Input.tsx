import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
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
            'focus:outline-none focus:ring-2 focus:ring-offset-2 text-stone-900 ',
            // Variant styles
            variant === 'default' &&
              'border border-neutral-300 rounded-xs bg-white focus:ring-purple-500 focus:border-purple-500 placeholder:text-neutral-500',
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

// Password Input Component with toggle visibility
export const PasswordInput = forwardRef<HTMLInputElement, Omit<InputProps, 'type'>>(
  ({ className, error, variant = 'default', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="w-full">
        <div className="relative">
          <input
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            className={cn(
              // Base styles
              'w-full px-4 py-3 pr-10 text-sm transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 text-stone-900',
              // Variant styles
              variant === 'default' &&
                'border border-neutral-300 rounded-xs bg-white focus:ring-purple-500 focus:border-purple-500 placeholder:text-neutral-500',
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
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-neutral-500 hover:text-neutral-700" />
            ) : (
              <Eye className="h-4 w-4 text-neutral-500 hover:text-neutral-700" />
            )}
          </button>
        </div>
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
PasswordInput.displayName = 'PasswordInput';
