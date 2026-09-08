# REMOTFIX M4 — AUTHENTICATION & AUTHORIZATION FOUNDATION
## Comprehensive Implementation Plan (Frozen Baseline — Implementation Not Authorized)

**Document Status:** `PLAN FROZEN — IMPLEMENTATION NOT YET AUTHORIZED`  
**Current Milestone Target:** Milestone 4 (M4) — Authentication & Authorization Foundation  
**Baseline Git Commit:** `0325838fdedae396f301a17e15acc0c09e3517a9` (`feat: establish domain database foundation`)  
**Authority Hierarchy:**
1. [`docs/MASTER-SPEC-001-002.md`](file:///c:/SURAJ/Remotfix/docs/MASTER-SPEC-001-002.md) (Locked Master Specification Baseline)
2. [`docs/MASTER-ARCHITECTURE-DECISION-REGISTER.md`](file:///c:/SURAJ/Remotfix/docs/MASTER-ARCHITECTURE-DECISION-REGISTER.md) (Locked ADRs)
3. [`docs/MASTER-BASELINE-AUDIT.md`](file:///c:/SURAJ/Remotfix/docs/MASTER-BASELINE-AUDIT.md) & [`docs/MASTER-BASELINE-VERIFICATION.md`](file:///c:/SURAJ/Remotfix/docs/MASTER-BASELINE-VERIFICATION.md)
4. [`docs/MASTER-ARCHITECTURE-ANALYSIS.md`](file:///c:/SURAJ/Remotfix/docs/MASTER-ARCHITECTURE-ANALYSIS.md) & [`docs/MASTER-ARCHITECTURE-REDTEAM-CORRECTED.md`](file:///c:/SURAJ/Remotfix/docs/MASTER-ARCHITECTURE-REDTEAM-CORRECTED.md)
5. [`docs/REMOTFIX_MASTER_AGENTIC_MVP_PRODUCTION_LAUNCH.md`](file:///c:/SURAJ/Remotfix/docs/REMOTFIX_MASTER_AGENTIC_MVP_PRODUCTION_LAUNCH.md)
6. [`database/prisma/prisma/schema.prisma`](file:///c:/SURAJ/Remotfix/database/prisma/prisma/schema.prisma) (M3 Verified Domain Schema)

---

## 1. Objective & Scope Classification

The objective of Milestone 4 is to establish the authentication, session management, multi-factor authentication (MFA), and server-side role-based access control (RBAC) foundation for REMOTFIX.

### Formal Status Classifications:
- `MASTER-LOCKED`: Non-negotiable constraint directly mandated by Master Specification or approved ADR.
- `HUMAN-APPROVED`: Material architectural decision formally reviewed and approved by human authority.
- `MASTER-CONSTRAINED`: Boundary or quality attribute mandated by Master, but specific engineering implementation is flexible.
- `IMPLEMENTATION DETAIL`: Specific coding, library, or configuration detail to be chosen during implementation under security best practices.
- `VERIFICATION REQUIREMENT`: Explicit testing or compliance check required prior to milestone closure.

---

## 2. Approved Human Decisions (D-M4-01 through D-M4-05)

The following architectural decisions have been formally approved by human review and are permanently locked for Milestone 4:

### D-M4-01 — Session & Token Architecture
- **Status:** `HUMAN-APPROVED` (Option A)
- **Approved Architectural Baseline:** Short-lived access tokens combined with Redis-backed refresh-token tracking and revocation.
- **Architectural Intent:**
  - Access tokens are short-lived.
  - Refresh token state and lifecycle are tracked in Redis.
  - Refresh-token revocation must be fully supported.
  - Logout must reliably invalidate active refresh state in Redis.
  - Security-sensitive events (password changes, account suspension) may trigger session invalidation.
  - Multi-tenant authorization remains strictly server-side.
  - Redis acts as a fast ephemeral cache/session coordinator and is **not** the authoritative business datastore.
- **Implementation Boundaries (NOT Locked Here):**
  - Exact access-token TTL, exact refresh-token TTL, token claim structure, token cryptographic algorithm, Redis key naming conventions, cookie names, and rotation intervals are implementation details to be selected during the implementation phase conforming to modern security best practices.

### D-M4-02 — Password Hashing
- **Status:** `HUMAN-APPROVED` (Option A)
- **Approved Algorithm:** `Argon2id` for irreversible, memory-hard password hashing.
- **Security Invariants:**
  - Plaintext passwords must **never** be persisted to any database.
  - Plaintext passwords must **never** be logged in console, files, or audit trails.
  - Password hashes must **never** be returned or exposed through any API response or serializable DTO.
  - Exact cost parameters (memory, iterations, parallelism) belong to implementation/configuration and must be chosen deliberately to balance security and operational latency.

### D-M4-03 — RBAC Matrix
- **Status:** `HUMAN-APPROVED`
- **Approved Baseline:** The proposed 13-permission matrix across the 6 system roles is formally approved without addition or removal of permissions or roles.
- **Approved Matrix:** (See Section 5 for the authoritative matrix).
- **Core Invariants:**
  - Zero permissions added or removed.
  - Zero additional roles created.
  - No implicit role inheritance (e.g. `OWNER` does not automatically inherit lower roles without explicit assignment).
  - Unassigned permission = **DENY**.

### D-M4-04 — Session Database Schema
- **Status:** `HUMAN-APPROVED` (Option A)
- **Approved Schema Strategy:** Zero PostgreSQL schema changes. No PostgreSQL `sessions` table will be introduced.
- **Storage Strategy:** Redis handles all ephemeral session and refresh-token tracking.
- **Invariants:**
  - DO NOT modify `schema.prisma` for sessions.
  - DO NOT generate database migrations for session management.

### D-M4-05 — Onboarding & Registration
- **Status:** `HUMAN-APPROVED` (Option B — Controlled / Invited Onboarding)
- **Approved Onboarding Model:** Controlled, invited onboarding only.
- **Security Invariants:**
  - M4 **MUST NOT** implement unrestricted public self-registration.
  - An unrestricted public `POST /api/v1/auth/register` endpoint is **STRICTLY BANNED**.
  - The first Organization and first `OWNER` must be provisioned through a controlled onboarding mechanism (e.g. controlled CLI/operator provisioning script, operator invitation, or approved internal provisioning flow).
  - Subsequent tenant users are onboarded strictly via administrative invitations (`users:create`).

---

## 3. Existing M3 Security Foundation (Closed & Verified)

Milestone 3 established the verified database models in PostgreSQL (`remotfix_dev`):
- `User`: `id`, `email`, `password_hash`, `first_name`, `last_name`, `status`, `mfa_enabled`, `mfa_secret`, `last_login_at`, timestamps.
- `Organization`: `id`, `name`, `slug`, `status`, timestamps.
- `Membership`: `id`, `user_id`, `organization_id`, `role_id`, `status`, `@@unique([organization_id, user_id])`.
- `Role`: `id`, `organization_id` (nullable for system), `name`, `description`, `is_system`, with partial unique indexes `uq_system_roles` and `uq_tenant_roles`. Exactly 6 system roles seeded.
- `Permission`: `id`, `key` (13 explicit keys), `description`.
- `RolePermission`: `id`, `role_id`, `permission_id`, with `@@unique([role_id, permission_id])`. **Currently contains 0 rows (seeding deferred to M4 implementation Phase 2).**
- `AuditEvent`: `id`, `organization_id`, `actor_id`, `action`, `resource_type`, `resource_id`, `request_id`, `result`, `metadata`, `created_at`. Append-only structure (no `updated_at`).

---

## 4. Deny-by-Default Authorization Principles

The M4 authorization model enforces fail-closed, defense-in-depth security at every layer:
1. **Unknown Permission = DENY:** Any unrecognized or invalid permission key is immediately rejected.
2. **Unassigned Permission = DENY:** Any permission not explicitly mapped to the active role in `role_permissions` is denied.
3. **Missing Authenticated User = DENY:** Unauthenticated requests attempting to access protected resources receive `401 Unauthorized`.
4. **Missing Active Membership = DENY:** If the user has no membership record in the target organization, access is denied (`403 Forbidden`).
5. **Suspended User = DENY:** Accounts where `user.status != ACTIVE` are denied authentication or route access (`401` or `403`).
6. **Suspended Membership = DENY:** Memberships where `membership.status != ACTIVE` are blocked from tenant resources (`403 Forbidden`).
7. **Suspended Organization = DENY:** Requests targeting an inactive or suspended organization are denied (`403 Forbidden`).
8. **Missing Tenant Context = DENY:** Any request lacking a valid, verified organization context header/claim is denied (`403 Forbidden`).
9. **Cross-Tenant Resource = DENY:** Any attempt to reference or access a resource owned by another tenant is transactionally rejected (`403 Forbidden` / `404 Not Found`).
10. **Failed Resource-Scope Check = DENY:** Even if the role has the permission key, failing the resource-level scope constraint results in access denial.
11. **Authoritative Server Boundary:** Client-side route protections, hidden buttons, and disabled UI controls are strictly presentation-level affordances; server-side guards and repository filters are the sole authoritative security boundaries.

---

## D-M4-03 — RBAC Matrix Review

## Approved-by-Master Permissions (13 Authoritative Keys)
The 13 permission keys explicitly defined in Master Specification Section 2.7 (Lines 478–490) and seeded in M3 are:
1. `tickets:read`: View service tickets and booking requests.
2. `tickets:create`: Submit new service requests and bookings.
3. `tickets:update`: Modify ticket details, priority, and status.
4. `tickets:assign`: Assign technician or service team to a ticket.
5. `users:read`: View tenant user accounts and staff roster.
6. `users:create`: Invite and provision new user accounts.
7. `users:update`: Modify user details, roles, and account status.
8. `billing:read`: View commercial contracts, quotes, and invoices.
9. `billing:create`: Generate invoices and commercial service quotes.
10. `billing:approve`: Authorize discounts and approve commercial invoices.
11. `audit:read`: Access immutable security and operational audit trail.
12. `security:manage`: Configure MFA policies, session timeouts, and access controls.
13. `organization:manage`: Modify tenant profile, business details, and operating locations.

*Granularity Invariant:* Zero new permissions will be invented in M4. If current granularity is insufficient, the gap is resolved via resource-level scoping in application services.

---

## Approved Role-Permission Matrix

```
+---------------------------------------------------------------------------------------------------+
| MATRIX STATUS: HUMAN-APPROVED M4 BASELINE.                                                        |
| role_permissions TABLE IN DATABASE CURRENTLY CONTAINS 0 ROWS AND WILL BE SEEDED IN M4 PHASE 2.   |
+---------------------------------------------------------------------------------------------------+
```

| Permission Key | OWNER | ADMIN | MANAGER | TECHNICIAN | STAFF | CUSTOMER |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| `tickets:read` | YES | YES | YES | YES | YES | YES |
| `tickets:create` | YES | YES | YES | NO | YES | YES |
| `tickets:update` | YES | YES | YES | YES | YES | NO |
| `tickets:assign` | YES | YES | YES | NO | NO | NO |
| `users:read` | YES | YES | YES | NO | NO | NO |
| `users:create` | YES | YES | NO | NO | NO | NO |
| `users:update` | YES | YES | NO | NO | NO | NO |
| `billing:read` | YES | YES | YES | NO | NO | YES |
| `billing:create` | YES | YES | NO | NO | NO | NO |
| `billing:approve` | YES | YES | NO | NO | NO | NO |
| `audit:read` | YES | YES | NO | NO | NO | NO |
| `security:manage` | YES | YES | NO | NO | NO | NO |
| `organization:manage`| YES | YES | NO | NO | NO | NO |

---

## Permission-by-Permission Rationale

### 1. `tickets:read`
- **OWNER / ADMIN / MANAGER:** Granted. Full operational oversight of tenant ticket lifecycle.
- **TECHNICIAN:** Granted. Technicians must read ticket details, diagnostic instructions, and location data. *Resource Scoping Required:* Access restricted strictly to tickets assigned to that technician.
- **STAFF:** Granted. Support and intake personnel require visibility into open tickets to provide customer updates.
- **CUSTOMER:** Granted. Customers must view the status and progress of their service requests. *Resource Scoping Required:* Access strictly restricted to tickets belonging to that customer's authorized relationship.

### 2. `tickets:create`
- **OWNER / ADMIN:** Granted. Administrative ticket opening.
- **MANAGER:** Granted. Operations managers open escalated service tickets during dispatch.
- **TECHNICIAN:** Denied. Technicians execute field/remote jobs; they do not open incoming commercial tickets.
- **STAFF:** Granted. Primary front-office intake role; creates tickets from incoming phone/email requests.
- **CUSTOMER:** Granted. Self-service service request submission.

### 3. `tickets:update`
- **OWNER / ADMIN / MANAGER:** Granted. Updating ticket priority, SLA category, and status.
- **TECHNICIAN:** Granted. Technicians record diagnostic notes, update repair progress, and complete jobs. *Resource Scoping Required:* Access restricted strictly to assigned tickets.
- **STAFF:** Granted. Staff update customer contact details, intake descriptions, and triage notes. *Resource Scoping Required:* Subject to field-level and state validation (cannot alter billing totals, technical diagnostic sign-offs, or closed states).
- **CUSTOMER:** Denied. Customers communicate through ticket messages; they cannot directly mutate ticket metadata, priority, assignee, or lifecycle state.

### 4. `tickets:assign`
- **OWNER / ADMIN:** Granted. Complete authority over dispatch assignments.
- **MANAGER:** Granted. Operations managers supervise field dispatch and assign technicians.
- **TECHNICIAN / STAFF / CUSTOMER:** Denied. Dispatching requires operational/SLA authority.

### 5. `users:read`
- **OWNER / ADMIN:** Granted. Management of organization users.
- **MANAGER:** Granted. Operations managers require visibility into active technician rosters and staff availability for scheduling.
- **TECHNICIAN / STAFF / CUSTOMER:** Denied. User account data and internal rosters are confidential under least-privilege.

### 6. `users:create`
- **OWNER / ADMIN:** Granted. Administrative onboarding of tenant personnel via invitation.
- **MANAGER / TECHNICIAN / STAFF / CUSTOMER:** Denied. Provisioning accounts is an administrative/HR boundary, not field operations.

### 7. `users:update`
- **OWNER / ADMIN:** Granted. Role modification, account suspension, and profile maintenance.
- **MANAGER / TECHNICIAN / STAFF / CUSTOMER:** Denied. Privilege management is restricted to tenant administrators.

### 8. `billing:read`
- **OWNER / ADMIN:** Granted. Comprehensive commercial and financial oversight.
- **MANAGER:** Granted. Operations managers require quote/contract scope visibility to verify work boundaries.
- **TECHNICIAN:** Denied. Commercial pricing and contracts are concealed from field technicians.
- **STAFF:** Denied. General support staff do not inspect billing contracts or financial invoices.
- **CUSTOMER:** Granted. Customers must view their own service invoices and quotes. *Resource Scoping Required:* Strictly filtered to invoices belonging to that customer's authorized relationship.

### 9. `billing:create`
- **OWNER / ADMIN:** Granted. Generates commercial quotes and invoices.
- **MANAGER / TECHNICIAN / STAFF / CUSTOMER:** Denied. Commercial invoice creation is restricted to accounting and tenant administration.

### 10. `billing:approve`
- **OWNER / ADMIN:** Granted. Approves pricing discounts, contract activations, and write-offs.
- **MANAGER / TECHNICIAN / STAFF / CUSTOMER:** Denied. High-risk financial authorization.

### 11. `audit:read`
- **OWNER / ADMIN:** Granted. Reviewing security logs and compliance records.
- **MANAGER / TECHNICIAN / STAFF / CUSTOMER:** Denied. Audit trails contain sensitive operational and security telemetry; access is restricted to privileged administrators.

### 12. `security:manage`
- **OWNER / ADMIN:** Granted. Configuring MFA policies, session timeouts, and organization security controls.
- **MANAGER / TECHNICIAN / STAFF / CUSTOMER:** Denied.

### 13. `organization:manage`
- **OWNER / ADMIN:** Granted. Modifying business details, legal entities, and operating locations.
- **MANAGER / TECHNICIAN / STAFF / CUSTOMER:** Denied.

---

## Resource Scope vs Permission Boundary

```
+---------------------------------------------------------------------------------------------------+
| CRITICAL ARCHITECTURAL RULE: PERMISSION != RESOURCE SCOPE                                         |
| Possessing a permission (e.g. tickets:read) NEVER implies unrestricted tenant-wide access.        |
| Resource-level scope MUST be evaluated by application services and repositories.                  |
+---------------------------------------------------------------------------------------------------+
```

The authorization sequence defined in Master Section 2.7 explicitly differentiates:
`Role -> Permission -> Resource Scope -> Action`

1. **Permission Check (Guard Level):** Does the user's role possess the required permission key?
   - If NO -> `403 Forbidden`.
   - If YES -> Proceed to handler.
2. **Resource Scope Check (Service/Repository Level):**
   - **For `OWNER`, `ADMIN`, `MANAGER`:** Resource scope is tenant-wide within the active organization (`where: { organizationId }`).
   - **For `TECHNICIAN`:** Resource scope is restricted strictly to assigned tickets (`where: { organizationId, assignedTechnicianId: currentTechnicianId }`).
   - **For `CUSTOMER`:** Resource scope is restricted strictly to customer-owned resources (`where: { organizationId, contact: { userId: currentUserId } }`).
   - **For `billing:read` (CUSTOMER):** Resource scope is restricted strictly to invoices matching the customer's contact record.

---

## Role-Specific Security Review

### 1. TECHNICIAN Review (Approved Rule)
- **Permissions:** `tickets:read`, `tickets:update`.
- **Exclusions:** No `tickets:create`, no `tickets:assign`, no `billing:*`, no `users:*`.
- **Approved Resource Scope:** **Option B (Assigned Tickets Only)**.
  - Technicians may access ONLY tickets assigned to that technician.
  - M4 does NOT implement an unassigned-ticket claiming queue.
  - Technicians cannot use a generic ticket ID to access another technician's ticket.

### 2. CUSTOMER Review (Approved Rule)
- **Permissions:** `tickets:read`, `tickets:create`, `billing:read`.
- **Exclusions:** No `tickets:update` (metadata), no `tickets:assign`, no administrative permissions.
- **Approved Resource Scope:**
  - Customer access is strictly restricted to resources belonging to that authenticated customer's authorized relationship.
  - Customer permission does **not** grant tenant-wide visibility.

### 3. MANAGER Review (Approved Rule)
- **Permissions:** `tickets:read`, `tickets:create`, `tickets:update`, `tickets:assign`, `users:read`, `billing:read`.
- **Least-Privilege Boundary:**
  - Permissions remain organization-scoped.
  - Manager operates within the tenant according to approved permissions.
  - Manager does NOT receive: `users:create`, `users:update`, `billing:create`, `billing:approve`, `audit:read`, `security:manage`, `organization:manage`.

### 4. STAFF Review (Approved Rule)
- **Permissions:** `tickets:read`, `tickets:create`, `tickets:update`.
- **Approved State & Field Scoping:**
  - STAFF ticket updates are strictly subject to service/state validation.
  - STAFF must not gain unrestricted authority to:
    - manipulate protected financial values
    - alter privileged diagnostic information
    - bypass workflow states
    - perform terminal-state transitions outside their authority
  - Exact field/state enforcement is implemented at the service/domain authorization layer.

### 5. OWNER vs. ADMIN Parity Review (Approved Rule)
- **Approved State:** Parity across the current 13-permission vocabulary.
- **Scope Boundary:**
  - This parity applies strictly to the 13 M3 baseline permissions.
  - It does **not** establish permanent conceptual equivalence.
  - If future requirements demand OWNER-only actions (e.g. tenant deletion, ownership transfer), new permissions will be introduced through a future approved ADR.
  - Zero OWNER-only permissions are invented during M4.

### 6. Security-Sensitive Permissions Scrutiny
- `security:manage`: Restricted strictly to `OWNER`, `ADMIN`.
- `audit:read`: Restricted strictly to `OWNER`, `ADMIN`.
- `organization:manage`: Restricted strictly to `OWNER`, `ADMIN`.
- `billing:approve`: Restricted strictly to `OWNER`, `ADMIN`.
- `users:update`: Restricted strictly to `OWNER`, `ADMIN`.
- `tickets:assign`: Restricted strictly to `OWNER`, `ADMIN`, `MANAGER`.

---

## Locked RBAC & Resource-Scope Decisions

All previously open architectural questions regarding RBAC and scoping are now permanently locked:
1. **Technician Scope Boundary:** Locked to Option B (assigned tickets only; no claiming queue).
2. **Customer Resource Boundary:** Locked to authenticated relationship-bound records only.
3. **Staff Update Constraints:** Locked to domain service/state validation against field tampering and invalid state transitions.
4. **Owner vs. Admin Parity:** Locked to parity across the 13 initial permissions for M4.
5. **Manager Operational Visibility:** Locked to the approved matrix (`users:read` and `billing:read` permitted for dispatch and work verification).

---

## Human Approval Gate
Human approval for the M4 architecture decisions (D-M4-01 through D-M4-05) and RBAC matrix has been formally recorded. The plan is **FROZEN**. Implementation remains strictly unauthorized until explicit instruction is issued. The database state remains at `role_permissions = 0`.

---

## 6. MFA Architecture: Locked Requirements vs. Implementation Proposals

### 6.1 Explicitly Locked Requirements (`MASTER-LOCKED`)
- Centralized server-side authentication (ADR-0018).
- Mandatory MFA for all privileged accounts (`OWNER`, `ADMIN`) (Master Section 1.3, 2.7, ADR-0018).
- `mfa_enabled` (Boolean) and `mfa_secret` (String, nullable) columns exist on `users` table in M3 schema.
- Passwords and secrets must be protected at rest (Master Section 2.10, ADR-0026).

### 6.2 Implementation Proposals & Candidate Details (`IMPLEMENTATION DETAIL`)
- **Candidate Protocol:** Time-based One-Time Password (TOTP) conforming to RFC 6238 (6-digit codes, 30s window).
- **Candidate Secret Protection:** Symmetric encryption (e.g. AES-256-GCM) applied to `mfa_secret` before database write, using an externalized server-side environment secret.
- **Candidate Flows:** `POST /api/v1/auth/mfa/setup` (generate seed/URI) and `POST /api/v1/auth/mfa/enable` (confirm code and activate).
- **Privileged Enforcement Gate:** Server-side guard checking if an authenticated user with `OWNER` or `ADMIN` role in an active membership has `mfa_enabled: false`. If false, all non-auth endpoints return `403 Forbidden` (`MFA_ENROLLMENT_REQUIRED`).
- **Candidate Recovery:** Single-use hashed backup recovery codes upon enrollment.
- *Notice:* Exact protocol parameters and cryptographic implementation details are implementation choices to be selected during the implementation phase, not false architecture locks.

---

## 7. Audit Events & Immutability Governance

### 7.1 Immutability Gap Disclosure
In M3, testing proved that direct SQL `UPDATE` and `DELETE` on `audit_events` are currently possible because database-level triggers or table permission revocations have not yet been introduced.
- **Status:** `VERIFICATION REQUIREMENT`
- **Governance Mandate:** `AUDIT IMMUTABILITY REMAINS A PRE-PRODUCTION SECURITY REQUIREMENT.`
- **Target Resolution Phase:** Dedicated Security Hardening Milestone prior to production deployment. M4 will **not** modify M3 schema, add triggers, or attempt to redesign audit tables.

### 7.2 M4 Audit Events Scope (`IMPLEMENTATION DETAIL`)
- Standard security events to be logged: `auth:login:success`, `auth:login:failure`, `auth:logout`, `auth:mfa:enrolled`, `auth:mfa:verified`, `auth:mfa:failed`, `auth:password_reset:request`, `auth:password_reset:success`, `auth:password_change`, `user:invited`.

---

## 8. Rate Limiting & Abuse Prevention

- **Status:** `MASTER-LOCKED` requirement (ADR-0028); Redis-backed implementation.
- **Candidate Mechanisms:** Rate limiting implemented using the local Redis container (ADR-0006).
- **Implementation Note:** The specific rate-limiting algorithm (sliding window, token bucket, or fixed window) is an implementation choice to be finalized during the implementation phase. No rate-limiting dependencies will be installed during this planning phase.

---

## 9. Enumeration & Session Security Safeguards

- **Login Failures:** Return generic `401 Unauthorized` with identical error responses regardless of whether the email was not found, password was incorrect, or account is suspended.
- **Forgot Password:** Always return `200 OK` with uniform response: `"If an account exists for this email, password recovery instructions have been dispatched."`
- **Session Revocation (D-M4-01):** Access tokens are short-lived; refresh tokens stored and revocable in Redis; logout immediately destroys the refresh session.

---

## 10. API Surface Review & Endpoint Classification

| Endpoint | Method | Classification | Justification / Prerequisite |
|---|---|---|---|
| `/api/v1/auth/login` | `POST` | `REQUIRED NOW` | Core credential authentication. |
| `/api/v1/auth/logout` | `POST` | `REQUIRED NOW` | Session termination and token revocation. |
| `/api/v1/auth/refresh` | `POST` | `REQUIRED NOW (D-M4-01)` | Token renewal via Redis-backed refresh tracking. |
| `/api/v1/auth/me` | `GET` | `REQUIRED NOW` | Current user profile, active memberships, and roles. |
| `/api/v1/auth/register` | `POST` | `NOT AUTHORIZED / BANNED (D-M4-05)` | Unrestricted registration strictly prohibited; replaced by controlled onboarding. |
| `/api/v1/auth/forgot-password`| `POST`| `PROPOSED` | Self-service recovery initiation. |
| `/api/v1/auth/reset-password` | `POST` | `PROPOSED` | Password update with recovery token. |
| `/api/v1/auth/mfa/setup` | `POST` | `PROPOSED` | Generate TOTP secret & QR code. |
| `/api/v1/auth/mfa/enable` | `POST` | `PROPOSED` | Confirm code and activate MFA. |
| `/api/v1/auth/mfa/verify` | `POST` | `PROPOSED` | Secondary login verification step. |
| `/api/v1/users/invite` | `POST` | `REQUIRED NOW` | Team member invitation flow (ADR-0021). |
| `/api/v1/auth/accept-invite` | `POST` | `REQUIRED NOW` | Invitation activation and password initialization. |

---

## 11. Implementation Dependencies (Requirements / Candidates)

Dependencies are listed as candidate requirements to be selected and installed strictly during the implementation phase. Zero dependencies are installed during planning:

| Candidate Package | Workspace | Purpose | Status | Justification / Alternatives |
|---|---|---|---|---|
| `@node-rs/argon2` | `apps/api` | Password hashing | `APPROVED (D-M4-02)` | High-performance Argon2id with prebuilt binaries. |
| `@nestjs/jwt` & `jsonwebtoken` | `apps/api` | JWT signing/verification | `APPROVED (D-M4-01)` | Access token generation and verification. |
| `ioredis` | `apps/api` | Redis connection | `APPROVED (D-M4-01/04)` | Standard client for Redis container sessions and rate limiting. |
| `cookie-parser` & `@types/cookie-parser` | `apps/api` | HTTP cookie parsing | `PROPOSED` | Middleware for secure cookie extraction. |
| `otplib` | `apps/api` | TOTP verification | `PROPOSED` | Zero-dependency RFC 6238 TOTP library. Alternative: native Node `crypto`. |

*Zero dependencies have been added or installed during this planning phase.*

---

## 12. Security Threat Model

| Threat | Attack Vector | Planned Mitigation | Layer | Status |
|---|---|---|---|---|
| **Credential Stuffing** | Leaked password lists | Rate limiting per IP; account failure tracking in Redis | Ingress Guard | Planned |
| **Brute-Force Passwords** | Dictionary attacks | Irreversible Argon2id hashing; generic error responses | Auth Service | Planned |
| **Session Hijacking** | XSS / cookie theft | `HttpOnly`, `SameSite=Lax`, `Secure` cookies; short-lived access tokens | HTTP Transport | Planned |
| **CSRF** | Cross-site forged requests | `SameSite` cookie policy; custom header enforcement (`x-organization-id`) | Ingress Guard | Planned |
| **Horizontal Tenant Escape** | Tenant A accesses Tenant B | `TenantGuard` verifies active membership; repository scopes all queries by `organization_id` | `TenantGuard` | Planned |
| **Vertical Privilege Escalation** | Low-privilege user calls admin route | Server-side declarative `PermissionGuard` evaluating resolved role permissions | `PermissionGuard` | Planned |
| **IDOR** | Foreign tenant ID injected into entity reference | Application-tier transactional validation verifying referenced entity ownership | Application Service | Planned |
| **MFA Bypass** | Direct API call skipping TOTP | Partial login ticket issued; full access withheld until TOTP verified; privileged gate enforces MFA | Auth Pipeline | Planned |
| **Account Enumeration** | Timing/error discrepancies | Consistent error codes; constant response on password reset; uniform execution timing | Auth Controller | Planned |
| **Audit Event Tampering** | Malicious DB mutation | Append-only application contract; database-level immutability tracked for pre-prod gate | Audit Service | Planned |

---

## 13. Final M4 Implementation Phases (Frozen Baseline)

The implementation plan is frozen around the following 10 strictly gated phases:

- **PHASE 0 — DECISION LOCK:** Completed. Human decisions D-M4-01 through D-M4-05 formally recorded and plan frozen.
- **PHASE 1 — FOUNDATION:** Install approved minimal dependencies (`apps/api`), integrate Redis client, configure environment validation, secret handling.
- **PHASE 2 — RBAC:** Seed approved role-permission matrix into PostgreSQL `role_permissions` join table; implement server-side permission evaluation and deny-by-default logic.
- **PHASE 3 — AUTHENTICATION:** Implement Argon2id password hashing service, credential login, short-lived access token generation, Redis refresh-token tracking, and logout/revocation.
- **PHASE 4 — AUTHORIZATION & TENANT ISOLATION:** Implement `TenantGuard`, membership resolution, `PermissionGuard`, active tenant context propagation, and server-side resource-scope enforcement.
- **PHASE 5 — MFA:** Implement privileged-user MFA enforcement (`OWNER`, `ADMIN`), TOTP enrollment, verification endpoints, and secure secret encryption.
- **PHASE 6 — INVITATION & RECOVERY:** Implement controlled onboarding mechanisms, user invitation lifecycle (`/api/v1/users/invite`), invitation acceptance, and password reset/recovery flows.
- **PHASE 7 — WEB AUTH:** Implement login page, MFA verification prompt, invite acceptance, protected route middleware/guards, session synchronization, and logout in `apps/web`.
- **PHASE 8 — SECURITY VERIFICATION:** Execute comprehensive automated test suite covering authentication, RBAC, tenant isolation, IDOR prevention, resource scoping, account enumeration, rate limiting, session revocation, MFA bypass prevention, audit logging, and M1/M2/M3 regressions.
- **PHASE 9 — HUMAN ACCEPTANCE:** Deliver full pre-commit verification report with test evidence, perform architectural review, obtain explicit human authorization, and only then commit and push.

---

## 14. Explicit Acceptance Criteria

### Authentication
- [ ] Valid credentials authenticate and issue session/tokens according to approved architecture.
- [ ] Invalid credentials return consistent generic errors without leaking account existence.
- [ ] Accounts with status `SUSPENDED` or `INVITED` cannot authenticate.
- [ ] Logout immediately revokes active session/refresh token in Redis.
- [ ] Passwords stored strictly as irreversible Argon2id cryptographic hashes; plaintext passwords never logged or returned.

### Authorization & RBAC
- [ ] Declarative `@RequirePermission` enforced server-side before controller handler execution.
- [ ] Users possessing required permission key succeed; users missing permission receive `403 Forbidden`.
- [ ] Client-side route checks cannot bypass server-side authorization guards.
- [ ] `role_permissions` join table seeded strictly according to approved matrix.

### Tenant Isolation & Resource Scope
- [ ] Requests without valid organization context or where user lacks active membership return `403 Forbidden`.
- [ ] Tenant A user cannot access or mutate Tenant B resources.
- [ ] Service-level cross-tenant foreign key references are transactionally rejected.
- [ ] Resource-level scoping enforced: technicians access only assigned tickets; customers access only relationship-bound records.
- [ ] IDOR attacks fail safely.

### Multi-Factor Authentication
- [ ] Mandatory MFA enforced for `OWNER` and `ADMIN` roles; non-enrolled privileged users blocked from protected tenant routes.
- [ ] TOTP codes verified against RFC 6238; replay of used codes within window prevented.
- [ ] MFA secret seeds encrypted at rest.

### Rate Limiting & Audit
- [ ] Failed login attempts rate-limited per IP and account using Redis.
- [ ] Authentication, MFA, authorization failures, and administrative actions emit append-only records to `audit_events`.
- [ ] `AUDIT IMMUTABILITY REMAINS A PRE-PRODUCTION SECURITY REQUIREMENT` tracked for pre-production hardening milestone.

---

## 15. Explicit Non-Goals for M4

The following areas are strictly outside Milestone 4 scope:
- ❌ Booking creation, scheduling, or ticket dispatch endpoints (belongs to M6).
- ❌ Customer self-service ticket submission portals.
- ❌ Technician mobile job check-in/check-out execution (belongs to M7).
- ❌ Payment processing, checkout webhooks, and invoice generation (belongs to M8).
- ❌ Remote support screen-sharing, signaling, or WebRTC tooling (belongs to M9).
- ❌ Third-party OAuth / Social Logins (Google, Microsoft).
- ❌ Production cloud infrastructure or Kubernetes manifests.

---

## Final Human Approval Table

| Decision | Recommendation / Selection | Status |
|---|---|---|
| D-M4-01 Session Architecture | Option A (Short-lived access tokens + Redis refresh tracking) | Approved |
| D-M4-02 Password Hashing | Option A (Argon2id) | Approved |
| D-M4-03 RBAC Matrix | Approved 13-permission baseline matrix | Approved |
| D-M4-04 Session DB Schema | Option A (No PostgreSQL sessions table; Redis-backed) | Approved |
| D-M4-05 Onboarding | Option B (Controlled / invited onboarding; no public register) | Approved |
