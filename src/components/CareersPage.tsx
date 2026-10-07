import React, { useState } from 'react';
import { 
  Briefcase, 
  Globe2, 
  Clock, 
  Award, 
  Send, 
  CheckCircle2, 
  ArrowLeft, 
  FileText, 
  Monitor, 
  ShieldAlert, 
  Network, 
  Laptop,
  Check,
  Zap,
  Mail
} from 'lucide-react';

interface JobRole {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  icon: React.ElementType;
  description: string;
  requirements: string[];
  responsibilities: string[];
}

export const OPEN_ROLES: JobRole[] = [
  {
    id: 'l2-windows-engineer',
    title: 'Senior Remote Windows Systems Engineer',
    department: 'Remote Operations',
    location: '100% Remote (Global)',
    type: 'Full-Time / Shift Flexible',
    experience: '3+ Years',
    icon: Monitor,
    description:
      'Lead live remote diagnostics for complex Windows 11/10 crashes, blue screen bugchecks, registry corruption, and driver conflicts over encrypted screen share sessions.',
    requirements: [
      'Deep mastery of Windows OS architecture, Sysinternals tools, Event Viewer, and SFC/DISM recovery.',
      'Demonstrated experience with live remote support tools and customer communication.',
      'CompTIA A+, Network+, or Microsoft Certified: Modern Desktop Administrator preferred.'
    ],
    responsibilities: [
      'Conduct 1-on-1 live encrypted troubleshooting sessions with home and enterprise users.',
      'Isolate and remediate persistent OS crash loops, performance throttling, and driver issues.',
      'Document resolution playbooks for the Remotfix technical knowledge base.'
    ]
  },
  {
    id: 'macos-specialist',
    title: 'macOS & Apple Systems Specialist',
    department: 'Remote Operations',
    location: '100% Remote (Global)',
    type: 'Full-Time / Part-Time',
    experience: '2+ Years',
    icon: Laptop,
    description:
      'Provide specialized remote troubleshooting for macOS Sequoia/Sonoma workstations, kernel panic remediation, Apple Silicon diagnostics, and cloud sync integrity.',
    requirements: [
      'Extensive command-line troubleshooting skills in macOS (zsh, launchd daemons, APFS snapshot recovery).',
      'Familiarity with Apple MDM profiles, iCloud keychain conflicts, and Time Machine restorations.',
      'Apple Certified Support Professional (ACSP) is a major plus.'
    ],
    responsibilities: [
      'Diagnose and fix application crashes, permission locks, and thermal anomalies on Apple hardware.',
      'Assist creative studios and remote workers with cross-platform workflow configurations.'
    ]
  },
  {
    id: 'malware-analyst',
    title: 'Cybersecurity & Threat Eradication Analyst',
    department: 'Security & Forensics',
    location: '100% Remote',
    type: 'Full-Time',
    experience: '3+ Years',
    icon: ShieldAlert,
    description:
      'Specialize in remote neutralization of ransomware, rootkits, persistent cryptominers, hijacked DNS routes, and browser infostealers.',
    requirements: [
      'Expertise with malware eradication utilities, sandbox heuristics, and registry forensics.',
      'Understanding of MITRE ATT&CK techniques, phishing vectors, and zero-day containment.',
      'Security+, CySA+, or CEH certification favored.'
    ],
    responsibilities: [
      'Perform deep offline threat sweeps on infected user machines.',
      'Rebuild compromised network adapter settings, host files, and firewall rules.',
      'Generate clear post-incident security posture reports for clients.'
    ]
  },
  {
    id: 'network-infra-engineer',
    title: 'Network & Cloud Infrastructure Technician',
    department: 'Infrastructure',
    location: '100% Remote',
    type: 'Full-Time',
    experience: '2+ Years',
    icon: Network,
    description:
      'Configure and resolve remote VPN gateways, Cloudflare DNS routing, Wi-Fi mesh optimization, and Microsoft 365 / Google Workspace mail migrations.',
    requirements: [
      'Strong grasp of TCP/IP, DNS records (A, CNAME, SPF, DKIM, DMARC), and Cloudflare proxying.',
      'Experience diagnosing packet loss, NAT traversal, and enterprise VPN routing.',
      'CCNA or Network+ preferred.'
    ],
    responsibilities: [
      'Help remote businesses and professionals restore interrupted network pipelines.',
      'Troubleshoot email delivery bounces and configure secure domain DNS records.'
    ]
  }
];

interface CareersPageProps {
  onBackToHome: () => void;
}

export const CareersPage: React.FC<CareersPageProps> = ({ onBackToHome }) => {
  const [selectedRole, setSelectedRole] = useState<JobRole>(OPEN_ROLES[0]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [experienceYears, setExperienceYears] = useState('3-5 years');
  const [coverNote, setCoverNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !coverNote) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const appId = `RF-CAREER-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmittedAppId(appId);
      setIsSubmitting(false);
    }, 700);
  };

  const handleReset = () => {
    setSubmittedAppId(null);
    setName('');
    setEmail('');
    setPhone('');
    setPortfolio('');
    setCoverNote('');
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation */}
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Remotfix Home</span>
        </button>

        {/* Page Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            <Briefcase className="h-4 w-4" />
            <span>Careers at Remotfix · remotfix.in</span>
          </div>
          <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Build the Future of On-Demand Remote IT Support.
          </h1>
          <p className="mt-4 text-base text-slate-300 leading-relaxed">
            Join a global, elite team of systems engineers, security analysts, and troubleshooters resolving real computing crises across the world in real time.
          </p>
        </div>

        {/* Culture & Perks Grid */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <Globe2 className="h-6 w-6 text-cyan-400 mb-3" />
            <h4 className="font-semibold text-white text-sm">100% Remote Freedom</h4>
            <p className="text-xs text-slate-400 mt-1">Work from anywhere in the world with encrypted workstation access.</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <Clock className="h-6 w-6 text-emerald-400 mb-3" />
            <h4 className="font-semibold text-white text-sm">Flexible Shift Scheduling</h4>
            <p className="text-xs text-slate-400 mt-1">Choose your preferred shifts across global timezone coverage rotations.</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <Award className="h-6 w-6 text-amber-400 mb-3" />
            <h4 className="font-semibold text-white text-sm">Certification Sponsorship</h4>
            <p className="text-xs text-slate-400 mt-1">Full reimbursement for Microsoft, CompTIA, Apple, and Cisco certifications.</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <Zap className="h-6 w-6 text-purple-400 mb-3" />
            <h4 className="font-semibold text-white text-sm">High-Performance Tooling</h4>
            <p className="text-xs text-slate-400 mt-1">Access to proprietary diagnostic suites, telemetry analyzers, and sandboxes.</p>
          </div>
        </div>

        {/* Roles & Application Layout */}
        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-12">
          
          {/* Open Roles List (Left) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="font-display text-xl font-bold text-white">Open Positions ({OPEN_ROLES.length})</h2>
              <span className="text-xs text-emerald-400 font-mono">Actively Hiring</span>
            </div>

            <div className="space-y-3">
              {OPEN_ROLES.map((role) => {
                const isSelected = selectedRole.id === role.id;
                const RoleIcon = role.icon;
                return (
                  <div
                    key={role.id}
                    onClick={() => setSelectedRole(role)}
                    className={`rounded-xl border p-5 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950/20 shadow-lg shadow-cyan-950/30'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg ${isSelected ? 'bg-cyan-400 text-black' : 'bg-white/10 text-white'}`}>
                          <RoleIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-sm">{role.title}</h3>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                            <span>{role.department}</span>
                            <span>·</span>
                            <span>{role.location}</span>
                            <span>·</span>
                            <span className="text-slate-300 font-mono">{role.experience}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Role Detail Box */}
            <div className="mt-6 rounded-xl border border-white/10 bg-black/60 p-6 space-y-4">
              <h3 className="font-display text-lg font-bold text-white">
                Role Overview: {selectedRole.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedRole.description}
              </p>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Key Requirements:
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {selectedRole.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Responsibilities:
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {selectedRole.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Application Form (Right) */}
          <div className="lg:col-span-6">
            <div className="glass-panel sticky top-24 rounded-2xl p-6 sm:p-8 shadow-2xl">
              
              {!submittedAppId ? (
                <div>
                  <div className="border-b border-white/10 pb-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                      Direct Application Portal
                    </span>
                    <h3 className="font-display text-xl font-bold text-white mt-1">
                      Apply for {selectedRole.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Applications routed directly to <strong className="text-amber-300">suraj@remotfix.in</strong> & <strong className="text-white">careers@remotfix.in</strong>
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your Full Name"
                          className="w-full rounded-lg border border-white/15 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@domain.com"
                          className="w-full rounded-lg border border-white/15 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Phone / WhatsApp *
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 / International"
                          className="w-full rounded-lg border border-white/15 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Relevant Experience
                        </label>
                        <select
                          value={experienceYears}
                          onChange={(e) => setExperienceYears(e.target.value)}
                          className="w-full rounded-lg border border-white/15 bg-black/60 px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
                        >
                          <option value="1-2 years">1-2 Years</option>
                          <option value="3-5 years">3-5 Years</option>
                          <option value="5-8 years">5-8 Years</option>
                          <option value="8+ years">8+ Years (Lead / Principal)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        LinkedIn Profile or GitHub / Portfolio URL
                      </label>
                      <input
                        type="url"
                        value={portfolio}
                        onChange={(e) => setPortfolio(e.target.value)}
                        placeholder="https://linkedin.com/in/yourprofile"
                        className="w-full rounded-lg border border-white/15 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Technical Background & Why Remotfix? *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={coverNote}
                        onChange={(e) => setCoverNote(e.target.value)}
                        placeholder="Describe your systems troubleshooting background, certifications held, and favorite technical problem you've resolved..."
                        className="w-full rounded-lg border border-white/15 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 py-3 text-xs font-bold text-black uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer shadow-lg shadow-cyan-400/20"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>{isSubmitting ? 'Routing Candidate Application...' : 'Submit Application to Hiring Team'}</span>
                    </button>
                  </form>
                </div>
              ) : (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-white">Application Received</h3>
                      <p className="text-xs text-slate-400 font-mono">Reference: {submittedAppId}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Thank you, <strong>{name}</strong>! Your candidate profile for <strong>{selectedRole.title}</strong> has been transmitted to Founder Suraj (<span className="text-amber-300 font-mono">suraj@remotfix.in</span>).
                  </p>

                  <div className="rounded-xl border border-white/10 bg-black/50 p-4 text-xs font-mono space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Applicant:</span>
                      <span className="text-white">{name} ({email})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Position:</span>
                      <span className="text-cyan-400">{selectedRole.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Review SLA:</span>
                      <span className="text-emerald-400">Within 48 Hours</span>
                    </div>
                  </div>

                  <button
                    onClick={handleReset}
                    className="w-full text-center text-xs text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    Submit another application
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
