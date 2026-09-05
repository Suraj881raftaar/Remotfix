import type { Metadata } from 'next';
import { Settings, Shield, Sliders, Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Settings — REMOTFIX',
  description: 'Tenant organization preferences, security posture, and audit configurations.',
};

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Platform configurations, tenant preferences, and security compliance controls.
        </p>
      </div>

      {/* Settings Shell Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Organization Preferences */}
        <div className="rounded-lg border border-border bg-white p-6 shadow-xs dark:bg-slate-900">
          <div className="flex size-10 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mb-4">
            <Sliders className="size-5" aria-hidden="true" />
          </div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Organization Profile
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Tenant name, branding, localized timezone, and operating hours configuration.
          </p>
          <div className="mt-6 pt-4 border-t border-border">
            <span className="inline-flex items-center text-xs text-slate-400">
              Configurable in administrative milestone
            </span>
          </div>
        </div>

        {/* Security & Audit */}
        <div className="rounded-lg border border-border bg-white p-6 shadow-xs dark:bg-slate-900">
          <div className="flex size-10 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mb-4">
            <Shield className="size-5" aria-hidden="true" />
          </div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Security & Audit
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Multi-factor authentication (MFA) requirements, session timeout rules, and immutable audit logs.
          </p>
          <div className="mt-6 pt-4 border-t border-border">
            <span className="inline-flex items-center text-xs text-slate-400">
              Enforced via Milestone 4 Auth Architecture
            </span>
          </div>
        </div>

        {/* Access Controls */}
        <div className="rounded-lg border border-border bg-white p-6 shadow-xs dark:bg-slate-900">
          <div className="flex size-10 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mb-4">
            <Lock className="size-5" aria-hidden="true" />
          </div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Access Controls (RBAC)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Role assignments across Owner, Admin, Technician, and Customer tiers.
          </p>
          <div className="mt-6 pt-4 border-t border-border">
            <span className="inline-flex items-center text-xs text-slate-400">
              Enforced via ADR-0020 & ADR-0022
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
