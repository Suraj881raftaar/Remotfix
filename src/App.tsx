import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { CloudflareBadge } from './components/CloudflareBadge';
import { Hero } from './components/Hero';
import { DiagnosticEstimator } from './components/DiagnosticEstimator';
import { ServicesBento } from './components/ServicesBento';
import { SecurityProtocol } from './components/SecurityProtocol';
import { ContactSection } from './components/ContactSection';
import { FaqSection } from './components/FaqSection';
import { CareersPage } from './components/CareersPage';
import { Footer } from './components/Footer';
import { DnsGuideModal } from './components/DnsGuideModal';
import { ContactModal } from './components/ContactModal';
import { DiagnosticIssue } from './types';
import { MessageSquare } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'careers'>('home');
  const [isDnsGuideOpen, setIsDnsGuideOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedIssueForModal, setSelectedIssueForModal] = useState<DiagnosticIssue | null>(null);
  const [selectedOsForModal, setSelectedOsForModal] = useState<string>('windows');
  const [selectedCategoryForModal, setSelectedCategoryForModal] = useState<string>('');

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

  const handleNavigateCareers = () => {
    setCurrentView('careers');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col selection:bg-white selection:text-black">
      
      {/* 1-Row 3-Zone Top Navigation Bar */}
      <Navbar
        onOpenContact={handleOpenGeneralContact}
        onOpenDnsGuide={() => setIsDnsGuideOpen(true)}
        onScrollToSection={scrollToSection}
        onNavigateCareers={handleNavigateCareers}
        currentView={currentView}
      />

      {/* Cloudflare DNS & Domain Live Status Bar */}
      <CloudflareBadge onOpenGuide={() => setIsDnsGuideOpen(true)} />

      {/* Main View Router */}
      {currentView === 'careers' ? (
        <main className="flex-1">
          <CareersPage onBackToHome={handleBackToHome} />
        </main>
      ) : (
        <main className="flex-1">
          {/* Hero & Waitlist Section */}
          <Hero
            onOpenDiagnostic={() => scrollToSection('diagnostic')}
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
        onNavigateCareers={handleNavigateCareers}
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

      {/* Mobile Floating Quick-Action Bar */}
      <div className="fixed bottom-4 right-4 z-40 sm:hidden">
        <button
          onClick={handleOpenGeneralContact}
          className="flex items-center gap-2 rounded-full bg-cyan-400 px-4 py-2.5 text-xs font-bold text-black shadow-xl shadow-black/50 cursor-pointer"
          aria-label="Quick Support Contact"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Support</span>
        </button>
      </div>

    </div>
  );
}

