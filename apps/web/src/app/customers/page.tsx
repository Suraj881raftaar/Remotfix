import type { Metadata } from 'next';
import { Users } from 'lucide-react';
import { EmptyState } from '@/components/empty-state';

export const metadata: Metadata = {
  title: 'Customers — REMOTFIX',
  description: 'Customer directory, organization tenancy, and service locations.',
};

export default function CustomersPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Customers
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Client accounts, tenant linkages, service sites, and customer contracts.
        </p>
      </div>

      {/* Customers Empty State */}
      <EmptyState
        icon={Users}
        badge="Customer Directory"
        title="No Customer Records"
        description="No customer accounts are registered in the current tenant scope. Multi-tenant customer profiles and contact entitlements will be established following authentication."
      />
    </div>
  );
}
