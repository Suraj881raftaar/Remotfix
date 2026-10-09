import { Ticket, DispatchedEmail } from '../types';

export function generateCustomerConfirmationEmail(ticket: Ticket): DispatchedEmail {
  const isOnSite = ticket.serviceType === 'onsite_dispatch';
  const toolName = isOnSite
    ? 'On-Site Certified Field Engineer Dispatch'
    : ticket.preferredTool === 'quick_assist'
    ? 'Microsoft Quick Assist'
    : 'AnyDesk Remote';
  const etaText = ticket.timing === 'immediate'
    ? isOnSite ? '< 90 Minutes (Rapid Field Dispatch)' : '~15 Minutes (Immediate Remote Queue)'
    : ticket.scheduledTime || 'Scheduled Slot';
  const hubInfo = ticket.regionalHubName || 'National Diagnostic Hub (Remote)';

  const plainText = `Hi ${ticket.customerName},

Thank you for trusting Remotfix — Regional IT Infrastructure & Managed Technology Services.
We have received your ${isOnSite ? 'On-Site Field Engineering' : 'Remote Diagnostic'} request for ticket #${ticket.id}.

TICKET & REGIONAL DISPATCH SUMMARY:
- Ticket ID: #${ticket.id}
- Service Type: ${isOnSite ? 'On-Site Field Dispatch' : 'Remote Diagnostic Session'}
- Regional Operations Hub: ${hubInfo}
- Operating System / Environment: ${ticket.os}
- Problem Category: ${ticket.category}
- Priority SLA: ${ticket.urgency}
- Estimated Arrival / Response: ${etaText}
- Assigned Method: ${toolName}
${isOnSite && ticket.siteAddress ? `- Service Location: ${ticket.siteAddress}` : ''}
${isOnSite && ticket.fieldUnit ? `- Assigned Field Unit: ${ticket.fieldUnit.engineerName} (${ticket.fieldUnit.unitCode}) - ETA: ${ticket.fieldUnit.eta}` : ''}

ISSUE DESCRIPTION:
${ticket.description}

NEXT STEPS:
${isOnSite
  ? `1. Our regional dispatch coordinator has routed this to the mobile engineering fleet.
2. The assigned certified field engineer will call/WhatsApp you before arrival.
3. Track your mobile technician en-route at:
   https://remotfix.in/track?ticket=${ticket.id}`
  : `1. Keep your computer turned on and connected to the internet.
2. A certified senior systems engineer (Lead Specialist: Suraj) is reviewing your case and will issue your one-time connection PIN.
3. You can join your Live Remote Session Room right now at:
   https://remotfix.in/track?ticket=${ticket.id}`}

SECURITY & COMPLIANCE GUARANTEE:
All Remotfix field engineers are background-verified and carry hardware testing equipment. All remote connections utilize 256-bit TLS bank-grade encryption with automatic session destruction.

Need immediate assistance? Reply directly to support@remotfix.in or call your regional dispatch desk.

Best regards,
Remotfix Regional Operations Center
https://remotfix.in`;

  return {
    id: `email-cust-${ticket.id}`,
    recipient: ticket.customerEmail,
    recipientRole: 'customer',
    from: 'Remotfix Regional Support <support@remotfix.in>',
    subject: `[Remotfix] ${isOnSite ? 'On-Site Field Dispatch' : 'Diagnostic Request'} Received – Ticket #${ticket.id}`,
    sentAt: new Date().toISOString(),
    previewText: `Your ${isOnSite ? 'field dispatch' : 'support'} request #${ticket.id} (${ticket.category}) is logged at ${hubInfo}.`,
    htmlBody: plainText
  };
}

export function generateAdminNotificationEmail(ticket: Ticket): DispatchedEmail {
  const isOnSite = ticket.serviceType === 'onsite_dispatch';
  const hubInfo = ticket.regionalHubName || 'National Remote Queue';

  const plainText = `⚡ URGENT REGIONAL OPERATIONS DISPATCH
New ${isOnSite ? 'ON-SITE FIELD DISPATCH' : 'REMOTE DIAGNOSTIC'} Request Received on remotfix.in

TICKET & REGION METRICS:
- Ticket ID: #${ticket.id}
- Regional Hub: ${hubInfo}
- Service Track: ${isOnSite ? 'ON-SITE FIELD ENGINEERING' : 'REMOTE SCREENSHARE DIAGNOSTIC'}
- Submission Time: ${new Date(ticket.createdAt).toLocaleString()}
- Priority SLA: ${ticket.urgency.toUpperCase()}
- Mode: ${ticket.timing === 'immediate' ? 'IMMEDIATE DISPATCH REQUIRED' : `SCHEDULED: ${ticket.scheduledTime}`}

CUSTOMER & SITE CONTACT:
- Name: ${ticket.customerName}
- Email: ${ticket.customerEmail}
- Phone / WhatsApp: ${ticket.customerPhone || 'Not provided'}
${isOnSite && ticket.siteAddress ? `- Physical Site Address: ${ticket.siteAddress}` : ''}
${isOnSite && ticket.pincode ? `- Regional Pincode: ${ticket.pincode}` : ''}

ENVIRONMENT SPECIFICATION:
- OS / Platform: ${ticket.os}
- Problem Category: ${ticket.category}
- Remote Tool Preference: ${ticket.preferredTool === 'quick_assist' ? 'Quick Assist (Win+Ctrl+Q)' : 'AnyDesk'}
${ticket.hardwareScope ? `- Hardware Scope: ${ticket.hardwareScope}` : ''}

REPORTED SYMPTOM / FAULT LOG:
${ticket.description}

OPERATIONAL ACTIONS REQUIRED:
1. Open Staff Operations Console:
   https://remotfix.in/console
${isOnSite
  ? `2. Dispatch mobile field engineer from ${hubInfo} and update ETA.
3. Coordinate hardware spares (NVMe, RAM, patch cables, switches) if replacement is anticipated.`
  : `2. Review crash symptoms, generate 6-digit Quick Assist PIN, or connect via AnyDesk.
3. If urgent, initiate bilateral chat or contact customer directly.`}

--
Remotfix Automated Regional Dispatch Engine
Operations Escalation: support@remotfix.in
Domain: remotfix.in (Cloudflare Anycast Protected)`;

  return {
    id: `email-admin-${ticket.id}`,
    recipient: 'support@remotfix.in',
    recipientRole: 'admin',
    from: 'Remotfix Regional Dispatcher <dispatcher@remotfix.in>',
    subject: `⚡ [REGIONAL DISPATCH] ${isOnSite ? 'On-Site Field' : 'Remote'} Request #${ticket.id} – ${ticket.customerName} (${ticket.urgency} · ${ticket.regionalZone?.toUpperCase() || 'REMOTE'})`,
    sentAt: new Date().toISOString(),
    previewText: `New ${isOnSite ? 'on-site' : 'remote'} request #${ticket.id} from ${ticket.customerName} assigned to ${hubInfo}.`,
    htmlBody: plainText
  };
}
