import type { Metadata } from 'next';
import Link from 'next/link';
import {
  CalendarCheck,
  UserCheck,
  LifeBuoy,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Server,
  Layers,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard — REMOTFIX',
  description: 'Operational overview and service platform telemetry.',
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wider mb-1">
          <Activity className="size-3.5" aria-hidden="true" />
          <span>Operational Telemetry</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Dashboard
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          System overview, operational status, and platform health telemetry.
        </p>
      </div>

      {/* Summary Stat Cards (Clearly Communicating Non-Connected Telemetry) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Active Bookings */}
        <div className="rounded-lg border border-border bg-white p-5 shadow-xs dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Active Bookings
            </span>
            <CalendarCheck className="size-4 text-slate-400" aria-hidden="true" />
          </div>
          <div className="mt-3">
            <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              Not connected yet
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
            Booking intake establishes in Milestone 5
          </p>
        </div>

        {/* Available Technicians */}
        <div className="rounded-lg border border-border bg-white p-5 shadow-xs dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Available Technicians
            </span>
            <UserCheck className="size-4 text-slate-400" aria-hidden="true" />
          </div>
          <div className="mt-3">
            <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              Not connected yet
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
            Roster management connects in Milestone 5
          </p>
        </div>

        {/* Open Service Tickets */}
        <div className="rounded-lg border border-border bg-white p-5 shadow-xs dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Open Service Tickets
            </span>
            <LifeBuoy className="size-4 text-slate-400" aria-hidden="true" />
          </div>
          <div className="mt-3">
            <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              Not connected yet
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
            Ticketing lifecycle connects in Milestone 5
          </p>
        </div>

        {/* Platform Status */}
        <div className="rounded-lg border border-border bg-white p-5 shadow-xs dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Platform Status
            </span>
            <Server className="size-4 text-emerald-500" aria-hidden="true" />
          </div>
          <div className="mt-3">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
              <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
              Development
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
            Monorepo Foundation Verified
          </p>
        </div>
      </div>

      {/* Main Grid: Architecture Status & Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Architecture Foundation Verified */}
        <div className="rounded-lg border border-border bg-white p-6 shadow-xs dark:bg-slate-900">
          <div className="flex items-center gap-2 pb-4 border-b border-border">
            <Layers className="size-5 text-accent" aria-hidden="true" />
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Foundation Architecture
            </h2>
          </div>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-border/60">
              <span className="text-slate-600 dark:text-slate-400">NestJS API Tier</span>
              <span className="inline-flex items-center gap-1 text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="size-3.5" aria-hidden="true" />
                /api/v1/health (Verified)
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border/60">
              <span className="text-slate-600 dark:text-slate-400">Presentation Tier</span>
              <span className="text-xs font-mono text-slate-700 dark:text-slate-300">
                Next.js 14 App Router
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border/60">
              <span className="text-slate-600 dark:text-slate-400">Database Layer</span>
              <span className="text-xs font-mono text-slate-700 dark:text-slate-300">
                PostgreSQL 16 / Prisma (Pending M3)
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-600 dark:text-slate-400">Application Shell</span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                Milestone 2 Active
              </span>
            </div>
          </div>
        </div>

        {/* Recent Activity Card (Clean Empty State) */}
        <div className="rounded-lg border border-border bg-white p-6 shadow-xs dark:bg-slate-900 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Activity className="size-5 text-slate-400" aria-hidden="true" />
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Recent Activity
              </h2>
            </div>
            <span className="text-xs text-slate-400">Stream idle</span>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mb-3">
              <Activity className="size-5" aria-hidden="true" />
            </div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              No service events recorded yet
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs">
              Audit log streaming and service event telemetry will activate as booking workflows are introduced.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Route Shortcuts */}
      <div className="rounded-lg border border-border bg-slate-50/50 p-5 dark:bg-slate-900/30">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Shell Navigation Shortcuts
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Link
            href="/bookings"
            className="flex items-center justify-between rounded-md border border-border bg-white p-3 text-sm font-medium text-slate-800 hover:border-accent hover:text-accent transition-colors shadow-2xs dark:bg-slate-800 dark:text-slate-200"
          >
            <span>Service Bookings</span>
            <ArrowUpRight className="size-4 text-slate-400" aria-hidden="true" />
          </Link>
          <Link
            href="/services"
            className="flex items-center justify-between rounded-md border border-border bg-white p-3 text-sm font-medium text-slate-800 hover:border-accent hover:text-accent transition-colors shadow-2xs dark:bg-slate-800 dark:text-slate-200"
          >
            <span>Service Catalog</span>
            <ArrowUpRight className="size-4 text-slate-400" aria-hidden="true" />
          </Link>
          <Link
            href="/settings"
            className="flex items-center justify-between rounded-md border border-border bg-white p-3 text-sm font-medium text-slate-800 hover:border-accent hover:text-accent transition-colors shadow-2xs dark:bg-slate-800 dark:text-slate-200"
          >
            <span>System Settings</span>
            <ArrowUpRight className="size-4 text-slate-400" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
