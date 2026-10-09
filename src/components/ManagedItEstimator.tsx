import React, { useState } from 'react';
import { 
  Calculator, 
  Building2, 
  Laptop, 
  Server, 
  Clock, 
  ShieldCheck, 
  Check, 
  ArrowRight, 
  Layers, 
  Zap,
  HelpCircle
} from 'lucide-react';

interface ManagedItEstimatorProps {
  onRequestProposal: (details: {
    workstations: number;
    servers: number;
    branches: number;
    tier: string;
    estimatedCost: string;
  }) => void;
}

export const ManagedItEstimator: React.FC<ManagedItEstimatorProps> = ({
  onRequestProposal
}) => {
  const [workstations, setWorkstations] = useState<number>(25);
  const [servers, setServers] = useState<number>(3);
  const [branches, setBranches] = useState<number>(1);
  const [tier, setTier] = useState<'essential' | 'growth' | 'enterprise'>('growth');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [includeSoc, setIncludeSoc] = useState(true);
  const [includeBackup, setIncludeBackup] = useState(true);

  // Pricing constants (in INR)
  const rates = {
    INR: {
      perWorkstation: tier === 'essential' ? 850 : tier === 'growth' ? 1450 : 2200,
      perServer: tier === 'essential' ? 3500 : tier === 'growth' ? 5500 : 8500,
      branchBase: tier === 'essential' ? 4500 : tier === 'growth' ? 8500 : 15000,
      socAddon: 400,
      backupAddon: 250,
      symbol: '₹'
    },
    USD: {
      perWorkstation: tier === 'essential' ? 12 : tier === 'growth' ? 20 : 32,
      perServer: tier === 'essential' ? 50 : tier === 'growth' ? 80 : 125,
      branchBase: tier === 'essential' ? 65 : tier === 'growth' ? 120 : 210,
      socAddon: 6,
      backupAddon: 4,
      symbol: '$'
    }
  };

  const currRate = rates[currency];
  const workstationCost = workstations * (currRate.perWorkstation + (includeSoc ? currRate.socAddon : 0) + (includeBackup ? currRate.backupAddon : 0));
  const serverCost = servers * currRate.perServer;
  const branchCost = branches * currRate.branchBase;
  const totalMonthly = workstationCost + serverCost + branchCost;

  const formattedTotal = `${currRate.symbol}${totalMonthly.toLocaleString()}`;

  const tierDetails = {
    essential: {
      title: 'Essential Regional Support',
      slaRemote: '<30 Minutes',
      slaField: 'Next Business Day',
      coverage: 'Business Hours (9 AM – 7 PM)',
      suitableFor: 'Small offices and growing teams needing reliable remote + next-day hardware support.'
    },
    growth: {
      title: 'Growth Managed IT (Recommended)',
      slaRemote: '<15 Minutes',
      slaField: '<2 Hours Metro Dispatch',
      coverage: '24/7 Operations & Weekend Standby',
      suitableFor: 'Scaling businesses with branch offices requiring tight SLA response and automated MDM patch cadence.'
    },
    enterprise: {
      title: 'Enterprise Regional Operations',
      slaRemote: '<5 Minutes VIP Escalation',
      slaField: '<1 Hour Priority Van / Resident Engineer',
      coverage: '24/7/365 Dedicated NOC & SOC Operations',
      suitableFor: 'Mission-critical organizations, fintech, and multi-city campuses requiring zero downtime.'
    }
  };

  return (
    <div className="w-full bg-[#090A0F] text-slate-100 py-16 md:py-24 border-b border-white/10" id="managed-it-calculator">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-950/40 px-3 py-1 text-xs font-semibold text-cyan-300">
              <Calculator className="h-3.5 w-3.5 text-cyan-400" />
              <span>Transparent SLA Economics</span>
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
              Regional IT Infrastructure Cost Calculator
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Model your managed technology services agreement based on device fleet size, physical branch footprint, and regional on-site dispatch speed.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto bg-slate-900 border border-white/10 rounded-lg p-1">
            <button
              onClick={() => setCurrency('INR')}
              className={`px-3 py-1 text-xs font-mono font-bold rounded cursor-pointer transition-colors ${
                currency === 'INR' ? 'bg-white text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              INR (₹)
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1 text-xs font-mono font-bold rounded cursor-pointer transition-colors ${
                currency === 'USD' ? 'bg-white text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              USD ($)
            </button>
          </div>
        </div>

        {/* Tier Selector Cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['essential', 'growth', 'enterprise'] as const).map((tKey) => {
            const isSelected = tier === tKey;
            const tInfo = tierDetails[tKey];
            return (
              <div
                key={tKey}
                onClick={() => setTier(tKey)}
                className={`rounded-2xl border p-5 transition-all cursor-pointer relative text-left ${
                  isSelected
                    ? 'border-cyan-400/60 bg-gradient-to-b from-cyan-950/30 via-slate-900/60 to-black shadow-xl ring-1 ring-cyan-400/30'
                    : 'border-white/10 bg-slate-900/30 hover:border-white/20 hover:bg-slate-900/50'
                }`}
              >
                {tKey === 'growth' && (
                  <span className="absolute -top-2.5 right-4 rounded-full bg-cyan-400 px-2.5 py-0.5 text-[10px] font-bold text-black uppercase tracking-wider">
                    Most Popular
                  </span>
                )}
                <div className="text-xs font-mono font-bold text-slate-400 uppercase">
                  Tier {tKey === 'essential' ? '01' : tKey === 'growth' ? '02' : '03'}
                </div>
                <h4 className="mt-1 text-lg font-bold text-white font-display">
                  {tInfo.title}
                </h4>

                <div className="mt-4 space-y-2 text-xs border-t border-white/10 pt-3 font-mono">
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Remote Response:</span>
                    <span className="font-bold text-cyan-300">{tInfo.slaRemote}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">On-Site Arrival:</span>
                    <span className="font-bold text-amber-300">{tInfo.slaField}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">NOC Operations:</span>
                    <span className="text-emerald-400 font-bold">{tInfo.coverage}</span>
                  </div>
                </div>

                <p className="mt-4 text-xs text-slate-400 leading-relaxed">
                  {tInfo.suitableFor}
                </p>
              </div>
            );
          })}
        </div>

        {/* 2-Column Calculator Body */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sliders & Parameters (col-span-7) */}
          <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-slate-900/40 p-6 sm:p-8 space-y-6">
            
            {/* Workstations slider */}
            <div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-white flex items-center gap-2">
                  <Laptop className="h-4 w-4 text-cyan-400" />
                  <span>Fleet Workstations & Laptops</span>
                </span>
                <span className="font-mono text-base font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-0.5 rounded-lg">
                  {workstations} devices
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="250"
                step="5"
                value={workstations}
                onChange={(e) => setWorkstations(Number(e.target.value))}
                className="w-full mt-3 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
                <span>5 Seats</span>
                <span>50 Seats</span>
                <span>100 Seats</span>
                <span>250+ Seats</span>
              </div>
            </div>

            {/* Servers slider */}
            <div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-white flex items-center gap-2">
                  <Server className="h-4 w-4 text-purple-400" />
                  <span>Physical & Virtual Servers / Hypervisors</span>
                </span>
                <span className="font-mono text-base font-bold text-purple-400 bg-purple-950/60 border border-purple-500/30 px-2.5 py-0.5 rounded-lg">
                  {servers} instances
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="1"
                value={servers}
                onChange={(e) => setServers(Number(e.target.value))}
                className="w-full mt-3 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
                <span>0 (Cloud Only)</span>
                <span>5 Servers</span>
                <span>15 Servers</span>
                <span>25 Instances</span>
              </div>
            </div>

            {/* Office Branches */}
            <div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-white flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-amber-400" />
                  <span>Regional Branch Offices Covered</span>
                </span>
                <span className="font-mono text-base font-bold text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2.5 py-0.5 rounded-lg">
                  {branches} {branches === 1 ? 'location' : 'locations'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                value={branches}
                onChange={(e) => setBranches(Number(e.target.value))}
                className="w-full mt-3 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
                <span>1 HQ</span>
                <span>2-3 Branches</span>
                <span>5 Hubs</span>
                <span>8 Campuses</span>
              </div>
            </div>

            {/* Optional Enterprise Add-ons */}
            <div className="border-t border-white/10 pt-5 space-y-3">
              <div className="text-xs font-mono uppercase font-bold text-slate-400">
                Integrated Security & Continuity Add-Ons:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-white/5 bg-black/40 cursor-pointer hover:border-white/10 transition-colors">
                  <input
                    type="checkbox"
                    checked={includeSoc}
                    onChange={(e) => setIncludeSoc(e.target.checked)}
                    className="rounded bg-slate-800 border-white/20 text-cyan-400 focus:ring-0"
                  />
                  <div>
                    <div className="font-semibold text-white">Managed EDR & SOC</div>
                    <div className="text-[11px] text-slate-400">CrowdStrike/SentinelOne defense</div>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-white/5 bg-black/40 cursor-pointer hover:border-white/10 transition-colors">
                  <input
                    type="checkbox"
                    checked={includeBackup}
                    onChange={(e) => setIncludeBackup(e.target.checked)}
                    className="rounded bg-slate-800 border-white/20 text-cyan-400 focus:ring-0"
                  />
                  <div>
                    <div className="font-semibold text-white">Immutable Cloud Backups</div>
                    <div className="text-[11px] text-slate-400">Air-gapped ransomware protection</div>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Pricing Summary Card (col-span-5) */}
          <div className="lg:col-span-5 rounded-2xl border border-white/15 bg-gradient-to-b from-slate-900 via-black to-black p-6 sm:p-8 shadow-2xl">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              Estimated Managed Agreement
            </div>
            
            <div className="mt-3 flex items-baseline gap-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-white font-mono">
                {formattedTotal}
              </div>
              <span className="text-xs text-slate-400 font-mono">/ month</span>
            </div>

            <p className="mt-2 text-xs text-slate-400">
              Includes unlimited remote helpdesk tickets, scheduled preventative patch cycles, and on-site engineering dispatch under {tierDetails[tier].slaField}.
            </p>

            {/* Line items breakdown */}
            <div className="mt-6 space-y-2.5 border-t border-white/10 pt-4 text-xs font-mono">
              <div className="flex justify-between text-slate-300">
                <span>{workstations}x Endpoints ({currRate.symbol}{currRate.perWorkstation}/ea):</span>
                <span>{currRate.symbol}{workstationCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>{servers}x Servers ({currRate.symbol}{currRate.perServer}/ea):</span>
                <span>{currRate.symbol}{serverCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>{branches}x Branch Hubs Base:</span>
                <span>{currRate.symbol}{branchCost.toLocaleString()}</span>
              </div>
              {includeSoc && (
                <div className="flex justify-between text-emerald-400">
                  <span>+ Managed SOC / EDR Fleet:</span>
                  <span>Included</span>
                </div>
              )}
              {includeBackup && (
                <div className="flex justify-between text-cyan-400">
                  <span>+ Immutable Backup Sync:</span>
                  <span>Included</span>
                </div>
              )}
            </div>

            {/* Included Value Stack */}
            <div className="mt-6 border-t border-white/10 pt-4 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Dedicated Regional Technical Account Manager</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Quarterly Hardware & Security Audit</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Cloudflare DNS & DDOS protection included</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Zero Lock-In: 30-Day Evaluation Period</span>
              </div>
            </div>

            {/* Action CTA */}
            <div className="mt-8 space-y-3">
              <button
                onClick={() => onRequestProposal({
                  workstations,
                  servers,
                  branches,
                  tier: tierDetails[tier].title,
                  estimatedCost: formattedTotal
                })}
                className="w-full rounded-xl bg-white py-3.5 px-4 text-xs font-bold text-black hover:bg-slate-200 transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg hover:shadow-white/10"
              >
                <span>Request Formal Proposal & Site Audit</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              
              <div className="text-center text-[11px] text-slate-500 font-mono">
                Dispatched from nearest regional operations center.
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
