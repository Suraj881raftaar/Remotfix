import { Ticket, DispatchedEmail } from '../types';

export function generateCustomerConfirmationEmail(ticket: Ticket): DispatchedEmail {
  const toolName = ticket.preferredTool === 'quick_assist' ? 'Microsoft Quick Assist' : 'AnyDesk Remote';
  const etaText = ticket.timing === 'immediate' ? '~15 Minutes (Immediate Queue)' : ticket.scheduledTime || 'Scheduled Slot';

  const plainText = `Hi ${ticket.customerName},

Thank you for choosing Remotfix. We have received your remote diagnostic request for ticket #${ticket.id}.

TICKET SUMMARY:
- Ticket ID: ${ticket.id}
- Operating System: ${ticket.os}
- Issue Category: ${ticket.category}
- Priority: ${ticket.urgency}
- Estimated Arrival: ${etaText}
- Preferred Tool: ${toolName}

ISSUE DESCRIPTION:
${ticket.description}

NEXT STEPS:
1. Keep your computer turned on and connected to the internet.
2. A certified senior technician (Lead Specialist: Suraj) is reviewing your case and will issue a 6-digit connection PIN.
3. You can join your Live Remote Session Room right now at:
   https://remotfix.in/track?ticket=${ticket.id}

SECURITY PROMISE:
All sessions use 256-bit TLS bank-grade encryption. You watch every action live on your screen and can sever connection instantly with one click.

Need immediate help? Reply to support@remotfix.in or message us on WhatsApp.

Best regards,
Remotfix Automated Helpdesk
https://remotfix.in`;

  return {
    id: `email-cust-${ticket.id}`,
    recipient: ticket.customerEmail,
    recipientRole: 'customer',
    from: 'Remotfix Support <support@remotfix.in>',
    subject: `[Remotfix] Diagnostic Request Received – Ticket #${ticket.id}`,
    sentAt: new Date().toISOString(),
    previewText: `Your support request #${ticket.id} for ${ticket.category} has been received.`,
    htmlBody: plainText
  };
}

export function generateAdminNotificationEmail(ticket: Ticket): DispatchedEmail {
  const plainText = `⚡ URGENT DISPATCH NOTIFICATION
New Diagnostic Request Received on remotfix.in

TICKET DETAILS:
- Ticket ID: ${ticket.id}
- Submission Time: ${new Date(ticket.createdAt).toLocaleString()}
- Priority SLA: ${ticket.urgency.toUpperCase()}
- Mode: ${ticket.timing === 'immediate' ? 'IMMEDIATE CONNECTION REQUEST' : `SCHEDULED: ${ticket.scheduledTime}`}

CUSTOMER CONTACT:
- Name: ${ticket.customerName}
- Email: ${ticket.customerEmail}
- Phone / WhatsApp: ${ticket.customerPhone || 'Not provided'}

SYSTEM SPECIFICATION:
- Operating System: ${ticket.os}
- Problem Category: ${ticket.category}
- Preferred Remote Tool: ${ticket.preferredTool === 'quick_assist' ? 'Quick Assist (Win+Ctrl+Q)' : 'AnyDesk'}

REPORTED SYMPTOM / ERROR:
${ticket.description}

DISPATCH ACTIONS REQUIRED:
1. Open Staff Console to accept ticket:
   https://remotfix.in/console
2. Generate 6-digit Quick Assist PIN or dispatch AnyDesk session address.
3. If urgent, contact customer directly at ${ticket.customerEmail} or ${ticket.customerPhone || 'via email'}.

--
Remotfix Automated Notification Dispatcher
Domain: remotfix.in (DNS via Cloudflare)`;

  return {
    id: `email-admin-${ticket.id}`,
    recipient: 'support@remotfix.in',
    recipientRole: 'admin',
    from: 'Remotfix Dispatch Engine <dispatcher@remotfix.in>',
    subject: `⚡ [URGENT DISPATCH] New Diagnostic Request #${ticket.id} – ${ticket.customerName} (${ticket.urgency})`,
    sentAt: new Date().toISOString(),
    previewText: `New ${ticket.urgency} request #${ticket.id} from ${ticket.customerName} (${ticket.os}).`,
    htmlBody: plainText
  };
}
