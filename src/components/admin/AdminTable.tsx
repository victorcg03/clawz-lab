'use client';

import { ReactNode } from 'react';
import { Button } from '@/components/layout/ui/Button';
import { cn } from '@/lib/cn';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (value: unknown, item: T) => ReactNode;
  className?: string;
}

interface AdminTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  actions?: (item: T) => ReactNode;
  className?: string;
}

export function AdminTable<T extends Record<string, unknown>>({
  data,
  columns,
  loading = false,
  emptyMessage = 'No hay datos disponibles',
  actions,
  className,
}: Readonly<AdminTableProps<T>>) {
  if (loading) {
    return (
      <div className="bg-surface-card rounded-lg border border-metal-200/20 overflow-hidden">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div
            className="grid gap-4 p-4 border-b border-metal-200/20"
            style={{
              gridTemplateColumns: `repeat(${columns.length + (actions ? 1 : 0)}, 1fr)`,
            }}
          >
            {columns.map((column) => (
              <div key={String(column.key)} className="h-4 bg-metal-200 rounded" />
            ))}
            {actions && <div key="actions" className="h-4 bg-metal-200 rounded" />}
          </div>

          {/* Rows skeleton */}
          {Array.from({ length: 5 }, (_, i) => i).map((skeletonId) => (
            <div
              key={`skeleton-row-${skeletonId}`}
              className="grid gap-4 p-4 border-b border-metal-200/20 last:border-b-0"
              style={{
                gridTemplateColumns: `repeat(${columns.length + (actions ? 1 : 0)}, 1fr)`,
              }}
            >
              {columns.map((column) => (
                <div key={String(column.key)} className="h-4 bg-metal-200 rounded" />
              ))}
              {actions && <div key="actions" className="h-4 bg-metal-200 rounded" />}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-surface-card rounded-lg border border-metal-200/20 p-8 text-center">
        <p className="text-metal-600">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'bg-surface-card rounded-lg border border-metal-200/20 overflow-hidden',
        className,
      )}
    >
      {/* Header */}
      <div
        className="grid gap-4 p-4 bg-metal-50 border-b border-metal-200/20 font-medium text-sm text-metal-700"
        style={{
          gridTemplateColumns: `repeat(${columns.length + (actions ? 1 : 0)}, 1fr)`,
        }}
      >
        {columns.map((column) => (
          <div key={String(column.key)} className={column.className}>
            {column.label}
          </div>
        ))}
        {actions && <div className="text-center">Acciones</div>}
      </div>

      {/* Rows */}
      <div className="divide-y divide-metal-200/20">
        {data.map((item, index) => (
          <div
            key={`row-${index}-${JSON.stringify(Object.keys(item)).slice(0, 20)}`}
            className="grid gap-4 p-4 hover:bg-metal-50/50 transition-colors"
            style={{
              gridTemplateColumns: `repeat(${columns.length + (actions ? 1 : 0)}, 1fr)`,
            }}
          >
            {columns.map((column) => (
              <div key={String(column.key)} className={cn('text-sm', column.className)}>
                {column.render
                  ? column.render(getNestedValue(item, String(column.key)), item)
                  : (() => {
                      const value = getNestedValue(item, String(column.key));
                      if (value === null || value === undefined) return '';
                      if (
                        typeof value === 'string' ||
                        typeof value === 'number' ||
                        typeof value === 'boolean'
                      ) {
                        return String(value);
                      }
                      return JSON.stringify(value);
                    })()}
              </div>
            ))}
            {actions && (
              <div className="flex items-center justify-center gap-2">
                {actions(item)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper function to get nested object values
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((current, key) => {
    if (current && typeof current === 'object' && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

// Status Badge component for common use
interface StatusBadgeProps {
  status: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
}

export function StatusBadge({ status, variant = 'default' }: Readonly<StatusBadgeProps>) {
  const variants = {
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    default: 'bg-metal-100 text-metal-800 border-metal-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border',
        variants[variant],
      )}
    >
      {status}
    </span>
  );
}

// Action Button component for common use
interface ActionButtonProps {
  onClick: () => void;
  variant?: 'edit' | 'delete' | 'view' | 'approve' | 'reject';
  disabled?: boolean;
  loading?: boolean;
  children: ReactNode;
}

export function ActionButton({
  onClick,
  variant = 'edit',
  disabled = false,
  loading = false,
  children,
}: Readonly<ActionButtonProps>) {
  const variants = {
    edit: 'text-blue-600 hover:text-blue-700 hover:bg-blue-50',
    delete: 'text-red-600 hover:text-red-700 hover:bg-red-50',
    view: 'text-metal-600 hover:text-metal-700 hover:bg-metal-50',
    approve: 'text-green-600 hover:text-green-700 hover:bg-green-50',
    reject: 'text-red-600 hover:text-red-700 hover:bg-red-50',
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled || loading}
      className={cn('h-8 px-2', variants[variant])}
    >
      {loading ? '...' : children}
    </Button>
  );
}
