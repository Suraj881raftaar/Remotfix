import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  Network,
  Server,
  ShieldCheck,
  Lock,
  Mail,
  FileText,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { SupportRequestForm } from './SupportRequestForm';
import { ServiceCategory } from '../types';

interface PageProps {
  onNavigate: (path: string) => void;
  onOpenAmcModal: () => void;
}

const ServiceDetailTemplate: React.FC<{
  kicker: string;
  title: string;
  summary: string;
  whatItIs: string;
  whoNeedsIt: string[];
  whatWeProvide: string[];
  problemsSolved: string[];
  howItWorks: string[];
  coverageArea: string;
  defaultCategory: ServiceCategory;
  onNavigate: (path: string) => void;
  onOpenAmcModal: () => void;
}> = ({
  kicker,
  title,
  summary,
  whatItIs,
  whoNeedsIt,
  whatWeProvide,
  problemsSolved,
  howItWorks,
  coverageArea,
  defaultCategory,
  onNavigate,
  onOpenAmcModal,
}) => (
  <div className="space-y-12">
    <header className="space-y-4 max-w-3xl">
      <div className="text-xs font-mono uppercase tracking-wider text-cyan-300">{kicker}</div>
      <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display tracking-tight [text-wrap:balance]">
        {title}
      </h1>
      <p className="text-base sm:text-lg text-slate-300 leading-relaxed">{summary}</p>
      <div className="flex flex-wrap gap-3 pt-2">
        <a
          href="/contact"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/contact');
          }}
          className="min-h-[44px] px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition-colors inline-flex items-center gap-2"
        >
          <span>Request {defaultCategory}</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </a>
        <button
          type="button"
          onClick={onOpenAmcModal}
          className="min-h-[44px] px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 font-medium text-sm transition-colors cursor-pointer"
        >
          Configure AMC Scope
        </button>
      </div>
    </header>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <section className="glass-panel rounded-2xl p-6 border border-slate-700/60 space-y-3">
        <h2 className="text-lg font-bold text-white font-display">What This Service Is</h2>
        <p className="text-sm text-slate-300 leading-relaxed">{whatItIs}</p>
      </section>

      <section className="glass-panel rounded-2xl p-6 border border-slate-700/60 space-y-3">
        <h2 className="text-lg font-bold text-white font-display">Who Needs It</h2>
        <ul className="space-y-2 text-sm text-slate-300">
          {whoNeedsIt.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="glass-panel rounded-2xl p-6 border border-slate-700/60 space-y-3">
        <h2 className="text-lg font-bold text-white font-display">What Remotfix Actually Provides</h2>
        <ul className="space-y-2 text-sm text-slate-300">
          {whatWeProvide.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="glass-panel rounded-2xl p-6 border border-slate-700/60 space-y-3">
        <h2 className="text-lg font-bold text-white font-display">Typical Problems Solved</h2>
        <ul className="space-y-2 text-sm text-slate-300">
          {problemsSolved.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>

    <section className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-700/60 space-y-4">
      <h2 className="text-xl font-bold text-white font-display">How Support Works &amp; Coverage</h2>
      <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-slate-300">
        {howItWorks.map((step, idx) => (
          <li key={step} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <div className="text-xs font-mono text-cyan-300 font-semibold">Step 0{idx + 1}</div>
            <p className="leading-relaxed">{step}</p>
          </li>
        ))}
      </ol>
      <p className="text-xs sm:text-sm text-slate-300 pt-2 border-t border-slate-800/80">
        <strong className="text-white">Coverage &amp; Service Area:</strong> {coverageArea}
      </p>
    </section>

    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-white font-display">Request This Service</h2>
      <SupportRequestForm defaultCategory={defaultCategory} onNavigate={onNavigate} />
    </section>
  </div>
);

export const ServicesOverviewPage: React.FC<PageProps> = ({ onNavigate, onOpenAmcModal }) => (
  <div className="space-y-12">
    <header className="space-y-4 max-w-3xl">
      <div className="text-xs font-mono uppercase tracking-wider text-cyan-300">Service Catalog</div>
      <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display tracking-tight [text-wrap:balance]">
        IT Support, Remote Support &amp; AMC Services
      </h1>
      <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
        Practical IT support for growing businesses — combining responsive remote troubleshooting, workstation care, networking, server administration, and predictable Annual Maintenance Contracts without full-time internal IT overhead.
      </p>
    </header>

    <section aria-labelledby="primary-pillars-heading" className="space-y-6">
      <h2 id="primary-pillars-heading" className="text-2xl font-bold text-white font-display">
        Primary Service Pillars
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <article className="glass-panel rounded-2xl p-6 border border-slate-700/60 flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 flex items-center justify-center">
              <Cpu className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold text-white font-display">Remote IT Support &amp; Desktops</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              On-demand remote troubleshooting and workstation support for Windows, macOS, and Linux computers.
            </p>
          </div>
          <a
            href="/services/remote-it-support"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/services/remote-it-support');
            }}
            className="min-h-[40px] inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-300 hover:text-cyan-200"
          >
            <span>Explore Remote Support</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </article>

        <article className="glass-panel rounded-2xl p-6 border border-slate-700/60 flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 flex items-center justify-center">
              <FileText className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold text-white font-display">IT Annual Maintenance (AMC)</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Ongoing preventive maintenance, patching, and structured SLA support under fixed quarterly or annual plans.
            </p>
          </div>
          <a
            href="/services/it-amc"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/services/it-amc');
            }}
            className="min-h-[40px] inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-300 hover:text-cyan-200"
          >
            <span>Explore IT AMC Plans</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </article>

        <article className="glass-panel rounded-2xl p-6 border border-slate-700/60 flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 flex items-center justify-center">
              <Server className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold text-white font-display">Network, Server &amp; Security</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Office networking, server upkeep, cloud backup verification, and practical cybersecurity hygiene.
            </p>
          </div>
          <a
            href="/services/infrastructure-security"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/services/infrastructure-security');
            }}
            className="min-h-[40px] inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-300 hover:text-cyan-200"
          >
            <span>Explore Infrastructure Support</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </article>
      </div>
    </section>

    <section aria-labelledby="secondary-capabilities-heading" className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-700/60 space-y-6">
      <h2 id="secondary-capabilities-heading" className="text-2xl font-bold text-white font-display">
        Secondary Capabilities Covered
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-sm">
        {[
          {
            title: 'Desktop & Laptop Support',
            desc: 'OS tuning, driver updates, office email client setup, browser issues, and peripheral troubleshooting.',
          },
          {
            title: 'Network Support',
            desc: 'Office router, managed switch, VLAN segmentation, Wi-Fi coverage tuning, and ISP failover checks.',
          },
          {
            title: 'Server Support',
            desc: 'Windows Server and Linux maintenance, disk/RAID alerts, active directory hygiene, and service restarts.',
          },
          {
            title: 'Cloud & Backup',
            desc: 'Scheduled backup checks, test restore verification, cloud workspace administration, and storage health.',
          },
          {
            title: 'Cybersecurity Hygiene',
            desc: 'Patch cadence, multi-factor authentication setup, malware removal, and least-privilege access cleanup.',
          },
          {
            title: 'Remote Troubleshooting',
            desc: 'Authorization-first, time-limited remote diagnostic sessions with clear action summaries.',
          },
        ].map((cap) => (
          <div key={cap.title} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <h3 className="font-bold text-white">{cap.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{cap.desc}</p>
          </div>
        ))}
      </div>
      <div className="pt-2">
        <button
          type="button"
          onClick={onOpenAmcModal}
          className="min-h-[44px] px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition-colors cursor-pointer"
        >
          Request Custom Support or AMC Proposal
        </button>
      </div>
    </section>
  </div>
);

export const RemoteSupportServicePage: React.FC<PageProps> = ({ onNavigate, onOpenAmcModal }) => (
  <ServiceDetailTemplate
    kicker="Primary Service · Remote IT Support"
    title="Remote IT Support & Desktop Troubleshooting"
    summary="Authorized, time-limited remote troubleshooting and workstation maintenance for businesses and distributed teams across Windows, macOS, and Linux."
    whatItIs="Remote IT Support delivers direct screen-shared technical troubleshooting and configuration over encrypted remote support sessions, resolving software, operating system, email, and workstation issues without waiting for an in-person visit."
    whoNeedsIt={[
      'Growing teams of 5–100+ employees operating without a dedicated internal helpdesk.',
      'Remote or hybrid staff experiencing slow laptops, OS update errors, or VPN connectivity drops.',
      'Founders and operations leads who need dependable day-to-day endpoint troubleshooting.',
    ]}
    whatWeProvide={[
      'Operating system diagnostics, startup optimization, and Windows/macOS/Linux update fixes.',
      'Business email (Microsoft 365 / Google Workspace), printer, scanner, and office software setup.',
      'Adware/malware cleanup, browser remediation, and safe driver or firmware updates.',
      'Post-session summary of changes made and practical recommendations.',
    ]}
    problemsSolved={[
      'Unresponsive or slow employee laptops affecting daily productivity.',
      'Recurring application crashes, broken updates, or blue-screen troubleshooting.',
      'Mail client sync failures, broken printer queues, and VPN authentication errors.',
      'Suspicious browser extensions or suspected workstation malware infections.',
    ]}
    howItWorks={[
      'Submit a support request via our contact desk or email support@remotfix.in.',
      'Receive a scheduled session window and approve a one-time remote access code.',
      'Watch every diagnostic step live while retaining control of your keyboard and mouse.',
      'Access is terminated immediately upon completion with no persistent backdoors left behind.',
    ]}
    coverageArea="Remote IT support is available across India and for remote-first distributed teams during standard business hours, with priority escalation defined for active AMC clients."
    defaultCategory="Remote IT Support"
    onNavigate={onNavigate}
    onOpenAmcModal={onOpenAmcModal}
  />
);

export const ItAmcServicePage: React.FC<PageProps> = ({ onNavigate, onOpenAmcModal }) => (
  <ServiceDetailTemplate
    kicker="Primary Service · IT AMC"
    title="IT Annual Maintenance Contracts (IT AMC)"
    summary="Structured ongoing maintenance for office workstations, network equipment, and servers — keeping systems patched, backed up, and predictable under a clear service agreement."
    whatItIs="An IT Annual Maintenance Contract (AMC) establishes scheduled preventive maintenance and priority troubleshooting across your company’s computers, networking hardware, and servers for a predictable quarterly or annual fee."
    whoNeedsIt={[
      'Small and mid-sized businesses seeking predictable IT upkeep costs instead of ad-hoc emergency bills.',
      'Offices running mixed fleets of desktops, laptops, routers, switches, NAS units, or local servers.',
      'Organizations that want documented asset inventories, patch schedules, and backup verification.',
    ]}
    whatWeProvide={[
      'Asset inventory documentation across covered workstations, networking gear, and servers.',
      'Scheduled OS patching, disk health checks, and preventive performance maintenance.',
      'Prioritized remote helpdesk queue for covered staff during agreed coverage windows.',
      'Quarterly maintenance summaries and practical hardware upgrade guidance.',
    ]}
    problemsSolved={[
      'Accumulated neglected updates, full disks, and inconsistent workstation configurations.',
      'Unclear ownership when office Wi-Fi, printers, or shared file storage degrade.',
      'Unverified backups discovered only after a drive failure or accidental deletion.',
      'High hourly callout expenses from reactive break-fix IT vendors.',
    ]}
    howItWorks={[
      'Share your workstation, network, and server counts via our AMC configurator or email.',
      'We conduct an initial environment review and define exact asset scope and SLA terms.',
      'Onboarding documents system baselines, backup status, and escalation contacts.',
      'Ongoing preventive checks and remote support run according to your agreed schedule.',
    ]}
    coverageArea="Remote-first IT AMC coverage across India. Physical on-site hardware dispatch terms are scoped individually per location in written AMC agreements."
    defaultCategory="IT AMC"
    onNavigate={onNavigate}
    onOpenAmcModal={onOpenAmcModal}
  />
);

export const InfrastructureSecurityPage: React.FC<PageProps> = ({ onNavigate, onOpenAmcModal }) => (
  <ServiceDetailTemplate
    kicker="Secondary Services · Infrastructure & Security"
    title="Network, Server, Cloud Backup & Cybersecurity Support"
    summary="Hands-on administration for office networks, servers, backup verification, and everyday cybersecurity hygiene tailored to growing business environments."
    whatItIs="Dedicated technical support covering the core infrastructure behind your workstations: business routers, managed switches, Wi-Fi access points, Windows/Linux servers, cloud backups, and baseline endpoint security."
    whoNeedsIt={[
      'Offices experiencing unstable Wi-Fi, slow internal file transfers, or recurring internet drops.',
      'Companies running on-premise file/application servers, NAS devices, or cloud VMs without a sysadmin.',
      'Teams wanting reliable backup verification and practical MFA/security hygiene without enterprise bloat.',
    ]}
    whatWeProvide={[
      'Network Support: Router, firewall, VLAN, guest Wi-Fi isolation, and dual-ISP failover tuning.',
      'Server Support: Windows Server & Linux administration, service monitoring, and RAID storage health checks.',
      'Cloud & Backup: Automated backup policy reviews and periodic test-restore verification.',
      'Cybersecurity Hygiene: OS/app patch cadence, MFA rollout, least-privilege access cleanup, and malware triage.',
    ]}
    problemsSolved={[
      'Office dead zones, overloaded consumer routers, or unsegmented guest/staff Wi-Fi networks.',
      'Unmonitored server storage filling up or silent backup job failures.',
      'Shared admin passwords or former employee accounts still having active access.',
      'Post-incident malware cleanup and workstation hardening.',
    ]}
    howItWorks={[
      'Send an overview of your network hardware, server setup, or backup concern.',
      'Schedule an authorized diagnostic review with your nominated local contact.',
      'We inspect configurations, verify backups, and document recommended fixes before major changes.',
      'Changes are applied cleanly during agreed maintenance windows with clear rollback steps.',
    ]}
    coverageArea="Remote administration across India and distributed cloud environments. Hardware cabling or physical part swaps are coordinated with your on-site contact or vendor."
    defaultCategory="Network Support"
    onNavigate={onNavigate}
    onOpenAmcModal={onOpenAmcModal}
  />
);

export const AboutPage: React.FC<PageProps> = ({ onNavigate }) => (
  <div className="space-y-10 max-w-4xl">
    <header className="space-y-4">
      <div className="text-xs font-mono uppercase tracking-wider text-cyan-300">About Remotfix</div>
      <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display tracking-tight">
        Reliable IT Support for Growing Businesses
      </h1>
      <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
        Guided by our core principle — <strong className="text-white">&ldquo;REMOTE IT SOLUTIONS &amp; SUPPORT&rdquo;</strong> — Remotfix helps growing companies keep workstations, office networks, servers, and backups running reliably without the expense of maintaining a full-time internal IT team.
      </p>
    </header>

    <section className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-700/60 space-y-4">
      <h2 className="text-xl font-bold text-white font-display">How We Approach IT Support</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-300 leading-relaxed">
        <div className="space-y-2">
          <h3 className="font-bold text-white">Honest Scope, No Exaggeration</h3>
          <p>
            We state clearly what we can support remotely, how long responses take, and where physical hardware vendor coordination is required. No fabricated metrics or inflated claims.
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="font-bold text-white">Security-First Remote Access</h3>
          <p>
            Every remote session requires explicit customer approval, avoids unnecessary password sharing, runs only for the duration of the task, and is documented cleanly.
          </p>
        </div>
      </div>
    </section>

    <section className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-700/60 space-y-4">
      <h2 className="text-xl font-bold text-white font-display">Business &amp; Registration Information</h2>
      <p className="text-xs sm:text-sm text-slate-300">
        Verified business contact channels are listed below. Fields marked <code className="text-cyan-300 font-mono">TODO</code> are reserved for verified statutory details to be populated prior to formal publication.
      </p>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
          <dt className="text-xs font-mono text-slate-400">Brand / Website</dt>
          <dd className="font-semibold text-white mt-1">Remotfix (https://remotfix.in)</dd>
        </div>
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
          <dt className="text-xs font-mono text-slate-400">Support &amp; Business Email</dt>
          <dd className="font-semibold text-cyan-300 font-mono mt-1">
            <a href="mailto:support@remotfix.in" className="hover:underline">support@remotfix.in</a>
          </dd>
        </div>
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
          <dt className="text-xs font-mono text-slate-400">Legal Business Name</dt>
          <dd className="text-slate-300 font-mono text-xs mt-1">[TODO: Add verified registered legal entity name]</dd>
        </div>
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
          <dt className="text-xs font-mono text-slate-400">Business Address</dt>
          <dd className="text-slate-300 font-mono text-xs mt-1">[TODO: Add verified registered business address]</dd>
        </div>
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
          <dt className="text-xs font-mono text-slate-400">Business Phone Number</dt>
          <dd className="text-slate-300 font-mono text-xs mt-1">[TODO: Add verified business contact phone]</dd>
        </div>
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
          <dt className="text-xs font-mono text-slate-400">Statutory Registrations (Udyam / GSTIN / CIN)</dt>
          <dd className="text-slate-300 font-mono text-xs mt-1">[TODO: Add verified Udyam / GSTIN / CIN if applicable]</dd>
        </div>
      </dl>
      <div className="pt-2">
        <a
          href="/contact"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/contact');
          }}
          className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-cyan-200"
        >
          <span>Contact Our Support Desk</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  </div>
);

export const ContactPage: React.FC<PageProps> = ({ onNavigate }) => (
  <div className="space-y-10">
    <header className="space-y-4 max-w-3xl">
      <div className="text-xs font-mono uppercase tracking-wider text-cyan-300">Contact Desk</div>
      <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display tracking-tight">
        Contact &amp; Support Request Desk
      </h1>
      <p className="text-base text-slate-300 leading-relaxed">
        Remotfix is actively accepting remote IT support requests and IT AMC inquiries. Use the form below to prepare a structured request or write directly to{' '}
        <a href="mailto:support@remotfix.in" className="text-cyan-300 underline font-mono">
          support@remotfix.in
        </a>
        .
      </p>
    </header>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-5 space-y-5">
        <div className="glass-panel rounded-2xl p-6 border border-slate-700/60 space-y-4">
          <h2 className="text-lg font-bold text-white font-display">Direct Channels</h2>
          <div className="space-y-3 text-sm">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
              <Mail className="w-5 h-5 text-cyan-400 shrink-0" aria-hidden="true" />
              <div>
                <div className="text-xs text-slate-400">Primary Support &amp; Business Inquiries</div>
                <a href="mailto:support@remotfix.in" className="font-mono font-semibold text-white hover:text-cyan-300">
                  support@remotfix.in
                </a>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
              <Clock className="w-5 h-5 text-cyan-400 shrink-0" aria-hidden="true" />
              <div>
                <div className="text-xs text-slate-400">Standard Operating Hours</div>
                <div className="text-slate-200 text-xs mt-0.5">Monday – Saturday, Business Hours (IST)</div>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">Phone &amp; Registered Office</div>
              <div className="text-xs font-mono text-slate-300">[TODO: Add verified business phone &amp; office address]</div>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-slate-700/60 space-y-2 text-xs text-slate-300">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Lock className="w-4 h-4 text-cyan-400" aria-hidden="true" />
            <span>Safe Inquiry Handling</span>
          </div>
          <p className="leading-relaxed">
            Never send account passwords, banking details, or private recovery keys in email or contact forms. When a remote session is needed, access is granted only with your live consent.
          </p>
        </div>
      </div>

      <div className="lg:col-span-7">
        <SupportRequestForm onNavigate={onNavigate} />
      </div>
    </div>
  </div>
);

export const RemoteSupportTermsPage: React.FC<PageProps> = ({ onNavigate }) => (
  <div className="space-y-10 max-w-4xl">
    <header className="space-y-4">
      <div className="text-xs font-mono uppercase tracking-wider text-cyan-300">Security Model</div>
      <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display tracking-tight">
        Remote Support Security &amp; Authorization Terms
      </h1>
      <p className="text-base text-slate-300 leading-relaxed">
        Remote access involves trust. Every remote troubleshooting or maintenance session delivered by Remotfix follows strict customer-control and least-privilege principles.
      </p>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        {
          title: '01. Explicit Customer Authorization',
          body: 'Remotfix technicians cannot initiate an unattended remote session without prior written or live customer authorization. You approve each support session before connection begins.',
        },
        {
          title: '02. Never Share Passwords Unnecessarily',
          body: 'Customers should never share personal, banking, or root/admin passwords over email, chat, or forms. Where elevation is required during a live session, type credentials directly on your own keyboard whenever possible.',
        },
        {
          title: '03. Time-Limited Access Scope',
          body: 'Remote access is restricted strictly to the duration and specific systems required to diagnose or resolve the authorized task.',
        },
        {
          title: '04. Session Termination After Work',
          body: 'Once troubleshooting is completed, the remote support session is terminated immediately. Unattended persistent agents are only installed if explicitly agreed in writing for an ongoing IT AMC.',
        },
        {
          title: '05. Activity Logging & Visibility',
          body: 'You can observe actions taken during live screen-sharing sessions, and support activity and system changes are logged in ticket notes where technically possible.',
        },
        {
          title: '06. Strict Confidentiality of Customer Data',
          body: 'Technicians access only files, logs, or settings required for the repair. Customer business records, credentials, and personal documents are handled confidentially.',
        },
      ].map((rule) => (
        <article key={rule.title} className="glass-panel rounded-2xl p-6 border border-slate-700/60 space-y-2">
          <h2 className="text-lg font-bold text-white font-display">{rule.title}</h2>
          <p className="text-sm text-slate-300 leading-relaxed">{rule.body}</p>
        </article>
      ))}
    </div>

    <div className="glass-panel rounded-2xl p-6 border border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-xs sm:text-sm text-slate-300">
          Questions about remote access tools or security practices? Email{' '}
          <a href="mailto:support@remotfix.in" className="text-cyan-300 underline font-mono">
            support@remotfix.in
          </a>
          .
        </p>
      </div>
      <a
        href="/contact"
        onClick={(e) => {
          e.preventDefault();
          onNavigate('/contact');
        }}
        className="min-h-[40px] px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs whitespace-nowrap"
      >
        Request Support
      </a>
    </div>
  </div>
);

export const SlaPage: React.FC<PageProps> = ({ onNavigate }) => (
  <div className="space-y-10 max-w-4xl">
    <header className="space-y-4">
      <div className="text-xs font-mono uppercase tracking-wider text-cyan-300">Service Standards</div>
      <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display tracking-tight">
        Service Level Expectations (SLA)
      </h1>
      <p className="text-base text-slate-300 leading-relaxed">
        Clear, realistic response expectations and operational boundaries for ad-hoc remote support and Annual Maintenance Contract (AMC) engagements.
      </p>
    </header>

    <section className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-700/60 space-y-4">
      <h2 className="text-xl font-bold text-white font-display">Standard Response Targets</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-700 text-xs font-mono text-cyan-300 uppercase">
              <th className="py-3 pr-4">Priority Level</th>
              <th className="py-3 pr-4">Typical Scope</th>
              <th className="py-3">Initial Triage Target</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            <tr>
              <td className="py-3 pr-4 font-semibold text-white">Priority Incident (AMC)</td>
              <td className="py-3 pr-4">Office network outage or critical business server disruption</td>
              <td className="py-3 font-mono tabular-nums text-cyan-300">Within 1–2 business hours</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 font-semibold text-white">Standard Business Support</td>
              <td className="py-3 pr-4">Workstation troubleshooting, email, software, printer issues</td>
              <td className="py-3 font-mono tabular-nums">Same business day (under 4 hours)</td>
            </tr>
            <tr>
              <td className="py-3 pr-4 font-semibold text-white">Scheduled Maintenance</td>
              <td className="py-3 pr-4">OS patching, backup verification drills, network reviews</td>
              <td className="py-3 font-mono tabular-nums">Pre-scheduled monthly / quarterly window</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-700/60 space-y-3 text-sm text-slate-300 leading-relaxed">
      <h2 className="text-xl font-bold text-white font-display">Scope Boundaries &amp; Exclusions</h2>
      <p>
        Remotfix provides software, configuration, remote administration, and preventive maintenance services. Response and restoration times exclude delays outside our control, including upstream ISP fiber cuts, utility power outages, third-party cloud provider incidents, or OEM hardware shipping/warranty replacement lead times.
      </p>
      <p className="pt-2">
        Custom response hours and escalation paths are documented explicitly in each client&apos;s signed AMC proposal.{' '}
        <a
          href="/contact"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/contact');
          }}
          className="text-cyan-300 underline"
        >
          Request a tailored SLA review
        </a>
        .
      </p>
    </section>
  </div>
);

const LegalDocTemplate: React.FC<{
  kicker: string;
  title: string;
  updatedAt: string;
  sections: Array<{ heading: string; body: string }>;
}> = ({ kicker, title, updatedAt, sections }) => (
  <article className="space-y-8 max-w-4xl">
    <header className="space-y-3 border-b border-slate-800 pb-6">
      <div className="text-xs font-mono uppercase tracking-wider text-cyan-300">{kicker}</div>
      <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display tracking-tight">{title}</h1>
      <p className="text-xs font-mono text-slate-400">Last reviewed: {updatedAt}</p>
    </header>
    <div className="space-y-6">
      {sections.map((sec) => (
        <section key={sec.heading} className="glass-panel rounded-2xl p-6 border border-slate-700/60 space-y-2">
          <h2 className="text-lg font-bold text-white font-display">{sec.heading}</h2>
          <p className="text-sm text-slate-300 leading-relaxed">{sec.body}</p>
        </section>
      ))}
    </div>
  </article>
);

export const PrivacyPolicyPage: React.FC = () => (
  <LegalDocTemplate
    kicker="Legal & Privacy"
    title="Privacy Policy"
    updatedAt="2026-11-17"
    sections={[
      {
        heading: '1. Information We Collect',
        body: 'When you contact Remotfix or prepare a support request, we collect only the details you voluntarily send us — such as your name, company name, business email address, phone number (if provided), and a description of your technical issue.',
      },
      {
        heading: '2. How Information Is Used',
        body: 'Submitted details are used strictly to respond to your inquiry, scope Annual Maintenance Contracts, schedule authorized troubleshooting sessions, and communicate service updates. We do not sell, rent, or publicly expose customer contact data.',
      },
      {
        heading: '3. Confidentiality During Remote Support',
        body: 'During an authorized remote session, technicians access only the systems, logs, and settings required to diagnose and resolve the issue. Any business data observed incidentally is treated as strictly confidential.',
      },
      {
        heading: '4. Data Retention & Contact',
        body: 'To request correction or deletion of correspondence or ticket summaries, email support@remotfix.in.',
      },
    ]}
  />
);

export const TermsOfServicePage: React.FC = () => (
  <LegalDocTemplate
    kicker="Legal & Governance"
    title="Terms of Service"
    updatedAt="2026-11-17"
    sections={[
      {
        heading: '1. Scope of Services',
        body: 'Remotfix provides remote IT troubleshooting, workstation support, network and server administration, and IT Annual Maintenance Contracts (AMC) based on mutually agreed proposals or session requests.',
      },
      {
        heading: '2. Customer Authority & Backups',
        body: 'By requesting support on any computer, server, or network device, you confirm that you own or have administrative authorization over that system. Customers remain responsible for maintaining verified backups of critical files prior to major operating system or hardware changes.',
      },
      {
        heading: '3. Acceptable Use & Security',
        body: 'Services may not be used to gain unauthorized access to third-party systems or bypass licensing/security controls belonging to others. Remotfix reserves the right to decline requests that cannot be verified as authorized.',
      },
      {
        heading: '4. Commercial Agreements & Liability',
        body: 'Specific commercial fees, SLA windows, and liability terms are governed by the written quote or AMC agreement issued between Remotfix and the client organization.',
      },
    ]}
  />
);

export const RefundPolicyPage: React.FC = () => (
  <LegalDocTemplate
    kicker="Billing & Cancellations"
    title="Refund & Cancellation Policy"
    updatedAt="2026-11-17"
    sections={[
      {
        heading: '1. Scheduled One-Time Support Sessions',
        body: 'If you cancel or reschedule a pre-paid remote support session before technical work begins, you are eligible for a full reschedule or full refund.',
      },
      {
        heading: '2. Completed Diagnostic Work',
        body: 'Where technician time has been expended on live diagnostics or troubleshooting, charges cover the completed service effort transparently, unless an agreed no-fix or warranty clause applies in writing.',
      },
      {
        heading: '3. Annual Maintenance Contracts (AMC)',
        body: 'AMC cancellation notice periods, renewal terms, and any pro-rata refund eligibility for unused contract periods are governed by the signed client AMC agreement. Send billing or cancellation inquiries to support@remotfix.in.',
      },
    ]}
  />
);

export const NotFoundView: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => (
  <section className="glass-panel rounded-2xl p-8 sm:p-12 border border-slate-700/60 max-w-2xl mx-auto text-center space-y-5 my-8">
    <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/35 text-amber-300 flex items-center justify-center mx-auto">
      <AlertTriangle className="w-6 h-6" aria-hidden="true" />
    </div>
    <div className="text-xs font-mono uppercase tracking-wider text-cyan-300">HTTP 404 · Not Found</div>
    <h1 className="text-3xl font-extrabold text-white font-display">Page Not Found</h1>
    <p className="text-sm text-slate-300 leading-relaxed">
      The requested path does not exist or has been retired. Return to the Remotfix homepage or view our active IT support and AMC services.
    </p>
    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
      <a
        href="/"
        onClick={(e) => {
          e.preventDefault();
          onNavigate('/');
        }}
        className="min-h-[44px] px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm inline-flex items-center"
      >
        Return Home
      </a>
      <a
        href="/services"
        onClick={(e) => {
          e.preventDefault();
          onNavigate('/services');
        }}
        className="min-h-[44px] px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 font-medium text-sm inline-flex items-center"
      >
        View Services
      </a>
    </div>
  </section>
);
