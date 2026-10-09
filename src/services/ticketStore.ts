import { 
  Ticket, 
  TicketStatus, 
  RemoteTool, 
  TicketChatMessage, 
  DispatchedEmail,
  ServiceType,
  RegionalZoneId,
  FieldDispatchStatus,
  FieldUnitDispatch
} from '../types';
import { INITIAL_MOCK_TICKETS } from '../data/mockTickets';
import { generateCustomerConfirmationEmail, generateAdminNotificationEmail } from './emailNotificationService';

const STORAGE_KEY = 'remotfix_regional_tickets_v2';

type Listener = (tickets: Ticket[]) => void;
const listeners: Set<Listener> = new Set();

function loadTickets(): Ticket[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((t: Ticket) => {
          if (!t.emails || t.emails.length === 0) {
            return {
              ...t,
              emails: [generateCustomerConfirmationEmail(t), generateAdminNotificationEmail(t)]
            };
          }
          return t;
        });
      }
    }
  } catch (err) {
    console.error('Failed to load tickets from localStorage:', err);
  }
  // Default to initial mock tickets
  saveTickets(INITIAL_MOCK_TICKETS);
  return INITIAL_MOCK_TICKETS;
}

function saveTickets(tickets: Ticket[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  } catch (err) {
    console.error('Failed to save tickets to localStorage:', err);
  }
}

let currentTickets: Ticket[] = loadTickets();

function notify() {
  saveTickets(currentTickets);
  listeners.forEach((listener) => listener([...currentTickets]));
}

export const ticketStore = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    listener([...currentTickets]);
    return () => {
      listeners.delete(listener);
    };
  },

  getAllTickets(): Ticket[] {
    return [...currentTickets];
  },

  getTicketById(id: string): Ticket | undefined {
    return currentTickets.find((t) => t.id.toLowerCase() === id.trim().toLowerCase());
  },

  createTicket(data: {
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    os: string;
    category: string;
    urgency: 'Standard' | 'Priority' | 'Emergency';
    timing: 'immediate' | 'scheduled';
    scheduledTime?: string;
    description: string;
    serviceType?: ServiceType;
    regionalZone?: RegionalZoneId;
    regionalHubName?: string;
    siteAddress?: string;
    pincode?: string;
    hardwareScope?: string;
    preferredTool?: RemoteTool;
  }): Ticket {
    const randomId = Math.floor(10000 + Math.random() * 90000);
    const isOnSite = data.serviceType === 'onsite_dispatch';

    const tempTicket: Ticket = {
      id: `RF-${randomId}`,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      os: data.os,
      category: data.category,
      urgency: data.urgency,
      timing: data.timing,
      scheduledTime: data.scheduledTime,
      description: data.description,
      status: 'received',
      serviceType: data.serviceType || 'remote',
      regionalZone: data.regionalZone || 'north',
      regionalHubName: data.regionalHubName || 'North Zone Regional Hub (Delhi NCR)',
      siteAddress: data.siteAddress,
      pincode: data.pincode,
      hardwareScope: data.hardwareScope,
      preferredTool: data.preferredTool || (data.os.toLowerCase().includes('win') ? 'quick_assist' : 'anydesk'),
      sessionCode: '',
      fieldUnit: isOnSite
        ? {
            engineerName: 'Pending Regional Assignment',
            phone: '+91 (0124) 498-8821',
            unitCode: 'DISPATCH-QUEUE',
            status: 'queued',
            eta: data.timing === 'immediate' ? '< 90 Mins' : data.scheduledTime || 'Scheduled'
          }
        : undefined,
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'system',
          text: `Ticket RF-${randomId} registered at ${data.regionalHubName || 'Regional Operations'}. Priority: ${data.urgency}.`,
          timestamp: new Date().toISOString()
        },
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'system',
          text: `Automated confirmation sent to ${data.customerEmail}. Dispatch copy alerted to support@remotfix.in.`,
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Generate real email notification records
    const custEmail = generateCustomerConfirmationEmail(tempTicket);
    const adminEmail = generateAdminNotificationEmail(tempTicket);

    const newTicket: Ticket = {
      ...tempTicket,
      emails: [custEmail, adminEmail]
    };

    currentTickets = [newTicket, ...currentTickets];
    notify();
    return newTicket;
  },

  updateStatus(id: string, status: TicketStatus, resolutionSummary?: string) {
    currentTickets = currentTickets.map((ticket) => {
      if (ticket.id === id) {
        const updated: Ticket = {
          ...ticket,
          status,
          updatedAt: new Date().toISOString(),
          ...(resolutionSummary ? { resolutionSummary } : {})
        };

        const statusLabels: Record<TicketStatus, string> = {
          received: 'Ticket queued for regional review.',
          assigned: `Specialist ${ticket.assignedTechnician || 'Suraj'} assigned to ticket.`,
          connecting: 'Handshake initiated. Connection code / dispatch active.',
          in_session: ticket.serviceType === 'onsite_dispatch' 
            ? 'On-site engineering inspection in progress at physical location.' 
            : 'Remote session active. Diagnostic commands in progress.',
          resolved: 'Session concluded. Technical resolution validated.',
          cancelled: 'Ticket cancelled.'
        };

        updated.messages = [
          ...updated.messages,
          {
            id: `msg-${Date.now()}`,
            sender: 'system',
            text: statusLabels[status] || `Status updated to ${status}.`,
            timestamp: new Date().toISOString()
          }
        ];

        return updated;
      }
      return ticket;
    });
    notify();
  },

  assignTechnician(id: string, techName: string) {
    currentTickets = currentTickets.map((ticket) => {
      if (ticket.id === id) {
        return {
          ...ticket,
          assignedTechnician: techName,
          status: ticket.status === 'received' ? 'assigned' : ticket.status,
          updatedAt: new Date().toISOString(),
          messages: [
            ...ticket.messages,
            {
              id: `msg-${Date.now()}`,
              sender: 'system',
              text: `Certified Specialist ${techName} assigned to oversee resolution.`,
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
      return ticket;
    });
    notify();
  },

  dispatchFieldUnit(
    id: string,
    engineerName: string,
    phone: string,
    unitCode: string,
    eta: string,
    notes?: string
  ) {
    currentTickets = currentTickets.map((ticket) => {
      if (ticket.id === id) {
        const fieldUnit: FieldUnitDispatch = {
          engineerName,
          phone,
          unitCode,
          status: 'dispatched',
          eta,
          dispatchedAt: new Date().toISOString(),
          notes
        };

        return {
          ...ticket,
          assignedTechnician: `${engineerName} (${unitCode})`,
          serviceType: 'onsite_dispatch',
          status: 'assigned',
          fieldUnit,
          updatedAt: new Date().toISOString(),
          messages: [
            ...ticket.messages,
            {
              id: `msg-${Date.now()}`,
              sender: 'system',
              text: `Mobile Field Unit ${unitCode} dispatched. Assigned Engineer: ${engineerName}. Estimated arrival: ${eta}.`,
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
      return ticket;
    });
    notify();
  },

  updateFieldStatus(id: string, status: FieldDispatchStatus, eta?: string, notes?: string) {
    currentTickets = currentTickets.map((ticket) => {
      if (ticket.id === id && ticket.fieldUnit) {
        const updatedUnit: FieldUnitDispatch = {
          ...ticket.fieldUnit,
          status,
          ...(eta ? { eta } : {}),
          ...(notes ? { notes } : {})
        };

        let newTicketStatus: TicketStatus = ticket.status;
        if (status === 'on_site') newTicketStatus = 'in_session';
        if (status === 'completed') newTicketStatus = 'resolved';

        const label = status === 'en_route'
          ? `Field Engineer ${updatedUnit.engineerName} is en route. ETA: ${updatedUnit.eta}.`
          : status === 'on_site'
          ? `Field Engineer arrived on-site. Physical diagnostics active.`
          : status === 'completed'
          ? `On-site work completed and signed off.`
          : `Field unit status updated to ${status}.`;

        return {
          ...ticket,
          status: newTicketStatus,
          fieldUnit: updatedUnit,
          updatedAt: new Date().toISOString(),
          messages: [
            ...ticket.messages,
            {
              id: `msg-${Date.now()}`,
              sender: 'system',
              text: label,
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
      return ticket;
    });
    notify();
  },

  setSessionCode(id: string, tool: RemoteTool, code: string) {
    currentTickets = currentTickets.map((ticket) => {
      if (ticket.id === id) {
        return {
          ...ticket,
          preferredTool: tool,
          sessionCode: code,
          status: 'connecting',
          updatedAt: new Date().toISOString(),
          messages: [
            ...ticket.messages,
            {
              id: `msg-${Date.now()}`,
              sender: 'technician',
              text: `Security code generated for ${tool === 'quick_assist' ? 'Quick Assist' : 'AnyDesk'}: ${code}. Ready when you are!`,
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
      return ticket;
    });
    notify();
  },

  addMessage(id: string, sender: 'customer' | 'technician', text: string) {
    currentTickets = currentTickets.map((ticket) => {
      if (ticket.id === id) {
        const newMsg: TicketChatMessage = {
          id: `msg-${Date.now()}`,
          sender,
          text,
          timestamp: new Date().toISOString()
        };
        return {
          ...ticket,
          messages: [...ticket.messages, newMsg],
          updatedAt: new Date().toISOString()
        };
      }
      return ticket;
    });
    notify();
  },

  resetDemoData() {
    currentTickets = [...INITIAL_MOCK_TICKETS];
    notify();
  },

  deleteTicket(id: string) {
    currentTickets = currentTickets.filter((t) => t.id !== id);
    notify();
  }
};
