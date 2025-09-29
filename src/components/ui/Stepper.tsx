import * as React from 'react';
import { cn } from '@/lib/cn';

interface StepperProps {
  readonly steps: readonly string[];
  readonly currentStep: number;
  readonly className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <nav aria-label="Progreso del wizard" className={cn('w-full', className)}>
      <ol className="flex items-center space-x-2 sm:space-x-4">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <li key={step} className="flex items-center">
              <div className="flex items-center space-x-2 sm:space-x-3">
                {/* Step circle */}
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors',
                    isCompleted && 'bg-green-600 text-white',
                    isActive &&
                      'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900',
                    isUpcoming &&
                      'border-2 border-neutral-300 bg-white text-neutral-500 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-400',
                  )}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </div>

                {/* Step label */}
                <span
                  className={cn(
                    'text-sm font-medium transition-colors',
                    isCompleted && 'text-green-600',
                    isActive && 'text-neutral-900 dark:text-neutral-100',
                    isUpcoming && 'text-neutral-500 dark:text-neutral-400',
                  )}
                >
                  <span className="sr-only">Paso {stepNumber}: </span>
                  {step}
                </span>
              </div>

              {/* Separator */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'hidden h-0.5 w-12 sm:block lg:w-16',
                    isCompleted && 'bg-green-600',
                    (isActive || isUpcoming) && 'bg-neutral-200 dark:bg-neutral-700',
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
