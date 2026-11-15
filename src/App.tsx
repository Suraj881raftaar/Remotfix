import React, { useState, useEffect, lazy, Suspense } from 'react';
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
  Lock, 
  Zap, 
  Search
} from 'lucide-react';

import workstationsImg from './assets/images/amc_workstations_fleet_1794740240191.jpg';
import networkRackImg from './assets/images/amc_network_rack_1794740241126.jpg';
import dedicatedServersImg from './assets/images/amc_dedicated_servers_1794740240382.jpg';

const AmcInquiryModal = lazy(() =>
  import('./components/AmcInquiryModal').then((m) => ({ default: m.AmcInquiryModal }))
);

const SearchIndexModal = lazy(() =>
  import('./components/SearchIndexModal').then((m) => ({ default: m.SearchIndexModal }))
);

interface AmcServiceCardData {
  id: string;
  indexLabel: string;
  category: string;
  title: string;
  sla: string;
  scope: string;
  description: string;
  image: string;
  imageAlt: string;
  features: string[];
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
}

const AMC_SERVICES: AmcServiceCardData[] = [
  {
    id: 'workstations',
    indexLabel: '01',
    category: 'Workstations & Laptops',
    title: 'Workstation Fleet AMC',
    sla: '15m Remote SLA',
    scope: '5 to 500+ endpoints',
    description:
      'Full lifecycle maintenance for Windows, macOS, and Linux endpoints. Prevents sluggish machines, system crashes, and software vulnerabilities across your staff fleet.',
    image: workstationsImg,
    imageAlt: 'Enterprise dual-monitor workstation desk covered under Remotfix IT AMC',
    features: [
      'OS patch hygiene, bloatware cleanup & driver updates',
      'Quarterly physical & thermal cooling deep-cleaning',
      'Endpoint anti-ransomware & zero-day protection',
      'Peripherals, dual-displays & docking calibration'
    ],
    icon: Cpu
  },
  {
    id: 'network-racks',
    indexLabel: '02',
    category: 'Network Racks & Routers',
    title: 'Network & Cabling AMC',
    sla: '24/7 Uplink Ping',
    scope: 'Structured Cat6A / Fiber',
    description:
      'Eliminate office internet drops and packet loss. Complete rack dressing, managed switch VLAN isolation, firewall audits, and dual-WAN automated failover.',
    image: networkRackImg,
    imageAlt: 'Structured enterprise network rack with neatly bundled Cat6A cabling and managed switches',
    features: [
      'Server rack cable dressing & numbered patch panels',
      'Cisco, Ubiquiti, Fortinet & Mikrotik configuration',
      'Enterprise Wi-Fi 6 coverage mapping & guest isolation',
      'Automated dual-ISP failover & latency diagnostics'
    ],
    icon: Network
  },
  {
    id: 'dedicated-servers',
    indexLabel: '03',
    category: 'Servers & Storage',
    title: 'Server & Cloud AMC',
    sla: '99.99% Uptime SLA',
    scope: 'Bare-metal & Hybrid Cloud',
    description:
      'Zero unplanned downtime for mission-critical databases, file servers, and hypervisors. Continuous RAID health monitoring and immutable offsite backup drills.',
    image: dedicatedServersImg,
    imageAlt: 'Enterprise data center bare-metal server rack aisle under Remotfix AMC monitoring',
    features: [
      'Proxmox, VMware ESXi & Windows Server hypervisors',
      'RAID controller health, drive replacement & hot-spares',
      'Automated 3-2-1 backup verification & disaster drills',
      'Dedicated senior systems engineer on standby'
    ],
    icon: Server
  }
];

export default function App() {
  const [emailInput, setEmailInput] = useState('');
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeModal, setActiveModal] = useState<'amc' | 'indexing' | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const [timeLeft, setTimeLeft] = useState({
    days: 24,
    hours: 14,
    minutes: 36,
    seconds: 45
  });

  useEffect(() => {
    let target = localStorage.getItem('remotfix_launch_target');
    if (!target) {
      const launchDate = new Date();
      launchDate.setDate(launchDate.getDate() + 24);
      launchDate.setHours(launchDate.getHours() + 14);
      target = launchDate.toISOString();
      localStorage.setItem('remotfix_launch_target', target);
    }

    const updateTimer = () => {
      const now = Date.now();
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
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('support@remotfix.in');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleEmailSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    try {
      const confettiModule = await import('canvas-confetti');
      confettiModule.default({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore confetti load error
    }

    const savedEmails = JSON.parse(localStorage.getItem('remotfix_early_subscribers') || '[]');
    savedEmails.push({
      email: emailInput.trim(),
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('remotfix_early_subscribers', JSON.stringify(savedEmails));

    setIsEmailSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden font-sans">
      {/* Subtle Ambient Translucent Slate Backdrops */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-[-12%] left-[12%] w-[620px] h-[520px] bg-cyan-600/10 rounded-full blur-[130px]" />
        <div className="absolute top-[38%] right-[-8%] w-[560px] h-[560px] bg-slate-700/15 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.22]" />
      </div>

      {/* Three-Zone Top Navigation Bar */}
      <header className="sticky top-3 z-40 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-2xl px-4 sm:px-6 py-2.5 flex items-center justify-between gap-8 shadow-xl shadow-black/40 border border-slate-700/60">
          {/* Zone 1: Brand Lockup */}
          <a
            href="#top"
            className="flex items-center gap-2.5 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg"
          >
            <span className="h-8 px-2 py-1 rounded-lg bg-white/95 border border-white/30 flex items-center justify-center shrink-0">
              <img
                src="/assets/aistudio/1791411926566_992a226a.png"
                alt="Remotfix"
                width={96}
                height={24}
                className="h-5 w-auto object-contain"
              />
            </span>
            <span className="font-display font-bold text-base sm:text-lg tracking-tight text-white whitespace-nowrap shrink-0">
              REMOTFIX<span className="text-cyan-400">.IN</span>
            </span>
          </a>

          {/* Zone 2: Concise Single-Line Navigation Links */}
          <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
            <a
              href="#amc-services"
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
            >
              AMC Services
            </a>
            <a
              href="#advantages"
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
            >
              SLA Standards
            </a>
            <a
              href="#contact"
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
            >
              Contact Desk
            </a>
          </nav>

          {/* Zone 3: Single Primary Action */}
          <button
            type="button"
            onClick={() => setActiveModal('amc')}
            className="min-h-[40px] px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs sm:text-sm transition-colors shadow-md shadow-cyan-500/20 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 cursor-pointer"
          >
            Request AMC Quote
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main id="top" className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 space-y-20">
        
        {/* HERO SECTION */}
        <section className="text-center space-y-8 max-w-4xl mx-auto pt-4">
          
          {/* Quiet Metadata Line (Zero Pill Clutter) */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-cyan-300 tracking-wide">
            <span>Launching Soon</span>
            <span aria-hidden="true" className="text-slate-500">·</span>
            <span className="text-slate-300">Enterprise IT AMC &amp; Remote Support</span>
            <span aria-hidden="true" className="text-slate-500">·</span>
            <span className="text-slate-300">India &amp; Global</span>
          </div>

          {/* Official Company Brand & Quote Lockup */}
          <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-700/70 max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-5 shadow-2xl">
            <div className="bg-white/95 rounded-xl px-4 py-2.5 border border-white/50 flex items-center justify-center shrink-0">
              <img
                src="/assets/aistudio/1791411926566_992a226a.png"
                alt="Remotfix - Remote IT Solutions & Support"
                width={180}
                height={56}
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </div>

            <div className="text-center sm:text-left space-y-1">
              <div className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-semibold">
                Company Quote &amp; Mission
              </div>
              <div className="text-base sm:text-lg font-extrabold text-white font-display tracking-tight">
                &ldquo;REMOTE IT SOLUTIONS &amp; SUPPORT&rdquo;
              </div>
              <div className="text-xs text-slate-300">
                Workstations, Structured Network Racks &amp; Bare-Metal Server AMC
              </div>
            </div>
          </div>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white font-display tracking-tight leading-[1.12] [text-wrap:balance] max-w-3xl mx-auto">
              Engineering the Future of{' '}
              <span className="text-cyan-300">
                IT Infrastructure &amp; AMC
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Guided by our commitment to <strong className="text-white font-semibold">&ldquo;Remote IT Solutions &amp; Support&rdquo;</strong>, Remotfix is launching a unified platform for encrypted remote troubleshooting and comprehensive Annual Maintenance Contracts covering workstations, network racks, and dedicated servers.
            </p>
          </div>

          {/* LAUNCH COUNTDOWN TIMER */}
          <div className="pt-2 pb-2">
            <div className="text-xs font-mono text-cyan-300 uppercase tracking-widest mb-4">
              Projected Public Launch Countdown
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">
              {[
                { label: 'Days', value: timeLeft.days, accent: false },
                { label: 'Hours', value: timeLeft.hours, accent: true },
                { label: 'Minutes', value: timeLeft.minutes, accent: false },
                { label: 'Seconds', value: timeLeft.seconds, accent: true }
              ].map((unit) => (
                <div
                  key={unit.label}
                  className={`glass-panel p-4 sm:p-5 rounded-2xl border shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] flex flex-col items-center justify-center ${
                    unit.accent ? 'border-cyan-500/40' : 'border-slate-700/70'
                  }`}
                >
                  <span
                    className={`font-mono text-3xl sm:text-4xl font-extrabold tabular-nums tracking-tight ${
                      unit.accent ? 'text-cyan-300' : 'text-white'
                    }`}
                  >
                    {String(unit.value).padStart(2, '0')}
                  </span>
                  <span className="text-xs font-mono text-slate-300 uppercase tracking-wider mt-1">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* EARLY ACCESS EMAIL NOTIFICATION */}
          <div className="max-w-xl mx-auto">
            {isEmailSubmitted ? (
              <div className="glass-panel p-5 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-emerald-300 font-semibold text-sm">
                  <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                  <span>You&apos;re on the Remotfix Launch Priority List</span>
                </div>
                <p className="text-xs text-slate-200">
                  We will notify you as soon as full onboarding opens. Pre-launch AMC discount codes are dispatched from{' '}
                  <span className="font-mono text-cyan-300">support@remotfix.in</span>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleEmailSubscribe} className="space-y-3">
                <div className="flex flex-col sm:flex-row items-center gap-2 p-2 rounded-2xl glass-panel border border-slate-700/70 shadow-2xl">
                  <div className="flex items-center gap-2.5 px-3 py-2 w-full">
                    <Mail className="w-4 h-4 text-cyan-400 shrink-0" aria-hidden="true" />
                    <label htmlFor="waitlist-email" className="sr-only">
                      Work or corporate email address
                    </label>
                    <input
                      id="waitlist-email"
                      type="email"
                      required
                      placeholder="Enter your corporate or work email..."
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full bg-transparent border-none text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded px-1 py-0.5"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-cyan-500/20 whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                  >
                    <span>Get Notified</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-300">
                  <span>30% Pre-Launch AMC Discount</span>
                  <span aria-hidden="true" className="text-slate-500">·</span>
                  <span>Priority Enterprise Onboarding</span>
                </div>
              </form>
            )}
          </div>

          {/* PRIMARY CONTACT STRIP */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-700/60 max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0">
                <Mail className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <div className="text-xs text-slate-300">Primary Engineering &amp; Pre-Launch Desk</div>
                <a
                  href="mailto:support@remotfix.in"
                  className="text-sm font-semibold text-white font-mono hover:text-cyan-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
                >
                  support@remotfix.in
                </a>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleCopyEmail}
                aria-label={copiedEmail ? 'Email address copied' : 'Copy support@remotfix.in to clipboard'}
                className="flex-1 sm:flex-initial min-h-[40px] px-3.5 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-100 text-xs border border-slate-700 font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" /> : <Copy className="w-3.5 h-3.5" aria-hidden="true" />}
                <span>{copiedEmail ? 'Copied' : 'Copy Email'}</span>
              </button>
              <a
                href="mailto:support@remotfix.in?subject=Pre-Launch%20Inquiry%20-%20Remotfix"
                className="flex-1 sm:flex-initial min-h-[40px] px-3.5 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 text-xs border border-cyan-500/40 font-medium transition-colors flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <span>Write Us</span>
              </a>
            </div>
          </div>
        </section>

        {/* AMC SPOTLIGHT SECTION: WORKSTATIONS, NETWORK RACKS & SERVERS */}
        <section id="amc-services" className="space-y-8 scroll-mt-24">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="text-xs font-mono text-cyan-300 tracking-wider uppercase">
              Annual Maintenance Contracts
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display [text-wrap:balance]">
              Comprehensive Enterprise IT AMC
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Proactive preventative maintenance, rapid hardware SLAs, and dedicated remote engineering coverage for modern digital enterprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {AMC_SERVICES.map((service) => {
              const IconComponent = service.icon;
              const isImageBroken = Boolean(failedImages[service.id]);

              return (
                <article
                  key={service.id}
                  className="group glass-panel rounded-2xl overflow-hidden border border-slate-700/60 hover:border-cyan-500/50 transition-colors duration-200 shadow-xl flex flex-col"
                >
                  {/* Visual Media Header with Scrim & Zero-Broken-Image Fallback */}
                  <div className="relative aspect-video overflow-hidden bg-slate-950">
                    {isImageBroken ? (
                      <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/40 flex flex-col items-center justify-center gap-2 p-6 text-center">
                        <IconComponent className="w-9 h-9 text-cyan-400" aria-hidden="true" />
                        <span className="text-sm font-semibold text-slate-200 font-display">{service.title}</span>
                      </div>
                    ) : (
                      <img
                        src={service.image}
                        alt={service.imageAlt}
                        width={800}
                        height={450}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        onError={() => setFailedImages((prev) => ({ ...prev, [service.id]: true }))}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent" aria-hidden="true" />
                    <div className="absolute bottom-3 left-4 right-4 space-y-1">
                      <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-300">
                        <span>{service.indexLabel} · {service.category}</span>
                        <span aria-hidden="true" className="text-slate-400">/</span>
                        <span className="text-slate-200">{service.sla}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white font-display">
                        {service.title}
                      </h3>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {service.description}
                      </p>

                      <ul className="space-y-2 text-xs text-slate-200">
                        {service.features.map((feat) => (
                          <li key={feat} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" aria-hidden="true" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-xs text-slate-300 font-mono">{service.scope}</span>
                      <button
                        type="button"
                        onClick={() => setActiveModal('amc')}
                        className="min-h-[36px] px-2 text-xs font-semibold text-cyan-300 hover:text-cyan-200 flex items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
                      >
                        <span>Request Quote</span>
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* WHY REMOTFIX AMC ADVANTAGES */}
        <section id="advantages" className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-700/60 shadow-2xl relative overflow-hidden scroll-mt-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                <Zap className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-white font-display">Instant Remote Triage</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect directly with certified engineers in under 15 minutes without waiting on generic ticketing queues.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                <ShieldCheck className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-white font-display">Quarterly Security Audits</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Comprehensive physical and network audit reports detailing firmware vulnerabilities and hardware wear.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                <Lock className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-white font-display">Encrypted Remote Tunnels</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Every remote session and corporate tunnel on remotfix.in is protected with zero-trust access controls and encryption.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                <Clock className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-white font-display">Transparent Fixed Pricing</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                No surprise hourly billing. Predictable annual or quarterly plans with clear SLA hardware replacement terms.
              </p>
            </div>
          </div>
        </section>

        {/* PRIMARY CONTACT & INQUIRY SECTION */}
        <section id="contact" className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-700/60 shadow-2xl relative overflow-hidden text-center space-y-6 scroll-mt-24">
          <div className="max-w-2xl mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 flex items-center justify-center mx-auto">
              <Mail className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display [text-wrap:balance]">
              Need an Immediate IT AMC Proposal?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Our engineering desk is actively answering pre-launch corporate inquiries, emergency remote support requests, and RFP submissions.
            </p>
          </div>

          <div className="inline-flex flex-col sm:flex-row items-center gap-3 p-2.5 rounded-2xl bg-slate-950/75 border border-slate-800 shadow-inner">
            <div className="px-4 py-2 font-mono text-cyan-300 font-bold text-base sm:text-lg flex items-center gap-2">
              <Mail className="w-5 h-5 text-cyan-400" aria-hidden="true" />
              <span>support@remotfix.in</span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleCopyEmail}
                aria-label={copiedEmail ? 'Email copied' : 'Copy support@remotfix.in'}
                className="flex-1 sm:flex-initial min-h-[40px] px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" /> : <Copy className="w-3.5 h-3.5" aria-hidden="true" />}
                <span>{copiedEmail ? 'Email Copied' : 'Copy Email'}</span>
              </button>
              <a
                href="mailto:support@remotfix.in?subject=Urgent%20IT%20AMC%20Inquiry%20-%20Remotfix"
                className="flex-1 sm:flex-initial min-h-[40px] px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                <span>Compose Email</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-xs text-slate-300 font-mono">
            <span>Pre-Launch Response: &lt; 15 mins</span>
            <span aria-hidden="true" className="text-slate-500">·</span>
            <span>Bengaluru · Mumbai · Delhi-NCR</span>
            <span aria-hidden="true" className="text-slate-500">·</span>
            <span>remotfix.in</span>
          </div>
        </section>

      </main>

      {/* QUIET FOOTER */}
      <footer className="border-t border-slate-800/80 bg-slate-950/90 py-8 relative z-10 text-xs text-slate-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-8 px-2 py-0.5 rounded-lg bg-white/95 border border-white/30 flex items-center justify-center shrink-0">
              <img
                src="/assets/aistudio/1791411926566_992a226a.png"
                alt="Remotfix"
                width={84}
                height={20}
                className="h-5 w-auto object-contain"
              />
            </div>
            <div>
              <div className="font-display font-bold text-slate-100">REMOTFIX.IN</div>
              <div className="text-[11px] text-cyan-300 font-mono uppercase">
                Remote IT Solutions &amp; Support
              </div>
            </div>
            <span aria-hidden="true" className="hidden sm:inline text-slate-500">·</span>
            <span className="hidden sm:inline text-slate-300">© {new Date().getFullYear()} Remotfix Technologies.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-300">
            <a
              href="mailto:support@remotfix.in"
              className="hover:text-cyan-300 font-mono transition-colors py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
            >
              support@remotfix.in
            </a>
            <span aria-hidden="true" className="text-slate-500">·</span>
            <button
              type="button"
              onClick={() => setActiveModal('amc')}
              className="hover:text-white transition-colors py-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
            >
              AMC Quotation
            </button>
            <span aria-hidden="true" className="text-slate-500">·</span>
            <button
              type="button"
              onClick={() => setActiveModal('indexing')}
              className="hover:text-cyan-300 transition-colors py-1 cursor-pointer flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
              <span>Indexing &amp; PageSpeed Hub</span>
            </button>
          </div>
        </div>
      </footer>

      {/* LAZY-LOADED MODALS */}
      <Suspense fallback={null}>
        {activeModal === 'amc' && (
          <AmcInquiryModal
            isOpen={true}
            onClose={() => setActiveModal(null)}
          />
        )}
        {activeModal === 'indexing' && (
          <SearchIndexModal
            isOpen={true}
            onClose={() => setActiveModal(null)}
          />
        )}
      </Suspense>
    </div>
  );
}
