export type ServiceCategory =
  | 'Remote IT Support'
  | 'Desktop & Laptop Support'
  | 'Network Support'
  | 'Server Support'
  | 'Cloud & Backup'
  | 'Cybersecurity'
  | 'IT AMC';

export interface SupportRequestDraft {
  referenceId: string;
  contactName: string;
  companyName: string;
  email: string;
  phone: string;
  serviceCategory: ServiceCategory;
  urgency: 'Standard' | 'Priority';
  summary: string;
  authorizedConsent: boolean;
  createdAt: string;
}
