import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  ExternalLink, 
  Check, 
  Copy, 
  Zap, 
  CheckCircle2,
  Globe2,
  ShieldAlert,
  RotateCcw,
  Gauge
} from 'lucide-react';

interface SearchIndexModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CfChecklistState {
  domainUrl: boolean;
  botFightOff: boolean;
  wafSkipRule: boolean;
  browserIntegrityOff: boolean;
}

const DEFAULT_CHECKLIST: CfChecklistState = {
  domainUrl: false,
  botFightOff: false,
  wafSkipRule: false,
  browserIntegrityOff: false
};

export const SearchIndexModal: React.FC<SearchIndexModalProps> = ({ isOpen, onClose }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [checklist, setChecklist] = useState<CfChecklistState>(DEFAULT_CHECKLIST);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('remotfix_cf_checklist');
      if (saved) {
        setChecklist({ ...DEFAULT_CHECKLIST, ...JSON.parse(saved) });
      }
    } catch {
      // ignore storage read error
    }
  }, []);

  if (!isOpen) return null;

  const indexNowKey = 'e837f828a35e43cafb0124814485963a';
  const pingUrl = `https://www.bing.com/indexnow?url=https://remotfix.in/&key=${indexNowKey}`;
  const wafRuleExpression = `(cf.client.bot) or (http.user_agent contains "Chrome-Lighthouse") or (http.user_agent contains "Google-InspectionTool") or (http.user_agent contains "PTST")`;
  const pageSpeedUrl = `https://pagespeed.web.dev/analysis?url=${encodeURIComponent('https://remotfix.in/')}`;

  const completedCount = Object.values(checklist).filter(Boolean).length;

  const toggleChecklistItem = (key: keyof CfChecklistState) => {
    const updated = { ...checklist, [key]: !checklist[key] };
    setChecklist(updated);
    try {
      localStorage.setItem('remotfix_cf_checklist', JSON.stringify(updated));
    } catch {
      // ignore storage write error
    }
  };

  const resetChecklist = () => {
    setChecklist(DEFAULT_CHECKLIST);
    try {
      localStorage.removeItem('remotfix_cf_checklist');
    } catch {
      // ignore
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="indexing-modal-title"
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-slate-900/95 border border-slate-700/70 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl z-10 space-y-6 my-8">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Search className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="indexing-modal-title" className="text-xl font-bold text-white font-display">
                Search Engine &amp; PageSpeed Indexing Hub
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                SEO diagnostics, Cloudflare 403 remediation, and crawler verification for remotfix.in
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            aria-label="Close Search Engine Indexing Hub"
            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* PageSpeed Insights & 403 Root Cause Diagnosis */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-200 font-display">
                Why PageSpeed &amp; Search Console Showed HTTP 403 &amp; SEO 40
              </h3>
              <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                Cloudflare&apos;s <strong className="text-white">&ldquo;Performing security verification&rdquo;</strong> challenge page intercepted Lighthouse and Googlebot with HTTP <code className="text-amber-300 font-mono">403</code>. That Cloudflare interstitial injects <code className="text-amber-300 font-mono">noindex</code>, omits your meta description, and runs challenge scripts that add ~460 ms blocking time.
              </p>
            </div>
          </div>

          {/* Copyable Cloudflare WAF Custom Rule Expression */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-cyan-300">
                Cloudflare WAF Custom Rule Expression (Allow Search &amp; PageSpeed Bots)
              </span>
              <button
                type="button"
                onClick={() => handleCopy(wafRuleExpression, 'waf')}
                className="text-xs text-cyan-300 hover:text-white flex items-center gap-1 font-mono transition-colors px-2 py-1 rounded bg-slate-900 border border-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
              >
                {copiedId === 'waf' ? <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" /> : <Copy className="w-3.5 h-3.5" aria-hidden="true" />}
                <span>{copiedId === 'waf' ? 'Copied' : 'Copy Rule'}</span>
              </button>
            </div>
            <pre className="text-[11px] font-mono text-slate-200 overflow-x-auto p-2 rounded bg-slate-900/90 border border-slate-800">
              {wafRuleExpression}
            </pre>
            <p className="text-[11px] text-slate-300">
              In Cloudflare: <span className="text-white font-medium">Security &gt; WAF &gt; Custom rules &gt; Edit expression</span> &rarr; Action: <span className="text-emerald-300 font-semibold">Skip all remaining rules, Security Level &amp; Rate Limiting</span>.
            </p>
          </div>

          {/* Interactive 4-Step Cloudflare Verification Checklist */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200 font-mono tabular-nums">
                Cloudflare Unblock Checklist ({completedCount}/4 Completed)
              </span>
              {completedCount > 0 && (
                <button
                  type="button"
                  onClick={resetChecklist}
                  className="text-xs text-slate-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" aria-hidden="true" /> Reset
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => toggleChecklistItem('domainUrl')}
                className={`p-3 rounded-xl border text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer ${
                  checklist.domainUrl ? 'bg-emerald-950/40 border-emerald-500/40' : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-2">
                  <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${checklist.domainUrl ? 'text-emerald-400' : 'text-slate-400'}`} aria-hidden="true" />
                  <div>
                    <div className="font-semibold text-slate-100">1. Inspect Production URL</div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Test <code className="text-cyan-300 font-mono">https://remotfix.in/</code> directly, not staging <code className="text-slate-300 font-mono">*.run.app</code> URLs.
                    </p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => toggleChecklistItem('botFightOff')}
                className={`p-3 rounded-xl border text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer ${
                  checklist.botFightOff ? 'bg-emerald-950/40 border-emerald-500/40' : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-2">
                  <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${checklist.botFightOff ? 'text-emerald-400' : 'text-slate-400'}`} aria-hidden="true" />
                  <div>
                    <div className="font-semibold text-slate-100">2. Disable Bot Fight Mode</div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      In <span className="text-white">Security &gt; Bots</span>, turn OFF Bot Fight Mode so Lighthouse &amp; Googlebot aren&apos;t challenged.
                    </p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => toggleChecklistItem('wafSkipRule')}
                className={`p-3 rounded-xl border text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer ${
                  checklist.wafSkipRule ? 'bg-emerald-950/40 border-emerald-500/40' : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-2">
                  <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${checklist.wafSkipRule ? 'text-emerald-400' : 'text-slate-400'}`} aria-hidden="true" />
                  <div>
                    <div className="font-semibold text-slate-100">3. Deploy WAF Skip Rule</div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Paste the rule above under <span className="text-white">Security &gt; WAF &gt; Custom rules</span> and place it #1.
                    </p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => toggleChecklistItem('browserIntegrityOff')}
                className={`p-3 rounded-xl border text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer ${
                  checklist.browserIntegrityOff ? 'bg-emerald-950/40 border-emerald-500/40' : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-2">
                  <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${checklist.browserIntegrityOff ? 'text-emerald-400' : 'text-slate-400'}`} aria-hidden="true" />
                  <div>
                    <div className="font-semibold text-slate-100">4. Browser Integrity &amp; Geo</div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Under <span className="text-white">Security &gt; Settings</span>, disable Browser Integrity Check and allow US/EU Google probes.
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Code-Side Readiness Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <div className="font-semibold text-slate-100">SEO Title &amp; Meta Description</div>
              <div className="text-slate-300 text-[11px]">Optimized length (51-char title, 142-char description)</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <div className="font-semibold text-slate-100">Universal robots.txt &amp; Sitemap</div>
              <div className="text-slate-300 text-[11px]">Explicit allow for Google, Bing, AI bots &amp; XML sitemap</div>
            </div>
          </div>
        </div>

        {/* Verification & Submission Tools */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
            Retest &amp; Search Submissions
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <a 
              href={pageSpeedUrl}
              target="_blank" 
              rel="noreferrer"
              className="p-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-200 text-xs font-semibold flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-2"><Gauge className="w-4 h-4 text-cyan-300" aria-hidden="true" /> PageSpeed Retest</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>

            <a 
              href="https://search.google.com/search-console" 
              target="_blank" 
              rel="noreferrer"
              className="p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-2"><Globe2 className="w-4 h-4 text-blue-400" aria-hidden="true" /> Search Console</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>

            <a 
              href="https://www.bing.com/webmasters" 
              target="_blank" 
              rel="noreferrer"
              className="p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-amber-400" aria-hidden="true" /> Bing Webmaster</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>

          {/* IndexNow Ping */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-cyan-300">IndexNow Instant Ping URL (Bing &amp; Yandex)</span>
              <button
                type="button"
                onClick={() => handleCopy(pingUrl, 'ping')}
                className="text-xs text-cyan-300 hover:text-white flex items-center gap-1 font-mono transition-colors cursor-pointer"
              >
                {copiedId === 'ping' ? <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" /> : <Copy className="w-3.5 h-3.5" aria-hidden="true" />}
                <span>{copiedId === 'ping' ? 'Copied' : 'Copy URL'}</span>
              </button>
            </div>
            <div className="text-[11px] font-mono text-slate-300 truncate">
              {pingUrl}
            </div>
          </div>
        </div>

        {/* Public Machine-Readable Files */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <a 
            href="/sitemap.xml" 
            target="_blank" 
            rel="noreferrer"
            className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 text-slate-200 flex items-center justify-between transition-colors"
          >
            <span className="font-mono text-cyan-300">/sitemap.xml</span>
            <ExternalLink className="w-3 h-3 text-slate-400" aria-hidden="true" />
          </a>
          <a 
            href="/robots.txt" 
            target="_blank" 
            rel="noreferrer"
            className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 text-slate-200 flex items-center justify-between transition-colors"
          >
            <span className="font-mono text-cyan-300">/robots.txt</span>
            <ExternalLink className="w-3 h-3 text-slate-400" aria-hidden="true" />
          </a>
          <a 
            href="/llms.txt" 
            target="_blank" 
            rel="noreferrer"
            className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 text-slate-200 flex items-center justify-between transition-colors"
          >
            <span className="font-mono text-cyan-300">/llms.txt</span>
            <ExternalLink className="w-3 h-3 text-slate-400" aria-hidden="true" />
          </a>
        </div>

        <div className="pt-2 border-t border-slate-800 text-center text-xs text-slate-300">
          Domain: <span className="text-white font-mono">remotfix.in</span> · Contact: <span className="text-cyan-300 font-mono">support@remotfix.in</span>
        </div>
      </div>
    </div>
  );
};
