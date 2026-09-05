---
name: ponytail
description: Enforces the Ponytail anti-overengineering Decision Ladder (v4.9.0) for code reviews and architectural planning, subordinated strictly to REMOTFIX Master Specifications and ADRs.
---

# Ponytail Skill (v4.9.0)

This skill provides on-demand evaluation of proposed implementations against the 7-step Decision Ladder to eliminate accidental complexity and overengineering.

## Invocation Modes

- `/ponytail lite`: Evaluates functions, methods, or single files for unnecessary abstractions or redundant libraries.
- `/ponytail full`: Evaluates entire features, modules, or pull requests for YAGNI violations, dependency bloat, and architectural excess.
- `/ponytail ultra`: Deep line-by-line review challenging every line of non-stdlib code and identifying opportunities for native platform simplification.

---

## The Decision Ladder

Evaluate proposed changes in strict sequential order:

1. **Step 1 — Do Nothing (YAGNI):** Is this code required by `MASTER-SPEC-001-002.md` or an approved ADR? If not, delete or omit it.
2. **Step 2 — Codebase Reuse:** Does an existing module, service, or helper already provide this?
3. **Step 3 — Standard Library:** Can modern Node.js / TypeScript stdlib solve this without dependencies?
4. **Step 4 — Platform / Framework:** Does Next.js, NestJS, or PostgreSQL natively support this feature?
5. **Step 5 — Existing Dependencies:** Can currently installed packages solve this?
6. **Step 6 — One-Liner / Simple Function:** Can this be solved directly without multi-layered abstractions?
7. **Step 7 — Minimal Custom Code:** If bespoke code is required, keep it minimal, direct, and explicit.

---

## Non-Negotiable Boundaries (Remotfix Specific)

The following core Master requirements must **NEVER** be stripped or reduced under the guise of simplification:

- Multi-tenant tenant isolation (`organization_id` checks on every query/command).
- Immutable audit event generation (`audit_events` logged for all critical state changes).
- Role-based authorization and session consent checks.
- Server-side validation via schemas (e.g., Zod / class-validator).
- ISO 27001 / ISO 27701 compliance controls.
