import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle,
  Mail,
  Phone,
  Building2,
  User,
  Server,
  Cpu,
  Network,
  ArrowRight,
  Copy,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

interface AmcInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_REGEX = /^[+\d\s().-]{7,20}$/;

function sanitizeLine(val: string, maxLen: number): string {
  return val.replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, maxLen);
}

export const AmcInquiryModal: React.FC<AmcInquiryModalProps> = ({ isOpen, onClose }) => {
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [workstations, setWorkstations] = useState(15);
  const [networkRacks, setNetworkRacks] = useState(1);
  const [servers, setServers] = useState(1);
  const [serviceTier, setServiceTier] = useState<'business_hours' | 'extended_priority'>('business_hours');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [copiedRef, setCopiedRef] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const buildMailtoHref = (ref: string) => {
    const cleanCompany = sanitizeLine(companyName, 100);
    const cleanContact = sanitizeLine(contactName, 80);
    const cleanEmail = sanitizeLine(email, 120);
    const cleanPhone = sanitizeLine(phone, 24);
    const cleanNotes = additionalNotes.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim().slice(0, 800);

    const subject = encodeURIComponent(`IT AMC Inquiry [${ref}]: ${cleanCompany || cleanContact}`);
    const body = encodeURIComponent(
      `Hello Remotfix Support Team,\n\nI would like to request an IT AMC proposal:\n\nReference ID: ${ref}\nCompany: ${cleanCompany}\nContact: ${cleanContact}\nEmail: ${cleanEmail}\nPhone: ${cleanPhone || 'Not provided'}\n\nEstimated Asset Scope:\n- Workstations / Laptops: ${workstations}\n- Network Racks / Switches: ${networkRacks}\n- Servers / NAS: ${servers}\n- Preferred Support Window: ${
        serviceTier === 'extended_priority'
          ? 'Priority Agreement (Extended Hours / Scheduled Escalation)'
          : 'Standard Business Hours Coverage'
      }\n\nNotes: ${cleanNotes || 'N/A'}\n`
    );
    return `mailto:support@remotfix.in?subject=${subject}&body=${body}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (honeypot.trim().length > 0) return;

    const cleanCompany = sanitizeLine(companyName, 100);
    const cleanContact = sanitizeLine(contactName, 80);
    const cleanEmail = sanitizeLine(email, 120).toLowerCase();
    const cleanPhone = sanitizeLine(phone, 24);

    if (cleanCompany.length < 2) {
      setErrorMsg('Please enter your company or organization name.');
      return;
    }
    if (cleanContact.length < 2) {
      setErrorMsg('Please enter a contact person name.');
      return;
    }
    if (!EMAIL_REGEX.test(cleanEmail)) {
      setErrorMsg('Please enter a valid business email address.');
      return;
    }
    if (cleanPhone.length > 0 && !PHONE_REGEX.test(cleanPhone)) {
      setErrorMsg('Please enter a valid phone number or leave it blank.');
      return;
    }

    const newRefId = `AMC-${Math.floor(100000 + Math.random() * 900000)}`;
    setReferenceId(newRefId);
    setIsSubmitted(true);
  };

  const handleCopyRef = async () => {
    try {
      await navigator.clipboard.writeText(referenceId);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    } catch {
      setErrorMsg('Clipboard access is restricted in this browser.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="amc-modal-title"
    >
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl bg-slate-900/95 backdrop-blur-2xl border border-slate-700/70 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden z-10 my-8">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="h-10 px-2.5 py-1 rounded-xl bg-white/95 border border-white/30 flex items-center justify-center shrink-0">
              <picture>
                <source srcSet="/assets/brand/remotfix-logo.webp" type="image/webp" />
                <img
                  src="/assets/aistudio/1791411926566_992a226a.png"
                  alt="Remotfix Logo"
                  width={96}
                  height={28}
                  className="h-7 w-auto object-contain"
                />
              </picture>
            </div>
            <div>
              <h2 id="amc-modal-title" className="text-base sm:text-lg font-semibold text-white font-display">
                Request IT AMC Proposal
              </h2>
              <p className="text-xs text-slate-300">
                <span className="text-cyan-300 font-semibold font-mono">Remote IT Solutions &amp; Support</span> ·{' '}
                <span className="font-mono text-slate-300">support@remotfix.in</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close AMC inquiry dialog"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-6 sm:p-8 text-center space-y-6" role="status" aria-live="polite">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7" aria-hidden="true" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white font-display">AMC Request Summary Ready</h3>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                Click the email button below to send your infrastructure scope directly to{' '}
                <span className="font-mono text-cyan-300">support@remotfix.in</span>. No sensitive customer data is persisted in browser storage.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between max-w-md mx-auto">
              <div className="text-left">
                <div className="text-xs text-slate-400 font-mono">Reference Code</div>
                <div className="text-base font-bold text-cyan-300 font-mono tracking-wider">{referenceId}</div>
              </div>
              <button
                type="button"
                onClick={handleCopyRef}
                className="min-h-[40px] flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{copiedRef ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={buildMailtoHref(referenceId)}
                className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition-colors shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                <span>Send Email to support@remotfix.in</span>
              </a>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm transition-colors border border-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="p-6 space-y-5">
            <div className="sr-only" aria-hidden="true">
              <label htmlFor="amc-hp">Leave empty</label>
              <input
                id="amc-hp"
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
                className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="amc-company" className="block text-xs font-medium text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" /> Company / Organization *
                </label>
                <input
                  id="amc-company"
                  type="text"
                  required
                  maxLength={100}
                  placeholder="Your business name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus:border-cyan-500/60"
                />
              </div>

              <div>
                <label htmlFor="amc-contact" className="block text-xs font-medium text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" /> Contact Person *
                </label>
                <input
                  id="amc-contact"
                  type="text"
                  required
                  maxLength={80}
                  placeholder="Full name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus:border-cyan-500/60"
                />
              </div>

              <div>
                <label htmlFor="amc-email" className="block text-xs font-medium text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" /> Business Email *
                </label>
                <input
                  id="amc-email"
                  type="email"
                  required
                  maxLength={120}
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus:border-cyan-500/60"
                />
              </div>

              <div>
                <label htmlFor="amc-phone" className="block text-xs font-medium text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" /> Phone (Optional)
                </label>
                <input
                  id="amc-phone"
                  type="tel"
                  maxLength={24}
                  placeholder="+91 ..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus:border-cyan-500/60"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 space-y-4">
              <div className="text-xs font-semibold text-slate-300">Estimated IT Asset Scope</div>

              <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="amc-workstations" className="font-medium text-slate-200 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyan-400" aria-hidden="true" /> Workstations &amp; Laptops
                  </label>
                  <span className="font-mono tabular-nums text-cyan-300 font-semibold">{workstations} Units</span>
                </div>
                <input
                  id="amc-workstations"
                  type="range"
                  min="1"
                  max="150"
                  step="1"
                  value={workstations}
                  onChange={(e) => setWorkstations(Number(e.target.value))}
                  className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <label htmlFor="amc-racks" className="font-medium text-slate-200 flex items-center gap-2">
                      <Network className="w-4 h-4 text-cyan-400" aria-hidden="true" /> Network Racks / Routers
                    </label>
                    <span className="font-mono tabular-nums text-cyan-300 font-semibold">{networkRacks}</span>
                  </div>
                  <input
                    id="amc-racks"
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={networkRacks}
                    onChange={(e) => setNetworkRacks(Number(e.target.value))}
                    className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <label htmlFor="amc-servers" className="font-medium text-slate-200 flex items-center gap-2">
                      <Server className="w-4 h-4 text-cyan-400" aria-hidden="true" /> Servers / NAS Nodes
                    </label>
                    <span className="font-mono tabular-nums text-cyan-300 font-semibold">{servers}</span>
                  </div>
                  <input
                    id="amc-servers"
                    type="range"
                    min="0"
                    max="15"
                    step="1"
                    value={servers}
                    onChange={(e) => setServers(Number(e.target.value))}
                    className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-300">Support Coverage Window</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setServiceTier('business_hours')}
                  className={`min-h-[44px] p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                    serviceTier === 'business_hours'
                      ? 'bg-cyan-500/10 border-cyan-500/60'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-semibold text-white">Standard Business Hours</div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    Scheduled preventive maintenance &amp; same-day remote response
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setServiceTier('extended_priority')}
                  className={`min-h-[44px] p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                    serviceTier === 'extended_priority'
                      ? 'bg-cyan-500/10 border-cyan-500/60'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-semibold text-cyan-300">Priority SLA Agreement</div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    Defined escalation targets &amp; agreed after-hours maintenance windows
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="amc-notes" className="block text-xs font-medium text-slate-200 mb-1.5">
                Additional Infrastructure Notes (Optional)
              </label>
              <textarea
                id="amc-notes"
                rows={2}
                maxLength={800}
                placeholder="Operating systems, office locations, or key software tools. Do not share passwords."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              />
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" aria-hidden="true" />
              <span>
                Proposals are scoped transparently and delivered from <strong className="text-white">support@remotfix.in</strong>.
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 text-slate-200 text-sm font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="min-h-[44px] px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition-colors shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer"
              >
                <span>Prepare AMC Request</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
