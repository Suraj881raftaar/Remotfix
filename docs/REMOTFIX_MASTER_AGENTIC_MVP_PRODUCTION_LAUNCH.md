# REMOTFIX — MASTER AGENTIC MVP BUILD & PRODUCTION LAUNCH INSTRUCTION

**Repository:** `C:\SURAJ\Remotfix`  
**GitHub:** `https://github.com/Suraj881raftaar/Remotfix.git`  
**Production domain:** `https://remotfix.in`

## Mission

Build and ship the smallest secure REMOTFIX MVP that proves the real business flow:

**Visitor → Services → Booking → Authentication → Booking created → persisted → Bookings tab → Booking detail → refresh → data remains**

Execution model:

**BUILD → VERIFY → COMMIT → PUSH → DEPLOY → CONNECT DOMAIN → VERIFY → LAUNCH**

Working product > unnecessary perfection. Security, tenant isolation, authorization, data integrity, privacy, and required audit controls are never sacrificed for speed.

---

## 1. Authority

Before changing code:

1. Read every `docs/MASTER-*.md`.
2. Master Specification is the requirements authority.
3. Corrected Master Architecture Decision Register is the architectural decision authority.
4. Respect MASTER-LOCKED and MASTER-CONSTRAINED decisions.
5. Do not implement HUMAN DECISION REQUIRED items without approval.
6. Never silently resolve ambiguities or conflicts.
7. Do not invent requirements or architecture.
8. **There are NO `ENTITY-*` documents. Do not create, reference, or assume them.**

If a change conflicts with Master/ADR requirements: **STOP and report.**

---

## 2. Approved Architecture

Respect the approved modular-monolith direction:

- Next.js
- NestJS
- PostgreSQL
- Prisma
- Redis-compatible queue/cache
- S3/R2-compatible storage abstraction
- Dodo Payments through `PaymentProvider`
- PostHog
- Sentry
- Resend
- GitHub
- pnpm
- Turborepo
- OpenAPI
- Docker

API base path: `/api/v1`

Repository structure:

```text
apps/web
apps/api
packages/ui
packages/config
packages/types
packages/validation
packages/telemetry
database/prisma
infrastructure
docs
tests
```

Do not introduce Kubernetes, microservices, service mesh, multi-region active-active, or multiple independent databases unless explicitly required.

---

## 3. Agentic Engineering Loop

For every milestone:

**DISCOVER → PLAN → IMPLEMENT → VERIFY → REVIEW → SHIP → REPORT**

### Discover

Inspect the actual:

- repository
- Git state
- source
- packages
- configuration
- environment
- Master documents
- ADRs
- tests

Never assume repository state.

### Plan

Identify:

- affected files
- dependencies
- security implications
- tests
- approval requirements

Keep plans small.

### Implement

Build the smallest complete solution. Avoid speculative abstractions.

### Verify

Run appropriate:

- lint
- typecheck
- unit/integration tests
- build
- security checks
- route checks
- accessibility checks
- SEO checks
- production configuration checks

### Review

Inspect for:

- tenant isolation failures
- authorization failures
- secrets
- privacy leaks
- data-integrity issues
- broken navigation
- broken API contracts
- SEO mistakes
- accidental indexing
- unnecessary complexity

### Ship

Before each commit:

```bash
git status
git diff
git diff --cached
```

Verify no secrets, credentials, private keys, accidental generated files, or unintended Master-document changes.

Then commit and push normally.

**Never force-push or rewrite shared history.**

### Report

Every milestone report must include:

- status
- tests executed
- files changed
- commit hash
- push status
- known limitations
- next milestone

Never claim deployed/tested/verified/indexed unless evidence exists.

---

## 4. Decision Ladder

Before adding complexity ask:

1. Is it required by Master?
2. Is it required for the current MVP journey?
3. Is there already an approved capability?
4. Can existing architecture solve it?
5. Can a smaller solution solve it?
6. Is the complexity justified?
7. Does it create a new dependency, service, security boundary, or architectural decision?

If not justified: **do not add it.**

Never use simplification to remove:

- `organization_id`
- tenant isolation
- server-side authorization
- authentication
- validation
- audit controls
- privacy controls
- security boundaries

---

## 5. Stop Conditions

STOP and report if:

- Master/ADR conflict exists
- tenant isolation is unclear
- authorization is unclear
- destructive DB operation is required
- production secrets are required
- a new paid service is required
- locked technology must change
- privacy/compliance interpretation is ambiguous
- payment behavior is unclear
- remote-support technology requires an unapproved decision
- DNS/hosting configuration is unknown
- required business behavior is undefined
- a security boundary is unclear

Never guess.

---

## 6. Environment Safety

Respect:

**LOCAL → TEST → STAGING → MVP PRODUCTION → FUNDED PRODUCTION**

Never mix environment secrets or databases.

Never commit:

- `.env`
- `.env.local`
- production credentials
- API keys
- DB passwords
- JWT secrets
- payment/webhook secrets
- OAuth secrets
- cloud credentials
- private certificates

Create/update `.gitignore` before meaningful commits.

---

# MILESTONES

## M0 — Git Baseline

Inspect:

- repository path
- Git installation
- Git status
- branch
- remotes
- files

Expected remote:

`https://github.com/Suraj881raftaar/Remotfix.git`

If Git is not initialized, initialize it.

If remote is missing, add it.

Do not overwrite an unrelated remote without reporting it.

Perform a secret audit. Create/update `.gitignore`. Inspect staged files. Create baseline commit. Push normally. Verify remote branch.

**STOP after successful baseline push.**

Report commit hash, branch, remote, push status, and files committed.

---

## M1 — Monorepo Foundation

Create the approved pnpm + Turborepo structure:

```text
apps/web
apps/api
packages/ui
packages/config
packages/types
packages/validation
packages/telemetry
database/prisma
infrastructure
tests
```

Verify install, workspace resolution, TypeScript, build, lint, and test infrastructure.

Commit and push.

---

## M2 — Application Shell

Build a usable responsive application shell:

- desktop navigation
- mobile navigation
- header
- active navigation state
- Dashboard
- Services
- Bookings
- Booking detail
- Profile/Settings where required
- loading states
- error states
- empty states
- 404

Tabs/navigation must actually work. No fake navigation or dead buttons.

Commit and push.

---

## M3 — Database Foundation

Implement PostgreSQL + Prisma according to Master requirements.

Create only minimum MVP models.

Every tenant-owned model must have strict organization ownership.

Run Prisma validation and safe migrations.

Never destroy existing data without explicit approval.

Test:

- migration
- connection
- persistence
- organization isolation

Commit and push.

---

## M4 — Authentication + Authorization

Implement secure MVP authentication.

Required:

- authentication
- authorization
- organization context
- roles
- protected routes
- server-side authorization
- tenant isolation

Never rely solely on client-side authorization.

Test:

- authorized access
- unauthorized rejection
- cross-tenant rejection

**Tenant isolation is NON-NEGOTIABLE.**

Commit and push.

---

## M5 — Booking Domain

Implement:

- create booking
- input validation
- persistence
- booking list
- booking detail
- booking status
- organization ownership
- authorization
- required auditability

API base path: `/api/v1`

Test valid/invalid input, missing fields, unauthorized access, cross-tenant access, persistence, retrieval, and status.

Commit and push.

---

## M6 — Booking UI

Connect the UI to the real API. Do not use fake/mock data for the final MVP flow.

User must be able to:

1. Browse service
2. Start booking
3. Enter required information
4. Submit
5. See success/error
6. See booking in Bookings
7. Open booking detail
8. See status
9. Refresh
10. Still see the booking

Handle loading, validation, API errors, empty, success, unauthorized, and forbidden states.

Commit and push.

---

## M7 — End-to-End MVP

Demonstrate the complete real flow:

```text
Visitor
↓
Service
↓
Booking
↓
Authentication
↓
Booking Created
↓
Database
↓
Bookings Tab
↓
Booking Detail
↓
Refresh
↓
Booking Still Exists
```

Then demonstrate cross-tenant rejection.

Record evidence.

---

## M8 — MVP Freeze

Once the core flow works:

**FREEZE feature scope.**

Do not add unrelated features. Move to launch preparation.

---

# PUBLIC WEBSITE + SEARCH

## M9 — Public Website

Create only useful public pages:

```text
/
 /services
 /services/[slug]
 /how-it-works
 /about
 /contact
 /privacy
 /terms
```

Do not create thin SEO pages.

Do not fabricate customers, reviews, ratings, certifications, awards, statistics, locations, pricing, or partnerships.

---

## M10 — SEO / AEO Foundation

Production canonical domain:

`https://remotfix.in`

Use centralized configuration:

`NEXT_PUBLIC_SITE_URL`

Production value:

`NEXT_PUBLIC_SITE_URL=https://remotfix.in`

Use Next.js Metadata API.

Every public indexable page should have:

- unique title
- useful description
- canonical URL
- Open Graph metadata
- meaningful H1
- logical heading hierarchy
- internal links
- useful factual content

Do not keyword-stuff or create SEO spam.

### Structured data

Use JSON-LD only where accurate and appropriate:

- Organization
- WebSite
- Service
- BreadcrumbList
- Article
- FAQPage only when genuinely applicable

Structured data must reflect visible content. Never fabricate claims, ratings, or reviews.

### Sitemap

Implement `app/sitemap.ts`.

Production:

`https://remotfix.in/sitemap.xml`

Include only canonical public indexable URLs.

Exclude:

- login/signup
- dashboard
- bookings
- booking IDs
- settings
- admin
- private content
- APIs
- tests
- duplicates

### Robots

Implement `app/robots.ts`.

Production robots must reference:

`Sitemap: https://remotfix.in/sitemap.xml`

Do not accidentally block `/`.

Robots is not access control.

Do not blindly block AI crawlers.

### Private indexing

Private application data must never become public search content.

Protect:

- customers
- bookings
- organizations
- technicians' private data
- private documents
- internal IDs
- private support sessions
- authenticated API data

Use authentication and appropriate `noindex` behavior.

### Canonical domain

Preferred production policy:

```text
http://remotfix.in
→ https://remotfix.in

http://www.remotfix.in
→ https://remotfix.in

https://www.remotfix.in
→ https://remotfix.in
```

Only implement redirects supported by the selected hosting/DNS configuration. Never invent DNS values.

### Open Graph / icons

Implement:

- title
- description
- canonical
- site name
- image
- locale where appropriate
- favicon
- app icons

Add a legitimate REMOTFIX social preview image.

### Web manifest

Add a proper manifest where appropriate:

- application name
- short name
- icons
- start URL
- display mode
- theme metadata

Do not claim PWA support unless it actually works.

### AI Search / AEO

Optimize for understandable, trustworthy information rather than a supposed magic AI-ranking mechanism.

Public content should clearly explain:

- what REMOTFIX is
- services
- who services are for
- booking process
- what happens after booking
- limitations
- supported regions if applicable
- customer expectations
- contact/help

Use descriptive headings, clear answers, semantic HTML, descriptive links, structured data where justified, strong internal linking, and factual content.

Do not create hundreds of AI-generated low-value pages.

Do not claim guaranteed Google or AI-search ranking.

### `llms.txt`

Optional only.

Do not treat it as a Google requirement or ranking mechanism. Add only if it provides genuine documentation/discoverability value.

---

## M11 — Security / Accessibility / Performance Verification

### Security

Verify:

- authentication
- authorization
- tenant isolation
- input validation
- secure errors
- secret handling
- API protection
- private route protection
- booking ownership
- cross-tenant rejection
- dependency vulnerabilities where practical

### Accessibility

Target WCAG 2.2 AA principles where practical:

- semantic HTML
- keyboard navigation
- visible focus
- form labels
- accessible buttons/navigation
- useful errors
- contrast
- meaningful link text
- screen-reader-friendly states

Do not claim certification.

### Performance

Keep public pages fast.

Prefer:

- server rendering where appropriate
- optimized images
- minimal JavaScript
- minimal client components
- lazy loading
- efficient fonts
- limited third-party scripts

Avoid unnecessary animations/dependencies.

### Error/system pages

Implement:

- 404
- global error boundary
- loading states
- API error handling
- empty states
- unauthorized
- forbidden

Never expose stack traces or internal infrastructure details.

### Health check

Implement an appropriate:

`/api/v1/health`

It must not expose secrets, credentials, internal topology, or sensitive infrastructure details.

### Observability

Prepare the approved telemetry architecture for:

- application errors
- API failures
- important booking events
- deployment health

Do not introduce unnecessary external services.

---

## M12 — Automated Verification

Create repeatable checks for:

```text
/
/services
/services/[slug]
/how-it-works
/about
/contact
/robots.txt
/sitemap.xml
```

Verify:

- expected HTTP status
- title
- description
- canonical
- robots behavior
- sitemap accessibility
- structured data where applicable
- internal links
- no accidental `noindex`

Also verify private routes remain protected and are absent from the sitemap.

Check public links for 404s, incorrect redirects, dead buttons, and orphan routes.

---

## M13 — Production Deployment

Target:

`https://remotfix.in`

Process:

1. Build application.
2. Verify build locally.
3. Deploy to approved production hosting.
4. Verify provider deployment URL.
5. Configure production environment variables.
6. Add `remotfix.in` to hosting.
7. Obtain exact DNS instructions from the hosting provider.
8. Present required DNS changes.
9. Do not invent DNS values.
10. User performs/approves DNS changes where required.
11. Verify DNS.
12. Verify HTTPS.
13. Verify canonical domain.
14. Verify redirects.
15. Verify application.
16. Verify booking flow.
17. Verify sitemap.
18. Verify robots.

If hosting provider or DNS values are unknown:

**STOP and report exactly what is missing.**

---

## M14 — Google Search Console

After the production domain works:

1. Configure Google Search Console.
2. Use a Domain property where appropriate.
3. Verify ownership using the appropriate DNS method.
4. Submit:

`https://remotfix.in/sitemap.xml`

5. Inspect the homepage and important public pages.
6. Request indexing where appropriate.
7. Record actual indexing/crawl evidence.

Do not claim indexing without evidence.

---

## M15 — Production Smoke Test

Run:

```text
Open https://remotfix.in
↓
Browse public service
↓
Start booking
↓
Authenticate
↓
Submit booking
↓
Booking saved
↓
Open Bookings
↓
Booking visible
↓
Open booking
↓
Booking detail visible
↓
Refresh
↓
Booking still exists
```

Then test:

```text
User A
↓
Organization A booking

User B / Organization B
↓
Attempt access
↓
MUST BE REJECTED
```

Record evidence.

---

## M16 — MVP Launch

The MVP is complete only when:

### Product

- [ ] Landing page
- [ ] Services
- [ ] Service detail
- [ ] Authentication
- [ ] Dashboard
- [ ] Working tabs/navigation
- [ ] Booking creation
- [ ] Booking persistence
- [ ] Bookings list
- [ ] Booking detail
- [ ] Booking status
- [ ] Refresh persistence
- [ ] Authorization
- [ ] Tenant isolation

### Security

- [ ] No secrets committed
- [ ] Server-side authorization
- [ ] Tenant isolation
- [ ] Input validation
- [ ] Private routes protected
- [ ] Private booking data protected
- [ ] Required auditability

### UX

- [ ] Responsive
- [ ] Mobile-friendly
- [ ] Loading/error/empty states
- [ ] 404
- [ ] Accessible forms
- [ ] Keyboard navigation

### SEO

- [ ] Metadata
- [ ] Canonicals
- [ ] Open Graph
- [ ] Favicon
- [ ] Manifest where applicable
- [ ] JSON-LD where appropriate
- [ ] Sitemap
- [ ] Robots
- [ ] Internal linking
- [ ] Public/private indexing policy
- [ ] SEO verification tests

### Production

- [ ] GitHub updated
- [ ] Production deployment successful
- [ ] HTTPS working
- [ ] `remotfix.in` connected
- [ ] Canonical domain working
- [ ] Redirects working
- [ ] Health check working
- [ ] Environments separated
- [ ] Production smoke test passed

### Search

- [ ] Google Search Console configured
- [ ] Sitemap submitted
- [ ] Important URLs inspected
- [ ] Actual indexing status recorded

---

## 7. Status Language

Use these statuses accurately:

**IMPLEMENTED** — code exists.

**TESTED** — automated/manual test passed.

**VERIFIED** — evidence confirms expected behavior.

**UAT APPROVED** — human acceptance completed.

**PRODUCTION RELEASED** — deployed to production and verified.

**INDEXED** — search-engine evidence confirms indexing.

Never substitute one status for another.

---

## 8. Git Commit Strategy

Prefer small coherent commits such as:

```text
chore: establish git baseline
feat: scaffold monorepo
feat: add application shell
feat: add database foundation
feat: add authentication
feat: add booking domain
feat: add booking ui
feat: add public website
feat: add seo foundation
test: add mvp verification
chore: prepare production deployment
chore: configure production domain
```

Use accurate conventional commits as appropriate.

Never force-push. Always verify before pushing.

---

## 9. Final Principle

The goal is NOT to build the biggest platform.

The goal is:

> **Build the smallest secure REMOTFIX product that proves the real business flow and can go online.**

Priority:

1. Security
2. Tenant isolation
3. Working booking flow
4. Usable application
5. Production deployment
6. SEO/search foundation
7. Real user feedback
8. Revenue
9. Hardening
10. Scaling

Do not prematurely optimize for enterprise scale.

Do not prematurely add expensive infrastructure.

Do not build features without demonstrated need.

**Build REMOTFIX.  
Ship REMOTFIX.  
Verify REMOTFIX.  
Then improve REMOTFIX.**
