import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Laptop, 
  Monitor, 
  Terminal, 
  Server, 
  CheckCircle2, 
  ArrowRight, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  Mail, 
  Send, 
  Bell, 
  Check, 
  RotateCcw, 
  UserCheck, 
  X,
  ExternalLink,
  Truck,
  MapPin,
  Building2,
  HardDrive
} from 'lucide-react';
import { ticketStore } from '../services/ticketStore';
import { RemoteTool, Ticket, ServiceType, RegionalZoneId, RegionalHub } from '../types';
import { REGIONAL_HUBS } from '../data/regionalHubsData';
import { EmailTemplates } from './EmailTemplates';

interface BookingWizardProps {
  onTicketCreated: (ticketId: string) => void;
  onCancel: () => void;
  onNavigateToConsole?: () => void;
  initialServiceType?: ServiceType;
  initialRegionalHub?: RegionalHub;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({
  onTicketCreated,
  onCancel,
  onNavigateToConsole,
  initialServiceType = 'remote',
  initialRegionalHub
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Service Track Selection
  const [serviceType, setServiceType] = useState<ServiceType>(initialServiceType);
  const [selectedHub, setSelectedHub] = useState<RegionalHub>(initialRegionalHub || REGIONAL_HUBS[0]);

  // Form State
  const [os, setOs] = useState('Windows 11 / 10');
  const [category, setCategory] = useState('Blue Screen (BSOD) / Fatal Crashes');
  const [urgency, setUrgency] = useState<'Standard' | 'Priority' | 'Emergency'>('Priority');
  const [timing, setTiming] = useState<'immediate' | 'scheduled'>('immediate');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledHour, setScheduledHour] = useState('14:00');
  const [description, setDescription] = useState('');
  const [preferredTool, setPreferredTool] = useState<RemoteTool>('quick_assist');

  // On-Site Field Specific State
  const [siteAddress, setSiteAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [hardwareScope, setHardwareScope] = useState('Core Switch & Network Rack');

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTicket, setCreatedTicket] = useState<Ticket | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const remoteCategories = [
    { title: 'Blue Screen (BSOD) / Fatal Crashes', desc: 'Driver crash dumps, memory panic, sudden reboots' },
    { title: 'Virus, Ransomware & Suspicious Popups', desc: 'Malware eradication, browser hijackers, crypto miners' },
    { title: 'Severe Performance Lag & Freezes', desc: 'High CPU/RAM leaks, startup bloat, thermal throttling' },
    { title: 'Wi-Fi, DNS, VPN & Network Drops', desc: 'Cloudflare DNS configuration, packet loss, VPN gateway' },
    { title: 'Outlook, Microsoft 365 & Cloud Sync', desc: 'OST/PST corruption, IMAP auth, cloud file recovery' },
    { title: 'Driver, Peripheral & Registry Faults', desc: 'Peripheral conflicts, GPU errors, registry corruption' }
  ];

  const onsiteScopes = [
    { title: 'Core Switch, Firewall & Network Rack', desc: 'Hardware switch swap, Cat6 patch panels, multi-WAN router failover' },
    { title: 'Physical Server / Hypervisor Emergency', desc: 'Power supply failure, motherboard triage, RAID array & SSD replacement' },
    { title: 'Fleet Workstation Deployment / Refresh', desc: 'Zero-touch provisioning, multi-seat OS onboarding, hardware upgrades' },
    { title: 'Office Wi-Fi 6 & Structured Cabling', desc: 'Access point heatmapping, cable terminations, rack cable management' },
    { title: 'UPS Battery Backup & Clean Power', desc: 'PDU diagnostics, battery load test, sudden power surge triage' }
  ];

  const handleCompleteBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !description) return;
    if (serviceType === 'onsite_dispatch' && !siteAddress) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const scheduledTime =
        timing === 'scheduled' ? `${scheduledDate} at ${scheduledHour} IST` : undefined;

      const ticket = ticketStore.createTicket({
        customerName,
        customerEmail,
        customerPhone,
        os,
        category: serviceType === 'onsite_dispatch' ? hardwareScope : category,
        urgency,
        timing,
        scheduledTime,
        description,
        serviceType,
        regionalZone: selectedHub.zoneId,
        regionalHubName: selectedHub.name,
        siteAddress: serviceType === 'onsite_dispatch' ? siteAddress : undefined,
        pincode: serviceType === 'onsite_dispatch' ? pincode : undefined,
        hardwareScope: serviceType === 'onsite_dispatch' ? hardwareScope : undefined,
        preferredTool
      });

      setIsSubmitting(false);
      setCreatedTicket(ticket);
      setStep(4);
      setIsSuccessModalOpen(true);

      try {
        confetti({
          particleCount: 90,
          spread: 85,
          origin: { y: 0.55 }
        });
      } catch (err) {
        console.error(err);
      }
    }, 600);
  };

  const handleResetBooking = () => {
    setCreatedTicket(null);
    setDescription('');
    setSiteAddress('');
    setIsSuccessModalOpen(false);
    setStep(1);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      
      {/* Stepper Header */}
      {step !== 4 && (
        <div className="mb-8 border-b border-white/10 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                <Zap className="h-3.5 w-3.5" />
                <span>Regional IT & Managed Diagnostics · remotfix.in</span>
              </div>
              <h1 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-white">
                {serviceType === 'onsite_dispatch' 
                  ? 'Request Regional On-Site Field Dispatch'
                  : 'Schedule Live Remote Diagnostic Session'}
              </h1>
            </div>
            <button
              onClick={onCancel}
              className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel & Return
            </button>
          </div>

          {/* Service Track Toggle Banner */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 p-1.5 rounded-2xl bg-white/5 border border-white/10">
            <button
              type="button"
              onClick={() => {
                setServiceType('remote');
                setCategory('Blue Screen (BSOD) / Fatal Crashes');
              }}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer text-left ${
                serviceType === 'remote'
                  ? 'bg-gradient-to-r from-cyan-950/60 to-slate-900 border border-cyan-400/40 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className={`p-2 rounded-lg ${serviceType === 'remote' ? 'bg-cyan-400 text-black' : 'bg-white/10 text-slate-400'}`}>
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Instant Remote Screen Share</div>
                <div className="text-[11px] text-slate-400">Quick Assist / AnyDesk · &lt;15 min SLA</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setServiceType('onsite_dispatch');
                setCategory('Core Switch, Firewall & Network Rack');
              }}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer text-left ${
                serviceType === 'onsite_dispatch'
                  ? 'bg-gradient-to-r from-amber-950/60 to-slate-900 border border-amber-400/40 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className={`p-2 rounded-lg ${serviceType === 'onsite_dispatch' ? 'bg-amber-400 text-black' : 'bg-white/10 text-slate-400'}`}>
                <Truck className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Regional On-Site Field Dispatch</div>
                <div className="text-[11px] text-slate-400">Certified Mobile Unit · &lt;2 hr Metro Arrival</div>
              </div>
            </button>
          </div>

          {/* 3 Step Indicator */}
          <div className="mt-6 grid grid-cols-3 gap-2 text-xs">
            <div
              className={`flex items-center gap-2 border-b-2 pb-2 ${
                step >= 1 ? 'border-cyan-400 text-white font-semibold' : 'border-white/10 text-slate-500'
              }`}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400/20 text-cyan-400 text-[11px] font-mono">1</span>
              <span>{serviceType === 'onsite_dispatch' ? 'Location & Scope' : 'Environment & Symptom'}</span>
            </div>
            <div
              className={`flex items-center gap-2 border-b-2 pb-2 ${
                step >= 2 ? 'border-cyan-400 text-white font-semibold' : 'border-white/10 text-slate-500'
              }`}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400/20 text-cyan-400 text-[11px] font-mono">2</span>
              <span>{serviceType === 'onsite_dispatch' ? 'Dispatch Window' : 'Timing & Connection'}</span>
            </div>
            <div
              className={`flex items-center gap-2 border-b-2 pb-2 ${
                step >= 3 ? 'border-cyan-400 text-white font-semibold' : 'border-white/10 text-slate-500'
              }`}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400/20 text-cyan-400 text-[11px] font-mono">3</span>
              <span>Contact & Dispatch</span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 1: Details */}
      {step === 1 && (
        <div className="space-y-6">
          
          {/* If On-Site Dispatch: Select Regional Hub and Address */}
          {serviceType === 'onsite_dispatch' ? (
            <>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                  Select Regional Dispatch Hub
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {REGIONAL_HUBS.map((hub) => {
                    const isSelected = selectedHub.id === hub.id;
                    return (
                      <div
                        key={hub.id}
                        onClick={() => setSelectedHub(hub)}
                        className={`rounded-xl border p-3 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-amber-400 bg-amber-950/30 text-white ring-1 ring-amber-400/30'
                            : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-amber-400 font-bold">{hub.zone} Zone</span>
                          <span className="text-emerald-400">{hub.activeEngineers} Units Active</span>
                        </div>
                        <h4 className="mt-1 text-xs font-bold text-white line-clamp-1">{hub.name}</h4>
                        <div className="mt-1 text-[10px] text-slate-400">SLA: &lt;{hub.fieldDispatchSlaHours}h Metro Arrival</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Site / Office Street Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="E.g. Tower B, DLF Cyber City, Sector 25, Gurugram"
                      value={siteAddress}
                      onChange={(e) => setSiteAddress(e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-black/40 pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Regional Pincode *
                  </label>
                  <input
                    type="text"
                    placeholder="122002"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                  Infrastructure & Hardware Scope
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {onsiteScopes.map((scope) => {
                    const isSelected = hardwareScope === scope.title;
                    return (
                      <div
                        key={scope.title}
                        onClick={() => setHardwareScope(scope.title)}
                        className={`rounded-xl border p-3.5 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-amber-400 bg-amber-950/25 text-white'
                            : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <h4 className="text-xs font-bold text-white">{scope.title}</h4>
                          {isSelected && <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />}
                        </div>
                        <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">{scope.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            /* Remote Diagnostic Track */
            <>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">
                  Operating System Environment
                </label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { name: 'Windows 11 / 10', icon: Monitor },
                    { name: 'macOS Sequoia/Sonoma', icon: Laptop },
                    { name: 'Ubuntu / Linux', icon: Terminal },
                    { name: 'Windows Server', icon: Server }
                  ].map((item) => {
                    const IconComponent = item.icon;
                    const isSelected = os === item.name;
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setOs(item.name)}
                        className={`flex flex-col items-center justify-center rounded-xl border p-4 text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'border-cyan-400 bg-cyan-950/40 text-white shadow-lg shadow-cyan-400/10'
                            : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10'
                        }`}
                      >
                        <IconComponent className={`h-6 w-6 mb-2 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                        <span className="text-xs font-semibold">{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">
                  Diagnostic Issue Category
                </label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {remoteCategories.map((cat) => {
                    const isSelected = category === cat.title;
                    return (
                      <div
                        key={cat.title}
                        onClick={() => setCategory(cat.title)}
                        className={`rounded-xl border p-4 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-cyan-400 bg-cyan-950/30 text-white'
                            : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <h4 className="text-sm font-semibold text-white">{cat.title}</h4>
                          {isSelected && <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />}
                        </div>
                        <p className="mt-1 text-xs text-slate-400 leading-relaxed">{cat.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Detailed Description of Problem / Fault *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                serviceType === 'onsite_dispatch'
                  ? 'E.g. Main 48-port PoE switch overheating and cycling power. Need hardware replacement and testing of ports 12-24.'
                  : 'E.g. Computer blue-screened twice today with stop code IRQL_NOT_LESS_OR_EQUAL. System fan is running loud.'
              }
              className="w-full rounded-xl border border-white/15 bg-black/40 p-3.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              disabled={!description.trim() || (serviceType === 'onsite_dispatch' && !siteAddress.trim())}
              onClick={() => setStep(2)}
              className="flex items-center gap-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 px-6 py-2.5 text-xs font-bold text-black uppercase tracking-wider transition-colors disabled:opacity-40 cursor-pointer"
            >
              <span>Next: {serviceType === 'onsite_dispatch' ? 'Dispatch Window' : 'Timing & Tools'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Timing & Connection Tool */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">
              {serviceType === 'onsite_dispatch' ? 'Dispatch Urgency & SLA Arrival Tier' : 'Triage Urgency & SLA Tier'}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { 
                  level: 'Standard', 
                  time: serviceType === 'onsite_dispatch' ? 'Next Business Day' : '~1-2 Hours', 
                  badge: 'Standard SLA', 
                  color: 'border-white/10 text-slate-300' 
                },
                { 
                  level: 'Priority', 
                  time: serviceType === 'onsite_dispatch' ? '<2 Hours Metro' : '~15-30 Minutes', 
                  badge: 'Recommended', 
                  color: 'border-cyan-400 text-cyan-300 bg-cyan-950/30' 
                },
                { 
                  level: 'Emergency', 
                  time: serviceType === 'onsite_dispatch' ? 'Immediate Mobile Van' : 'Immediate Standby', 
                  badge: 'Critical Outage', 
                  color: 'border-rose-500/50 text-rose-300 bg-rose-950/20' 
                }
              ].map((tier) => {
                const isSelected = urgency === tier.level;
                return (
                  <button
                    key={tier.level}
                    type="button"
                    onClick={() => setUrgency(tier.level as any)}
                    className={`rounded-xl border p-4 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950/40 text-white shadow-md'
                        : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase">{tier.level}</span>
                      <span className="text-[10px] font-mono text-cyan-400">{tier.badge}</span>
                    </div>
                    <span className="mt-2 text-sm font-semibold text-white block">{tier.time}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">
              {serviceType === 'onsite_dispatch' ? 'Field Arrival Window' : 'Diagnostic Timing'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTiming('immediate')}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all cursor-pointer ${
                  timing === 'immediate'
                    ? 'border-cyan-400 bg-cyan-950/40 text-white'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                }`}
              >
                <Clock className="h-5 w-5 text-cyan-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-white block">
                    {serviceType === 'onsite_dispatch' ? 'Immediate Dispatch Request' : 'Connect Immediately'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {serviceType === 'onsite_dispatch' ? 'Mobile van alerted immediately' : 'Join live queue within minutes'}
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTiming('scheduled')}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all cursor-pointer ${
                  timing === 'scheduled'
                    ? 'border-cyan-400 bg-cyan-950/40 text-white'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                }`}
              >
                <Calendar className="h-5 w-5 text-purple-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-white block">Schedule For Later</span>
                  <span className="text-[11px] text-slate-400">Pick specific time slot</span>
                </div>
              </button>
            </div>

            {timing === 'scheduled' && (
              <div className="mt-4 grid grid-cols-2 gap-3 p-4 rounded-xl border border-white/10 bg-black/40">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Select Date</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Time Slot (IST)</label>
                  <select
                    value={scheduledHour}
                    onChange={(e) => setScheduledHour(e.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-xs text-white"
                  >
                    <option value="10:00">10:00 AM IST</option>
                    <option value="12:00">12:00 PM IST</option>
                    <option value="14:00">02:00 PM IST</option>
                    <option value="16:00">04:00 PM IST</option>
                    <option value="18:00">06:00 PM IST</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Connection tool selection (only if remote) */}
          {serviceType === 'remote' && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">
                Preferred Remote Connection Tool
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPreferredTool('quick_assist')}
                  className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all cursor-pointer ${
                    preferredTool === 'quick_assist'
                      ? 'border-cyan-400 bg-cyan-950/40 text-white'
                      : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <Monitor className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-white block">Microsoft Quick Assist (Recommended)</span>
                    <span className="text-[11px] text-slate-400">Zero download required on Windows 10/11. Built into your OS via Win+Ctrl+Q.</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPreferredTool('anydesk')}
                  className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all cursor-pointer ${
                    preferredTool === 'anydesk'
                      ? 'border-cyan-400 bg-cyan-950/40 text-white'
                      : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <Laptop className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-white block">AnyDesk Remote</span>
                    <span className="text-[11px] text-slate-400">Cross-platform connection with 9-digit address for macOS, Linux, or custom Windows.</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="rounded-lg border border-white/20 bg-white/5 px-5 py-2.5 text-xs font-semibold text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="flex items-center gap-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 px-6 py-2.5 text-xs font-bold text-black uppercase tracking-wider transition-colors cursor-pointer"
            >
              <span>Next: Contact Details</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Contact Details & Confirmation */}
      {step === 3 && (
        <form onSubmit={handleCompleteBooking} className="space-y-6">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-slate-300">
            <span className="font-semibold text-white block mb-1">Dispatch Summary Checklist:</span>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400 font-mono">
              <span>Service: <strong className="text-white">{serviceType === 'onsite_dispatch' ? 'On-Site Field Dispatch' : 'Remote Screen Share'}</strong></span>
              <span>Hub: <strong className="text-amber-300">{selectedHub.name}</strong></span>
              <span>Priority: <strong className="text-cyan-400 uppercase">{urgency}</strong></span>
              {serviceType === 'onsite_dispatch' && (
                <span>Address: <strong className="text-white">{siteAddress}</strong></span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Your Full Name / Contact Person *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Marcus Vance"
                className="w-full rounded-lg border border-white/15 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Your Email Address *
              </label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="marcus@company.com"
                className="w-full rounded-lg border border-white/15 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              WhatsApp or Direct Phone * (Required for Technician Handshake & Gate Clearance)
            </label>
            <input
              type="tel"
              required
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="+91 98110 32910"
              className="w-full rounded-lg border border-white/15 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <ShieldCheck className="h-4 w-4" />
              <span>Automated Regional Dispatch Guarantee</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Upon submission, an automated receipt is dispatched to your email, and a high-priority dispatch notice is transmitted to <strong>support@remotfix.in</strong> and the <strong>{selectedHub.name}</strong> operations console.
            </p>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="rounded-lg border border-white/20 bg-white/5 px-5 py-2.5 text-xs font-semibold text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 px-7 py-3 text-xs font-bold text-black uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer shadow-lg shadow-cyan-400/20"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isSubmitting ? 'Dispatching...' : 'Confirm Request & Dispatch Emails'}</span>
            </button>
          </div>
        </form>
      )}

      {/* STEP 4: Confirmation Summary */}
      {step === 4 && createdTicket && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Main Success Trigger Banner */}
          <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 via-cyan-950/20 to-black p-6 sm:p-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-5">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-black font-extrabold shadow-lg shadow-emerald-500/20">
                  <Check className="h-6 w-6 stroke-[3]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Request Confirmed · Regional Notice Sent
                    </span>
                  </div>
                  <h2 className="mt-0.5 font-display text-2xl sm:text-3xl font-black text-white">
                    {createdTicket.serviceType === 'onsite_dispatch'
                      ? 'Field Dispatch Request Logged!'
                      : 'Diagnostic Session Queued!'}
                  </h2>
                </div>
              </div>

              <div className="sm:text-right font-mono text-xs">
                <span className="text-slate-400 block text-[11px]">Ticket ID Reference</span>
                <span className="text-xl font-extrabold text-cyan-300">{createdTicket.id}</span>
              </div>
            </div>

            {/* Dual Notification Dispatch Status Cards */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              
              {/* Customer Notification Status */}
              <div 
                onClick={() => setIsSuccessModalOpen(true)}
                className="rounded-xl border border-white/10 bg-white/5 p-4 cursor-pointer hover:border-cyan-400 hover:bg-cyan-950/20 transition-all"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 text-cyan-300 font-bold">
                    <Send className="h-4 w-4 text-cyan-400" />
                    <span>Customer Receipt Dispatched</span>
                  </div>
                  <span className="rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono px-2 py-0.5 border border-emerald-500/30">
                    DELIVERED
                  </span>
                </div>
                <div className="font-mono text-slate-300 text-[11px] truncate">
                  Sent to: <strong>{createdTicket.customerEmail}</strong>
                </div>
                <p className="mt-1.5 text-[11px] text-slate-400 leading-relaxed">
                  Confirms request with Ticket #{createdTicket.id}, regional SLA details, and live tracking room link.
                </p>
                <div className="mt-2 text-[10px] text-cyan-400 font-semibold flex items-center gap-1">
                  <span>Click to view visual email mockup</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>

              {/* Admin Notification Status (support@remotfix.in) */}
              <div 
                onClick={() => setIsSuccessModalOpen(true)}
                className="rounded-xl border border-white/10 bg-white/5 p-4 cursor-pointer hover:border-amber-400 hover:bg-amber-950/20 transition-all"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 text-amber-300 font-bold">
                    <Bell className="h-4 w-4 text-amber-400" />
                    <span>Admin Request Dispatched</span>
                  </div>
                  <span className="rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono px-2 py-0.5 border border-amber-500/30">
                    DELIVERED
                  </span>
                </div>
                <div className="font-mono text-slate-300 text-[11px] truncate">
                  Sent to: <strong>support@remotfix.in</strong> <span className="text-slate-500">({createdTicket.regionalHubName})</span>
                </div>
                <p className="mt-1.5 text-[11px] text-slate-400 leading-relaxed">
                  Alert sent to operations desk notifying team of new {createdTicket.urgency} request on remotfix.in.
                </p>
                <div className="mt-2 text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                  <span>Click to view support@remotfix.in alert mockup</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>

            </div>

            {/* Re-Open Success Modal Quick Trigger */}
            <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-300 text-xs">
                Want to inspect the exact emails delivered to your inbox and <strong>support@remotfix.in</strong>?
              </span>
              <button
                type="button"
                onClick={() => setIsSuccessModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/40 bg-cyan-950/40 hover:bg-cyan-950/80 px-3.5 py-1.5 font-semibold text-cyan-300 transition-colors cursor-pointer"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>Open Email Mockup Modal</span>
              </button>
            </div>
          </div>

          {/* Embedded EmailTemplates View directly on the page */}
          <div className="rounded-2xl border border-white/15 bg-black/50 p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                  Dispatched Email Templates
                </h3>
                <span className="text-[11px] text-slate-400">
                  Visual mockups rendered by EmailTemplates component
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsSuccessModalOpen(true)}
                className="text-xs text-cyan-400 hover:underline cursor-pointer"
              >
                Expand in Focus Modal &rarr;
              </button>
            </div>

            <EmailTemplates ticket={createdTicket} defaultTemplate="customer" />
          </div>

          {/* Action Gate: Enter Tracking Room */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div>
              <h4 className="font-display font-bold text-white text-base">
                {createdTicket.serviceType === 'onsite_dispatch'
                  ? 'Track Field Engineer Dispatch Live'
                  : 'Ready for Remote Diagnostic?'}
              </h4>
              <p className="text-xs text-slate-400">
                {createdTicket.serviceType === 'onsite_dispatch'
                  ? 'Monitor your assigned mobile unit status, ETA countdown, and field technician details.'
                  : "Enter your live session room to receive the technician's 6-digit Quick Assist PIN or AnyDesk address."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleResetBooking}
                className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Book Another</span>
              </button>

              <button
                type="button"
                onClick={() => onTicketCreated(createdTicket.id)}
                className="flex items-center gap-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 px-6 py-2.5 text-xs font-bold text-black uppercase tracking-wider transition-colors cursor-pointer shadow-lg shadow-cyan-400/20"
              >
                <span>Enter Live Tracking Room</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Focus Modal for Email Templates */}
      {isSuccessModalOpen && createdTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fade-in">
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/20 bg-[#0B0F19] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-white">
                  Email Dispatch Confirmation
                </h3>
                <p className="text-xs text-slate-400">
                  Verification of dispatched messages for Ticket #{createdTicket.id}
                </p>
              </div>
              <button
                onClick={() => setIsSuccessModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6">
              <EmailTemplates ticket={createdTicket} defaultTemplate="customer" />
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-4">
              <button
                onClick={() => setIsSuccessModalOpen(false)}
                className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  onTicketCreated(createdTicket.id);
                }}
                className="flex items-center gap-1.5 rounded-lg bg-cyan-400 px-5 py-2 text-xs font-bold text-black hover:bg-cyan-300"
              >
                <span>Go to Live Tracking Room</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
