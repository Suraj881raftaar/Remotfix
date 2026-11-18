import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, AlertCircle, Copy, Check, Mail, ShieldCheck } from 'lucide-react';
import { ServiceCategory, SupportRequestDraft } from '../types';

interface SupportRequestFormProps {
  defaultCategory?: ServiceCategory;
  onNavigate?: (path: string) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_REGEX = /^[+\d\s().-]{7,20}$/;
const COOLDOWN_MS = 15000;

function sanitizeSingleLine(input: string, maxLen: number): string {
  return input.replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, maxLen);
}

function sanitizeMultiline(input: string, maxLen: number): string {
  return input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim().slice(0, maxLen);
}

export const SupportRequestForm: React.FC<SupportRequestFormProps> = ({
  defaultCategory = 'Remote IT Support',
  onNavigate,
}) => {
  const [contactName, setContactName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceCategory, setServiceCategory] = useState<ServiceCategory>(defaultCategory);
  const [urgency, setUrgency] = useState<'Standard' | 'Priority'>('Standard');
  const [summary, setSummary] = useState('');
  const [authorizedConsent, setAuthorizedConsent] = useState(false);

  // Anti-spam honeypot field (must remain empty for human users)
  const [honeypot, setHoneypot] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastSubmitAt, setLastSubmitAt] = useState<number>(0);
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);
  const [preparedRequest, setPreparedRequest] = useState<SupportRequestDraft | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  useEffect(() => {
    setServiceCategory(defaultCategory);
  }, [defaultCategory]);

  useEffect(() => {
    if (cooldownRemaining <= 0) return;
    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((lastSubmitAt + COOLDOWN_MS - Date.now()) / 1000));
      setCooldownRemaining(remaining);
    }, 500);
    return () => clearInterval(timer);
  }, [cooldownRemaining, lastSubmitAt]);

  const buildSummaryText = (draft: SupportRequestDraft): string => {
    return [
      `Reference ID: ${draft.referenceId}`,
      `Name: ${draft.contactName}`,
      `Company: ${draft.companyName || 'Individual / Not Specified'}`,
      `Email: ${draft.email}`,
      `Phone: ${draft.phone || 'Not provided'}`,
      `Service Category: ${draft.serviceCategory}`,
      `Priority Level: ${draft.urgency}`,
      '',
      'Issue / Requirement Summary:',
      draft.summary,
    ].join('\n');
  };

  const buildMailtoHref = (draft: SupportRequestDraft): string => {
    const subject = encodeURIComponent(
      sanitizeSingleLine(`[${draft.referenceId}] ${draft.serviceCategory} - ${draft.companyName || draft.contactName}`, 120)
    );
    const body = encodeURIComponent(buildSummaryText(draft));
    return `mailto:support@remotfix.in?subject=${subject}&body=${body}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Silent drop if bot fills honeypot
    if (honeypot.trim().length > 0) {
      return;
    }

    const now = Date.now();
    if (lastSubmitAt > 0 && now - lastSubmitAt < COOLDOWN_MS) {
      const waitSec = Math.ceil((lastSubmitAt + COOLDOWN_MS - now) / 1000);
      setCooldownRemaining(waitSec);
      setErrorMsg(`Please wait ${waitSec}s before preparing another support request.`);
      return;
    }

    const cleanName = sanitizeSingleLine(contactName, 80);
    const cleanCompany = sanitizeSingleLine(companyName, 100);
    const cleanEmail = sanitizeSingleLine(email, 120).toLowerCase();
    const cleanPhone = sanitizeSingleLine(phone, 24);
    const cleanSummary = sanitizeMultiline(summary, 1500);

    if (cleanName.length < 2) {
      setErrorMsg('Please enter your full name (at least 2 characters).');
      return;
    }
    if (!EMAIL_REGEX.test(cleanEmail)) {
      setErrorMsg('Please enter a valid business or personal email address.');
      return;
    }
    if (cleanPhone.length > 0 && !PHONE_REGEX.test(cleanPhone)) {
      setErrorMsg('Please enter a valid phone number or leave the phone field blank.');
      return;
    }
    if (cleanSummary.length < 15) {
      setErrorMsg('Please describe your issue or IT requirement (at least 15 characters).');
      return;
    }
    if (!authorizedConsent) {
      setErrorMsg('Please confirm that you accept our Privacy Policy and Remote Support Terms.');
      return;
    }

    const refId = `RF-${Math.floor(100000 + Math.random() * 900000)}`;
    const draft: SupportRequestDraft = {
      referenceId: refId,
      contactName: cleanName,
      companyName: cleanCompany,
      email: cleanEmail,
      phone: cleanPhone,
      serviceCategory,
      urgency,
      summary: cleanSummary,
      authorizedConsent: true,
      createdAt: new Date().toISOString(),
    };

    setLastSubmitAt(now);
    setCooldownRemaining(Math.ceil(COOLDOWN_MS / 1000));
    setPreparedRequest(draft);
  };

  const handleCopySummary = async () => {
    if (!preparedRequest) return;
    try {
      await navigator.clipboard.writeText(buildSummaryText(preparedRequest));
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2500);
    } catch {
      setErrorMsg('Clipboard access is blocked in this browser. Please use the email button instead.');
    }
  };

  if (preparedRequest) {
    return (
      <div
        className="glass-panel rounded-2xl p-6 sm:p-8 border border-emerald-500/40 space-y-5 text-left"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-display">
              Support Request Prepared ({preparedRequest.referenceId})
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              Your details are validated and kept private in memory (not stored in public browser caches). Send the pre-filled email below directly to{' '}
              <span className="font-mono text-cyan-300">support@remotfix.in</span> to open your support ticket.
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-slate-950/75 border border-slate-800 p-4 text-xs text-slate-200 space-y-1.5 font-mono">
          <div>
            <span className="text-slate-400">Contact:</span> {preparedRequest.contactName} ({preparedRequest.email})
          </div>
          <div>
            <span className="text-slate-400">Category:</span> {preparedRequest.serviceCategory} · {preparedRequest.urgency}
          </div>
          <div className="pt-1 text-slate-300 font-sans whitespace-pre-wrap break-words">
            {preparedRequest.summary}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <a
            href={buildMailtoHref(preparedRequest)}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition-colors flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          >
            <Mail className="w-4 h-4" aria-hidden="true" />
            <span>Send to support@remotfix.in</span>
          </a>
          <button
            type="button"
            onClick={handleCopySummary}
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm font-medium border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            {copiedSummary ? <Check className="w-4 h-4 text-emerald-400" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
            <span>{copiedSummary ? 'Copied Summary' : 'Copy Details'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setPreparedRequest(null);
              setErrorMsg(null);
            }}
            className="min-h-[44px] px-4 py-2.5 rounded-xl text-slate-300 hover:text-white text-xs underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            Edit or Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-700/70 space-y-4 text-left"
    >
      {/* Hidden Honeypot Anti-Spam Field */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="rf-company-website">Leave this field blank</label>
        <input
          id="rf-company-website"
          name="companyWebsite"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {errorMsg && (
        <div
          role="alert"
          aria-live="assertive"
          className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-200 text-xs sm:text-sm flex items-start gap-2.5"
        >
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="req-name" className="block text-xs font-medium text-slate-200 mb-1.5">
            Your Name *
          </label>
          <input
            id="req-name"
            type="text"
            required
            maxLength={80}
            autoComplete="name"
            placeholder="Full name"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-950/75 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus:border-cyan-500/60"
          />
        </div>

        <div>
          <label htmlFor="req-company" className="block text-xs font-medium text-slate-200 mb-1.5">
            Business / Organization
          </label>
          <input
            id="req-company"
            type="text"
            maxLength={100}
            autoComplete="organization"
            placeholder="Company name (optional)"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-950/75 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus:border-cyan-500/60"
          />
        </div>

        <div>
          <label htmlFor="req-email" className="block text-xs font-medium text-slate-200 mb-1.5">
            Email Address *
          </label>
          <input
            id="req-email"
            type="email"
            required
            maxLength={120}
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-950/75 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus:border-cyan-500/60"
          />
        </div>

        <div>
          <label htmlFor="req-phone" className="block text-xs font-medium text-slate-200 mb-1.5">
            Phone Number (Optional)
          </label>
          <input
            id="req-phone"
            type="tel"
            maxLength={24}
            autoComplete="tel"
            placeholder="+91 ..."
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-950/75 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus:border-cyan-500/60"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="req-service" className="block text-xs font-medium text-slate-200 mb-1.5">
            Service Needed *
          </label>
          <select
            id="req-service"
            value={serviceCategory}
            onChange={(e) => setServiceCategory(e.target.value as ServiceCategory)}
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-700/80 text-sm text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus:border-cyan-500/60"
          >
            <option value="Remote IT Support">Remote IT Support</option>
            <option value="IT AMC">IT Annual Maintenance Contract (AMC)</option>
            <option value="Desktop & Laptop Support">Desktop &amp; Laptop Support</option>
            <option value="Network Support">Network Support</option>
            <option value="Server Support">Server Support</option>
            <option value="Cloud & Backup">Cloud &amp; Backup</option>
            <option value="Cybersecurity">Cybersecurity Hygiene</option>
          </select>
        </div>

        <div>
          <label htmlFor="req-urgency" className="block text-xs font-medium text-slate-200 mb-1.5">
            Priority Level
          </label>
          <select
            id="req-urgency"
            value={urgency}
            onChange={(e) => setUrgency(e.target.value as 'Standard' | 'Priority')}
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-700/80 text-sm text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus:border-cyan-500/60"
          >
            <option value="Standard">Standard Business Support</option>
            <option value="Priority">Priority / Urgent Issue</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="req-summary" className="block text-xs font-medium text-slate-200 mb-1.5">
          Describe Your IT Issue or Support Scope *
        </label>
        <textarea
          id="req-summary"
          required
          rows={4}
          maxLength={1500}
          placeholder="Share the operating system, number of devices/users, symptoms, or AMC requirements. Do not include account passwords."
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/75 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus:border-cyan-500/60"
        />
        <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
            Never share passwords in support forms.
          </span>
          <span className="font-mono tabular-nums">{summary.length}/1500</span>
        </div>
      </div>

      <div className="flex items-start gap-2.5 pt-1">
        <input
          id="req-consent"
          type="checkbox"
          checked={authorizedConsent}
          onChange={(e) => setAuthorizedConsent(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-900 text-cyan-500 focus:ring-cyan-400 cursor-pointer"
        />
        <label htmlFor="req-consent" className="text-xs text-slate-300 leading-relaxed cursor-pointer">
          I agree to the{' '}
          <a
            href="/privacy-policy"
            onClick={(e) => {
              if (onNavigate) {
                e.preventDefault();
                onNavigate('/privacy-policy');
              }
            }}
            className="text-cyan-300 underline hover:text-cyan-200"
          >
            Privacy Policy
          </a>{' '}
          and{' '}
          <a
            href="/remote-support-terms"
            onClick={(e) => {
              if (onNavigate) {
                e.preventDefault();
                onNavigate('/remote-support-terms');
              }
            }}
            className="text-cyan-300 underline hover:text-cyan-200"
          >
            Remote Support Terms
          </a>
          . Remote sessions require explicit authorization when scheduled.
        </label>
      </div>

      <button
        type="submit"
        disabled={cooldownRemaining > 0}
        className="w-full min-h-[46px] px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-slate-950 font-bold text-sm transition-colors shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
      >
        <Send className="w-4 h-4" aria-hidden="true" />
        <span>
          {cooldownRemaining > 0
            ? `Wait ${cooldownRemaining}s before new request`
            : 'Prepare Support Request for support@remotfix.in'}
        </span>
      </button>
    </form>
  );
};
