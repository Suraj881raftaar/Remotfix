import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  Bell, 
  Check, 
  Copy, 
  ExternalLink, 
  Download, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  FileText, 
  Laptop, 
  Monitor, 
  Sparkles, 
  UserCheck, 
  ArrowRight, 
  Shield,
  Layers
} from 'lucide-react';
import { Ticket, DispatchedEmail } from '../types';

export interface EmailTemplatesProps {
  ticket?: Ticket;
  defaultTemplate?: 'customer' | 'admin';
  showControls?: boolean;
  className?: string;
}

// Fallback sample ticket if rendered in standalone preview
const SAMPLE_TICKET: Ticket = {
  id: 'RF-48291',
  customerName: 'Marcus Vance',
  customerEmail: 'm.vance@techcorp.io',
  customerPhone: '+1 (555) 392-1084',
  os: 'Windows 11 Pro (23H2)',
  category: 'Blue Screen (BSOD) / Fatal System Crashes',
  urgency: 'Priority',
  timing: 'immediate',
  description: 'System encounters intermittent CRITICAL_PROCESS_DIED stop code crashes every 45 minutes during high RAM workload or video calls. Minidump files indicate possible driver conflict.',
  status: 'received',
  assignedTechnician: 'Suraj (Founder & Lead Engineer)',
  preferredTool: 'quick_assist',
  sessionCode: '492 810',
  messages: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

/**
 * 1. Booking Confirmation Email Mockup (Sent to User / Customer)
 */
export const CustomerBookingConfirmationEmail: React.FC<{
  ticket: Ticket;
  viewMode?: 'formatted' | 'raw';
}> = ({ ticket, viewMode = 'formatted' }) => {
  const customerEmail = ticket.emails?.find((e) => e.recipientRole === 'customer');
  const rawBody = customerEmail?.htmlBody || `Hi ${ticket.customerName},

Thank you for contacting Remotfix. We have received your support request for Ticket #${ticket.id}.

TICKET SUMMARY:
- Ticket Reference: #${ticket.id}
- Operating System: ${ticket.os}
- Issue Category: ${ticket.category}
- Priority SLA: ${ticket.urgency}
- Connection Tool: ${ticket.preferredTool === 'quick_assist' ? 'Microsoft Quick Assist (Win+Ctrl+Q)' : 'AnyDesk'}
- Timing: ${ticket.timing === 'immediate' ? 'Immediate Queue (~15 min)' : ticket.scheduledTime || 'Scheduled Slot'}

REPORTED ISSUE:
${ticket.description}

NEXT STEPS:
1. Keep your computer powered on and connected to the internet.
2. A certified senior technician (Suraj - Founder & Lead Systems Engineer) is reviewing your case and will issue a 6-digit connection PIN.
3. Access your Live Remote Session Room:
   https://remotfix.in/track?ticket=${ticket.id}

SECURITY GUARANTEE:
All sessions use 256-bit TLS bank-grade encryption. You watch every action live on your screen and can sever connection instantly with one click.

Best regards,
Remotfix Automated Support Team
https://remotfix.in · support@remotfix.in`;

  if (viewMode === 'raw') {
    return (
      <div className="rounded-xl border border-white/10 bg-black/90 p-5 font-mono text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed shadow-inner">
        {rawBody}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/15 bg-gradient-to-b from-[#0B0F19] to-[#07090F] overflow-hidden shadow-2xl font-sans">
      
      {/* Top Envelope Bar */}
      <div className="border-b border-white/10 bg-white/[0.03] p-4 text-xs font-mono space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">From:</span>
            <span className="text-white font-semibold">Remotfix Support &lt;support@remotfix.in&gt;</span>
          </div>
          <span className="text-[11px] text-slate-500">{new Date(ticket.createdAt).toLocaleString()}</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">To:</span>
            <span className="text-cyan-400 font-bold">{ticket.customerEmail}</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono border border-emerald-500/30">
              Customer Inbox
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
            <CheckCircle2 className="h-3 w-3" />
            <span>Delivered via Cloudflare MX</span>
          </div>
        </div>

        <div className="flex items-start gap-2 pt-0.5">
          <span className="text-slate-500 shrink-0">Subject:</span>
          <span className="text-white font-bold font-sans text-xs sm:text-sm">
            [Remotfix] Support Request Received – Ticket #{ticket.id}
          </span>
        </div>
      </div>

      {/* Styled Email Letter Body */}
      <div className="p-6 sm:p-8 space-y-6">
        
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400 text-black font-extrabold font-mono text-base shadow-md shadow-cyan-400/20">
              RF
            </div>
            <div>
              <div className="font-display font-black text-base tracking-wider text-white">
                REMOTFIX<span className="text-cyan-400">.IN</span>
              </div>
              <div className="text-[11px] text-slate-400">
                On-Demand Remote IT Support & Troubleshooting
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-mono text-slate-500 block">Ticket Reference</span>
            <span className="font-mono text-sm font-bold text-cyan-300">#{ticket.id}</span>
          </div>
        </div>

        {/* Confirmation Status Banner */}
        <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-5 space-y-2">
          <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
            <CheckCircle2 className="h-4.5 w-4.5 text-cyan-400" />
            <span>Support Request Received & In Review</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Hi <strong>{ticket.customerName}</strong>, thank you for booking remote assistance with Remotfix. We have received your technical support request for Ticket <strong>#{ticket.id}</strong>. Our certified senior systems team is preparing your diagnostic room.
          </p>
        </div>

        {/* Structured Ticket Specs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5 space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 block">Ticket Reference ID</span>
            <span className="font-mono text-sm font-bold text-white">{ticket.id}</span>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5 space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 block">Priority SLA</span>
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

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5 space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 block">Operating System</span>
            <span className="text-white font-semibold">{ticket.os}</span>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5 space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 block">Remote Access Tool</span>
            <span className="text-cyan-300 font-semibold">
              {ticket.preferredTool === 'quick_assist' ? 'Microsoft Quick Assist (Win+Ctrl+Q)' : 'AnyDesk Remote'}
            </span>
          </div>
        </div>

        {/* Symptom Description Box */}
        <div className="rounded-xl border border-white/10 bg-black/60 p-4 space-y-2 text-xs">
          <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[11px]">
            Reported Issue & Symptom:
          </span>
          <p className="text-slate-200 leading-relaxed font-sans bg-white/[0.02] p-3 rounded-lg border border-white/5">
            {ticket.description}
          </p>
        </div>

        {/* What Happens Next Guide */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-3 text-xs">
          <span className="text-white font-semibold uppercase tracking-wider text-[11px] block">
            What Happens Next:
          </span>
          <ol className="list-decimal pl-4 space-y-2 text-slate-300">
            <li>
              <strong>Keep your device powered on:</strong> Make sure your system remains active and connected to Wi-Fi.
            </li>
            <li>
              <strong>Technician Handshake:</strong> A certified senior engineer (Suraj - Founder & Lead Tech) will review your diagnosis and dispatch a 6-digit one-time PIN code.
            </li>
            <li>
              <strong>Join your Live Session Room:</strong> You can enter your session room directly to monitor progress in real-time.
            </li>
          </ol>

          <div className="pt-2">
            <div className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2 text-xs font-bold text-black uppercase tracking-wider">
              <span>https://remotfix.in/track?ticket={ticket.id}</span>
            </div>
          </div>
        </div>

        {/* Zero-Trust Security Guarantee */}
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/15 p-4 flex items-start gap-3 text-xs">
          <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-emerald-300 font-bold block">
              Zero-Persistence Security Guarantee
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              All sessions utilize 256-bit TLS bank-grade encryption. You retain 100% control over your mouse and keyboard, watch every diagnostic action live, and can sever the connection instantly with one click.
            </p>
          </div>
        </div>

        {/* Footer Sign-off */}
        <div className="border-t border-white/10 pt-5 text-xs text-slate-400 space-y-1.5">
          <p className="text-white font-semibold">Remotfix Automated Support Helpdesk</p>
          <p>
            Questions? Reply directly to this email or reach us at{' '}
            <span className="text-cyan-400 font-semibold">support@remotfix.in</span>
          </p>
          <p className="text-[11px] text-slate-500 font-mono">
            remotfix.in · DNS & SSL protected by Cloudflare · Founder: suraj@remotfix.in
          </p>
        </div>

      </div>
    </div>
  );
};

/**
 * 2. Request Notification Email Mockup (Sent to support@remotfix.in)
 */
export const AdminRequestNotificationEmail: React.FC<{
  ticket: Ticket;
  viewMode?: 'formatted' | 'raw';
}> = ({ ticket, viewMode = 'formatted' }) => {
  const adminEmail = ticket.emails?.find((e) => e.recipientRole === 'admin');
  const rawBody = adminEmail?.htmlBody || `⚡ URGENT DISPATCH NOTIFICATION
New Diagnostic Support Request Received on remotfix.in

TICKET DETAILS:
- Ticket Reference: #${ticket.id}
- Submission Time: ${new Date(ticket.createdAt).toLocaleString()}
- Priority SLA: ${ticket.urgency.toUpperCase()}
- Mode: ${ticket.timing === 'immediate' ? 'IMMEDIATE CONNECTION REQUEST' : `SCHEDULED: ${ticket.scheduledTime}`}

CUSTOMER CONTACT:
- Name: ${ticket.customerName}
- Email: ${ticket.customerEmail}
- Phone / WhatsApp: ${ticket.customerPhone || 'Not provided'}

SYSTEM SPECIFICATION:
- Operating System: ${ticket.os}
- Problem Category: ${ticket.category}
- Preferred Remote Tool: ${ticket.preferredTool === 'quick_assist' ? 'Quick Assist (Win+Ctrl+Q)' : 'AnyDesk'}

REPORTED SYMPTOM / ERROR:
${ticket.description}

DISPATCH ACTIONS REQUIRED:
1. Open Staff Console to accept ticket:
   https://remotfix.in/console
2. Generate 6-digit Quick Assist PIN or dispatch AnyDesk session address.
3. If urgent, contact customer directly at ${ticket.customerEmail} or ${ticket.customerPhone || 'via email'}.

--
Remotfix Automated Notification Dispatcher
Domain: remotfix.in (DNS via Cloudflare)
CC: suraj@remotfix.in`;

  if (viewMode === 'raw') {
    return (
      <div className="rounded-xl border border-white/10 bg-black/90 p-5 font-mono text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed shadow-inner">
        {rawBody}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-b from-[#120E08] to-[#0A0D14] overflow-hidden shadow-2xl font-sans">
      
      {/* Top Envelope Bar */}
      <div className="border-b border-white/10 bg-black/60 p-4 text-xs font-mono space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">From:</span>
            <span className="text-white font-semibold">Remotfix Dispatch Engine &lt;dispatcher@remotfix.in&gt;</span>
          </div>
          <span className="text-[11px] text-slate-500">{new Date(ticket.createdAt).toLocaleString()}</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-500">To:</span>
            <span className="text-amber-300 font-bold">support@remotfix.in</span>
            <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded font-mono border border-amber-400/30">
              CC: suraj@remotfix.in (Founder)
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-amber-400">
            <AlertTriangle className="h-3 w-3" />
            <span>High-Priority Triage Alert</span>
          </div>
        </div>

        <div className="flex items-start gap-2 pt-0.5">
          <span className="text-slate-500 shrink-0">Subject:</span>
          <span className="text-amber-200 font-bold font-sans text-xs sm:text-sm">
            ⚡ [URGENT DISPATCH] New Diagnostic Request #{ticket.id} – {ticket.customerName} ({ticket.urgency})
          </span>
        </div>
      </div>

      {/* Styled Email Letter Body */}
      <div className="p-6 sm:p-8 space-y-6">
        
        {/* Brand Header with Alert Flare */}
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400 text-black font-extrabold font-mono text-base shadow-md shadow-amber-400/20">
              ⚡
            </div>
            <div>
              <div className="font-display font-black text-base tracking-wider text-white">
                REMOTFIX DISPATCH CENTER
              </div>
              <div className="text-[11px] text-amber-400/80 font-mono">
                Automated Inbound Service Alert · support@remotfix.in
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-mono text-slate-500 block">SLA Level</span>
            <span className="font-mono text-sm font-extrabold text-amber-400 uppercase">
              {ticket.urgency}
            </span>
          </div>
        </div>

        {/* Urgent Notification Banner */}
        <div className="rounded-xl border border-amber-500/40 bg-amber-950/25 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <AlertTriangle className="h-4.5 w-4.5 text-amber-400" />
              <span>New Support Request Logged on remotfix.in</span>
            </div>
            <span className="font-mono text-xs text-amber-400/90 bg-black/40 px-2 py-0.5 rounded border border-amber-500/30">
              Immediate Attention
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            A customer has submitted a new live diagnostic booking via BookingWizard. Please review symptoms, assign lead technician, and prepare session PIN.
          </p>
        </div>

        {/* Customer Contact Profile */}
        <div className="rounded-xl border border-white/10 bg-black/60 p-5 space-y-3 text-xs font-mono">
          <span className="text-amber-400 font-bold uppercase tracking-wider block font-sans text-xs">
            Customer Profile & Communication Details:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
            <div>
              <span className="text-slate-500 block text-[10px]">Client Name:</span>
              <strong className="text-white text-sm">{ticket.customerName}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Direct Email:</span>
              <strong className="text-cyan-400">{ticket.customerEmail}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Phone / WhatsApp:</span>
              <strong className="text-white">{ticket.customerPhone || 'Not provided by user'}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Requested Timing:</span>
              <strong className="text-amber-300">
                {ticket.timing === 'immediate' ? 'Immediate Standby (Live Queue)' : ticket.scheduledTime || 'Scheduled'}
              </strong>
            </div>
          </div>
        </div>

        {/* System & Hardware Diagnostics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5 space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 block">Operating System</span>
            <span className="text-white font-semibold">{ticket.os}</span>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5 space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 block">Problem Category</span>
            <span className="text-white font-semibold">{ticket.category}</span>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5 space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 block">Preferred Remote Tool</span>
            <span className="text-cyan-300 font-semibold">
              {ticket.preferredTool === 'quick_assist' ? 'Quick Assist (Win+Ctrl+Q)' : 'AnyDesk Remote'}
            </span>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5 space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 block">Dispatch Routing Target</span>
            <span className="text-amber-300 font-semibold font-mono">support@remotfix.in</span>
          </div>
        </div>

        {/* Customer Symptom Log */}
        <div className="rounded-xl border border-white/10 bg-black/60 p-4 space-y-2 text-xs">
          <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[11px]">
            Customer Submitted Symptom Log:
          </span>
          <p className="text-slate-200 leading-relaxed font-sans bg-white/[0.02] p-3 rounded-lg border border-white/5">
            {ticket.description}
          </p>
        </div>

        {/* Required Staff Actions Checklist */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-3 text-xs">
          <span className="text-white font-semibold uppercase tracking-wider text-[11px] block">
            Technician Dispatch Checklist:
          </span>
          <ol className="list-decimal pl-4 space-y-2 text-slate-300">
            <li>
              <strong>Claim Ticket:</strong> Open Technician Console at{' '}
              <span className="text-cyan-300 font-mono">https://remotfix.in/console</span> to claim ticket #{ticket.id}.
            </li>
            <li>
              <strong>Generate Session Code:</strong> Dispatch 6-digit Quick Assist PIN or provide AnyDesk Relay address.
            </li>
            <li>
              <strong>Customer Direct Contact:</strong> If triage questions arise, reply to{' '}
              <span className="text-amber-300 font-mono">{ticket.customerEmail}</span> or message via WhatsApp.
            </li>
          </ol>
        </div>

        {/* Footer Dispatch Sign-off */}
        <div className="border-t border-white/10 pt-5 text-xs text-slate-400 space-y-1.5 font-mono">
          <p className="text-white font-semibold">Remotfix Automated Notification Dispatcher</p>
          <p>Target Mailbox: <span className="text-amber-300">support@remotfix.in</span> (CC: suraj@remotfix.in)</p>
          <p className="text-[11px] text-slate-500">
            remotfix.in · High-Frame Rate 256-Bit TLS · DNS via Cloudflare
          </p>
        </div>

      </div>
    </div>
  );
};

/**
 * 3. Master EmailTemplates Component with Interactive Tab Selector and Inspector Controls
 */
export const EmailTemplates: React.FC<EmailTemplatesProps> = ({
  ticket = SAMPLE_TICKET,
  defaultTemplate = 'customer',
  showControls = true,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'customer' | 'admin'>(defaultTemplate);
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted');
  const [copied, setCopied] = useState(false);

  const activeEmail = ticket.emails?.find((e) => e.recipientRole === activeTab);
  const emailTextToCopy =
    activeEmail?.htmlBody ||
    (activeTab === 'customer'
      ? `Booking Confirmation Email for Ticket #${ticket.id}\nTo: ${ticket.customerEmail}\n\nHi ${ticket.customerName},\nThank you for choosing Remotfix. Support request #${ticket.id} received for ${ticket.category}.`
      : `Admin Request Notification for Ticket #${ticket.id}\nTo: support@remotfix.in\nCC: suraj@remotfix.in\n\nNew Support Request from ${ticket.customerName} (${ticket.urgency}).`);

  const handleCopy = () => {
    navigator.clipboard.writeText(emailTextToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([emailTextToCopy], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `remotfix-email-${activeTab}-${ticket.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const mailtoRecipient = activeTab === 'customer' ? ticket.customerEmail : 'support@remotfix.in';
  const mailtoSubject =
    activeTab === 'customer'
      ? `[Remotfix] Support Request Received – Ticket #${ticket.id}`
      : `⚡ [URGENT DISPATCH] New Support Request #${ticket.id} – ${ticket.customerName}`;

  return (
    <div className={`space-y-4 ${className}`}>
      
      {/* Interactive Control Header */}
      {showControls && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/60 p-4 text-xs backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/30">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-white text-xs sm:text-sm">
                Automated Email Notification Mockups
              </h3>
              <p className="text-[11px] text-slate-400">
                Triggered on BookingWizard completion · Ticket #{ticket.id}
              </p>
            </div>
          </div>

          {/* Template Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('customer')}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 font-semibold transition-colors cursor-pointer ${
                activeTab === 'customer'
                  ? 'bg-cyan-400 text-black shadow-md shadow-cyan-400/20'
                  : 'text-slate-400 hover:text-white bg-white/5'
              }`}
            >
              <Send className="h-3.5 w-3.5" />
              <span>Customer Receipt ({ticket.customerEmail})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 font-semibold transition-colors cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                  : 'text-slate-400 hover:text-white bg-white/5'
              }`}
            >
              <Bell className="h-3.5 w-3.5 text-amber-500" />
              <span>Admin Alert (support@remotfix.in)</span>
            </button>
          </div>

          {/* Mode & Action Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg bg-black/80 p-1 border border-white/10 text-[11px]">
              <button
                type="button"
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
                type="button"
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

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs text-white transition-colors cursor-pointer"
              title="Copy Email Text"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs text-white transition-colors cursor-pointer"
              title="Download Email"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download</span>
            </button>

            <a
              href={`mailto:${mailtoRecipient}?subject=${encodeURIComponent(mailtoSubject)}&body=${encodeURIComponent(emailTextToCopy)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-cyan-400/40 bg-cyan-950/40 hover:bg-cyan-950/70 px-3 py-1.5 text-xs text-cyan-300 transition-colors"
              title="Test in Native Email Client"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Native Mail</span>
            </a>
          </div>
        </div>
      )}

      {/* Render Selected Email Mockup */}
      {activeTab === 'customer' ? (
        <CustomerBookingConfirmationEmail ticket={ticket} viewMode={viewMode} />
      ) : (
        <AdminRequestNotificationEmail ticket={ticket} viewMode={viewMode} />
      )}

    </div>
  );
};

export default EmailTemplates;
