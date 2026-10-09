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
  assignedTechnician?: string;
  preferredTool: RemoteTool;
  sessionCode?: string;
  resolutionSummary?: string;
  messages: TicketChatMessage[];
  createdAt: string;
  updatedAt: string;
}
