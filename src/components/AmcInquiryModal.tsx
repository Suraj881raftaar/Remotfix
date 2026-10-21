import React, { useState } from 'react';
import { X, CheckCircle, Mail, Phone, Building2, User, Server, Cpu, Network, ShieldCheck, ArrowRight, Copy } from 'lucide-react';
import confetti from 'canvas-confetti';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRefId = `AMC-${Math.floor(100000 + Math.random() * 900000)}`;
    setReferenceId(newRefId);
    setIsSubmitted(true);

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    // Persist to local storage
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-slate-900/90 backdrop-blur-2xl border border-slate-700/70 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden z-10 my-8">
        {/* Subtle top specular highlight */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white font-display">
                Enterprise IT AMC Inquiry
              </h3>
              <p className="text-xs text-slate-400">
                Direct dispatch to <span className="text-cyan-400 font-mono">support@remotfix.in</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          /* Confirmation View */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h4 className="text-xl font-bold text-white font-display">
                Inquiry Successfully Logged
              </h4>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                Our infrastructure lead is reviewing your requirements. A custom SLA proposal is being prepared for your organization.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between max-w-md mx-auto">
              <div className="text-left">
                <div className="text-xs text-slate-400 font-mono">REFERENCE CODE</div>
                <div className="text-base font-bold text-cyan-400 font-mono tracking-wider">{referenceId}</div>
              </div>
              <button
                type="button"
                onClick={handleCopyRef}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                {copiedRef ? 'Copied!' : 'Copy Code'}
              </button>
            </div>

            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/30 text-xs text-slate-300 text-left space-y-1.5">
              <div className="flex items-center gap-2 text-cyan-300 font-medium">
                <Mail className="w-4 h-4" /> Dispatched to support@remotfix.in
              </div>
              <p>
                Our engineering team typically responds within <strong>15 to 30 minutes</strong> during business hours. You can also email us directly referencing code <strong>{referenceId}</strong>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleMailto}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium text-sm transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" /> Send Email via Mail Client
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm transition-colors border border-slate-700"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Form View */
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" /> Company / Organization *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Acme Technologies Pvt Ltd"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-400" /> Contact Person *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Rahul Sharma (IT Head / Ops)"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" /> Business Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="rahul@acme.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-cyan-400" /> Mobile / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 transition-colors"
                />
              </div>
            </div>

            {/* Infrastructure Scope Sliders */}
            <div className="pt-2 border-t border-slate-800/80 space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Scope of IT Infrastructure (AMC Coverage)
              </div>

              {/* Workstations */}
              <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-200 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyan-400" /> Workstations & Laptops
                  </span>
                  <span className="font-mono text-cyan-400 font-semibold">{workstations} Units</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="200"
                  step="5"
                  value={workstations}
                  onChange={(e) => setWorkstations(Number(e.target.value))}
                  className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>5 Units (Small Office)</span>
                  <span>100 Units</span>
                  <span>200+ Units (Enterprise)</span>
                </div>
              </div>

              {/* Network Racks */}
              <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-200 flex items-center gap-2">
                    <Network className="w-4 h-4 text-cyan-400" /> Network Racks & Managed Switches
                  </span>
                  <span className="font-mono text-cyan-400 font-semibold">{networkRacks} Racks</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="1"
                  value={networkRacks}
                  onChange={(e) => setNetworkRacks(Number(e.target.value))}
                  className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>1 Rack</span>
                  <span>5 Racks</span>
                  <span>15+ Racks</span>
                </div>
              </div>

              {/* Servers */}
              <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-200 flex items-center gap-2">
                    <Server className="w-4 h-4 text-cyan-400" /> Physical Servers & NAS Arrays
                  </span>
                  <span className="font-mono text-cyan-400 font-semibold">{servers} Nodes</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={servers}
                  onChange={(e) => setServers(Number(e.target.value))}
                  className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>0 (Cloud Only)</span>
                  <span>5 Nodes</span>
                  <span>20+ Nodes</span>
                </div>
              </div>
            </div>

            {/* Service Tier Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Preferred Service Level Agreement (SLA)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setServiceTier('standard')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    serviceTier === 'standard'
                      ? 'bg-cyan-500/10 border-cyan-500/60 shadow-sm'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-semibold text-white">Business Hours (8x5)</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    &lt; 2-Hour Response SLA · Preventative Monthly Checks
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setServiceTier('mission_critical')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    serviceTier === 'mission_critical'
                      ? 'bg-cyan-500/10 border-cyan-500/60 shadow-sm'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-semibold text-cyan-300 flex items-center justify-between">
                    <span>24/7 Mission-Critical</span>
                    <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-mono">
                      Popular
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    &lt; 30-Min Response SLA · Dedicated NOC Engineer
                  </div>
                </button>
              </div>
            </div>

            {/* Additional requirements */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Special Infrastructure Notes or Locations
              </label>
              <textarea
                rows={2}
                placeholder="E.g. 2 branch offices (Bengaluru & Mumbai), Fortinet firewall, weekly NAS cloud backup validation."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 transition-colors"
              />
            </div>

            {/* Primary Email Notice */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-400">
              <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                Proposal will be delivered to your inbox from <strong className="text-slate-200">support@remotfix.in</strong>.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-sm transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2"
              >
                <span>Submit AMC Proposal Request</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
