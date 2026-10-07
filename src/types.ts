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
