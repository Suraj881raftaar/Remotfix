import { DiagnosticIssue } from '../types';

export const SUPPORTED_OS = [
  { id: 'windows', label: 'Windows 11 / 10', icon: 'Monitor' },
  { id: 'macos', label: 'macOS Sequoia / Sonoma', icon: 'Laptop' },
  { id: 'linux', label: 'Ubuntu / Debian / Fedora', icon: 'Terminal' },
  { id: 'server', label: 'Windows / Linux Server', icon: 'Server' },
];

export const DIAGNOSTIC_ISSUES: DiagnosticIssue[] = [
  {
    id: 'slow-pc',
    name: 'Sluggish Performance & System Freezes',
    category: 'Performance',
    description: 'Slow boot times, high CPU/RAM memory leaks, background bloatware, and registry fragmentation.',
    estimatedMinutes: 25,
    complexity: 'Standard',
    typicalSteps: [
      'Startup daemon and background service trimming',
      'System cache, junk registry, and temp storage clearance',
      'Hardware thermal and throttling diagnostics',
      'Disk defragmentation / TRIM SSD optimization'
    ]
  },
  {
    id: 'virus-malware',
    name: 'Virus, Ransomware & Spyware Removal',
    category: 'Security',
    description: 'Suspicious popups, hijacked browsers, rogue cryptographic processes, and rootkit infections.',
    estimatedMinutes: 45,
    complexity: 'Advanced',
    typicalSteps: [
      'Deep offline process inspection and rootkit detection',
      'Host file and DNS redirection sanitization',
      'Malicious browser extension eradication',
      'Installation and hardening of next-gen endpoint protection'
    ]
  },
  {
    id: 'bsod-crashes',
    name: 'Blue Screen (BSOD) / Kernel Panic Recovery',
    category: 'Crashes',
    description: 'Fatal crash loops, driver conflict dumps, memory corruption errors, and unexpected reboots.',
    estimatedMinutes: 35,
    complexity: 'Intermediate',
    typicalSteps: [
      'Crash minidump analysis & bugcheck isolation',
      'Driver signature and conflict remediation',
      'System file integrity scan (SFC / DISM scan)',
      'Memory test and corrupted registry restoration'
    ]
  },
  {
    id: 'network-vpn',
    name: 'Wi-Fi, DNS, VPN & Connectivity Troubles',
    category: 'Network',
    description: 'Frequent Wi-Fi drops, DNS resolution failures, VPN routing blocks, and local network discovery issues.',
    estimatedMinutes: 20,
    complexity: 'Standard',
    typicalSteps: [
      'TCP/IP stack reset and Winsock flush',
      'Cloudflare 1.1.1.1 / Google DNS configuration',
      'Network adapter driver reload and MTU optimization',
      'Firewall rule and port forwarding verification'
    ]
  },
  {
    id: 'cloud-email',
    name: 'Outlook, Microsoft 365 & Email Sync Fix',
    category: 'Cloud & Email',
    description: 'Broken PST/OST files, IMAP/Exchange sync loops, SPF/DKIM email delivery problems, and cloud backup setup.',
    estimatedMinutes: 30,
    complexity: 'Intermediate',
    typicalSteps: [
      'Mail profile and OST corruption rebuild',
      'IMAP / Exchange OAuth credential validation',
      'Cloud calendar & contacts synchronization',
      'Automated cloud backup setup (OneDrive / Drive)'
    ]
  },
  {
    id: 'storage-backup',
    name: 'SSD / HDD Health & Data Recovery Assistance',
    category: 'Storage',
    description: 'Failing S.M.A.R.T. disk warnings, partition table errors, accidental file deletions, and full drive migrations.',
    estimatedMinutes: 40,
    complexity: 'Advanced',
    typicalSteps: [
      'S.M.A.R.T. health telemetry and bad sector audit',
      'Non-destructive file carving and recovery scan',
      'Partition table and MBR/GPT restoration',
      'Secure external drive / cloud backup configuration'
    ]
  }
];

export const FAQ_ITEMS = [
  {
    question: 'How does remote IT support work with Remotfix?',
    answer:
      'You connect directly through a lightweight, secure browser-initiated remote session. You provide a single-use session code, and you can watch every move our certified technician makes in real time. Once the issue is resolved, the connection is instantly and permanently severed.'
  },
  {
    question: 'Is it completely safe and private?',
    answer:
      'Yes, 100%. Remotfix uses end-to-end 256-bit TLS encryption. We never install persistent background software, we cannot access your computer without your explicit one-time permission, and you can abort the session at any second with a single click.'
  },
  {
    question: 'What if my computer problem cannot be fixed remotely?',
    answer:
      'We operate under a Strict Resolution Guarantee. If our specialist identifies a physical hardware failure (such as a blown motherboard capacitor or mechanically dead hard drive spindle) that cannot be resolved remotely, we provide an actionable hardware replacement report at zero cost.'
  },
  {
    question: 'How is the remotfix.in domain configured?',
    answer:
      'remotfix.in is registered and routed through Cloudflare DNS with Edge SSL encryption, DDoS mitigation, and global CDN caching for ultra-low latency worldwide.'
  },
  {
    question: 'What do I get by joining the early-access waitlist?',
    answer:
      'Waitlist members receive guaranteed priority triage (bypassing the general queue), VIP ticket assignment, and a free initial 15-minute system health audit upon our official launch.'
  }
];

