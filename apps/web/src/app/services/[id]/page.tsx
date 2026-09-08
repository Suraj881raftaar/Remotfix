'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Wrench,
  Clock,
  ArrowLeft,
  AlertCircle,
  Loader2,
  CalendarCheck,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/components/auth-context';

export interface ServiceDetail {
  id: string;
  organizationId: string;
  name: string;
  description?: string | null;
  priceAmount: number;
  currency: string;
  durationMinutes: number;
  isActive: boolean;
  createdAt: string;
}

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params?.id as string;
  const { accessToken, tenant, isLoading: authLoading } = useAuth();

  const [service, setService] = React.useState<ServiceDetail | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  // Form states
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [priority, setPriority] = React.useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('MEDIUM');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (authLoading) return;
    if (!accessToken || !tenant || !serviceId) {
      setIsLoading(false);
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    setIsLoading(true);
    fetch(`${apiUrl}/api/v1/services/${serviceId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'x-organization-id': tenant.id,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Service offering not found or belongs to another organization');
          }
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || 'Failed to load service details');
        }
        return res.json();
      })
      .then((data) => {
        setService(data.data);
        setTitle(`Service Request: ${data.data.name}`);
      })
      .catch((err) => {
        setFetchError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [accessToken, tenant, serviceId, authLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setSubmitError('Booking title is required.');
      return;
    }

    if (!accessToken || !tenant) {
      setSubmitError('Authentication required to submit booking.');
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    try {
      const res = await fetch(`${apiUrl}/api/v1/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'x-organization-id': tenant.id,
        },
        body: JSON.stringify({
          serviceId,
          title: title.trim(),
          description: description.trim() || undefined,
          priority,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || json.error?.message || 'Failed to create booking request');
      }

      const createdTicketId = json.data?.id;
      if (!createdTicketId) {
        throw new Error('Unexpected response: missing booking ticket ID');
      }

      // Successful creation: navigate directly to persisted booking detail
      router.push(`/bookings/${createdTicketId}`);
    } catch (err: any) {
      setSubmitError(err.message || 'Error creating booking ticket');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Back Navigation */}
      <div>
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Services Catalog</span>
        </Link>
      </div>

      {fetchError && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          <AlertCircle className="size-4 shrink-0" />
          <span>{fetchError}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center p-16">
          <Loader2 className="size-8 animate-spin text-blue-600" />
        </div>
      ) : !service ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
          <Wrench className="size-10 text-slate-400 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Service Not Found</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            The requested service catalog item does not exist or is not active in the current organization.
          </p>
          <div className="mt-6">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900"
            >
              Browse Catalog
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Service Summary Column */}
          <div className="md:col-span-1 flex flex-col gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 mb-3">
                Selected Offering
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{service.name}</h2>
              {service.description && (
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {service.description}
                </p>
              )}

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Duration</span>
                  <div className="flex items-center gap-1 font-medium text-slate-900 dark:text-white">
                    <Clock className="size-3.5 text-slate-400" />
                    <span>{service.durationMinutes} minutes</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Standard Rate</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {service.currency} {Number(service.priceAmount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Tenancy & Security Badge */}
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400 flex items-start gap-2.5">
              <ShieldCheck className="size-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-semibold text-slate-900 dark:text-white">Isolated Tenant Booking: </span>
                This request will be recorded as a persisted service Ticket strictly scoped to{' '}
                <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                  {tenant?.name || 'Active Tenant'}
                </span>
                .
              </div>
            </div>
          </div>

          {/* Booking Intake Form */}
          <div className="md:col-span-2">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                <CalendarCheck className="size-5 text-blue-600" />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Request Service Booking
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Provide the service details to instantiate a tracked service booking.
                  </p>
                </div>
              </div>

              {submitError && (
                <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label
                    htmlFor="booking-title"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Booking / Issue Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="booking-title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Workstation diagnostic and RAM upgrade"
                    className="block w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="booking-priority"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Priority
                  </label>
                  <select
                    id="booking-priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="block w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="LOW">Low — Standard Inquiry</option>
                    <option value="MEDIUM">Medium — Normal Operational Need</option>
                    <option value="HIGH">High — Urgent System Issue</option>
                    <option value="CRITICAL">Critical — Platform Outage / Emergency</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="booking-description"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Issue Description & Requirements
                  </label>
                  <textarea
                    id="booking-description"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe specific symptoms, hardware models, or technical requirements..."
                    className="block w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                  <Link
                    href="/services"
                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin" />
                        <span>Creating Booking...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="size-3.5" />
                        <span>Confirm & Submit Booking</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
