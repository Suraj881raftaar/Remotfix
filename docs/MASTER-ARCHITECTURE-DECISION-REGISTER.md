# MASTER-ARCHITECTURE-DECISION-REGISTER — Architecture Decision Register (ADR)

**Document Target:** `docs/MASTER-ARCHITECTURE-DECISION-REGISTER.md`  
**Authoritative Sources:**
- [`docs/MASTER-SPEC-001-002.md`](file:///c:/SURAJ/Remotfix/docs/MASTER-SPEC-001-002.md) (Locked Master Baseline)
- [`docs/MASTER-BASELINE-AUDIT.md`](file:///c:/SURAJ/Remotfix/docs/MASTER-BASELINE-AUDIT.md) (Approved Baseline Audit)
- [`docs/MASTER-BASELINE-VERIFICATION.md`](file:///c:/SURAJ/Remotfix/docs/MASTER-BASELINE-VERIFICATION.md) (Second-Pass Baseline Verification)
- [`docs/MASTER-ARCHITECTURE-ANALYSIS.md`](file:///c:/SURAJ/Remotfix/docs/MASTER-ARCHITECTURE-ANALYSIS.md) (First-Principles Architecture Analysis)
- [`docs/MASTER-ARCHITECTURE-REDTEAM-CORRECTED.md`](file:///c:/SURAJ/Remotfix/docs/MASTER-ARCHITECTURE-REDTEAM-CORRECTED.md) (Post-Correction Red-Team Audit)

**Document Purpose:** Convert the approved baseline architecture analysis into a traceable, auditable decision register.  
**Phase:** Decision Analysis & Architecture Governance (Strictly Read-Only / No Implementation).

---

## 1. Governance & Decision Classification Scheme

Every decision in this register is classified under exactly one of five formal statuses:

1. **`MASTER-LOCKED`:** Directly mandated by [`docs/MASTER-SPEC-001-002.md`](file:///c:/SURAJ/Remotfix/docs/MASTER-SPEC-001-002.md). Non-negotiable constraint for the platform.
2. **`MASTER-CONSTRAINED`:** The Master constrains the architectural boundary or quality attribute but does not specify a single exact technical implementation.
3. **`ARCHITECTURAL PROPOSAL`:** A technically grounded architectural pattern proposed by the architecture analysis, pending formal stakeholder review and approval.
4. **`HUMAN DECISION REQUIRED`:** The Master leaves a material scope, security, provider, or architecture item unresolved. No option is selected without explicit stakeholder sign-off.
5. **`DEFERRED`:** The decision can safely be postponed to a future implementation phase without blocking MVP architecture modeling.

### Strict Governance Invariants:
- An architectural proposal is **never** treated as approved merely because it is technically reasonable.
- Candidate engineering tools (`BullMQ`, `Zod`, `JWT`, `Argon2id/bcrypt`, `Caddy`) remain non-locked candidate options.
- The schema definition gap for the 33 bare entities remains an uninvented, controlled future modeling work item for Phase 0/2.
- The 20 individual inferred relationship entries and 12 conceptual groups remain explicitly marked as inferences.
- Zero code, zero Prisma models, zero migrations, and zero API endpoints are created during this phase.

---

## 2. Master Decision Register Index

| ADR ID | Decision Title | Status | Human Approval |
|---|---|---|---|
| **ADR-0001** | Modular Monolith MVP Architecture | `MASTER-LOCKED` | NOT REQUIRED |
| **ADR-0002** | Next.js Presentation Tier | `MASTER-LOCKED` | NOT REQUIRED |
| **ADR-0003** | NestJS Application API Tier | `MASTER-LOCKED` | NOT REQUIRED |
| **ADR-0004** | PostgreSQL Authoritative Datastore | `MASTER-LOCKED` | NOT REQUIRED |
| **ADR-0005** | Prisma ORM & Database Migrations | `MASTER-LOCKED` | NOT REQUIRED |
| **ADR-0006** | Redis-Compatible Queue & Cache Tier | `MASTER-LOCKED` | NOT REQUIRED |
| **ADR-0007** | Private Object Storage Abstraction | `MASTER-LOCKED` | NOT REQUIRED |
| **ADR-0008** | In-Process Monolithic Worker Execution | `MASTER-CONSTRAINED` | NOT REQUIRED |
| **ADR-0009** | Containerization via Docker | `MASTER-LOCKED` | NOT REQUIRED |
| **ADR-0010** | Base API Path `/api/v1` & OpenAPI Contract | `MASTER-LOCKED` | NOT REQUIRED |
| **ADR-0011** | 5-Stage Environment Progression Model | `MASTER-LOCKED` | NOT REQUIRED |
| **ADR-0012** | StorageProvider Abstraction Interface | `MASTER-LOCKED` | NOT REQUIRED |
| **ADR-0013** | EmailProvider Abstraction Interface | `MASTER-LOCKED` | NOT REQUIRED |
| **ADR-0014** | NotificationProvider Abstraction Interface | `MASTER-LOCKED` | NOT REQUIRED |
| **ADR-0015** | PaymentProvider Abstraction Interface | `MASTER-LOCKED` | NOT REQUIRED |
| **ADR-0016** | RemoteSupportProvider Abstraction Interface | `MASTER-LOCKED` | NOT REQUIRED |
| **ADR-0017** | MapsProvider Abstraction Interface | `MASTER-LOCKED` | NOT REQUIRED |
| **ADR-0018** | Authentication Architecture & Privileged MFA | `MASTER-LOCKED` | NOT REQUIRED |
| **ADR-0019** | Session & Token Representation (JWT Candidate) | `ARCHITECTURAL PROPOSAL` | PENDING |
| **ADR-0020** | Role-Based Access Control (RBAC) & 6 Initial Roles | `MASTER-LOCKED` | NOT REQUIRED |
| **ADR-0021** | Least-Privilege Authorization Model | `MASTER-LOCKED` | NOT REQUIRED |
| **ADR-0022** | Server-Side Authorization Enforcement (PermissionGuard) | `MASTER-CONSTRAINED` | NOT REQUIRED |
| **ADR-0023** | Strict Multi-Tenant Isolation by Organization ID | `MASTER-LOCKED` | NOT REQUIRED |
| **ADR-0024** | Comprehensive Security Audit Logging | `MASTER-LOCKED` | NOT REQUIRED |
| **ADR-0025** | Secrets Externalization & Masking Policy | `MASTER-LOCKED` | NOT REQUIRED |
| **ADR-0026** | Encryption in Transit (TLS) and at Rest (AES-256) | `MASTER-LOCKED` | NOT REQUIRED |
| **ADR-0027** | Irreversible Cryptographic Password Hashing | `MASTER-LOCKED` | NOT REQUIRED |
| **ADR-0028** | Rate Limiting & Abuse Prevention Strategy | `MASTER-LOCKED` | NOT REQUIRED |
| **ADR-0029** | Input Validation & Schema Sanitization | `MASTER-LOCKED` | NOT REQUIRED |
| **ADR-0030** | Payment Webhook Ingress Security Boundary | `MASTER-CONSTRAINED` | NOT REQUIRED |
| **ADR-0031** | Authoritative 40-Entity Inventory Scope | `MASTER-LOCKED` | NOT REQUIRED |
| **ADR-0032** | 10 Candidate Internal Modular Monolith Domains | `ARCHITECTURAL PROPOSAL` | PENDING |
| **ADR-0033** | Mandatory `organization_id` Scoping on Tenant Entities | `MASTER-LOCKED` | NOT REQUIRED |
| **ADR-0034** | Relational Database Conventions (UUID, snake_case, UTC) | `MASTER-LOCKED` | NOT REQUIRED |
| **ADR-0035** | Controlled Schema Gap Management for 33 Bare Entities | `MASTER-CONSTRAINED` | NOT REQUIRED |
| **ADR-0036** | Relationship Inference Policy & Ledger Tracking | `ARCHITECTURAL PROPOSAL` | PENDING |
| **ADR-0037** | Asynchronous Execution for Heavy Workloads | `MASTER-LOCKED` | NOT REQUIRED |
| **ADR-0038** | Asynchronous SLA Threshold Monitoring & Escalation | `MASTER-CONSTRAINED` | NOT REQUIRED |
| **ADR-0039** | Scheduled Retention Sweeps & Automated Purge | `MASTER-LOCKED` | NOT REQUIRED |
| **ADR-0040** | Asynchronous Dispatch & Field Service Alerts | `MASTER-CONSTRAINED` | NOT REQUIRED |
| **ADR-0041** | Asynchronous Heavy Reports & DSAR Export Compilation | `MASTER-LOCKED` | NOT REQUIRED |
| **ADR-0042** | Asynchronous Payment Webhook Reconciliation | `MASTER-CONSTRAINED` | NOT REQUIRED |
| **ADR-0043** | Automated Backup Restoration Integrity Testing | `MASTER-LOCKED` | NOT REQUIRED |
| **ADR-0044** | SLA Tracking/Escalation Priority & Delivery Phase | `HUMAN DECISION REQUIRED` | REQUIRED |
| **ADR-0045** | Privacy Workflows & Dashboard Sequencing | `HUMAN DECISION REQUIRED` | REQUIRED |
| **ADR-0046** | User Personas to RBAC Role Mapping | `HUMAN DECISION REQUIRED` | REQUIRED |
| **ADR-0047** | Attribute Elaboration for the 33 Bare Entities | `HUMAN DECISION REQUIRED` | REQUIRED |
| **ADR-0048** | RemoteSupportProvider Protocol & Signaling Tooling | `HUMAN DECISION REQUIRED` | REQUIRED |
| **ADR-0049** | PaymentProvider MVP Scope (Invoices vs Subscriptions) | `HUMAN DECISION REQUIRED` | REQUIRED |
| **ADR-0050** | MapsProvider Default Zero-Cost Backend Selection | `HUMAN DECISION REQUIRED` | REQUIRED |
| **ADR-0051** | Approved Initial Low-Cost Hosting Platform Selection | `HUMAN DECISION REQUIRED` | REQUIRED |
| **ADR-0052** | Exclusion of Kubernetes in Initial MVP Architecture | `MASTER-LOCKED` | NOT REQUIRED |
| **ADR-0053** | Exclusion of Multi-Region Active-Active Topologies | `MASTER-LOCKED` | NOT REQUIRED |
| **ADR-0054** | Exclusion of Complex Service Mesh in Initial MVP | `MASTER-LOCKED` | NOT REQUIRED |
| **ADR-0055** | Exclusion of Multiple Independent Databases in MVP | `MASTER-LOCKED` | NOT REQUIRED |
| **ADR-0056** | Exclusion of Unjustified Paid Enterprise Cloud Tiers | `MASTER-LOCKED` | NOT REQUIRED |
| **ADR-0057** | Master Specification as Sole Requirements Authority | `MASTER-LOCKED` | NOT REQUIRED |
| **ADR-0058** | Architecture Analysis Subordination to Master Spec | `MASTER-LOCKED` | NOT REQUIRED |
| **ADR-0059** | Inferences Are Non-Authoritative Specifications | `MASTER-LOCKED` | NOT REQUIRED |
| **ADR-0060** | Architectural Proposals Require Stakeholder Approval | `MASTER-LOCKED` | NOT REQUIRED |
| **ADR-0061** | Mandatory Human Sign-Off for Material System Choices | `MASTER-LOCKED` | NOT REQUIRED |
| **ADR-0062** | Prohibition of Code Implementation from Unapproved Proposals | `MASTER-LOCKED` | NOT REQUIRED |
| **ADR-0063** | Prohibition of Silent Ambiguity Resolution | `MASTER-LOCKED` | NOT REQUIRED |
| **ADR-0064** | Absolute Ban on Hallucinated Entities and Schemas | `MASTER-LOCKED` | NOT REQUIRED |

---

## 3. Architecture & Deployment Decisions (Group A)

### ADR-0001 — Modular Monolith MVP Architecture
- **Decision:** Build the entire MVP backend application as a single deployable modular monolith rather than distributed microservices.
- **Status:** `MASTER-LOCKED`
- **Source:** Master Section 1.1, 2.1, 2.17, Lines 1756–1761; Audit Section 11, 13; Analysis Section 1.1.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Distributed microservices architecture.
  - Option B: Serverless functions architecture across multiple cloud providers.
  - Option C: Modular monolith within a single deployable container unit (Master baseline).
- **Chosen Option:** Option C: Modular monolith single deployable unit.
- **Reason:** Directly mandated by Master Section 2.1 to prevent distributed transaction overhead, network latency, and premature infrastructure cost, while enforcing modular boundaries for future microservice extraction.
- **Security Impact:** Minimizes attack surface; all internal domain communication happens in-memory without unauthenticated network hops.
- **Privacy Impact:** Data flows remain strictly contained within a single application boundary.
- **Tenant-Isolation Impact:** Tenancy context is managed consistently in a single runtime without distributed context propagation failures.
- **Database Impact:** Single authoritative PostgreSQL datastore enforces ACID constraints.
- **API Impact:** Clean internal module interfaces; unified `/api/v1` gateway.
- **Provider Impact:** Provider adapters are injected centrally into domain services.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0002 — Next.js Presentation Tier
- **Decision:** Use Next.js for the customer, technician, and administrative web frontend.
- **Status:** `MASTER-LOCKED`
- **Source:** Master Section 2.1, 2.2; Audit Section 12; Analysis Section 11.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Single Page Application (Vite + React SPA).
  - Option B: Traditional server-rendered HTML (e.g., NestJS MVC + Handlebars).
  - Option C: Next.js frontend with Vercel-compatible deployment (Master baseline).
- **Chosen Option:** Option C: Next.js frontend.
- **Reason:** Directly locked in Master Section 2.2 technology matrix.
- **Security Impact:** Supports secure server-side rendering (SSR), HTTP-only cookie handling, and CSP hygiene.
- **Privacy Impact:** Client-side tracking is isolated; UI masks PII before rendering.
- **Tenant-Isolation Impact:** Frontend scopes all API requests using organization context derived from authenticated user session.
- **Database Impact:** None (frontend communicates exclusively via `/api/v1` REST API).
- **API Impact:** Consumes OpenAPI-governed endpoints.
- **Provider Impact:** None directly.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0003 — NestJS Backend Framework
- **Decision:** Use NestJS as the core backend modular monolithic framework.
- **Status:** `MASTER-LOCKED`
- **Source:** Master Section 2.1, 2.2; Audit Section 12; Analysis Section 1.1, 13.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Express / Fastify raw micro-framework.
  - Option B: Go / Python backend.
  - Option C: NestJS TypeScript framework (Master baseline).
- **Chosen Option:** Option C: NestJS.
- **Reason:** Directly locked in Master Section 2.2 technology stack table.
- **Security Impact:** Native support for guards (`PermissionGuard`), interceptors, and pipes for automated input validation and authorization.
- **Privacy Impact:** Centralized interceptors enforce data masking and audit event generation.
- **Tenant-Isolation Impact:** Middleware easily extracts and binds `organization_id` to the execution context.
- **Database Impact:** Integrates seamlessly with Prisma ORM.
- **API Impact:** Built-in Swagger/OpenAPI decorator generation.
- **Provider Impact:** Supports dependency injection for provider abstraction interfaces.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0004 — PostgreSQL Authoritative Datastore
- **Decision:** Designate PostgreSQL as the sole authoritative datastore for all transactional application state.
- **Status:** `MASTER-LOCKED`
- **Source:** Master Section 1.3, 2.2, 2.5; Audit Section 14.1; Analysis Section 1.9, 11.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Multi-database polyglot persistence (e.g., Mongo + Postgres + Dynamo).
  - Option B: MySQL / MariaDB relational database.
  - Option C: Single authoritative PostgreSQL datastore (Master baseline).
- **Chosen Option:** Option C: PostgreSQL authoritative datastore.
- **Reason:** Explicitly mandated by Master Section 2.5: "PostgreSQL is authoritative."
- **Security Impact:** ACID compliance, role-based table privileges, and native row encryption support.
- **Privacy Impact:** Supports structured field-level redaction and automated retention deletion.
- **Tenant-Isolation Impact:** Foreign keys and composite indexes on `organization_id` strictly partition multi-tenant data.
- **Database Impact:** Primary persistence engine for all 40 entities.
- **API Impact:** Provides transactional guarantees for API mutations.
- **Provider Impact:** Completely decoupled from external SaaS databases.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0005 — Prisma ORM & Database Migrations
- **Decision:** Utilize Prisma as the object-relational mapping (ORM) and migration engine.
- **Status:** `MASTER-LOCKED`
- **Source:** Master Section 2.2, 5.12; Audit Section 12, 14.1; Analysis Section 11.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: TypeORM or MikrORM.
  - Option B: Raw SQL query builders (Knex / Kysely).
  - Option C: Prisma ORM and Prisma Migrations (Master baseline).
- **Chosen Option:** Option C: Prisma.
- **Reason:** Directly locked in Master Section 2.2 technology stack.
- **Security Impact:** Parameterized queries eliminate SQL injection vulnerabilities.
- **Privacy Impact:** Schema models define strict data types and nullable fields.
- **Tenant-Isolation Impact:** Prisma client extensions or repository wrappers enforce `where: { organizationId }` scoping.
- **Database Impact:** Authoritative migration management; generates SQL schema files in `database/prisma/migrations/`.
- **API Impact:** Types generated by Prisma inform backend DTOs and contracts.
- **Provider Impact:** None.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0006 — Redis-Compatible Queue & Cache Tier
- **Decision:** Deploy a Redis-compatible service for volatile cache, rate-limiting, and background queueing.
- **Status:** `MASTER-LOCKED`
- **Source:** Master Section 2.2, 2.17; Audit Section 12; Analysis Section 11.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: In-memory Node.js process cache (volatile, lost on container restart).
  - Option B: Dedicated cloud message broker (RabbitMQ / Kafka / AWS SQS).
  - Option C: Redis-compatible service for queue/cache (Master baseline).
- **Chosen Option:** Option C: Redis-compatible service.
- **Reason:** Directly locked in Master Section 2.2.
- **Security Impact:** Redis must be secured via TLS and AUTH; must never store plaintext PII or unhashed secrets.
- **Privacy Impact:** Cache keys must not expose personal customer identifiers.
- **Tenant-Isolation Impact:** All queue payloads and cache keys must be prefixed with `tenant:{organization_id}:`.
- **Database Impact:** Offloads transient read bursts and background task scheduling from PostgreSQL.
- **API Impact:** Backs global sliding-window rate limiters.
- **Provider Impact:** Isolated via standard connection abstraction.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0007 — Private Object Storage Abstraction
- **Decision:** Store binary file uploads in a private S3 / Cloudflare R2-compatible object store governed by the `StorageProvider` abstraction interface (presigned/expiring URLs are candidate access mechanisms).
- **Status:** `MASTER-LOCKED`
- **Source:** Master Section 1.3, 2.2, 2.9; Audit Section 12; Analysis Section 11.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Storing binary files as BLOBs in PostgreSQL.
  - Option B: Local filesystem storage on ephemeral container disk.
  - Option C: S3-compatible / Cloudflare R2-compatible private bucket abstraction (Master baseline).
- **Chosen Option:** Option C: S3 / Cloudflare R2 private bucket abstraction.
- **Reason:** Directly locked in Master Section 2.2.
- **Security Impact:** Bucket is strictly private; public read is disabled; access is mediated via short-lived expiring URLs (candidate engineering pattern).
- **Privacy Impact:** Files containing customer attachments or compliance evidence are encrypted at rest (AES-256).
- **Tenant-Isolation Impact:** Storage keys are partitioned by tenant (candidate prefix convention: `org_{organization_id}/...`).
- **Database Impact:** Database stores only metadata (`file_key`, `mime_type`, `file_size`).
- **API Impact:** Endpoints coordinate secure upload/download URL issuance.
- **Provider Impact:** Governed by `StorageProvider` abstraction.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0008 — In-Process Monolithic Worker Execution
- **Decision:** Execute asynchronous background jobs and queue consumers as in-process tasks within the single NestJS deployable container for MVP.
- **Status:** `MASTER-CONSTRAINED`
- **Source:** Master Section 2.1, 2.17; Analysis Section 8, 11; Red-Team Corrected Section 2.5 (RT-05).
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Separate worker container fleet deployed independently from the API.
  - Option B: External serverless background functions (e.g., AWS Lambda).
  - Option C: In-process queue worker running inside the single NestJS deployable container (Master-derived position).
- **Chosen Option:** Option C: In-process queue worker inside the single NestJS container for MVP.
- **Reason:** Master Section 2.1 explicitly mandates: "The application remains one deployable unit initially while internal module boundaries allow future extraction." Separate worker container fleets are deferred until Phase 12 scaling triggers.
- **Security Impact:** Worker executes within the same security perimeter as the API.
- **Privacy Impact:** Data stays in-memory; jobs do not travel over unencrypted external networks.
- **Tenant-Isolation Impact:** Worker tasks inherit tenant context from the queued payload.
- **Database Impact:** Shares the existing PostgreSQL connection pool.
- **API Impact:** Prevents long-running jobs from blocking HTTP request cycles.
- **Provider Impact:** Accesses external providers via the same provider adapters.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0009 — Containerization via Docker
- **Decision:** Package the application using standard Docker container definitions.
- **Status:** `MASTER-LOCKED`
- **Source:** Master Section 2.2, 2.14; Audit Section 12; Analysis Section 11.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Bare-metal host installation.
  - Option B: Proprietary cloud buildpacks.
  - Option C: Standard multi-stage Docker containers (Master baseline).
- **Chosen Option:** Option C: Docker containers.
- **Reason:** Explicitly mandated in Master Section 2.2 technology stack.
- **Security Impact:** Immutable deployment artifacts; minimal base images (Alpine/Distroless); non-root user execution.
- **Privacy Impact:** Zero production data bundled into container images.
- **Tenant-Isolation Impact:** Uniform runtime environment across local, staging, and production.
- **Database Impact:** None.
- **API Impact:** Consistent HTTP routing across hosting environments.
- **Provider Impact:** Enables provider-independent deployment.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0010 — Base API Path `/api/v1` & OpenAPI Contract
- **Decision:** Expose all business endpoints under `/api/v1`, governed strictly by an OpenAPI 3.x contract.
- **Status:** `MASTER-LOCKED`
- **Source:** Master Section 1.3, 2.2, 2.6; Audit Section 15; Analysis Section 7.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: GraphQL endpoint without REST versioning.
  - Option B: Unversioned REST API (`/api/...`).
  - Option C: Explicit `/api/v1` base path with OpenAPI contract (Master baseline).
- **Chosen Option:** Option C: `/api/v1` with OpenAPI 3.x contract.
- **Reason:** Explicitly mandated by Master Section 1.3, 2.2, and 2.6.
- **Security Impact:** Contract defines exact input validation constraints and eliminates unexpected parameter pollution.
- **Privacy Impact:** Response DTOs explicitly exclude sensitive internal fields.
- **Tenant-Isolation Impact:** API contract reflects authenticated tenant scoping (specific transport mechanics such as headers, tokens, or route bindings are candidate engineering implementations).
- **Database Impact:** Models are mapped to contract DTOs.
- **API Impact:** Deterministic, versioned, contractor-ready endpoint contracts.
- **Provider Impact:** None.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0011 — 5-Stage Environment Progression Model
- **Decision:** Maintain the five-tier environment progression strictly as defined in Master Section 2.4: `LOCAL` → `TEST` → `STAGING` → `MVP PRODUCTION` → `FUNDED PRODUCTION`.
- **Status:** `MASTER-LOCKED`
- **Source:** Master Section 1.7, 2.4, 2.10; Audit Section 25; Analysis Section 1.6.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Single shared cloud environment.
  - Option B: Ad-hoc unformalized environments.
  - Option C: 5-stage environment progression (`LOCAL` → `TEST` → `STAGING` → `MVP PRODUCTION` → `FUNDED PRODUCTION`) with separate secrets and data (Master baseline).
- **Chosen Option:** Option C: 5-stage environment progression (`LOCAL` → `TEST` → `STAGING` → `MVP PRODUCTION` → `FUNDED PRODUCTION`).
- **Reason:** Mandated by Master Section 2.4: "LOCAL → TEST → STAGING → MVP PRODUCTION → FUNDED PRODUCTION. Each environment has separate secrets and data. Local development uses Docker Compose. Production secrets are never committed to source control." (Restore testing in non-production recovery environments operates per Section 2.10 without altering the Master environment progression).
- **Security Impact:** Strict isolation of secrets and data across every environment tier; production secrets never committed to source control.
- **Privacy Impact:** Production data must never be imported into lower environments without certified anonymization (Rule 6).
- **Tenant-Isolation Impact:** Prevents cross-environment data leakage.
- **Database Impact:** Dedicated databases per environment tier.
- **API Impact:** Environment-specific configuration and base URLs.
- **Provider Impact:** Sandbox / test mode API keys in lower environments.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

## 4. Provider Independence Decisions (Group B)

### ADR-0012 — StorageProvider Abstraction Interface
- **Decision:** Isolate all file and object storage operations behind the `StorageProvider` TypeScript interface.
- **Status:** `MASTER-LOCKED`
- **Source:** Master Section 2.2; Audit Section 12, 28; Analysis Section 1.3, 11.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Direct AWS S3 SDK calls inside business controllers.
  - Option B: Direct Cloudflare R2 API calls.
  - Option C: `StorageProvider` abstraction interface (Master baseline).
- **Chosen Option:** Option C: `StorageProvider` abstraction.
- **Reason:** Mandated by Master Section 2.2 to ensure provider independence.
- **Security Impact:** Restricts bucket credentials to the infrastructure adapter; domain services cannot misconfigure bucket ACLs.
- **Privacy Impact:** Centralizes encryption and presigned URL expiration policies.
- **Tenant-Isolation Impact:** Enforces tenant prefixing (`org_{id}/...`) in the adapter layer.
- **Database Impact:** Domain models store only abstract file keys.
- **API Impact:** Facilitates presigned URL issuance.
- **Provider Impact:** S3, R2, or local disk can be swapped with zero domain code modifications.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0013 — EmailProvider Abstraction Interface
- **Decision:** Isolate transactional email dispatch behind the `EmailProvider` interface.
- **Status:** `MASTER-LOCKED`
- **Source:** Master Section 2.2; Audit Section 12, 28; Analysis Section 1.3, 11.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Direct Resend SDK imports in service files.
  - Option B: Hardcoded SMTP client.
  - Option C: `EmailProvider` abstraction interface (Master baseline).
- **Chosen Option:** Option C: `EmailProvider` abstraction.
- **Reason:** Explicitly mandated by Master Section 2.2.
- **Security Impact:** Isolates API keys from domain logic.
- **Privacy Impact:** Email content and recipient addresses pass through controlled sanitization.
- **Tenant-Isolation Impact:** Email sender headers or templates can be customized per tenant.
- **Database Impact:** None.
- **API Impact:** None.
- **Provider Impact:** Resend is the initial locked adapter, swappable without domain rewrites.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0014 — NotificationProvider Abstraction Interface
- **Decision:** Isolate multi-channel notification dispatch behind the `NotificationProvider` interface.
- **Status:** `MASTER-LOCKED`
- **Source:** Master Section 2.2; Audit Section 12, 28; Analysis Section 1.3, 11.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Ad-hoc notification logic scattered across modules.
  - Option B: Direct third-party push notification SDK binding.
  - Option C: `NotificationProvider` abstraction interface (Master baseline).
- **Chosen Option:** Option C: `NotificationProvider` abstraction.
- **Reason:** Explicitly mandated by Master Section 2.2.
- **Security Impact:** Prevents notification payload spoofing; manages webhook/push credentials centrally.
- **Privacy Impact:** User notification preferences and opt-outs are evaluated centrally.
- **Tenant-Isolation Impact:** In-app notifications are stored with `organization_id` scoping in `notifications`.
- **Database Impact:** Dispatches events recorded in `notifications`.
- **API Impact:** Powers in-app notification retrieval endpoints.
- **Provider Impact:** Supports email, SMS, and in-app delivery adapters.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0015 — PaymentProvider Abstraction Interface
- **Decision:** Isolate all payment, quote checkout, and invoice settlement logic behind the `PaymentProvider` interface.
- **Status:** `MASTER-LOCKED`
- **Source:** Master Section 2.2; Audit Section 12, 28; Analysis Section 1.3, 3.5, 11.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Direct Dodo Payments SDK binding in billing controllers.
  - Option B: Direct Stripe SDK integration.
  - Option C: `PaymentProvider` abstraction interface (Master baseline).
- **Chosen Option:** Option C: `PaymentProvider` abstraction interface.
- **Reason:** Explicitly mandated by Master Section 2.2: "Payments: Dodo Payments through provider abstraction."
- **Security Impact:** The PaymentProvider abstraction and hosted payment flow are designed to minimize direct handling of payment-card data by delegating card intake and sensitive processing to the external payment provider; the platform does not directly ingest or store raw primary account numbers (PANs). This architectural boundary minimizes compliance surface but does not constitute a legal or compliance certification claim.
- **Privacy Impact:** Financial transactions reference external customer IDs rather than storing credit card PII.
- **Tenant-Isolation Impact:** Webhook reconciliation binds payments strictly to the owning `organization_id`.
- **Database Impact:** Updates `invoices` status upon verified provider webhook receipt.
- **API Impact:** Exposes checkout intent generation and webhook ingress routes.
- **Provider Impact:** Dodo Payments is locked for MVP Phase 4; swappable to Stripe/Paddle in future.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0016 — RemoteSupportProvider Abstraction Interface
- **Decision:** Isolate remote support session initiation, customer consent verification, and session state tracking behind the `RemoteSupportProvider` abstraction interface.
- **Status:** `MASTER-LOCKED`
- **Source:** Master Section 2.2, 2.11; Audit Section 12, 28; Analysis Section 1.3, 3.6, 11.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Direct integration with third-party remote support tooling without an abstraction boundary.
  - Option B: Hardcoded remote support operations embedded directly in ticket controllers.
  - Option C: `RemoteSupportProvider` abstraction interface isolating session lifecycle, customer consent verification, and session state tracking (Master baseline).
- **Chosen Option:** Option C: `RemoteSupportProvider` abstraction interface.
- **Reason:** Mandated by Master Section 2.2 and Section 2.11. The Master locks the provider abstraction interface and core security requirements (explicit customer consent, session auditability, zero stored customer credentials), while leaving underlying protocols/tooling open to human decision under ADR-0048.
- **Security Impact:** Enforces Master security requirements: mandatory customer consent verification, zero stored customer credentials, bounded session lifetimes, and immutable audit logging.
- **Privacy Impact:** Diagnostic access requires explicit customer authorization, is time-bounded, and records immutable audit references.
- **Tenant-Isolation Impact:** Sessions are bound to tenant tickets.
- **Database Impact:** Updates `remote_support_sessions`.
- **API Impact:** Governs `/api/v1/tickets/{id}/remote-sessions` endpoints.
- **Provider Impact:** Decouples platform core from the underlying remote support implementation. (Underlying protocol, signaling, and tooling options remain unresolved pending human decision under ADR-0048).
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0017 — MapsProvider Abstraction Interface
- **Decision:** Isolate geocoding, address verification, and distance calculations behind the `MapsProvider` interface.
- **Status:** `MASTER-LOCKED`
- **Source:** Master Section 2.2; Audit Section 12, 28; Analysis Section 1.3, 11.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Direct Google Maps API integration.
  - Option B: Direct Mapbox SDK calls.
  - Option C: `MapsProvider` abstraction interface (Master baseline).
- **Chosen Option:** Option C: `MapsProvider` abstraction.
- **Reason:** Mandated by Master Section 2.2.
- **Security Impact:** API tokens are isolated; external network calls are bounded by timeouts.
- **Privacy Impact:** Location queries for customer sites and technicians are scrubbed of personal identifiers.
- **Tenant-Isolation Impact:** Geocoding results are scoped to tenant service areas.
- **Database Impact:** Feeds latitude/longitude coordinates to `organization_locations`.
- **API Impact:** Powers technician dispatch matching logic.
- **Provider Impact:** Allows zero-cost default (e.g., OpenStreetMap) or paid provider (Google Maps) via adapter.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

## 5. Security & Cross-Cutting Decisions (Group C)

### ADR-0018 — Authentication Architecture & Privileged MFA
- **Decision:** Enforce centralized server-side authentication across all protected endpoints, with mandatory Multi-Factor Authentication (MFA) for all privileged accounts.
- **Status:** `MASTER-LOCKED`
- **Source:** Master Section 1.3, 2.7; Audit Section 16.1; Analysis Section 1.5, 6.1, 9.1.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Basic HTTP authentication without MFA.
  - Option B: Optional MFA for all roles.
  - Option C: Centralized authentication with mandatory MFA for privileged accounts (Master baseline).
- **Chosen Option:** Option C: Mandatory MFA for privileged roles (`OWNER`, `ADMIN`).
- **Reason:** Explicitly mandated by Master Section 1.3 and 2.7.
- **Security Impact:** Neutralizes credential stuffing and password compromise for administrative accounts.
- **Privacy Impact:** MFA secrets (TOTP seeds) are encrypted at rest.
- **Tenant-Isolation Impact:** Authentication verifies user identity before tenant membership resolution.
- **Database Impact:** Models `mfa_enabled` flag on `users` entity.
- **API Impact:** Exposes `/api/v1/auth/mfa/verify` endpoint.
- **Provider Impact:** Implemented in-engine or via AuthProvider.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0019 — Session & Token Representation (JWT Candidate)
- **Decision:** Consider JWT access tokens with secure HTTP-only refresh cookies as a candidate engineering option, pending implementation sign-off.
- **Status:** `ARCHITECTURAL PROPOSAL`
- **Source:** Master Section 2.6, 2.7; Analysis Section 6.1, 9.1; Red-Team Corrected Section 2.3 (RT-03).
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Stateless JWT access tokens + HTTP-only refresh cookies (*Candidate Engineering Option*).
  - Option B: Server-side stateful session tokens stored in Redis.
  - Option C: Opaque bearer tokens validated against PostgreSQL.
- **Chosen Option:** Proposed, pending approval (JWT + refresh tokens is a candidate engineering option; not locked by Master).
- **Reason:** Master Section 2.6/2.7 mandates secure authentication and session endpoints (`/login`, `/logout`, `/refresh`) without locking the internal token format.
- **Security Impact:** Tokens must be signed with strong asymmetric keys or HMAC; short-lived access tokens limit compromise window.
- **Privacy Impact:** Tokens must not contain sensitive PII in claims.
- **Tenant-Isolation Impact:** Tenant membership claim must be verified against current database state.
- **Database Impact:** Refresh tokens or sessions may be tracked in database.
- **API Impact:** Governs Authorization header format (`Bearer <token>`).
- **Provider Impact:** None.
- **Human Approval:** PENDING
- **Date:** 2026-09-04

---

### ADR-0020 — Role-Based Access Control (RBAC) & 6 Initial Roles
- **Decision:** Implement role-based access control governed by six initial roles: `OWNER`, `ADMIN`, `MANAGER`, `TECHNICIAN`, `STAFF`, `CUSTOMER`.
- **Status:** `MASTER-LOCKED`
- **Source:** Master Section 2.7; Audit Section 16.2; Analysis Section 3.1, 6.2.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Flat user model with Boolean admin flag.
  - Option B: Dynamic customer-defined custom roles only.
  - Option C: 6 locked initial roles mapped to granular permissions (Master baseline).
- **Chosen Option:** Option C: 6 initial roles (`OWNER`, `ADMIN`, `MANAGER`, `TECHNICIAN`, `STAFF`, `CUSTOMER`).
- **Reason:** Explicitly mandated by Master Section 2.7 (Lines 466–473).
- **Security Impact:** Enforces role segregation across all system operations.
- **Privacy Impact:** Restricts PII visibility based on role responsibility.
- **Tenant-Isolation Impact:** Roles are assigned per organization membership (`memberships` table).
- **Database Impact:** Models `roles`, `permissions`, and `role_permissions` entities.
- **API Impact:** Endpoints decorated with role/permission requirements.
- **Provider Impact:** None.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0021 — Least-Privilege Authorization Model
- **Decision:** Enforce fine-grained, explicit permission evaluation for every action (e.g., `tickets:read`, `billing:approve`).
- **Status:** `MASTER-LOCKED`
- **Source:** Master Section 1.3, 2.7; Audit Section 16.2; Analysis Section 6.2.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Coarse-grained role checks only (e.g., `isAdmin()`).
  - Option B: Discretionary access control per record.
  - Option C: Fine-grained permission keys evaluated along the Master authorization sequence (Master baseline).
- **Chosen Option:** Option C: Fine-grained permission model (`tickets:create`, `billing:read`, etc.).
- **Reason:** Mandated by Master Section 1.3 and 2.7: `user` → `membership` → `role` → `permission` → `resource scope` → `action`.
- **Security Impact:** Eliminates privilege escalation by validating exact action scopes.
- **Privacy Impact:** Prevents unauthorized viewing of customer PII by technicians or staff.
- **Tenant-Isolation Impact:** Permission evaluation strictly incorporates resource ownership checks.
- **Database Impact:** Permissions stored in `permissions` entity.
- **API Impact:** Handlers inspect resolved permissions.
- **Provider Impact:** None.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0022 — Server-Side Authorization Enforcement (PermissionGuard)
- **Decision:** Implement a centralized NestJS `PermissionGuard` to enforce authorization server-side before controller execution.
- **Status:** `MASTER-CONSTRAINED`
- **Source:** Master Section 2.7, 5.2; Analysis Section 6.2; Red-Team Corrected Section 2.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Manual permission checks inside each route handler body.
  - Option B: Database-level row security policies exclusively.
  - Option C: NestJS declarative route guards (`PermissionGuard`) evaluating metadata (Master-derived position).
- **Chosen Option:** Option C: Declarative `PermissionGuard` evaluated server-side.
- **Reason:** Master Section 2.7 specifies the exact authorization evaluation chain; declarative guards guarantee fail-closed enforcement across all API endpoints.
- **Security Impact:** Rejects unauthorized requests with `403 Forbidden` and emits security events.
- **Privacy Impact:** Blocks unauthorized access to privacy management routes.
- **Tenant-Isolation Impact:** Validates that active membership matches target organization.
- **Database Impact:** None directly.
- **API Impact:** Declarative `@RequirePermission(...)` decorators on controllers.
- **Provider Impact:** None.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0023 — Strict Multi-Tenant Isolation by Organization ID
- **Decision:** Enforce multi-tenant data partitioning by requiring `organization_id` on every tenant-owned record and database query.
- **Status:** `MASTER-LOCKED`
- **Source:** Master Section 1.7, 2.8, 5.12; Audit Section 16.4; Analysis Section 1.4, 6.3.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Separate database per tenant (prohibited by modular monolith cost baseline).
  - Option B: Schema-per-tenant inside PostgreSQL.
  - Option C: Shared schema with mandatory `organization_id` scoping on all queries (Master baseline).
- **Chosen Option:** Option C: Shared schema with mandatory `organization_id` scoping and automated cross-tenant failure tests.
- **Reason:** Explicitly mandated by Master Section 2.8 (Lines 495–518) and Business Rule 8.
- **Security Impact:** Eliminates cross-tenant data leakage; critical defect blocker in CI/CD.
- **Privacy Impact:** Guarantees customer PII is never visible to other organizations.
- **Tenant-Isolation Impact:** Fundamental multi-tenant architectural boundary.
- **Database Impact:** Foreign keys and composite indexes on organization ID across all tenant entities.
- **API Impact:** Tenancy context injected via authenticated user membership.
- **Provider Impact:** Storage and provider assets must be scoped by tenant.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0024 — Comprehensive Security Audit Logging
- **Decision:** Capture all administrative, financial, operational, and security actions in an immutable, append-only `audit_events` datastore.
- **Status:** `MASTER-LOCKED`
- **Source:** Master Section 1.3, 2.11, 5.8; Audit Section 16.7; Analysis Section 1.5, 6.4, 9.8.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Ephemeral log files scraped by external agents.
  - Option B: Direct database update/delete permitted on audit records.
  - Option C: Relational, append-only `audit_events` with explicit schema attributes (Master baseline).
- **Chosen Option:** Option C: Append-only `audit_events` capturing: `actor`, `organization`, `action`, `resource_type`, `resource_id`, `request_id`, `timestamp`, `result`, `metadata`.
- **Reason:** Explicitly mandated by Master Section 1.3 and Section 5.8.
- **Security Impact:** Provides non-repudiation and forensic auditability; database-level UPDATE/DELETE is prohibited.
- **Privacy Impact:** Audit metadata must not record raw passwords, encryption keys, or unmasked credit cards.
- **Tenant-Isolation Impact:** Scoped by `organization_id`.
- **Database Impact:** Models `audit_events` table.
- **API Impact:** Automatic capture via global NestJS audit interceptor.
- **Provider Impact:** None.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0025 — Secrets Externalization & Masking Policy
- **Decision:** Prohibit hardcoded secrets in version control, frontend bundles, or application logs; enforce sensitive value masking.
- **Status:** `MASTER-LOCKED`
- **Source:** Master Section 1.7, 2.4, 2.10; Audit Section 16.6; Analysis Section 1.5, 6.5.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Secrets committed to private Git repo.
  - Option B: Static `.env` files bundled into Docker build images.
  - Option C: Externalized environment variables/KMS with log masking filters (Master baseline).
- **Chosen Option:** Option C: Externalized secrets and automated log masking.
- **Reason:** Explicitly mandated by Master Section 2.10 and Business Rule 10.
- **Security Impact:** Prevents credential leaks and secret exposure.
- **Privacy Impact:** Prevents customer PII and passwords from leaking into monitoring tools (Sentry/PostHog).
- **Tenant-Isolation Impact:** None.
- **Database Impact:** Database connection strings externalized.
- **API Impact:** None.
- **Provider Impact:** Provider API tokens managed strictly via environment configuration.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0026 — Encryption in Transit (TLS) and at Rest (AES-256)
- **Decision:** Enforce TLS for all production network communications and AES-256 encryption at rest for databases, storage, and backups.
- **Status:** `MASTER-LOCKED`
- **Source:** Master Section 1.3, 2.10; Audit Section 16.6; Analysis Section 1.5.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Unencrypted internal traffic.
  - Option B: Encryption in transit only.
  - Option C: Comprehensive encryption in transit (TLS) and at rest (Master baseline).
- **Chosen Option:** Option C: Full encryption in transit and at rest.
- **Reason:** Explicitly mandated by Master Section 1.3 and Section 2.10.
- **Security Impact:** Protects against network eavesdropping, packet sniffing, and physical disk theft.
- **Privacy Impact:** Protects stored PII under ISO 27701 and GDPR compliance frameworks.
- **Tenant-Isolation Impact:** Ensures tenant data is cryptographically protected on physical media.
- **Database Impact:** Encrypted datastore volume or transparent data encryption (specific volume/block-level encryption mechanism is a candidate engineering implementation option).
- **API Impact:** Reverse proxy enforces HTTPS redirects.
- **Provider Impact:** StorageProvider enforces server-side bucket encryption.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0027 — Irreversible Cryptographic Password Hashing
- **Decision:** Store user passwords strictly using irreversible cryptographic hashing algorithms; reversible encryption is strictly prohibited.
- **Status:** `MASTER-LOCKED`
- **Source:** Master Section 2.10; Audit Section 16.6; Analysis Section 1.5; Red-Team Corrected Section 2.3 (RT-03).
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Reversible encryption (e.g., AES) — strictly prohibited by Master.
  - Option B: MD5 / SHA1 hashing — prohibited by security standards.
  - Option C: Modern irreversible cryptographic hashing (Argon2id or bcrypt: *Candidate Engineering Option — Not Locked by Master*).
- **Chosen Option:** Master-derived position: Irreversible cryptographic hashing is locked. (Argon2id/bcrypt are candidate engineering options).
- **Reason:** Explicitly mandated by Master Section 2.10: "Passwords are hashed, never reversibly encrypted."
- **Security Impact:** Neutralizes database dump credential exposure.
- **Privacy Impact:** User credentials cannot be viewed by platform administrators.
- **Tenant-Isolation Impact:** None.
- **Database Impact:** Models `password_hash` column on `users` entity.
- **API Impact:** Login endpoint performs hash verification.
- **Provider Impact:** None.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0028 — Rate Limiting & Abuse Prevention Strategy
- **Decision:** Implement rate limiting across API endpoints to protect against brute-force attacks and denial of service.
- **Status:** `MASTER-LOCKED`
- **Source:** Master Section 1.3, 2.9; Audit Section 15, 16.5; Analysis Section 6.5.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: No rate limiting in MVP.
  - Option B: In-memory rate limiting per container instance.
  - Option C: Redis-backed distributed rate limiting (Master baseline requirement; sliding window algorithm proposed).
- **Chosen Option:** Master-derived position: Rate limiting is locked. (Redis sliding window is a candidate engineering option).
- **Reason:** Explicitly mandated by Master Section 1.3 and Section 2.9 threat model.
- **Security Impact:** Protects `/api/v1/auth/login` and sensitive mutation routes from automated brute-force attacks.
- **Privacy Impact:** Prevents automated data scraping and enumerations.
- **Tenant-Isolation Impact:** Rate limits applied per IP globally and per tenant organization.
- **Database Impact:** Protects PostgreSQL from request flooding.
- **API Impact:** Returns `429 Too Many Requests` on breach.
- **Provider Impact:** Backed by Redis-compatible service.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0029 — Input Validation & Schema Sanitization
- **Decision:** Enforce strict, fail-closed input validation and sanitization on all incoming HTTP request payloads before reaching domain handlers.
- **Status:** `MASTER-LOCKED`
- **Source:** Master Section 1.3, 2.9; Audit Section 15; Analysis Section 6.5; Red-Team Corrected Section 2.3 (RT-03).
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Manual validation in service business logic.
  - Option B: Permissive schema validation ignoring unknown properties.
  - Option C: Global validation pipe rejecting unwhitelisted properties (Zod or class-validator: *Candidate Engineering Option — Not Locked by Master*).
- **Chosen Option:** Master-derived position: Strict input validation is locked. (Zod / class-validator are candidate engineering options).
- **Reason:** Explicitly mandated by Master Section 1.3 and Section 2.9.
- **Security Impact:** Eliminates injection attacks, prototype pollution, and malformed payload exploits.
- **Privacy Impact:** Prevents injection of malicious payloads into customer messaging threads.
- **Tenant-Isolation Impact:** Blocks parameter tampering on `organization_id`.
- **Database Impact:** Ensures data integrity before Prisma model interaction.
- **API Impact:** Rejects invalid payloads with `400 Bad Request` and standard error payload.
- **Provider Impact:** None.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0030 — Payment Webhook Ingress Security Boundary
- **Decision:** Separate external payment webhook ingress from user authentication, requiring cryptographic signature / HMAC verification and replay protection.
- **Status:** `MASTER-CONSTRAINED`
- **Source:** Master Section 2.2, 2.9; Analysis Section 9.1; Red-Team Corrected Section 2.4 (RT-04).
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Treat webhooks as ordinary user API endpoints requiring JWT (invalid; payment providers cannot hold user JWTs).
  - Option B: Unauthenticated public webhook endpoint (critical vulnerability).
  - Option C: Dedicated public webhook ingress with cryptographic signature / HMAC verification and replay protection (*Master-derived position; proposed security controls*).
- **Chosen Option:** Option C: Dedicated HMAC signature verification boundary.
- **Reason:** Master Section 2.9 explicitly mandates protection against "Webhook forgery/replay". Webhook requests must bypass user JWT guards and validate provider signatures before queueing.
- **Security Impact:** Eliminates spoofed payment notifications and unauthorized invoice marking.
- **Privacy Impact:** Webhook payloads contain transaction references, not customer card details.
- **Tenant-Isolation Impact:** Webhook handler resolves owning tenant via internal invoice reference.
- **Database Impact:** Webhook event IDs recorded for idempotency deduplication.
- **API Impact:** Ingress at `/api/v1/contracts/webhooks` or `/api/v1/billing/webhooks`.
- **Provider Impact:** Validates signatures generated by Dodo Payments adapter.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

## 6. Data Architecture & Entity Decisions (Group D)

### ADR-0031 — Authoritative 40-Entity Inventory Scope
- **Decision:** Confine the platform data model strictly to the 40 core entities explicitly listed in Master Section 2.5.
- **Status:** `MASTER-LOCKED`
- **Source:** Master Section 2.5 (Lines 332–371); Audit Section 14.2; Verification Section 4.1; Analysis Section 4.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Introduce speculative enterprise entities (e.g., `audit_logs`, `organizations_billing`, `sla_policies`).
  - Option B: Omit unelaborated bare entities.
  - Option C: Model strictly and exclusively the 40 entities enumerated in Master Section 2.5 (Master baseline).
- **Chosen Option:** Option C: Exactly the 40 Master entities (1 to 40).
- **Reason:** Verified by `docs/MASTER-BASELINE-VERIFICATION.md` as the authoritative, comprehensive entity inventory.
- **Security Impact:** Strictly bounds the data attack surface.
- **Privacy Impact:** Defines the complete perimeter for privacy audits and DSAR exports.
- **Tenant-Isolation Impact:** 38 of the 40 entities are directly organization-scoped.
- **Database Impact:** Establishes the exact table inventory for PostgreSQL.
- **API Impact:** Shapes all domain resources.
- **Provider Impact:** None.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0032 — 10 Candidate Internal Modular Monolith Domains
- **Decision:** Group the 40 entities into 10 candidate internal modules (`auth-identity`, `customer-operations`, `tickets`, `dispatch-field-service`, `commercial-billing`, `remote-support`, `privacy-protection`, `compliance-governance`, `audit-security`, `platform-foundation`).
- **Status:** `ARCHITECTURAL PROPOSAL`
- **Source:** Master Section 2.1, 2.3; Analysis Section 13; Red-Team Corrected Section 2.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: 40 distinct modules (1:1 mapping for each entity — anti-pattern).
  - Option B: 3 large monolithic modules (Auth, Operations, Admin).
  - Option C: 10 cohesive domain modules organized by capability boundary (*Proposed, pending approval*).
- **Chosen Option:** Proposed, pending approval (Candidate module structure; not yet locked).
- **Reason:** Balances high cohesion and loose coupling; prevents module proliferation while isolating sensitive financial, remote support, and compliance domains.
- **Security Impact:** Isolates high-risk remote support and billing logic.
- **Privacy Impact:** Isolates DSAR workflows and compliance registers into dedicated modules.
- **Tenant-Isolation Impact:** Uniformly applied across all 10 candidate modules.
- **Database Impact:** Maps to directory layout under `apps/api/src/modules/`.
- **API Impact:** Determines internal dependency injection boundaries.
- **Provider Impact:** Provider adapters grouped in `platform-foundation`.
- **Human Approval:** PENDING
- **Date:** 2026-09-04

---

### ADR-0033 — Mandatory `organization_id` Scoping on Tenant Entities
- **Decision:** Mandate non-nullable `organization_id` foreign keys and composite database indexes on all organization-owned entities.
- **Status:** `MASTER-LOCKED`
- **Source:** Master Section 1.7, 2.8, 5.12; Audit Section 14.1; Analysis Section 1.4, 4.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Optional tenant scoping on certain shared operational entities.
  - Option B: Tenant scoping managed exclusively in application code without database indexes.
  - Option C: Mandatory `organization_id` column with explicit composite indexing on tenant entities (Master baseline; concrete Prisma syntax such as `@@index([organization_id])` is candidate schema mapping).
- **Chosen Option:** Option C: Mandatory database-level tenant scoping.
- **Reason:** Mandated by Master Section 2.5, 2.8, and 5.12.
- **Security Impact:** Prevents orphaned records and structural cross-tenant leakage.
- **Privacy Impact:** Ensures tenant data is isolated on disk.
- **Tenant-Isolation Impact:** Primary enforcement mechanism for multi-tenancy.
- **Database Impact:** Added to 38 organization-scoped tables.
- **API Impact:** Every query includes tenant filter.
- **Provider Impact:** None.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0034 — Relational Database Conventions (UUID, snake_case, UTC)
- **Decision:** Standardize on UUID primary keys, snake_case database identifiers, UTC timestamps (`created_at`, `updated_at` on mutable entities), explicit foreign keys, explicit indexes, and transaction boundaries (Prisma `@@map` is candidate schema mapping).
- **Status:** `MASTER-LOCKED`
- **Source:** Master Section 2.5, 5.12; Audit Section 14.1; Analysis Section 1.9, 4.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Auto-incrementing integer IDs (`serial`).
  - Option B: Mixed local timestamps.
  - Option C: UUID primary keys, snake_case naming, UTC timestamps, and explicit constraints (Master baseline).
- **Chosen Option:** Option C: Master-mandated database conventions.
- **Reason:** Explicitly mandated by Master Section 2.5 and Section 5.12.
- **Security Impact:** UUIDs prevent ID enumeration and scraping attacks.
- **Privacy Impact:** UTC timestamps provide deterministic audit and retention timelines.
- **Tenant-Isolation Impact:** UUIDs eliminate ID collision across tenants.
- **Database Impact:** Governs all Prisma schema model definitions.
- **API Impact:** IDs in URLs are standard UUID strings.
- **Provider Impact:** None.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0035 — Controlled Schema Gap Management for 33 Bare Entities
- **Decision:** Formally acknowledge that 33 of the 40 Master entities lack field-level specifications in the Master; strictly prohibit inventing fields until Phase 0/2 schema design.
- **Status:** `MASTER-CONSTRAINED`
- **Source:** Master Section 2.5, 5; Baseline Verification DISC-01; Analysis Section 4, 15.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Speculatively draft complete Prisma schemas for all 33 entities now.
  - Option B: Drop the 33 bare entities from the architecture.
  - Option C: Formally recognize bare entities and control their elaboration during Phase 0/2 (Master-derived position).
- **Chosen Option:** Option C: Controlled schema elaboration in Phase 0/2. Parenthetical sketches remain illustrative inferences.
- **Reason:** Master Section 5 lists bare model names for 33 entities. Speculative schema generation at this stage violates the baseline audit rules.
- **Security Impact:** Prevents unvetted fields from creating security vulnerabilities.
- **Privacy Impact:** Ensures PII fields are properly classified before implementation.
- **Tenant-Isolation Impact:** Mandatory `organization_id` will be applied to all 33 entities.
- **Database Impact:** Prisma schema modeling deferred to Phase 0/2.
- **API Impact:** Detailed DTOs deferred to Phase 0/2.
- **Provider Impact:** None.
- **Human Approval:** NOT REQUIRED (Formal column sign-off covered in ADR-0047).
- **Date:** 2026-09-04

---

### ADR-0036 — Relationship Inference Policy & Ledger Tracking
- **Decision:** Explicitly mark all unwritten data relationships as `[INFERRED]` and maintain an exact 20-entry relationship ledger and 12-item conceptual summary.
- **Status:** `ARCHITECTURAL PROPOSAL`
- **Source:** Baseline Verification Section 4; Analysis Section 4, 18; Red-Team Corrected Section 2.1 (RT-01).
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Treat inferred relationships as authoritative Master facts.
  - Option B: Forbid any relationship modeling, leaving entities completely disconnected.
  - Option C: Allow logical relationships only if explicitly tagged `[INFERRED]` and reconciled in a strict ledger (*Proposed, pending approval*).
- **Chosen Option:** Proposed, pending approval (Preserves the 20 tagged relationship entries and 12 conceptual groups).
- **Reason:** Enforces transparency between locked Master requirements and technical inferences, satisfying Red-Team Finding RT-01.
- **Security Impact:** Prevents unauthorized relationship assumptions.
- **Privacy Impact:** Ensures foreign-key cascades do not unintentionally violate retention holds.
- **Tenant-Isolation Impact:** All relationships inherit tenant scoping.
- **Database Impact:** Guides foreign key creation in Phase 0/2.
- **API Impact:** Informs relational query joins.
- **Provider Impact:** None.
- **Human Approval:** PENDING
- **Date:** 2026-09-04

---

## 7. Asynchronous & Background Processing Decisions (Group E)

### ADR-0037 — Asynchronous Execution for Heavy Workloads
- **Decision:** Mandate asynchronous background execution for all heavy reporting, bulk exports, SLA tracking, and notifications to protect the p95 ≤ 500ms API latency budget.
- **Status:** `MASTER-LOCKED`
- **Source:** Master Section 2.17; Audit Section 11, 13.4; Analysis Section 1.10, 8.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Synchronous processing inside HTTP request cycles.
  - Option B: Client-side polling of slow synchronous endpoints.
  - Option C: Asynchronous queue-backed execution for heavy jobs (Master baseline).
- **Chosen Option:** Option C: Asynchronous background processing.
- **Reason:** Explicitly mandated by Master Section 2.17: "Large reports/exports are asynchronous."
- **Security Impact:** Protects API against request-timeout DoS attacks.
- **Privacy Impact:** Long-running export files are secured in private storage with expiring URLs.
- **Tenant-Isolation Impact:** Background jobs execute with explicit tenant context.
- **Database Impact:** Prevents database connection pool exhaustion from long-running queries.
- **API Impact:** Endpoints return `202 Accepted` with job reference ID.
- **Provider Impact:** Offloads external provider latency (e.g., email delivery).
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0038 — Asynchronous SLA Threshold Monitoring & Escalation
- **Decision:** Execute ticket SLA clock tracking and threshold breach escalation asynchronously via scheduled background worker tasks.
- **Status:** `MASTER-CONSTRAINED`
- **Source:** Master Section 1.3, 3.5, Phase 3; Analysis Section 8 (Workflow 1).
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Calculate SLAs synchronously on every ticket read (high database overhead).
  - Option B: Database triggers on ticket updates (inflexible, hard to monitor).
  - Option C: Asynchronous recurring queue worker evaluating open ticket thresholds (Master-derived position).
- **Chosen Option:** Option C: Asynchronous recurring SLA monitor worker.
- **Reason:** Master Section 3.5 requires automated SLA escalation without impacting ticket intake latency.
- **Security Impact:** Alerts managers to unhandled high-priority tickets.
- **Privacy Impact:** None.
- **Tenant-Isolation Impact:** Worker evaluates tickets partitioned by `organization_id`.
- **Database Impact:** Periodic indexed query on open tickets (composite index on organization and status attributes; Prisma `@@index([organization_id, status])` is candidate schema mapping).
- **API Impact:** None directly.
- **Provider Impact:** Triggers notifications via `NotificationProvider`.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0039 — Scheduled Retention Sweeps & Automated Data Purging
- **Decision:** Execute automated daily sweeps against active `retention_rules` to perform configured lifecycle actions (`DELETE`, `ANONYMIZE`, `ARCHIVE`, `REVIEW`).
- **Status:** `MASTER-LOCKED`
- **Source:** Master Section 1.7, 2.12, 5.10; Audit Section 9.10, 17; Analysis Section 8 (Workflow 2), 10.3.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Manual periodic database deletions by administrators.
  - Option B: Immediate deletion on ticket close (violates statutory retention).
  - Option C: Configurable, scheduled automated retention engine (Master baseline).
- **Chosen Option:** Option C: Automated retention sweeps enforcing the 4 Master actions.
- **Reason:** Mandated by Master Section 1.7 (Rule 7) and Section 5.10.
- **Security Impact:** Eliminates stale, unneeded personal data; complies with data minimization.
- **Privacy Impact:** Core ISO 27701 and GDPR compliance mechanism.
- **Tenant-Isolation Impact:** Rules are evaluated per `organization_id`.
- **Database Impact:** Executes targeted batch updates/deletions during off-peak hours.
- **API Impact:** None.
- **Provider Impact:** Emits compliance evidence logs.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0040 — Asynchronous Dispatch & Field Service Alerts
- **Decision:** Queue technician job assignment alerts and schedule notifications asynchronously to preserve mobile/API responsiveness.
- **Status:** `MASTER-CONSTRAINED`
- **Source:** Master Section 2.2, 3.4; Analysis Section 8 (Workflow 3); Red-Team Corrected Section 2.2 (RT-02).
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Synchronous email/SMS dispatch inside job assignment handler.
  - Option B: Client-side dispatch triggered from technician mobile browser.
  - Option C: Asynchronous worker consuming dispatch events via `NotificationProvider` (Master-derived position).
- **Chosen Option:** Option C: Asynchronous dispatch notification worker.
- **Reason:** Prevents third-party provider latency (Resend / SMS gateway) from delaying field dispatch operations.
- **Security Impact:** Outbound alerts do not expose authentication tokens.
- **Privacy Impact:** Customer site addresses dispatched only to assigned technicians.
- **Tenant-Isolation Impact:** Notification records are scoped to `organization_id`.
- **Database Impact:** Creates records in `notifications` table.
- **API Impact:** Job assignment endpoint returns immediately.
- **Provider Impact:** Dispatched via `NotificationProvider` / `EmailProvider`.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0041 — Asynchronous Heavy Reports & DSAR Export Compilation
- **Decision:** Compile large operational reports and DSAR data portability packages asynchronously via background queue workers.
- **Status:** `MASTER-LOCKED`
- **Source:** Master Section 2.17, 3.8; Audit Section 11; Analysis Section 8 (Workflow 4).
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Synchronous file streaming on HTTP GET request (risks gateway timeouts).
  - Option B: Export compilation handled in browser JavaScript.
  - Option C: Asynchronous compilation, private S3 upload, and presigned link delivery (Master baseline).
- **Chosen Option:** Option C: Asynchronous report and DSAR export worker.
- **Reason:** Explicitly mandated by Master Section 2.17 and Section 3.8.
- **Security Impact:** Export packages are encrypted and hosted on expiring URLs (exact duration such as 24-hour expiry is a candidate configuration value).
- **Privacy Impact:** Fulfills GDPR Article 15/20 data access and portability mandates securely.
- **Tenant-Isolation Impact:** Queries restricted strictly to target tenant and data subject.
- **Database Impact:** Read-only queries executed with cursor pagination to minimize memory footprint.
- **API Impact:** Issues job status and download redirect endpoints.
- **Provider Impact:** Stores compiled archives via `StorageProvider`.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0042 — Asynchronous Payment Webhook Reconciliation
- **Decision:** Process incoming payment provider webhook payloads asynchronously via queue workers to acknowledge webhooks immediately with `200 OK`.
- **Status:** `MASTER-CONSTRAINED`
- **Source:** Master Section 2.2, 3.6, Phase 4; Analysis Section 8 (Workflow 5); Red-Team Corrected Section 2.4 (RT-04).
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Synchronous contract activation and invoice reconciliation during webhook HTTP cycle.
  - Option B: Polling payment provider API periodically for invoice status.
  - Option C: Signature verification at ingress + asynchronous queue worker reconciliation (Master-derived position).
- **Chosen Option:** Option C: Immediate signature validation + asynchronous queue reconciliation.
- **Reason:** Webhook endpoints must respond quickly to prevent external provider retries; internal reconciliation must be idempotent.
- **Security Impact:** Ingress validates HMAC signature; worker enforces idempotency key deduplication.
- **Privacy Impact:** None.
- **Tenant-Isolation Impact:** Binds payments strictly to owning tenant invoice.
- **Database Impact:** Updates `invoices` status to `PAID` within database transaction.
- **API Impact:** Immediate `200 OK` acknowledgment within latency budget (p95 ≤ 500ms).
- **Provider Impact:** Consumes webhooks from `PaymentProvider` adapter.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0043 — Automated Backup Restoration Integrity Testing
- **Decision:** Implement automated scheduled restore testing against isolated recovery environments to validate backup integrity and verify RPO/RTO ≤ 24 hours.
- **Status:** `MASTER-LOCKED`
- **Source:** Master Section 1.8, 2.16, 3.10; Audit Section 10.2, 24; Analysis Section 1.11, 8 (Workflow 7).
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Untested pg_dump backups (prohibited by Master Section 2.16).
  - Option B: Manual ad-hoc restore testing once a year.
  - Option C: Automated recurring restore execution in an isolated recovery environment (Master baseline).
- **Chosen Option:** Option C: Automated scheduled restore testing.
- **Reason:** Mandated by Master Section 2.16: "A backup is not considered reliable until restoration has been successfully tested."
- **Security Impact:** Protects against unrecoverable ransomware or datastore corruption.
- **Privacy Impact:** Test recovery database is destroyed immediately after integrity verification; zero test data retention.
- **Tenant-Isolation Impact:** Confirms all tenant schemas restore cleanly.
- **Database Impact:** Verifies PostgreSQL snapshot restorability.
- **API Impact:** None.
- **Provider Impact:** Stores backup artifacts via private storage. Generates signed records in `compliance_evidence`.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

## 8. Material Human Decisions & Unresolved Master Ambiguities (Group F)

> [!IMPORTANT]
> **Explicit Governance Distinction:**
> - **MASTER AMBIGUITIES: 7** (ADR-0044 through ADR-0050). These represent textual contradictions, priority clashes, or scope gaps directly present in [`docs/MASTER-SPEC-001-002.md`](file:///c:/SURAJ/Remotfix/docs/MASTER-SPEC-001-002.md).
> - **MATERIAL HUMAN DECISIONS: 8** (ADR-0044 through ADR-0051). These represent material architectural, commercial, and scope items that cannot be resolved autonomously by engineering agents and require formal human stakeholder sign-off. This includes the 7 Master ambiguities plus ADR-0051 (hosting vendor selection for the approved low-cost environment).
> 
> These counts track distinct concepts. All 8 material decisions remain strictly unresolved: Status is `HUMAN DECISION REQUIRED` and Chosen Option is *"No option approved."*

### ADR-0044 — SLA Tracking/Escalation Priority & Delivery Phase
- **Decision:** Determine whether SLA tracking and escalation is delivered in MVP Phase 3 as a Must-Have or deferred as a Should-Have.
- **Status:** `HUMAN DECISION REQUIRED`
- **Source:** Master Section 1.3 (Line 52), Section 1.4 (Line 80), Section 6 (Phase 3); Baseline Verification DISC-03; Analysis Section 15.1, 16.1.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Deliver core SLA tracking and automated escalation in Phase 3 (MVP Phase), resolving priority to Must-Have.
  - Option B: Deliver manual SLA tracking in Phase 3, deferring automated escalation to post-MVP Should-Have.
  - Option C: Defer all SLA tracking and escalation functionality to post-MVP.
- **Chosen Option:** No option approved. (Carried forward unresolved; requires human stakeholder sign-off).
- **Reason:** Direct textual contradiction between Master Section 1.3 (Must-Have), Section 1.4 (Should-Have), and Section 6 (Phase 3 deliverable).
- **Security Impact:** Pending decision.
- **Privacy Impact:** None.
- **Tenant-Isolation Impact:** Pending decision.
- **Database Impact:** Determines whether SLA fields are modeled on `tickets` in Phase 0/2.
- **API Impact:** Determines presence of SLA escalation endpoints in MVP.
- **Provider Impact:** None.
- **Human Approval:** REQUIRED
- **Date:** 2026-09-04

---

### ADR-0045 — Privacy Workflows & Dashboard Sequencing
- **Decision:** Determine whether Data Export/Deletion workflows and Security/Privacy Dashboards must precede MVP deployment or be delivered post-MVP.
- **Status:** `HUMAN DECISION REQUIRED`
- **Source:** Master Section 1.3 (Line 66), Section 1.4 (Lines 82, 84, 85), Section 6 (Phases 6 & 7); Baseline Verification DISC-04; Analysis Section 15.2, 16.2.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Deliver DSAR export/deletion workflows and governance dashboards in Phase 6/7 prior to Phase 9 MVP deployment.
  - Option B: Deliver basic DSAR intake in MVP, deferring visual dashboards to post-MVP Should-Have.
  - Option C: Defer all privacy workflows and dashboards to post-MVP.
- **Chosen Option:** No option approved. (Carried forward unresolved; requires human stakeholder sign-off).
- **Reason:** Direct contradiction between Section 1.3 (Privacy is Must-Have), Section 1.4 (Dashboards are Should-Have), and Section 6 (scheduled in core Phase 6/7).
- **Security Impact:** Pending decision.
- **Privacy Impact:** Impacts early compliance with GDPR/ISO 27701 readiness.
- **Tenant-Isolation Impact:** Pending decision.
- **Database Impact:** Affects implementation timing of `privacy_requests` and `retention_rules`.
- **API Impact:** Governs availability of `/api/v1/privacy` in MVP.
- **Provider Impact:** None.
- **Human Approval:** REQUIRED
- **Date:** 2026-09-04

---

### ADR-0046 — User Personas to RBAC Role Mapping
- **Decision:** Decide whether *Security/compliance administrators* and *Authorized support personnel* require dedicated role enums or permission bundles on existing roles.
- **Status:** `HUMAN DECISION REQUIRED`
- **Source:** Master Section 1.2 (Lines 30–39), Section 2.7 (Lines 466–473); Baseline Verification DISC-05; Analysis Section 15.3, 16.3.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Introduce dedicated database role enums (`SECURITY_ADMIN`, `SUPPORT_AGENT`) expanding Section 2.7 to 8 roles.
  - Option B: Retain strict 6 initial roles from Section 2.7 and assign specialized permission bundles to `ADMIN` and `MANAGER`.
  - Option C: Implement a dynamic role creation capability in Phase 1.
- **Chosen Option:** No option approved. (Carried forward unresolved; requires human stakeholder sign-off).
- **Reason:** Master Section 1.2 defines 7 primary user personas, but Master Section 2.7 enumerates only 6 initial roles, omitting two personas while adding `MANAGER`.
- **Security Impact:** Critical to administrative privilege separation and audit logging.
- **Privacy Impact:** Governs who can access compliance registers and DSAR requests.
- **Tenant-Isolation Impact:** Scoped by organization membership.
- **Database Impact:** Impacts `Role` enum definition in Prisma schema.
- **API Impact:** Influences `@RequireRole(...)` vs `@RequirePermission(...)` route guards.
- **Provider Impact:** None.
- **Human Approval:** REQUIRED
- **Date:** 2026-09-04

---

### ADR-0047 — Attribute Elaboration for the 33 Bare Entities
- **Decision:** Formalize and approve detailed column schemas, data types, nullability, and indexes for the 33 bare entities prior to database migration generation.
- **Status:** `HUMAN DECISION REQUIRED`
- **Source:** Master Section 2.5, Section 5; Baseline Verification DISC-01; Analysis Section 15.4, 16.7.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Adopt the illustrative parenthetical field sketches from Baseline Audit Section 14.2 as the baseline draft for stakeholder review.
  - Option B: Conduct a formal attribute design review during Phase 0 to define complete schemas for the 33 entities.
  - Option C: Generate minimal 6-field schemas matching the illustrative `Ticket` model in Section 5.12.
- **Chosen Option:** No option approved. (Carried forward unresolved; requires human stakeholder sign-off).
- **Reason:** Master Section 5 explicitly defines attributes for only 7 entities; remaining 33 entities are bare model names without schema definitions.
- **Security Impact:** Prevents unvetted fields from introducing security risks.
- **Privacy Impact:** Identifies and classifies PII across all operational models.
- **Tenant-Isolation Impact:** Ensures all 33 entities incorporate mandatory `organization_id`.
- **Database Impact:** Prerequisite for creating `schema.prisma` and initial migrations.
- **API Impact:** Dictates request and response DTO schemas across all modules.
- **Provider Impact:** None.
- **Human Approval:** REQUIRED
- **Date:** 2026-09-04

---

### ADR-0048 — RemoteSupportProvider Protocol & Signaling Tooling
- **Decision:** Select the default signaling engine, protocol, and tooling backing the initial `RemoteSupportProvider` adapter.
- **Status:** `HUMAN DECISION REQUIRED`
- **Source:** Master Section 2.2, 2.11; Baseline Verification DISC-07; Analysis Section 15.5, 16.4.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Self-hosted WebRTC signaling service container deployed alongside NestJS.
  - Option B: Integration with an open-source remote assistance tool (e.g., RustDesk / Apache Guacamole).
  - Option C: Session bridge broker generating external secure session redirect URLs.
- **Chosen Option:** No option approved. (Carried forward unresolved; requires human stakeholder sign-off).
- **Reason:** Master Section 2.2 and 2.11 mandate provider abstraction and strict zero-credential rules, but leave the underlying technical protocol unspecified.
- **Security Impact:** Critical security boundary; must prevent unauthorized endpoint takeover and session interception.
- **Privacy Impact:** Ensures customer consent handshakes cannot be bypassed.
- **Tenant-Isolation Impact:** Session tokens must be strictly tenant-bounded.
- **Database Impact:** Stores session connection metadata in `remote_support_sessions`.
- **API Impact:** Shapes the `RemoteSupportProvider` adapter implementation.
- **Provider Impact:** Determines external infrastructure requirements (e.g., TURN/STUN servers).
- **Human Approval:** REQUIRED
- **Date:** 2026-09-04

---

### ADR-0049 — PaymentProvider MVP Scope (Invoices vs Subscriptions)
- **Decision:** Determine whether MVP Phase 4 requires one-time invoice payments, automated recurring contract subscriptions, or both via Dodo Payments.
- **Status:** `HUMAN DECISION REQUIRED`
- **Source:** Master Section 2.2, 5.6, Phase 4; Baseline Verification DISC-09; Analysis Section 15.6, 16.5.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: One-time invoice settlement via hosted payment links only for MVP Phase 4.
  - Option B: Automated recurring subscription billing and customer portal integration in Phase 4.
  - Option C: Both one-time invoice checkout and automated contract subscriptions in Phase 4.
- **Chosen Option:** No option approved. (Carried forward unresolved; requires human stakeholder sign-off).
- **Reason:** Master Section 2.2 locks Dodo Payments for Phase 4 but does not define the required commercial transaction complexity.
- **Security Impact:** Influences webhook handling and subscription cancellation authorization.
- **Privacy Impact:** Customer billing profile tokenization.
- **Tenant-Isolation Impact:** Subscriptions and invoices must strictly bind to tenant organizations.
- **Database Impact:** Determines whether subscription lifecycle columns are needed on `contracts`.
- **API Impact:** Shapes `/api/v1/contracts` and checkout endpoints.
- **Provider Impact:** Dictates Dodo Payments API feature integration scope.
- **Human Approval:** REQUIRED
- **Date:** 2026-09-04

---

### ADR-0050 — MapsProvider Default Zero-Cost Backend Selection
- **Decision:** Select the default zero-cost geocoding and location-matching provider implementation backing `MapsProvider`.
- **Status:** `HUMAN DECISION REQUIRED`
- **Source:** Master Section 2.2; Baseline Verification DISC-08; Analysis Section 15.7, 16.6.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: OpenStreetMap / Nominatim / Leaflet (Zero-cost open-source baseline).
  - Option B: Google Maps Platform (Requires paid credit card / free tier limits).
  - Option C: Mapbox (Requires paid tier / token management).
- **Chosen Option:** No option approved. (Carried forward unresolved; requires human stakeholder sign-off).
- **Reason:** Master Section 2.2 specifies `MapsProvider` among mandatory abstractions, but leaves the default provider backend unspecified.
- **Security Impact:** Protects third-party API keys from exposure.
- **Privacy Impact:** Customer service location addresses sent to external geocoders.
- **Tenant-Isolation Impact:** Geocoding caches must partition data cleanly.
- **Database Impact:** Supplies coordinate data for `organization_locations`.
- **API Impact:** Powers technician candidate distance calculations.
- **Provider Impact:** Dictates initial adapter implementation for `MapsProvider`.
- **Human Approval:** REQUIRED
- **Date:** 2026-09-04

---

### ADR-0051 — Approved Initial Low-Cost Hosting Platform Selection
- **Decision:** Select the specific low-cost/free-tier hosting platform for deploying the NestJS API container and PostgreSQL database in Phase 9.
- **Status:** `HUMAN DECISION REQUIRED`
- **Source:** Master Section 1.1, 1.3, 2.2, Phase 9; Analysis Section 16.8.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Render / Railway / Fly.io container platforms.
  - Option B: Low-cost cloud virtual private server (e.g., Hetzner / DigitalOcean VPS).
  - Option C: AWS / GCP free-tier container services.
- **Chosen Option:** No option approved. (Carried forward unresolved; requires human stakeholder sign-off).
- **Reason:** Master Section 2.2 specifies "Provider-independent / approved low-cost environment" without selecting a specific vendor.
- **Security Impact:** Ingress firewall, TLS certificate provisioning, and container isolation.
- **Privacy Impact:** Datacenter jurisdictional location must align with privacy requirements (GDPR).
- **Tenant-Isolation Impact:** None directly.
- **Database Impact:** Determines managed PostgreSQL vs containerized PostgreSQL in early phases.
- **API Impact:** Base domain and reverse proxy configuration.
- **Provider Impact:** Governs deployment scripts in `infrastructure/provisioning/`.
- **Human Approval:** REQUIRED
- **Date:** 2026-09-04

---

## 9. Explicit Architectural Exclusions (Group G)

### ADR-0052 — Exclusion of Kubernetes in Initial MVP Architecture
- **Decision:** Explicitly prohibit the introduction of Kubernetes (K8s) in the initial MVP deployment architecture.
- **Status:** `MASTER-LOCKED`
- **Source:** Master Section 1.6, 2.17; Audit Section 8, 29; Analysis Section 1.1, 11.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Deploy MVP onto managed Kubernetes (EKS/GKE/K3s).
  - Option B: Exclude Kubernetes, deploying via single container / Docker Compose (Master baseline).
- **Chosen Option:** Option B: Complete exclusion of Kubernetes for initial MVP.
- **Reason:** Explicitly listed under Master Section 1.6 (Won't-Have in Initial MVP) and Section 2.17: "Do not introduce Kubernetes, sharding, service mesh or microservices without demonstrated need."
- **Security Impact:** Reduces cluster misconfiguration vulnerabilities and operational attack surface.
- **Privacy Impact:** None.
- **Tenant-Isolation Impact:** None.
- **Database Impact:** None.
- **API Impact:** None.
- **Provider Impact:** Preserves zero-cost deployment feasibility.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0053 — Exclusion of Multi-Region Active-Active Topologies
- **Decision:** Prohibit premature multi-region active-active database and application deployments for the MVP.
- **Status:** `MASTER-LOCKED`
- **Source:** Master Section 1.6, 2.17; Audit Section 8, 29; Analysis Section 1.1, 11.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Multi-region active-active replication with distributed consensus.
  - Option B: Single region / single server progression path (Master baseline).
- **Chosen Option:** Option B: Single region architecture; multi-region deferred.
- **Reason:** Mandated by Master Section 2.17 scaling progression: "Multi-region only if justified."
- **Security Impact:** Eliminates cross-region key distribution vulnerabilities.
- **Privacy Impact:** Simplifies cross-border data transfer compliance.
- **Tenant-Isolation Impact:** Avoids multi-region distributed split-brain tenant data states.
- **Database Impact:** Avoids multi-master conflict resolution complexity.
- **API Impact:** Deterministic single-region latency.
- **Provider Impact:** Avoids expensive cross-region egress fees.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0054 — Exclusion of Complex Service Mesh in Initial MVP
- **Decision:** Prohibit the deployment of service meshes (e.g., Istio, Linkerd, Consul) in the initial architecture.
- **Status:** `MASTER-LOCKED`
- **Source:** Master Section 1.6, 2.17; Audit Section 8, 29; Analysis Section 1.1, 11.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Sidecar proxy service mesh across microservices.
  - Option B: Complete exclusion of service mesh (Master baseline).
- **Chosen Option:** Option B: Exclusion of service mesh.
- **Reason:** Explicitly prohibited by Master Section 1.6 and 2.17.
- **Security Impact:** In-process communication has no sidecar proxy attack surface.
- **Privacy Impact:** Eliminates sidecar log eavesdropping risks.
- **Tenant-Isolation Impact:** None.
- **Database Impact:** None.
- **API Impact:** None.
- **Provider Impact:** Reduces infrastructure complexity and cost to near zero.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0055 — Exclusion of Multiple Independent Databases in MVP
- **Decision:** Prohibit the introduction of multiple independent, polyglot production databases for different business domains in the MVP.
- **Status:** `MASTER-LOCKED`
- **Source:** Master Section 1.6, 2.2, 2.5; Audit Section 8, 14.1; Analysis Section 1.9, 11.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Database-per-module (e.g., separate DBs for Auth, Tickets, Billing).
  - Option B: Single authoritative PostgreSQL datastore for all domains (Master baseline).
- **Chosen Option:** Option B: Single authoritative PostgreSQL database.
- **Reason:** Mandated by Master Section 2.5 ("PostgreSQL is authoritative") and Section 2.17 anti-complexity rules.
- **Security Impact:** Centralized connection credentials and single backup perimeter.
- **Privacy Impact:** Global DSAR erasure and retention rules execute cleanly across all tables.
- **Tenant-Isolation Impact:** Guarantees foreign key integrity across tenant entities.
- **Database Impact:** Single connection pool, unified Prisma schema.
- **API Impact:** Enables atomic multi-record business transactions.
- **Provider Impact:** Eliminates polyglot database hosting fees.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0056 — Exclusion of Unjustified Paid Enterprise Cloud Tiers
- **Decision:** Prohibit upfront commitments to paid enterprise infrastructure tiers prior to revenue or workload justification.
- **Status:** `MASTER-LOCKED`
- **Source:** Master Section 1.1, 1.3, 1.6, 2.2, 2.17; Audit Section 8, 29; Analysis Section 1.2.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Provision paid enterprise AWS/GCP services upfront (prohibited by Master).
  - Option B: Deploy exclusively to zero/minimal-cost infrastructure in MVP (Master baseline).
- **Chosen Option:** Option B: Zero/minimal-cost baseline architecture.
- **Reason:** Core economic principle in Master Section 1.1 and 2.2: "Architecture is intentionally designed so that lack of initial capital does not force a later rewrite."
- **Security Impact:** Zero-cost tiers must still maintain strict TLS, encryption at rest, and secret isolation.
- **Privacy Impact:** Zero-cost tiers must comply with data location and privacy requirements.
- **Tenant-Isolation Impact:** Enforced in code/database, independent of cloud tier.
- **Database Impact:** Leverages low-cost / open-source PostgreSQL.
- **API Impact:** None.
- **Provider Impact:** Relies on provider free tiers (Cloudflare R2, Resend free tier).
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

## 10. Architecture Governance Rules (Group H)

### ADR-0057 — Master Specification as Sole Requirements Authority
- **Decision:** Establish `docs/MASTER-SPEC-001-002.md` as the single, supreme requirements authority across all engineering phases.
- **Status:** `MASTER-LOCKED`
- **Source:** Master Preamble (Lines 1–6); Baseline Audit Section 1; Analysis Section 1.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Re-introduce legacy specifications (M1–M29 artifacts).
  - Option B: Allow engineering contractors to extrapolate external industry standards.
  - Option C: `MASTER-SPEC-001-002.md` is the sole authoritative source (Master baseline).
- **Chosen Option:** Option C: Master is the sole requirements authority.
- **Reason:** Mandated by Master preamble: "Single contractor-ready master specification combining SPEC-001 and SPEC-002."
- **Security Impact:** Ensures security requirements trace directly to formal threat models.
- **Privacy Impact:** Aligns privacy scope strictly with locked business boundaries.
- **Tenant-Isolation Impact:** Prevents dilution of tenancy rules.
- **Database Impact:** All entities and constraints derive from Master text.
- **API Impact:** Endpoints conform to Master contracts.
- **Provider Impact:** Governed by Master provider abstractions.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0058 — Architecture Analysis Subordination to Master Spec
- **Decision:** Mandate that architectural analyses, designs, and ADRs are subordinate to the Master and can never override or alter Master requirements.
- **Status:** `MASTER-LOCKED`
- **Source:** Baseline Audit Section 1; Verification Section 1; Red-Team Corrected Section 1.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Allow architecture documents to update or patch Master specifications.
  - Option B: Maintain absolute subordination of derived documents to Master text (Master baseline).
- **Chosen Option:** Option B: Derived documents are strictly subordinate to the Master.
- **Reason:** Baseline integrity rule. Derived documents extract and organize; they never mutate authoritative requirements.
- **Security Impact:** Prevents silent weakening of Master security requirements.
- **Privacy Impact:** Protects privacy mandates from architectural compromise.
- **Tenant-Isolation Impact:** Keeps multi-tenancy requirements locked.
- **Database Impact:** None.
- **API Impact:** None.
- **Provider Impact:** None.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0059 — Inferences Are Non-Authoritative Specifications
- **Decision:** Establish that architectural inferences (e.g., entity foreign key links) are non-authoritative working hypotheses, not locked Master specifications.
- **Status:** `MASTER-LOCKED`
- **Source:** Baseline Verification Section 1, 7; Analysis Section 18; Red-Team Corrected Section 2.1.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Treat logical inferences as locked requirements.
  - Option B: Mark and track all inferences as non-authoritative working assumptions (Master baseline).
- **Chosen Option:** Option B: Inferences are explicitly tracked and non-authoritative.
- **Reason:** Baseline verification established that unwritten fields and relationships must not be treated as locked requirements prior to schema elaboration.
- **Security Impact:** Prevents unvetted inferred links from bypassing security boundaries.
- **Privacy Impact:** Requires validation of inferred data relationships against privacy policy.
- **Tenant-Isolation Impact:** Inferred relationships must still enforce `organization_id` scoping.
- **Database Impact:** Reminds engineers that inferred schemas require review before database migration locking.
- **API Impact:** None.
- **Provider Impact:** None.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0060 — Architectural Proposals Require Stakeholder Approval
- **Decision:** Mandate that all architectural proposals remain pending and cannot be treated as approved decisions without explicit human stakeholder authorization.
- **Status:** `MASTER-LOCKED`
- **Source:** Baseline Verification Section 8; Analysis Section 13, 16; Red-Team Corrected Section 1.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Autonomous AI self-approval of architectural proposals.
  - Option B: Mandatory human stakeholder review and approval for all proposals (Master baseline).
- **Chosen Option:** Option B: Architectural proposals require explicit stakeholder approval.
- **Reason:** Core AI-first pair programming governance principle.
- **Security Impact:** Stakeholders retain ultimate authority over threat mitigations.
- **Privacy Impact:** Ensures legal review of privacy and data retention strategies.
- **Tenant-Isolation Impact:** None.
- **Database Impact:** Schema designs must be formally approved before migration creation.
- **API Impact:** Endpoint contracts must be approved before implementation.
- **Provider Impact:** External provider selections require stakeholder sign-off.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0061 — Mandatory Human Sign-Off for Material System Choices
- **Decision:** Establish the mandatory governance requirement that all material system choices not locked by the Master specification (specifically ADR-0044 through ADR-0051) require explicit human stakeholder sign-off prior to implementation. This decision establishes the approval requirement itself; it does NOT approve or resolve any of ADR-0044 through ADR-0051.
- **Status:** `MASTER-LOCKED`
- **Source:** Master Section 1.1, 2.2, 2.12; Analysis Section 16; Red-Team Corrected Section 5.1.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Engineers unilaterally make material product, security, and provider choices.
  - Option B: Enforce mandatory human stakeholder sign-off for all material decisions prior to implementation (Master baseline governance).
- **Chosen Option:** Option B: Mandatory human sign-off requirement for all 8 material decisions (ADR-0044 to ADR-0051). (Note: Establishing this governance rule does NOT approve or select any option for ADR-0044 through ADR-0051; all 8 material decisions remain strictly unapproved pending stakeholder sign-off).
- **Reason:** Prevents unauthorized scope expansion, unvetted provider lock-in, and budget inflation. Ensures that human stakeholders retain ultimate authority over material tradeoffs.
- **Security Impact:** Retains human accountability for security and remote support protocols.
- **Privacy Impact:** Ensures jurisdictional legal counsel reviews privacy policies.
- **Tenant-Isolation Impact:** None.
- **Database Impact:** Governs database schema elaboration.
- **API Impact:** Governs API scope.
- **Provider Impact:** Governs commercial agreements with providers (Dodo Payments, Maps).
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0062 — Prohibition of Code Implementation from Unapproved Proposals
- **Decision:** Strictly forbid writing application code, database migrations, or Prisma models against unapproved architectural proposals or unresolved human decisions.
- **Status:** `MASTER-LOCKED`
- **Source:** Baseline Audit Section 1; Red-Team Corrected Section 1; User Directives.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Begin speculative prototyping before proposal approval.
  - Option B: Absolute freeze on application code until architecture decisions are formally locked (Master baseline).
- **Chosen Option:** Option B: Absolute prohibition of premature code implementation.
- **Reason:** Prevents technical debt, rework, and architectural divergence.
- **Security Impact:** Prevents insecure prototype code from reaching repositories.
- **Privacy Impact:** Prevents premature data persistence without approved retention rules.
- **Tenant-Isolation Impact:** Ensures tenancy middleware is formally designed before queries are written.
- **Database Impact:** Zero database migrations or schemas generated during this phase.
- **API Impact:** Zero controller or service implementations created.
- **Provider Impact:** Zero external SDK integrations implemented.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0063 — Prohibition of Silent Ambiguity Resolution
- **Decision:** Strictly prohibit silent resolution of ambiguities, contradictions, or gaps in the Master specification by AI or engineering agents.
- **Status:** `MASTER-LOCKED`
- **Source:** Baseline Audit Section 30; Baseline Verification Section 5; Analysis Section 15.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Silently resolve contradictions based on technical convenience.
  - Option B: Document, carry forward, and flag every ambiguity for stakeholder resolution (Master baseline).
- **Chosen Option:** Option B: Transparent carriage of all Master ambiguities.
- **Reason:** Preserves architectural honesty and stakeholder visibility over business tradeoffs.
- **Security Impact:** Prevents security holes caused by unvetted assumptions.
- **Privacy Impact:** Prevents regulatory non-compliance from unilateral privacy interpretations.
- **Tenant-Isolation Impact:** None.
- **Database Impact:** None.
- **API Impact:** None.
- **Provider Impact:** None.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

### ADR-0064 — Absolute Ban on Hallucinated Entities and Schemas
- **Decision:** Strictly ban the creation, addition, or invention of database entities, columns, relationships, or business rules not grounded in the Master specification.
- **Status:** `MASTER-LOCKED`
- **Source:** Master Section 2.5; Baseline Verification Section 4; Red-Team Corrected Section 2.
- **Requirement IDs:** Requirement ID: NOT YET ASSIGNED
- **Options Considered:**
  - Option A: Allow AI agents to add convenient entity tables and columns during design.
  - Option B: Strictly enforce the 40-entity boundary and prohibit ungrounded schema invention (Master baseline).
- **Chosen Option:** Option B: Absolute ban on invented entities and schemas.
- **Reason:** Preserves strict Master alignment and eliminates scope creep.
- **Security Impact:** Enforces an auditable, bounded entity inventory.
- **Privacy Impact:** Guarantees complete data classification visibility.
- **Tenant-Isolation Impact:** Ensures every entity is formally evaluated for tenant scoping.
- **Database Impact:** PostgreSQL datastore contains strictly authorized models.
- **API Impact:** Prevents unauthorized endpoint bloat.
- **Provider Impact:** None.
- **Human Approval:** NOT REQUIRED
- **Date:** 2026-09-04

---

## 11. Quality Control & Self-Audit Report

The decision register was subjected to a strict ten-point quality control self-audit against all baseline documents:

| # | Self-Audit Verification Question | Audit Result | Evidence & Compliance Notes |
|---|---|---|---|
| 1 | Are all Master-locked technologies correctly classified? | `PASS` | All locked technologies (Next.js, NestJS, PostgreSQL, Prisma, Redis, Docker, OpenAPI) are classified as `MASTER-LOCKED` (ADR-0001 to ADR-0007, 0009, 0010). |
| 2 | Are candidate technologies clearly marked as non-locked? | `PASS` | `BullMQ`, `Zod`, `JWT`, `Argon2id/bcrypt`, and `Caddy` are explicitly classified as `ARCHITECTURAL PROPOSAL` or non-locked options within constrained decisions (ADR-0019, 0027, 0028, 0029). |
| 3 | Are all 8 human decisions preserved? | `PASS` | All 8 material decisions from Analysis Section 16 are registered under Group F (ADR-0044 through ADR-0051) with status `HUMAN DECISION REQUIRED` and Chosen Option: *"No option approved."* |
| 4 | Are all 40 entities preserved? | `PASS` | ADR-0031 strictly locks the 40-entity inventory; zero entities added or removed. |
| 5 | Did any inferred relationship become a confirmed relationship? | `PASS` | ADR-0036 and ADR-0059 explicitly mandate that inferences remain non-authoritative working hypotheses. All 20 entries remain tagged `[INFERRED]`. |
| 6 | Did any proposal become an approval without human approval? | `PASS` | All proposals (ADR-0019, 0032, 0036) are classified as `ARCHITECTURAL PROPOSAL` with Chosen Option: *"Proposed, pending approval."* and Human Approval: `PENDING`. |
| 7 | Did any Master ambiguity get silently resolved? | `PASS` | All 7 Master ambiguities are carried forward verbatim in ADR-0044 through ADR-0050. Zero ambiguities were resolved. The distinction between the 7 Master ambiguities and the 8 Material Human Decisions is strictly maintained. |
| 8 | Did any provider become mandatory where the Master requires independence? | `PASS` | All 6 providers (`StorageProvider`, `EmailProvider`, `NotificationProvider`, `PaymentProvider`, `RemoteSupportProvider`, `MapsProvider`) are locked as abstract interfaces in ADR-0012 to ADR-0017. |
| 9 | Did the architecture remain a modular monolith? | `PASS` | ADR-0001, ADR-0008, and ADR-0052 to ADR-0055 strictly enforce a single deployable modular monolith in a single container, prohibiting microservices. |
| 10 | Did any implementation work occur? | `PASS` | Zero application code, zero Prisma models, zero database migrations, zero DTOs, and zero controller files were created. |

---

## FINAL STATUS

```text
MASTER CHANGED: NO
BASELINE AUDIT CHANGED: NO
BASELINE VERIFICATION CHANGED: NO
ARCHITECTURE ANALYSIS CHANGED: NO
RED-TEAM CORRECTED REPORT CHANGED: NO
DECISION REGISTER CORRECTED: YES
CODE CHANGED: NO
SCHEMA CHANGED: NO
MIGRATIONS CREATED: NO

MASTER-LOCKED DECISIONS: 46
MASTER-CONSTRAINED DECISIONS: 7
ARCHITECTURAL PROPOSALS PENDING: 3
HUMAN DECISIONS PENDING: 8
UNRESOLVED MASTER AMBIGUITIES: 7
TOTAL ADRs: 64

STATUS: PASS WITH CORRECTIONS
```
