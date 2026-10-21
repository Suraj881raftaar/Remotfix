import React, { useState } from 'react';
import { 
  X, 
  Search, 
  ExternalLink, 
  Check, 
  Copy, 
  FileCode, 
  Bot, 
  Zap, 
  ShieldCheck, 
  CheckCircle2,
  Globe2
} from 'lucide-react';

interface SearchIndexModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchIndexModal: React.FC<SearchIndexModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedPing, setCopiedPing] = useState(false);

  if (!isOpen) return null;

  const indexNowKey = 'e837f828a35e43cafb0124814485963a';
  const pingUrl = `https://www.bing.com/indexnow?url=https://remotfix.in/&key=${indexNowKey}`;

  const handleCopy = (text: string, type: 'key' | 'ping') => {
    navigator.clipboard.writeText(text);
    if (type === 'key') {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else {
      setCopiedPing(true);
      setTimeout(() => setCopiedPing(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-slate-900/90 border border-slate-700/70 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl z-10 space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
                Search Engine & Indexing Hub
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                  READY
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Configurations and instant submission protocols for remotfix.in
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 403 Forbidden Error Alert & Instant Fix Guide */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-200 font-display">
                How to Clear "Blocked due to access forbidden (403)"
              </h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                Google Search Console reported <code className="text-amber-300 font-mono">Page fetch: Failed (403)</code>. Your <code className="text-emerald-400 font-mono">robots.txt</code> allows crawling (<span className="text-emerald-400 font-semibold">Crawl allowed: Yes</span>), which means the block is happening at the Cloudflare or DNS firewall level.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="font-semibold text-cyan-300">1. Check Inspected Domain URL</span>
              <p className="text-slate-400 leading-snug">
                Make sure you entered <code className="text-white font-mono">https://remotfix.in/</code> and NOT the staging <code className="text-slate-500 font-mono">*.run.app</code> preview URL (staging URLs block public crawlers by default).
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="font-semibold text-cyan-300">2. Cloudflare Bot Fight Mode</span>
              <p className="text-slate-400 leading-snug">
                Go to <span className="text-white font-medium">Cloudflare &gt; Security &gt; Bots</span>. Turn OFF <span className="text-amber-200">"Bot Fight Mode"</span> or allow verified search engine bots.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="font-semibold text-cyan-300">3. Cloudflare WAF Allow Rule</span>
              <p className="text-slate-400 leading-snug">
                Under <span className="text-white font-medium">Security &gt; WAF &gt; Custom Rules</span>, add an Allow rule: <code className="text-cyan-300 font-mono">cf.client.bot eq true</code> &rarr; Action: <strong>Skip all WAF rules</strong>.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="font-semibold text-cyan-300">4. Browser Integrity Check</span>
              <p className="text-slate-400 leading-snug">
                Under <span className="text-white font-medium">Security &gt; Settings</span>, disable <span className="text-amber-200">"Browser Integrity Check"</span> and ensure Security Level is set to <span className="text-emerald-300">Medium</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Indexing Readiness Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-slate-200">XML Sitemap Configured</div>
              <div className="text-slate-400 text-[11px]">Indexed at <code className="text-cyan-300">/sitemap.xml</code> with image metadata</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-slate-200">Universal robots.txt</div>
              <div className="text-slate-400 text-[11px]">Explicit allow for Google, Bing, Yahoo, Yandex & AI bots</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-slate-200">Schema.org JSON-LD</div>
              <div className="text-slate-400 text-[11px]">ProfessionalService, AMC Offers, Breadcrumbs</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-slate-200">Instant IndexNow Protocol</div>
              <div className="text-slate-400 text-[11px]">1-second push notification to Bing, Yandex, Naver</div>
            </div>
          </div>
        </div>

        {/* Instant Search Engine Actions */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
            Direct Search Engine Submissions
          </h3>

          <div className="space-y-2">
            {/* Google Search Console */}
            <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Globe2 className="w-5 h-5 text-blue-400 shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-slate-200">Google Search Console</div>
                  <div className="text-xs text-slate-400">Submit sitemap <code className="text-cyan-300">https://remotfix.in/sitemap.xml</code> for crawl</div>
                </div>
              </div>
              <a 
                href="https://search.google.com/search-console" 
                target="_blank" 
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <span>Console</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Microsoft Bing Webmaster Tools */}
            <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-slate-200">Microsoft Bing & Copilot Webmaster</div>
                  <div className="text-xs text-slate-400">Powering Bing, Yahoo, DuckDuckGo, and Copilot AI answers</div>
                </div>
              </div>
              <a 
                href="https://www.bing.com/webmasters" 
                target="_blank" 
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <span>Webmaster</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* IndexNow 1-Click Ping */}
            <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold">
                  <Zap className="w-4 h-4" />
                  <span>IndexNow Instant Ping (Bing & Yandex)</span>
                </div>
                <button
                  onClick={() => handleCopy(pingUrl, 'ping')}
                  className="text-xs text-cyan-300 hover:text-white flex items-center gap-1 font-mono transition-colors"
                >
                  {copiedPing ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPing ? 'Copied' : 'Copy Ping URL'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                You can ping Bing's IndexNow endpoint directly to request an instant crawl without waiting days:
              </p>
              <div className="p-2 rounded-lg bg-slate-950 text-[11px] font-mono text-slate-300 truncate border border-slate-800">
                {pingUrl}
              </div>
            </div>
          </div>
        </div>

        {/* Public Machine-Readable Files */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
            Public Crawl Endpoints
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <a 
              href="/sitemap.xml" 
              target="_blank" 
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 text-slate-300 flex items-center justify-between transition-colors"
            >
              <span className="font-mono text-cyan-400">/sitemap.xml</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
            <a 
              href="/robots.txt" 
              target="_blank" 
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 text-slate-300 flex items-center justify-between transition-colors"
            >
              <span className="font-mono text-cyan-400">/robots.txt</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
            <a 
              href="/llms.txt" 
              target="_blank" 
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 text-slate-300 flex items-center justify-between transition-colors"
            >
              <span className="font-mono text-cyan-400">/llms.txt</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-2 border-t border-slate-800 text-center text-xs text-slate-500">
          Domain: <span className="text-slate-300 font-mono">remotfix.in</span> · Canonical: <span className="text-slate-300 font-mono">https://remotfix.in/</span> · Contact: <span className="text-cyan-400 font-mono">support@remotfix.in</span>
        </div>

      </div>
    </div>
  );
};
