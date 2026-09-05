'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu, X, Shield } from 'lucide-react';
import { NavLinks } from './nav-links';
import { cn } from '@remotfix/ui';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);

  // Close mobile drawer on Escape key
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Focus close button when mobile drawer opens
  React.useEffect(() => {
    if (mobileMenuOpen) {
      closeButtonRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Accessibility: Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-slate-900 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent"
      >
        Skip to main content
      </a>

      {/* Top Mobile Bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background px-4 md:hidden">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label="Open navigation menu"
            className="inline-flex size-9 items-center justify-center rounded-md border border-border text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-base font-bold tracking-tight text-slate-900 dark:text-white"
          >
            <Shield className="size-5 text-accent" aria-hidden="true" />
            <span>REMOTFIX</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            Local Shell
          </span>
        </div>
      </header>

      {/* Mobile Drawer (Modal Navigation) */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation drawer"
          className="fixed inset-0 z-40 flex md:hidden"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-background border-r border-border p-4 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-base font-bold tracking-tight text-slate-900 dark:text-white"
              >
                <Shield className="size-5 text-accent" aria-hidden="true" />
                <span>REMOTFIX</span>
              </Link>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="inline-flex size-8 items-center justify-center rounded-md border border-border text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            <nav aria-label="Mobile navigation" className="mt-4 flex-1 overflow-y-auto">
              <NavLinks onNavigate={() => setMobileMenuOpen(false)} />
            </nav>

            <div className="pt-4 border-t border-border mt-auto">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>REMOTFIX Shell</span>
                <span className="inline-flex items-center gap-1 font-mono">
                  <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                  M2 Ready
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Layout Container */}
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside
          aria-label="Sidebar navigation"
          className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-border bg-slate-50/50 dark:bg-slate-950/40"
        >
          {/* Brand header */}
          <div className="flex h-14 items-center justify-between px-5 border-b border-border">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-base font-bold tracking-tight text-slate-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md px-1 py-0.5"
            >
              <Shield className="size-5 text-accent shrink-0" aria-hidden="true" />
              <span>REMOTFIX</span>
            </Link>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-200/70 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
              Dev
            </span>
          </div>

          {/* Navigation Links */}
          <nav aria-label="Main navigation" className="flex-1 px-3 py-4 overflow-y-auto">
            <NavLinks />
          </nav>

          {/* Desktop Sidebar Footer */}
          <div className="p-4 border-t border-border bg-slate-100/40 dark:bg-slate-900/40">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="truncate">Service Platform</span>
              <span className="font-mono text-[10px] bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                v0.1.0
              </span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col md:pl-64">
          <main
            id="main-content"
            tabIndex={-1}
            className="flex-1 p-5 md:p-8 outline-none focus:outline-none"
          >
            <div className="mx-auto max-w-6xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
