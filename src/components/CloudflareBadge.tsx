import React from 'react';
import { Globe, Shield, Activity, ExternalLink } from 'lucide-react';

interface CloudflareBadgeProps {
  onOpenGuide: () => void;
}

export const CloudflareBadge: React.FC<CloudflareBadgeProps> = ({ onOpenGuide }) => {
  return (
    <div className="w-full border-y border-white/10 bg-[#0C0F17]/90 py-3 text-xs text-slate-400">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        
        {/* Left: Domain & DNS provider */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1.5 font-mono text-slate-200">
            <Globe className="h-3.5 w-3.5 text-cyan-400" />
            <span className="font-semibold text-white">remotfix.in</span>
          </div>
          <span className="hidden text-slate-600 sm:inline" aria-hidden="true">·</span>
          <div className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-orange-400" />
            <span>DNS Managed by <strong className="text-slate-200">Cloudflare 1.1.1.1 Network</strong></span>
          </div>
        </div>

        {/* Right: Security & Helper link */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 text-emerald-400">
            <Activity className="h-3.5 w-3.5" />
            <span className="text-slate-300">Edge SSL & DDoS Guard Active</span>
          </div>
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1 text-slate-300 hover:text-white underline underline-offset-4 transition-colors cursor-pointer text-xs"
          >
            <span>DNS Setup Reference</span>
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>

      </div>
    </div>
  );
};
