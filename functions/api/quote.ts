export interface QuoteEnv {
  RESEND_API_KEY?: string;
  RESEND_KEY?: string;
  RESEND_TOKEN?: string;
  RESEND_SECRET_KEY?: string;
  EMAIL_API_KEY?: string;
  QUOTE_FROM_EMAIL?: string;
  RESEND_FROM_EMAIL?: string;
  FROM_EMAIL?: string;
  QUOTE_TO_EMAIL?: string;
  RESEND_TO_EMAIL?: string;
  TO_EMAIL?: string;
  TURNSTILE_SECRET_KEY?: string;
}

export interface PagesEventContext<Env = QuoteEnv> {
  request: Request;
  env: Env;
  params: Record<string, string | string[]>;
  waitUntil: (promise: Promise<unknown>) => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
}

type RequestType = 'support' | 'amc';

const ALLOWED_SERVICE_CATEGORIES = new Set([
  'Remote IT Support',
  'Desktop & Laptop Support',
  'Network Support',
  'Server Support',
  'Cloud & Backup',
  'Cybersecurity',
  'IT AMC',
]);

const EMAIL_REGEX = /^[^\s@<>,;\\/"']+@[^\s@<>,;\\/"']+\.[^\s@<>,;\\/"']{2,}$/;
const PHONE_REGEX = /^[+\d\s().-]{7,20}$/;
const PAGE_PATH_REGEX = /^\/[a-zA-Z0-9/_-]{0,79}$/;
const URL_PATTERN = /(?:https?:\/\/|www\.)\S+/gi;

const MAX_BODY_BYTES = 16 * 1024;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_IP_REQUESTS = 5;
const RATE_LIMIT_MAX_EMAIL_REQUESTS = 3;
const MAX_TRACKED_KEYS = 2000;
const MAX_URLS_IN_MESSAGE = 3;

const ipRequestLog = new Map<string, number[]>();
const emailRequestLog = new Map<string, number[]>();

const SECURITY_JSON_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
};

function jsonResponse(body: Record<string, unknown>, status: number, extraHeaders?: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...SECURITY_JSON_HEADERS,
      ...(extraHeaders || {}),
    },
  });
}

function sanitizeSingleLine(value: unknown, maxLen: number): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[\r\n\t\x00-\x1F\x7F]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLen);
}

function sanitizeMultiline(value: unknown, maxLen: number): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/\r\n/g, '\n')
    .trim()
    .slice(0, maxLen);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getClientIp(request: Request): string {
  const cfIp = request.headers.get('CF-Connecting-IP');
  if (cfIp && cfIp.trim()) return cfIp.trim().slice(0, 64);

  const forwarded = request.headers.get('X-Forwarded-For');
  if (forwarded && forwarded.trim()) {
    return forwarded.split(',')[0].trim().slice(0, 64);
  }

  return 'unknown';
}

function checkSlidingWindow(
  store: Map<string, number[]>,
  key: string,
  maxRequests: number,
  now: number
): { allowed: boolean; retryAfterSec: number } {
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  if (store.size >= MAX_TRACKED_KEYS) {
    for (const [trackedKey, timestamps] of store.entries()) {
      const recent = timestamps.filter((ts) => ts > windowStart);
      if (recent.length === 0) {
        store.delete(trackedKey);
      } else {
        store.set(trackedKey, recent);
      }
    }
    if (store.size >= MAX_TRACKED_KEYS) {
      store.clear();
    }
  }

  const existing = (store.get(key) || []).filter((ts) => ts > windowStart);
  if (existing.length >= maxRequests) {
    const oldestInWindow = existing[0];
    const retryAfterSec = Math.max(1, Math.ceil((oldestInWindow + RATE_LIMIT_WINDOW_MS - now) / 1000));
    store.set(key, existing);
    return { allowed: false, retryAfterSec };
  }

  existing.push(now);
  store.set(key, existing);
  return { allowed: true, retryAfterSec: 0 };
}

export function resetQuoteRateLimiterForTest(): void {
  ipRequestLog.clear();
  emailRequestLog.clear();
}

async function verifyTurnstile(secret: string, token: string, clientIp: string): Promise<boolean> {
  if (!token) return false;
  try {
    const formData = new URLSearchParams();
    formData.set('secret', secret);
    formData.set('response', token);
    if (clientIp !== 'unknown') {
      formData.set('remoteip', clientIp);
    }

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    });
    if (!res.ok) return false;
    const outcome = (await res.json()) as { success?: boolean };
    return outcome.success === true;
  } catch {
    return false;
  }
}

function generateReferenceId(prefix: 'RF' | 'AMC'): string {
  const bytes = new Uint32Array(1);
  crypto.getRandomValues(bytes);
  const sixDigits = 100000 + (bytes[0] % 900000);
  return `${prefix}-${sixDigits}`;
}

function countUrls(text: string): number {
  const matches = text.match(URL_PATTERN);
  return matches ? matches.length : 0;
}

function buildEmailContent(params: {
  referenceId: string;
  requestType: RequestType;
  serviceRequested: string;
  urgencyLabel: string;
  contactName: string;
  companyName: string;
  email: string;
  phone: string;
  pagePath: string;
  submittedAt: string;
  details: Array<{ label: string; value: string }>;
  notesLabel: string;
  notesValue: string;
}): { subject: string; html: string; text: string } {
  const typeLabel = params.requestType === 'amc' ? 'IT AMC Quote Request' : 'IT Support Request';
  const subject = sanitizeSingleLine(
    `New Remotfix Quote Request – ${params.serviceRequested} (${params.referenceId})`,
    150
  );

  const rowsHtml = [
    { label: 'Reference ID', value: params.referenceId },
    { label: 'Inquiry Channel', value: typeLabel },
    { label: 'Service Requested', value: params.serviceRequested },
    { label: 'Urgency / Coverage', value: params.urgencyLabel },
    { label: 'Contact Name', value: params.contactName },
    { label: 'Company / Organization', value: params.companyName || 'Not specified' },
    { label: 'Email Address', value: params.email },
    { label: 'Phone Number', value: params.phone || 'Not provided' },
    ...params.details,
    { label: 'Submitted Page', value: params.pagePath || '/' },
    { label: 'Submitted (UTC)', value: params.submittedAt },
  ]
    .map(
      (row) => `
      <tr>
        <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;font-weight:600;color:#334155;width:36%;vertical-align:top;">${escapeHtml(row.label)}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;color:#0f172a;vertical-align:top;">${escapeHtml(row.value)}</td>
      </tr>`
    )
    .join('');

  const safeNotesHtml = escapeHtml(params.notesValue || 'None provided').replace(/\n/g, '<br />');

  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:24px;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0f172a;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #cbd5e1;border-radius:12px;overflow:hidden;">
      <tr>
        <td style="padding:20px 24px;background-color:#090a0f;color:#f8fafc;">
          <div style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#67e8f9;font-weight:700;">Remotfix · REMOTE IT SOLUTIONS &amp; SUPPORT</div>
          <h1 style="margin:6px 0 0 0;font-size:20px;line-height:1.3;color:#ffffff;">New Quote Request: ${escapeHtml(params.serviceRequested)} (${escapeHtml(params.referenceId)})</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;">
            ${rowsHtml}
          </table>
          <div style="margin-top:20px;padding:16px;background-color:#f1f5f9;border:1px solid #e2e8f0;border-radius:8px;">
            <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#475569;margin-bottom:8px;">${escapeHtml(params.notesLabel)}</div>
            <div style="font-size:14px;line-height:1.6;color:#0f172a;">${safeNotesHtml}</div>
          </div>
          <p style="margin:20px 0 0 0;font-size:12px;color:#64748b;">
            Submitted via https://remotfix.in quote &amp; support intake. Reply directly to respond to ${escapeHtml(params.email)}.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const textLines = [
    `NEW REMOTFIX QUOTE REQUEST - ${params.serviceRequested.toUpperCase()}`,
    `Reference ID: ${params.referenceId}`,
    `Inquiry Channel: ${typeLabel}`,
    `Service Requested: ${params.serviceRequested}`,
    `Urgency / Coverage: ${params.urgencyLabel}`,
    `Contact Name: ${params.contactName}`,
    `Company: ${params.companyName || 'Not specified'}`,
    `Email: ${params.email}`,
    `Phone: ${params.phone || 'Not provided'}`,
    ...params.details.map((d) => `${d.label}: ${d.value}`),
    `Submitted Page: ${params.pagePath || '/'}`,
    `Submitted (UTC): ${params.submittedAt}`,
    '',
    `${params.notesLabel}:`,
    params.notesValue || 'None provided',
  ];

  return { subject, html, text: textLines.join('\n') };
}

export async function onRequestPost(context: PagesEventContext<QuoteEnv>): Promise<Response> {
  const { request, env } = context;

  const contentType = request.headers.get('Content-Type') || '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return jsonResponse({ ok: false, error: 'Requests must use application/json.' }, 415);
  }

  const contentLengthHeader = request.headers.get('Content-Length');
  if (contentLengthHeader) {
    const declaredLength = Number(contentLengthHeader);
    if (!Number.isFinite(declaredLength) || declaredLength > MAX_BODY_BYTES) {
      return jsonResponse({ ok: false, error: 'Request payload is too large.' }, 413);
    }
  }

  let rawText = '';
  try {
    rawText = await request.text();
  } catch {
    return jsonResponse({ ok: false, error: 'Unable to read request body.' }, 400);
  }

  if (rawText.length > MAX_BODY_BYTES) {
    return jsonResponse({ ok: false, error: 'Request payload exceeds maximum allowed size.' }, 413);
  }

  let payload: Record<string, unknown>;
  try {
    const parsed = JSON.parse(rawText);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return jsonResponse({ ok: false, error: 'Invalid JSON request payload.' }, 400);
    }
    payload = parsed as Record<string, unknown>;
  } catch {
    return jsonResponse({ ok: false, error: 'Malformed JSON body.' }, 400);
  }

  // 1. Silent honeypot drop
  const honeypotCandidates = [payload.honeypot, payload.companyWebsite, payload.website];
  const honeypotTriggered = honeypotCandidates.some(
    (val) => typeof val === 'string' && val.trim().length > 0
  );
  if (honeypotTriggered) {
    return jsonResponse(
      {
        ok: true,
        referenceId: 'RF-000000',
        message: 'Your inquiry has been received.',
      },
      200
    );
  }

  // 2. Per-IP Rate Limiting
  const now = Date.now();
  const clientIp = getClientIp(request);
  const ipRateCheck = checkSlidingWindow(ipRequestLog, clientIp, RATE_LIMIT_MAX_IP_REQUESTS, now);
  if (!ipRateCheck.allowed) {
    return jsonResponse(
      {
        ok: false,
        error: `Too many requests submitted. Please wait ${ipRateCheck.retryAfterSec} seconds before trying again.`,
      },
      429,
      { 'Retry-After': String(ipRateCheck.retryAfterSec) }
    );
  }

  // 3. Optional Cloudflare Turnstile verification (enforced automatically when TURNSTILE_SECRET_KEY is configured)
  if (env.TURNSTILE_SECRET_KEY && env.TURNSTILE_SECRET_KEY.trim().length > 0) {
    const token =
      sanitizeSingleLine(payload.turnstileToken, 2048) ||
      sanitizeSingleLine(payload['cf-turnstile-response'], 2048);
    const verified = await verifyTurnstile(env.TURNSTILE_SECRET_KEY.trim(), token, clientIp);
    if (!verified) {
      return jsonResponse(
        { ok: false, error: 'Human verification failed. Please retry your submission.' },
        400
      );
    }
  }

  // 4. Validate requestType and shared fields
  if (
    payload.requestType !== undefined &&
    payload.requestType !== 'support' &&
    payload.requestType !== 'amc'
  ) {
    return jsonResponse({ ok: false, error: 'Unsupported request type.' }, 400);
  }

  const requestType: RequestType = payload.requestType === 'amc' ? 'amc' : 'support';
  const contactName = sanitizeSingleLine(payload.contactName, 80);
  const companyName = sanitizeSingleLine(payload.companyName, 100);
  const email = sanitizeSingleLine(payload.email, 120).toLowerCase();
  const phone = sanitizeSingleLine(payload.phone, 24);
  const rawPagePath = sanitizeSingleLine(payload.pagePath, 80);
  const pagePath = PAGE_PATH_REGEX.test(rawPagePath) ? rawPagePath : '/';

  if (contactName.length < 2) {
    return jsonResponse({ ok: false, error: 'Please enter a contact name (at least 2 characters).' }, 400);
  }
  if (!EMAIL_REGEX.test(email)) {
    return jsonResponse({ ok: false, error: 'Please provide a valid email address.' }, 400);
  }
  if (phone.length > 0) {
    const digitCount = phone.replace(/\D/g, '').length;
    if (!PHONE_REGEX.test(phone) || digitCount < 7 || digitCount > 15) {
      return jsonResponse(
        { ok: false, error: 'Please provide a valid phone number or leave it blank.' },
        400
      );
    }
  }

  // 5. Per-email Rate Limiting (prevents rotating-IP spam bursts from the same sender)
  const emailRateCheck = checkSlidingWindow(emailRequestLog, email, RATE_LIMIT_MAX_EMAIL_REQUESTS, now);
  if (!emailRateCheck.allowed) {
    return jsonResponse(
      {
        ok: false,
        error: `Recent inquiry already received for this email. Please wait ${emailRateCheck.retryAfterSec} seconds before sending another.`,
      },
      429,
      { 'Retry-After': String(emailRateCheck.retryAfterSec) }
    );
  }

  const submittedAt = new Date().toISOString();
  let emailContent: { subject: string; html: string; text: string };
  let referenceId: string;

  if (requestType === 'amc') {
    if (companyName.length < 2) {
      return jsonResponse({ ok: false, error: 'Please enter your company or organization name.' }, 400);
    }

    const workstations = Number(payload.workstations);
    const networkRacks = Number(payload.networkRacks);
    const servers = Number(payload.servers);

    if (!Number.isInteger(workstations) || workstations < 1 || workstations > 500) {
      return jsonResponse({ ok: false, error: 'Workstations count must be between 1 and 500.' }, 400);
    }
    if (!Number.isInteger(networkRacks) || networkRacks < 0 || networkRacks > 100) {
      return jsonResponse({ ok: false, error: 'Network racks count must be between 0 and 100.' }, 400);
    }
    if (!Number.isInteger(servers) || servers < 0 || servers > 100) {
      return jsonResponse({ ok: false, error: 'Servers count must be between 0 and 100.' }, 400);
    }

    if (
      payload.serviceTier !== undefined &&
      payload.serviceTier !== 'business_hours' &&
      payload.serviceTier !== 'extended_priority'
    ) {
      return jsonResponse({ ok: false, error: 'Invalid AMC coverage tier selected.' }, 400);
    }

    const serviceTier =
      payload.serviceTier === 'extended_priority' ? 'extended_priority' : 'business_hours';
    const additionalNotes = sanitizeMultiline(payload.additionalNotes, 800);

    if (countUrls(additionalNotes) > MAX_URLS_IN_MESSAGE) {
      return jsonResponse(
        { ok: false, error: 'Please remove excessive links from your message and try again.' },
        400
      );
    }

    const urgencyLabel =
      serviceTier === 'extended_priority'
        ? 'Priority SLA Agreement (Extended Hours / Scheduled Escalation)'
        : 'Standard Business Hours Coverage';

    referenceId = generateReferenceId('AMC');
    emailContent = buildEmailContent({
      referenceId,
      requestType: 'amc',
      serviceRequested: 'IT Annual Maintenance Contract (AMC)',
      urgencyLabel,
      contactName,
      companyName,
      email,
      phone,
      pagePath,
      submittedAt,
      details: [
        { label: 'Workstations & Laptops', value: `${workstations} Units` },
        { label: 'Network Racks / Routers', value: `${networkRacks}` },
        { label: 'Servers / NAS Nodes', value: `${servers}` },
      ],
      notesLabel: 'Message / Additional Infrastructure Notes',
      notesValue: additionalNotes,
    });
  } else {
    const rawCategory = sanitizeSingleLine(payload.serviceCategory, 60);
    if (rawCategory.length > 0 && !ALLOWED_SERVICE_CATEGORIES.has(rawCategory)) {
      return jsonResponse({ ok: false, error: 'Invalid service category selected.' }, 400);
    }
    const serviceCategory = rawCategory || 'Remote IT Support';

    if (
      payload.urgency !== undefined &&
      payload.urgency !== 'Standard' &&
      payload.urgency !== 'Priority'
    ) {
      return jsonResponse({ ok: false, error: 'Invalid priority level selected.' }, 400);
    }
    const urgency = payload.urgency === 'Priority' ? 'Priority' : 'Standard';
    const summary = sanitizeMultiline(payload.summary, 1500);
    const authorizedConsent = payload.authorizedConsent === true;

    if (summary.length < 15) {
      return jsonResponse(
        { ok: false, error: 'Please describe your IT issue or support scope (at least 15 characters).' },
        400
      );
    }
    if (countUrls(summary) > MAX_URLS_IN_MESSAGE) {
      return jsonResponse(
        { ok: false, error: 'Please remove excessive links from your message and try again.' },
        400
      );
    }
    if (!authorizedConsent) {
      return jsonResponse(
        { ok: false, error: 'Please confirm acceptance of the Privacy Policy and Remote Support Terms.' },
        400
      );
    }

    referenceId = generateReferenceId('RF');
    emailContent = buildEmailContent({
      referenceId,
      requestType: 'support',
      serviceRequested: serviceCategory,
      urgencyLabel: urgency === 'Priority' ? 'Priority / Urgent Issue' : 'Standard Business Support',
      contactName,
      companyName,
      email,
      phone,
      pagePath,
      submittedAt,
      details: [{ label: 'Policy & Remote Terms Consent', value: 'Confirmed by submitter' }],
      notesLabel: 'Message / Issue & Support Scope',
      notesValue: summary,
    });
  }

  // 6. Verify server-side Resend credentials (never expose internals)
  const cleanEnvVal = (val: unknown, maxLen: number): string =>
    sanitizeSingleLine(val, maxLen).replace(/^['"]+|['"]+$/g, '').trim();

  const resendApiKey =
    cleanEnvVal(env.RESEND_API_KEY, 256) ||
    cleanEnvVal(env.RESEND_KEY, 256) ||
    cleanEnvVal(env.RESEND_TOKEN, 256) ||
    cleanEnvVal(env.RESEND_SECRET_KEY, 256) ||
    cleanEnvVal(env.EMAIL_API_KEY, 256);

  if (!resendApiKey) {
    console.error('[quote] Server email delivery secret is not bound in this deployment environment.');
    return jsonResponse(
      {
        ok: false,
        error: 'Automated email delivery is temporarily unavailable. Please try again later or email support@remotfix.in.',
      },
      503
    );
  }

  const fromEmail =
    cleanEnvVal(env.QUOTE_FROM_EMAIL, 160) ||
    cleanEnvVal(env.RESEND_FROM_EMAIL, 160) ||
    cleanEnvVal(env.FROM_EMAIL, 160) ||
    'Remotfix Support Desk <noreply@remotfix.in>';

  const toEmail =
    cleanEnvVal(env.QUOTE_TO_EMAIL, 160) ||
    cleanEnvVal(env.RESEND_TO_EMAIL, 160) ||
    cleanEnvVal(env.TO_EMAIL, 160) ||
    'support@remotfix.in';

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      }),
    });

    if (!resendResponse.ok) {
      console.error('[quote] Upstream email provider returned status:', resendResponse.status);
      return jsonResponse(
        {
          ok: false,
          error: 'Unable to send your request right now. Please try again shortly.',
        },
        502
      );
    }

    return jsonResponse(
      {
        ok: true,
        referenceId,
        message: 'Your inquiry has been delivered to our support team at support@remotfix.in.',
      },
      200
    );
  } catch {
    console.error('[quote] Upstream email provider network failure.');
    return jsonResponse(
      {
        ok: false,
        error: 'A network error occurred while sending your request. Please try again shortly.',
      },
      502
    );
  }
}

export async function onRequest(context: PagesEventContext<QuoteEnv>): Promise<Response> {
  if (context.request.method === 'POST') {
    return onRequestPost(context);
  }

  return jsonResponse(
    { ok: false, error: 'Method not allowed.' },
    405,
    { Allow: 'POST' }
  );
}
