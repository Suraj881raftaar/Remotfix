'use client';

import * as React from 'react';
import {
  CheckCircle2,
  Clock,
  Wrench,
  CheckCheck,
  ShieldCheck,
  AlertOctagon,
  CircleDot,
} from 'lucide-react';

export type TicketStatus =
  | 'OPEN'
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'CLOSED'
  | 'CANCELLED';

interface StepperProps {
  status: TicketStatus;
  createdAt: string;
  scheduledAt?: string | null;
  updatedAt: string;
}

interface StepConfig {
  id: TicketStatus;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: StepConfig[] = [
  {
    id: 'OPEN',
    label: 'Ticket Created',
    description: 'Submitted & queued for triage',
    icon: CircleDot,
  },
  {
    id: 'SCHEDULED',
    label: 'Scheduled',
    description: 'Technician dispatched',
    icon: Clock,
  },
  {
    id: 'IN_PROGRESS',
    label: 'In Progress',
    description: 'Diagnosis & technical repair',
    icon: Wrench,
  },
  {
    id: 'RESOLVED',
    label: 'Resolved',
    description: 'Repair finished, awaiting confirmation',
    icon: CheckCheck,
  },
  {
    id: 'CLOSED',
    label: 'Closed',
    description: 'Confirmed & archived (Terminal)',
    icon: ShieldCheck,
  },
];

const STATUS_ORDER: Record<string, number> = {
  OPEN: 0,
  SCHEDULED: 1,
  IN_PROGRESS: 2,
  RESOLVED: 3,
  CLOSED: 4,
};

export function TicketLifecycleStepper({
  status,
  createdAt,
  scheduledAt,
  updatedAt,
}: StepperProps) {
  if (status === 'CANCELLED') {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50/50 p-6 text-red-900 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-200">
        <div className="flex items-center gap-3">
          <AlertOctagon className="size-6 text-red-600 dark:text-red-400 shrink-0" />
          <div>
            <h3 className="text-sm font-semibold">Ticket Cancelled</h3>
            <p className="text-xs text-red-700 dark:text-red-300 mt-0.5">
              This request was cancelled on {new Date(updatedAt).toLocaleString()}. No further lifecycle transitions are permitted.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentIdx = STATUS_ORDER[status] ?? 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-white">
            Lifecycle Progress
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time state machine track: OPEN → SCHEDULED → IN_PROGRESS → RESOLVED → CLOSED
          </p>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 block uppercase tracking-wider">
            Current State
          </span>
          <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
            Stage {currentIdx + 1} of 5 ({status})
          </span>
        </div>
      </div>

      {/* Stepper Timeline */}
      <div className="relative">
        {/* Horizontal line for desktop */}
        <div className="hidden sm:block absolute top-4 left-6 right-6 h-0.5 bg-slate-100 dark:bg-slate-800 -z-0" />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-5 relative z-10">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentIdx;
            const isCurrent = idx === currentIdx;

            const Icon = step.icon;

            return (
              <div
                key={step.id}
                className={`flex sm:flex-col items-start sm:items-center text-left sm:text-center gap-3 sm:gap-2 transition-all duration-200 ${
                  isCurrent
                    ? 'opacity-100'
                    : isCompleted
                    ? 'opacity-90'
                    : 'opacity-40'
                }`}
              >
                {/* Step Circle */}
                <div
                  className={`size-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs dark:bg-emerald-500 dark:border-emerald-500'
                      : isCurrent
                      ? 'bg-blue-600 border-blue-600 text-white shadow-sm ring-4 ring-blue-100 dark:bg-blue-500 dark:border-blue-500 dark:ring-blue-950'
                      : 'bg-white border-slate-200 text-slate-400 dark:bg-slate-900 dark:border-slate-700'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="size-4" />
                  ) : (
                    <Icon className="size-4" />
                  )}
                </div>

                {/* Step Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center sm:justify-center gap-1.5 flex-wrap">
                    <span
                      className={`text-xs font-semibold ${
                        isCurrent
                          ? 'text-blue-600 dark:text-blue-400'
                          : isCompleted
                          ? 'text-slate-900 dark:text-white'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {step.label}
                    </span>
                    {isCurrent && (
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-1.5 py-0.2 text-[10px] font-medium text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug line-clamp-2">
                    {step.description}
                  </p>

                  {/* Contextual Timestamp */}
                  {step.id === 'OPEN' && (
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-1">
                      {new Date(createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                  {step.id === 'SCHEDULED' && scheduledAt && (
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium block mt-1">
                      {new Date(scheduledAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                  {step.id === 'CLOSED' && isCompleted && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium block mt-1">
                      Verified
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
