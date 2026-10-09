import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Copy, 
  Check, 
  Send, 
  Laptop, 
  Monitor, 
  Download, 
  AlertCircle, 
  RefreshCw, 
  Search, 
  ExternalLink, 
  ChevronRight, 
  UserCheck, 
  Zap, 
  Lock,
  Mail,
  Bell,
  Truck,
  MapPin,
  Building2,
  PhoneCall,
  Activity,
  Phone,
  MessageSquare
} from 'lucide-react';
import { Ticket, TicketStatus, RemoteTool, FieldDispatchStatus } from '../types';
import { ticketStore } from '../services/ticketStore';
import { EmailNotificationModal } from './EmailNotificationModal';

interface TicketTrackerProps {
  initialTicketId?: string;
  onBookNew: () => void;
  onSwitchToConsole: () => void;
}

export const TicketTracker: React.FC<TicketTrackerProps> = ({
  initialTicketId,
  onBookNew,
  onSwitchToConsole
}) => {
  const [tickets, setTickets] = useState<Ticket[]>(ticketStore.getAllTickets());
  const [selectedTicketId, setSelectedTicketId] = useState<string>(
    initialTicketId || (tickets.length > 0 ? tickets[0].id : '')
  );
  const [searchInput, setSearchInput] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeToolTab, setActiveToolTab] = useState<RemoteTool>('quick_assist');
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailModalDefaultTab, setEmailModalDefaultTab] = useState<'customer' | 'admin'>('customer');

  useEffect(() => {
    const unsubscribe = ticketStore.subscribe((updated) => {
      setTickets(updated);
      if (initialTicketId) {
        setSelectedTicketId(initialTicketId);
      } else if (!selectedTicketId && updated.length > 0) {
        setSelectedTicketId(updated[0].id);
      }
    });
    return unsubscribe;
  }, [initialTicketId]);

  const currentTicket = tickets.find(
    (t) => t.id.toLowerCase() === selectedTicketId.toLowerCase()
  );

  useEffect(() => {
    if (currentTicket) {
      setActiveToolTab(currentTicket.preferredTool);
    }
  }, [currentTicket?.id]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const found = tickets.find(
      (t) =>
        t.id.toLowerCase() === searchInput.trim().toLowerCase() ||
        t.customerEmail.toLowerCase() === searchInput.trim().toLowerCase()
    );
    if (found) {
      setSelectedTicketId(found.id);
      setSearchInput('');
    } else {
      alert(`No ticket found matching "${searchInput}". Please check your ticket reference.`);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !currentTicket) return;
    ticketStore.addMessage(currentTicket.id, 'customer', chatInput.trim());
    setChatInput('');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadReport = () => {
    if (!currentTicket) return;
    const isOnSite = currentTicket.serviceType === 'onsite_dispatch';
    const content = `=====================================================
REMOTFIX ${isOnSite ? 'ON-SITE FIELD ENGINEERING' : 'REMOTE DIAGNOSTIC'} SERVICE REPORT
Ticket Reference: ${currentTicket.id}
Regional Hub: ${currentTicket.regionalHubName || 'National NOC'}
Generated: ${new Date().toLocaleString()}
=====================================================

CLIENT INFORMATION:
- Name: ${currentTicket.customerName}
- Email: ${currentTicket.customerEmail}
- Phone: ${currentTicket.customerPhone || 'N/A'}
${isOnSite && currentTicket.siteAddress ? `- Site Address: ${currentTicket.siteAddress}` : ''}

ENVIRONMENT & FAULT SPECIFICATION:
- OS / Platform: ${currentTicket.os}
- Problem Category: ${currentTicket.category}
- Priority SLA: ${currentTicket.urgency}
${currentTicket.hardwareScope ? `- Hardware Scope: ${currentTicket.hardwareScope}` : ''}

ASSIGNED SPECIALIST:
- Lead Technician / Unit: ${currentTicket.assignedTechnician || 'Suraj Yadav (Lead Engineer)'}
${isOnSite && currentTicket.fieldUnit ? `- Mobile Van Code: ${currentTicket.fieldUnit.unitCode}` : ''}

RESOLUTION SUMMARY & ACTIONS TAKEN:
${currentTicket.resolutionSummary || 'Diagnostic and hardware verification completed cleanly.'}

TIMELINE LOGS:
${currentTicket.messages.map((m) => `[${new Date(m.timestamp).toLocaleTimeString()}] ${m.sender.toUpperCase()}: ${m.text}`).join('\n')}

Security Verification: All hardware changes tested & credentials securely disposed.
Support Escalation: support@remotfix.in · https://remotfix.in
=====================================================`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `remotfix-diagnostic-report-${currentTicket.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Stepper helper
  const getStepIndex = (status: TicketStatus) => {
    switch (status) {
      case 'received': return 1;
      case 'assigned': return 2;
      case 'connecting': return 3;
      case 'in_session': return 4;
      case 'resolved': return 5;
      case 'cancelled': return 0;
      default: return 1;
    }
  };

  const currentStep = currentTicket ? getStepIndex(currentTicket.status) : 1;
  const isOnSite = currentTicket?.serviceType === 'onsite_dispatch';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      
      {/* Top Banner & Search Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            <Zap className="h-3.5 w-3.5" />
            <span>Customer Live Tracking Portal · remotfix.in</span>
          </div>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-white">
            Real-Time Ticket & Dispatch Room
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="relative">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Ticket ID (e.g. RF-41820)"
                className="w-48 sm:w-56 rounded-l-lg border border-white/15 bg-black/60 pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="rounded-r-lg bg-white/10 hover:bg-white/20 border border-l-0 border-white/15 px-3 py-2 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              Track
            </button>
          </form>

          <button
            onClick={onBookNew}
            className="rounded-lg bg-cyan-400 hover:bg-cyan-300 px-4 py-2 text-xs font-bold text-black uppercase tracking-wider transition-colors cursor-pointer"
          >
            + Book New Fix
          </button>
          <button
            onClick={onSwitchToConsole}
            className="rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-2 text-xs font-semibold text-amber-300 transition-colors cursor-pointer"
          >
            Staff Console &rarr;
          </button>
        </div>
      </div>

      {/* Ticket Selection Bar (Quick Chips for Testing) */}
      <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/5 text-xs scrollbar-none">
        <span className="text-slate-400 font-semibold shrink-0">Recent Test Tickets:</span>
        {tickets.map((t) => {
          const isSelected = t.id === currentTicket?.id;
          const tIsOnSite = t.serviceType === 'onsite_dispatch';
          return (
            <button
              key={t.id}
              onClick={() => setSelectedTicketId(t.id)}
              className={`rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors cursor-pointer shrink-0 ${
                isSelected
                  ? 'border-cyan-400 bg-cyan-950/40 text-white font-bold'
                  : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              <span>{t.id}</span>
              <span className={`ml-1.5 text-[10px] uppercase ${tIsOnSite ? 'text-amber-400' : 'text-cyan-400'}`}>
                [{tIsOnSite ? 'Field' : 'Remote'}]
              </span>
              <span className="ml-1 text-[10px] text-slate-500 capitalize">({t.status.replace('_', ' ')})</span>
            </button>
          );
        })}
      </div>

      {!currentTicket ? (
        <div className="rounded-2xl border border-white/10 bg-black/40 p-12 text-center">
          <AlertCircle className="h-10 w-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No Ticket Selected</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Please search for an existing ticket reference above or book a new troubleshooting session.
          </p>
          <button
            onClick={onBookNew}
            className="mt-4 rounded-lg bg-white px-5 py-2 text-xs font-semibold text-black hover:bg-slate-200"
          >
            Create New Diagnostic Ticket
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          
          {/* Left Column: Progress Stepper, Ticket Metadata & Session / Field Room (col-span-8) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Header Ticket Information Card */}
            <div className="rounded-2xl border border-white/15 bg-black/60 p-6 sm:p-8 backdrop-blur-md">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
                    <span className="text-white font-bold text-base">{currentTicket.id}</span>
                    <span>·</span>
                    <span className={isOnSite ? 'text-amber-400 font-bold' : 'text-cyan-400 font-bold'}>
                      {isOnSite ? 'ON-SITE FIELD DISPATCH' : 'REMOTE SCREEN SHARE'}
                    </span>
                    <span>·</span>
                    <span className="text-slate-300">{currentTicket.regionalHubName || 'North Zone'}</span>
                  </div>
                  <h2 className="mt-1 font-display text-xl sm:text-2xl font-bold text-white">
                    {currentTicket.category}
                  </h2>
                  <p className="mt-1 text-xs text-slate-300">
                    {currentTicket.description}
                  </p>
                  {isOnSite && currentTicket.siteAddress && (
                    <div className="mt-2 text-xs text-amber-300 flex items-center gap-1.5 font-mono">
                      <MapPin className="h-3.5 w-3.5 text-amber-400" />
                      <span>{currentTicket.siteAddress} {currentTicket.pincode ? `(${currentTicket.pincode})` : ''}</span>
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block font-mono">Current Status</span>
                  <span
                    className={`inline-block font-mono text-xs font-bold uppercase px-3 py-1 rounded-full ${
                      currentTicket.status === 'resolved'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : currentTicket.status === 'in_session' || currentTicket.status === 'connecting'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {currentTicket.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Progress Stepper (5 States adapted for service type) */}
              <div className="mt-6 pt-2">
                <div className="grid grid-cols-5 gap-2 text-center text-xs">
                  {[
                    { num: 1, label: 'Logged', desc: 'Received at Hub' },
                    { num: 2, label: isOnSite ? 'Dispatched' : 'Assigned', desc: isOnSite ? 'Mobile Unit' : 'Technician' },
                    { num: 3, label: isOnSite ? 'En Route' : 'Handshake', desc: isOnSite ? 'Live ETA' : 'PIN Ready' },
                    { num: 4, label: isOnSite ? 'On-Site' : 'In Session', desc: isOnSite ? 'Hardware Triage' : 'Diagnostic' },
                    { num: 5, label: 'Resolved', desc: 'Signed Off' }
                  ].map((stepItem) => {
                    const isDone = currentStep >= stepItem.num;
                    const isCurrent = currentStep === stepItem.num;
                    return (
                      <div key={stepItem.num} className="flex flex-col items-center">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold transition-all ${
                            isDone
                              ? 'border-emerald-400 bg-emerald-950 text-emerald-400'
                              : isCurrent
                              ? 'border-cyan-400 bg-cyan-950 text-cyan-300 animate-pulse'
                              : 'border-white/10 bg-white/5 text-slate-600'
                          }`}
                        >
                          {isDone ? <Check className="h-4 w-4" /> : stepItem.num}
                        </div>
                        <span className={`mt-2 text-[11px] font-medium ${isDone || isCurrent ? 'text-white' : 'text-slate-600'}`}>
                          {stepItem.label}
                        </span>
                        <span className="text-[10px] text-slate-500 hidden sm:block font-mono">
                          {stepItem.desc}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Assigned Specialist & Email Review Quick Row */}
              <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg border font-bold ${
                    isOnSite ? 'bg-amber-950/60 border-amber-500/30 text-amber-400' : 'bg-cyan-950/60 border-cyan-500/30 text-cyan-400'
                  }`}>
                    {isOnSite ? <Truck className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">
                      {isOnSite ? 'Assigned Field Engineer & Unit' : 'Primary Certified Specialist'}
                    </span>
                    <strong className="text-white text-sm">
                      {currentTicket.assignedTechnician || 'Regional Dispatch Queue · Assigning Specialist'}
                    </strong>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      setEmailModalDefaultTab('customer');
                      setIsEmailModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 rounded-lg border border-cyan-400/40 bg-cyan-950/40 hover:bg-cyan-950/70 px-3 py-1.5 text-xs text-cyan-300 font-medium transition-colors cursor-pointer"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>View Dispatched Emails (2)</span>
                  </button>

                  <div className="text-right font-mono text-[11px] text-slate-400">
                    <span>Hotline: </span>
                    <a href="mailto:support@remotfix.in" className="text-amber-300 hover:underline">
                      support@remotfix.in
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* DUAL WORKSPACE: EITHER ON-SITE FIELD DISPATCH ROOM OR REMOTE HANDSHAKE ROOM */}
            {isOnSite ? (
              /* ON-SITE FIELD DISPATCH TRACKER */
              <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-950/20 via-black to-black p-6 sm:p-8 shadow-2xl space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
                      <Truck className="h-4 w-4" />
                      <span>Mobile Field Engineering Telemetry</span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-white mt-1">
                      On-Site Dispatch & Hardware Triage Room
                    </h3>
                  </div>

                  <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase">
                    Status: {currentTicket.fieldUnit?.status || 'Queued'}
                  </span>
                </div>

                {/* Mobile Unit Telemetry Card */}
                {currentTicket.fieldUnit ? (
                  <div className="rounded-xl border border-white/10 bg-slate-900/60 p-5 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Assigned Engineer</span>
                        <strong className="text-white text-base">{currentTicket.fieldUnit.engineerName}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Mobile Unit ID</span>
                        <strong className="text-cyan-400 text-base">{currentTicket.fieldUnit.unitCode}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Estimated Arrival</span>
                        <strong className="text-amber-300 text-base">{currentTicket.fieldUnit.eta}</strong>
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="text-slate-300">
                        <span className="text-slate-400 font-mono">Logistics: </span>
                        {currentTicket.fieldUnit.notes || 'Equipped with diagnostic hardware tools and component spares.'}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${currentTicket.fieldUnit.phone.replace(/[^0-9+]/g, '')}`}
                          className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-black hover:bg-slate-200"
                        >
                          <PhoneCall className="h-3.5 w-3.5" />
                          <span>Call Engineer</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-white/10 bg-black/40 p-6 text-center space-y-2">
                    <Clock className="h-6 w-6 text-amber-400 mx-auto animate-spin" />
                    <h4 className="text-sm font-semibold text-white">Assigning Nearest Mobile Unit</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Our regional dispatch coordinator is assigning a certified field engineer from {currentTicket.regionalHubName || 'the regional hub'}.
                    </p>
                  </div>
                )}

                {/* On-Site Gate Clearance Instructions */}
                <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-2 text-xs">
                  <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5 text-amber-400" />
                    <span>Facility Access & Security Protocol:</span>
                  </h4>
                  <ul className="list-disc pl-4 space-y-1 text-slate-300 text-[11px]">
                    <li>Ensure building security or gate desk has visitor clearance under <strong>Remotfix Engineering</strong>.</li>
                    <li>The technician carries government photo ID and certified ESD-safe anti-static equipment.</li>
                    <li>Power down non-essential equipment if rack-level electrical inspections are required.</li>
                  </ul>
                </div>

              </div>
            ) : (
              /* REMOTE SCREEN SHARE ROOM */
              <div className="rounded-2xl border border-white/20 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-6 sm:p-8 shadow-2xl">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                      <Lock className="h-3.5 w-3.5" />
                      <span>256-Bit Encrypted Remote Bridge</span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-white mt-1">
                      Remote Connection Room
                    </h3>
                  </div>

                  {/* Tool Switcher Tabs */}
                  <div className="flex items-center gap-1 rounded-lg bg-black/60 p-1 border border-white/10 text-xs">
                    <button
                      onClick={() => setActiveToolTab('quick_assist')}
                      className={`rounded-md px-3 py-1.5 font-medium transition-colors cursor-pointer ${
                        activeToolTab === 'quick_assist'
                          ? 'bg-cyan-400 text-black font-semibold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Quick Assist (Windows)
                    </button>
                    <button
                      onClick={() => setActiveToolTab('anydesk')}
                      className={`rounded-md px-3 py-1.5 font-medium transition-colors cursor-pointer ${
                        activeToolTab === 'anydesk'
                          ? 'bg-orange-400 text-black font-semibold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      AnyDesk (Mac/Linux/PC)
                    </button>
                  </div>
                </div>

                {/* QUICK ASSIST TAB CONTENT */}
                {activeToolTab === 'quick_assist' && (
                  <div className="mt-6 space-y-6">
                    {currentTicket.sessionCode ? (
                      <div className="rounded-xl border border-cyan-400/40 bg-cyan-950/20 p-6 text-center space-y-3">
                        <span className="text-xs uppercase tracking-wider text-cyan-400 font-semibold block">
                          Your 6-Digit Microsoft Quick Assist Code
                        </span>
                        <div className="inline-flex items-center gap-4 bg-black/80 px-6 py-3 rounded-2xl border border-cyan-400/60 shadow-xl">
                          <span className="font-mono text-3xl sm:text-4xl font-extrabold tracking-widest text-white">
                            {currentTicket.sessionCode}
                          </span>
                          <button
                            onClick={() => handleCopy(currentTicket.sessionCode!)}
                            className="rounded-lg bg-cyan-400 hover:bg-cyan-300 p-2 text-black transition-colors cursor-pointer"
                            title="Copy Code"
                          >
                            {copiedCode ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </button>
                        </div>
                        <p className="text-xs text-slate-300">
                          Code generated by technician. Valid for one-time live diagnostic session.
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-white/10 bg-black/40 p-6 text-center space-y-2">
                        <Clock className="h-6 w-6 text-amber-400 mx-auto animate-spin" />
                        <h4 className="text-sm font-semibold text-white">Awaiting 6-Digit PIN from Technician</h4>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto">
                          Your technician is reviewing minidump symptoms and will dispatch your single-use code shortly.
                        </p>
                      </div>
                    )}

                    {/* 3 Step Instruction Guide */}
                    <div className="rounded-xl bg-black/40 border border-white/10 p-5 space-y-3 text-xs">
                      <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
                        Quick Assist Connection Guide (Windows 10 / 11):
                      </h4>
                      <ol className="space-y-2 text-slate-300 list-decimal pl-4">
                        <li>
                          Press <kbd className="bg-white/15 px-1.5 py-0.5 rounded font-mono text-white">Win + Ctrl + Q</kbd> on your keyboard to instantly launch Microsoft Quick Assist.
                        </li>
                        <li>
                          In the <strong>Code from assistant</strong> box, enter the 6-digit code above.
                        </li>
                        <li>
                          Click <strong>Submit</strong> and click <strong>Allow</strong> when the screen share confirmation prompt appears.
                        </li>
                      </ol>
                    </div>
                  </div>
                )}

                {/* ANYDESK TAB CONTENT */}
                {activeToolTab === 'anydesk' && (
                  <div className="mt-6 space-y-6">
                    <div className="rounded-xl border border-orange-500/30 bg-orange-950/20 p-5 space-y-3">
                      <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                        <Laptop className="h-4 w-4 text-orange-400" />
                        <span>AnyDesk Remote Diagnostic Protocol</span>
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        For macOS, Linux, or custom Windows environments, AnyDesk provides high-frame-rate encrypted remote access.
                      </p>
                      <div className="bg-black/60 p-3 rounded-lg border border-white/10 flex items-center justify-between font-mono text-xs">
                        <div>
                          <span className="text-slate-500 block text-[10px]">Session Relay Address</span>
                          <span className="text-orange-300 font-bold">
                            {currentTicket.sessionCode || 'remotfix-support-9192'}
                          </span>
                        </div>
                        <span className="rounded bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 border border-emerald-500/30">
                          TLS 1.3 Active
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Post-Session Resolution Summary Box (If Resolved) */}
            {currentTicket.status === 'resolved' && (
              <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Technical Resolution Complete</span>
                  </div>
                  <button
                    onClick={handleDownloadReport}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 px-3 py-1.5 text-xs font-bold text-black uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download Report (.txt)</span>
                  </button>
                </div>
                <div className="rounded-xl bg-black/60 border border-white/10 p-4 text-xs text-slate-200 font-mono leading-relaxed">
                  {currentTicket.resolutionSummary}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Live Bilateral Chat with Technician / Dispatcher (col-span-4) */}
          <div className="lg:col-span-4">
            <div className="rounded-2xl border border-white/15 bg-black/70 p-5 shadow-2xl flex flex-col h-[560px]">
              <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-sm font-bold text-white flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-cyan-400" />
                    <span>Bilateral Live Chat</span>
                  </h3>
                  <span className="text-[11px] text-slate-400">Direct link to operations desk</span>
                </div>
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1 text-xs">
                {currentTicket.messages.map((msg) => {
                  const isCust = msg.sender === 'customer';
                  const isSys = msg.sender === 'system';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        isSys ? 'items-center text-center' : isCust ? 'items-end' : 'items-start'
                      }`}
                    >
                      {isSys ? (
                        <div className="rounded-md bg-white/5 border border-white/5 px-2.5 py-1 text-[10px] text-slate-400 font-mono my-1">
                          {msg.text}
                        </div>
                      ) : (
                        <div
                          className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                            isCust
                              ? 'bg-cyan-500/20 border border-cyan-400/40 text-cyan-100 rounded-br-none'
                              : 'bg-white/10 border border-white/10 text-slate-200 rounded-bl-none'
                          }`}
                        >
                          <div className="text-[10px] font-mono text-slate-400 mb-0.5">
                            {isCust ? 'You (Customer)' : currentTicket.assignedTechnician || 'Operations Engineer'}
                          </div>
                          <div>{msg.text}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="border-t border-white/10 pt-3 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type message to engineer..."
                  className="flex-1 rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-cyan-400 hover:bg-cyan-300 p-2 text-black transition-colors cursor-pointer"
                  title="Send Message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>

        </div>
      )}

      {/* Email Notification Modal */}
      {isEmailModalOpen && currentTicket && (
        <EmailNotificationModal
          ticket={currentTicket}
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          defaultTab={emailModalDefaultTab}
        />
      )}

    </div>
  );
};
