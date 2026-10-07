import React, { useState } from 'react';
import { 
  DIAGNOSTIC_ISSUES, 
  SUPPORTED_OS 
} from '../data/diagnosticData';
import { DiagnosticIssue } from '../types';
import { 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle,
  HelpCircle,
  Laptop,
  Monitor,
  Terminal,
  Server
} from 'lucide-react';

interface DiagnosticEstimatorProps {
  onSelectIssueForQuote: (issue: DiagnosticIssue, osId: string) => void;
}

export const DiagnosticEstimator: React.FC<DiagnosticEstimatorProps> = ({
  onSelectIssueForQuote
}) => {
  const [selectedOs, setSelectedOs] = useState('windows');
  const [selectedIssueId, setSelectedIssueId] = useState<string>(DIAGNOSTIC_ISSUES[0].id);

  const selectedIssue = DIAGNOSTIC_ISSUES.find((i) => i.id === selectedIssueId) || DIAGNOSTIC_ISSUES[0];

  const getOsIcon = (iconName: string) => {
    switch (iconName) {
      case 'Monitor': return <Monitor className="h-4 w-4" />;
      case 'Laptop': return <Laptop className="h-4 w-4" />;
      case 'Terminal': return <Terminal className="h-4 w-4" />;
      case 'Server': return <Server className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <section id="diagnostic" className="border-t border-white/10 bg-[#0B0E17] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            <span>Interactive Diagnostic Engine</span>
            <span aria-hidden="true">·</span>
            <span>remotfix.in</span>
          </div>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Estimate Your Problem Resolution Time & Scope.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            Select your operating environment and glitch symptom below to see the remote resolution protocol and estimated turnaround.
          </p>
        </div>

        {/* Step 1: OS Selector */}
        <div className="mt-10">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">
            1. Select Operating System
          </label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {SUPPORTED_OS.map((os) => (
              <button
                key={os.id}
                onClick={() => setSelectedOs(os.id)}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all cursor-pointer ${
                  selectedOs === os.id
                    ? 'border-white bg-white text-black font-semibold shadow-md'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <div className={selectedOs === os.id ? 'text-black' : 'text-slate-400'}>
                  {getOsIcon(os.icon)}
                </div>
                <span className="text-xs sm:text-sm">{os.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Issue Selector & Diagnostic Detail Split */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* Issue Cards */}
          <div className="lg:col-span-6 space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              2. Choose Symptom or Technical Issue
            </label>
            {DIAGNOSTIC_ISSUES.map((issue) => {
              const isSelected = issue.id === selectedIssueId;
              return (
                <div
                  key={issue.id}
                  onClick={() => setSelectedIssueId(issue.id)}
                  className={`rounded-xl border p-4 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-cyan-400/80 bg-cyan-950/20 shadow-lg shadow-cyan-950/40'
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-cyan-400 font-mono">[{issue.category}]</span>
                        <h4 className="text-sm font-semibold text-white">{issue.name}</h4>
                      </div>
                      <p className="mt-1 text-xs text-slate-300 line-clamp-2">
                        {issue.description}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-mono text-xs text-slate-400 block tabular-nums">~{issue.estimatedMinutes} min</span>
                      <span className="text-[11px] font-semibold text-cyan-400">{issue.complexity} Triage</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Diagnostic Protocol Output Panel */}
          <div className="lg:col-span-6">
            <div className="sticky top-24 rounded-2xl border border-white/15 bg-black/60 p-6 sm:p-8 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wide">
                    Diagnostic Protocol Specification
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    {selectedIssue.name}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Estimated Resolution</span>
                  <div className="flex items-center justify-end gap-1 font-mono text-cyan-400 font-bold">
                    <Clock className="h-4 w-4" />
                    <span>~{selectedIssue.estimatedMinutes} Minutes</span>
                  </div>
                </div>
              </div>

              {/* Protocol breakdown */}
              <div className="mt-6">
                <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                  Certified Remote Resolution Steps:
                </h5>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                  {selectedIssue.typicalSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Guarantees Box */}
              <div className="mt-6 rounded-lg bg-white/5 border border-white/10 p-4 text-xs text-slate-300 space-y-2">
                <div className="flex items-center gap-2 text-white font-medium">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Strict Zero Data Loss & Privacy Protection</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  All commands executed live on your screen. Remote tunnel terminated with cryptographic token disposal upon completion.
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] text-slate-400 block">Diagnostic Scope</span>
                  <span className="text-sm font-semibold text-white">
                    Direct Diagnostic Assessment{' '}
                    <span className="text-xs font-normal text-cyan-400">(Zero-Obligation Quote)</span>
                  </span>
                </div>
                <button
                  onClick={() => onSelectIssueForQuote(selectedIssue, selectedOs)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 px-5 py-2.5 text-xs font-bold text-black uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <span>Request Fix for This Issue</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>


            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
