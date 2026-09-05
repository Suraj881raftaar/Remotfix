import * as React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@remotfix/ui';

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  badge?: string;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  badge,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex min-h-[360px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-slate-50/50 p-8 text-center dark:bg-slate-900/30',
        className
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 mb-4">
        <Icon className="size-6" aria-hidden="true" />
      </div>
      {badge && (
        <span className="mb-2 inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
          {badge}
        </span>
      )}
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
        {title}
      </h3>
      <p className="max-w-md text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
        {description}
      </p>
      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  );
}
