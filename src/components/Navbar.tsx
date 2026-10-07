import React, { useState } from 'react';
import { ShieldCheck, Menu, X, ArrowUpRight, Cpu } from 'lucide-react';

interface NavbarProps {
  onOpenContact: () => void;
  onOpenDnsGuide: () => void;
  onScrollToSection: (id: string) => void;
  onNavigateCareers: () => void;
  currentView: 'home' | 'careers';
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenContact,
  onOpenDnsGuide,
  onScrollToSection,
  onNavigateCareers,
  currentView
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    onScrollToSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#090A0F]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavClick('waitlist')}
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
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => handleNavClick('services')}
            className="transition-colors hover:text-white cursor-pointer"
          >
            Services
          </button>
          <button
            onClick={() => handleNavClick('diagnostic')}
            className="transition-colors hover:text-white cursor-pointer"
          >
            Instant Estimator
          </button>
          <button
            onClick={() => handleNavClick('security')}
            className="transition-colors hover:text-white cursor-pointer"
          >
            Security & Privacy
          </button>
          <button
            onClick={onNavigateCareers}
            className={`transition-colors cursor-pointer flex items-center gap-1.5 ${
              currentView === 'careers' ? 'text-cyan-400 font-bold' : 'hover:text-white text-slate-300'
            }`}
          >
            <span>Careers</span>
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
          </button>
          <button
            onClick={() => handleNavClick('faq')}
            className="transition-colors hover:text-white cursor-pointer"
          >
            FAQ
          </button>
          <button
            onClick={onOpenDnsGuide}
            className="flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 transition-colors cursor-pointer"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-orange-400" />
            <span>Cloudflare DNS</span>
          </button>
        </nav>


        {/* Zone 3: Primary actions */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onOpenContact}
            className="text-xs font-medium text-slate-300 hover:text-white px-3.5 py-2 transition-colors cursor-pointer"
          >
            Contact & Quote
          </button>
          <button
            onClick={() => handleNavClick('waitlist')}
            className="flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-black transition-all hover:bg-slate-200 cursor-pointer whitespace-nowrap shadow-sm hover:shadow-white/10"
          >
            <span>Early Access</span>
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
          <div className="flex flex-col gap-3 text-sm font-medium text-slate-300">
            <button
              onClick={() => handleNavClick('services')}
              className="text-left py-2 hover:text-white border-b border-white/5"
            >
              Services & Capabilities
            </button>
            <button
              onClick={() => handleNavClick('diagnostic')}
              className="text-left py-2 hover:text-white border-b border-white/5"
            >
              Instant Issue Estimator
            </button>
            <button
              onClick={() => handleNavClick('security')}
              className="text-left py-2 hover:text-white border-b border-white/5"
            >
              Security Protocol
            </button>
            <button
              onClick={() => {
                onNavigateCareers();
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 text-cyan-400 font-semibold border-b border-white/5 flex items-center justify-between"
            >
              <span>Careers & Hiring</span>
              <span className="text-[10px] bg-cyan-950 border border-cyan-500/30 text-cyan-300 px-2 py-0.5 rounded">Hiring</span>
            </button>
            <button
              onClick={() => handleNavClick('faq')}
              className="text-left py-2 hover:text-white border-b border-white/5"
            >
              FAQ
            </button>

            <button
              onClick={() => {
                onOpenDnsGuide();
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 text-amber-300 hover:text-amber-200 border-b border-white/5 flex items-center gap-2"
            >
              <ShieldCheck className="h-4 w-4 text-orange-400" />
              <span>Cloudflare DNS Management Guide</span>
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
                onClick={() => handleNavClick('waitlist')}
                className="w-full rounded-lg bg-white py-2.5 text-center text-xs font-semibold text-black hover:bg-slate-200"
              >
                Join Launch Waitlist (30% Off)
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
