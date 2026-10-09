import React, { useState } from 'react';
import { Navbar, AppView } from './components/Navbar';
import { CloudflareBadge } from './components/CloudflareBadge';
import { Hero } from './components/Hero';
import { DiagnosticEstimator } from './components/DiagnosticEstimator';
import { ServicesBento } from './components/ServicesBento';
import { SecurityProtocol } from './components/SecurityProtocol';
import { ContactSection } from './components/ContactSection';
import { FaqSection } from './components/FaqSection';
import { CareersPage } from './components/CareersPage';
import { BookingWizard } from './components/BookingWizard';
import { TicketTracker } from './components/TicketTracker';
import { TechnicianConsole } from './components/TechnicianConsole';
import { Footer } from './components/Footer';
import { DnsGuideModal } from './components/DnsGuideModal';
import { ContactModal } from './components/ContactModal';
import { DiagnosticIssue } from './types';
import { MessageSquare, UserCheck, Activity, Zap } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [activeTrackTicketId, setActiveTrackTicketId] = useState<string | undefined>(undefined);
  const [isDnsGuideOpen, setIsDnsGuideOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedIssueForModal, setSelectedIssueForModal] = useState<DiagnosticIssue | null>(null);
  const [selectedOsForModal, setSelectedOsForModal] = useState<string>('windows');
  const [selectedCategoryForModal, setSelectedCategoryForModal] = useState<string>('');

  const navigateToView = (view: AppView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleOpenDiagnosticQuote = (issue: DiagnosticIssue, osId: string) => {
    setSelectedIssueForModal(issue);
    setSelectedOsForModal(osId);
    setSelectedCategoryForModal('');
    setIsContactModalOpen(true);
  };

  const handleOpenCategoryInquiry = (category: string) => {
    setSelectedIssueForModal(null);
    setSelectedCategoryForModal(category);
    setIsContactModalOpen(true);
  };

  const handleOpenGeneralContact = () => {
    setSelectedIssueForModal(null);
    setSelectedCategoryForModal('');
    setIsContactModalOpen(true);
  };

  const handleTicketCreated = (ticketId: string) => {
    setActiveTrackTicketId(ticketId);
    navigateToView('track');
  };

  const handleOpenCustomerTracker = (ticketId?: string) => {
    if (ticketId) {
      setActiveTrackTicketId(ticketId);
    }
    navigateToView('track');
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col selection:bg-white selection:text-black">
      
      {/* 1-Row 3-Zone Top Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigateView={navigateToView}
        onOpenContact={handleOpenGeneralContact}
        onOpenDnsGuide={() => setIsDnsGuideOpen(true)}
        onScrollToSection={scrollToSection}
      />

      {/* Cloudflare DNS & Domain Live Status Bar */}
      <CloudflareBadge onOpenGuide={() => setIsDnsGuideOpen(true)} />

      {/* Main View Router */}
      {currentView === 'book' ? (
        <main className="flex-1">
          <BookingWizard
            onTicketCreated={handleTicketCreated}
            onCancel={() => navigateToView('home')}
            onNavigateToConsole={() => navigateToView('console')}
          />
        </main>
      ) : currentView === 'track' ? (
        <main className="flex-1">
          <TicketTracker
            initialTicketId={activeTrackTicketId}
            onBookNew={() => navigateToView('book')}
            onSwitchToConsole={() => navigateToView('console')}
          />
        </main>
      ) : currentView === 'console' ? (
        <main className="flex-1">
          <TechnicianConsole
            onOpenCustomerTracker={handleOpenCustomerTracker}
            onBackToHome={() => navigateToView('home')}
          />
        </main>
      ) : currentView === 'careers' ? (
        <main className="flex-1">
          <CareersPage onBackToHome={() => navigateToView('home')} />
        </main>
      ) : (
        <main className="flex-1">
          {/* Quick MVP Test Callout Bar */}
          <div className="border-b border-cyan-500/20 bg-cyan-950/20 py-2.5 text-xs">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2 text-cyan-300 font-medium">
                <Zap className="h-3.5 w-3.5 text-cyan-400" />
                <span>
                  <strong>Remotfix MVP Testing Active:</strong> Try the live booking flow and 1-click remote session room.
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigateToView('book')}
                  className="text-white hover:text-cyan-300 underline underline-offset-4 cursor-pointer font-semibold"
                >
                  Book Test Session &rarr;
                </button>
                <span className="text-slate-600">|</span>
                <button
                  onClick={() => navigateToView('console')}
                  className="text-amber-300 hover:text-amber-200 underline underline-offset-4 cursor-pointer font-semibold"
                >
                  Staff Console &rarr;
                </button>
              </div>
            </div>
          </div>

          {/* Hero & Waitlist Section */}
          <Hero
            onOpenDiagnostic={() => navigateToView('book')}
            onOpenContact={() => scrollToSection('contact')}
          />

          {/* Interactive Diagnostic & Estimator */}
          <DiagnosticEstimator
            onSelectIssueForQuote={handleOpenDiagnosticQuote}
          />

          {/* Core Capabilities Bento Grid (01-04) */}
          <ServicesBento
            onOpenInquiry={handleOpenCategoryInquiry}
          />

          {/* 3-Step Zero-Trust Security Protocol */}
          <SecurityProtocol />

          {/* Direct Contact & Support Ticket Form */}
          <ContactSection />

          {/* FAQ Section */}
          <FaqSection />
        </main>
      )}

      {/* High-Contrast Quiet Footer */}
      <Footer
        onOpenDnsGuide={() => setIsDnsGuideOpen(true)}
        onOpenContact={() => scrollToSection('contact')}
        onNavigateView={navigateToView}
      />

      {/* Modals */}
      <DnsGuideModal
        isOpen={isDnsGuideOpen}
        onClose={() => setIsDnsGuideOpen(false)}
      />

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        prefilledIssue={selectedIssueForModal}
        prefilledOs={selectedOsForModal}
        prefilledCategory={selectedCategoryForModal}
      />

      {/* Testing Role Switcher Floating Control (Bottom Right) */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
        {currentView === 'console' ? (
          <button
            onClick={() => navigateToView('track')}
            className="flex items-center gap-2 rounded-full border border-cyan-400/40 bg-black/90 px-4 py-2.5 text-xs font-bold text-cyan-300 shadow-2xl backdrop-blur-md hover:bg-black transition-colors cursor-pointer"
          >
            <Activity className="h-4 w-4 text-cyan-400" />
            <span>Switch to Customer Room</span>
          </button>
        ) : (
          <button
            onClick={() => navigateToView('console')}
            className="flex items-center gap-2 rounded-full border border-amber-500/40 bg-black/90 px-4 py-2.5 text-xs font-bold text-amber-300 shadow-2xl backdrop-blur-md hover:bg-black transition-colors cursor-pointer"
          >
            <UserCheck className="h-4 w-4 text-amber-400" />
            <span>Staff Console (Suraj)</span>
          </button>
        )}
      </div>

    </div>
  );
}
