import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  KeyRound, 
  Send, 
  RotateCcw, 
  ExternalLink,
  Laptop,
  Monitor,
  AlertTriangle,
  FileCheck,
  ArrowRight,
  X,
  PlusCircle,
  Copy,
  Check,
  Mail,
  Bell
} from 'lucide-react';
import { Ticket, TicketStatus, RemoteTool } from '../types';
import { ticketStore } from '../services/ticketStore';
import { EmailNotificationModal } from './EmailNotificationModal';

interface TechnicianConsoleProps {
  onOpenCustomerTracker: (ticketId: string) => void;
  onBackToHome: () => void;
}

export const TechnicianConsole: React.FC<TechnicianConsoleProps> = ({
  onOpenCustomerTracker,
  onBackToHome
}) => {
  const [tickets, setTickets] = useState<Ticket[]>(ticketStore.getAllTickets());
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(
    tickets.length > 0 ? tickets[0].id : null
  );
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [techMessage, setTechMessage] = useState('');
  const [customPin, setCustomPin] = useState('');
  const [resolutionNote, setResolutionNote] = useState('');
  const [copiedId, setCopiedId] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = ticketStore.subscribe((updated) => {
      setTickets(updated);
      if (!selectedTicketId && updated.length > 0) {
        setSelectedTicketId(updated[0].id);
      }
    });
    return unsubscribe;
  }, []);

  const activeTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0] || null;

  // Filter logic
  const filteredTickets = tickets.filter((t) => {
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    const matchesSearch =
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Metrics
  const totalTickets = tickets.length;
  const inTriageCount = tickets.filter((t) => t.status === 'received' || t.status === 'assigned').length;
  const inSessionCount = tickets.filter((t) => t.status === 'connecting' || t.status === 'in_session').length;
  const resolvedCount = tickets.filter((t) => t.status === 'resolved').length;

  const handleGeneratePin = () => {
    if (!activeTicket) return;
    const pin = `${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)}`;
    ticketStore.setSessionCode(activeTicket.id, 'quick_assist', pin);
  };

  const handleSetAnydesk = () => {
    if (!activeTicket) return;
    const anydeskId = `RF-ANY-${Math.floor(1000 + Math.random() * 9000)}`;
    ticketStore.setSessionCode(activeTicket.id, 'anydesk', anydeskId);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!techMessage.trim() || !activeTicket) return;
    ticketStore.addMessage(activeTicket.id, 'technician', techMessage.trim());
    setTechMessage('');
  };

  const handleMarkResolved = () => {
    if (!activeTicket) return;
    const note =
      resolutionNote.trim() ||
      `Diagnostic remediation completed successfully. Root cause resolved on ${activeTicket.os}. SFC and registry scans verified clean with zero residual anomalies.`;
    ticketStore.updateStatus(activeTicket.id, 'resolved', note);
    setResolutionNote('');
  };

  const handleResetDemos = () => {
    if (confirm('Reset all tickets back to default test dataset?')) {
      ticketStore.resetDemoData();
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <ShieldCheck className="h-4 w-4" />
            <span>Remotfix Operations Console · Staff Desk</span>
          </div>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-white">
            Technician Diagnostic Queue & Control
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleResetDemos}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 text-xs text-slate-300 transition-colors cursor-pointer"
            title="Reset to default seed tickets"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Demo Data</span>
          </button>
          <button
            onClick={onBackToHome}
            className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            &larr; Back to Landing
          </button>
        </div>
      </div>

      {/* Operations Metrics Bar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-8">
        <div className="rounded-xl border border-white/10 bg-black/40 p-4">
          <span className="text-xs text-slate-400 block">Total Active Queue</span>
          <span className="font-mono text-2xl font-bold text-white tabular-nums">{totalTickets}</span>
        </div>
        <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-4">
          <span className="text-xs text-amber-300 block">In Triage / Awaiting Tech</span>
          <span className="font-mono text-2xl font-bold text-amber-400 tabular-nums">{inTriageCount}</span>
        </div>
        <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-4">
          <span className="text-xs text-cyan-300 block">Live Remote Sessions</span>
          <span className="font-mono text-2xl font-bold text-cyan-400 tabular-nums">{inSessionCount}</span>
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-4">
          <span className="text-xs text-emerald-300 block">Resolved Today</span>
          <span className="font-mono text-2xl font-bold text-emerald-400 tabular-nums">{resolvedCount}</span>
        </div>
      </div>

      {/* Main Grid: Ticket Table (Left) + Selected Ticket Action Hub (Right) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        
        {/* Left Column: Filterable Ticket Queue Table */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto text-xs">
              {[
                { id: 'all', label: 'All' },
                { id: 'received', label: 'New' },
                { id: 'connecting', label: 'Handshake' },
                { id: 'in_session', label: 'In Session' },
                { id: 'resolved', label: 'Resolved' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterStatus(tab.id)}
                  className={`rounded-lg px-2.5 py-1.5 font-medium transition-colors cursor-pointer shrink-0 ${
                    filterStatus === tab.id
                      ? 'bg-white text-black font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ticket or name..."
                className="w-44 sm:w-52 rounded-lg border border-white/10 bg-black/60 pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Ticket Queue List */}
          <div className="space-y-2.5">
            {filteredTickets.map((ticket) => {
              const isSelected = activeTicket?.id === ticket.id;
              return (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={`rounded-xl border p-4 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-950/20 shadow-lg shadow-cyan-950/40'
                      : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="font-bold text-white">{ticket.id}</span>
                        <span className="text-slate-500">·</span>
                        <span className="text-slate-300 font-sans font-semibold">{ticket.customerName}</span>
                        <span className="text-slate-500">·</span>
                        <span className="text-slate-400 text-[11px]">{ticket.os}</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-medium text-slate-200 mt-1 line-clamp-1">
                        {ticket.category}: {ticket.description}
                      </h4>
                    </div>

                    <div className="text-right shrink-0 font-mono">
                      <span
                        className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          ticket.status === 'resolved'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : ticket.status === 'in_session' || ticket.status === 'connecting'
                            ? 'bg-cyan-500/20 text-cyan-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {ticket.status.replace('_', ' ')}
                      </span>
                      <span className="block text-[10px] text-slate-500 mt-1 uppercase font-semibold">
                        {ticket.urgency}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredTickets.length === 0 && (
              <div className="rounded-xl border border-white/10 bg-black/40 p-8 text-center text-xs text-slate-400">
                No tickets match the selected filter.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Selected Ticket Action Drawer */}
        <div className="lg:col-span-5">
          {activeTicket ? (
            <div className="sticky top-24 rounded-2xl border border-white/20 bg-black/70 p-6 backdrop-blur-md space-y-6">
              
              {/* Card Header */}
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-base font-bold text-white">{activeTicket.id}</span>
                    <button
                      onClick={() => onOpenCustomerTracker(activeTicket.id)}
                      className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:underline cursor-pointer"
                    >
                      <span>View as Customer</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => setIsEmailModalOpen(true)}
                      className="inline-flex items-center gap-1 text-[11px] text-amber-300 hover:underline cursor-pointer ml-1"
                    >
                      <Bell className="h-3 w-3 text-amber-400" />
                      <span>Inbound Alert (support@remotfix.in)</span>
                    </button>
                  </div>
                  <h3 className="font-display text-lg font-bold text-white mt-1">
                    {activeTicket.customerName}
                  </h3>
                  <p className="text-xs text-slate-400">{activeTicket.customerEmail}</p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Assigned To</span>
                  <span className="text-xs font-semibold text-amber-300">
                    {activeTicket.assignedTechnician || 'Unassigned'}
                  </span>
                </div>
              </div>

              {/* Problem Description */}
              <div className="rounded-xl bg-white/5 border border-white/10 p-3.5 text-xs text-slate-300 space-y-1">
                <span className="text-slate-500 block text-[10px] font-mono uppercase">Reported Symptom</span>
                <p className="font-medium text-white">{activeTicket.category}</p>
                <p className="text-slate-400 leading-relaxed text-[11px]">{activeTicket.description}</p>
              </div>

              {/* Technician Primary Action Gates */}
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
                  Technician Action Gates:
                </span>

                {/* Assign to Suraj */}
                {!activeTicket.assignedTechnician && (
                  <button
                    onClick={() => ticketStore.assignTechnician(activeTicket.id, 'Suraj (Founder & Lead Engineer)')}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-amber-400 hover:bg-amber-300 py-2.5 text-xs font-bold text-black uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <UserCheck className="h-4 w-4" />
                    <span>Assign Ticket to Suraj (Lead Tech)</span>
                  </button>
                )}

                {/* Session Code Dispatchers */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleGeneratePin}
                    className="flex flex-col items-center justify-center rounded-lg border border-cyan-400/40 bg-cyan-950/30 hover:bg-cyan-950/60 p-3 text-center transition-colors cursor-pointer"
                  >
                    <KeyRound className="h-4 w-4 text-cyan-400 mb-1" />
                    <span className="text-xs font-bold text-white">Generate Quick Assist PIN</span>
                    <span className="text-[10px] text-cyan-300 font-mono">6-Digit Code</span>
                  </button>

                  <button
                    onClick={handleSetAnydesk}
                    className="flex flex-col items-center justify-center rounded-lg border border-orange-500/40 bg-orange-950/30 hover:bg-orange-950/60 p-3 text-center transition-colors cursor-pointer"
                  >
                    <Laptop className="h-4 w-4 text-orange-400 mb-1" />
                    <span className="text-xs font-bold text-white">Dispatch AnyDesk Room</span>
                    <span className="text-[10px] text-orange-300 font-mono">Cross-Platform</span>
                  </button>
                </div>

                {/* Current Dispatched Session Code Display */}
                {activeTicket.sessionCode && (
                  <div className="rounded-xl border border-cyan-400/30 bg-black/60 p-3 font-mono text-xs flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Active Session PIN</span>
                      <span className="text-base font-bold text-cyan-400">{activeTicket.sessionCode}</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                      Dispatched to Customer Room
                    </span>
                  </div>
                )}

                {/* State Machine Transitions */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => ticketStore.updateStatus(activeTicket.id, 'in_session')}
                    className="rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 py-2 text-xs font-semibold text-white transition-colors cursor-pointer"
                  >
                    Mark "Session Active"
                  </button>
                  <button
                    onClick={() => ticketStore.updateStatus(activeTicket.id, 'connecting')}
                    className="rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 py-2 text-xs font-semibold text-white transition-colors cursor-pointer"
                  >
                    Mark "Connecting"
                  </button>
                </div>
              </div>

              {/* Complete & Resolve Form */}
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/10 p-4 space-y-2.5">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide block">
                  Conclude & Resolve Ticket
                </span>
                <textarea
                  rows={2}
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Optional technical notes: e.g. Fixed crash dump; cleaned startup tasks; SFC scan verified clean..."
                  className="w-full rounded-lg border border-white/15 bg-black/60 p-2 text-xs text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
                />
                <button
                  onClick={handleMarkResolved}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-400 hover:bg-emerald-300 py-2 text-xs font-bold text-black uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Mark Ticket as Resolved</span>
                </button>
              </div>

              {/* Send Quick Note to Customer */}
              <form onSubmit={handleSendMessage} className="pt-2 border-t border-white/10 space-y-2">
                <label className="text-xs text-slate-400 block">Dispatch Message to Customer Screen</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={techMessage}
                    onChange={(e) => setTechMessage(e.target.value)}
                    placeholder="E.g. Please approve the prompt on your screen now..."
                    className="flex-1 rounded-lg border border-white/15 bg-black px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!techMessage.trim()}
                    className="rounded-lg bg-white hover:bg-slate-200 px-3 py-2 text-black transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>

            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-black/40 p-8 text-center text-xs text-slate-400">
              Select a ticket to manage
            </div>
          )}
        </div>

      </div>

      {/* Admin Email Notification Inspector Modal */}
      {activeTicket && (
        <EmailNotificationModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          ticket={activeTicket}
          defaultTab="admin"
        />
      )}

    </div>
  );
};
