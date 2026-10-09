import { RegionalHub } from '../types';

export const REGIONAL_HUBS: RegionalHub[] = [
  {
    id: 'hub-north-delhincr',
    zoneId: 'north',
    name: 'North Zone Regional Hub (Delhi NCR)',
    zone: 'North',
    headquarters: 'Cyber City, DLF Phase 2, Gurugram, Haryana 122002',
    address: 'Remotfix Tier-3 NOC Facility, Tower B, Cyber City, Gurugram',
    citiesCovered: ['New Delhi', 'Gurugram', 'Noida', 'Faridabad', 'Ghaziabad', 'Chandigarh', 'Jaipur'],
    pincodePrefixes: ['110', '122', '201', '121', '160', '302'],
    status: 'Operational',
    activeEngineers: 16,
    avgRemoteResponseMins: 6,
    fieldDispatchSlaHours: 1.5,
    nocUptimePercentage: 99.98,
    primaryDataCenter: 'Equinix MB2 / Delhi Tier-4 Edge',
    contactPhone: '+91 (0124) 498-8821',
    supportedServices: [
      '24/7 Remote Helpdesk',
      'Rapid On-Site Field Dispatch (<90 mins)',
      'Enterprise SD-WAN & Firewall Clustering',
      'Hardware Depot & Rapid Component Swap',
      'Zero-Trust Cloud & Identity Engineering'
    ]
  },
  {
    id: 'hub-west-mumbai',
    zoneId: 'west',
    name: 'West Zone Regional Hub (Mumbai & Pune)',
    zone: 'West',
    headquarters: 'Bandra Kurla Complex (BKC), Bandra East, Mumbai 400051',
    address: 'Remotfix Operations Center, G-Block, BKC, Mumbai / Hinjawadi Pune Lab',
    citiesCovered: ['Mumbai', 'Navi Mumbai', 'Thane', 'Pune', 'Ahmedabad', 'Surat', 'Vadodara'],
    pincodePrefixes: ['400', '411', '401', '380', '395'],
    status: 'Operational',
    activeEngineers: 14,
    avgRemoteResponseMins: 8,
    fieldDispatchSlaHours: 2.0,
    nocUptimePercentage: 99.99,
    primaryDataCenter: 'CtrlS Mumbai DC-2 & Yotta NM1',
    contactPhone: '+91 (022) 6128-4400',
    supportedServices: [
      'High-Frequency Financial IT Infrastructure',
      'Enterprise Storage & SAN Disaster Recovery',
      'On-Site Server Rack & Patching Engineering',
      'Mac/PC Fleet Zero-Touch Provisioning',
      'Regulatory Compliance & Security Auditing'
    ]
  },
  {
    id: 'hub-south-blr',
    zoneId: 'south_blr',
    name: 'South Zone Hub 1 (Bengaluru Innovation Hub)',
    zone: 'South',
    headquarters: 'Outer Ring Road, Bellandur, Bengaluru, Karnataka 560103',
    address: 'Remotfix Tech Campus, RMZ Ecospace, Outer Ring Road, Bengaluru',
    citiesCovered: ['Bengaluru', 'Mysuru', 'Coimbatore', 'Kochi', 'Mangaluru'],
    pincodePrefixes: ['560', '570', '641', '682'],
    status: 'Operational',
    activeEngineers: 22,
    avgRemoteResponseMins: 5,
    fieldDispatchSlaHours: 1.5,
    nocUptimePercentage: 100.0,
    primaryDataCenter: 'NTT Cloud Bangalore / AWS ap-south-1 Edge',
    contactPhone: '+91 (080) 4591-2300',
    supportedServices: [
      'Developer Fleets & High-End Workstation Support',
      'Automated Apple Business Manager & Intune MDM',
      'Office Wi-Fi 6 Heatmapping & Multi-Gigabit Setup',
      'Cloud Migration (AWS, Azure, Google Cloud)',
      'Sub-15 Minute VIP Engineer Escalation'
    ]
  },
  {
    id: 'hub-south-hyd',
    zoneId: 'south_hyd',
    name: 'South Zone Hub 2 (Hyderabad & Chennai)',
    zone: 'South',
    headquarters: 'HITEC City, Madhapur, Hyderabad, Telangana 500081',
    address: 'Remotfix Regional Engineering Center, Phoenix Tech Park, HITEC City',
    citiesCovered: ['Hyderabad', 'Secunderabad', 'Chennai', 'Vijayawada', 'Visakhapatnam'],
    pincodePrefixes: ['500', '600', '520', '530'],
    status: 'Operational',
    activeEngineers: 15,
    avgRemoteResponseMins: 7,
    fieldDispatchSlaHours: 2.0,
    nocUptimePercentage: 99.97,
    primaryDataCenter: 'Sify Green Data Center Chennai / Hyderabad Edge',
    contactPhone: '+91 (040) 3389-7200',
    supportedServices: [
      '24/7 Managed NOC Telemetry & Monitoring',
      'Hybrid Active Directory & Entra ID Sync',
      'Cisco & Aruba Enterprise Switch Deployments',
      'On-Premises to Cloud Backup Immobility',
      'Emergency Motherboard & Power Hardware Swaps'
    ]
  },
  {
    id: 'hub-east-kolkata',
    zoneId: 'east',
    name: 'East Zone Regional Hub (Kolkata & Corridor)',
    zone: 'East',
    headquarters: 'Sector V, Salt Lake, Kolkata, West Bengal 700091',
    address: 'Remotfix Operations, Godrej Genesis, Sector V, Salt Lake, Kolkata',
    citiesCovered: ['Kolkata', 'Howrah', 'Bhubaneswar', 'Patna', 'Ranchi', 'Guwahati'],
    pincodePrefixes: ['700', '751', '800', '834', '781'],
    status: 'Operational',
    activeEngineers: 11,
    avgRemoteResponseMins: 9,
    fieldDispatchSlaHours: 2.5,
    nocUptimePercentage: 99.95,
    primaryDataCenter: 'Webel STPI Kolkata Edge & Cloudflare POP CCU',
    contactPhone: '+91 (033) 2357-1940',
    supportedServices: [
      'Branch Office Hybrid Connectivity',
      'Branch-to-HQ Secure Site-to-Site VPNs',
      'On-Site Desktop Refresh & Data Migration',
      'Antivirus & EDR Fleet Protection Deployment',
      'UPS & Power Quality Infrastructure Audit'
    ]
  }
];

export interface ManagedPillar {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  iconName: string;
  slaMetric: string;
  features: string[];
}

export const MANAGED_IT_PILLARS: ManagedPillar[] = [
  {
    id: 'regional-noc',
    number: '01',
    title: 'Regional Network Operations Center (NOC)',
    tagline: 'Continuous 24/7 Telemetry & Zero-Downtime Guarantee',
    description: 'Autonomous synthetic monitoring across all regional branch switches, firewalls, and ISP circuits with sub-second alert triaging.',
    iconName: 'Activity',
    slaMetric: '99.99% Uptime SLA',
    features: [
      'Multi-WAN SD-WAN failover (Airtel / Tata / Jio)',
      'Enterprise Firewall clustering (Fortinet & Sophos)',
      'Real-time packet loss, jitter & bandwidth heatmaps',
      'Automated circuit reboot & ISP ticket escalation'
    ]
  },
  {
    id: 'field-dispatch',
    number: '02',
    title: 'Rapid On-Site Field Engineering',
    tagline: 'Certified Mobile Engineers at Your Doorstep in <2 Hours',
    description: 'When remote software diagnostics hit hardware limits, our regional mobile vans dispatch with tested replacement parts and diagnostic equipment.',
    iconName: 'Truck',
    slaMetric: '<2hr Metro Arrival',
    features: [
      'Motherboard, RAM & NVMe SSD hot-swaps',
      'Rack mounting, patch panel & structured cabling',
      'UPS battery backup & PDU electrical inspection',
      'Executive home office / VIP workstation support'
    ]
  },
  {
    id: 'fleet-lifecycle',
    number: '03',
    title: 'Zero-Touch Fleet & Endpoint Lifecycle (MDM)',
    tagline: 'From Factory Sealed to Production Ready in 15 Minutes',
    description: 'Turnkey device enrollment, automated compliance baselines, and scheduled application patch rollouts across heterogeneous Mac, Windows, and Linux fleets.',
    iconName: 'Laptop',
    slaMetric: '100% Patch Compliance',
    features: [
      'Microsoft Intune & Apple Business Manager integration',
      'Automated silent patch deployment during off-hours',
      'Centralized asset tagging, warranty & lifecycle tracking',
      'Instant remote cryptographic wipe on lost/stolen hardware'
    ]
  },
  {
    id: 'cybersecurity-soc',
    number: '04',
    title: 'Regional SOC & Zero-Trust Cybersecurity',
    tagline: 'Proactive Threat Isolation Before Breach Escalation',
    description: 'Next-generation endpoint detection and response (EDR) coupled with DNS sanitization and behavioral anomaly detection.',
    iconName: 'ShieldAlert',
    slaMetric: '<10min Threat Quarantine',
    features: [
      'CrowdStrike / SentinelOne managed endpoint defense',
      'Cloudflare Zero Trust DNS and browser isolation',
      'Phishing simulation & employee awareness scoring',
      'Quarterly ISO 27001 & SOC-2 compliance documentation'
    ]
  },
  {
    id: 'cloud-identity',
    number: '05',
    title: 'Cloud & Hybrid Identity Architecture',
    tagline: 'Seamless Microsoft 365, Google Workspace & Entra ID',
    description: 'Architecting rock-solid identity governance, SSO single sign-on, conditional access policies, and tamper-proof cloud backups.',
    iconName: 'Cloud',
    slaMetric: 'RPO <1hr / RTO <2hr',
    features: [
      'Microsoft 365 & Google Workspace tenant management',
      'Hybrid Active Directory to Entra ID federation',
      'Immutable daily cloud backup for critical files & databases',
      'Automated employee onboarding & offboarding workflows'
    ]
  },
  {
    id: 'on-demand-remote',
    number: '06',
    title: 'Instant Remote Helpdesk & Diagnostic Ops',
    tagline: 'Zero-Friction Quick Assist & AnyDesk Triage',
    description: 'Instant remote connection without invasive agent installs. Users click a link, enter a 6-digit PIN, and watch technicians resolve issues in real time.',
    iconName: 'Zap',
    slaMetric: '<5min Response Time',
    features: [
      'Native Windows 10/11 Quick Assist (zero download)',
      'Cross-platform AnyDesk & browser fallback',
      'End-to-end encrypted TLS 1.3 session tunneling',
      'Comprehensive post-session diagnostic report generation'
    ]
  }
];

export function findRegionalHubByQuery(query: string): RegionalHub {
  const cleanQuery = query.toLowerCase().trim();
  if (!cleanQuery) return REGIONAL_HUBS[0];

  // Match city
  const cityMatch = REGIONAL_HUBS.find(hub => 
    hub.citiesCovered.some(city => city.toLowerCase().includes(cleanQuery) || cleanQuery.includes(city.toLowerCase()))
  );
  if (cityMatch) return cityMatch;

  // Match pincode prefix
  const pincodeMatch = REGIONAL_HUBS.find(hub =>
    hub.pincodePrefixes.some(p => cleanQuery.startsWith(p))
  );
  if (pincodeMatch) return pincodeMatch;

  // Match zone name
  if (cleanQuery.includes('delhi') || cleanQuery.includes('gurgaon') || cleanQuery.includes('noida') || cleanQuery.includes('north') || cleanQuery.includes('jaipur')) {
    return REGIONAL_HUBS[0];
  }
  if (cleanQuery.includes('mumbai') || cleanQuery.includes('pune') || cleanQuery.includes('west') || cleanQuery.includes('gujarat') || cleanQuery.includes('ahmedabad')) {
    return REGIONAL_HUBS[1];
  }
  if (cleanQuery.includes('bangalore') || cleanQuery.includes('bengaluru') || cleanQuery.includes('karnataka') || cleanQuery.includes('kochi') || cleanQuery.includes('mysore')) {
    return REGIONAL_HUBS[2];
  }
  if (cleanQuery.includes('hyderabad') || cleanQuery.includes('chennai') || cleanQuery.includes('tamil') || cleanQuery.includes('telangana') || cleanQuery.includes('andhra')) {
    return REGIONAL_HUBS[3];
  }
  if (cleanQuery.includes('kolkata') || cleanQuery.includes('bengal') || cleanQuery.includes('east') || cleanQuery.includes('odisha') || cleanQuery.includes('bihar')) {
    return REGIONAL_HUBS[4];
  }

  // Fallback to closest default (North)
  return REGIONAL_HUBS[0];
}
