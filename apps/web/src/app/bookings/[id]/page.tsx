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
  Calendar,
  Play,
  CheckCircle2,
  CheckCheck,
  Lock,
  Sparkles,
  FileText,
  UserPlus,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '@/components/auth-context';
import { TicketLifecycleStepper } from '@/components/ticket-lifecycle-stepper';

export interface BookingDetail {
  id: string;
  organizationId: string;
  contactId?: string | null;
  serviceId?: string | null;
  assignedTechnicianId?: string | null;
  title: string;
  description?: string | null;
  resolutionNotes?: string | null;
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
    userId?: string | null;
    name: string;
    email: string;
    phone?: string | null;
    companyName?: string | null;
  } | null;
  assignedTechnician?: {
    id: string;
    userId?: string | null;
    status: string;
    user?: {
      id: string;
      firstName?: string | null;
      lastName?: string | null;
      email?: string;
    } | null;
  } | null;
}

export default function BookingDetailPage() {
  const params = useParams();
  const ticketId = params?.id as string;
  const { accessToken, tenant, user, isLoading: authLoading } = useAuth();

  const [booking, setBooking] = React.useState<BookingDetail | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [statusCode, setStatusCode] = React.useState<number | null>(null);

  // Lifecycle action state
  const [actionLoading, setActionLoading] = React.useState(false);
  const [actionError, setActionError] = React.useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = React.useState<string | null>(null);

  // Form states
  const [showAssignForm, setShowAssignForm] = React.useState(false);
  const [technicianIdInput, setTechnicianIdInput] = React.useState('');
  const [scheduledAtInput, setScheduledAtInput] = React.useState('');

  const [showResolveForm, setShowResolveForm] = React.useState(false);
  const [diagnosticNotesInput, setDiagnosticNotesInput] = React.useState('');

  const fetchTicket = React.useCallback(async () => {
    if (!accessToken || !tenant || !ticketId) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    try {
      const res = await fetch(`${apiUrl}/api/v1/tickets/${ticketId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-organization-id': tenant.id,
        },
      });

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

      const json = await res.json();
      setBooking(json.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, tenant, ticketId]);

  React.useEffect(() => {
    if (authLoading) return;
    if (!accessToken || !tenant || !ticketId) {
      setIsLoading(false);
      return;
    }
    fetchTicket();
  }, [authLoading, accessToken, tenant, ticketId, fetchTicket]);

  // Execute lifecycle mutation with error/success feedback
  const executeLifecycleAction = async (
    endpoint: string,
    payload: Record<string, any>,
    successMessage: string
  ) => {
    if (!accessToken || !tenant) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      const res = await fetch(`${apiUrl}/api/v1/tickets/${ticketId}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'x-organization-id': tenant.id,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || `Action failed with HTTP status ${res.status}`);
      }

      setActionSuccess(successMessage);
      setShowAssignForm(false);
      setShowResolveForm(false);
      setTechnicianIdInput('');
      setScheduledAtInput('');
      setDiagnosticNotesInput('');

      // Refresh ticket details
      await fetchTicket();
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!technicianIdInput.trim()) {
      setActionError('Technician ID is required');
      return;
    }
    const payload: any = { technicianId: technicianIdInput.trim() };
    if (scheduledAtInput) {
      payload.scheduledAt = new Date(scheduledAtInput).toISOString();
    }
    const isReassignment = booking?.status === 'SCHEDULED';
    executeLifecycleAction(
      'assign',
      payload,
      isReassignment
        ? 'Technician successfully reassigned.'
        : 'Ticket assigned to technician (Transitioned to SCHEDULED).'
    );
  };

  const handleStartWork = () => {
    executeLifecycleAction(
      'start-work',
      {},
      'Work started by technician (Transitioned to IN_PROGRESS).'
    );
  };

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    executeLifecycleAction(
      'resolve',
      { diagnosticNotes: diagnosticNotesInput.trim() || undefined },
      'Ticket marked as RESOLVED with diagnostic notes.'
    );
  };

  const handleClose = () => {
    executeLifecycleAction(
      'close',
      {},
      tenant?.role === 'CUSTOMER'
        ? 'Resolution accepted. Ticket successfully closed & confirmed!'
        : 'Ticket closed by staff.'
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'SCHEDULED':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'IN_PROGRESS':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'RESOLVED':
        return 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800';
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

  // Role capability checks aligned with backend authorization
  const isManagerOrAdmin =
    tenant?.role === 'OWNER' ||
    tenant?.role === 'ADMIN' ||
    tenant?.role === 'MANAGER' ||
    tenant?.permissions.includes('tickets:assign');

  const isAssignedTech =
    booking?.assignedTechnician?.user?.id === user?.id ||
    (tenant?.role === 'TECHNICIAN' && booking?.assignedTechnician?.userId === user?.id);

  const canAssign = isManagerOrAdmin && (booking?.status === 'OPEN' || booking?.status === 'SCHEDULED');
  const canStartWork = (isAssignedTech || (isManagerOrAdmin && tenant?.permissions.includes('tickets:update'))) && booking?.status === 'SCHEDULED';
  const canResolve = (isAssignedTech || (isManagerOrAdmin && tenant?.permissions.includes('tickets:update'))) && booking?.status === 'IN_PROGRESS';
  const isCustomerOwner = tenant?.role === 'CUSTOMER' || (booking?.contact?.userId === user?.id);
  const canCustomerClose = isCustomerOwner && booking?.status === 'RESOLVED';
  const canStaffClose = !isCustomerOwner && tenant?.role !== 'TECHNICIAN' && tenant?.permissions.includes('tickets:update') && booking?.status === 'RESOLVED';

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-12">
      {/* Back Navigation & Refresh */}
      <div className="flex items-center justify-between">
        <Link
          href="/bookings"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Bookings</span>
        </Link>
        <button
          onClick={() => {
            setIsLoading(true);
            fetchTicket();
          }}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
        >
          <RefreshCw className={`size-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-20 gap-3">
          <Loader2 className="size-8 animate-spin text-blue-600" />
          <span className="text-xs text-slate-400">Loading service ticket details...</span>
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
                  id="ticket-status-badge"
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

          {/* Stepper Component (OPEN -> SCHEDULED -> IN_PROGRESS -> RESOLVED -> CLOSED) */}
          <TicketLifecycleStepper
            status={booking.status}
            createdAt={booking.createdAt}
            scheduledAt={booking.scheduledAt}
            updatedAt={booking.updatedAt}
          />

          {/* Action Feedback Alerts */}
          {actionError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300 flex items-start gap-2">
              <AlertCircle className="size-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Action Failed</span>
                <span>{actionError}</span>
              </div>
            </div>
          )}

          {actionSuccess && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-start gap-2">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Lifecycle Updated</span>
                <span>{actionSuccess}</span>
              </div>
            </div>
          )}

          {/* Role-Aware Lifecycle Action Card */}
          <div className="rounded-xl border border-blue-200/80 bg-blue-50/40 p-6 dark:border-blue-900/40 dark:bg-blue-950/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-blue-700 dark:text-blue-400 block mb-1">
                  Active Lifecycle Operations
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {booking.status === 'OPEN' && 'Awaiting Dispatch & Assignment'}
                  {booking.status === 'SCHEDULED' && 'Scheduled — Ready for Technician Work'}
                  {booking.status === 'IN_PROGRESS' && 'Service in Progress'}
                  {booking.status === 'RESOLVED' && 'Repair Completed — Awaiting Closure'}
                  {booking.status === 'CLOSED' && 'Terminal State — Ticket Archived'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  {booking.status === 'OPEN' &&
                    (canAssign
                      ? 'Select a technician to assign to this ticket and advance status to SCHEDULED.'
                      : 'This ticket is pending triage by an organization manager or administrator.')}
                  {booking.status === 'SCHEDULED' &&
                    (canStartWork
                      ? 'Technician may begin diagnostics and service execution.'
                      : 'Scheduled with technician. Awaiting work commencement.')}
                  {booking.status === 'IN_PROGRESS' &&
                    (canResolve
                      ? 'Technician has begun work. Submit diagnostic findings to mark as RESOLVED.'
                      : 'Technician is actively working on this ticket.')}
                  {booking.status === 'RESOLVED' &&
                    (canCustomerClose
                      ? 'The service is marked resolved. Please confirm resolution to complete closure.'
                      : canStaffClose
                      ? 'Staff override: You may confirm and close this resolved ticket.'
                      : 'Service resolved. Awaiting customer confirmation.')}
                  {booking.status === 'CLOSED' &&
                    'This ticket is fully closed, immutable, and permanently archived. No further mutations permitted.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* 1. Assign / Reassign Button */}
                {canAssign && (
                  <button
                    id="btn-assign-technician"
                    onClick={() => {
                      setShowAssignForm(!showAssignForm);
                      setShowResolveForm(false);
                      setActionError(null);
                    }}
                    disabled={actionLoading}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 cursor-pointer"
                  >
                    <UserPlus className="size-3.5" />
                    <span>{booking.status === 'SCHEDULED' ? 'Reassign Technician' : 'Assign Technician'}</span>
                  </button>
                )}

                {/* 2. Start Work Button (Assigned Tech or authorized Staff) */}
                {canStartWork && (
                  <button
                    id="btn-start-work"
                    onClick={handleStartWork}
                    disabled={actionLoading}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-amber-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 disabled:opacity-50 cursor-pointer"
                  >
                    {actionLoading ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Play className="size-3.5" />
                    )}
                    <span>Start Work</span>
                  </button>
                )}

                {/* 3. Resolve Button (Assigned Tech or authorized Staff) */}
                {canResolve && (
                  <button
                    id="btn-open-resolve"
                    onClick={() => {
                      setShowResolveForm(!showResolveForm);
                      setShowAssignForm(false);
                      setActionError(null);
                    }}
                    disabled={actionLoading}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-cyan-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 disabled:opacity-50 cursor-pointer"
                  >
                    <CheckCheck className="size-3.5" />
                    <span>Resolve Ticket</span>
                  </button>
                )}

                {/* 4. Customer Close / Confirmation Button */}
                {canCustomerClose && (
                  <button
                    id="btn-customer-close"
                    onClick={handleClose}
                    disabled={actionLoading}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-50 cursor-pointer"
                  >
                    {actionLoading ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="size-3.5" />
                    )}
                    <span>Confirm Resolution & Close</span>
                  </button>
                )}

                {/* 5. Staff Close Override */}
                {canStaffClose && (
                  <button
                    id="btn-staff-close"
                    onClick={handleClose}
                    disabled={actionLoading}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 disabled:opacity-50 cursor-pointer"
                  >
                    {actionLoading ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="size-3.5" />
                    )}
                    <span>Close Ticket (Staff)</span>
                  </button>
                )}

                {/* 6. Terminal Closed Badge */}
                {booking.status === 'CLOSED' && (
                  <div
                    id="badge-closed-locked"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-slate-200/80 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    <Lock className="size-3.5 text-slate-500" />
                    <span>Locked & Read-Only</span>
                  </div>
                )}
              </div>
            </div>

            {/* Inline Assign / Reassign Form */}
            {showAssignForm && canAssign && (
              <form
                id="form-assign-technician"
                onSubmit={handleAssign}
                className="mt-4 pt-4 border-t border-blue-200/60 dark:border-blue-900/60 flex flex-col gap-3"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Technician ID (UUID) *
                    </label>
                    <input
                      id="input-technician-id"
                      type="text"
                      placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000"
                      value={technicianIdInput}
                      onChange={(e) => setTechnicianIdInput(e.target.value)}
                      required
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Scheduled Appointment (Optional)
                    </label>
                    <input
                      id="input-scheduled-at"
                      type="datetime-local"
                      value={scheduledAtInput}
                      onChange={(e) => setScheduledAtInput(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setShowAssignForm(false)}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    id="btn-submit-assignment"
                    type="submit"
                    disabled={actionLoading}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 disabled:opacity-50 cursor-pointer"
                  >
                    {actionLoading && <Loader2 className="size-3.5 animate-spin" />}
                    <span>Confirm Assignment</span>
                  </button>
                </div>
              </form>
            )}

            {/* Inline Resolve Form */}
            {showResolveForm && canResolve && (
              <form
                id="form-resolve-ticket"
                onSubmit={handleResolve}
                className="mt-4 pt-4 border-t border-cyan-200/60 dark:border-cyan-900/60 flex flex-col gap-3"
              >
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Diagnostic & Resolution Notes (Stored in structured resolutionNotes)
                  </label>
                  <textarea
                    id="input-diagnostic-notes"
                    rows={3}
                    placeholder="Describe diagnosis, component replacements, calibration measurements, and verified outcomes..."
                    value={diagnosticNotesInput}
                    onChange={(e) => setDiagnosticNotesInput(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Notes will be recorded in the technician audit log and structured resolution record.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowResolveForm(false)}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    id="btn-submit-resolution"
                    type="submit"
                    disabled={actionLoading}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-cyan-500 disabled:opacity-50 cursor-pointer"
                  >
                    {actionLoading && <Loader2 className="size-3.5 animate-spin" />}
                    <span>Confirm Resolution</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left: Service Request & Notes */}
            <div className="md:col-span-2 flex flex-col gap-6">
              {/* Customer Description (Preserved 100% Unmodified) */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="size-4 text-slate-400" />
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                    Customer Problem Description
                  </h2>
                </div>
                {booking.description ? (
                  <p
                    id="ticket-customer-description"
                    className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap"
                  >
                    {booking.description}
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 italic">No description provided by customer.</p>
                )}
              </div>

              {/* Structured Resolution Notes (Rendered ONLY if present — never leaks to Customer) */}
              {booking.resolutionNotes && (
                <div
                  id="section-resolution-notes"
                  className="rounded-xl border border-cyan-200 bg-cyan-50/50 p-6 shadow-xs dark:border-cyan-900/50 dark:bg-cyan-950/20"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <CheckCheck className="size-4 text-cyan-600 dark:text-cyan-400" />
                      <h2 className="text-sm font-semibold uppercase tracking-wider text-cyan-800 dark:text-cyan-300">
                        Technician Resolution Notes
                      </h2>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-cyan-700 bg-cyan-100 dark:bg-cyan-900 dark:text-cyan-300 px-2 py-0.5 rounded-md">
                      Internal Diagnostic Log
                    </span>
                  </div>
                  <p
                    id="ticket-resolution-notes"
                    className="text-sm text-cyan-950 dark:text-cyan-200 leading-relaxed whitespace-pre-wrap"
                  >
                    {booking.resolutionNotes}
                  </p>
                </div>
              )}

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
                      <span id="contact-name" className="font-semibold text-slate-900 dark:text-white">
                        {booking.contact.name}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Email</span>
                      <span id="contact-email" className="text-slate-700 dark:text-slate-300">
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
                      <span className="text-slate-400 block">Assigned Technician</span>
                      <span
                        id="technician-name"
                        className="font-semibold text-slate-900 dark:text-white"
                      >
                        {booking.assignedTechnician.user.firstName}{' '}
                        {booking.assignedTechnician.user.lastName}
                      </span>
                    </div>
                    {/* Rendered only if backend provides email (omitted for Customer) */}
                    {booking.assignedTechnician.user.email && (
                      <div>
                        <span className="text-slate-400 block">Technician Email</span>
                        <span id="technician-email" className="text-slate-700 dark:text-slate-300">
                          {booking.assignedTechnician.user.email}
                        </span>
                      </div>
                    )}
                    {booking.assignedTechnicianId && (
                      <div>
                        <span className="text-slate-400 block">Technician Record ID</span>
                        <span className="font-mono text-[10px] text-slate-500">
                          {booking.assignedTechnicianId}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-lg border border-amber-200 dark:border-amber-900/50">
                    <Clock className="size-3.5 shrink-0" />
                    <span>Triage / Dispatch Pending</span>
                  </div>
                )}
              </div>

              {/* Security & Tenant Boundary Badge */}
              <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400 flex items-start gap-2.5">
                <ShieldCheck className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Verified Isolation:{' '}
                  </span>
                  Scoped to tenant{' '}
                  <span className="font-mono text-[11px] font-medium text-slate-700 dark:text-slate-300">
                    {tenant?.name || 'Active Organization'}
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
