export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background text-foreground">
      <div className="max-w-xl w-full p-8 border border-border rounded-lg shadow-sm bg-white dark:bg-slate-900 text-center">
        <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold uppercase tracking-wider rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          Milestone 1 — Monorepo Foundation
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
          REMOTFIX
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          Infrastructure scaffolding successfully established. Monorepo workspace, Turborepo pipeline, NestJS API foundation, and Next.js presentation tier are initialized and operational.
        </p>
        <div className="pt-4 border-t border-border flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
          <span>API Gateway: <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">/api/v1</code></span>
          <span>Status: <span className="text-green-600 dark:text-green-400 font-medium">Ready</span></span>
        </div>
      </div>
    </main>
  );
}
