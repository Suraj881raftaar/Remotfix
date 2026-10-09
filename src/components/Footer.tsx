import React from 'react';
import { Cpu, ShieldCheck, Globe, Mail } from 'lucide-react';

interface FooterProps {
  onOpenDnsGuide: () => void;
  onOpenContact: () => void;
  onNavigateView: (view: 'home' | 'book' | 'track' | 'console' | 'careers') => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onOpenDnsGuide, 
  onOpenContact,
  onNavigateView
}) => {
  return (
    <footer className="border-t border-white/10 bg-[#06080D] text-xs text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          
          {/* Col 1: Brand & Domain Summary */}
          <div className="md:col-span-5 space-y-4">
            <button
              onClick={() => onNavigateView('home')}
              className="flex items-center gap-2 font-display text-lg font-bold text-white cursor-pointer"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-black">
                <Cpu className="h-4 w-4" />
              </div>
              <span>
                remotfix<span className="text-cyan-400">.in</span>
              </span>
            </button>
            <p className="max-w-sm text-xs text-slate-400 leading-relaxed">
              On-demand remote IT support, computer troubleshooting, virus eradication, and operating system diagnostics across global networks.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Globe className="h-3.5 w-3.5 text-cyan-400" />
              <span>Domain: <strong className="text-white font-mono">remotfix.in</strong></span>
              <span className="text-slate-600" aria-hidden="true">·</span>
              <span className="text-orange-400">DNS via Cloudflare</span>
            </div>
          </div>

          {/* Col 2: Services & Links */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">MVP Portals</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button
                  onClick={() => onNavigateView('book')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left font-medium"
                >
                  Book Remote Diagnostic (MVP)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateView('track')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Track Session Room (Live)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateView('console')}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-left"
                >
                  Staff Operations Console
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateView('careers')}
                  className="text-cyan-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>Careers (We're Hiring)</span>
                  <span className="text-[10px] bg-cyan-950 border border-cyan-500/30 px-1.5 py-0.2 rounded">Global</span>
                </button>
              </li>
            </ul>
          </div>



          {/* Col 3: Direct Contact */}
          <div className="md:col-span-4 space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Direct Helpdesk</h4>
            <div className="space-y-2 text-slate-300">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-cyan-400" />
                <a href="mailto:support@remotfix.in" className="hover:text-white font-mono">support@remotfix.in</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-amber-300" />
                <a href="mailto:suraj@remotfix.in" className="hover:text-amber-300 font-mono">suraj@remotfix.in</a>
                <span className="text-[10px] text-amber-400/80 font-mono">(Founder)</span>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenContact}
                  className="rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-xs text-white hover:bg-white/10 transition-colors"
                >
                  Submit Support Ticket
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <div>
            © {new Date().getFullYear()} Remotfix (remotfix.in). All rights reserved. Encrypted remote sessions.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenDnsGuide}
              className="text-amber-400 hover:underline inline-flex items-center gap-1"
            >
              <ShieldCheck className="h-3 w-3" />
              <span>Cloudflare DNS Guide</span>
            </button>
            <span>·</span>
            <span>No-Fix, No-Fee Guarantee</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
