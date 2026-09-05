# MASTER-BASELINE-AUDIT — Baseline Analysis

**Document Target:** `docs/MASTER-BASELINE-AUDIT.md`  
**Authoritative Source Analyzed:** [`docs/MASTER-SPEC-001-002.md`](file:///C:/SURAJ/Remotfix/docs/MASTER-SPEC-001-002.md)  
**Analysis Type:** Read-Only Baseline Requirement Extraction & Audit  
**Status:** Approved Baseline Audit  

---

## 1. Master Document Structure

The authoritative source document [`docs/MASTER-SPEC-001-002.md`](file:///C:/SURAJ/Remotfix/docs/MASTER-SPEC-001-002.md) contains 1,767 lines and is structured into 6 primary numbered sections, plus document metadata and footer:

- **Document Header & Metadata** (Lines 1–6)
  - Title: MASTER-SPEC-001-002 — Secure International Service Platform
  - Status: Approved / Locked baseline
  - Purpose: Single contractor-ready master specification combining SPEC-001 Product/System Specification and SPEC-002 System Architecture & Repository Structure.
  - Certification Position: Designed for future ISO/IEC 27001:2022 and ISO/IEC 27701:2025-aligned certification/readiness work. Explicit prohibition against claiming certification prior to formal accredited independent audit.
- **1. PRD — Product Requirements Document** (Lines 9–170)
  - 1.1 Product Background
  - 1.2 Primary Users
  - 1.3 Must-Have Requirements
  - 1.4 Should-Have Requirements
  - 1.5 Could-Have Requirements
  - 1.6 Won't-Have in Initial MVP
  - 1.7 Business Rules
  - 1.8 Product Success Metrics
- **2. TRD — Technical Requirements Document** (Lines 172–760)
  - 2.1 Target Architecture
  - 2.2 Locked Technology Stack
  - 2.3 Repository Structure
  - 2.4 Environment Model
  - 2.5 Database Requirements
  - 2.6 API Requirements
  - 2.7 Authentication and Authorization
  - 2.8 Tenant Isolation
  - 2.9 Security and Threat Model
  - 2.10 Encryption and Secrets
  - 2.11 Remote Support Security
  - 2.12 Privacy and Compliance
  - 2.13 ISO Certification Readiness
  - 2.14 CI/CD
  - 2.15 Observability
  - 2.16 Backup and Recovery
  - 2.17 Availability, Performance and Scaling
- **3. APP FLOW — User & System Flows** (Lines 762–988)
  - 3.1 Visitor → Customer
  - 3.2 Login
  - 3.3 Ticket Lifecycle
  - 3.4 Job and Dispatch
  - 3.5 SLA Escalation
  - 3.6 Contract and Billing
  - 3.7 Remote Support
  - 3.8 Privacy Request
  - 3.9 Security Incident
  - 3.10 Backup Recovery
- **4. UI/UX BRIEF** (Lines 990–1199)
  - 4.1 UX Principles
  - 4.2 Primary Navigation
  - 4.3 Dashboard
  - 4.4 Required UI States
  - 4.5 Forms
  - 4.6 Tables
  - 4.7 Security UX
  - 4.8 Remote Support UX
  - 4.9 Accessibility
  - 4.10 Internationalization
- **5. BACKEND SCHEMA — Database/API/Data Model** (Lines 1201–1454)
  - 5.1 Identity
  - 5.2 Authorization
  - 5.3 Customers and Operations
  - 5.4 Tickets
  - 5.5 Jobs and Dispatch
  - 5.6 Contracts and Commercial
  - 5.7 Remote Support
  - 5.8 Security/Audit
  - 5.9 Privacy/Compliance
  - 5.10 Retention
  - 5.11 API Error Contract
  - 5.12 Database Constraints
- **6. IMPLEMENTATION PLAN — Contractor Execution Plan** (Lines 1456–1767)
  - Phase 0 — Engineering Foundation
  - Phase 1 — Secure Identity
  - Phase 2 — Core Platform
  - Phase 3 — Dispatch and Operations
  - Phase 4 — Contracts and Billing
  - Phase 5 — Remote Support
  - Phase 6 — Privacy and Governance
  - Phase 7 — Administration
  - Phase 8 — Hardening
  - Phase 9 — MVP Deployment
  - Phase 10 — Controlled Pilot
  - Phase 11 — Revenue Validation
  - Phase 12 — Paid Infrastructure Migration
  - Phase 13 — Enterprise Hardening
  - Phase 14 — ISO Certification Preparation
  - Milestone Summary
  - Final Architecture Principle
  - Footer Contact

---

## 2. Product Vision

- **Core Vision Statement:** The platform is a secure, internationally deployable service-management business platform that can operate initially at near-zero/minimal infrastructure cost and later migrate to paid, enterprise-grade infrastructure when revenue, funding, reliability, customer SLAs or security/compliance requirements justify it. *(Source: Section 1.1)*
- **Guiding Architecture Principle:** *"Build once, operate cheaply, protect data aggressively, measure everything important, and scale infrastructure only when the business justifies it."* The architecture is intentionally designed so that lack of initial capital does not force a later rewrite. *(Source: Section 6)*

---

## 3. Product Goals

### 3.1 Strategic Product Priorities *(Source: Section 1.1)*
1. Security and privacy by design. [Priority: Core]
2. Strict organization/tenant isolation. [Priority: Core]
3. Owner-controlled administration. [Priority: Core]
4. Customer, technician and service operations. [Priority: Core]
5. Tickets, jobs, scheduling and dispatch. [Priority: Core]
6. Contracts, entitlements, quotes and billing. [Priority: Core]
7. Secure remote support with explicit authorization/consent. [Priority: Core]
8. Auditability and compliance evidence. [Priority: Core]
9. Provider-independent infrastructure. [Priority: Core]
10. Modular-monolith MVP architecture. [Priority: Core]
11. Automated testing, monitoring, backups and verified restoration. [Priority: Core]
12. International privacy/compliance readiness. [Priority: Core]

### 3.2 Product Success Metrics *(Source: Section 1.8)*
- **Technical Metrics:**
  - API p50/p95/p99 latency.
  - Error rate.
  - Database latency.
  - Background-job latency.
  - Concurrent users.
  - Storage consumption.
  - Infrastructure cost.
- **Security Metrics:**
  - Critical vulnerabilities.
  - Security incidents.
  - Failed authentication.
  - Privilege changes.
  - Sensitive exports.
  - Tenant-isolation failures.
  - Backup failures.
- **Business Metrics:**
  - Active customers.
  - Revenue.
  - Retention.
  - Churn.
  - Ticket volume.
  - Resolution time.
  - Customer satisfaction.
  - Infrastructure cost/customer.

---

## 4. Primary Actors / Users

### 4.1 Primary Users *(Source: Section 1.2)*
1. **Platform owner:** Full executive visibility, tenant governance, platform-wide administrative control, security policy enforcement.
2. **Organization administrators:** Organization-level settings, user/technician management, billing, compliance oversight.
3. **Staff/operations users:** Day-to-day operations, ticket triage, scheduling coordination, customer management.
4. **Technicians:** Mobile/field operational access, assigned jobs, schedule, appointments, job check-in/check-out, ticket work updates, authorized remote-support execution.
5. **Customers:** Self-service portal, ticket submission/tracking, appointment visibility, service contracts, invoice review, remote-support authorization and consent grant/revocation.
6. **Security/compliance administrators:** Security audit review, incident handling, risk/vendor register management, compliance evidence collection, privacy request execution.
7. **Authorized support personnel:** Support triage and authorized remote assistance within granted permissions.

### 4.2 Initial Roles in RBAC Matrix *(Source: Section 2.7)*
- `OWNER`
- `ADMIN`
- `MANAGER`
- `TECHNICIAN`
- `STAFF`
- `CUSTOMER`

---

## 5. MUST-HAVE Requirements

*(Source: Section 1.3 — All 33 Items preserved with Master terminology and meaning)*

1. Secure authentication and session management. [Priority: Must-Have] *(Source: Section 1.3)*
2. MFA for privileged accounts. [Priority: Must-Have] *(Source: Section 1.3)*
3. RBAC and least-privilege authorization. [Priority: Must-Have] *(Source: Section 1.3)*
4. Strict tenant/organization isolation. [Priority: Must-Have] *(Source: Section 1.3)*
5. Owner-level security controls. [Priority: Must-Have] *(Source: Section 1.3)*
6. Customer, organization and location management. [Priority: Must-Have] *(Source: Section 1.3)*
7. Technician management. [Priority: Must-Have] *(Source: Section 1.3)*
8. Service catalog. [Priority: Must-Have] *(Source: Section 1.3)*
9. Ticket management. [Priority: Must-Have] *(Source: Section 1.3)*
10. Job scheduling and dispatch. [Priority: Must-Have] *(Source: Section 1.3)*
11. SLA tracking and escalation. [Priority: Must-Have] *(Source: Section 1.3)*
12. Asset management. [Priority: Must-Have] *(Source: Section 1.3)*
13. Contracts and service entitlements. [Priority: Must-Have] *(Source: Section 1.3)*
14. Quotes and invoices. [Priority: Must-Have] *(Source: Section 1.3)*
15. Secure remote-support sessions requiring authorization/consent. [Priority: Must-Have] *(Source: Section 1.3)*
16. Comprehensive security audit logging. [Priority: Must-Have] *(Source: Section 1.3)*
17. Encryption in transit and at rest. [Priority: Must-Have] *(Source: Section 1.3)*
18. Secure secret management. [Priority: Must-Have] *(Source: Section 1.3)*
19. PostgreSQL. [Priority: Must-Have] *(Source: Section 1.3)*
20. Private object/file storage. [Priority: Must-Have] *(Source: Section 1.3)*
21. Automated backups and tested restoration. [Priority: Must-Have] *(Source: Section 1.3)*
22. Production monitoring. [Priority: Must-Have] *(Source: Section 1.3)*
23. Rate limiting and input validation. [Priority: Must-Have] *(Source: Section 1.3)*
24. Security scanning and automated tests. [Priority: Must-Have] *(Source: Section 1.3)*
25. Privacy/data-management functionality. [Priority: Must-Have] *(Source: Section 1.3)*
26. Terms & Conditions, Privacy Policy and Cookie Policy. [Priority: Must-Have] *(Source: Section 1.3)*
27. International privacy/compliance framework. [Priority: Must-Have] *(Source: Section 1.3)*
28. ISO/IEC 27001:2022-aligned ISMS approach. [Priority: Must-Have] *(Source: Section 1.3)*
29. ISO/IEC 27701:2025-aligned privacy-management approach. [Priority: Must-Have] *(Source: Section 1.3)*
30. OpenAPI API contract. [Priority: Must-Have] *(Source: Section 1.3)*
31. Provider-independent infrastructure. [Priority: Must-Have] *(Source: Section 1.3)*
32. Zero/minimal-cost MVP deployment. [Priority: Must-Have] *(Source: Section 1.3)*
33. Migration path to paid infrastructure. [Priority: Must-Have] *(Source: Section 1.3)*

---

## 6. SHOULD-HAVE Requirements

*(Source: Section 1.4 — All 11 Items preserved with Master terminology and meaning)*

1. PWA/mobile-friendly experience. [Priority: Should-Have] *(Source: Section 1.4)*
2. Technician skills and service-area matching. [Priority: Should-Have] *(Source: Section 1.4)*
3. Automated SLA escalation. [Priority: Should-Have] *(Source: Section 1.4)*
4. Background job processing. [Priority: Should-Have] *(Source: Section 1.4)*
5. Data export/deletion workflows. [Priority: Should-Have] *(Source: Section 1.4)*
6. Compliance evidence management. [Priority: Should-Have] *(Source: Section 1.4)*
7. Security dashboard. [Priority: Should-Have] *(Source: Section 1.4)*
8. Privacy dashboard. [Priority: Should-Have] *(Source: Section 1.4)*
9. Disaster-recovery procedures. [Priority: Should-Have] *(Source: Section 1.4)*
10. Infrastructure-as-code as the platform matures. [Priority: Should-Have] *(Source: Section 1.4)*
11. WCAG 2.2 AA accessibility target. [Priority: Should-Have] *(Source: Section 1.4)*

---

## 7. COULD-HAVE Requirements

*(Source: Section 1.5 — All 8 Items preserved with Master terminology and meaning)*

1. Advanced analytics. [Priority: Could-Have] *(Source: Section 1.5)*
2. AI-assisted dispatch. [Priority: Could-Have] *(Source: Section 1.5)*
3. Advanced automation. [Priority: Could-Have] *(Source: Section 1.5)*
4. Enterprise SSO. [Priority: Could-Have] *(Source: Section 1.5)*
5. Multi-region deployment. [Priority: Could-Have] *(Source: Section 1.5)*
6. Advanced security operations tooling. [Priority: Could-Have] *(Source: Section 1.5)*
7. Data warehouse. [Priority: Could-Have] *(Source: Section 1.5)*
8. Microservices. [Priority: Could-Have] *(Source: Section 1.5)*

---

## 8. Explicit MVP Exclusions (Won't-Have in Initial MVP)

*(Source: Section 1.6 — All 5 Items preserved with Master terminology and meaning)*

1. Kubernetes. [Priority: Won't-Have in Initial MVP] *(Source: Section 1.6)*
2. Multi-region active-active infrastructure. [Priority: Won't-Have in Initial MVP] *(Source: Section 1.6)*
3. Complex service mesh. [Priority: Won't-Have in Initial MVP] *(Source: Section 1.6)*
4. Multiple independent databases. [Priority: Won't-Have in Initial MVP] *(Source: Section 1.6)*
5. Enterprise-scale infrastructure before usage justifies it. [Priority: Won't-Have in Initial MVP] *(Source: Section 1.6)*

---

## 9. Functional Requirements

Extracted across PRD, App Flows, Schema, and Implementation Phases:

### 9.1 Identity, Organization & Access Management
1. User registration, email verification, organization setup, and initial Owner account provisioning. *(Sources: Section 3.1, 5.1, Phase 1)*
2. Session management, secure login, token refresh, logout, and credential validation. *(Sources: Section 2.6, 3.2, Phase 1)*
3. Mandatory Multi-Factor Authentication (MFA) setup and verification for privileged accounts. *(Sources: Section 1.3, 2.7, 3.1, 3.2, Phase 1)*
4. Multi-organization membership support linking users, organizations, and roles. *(Sources: Section 5.1, Phase 1)*
5. Role-Based Access Control (RBAC) supporting initial roles (`OWNER`, `ADMIN`, `MANAGER`, `TECHNICIAN`, `STAFF`, `CUSTOMER`) and explicit permission mapping (e.g., `tickets:read`, `tickets:create`, `tickets:update`, `tickets:assign`, `users:read`, `users:create`, `users:update`, `billing:read`, `billing:create`, `billing:approve`, `audit:read`, `security:manage`, `organization:manage`). *(Sources: Section 2.7, 5.2, Phase 1)*
6. Failed authentication rate limiting and audit logging. *(Sources: Section 3.2, Phase 1)*

### 9.2 Customer, Location, Contact & Asset Management
7. Organization and customer management. *(Sources: Section 1.3, 5.3, Phase 2)*
8. Organization location management (`organization_locations`). *(Sources: Section 2.5, 5.3, Phase 2)*
9. Customer contact management (`contacts`). *(Sources: Section 2.5, 5.3, Phase 2)*
10. Customer asset tracking and management (`assets`). *(Sources: Section 1.3, 2.5, 5.3, Phase 2)*

### 9.3 Technician & Service Catalog Management
11. Technician profiles and management (`technicians`). *(Sources: Section 1.3, 2.5, 5.3, Phase 2)*
12. Technician skills catalog and association (`technician_skills`). *(Sources: Section 2.5, 5.3, Phase 2, Phase 3)*
13. Service catalog management (`services`). *(Sources: Section 1.3, 2.5, 5.3, Phase 2)*
14. Technician service-area, skills, and availability matching for job dispatch. *(Sources: Section 1.4, 3.4, Phase 3)*

### 9.4 Ticket Management & Lifecycle
15. Ticket creation by customers or staff, with mandatory tenant scoping and input validation. *(Sources: Section 3.3, 5.4, Phase 2)*
16. Priority and SLA assignment during ticket intake/triage. *(Sources: Section 3.3, 5.4, Phase 2)*
17. Ticket assignment to technicians or teams. *(Sources: Section 2.6, 3.3, Phase 2)*
18. Association/creation of dispatch jobs from tickets. *(Sources: Section 2.6, 3.3, Phase 3)*
19. Ticket messages/threads (`ticket_messages`). *(Sources: Section 2.5, 5.4, Phase 2)*
20. Private ticket attachments (`ticket_attachments`). *(Sources: Section 2.5, 5.4, Phase 2)*
21. Resolution, customer confirmation, ticket closure, and complete audit history recording. *(Sources: Section 3.3, 5.4, Phase 2)*

### 9.5 Job Scheduling & Dispatch
22. Job creation from tickets (`jobs`). *(Sources: Section 3.4, 5.5, Phase 3)*
23. Dispatch assignment to candidate technicians based on skill, location, and availability (`dispatch_assignments`). *(Sources: Section 2.5, 3.4, 5.5, Phase 3)*
24. Technician job accept/reject workflow. *(Sources: Section 2.6, 3.4, Phase 3)*
25. Appointment scheduling and management (`appointments`). *(Sources: Section 2.5, 3.4, 5.5, Phase 3)*
26. Technician appointment check-in, active work tracking, check-out, and job completion. *(Sources: Section 2.6, 3.4, Phase 3)*
27. Formal job lifecycle management: `CREATED` → `ASSIGNED` → `ACCEPTED` → `SCHEDULED` → `CHECKED_IN` → `IN_PROGRESS` → `COMPLETED` → `CANCELLED`. *(Sources: Section 5.5, Phase 3)*

### 9.6 SLA Tracking & Escalation
28. Automated SLA clock initialization upon ticket creation. *(Sources: Section 3.5, Phase 3)*
29. Continuous SLA threshold monitoring. *(Sources: Section 3.5, Phase 3)*
30. Automated escalation triggers and notifications to responsible roles upon breach/risk. *(Sources: Section 1.4, 3.5, Phase 3)*
31. Full audit trail of all SLA escalation events. *(Sources: Section 3.5, Phase 3)*

### 9.7 Contracts, Entitlements & Commercial / Billing
32. Contract management (`contracts`). *(Sources: Section 1.3, 2.5, 3.6, 5.6, Phase 4)*
33. Service entitlements definition (`contract_entitlements`). *(Sources: Section 2.5, 5.6, Phase 4)*
34. Entitlement usage tracking against service consumption (`entitlement_usage`). *(Sources: Section 2.5, 5.6, Phase 4)*
35. Quotes generation and line item management (`quotes`, `quote_items`). *(Sources: Section 1.3, 2.5, 5.6, Phase 4)*
36. Invoices generation and lifecycle management (`invoices`). *(Sources: Section 1.3, 2.5, 3.6, 5.6, Phase 4)*
37. Integration with payment provider (Dodo Payments via abstraction) and payment result recording. *(Sources: Section 2.2, 3.6, Phase 4)*
38. Auditable commercial and billing records. *(Sources: Section 3.6, 5.6, Phase 4)*

### 9.8 Secure Remote Support
39. Ticket-linked remote support session request. *(Sources: Section 2.6, 2.11, 3.7, 5.7, Phase 5)*
40. Explicit customer authorization and informed consent recording prior to session start. *(Sources: Section 1.7, 2.11, 3.7, 4.8, 5.7, Phase 5)*
41. Technician authorization verification. *(Sources: Section 2.11, 3.7, Phase 5)*
42. Session start and real-time active session indicator for customer and technician. *(Sources: Section 3.7, 4.8, Phase 5)*
43. Immediate session termination capability from customer or technician side. *(Sources: Section 2.6, 3.7, 4.8, Phase 5)*
44. Complete session audit capture (`remote_support_sessions`) including ticket, customer, technician, authorization, consent, start/end timestamps, status, and audit reference. *(Sources: Section 5.7, Phase 5)*
45. Strict non-storage of remote-support passwords or credentials. *(Sources: Section 1.7, 2.11, 5.7, Phase 5)*

### 9.9 Privacy Request & Data Management Workflows
46. Privacy request intake (`privacy_requests`). *(Sources: Section 2.5, 3.8, 5.9, Phase 6)*
47. Requester identity verification. *(Sources: Section 3.8, Phase 6)*
48. Request classification and data discovery across tenant records. *(Sources: Section 3.8, Phase 6)*
49. Retention and legal hold validation preventing blind deletion of legally required records. *(Sources: Section 1.7, 3.8, Phase 6)*
50. Execution of export, correction, deletion, or restriction workflows. *(Sources: Section 1.4, 3.8, Phase 6)*
51. Generation and retention of compliance evidence records (`compliance_evidence`). *(Sources: Section 2.5, 3.8, 5.9, Phase 6)*
52. Requester notification upon completion. *(Sources: Section 3.8, Phase 6)*

### 9.10 Data Retention & Policy Enforcement
53. Configurable retention rules per data type and organization (`retention_rules`). *(Sources: Section 5.9, 5.10, Phase 6)*
54. Support for retention action types: `DELETE`, `ANONYMIZE`, `ARCHIVE`, `REVIEW`. *(Sources: Section 5.10, Phase 6)*
55. Policy versioning (`policy_versions`), terms & conditions, privacy policy, and cookie policy management. *(Sources: Section 1.3, 5.9, Phase 6)*
56. User policy acceptance and consent tracking (`policy_acceptances`, `consents`). *(Sources: Section 2.5, 5.9, Phase 6)*

### 9.11 Security Incident Lifecycle
57. Security event logging (`security_events`). *(Sources: Section 2.5, 3.9, 5.8, Phase 6)*
58. Incident workflow: Detection → Security Event → Triage → Contain → Investigate → Remediate → Recover → Evidence → Review / Corrective Action. *(Sources: Section 3.9, Phase 6)*
59. Incident records maintenance (`incident_records`). *(Sources: Section 2.5, 5.9, Phase 6)*

### 9.12 Administration, Security & Compliance Governance
60. Platform Owner dashboard for platform-wide metrics, tenant overviews, and administrative actions. *(Sources: Section 4.2, 4.3, Phase 7)*
61. Admin dashboard for organization-level management. *(Sources: Section 4.2, 4.3, Phase 7)*
62. Security dashboard displaying alerts, failed auth, privilege changes, and security events. *(Sources: Section 1.4, 4.3, Phase 7)*
63. Privacy dashboard tracking privacy requests, consent status, and retention metrics. *(Sources: Section 1.4, Phase 7)*
64. Compliance dashboard managing compliance tasks and audit readiness. *(Sources: Section 4.3, Phase 7)*
65. Risk register management (`risk_register`). *(Sources: Section 2.5, 5.9, Phase 6)*
66. Asset register management (`asset_register`). *(Sources: Section 2.5, 5.9, Phase 6)*
67. Control register / Statement of Applicability management (`control_register`). *(Sources: Section 2.5, 2.13, 5.9, Phase 6, Phase 14)*
68. Vendor register management (`vendor_register`). *(Sources: Section 2.5, 5.9, Phase 6)*
69. User/role management and periodic access reviews. *(Sources: Section Phase 7, Phase 14)*

### 9.13 UI/UX Interaction & Operational Views
70. Role-specific dashboards and navigation trees for Owner/Admin, Technician, and Customer. *(Sources: Section 4.2, 4.3)*
71. Mandatory screen states: Loading, Success, Empty, Error, Unauthorized, Forbidden, Offline/degraded, Saving, Saved. *(Sources: Section 4.4)*
72. Form controls: Inline validation, server-side error mapping, accessible labels, keyboard navigation, destructive action confirmation, unsaved-change protection. *(Sources: Section 4.5)*
73. Table controls: Search, filtering, sorting, pagination, responsive layout, authorized export, empty states, permission-aware actions. *(Sources: Section 4.6)*

---

## 10. Business Rules

### 10.1 Explicit Master Business Rules *(Source: Section 1.7)*
1. Every organization-owned resource is tenant-scoped. [Rule 1]
2. Authorization is enforced server-side. [Rule 2]
3. Sensitive operations require stronger authentication/authorization and audit evidence. [Rule 3]
4. Remote support requires customer authorization and technician authorization. [Rule 4]
5. No remote-support passwords are stored by the application. [Rule 5]
6. Financial, security and legally required records cannot be blindly deleted. [Rule 6]
7. Production data is not copied into development without approved anonymization. [Rule 7]
8. The MVP remains provider-independent. [Rule 8]
9. Paid infrastructure is introduced only when justified by business, reliability or security requirements. [Rule 9]
10. ISO alignment/readiness is not the same as certification. [Rule 10]

### 10.2 Additional Mandatory Business Rules Extracted Across Sections
11. The platform must not claim certification before an appropriate independent certification process is completed. *(Sources: Preamble, Section 2.13)*
12. Privileged accounts require Multi-Factor Authentication (MFA). *(Sources: Section 1.3, 2.7)*
13. Passwords must be hashed, never reversibly encrypted. *(Source: Section 2.10)*
14. Secrets must never live in Git, frontend bundles, or logs; sensitive values must be masked. *(Source: Section 2.10)*
15. A backup is not considered reliable until restoration has been successfully tested. *(Sources: Section 2.16, Phase 8)*
16. Critical security defects block production release (Critical vulnerabilities = 0). *(Sources: Section 2.9, Phase 8)*
17. No authorized consent = no remote support session. *(Sources: Section 3.7, Phase 5)*
18. Large reports and heavy data exports must be handled asynchronously. *(Source: Section 2.17)*
19. Provider-specific capabilities must be accessed exclusively through abstractions so providers can be swapped without rewriting business logic. *(Sources: Section 2.2, Phase 4)*
20. All database timestamps must be stored in UTC; display must adapt to user locale/timezone without hard-coded currency assumptions. *(Sources: Section 2.5, 4.10)*

---

## 11. Technical Requirements

1. **Architecture Model:** Secure modular monolith deployed initially as a single deployable unit with internal module boundaries allowing future extraction. *(Sources: Section 1.1, 2.1)*
2. **Reverse Proxy:** Reverse proxy layer terminating HTTPS/TLS in front of web and API. *(Source: Section 2.1)*
3. **Layered Dependency Architecture:** Strict backend dependency direction:
   `Controller` → `Application Service` → `Domain Rules` → `Repository Interface` → `Infrastructure Adapter` → `PostgreSQL / External Provider`. *(Source: Section 2.3)*
4. **Monorepo Structure:** Structured pnpm + Turborepo workspace separating apps, packages, database, infrastructure, docs, and tests. *(Sources: Section 2.2, 2.3)*
5. **API Contract Management:** All endpoints defined and maintained via OpenAPI specification. *(Sources: Section 1.3, 2.2, 2.6, Phase 0)*
6. **API Standard Path:** Base path `/api/v1`. *(Source: Section 2.6)*
7. **Protected API Request Flow:** Strict sequential middleware processing:
   `HTTPS` → `Rate Limit` → `Authentication` → `Organization Context` → `Authorization` → `Validation` → `Controller` → `Application Service` → `Repository` → `Database`. *(Source: Section 2.6)*
8. **Standardized API Error Contract:** Error responses must adhere to:
   `{"error": {"code": "STRING_CODE", "message": "Description", "requestId": "uuid"}}`. *(Source: Section 5.11)*
9. **Standardized API Success Contract:** Success responses must adhere to:
   `{"data": {...}}`. *(Source: Section 5.11)*
10. **Performance Targets:**
    - Ordinary API p95 latency <= 500 ms under expected MVP load. *(Source: Section 2.17)*
    - Core user journeys target good Core Web Vitals. *(Source: Section 2.17)*
    - Request/response payloads must be bounded. *(Source: Section 2.17)*
11. **Asynchronous Execution:** Heavy tasks (large reports, data exports) must be processed asynchronously via queue workers. *(Sources: Section 1.4, 2.1, 2.17)*
12. **UI State Completeness:** All critical views must handle all 9 standard UI states (Loading, Success, Empty, Error, Unauthorized, Forbidden, Offline/degraded, Saving, Saved). *(Source: Section 4.4)*
13. **Form & Table Robustness:** Inline and server validation, accessible labels, keyboard navigation, sorting, pagination, and filtering. *(Sources: Section 4.5, 4.6)*
14. **Accessibility Standard:** Target WCAG 2.2 AA compliance across all public and authenticated interfaces. *(Sources: Section 1.4, 4.9)*
15. **Internationalization (i18n):** UTC persistence, locale-aware date/number formatting, translation key isolation, text expansion and RTL accommodation. *(Source: Section 4.10)*

---

## 12. Technology Stack

### 12.1 Locked Technology Stack *(Source: Section 2.2 Table)*

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

### 12.2 Required Provider Abstractions *(Source: Section 2.2)*
- `StorageProvider` (Private file uploads, attachments, compliance evidence)
- `EmailProvider` (Verification emails, ticket notifications, escalation alerts)
- `NotificationProvider` (In-app, push, and dispatch notifications)
- `PaymentProvider` (Dodo Payments payment intents, checkout, webhook handling)
- `RemoteSupportProvider` (Remote support session coordination and signaling)
- `MapsProvider` (Geocoding, location matching, technician dispatch routing)

---

## 13. Architecture Requirements

1. **Modular Monolith Pattern:** Built as a single cohesive unit initially to avoid distributed systems overhead, while maintaining modular domain boundaries to allow future microservice extraction if needed. *(Sources: Section 1.1, 2.1)*
2. **Component Topology:**
   - Client Tier: Next.js frontend (Vercel-compatible).
   - Gateway/Proxy Tier: Reverse Proxy handling HTTPS/TLS and routing.
   - Application Tier: NestJS API modular backend containing:
     - Auth / RBAC
     - Tickets
     - Jobs / Dispatch
     - Contracts / Billing
     - Remote Support
     - Privacy / Compliance
   - Data & Storage Tier: PostgreSQL database, Redis Queue/Worker, Private S3/R2 Object Storage. *(Source: Section 2.1)*
3. **Repository Workspace Architecture:**
   - `apps/web/` — Next.js frontend web application
   - `apps/api/` — NestJS backend application
   - `packages/ui/` — Shared UI component library
   - `packages/config/` — Shared configurations (ESLint, TS, Tailwind/CSS)
   - `packages/types/` — Shared TypeScript type definitions
   - `packages/validation/` — Shared validation schemas
   - `packages/telemetry/` — Shared logging, metrics, and tracing
   - `database/prisma/` — `schema.prisma`, `migrations/`, `seed.ts`
   - `infrastructure/` — `docker/`, `compose/`, `scripts/`, `provisioning/`
   - `docs/` — `architecture/`, `api/`, `security/`, `compliance/`, `operations/`
   - `tests/` — End-to-end and cross-cutting integration test suites *(Source: Section 2.3)*
4. **Architectural Scaling Progression:**
   Single server → Managed PostgreSQL → Managed object storage/queue → Multiple API instances → Load balancer → Higher availability / multi-zone → Multi-region only if justified. *(Source: Section 2.17)*
5. **Anti-Complexity Architecture Rules:** No Kubernetes, sharding, complex service mesh, or microservices without demonstrated business justification and workload demands. *(Sources: Section 1.6, 2.17)*

---

## 14. Database Requirements

### 14.1 Database Conventions & Constraints *(Sources: Section 2.5, 5.12)*
- Authoritative datastore: PostgreSQL.
- Primary keys: UUID (`@id @default(uuid()) @db.Uuid`).
- Column and table naming: `snake_case` database identifiers (`@@map(...)`).
- Timestamps: UTC timestamps (`createdAt DateTime @default(now())`, `updatedAt DateTime @updatedAt`).
- Foreign keys: Explicit foreign key relationships.
- Indexes: Explicit indexes on foreign keys, organization scope (`@@index([organizationId])`), and composite indexes for common queries (`@@index([organizationId, status])`).
- Data integrity: Database constraints (Unique, Check, Foreign Key).
- Isolation enforcement: Mandatory `organization_id` on all organization-owned entities.
- Business atomicity: Transaction boundaries for all multi-record business operations.
- Migration management: Prisma migrations.

### 14.2 Core Data Entities (40 Entities Extracted from Master)
*(Sources: Section 2.5, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 5.10)*

> **Annotation:** The parenthetical field sketches attached to bare entities below are illustrative inferences and are NOT authoritative schemas from the Master Specification. Master Section 5 explicitly defines attribute schemas for only `users`, `organizations`, `memberships`, `audit_events`, `remote_support_sessions`, `retention_rules`, and the illustrative `Ticket` Prisma model in Section 5.12; the remaining 33 entities are listed as bare model names in the Master awaiting formal schema elaboration in implementation phases.

1. `users` (id, email, password_hash / identity_provider_reference, status, mfa_enabled, created_at, updated_at)
2. `organizations` (id, name, status, created_at, updated_at)
3. `memberships` (id, user_id, organization_id, role_id, status, created_at, updated_at)
4. `roles` (id, name, description, created_at, updated_at)
5. `permissions` (id, key, description, created_at, updated_at)
6. `role_permissions` (role_id, permission_id)
7. `organization_locations` (id, organization_id, name, address, created_at, updated_at)
8. `contacts` (id, organization_id, name, email, phone, created_at, updated_at)
9. `technicians` (id, user_id, organization_id, status, created_at, updated_at)
10. `technician_skills` (id, technician_id, skill_name, proficiency_level, created_at, updated_at)
11. `services` (id, organization_id, name, description, rate, created_at, updated_at)
12. `assets` (id, organization_id, customer_id, name, serial_number, status, created_at, updated_at)
13. `tickets` (id, organization_id, customer_id, location_id, assigned_technician_id, title, description, priority, status, sla_id, created_at, updated_at)
14. `ticket_messages` (id, ticket_id, sender_id, body, is_internal, created_at)
15. `ticket_attachments` (id, ticket_id, file_key, file_name, file_size, mime_type, created_at)
16. `jobs` (id, ticket_id, organization_id, status, created_at, updated_at)
17. `dispatch_assignments` (id, job_id, technician_id, status, assigned_at, responded_at)
18. `appointments` (id, job_id, scheduled_start, scheduled_end, actual_start, actual_end, check_in_at, check_out_at, created_at, updated_at)
19. `contracts` (id, organization_id, customer_id, title, start_date, end_date, status, created_at, updated_at)
20. `contract_entitlements` (id, contract_id, service_id, allowance_units, unit_type, created_at, updated_at)
21. `entitlement_usage` (id, entitlement_id, ticket_id, units_used, recorded_at)
22. `quotes` (id, organization_id, customer_id, total_amount, status, created_at, updated_at)
23. `quote_items` (id, quote_id, service_id, quantity, unit_price, total_price)
24. `invoices` (id, organization_id, customer_id, quote_id, total_amount, status, due_date, paid_at, created_at, updated_at)
25. `remote_support_sessions` (id, ticket_id, customer_id, technician_id, authorization_id, consent_id, start_time, end_time, status, audit_reference, created_at, updated_at)
26. `audit_events` (id, actor_id, organization_id, action, resource_type, resource_id, request_id, timestamp, result, metadata)
27. `security_events` (id, event_type, severity, actor_id, ip_address, user_agent, details, timestamp)
28. `notifications` (id, user_id, organization_id, type, title, body, read_at, created_at)
29. `security_policies` (id, organization_id, title, policy_body, version, status, created_at, updated_at)
30. `risk_register` (id, organization_id, risk_description, impact, likelihood, mitigation_plan, status, created_at, updated_at)
31. `asset_register` (id, organization_id, asset_name, classification, owner_id, status, created_at, updated_at)
32. `control_register` (id, framework, control_code, title, description, implementation_status, evidence_reference, updated_at)
33. `vendor_register` (id, organization_id, vendor_name, service_provided, risk_rating, review_date, status, created_at, updated_at)
34. `incident_records` (id, organization_id, incident_type, severity, description, containment_actions, remediation_actions, status, reported_at, resolved_at)
35. `privacy_requests` (id, requester_id, request_type, status, verification_evidence, resolution_notes, requested_at, completed_at)
36. `retention_rules` (id, organization_id, data_type, retention_period, action, legal_basis, enabled, created_at, updated_at)
37. `compliance_evidence` (id, control_id, evidence_type, file_key, description, collected_by, collected_at)
38. `policy_versions` (id, policy_type, version_number, content, effective_date, created_at)
39. `policy_acceptances` (id, user_id, policy_version_id, accepted_at, ip_address)
40. `consents` (id, user_id, organization_id, consent_type, granted, granted_at, revoked_at)

---

## 15. API Requirements

1. **Standard Prefix & Specification:** Base path `/api/v1`, governed strictly by OpenAPI 3.x contract. *(Sources: Section 1.3, 2.6)*
2. **Health Check Probes:**
   - `GET /health` (General system health)
   - `GET /health/live` (Liveness probe)
   - `GET /health/ready` (Readiness probe) *(Source: Section 2.15)*
3. **Authentication & Identity Endpoints:**
   - `POST /api/v1/auth/login`
   - `POST /api/v1/auth/logout`
   - `POST /api/v1/auth/refresh`
   - `POST /api/v1/auth/mfa/verify`
   - `GET  /api/v1/me` *(Source: Section 2.6)*
4. **Ticket Endpoints:**
   - `POST  /api/v1/tickets`
   - `GET   /api/v1/tickets`
   - `GET   /api/v1/tickets/{id}`
   - `PATCH /api/v1/tickets/{id}`
   - `POST  /api/v1/tickets/{id}/assign`
   - `POST  /api/v1/tickets/{id}/resolve`
   - `POST  /api/v1/tickets/{id}/close`
   - `POST  /api/v1/tickets/{id}/jobs` *(Source: Section 2.6)*
5. **Job & Dispatch Endpoints:**
   - `GET  /api/v1/jobs`
   - `POST /api/v1/jobs/{id}/accept`
   - `POST /api/v1/jobs/{id}/reject`
   - `POST /api/v1/jobs/{id}/check-in`
   - `POST /api/v1/jobs/{id}/check-out` *(Source: Section 2.6)*
6. **Contracts & Commercial Endpoints:**
   - `GET  /api/v1/contracts`
   - `POST /api/v1/contracts` *(Source: Section 2.6)*
7. **Remote Support Session Endpoints:**
   - `POST /api/v1/tickets/{id}/remote-sessions`
   - `POST /api/v1/remote-sessions/{id}/consent`
   - `POST /api/v1/remote-sessions/{id}/start`
   - `POST /api/v1/remote-sessions/{id}/terminate` *(Source: Section 2.6)*
8. **Administration & Audit Endpoints:**
   - `GET /api/v1/admin/audit-events`
   - `GET /api/v1/admin/security-events` *(Source: Section 2.6)*
9. **Standard Protection Pipeline:** HTTPS → Rate Limit → Authentication → Organization Context → Authorization → Validation → Controller → Application Service → Repository → Database. *(Source: Section 2.6)*

---

## 16. Security Requirements

1. **Authentication & Session Security:** Secure session handling, token validation, secure cookie settings, failed login rate limiting, session termination on logout. *(Sources: Section 1.3, 2.7, 3.2)*
2. **MFA Requirements:** Mandatory Multi-Factor Authentication for all privileged accounts (`OWNER`, `ADMIN`, `SECURITY_ADMIN`). *(Sources: Section 1.3, 2.7, 3.1)*
3. **RBAC & Least Privilege:** Server-side role and granular permission resolution with strict enforcement on every endpoint. *(Sources: Section 1.3, 1.7, 2.7)*
4. **Tenant Isolation:** Rigorous multi-tenant isolation where every query scopes organization data via `organization_id`. Automated cross-tenant tests must verify access failure across tickets, customers, assets, contracts, invoices, attachments, reports, and audit records. *(Sources: Section 1.3, 1.7, 2.8)*
5. **Threat Model Coverage:** Required defense-in-depth mitigations against:
   - Authentication attacks (credential stuffing, brute force)
   - Authorization bypass
   - Cross-tenant access
   - Injection (SQL, command, XSS)
   - Server-Side Request Forgery (SSRF)
   - File-upload abuse (malware, mime spoofing, path traversal)
   - Webhook forgery/replay
   - Credential theft
   - Session abuse / hijacking
   - Rate-limit evasion
   - Dependency compromise
   - Secret exposure
   - Data exfiltration *(Source: Section 2.9)*
6. **Cryptography & Secrets Management:**
   - Mandatory TLS for all production in-transit communications. *(Source: Section 2.10)*
   - Encryption at rest for PostgreSQL database, object storage buckets, and database backups. *(Sources: Section 1.3, 2.10)*
   - Passwords must be cryptographically hashed (e.g., Argon2/bcrypt), never reversibly encrypted. *(Source: Section 2.10)*
   - Platform-managed secret/KMS facilities preferred. *(Source: Section 2.10)*
   - Strict ban on committing secrets to Git, exposing secrets in frontend bundles, or writing secrets to logs. *(Sources: Section 2.4, 2.10)*
   - Masking of all sensitive values in logs and UI. *(Source: Section 2.10)*
   - Cryptographic key lifecycle management: Generate → Activate → Use → Rotate → Retire → Destroy. *(Source: Section 2.10)*
7. **Audit & Security Event Logging:**
   - Comprehensive audit logging (`audit_events`) capturing: actor, organization, action, resource_type, resource_id, request_id, timestamp, result, and metadata. *(Sources: Section 1.3, 5.8)*
   - Security event tracking (`security_events`) for authentication anomalies, privilege modifications, and security incidents. *(Sources: Section 2.5, 5.8)*
8. **File Storage Security:** Private object storage buckets with signed, expiring URLs for download; upload mime/size validation. *(Sources: Section 1.3, 2.2, Phase 2)*
9. **Release Gate Blocking:** Critical security defects and cross-tenant leakage failures strictly block production releases. *(Sources: Section 2.9, Phase 8)*

---

## 17. Privacy Requirements

1. **Privacy by Design:** Privacy-protective architecture embedded into data models and default application settings. *(Sources: Section 1.1, 2.12)*
2. **Data Classification:** Systematic classification of platform, organization, customer, and personal data. *(Source: Section 2.12)*
3. **Legal Document Framework:** Mandatory published, versioned legal documents: Terms & Conditions, Privacy Policy, and Cookie Policy. *(Sources: Section 1.3, 2.12)*
4. **Policy Versioning & Acceptance:** Tracking of policy version releases (`policy_versions`) and affirmative user acceptances with timestamps and IP addresses (`policy_acceptances`). *(Sources: Section 2.5, 5.9)*
5. **Consent Management:** Granular consent capture, tracking, and revocation (`consents`), including specific remote-support session consent. *(Sources: Section 1.3, 2.12, 3.7, 5.9)*
6. **Data Subject Privacy Request Lifecycle:** Standardized operational flow for privacy requests: Intake → ID Verification → Request Type Determination → Data Discovery → Retention/Legal Check → Fulfill/Reject → Verify → Evidence Record → Requester Notification. *(Sources: Section 1.4, 3.8, 5.9)*
7. **Data Retention & Lifecycle Enforcement:** Configurable retention rules (`retention_rules`) supporting actions (`DELETE`, `ANONYMIZE`, `ARCHIVE`, `REVIEW`) while respecting statutory retention obligations. *(Sources: Section 1.7, 5.9, 5.10)*
8. **Data Protection in Non-Production:** Strict rule prohibiting copying production data to development environments without approved anonymization. *(Sources: Section 1.7, 2.10)*
9. **Privacy Operations Dashboard:** Dedicated privacy management interface for administrators. *(Sources: Section 1.4, Phase 7)*

---

## 18. Compliance Requirements

1. **ISO/IEC 27001:2022 Alignment:** Information Security Management System (ISMS) alignment encompassing technical, organizational, people, and physical controls. *(Sources: Preamble, Section 1.3, 2.12, 2.13, Phase 14)*
2. **ISO/IEC 27701:2025 Alignment:** Privacy Information Management System (PIMS) alignment. *(Sources: Preamble, Section 1.3, 2.12, Phase 14)*
3. **Accreditation Claim Prohibition:** The platform must not claim ISO certification before an appropriate independent certification audit process is completed. *(Sources: Preamble, Section 1.7, 2.13)*
4. **Living Statement of Applicability & Control Register:** Maintain a living Statement of Applicability and Control Register (`control_register`). *(Sources: Section 2.13, 5.9, Phase 14)*
5. **End-to-End Compliance Traceability:** Full audit traceability chain:
   `Risk` → `Requirement` → `Architecture` → `Implementation` → `Test` → `Evidence` → `Review`. *(Source: Section 2.13)*
6. **Compliance Governance Registers:**
   - Risk Register (`risk_register`)
   - Asset Register (`asset_register`)
   - Control Register (`control_register`)
   - Vendor Register (`vendor_register`)
   - Incident Records (`incident_records`)
   - Compliance Evidence Repository (`compliance_evidence`) *(Sources: Section 2.5, 5.9, Phase 6)*
7. **Jurisdictional Legal Alignment:** Review and adherence to applicable international privacy legislation across operating jurisdictions. *(Source: Section 2.12)*
8. **Compliance Operations Dashboard:** Centralized compliance task and evidence tracking dashboard. *(Sources: Section 1.4, 4.3, Phase 7)*

---

## 19. Remote-Support Requirements

1. **Mandatory Dual Authorization & Consent:** Remote support sessions require explicit customer authorization and technician authorization linked to an active Ticket. *(Sources: Section 1.3, 1.7, 2.11, 3.7, Phase 5)*
2. **Golden Session Rule:** No authorized consent = no session. *(Source: Phase 5)*
3. **Zero Stored Credentials Rule:** Absolutely no remote-support passwords or session credentials are stored by the application. *(Sources: Section 1.7, 2.11, 5.7, Phase 5)*
4. **Session Lifecycle:** Ticket → Customer Request/Approval → Identity/Authorization Check → Technician Authorization → Session Created → Consent Recorded → Session Starts → Activity Audited → Session Terminates → Audit Finalization. *(Sources: Section 2.11, 3.7)*
5. **Session Data Model (`remote_support_sessions`):** Captures ticket, customer, technician, authorization, consent, start time, end time, status, and audit reference. *(Source: Section 5.7)*
6. **Provider Abstraction:** Remote session signaling and coordination managed via `RemoteSupportProvider` abstraction interface. *(Source: Section 2.2)*
7. **Customer UI Experience:** Explain session purpose → Show technician identity → Consent prompt → Start → Active session indicator → Immediate termination button. *(Source: Section 4.8)*
8. **Technician UI Experience:** Request session → Authorization status check → Customer consent status check → Start → Active session view → Terminate. *(Source: Section 4.8)*
9. **Audit Trail:** Comprehensive audit record generated for every session initiation, active duration, and termination event. *(Sources: Section 2.11, 3.7, 5.7, Phase 5)*

---

## 20. Infrastructure Requirements

1. **Provider Independence:** Application design must remain fully decoupled from cloud-vendor-specific proprietary services. *(Sources: Section 1.1, 1.3, 1.7, 2.2)*
2. **Zero/Minimal-Cost MVP Target:** Deployable initially to approved low-cost or free-tier hosting environments (e.g., Vercel-compatible web, approved low-cost backend hosting, managed low-cost Postgres/Redis). *(Sources: Section 1.1, 1.3, 2.2, Phase 9)*
3. **Containerization & Local Dev:** Docker container definitions and Docker Compose orchestration for deterministic local development. *(Sources: Section 2.2, 2.3, 2.4, Phase 0)*
4. **Reverse Proxy:** Reverse proxy terminating TLS and routing to frontend and API backend. *(Source: Section 2.1)*
5. **Database & Storage Services:** PostgreSQL database, Redis-compatible queue/cache, and S3-compatible / Cloudflare R2-compatible private object storage. *(Sources: Section 2.1, 2.2)*
6. **Scaling Path Progression:** Single server → Managed PostgreSQL → Managed object storage/queue → Multiple API instances → Load balancer → Higher availability / multi-zone → Multi-region only if justified. *(Source: Section 2.17)*
7. **Infrastructure Upgrades Trigger:** Upgrade to paid/enterprise infrastructure triggered only by revenue, funding, customer SLAs, security requirements, or sustained resource saturation. *(Sources: Section 1.1, 1.7, 2.17, Phase 12)*
8. **Prohibited Infrastructure in MVP:** No Kubernetes, multi-region active-active clusters, service mesh, or distributed multi-database sharding in the initial MVP. *(Sources: Section 1.6, 2.17)*

---

## 21. Testing Requirements

*(Source: Section 2.9, 2.14, Phase 0, Phase 8)*

1. **Unit Testing:** Comprehensive unit tests across all domain logic, services, and utilities.
2. **Integration Testing:** Service and database integration test suites.
3. **API Testing:** Automated testing of all REST endpoints against OpenAPI contracts.
4. **Tenant Isolation Testing:** Mandatory automated tests proving that cross-organization access attempts fail for tickets, customers, assets, contracts, invoices, attachments, reports, and audit records.
5. **RBAC & Authorization Testing:** Verification of role permissions, least privilege, and forbidden action handling.
6. **Authentication Testing:** Session lifecycle, token expiry, login, logout, and token refresh.
7. **MFA Testing:** Enrollment, verification, challenge enforcement on privileged roles, and fallback handling.
8. **Input Security Testing:** SQL injection, command injection, XSS, SSRF, payload boundary validation.
9. **File Upload Testing:** Private bucket access control, file size limits, mime validation, malware/abuse prevention.
10. **Secret Scanning:** Automated scans blocking secrets in source code and commits.
11. **Dependency Scanning:** Vulnerability scanning of third-party packages in CI.
12. **SAST (Static Application Security Testing):** Code analysis for security flaws in CI pipeline.
13. **DAST (Dynamic Application Security Testing):** Dynamic vulnerability analysis against deployed test/staging instances.
14. **Database Migration Testing:** Automated forward and rollback migration execution verification in CI.
15. **Performance & Load Testing:** Validation of API latency targets (p95 <= 500 ms) and concurrent user scaling.
16. **Backup Restoration Testing:** Regular automated verification of database backup restoration into clean test environments.
17. **Disaster Recovery Testing:** Validation of failover and disaster recovery runbooks.
18. **Accessibility Testing:** Automated and manual validation against WCAG 2.2 AA criteria.
19. **Penetration Testing:** Independent or simulated penetration testing prior to enterprise hardening.

---

## 22. CI/CD Requirements

1. **Monorepo Version Control:** GitHub repository managed with pnpm and Turborepo. *(Sources: Section 2.2, 2.3)*
2. **Standard Pipeline Progression:**
   `Feature branch` → `Pull Request` → `CI Checks` → `Peer Review` → `Merge to Main` → `Build Immutable Artifact` → `Deploy to Staging` → `Run Smoke Tests` → `Deploy to Production`. *(Source: Section 2.14)*
3. **Mandatory CI Pipeline Gates:**
   - Linting
   - Type checking
   - Unit & Integration tests
   - API contract tests
   - Build verification
   - Secret scanning
   - Dependency vulnerability scanning
   - SAST / Security static analysis
   - Database migration tests
   - Tenant isolation verification tests *(Source: Section 2.14)*
4. **Immutable Build Artifacts:** Production releases deploy immutable container/build artifacts verified in Staging. *(Source: Section 2.14)*
5. **Automated Smoke Testing:** Post-deployment smoke tests in Staging and Production. *(Sources: Section 2.14, Phase 9)*
6. **Rollback Capability:** Instant, documented rollback procedures available for every production deployment. *(Sources: Section 1.8, Phase 8, Phase 9)*

---

## 23. Observability Requirements

1. **Three Pillars of Observability:** Comprehensive instrumentation of Logs + Metrics + Traces across web and API layers. *(Source: Section 2.15)*
2. **Core Operational Metrics Monitored:**
   - API latency (p50, p95, p99)
   - HTTP error rates (4xx, 5xx)
   - Database connection pool health and query latency
   - Background queue depth, job latency, and processing failures
   - Authentication anomalies and brute-force indicators
   - Storage consumption and I/O failure rates
   - Backup completion status and verification telemetry
   - Security events and privilege change anomalies *(Sources: Section 1.8, 2.15)*
3. **Standard Health Probe Endpoints:**
   - `GET /health`
   - `GET /health/live`
   - `GET /health/ready` *(Source: Section 2.15)*
4. **Dedicated External Observability Integrations:**
   - Error Tracking: Sentry. *(Source: Section 2.2)*
   - Product & User Analytics: PostHog. *(Source: Section 2.2)*
5. **Structured Audit Trail:** Request-scoped audit event emission with correlation UUID (`requestId`). *(Sources: Section 5.8, 5.11)*

---

## 24. Backup and Disaster-Recovery Requirements

1. **Backup Pipeline Architecture:**
   `Production DB` → `Backup System` → `Backup Storage` → `Recovery Environment` → `Restore / Verify`. *(Source: Section 2.16)*
2. **Authoritative Backup Rule:** *"A backup is not considered reliable until restoration has been successfully tested."* *(Sources: Section 2.16, Phase 8)*
3. **Recovery Objectives (Initial Targets):**
   - RPO (Recovery Point Objective) <= 24 hours. *(Source: Section 2.16)*
   - RTO (Recovery Time Objective) <= 24 hours. *(Source: Section 2.16)*
   - (Note: Targets tighten as paid infrastructure is introduced.)
4. **Backup Storage Isolation:** Backups stored in separate, secure, encrypted object storage with restricted access policies. *(Sources: Section 2.10, 2.16)*
5. **Scheduled Restore Verification:** Automated scheduled restoration tests into clean recovery environments to verify database integrity and record compliance evidence. *(Sources: Section 3.10, Phase 8)*
6. **Disaster Recovery Procedures:** Documented DR playbooks covering catastrophic host failure, database corruption, and secret compromise. *(Sources: Section 1.4, Phase 8)*
7. **Release Rollback Requirement:** Production release gates require verified rollback availability. *(Sources: Section 1.8, Phase 8)*

---

## 25. Deployment and Environment Requirements

1. **5-Tier Environment Progression Model:**
   `LOCAL` → `TEST` → `STAGING` → `MVP PRODUCTION` → `FUNDED PRODUCTION` *(Source: Section 2.4)*
2. **Environment Boundary Isolation:** Strict segregation of databases, object storage, credentials, and API secrets between all environments. *(Source: Section 2.4)*
3. **Zero Production Data in Development:** Strict prohibition against copying production databases into development without approved anonymization pipelines. *(Sources: Section 1.7, 2.10)*
4. **Secret Externalization:** Production secrets are never committed to source control; managed via secure KMS / environment secret facilities. *(Sources: Section 2.4, Phase 0)*
5. **Target Hosting Infrastructure:**
   - Frontend: Next.js deployed to Vercel-compatible hosting. *(Source: Section 2.2)*
   - Backend: NestJS deployed to provider-independent / approved low-cost hosting environment. *(Sources: Section 2.2, Phase 9)*
   - Database: PostgreSQL on managed/low-cost provider. *(Sources: Section 2.2, Phase 9)*
   - Cache/Queue: Redis-compatible managed service. *(Sources: Section 2.2, Phase 9)*
   - Storage: Cloudflare R2 / S3-compatible private object storage. *(Source: Section 2.2)*

---

## 26. Implementation Phases

*(Extracted from Section 6 — All 15 Phases detailed with deliverables and acceptance criteria)*

### Phase 0 — Engineering Foundation (Milestone M0)
- **Deliverables:** Repository, project structure, pnpm/Turborepo monorepo, Next.js, NestJS, PostgreSQL, Prisma, Docker Compose, environment configuration, CI/CD foundation, OpenAPI specification, test framework, security baseline.
- **Acceptance:** Local environment works; CI passes; Database migrations work; API starts; Web starts; Secrets are externalized.

### Phase 1 — Secure Identity (Milestone M1)
- **Deliverables:** Authentication, sessions, MFA, users, organizations, memberships, RBAC, tenant isolation, audit logging.
- **Acceptance:** Unauthorized access blocked; MFA works; Cross-tenant tests pass; Privileged actions audited.

### Phase 2 — Core Platform (Milestone M2)
- **Deliverables:** Customers, locations, contacts, technicians, services, assets, tickets, attachments.
- **Acceptance:** Core CRUD works; Authorization enforced; Uploads are private and controlled.

### Phase 3 — Dispatch and Operations (Milestone M3)
- **Deliverables:** Jobs, scheduling, dispatch, technician skills, SLA management, escalation, job completion.
- **Acceptance:** Ticket → Job → Assignment → Appointment → Completion flow works end-to-end.

### Phase 4 — Contracts and Billing (Milestone M4)
- **Deliverables:** Contracts, entitlements, usage, quotes, invoices, payment-provider abstraction (Dodo Payments).
- **Acceptance:** Commercial lifecycle is auditable; Provider can be replaced without rewriting business logic.

### Phase 5 — Remote Support (Milestone M5)
- **Deliverables:** Consent, session creation, authorization, session start, session termination, audit.
- **Acceptance:** No authorized consent = no session; Every session is auditable; No remote-support passwords stored.

### Phase 6 — Privacy and Governance (Milestone M6)
- **Deliverables:** Privacy workflows, retention, data export, data deletion/anonymization, compliance records, security policies, legal-policy integration, policy versions, consent records, evidence records.
- **Acceptance:** Privacy workflow can be executed end-to-end; Evidence is retained; Retention rules are enforceable.

### Phase 7 — Administration (Milestone M7)
- **Deliverables:** Owner dashboard, admin dashboard, security dashboard, compliance dashboard, user/role management, access review.
- **Acceptance:** Owner has complete authorized administrative visibility; Privileged actions are protected and audited.

### Phase 8 — Hardening (Milestone M8)
- **Deliverables:** Security testing, performance testing, accessibility testing, backup restoration, disaster recovery, penetration testing when appropriate, threat-model review, vulnerability remediation.
- **Acceptance / Release Gate:** Critical vulnerabilities = 0; Tenant isolation = PASS; MFA/admin security = PASS; Backup = VERIFIED; Restore = VERIFIED; Monitoring = ACTIVE; Rollback = AVAILABLE; UAT = APPROVED.

### Phase 9 — MVP Deployment (Milestone M9)
- **Deliverables:** Deploy to approved zero/minimal-cost environment.
- **Acceptance Requirements:** Provider-independent application design; Private database/queue; HTTPS; Monitoring; Backups; Restore verification; Rollback procedure; Production smoke tests.

### Phase 10 — Controlled Pilot (Milestone M10)
- **Deliverables & Tracking:** Active customers, ticket volume, resolution time, SLA performance, errors, security events, infrastructure cost, customer feedback.

### Phase 11 — Revenue Validation (Milestone M11)
- **Deliverables & Evaluation:** Use actual workload and revenue data to determine capacity, cost/customer, reliability, feature priorities, and infrastructure upgrade timing.

### Phase 12 — Paid Infrastructure Migration (Milestone M12)
- **Deliverables:** Migration to paid infrastructure triggered by revenue, funding, free-tier limits, customer SLAs, or compliance needs.
- **Acceptance:** Preserves application contracts and provider abstractions without codebase rewrites.

### Phase 13 — Enterprise Hardening (Milestone M13)
- **Deliverables:** Managed PostgreSQL, managed Redis/queue, multiple API instances, load balancer, higher availability, stronger monitoring, centralized SecOps tooling, Infrastructure as Code (IaC), Enterprise SSO, advanced analytics.

### Phase 14 — ISO Certification Preparation (Milestone M14)
- **Deliverables:** Establish and operate ISMS, risk management, Statement of Applicability, control register, policies, training, supplier management, incident management, access reviews, internal audit, corrective actions, management review, certification-audit preparation.

---

## 27. Acceptance and Release Gates

### 27.1 MVP Production Release Gate *(Sources: Section 1.8, Phase 8)*

| Gate Check | Required Status | Source |
|---|---|---|
| Requirements implemented | PASS | Section 1.8 |
| Critical vulnerabilities | 0 (Zero) | Section 2.9, Phase 8 |
| Security testing | PASS | Section 1.8, Phase 8 |
| Tenant isolation | PASS | Section 1.8, Phase 8 |
| MFA & Admin security | PASS | Section Phase 8 |
| Privacy controls | PASS | Section 1.8 |
| Backups | VERIFIED | Section 1.8, Phase 8 |
| Restoration | VERIFIED | Section 1.8, Phase 8 |
| UAT | APPROVED | Section 1.8, Phase 8 |
| Monitoring | ACTIVE | Section 1.8, Phase 8 |
| Rollback | AVAILABLE | Section 1.8, Phase 8 |
| Documentation | DELIVERED | Section 1.8 |

### 27.2 Phase-Specific Milestone Gates *(Source: Section 6)*
- **Phase 0:** Local environment works, CI passes, migrations run, web and API start, secrets externalized.
- **Phase 1:** Unauthorized access blocked, MFA verified, cross-tenant leak tests pass, privileged actions audited.
- **Phase 2:** Core CRUD operational, authorization enforced, private controlled file uploads.
- **Phase 3:** Ticket → Job → Assignment → Appointment → Completion end-to-end operational.
- **Phase 4:** Commercial billing lifecycle auditable, payment provider abstraction verified.
- **Phase 5:** Dual consent enforced, zero passwords stored, complete session audit.
- **Phase 6:** Privacy request workflow executable, compliance evidence recorded, retention rules active.
- **Phase 7:** Owner full operational visibility, admin/security dashboards operational.

---

## 28. External Providers and Integrations

### 28.1 Specified External Services *(Source: Section 2.2)*
1. **Payments:** Dodo Payments (accessed via `PaymentProvider` abstraction)
2. **Analytics:** PostHog (telemetry & product usage)
3. **Error Tracking:** Sentry (application runtime error logging)
4. **Email Delivery:** Resend (transactional email, verification, alerts via `EmailProvider`)
5. **Source Control & CI:** GitHub (code repository, PR workflows, Actions CI)
6. **Web Hosting:** Vercel-compatible deployment platform
7. **Object Storage:** Cloudflare R2 / AWS S3-compatible service (via `StorageProvider`)
8. **Queue / Caching:** Redis-compatible cloud/container service

### 28.2 Mandatory Provider Abstraction Interfaces *(Source: Section 2.2)*
1. `StorageProvider` (Interface isolating S3 / R2 / MinIO)
2. `EmailProvider` (Interface isolating Resend / SES / SendGrid)
3. `NotificationProvider` (Interface isolating in-app, SMS, push channels)
4. `PaymentProvider` (Interface isolating Dodo Payments / Stripe / Paddle)
5. `RemoteSupportProvider` (Interface isolating WebRTC / RustDesk / external remote tooling)
6. `MapsProvider` (Interface isolating location lookup / distance calculation)

---

## 29. Explicit Constraints

1. **Zero/Minimal Initial Cost:** Architecture must deploy to zero/near-zero cost infrastructure in MVP phase without requiring paid enterprise tiers upfront. *(Sources: Section 1.1, 1.3, 1.7, 2.2)*
2. **Provider Independence:** Business logic must never bind directly to proprietary cloud APIs; all external I/O must go through provider abstractions. *(Sources: Section 1.1, 1.7, 2.2, Phase 4)*
3. **Monolith Boundary Discipline:** MVP must remain a single deployable unit; no premature microservices, Kubernetes, or service mesh. *(Sources: Section 1.1, 1.6, 2.1, 2.17)*
4. **Zero Remote-Support Credential Storage:** Platform must never store passwords or credentials for remote-support sessions. *(Sources: Section 1.7, 2.11, 5.7)*
5. **Cryptographic Password Storage:** Passwords must be cryptographically hashed; reversible encryption is strictly prohibited. *(Source: Section 2.10)*
6. **No Production Data in Lower Environments:** Production databases must never be copied to development without approved anonymization. *(Sources: Section 1.7, 2.10)*
7. **No Blind Data Deletion:** Privacy deletion requests must never bypass legal, financial, or security retention mandates. *(Sources: Section 1.7, 3.8, 5.10)*
8. **Strict Multi-Tenant Scoping:** Every database query against tenant-owned resources must filter by `organization_id`. *(Sources: Section 1.7, 2.8)*
9. **Certification Claim Ban:** The platform must not claim ISO certification prior to completing an accredited independent certification audit. *(Sources: Preamble, Section 1.7, 2.13)*
10. **Zero Secrets in Code/Logs:** Secrets must not be committed to Git, bundled into frontend code, or printed in application logs. *(Sources: Section 2.4, 2.10)*
11. **Asynchronous Heavy Processing:** Reports and bulk exports must not execute synchronously on the HTTP request cycle. *(Source: Section 2.17)*
12. **Authoritative Datastore:** PostgreSQL is the single authoritative datastore for all application state. *(Sources: Section 2.2, 2.5)*
13. **Strict Backup Validity:** Backups are only valid if restoration has been successfully tested and recorded. *(Sources: Section 1.8, 2.16)*
14. **Accessibility Target:** Interfaces must target WCAG 2.2 AA. *(Sources: Section 1.4, 4.9)*

---

## 30. Ambiguities or Contradictions in the Master

During comprehensive analysis of [`docs/MASTER-SPEC-001-002.md`](file:///C:/SURAJ/Remotfix/docs/MASTER-SPEC-001-002.md), the following ambiguities and discrepancies were identified:

1. **Priority Discrepancy on SLA Escalation & Background Processing:**
   - In Section 1.3 (Must-Have Requirements, Line 52), *"SLA tracking and escalation"* is classified as **Must-Have**.
   - In Section 1.4 (Should-Have Requirements, Line 80 & 81), *"Automated SLA escalation"* and *"Background job processing"* are classified as **Should-Have**.
   - In Section 6 (Phase 3 Execution Plan, Lines 1539–1540), *"SLA management"* and *"Escalation"* are required core deliverables for Phase 3 (MVP Phase).
2. **Priority Discrepancy on Dashboards & Privacy/Data Management:**
   - In Section 1.3 (Line 66), *"Privacy/data-management functionality"* is classified as **Must-Have**.
   - In Section 1.4 (Lines 82, 84, 85), *"Data export/deletion workflows"*, *"Security dashboard"*, and *"Privacy dashboard"* are classified as **Should-Have**.
   - In Section 6 (Phase 6 & Phase 7, Lines 1588–1625), privacy workflows, data export/deletion, security dashboard, and privacy dashboard are included as deliverables prior to Phase 8 Hardening and Phase 9 MVP Deployment.
3. **Discrepancy Between Primary Users (Section 1.2) and Initial RBAC Roles (Section 2.7):**
   - Section 1.2 specifies 7 Primary Users: *Platform owner, Organization administrators, Staff/operations users, Technicians, Customers, Security/compliance administrators, Authorized support personnel*.
   - Section 2.7 specifies 6 Initial Roles: `OWNER`, `ADMIN`, `MANAGER`, `TECHNICIAN`, `STAFF`, `CUSTOMER`.
   - The user personas *"Security/compliance administrators"* and *"Authorized support personnel"* from Section 1.2 do not appear as dedicated role enums in Section 2.7, while `MANAGER` appears in Section 2.7 without being listed in Section 1.2.
4. **Schema Definition Granularity in Section 5 vs Entity List in Section 2.5:**
   - Section 2.5 lists 40 entity names.
   - Section 5 provides explicit field definitions for only `users`, `organizations`, `memberships`, `Ticket` (example Prisma model in 5.12), and `audit_events`/`retention_rules` attribute sketches, but leaves remaining entities (e.g., `services`, `assets`, `quotes`, `invoices`, `risk_register`, `vendor_register`) as bare model names without field-level schemas or relationship cardinality.
   - The Prisma `Ticket` model in Section 5.12 includes `id`, `organizationId`, `status`, `priority`, `createdAt`, `updatedAt`, but omits `customer_id`, `location_id`, `assigned_technician_id`, `title`, `description`, `sla_id` which are mandated conceptually in Section 5.4.
5. **Remote Support Technical Protocol Unspecified:**
   - Section 2.2 and Section 2.11 define `RemoteSupportProvider` and strict consent/session lifecycle without passwords, but the Master does not specify the underlying default protocol/tooling (e.g., WebRTC signaling, custom session URL broker, or external client integration) to be implemented for the initial provider adapter.
6. **Payment Provider Scope in MVP:**
   - Section 2.2 specifies *Dodo Payments through provider abstraction* in Phase 4, but does not define whether MVP Phase 4 requires one-off invoice settlement, recurring contract subscriptions, or both.
7. **Maps Provider Backend Unspecified:**
   - Section 2.2 lists `MapsProvider` among mandatory abstractions, but does not specify the default provider (e.g., OpenStreetMap / Nominatim, Google Maps, Mapbox) for MVP zero-cost technician dispatch and location matching.

---

## 31. Items Requiring Human Clarification

The following items represent design and scope decisions that require stakeholder/human clarification before implementation:

1. **Role Model Mapping:** Should *Security/compliance administrator* and *Authorized support personnel* be implemented as distinct database roles (e.g., `SECURITY_ADMIN`, `SUPPORT_AGENT`) or as specific granular permission sets assigned to `ADMIN` / `MANAGER`?
2. **Remote Support Provider Implementation:** What default protocol or integration mechanism should back the `RemoteSupportProvider` adapter for Phase 5 (e.g., WebRTC video/screen sharing, session bridge URL generation, or third-party tool signaling)?
3. **Dodo Payments Scope for MVP:** Does MVP Phase 4 require full automated recurring subscription billing and webhooks with Dodo Payments, or one-time invoice payments via payment link/intent?
4. **SLA Engine Architecture:** Should SLA monitoring in Phase 3 run as an asynchronous scheduled cron job in Redis/BullMQ, or via database-driven queue workers and event listeners?
5. **Default Maps Provider:** Which free/low-cost maps provider (e.g., OpenStreetMap / Leaflet / Nominatim) should be wired into the default `MapsProvider` implementation for technician location and service area matching?
6. **Approved MVP Backend Hosting:** Which specific low-cost/free-tier hosting platform is approved for deploying the NestJS API container in Phase 9 (e.g., Railway, Render, Fly.io, or a low-cost VPS)?
7. **Complete Entity Field Specs:** Are full Prisma field definitions for operational and governance entities (`services`, `assets`, `jobs`, `quotes`, `invoices`, `risk_register`, `compliance_evidence`, etc.) to be elaborated during Phase 0/Phase 2 schema modeling based on their functional descriptions?

---

## Audit Status

- **Master read completely:** YES
- **Requirements extracted:** 328
- **Ambiguities found:** 7
- **Assumptions made:** 0
- **Files modified:** None
- **Files created:** `docs/MASTER-BASELINE-AUDIT.md`
