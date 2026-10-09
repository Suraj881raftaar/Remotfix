import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  ArrowRight, 
  Copy, 
  Check, 
  Sparkles, 
  Download, 
  ShieldCheck, 
  Clock, 
  Wrench,
  Laptop
} from 'lucide-react';
import { WaitlistSubmission } from '../types';

interface HeroProps {
  onOpenDiagnostic: () => void;
  onOpenContact: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenDiagnostic, onOpenContact }) => {
  const [email, setEmail] = useState('');
  const [os, setOs] = useState('windows');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<WaitlistSubmission | null>(null);
  const [copied, setCopied] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(418);

  useEffect(() => {
    const saved = localStorage.getItem('remotfix_waitlist_user');
    if (saved) {
      try {
        setSubmittedData(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const submission: WaitlistSubmission = {
        email,
        os,
        priorityPass: `RF-${randomNum}-VIP`,
        discountCode: 'REMOTFIX30',
        position: waitlistCount + 1,
        timestamp: new Date().toISOString()
      };

      localStorage.setItem('remotfix_waitlist_user', JSON.stringify(submission));
      setSubmittedData(submission);
      setWaitlistCount((prev) => prev + 1);
      setIsSubmitting(false);

      // Trigger festive confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.error(err);
      }
    }, 600);
  };

  const handleCopyPass = () => {
    if (!submittedData) return;
    navigator.clipboard.writeText(
      `Remotfix VIP Priority Pass: ${submittedData.priorityPass} | 30% Off Code: ${submittedData.discountCode} (Domain: remotfix.in)`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTicket = () => {
    if (!submittedData) return;
    const content = `=====================================================
REMOTFIX.IN — EARLY ACCESS VIP SUPPORT PASS
=====================================================
Domain: https://remotfix.in
DNS: Cloudflare Managed Edge Network

Pass Code:       ${submittedData.priorityPass}
Discount Code:   ${submittedData.discountCode} (30% Lifetime Launch Off)
Waitlist Rank:   #${submittedData.position}
Primary Email:   ${submittedData.email}
Primary System:  ${submittedData.os.toUpperCase()}
Issued:          ${new Date(submittedData.timestamp).toLocaleString()}

BENEFITS INCLUDED:
• Guaranteed priority in remote queue upon platform launch.
• Free initial 15-minute diagnostic system health audit.
• 30% discount on all computer repair & virus eradication sessions.

Emergency Support: support@remotfix.in
=====================================================`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `remotfix-vip-pass-${submittedData.priorityPass}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="waitlist" className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      
      {/* Background radial glow */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 bg-radial from-slate-700/20 via-slate-900/0 to-transparent blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Unboxed clean metadata kicker (Zero-Pill discipline) */}
        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400">
          <span className="text-white">remotfix.in</span>
          <span aria-hidden="true">·</span>
          <span>Regional IT Infrastructure & Managed Technology Services</span>
          <span aria-hidden="true">·</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            5 Metro Operations Hubs Live
          </span>
        </div>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          
          {/* Left Column: Headline, Value Proposition, Trust Badges */}
          <div className="lg:col-span-7">
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl text-balance leading-[1.08]">
              Regional IT Infrastructure & Managed Technology Services.
            </h1>
            
            <p className="mt-6 text-base sm:text-lg leading-relaxed text-slate-300 max-w-2xl">
              High-availability technology operations combining 24/7 Tier-3 remote diagnostic telemetry with certified on-site mobile field engineers dispatched across Delhi NCR, Mumbai, Bengaluru, Hyderabad, and Kolkata in under 2 hours.
            </p>

            {/* Value bullets */}
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                <span>Zero-Trust security & managed 24/7 NOC/SOC telemetry</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                <span>Sub-15m remote triage & &lt;2hr physical field arrival</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Wrench className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                <span>On-site switch, server rack & hardware component swaps</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Laptop className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                <span>Zero-touch Mac, Windows & Linux fleet provisioning</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenDiagnostic}
                className="flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition-all hover:bg-slate-200 cursor-pointer shadow-lg shadow-white/5"
              >
                <span>Launch Diagnostic / Dispatch</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={onOpenContact}
                className="rounded-lg border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10 cursor-pointer"
              >
                Regional Contract Quote
              </button>
            </div>

            {/* Social Proof adjacency */}
            <div className="mt-10 border-t border-white/10 pt-6 text-xs text-slate-400">
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 font-mono">
                <div>
                  <strong className="text-white tabular-nums text-sm">{waitlistCount}</strong> professionals on waitlist
                </div>
                <span className="text-slate-600">|</span>
                <div>
                  <strong className="text-emerald-400 text-sm">30%</strong> launch voucher locked
                </div>
                <span className="text-slate-600">|</span>
                <div>
                  <strong className="text-white text-sm">remotfix.in</strong> domain secured
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Early Access / Waitlist Card */}
          <div className="lg:col-span-5">
            <div className="glass-panel relative rounded-2xl p-6 sm:p-8 shadow-2xl">
              
              {!submittedData ? (
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <h3 className="font-display text-lg font-bold text-white">Join Early Access Waitlist</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Secure launch perks & priority queue rank</p>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
                      <Sparkles className="h-4 w-4" />
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-xs font-medium text-slate-300 mb-1.5">
                        Your Work / Personal Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full rounded-lg border border-white/15 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Primary Operating System
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'windows', name: 'Windows PC' },
                          { id: 'macos', name: 'macOS Apple' },
                          { id: 'linux', name: 'Linux OS' },
                          { id: 'business', name: 'Small Business Fleet' },
                        ].map((item) => (
                          <button
                            type="button"
                            key={item.id}
                            onClick={() => setOs(item.id)}
                            className={`rounded-lg border px-3 py-2 text-xs font-medium text-left transition-colors cursor-pointer ${
                              os === item.id
                                ? 'border-white bg-white text-black font-semibold'
                                : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
                            }`}
                          >
                            {item.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg bg-black/30 border border-white/5 p-3 text-xs text-slate-400 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Instant VIP Pass Generation</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        <span>30% Lifetime Discount Voucher Code</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-lg bg-cyan-400 hover:bg-cyan-300 py-3 text-xs font-bold text-black uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-cyan-400/20"
                    >
                      {isSubmitting ? 'Generating VIP Pass...' : 'Claim Early Access Pass'}
                    </button>

                    <p className="text-center text-[11px] text-slate-500">
                      No spam. We will only notify you when the live technician portal launches on remotfix.in.
                    </p>
                  </form>
                </div>
              ) : (
                <div className="space-y-5 animate-fade-in">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <Check className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-white">VIP Pass Confirmed</h3>
                      <p className="text-xs text-slate-400">Position #{submittedData.position} on Remotfix</p>
                    </div>
                  </div>

                  {/* VIP Ticket UI */}
                  <div className="rounded-xl border border-white/15 bg-black/60 p-4 font-mono text-xs space-y-3">
                    <div className="flex items-center justify-between text-slate-400 text-[11px] border-b border-white/10 pb-2">
                      <span>REMOTFIX.IN VIP PASS</span>
                      <span className="text-cyan-400">{submittedData.os.toUpperCase()}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-400 block">Pass Code</span>
                        <span className="text-base font-bold text-white">{submittedData.priorityPass}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 block">Discount Voucher</span>
                        <span className="text-sm font-bold text-emerald-400">{submittedData.discountCode} (-30%)</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 pt-1 border-t border-white/10">
                      Registered to: <span className="text-slate-200">{submittedData.email}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleCopyPass}
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-white/20 bg-white/5 py-2.5 text-xs font-medium text-white hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy Pass Details'}</span>
                    </button>
                    <button
                      onClick={handleDownloadTicket}
                      className="flex items-center justify-center gap-1.5 rounded-lg bg-white py-2.5 text-xs font-semibold text-black hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download Pass</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      localStorage.removeItem('remotfix_waitlist_user');
                      setSubmittedData(null);
                    }}
                    className="w-full text-center text-[11px] text-slate-500 hover:text-slate-400 underline"
                  >
                    Register another email
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
