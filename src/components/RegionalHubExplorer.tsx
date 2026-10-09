import React, { useState } from 'react';
import { 
  REGIONAL_HUBS, 
  findRegionalHubByQuery
} from '../data/regionalHubsData';
import { RegionalHub } from '../types';
import { 
  MapPin, 
  Search, 
  ShieldCheck, 
  Clock, 
  PhoneCall, 
  Radio, 
  CheckCircle2, 
  ArrowRight, 
  Server, 
  Truck, 
  Users,
  Compass
} from 'lucide-react';

interface RegionalHubExplorerProps {
  onBookDispatch: (hub: RegionalHub) => void;
  onBookRemote: () => void;
}

export const RegionalHubExplorer: React.FC<RegionalHubExplorerProps> = ({
  onBookDispatch,
  onBookRemote
}) => {
  const [selectedHub, setSelectedHub] = useState<RegionalHub>(REGIONAL_HUBS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResultHub, setSearchResultHub] = useState<RegionalHub | null>(null);
  const [activeZoneFilter, setActiveZoneFilter] = useState<'All' | 'North' | 'West' | 'South' | 'East'>('All');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResultHub(null);
      return;
    }
    const matched = findRegionalHubByQuery(searchQuery);
    setSearchResultHub(matched);
    setSelectedHub(matched);
  };

  const filteredHubs = activeZoneFilter === 'All' 
    ? REGIONAL_HUBS 
    : REGIONAL_HUBS.filter(h => h.zone === activeZoneFilter);

  return (
    <div className="w-full bg-[#090A0F] text-slate-100 py-12 md:py-20 border-b border-white/10" id="regional-hubs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-950/40 px-3 py-1 text-xs font-semibold text-cyan-300">
              <Compass className="h-3.5 w-3.5 text-cyan-400" />
              <span>National Operations Network</span>
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
              Regional IT Infrastructure & Field Dispatch Hubs
            </h2>
            <p className="mt-2 text-sm text-slate-400 max-w-2xl">
              High-availability Managed Technology Services combining 24/7 Tier-3 remote telemetry with certified on-site mobile field engineers dispatched in under 2 hours across major metro tech corridors.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBookRemote}
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-lg border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
            >
              Remote Fix (<span className="text-cyan-400 font-mono">&lt;15m</span>)
            </button>
            <button
              onClick={() => onBookDispatch(selectedHub)}
              className="flex items-center gap-1.5 text-xs font-semibold text-black bg-cyan-400 hover:bg-cyan-300 px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-lg shadow-cyan-500/10"
            >
              <Truck className="h-3.5 w-3.5" />
              <span>Request On-Site Dispatch</span>
            </button>
          </div>
        </div>

        {/* Real-time City & Pincode Lookup Bar */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-black p-4 sm:p-6 shadow-2xl">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Enter your City or Pincode (e.g. Gurugram, Mumbai, 560103, Bengaluru, 110001)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/60 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-white px-6 py-3 text-xs font-bold text-black hover:bg-slate-200 transition-colors cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span>Verify Regional Coverage</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>

          {searchResultHub && (
            <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Coverage Confirmed:</strong> Your location is serviced by <strong>{searchResultHub.name}</strong>.
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[11px] text-slate-300">
                <span>Field SLA: &lt;{searchResultHub.fieldDispatchSlaHours}h</span>
                <span>·</span>
                <span>Active Mobile Units: {searchResultHub.activeEngineers}</span>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => onBookDispatch(searchResultHub)}
                  className="text-cyan-300 hover:text-cyan-200 underline cursor-pointer"
                >
                  Book Dispatch Now &rarr;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Zone Filters */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {(['All', 'North', 'West', 'South', 'East'] as const).map((zone) => (
            <button
              key={zone}
              onClick={() => setActiveZoneFilter(zone)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeZoneFilter === zone
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              {zone === 'All' ? 'All Regional Hubs (5)' : `${zone} Zone Hubs`}
            </button>
          ))}
        </div>

        {/* 2-Column Hub Showcase: Left Grid of Hubs, Right Detailed Hub Inspector */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: Hub Cards */}
          <div className="lg:col-span-5 space-y-3">
            {filteredHubs.map((hub) => {
              const isSelected = selectedHub.id === hub.id;
              return (
                <div
                  key={hub.id}
                  onClick={() => setSelectedHub(hub)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'border-cyan-400/50 bg-gradient-to-r from-cyan-950/30 to-slate-900/60 shadow-lg shadow-cyan-500/5 ring-1 ring-cyan-400/30'
                      : 'border-white/10 bg-slate-900/30 hover:border-white/20 hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-white/10 text-slate-300">
                          {hub.zone} Zone
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          <span>{hub.status}</span>
                        </div>
                      </div>
                      <h4 className="mt-2 text-sm font-bold text-white font-display">
                        {hub.name}
                      </h4>
                    </div>

                    <div className="text-right font-mono text-[11px]">
                      <div className="text-cyan-400 font-semibold">{hub.activeEngineers} Units</div>
                      <div className="text-slate-500 text-[10px]">On-Duty</div>
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-slate-400 line-clamp-1">
                    {hub.headquarters}
                  </p>

                  <div className="mt-3 flex items-center gap-3 text-[11px] font-mono text-slate-400 border-t border-white/5 pt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-cyan-400" />
                      <span>Remote: ~{hub.avgRemoteResponseMins}m</span>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Truck className="h-3 w-3 text-amber-400" />
                      <span>On-Site: &lt;{hub.fieldDispatchSlaHours}h</span>
                    </span>
                    <span>·</span>
                    <span className="text-emerald-400">
                      {hub.nocUptimePercentage}% Uptime
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Detailed Hub Inspector & Live Specifications */}
          <div className="lg:col-span-7 rounded-2xl border border-white/15 bg-gradient-to-b from-slate-900/80 to-black p-6 sm:p-8 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                    {selectedHub.zone} Operations Command
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
                  <span className="text-xs text-slate-400 font-mono">ID: {selectedHub.id}</span>
                </div>
                <h3 className="mt-1 text-2xl font-bold text-white font-display">
                  {selectedHub.name}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${selectedHub.contactPhone.replace(/[^0-9+]/g, '')}`}
                  className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-2 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
                >
                  <PhoneCall className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{selectedHub.contactPhone}</span>
                </a>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-center">
                <div className="text-[10px] uppercase font-mono text-slate-400">On-Site Arrival SLA</div>
                <div className="mt-1 text-lg font-bold text-amber-300 font-mono">&lt; {selectedHub.fieldDispatchSlaHours} Hours</div>
                <div className="text-[10px] text-slate-500">Metro Hub Dispatch</div>
              </div>

              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-center">
                <div className="text-[10px] uppercase font-mono text-slate-400">Remote Response</div>
                <div className="mt-1 text-lg font-bold text-cyan-300 font-mono">~{selectedHub.avgRemoteResponseMins} Mins</div>
                <div className="text-[10px] text-slate-500">Instant Triage</div>
              </div>

              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-center">
                <div className="text-[10px] uppercase font-mono text-slate-400">Mobile Field Units</div>
                <div className="mt-1 text-lg font-bold text-white font-mono">{selectedHub.activeEngineers} Active</div>
                <div className="text-[10px] text-slate-500">Equipped with Spares</div>
              </div>

              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-center">
                <div className="text-[10px] uppercase font-mono text-slate-400">Regional NOC Telemetry</div>
                <div className="mt-1 text-lg font-bold text-emerald-400 font-mono">{selectedHub.nocUptimePercentage}%</div>
                <div className="text-[10px] text-slate-500">Past 90 Days SLA</div>
              </div>
            </div>

            {/* Location & Facility Specs */}
            <div className="mt-6 space-y-4 text-xs">
              <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-black/40 p-3.5">
                <MapPin className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Facility & Logistics Address:</div>
                  <div className="text-slate-300 mt-0.5">{selectedHub.address}</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">{selectedHub.headquarters}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-black/40 p-3.5">
                <Server className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Primary Colocation & Peering:</div>
                  <div className="text-slate-300 mt-0.5">{selectedHub.primaryDataCenter}</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">Connected to Cloudflare Global Anycast Edge for sub-5ms DNS resolution.</div>
                </div>
              </div>
            </div>

            {/* Cities Covered Tags */}
            <div className="mt-6">
              <div className="text-xs font-semibold uppercase font-mono text-slate-400 mb-2">
                Rapid Metro Coverage Corridors:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedHub.citiesCovered.map((city: string) => (
                  <span
                    key={city}
                    className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300"
                  >
                    {city}
                  </span>
                ))}
              </div>
            </div>

            {/* Capabilities checklist */}
            <div className="mt-6 border-t border-white/10 pt-4">
              <div className="text-xs font-semibold uppercase font-mono text-slate-400 mb-2">
                Regional Hub Capabilities:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                {selectedHub.supportedServices.map((service: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                    <span>{service}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dispatch Action Box */}
            <div className="mt-8 rounded-xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-black p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-white">Need an engineer at your facility?</div>
                <div className="text-xs text-slate-400">Direct dispatch from {selectedHub.name} with spare components.</div>
              </div>
              <button
                onClick={() => onBookDispatch(selectedHub)}
                className="w-full sm:w-auto rounded-lg bg-white px-5 py-2.5 text-xs font-bold text-black hover:bg-slate-200 transition-colors cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap shadow-md"
              >
                <Truck className="h-3.5 w-3.5" />
                <span>Dispatch to {selectedHub.zone} Location</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
