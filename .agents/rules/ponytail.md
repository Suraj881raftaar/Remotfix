# Ponytail Anti-Overengineering Rule (v4.9.0)

## Authority & Subordination Hierarchy

This rule implements the Ponytail anti-overengineering discipline (v4.9.0) adapted for the REMOTFIX project.
The authority hierarchy in this project is absolute:

```
1. docs/MASTER-SPEC-001-002.md (Supreme Specification)
        ↓
2. APPROVED MASTER ARCHITECTURE / ADRs (ADR-0001 to ADR-0064)
        ↓
3. EXISTING REPOSITORY FILES (README.md, .vscode/settings.json)
        ↓
4. APPROVED IMPLEMENTATION PLAN (implementation_plan.md)
        ↓
5. TOOL-SPECIFIC CONFIGURATION & RULES (Ponytail, Context7)
```

**Non-Negotiable Constraint:**
Ponytail is strictly subordinated to `docs/MASTER-SPEC-001-002.md` and approved ADRs. Under NO circumstances may Ponytail's simplification rules be used to strip, weaken, bypass, or defer:
- Multi-tenancy isolation (`organization_id` partitioning across all queries and commands).
- Immutable audit logging (`audit_events` recording with actor, IP, timestamp, and tamper resistance).
- Server-side authorization and validation checks.
- Session lifecycle controls, technician authentication, and explicit customer consent gates.
- ISO 27001 / ISO 27701 governance, privacy, and encryption controls.

---

## The 7-Step Decision Ladder

When implementing any feature, bugfix, or refactoring in REMOTFIX, evaluate solutions through the 7-Step Decision Ladder in strict order (1 through 7):

1. **Step 1 — Do Nothing (YAGNI):**
   - Question every proposed abstraction, speculative generic utility, or prospective feature.
   - If a requirement is not locked in `MASTER-SPEC-001-002.md` or an approved ADR, do NOT build it.

2. **Step 2 — Use Existing Codebase Patterns:**
   - Search the existing codebase before writing new functions or utilities.
   - Reuse approved patterns, shared modules, and existing domain contracts.

3. **Step 3 — Use Standard Library Features:**
   - Prefer native modern TypeScript / Node.js 20+ / Web standard APIs over external packages or bespoke utilities:
     - Use `structuredClone()` instead of custom cloning or lodash.
     - Use native `fetch` over axios.
     - Use native `crypto.randomUUID()` over `uuid`.
     - Use native `Intl` over moment/date-fns where applicable.

4. **Step 4 — Use Platform & Framework Features:**
   - Leverage built-in capabilities of locked technologies:
     - Next.js: Server Components, Server Actions, route handlers, middleware.
     - NestJS: Built-in interceptors, pipes, guards, exception filters.
     - PostgreSQL / Prisma: Database constraints, foreign keys, transactions.

5. **Step 5 — Use Existing Approved Dependencies:**
   - Check already installed dependencies before proposing or adding any new library.
   - Do NOT add redundant dependencies for tasks solvable with existing libraries.

6. **Step 6 — Write a Minimal Function / One-Liner:**
   - Keep functions focused and concise.
   - Avoid premature factories, generic wrappers, multi-layer visitor patterns, or deep inheritance hierarchies.

7. **Step 7 — Write Minimal Bespoke Code:**
   - When custom multi-file logic is genuinely required by the Master Specification, write the cleanest, most direct implementation possible.
   - Document the exact requirement justification.

---

## Anti-Patterns to Reject

- **Speculative Generality:** Writing generic plugin systems, dynamic schema builders, or universal connectors when a direct, strongly-typed implementation is specified.
- **Premature Micro-Optimization:** Adding complex caching or custom memory pooling before baseline correctness and profiling justify it.
- **Over-Abstraction:** Creating interfaces with only one implementation unless explicitly mandated by ADR (e.g. `PaymentProvider`, `NotificationProvider`).
- **Fake Simplification:** Removing required security checks, error boundaries, or audit events to make code "shorter" or "simpler". Security is non-negotiable.
