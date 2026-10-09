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
  Bell,
  Truck,
  MapPin,
  Building2,
  PhoneCall,
  Activity
} from 'lucide-react';
import { Ticket, TicketStatus, RemoteTool, ServiceType, RegionalZoneId, FieldDispatchStatus } from '../types';
import { ticketStore } from '../services/ticketStore';
import { EmailNotificationModal } from './EmailNotificationModal';
import { REGIONAL_HUBS } from '../data/regionalHubsData';

interface TechnicianConsoleProps {
  onOpenCustomerTracker: (ticketId: string) => void;
  onBackToHome: () => void;
}

const FIELD_ENGINEERS = [
  { name: 'Amit Sharma', phone: '+91 98104 77219', unitCode: 'MOBILE-UNIT-NORTH-04', zone: 'north' },
  { name: 'Suraj Yadav', phone: '+91 98110 32910', unitCode: 'LEAD-DISPATCH-01', zone: 'north' },
  { name: 'Priya Nair', phone: '+91 98455 33021', unitCode: 'MOBILE-UNIT-SOUTH-02', zone: 'south_blr' },
  { name: 'Karan Singhania', phone: '+91 98201 44520', unitCode: 'MOBILE-UNIT-WEST-01', zone: 'west' },
  { name: 'Debasish Roy', phone: '+91 98300 81290', unitCode: 'MOBILE-UNIT-EAST-01', zone: 'east' }
];

export const TechnicianConsole: React.FC<TechnicianConsoleProps> = ({
  onOpenCustomerTracker,
  onBackToHome
}) => {
  const [tickets, setTickets] = useState<Ticket[]>(ticketStore.getAllTickets());
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(
    tickets.length > 0 ? tickets[0].id : null
  );
  const [filterZone, setFilterZone] = useState<string>('all');
  const [filterServiceType, setFilterServiceType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [techMessage, setTechMessage] = useState('');
  const [customPin, setCustomPin] = useState('');
  const [resolutionNote, setResolutionNote] = useState('');
  const [copiedId, setCopiedId] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // Field unit dispatching state
  const [selectedEngineerIndex, setSelectedEngineerIndex] = useState(0);
  const [dispatchEta, setDispatchEta] = useState('45 mins');
  const [dispatchNotes, setDispatchNotes] = useState('');

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
    const matchesZone = filterZone === 'all' || t.regionalZone === filterZone;
    const matchesService = filterServiceType === 'all' || (t.serviceType || 'remote') === filterServiceType;
    const matchesSearch =
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.siteAddress && t.siteAddress.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesZone && matchesService && matchesSearch;
  });

  // Metrics
  const totalTickets = tickets.length;
  const onSiteDispatches = tickets.filter((t) => t.serviceType === 'onsite_dispatch').length;
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

  const handleDispatchFieldEngineer = () => {
    if (!activeTicket) return;
    const eng = FIELD_ENGINEERS[selectedEngineerIndex];
    ticketStore.dispatchFieldUnit(
      activeTicket.id,
      eng.name,
      eng.phone,
      eng.unitCode,
      dispatchEta,
      dispatchNotes || 'Dispatched with hardware replacement spares.'
    );
  };

  const handleUpdateFieldStatus = (status: FieldDispatchStatus, eta?: string) => {
    if (!activeTicket) return;
    ticketStore.updateFieldStatus(activeTicket.id, status, eta);
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
      (activeTicket.serviceType === 'onsite_dispatch'
        ? 'Field engineer completed physical inspection, hardware replacement, and customer sign-off.'
        : 'Symptom analyzed, system integrity verified clean via DISM/SFC, and secure connection credentials destroyed.');
    ticketStore.updateStatus(activeTicket.id, 'resolved', note);
    setResolutionNote('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      
      {/* Top Operations Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <ShieldCheck className="h-4 w-4" />
            <span>Regional IT NOC & Field Operations Console · remotfix.in</span>
          </div>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-white">
            Technician & Regional Dispatch Center
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => ticketStore.resetDemoData()}
            className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 px-3 py-2 text-xs text-slate-300 transition-colors cursor-pointer"
            title="Reset tickets with realistic regional test scenarios"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Demo Data</span>
          </button>

          {activeTicket && (
            <button
              onClick={() => onOpenCustomerTracker(activeTicket.id)}
              className="flex items-center gap-1.5 rounded-lg border border-cyan-400/40 bg-cyan-950/40 hover:bg-cyan-950/70 px-3.5 py-2 text-xs text-cyan-300 font-semibold transition-colors cursor-pointer"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Customer Room View</span>
            </button>
          )}

          <button
            onClick={onBackToHome}
            className="rounded-lg bg-white px-4 py-2 text-xs font-bold text-black uppercase tracking-wider hover:bg-slate-200 transition-colors cursor-pointer"
          >
            &larr; Exit Console
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 mb-8">
        <div className="rounded-xl border border-white/10 bg-black/40 p-4">
          <span className="text-[11px] font-mono uppercase text-slate-400">Total Tickets</span>
          <div className="mt-1 font-mono text-2xl font-bold text-white">{totalTickets}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/40 p-4">
          <span className="text-[11px] font-mono uppercase text-slate-400">On-Site Dispatches</span>
          <div className="mt-1 font-mono text-2xl font-bold text-amber-300">{onSiteDispatches}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/40 p-4">
          <span className="text-[11px] font-mono uppercase text-slate-400">Awaiting Triage</span>
          <div className="mt-1 font-mono text-2xl font-bold text-amber-400">{inTriageCount}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/40 p-4">
          <span className="text-[11px] font-mono uppercase text-slate-400">Active Sessions</span>
          <div className="mt-1 font-mono text-2xl font-bold text-cyan-400">{inSessionCount}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/40 p-4 col-span-2 sm:col-span-1">
          <span className="text-[11px] font-mono uppercase text-slate-400">Resolved Today</span>
          <div className="mt-1 font-mono text-2xl font-bold text-emerald-400">{resolvedCount}</div>
        </div>
      </div>

      {/* Multi-Dimensional Filter Bar */}
      <div className="mb-6 space-y-3 rounded-2xl border border-white/10 bg-black/60 p-4">
        
        {/* Row 1: Search and Zone Filter */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="h-4 w-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by ticket #, client, address, symptom..."
              className="w-full rounded-lg border border-white/15 bg-slate-900/80 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
            />
          </div>

          {/* Regional Zone Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-slate-400 text-[11px] font-mono uppercase mr-1">Zone:</span>
            {[
              { id: 'all', label: 'All' },
              { id: 'north', label: 'North (Delhi)' },
              { id: 'west', label: 'West (Mumbai)' },
              { id: 'south_blr', label: 'South (BLR)' },
              { id: 'east', label: 'East (Kolkata)' }
            ].map((z) => (
              <button
                key={z.id}
                onClick={() => setFilterZone(z.id)}
                className={`rounded-lg px-2.5 py-1 font-mono text-[11px] cursor-pointer whitespace-nowrap transition-colors ${
                  filterZone === z.id
                    ? 'bg-amber-400 text-black font-bold'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {z.label}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Service Type and Status Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5 text-xs">
          
          {/* Service Track filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px] font-mono uppercase">Service:</span>
            {[
              { id: 'all', label: 'All Services' },
              { id: 'remote', label: 'Remote Diagnostics' },
              { id: 'onsite_dispatch', label: 'On-Site Field Dispatches' }
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setFilterServiceType(s.id)}
                className={`rounded-md px-2.5 py-1 text-xs cursor-pointer transition-colors ${
                  filterServiceType === s.id
                    ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px] font-mono uppercase">Status:</span>
            {['all', 'received', 'assigned', 'connecting', 'in_session', 'resolved'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`rounded-md px-2 py-0.5 font-mono text-[11px] capitalize cursor-pointer transition-colors ${
                  filterStatus === st
                    ? 'bg-white text-black font-bold'
                    : 'text-slate-500 hover:text-white'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* Main Console Grid: Left Ticket Master Queue, Right Live Dispatch Drawer */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        
        {/* Left Column: Filtered Ticket Queue (col-span-5) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
            <span>SHOWING {filteredTickets.length} OF {totalTickets} TICKETS</span>
          </div>

          {filteredTickets.map((ticket) => {
            const isSelected = activeTicket?.id === ticket.id;
            const isOnSite = ticket.serviceType === 'onsite_dispatch';
            return (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicketId(ticket.id)}
                className={`rounded-xl border p-4 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-400/70 bg-gradient-to-r from-amber-950/40 via-slate-900 to-black shadow-lg shadow-amber-500/5 ring-1 ring-amber-400/40'
                    : 'border-white/10 bg-slate-900/30 hover:border-white/20 hover:bg-slate-900/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-white">{ticket.id}</span>
                    <span
                      className={`font-mono text-[10px] uppercase px-1.5 py-0.5 rounded ${
                        isOnSite
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold'
                          : 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/40'
                      }`}
                    >
                      {isOnSite ? 'ON-SITE FIELD' : 'REMOTE'}
                    </span>
                  </div>

                  <span
                    className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      ticket.status === 'resolved'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : ticket.status === 'in_session' || ticket.status === 'connecting'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="mt-2 text-xs font-semibold text-white truncate">
                  {ticket.customerName} · <span className="text-slate-400">{ticket.category}</span>
                </div>

                <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                  {ticket.description}
                </p>

                {isOnSite && ticket.siteAddress && (
                  <div className="mt-2 text-[11px] text-amber-300/90 flex items-center gap-1.5 font-mono truncate">
                    <MapPin className="h-3 w-3 shrink-0 text-amber-400" />
                    <span>{ticket.siteAddress}</span>
                  </div>
                )}

                <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-500 border-t border-white/5 pt-2">
                  <span>{ticket.regionalHubName ? ticket.regionalHubName.split('(')[0] : 'Remote NOC'}</span>
                  <span className="text-slate-400">{new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Ticket Actions & Dispatch Management (col-span-7) */}
        <div className="lg:col-span-7">
          {!activeTicket ? (
            <div className="rounded-2xl border border-white/10 bg-black/40 p-12 text-center text-slate-500">
              No ticket selected
            </div>
          ) : (
            <div className="rounded-2xl border border-white/15 bg-black/80 p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-md">
              
              {/* Ticket Top Action Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
                    <span className="text-xl font-bold text-white">{activeTicket.id}</span>
                    <span>·</span>
                    <span className="text-amber-400 font-semibold uppercase">
                      {activeTicket.serviceType === 'onsite_dispatch' ? 'Field Dispatch' : 'Remote Screen Share'}
                    </span>
                    <span>·</span>
                    <span>{activeTicket.urgency} SLA</span>
                  </div>
                  <h3 className="mt-1 font-display text-lg sm:text-xl font-bold text-white">
                    {activeTicket.category}
                  </h3>
                  <div className="text-xs text-slate-300 mt-1">
                    Client: <strong>{activeTicket.customerName}</strong> ({activeTicket.customerEmail} · {activeTicket.customerPhone || 'No phone'})
                  </div>
                  {activeTicket.siteAddress && (
                    <div className="text-xs text-amber-300 mt-1 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-amber-400" />
                      <span>{activeTicket.siteAddress} {activeTicket.pincode ? `(${activeTicket.pincode})` : ''}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEmailModalOpen(true)}
                    className="flex items-center gap-1.5 rounded-lg border border-cyan-400/30 bg-cyan-950/40 hover:bg-cyan-950/80 px-3 py-1.5 text-xs text-cyan-300 font-medium transition-colors cursor-pointer"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>View Emails</span>
                  </button>

                  <button
                    onClick={() => onOpenCustomerTracker(activeTicket.id)}
                    className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs text-slate-300 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Customer Tracker</span>
                  </button>
                </div>
              </div>

              {/* Status State Transitions */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase font-bold text-slate-400 block">
                  Update Lifecycle State:
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['received', 'assigned', 'connecting', 'in_session', 'resolved'] as TicketStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => ticketStore.updateStatus(activeTicket.id, st)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-mono uppercase transition-colors cursor-pointer ${
                        activeTicket.status === st
                          ? 'bg-white text-black font-bold shadow'
                          : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* SPECIFIC ACTIONS: On-Site Field Dispatch Drawer */}
              {activeTicket.serviceType === 'onsite_dispatch' ? (
                <div className="rounded-xl border border-amber-500/30 bg-amber-950/15 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                      <Truck className="h-4 w-4 text-amber-400" />
                      <span>Mobile Field Engineering Dispatch Controls</span>
                    </div>
                    {activeTicket.fieldUnit && (
                      <span className="font-mono text-xs font-bold text-amber-400 uppercase bg-black/60 px-2 py-0.5 rounded border border-amber-500/30">
                        {activeTicket.fieldUnit.status}
                      </span>
                    )}
                  </div>

                  {/* Current Field Unit Status */}
                  {activeTicket.fieldUnit ? (
                    <div className="space-y-3 bg-black/40 p-4 rounded-xl border border-white/5 text-xs">
                      <div className="grid grid-cols-2 gap-3 font-mono">
                        <div>
                          <span className="text-slate-500 block text-[10px]">Assigned Engineer:</span>
                          <strong className="text-white text-sm">{activeTicket.fieldUnit.engineerName}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Mobile Unit Code:</span>
                          <strong className="text-cyan-300">{activeTicket.fieldUnit.unitCode}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Current ETA:</span>
                          <strong className="text-amber-300">{activeTicket.fieldUnit.eta}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Direct Mobile:</span>
                          <strong className="text-emerald-400">{activeTicket.fieldUnit.phone}</strong>
                        </div>
                      </div>

                      {activeTicket.fieldUnit.notes && (
                        <div className="border-t border-white/5 pt-2 text-slate-300 text-[11px]">
                          <strong>Notes:</strong> {activeTicket.fieldUnit.notes}
                        </div>
                      )}

                      {/* Fast Field Unit Transitions */}
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                        <button
                          onClick={() => handleUpdateFieldStatus('en_route', '25 mins')}
                          className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-mono cursor-pointer hover:bg-amber-500/30"
                        >
                          Mark En Route (25m)
                        </button>
                        <button
                          onClick={() => handleUpdateFieldStatus('on_site', 'Arrived')}
                          className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono cursor-pointer hover:bg-cyan-500/30"
                        >
                          Mark On-Site (Active)
                        </button>
                        <button
                          onClick={() => handleUpdateFieldStatus('completed', 'Signed Off')}
                          className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono cursor-pointer hover:bg-emerald-500/30"
                        >
                          Mark Completed
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Dispatch Form */
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="text-slate-400 block mb-1 text-[11px]">Select Regional Engineer</label>
                          <select
                            value={selectedEngineerIndex}
                            onChange={(e) => setSelectedEngineerIndex(Number(e.target.value))}
                            className="w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-xs text-white"
                          >
                            {FIELD_ENGINEERS.map((eng, idx) => (
                              <option key={eng.unitCode} value={idx}>
                                {eng.name} ({eng.unitCode} · {eng.zone.toUpperCase()})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-slate-400 block mb-1 text-[11px]">Arrival ETA</label>
                          <select
                            value={dispatchEta}
                            onChange={(e) => setDispatchEta(e.target.value)}
                            className="w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-xs text-white"
                          >
                            <option value="30 mins">30 mins (Priority)</option>
                            <option value="45 mins">45 mins</option>
                            <option value="1 hour 15 mins">1 hour 15 mins</option>
                            <option value="Tomorrow 10:00 AM">Tomorrow 10:00 AM</option>
                          </select>
                        </div>
                      </div>

                      <button
                        onClick={handleDispatchFieldEngineer}
                        className="w-full rounded-lg bg-amber-400 px-4 py-2.5 text-xs font-bold text-black uppercase tracking-wider hover:bg-amber-300 transition-colors cursor-pointer"
                      >
                        Dispatch Mobile Unit & Alert Customer
                      </button>
                    </div>
                  )}

                </div>
              ) : (
                /* Remote PIN & Handshake Generator */
                <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/15 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                      <KeyRound className="h-4 w-4 text-cyan-400" />
                      <span>Remote Handshake Dispatch (Quick Assist / AnyDesk)</span>
                    </div>
                    {activeTicket.sessionCode && (
                      <span className="font-mono text-xs font-bold text-white bg-black/60 px-2 py-0.5 rounded border border-white/10">
                        Active PIN: {activeTicket.sessionCode}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={handleGeneratePin}
                      className="rounded-lg bg-cyan-400 px-4 py-2.5 text-xs font-bold text-black uppercase tracking-wider hover:bg-cyan-300 transition-colors cursor-pointer"
                    >
                      Generate 6-Digit Quick Assist PIN
                    </button>
                    <button
                      onClick={handleSetAnydesk}
                      className="rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      Assign AnyDesk Session Tunnel
                    </button>
                  </div>
                </div>
              )}

              {/* Bilateral Message Dispatch */}
              <div className="space-y-3">
                <label className="text-xs font-mono uppercase font-bold text-slate-400 block">
                  Bilateral Session Messaging (Customer Room Sync)
                </label>
                
                <div className="max-h-48 overflow-y-auto space-y-2 rounded-xl border border-white/10 bg-black/40 p-3 text-xs">
                  {activeTicket.messages.map((m) => (
                    <div key={m.id} className="text-[11px] leading-relaxed">
                      <span className={`font-mono font-bold ${
                        m.sender === 'technician' ? 'text-cyan-400' : m.sender === 'customer' ? 'text-white' : 'text-slate-500'
                      }`}>
                        [{m.sender.toUpperCase()}]:
                      </span>{' '}
                      <span className="text-slate-300">{m.text}</span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={techMessage}
                    onChange={(e) => setTechMessage(e.target.value)}
                    placeholder="Send instruction or update to customer room..."
                    className="flex-1 rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-bold text-white transition-colors cursor-pointer"
                  >
                    Send
                  </button>
                </form>
              </div>

              {/* Resolution Form */}
              <div className="border-t border-white/10 pt-5 space-y-3">
                <label className="text-xs font-mono uppercase font-bold text-slate-400 block">
                  Close & Document Resolution:
                </label>
                <textarea
                  rows={2}
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Document actions taken (e.g. Swapped Cat6 patch cord, cleared thermal throttles, executed DISM/SFC repair)..."
                  className="w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
                />
                <button
                  onClick={handleMarkResolved}
                  className="rounded-lg bg-emerald-500 hover:bg-emerald-400 px-5 py-2.5 text-xs font-bold text-black uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Mark Ticket Resolved & Complete Diagnostic Report
                </button>
              </div>

            </div>
          )}
        </div>

      </div>

      {/* Email Notification Preview Modal */}
      {isEmailModalOpen && activeTicket && (
        <EmailNotificationModal
          ticket={activeTicket}
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          defaultTab="admin"
        />
      )}

    </div>
  );
};
