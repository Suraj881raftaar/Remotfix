import Link from 'next/link';
import { FileQuestion, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      role="region"
      aria-label="Not found error"
      className="flex min-h-[420px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-slate-50/50 p-8 text-center dark:bg-slate-900/30"
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 mb-4">
        <FileQuestion className="size-7" aria-hidden="true" />
      </div>
      <span className="mb-2 inline-flex items-center rounded-full bg-slate-200/80 px-2.5 py-0.5 font-mono text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
        404 ERROR
      </span>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
        Page Not Found
      </h1>
      <p className="max-w-md text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
        The requested URL was not found on this server. Please check the address or return to the main dashboard navigation.
      </p>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
      >
        <Home className="size-4" aria-hidden="true" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
}
