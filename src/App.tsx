import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Copy, 
  Check, 
  Server, 
  Cpu, 
  Network, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Wrench, 
  Zap, 
  Lock, 
  PhoneCall, 
  FileText, 
  Globe, 
  AlertCircle,
  Search
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AmcInquiryModal } from './components/AmcInquiryModal';
import { SearchIndexModal } from './components/SearchIndexModal';

export default function App() {
  const [emailInput, setEmailInput] = useState('');
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isAmcModalOpen, setIsAmcModalOpen] = useState(false);
  const [isSearchIndexModalOpen, setIsSearchIndexModalOpen] = useState(false);
  
  // Launch Target: 24 days from now (set constant target)
  const [timeLeft, setTimeLeft] = useState({
    days: 24,
    hours: 14,
    minutes: 36,
    seconds: 45
  });

  // Calculate live countdown timer
  useEffect(() => {
    // Set target date 24 days ahead if not stored
    let target = localStorage.getItem('remotfix_launch_target');
    if (!target) {
      const launchDate = new Date();
      launchDate.setDate(launchDate.getDate() + 24);
      launchDate.setHours(launchDate.getHours() + 14);
      target = launchDate.toISOString();
      localStorage.setItem('remotfix_launch_target', target);
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(target!).getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('support@remotfix.in');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleEmailSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    const savedEmails = JSON.parse(localStorage.getItem('remotfix_early_subscribers') || '[]');
    savedEmails.push({
      email: emailInput,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('remotfix_early_subscribers', JSON.stringify(savedEmails));

    setIsEmailSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden font-sans">
      {/* Dynamic Ambient Glassmorphism Backdrops & Radials */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[15%] w-[650px] h-[550px] bg-cyan-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-[35%] right-[-5%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-[5%] left-[5%] w-[550px] h-[500px] bg-slate-700/15 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.25]" />
      </div>

      {/* Floating Glass Header */}
      <header className="sticky top-4 z-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <nav className="glass-panel rounded-2xl px-5 py-3.5 flex items-center justify-between shadow-xl shadow-black/40 border border-slate-700/60 transition-all">
          {/* Logo Brand with Official Logo Image */}
          <div className="flex items-center gap-3">
            <div className="h-10 px-2.5 py-1 rounded-xl bg-white/95 border border-white/30 shadow-lg shadow-cyan-500/10 flex items-center justify-center shrink-0">
              <img 
                src="/assets/aistudio/1791411926566_992a226a.png" 
                alt="Remotfix Logo" 
                className="h-7 w-auto object-contain"
              />
            </div>
            <div>
              <div className="font-display font-bold text-lg tracking-tight text-white flex items-center gap-2">
                REMOTFIX<span className="text-cyan-400">.IN</span>
              </div>
              <div className="text-[10px] text-cyan-300 font-mono tracking-wider uppercase flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Remote IT Solutions & Support
              </div>
            </div>
          </div>

          {/* Quick Contact & Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Primary Contact Email Pill */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/70 border border-slate-700/70 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <a 
                href="mailto:support@remotfix.in"
                className="text-xs font-mono text-slate-200 hover:text-cyan-300 transition-colors"
              >
                support@remotfix.in
              </a>
              <button
                onClick={handleCopyEmail}
                title="Copy email to clipboard"
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1 cursor-pointer"
              >
                {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>

            {/* AMC Inquiry Trigger */}
            <button
              onClick={() => setIsAmcModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Request AMC Quote</span>
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 space-y-24">
        
        {/* HERO SECTION */}
        <section className="text-center space-y-8 max-w-4xl mx-auto pt-4">
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 text-xs text-slate-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
            <span className="font-mono text-cyan-300 font-medium">SYSTEM DEPLOYMENT IN PROGRESS</span>
            <span className="text-slate-500">·</span>
            <span>COMING SOON</span>
          </div>

          {/* Official Company Brand Card & Quote Spotlight */}
          <div className="pt-1">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-3 sm:p-4 pr-6 rounded-2xl bg-slate-900/80 border border-slate-700/80 shadow-2xl backdrop-blur-xl max-w-2xl mx-auto">
              {/* Logo Presentation in crisp white frosted container */}
              <div className="bg-white/95 rounded-xl px-4 py-2.5 shadow-inner border border-white/50 flex items-center justify-center shrink-0">
                <img 
                  src="/assets/aistudio/1791411926566_992a226a.png" 
                  alt="Remotfix - Remote IT Solutions & Support" 
                  className="h-12 sm:h-14 w-auto object-contain"
                />
              </div>

              {/* Company Quote / Tagline Focus */}
              <div className="text-center sm:text-left space-y-1">
                <div className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 flex items-center justify-center sm:justify-start gap-1.5 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Company Quote &amp; Mission</span>
                </div>
                <div className="text-base sm:text-lg font-extrabold text-white font-display tracking-tight">
                  &ldquo;REMOTE IT SOLUTIONS &amp; SUPPORT&rdquo;
                </div>
                <div className="text-xs text-slate-400">
                  Comprehensive IT AMC for Workstations, Network Racks &amp; Dedicated Servers
                </div>
              </div>
            </div>
          </div>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white font-display tracking-tight leading-[1.12]">
              Engineering the Future of{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500">
                IT Infrastructure & AMC
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Guided by our mission <strong className="text-white font-semibold">&ldquo;Remote IT Solutions &amp; Support&rdquo;</strong>, Remotfix is launching an enterprise platform for seamless on-demand remote troubleshooting and comprehensive Annual Maintenance Contracts (AMC) covering workstations, network racks, and bare-metal server infrastructure.
            </p>
          </div>

          {/* COUNTDOWN TIMER: Minimalist Translucent Slate with Crisp Frosted Borders */}
          <div className="pt-2 pb-4">
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-4">
              Projected Public Launch Countdown
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">
              {/* Days */}
              <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-700/70 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)] flex flex-col items-center justify-center">
                <span className="font-mono text-3xl sm:text-4xl font-extrabold text-white tabular-nums tracking-tight">
                  {String(timeLeft.days).padStart(2, '0')}
                </span>
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mt-1">
                  Days
                </span>
              </div>

              {/* Hours */}
              <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-700/70 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)] flex flex-col items-center justify-center">
                <span className="font-mono text-3xl sm:text-4xl font-extrabold text-cyan-300 tabular-nums tracking-tight">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mt-1">
                  Hours
                </span>
              </div>

              {/* Minutes */}
              <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-700/70 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)] flex flex-col items-center justify-center">
                <span className="font-mono text-3xl sm:text-4xl font-extrabold text-white tabular-nums tracking-tight">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mt-1">
                  Minutes
                </span>
              </div>

              {/* Seconds */}
              <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-cyan-500/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)] flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-8 h-8 bg-cyan-500/10 rounded-full blur-sm" />
                <span className="font-mono text-3xl sm:text-4xl font-extrabold text-cyan-400 tabular-nums tracking-tight animate-pulse">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[11px] font-mono text-cyan-300/80 uppercase tracking-wider mt-1">
                  Seconds
                </span>
              </div>
            </div>
          </div>

          {/* EARLY ACCESS EMAIL NOTIFICATION */}
          <div className="max-w-xl mx-auto">
            {isEmailSubmitted ? (
              <div className="glass-panel p-5 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-emerald-400 font-semibold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>You're on the Remotfix Launch Priority List!</span>
                </div>
                <p className="text-xs text-slate-300">
                  We'll notify you as soon as full access opens. Your corporate discount code will be dispatched from{' '}
                  <span className="font-mono text-cyan-300">support@remotfix.in</span>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleEmailSubscribe} className="space-y-3">
                <div className="flex flex-col sm:flex-row items-center gap-2 p-1.5 rounded-2xl glass-panel border border-slate-700/70 shadow-2xl">
                  <div className="flex items-center gap-2.5 px-3.5 py-2 w-full">
                    <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                    <input
                      type="email"
                      required
                      placeholder="Enter your corporate or work email..."
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full bg-transparent border-none text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Get Notified</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> 30% Pre-Launch AMC Discount
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Priority Onboarding
                  </span>
                </div>
              </form>
            )}
          </div>

          {/* PRIMARY CONTACT BANNER */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-700/60 max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400">Primary Engineering & Pre-Launch Desk</div>
                <a 
                  href="mailto:support@remotfix.in" 
                  className="text-sm font-semibold text-white font-mono hover:text-cyan-400 transition-colors"
                >
                  support@remotfix.in
                </a>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleCopyEmail}
                className="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEmail ? 'Copied' : 'Copy Email'}</span>
              </button>
              <a
                href="mailto:support@remotfix.in?subject=Pre-Launch%20Inquiry%20-%20Remotfix"
                className="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs border border-cyan-500/40 font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Write Us</span>
              </a>
            </div>
          </div>
        </section>

        {/* AMC SPOTLIGHT SECTION: WORKSTATIONS, NETWORK RACKS & SERVERS */}
        <section className="space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300 font-mono">
              <Wrench className="w-3.5 h-3.5" />
              <span>ANNUAL MAINTENANCE CONTRACT (AMC)</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              Comprehensive Enterprise IT AMC
            </h2>
            <p className="text-sm text-slate-400">
              Proactive preventative maintenance, rapid hardware SLAs, and dedicated remote engineering coverage for modern digital enterprises.
            </p>
          </div>

          {/* 3 Featured Glassmorphism AMC Cards with High-Res Images */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1. WORKSTATIONS AMC */}
            <div className="group glass-panel rounded-2xl overflow-hidden border border-slate-700/60 hover:border-cyan-500/50 transition-all duration-300 shadow-xl flex flex-col">
              {/* Real High-Resolution Photography */}
              <div className="relative h-52 overflow-hidden bg-slate-950">
                <img
                  src="https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=1000&q=80"
                  alt="Enterprise Workstation Fleet Management"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-[11px] font-mono text-cyan-300 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" /> WORKSTATIONS & LAPTOPS
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">Workstation Fleet AMC</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] border border-emerald-500/40">
                    &lt; 15m Remote SLA
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Full lifecycle maintenance for Windows, macOS, and Linux endpoints. Prevents sluggish machines, system crashes, and software vulnerabilities across your staff fleet.
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>OS patch hygiene, bloatware cleanup & driver updates</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Quarterly physical & thermal cooling deep-cleaning</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Endpoint anti-ransomware & zero-day protection</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Peripherals, dual-displays & ergonomic calibration</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">From 5 to 500+ endpoints</span>
                  <button
                    onClick={() => setIsAmcModalOpen(true)}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Request Quote</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* 2. NETWORK RACKS & CABLING AMC */}
            <div className="group glass-panel rounded-2xl overflow-hidden border border-slate-700/60 hover:border-cyan-500/50 transition-all duration-300 shadow-xl flex flex-col">
              {/* Real High-Resolution Photography */}
              <div className="relative h-52 overflow-hidden bg-slate-950">
                <img
                  src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1000&q=80"
                  alt="Enterprise Network Rack and Structured Cabling"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-[11px] font-mono text-cyan-300 flex items-center gap-1.5">
                  <Network className="w-3.5 h-3.5" /> NETWORK RACKS & ROUTERS
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">Network & Cabling AMC</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] border border-cyan-500/40">
                    24/7 Uplink Ping
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Prevent office internet drops and packet loss. Complete rack dressing, managed switch VLAN isolation, firewall audits, and dual-WAN automated failover.
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Server rack cable dressing & numbered patch panels</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Cisco, Ubiquiti, Fortinet & Mikrotik configuration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Enterprise Wi-Fi 6 coverage mapping & guest isolation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Automated dual-ISP failover & latency diagnostics</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">Structured Cat6A / Fiber</span>
                  <button
                    onClick={() => setIsAmcModalOpen(true)}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Request Quote</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* 3. SERVERS & CLOUD HYPERVISORS AMC */}
            <div className="group glass-panel rounded-2xl overflow-hidden border border-slate-700/60 hover:border-cyan-500/50 transition-all duration-300 shadow-xl flex flex-col">
              {/* Real High-Resolution Photography */}
              <div className="relative h-52 overflow-hidden bg-slate-950">
                <img
                  src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80"
                  alt="Enterprise Rack Servers and Storage Arrays"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-[11px] font-mono text-cyan-300 flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5" /> SERVERS & STORAGE
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">Server & Cloud AMC</span>
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px] border border-blue-500/40">
                    99.99% Uptime SLA
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Zero unplanned downtime for mission-critical databases, file servers, and hypervisors. Continuous RAID health monitoring and immutable offsite cloud backup drills.
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Proxmox, VMware ESXi & Windows Server hypervisors</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>RAID controller health, drive replacement & hot-spares</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Automated 3-2-1 backup verification & disaster drills</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Dedicated senior systems engineer on standby</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">Bare-metal & Hybrid Cloud</span>
                  <button
                    onClick={() => setIsAmcModalOpen(true)}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Request Quote</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* WHY REMOTFIX AMC ADVANTAGES */}
        <section className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-700/60 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white font-display">Instant Remote Triage</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect directly with certified engineers in under 15 minutes without waiting on generic ticketing queues.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white font-display">Quarterly Security Audits</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Comprehensive physical and network audit reports detailing firmware vulnerabilities and hardware wear.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white font-display">Cloudflare DNS & Encrypted</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every remote session and corporate tunnel on remotfix.in is protected with Cloudflare DNS management and end-to-end encryption.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white font-display">Transparent Fixed Pricing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                No surprise hourly billing. Predictable annual or quarterly plans with clear SLA hardware replacement terms.
              </p>
            </div>
          </div>
        </section>

        {/* PRIMARY CONTACT & INQUIRY SECTION */}
        <section className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-700/60 shadow-2xl relative overflow-hidden text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
              <Mail className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Have an Urgent AMC or IT Infrastructure Requirement?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Our engineering desk is actively answering pre-launch corporate inquiries, emergency remote requests, and RFP submissions.
            </p>
          </div>

          <div className="inline-flex flex-col sm:flex-row items-center gap-3 p-2 rounded-2xl bg-slate-950/70 border border-slate-800 shadow-inner">
            <div className="px-5 py-2.5 font-mono text-cyan-300 font-bold text-base sm:text-lg flex items-center gap-2">
              <Mail className="w-5 h-5 text-cyan-400" />
              <span>support@remotfix.in</span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleCopyEmail}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEmail ? 'Email Copied' : 'Copy Email'}</span>
              </button>
              <a
                href="mailto:support@remotfix.in?subject=Urgent%20IT%20AMC%20Inquiry%20-%20Remotfix"
                className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Compose Email</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              Average Pre-Launch Response: &lt; 15 mins
            </span>
            <span>·</span>
            <span>Locations: Bengaluru · Mumbai · Delhi-NCR</span>
            <span>·</span>
            <span>Official Domain: remotfix.in</span>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-8 relative z-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-8 px-2 py-0.5 rounded-lg bg-white/95 border border-white/30 flex items-center justify-center shrink-0 shadow-sm">
              <img 
                src="/assets/aistudio/1791411926566_992a226a.png" 
                alt="Remotfix Logo" 
                className="h-5 w-auto object-contain"
              />
            </div>
            <div>
              <div className="font-display font-bold text-slate-200">REMOTFIX.IN</div>
              <div className="text-[10px] text-cyan-400 font-mono tracking-wider uppercase font-semibold">
                Remote IT Solutions &amp; Support
              </div>
            </div>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">© {new Date().getFullYear()} Remotfix Technologies.</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <a 
              href="mailto:support@remotfix.in"
              className="hover:text-cyan-400 font-mono transition-colors"
            >
              support@remotfix.in
            </a>
            <span>·</span>
            <button 
              onClick={() => setIsAmcModalOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              AMC Quotation
            </button>
            <span>·</span>
            <button 
              onClick={() => setIsSearchIndexModalOpen(true)}
              className="hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-1.5"
              title="Search Engine Indexing & Protocol Status"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span>Indexing Status</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </button>
            <span>·</span>
            <span className="text-slate-600">Cloudflare DNS Protected</span>
          </div>
        </div>
      </footer>

      {/* AMC INQUIRY MODAL */}
      <AmcInquiryModal
        isOpen={isAmcModalOpen}
        onClose={() => setIsAmcModalOpen(false)}
      />

      {/* SEARCH ENGINE INDEXING HUB MODAL */}
      <SearchIndexModal
        isOpen={isSearchIndexModalOpen}
        onClose={() => setIsSearchIndexModalOpen(false)}
      />
    </div>
  );
}
