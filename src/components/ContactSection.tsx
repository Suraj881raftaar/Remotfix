import React, { useState } from 'react';
import { 
  Mail, 
  MessageSquare, 
  Clock, 
  Send, 
  CheckCircle2, 
  Phone, 
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import { SupportInquiry } from '../types';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [os, setOs] = useState('Windows 11 / 10');
  const [issueCategory, setIssueCategory] = useState('General Troubleshooting');
  const [urgency, setUrgency] = useState<'Standard' | 'Priority' | 'Emergency'>('Priority');
  const [description, setDescription] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<SupportInquiry | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !description) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const ticketNum = Math.floor(10000 + Math.random() * 90000);
      const inquiry: SupportInquiry = {
        id: `TICKET-${ticketNum}`,
        name,
        email,
        phone,
        os,
        issueCategory,
        urgency,
        description,
        timestamp: new Date().toISOString(),
        status: 'Received'
      };

      setSubmittedInquiry(inquiry);
      setIsSubmitting(false);
    }, 600);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEmail(key);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  return (
    <section id="contact" className="border-t border-white/10 bg-[#090A0F] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          
          {/* Left Column: Direct Contact Details & SLA */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Official Helpdesk & Inquiries · remotfix.in
              </div>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Get Direct Assistance from Our Technical Team.
              </h2>
              <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                Whether you need immediate computer troubleshooting or want to schedule a remote corporate fleet review, reach our certified specialists 24/7.
              </p>

              {/* Direct Channels */}
              <div className="mt-8 space-y-4">
                
                {/* Support Email */}
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-950/60 text-cyan-400">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block">Primary Support Email</span>
                      <a href="mailto:support@remotfix.in" className="text-sm font-semibold text-white hover:text-cyan-400">
                        support@remotfix.in
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy('support@remotfix.in', 'support')}
                    className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Copy Email"
                  >
                    {copiedEmail === 'support' ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>

                {/* Founder / Owner Email */}
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block">Founder & Owner Email</span>
                      <a href="mailto:suraj@remotfix.in" className="text-sm font-semibold text-white hover:text-amber-300 transition-colors">
                        suraj@remotfix.in
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy('suraj@remotfix.in', 'founder')}
                    className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Copy Founder Email"
                  >
                    {copiedEmail === 'founder' ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>


                {/* WhatsApp Support */}
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-950/60 text-emerald-400">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block">Instant Chat Support</span>
                      <a
                        href="https://wa.me/918881000000?text=Hi%20Remotfix%20Team%2C%20I%20need%20assistance%20with%20my%20computer%20via%20remotfix.in"
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-semibold text-emerald-400 hover:underline"
                      >
                        Launch WhatsApp Direct Chat →
                      </a>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* SLA Response Guarantee */}
            <div className="mt-8 rounded-xl border border-white/10 bg-black/40 p-4 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-white font-medium mb-1">
                <Clock className="h-4 w-4 text-cyan-400" />
                <span>Response Time Commitment: Under 15 Minutes</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                All submitted tickets and quote inquiries are automatically triaged by active senior network engineers.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Support Ticket Form */}
          <div className="lg:col-span-7">
            <div className="glass-panel rounded-2xl p-6 sm:p-8">
              
              {!submittedInquiry ? (
                <div>
                  <div className="border-b border-white/10 pb-4">
                    <h3 className="font-display text-xl font-bold text-white">
                      Submit Technical Issue or Quote Request
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Direct queue ticket generation on remotfix.in
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Alex Morgan"
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
                          placeholder="alex@company.com"
                          className="w-full rounded-lg border border-white/15 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Phone / WhatsApp (Optional)
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 (555) 019-2834"
                          className="w-full rounded-lg border border-white/15 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          System Environment
                        </label>
                        <select
                          value={os}
                          onChange={(e) => setOs(e.target.value)}
                          className="w-full rounded-lg border border-white/15 bg-black/60 px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
                        >
                          <option value="Windows 11 / 10">Windows 11 / 10</option>
                          <option value="macOS Sequoia / Sonoma">macOS Apple</option>
                          <option value="Linux Ubuntu / Debian">Linux Ubuntu / Debian</option>
                          <option value="Windows Server / Domain">Windows Server</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Urgency Level
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
                        Describe the Glitch or Symptoms *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="E.g., Laptop experiencing blue screen crashes with error code MEMORY_MANAGEMENT after Windows update, or suspect malware infection in Chrome..."
                        className="w-full rounded-lg border border-white/15 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 rounded-lg bg-white hover:bg-slate-200 py-3 text-xs font-bold text-black uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer shadow-lg"
                    >
                      <Send className="h-4 w-4" />
                      <span>{isSubmitting ? 'Routing Ticket to Support Engine...' : 'Submit Support Ticket / Request Quote'}</span>
                    </button>
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
                        Support Ticket Dispatched
                      </h3>
                      <p className="text-xs text-slate-400 font-mono">Reference: {submittedInquiry.id}</p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/50 p-5 text-xs text-slate-300 space-y-3 font-mono">
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-slate-500">Contact:</span>
                      <span className="text-white font-semibold">{submittedInquiry.name} ({submittedInquiry.email})</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-slate-500">Operating System:</span>
                      <span className="text-white">{submittedInquiry.os}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-slate-500">Urgency:</span>
                      <span className="text-cyan-400 uppercase">{submittedInquiry.urgency}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1">Issue Overview:</span>
                      <p className="text-slate-200 font-sans leading-relaxed bg-black/40 p-2.5 rounded border border-white/5">
                        {submittedInquiry.description}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg bg-emerald-950/30 border border-emerald-500/30 p-4 text-xs text-emerald-300 flex items-start gap-2.5">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>
                      Our technician has received your ticket details. An acknowledgment and remote session dispatch link have been simulated for <strong>{submittedInquiry.email}</strong>.
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setSubmittedInquiry(null);
                      setName('');
                      setEmail('');
                      setPhone('');
                      setDescription('');
                    }}
                    className="w-full text-center text-xs text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    Submit another inquiry
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
