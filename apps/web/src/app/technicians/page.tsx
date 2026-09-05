import type { Metadata } from 'next';
import { UserCheck } from 'lucide-react';
import { EmptyState } from '@/components/empty-state';

export const metadata: Metadata = {
  title: 'Technicians — REMOTFIX',
  description: 'Technician roster, skill certifications, and dispatch availability.',
};

export default function TechniciansPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Technicians
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Field technician directory, certified skill sets, and dispatch schedules.
        </p>
      </div>

      {/* Technicians Empty State */}
      <EmptyState
        icon={UserCheck}
        badge="Technician Roster"
        title="No Technicians Enrolled"
        description="No technician profiles are active in the roster. Field technician onboarding, skill validation, and dispatch scheduling will be configured in subsequent milestones."
      />
    </div>
  );
}
