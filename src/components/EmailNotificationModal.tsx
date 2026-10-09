import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Bell, 
  Send, 
  AlertTriangle, 
  Download,
  Laptop,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Shield,
  FileText,
  Eye
} from 'lucide-react';
import { Ticket, DispatchedEmail } from '../types';

interface EmailNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket;
  defaultTab?: 'customer' | 'admin';
}

export const EmailNotificationModal: React.FC<EmailNotificationModalProps> = ({
  isOpen,
  onClose,
  ticket,
  defaultTab = 'customer'
}) => {
  const [activeTab, setActiveTab] = useState<'customer' | 'admin'>(defaultTab);
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !ticket) return null;

  const customerEmail = ticket.emails?.find((e) => e.recipientRole === 'customer');
  const adminEmail = ticket.emails?.find((e) => e.recipientRole === 'admin');

  const currentEmail: DispatchedEmail | undefined =
    activeTab === 'customer' ? customerEmail : adminEmail;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (email: DispatchedEmail) => {
    const blob = new Blob([email.htmlBody], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `remotfix-email-${email.recipientRole}-${ticket.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateMailto = (email: DispatchedEmail) => {
    return `mailto:${email.recipient}?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.htmlBody)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-3xl rounded-2xl border border-white/20 bg-[#0A0D14] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 sm:px-6 py-4 bg-black/60">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/30">
              <Mail className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-sm sm:text-base font-bold text-white">
                  Automated Email Notification Hub
                </h3>
                <span className="rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono">
                  DISPATCHED
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Triggered for Ticket <strong className="font-mono text-cyan-300">{ticket.id}</strong> · remotfix.in
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Dispatch Route Banner */}
        <div className="border-b border-white/10 bg-white/[0.02] px-5 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Tab Switcher: Customer Email vs support@remotfix.in Admin Email */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('customer')}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors cursor-pointer ${
                activeTab === 'customer'
                  ? 'bg-cyan-400 text-black font-bold shadow-md shadow-cyan-400/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Send className="h-3.5 w-3.5" />
              <span>Customer Receipt ({ticket.customerEmail})</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-amber-400 text-black font-bold shadow-md shadow-amber-400/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Bell className="h-3.5 w-3.5 text-amber-500" />
              <span>Admin Alert (support@remotfix.in)</span>
            </button>
          </div>

          {/* View Mode Toggle: Formatted vs Raw Text */}
          <div className="flex items-center gap-1 rounded-lg bg-black/60 p-1 border border-white/10 text-[11px]">
            <button
              onClick={() => setViewMode('formatted')}
              className={`flex items-center gap-1 rounded px-2.5 py-1 transition-colors cursor-pointer ${
                viewMode === 'formatted'
                  ? 'bg-white/20 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="h-3 w-3" />
              <span>Formatted</span>
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`flex items-center gap-1 rounded px-2.5 py-1 transition-colors cursor-pointer ${
                viewMode === 'raw'
                  ? 'bg-white/20 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="h-3 w-3" />
              <span>Raw Text</span>
            </button>
          </div>
        </div>

        {/* Email Client Viewer Screen */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {currentEmail ? (
            <div className="rounded-xl border border-white/15 bg-black/75 overflow-hidden font-sans shadow-xl">
              
              {/* Mail Envelope Meta Header */}
              <div className="border-b border-white/10 bg-white/[0.03] p-4 text-xs space-y-2.5 font-mono">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">From:</span>
                    <span className="text-white font-semibold">{currentEmail.from}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(currentEmail.sentAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">To:</span>
                    <span className="text-cyan-400 font-bold">{currentEmail.recipient}</span>
                  </div>
                  {currentEmail.recipientRole === 'admin' ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded font-mono border border-amber-400/30">
                        CC: suraj@remotfix.in (Founder)
                      </span>
                      <span className="text-[10px] bg-cyan-400/20 text-cyan-300 px-2 py-0.5 rounded font-mono border border-cyan-400/30">
                        Target: support@remotfix.in
                      </span>
                    </div>
                  ) : (
                    <span className="text-[10px] bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded font-mono border border-emerald-400/30">
                      Delivered to Customer Inbox
                    </span>
                  )}
                </div>

                <div className="flex items-start gap-2 pt-0.5">
                  <span className="text-slate-500 shrink-0">Subject:</span>
                  <span className="text-white font-bold font-sans text-xs sm:text-sm">
                    {currentEmail.subject}
                  </span>
                </div>

                {/* Authentication Security Badges */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>DKIM: PASS (remotfix.in)</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <ShieldCheck className="h-3 w-3" />
                    <span>SPF: PASS</span>
                  </span>
                  <span>·</span>
                  <span className="text-slate-400">TLS 1.3 256-bit</span>
                  <span>·</span>
                  <span className="text-cyan-400">Cloudflare MX Relay</span>
                </div>
              </div>

              {/* Email Body Content */}
              {viewMode === 'formatted' ? (
                <div className="p-5 sm:p-7 space-y-6 text-slate-200 bg-gradient-to-b from-[#0A0E17] to-[#07090F]">
                  
                  {/* Brand Email Header Container */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500 text-black font-extrabold font-mono text-sm">
                        RF
                      </div>
                      <div>
                        <div className="font-display font-black text-sm tracking-wide text-white">
                          REMOTFIX<span className="text-cyan-400">.IN</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          On-Demand Remote IT Support & Troubleshooting
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Reference</span>
                      <span className="font-mono text-xs font-bold text-cyan-400">#{ticket.id}</span>
                    </div>
                  </div>

                  {/* Contextual Email Banner */}
                  {activeTab === 'customer' ? (
                    <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4 space-y-1.5">
                      <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                        <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                        <span>Support Request Received & In Review</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Hi <strong>{ticket.customerName}</strong>, thank you for contacting Remotfix. We have received your support request for Ticket <strong>#{ticket.id}</strong> and our senior engineering dispatch is already reviewing your case.
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-amber-500/40 bg-amber-950/20 p-4 space-y-1.5">
                      <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                        <AlertTriangle className="h-4 w-4 text-amber-400" />
                        <span>⚡ New Support Request Notification (support@remotfix.in)</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Urgent dispatch alert for <strong>support@remotfix.in</strong> (CC: suraj@remotfix.in). A new diagnostic booking has been submitted by <strong>{ticket.customerName}</strong> with <strong>{ticket.urgency.toUpperCase()}</strong> priority SLA.
                      </p>
                    </div>
                  )}

                  {/* Summary Specification Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3.5 space-y-1">
                      <span className="text-slate-500 text-[10px] uppercase font-mono block">Ticket Reference</span>
                      <span className="text-white font-bold font-mono text-sm">{ticket.id}</span>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3.5 space-y-1">
                      <span className="text-slate-500 text-[10px] uppercase font-mono block">Priority SLA</span>
                      <span className={`inline-block font-mono text-xs font-bold uppercase px-2 py-0.5 rounded ${
                        ticket.urgency === 'Emergency'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : ticket.urgency === 'Priority'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      }`}>
                        {ticket.urgency}
                      </span>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3.5 space-y-1">
                      <span className="text-slate-500 text-[10px] uppercase font-mono block">Device / OS</span>
                      <span className="text-white font-semibold">{ticket.os}</span>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3.5 space-y-1">
                      <span className="text-slate-500 text-[10px] uppercase font-mono block">Remote Connection Tool</span>
                      <span className="text-cyan-300 font-semibold">
                        {ticket.preferredTool === 'quick_assist' ? 'Microsoft Quick Assist (Win+Ctrl+Q)' : 'AnyDesk'}
                      </span>
                    </div>
                  </div>

                  {/* Symptom Description Box */}
                  <div className="rounded-xl border border-white/10 bg-black/50 p-4 space-y-2">
                    <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">
                      Reported Issue & Symptom:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans bg-white/[0.03] p-3 rounded border border-white/5">
                      {ticket.description}
                    </p>
                  </div>

                  {/* Customer Information (Admin View Highlight) */}
                  {activeTab === 'admin' && (
                    <div className="rounded-xl border border-amber-500/30 bg-black/60 p-4 space-y-2 text-xs font-mono">
                      <span className="text-amber-400 font-bold uppercase tracking-wider block font-sans">
                        Customer Direct Contact Record:
                      </span>
                      <div className="space-y-1.5 text-slate-300">
                        <div>Name: <span className="text-white font-semibold">{ticket.customerName}</span></div>
                        <div>Email: <span className="text-cyan-400 font-semibold">{ticket.customerEmail}</span></div>
                        <div>Phone/WhatsApp: <span className="text-white">{ticket.customerPhone || 'Not provided'}</span></div>
                        <div>Scheduled Slot: <span className="text-amber-300">{ticket.scheduledTime || 'Immediate Connection Requested'}</span></div>
                      </div>
                    </div>
                  )}

                  {/* Next Steps & Security Protocol */}
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-2 text-xs">
                    <span className="text-white font-semibold uppercase tracking-wider text-[11px] block">
                      {activeTab === 'customer' ? 'Next Steps for Your Session:' : 'Technician Dispatch Checklist:'}
                    </span>
                    <ol className="list-decimal pl-4 space-y-1.5 text-slate-300">
                      {activeTab === 'customer' ? (
                        <>
                          <li>Keep your device powered on and connected to the Internet.</li>
                          <li>Lead Engineer (Suraj) will generate a temporary 6-digit one-time PIN code.</li>
                          <li>You can watch every cursor movement and sever the session at any second with 1-click.</li>
                        </>
                      ) : (
                        <>
                          <li>Acknowledge ticket in Staff Console: <code className="text-cyan-300">https://remotfix.in/console</code></li>
                          <li>Generate 6-digit Quick Assist PIN code or send AnyDesk room address.</li>
                          <li>If urgent triage needed, reply to customer at <code className="text-amber-300">{ticket.customerEmail}</code>.</li>
                        </>
                      )}
                    </ol>
                  </div>

                  {/* Sign-off Footer */}
                  <div className="border-t border-white/10 pt-4 text-xs text-slate-400 space-y-1">
                    <p className="text-white font-semibold">
                      {activeTab === 'customer' ? 'Remotfix Automated Support Team' : 'Remotfix Automated Dispatch Engine'}
                    </p>
                    <p>Official Support Email: <a href="mailto:support@remotfix.in" className="text-cyan-400 hover:underline">support@remotfix.in</a> · Founder: <a href="mailto:suraj@remotfix.in" className="text-amber-300 hover:underline">suraj@remotfix.in</a></p>
                    <p className="text-[11px] text-slate-500">
                      https://remotfix.in · Domain protected & routed via Cloudflare
                    </p>
                  </div>

                </div>
              ) : (
                /* Raw Plain Text Email */
                <div className="p-6 text-xs sm:text-sm leading-relaxed text-slate-200 whitespace-pre-wrap font-mono bg-gradient-to-b from-black/80 to-[#0A0D15]">
                  {currentEmail.htmlBody}
                </div>
              )}

            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-500">
              No email record found for this role.
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="border-t border-white/10 bg-black/60 px-5 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {currentEmail && (
              <>
                <button
                  onClick={() => handleCopy(currentEmail.htmlBody)}
                  className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs text-white transition-colors cursor-pointer"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Email Text'}</span>
                </button>

                <button
                  onClick={() => handleDownload(currentEmail)}
                  className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs text-white transition-colors cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download File</span>
                </button>

                <a
                  href={generateMailto(currentEmail)}
                  className="flex items-center gap-1.5 rounded-lg border border-cyan-400/30 bg-cyan-950/30 hover:bg-cyan-950/60 px-3 py-1.5 text-xs text-cyan-300 transition-colors"
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Test Native Client</span>
                </a>
              </>
            )}
          </div>

          <button
            onClick={onClose}
            className="rounded-lg bg-white hover:bg-slate-200 px-4 py-1.5 text-xs font-semibold text-black transition-colors cursor-pointer"
          >
            Close Email Hub
          </button>
        </div>

      </div>
    </div>
  );
};
