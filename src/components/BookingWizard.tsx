import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Laptop, 
  Monitor, 
  Terminal, 
  Server, 
  CheckCircle2, 
  ArrowRight, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  Mail, 
  Send, 
  Bell, 
  Check, 
  RotateCcw, 
  UserCheck, 
  X,
  ExternalLink
} from 'lucide-react';
import { ticketStore } from '../services/ticketStore';
import { RemoteTool, Ticket } from '../types';
import { EmailTemplates } from './EmailTemplates';

interface BookingWizardProps {
  onTicketCreated: (ticketId: string) => void;
  onCancel: () => void;
  onNavigateToConsole?: () => void;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({
  onTicketCreated,
  onCancel,
  onNavigateToConsole
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [os, setOs] = useState('Windows 11 / 10');
  const [category, setCategory] = useState('Blue Screen (BSOD) / Fatal Crashes');
  const [urgency, setUrgency] = useState<'Standard' | 'Priority' | 'Emergency'>('Priority');
  const [timing, setTiming] = useState<'immediate' | 'scheduled'>('immediate');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledHour, setScheduledHour] = useState('14:00');
  const [description, setDescription] = useState('');
  const [preferredTool, setPreferredTool] = useState<RemoteTool>('quick_assist');

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTicket, setCreatedTicket] = useState<Ticket | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const categories = [
    { title: 'Blue Screen (BSOD) / Fatal Crashes', desc: 'Driver crash dumps, memory panic, sudden reboots' },
    { title: 'Virus, Ransomware & Suspicious Popups', desc: 'Malware eradication, browser hijackers, crypto miners' },
    { title: 'Severe Performance Lag & Freezes', desc: 'High CPU/RAM leaks, startup bloat, thermal throttling' },
    { title: 'Wi-Fi, DNS, VPN & Network Drops', desc: 'Cloudflare DNS configuration, packet loss, VPN gateway' },
    { title: 'Outlook, Microsoft 365 & Cloud Sync', desc: 'OST/PST corruption, IMAP auth, cloud file recovery' },
    { title: 'Driver, Printer & Hardware Diagnostics', desc: 'Peripheral conflicts, GPU errors, audio driver issues' }
  ];

  const handleCompleteBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !description) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const scheduledTime =
        timing === 'scheduled' ? `${scheduledDate} at ${scheduledHour} UTC` : undefined;

      const ticket = ticketStore.createTicket({
        customerName,
        customerEmail,
        customerPhone,
        os,
        category,
        urgency,
        timing,
        scheduledTime,
        description,
        preferredTool
      });

      setIsSubmitting(false);
      setCreatedTicket(ticket);
      setStep(4);
      setIsSuccessModalOpen(true);

      try {
        confetti({
          particleCount: 90,
          spread: 85,
          origin: { y: 0.55 }
        });
      } catch (err) {
        console.error(err);
      }
    }, 600);
  };

  const handleResetBooking = () => {
    setCreatedTicket(null);
    setDescription('');
    setIsSuccessModalOpen(false);
    setStep(1);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      
      {/* Stepper Header (Only shown when not in final completion view) */}
      {step !== 4 && (
        <div className="mb-8 border-b border-white/10 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                <Zap className="h-3.5 w-3.5" />
                <span>Live Diagnostic Booking MVP · remotfix.in</span>
              </div>
              <h1 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-white">
                Schedule Your Remote Troubleshooting Session
              </h1>
            </div>
            <button
              onClick={onCancel}
              className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel & Return
            </button>
          </div>

          {/* 3 Step Indicator */}
          <div className="mt-6 grid grid-cols-3 gap-2 text-xs">
            <div
              className={`flex items-center gap-2 border-b-2 pb-2 ${
                step >= 1 ? 'border-cyan-400 text-white font-semibold' : 'border-white/10 text-slate-500'
              }`}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400/20 text-cyan-400 text-[11px] font-mono">1</span>
              <span>Device & Symptom</span>
            </div>
            <div
              className={`flex items-center gap-2 border-b-2 pb-2 ${
                step >= 2 ? 'border-cyan-400 text-white font-semibold' : 'border-white/10 text-slate-500'
              }`}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400/20 text-cyan-400 text-[11px] font-mono">2</span>
              <span>Timing & Connection Tool</span>
            </div>
            <div
              className={`flex items-center gap-2 border-b-2 pb-2 ${
                step >= 3 ? 'border-cyan-400 text-white font-semibold' : 'border-white/10 text-slate-500'
              }`}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400/20 text-cyan-400 text-[11px] font-mono">3</span>
              <span>Contact & Confirm</span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 1: OS and Problem Category */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">
              Select Your Operating Environment
            </label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { name: 'Windows 11 / 10', icon: Monitor },
                { name: 'macOS Sequoia/Sonoma', icon: Laptop },
                { name: 'Ubuntu / Linux', icon: Terminal },
                { name: 'Windows Server', icon: Server }
              ].map((item) => {
                const IconComponent = item.icon;
                const isSelected = os === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setOs(item.name)}
                    className={`flex flex-col items-center justify-center rounded-xl border p-4 text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950/40 text-white shadow-lg shadow-cyan-400/10'
                        : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <IconComponent className={`h-6 w-6 mb-2 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span className="text-xs font-semibold">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">
              Diagnostic Issue Category
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {categories.map((cat) => {
                const isSelected = category === cat.title;
                return (
                  <div
                    key={cat.title}
                    onClick={() => setCategory(cat.title)}
                    className={`rounded-xl border p-4 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950/30 text-white'
                        : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-semibold text-white">{cat.title}</h4>
                      {isSelected && <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />}
                    </div>
                    <p className="mt-1 text-xs text-slate-400 leading-relaxed">{cat.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Brief Problem Description *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g. Computer blue-screened twice today with stop code IRQL_NOT_LESS_OR_EQUAL. System fan is running loud."
              className="w-full rounded-xl border border-white/15 bg-black/40 p-3.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              disabled={!description.trim()}
              onClick={() => setStep(2)}
              className="flex items-center gap-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 px-6 py-2.5 text-xs font-bold text-black uppercase tracking-wider transition-colors disabled:opacity-40 cursor-pointer"
            >
              <span>Next: Timing & Remote Tool</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Timing, Urgency & Remote Connection Method */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">
              Triage Urgency & SLA Tier
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { level: 'Standard', time: '~1-2 Hours', badge: 'Standard Queue', color: 'border-white/10 text-slate-300' },
                { level: 'Priority', time: '~15-30 Minutes', badge: 'Recommended', color: 'border-cyan-400 text-cyan-300 bg-cyan-950/30' },
                { level: 'Emergency', time: 'Immediate Standby', badge: 'Critical Downtime', color: 'border-rose-500/50 text-rose-300 bg-rose-950/20' }
              ].map((tier) => {
                const isSelected = urgency === tier.level;
                return (
                  <button
                    key={tier.level}
                    type="button"
                    onClick={() => setUrgency(tier.level as any)}
                    className={`rounded-xl border p-4 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950/40 text-white shadow-md'
                        : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase">{tier.level}</span>
                      <span className="text-[10px] font-mono text-cyan-400">{tier.badge}</span>
                    </div>
                    <span className="mt-2 text-sm font-semibold text-white block">{tier.time}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">
              Session Timing
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTiming('immediate')}
                className={`rounded-xl border p-4 text-left transition-all cursor-pointer ${
                  timing === 'immediate'
                    ? 'border-cyan-400 bg-cyan-950/40 text-white'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-cyan-400" />
                  <span className="text-xs font-bold uppercase">Immediate Connection</span>
                </div>
                <p className="mt-1 text-xs text-slate-400">Join queue immediately upon ticket creation.</p>
              </button>

              <button
                type="button"
                onClick={() => setTiming('scheduled')}
                className={`rounded-xl border p-4 text-left transition-all cursor-pointer ${
                  timing === 'scheduled'
                    ? 'border-cyan-400 bg-cyan-950/40 text-white'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-cyan-400" />
                  <span className="text-xs font-bold uppercase">Schedule A Specific Slot</span>
                </div>
                <p className="mt-1 text-xs text-slate-400">Pick a specific date and time for diagnostic call.</p>
              </button>
            </div>

            {timing === 'scheduled' && (
              <div className="mt-4 grid grid-cols-2 gap-3 p-4 rounded-xl border border-white/10 bg-white/5">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Appointment Date</label>
                  <input
                    type="date"
                    required
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-xs text-white focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Preferred Time (UTC)</label>
                  <input
                    type="time"
                    required
                    value={scheduledHour}
                    onChange={(e) => setScheduledHour(e.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-xs text-white focus:border-cyan-400"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">
              Preferred Remote Access Software
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPreferredTool('quick_assist')}
                className={`rounded-xl border p-4 text-left transition-all cursor-pointer ${
                  preferredTool === 'quick_assist'
                    ? 'border-cyan-400 bg-cyan-950/40 text-white'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Microsoft Quick Assist</span>
                  <span className="text-[10px] bg-cyan-400/20 text-cyan-300 px-2 py-0.5 rounded font-mono">Built-In Win 10/11</span>
                </div>
                <p className="mt-1 text-xs text-slate-400">No install required. Launch with Windows + Ctrl + Q.</p>
              </button>

              <button
                type="button"
                onClick={() => setPreferredTool('anydesk')}
                className={`rounded-xl border p-4 text-left transition-all cursor-pointer ${
                  preferredTool === 'anydesk'
                    ? 'border-orange-500 bg-orange-950/30 text-white'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">AnyDesk Remote</span>
                  <span className="text-[10px] bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded font-mono">Mac / Linux / PC</span>
                </div>
                <p className="mt-1 text-xs text-slate-400">Ultra-fast screen relay with cross-platform support.</p>
              </button>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="rounded-lg border border-white/20 bg-white/5 px-5 py-2.5 text-xs font-semibold text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="flex items-center gap-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 px-6 py-2.5 text-xs font-bold text-black uppercase tracking-wider transition-colors cursor-pointer"
            >
              <span>Next: Contact Details</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Contact & Booking Confirmation Form */}
      {step === 3 && (
        <form onSubmit={handleCompleteBooking} className="space-y-6">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-slate-300">
            <span className="font-semibold text-white block mb-1">Session Summary Checklist:</span>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400 font-mono">
              <span>OS: <strong className="text-white">{os}</strong></span>
              <span>Category: <strong className="text-white">{category}</strong></span>
              <span>Priority: <strong className="text-cyan-400 uppercase">{urgency}</strong></span>
              <span>Tool: <strong className="text-white">{preferredTool === 'quick_assist' ? 'Quick Assist' : 'AnyDesk'}</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Marcus Vance"
                className="w-full rounded-lg border border-white/15 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Your Email Address *
              </label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="marcus@domain.com"
                className="w-full rounded-lg border border-white/15 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              WhatsApp or Phone (Optional - For Immediate Dispatch Alerts)
            </label>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="+1 (555) 019-2834"
              className="w-full rounded-lg border border-white/15 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <ShieldCheck className="h-4 w-4" />
              <span>Automated Dispatch Guarantee</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Upon booking, an automated confirmation receipt will be sent to your email, and a high-priority dispatch notification will be transmitted to <strong>support@remotfix.in</strong> for technician assignment.
            </p>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="rounded-lg border border-white/20 bg-white/5 px-5 py-2.5 text-xs font-semibold text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 px-7 py-3 text-xs font-bold text-black uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer shadow-lg shadow-cyan-400/20"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isSubmitting ? 'Generating Ticket & Dispatching...' : 'Confirm Booking & Dispatch Emails'}</span>
            </button>
          </div>
        </form>
      )}

      {/* STEP 4: ON-PAGE CONFIRMATION SUMMARY */}
      {step === 4 && createdTicket && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Main Success Trigger Banner */}
          <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 via-cyan-950/20 to-black p-6 sm:p-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-5">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-black font-extrabold shadow-lg shadow-emerald-500/20">
                  <Check className="h-6 w-6 stroke-[3]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Booking Confirmed · Dispatch Notice Sent
                    </span>
                  </div>
                  <h2 className="mt-0.5 font-display text-2xl sm:text-3xl font-black text-white">
                    Support Request Received & Logged!
                  </h2>
                </div>
              </div>

              <div className="sm:text-right font-mono text-xs">
                <span className="text-slate-400 block text-[11px]">Ticket ID Reference</span>
                <span className="text-xl font-extrabold text-cyan-300">{createdTicket.id}</span>
              </div>
            </div>

            {/* Dual Notification Dispatch Status Cards */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              
              {/* Customer Notification Status */}
              <div 
                onClick={() => setIsSuccessModalOpen(true)}
                className="rounded-xl border border-white/10 bg-white/5 p-4 cursor-pointer hover:border-cyan-400 hover:bg-cyan-950/20 transition-all"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 text-cyan-300 font-bold">
                    <Send className="h-4 w-4 text-cyan-400" />
                    <span>Customer Receipt Dispatched</span>
                  </div>
                  <span className="rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono px-2 py-0.5 border border-emerald-500/30">
                    DELIVERED
                  </span>
                </div>
                <div className="font-mono text-slate-300 text-[11px] truncate">
                  Sent to: <strong>{createdTicket.customerEmail}</strong>
                </div>
                <p className="mt-1.5 text-[11px] text-slate-400 leading-relaxed">
                  Confirms support request has been received with Ticket #{createdTicket.id}, checklist, and session room link.
                </p>
                <div className="mt-2 text-[10px] text-cyan-400 font-semibold flex items-center gap-1">
                  <span>Click to view visual email mockup</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>

              {/* Admin Notification Status (support@remotfix.in) */}
              <div 
                onClick={() => setIsSuccessModalOpen(true)}
                className="rounded-xl border border-white/10 bg-white/5 p-4 cursor-pointer hover:border-amber-400 hover:bg-amber-950/20 transition-all"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 text-amber-300 font-bold">
                    <Bell className="h-4 w-4 text-amber-400" />
                    <span>Admin Request Dispatched</span>
                  </div>
                  <span className="rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono px-2 py-0.5 border border-amber-500/30">
                    DELIVERED
                  </span>
                </div>
                <div className="font-mono text-slate-300 text-[11px] truncate">
                  Sent to: <strong>support@remotfix.in</strong> <span className="text-slate-500">(CC: suraj@remotfix.in)</span>
                </div>
                <p className="mt-1.5 text-[11px] text-slate-400 leading-relaxed">
                  Urgent technician dispatch alert notifying team of new {createdTicket.urgency} triage request on remotfix.in.
                </p>
                <div className="mt-2 text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                  <span>Click to view support@remotfix.in alert mockup</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>

            </div>

            {/* Re-Open Success Modal Quick Trigger */}
            <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-300 text-xs">
                Want to inspect the exact emails delivered to your inbox and <strong>support@remotfix.in</strong>?
              </span>
              <button
                type="button"
                onClick={() => setIsSuccessModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/40 bg-cyan-950/40 hover:bg-cyan-950/80 px-3.5 py-1.5 font-semibold text-cyan-300 transition-colors cursor-pointer"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>Open Email Mockup Modal</span>
              </button>
            </div>
          </div>

          {/* Embedded EmailTemplates View directly on the page */}
          <div className="rounded-2xl border border-white/15 bg-black/50 p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                  Dispatched Email Templates
                </h3>
                <span className="text-[11px] text-slate-400">
                  Visual mockups rendered by EmailTemplates component
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsSuccessModalOpen(true)}
                className="text-xs text-cyan-400 hover:underline cursor-pointer"
              >
                Expand in Focus Modal &rarr;
              </button>
            </div>

            <EmailTemplates ticket={createdTicket} defaultTemplate="customer" />
          </div>

          {/* Primary Action Gate: Enter Remote Session Room */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div>
              <h4 className="font-display font-bold text-white text-base">
                Ready for Remote Handshake?
              </h4>
              <p className="text-xs text-slate-400">
                Enter your live session room to receive the technician's 6-digit Quick Assist PIN or AnyDesk address.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleResetBooking}
                className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Book Another</span>
              </button>

              {onNavigateToConsole && (
                <button
                  type="button"
                  onClick={onNavigateToConsole}
                  className="flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 px-4 py-2.5 text-xs font-semibold text-amber-300 transition-colors cursor-pointer"
                >
                  <UserCheck className="h-3.5 w-3.5 text-amber-400" />
                  <span>Staff Console (support@remotfix.in)</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onTicketCreated(createdTicket.id)}
                className="flex items-center gap-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 px-6 py-2.5 text-xs font-bold text-black uppercase tracking-wider transition-colors cursor-pointer shadow-lg shadow-cyan-400/20"
              >
                <span>Enter Live Session Room (Ticket #{createdTicket.id})</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* SUCCESS MODAL: CONFIRMING BOOKING WAS RECEIVED & EMAIL DISPATCHED TO SUPPORT@REMOTFIX.IN */}
      {isSuccessModalOpen && createdTicket && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setIsSuccessModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-4xl rounded-2xl border border-white/20 bg-[#0B0E17] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Header */}
            <div className="flex items-start justify-between border-b border-white/10 px-5 sm:px-6 py-4 bg-black/75">
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-black font-extrabold shadow-lg shadow-emerald-500/25">
                  <Check className="h-6 w-6 stroke-[3]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-base sm:text-lg font-bold text-white">
                      Booking Confirmed & Dispatched!
                    </h3>
                    <span className="rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-mono">
                      #{createdTicket.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Your support request has been received. An email notification has been dispatched to{' '}
                    <strong className="text-amber-300 font-mono">support@remotfix.in</strong> (CC: suraj@remotfix.in) and a confirmation was sent to{' '}
                    <strong className="text-cyan-300 font-mono">{createdTicket.customerEmail}</strong>.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsSuccessModalOpen(false)}
                className="rounded-lg p-2 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Dispatched Notification Summary Callout Banner */}
            <div className="bg-gradient-to-r from-emerald-950/40 via-cyan-950/20 to-black border-b border-white/10 px-5 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span className="font-medium">
                  2 Automated Notifications Dispatched via Remotfix Engine
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="text-cyan-300">✓ Customer Receipt</span>
                <span className="text-slate-600">·</span>
                <span className="text-amber-300">✓ support@remotfix.in Alert</span>
              </div>
            </div>

            {/* Modal Body: Integrated EmailTemplates Component */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              <EmailTemplates
                ticket={createdTicket}
                defaultTemplate="customer"
                showControls={true}
              />
            </div>

            {/* Modal Action Footer */}
            <div className="border-t border-white/10 bg-black/75 px-5 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <button
                type="button"
                onClick={() => setIsSuccessModalOpen(false)}
                className="rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-2 font-medium text-slate-300 transition-colors cursor-pointer"
              >
                Close Modal
              </button>

              <div className="flex flex-wrap items-center gap-2.5">
                {onNavigateToConsole && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsSuccessModalOpen(false);
                      onNavigateToConsole();
                    }}
                    className="flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 px-3.5 py-2 font-semibold text-amber-300 transition-colors cursor-pointer"
                  >
                    <UserCheck className="h-3.5 w-3.5 text-amber-400" />
                    <span>Staff Console (support@remotfix.in)</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setIsSuccessModalOpen(false);
                    onTicketCreated(createdTicket.id);
                  }}
                  className="flex items-center gap-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 px-5 py-2 font-bold text-black uppercase tracking-wider transition-colors cursor-pointer shadow-lg shadow-cyan-400/20"
                >
                  <span>Enter Live Session Room (Ticket #{createdTicket.id})</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
