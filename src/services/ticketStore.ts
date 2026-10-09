import { Ticket, TicketStatus, RemoteTool, TicketChatMessage, DispatchedEmail } from '../types';
import { INITIAL_MOCK_TICKETS } from '../data/mockTickets';
import { generateCustomerConfirmationEmail, generateAdminNotificationEmail } from './emailNotificationService';

const STORAGE_KEY = 'remotfix_mvp_tickets_v1';


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
  // Default to mock tickets
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
    preferredTool?: RemoteTool;
  }): Ticket {
    const randomId = Math.floor(10000 + Math.random() * 90000);
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
      preferredTool: data.preferredTool || (data.os.toLowerCase().includes('win') ? 'quick_assist' : 'anydesk'),
      sessionCode: '',
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'system',
          text: `Ticket RF-${randomId} logged. Assigned to automated priority dispatch.`,
          timestamp: new Date().toISOString()
        },
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'system',
          text: `Automated confirmation sent to ${data.customerEmail}. Dispatch alert sent to support@remotfix.in.`,
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

        // System message logging status transition
        const statusLabels: Record<TicketStatus, string> = {
          received: 'Ticket queued for specialist review.',
          assigned: `Technician ${ticket.assignedTechnician || 'Suraj'} assigned to ticket.`,
          connecting: 'Remote connection handshake initiated. One-time code generated.',
          in_session: 'Remote session active. Diagnostic commands in progress.',
          resolved: 'Session concluded. Resolution validated by technician.',
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
              text: `Technician ${techName} assigned to lead diagnostic.`,
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
