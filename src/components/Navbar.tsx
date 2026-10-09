import React, { useState } from 'react';
import { ShieldCheck, Menu, X, ArrowUpRight, Cpu, Activity, UserCheck, Zap, Laptop } from 'lucide-react';

export type AppView = 'home' | 'book' | 'track' | 'console' | 'careers';

interface NavbarProps {
  currentView: AppView;
  onNavigateView: (view: AppView) => void;
  onOpenContact: () => void;
  onOpenDnsGuide: () => void;
  onScrollToSection: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigateView,
  onOpenContact,
  onOpenDnsGuide,
  onScrollToSection
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    if (currentView !== 'home') {
      onNavigateView('home');
      setTimeout(() => onScrollToSection(id), 100);
    } else {
      onScrollToSection(id);
    }
    setMobileMenuOpen(false);
  };

  const handleSwitchView = (view: AppView) => {
    onNavigateView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#090A0F]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSwitchView('home')}
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-white transition-opacity hover:opacity-90 font-display cursor-pointer"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black">
              <Cpu className="h-5 w-5" />
            </div>
            <span>
              remotfix<span className="text-cyan-400">.in</span>
            </span>
          </button>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => handleSwitchView('home')}
            className={`transition-colors cursor-pointer ${
              currentView === 'home' ? 'text-white font-bold' : 'hover:text-white text-slate-300'
            }`}
          >
            Overview
          </button>
          
          <button
            onClick={() => handleSwitchView('book')}
            className={`transition-colors cursor-pointer flex items-center gap-1.5 ${
              currentView === 'book' ? 'text-cyan-400 font-bold' : 'hover:text-white text-slate-300'
            }`}
          >
            <Zap className="h-3.5 w-3.5 text-cyan-400" />
            <span>Book Diagnostic</span>
          </button>

          <button
            onClick={() => handleSwitchView('track')}
            className={`transition-colors cursor-pointer flex items-center gap-1.5 ${
              currentView === 'track' ? 'text-cyan-400 font-bold' : 'hover:text-white text-slate-300'
            }`}
          >
            <Activity className="h-3.5 w-3.5 text-emerald-400" />
            <span>Track Room</span>
          </button>

          <button
            onClick={() => handleSwitchView('console')}
            className={`transition-colors cursor-pointer flex items-center gap-1.5 rounded-md px-2 py-1 text-xs ${
              currentView === 'console'
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold'
                : 'text-amber-300/80 hover:text-amber-200 border border-amber-400/20 bg-amber-400/5'
            }`}
            title="Switch to Technician / Staff Operations Console"
          >
            <UserCheck className="h-3.5 w-3.5 text-amber-400" />
            <span>Tech Console</span>
          </button>

          <button
            onClick={() => handleSwitchView('careers')}
            className={`transition-colors cursor-pointer flex items-center gap-1.5 ${
              currentView === 'careers' ? 'text-cyan-400 font-bold' : 'hover:text-white text-slate-300'
            }`}
          >
            <span>Careers</span>
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
          </button>

          <button
            onClick={onOpenDnsGuide}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-orange-400" />
            <span>Cloudflare</span>
          </button>
        </nav>

        {/* Zone 3: Primary actions */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => handleSwitchView('track')}
            className="text-xs font-medium text-slate-300 hover:text-white px-3 py-2 transition-colors cursor-pointer"
          >
            Track Status
          </button>
          <button
            onClick={() => handleSwitchView('book')}
            className="flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-black transition-all hover:bg-slate-200 cursor-pointer whitespace-nowrap shadow-sm hover:shadow-white/10"
          >
            <span>Book Fix Session</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center md:hidden gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-white/10 bg-[#0E111A] px-4 pt-3 pb-5 md:hidden">
          <div className="flex flex-col gap-2.5 text-sm font-medium text-slate-300">
            <button
              onClick={() => handleSwitchView('home')}
              className="text-left py-2 hover:text-white border-b border-white/5"
            >
              Overview & Services
            </button>
            <button
              onClick={() => handleSwitchView('book')}
              className="text-left py-2 text-cyan-400 font-bold border-b border-white/5 flex items-center justify-between"
            >
              <span>Book Diagnostic Session</span>
              <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">MVP</span>
            </button>
            <button
              onClick={() => handleSwitchView('track')}
              className="text-left py-2 text-emerald-400 font-bold border-b border-white/5 flex items-center justify-between"
            >
              <span>Track Ticket & Remote Room</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">Live</span>
            </button>
            <button
              onClick={() => handleSwitchView('console')}
              className="text-left py-2 text-amber-300 font-bold border-b border-white/5 flex items-center justify-between"
            >
              <span>Technician Staff Console</span>
              <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">Staff</span>
            </button>
            <button
              onClick={() => handleSwitchView('careers')}
              className="text-left py-2 text-cyan-400 border-b border-white/5 flex items-center justify-between"
            >
              <span>Careers & Hiring</span>
              <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded">Hiring</span>
            </button>
            <button
              onClick={() => {
                onOpenDnsGuide();
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 text-orange-400 border-b border-white/5 flex items-center gap-2"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Cloudflare DNS Guide</span>
            </button>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  onOpenContact();
                  setMobileMenuOpen(false);
                }}
                className="w-full rounded-lg border border-white/20 py-2.5 text-center text-xs font-semibold text-white hover:bg-white/5"
              >
                Direct Support & Quote
              </button>
              <button
                onClick={() => handleSwitchView('book')}
                className="w-full rounded-lg bg-white py-2.5 text-center text-xs font-semibold text-black hover:bg-slate-200"
              >
                Launch Diagnostic Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
