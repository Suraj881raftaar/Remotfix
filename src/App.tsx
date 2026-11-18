import React, { useState, useEffect, lazy, Suspense } from 'react';
import {
  ShieldCheck,
  Mail,
  Copy,
  Check,
  Server,
  Cpu,
  Network,
  ArrowRight,
  CheckCircle2,
  Lock,
  Menu,
  X,
  Clock,
  FileCheck,
} from 'lucide-react';

import workstationsWebp from './assets/images/amc_workstations_fleet.webp';
import networkRackWebp from './assets/images/amc_network_rack.webp';
import dedicatedServersWebp from './assets/images/amc_dedicated_servers.webp';
import { SITE_ROUTES, SITE_ORIGIN } from './data/routesMeta';
import { SupportRequestForm } from './components/SupportRequestForm';

const ServicesOverviewPage = lazy(() =>
  import('./components/SitePages').then((m) => ({ default: m.ServicesOverviewPage }))
);
const RemoteSupportServicePage = lazy(() =>
  import('./components/SitePages').then((m) => ({ default: m.RemoteSupportServicePage }))
);
const ItAmcServicePage = lazy(() =>
  import('./components/SitePages').then((m) => ({ default: m.ItAmcServicePage }))
);
const InfrastructureSecurityPage = lazy(() =>
  import('./components/SitePages').then((m) => ({ default: m.InfrastructureSecurityPage }))
);
const AboutPage = lazy(() =>
  import('./components/SitePages').then((m) => ({ default: m.AboutPage }))
);
const ContactPage = lazy(() =>
  import('./components/SitePages').then((m) => ({ default: m.ContactPage }))
);
const RemoteSupportTermsPage = lazy(() =>
  import('./components/SitePages').then((m) => ({ default: m.RemoteSupportTermsPage }))
);
const SlaPage = lazy(() =>
  import('./components/SitePages').then((m) => ({ default: m.SlaPage }))
);
const PrivacyPolicyPage = lazy(() =>
  import('./components/SitePages').then((m) => ({ default: m.PrivacyPolicyPage }))
);
const TermsOfServicePage = lazy(() =>
  import('./components/SitePages').then((m) => ({ default: m.TermsOfServicePage }))
);
const RefundPolicyPage = lazy(() =>
  import('./components/SitePages').then((m) => ({ default: m.RefundPolicyPage }))
);
const NotFoundView = lazy(() =>
  import('./components/SitePages').then((m) => ({ default: m.NotFoundView }))
);

const AmcInquiryModal = lazy(() =>
  import('./components/AmcInquiryModal').then((m) => ({ default: m.AmcInquiryModal }))
);

interface ServiceSpotlight {
  id: string;
  indexLabel: string;
  category: string;
  title: string;
  coverage: string;
  scope: string;
  route: string;
  description: string;
  image: string;
  imageAlt: string;
  features: string[];
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
}

const SERVICE_SPOTLIGHTS: ServiceSpotlight[] = [
  {
    id: 'remote-support',
    indexLabel: '01',
    category: 'Remote IT Support',
    title: 'Desktop & Remote Troubleshooting',
    coverage: 'Windows · macOS · Linux',
    scope: 'Authorized session access',
    route: '/services/remote-it-support',
    description:
      'Responsive remote troubleshooting and desktop & laptop support for everyday software glitches, OS issues, email problems, and slow workstations.',
    image: workstationsWebp,
    imageAlt: 'Dual-monitor business workstation setup maintained under Remotfix remote IT support',
    features: [
      'OS diagnostics, update repair & startup optimization',
      'Email client, VPN, printer & office software setup',
      'Adware/malware cleanup & browser remediation',
      'Single-use session codes terminated after resolution',
    ],
    icon: Cpu,
  },
  {
    id: 'it-amc',
    indexLabel: '02',
    category: 'IT AMC',
    title: 'Annual Maintenance Contracts',
    coverage: 'Preventive Care',
    scope: 'Workstations, networks & servers',
    route: '/services/it-amc',
    description:
      'Predictable ongoing IT care for growing businesses — scheduled preventive maintenance, asset tracking, and prioritized remote helpdesk support.',
    image: networkRackWebp,
    imageAlt: 'Organized office network switch rack maintained under Remotfix IT AMC',
    features: [
      'Asset inventory across workstations, routers & servers',
      'Scheduled OS patching & system health checks',
      'Prioritized response targets under written SLA',
      'Quarterly maintenance summary & upgrade guidance',
    ],
    icon: Network,
  },
  {
    id: 'infrastructure-security',
    indexLabel: '03',
    category: 'Servers & Networks',
    title: 'Network, Server, Backup & Security',
    coverage: 'Infrastructure Hygiene',
    scope: 'LAN, servers & cloud backups',
    route: '/services/infrastructure-security',
    description:
      'Practical administration for office networks, local or cloud servers, verified backup recovery, and everyday cybersecurity hygiene.',
    image: dedicatedServersWebp,
    imageAlt: 'Business server rack infrastructure supported under Remotfix administration',
    features: [
      'Router, firewall, VLAN & Wi-Fi stability tuning',
      'Windows Server & Linux health and disk/RAID checks',
      'Automated backup monitoring & periodic test restores',
      'MFA rollout, patch discipline & access cleanup',
    ],
    icon: Server,
  },
];

function normalizePath(rawPath: string): string {
  const clean = rawPath.split('?')[0].split('#')[0];
  if (clean.length > 1 && clean.endsWith('/')) {
    return clean.slice(0, -1);
  }
  return clean || '/';
}

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() =>
    normalizePath(typeof window !== 'undefined' ? window.location.pathname : '/')
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isAmcModalOpen, setIsAmcModalOpen] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
      setMobileMenuOpen(false);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const matched = SITE_ROUTES.find((r) => r.path === currentPath);
    const robotsMeta = document.querySelector('meta[name="robots"]');
    const descMeta = document.querySelector('meta[name="description"]');
    const canonicalLink = document.querySelector('link[rel="canonical"]');

    if (matched) {
      document.title = matched.title;
      if (descMeta) descMeta.setAttribute('content', matched.description);
      if (canonicalLink) canonicalLink.setAttribute('href', `${SITE_ORIGIN}${matched.path}`);
      if (robotsMeta) {
        robotsMeta.setAttribute(
          'content',
          'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
        );
      }
    } else {
      document.title = '404 – Page Not Found | Remotfix';
      if (robotsMeta) robotsMeta.setAttribute('content', 'noindex, nofollow');
    }
  }, [currentPath]);

  const navigateTo = (path: string) => {
    const normalized = normalizePath(path);
    if (normalized !== currentPath) {
      window.history.pushState({}, '', normalized);
      setCurrentPath(normalized);
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('support@remotfix.in');
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      // Fallback: ignore if clipboard API unavailable
    }
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Remote Security', path: '/remote-support-terms' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const renderRouteContent = () => {
    switch (currentPath) {
      case '/':
        return (
          <div className="space-y-20">
            {/* HERO SECTION */}
            <section className="text-center space-y-8 max-w-4xl mx-auto pt-4">
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-cyan-300 tracking-wide">
                <span>Accepting Support &amp; AMC Requests</span>
                <span aria-hidden="true" className="text-slate-500">·</span>
                <span className="text-slate-300">IT Support · Remote Support · IT AMC</span>
                <span aria-hidden="true" className="text-slate-500">·</span>
                <span className="text-slate-300">Remote Coverage Across India</span>
              </div>

              {/* Official Company Brand & Quote Lockup */}
              <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-700/70 max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-5 shadow-2xl">
                <div className="bg-white/95 rounded-xl px-4 py-2.5 border border-white/50 flex items-center justify-center shrink-0">
                  <picture>
                    <source srcSet="/assets/brand/remotfix-logo.webp" type="image/webp" />
                    <img
                      src="/assets/aistudio/1791411926566_992a226a.png"
                      alt="Remotfix - Remote IT Solutions & Support"
                      width={180}
                      height={56}
                      className="h-12 sm:h-14 w-auto object-contain"
                    />
                  </picture>
                </div>

                <div className="text-center sm:text-left space-y-1">
                  <div className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-semibold">
                    Company Mission
                  </div>
                  <div className="text-base sm:text-lg font-extrabold text-white font-display tracking-tight">
                    &ldquo;REMOTE IT SOLUTIONS &amp; SUPPORT&rdquo;
                  </div>
                  <div className="text-xs text-slate-300">
                    Workstation Support, Networking, Server Administration &amp; IT AMC
                  </div>
                </div>
              </div>

              {/* Main Headline */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-6xl font-extrabold text-white font-display tracking-tight leading-[1.12] [text-wrap:balance] max-w-3xl mx-auto">
                  Reliable IT Support for{' '}
                  <span className="text-cyan-300">Growing Businesses</span>
                </h1>
                <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
                  Remote troubleshooting, workstation support, networking, server administration and AMC &mdash; without the cost of maintaining a full-time IT team.
                </p>
              </div>

              {/* Primary CTA Strip */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAmcModalOpen(true)}
                  className="w-full sm:w-auto min-h-[46px] px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-colors shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                >
                  <span>Request IT AMC Quote</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
                <a
                  href="/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/contact');
                  }}
                  className="w-full sm:w-auto min-h-[46px] px-6 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-100 border border-slate-700 font-semibold text-sm transition-colors flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  <span>Request Remote Support</span>
                </a>
              </div>

              {/* Direct Contact Desk Card */}
              <div className="glass-panel p-4 rounded-2xl border border-slate-700/60 max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0">
                    <Mail className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-300">Direct IT Support &amp; AMC Desk</div>
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
                    className="flex-1 sm:flex-initial min-h-[44px] px-3.5 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-100 text-xs border border-slate-700 font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  >
                    {copiedEmail ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    )}
                    <span>{copiedEmail ? 'Copied' : 'Copy Email'}</span>
                  </button>
                  <a
                    href="mailto:support@remotfix.in?subject=IT%20Support%20or%20AMC%20Inquiry%20-%20Remotfix"
                    className="flex-1 sm:flex-initial min-h-[44px] px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 text-xs border border-cyan-500/40 font-medium transition-colors flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  >
                    <span>Email Us</span>
                  </a>
                </div>
              </div>
            </section>

            {/* CORE SERVICES SECTION */}
            <section id="amc-services" className="space-y-8 scroll-mt-24">
              <div className="text-center space-y-3 max-w-2xl mx-auto">
                <div className="text-xs font-mono text-cyan-300 tracking-wider uppercase">
                  Core IT Services
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display [text-wrap:balance]">
                  Support &amp; Maintenance Built for Growing Teams
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  From everyday remote workstation troubleshooting to structured Annual Maintenance Contracts covering office networks, servers, backups, and security hygiene.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {SERVICE_SPOTLIGHTS.map((service) => {
                  const IconComponent = service.icon;
                  const isImageBroken = Boolean(failedImages[service.id]);

                  return (
                    <article
                      key={service.id}
                      className="group glass-panel rounded-2xl overflow-hidden border border-slate-700/60 hover:border-cyan-500/50 transition-colors duration-200 shadow-xl flex flex-col"
                    >
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
                            width={900}
                            height={502}
                            loading="lazy"
                            decoding="async"
                            referrerPolicy="no-referrer"
                            onError={() => setFailedImages((prev) => ({ ...prev, [service.id]: true }))}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                        <div
                          className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent"
                          aria-hidden="true"
                        />
                        <div className="absolute bottom-3 left-4 right-4 space-y-1">
                          <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-300">
                            <span>{service.indexLabel} · {service.category}</span>
                            <span aria-hidden="true" className="text-slate-400">/</span>
                            <span className="text-slate-200">{service.coverage}</span>
                          </div>
                          <h3 className="text-lg font-bold text-white font-display">{service.title}</h3>
                        </div>
                      </div>

                      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-3">
                          <p className="text-xs text-slate-300 leading-relaxed">{service.description}</p>

                          <ul className="space-y-2 text-xs text-slate-200">
                            {service.features.map((feat) => (
                              <li key={feat} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" aria-hidden="true" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                          <span className="text-xs text-slate-300 font-mono">{service.scope}</span>
                          <a
                            href={service.route}
                            onClick={(e) => {
                              e.preventDefault();
                              navigateTo(service.route);
                            }}
                            className="min-h-[40px] px-2 text-xs font-semibold text-cyan-300 hover:text-cyan-200 flex items-center gap-1 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
                          >
                            <span>Service Details</span>
                            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                          </a>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="text-center">
                <a
                  href="/services"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/services');
                  }}
                  className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-sm font-semibold text-slate-100 transition-colors"
                >
                  <span>View All Primary &amp; Secondary IT Services</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            </section>

            {/* REMOTE SUPPORT SECURITY & OPERATIONAL PRINCIPLES */}
            <section
              id="security-model"
              className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-700/60 shadow-2xl space-y-6 scroll-mt-24"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="text-xs font-mono uppercase tracking-wider text-cyan-300">
                    Remote Support Security Model
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                    Authorization-First Remote Access
                  </h2>
                </div>
                <a
                  href="/remote-support-terms"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/remote-support-terms');
                  }}
                  className="text-xs font-semibold text-cyan-300 hover:text-cyan-200 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <span>Read Full Remote Support Terms</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                    <ShieldCheck className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-semibold text-white font-display">Customer Authorization</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Remote access starts only after your explicit approval. Never share passwords unnecessarily.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                    <Clock className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-semibold text-white font-display">Time-Limited Access</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Access is limited strictly to the active support window and terminated cleanly once work finishes.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                    <FileCheck className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-semibold text-white font-display">Logged &amp; Confidential</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Actions are documented where technically possible and all business data is treated confidentially.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                    <Lock className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-semibold text-white font-display">Transparent SLA Terms</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Predictable plans with realistic response targets and clear boundaries — no inflated guarantees.
                  </p>
                </div>
              </div>
            </section>

            {/* CONTACT & SUPPORT REQUEST FORM */}
            <section id="contact" className="space-y-6 scroll-mt-24">
              <div className="text-center space-y-2 max-w-2xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display [text-wrap:balance]">
                  Request Remote IT Support or an AMC Proposal
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Prepare a structured inquiry below or write directly to{' '}
                  <a href="mailto:support@remotfix.in" className="text-cyan-300 underline font-mono">
                    support@remotfix.in
                  </a>
                  .
                </p>
              </div>
              <div className="max-w-3xl mx-auto">
                <SupportRequestForm onNavigate={navigateTo} />
              </div>
            </section>
          </div>
        );

      case '/services':
        return (
          <ServicesOverviewPage
            onNavigate={navigateTo}
            onOpenAmcModal={() => setIsAmcModalOpen(true)}
          />
        );
      case '/services/remote-it-support':
        return (
          <RemoteSupportServicePage
            onNavigate={navigateTo}
            onOpenAmcModal={() => setIsAmcModalOpen(true)}
          />
        );
      case '/services/it-amc':
        return (
          <ItAmcServicePage
            onNavigate={navigateTo}
            onOpenAmcModal={() => setIsAmcModalOpen(true)}
          />
        );
      case '/services/infrastructure-security':
        return (
          <InfrastructureSecurityPage
            onNavigate={navigateTo}
            onOpenAmcModal={() => setIsAmcModalOpen(true)}
          />
        );
      case '/about':
        return (
          <AboutPage
            onNavigate={navigateTo}
            onOpenAmcModal={() => setIsAmcModalOpen(true)}
          />
        );
      case '/contact':
        return (
          <ContactPage
            onNavigate={navigateTo}
            onOpenAmcModal={() => setIsAmcModalOpen(true)}
          />
        );
      case '/remote-support-terms':
        return (
          <RemoteSupportTermsPage
            onNavigate={navigateTo}
            onOpenAmcModal={() => setIsAmcModalOpen(true)}
          />
        );
      case '/sla':
        return (
          <SlaPage
            onNavigate={navigateTo}
            onOpenAmcModal={() => setIsAmcModalOpen(true)}
          />
        );
      case '/privacy-policy':
        return <PrivacyPolicyPage />;
      case '/terms':
        return <TermsOfServicePage />;
      case '/refund-policy':
        return <RefundPolicyPage />;
      default:
        return <NotFoundView onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden font-sans flex flex-col">
      {/* Subtle Ambient Translucent Slate Backdrops */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-[-12%] left-[12%] w-[620px] h-[520px] bg-cyan-600/10 rounded-full blur-[130px]" />
        <div className="absolute top-[38%] right-[-8%] w-[560px] h-[560px] bg-slate-700/15 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.22]" />
      </div>

      {/* Three-Zone Top Navigation Bar */}
      <header className="sticky top-2 z-40 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-2xl px-4 sm:px-6 py-2 flex items-center justify-between gap-4 md:gap-8 shadow-xl shadow-black/40 border border-slate-700/60">
          {/* Zone 1: Brand Lockup */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('/');
            }}
            className="flex items-center gap-2.5 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg"
          >
            <span className="h-8 px-2 py-1 rounded-lg bg-white/95 border border-white/30 flex items-center justify-center shrink-0">
              <picture>
                <source srcSet="/assets/brand/remotfix-logo.webp" type="image/webp" />
                <img
                  src="/assets/aistudio/1791411926566_992a226a.png"
                  alt="Remotfix"
                  width={96}
                  height={24}
                  className="h-5 w-auto object-contain"
                />
              </picture>
            </span>
            <span className="font-display font-bold text-base sm:text-lg tracking-tight text-white whitespace-nowrap shrink-0">
              REMOTFIX<span className="text-cyan-400">.IN</span>
            </span>
          </a>

          {/* Zone 2: Concise Single-Line Desktop Navigation Links */}
          <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            {navItems.map((item) => {
              const active = currentPath === item.path;
              return (
                <a
                  key={item.path}
                  href={item.path}
                  aria-current={active ? 'page' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo(item.path);
                  }}
                  className={`hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded px-1 py-1 ${
                    active ? 'text-cyan-300 font-semibold' : ''
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: Primary CTA + Mobile Drawer Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsAmcModalOpen(true)}
              className="min-h-[44px] px-3.5 sm:px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs sm:text-sm transition-colors shadow-md shadow-cyan-500/20 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 cursor-pointer"
            >
              Request AMC Quote
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 hover:bg-slate-700 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Accessible Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <nav
            id="mobile-nav-drawer"
            aria-label="Mobile navigation"
            className="md:hidden mt-2 glass-panel rounded-2xl p-3 border border-slate-700/70 shadow-2xl space-y-1"
          >
            {navItems.map((item) => {
              const active = currentPath === item.path;
              return (
                <a
                  key={item.path}
                  href={item.path}
                  aria-current={active ? 'page' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo(item.path);
                  }}
                  className={`min-h-[44px] px-4 py-2.5 rounded-xl flex items-center justify-between text-sm font-medium transition-colors ${
                    active ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' : 'text-slate-200 hover:bg-slate-800/70'
                  }`}
                >
                  <span>{item.label}</span>
                  <ArrowRight className="w-4 h-4 opacity-70" aria-hidden="true" />
                </a>
              );
            })}
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main id="top" className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
        <Suspense fallback={<div className="py-16 text-center text-sm text-slate-300">Loading page&hellip;</div>}>
          {renderRouteContent()}
        </Suspense>
      </main>

      {/* QUIET TRUST FOOTER */}
      <footer className="border-t border-slate-800/80 bg-slate-950/95 py-10 relative z-10 text-xs text-slate-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-8 px-2 py-0.5 rounded-lg bg-white/95 border border-white/30 flex items-center justify-center shrink-0">
                <picture>
                  <source srcSet="/assets/brand/remotfix-logo.webp" type="image/webp" />
                  <img
                    src="/assets/aistudio/1791411926566_992a226a.png"
                    alt="Remotfix"
                    width={84}
                    height={20}
                    className="h-5 w-auto object-contain"
                  />
                </picture>
              </div>
              <div>
                <div className="font-display font-bold text-slate-100">REMOTFIX.IN</div>
                <div className="text-[11px] text-cyan-300 font-mono uppercase">
                  Remote IT Solutions &amp; Support
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              Reliable IT support for growing businesses — remote troubleshooting, workstation care, networking, server administration, and IT AMC.
            </p>
            <div className="text-xs">
              Support Desk:{' '}
              <a href="mailto:support@remotfix.in" className="text-cyan-300 font-mono hover:underline">
                support@remotfix.in
              </a>
            </div>
          </div>

          <div className="md:col-span-3 space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">Services</h3>
            <ul className="space-y-1.5">
              <li>
                <a
                  href="/services"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/services');
                  }}
                  className="hover:text-cyan-300 transition-colors inline-block py-1"
                >
                  All IT Support &amp; Services
                </a>
              </li>
              <li>
                <a
                  href="/services/remote-it-support"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/services/remote-it-support');
                  }}
                  className="hover:text-cyan-300 transition-colors inline-block py-1"
                >
                  Remote IT Support
                </a>
              </li>
              <li>
                <a
                  href="/services/it-amc"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/services/it-amc');
                  }}
                  className="hover:text-cyan-300 transition-colors inline-block py-1"
                >
                  IT Annual Maintenance (AMC)
                </a>
              </li>
              <li>
                <a
                  href="/services/infrastructure-security"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/services/infrastructure-security');
                  }}
                  className="hover:text-cyan-300 transition-colors inline-block py-1"
                >
                  Network, Server &amp; Security
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">Trust &amp; SLA</h3>
            <ul className="space-y-1.5">
              <li>
                <a
                  href="/about"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/about');
                  }}
                  className="hover:text-cyan-300 transition-colors inline-block py-1"
                >
                  About Remotfix
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/contact');
                  }}
                  className="hover:text-cyan-300 transition-colors inline-block py-1"
                >
                  Contact Desk
                </a>
              </li>
              <li>
                <a
                  href="/remote-support-terms"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/remote-support-terms');
                  }}
                  className="hover:text-cyan-300 transition-colors inline-block py-1"
                >
                  Remote Support Security
                </a>
              </li>
              <li>
                <a
                  href="/sla"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/sla');
                  }}
                  className="hover:text-cyan-300 transition-colors inline-block py-1"
                >
                  Service Level (SLA)
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">Policies</h3>
            <ul className="space-y-1.5">
              <li>
                <a
                  href="/privacy-policy"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/privacy-policy');
                  }}
                  className="hover:text-cyan-300 transition-colors inline-block py-1"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/terms');
                  }}
                  className="hover:text-cyan-300 transition-colors inline-block py-1"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/refund-policy"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/refund-policy');
                  }}
                  className="hover:text-cyan-300 transition-colors inline-block py-1"
                >
                  Refund &amp; Cancellation
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-400">
          <span>&copy; {new Date().getFullYear()} Remotfix. All rights reserved.</span>
          <span className="font-mono">Canonical: https://remotfix.in</span>
        </div>
      </footer>

      {/* LAZY-LOADED AMC QUOTATION MODAL */}
      <Suspense fallback={null}>
        {isAmcModalOpen && (
          <AmcInquiryModal isOpen={true} onClose={() => setIsAmcModalOpen(false)} />
        )}
      </Suspense>
    </div>
  );
}
