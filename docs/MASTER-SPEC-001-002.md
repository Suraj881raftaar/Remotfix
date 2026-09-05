# MASTER-SPEC-001-002 — Secure International Service Platform

> **Document status:** Approved / Locked baseline  
> **Purpose:** Single contractor-ready master specification combining SPEC-001 Product/System Specification and SPEC-002 System Architecture & Repository Structure.  
> **Certification position:** Designed for future ISO/IEC 27001:2022 and ISO/IEC 27701:2025-aligned certification/readiness work. The platform must not claim certification before an appropriate independent certification process is completed.

---

# 1. PRD — Product Requirements Document

## 1.1 Product Background

The platform is a secure, internationally deployable service-management business platform that can operate initially at near-zero/minimal infrastructure cost and later migrate to paid, enterprise-grade infrastructure when revenue, funding, reliability, customer SLAs or security/compliance requirements justify it.

The product prioritizes:

- Security and privacy by design.
- Strict organization/tenant isolation.
- Owner-controlled administration.
- Customer, technician and service operations.
- Tickets, jobs, scheduling and dispatch.
- Contracts, entitlements, quotes and billing.
- Secure remote support with explicit authorization/consent.
- Auditability and compliance evidence.
- Provider-independent infrastructure.
- Modular-monolith MVP architecture.
- Automated testing, monitoring, backups and verified restoration.
- International privacy/compliance readiness.

## 1.2 Primary Users

- Platform owner.
- Organization administrators.
- Staff/operations users.
- Technicians.
- Customers.
- Security/compliance administrators.
- Authorized support personnel.

## 1.3 Must-Have Requirements

- Secure authentication and session management.
- MFA for privileged accounts.
- RBAC and least-privilege authorization.
- Strict tenant/organization isolation.
- Owner-level security controls.
- Customer, organization and location management.
- Technician management.
- Service catalog.
- Ticket management.
- Job scheduling and dispatch.
- SLA tracking and escalation.
- Asset management.
- Contracts and service entitlements.
- Quotes and invoices.
- Secure remote-support sessions requiring authorization/consent.
- Comprehensive security audit logging.
- Encryption in transit and at rest.
- Secure secret management.
- PostgreSQL.
- Private object/file storage.
- Automated backups and tested restoration.
- Production monitoring.
- Rate limiting and input validation.
- Security scanning and automated tests.
- Privacy/data-management functionality.
- Terms & Conditions, Privacy Policy and Cookie Policy.
- International privacy/compliance framework.
- ISO/IEC 27001:2022-aligned ISMS approach.
- ISO/IEC 27701:2025-aligned privacy-management approach.
- OpenAPI API contract.
- Provider-independent infrastructure.
- Zero/minimal-cost MVP deployment.
- Migration path to paid infrastructure.

## 1.4 Should-Have Requirements

- PWA/mobile-friendly experience.
- Technician skills and service-area matching.
- Automated SLA escalation.
- Background job processing.
- Data export/deletion workflows.
- Compliance evidence management.
- Security dashboard.
- Privacy dashboard.
- Disaster-recovery procedures.
- Infrastructure-as-code as the platform matures.
- WCAG 2.2 AA accessibility target.

## 1.5 Could-Have Requirements

- Advanced analytics.
- AI-assisted dispatch.
- Advanced automation.
- Enterprise SSO.
- Multi-region deployment.
- Advanced security operations tooling.
- Data warehouse.
- Microservices.

## 1.6 Won't-Have in Initial MVP

- Kubernetes.
- Multi-region active-active infrastructure.
- Complex service mesh.
- Multiple independent databases.
- Enterprise-scale infrastructure before usage justifies it.

## 1.7 Business Rules

1. Every organization-owned resource is tenant-scoped.
2. Authorization is enforced server-side.
3. Sensitive operations require stronger authentication/authorization and audit evidence.
4. Remote support requires customer authorization and technician authorization.
5. No remote-support passwords are stored by the application.
6. Financial, security and legally required records cannot be blindly deleted.
7. Production data is not copied into development without approved anonymization.
8. The MVP remains provider-independent.
9. Paid infrastructure is introduced only when justified by business, reliability or security requirements.
10. ISO alignment/readiness is not the same as certification.

## 1.8 Product Success Metrics

Technical:

- API p50/p95/p99 latency.
- Error rate.
- Database latency.
- Background-job latency.
- Concurrent users.
- Storage consumption.
- Infrastructure cost.

Security:

- Critical vulnerabilities.
- Security incidents.
- Failed authentication.
- Privilege changes.
- Sensitive exports.
- Tenant-isolation failures.
- Backup failures.

Business:

- Active customers.
- Revenue.
- Retention.
- Churn.
- Ticket volume.
- Resolution time.
- Customer satisfaction.
- Infrastructure cost/customer.

MVP acceptance requires:

```text
Requirements implemented     PASS
Security testing              PASS
Tenant isolation              PASS
Privacy controls              PASS
Backups                       VERIFIED
Restoration                   VERIFIED
UAT                           APPROVED
Monitoring                    ACTIVE
Rollback                      AVAILABLE
Documentation                 DELIVERED
```

---

# 2. TRD — Technical Requirements Document

## 2.1 Target Architecture

The MVP is a secure modular monolith.

```text
                         INTERNET
                            |
                         DNS / CDN
                            |
                         HTTPS / TLS
                            |
                    +-------v--------+
                    | Reverse Proxy |
                    +-------+--------+
                            |
                    +-------+--------+
                    |               |
                 Next.js         NestJS API
                    |               |
                    |       +-------+-------+
                    |       | Auth / RBAC   |
                    |       | Tickets       |
                    |       | Jobs / Dispatch|
                    |       | Contracts/Billing
                    |       | Remote Support|
                    |       | Privacy/Compliance
                    |       +-------+-------+
                    |               |
                    +-------+-------+--------+
                            |
                 +----------+----------+
                 |          |          |
             PostgreSQL   Queue     Object Storage
                            |
                          Worker
```

The application remains one deployable unit initially while internal module boundaries allow future extraction.

## 2.2 Locked Technology Stack

| Layer | Technology |
|---|---|
| Web framework | Next.js |
| Frontend hosting | Vercel-compatible deployment |
| Backend | NestJS |
| Initial backend hosting | Provider-independent / approved low-cost environment |
| Database | PostgreSQL |
| ORM/migrations | Prisma |
| Queue/cache | Redis-compatible service |
| Object storage | S3-compatible / Cloudflare R2-compatible abstraction |
| Payments | Dodo Payments through provider abstraction |
| Analytics | PostHog |
| Error tracking | Sentry |
| Email | Resend |
| Version control | GitHub |
| Repository | pnpm + Turborepo monorepo |
| API contract | OpenAPI |
| Containers | Docker |

Provider-specific capabilities must be accessed through abstractions:

```text
StorageProvider
EmailProvider
NotificationProvider
PaymentProvider
RemoteSupportProvider
MapsProvider
```

## 2.3 Repository Structure

```text
repo/
├── apps/
│   ├── web/
│   └── api/
├── packages/
│   ├── ui/
│   ├── config/
│   ├── types/
│   ├── validation/
│   └── telemetry/
├── database/
│   └── prisma/
│       ├── schema.prisma
│       ├── migrations/
│       └── seed.ts
├── infrastructure/
│   ├── docker/
│   ├── compose/
│   ├── scripts/
│   └── provisioning/
├── docs/
│   ├── architecture/
│   ├── api/
│   ├── security/
│   ├── compliance/
│   └── operations/
├── tests/
├── package.json
├── pnpm-lock.yaml
└── turbo.json
```

Backend dependency direction:

```text
Controller
    |
Application Service
    |
Domain Rules
    |
Repository Interface
    |
Infrastructure Adapter
    |
PostgreSQL / External Provider
```

## 2.4 Environment Model

```text
LOCAL
  ↓
TEST
  ↓
STAGING
  ↓
MVP PRODUCTION
  ↓
FUNDED PRODUCTION
```

Each environment has separate secrets and data.

Local development uses Docker Compose. Production secrets are never committed to source control.

## 2.5 Database Requirements

PostgreSQL is authoritative.

Conventions:

- UUID primary keys.
- `snake_case` database identifiers.
- UTC timestamps.
- `created_at` / `updated_at` on mutable entities.
- Explicit foreign keys.
- Explicit indexes.
- Database constraints.
- Organization ownership through `organization_id`.

Initial core entities include:

```text
users
organizations
memberships
roles
permissions
role_permissions
organization_locations
contacts
technicians
technician_skills
services
assets
tickets
ticket_messages
ticket_attachments
jobs
dispatch_assignments
appointments
contracts
contract_entitlements
entitlement_usage
quotes
quote_items
invoices
remote_support_sessions
audit_events
security_events
notifications
security_policies
risk_register
asset_register
control_register
vendor_register
incident_records
privacy_requests
retention_rules
compliance_evidence
policy_versions
policy_acceptances
consents
```

## 2.6 API Requirements

Base path:

```text
/api/v1
```

Representative endpoints:

```text
POST /auth/login
POST /auth/logout
POST /auth/refresh
POST /auth/mfa/verify
GET  /me

POST /tickets
GET  /tickets
GET  /tickets/{id}
PATCH /tickets/{id}
POST /tickets/{id}/assign
POST /tickets/{id}/resolve
POST /tickets/{id}/close
POST /tickets/{id}/jobs

GET  /jobs
POST /jobs/{id}/accept
POST /jobs/{id}/reject
POST /jobs/{id}/check-in
POST /jobs/{id}/check-out

GET  /contracts
POST /contracts

POST /tickets/{id}/remote-sessions
POST /remote-sessions/{id}/consent
POST /remote-sessions/{id}/start
POST /remote-sessions/{id}/terminate

GET /admin/audit-events
GET /admin/security-events
```

All API contracts are maintained through OpenAPI.

Standard protected flow:

```text
HTTPS
 ↓
Rate Limit
 ↓
Authentication
 ↓
Organization Context
 ↓
Authorization
 ↓
Validation
 ↓
Controller
 ↓
Application Service
 ↓
Repository
 ↓
Database
```

## 2.7 Authentication and Authorization

Security sequence:

```text
Authentication
 ↓
Organization membership
 ↓
Role
 ↓
Permission
 ↓
Resource ownership
 ↓
Action
 ↓
Audit event
```

Initial roles:

```text
OWNER
ADMIN
MANAGER
TECHNICIAN
STAFF
CUSTOMER
```

Permissions are explicit, e.g.:

```text
tickets:read
tickets:create
tickets:update
tickets:assign
users:read
users:create
users:update
billing:read
billing:create
billing:approve
audit:read
security:manage
organization:manage
```

Privileged accounts require MFA.

## 2.8 Tenant Isolation

Every organization-owned resource is scoped by `organization_id`.

Example:

```sql
SELECT *
FROM tickets
WHERE id = :ticket_id
AND organization_id = :current_organization_id;
```

Automated tests must verify that cross-organization access fails for:

- Tickets.
- Customers.
- Assets.
- Contracts.
- Invoices.
- Attachments.
- Reports.
- Audit records.

## 2.9 Security and Threat Model

Threat coverage includes:

- Authentication attacks.
- Authorization bypass.
- Cross-tenant access.
- Injection.
- SSRF.
- File-upload abuse.
- Webhook forgery/replay.
- Credential theft.
- Session abuse.
- Rate-limit evasion.
- Dependency compromise.
- Secret exposure.
- Data exfiltration.

Required testing:

- Unit tests.
- Integration tests.
- API tests.
- Tenant-isolation tests.
- RBAC tests.
- Authentication tests.
- MFA tests.
- Input-security tests.
- File-upload tests.
- Secret scanning.
- Dependency scanning.
- SAST.
- DAST.
- Performance testing.
- Backup restoration.
- Disaster recovery.
- Accessibility testing.

Critical security defects block production release.

## 2.10 Encryption and Secrets

- TLS for production communications.
- Encryption at rest for database, storage and backups.
- Passwords are hashed, never reversibly encrypted.
- Platform-managed secret/KMS facilities are preferred.
- Secrets never live in Git, frontend bundles or logs.
- Sensitive values are masked.
- Production data is not copied to development without approved anonymization.
- Key lifecycle: generate → activate → use → rotate → retire → destroy.

## 2.11 Remote Support Security

```text
Ticket
 ↓
Customer Authorization
 ↓
Technician Authorization
 ↓
Remote Session
 ↓
Audit
 ↓
Termination
```

No remote-support passwords are stored by the application.

## 2.12 Privacy and Compliance

The architecture supports:

- Privacy by design.
- Data classification.
- Retention.
- Consent.
- Policy versioning.
- Privacy requests.
- Data export.
- Deletion/anonymization.
- Compliance evidence.
- Security policies.
- Risk register.
- Vendor register.
- Incident records.

The operational framework is aligned with:

- ISO/IEC 27001:2022.
- ISO/IEC 27701:2025.
- Applicable privacy laws in operating jurisdictions.

Legal wording must be reviewed for the jurisdictions in which the business operates.

## 2.13 ISO Certification Readiness

Maintain a living Statement of Applicability/control register.

Traceability:

```text
Risk
 ↓
Requirement
 ↓
Architecture
 ↓
Implementation
 ↓
Test
 ↓
Evidence
 ↓
Review
```

Technical controls are distinguished from organizational, people and physical controls.

The organization must not claim ISO certification until an appropriate independent certification process is completed.

## 2.14 CI/CD

```text
Feature branch
 ↓
Pull Request
 ↓
CI
 ↓
Review
 ↓
Merge
 ↓
Build immutable artifact
 ↓
Staging
 ↓
Smoke tests
 ↓
Production
```

CI gates include:

- Lint.
- Type checking.
- Unit/integration tests.
- API tests.
- Build.
- Secret scanning.
- Dependency scanning.
- SAST/security analysis.
- Migration tests.
- Tenant-isolation tests.

## 2.15 Observability

Use:

```text
Logs + Metrics + Traces
```

Monitor:

- API latency.
- Error rates.
- Database health.
- Queue depth/failures.
- Authentication anomalies.
- Storage failures.
- Backup status.
- Security events.

Health endpoints:

```text
GET /health
GET /health/live
GET /health/ready
```

## 2.16 Backup and Recovery

```text
Production DB
 ↓
Backup System
 ↓
Backup Storage
 ↓
Recovery Environment
 ↓
Restore / Verify
```

A backup is not considered reliable until restoration has been successfully tested.

Initial targets:

```text
RPO <= 24 hours
RTO <= 24 hours
```

These may become stricter after funded infrastructure is introduced.

## 2.17 Availability, Performance and Scaling

Initial MVP uses a simple architecture and measured scaling.

Performance targets:

- Ordinary API p95 target <= 500 ms under expected MVP load.
- Large reports/exports are asynchronous.
- Core user journeys target good Core Web Vitals.
- Payloads are bounded.

Scaling path:

```text
Single server
 ↓
Managed PostgreSQL
 ↓
Managed object storage/queue
 ↓
Multiple API instances
 ↓
Load balancer
 ↓
Higher availability / multi-zone
 ↓
Multi-region only if justified
```

Do not introduce Kubernetes, sharding, service mesh or microservices without demonstrated need.

Scaling triggers include sustained CPU/memory pressure, database saturation, latency degradation, queue backlog, storage limits, error-rate increase or availability risk.

---

# 3. APP FLOW — User & System Flows

## 3.1 Visitor → Customer

```text
Landing Page
 ↓
Product / Service Information
 ↓
Registration
 ↓
Email Verification
 ↓
Organization Setup
 ↓
Owner Account
 ↓
MFA Setup
 ↓
Dashboard
```

## 3.2 Login

```text
Login
 ↓
Credential Validation
 ↓
Session Creation
 ↓
MFA Challenge if required
 ↓
Organization Context
 ↓
Role/Permission Resolution
 ↓
Dashboard
```

Failed authentication is rate-limited and audited.

## 3.3 Ticket Lifecycle

```text
Customer / Staff
 ↓
Create Ticket
 ↓
Validate + Tenant Scope
 ↓
Assign Priority/SLA
 ↓
Triage
 ↓
Assign Technician
 ↓
Create/Associate Job
 ↓
Technician Accepts
 ↓
Work / Updates
 ↓
Resolve
 ↓
Customer Confirmation
 ↓
Close
 ↓
Audit
```

## 3.4 Job and Dispatch

```text
Ticket
 ↓
Job Created
 ↓
Required Skills / Location / Availability
 ↓
Candidate Technicians
 ↓
Dispatch Assignment
 ↓
Technician Accepts
 ↓
Appointment
 ↓
Check-in
 ↓
Work
 ↓
Check-out
 ↓
Job Completion
```

## 3.5 SLA Escalation

```text
Ticket Created
 ↓
SLA Clock Starts
 ↓
Monitor
 ↓
Threshold Reached?
 ├─ No → Continue
 └─ Yes
      ↓
Escalation
      ↓
Notify Responsible Role
      ↓
Audit
```

## 3.6 Contract and Billing

```text
Customer
 ↓
Contract
 ↓
Entitlements
 ↓
Service Usage
 ↓
Quote if required
 ↓
Invoice
 ↓
Payment Provider
 ↓
Payment Result
 ↓
Billing Record
 ↓
Audit
```

## 3.7 Remote Support

```text
Ticket
 ↓
Customer Requests/Approves Support
 ↓
Identity / Authorization Check
 ↓
Technician Authorization
 ↓
Session Created
 ↓
Consent Recorded
 ↓
Session Starts
 ↓
Activity Audited
 ↓
Session Terminates
 ↓
Audit Finalization
```

## 3.8 Privacy Request

```text
Privacy Request
 ↓
Identity Verification
 ↓
Determine Request Type
 ↓
Locate Data
 ↓
Retention / Legal Check
 ↓
Approve / Reject / Partially Fulfil
 ↓
Execute Export / Correction / Deletion / Restriction
 ↓
Verify
 ↓
Compliance Evidence
 ↓
Notify Requester
```

## 3.9 Security Incident

```text
Detection
 ↓
Security Event
 ↓
Triage
 ↓
Contain
 ↓
Investigate
 ↓
Remediate
 ↓
Recover
 ↓
Evidence
 ↓
Review / Corrective Action
```

## 3.10 Backup Recovery

```text
Backup
 ↓
Scheduled Verification
 ↓
Restore Test
 ↓
Integrity Verification
 ↓
Record Evidence
```

---

# 4. UI/UX BRIEF

## 4.1 UX Principles

- Security without unnecessary friction.
- Clear organization context.
- Mobile-first responsive design.
- Accessible by default.
- Consistent design system.
- Clear destructive-action confirmation.
- Explicit success/error states.
- Minimal cognitive load.
- Progressive disclosure for advanced controls.

## 4.2 Primary Navigation

Owner/Admin:

```text
Dashboard
Customers
Locations
Technicians
Services
Tickets
Jobs / Dispatch
Contracts
Quotes
Invoices
Remote Support
Reports
Security
Privacy
Compliance
Administration
```

Technician:

```text
Dashboard
My Jobs
Schedule
Tickets
Customers
Assets
Remote Support
Profile
```

Customer:

```text
Dashboard
My Tickets
Appointments
Services
Contracts
Invoices
Profile
Support
```

## 4.3 Dashboard

The dashboard should show role-specific information.

Owner/Admin:

- Operational overview.
- Open tickets.
- SLA risks.
- Jobs today.
- Revenue/billing status.
- Security alerts.
- Compliance tasks.

Technician:

- Today's jobs.
- Next appointment.
- Assigned tickets.
- SLA warnings.
- Check-in/check-out.

Customer:

- Open requests.
- Upcoming appointments.
- Contract/service status.
- Invoices.
- Support actions.

## 4.4 Required UI States

Every important screen supports:

```text
Loading
Success
Empty
Error
Unauthorized
Forbidden
Offline/degraded
Saving
Saved
```

## 4.5 Forms

Forms must provide:

- Inline validation.
- Server-side validation feedback.
- Accessible labels.
- Keyboard navigation.
- Confirmation for destructive actions.
- Unsaved-change protection where appropriate.

## 4.6 Tables

Tables must support as appropriate:

- Search.
- Filtering.
- Sorting.
- Pagination.
- Responsive behavior.
- Export where authorized.
- Empty states.
- Permission-aware actions.

## 4.7 Security UX

Sensitive actions should clearly show:

- What will happen.
- Who authorized it.
- Whether MFA/re-authentication is required.
- Confirmation.
- Result.
- Audit/reference ID where useful.

Never expose secrets unnecessarily.

## 4.8 Remote Support UX

Customer:

```text
Support Request
 ↓
Explain session purpose
 ↓
Show technician identity
 ↓
Consent
 ↓
Start
 ↓
Active session indicator
 ↓
Terminate
```

Technician:

```text
Ticket
 ↓
Request session
 ↓
Authorization status
 ↓
Customer consent status
 ↓
Start
 ↓
Active session
 ↓
Terminate
```

## 4.9 Accessibility

Target WCAG 2.2 AA.

Requirements include:

- Keyboard accessibility.
- Visible focus.
- Semantic HTML.
- Accessible labels.
- Sufficient contrast.
- Screen-reader compatibility.
- Error announcements.
- Reduced-motion consideration.
- Accessible dialogs and tables.

## 4.10 Internationalization

- Store timestamps in UTC.
- Display according to user locale/timezone.
- Never hard-code currency assumptions.
- Use locale-aware number/date formatting.
- Keep translation keys separate from UI logic.
- Design for text expansion and right-to-left support where required.

---

# 5. BACKEND SCHEMA — Database/API/Data Model

## 5.1 Identity

```text
users
  id
  email
  password_hash / identity_provider_reference
  status
  mfa_enabled
  created_at
  updated_at
```

```text
organizations
  id
  name
  status
  created_at
  updated_at
```

```text
memberships
  id
  user_id
  organization_id
  role_id
  status
  created_at
  updated_at
```

## 5.2 Authorization

```text
roles
permissions
role_permissions
```

Permission evaluation:

```text
user
 ↓
membership
 ↓
role
 ↓
permissions
 ↓
resource scope
 ↓
action
```

## 5.3 Customers and Operations

```text
organization_locations
contacts
technicians
technician_skills
services
assets
```

## 5.4 Tickets

```text
tickets
ticket_messages
ticket_attachments
```

Required ticket concepts:

- Organization.
- Customer/contact.
- Location.
- Priority.
- Status.
- SLA.
- Assigned technician/team.
- Audit history.

## 5.5 Jobs and Dispatch

```text
jobs
dispatch_assignments
appointments
```

Job lifecycle:

```text
CREATED
ASSIGNED
ACCEPTED
SCHEDULED
CHECKED_IN
IN_PROGRESS
COMPLETED
CANCELLED
```

## 5.6 Contracts and Commercial

```text
contracts
contract_entitlements
entitlement_usage
quotes
quote_items
invoices
```

Billing operations must be auditable and provider-independent.

## 5.7 Remote Support

```text
remote_support_sessions
```

The record includes:

- Ticket.
- Customer.
- Technician.
- Authorization.
- Consent.
- Start time.
- End time.
- Status.
- Audit reference.

Remote-support credentials are not stored.

## 5.8 Security/Audit

```text
audit_events
security_events
```

Audit events should capture:

```text
actor
organization
action
resource_type
resource_id
request_id
timestamp
result
metadata
```

Security events include authentication, privilege, suspicious activity and security-control events.

## 5.9 Privacy/Compliance

```text
policy_versions
policy_acceptances
consents
retention_rules
privacy_requests
compliance_evidence
security_policies
risk_register
asset_register
control_register
vendor_register
incident_records
```

## 5.10 Retention

Retention rules are configurable:

```text
data_type
organization_id
retention_period
action
legal_basis
enabled
```

Actions:

```text
DELETE
ANONYMIZE
ARCHIVE
REVIEW
```

## 5.11 API Error Contract

```json
{
  "error": {
    "code": "TICKET_NOT_FOUND",
    "message": "The requested ticket could not be found.",
    "requestId": "uuid"
  }
}
```

Successful responses use:

```json
{
  "data": {}
}
```

## 5.12 Database Constraints

The implementation must use:

- Foreign keys.
- Unique constraints where required.
- Check constraints where appropriate.
- Organization-scoped indexes.
- Composite indexes for frequent scoped queries.
- Transaction boundaries for multi-record business operations.

Example:

```prisma
model Ticket {
  id             String   @id @default(uuid()) @db.Uuid
  organizationId String   @db.Uuid
  status         String
  priority       String
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@index([organizationId])
  @@index([organizationId, status])
  @@map("tickets")
}
```

---

# 6. IMPLEMENTATION PLAN — Contractor Execution Plan

## Phase 0 — Engineering Foundation

Deliver:

- Repository.
- Project structure.
- pnpm/Turborepo.
- Next.js.
- NestJS.
- PostgreSQL.
- Prisma.
- Docker Compose.
- Environment configuration.
- CI/CD foundation.
- OpenAPI.
- Test framework.
- Security baseline.

Acceptance:

```text
Local environment works.
CI passes.
Database migrations work.
API starts.
Web starts.
Secrets are externalized.
```

## Phase 1 — Secure Identity

Deliver:

- Authentication.
- Sessions.
- MFA.
- Users.
- Organizations.
- Memberships.
- RBAC.
- Tenant isolation.
- Audit logging.

Acceptance:

```text
Unauthorized access blocked.
MFA works.
Cross-tenant tests pass.
Privileged actions audited.
```

## Phase 2 — Core Platform

Deliver:

- Customers.
- Locations.
- Contacts.
- Technicians.
- Services.
- Assets.
- Tickets.
- Attachments.

Acceptance:

```text
Core CRUD works.
Authorization enforced.
Uploads are private and controlled.
```

## Phase 3 — Dispatch and Operations

Deliver:

- Jobs.
- Scheduling.
- Dispatch.
- Technician skills.
- SLA management.
- Escalation.
- Job completion.

Acceptance:

```text
Ticket → Job → Assignment → Appointment → Completion
```

## Phase 4 — Contracts and Billing

Deliver:

- Contracts.
- Entitlements.
- Usage.
- Quotes.
- Invoices.
- Payment-provider abstraction.

Acceptance:

```text
Commercial lifecycle is auditable.
Provider can be replaced without rewriting business logic.
```

## Phase 5 — Remote Support

Deliver:

- Consent.
- Session creation.
- Authorization.
- Session start.
- Session termination.
- Audit.

Acceptance:

```text
No authorized consent = no session.
Every session is auditable.
No remote-support passwords stored.
```

## Phase 6 — Privacy and Governance

Deliver:

- Privacy workflows.
- Retention.
- Data export.
- Data deletion/anonymization.
- Compliance records.
- Security policies.
- Legal-policy integration.
- Policy versions.
- Consent records.
- Evidence records.

Acceptance:

```text
Privacy workflow can be executed end-to-end.
Evidence is retained.
Retention rules are enforceable.
```

## Phase 7 — Administration

Deliver:

- Owner dashboard.
- Admin dashboard.
- Security dashboard.
- Compliance dashboard.
- User/role management.
- Access review.

Acceptance:

```text
Owner has complete authorized administrative visibility.
Privileged actions are protected and audited.
```

## Phase 8 — Hardening

Deliver:

- Security testing.
- Performance testing.
- Accessibility testing.
- Backup restoration.
- Disaster recovery.
- Penetration testing when appropriate.
- Threat-model review.
- Vulnerability remediation.

Release gate:

```text
Critical vulnerabilities = 0
Tenant isolation = PASS
MFA/admin security = PASS
Backup = VERIFIED
Restore = VERIFIED
Monitoring = ACTIVE
Rollback = AVAILABLE
UAT = APPROVED
```

## Phase 9 — MVP Deployment

Deploy to the approved zero/minimal-cost environment.

Requirements:

- Provider-independent application design.
- Private database/queue.
- HTTPS.
- Monitoring.
- Backups.
- Restore verification.
- Rollback procedure.
- Production smoke tests.

## Phase 10 — Controlled Pilot

Track:

- Active customers.
- Ticket volume.
- Resolution time.
- SLA performance.
- Errors.
- Security events.
- Infrastructure cost.
- Customer feedback.

## Phase 11 — Revenue Validation

Use actual workload and revenue data to determine:

- Capacity.
- Cost/customer.
- Reliability.
- Feature priorities.
- Infrastructure upgrade timing.

## Phase 12 — Paid Infrastructure Migration

Trigger when:

- Revenue supports it.
- Funding is obtained.
- Free-tier limits threaten reliability.
- Customer SLA requires it.
- Security/compliance requirements require it.

Migration should preserve application contracts and provider abstractions.

## Phase 13 — Enterprise Hardening

Potential upgrades:

- Managed PostgreSQL.
- Managed Redis/queue.
- Multiple API instances.
- Load balancer.
- Higher availability.
- Stronger monitoring.
- Centralized security operations.
- Infrastructure as code.
- Enterprise SSO.
- Advanced analytics.

## Phase 14 — ISO Certification Preparation

Establish and operate:

- ISMS.
- Risk management.
- Statement of Applicability.
- Control register.
- Policies.
- Training.
- Supplier management.
- Incident management.
- Access reviews.
- Internal audit.
- Corrective actions.
- Management review.
- Certification-audit preparation.

## Milestone Summary

```text
M0 Engineering foundation
M1 Secure identity
M2 Core platform
M3 Dispatch & operations
M4 Contracts & billing
M5 Secure remote support
M6 Privacy & compliance
M7 Owner/admin controls
M8 Security hardening
M9 Zero-budget MVP
M10 Controlled pilot
M11 Revenue validation
M12 Paid infrastructure migration
M13 Enterprise hardening
M14 ISO certification preparation
```

## Final Architecture Principle

> **Build once, operate cheaply, protect data aggressively, measure everything important, and scale infrastructure only when the business justifies it.**

The architecture is intentionally designed so that lack of initial capital does not force a later rewrite.

---

