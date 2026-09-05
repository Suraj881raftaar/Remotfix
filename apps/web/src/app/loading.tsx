export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading page content"
      className="flex flex-col gap-6 animate-pulse"
    >
      {/* Header Skeleton */}
      <div className="flex flex-col gap-2">
        <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-8 w-64 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-96 rounded bg-slate-200 dark:bg-slate-800" />
      </div>

      {/* Content Skeleton Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="h-28 rounded-lg border border-border bg-slate-100 dark:bg-slate-900" />
        <div className="h-28 rounded-lg border border-border bg-slate-100 dark:bg-slate-900" />
        <div className="h-28 rounded-lg border border-border bg-slate-100 dark:bg-slate-900" />
        <div className="h-28 rounded-lg border border-border bg-slate-100 dark:bg-slate-900" />
      </div>

      {/* Main Skeleton Panel */}
      <div className="h-64 rounded-lg border border-border bg-slate-100 dark:bg-slate-900" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
