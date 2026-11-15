import React, { useState } from 'react';
import { X, CheckCircle, Mail, Phone, Building2, User, Server, Cpu, Network, ArrowRight, Copy } from 'lucide-react';

interface AmcInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AmcInquiryModal: React.FC<AmcInquiryModalProps> = ({ isOpen, onClose }) => {
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [workstations, setWorkstations] = useState(25);
  const [networkRacks, setNetworkRacks] = useState(2);
  const [servers, setServers] = useState(3);
  const [serviceTier, setServiceTier] = useState<'standard' | 'mission_critical'>('mission_critical');
  const [additionalNotes, setAdditionalNotes] = useState('');
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [copiedRef, setCopiedRef] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newRefId = `AMC-${Math.floor(100000 + Math.random() * 900000)}`;
    setReferenceId(newRefId);
    setIsSubmitted(true);

    try {
      const confettiModule = await import('canvas-confetti');
      confettiModule.default({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore confetti load error
    }

    const inquiries = JSON.parse(localStorage.getItem('remotfix_amc_inquiries') || '[]');
    inquiries.push({
      refId: newRefId,
      companyName,
      contactName,
      email,
      phone,
      workstations,
      networkRacks,
      servers,
      serviceTier,
      additionalNotes,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('remotfix_amc_inquiries', JSON.stringify(inquiries));
  };

  const handleCopyRef = () => {
    navigator.clipboard.writeText(referenceId);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleMailto = () => {
    const subject = encodeURIComponent(`AMC Inquiry [${referenceId || 'New'}]: ${companyName || 'Corporate Inquiry'}`);
    const body = encodeURIComponent(
      `Hello Remotfix Support Team,\n\nI would like to request an AMC proposal for our company:\n\nCompany: ${companyName}\nContact: ${contactName}\nEmail: ${email}\nPhone: ${phone}\n\nInfrastructure Scope:\n- Workstations: ${workstations}\n- Network Racks: ${networkRacks}\n- Servers / Storage: ${servers}\n- Service Tier: ${serviceTier === 'mission_critical' ? '24/7 Mission-Critical (< 30m SLA)' : 'Standard Business 8x5 (< 2h SLA)'}\n\nNotes: ${additionalNotes || 'N/A'}\n\nReference ID: ${referenceId || 'AMC-PRE'}\n\nThank you!`
    );
    window.location.href = `mailto:support@remotfix.in?subject=${subject}&body=${body}`;
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="amc-modal-title"
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-slate-900/95 backdrop-blur-2xl border border-slate-700/70 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden z-10 my-8">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="h-11 px-2.5 py-1 rounded-xl bg-white/95 border border-white/30 flex items-center justify-center shrink-0 shadow-md">
              <img 
                src="/assets/aistudio/1791411926566_992a226a.png" 
                alt="Remotfix Logo" 
                width={100}
                height={32}
                className="h-8 w-auto object-contain"
              />
            </div>
            <div>
              <h2 id="amc-modal-title" className="text-base sm:text-lg font-semibold text-white font-display">
                Enterprise IT AMC Inquiry
              </h2>
              <p className="text-xs text-slate-300">
                <span className="text-cyan-400 font-semibold font-mono">Remote IT Solutions &amp; Support</span> · <span className="font-mono text-slate-300">support@remotfix.in</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close AMC inquiry dialog"
            className="min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" aria-hidden="true" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white font-display">
                Inquiry Successfully Logged
              </h3>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                Our infrastructure lead is reviewing your requirements. A custom SLA proposal is being prepared for your organization.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between max-w-md mx-auto">
              <div className="text-left">
                <div className="text-xs text-slate-400 font-mono">Reference Code</div>
                <div className="text-base font-bold text-cyan-400 font-mono tracking-wider">{referenceId}</div>
              </div>
              <button
                type="button"
                onClick={handleCopyRef}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{copiedRef ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/30 text-xs text-slate-300 text-left space-y-1.5">
              <div className="flex items-center gap-2 text-cyan-300 font-medium">
                <Mail className="w-4 h-4" aria-hidden="true" /> Dispatched to support@remotfix.in
              </div>
              <p>
                Our engineering team typically responds within <strong className="text-white">15 to 30 minutes</strong> during business hours. You can also email us directly referencing code <strong className="text-white">{referenceId}</strong>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleMailto}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition-colors shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 cursor-pointer"
              >
                <Mail className="w-4 h-4" aria-hidden="true" /> Send Email via Mail Client
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm transition-colors border border-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="amc-company" className="block text-xs font-medium text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" /> Company / Organization *
                </label>
                <input
                  id="amc-company"
                  type="text"
                  required
                  placeholder="Acme Technologies Pvt Ltd"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus:border-cyan-500/60 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="amc-contact" className="block text-xs font-medium text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" /> Contact Person *
                </label>
                <input
                  id="amc-contact"
                  type="text"
                  required
                  placeholder="Rahul Sharma (IT Head / Ops)"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus:border-cyan-500/60 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="amc-email" className="block text-xs font-medium text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" /> Business Email *
                </label>
                <input
                  id="amc-email"
                  type="email"
                  required
                  placeholder="rahul@acme.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus:border-cyan-500/60 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="amc-phone" className="block text-xs font-medium text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" /> Mobile / WhatsApp *
                </label>
                <input
                  id="amc-phone"
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus:border-cyan-500/60 transition-colors"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 space-y-4">
              <div className="text-xs font-semibold text-slate-300">
                Scope of IT Infrastructure (AMC Coverage)
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="amc-workstations" className="font-medium text-slate-200 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyan-400" aria-hidden="true" /> Workstations &amp; Laptops
                  </label>
                  <span className="font-mono tabular-nums text-cyan-400 font-semibold">{workstations} Units</span>
                </div>
                <input
                  id="amc-workstations"
                  type="range"
                  min="5"
                  max="200"
                  step="5"
                  value={workstations}
                  onChange={(e) => setWorkstations(Number(e.target.value))}
                  className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-mono tabular-nums">
                  <span>5 Units</span>
                  <span>100 Units</span>
                  <span>200+ Units</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="amc-racks" className="font-medium text-slate-200 flex items-center gap-2">
                    <Network className="w-4 h-4 text-cyan-400" aria-hidden="true" /> Network Racks &amp; Managed Switches
                  </label>
                  <span className="font-mono tabular-nums text-cyan-400 font-semibold">{networkRacks} Racks</span>
                </div>
                <input
                  id="amc-racks"
                  type="range"
                  min="1"
                  max="15"
                  step="1"
                  value={networkRacks}
                  onChange={(e) => setNetworkRacks(Number(e.target.value))}
                  className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-mono tabular-nums">
                  <span>1 Rack</span>
                  <span>5 Racks</span>
                  <span>15+ Racks</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="amc-servers" className="font-medium text-slate-200 flex items-center gap-2">
                    <Server className="w-4 h-4 text-cyan-400" aria-hidden="true" /> Physical Servers &amp; NAS Arrays
                  </label>
                  <span className="font-mono tabular-nums text-cyan-400 font-semibold">{servers} Nodes</span>
                </div>
                <input
                  id="amc-servers"
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={servers}
                  onChange={(e) => setServers(Number(e.target.value))}
                  className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-mono tabular-nums">
                  <span>0 (Cloud Only)</span>
                  <span>5 Nodes</span>
                  <span>20+ Nodes</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-300">
                Preferred Service Level Agreement (SLA)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setServiceTier('standard')}
                  className={`p-3 rounded-xl border text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer ${
                    serviceTier === 'standard'
                      ? 'bg-cyan-500/10 border-cyan-500/60 shadow-sm'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-semibold text-white">Business Hours (8x5)</div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    &lt; 2-Hour Response SLA · Monthly Checks
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setServiceTier('mission_critical')}
                  className={`p-3 rounded-xl border text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer ${
                    serviceTier === 'mission_critical'
                      ? 'bg-cyan-500/10 border-cyan-500/60 shadow-sm'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-semibold text-cyan-300 flex items-center justify-between">
                    <span>24/7 Mission-Critical</span>
                    <span className="text-[11px] font-mono text-cyan-300">Popular</span>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    &lt; 30-Min Response SLA · Dedicated NOC
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="amc-notes" className="block text-xs font-medium text-slate-200 mb-1.5">
                Special Infrastructure Notes or Locations
              </label>
              <textarea
                id="amc-notes"
                rows={2}
                placeholder="E.g. 2 branch offices (Bengaluru & Mumbai), Fortinet firewall, weekly NAS cloud backup validation."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus:border-cyan-500/60 transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300">
              <Mail className="w-4 h-4 text-cyan-400 shrink-0" aria-hidden="true" />
              <span>
                Proposal will be delivered to your inbox from <strong className="text-white">support@remotfix.in</strong>.
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 text-slate-200 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition-colors shadow-lg shadow-cyan-500/20 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 cursor-pointer"
              >
                <span>Submit AMC Proposal Request</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
