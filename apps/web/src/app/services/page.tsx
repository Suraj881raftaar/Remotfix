'use client';

import * as React from 'react';
import Link from 'next/link';
import { Wrench, Clock, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { EmptyState } from '@/components/empty-state';
import { useAuth } from '@/components/auth-context';

export interface ServiceItem {
  id: string;
  name: string;
  description?: string | null;
  priceAmount: number;
  currency: string;
  durationMinutes: number;
  isActive: boolean;
}

export default function ServicesPage() {
  const { accessToken, tenant, isLoading: authLoading } = useAuth();
  const [services, setServices] = React.useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (authLoading) return;
    if (!accessToken || !tenant) {
      setIsLoading(false);
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    setIsLoading(true);
    fetch(`${apiUrl}/api/v1/services`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'x-organization-id': tenant.id,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load services');
        return res.json();
      })
      .then((data) => {
        setServices(data.data || []);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [accessToken, tenant, authLoading]);

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Services
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Standardized remote diagnostics, hardware support, and service offerings catalog.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="size-8 animate-spin text-blue-600" />
        </div>
      ) : services.length === 0 ? (
        <EmptyState
          icon={Wrench}
          badge="Service Catalog"
          title="No Services Cataloged"
          description="There are currently no active services in this organization catalog. Services will appear here once provisioned by an organization owner or administrator."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                    Active Offering
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="size-3.5" />
                    <span>{service.durationMinutes} min</span>
                  </div>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
                  {service.name}
                </h3>
                {service.description && (
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                    {service.description}
                  </p>
                )}
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="block text-[11px] text-slate-400 uppercase tracking-wider font-medium">Standard Rate</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    {service.currency} {Number(service.priceAmount).toFixed(2)}
                  </span>
                </div>
                <Link
                  href={`/services/${service.id}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <span>Book Service</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
