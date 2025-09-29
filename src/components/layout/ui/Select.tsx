import * as React from 'react';
import { cn } from '@/lib/cn';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  children: React.ReactNode;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <select
          className={cn(
            // Base styles
            'flex h-10 w-full rounded-xs border px-3 py-2 pr-8 text-sm',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'placeholder:text-neutral-500 dark:placeholder:text-neutral-400',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            // Theme variants
            'border-neutral-200 bg-background',
            'dark:border-neutral-800 dark:bg-neutral-950',
            'focus-visible:ring-neutral-950 dark:focus-visible:ring-neutral-300',
            // Error state
            error && 'border-red-500 focus-visible:ring-red-500',
            className,
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        {error && (
          <p className="text-xs text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';

export { Select };
