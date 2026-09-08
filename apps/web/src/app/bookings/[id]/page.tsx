'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  CalendarCheck,
  Clock,
  Wrench,
  User,
  UserCheck,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Tag,
  Calendar,
} from 'lucide-react';
import { useAuth } from '@/components/auth-context';

export interface BookingDetail {
  id: string;
  organizationId: string;
  contactId?: string | null;
  serviceId?: string | null;
  assignedTechnicianId?: string | null;
  title: string;
  description?: string | null;
  status: 'OPEN' | 'SCHEDULED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  scheduledAt?: string | null;
  createdAt: string;
  updatedAt: string;
  service?: {
    id: string;
    name: string;
    description?: string | null;
    priceAmount: number;
    currency: string;
    durationMinutes: number;
  } | null;
  contact?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    companyName?: string | null;
  } | null;
  assignedTechnician?: {
    id: string;
    status: string;
    user?: {
      id: string;
      firstName?: string | null;
      lastName?: string | null;
      email: string;
    } | null;
  } | null;
}

export default function BookingDetailPage() {
  const params = useParams();
  const ticketId = params?.id as string;
  const { accessToken, tenant, isLoading: authLoading } = useAuth();

  const [booking, setBooking] = React.useState<BookingDetail | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [statusCode, setStatusCode] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (authLoading) return;
    if (!accessToken || !tenant || !ticketId) {
      setIsLoading(false);
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    setIsLoading(true);
    setError(null);
    setStatusCode(null);

    fetch(`${apiUrl}/api/v1/tickets/${ticketId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'x-organization-id': tenant.id,
      },
    })
      .then(async (res) => {
        setStatusCode(res.status);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Booking not found in this organization');
          }
          if (res.status === 403) {
            throw new Error('Access denied: You do not have permission to view this booking');
          }
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || 'Failed to load booking details');
        }
        return res.json();
      })
      .then((data) => {
        setBooking(data.data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [accessToken, tenant, ticketId, authLoading]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'SCHEDULED':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'IN_PROGRESS':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'RESOLVED':
      case 'CLOSED':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'CANCELLED':
        return 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 border-red-200 dark:border-red-800';
      default:
        return 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300';
      case 'HIGH':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
      case 'LOW':
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Back Navigation */}
      <div>
        <Link
          href="/bookings"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Bookings</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-20">
          <Loader2 className="size-8 animate-spin text-blue-600" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <AlertCircle className="size-10 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {statusCode === 404
              ? 'Booking Not Found'
              : statusCode === 403
              ? 'Access Denied'
              : 'Error Loading Booking'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            {error}
          </p>
          <div className="mt-6">
            <Link
              href="/bookings"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900"
            >
              Return to Bookings List
            </Link>
          </div>
        </div>
      ) : !booking ? (
        <div className="p-8 text-center text-slate-500">No booking details available.</div>
      ) : (
        <>
          {/* Header Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
                    ID: {booking.id}
                  </span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {booking.title}
                </h1>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold ${getStatusBadge(
                    booking.status
                  )}`}
                >
                  {booking.status}
                </span>
                <span
                  className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${getPriorityBadge(
                    booking.priority
                  )}`}
                >
                  {booking.priority} Priority
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <Calendar className="size-3.5 text-slate-400" />
                <span>Created: {new Date(booking.createdAt).toLocaleString()}</span>
              </div>
              {booking.scheduledAt && (
                <div className="flex items-center gap-1.5">
                  <Clock className="size-3.5 text-purple-500" />
                  <span className="font-medium text-purple-700 dark:text-purple-300">
                    Scheduled: {new Date(booking.scheduledAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left: Service & Contact Details */}
            <div className="md:col-span-2 flex flex-col gap-6">
              {/* Description */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">
                  Service Request Details
                </h2>
                {booking.description ? (
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {booking.description}
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 italic">No additional notes provided.</p>
                )}
              </div>

              {/* Associated Service Offering */}
              {booking.service ? (
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center gap-2 mb-3">
                    <Wrench className="size-4 text-blue-600" />
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                      Service Offering
                    </h2>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {booking.service.name}
                      </h3>
                      {booking.service.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {booking.service.description}
                        </p>
                      )}
                    </div>
                    <div className="text-right sm:border-l sm:border-slate-100 sm:dark:border-slate-800 sm:pl-6">
                      <span className="block text-[11px] text-slate-400 uppercase">Standard Rate</span>
                      <span className="text-lg font-bold text-slate-900 dark:text-white">
                        {booking.service.currency} {Number(booking.service.priceAmount).toFixed(2)}
                      </span>
                      <span className="block text-xs text-slate-400 mt-0.5">
                        {booking.service.durationMinutes} min duration
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 text-xs text-slate-500">
                  General Service Ticket (No catalog offering attached)
                </div>
              )}
            </div>

            {/* Right: Requester, Technician & Telemetry */}
            <div className="flex flex-col gap-6">
              {/* Requester Contact */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-2 mb-3">
                  <User className="size-4 text-slate-400" />
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                    Requester Contact
                  </h2>
                </div>
                {booking.contact ? (
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400 block">Name</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {booking.contact.name}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Email</span>
                      <span className="text-slate-700 dark:text-slate-300">
                        {booking.contact.email}
                      </span>
                    </div>
                    {booking.contact.phone && (
                      <div>
                        <span className="text-slate-400 block">Phone</span>
                        <span className="text-slate-700 dark:text-slate-300">
                          {booking.contact.phone}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">Direct Organization Request</p>
                )}
              </div>

              {/* Technician Assignment */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-2 mb-3">
                  <UserCheck className="size-4 text-slate-400" />
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                    Technician Dispatch
                  </h2>
                </div>
                {booking.assignedTechnician?.user ? (
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400 block">Assigned To</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {booking.assignedTechnician.user.firstName}{' '}
                        {booking.assignedTechnician.user.lastName}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Technician Email</span>
                      <span className="text-slate-700 dark:text-slate-300">
                        {booking.assignedTechnician.user.email}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-lg border border-amber-200 dark:border-amber-900/50">
                    <Clock className="size-3.5 shrink-0" />
                    <span>Triage / Dispatch Pending</span>
                  </div>
                )}
              </div>

              {/* Tenant & Security Audit Notice */}
              <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400 flex items-start gap-2.5">
                <ShieldCheck className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Verified Isolation:{' '}
                  </span>
                  This record is persisted in PostgreSQL under organization boundary{' '}
                  <span className="font-mono text-[11px] font-medium text-slate-700 dark:text-slate-300">
                    {tenant?.name || 'Active Tenant'}
                  </span>
                  .
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
