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
  Gauge,
  DatabaseZap
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

interface CacheChecklistState {
  devModeOff: boolean;
  respectHeaders: boolean;
  cacheRuleAdded: boolean;
  verifyHit: boolean;
}

const DEFAULT_CHECKLIST: CfChecklistState = {
  domainUrl: false,
  botFightOff: false,
  wafSkipRule: false,
  browserIntegrityOff: false
};

const DEFAULT_CACHE_CHECKLIST: CacheChecklistState = {
  devModeOff: false,
  respectHeaders: false,
  cacheRuleAdded: false,
  verifyHit: false
};

export const SearchIndexModal: React.FC<SearchIndexModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'cache' | 'security'>('cache');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [checklist, setChecklist] = useState<CfChecklistState>(DEFAULT_CHECKLIST);
  const [cacheChecklist, setCacheChecklist] = useState<CacheChecklistState>(DEFAULT_CACHE_CHECKLIST);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('remotfix_cf_checklist');
      if (saved) {
        setChecklist({ ...DEFAULT_CHECKLIST, ...JSON.parse(saved) });
      }
      const savedCache = localStorage.getItem('remotfix_cf_cache_checklist');
      if (savedCache) {
        setCacheChecklist({ ...DEFAULT_CACHE_CHECKLIST, ...JSON.parse(savedCache) });
      }
    } catch {
      // ignore storage read error
    }
  }, []);

  if (!isOpen) return null;

  const indexNowKey = 'e837f828a35e43cafb0124814485963a';
  const pingUrl = `https://www.bing.com/indexnow?url=https://remotfix.in/&key=${indexNowKey}`;
  const wafRuleExpression = `(cf.client.bot) or (http.user_agent contains "Chrome-Lighthouse") or (http.user_agent contains "Google-InspectionTool") or (http.user_agent contains "PTST")`;
  const cacheRuleExpression = `(http.host eq "remotfix.in") or (http.host eq "www.remotfix.in")`;
  const pageSpeedUrl = `https://pagespeed.web.dev/analysis?url=${encodeURIComponent('https://remotfix.in/')}`;

  const completedCount = Object.values(checklist).filter(Boolean).length;
  const completedCacheCount = Object.values(cacheChecklist).filter(Boolean).length;

  const toggleChecklistItem = (key: keyof CfChecklistState) => {
    const updated = { ...checklist, [key]: !checklist[key] };
    setChecklist(updated);
    try {
      localStorage.setItem('remotfix_cf_checklist', JSON.stringify(updated));
    } catch {
      // ignore storage write error
    }
  };

  const toggleCacheChecklistItem = (key: keyof CacheChecklistState) => {
    const updated = { ...cacheChecklist, [key]: !cacheChecklist[key] };
    setCacheChecklist(updated);
    try {
      localStorage.setItem('remotfix_cf_cache_checklist', JSON.stringify(updated));
    } catch {
      // ignore storage write error
    }
  };

  const resetChecklist = () => {
    if (activeTab === 'security') {
      setChecklist(DEFAULT_CHECKLIST);
      try {
        localStorage.removeItem('remotfix_cf_checklist');
      } catch {
        // ignore
      }
    } else {
      setCacheChecklist(DEFAULT_CACHE_CHECKLIST);
      try {
        localStorage.removeItem('remotfix_cf_cache_checklist');
      } catch {
        // ignore
      }
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
      <div className="relative w-full max-w-2xl bg-slate-900/95 border border-slate-700/70 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl z-10 space-y-5 my-8">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Search className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="indexing-modal-title" className="text-xl font-bold text-white font-display">
                Search Engine, Cache &amp; PageSpeed Hub
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Cloudflare edge caching, 403 remediation, and crawler verification for remotfix.in
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

        {/* Segmented Tab Controls */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950/80 border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('cache')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'cache'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <DatabaseZap className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Zero Cache Hits Fix</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'security'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" />
            <span>403 &amp; PageSpeed SEO Fix</span>
          </button>
        </div>

        {activeTab === 'cache' ? (
          /* ZERO CACHE HITS REMEDIATION */
          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0">
                <DatabaseZap className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-cyan-200 font-display">
                  Fixing &ldquo;0 Cache Hits&rdquo; on remotfix.in (Cloudflare Pages)
                </h3>
                <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                  A <code className="text-cyan-300 font-mono">_headers</code> file is copied into <code className="text-cyan-300 font-mono">dist/</code> on build, caching <code className="text-cyan-300 font-mono">/assets/*</code> for 1 year (<code className="text-cyan-300 font-mono">immutable</code>) while always revalidating <code className="text-cyan-300 font-mono">/</code> and <code className="text-cyan-300 font-mono">/*.html</code>. Complete the Cloudflare steps below so edge PoPs serve <code className="text-emerald-300 font-mono">cf-cache-status: HIT</code>.
                </p>
              </div>
            </div>

            {/* Copyable Cloudflare Cache Rule Expression */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-cyan-300">
                  Cloudflare Cache Rule Filter (Eligible for Cache)
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(cacheRuleExpression, 'cacheRule')}
                  className="text-xs text-cyan-300 hover:text-white flex items-center gap-1 font-mono transition-colors px-2 py-1 rounded bg-slate-900 border border-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
                >
                  {copiedId === 'cacheRule' ? <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" /> : <Copy className="w-3.5 h-3.5" aria-hidden="true" />}
                  <span>{copiedId === 'cacheRule' ? 'Copied' : 'Copy Filter'}</span>
                </button>
              </div>
              <pre className="text-[11px] font-mono text-slate-200 overflow-x-auto p-2 rounded bg-slate-900/90 border border-slate-800">
                {cacheRuleExpression}
              </pre>
              <p className="text-[11px] text-slate-300">
                In Cloudflare: <span className="text-white font-medium">Caching &gt; Cache Rules &gt; Create rule</span> &rarr; Cache eligibility: <span className="text-emerald-300 font-semibold">Eligible for cache</span> &rarr; Edge TTL: <span className="text-white">Use cache-control header if present</span>.
              </p>
            </div>

            {/* 4-Step Cache Hit Checklist */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200 font-mono tabular-nums">
                  Edge Cache Verification ({completedCacheCount}/4 Completed)
                </span>
                {completedCacheCount > 0 && (
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
                  onClick={() => toggleCacheChecklistItem('devModeOff')}
                  className={`p-3 rounded-xl border text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer ${
                    cacheChecklist.devModeOff ? 'bg-emerald-950/40 border-emerald-500/40' : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${cacheChecklist.devModeOff ? 'text-emerald-400' : 'text-slate-400'}`} aria-hidden="true" />
                    <div>
                      <div className="font-semibold text-slate-100">1. Turn Off Development Mode</div>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        In <span className="text-white">Caching &gt; Configuration</span>, confirm Development Mode is OFF and Caching Level is <span className="text-cyan-300">Standard</span>.
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => toggleCacheChecklistItem('respectHeaders')}
                  className={`p-3 rounded-xl border text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer ${
                    cacheChecklist.respectHeaders ? 'bg-emerald-950/40 border-emerald-500/40' : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${cacheChecklist.respectHeaders ? 'text-emerald-400' : 'text-slate-400'}`} aria-hidden="true" />
                    <div>
                      <div className="font-semibold text-slate-100">2. Respect Existing Headers</div>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        Set Browser Cache TTL to <span className="text-white">Respect Existing Headers</span> so our <code className="text-cyan-300 font-mono">_headers</code> rules apply.
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => toggleCacheChecklistItem('cacheRuleAdded')}
                  className={`p-3 rounded-xl border text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer ${
                    cacheChecklist.cacheRuleAdded ? 'bg-emerald-950/40 border-emerald-500/40' : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${cacheChecklist.cacheRuleAdded ? 'text-emerald-400' : 'text-slate-400'}`} aria-hidden="true" />
                    <div>
                      <div className="font-semibold text-slate-100">3. Enable Cache Everything Rule</div>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        Add the Cache Rule above &amp; delete any old Page Rules set to <span className="text-amber-300">Bypass Cache</span>.
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => toggleCacheChecklistItem('verifyHit')}
                  className={`p-3 rounded-xl border text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer ${
                    cacheChecklist.verifyHit ? 'bg-emerald-950/40 border-emerald-500/40' : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${cacheChecklist.verifyHit ? 'text-emerald-400' : 'text-slate-400'}`} aria-hidden="true" />
                    <div>
                      <div className="font-semibold text-slate-100">4. Verify cf-cache-status: HIT</div>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        Deploy latest build and inspect response headers on 2nd load for <code className="text-emerald-300 font-mono">cf-cache-status: HIT</code>.
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* PageSpeed Insights & 403 Root Cause Diagnosis */
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
                  Cloudflare&apos;s <strong className="text-white">&ldquo;Performing security verification&rdquo;</strong> challenge page intercepted Lighthouse and Googlebot with HTTP <code className="text-amber-300 font-mono">403</code>. Note that 403 challenge pages are never cached (causing 0 cache hits too!), inject <code className="text-amber-300 font-mono">noindex</code>, and add ~460 ms blocking time.
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
        )}

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
