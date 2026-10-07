import React, { useState } from 'react';
import { X, ShieldCheck, Globe, Check, Copy, ExternalLink, Server, AlertCircle } from 'lucide-react';

interface DnsGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DnsGuideModal: React.FC<DnsGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedRecord, setCopiedRecord] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRecord(id);
    setTimeout(() => setCopiedRecord(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-3xl rounded-2xl border border-white/20 bg-[#0E111A] p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-lg p-2 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3 border-b border-white/10 pb-4 pr-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-950/60 border border-orange-500/30 text-orange-400 shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg sm:text-xl font-bold text-white">
              Cloudflare DNS & Domain Configuration Guide
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Domain: <strong className="text-white font-mono">remotfix.in</strong> · DNS Provider: <strong className="text-orange-300">Cloudflare</strong>
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="mt-6 space-y-6 text-xs sm:text-sm text-slate-300">
          
          <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-2">
            <h4 className="font-semibold text-white flex items-center gap-2">
              <Globe className="h-4 w-4 text-cyan-400" />
              <span>Domain & DNS Health Check Status</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your domain <span className="font-mono text-cyan-300">remotfix.in</span> is configured to route traffic through Cloudflare's global anycast network, providing automated DDoS mitigation, HTTP/3, and SSL edge encryption.
            </p>
          </div>

          {/* Cloudflare Recommended Records */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Standard Cloudflare DNS Records for remotfix.in
            </h4>
            <div className="rounded-xl border border-white/10 bg-black/60 overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 bg-white/5">
                    <th className="p-3">Type</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Content / Target</th>
                    <th className="p-3">Proxy Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="p-3 text-cyan-400 font-bold">CNAME</td>
                    <td className="p-3 text-slate-200">@ (root)</td>
                    <td className="p-3 text-slate-300 truncate max-w-[180px]">ghs.googlehosted.com</td>
                    <td className="p-3 text-orange-400">Proxied (Orange)</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleCopy('ghs.googlehosted.com', 'cname-root')}
                        className="text-[11px] text-slate-400 hover:text-white inline-flex items-center gap-1 cursor-pointer"
                      >
                        {copiedRecord === 'cname-root' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                        <span>Copy</span>
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 text-cyan-400 font-bold">CNAME</td>
                    <td className="p-3 text-slate-200">www</td>
                    <td className="p-3 text-slate-300 truncate max-w-[180px]">remotfix.in</td>
                    <td className="p-3 text-orange-400">Proxied (Orange)</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleCopy('remotfix.in', 'cname-www')}
                        className="text-[11px] text-slate-400 hover:text-white inline-flex items-center gap-1 cursor-pointer"
                      >
                        {copiedRecord === 'cname-www' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                        <span>Copy</span>
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 text-amber-400 font-bold">TXT</td>
                    <td className="p-3 text-slate-200">@ (root)</td>
                    <td className="p-3 text-slate-300 truncate max-w-[180px]">v=spf1 include:_spf.google.com ~all</td>
                    <td className="p-3 text-slate-400">DNS Only</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleCopy('v=spf1 include:_spf.google.com ~all', 'txt-spf')}
                        className="text-[11px] text-slate-400 hover:text-white inline-flex items-center gap-1 cursor-pointer"
                      >
                        {copiedRecord === 'txt-spf' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                        <span>Copy</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Cloudflare Edge Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="rounded-lg bg-black/40 border border-white/10 p-3.5">
              <span className="text-slate-400 block font-semibold mb-1">SSL/TLS Encryption Mode</span>
              <p className="text-slate-300">Set to <strong className="text-white">Full (Strict)</strong> in Cloudflare Dashboard under SSL/TLS for end-to-end encryption.</p>
            </div>
            <div className="rounded-lg bg-black/40 border border-white/10 p-3.5">
              <span className="text-slate-400 block font-semibold mb-1">Always Use HTTPS</span>
              <p className="text-slate-300">Enable <strong className="text-white">Always Use HTTPS</strong> and Automatic HTTPS Rewrites in Cloudflare Edge Certificates.</p>
            </div>
          </div>

          {/* SEO & Mobile Optimization notes */}
          <div className="border-t border-white/10 pt-4 space-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <Check className="h-4 w-4" />
              <span>Search Engine Optimization (SEO) & Mobile Readiness Enforced:</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li>Canonical tag pointing to <code className="text-white bg-white/10 px-1 py-0.5 rounded">https://remotfix.in/</code></li>
              <li>Schema.org JSON-LD for <code className="text-white bg-white/10 px-1 py-0.5 rounded">WebApplication</code> and <code className="text-white bg-white/10 px-1 py-0.5 rounded">ProfessionalService</code></li>
              <li>OpenGraph and Twitter Card social share preview snippets</li>
              <li>Responsive viewport meta tag with touch targets &gt; 44px for mobile phones and tablets</li>
            </ul>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="mt-6 border-t border-white/10 pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-white px-5 py-2 text-xs font-semibold text-black hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Close Reference Guide
          </button>
        </div>

      </div>
    </div>
  );
};
