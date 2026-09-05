import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/app-shell';

export const metadata: Metadata = {
  title: 'REMOTFIX — Service Management Platform',
  description: 'Secure, multi-tenant service management and operational dispatch platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-background text-foreground">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
