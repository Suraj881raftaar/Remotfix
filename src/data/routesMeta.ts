export interface SiteRouteMeta {
  path: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  sections: Array<{
    heading: string;
    body: string;
  }>;
  breadcrumbName: string;
  serviceName?: string;
}

export const SITE_ORIGIN = 'https://remotfix.in';

export const SITE_ROUTES: SiteRouteMeta[] = [
  {
    path: '/',
    title: 'Remotfix – Reliable IT Support & AMC for Growing Businesses',
    description:
      'Remote troubleshooting, workstation support, networking, server administration and IT AMC without maintaining a full-time IT team. Email support@remotfix.in.',
    h1: 'Reliable IT Support for Growing Businesses',
    intro:
      'Remote troubleshooting, workstation support, networking, server administration and Annual Maintenance Contracts (AMC) — without the cost of maintaining a full-time IT team.',
    breadcrumbName: 'Home',
    sections: [
      {
        heading: 'Core IT Support & AMC Services',
        body: 'Remotfix supports business workstations and laptops, office networking and Wi-Fi stability, server and cloud backup administration, cybersecurity hygiene, and predictable Annual Maintenance Contracts.'
      },
      {
        heading: 'Authorization-First Remote Support',
        body: 'Every remote support session requires explicit customer authorization, avoids unnecessary password sharing, restricts access strictly to the task duration, and ends cleanly once work is complete.'
      },
      {
        heading: 'Direct Engineering Support Desk',
        body: 'Accepting remote IT support requests and AMC proposals now. Email support@remotfix.in to schedule an infrastructure review or request troubleshooting.'
      }
    ]
  },
  {
    path: '/services',
    title: 'IT Support, Remote Support & AMC Services | Remotfix',
    description:
      'Explore Remotfix primary and secondary IT services: desktop support, networking, server administration, cloud backup, cybersecurity, and IT AMC.',
    h1: 'IT Support, Remote Support & AMC Services',
    intro:
      'Structured IT support and maintenance built for small and growing businesses that need dependable technology operations without full-time internal IT overhead.',
    breadcrumbName: 'Services',
    serviceName: 'Business IT Support & Annual Maintenance Contracts',
    sections: [
      {
        heading: 'Primary Offerings: IT Support, Remote IT Support & IT AMC',
        body: 'On-demand remote troubleshooting for urgent issues alongside scheduled Annual Maintenance Contracts covering workstations, office networks, and business servers.'
      },
      {
        heading: 'Secondary Technical Capabilities',
        body: 'Desktop & Laptop Support, Network Support, Server Support, Cloud & Backup Administration, Endpoint Cybersecurity Hygiene, and Remote Troubleshooting.'
      }
    ]
  },
  {
    path: '/services/remote-it-support',
    title: 'Remote IT Support & Desktop Troubleshooting | Remotfix',
    description:
      'Authorized remote troubleshooting and desktop & laptop support for Windows, macOS, and Linux systems in growing businesses. Contact support@remotfix.in.',
    h1: 'Remote IT Support & Desktop Troubleshooting',
    intro:
      'Fast, authorization-first remote troubleshooting and workstation maintenance for Windows, macOS, and Linux computers used by your team.',
    breadcrumbName: 'Remote IT Support',
    serviceName: 'Remote IT Support & Desktop Troubleshooting',
    sections: [
      {
        heading: 'What Remotfix Provides',
        body: 'Operating system troubleshooting, startup and performance optimization, software installation and configuration, email client repair, printer/peripheral setup, and malware cleanup.'
      },
      {
        heading: 'How Authorized Remote Support Works',
        body: 'Submit a request, approve a single-use session code, observe every action on screen, and terminate access immediately after resolution.'
      }
    ]
  },
  {
    path: '/services/it-amc',
    title: 'IT AMC Plans for Workstations, Networks & Servers | Remotfix',
    description:
      'Predictable IT Annual Maintenance Contracts covering workstations, office networks, and servers with preventive maintenance and structured SLAs.',
    h1: 'IT Annual Maintenance Contracts (IT AMC)',
    intro:
      'Predictable ongoing IT maintenance covering company workstations, office networking gear, and servers under transparent quarterly or annual terms.',
    breadcrumbName: 'IT AMC Plans',
    serviceName: 'IT Annual Maintenance Contracts (IT AMC)',
    sections: [
      {
        heading: 'Preventive Maintenance & Asset Coverage',
        body: 'Scheduled OS patching, workstation health checks, network router and switch reviews, server storage checks, and documented maintenance logs.'
      },
      {
        heading: 'Onboarding & Service Area',
        body: 'Remote IT AMC coverage across India and distributed remote teams, starting with an asset inventory and clear SLA scope agreement.'
      }
    ]
  },
  {
    path: '/services/infrastructure-security',
    title: 'Network, Server, Cloud Backup & Security Support | Remotfix',
    description:
      'Practical network troubleshooting, server administration, cloud backup verification, and endpoint cybersecurity hygiene for growing companies.',
    h1: 'Network, Server, Cloud Backup & Cybersecurity Support',
    intro:
      'Hands-on administration and troubleshooting for office networks, local or cloud servers, backup recovery drills, and practical endpoint security hygiene.',
    breadcrumbName: 'Infrastructure & Security',
    serviceName: 'Network, Server, Cloud Backup & Cybersecurity Support',
    sections: [
      {
        heading: 'Network, Server & Cloud Backup Administration',
        body: 'VLAN and Wi-Fi troubleshooting, firewall rule hygiene, Windows and Linux server maintenance, RAID monitoring, and regular backup restore verification.'
      },
      {
        heading: 'Practical Cybersecurity Hygiene',
        body: 'Patch cadence management, multi-factor authentication setup, least-privilege account audits, and malware remediation without exaggerated promises.'
      }
    ]
  },
  {
    path: '/about',
    title: 'About Remotfix – Remote IT Solutions & Support',
    description:
      'Learn how Remotfix helps growing businesses manage workstations, networks, and servers reliably without building a full-time internal IT department.',
    h1: 'About Remotfix',
    intro:
      'Guided by our mission — "REMOTE IT SOLUTIONS & SUPPORT" — Remotfix provides straightforward, accountable IT support and maintenance for growing organizations.',
    breadcrumbName: 'About',
    sections: [
      {
        heading: 'Practical IT Operations Without Bloat',
        body: 'We focus on clean documentation, transparent pricing, authorization-first remote sessions, and honest communication over inflated enterprise buzzwords.'
      },
      {
        heading: 'Business & Registration Disclosures',
        body: 'Official support contact: support@remotfix.in. Verified statutory registration details (Legal Entity Name, Office Address, GSTIN, Udyam/MSME, CIN/LLPIN) are maintained transparently on our About page.'
      }
    ]
  },
  {
    path: '/contact',
    title: 'Contact Remotfix – Request IT Support or AMC Quote',
    description:
      'Request remote IT troubleshooting or an IT AMC proposal from Remotfix. Reach our support desk directly at support@remotfix.in.',
    h1: 'Contact & Support Request Desk',
    intro:
      'Reach Remotfix directly for remote IT troubleshooting, workstation support, infrastructure reviews, or Annual Maintenance Contract proposals.',
    breadcrumbName: 'Contact',
    sections: [
      {
        heading: 'Direct Support Email',
        body: 'Email support@remotfix.in with your organization name, operating system or infrastructure scope, and urgency.'
      },
      {
        heading: 'Service Coverage',
        body: 'Remote IT support across India and remote-first teams during standard business hours, with priority escalation defined per AMC agreement.'
      }
    ]
  },
  {
    path: '/remote-support-terms',
    title: 'Remote Support Security & Session Terms | Remotfix',
    description:
      'How Remotfix protects your systems during remote IT support: explicit customer authorization, time-limited access, no unnecessary password sharing, and privacy.',
    h1: 'Remote Support Security & Authorization Terms',
    intro:
      'Clear security commitments governing every remote diagnostic or maintenance session conducted by Remotfix.',
    breadcrumbName: 'Remote Support Terms',
    sections: [
      {
        heading: 'Customer Authorization & Least Privilege',
        body: 'Remote access requires explicit customer consent, avoids unnecessary password sharing, remains limited to the task duration, and ends immediately once completed.'
      },
      {
        heading: 'Auditability & Confidentiality',
        body: 'Support activity is logged where technically possible and all customer files, configurations, and credentials are treated strictly confidentially.'
      }
    ]
  },
  {
    path: '/sla',
    title: 'Service Level Expectations (SLA) | Remotfix',
    description:
      'Transparent response targets, support hours, escalation paths, and maintenance exclusions for Remotfix IT support and AMC agreements.',
    h1: 'Service Level Expectations & Support Standards',
    intro:
      'Realistic, transparent response windows, support coverage hours, and maintenance boundaries defined in plain language.',
    breadcrumbName: 'SLA',
    sections: [
      {
        heading: 'Response Targets & Coverage Hours',
        body: 'Clear initial response targets for standard business-hour tickets and priority incidents, plus scheduled preventive maintenance windows.'
      },
      {
        heading: 'Scope & Third-Party Exclusions',
        body: 'Explicit boundaries covering upstream ISP outages, utility power failures, and manufacturer hardware replacement lead times.'
      }
    ]
  },
  {
    path: '/privacy-policy',
    title: 'Privacy Policy & Data Handling | Remotfix',
    description:
      'How Remotfix collects, handles, and protects inquiry details and confidential business data during IT support and AMC engagements.',
    h1: 'Privacy Policy',
    intro:
      'Remotfix collects only the information required to respond to your support inquiry and deliver authorized IT services.',
    breadcrumbName: 'Privacy Policy',
    sections: [
      {
        heading: 'Information Collected & Purpose',
        body: 'Contact names, business emails, and technical issue descriptions submitted voluntarily to support@remotfix.in are used solely for service delivery and communication.'
      },
      {
        heading: 'Confidentiality During Remote Sessions',
        body: 'Technicians access only systems and files needed for the authorized repair and never retain personal or proprietary business data unnecessarily.'
      }
    ]
  },
  {
    path: '/terms',
    title: 'Terms of Service | Remotfix IT Support',
    description:
      'Standard terms of service governing Remotfix remote IT troubleshooting, system administration, and Annual Maintenance Contract engagements.',
    h1: 'Terms of Service',
    intro:
      'Terms and conditions governing use of remotfix.in and engagement of Remotfix for remote IT support and maintenance contracts.',
    breadcrumbName: 'Terms of Service',
    sections: [
      {
        heading: 'Authorized Scope & Customer Responsibilities',
        body: 'Customers confirm ownership or administrative authority over systems serviced and maintain independent backups prior to major system changes.'
      },
      {
        heading: 'Acceptable Use & Limitation of Liability',
        body: 'Services are provided professionally on a best-practice basis; custom commercial liability terms are documented in signed AMC agreements.'
      }
    ]
  },
  {
    path: '/refund-policy',
    title: 'Refund & Cancellation Policy | Remotfix',
    description:
      'Clear refund, rescheduling, and cancellation policy for Remotfix remote IT support sessions and Annual Maintenance Contracts.',
    h1: 'Refund & Cancellation Policy',
    intro:
      'Transparent terms for cancelling scheduled remote support sessions, requesting refunds on unrendered work, and terminating Annual Maintenance Contracts.',
    breadcrumbName: 'Refund Policy',
    sections: [
      {
        heading: 'One-Time Remote Support & Scheduling',
        body: 'Sessions cancelled prior to technician engagement can be rescheduled or refunded in full; completed diagnostic time is billed transparently.'
      },
      {
        heading: 'Annual Maintenance Contract (AMC) Cancellations',
        body: 'Written cancellation terms, notice periods, and pro-rata settlement rules are stated clearly in each client AMC agreement or via support@remotfix.in.'
      }
    ]
  }
];
