import { Ticket } from '../types';

export const INITIAL_MOCK_TICKETS: Ticket[] = [
  {
    id: 'RF-41820',
    customerName: 'Marcus Vance',
    customerEmail: 'm.vance@techcorp.io',
    customerPhone: '+1 (555) 392-1084',
    os: 'Windows 11 Pro',
    category: 'Blue Screen (BSOD) / Kernel Panic',
    urgency: 'Priority',
    timing: 'immediate',
    description: 'System crashes with CRITICAL_PROCESS_DIED every 40 minutes during video calls or compile jobs.',
    status: 'connecting',
    assignedTechnician: 'Suraj (Lead Systems Engineer)',
    preferredTool: 'quick_assist',
    sessionCode: '582 104',
    messages: [
      {
        id: 'msg-1',
        sender: 'system',
        text: 'Ticket created and queued for senior triage.',
        timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-2',
        sender: 'technician',
        text: 'Hello Marcus, I am looking into your minidump symptoms now. Please press Windows + Ctrl + Q to open Quick Assist and enter the 6-digit code above.',
        timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-3',
        sender: 'customer',
        text: 'Got it Suraj, opening Quick Assist now.',
        timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 1000).toISOString()
  },
  {
    id: 'RF-90412',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.rostova@designlab.co',
    customerPhone: '+44 7911 123456',
    os: 'macOS Sequoia (M2 Pro)',
    category: 'Sluggish Performance & High RAM Leak',
    urgency: 'Standard',
    timing: 'immediate',
    description: 'Memory usage stays at 94% even with no apps open. WindowServer process pegging 180% CPU.',
    status: 'received',
    preferredTool: 'anydesk',
    sessionCode: '',
    messages: [
      {
        id: 'msg-1',
        sender: 'system',
        text: 'Ticket logged successfully. Awaiting technician assignment.',
        timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 60 * 1000).toISOString()
  },
  {
    id: 'RF-77319',
    customerName: 'David K.',
    customerEmail: 'dklein@consulting.org',
    customerPhone: '+1 (555) 749-0199',
    os: 'Windows 10 Enterprise',
    category: 'Virus, Ransomware & Spyware Removal',
    urgency: 'Emergency',
    timing: 'immediate',
    description: 'Browser hijacked by rogue redirect and suspicious PowerShell script running in background.',
    status: 'resolved',
    assignedTechnician: 'Suraj (Lead Systems Engineer)',
    preferredTool: 'anydesk',
    sessionCode: '914 203 881',
    resolutionSummary: 'Sanitized malicious scheduled task "WinUpdateAssist.vbs". Restored default DNS resolver to 1.1.1.1. Removed hijacked Chrome search extensions. Performed full offline DISM & SFC file verification with zero remaining anomalies.',
    messages: [
      {
        id: 'msg-1',
        sender: 'system',
        text: 'Ticket created and prioritized under Emergency SLA.',
        timestamp: new Date(Date.now() - 140 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-2',
        sender: 'technician',
        text: 'AnyDesk remote connection established via secure 256-bit TLS handshake.',
        timestamp: new Date(Date.now() - 95 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-3',
        sender: 'technician',
        text: 'Threat neutralized. Running post-cleanup integrity checks.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-4',
        sender: 'system',
        text: 'Session closed and cryptographic connection credentials disposed.',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 140 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  }
];
