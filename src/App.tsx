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
import { RegionalHubExplorer } from './components/RegionalHubExplorer';
import { RegionalNocMonitor } from './components/RegionalNocMonitor';
import { ManagedItEstimator } from './components/ManagedItEstimator';
import { Footer } from './components/Footer';
import { DnsGuideModal } from './components/DnsGuideModal';
import { ContactModal } from './components/ContactModal';
import { DiagnosticIssue, ServiceType, RegionalHub } from './types';
import { REGIONAL_HUBS } from './data/regionalHubsData';
import { MessageSquare, UserCheck, Activity, Zap, Compass, Truck } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [activeTrackTicketId, setActiveTrackTicketId] = useState<string | undefined>(undefined);
  const [bookingServiceType, setBookingServiceType] = useState<ServiceType>('remote');
  const [bookingRegionalHub, setBookingRegionalHub] = useState<RegionalHub>(REGIONAL_HUBS[0]);
  
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

  const handleBookRegionalDispatch = (hub: RegionalHub) => {
    setBookingServiceType('onsite_dispatch');
    setBookingRegionalHub(hub);
    navigateToView('book');
  };

  const handleBookRemoteFix = () => {
    setBookingServiceType('remote');
    navigateToView('book');
  };

  const handleManagedItProposal = (details: {
    workstations: number;
    servers: number;
    branches: number;
    tier: string;
    estimatedCost: string;
  }) => {
    setSelectedCategoryForModal(`Managed IT Proposal (${details.tier} - ${details.estimatedCost}/mo)`);
    setIsContactModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col selection:bg-white selection:text-black">
      
      {/* 1-Row Navigation Bar */}
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
            initialServiceType={bookingServiceType}
            initialRegionalHub={bookingRegionalHub}
            onTicketCreated={handleTicketCreated}
            onCancel={() => navigateToView('home')}
            onNavigateToConsole={() => navigateToView('console')}
          />
        </main>
      ) : currentView === 'track' ? (
        <main className="flex-1">
          <TicketTracker
            initialTicketId={activeTrackTicketId}
            onBookNew={() => {
              setBookingServiceType('remote');
              navigateToView('book');
            }}
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
      ) : currentView === 'regional' ? (
        <main className="flex-1">
          {/* Regional Hubs & Infrastructure Command Center Dedicated View */}
          <RegionalHubExplorer
            onBookDispatch={handleBookRegionalDispatch}
            onBookRemote={handleBookRemoteFix}
          />
          <RegionalNocMonitor />
          <ManagedItEstimator onRequestProposal={handleManagedItProposal} />
        </main>
      ) : currentView === 'careers' ? (
        <main className="flex-1">
          <CareersPage onBackToHome={() => navigateToView('home')} />
        </main>
      ) : (
        <main className="flex-1">
          {/* Regional Infrastructure Callout Banner */}
          <div className="border-b border-cyan-500/20 bg-gradient-to-r from-cyan-950/30 via-slate-900 to-black py-2.5 text-xs">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2 text-cyan-300 font-medium">
                <Compass className="h-3.5 w-3.5 text-cyan-400" />
                <span>
                  <strong>Regional IT Infrastructure Active:</strong> 5 Metro Operations Hubs · Sub-15m Remote Triage & &lt;2hr Field Arrival.
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigateToView('regional')}
                  className="text-cyan-300 hover:text-white underline underline-offset-4 cursor-pointer font-semibold"
                >
                  Regional Hubs & NOC &rarr;
                </button>
                <span className="text-slate-600">|</span>
                <button
                  onClick={() => {
                    setBookingServiceType('onsite_dispatch');
                    navigateToView('book');
                  }}
                  className="text-amber-300 hover:text-amber-200 underline underline-offset-4 cursor-pointer font-semibold"
                >
                  Request Field Dispatch &rarr;
                </button>
              </div>
            </div>
          </div>

          {/* Hero Section */}
          <Hero
            onOpenDiagnostic={() => {
              setBookingServiceType('remote');
              navigateToView('book');
            }}
            onOpenContact={() => scrollToSection('contact')}
          />

          {/* Regional Hub Explorer Section */}
          <RegionalHubExplorer
            onBookDispatch={handleBookRegionalDispatch}
            onBookRemote={handleBookRemoteFix}
          />

          {/* Live Infrastructure Telemetry NOC */}
          <RegionalNocMonitor />

          {/* Interactive Diagnostic & Estimator */}
          <DiagnosticEstimator
            onSelectIssueForQuote={handleOpenDiagnosticQuote}
          />

          {/* Managed IT Contract Cost Calculator */}
          <ManagedItEstimator onRequestProposal={handleManagedItProposal} />

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

      {/* Footer */}
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

      {/* Floating Role Switcher Control */}
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
            <span>Operations Console (Suraj)</span>
          </button>
        )}
      </div>

    </div>
  );
}
