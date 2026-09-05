'use client';

import * as React from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // In production, error details are safely captured by the telemetry package
    console.error('Unhandled application error:', error);
  }, [error]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50/50 p-8 text-center dark:border-red-900/50 dark:bg-red-950/20"
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 mb-4">
        <AlertTriangle className="size-6" aria-hidden="true" />
      </div>
      <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
        An unexpected error occurred
      </h2>
      <p className="max-w-md text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
        The application encountered an error while rendering this view. You may attempt to recover the state or navigate back to the dashboard.
      </p>
      {error.digest && (
        <p className="mb-6 font-mono text-xs text-slate-400">
          Error Digest: {error.digest}
        </p>
      )}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          <span>Try again</span>
        </button>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-md border border-border bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-2xs hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <Home className="size-4" aria-hidden="true" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
