import type { Metadata } from 'next';
import { Wrench } from 'lucide-react';
import { EmptyState } from '@/components/empty-state';

export const metadata: Metadata = {
  title: 'Services — REMOTFIX',
  description: 'Standardized service catalog and dispatch tier definitions.',
};

export default function ServicesPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Services
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Standardized remote diagnostics, hardware support, and service offerings catalog.
        </p>
      </div>

      {/* Services Empty State */}
      <EmptyState
        icon={Wrench}
        badge="Service Catalog"
        title="No Services Cataloged"
        description="The service definitions, standardized diagnostic tiers, and rate schedules have not been provisioned yet. Service definitions will be configured in subsequent domain milestones."
      />
    </div>
  );
}
