'use client';

import * as React from 'react';
import Link from 'next/link';
import { CalendarCheck, Plus, Info, AlertCircle, Loader2 } from 'lucide-react';
import { EmptyState } from '@/components/empty-state';
import { useAuth } from '@/components/auth-context';

export interface TicketItem {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  createdAt: string;
  service?: {
    id: string;
    name: string;
  } | null;
  contact?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export default function BookingsPage() {
  const { accessToken, tenant, isLoading: authLoading } = useAuth();
  const [tickets, setTickets] = React.useState<TicketItem[]>([]);
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
    fetch(`${apiUrl}/api/v1/tickets`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'x-organization-id': tenant.id,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load tickets');
        return res.json();
      })
      .then((data) => {
        setTickets(data.data?.items || []);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [accessToken, tenant, authLoading]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'IN_PROGRESS':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'RESOLVED':
      case 'CLOSED':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      default:
        return 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

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

        {/* Create Booking Action */}
        <div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <Plus className="size-4" aria-hidden="true" />
            <span>Book a Service</span>
          </Link>
        </div>
      </div>

      {/* Architectural Context Notice */}
      <div className="flex items-start gap-3 rounded-lg border border-border bg-slate-50/70 p-4 text-xs text-slate-600 dark:bg-slate-900/50 dark:text-slate-400">
        <Info className="size-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />
        <div className="leading-relaxed">
          <span className="font-semibold text-slate-800 dark:text-slate-200">MVP Primary Journey: </span>
          Connected to real tenant persistence via <code className="rounded bg-slate-200 px-1 py-0.5 dark:bg-slate-800">/api/v1/tickets</code>. Click any booking to view the persisted booking detail.
        </div>
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
      ) : tickets.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          badge="Primary MVP Flow"
          title="No Bookings Found"
          description="There are currently no active or historical bookings in the active organization. Tickets created via the service intake flow will display here."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  <th scope="col" className="px-6 py-3.5">Title</th>
                  <th scope="col" className="px-6 py-3.5">Service</th>
                  <th scope="col" className="px-6 py-3.5">Contact</th>
                  <th scope="col" className="px-6 py-3.5">Priority</th>
                  <th scope="col" className="px-6 py-3.5">Status</th>
                  <th scope="col" className="px-6 py-3.5">Date</th>
                  <th scope="col" className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      <Link
                        href={`/bookings/${ticket.id}`}
                        className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors"
                      >
                        {ticket.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      {ticket.service?.name || 'General Support'}
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      {ticket.contact?.name || 'Direct Tenant Request'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${getStatusBadge(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/bookings/${ticket.id}`}
                        className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline"
                      >
                        View &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
