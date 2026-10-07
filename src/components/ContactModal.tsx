import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, AlertCircle, Mail, Phone } from 'lucide-react';
import { DiagnosticIssue, SupportInquiry } from '../types';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledIssue?: DiagnosticIssue | null;
  prefilledOs?: string;
  prefilledCategory?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  prefilledIssue,
  prefilledOs,
  prefilledCategory
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [os, setOs] = useState('Windows 11 / 10');
  const [urgency, setUrgency] = useState<'Standard' | 'Priority' | 'Emergency'>('Priority');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<SupportInquiry | null>(null);

  useEffect(() => {
    if (prefilledIssue) {
      setDescription(`Requesting remote fix for: ${prefilledIssue.name}\nEstimated turnaround: ~${prefilledIssue.estimatedMinutes} mins.`);
    } else if (prefilledCategory) {
      setDescription(`Inquiring about ${prefilledCategory} support service.`);
    }

    if (prefilledOs) {
      if (prefilledOs === 'windows') setOs('Windows 11 / 10');
      else if (prefilledOs === 'macos') setOs('macOS Sequoia / Sonoma');
      else if (prefilledOs === 'linux') setOs('Linux Ubuntu / Debian');
      else if (prefilledOs === 'server') setOs('Windows / Linux Server');
    }
  }, [prefilledIssue, prefilledOs, prefilledCategory]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !description) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const ticketNum = Math.floor(10000 + Math.random() * 90000);
      const inquiry: SupportInquiry = {
        id: `RF-REQ-${ticketNum}`,
        name,
        email,
        phone,
        os,
        issueCategory: prefilledIssue?.name || prefilledCategory || 'Custom Diagnostic',
        urgency,
        description,
        timestamp: new Date().toISOString(),
        status: 'Received'
      };

      setSubmittedInquiry(inquiry);
      setIsSubmitting(false);
    }, 600);
  };

  const handleReset = () => {
    setSubmittedInquiry(null);
    setName('');
    setEmail('');
    setPhone('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl rounded-2xl border border-white/20 bg-[#0E111A] p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-lg p-2 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {!submittedInquiry ? (
          <div>
            <div className="border-b border-white/10 pb-4 pr-8">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Direct Helpdesk & Quote Request
              </span>
              <h3 className="font-display text-xl font-bold text-white mt-1">
                {prefilledIssue ? `Request Fix: ${prefilledIssue.name}` : 'Contact Remotfix Technical Support'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Support: <strong className="text-white">support@remotfix.in</strong> · Founder: <strong className="text-amber-300">suraj@remotfix.in</strong>
              </p>

            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jordan Smith"
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
                    placeholder="jordan@domain.com"
                    className="w-full rounded-lg border border-white/15 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 or +1 number"
                    className="w-full rounded-lg border border-white/15 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Operating System
                  </label>
                  <select
                    value={os}
                    onChange={(e) => setOs(e.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-black/60 px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="Windows 11 / 10">Windows 11 / 10</option>
                    <option value="macOS Sequoia / Sonoma">macOS Apple</option>
                    <option value="Linux Ubuntu / Debian">Linux OS</option>
                    <option value="Windows / Linux Server">Server</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Urgency
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as any)}
                    className="w-full rounded-lg border border-white/15 bg-black/60 px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="Standard">Standard (24h)</option>
                    <option value="Priority">Priority (Within 2h)</option>
                    <option value="Emergency">Emergency (Immediate)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Issue Description & Symptom Details *
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide any error codes, recent software changes, or system behavior..."
                  className="w-full rounded-lg border border-white/15 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 px-6 py-2.5 text-xs font-bold text-black uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer shadow-lg shadow-cyan-400/20"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{isSubmitting ? 'Dispatching Ticket...' : 'Send Request'}</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-white">
                  Request Dispatched to Remotfix Team
                </h3>
                <p className="text-xs text-slate-400 font-mono">Reference Ticket: {submittedInquiry.id}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Thank you, <strong>{submittedInquiry.name}</strong>. Our remote support desk has logged your request for <strong>{submittedInquiry.os}</strong> under priority <strong>{submittedInquiry.urgency}</strong>.
            </p>

            <div className="rounded-xl border border-white/10 bg-black/50 p-4 text-xs font-mono space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Contact Email:</span>
                <span className="text-white">{submittedInquiry.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Service Category:</span>
                <span className="text-cyan-400">{submittedInquiry.issueCategory}</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleReset}
                className="rounded-lg bg-white px-6 py-2.5 text-xs font-semibold text-black hover:bg-slate-200 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
