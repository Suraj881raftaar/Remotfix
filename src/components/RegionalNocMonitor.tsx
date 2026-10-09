import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  Server, 
  Wifi, 
  RefreshCw, 
  Cpu, 
  Globe2, 
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { REGIONAL_HUBS } from '../data/regionalHubsData';

interface TelemetryNode {
  id: string;
  name: string;
  zone: string;
  latencyMs: number;
  uptime: number;
  load: number;
  status: 'operational' | 'degraded' | 'maintenance';
  lastPing: string;
}

const INITIAL_NODES: TelemetryNode[] = [
  { id: 'delhi-noc', name: 'Delhi NCR Tier-3 NOC Core', zone: 'North', latencyMs: 4, uptime: 99.98, load: 42, status: 'operational', lastPing: 'Just now' },
  { id: 'mumbai-dc', name: 'Mumbai CtrlS Financial Core', zone: 'West', latencyMs: 6, uptime: 99.99, load: 68, status: 'operational', lastPing: 'Just now' },
  { id: 'blr-edge', name: 'Bengaluru Innovation Edge', zone: 'South', latencyMs: 5, uptime: 100.0, load: 55, status: 'operational', lastPing: 'Just now' },
  { id: 'hyd-ring', name: 'Hyderabad HITEC Fiber Ring', zone: 'South', latencyMs: 7, uptime: 99.97, load: 39, status: 'operational', lastPing: 'Just now' },
  { id: 'ccu-edge', name: 'Kolkata Sector-V Gateway', zone: 'East', latencyMs: 9, uptime: 99.95, load: 31, status: 'operational', lastPing: 'Just now' },
  { id: 'cf-anycast', name: 'Cloudflare Anycast Global Edge', zone: 'Global', latencyMs: 2, uptime: 100.0, load: 24, status: 'operational', lastPing: 'Just now' }
];

interface Incident {
  id: string;
  time: string;
  zone: string;
  severity: 'info' | 'resolved' | 'monitoring';
  message: string;
}

const SAMPLE_INCIDENTS: Incident[] = [
  {
    id: 'inc-1',
    time: '14 mins ago',
    zone: 'North',
    severity: 'resolved',
    message: 'Primary ISP peering glitch in Gurugram automatically failed over to secondary Tata Comms fiber. Zero packet drop recorded.'
  },
  {
    id: 'inc-2',
    time: '1 hour ago',
    zone: 'South',
    severity: 'info',
    message: 'Scheduled zero-downtime firmware patch applied to Bengaluru switch cluster BLR-SW-04. Health check verified clean.'
  },
  {
    id: 'inc-3',
    time: '3 hours ago',
    zone: 'Global',
    severity: 'resolved',
    message: 'Cloudflare WAF automatically blocked 14,290 malicious bot probes directed at diagnostic intake endpoints.'
  }
];

export const RegionalNocMonitor: React.FC = () => {
  const [nodes, setNodes] = useState<TelemetryNode[]>(INITIAL_NODES);
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Slight random jitter for real-time live telemetry feel
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => {
        const jitter = Math.floor(Math.random() * 3) - 1;
        const newLatency = Math.max(2, node.latencyMs + jitter);
        const loadJitter = Math.floor(Math.random() * 5) - 2;
        const newLoad = Math.min(95, Math.max(15, node.load + loadJitter));
        return {
          ...node,
          latencyMs: newLatency,
          load: newLoad,
          lastPing: 'A few seconds ago'
        };
      }));
      setLastRefreshed(new Date().toLocaleTimeString());
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setNodes(prev => prev.map(n => ({
        ...n,
        latencyMs: Math.max(2, n.latencyMs + (Math.random() > 0.5 ? 1 : -1)),
        lastPing: 'Just now'
      })));
      setLastRefreshed(new Date().toLocaleTimeString());
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="w-full bg-[#07080D] text-slate-100 py-16 border-b border-white/10" id="infrastructure-telemetry">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
                Regional NOC Live Telemetry
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400 font-mono">Updated: {lastRefreshed}</span>
            </div>
            <h3 className="mt-1 text-2xl font-bold text-white font-display">
              Autonomous Infrastructure & Edge Node Health
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleManualRefresh}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Poll Regional Edges</span>
            </button>
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/30 px-3 py-1.5 text-xs font-mono text-emerald-400 font-bold">
              99.98% Composite SLA
            </div>
          </div>
        </div>

        {/* Global Metrics Highlights */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-xl border border-white/5 bg-slate-900/40 p-4">
            <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
              <span>Avg Latency</span>
              <Activity className="h-3.5 w-3.5 text-cyan-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-white font-mono">5.2 ms</div>
            <div className="mt-1 text-[11px] text-emerald-400 font-mono">Sub-10ms national peering</div>
          </div>

          <div className="rounded-xl border border-white/5 bg-slate-900/40 p-4">
            <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
              <span>Active Field Units</span>
              <Cpu className="h-3.5 w-3.5 text-purple-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-white font-mono">78 Units</div>
            <div className="mt-1 text-[11px] text-slate-400 font-mono">Across 5 Metro Hubs</div>
          </div>

          <div className="rounded-xl border border-white/5 bg-slate-900/40 p-4">
            <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
              <span>Threat Defenses</span>
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-emerald-300 font-mono">100% Protected</div>
            <div className="mt-1 text-[11px] text-slate-400 font-mono">Cloudflare + EDR Sentinel</div>
          </div>

          <div className="rounded-xl border border-white/5 bg-slate-900/40 p-4">
            <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
              <span>Live Support Queue</span>
              <Zap className="h-3.5 w-3.5 text-amber-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-amber-300 font-mono">&lt; 3 mins</div>
            <div className="mt-1 text-[11px] text-slate-400 font-mono">Current diagnostic pickup</div>
          </div>
        </div>

        {/* Telemetry Node Table */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-black/70 overflow-hidden shadow-2xl">
          <div className="px-5 py-3 border-b border-white/10 bg-white/[0.02] flex items-center justify-between text-xs font-mono text-slate-400">
            <span>REGIONAL INFRASTRUCTURE NODE</span>
            <div className="flex items-center gap-6 sm:gap-12">
              <span className="hidden sm:inline">PEERING LATENCY</span>
              <span className="hidden sm:inline">CAPACITY LOAD</span>
              <span>UPTIME</span>
              <span>STATUS</span>
            </div>
          </div>

          <div className="divide-y divide-white/5">
            {nodes.map((node) => (
              <div 
                key={node.id} 
                className="px-5 py-3.5 flex items-center justify-between text-xs hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
                  <div>
                    <div className="font-semibold text-white flex items-center gap-2">
                      <span>{node.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-slate-300">
                        {node.zone}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      Ping checked {node.lastPing}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 sm:gap-12 font-mono">
                  <div className="hidden sm:block text-right w-16">
                    <span className="text-cyan-400 font-bold">{node.latencyMs}ms</span>
                  </div>

                  <div className="hidden sm:block text-right w-20">
                    <div className="text-slate-300">{node.load}%</div>
                    <div className="w-16 h-1 rounded-full bg-slate-800 mt-1 overflow-hidden ml-auto">
                      <div 
                        className={`h-full ${node.load > 70 ? 'bg-amber-400' : 'bg-cyan-400'}`} 
                        style={{ width: `${node.load}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="text-right w-16">
                    <span className="text-emerald-400 font-semibold">{node.uptime}%</span>
                  </div>

                  <div className="w-24 text-right">
                    <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                      <CheckCircle className="h-3 w-3" />
                      <span>Online</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Incident & Event Ticker */}
        <div className="mt-6 rounded-xl border border-white/10 bg-slate-900/30 p-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-3 border-b border-white/5">
            <span className="flex items-center gap-1.5 text-white font-semibold">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
              <span>Telemetry Event Log (Past 24 Hours)</span>
            </span>
            <span>Zero Unresolved Anomalies</span>
          </div>

          <div className="mt-3 space-y-2.5">
            {SAMPLE_INCIDENTS.map((inc) => (
              <div key={inc.id} className="flex items-start gap-3 text-xs">
                <span className="font-mono text-slate-500 text-[11px] shrink-0 mt-0.5">
                  [{inc.time}]
                </span>
                <span className="font-mono px-1.5 py-0.5 rounded text-[10px] bg-white/10 text-slate-300 shrink-0">
                  {inc.zone} Zone
                </span>
                <span className="text-slate-300 leading-relaxed">
                  {inc.message}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
