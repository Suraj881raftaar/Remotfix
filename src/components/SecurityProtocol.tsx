import React from 'react';
import { KeyRound, Eye, LockKeyhole, ShieldCheck } from 'lucide-react';

export const SecurityProtocol: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'One-Time Generated Passcode',
      icon: KeyRound,
      description:
        'You initiate the connection by granting a randomized 6-digit session key. We can never connect to your machine unattended or without your explicit live authorization.'
    },
    {
      number: '02',
      title: 'Full Screen Transparency',
      icon: Eye,
      description:
        'Watch every diagnostic command, file check, and registry adjustment on your monitor in real time. You retain instant master mouse and keyboard override control at all times.'
    },
    {
      number: '03',
      title: 'Immediate Cryptographic Disposal',
      icon: LockKeyhole,
      description:
        'The moment your issue is resolved, clicking disconnect destroys the ephemeral session key and purges all temporary cached tokens. No residual backdoor is ever left behind.'
    }
  ];

  return (
    <section id="security" className="border-t border-white/10 bg-[#0B0D14] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            <ShieldCheck className="h-4 w-4" />
            <span>Zero-Trust Privacy Architecture</span>
          </div>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance">
            Your System & Data Privacy Remain 100% in Your Hands.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            Engineered with bank-grade 256-bit TLS encrypted streaming, ephemeral session tokens, and full customer visibility throughout every support session.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="font-mono text-2xl font-bold text-white/20">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-lg font-bold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 text-xs text-slate-400 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  <span>Enforced by Remotfix Protocol</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
