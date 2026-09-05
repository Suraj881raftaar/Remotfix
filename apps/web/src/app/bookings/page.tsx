import type { Metadata } from 'next';
import { CalendarCheck, Plus, Info } from 'lucide-react';
import { EmptyState } from '@/components/empty-state';

export const metadata: Metadata = {
  title: 'Bookings — REMOTFIX',
  description: 'Manage and dispatch customer service bookings.',
};

export default function BookingsPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Bookings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Service requests, scheduling, dispatch, and appointment lifecycle.
          </p>
        </div>

        {/* Create Booking Affordance (Complying with Correction 2: Disabled, non-pretending) */}
        <div>
          <button
            type="button"
            disabled
            aria-disabled="true"
            title="Booking creation connects to database persistence in Milestone 6"
            className="inline-flex items-center gap-2 rounded-md bg-slate-200/80 px-4 py-2 text-sm font-medium text-slate-500 cursor-not-allowed shadow-2xs dark:bg-slate-800 dark:text-slate-400"
          >
            <Plus className="size-4" aria-hidden="true" />
            <span>Create Booking (Available in M6)</span>
          </button>
        </div>
      </div>

      {/* Architectural Context Notice */}
      <div className="flex items-start gap-3 rounded-lg border border-border bg-slate-50/70 p-4 text-xs text-slate-600 dark:bg-slate-900/50 dark:text-slate-400">
        <Info className="size-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />
        <div className="leading-relaxed">
          <span className="font-semibold text-slate-800 dark:text-slate-200">MVP Primary Journey Boundary: </span>
          The Bookings route is the entry point for the end-to-end customer workflow. In accordance with the Master Specification, persistence and intake API endpoints will be implemented in Milestone 5 and connected in Milestone 6.
        </div>
      </div>

      {/* Primary Empty State */}
      <EmptyState
        icon={CalendarCheck}
        badge="Primary MVP Flow"
        title="No Bookings Found"
        description="There are currently no active or historical bookings in the system. The booking creation flow and persistence layer will be activated in upcoming milestones."
        action={
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-white px-4 py-2 text-xs font-medium text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500"
          >
            <span>Intake Pipeline: Pending M5/M6</span>
          </button>
        }
      />
    </div>
  );
}
