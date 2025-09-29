import * as React from 'react';
import { cn } from '@/lib/cn';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <textarea
          className={cn(
            // Base styles
            'flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm',
            'placeholder:text-neutral-500 dark:placeholder:text-neutral-400',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'resize-vertical',
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
        />
        {error && (
          <p className="text-xs text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

export { Textarea };
