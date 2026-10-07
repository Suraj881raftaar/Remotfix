import React from 'react';
import { 
  Zap, 
  ShieldAlert, 
  Gauge, 
  Network, 
  Check, 
  ArrowUpRight 
} from 'lucide-react';

interface ServicesBentoProps {
  onOpenInquiry: (category: string) => void;
}

export const ServicesBento: React.FC<ServicesBentoProps> = ({ onOpenInquiry }) => {
  return (
    <section id="services" className="border-t border-white/10 bg-[#090A0F] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Core Capabilities · remotfix.in
            </div>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Engineered for Swift, Permanent Technical Resolution.
            </h2>
          </div>
          <p className="max-w-md text-sm text-slate-300">
            Certified Level 2 & 3 systems technicians diagnosing and remediating your OS, network, and security anomalies without physical handoff.
          </p>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-12">
          
          {/* Card 01: Large Marquee (col-span-7) */}
          <div className="md:col-span-7 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-6 sm:p-8 flex flex-col justify-between hover:border-white/20 transition-all">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="text-cyan-400 font-semibold text-sm">01. Live Remote Diagnostic Screen Share</span>
                <span>Zero Installation</span>
              </div>
              <h3 className="mt-4 font-display text-2xl font-bold text-white">
                Browser-Initiated Secure Remote Assistance
              </h3>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                Connect via lightweight, one-time TLS session. Our senior technicians troubleshoot and resolve your computer errors while you watch directly on screen. No cumbersome software packages or permanent background daemons left behind.
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>Real-time terminal & registry repair</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>Driver conflict resolution</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>Dual-monitor & multi-OS support</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>Automatic session termination</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400">Available for Windows, macOS & Linux</span>
              <button
                onClick={() => onOpenInquiry('Live Diagnostic')}
                className="flex items-center gap-1 text-xs font-semibold text-white hover:text-cyan-300 transition-colors cursor-pointer"
              >
                <span>Request Session</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Card 02: Virus & Malware (col-span-5) */}
          <div className="md:col-span-5 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-6 sm:p-8 flex flex-col justify-between hover:border-white/20 transition-all">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="text-cyan-400 font-semibold text-sm">02. Deep Threat Sanitization</span>
                <span>Security</span>
              </div>
              <h3 className="mt-4 font-display text-xl font-bold text-white">
                Virus, Ransomware & Spyware Eradication
              </h3>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                Full-spectrum rootkit cleanup, DNS hijacker neutralization, malicious browser extension removal, and endpoint hardening to prevent recurring breaches.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-emerald-400">Includes Post-Scan Security Audit</span>
              <button
                onClick={() => onOpenInquiry('Malware & Virus')}
                className="flex items-center gap-1 text-xs font-semibold text-white hover:text-cyan-300 transition-colors cursor-pointer"
              >
                <span>Clean Machine</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Card 03: Speed & OS Optimization (col-span-5) */}
          <div className="md:col-span-5 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-6 sm:p-8 flex flex-col justify-between hover:border-white/20 transition-all">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="text-cyan-400 font-semibold text-sm">03. High-Performance Tune-Up</span>
                <span>Speed</span>
              </div>
              <h3 className="mt-4 font-display text-xl font-bold text-white">
                OS Optimization & Thermal Health
              </h3>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                Eliminate startup lag, throttle issues, fragmented temp caches, and memory hogging background processes to restore like-new computing speed.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400">Average +40% speed boost</span>
              <button
                onClick={() => onOpenInquiry('Performance Optimization')}
                className="flex items-center gap-1 text-xs font-semibold text-white hover:text-cyan-300 transition-colors cursor-pointer"
              >
                <span>Tune System</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Card 04: Network & Cloud (col-span-7) */}
          <div className="md:col-span-7 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-6 sm:p-8 flex flex-col justify-between hover:border-white/20 transition-all">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="text-cyan-400 font-semibold text-sm">04. Connectivity & Workspaces</span>
                <span>Infrastructure</span>
              </div>
              <h3 className="mt-4 font-display text-2xl font-bold text-white">
                Network, VPN, Printer & Cloud Email Setup
              </h3>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                Comprehensive setup and troubleshooting for Wi-Fi drops, enterprise VPN tunnels, Microsoft 365 / Google Workspace synchronization, network printers, and Cloudflare DNS routing.
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>Wi-Fi & mesh roaming stability</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>Cloud email & calendar migrations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>DNS 1.1.1.1 & SPF/DKIM validation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>Secure automated cloud backups</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400">Home Office & Small Business Ready</span>
              <button
                onClick={() => onOpenInquiry('Network & Cloud Setup')}
                className="flex items-center gap-1 text-xs font-semibold text-white hover:text-cyan-300 transition-colors cursor-pointer"
              >
                <span>Configure Network</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
