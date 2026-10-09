import { Ticket } from '../types';
import { generateCustomerConfirmationEmail, generateAdminNotificationEmail } from '../services/emailNotificationService';

const RAW_MOCK_TICKETS: Ticket[] = [
  {
    id: 'RF-41820',
    customerName: 'Marcus Vance',
    customerEmail: 'm.vance@techcorp.io',
    customerPhone: '+91 98110 32910',
    os: 'Windows 11 Pro (Dell Precision Workstation)',
    category: 'Blue Screen (BSOD) / Kernel Panic',
    urgency: 'Priority',
    timing: 'immediate',
    description: 'System crashes with CRITICAL_PROCESS_DIED every 40 minutes during video calls or render compile jobs.',
    status: 'connecting',
    serviceType: 'remote',
    regionalZone: 'north',
    regionalHubName: 'North Zone Regional Hub (Delhi NCR)',
    assignedTechnician: 'Suraj Yadav (Lead Systems Engineer)',
    preferredTool: 'quick_assist',
    sessionCode: '582 104',
    messages: [
      {
        id: 'msg-1',
        sender: 'system',
        text: 'Ticket created and routed to North Zone Tier-3 Regional NOC.',
        timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-2',
        sender: 'technician',
        text: 'Hello Marcus, I am analyzing your minidump trace. Please press Windows + Ctrl + Q to open Quick Assist and enter the 6-digit code: 582 104.',
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
    id: 'RF-88214',
    customerName: 'Ananya Deshmukh',
    customerEmail: 'ananya.d@fintechlabs.in',
    customerPhone: '+91 98201 44520',
    os: 'Windows 11 / Cisco Catalyst 2960 Stack',
    category: 'Network, Firewall & Wi-Fi 6 Drops',
    urgency: 'Emergency',
    timing: 'immediate',
    description: 'Main office core switch packet drop rate spiked to 38%. 25 workstations disconnected from local NAS and ERP gateway.',
    status: 'in_session',
    serviceType: 'onsite_dispatch',
    regionalZone: 'north',
    regionalHubName: 'North Zone Regional Hub (Delhi NCR)',
    siteAddress: 'Building 9A, Cyber City, DLF Phase 3, Gurugram 122002',
    pincode: '122002',
    hardwareScope: 'Cisco Core Switch, Cat6 Patch Panel & UPS Battery Failover',
    assignedTechnician: 'Amit Sharma (Senior Field Systems Specialist)',
    preferredTool: 'browser',
    fieldUnit: {
      engineerName: 'Amit Sharma',
      phone: '+91 98104 77219',
      unitCode: 'MOBILE-UNIT-NORTH-04',
      status: 'on_site',
      eta: 'Arrived at Site',
      dispatchedAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
      notes: 'Hardware replacement switch and Fluke cable tester brought on-site. Testing patch panel port 14-28.'
    },
    messages: [
      {
        id: 'msg-f1',
        sender: 'system',
        text: 'Emergency On-Site Field Dispatch dispatched from Gurugram Regional Hub.',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-f2',
        sender: 'technician',
        text: 'Engineer Amit Sharma dispatched with Mobile Unit #04. Vehicle en-route via Cyber City expressway.',
        timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-f3',
        sender: 'technician',
        text: 'Field Engineer checked in with building security. Entering server rack room now.',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
  },
  {
    id: 'RF-90412',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.rostova@designlab.co',
    customerPhone: '+91 80491 55210',
    os: 'macOS Sequoia (Apple M2 Pro Mac Studio)',
    category: 'Sluggish Performance & High RAM Leak',
    urgency: 'Standard',
    timing: 'immediate',
    description: 'Memory usage stays at 94% with WindowServer process pinning 180% CPU. Adobe Creative Cloud crashes on launch.',
    status: 'received',
    serviceType: 'remote',
    regionalZone: 'south_blr',
    regionalHubName: 'South Zone Hub 1 (Bengaluru Innovation Hub)',
    preferredTool: 'anydesk',
    sessionCode: '',
    messages: [
      {
        id: 'msg-1',
        sender: 'system',
        text: 'Ticket logged successfully. Routed to Bengaluru Regional Hub remote triage queue.',
        timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 60 * 1000).toISOString()
  },
  {
    id: 'RF-62105',
    customerName: 'Rajesh K. Mehta',
    customerEmail: 'rajesh.mehta@omnicloud.in',
    customerPhone: '+91 98450 11994',
    os: 'Ubuntu 24.04 LTS / Dell PowerEdge R640',
    category: 'Cloud, Active Directory & Hybrid Backups',
    urgency: 'Priority',
    timing: 'scheduled',
    scheduledTime: 'Today at 03:00 PM IST',
    description: 'Branch hypervisor migration and immutable backup verification across 40 developer workstations.',
    status: 'assigned',
    serviceType: 'onsite_dispatch',
    regionalZone: 'south_blr',
    regionalHubName: 'South Zone Hub 1 (Bengaluru Innovation Hub)',
    siteAddress: 'RMZ Ecoworld, Campus 4, Bellandur, Outer Ring Road, Bengaluru 560103',
    pincode: '560103',
    hardwareScope: 'Dual PowerEdge Rack, 10GbE SFP+ Fiber Transceiver, Synology NAS',
    assignedTechnician: 'Priya Nair (Principal Infrastructure Architect)',
    preferredTool: 'browser',
    fieldUnit: {
      engineerName: 'Priya Nair',
      phone: '+91 98455 33021',
      unitCode: 'MOBILE-UNIT-SOUTH-02',
      status: 'dispatched',
      eta: '45 mins',
      dispatchedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      notes: 'Staged optical fiber loopback test kits and verified backup recovery key storage.'
    },
    messages: [
      {
        id: 'msg-s1',
        sender: 'system',
        text: 'Regional Infrastructure Dispatch confirmed for Bengaluru Tech Corridor.',
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-s2',
        sender: 'technician',
        text: 'Field Architect Priya Nair assigned. Departure scheduled for 02:15 PM.',
        timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 18 * 60 * 1000).toISOString()
  },
  {
    id: 'RF-77319',
    customerName: 'David K.',
    customerEmail: 'dklein@consulting.org',
    customerPhone: '+91 99100 23488',
    os: 'Windows 10 Enterprise (Lenovo ThinkPad X1)',
    category: 'Virus, Ransomware & Spyware Removal',
    urgency: 'Emergency',
    timing: 'immediate',
    description: 'Browser hijacked by rogue redirect and suspicious PowerShell daemon executing persistence scripts.',
    status: 'resolved',
    serviceType: 'remote',
    regionalZone: 'north',
    regionalHubName: 'North Zone Regional Hub (Delhi NCR)',
    assignedTechnician: 'Suraj Yadav (Lead Systems Engineer)',
    preferredTool: 'anydesk',
    sessionCode: '914 203 881',
    resolutionSummary: 'Sanitized malicious scheduled task "WinUpdateAssist.vbs". Restored default DNS resolver to 1.1.1.1 (Cloudflare). Eradicated rogue Chrome telemetry extensions. Completed full offline DISM & SFC kernel scan with zero anomalies. Deployed Zero-Trust endpoint protection policy.',
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

export const INITIAL_MOCK_TICKETS: Ticket[] = RAW_MOCK_TICKETS.map((t) => ({
  ...t,
  emails: [generateCustomerConfirmationEmail(t), generateAdminNotificationEmail(t)]
}));
