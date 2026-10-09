export interface DiagnosticIssue {
  id: string;
  name: string;
  category: 'Performance' | 'Security' | 'Crashes' | 'Network' | 'Cloud & Email' | 'Storage';
  description: string;
  estimatedMinutes: number;
  complexity: 'Standard' | 'Intermediate' | 'Advanced';
  typicalSteps: string[];
}

export interface WaitlistSubmission {
  email: string;
  os: string;
  priorityPass: string;
  discountCode: string;
  position: number;
  timestamp: string;
}

export interface SupportInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  os: string;
  issueCategory: string;
  urgency: 'Standard' | 'Priority' | 'Emergency';
  description: string;
  timestamp: string;
  status: 'Received' | 'Queued' | 'Assigned';
}

export type TicketStatus =
  | 'received'
  | 'assigned'
  | 'connecting'
  | 'in_session'
  | 'resolved'
  | 'cancelled';

export type RemoteTool = 'quick_assist' | 'anydesk' | 'browser';

export interface TicketChatMessage {
  id: string;
  sender: 'customer' | 'technician' | 'system';
  text: string;
  timestamp: string;
}

export interface DispatchedEmail {
  id: string;
  recipient: string;
  recipientRole: 'customer' | 'admin';
  from: string;
  subject: string;
  sentAt: string;
  previewText: string;
  htmlBody: string;
}

export type ServiceType = 'remote' | 'onsite_dispatch' | 'managed_infrastructure';
export type RegionalZoneId = 'north' | 'west' | 'south_blr' | 'south_hyd' | 'east';
export type FieldDispatchStatus = 'queued' | 'dispatched' | 'en_route' | 'on_site' | 'completed';

export interface FieldUnitDispatch {
  engineerName: string;
  phone: string;
  unitCode: string;
  status: FieldDispatchStatus;
  eta: string;
  dispatchedAt?: string;
  notes?: string;
}

export interface RegionalHub {
  id: string;
  zoneId: RegionalZoneId;
  name: string;
  zone: 'North' | 'West' | 'South' | 'East';
  headquarters: string;
  address: string;
  citiesCovered: string[];
  pincodePrefixes: string[];
  status: 'Operational' | 'High Capacity' | 'Maintenance';
  activeEngineers: number;
  avgRemoteResponseMins: number;
  fieldDispatchSlaHours: number;
  nocUptimePercentage: number;
  primaryDataCenter: string;
  contactPhone: string;
  supportedServices: string[];
}

export interface Ticket {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  os: string;
  category: string;
  urgency: 'Standard' | 'Priority' | 'Emergency';
  timing: 'immediate' | 'scheduled';
  scheduledTime?: string;
  description: string;
  status: TicketStatus;
  serviceType?: ServiceType;
  regionalZone?: RegionalZoneId;
  regionalHubName?: string;
  siteAddress?: string;
  pincode?: string;
  hardwareScope?: string;
  fieldUnit?: FieldUnitDispatch;
  assignedTechnician?: string;
  preferredTool: RemoteTool;
  sessionCode?: string;
  resolutionSummary?: string;
  messages: TicketChatMessage[];
  emails?: DispatchedEmail[];
  createdAt: string;
  updatedAt: string;
}


