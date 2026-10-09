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
  AlertCircle,
  Sparkles,
  Zap
} from 'lucide-react';
import { ticketStore } from '../services/ticketStore';
import { RemoteTool } from '../types';

interface BookingWizardProps {
  onTicketCreated: (ticketId: string) => void;
  onCancel: () => void;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({
  onTicketCreated,
  onCancel
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

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

      try {
        confetti({
          particleCount: 75,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.error(err);
      }

      onTicketCreated(ticket.id);
    }, 600);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      
      {/* Stepper Header */}
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
                const Icon = item.icon;
                const isSelected = os === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      setOs(item.name);
                      if (item.name.toLowerCase().includes('mac') || item.name.toLowerCase().includes('linux')) {
                        setPreferredTool('anydesk');
                      } else {
                        setPreferredTool('quick_assist');
                      }
                    }}
                    className={`flex items-center gap-2.5 rounded-xl border p-3.5 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-white bg-white text-black font-semibold'
                        : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="text-xs sm:text-sm">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">
              What Issue Are You Experiencing?
            </label>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {categories.map((cat) => {
                const isSelected = category === cat.title;
                return (
                  <div
                    key={cat.title}
                    onClick={() => setCategory(cat.title)}
                    className={`rounded-xl border p-4 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950/20 shadow-lg shadow-cyan-950/30'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-semibold text-white">{cat.title}</h4>
                      {isSelected && <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />}
                    </div>
                    <p className="mt-1 text-xs text-slate-400">{cat.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              Specific Glitch Symptoms or Error Codes *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g., Getting a BSOD with error code KERNEL_DATA_INPAGE_ERROR during startup, or Chrome keeps redirecting to unwanted search pages..."
              className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              disabled={!description.trim()}
              onClick={() => setStep(2)}
              className="flex items-center gap-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 px-6 py-2.5 text-xs font-bold text-black uppercase tracking-wider transition-colors disabled:opacity-40 cursor-pointer"
            >
              <span>Continue to Schedule</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Timing, Urgency, Connection Tool */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">
              Session Timing
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setTiming('immediate')}
                className={`rounded-xl border p-4 text-left transition-all cursor-pointer ${
                  timing === 'immediate'
                    ? 'border-white bg-white text-black font-semibold'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <Clock className="h-4 w-4 text-cyan-500" />
                    <span>Connect Immediately</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-700 font-bold px-2 py-0.5 rounded">
                    ~15 Min ETA
                  </span>
                </div>
                <p className="text-xs text-slate-500">Assign the next available senior technician right away.</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTiming('scheduled');
                  if (!scheduledDate) {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    setScheduledDate(tomorrow.toISOString().split('T')[0]);
                  }
                }}
                className={`rounded-xl border p-4 text-left transition-all cursor-pointer ${
                  timing === 'scheduled'
                    ? 'border-white bg-white text-black font-semibold'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2 text-sm font-bold mb-1">
                  <Calendar className="h-4 w-4 text-amber-500" />
                  <span>Schedule for Later</span>
                </div>
                <p className="text-xs text-slate-500">Pick a dedicated time slot convenient for you.</p>
              </button>
            </div>

            {timing === 'scheduled' && (
              <div className="mt-3 grid grid-cols-2 gap-3 bg-black/40 p-4 rounded-xl border border-white/10">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Date</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Time (UTC)</label>
                  <select
                    value={scheduledHour}
                    onChange={(e) => setScheduledHour(e.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-xs text-white"
                  >
                    <option value="10:00">10:00 AM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="18:00">06:00 PM</option>
                    <option value="21:00">09:00 PM</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">
              Preferred Remote Connection Method
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setPreferredTool('quick_assist')}
                className={`rounded-xl border p-4 text-left transition-all cursor-pointer ${
                  preferredTool === 'quick_assist'
                    ? 'border-cyan-400 bg-cyan-950/20 text-white'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-sm text-white">Microsoft Quick Assist</h4>
                  <span className="text-[10px] font-mono bg-cyan-400/20 text-cyan-300 px-2 py-0.5 rounded">Zero Install</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Pre-installed on Windows 10/11. Open with <kbd className="bg-white/10 px-1 py-0.5 rounded text-white font-mono">Win + Ctrl + Q</kbd> and enter a 6-digit code.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPreferredTool('anydesk')}
                className={`rounded-xl border p-4 text-left transition-all cursor-pointer ${
                  preferredTool === 'anydesk'
                    ? 'border-cyan-400 bg-cyan-950/20 text-white'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-sm text-white">AnyDesk Remote</h4>
                  <span className="text-[10px] font-mono bg-orange-400/20 text-orange-300 px-2 py-0.5 rounded">Cross-Platform</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Fast connection for macOS, Linux, and Windows. Uses your unique 9-digit address with instant authorization.
                </p>
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              Priority Urgency
            </label>
            <div className="flex gap-2">
              {(['Standard', 'Priority', 'Emergency'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setUrgency(lvl)}
                  className={`flex-1 rounded-lg border py-2 text-xs font-semibold transition-colors cursor-pointer ${
                    urgency === lvl
                      ? 'border-white bg-white text-black'
                      : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
                  }`}
                >
                  {lvl}
                </button>
              ))}
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
              <span>Contact Information</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Customer Details & Submission */}
      {step === 3 && (
        <form onSubmit={handleCompleteBooking} className="space-y-6">
          <div className="rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-xs text-slate-300 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Operating System:</span>
              <span className="text-white font-semibold">{os}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Category:</span>
              <span className="text-cyan-400">{category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Session Mode:</span>
              <span className="text-white capitalize">{timing} ({urgency} SLA)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Remote Tool:</span>
              <span className="text-white uppercase">{preferredTool === 'quick_assist' ? 'Quick Assist' : 'AnyDesk'}</span>
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
              <span>Zero-Risk Test Guarantee</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              You retain 100% control over keyboard and mouse. All remote sessions can be severed instantly with a single click.
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
              <span>{isSubmitting ? 'Generating Live Ticket...' : 'Confirm Booking & Open Remote Room'}</span>
            </button>
          </div>
        </form>
      )}

    </div>
  );
};
