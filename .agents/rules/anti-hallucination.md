# Antigravity Anti-Hallucination & Verification Rule

## Scope & Purpose

This rule establishes the permanent, non-negotiable operational discipline for Antigravity AI agents working on the REMOTFIX codebase.
Its primary directive is the absolute prevention of hallucinations, ungrounded assumptions, premature claims of completion, and unauthorized code generation.

---

## The Ground Truth & Authority Hierarchy

All knowledge, reasoning, and implementation decisions must follow this strict hierarchical order of precedence:

```
1. docs/MASTER-SPEC-001-002.md (Supreme Specification)
        ↓
2. APPROVED ADRs (ADR-0001 to ADR-0064) & EXPLICIT HUMAN DECISIONS
        ↓
3. ACTUAL GIT REPOSITORY / SOURCE CODE (Current disk state)
        ↓
4. TESTS / RUNTIME EXECUTION EVIDENCE (Direct test runner output)
        ↓
5. CODEBASE MEMORY MCP (Derived graph index — secondary index only)
        ↓
6. EXTERNAL TOOLS & OFFICIAL DOCUMENTATION (Context7, library docs)
        ↓
7. AI INFERENCE / MODEL GENERATION (Lowest authority — never overrides above)
```

- **Derived Knowledge Warning:** Codebase Memory MCP is an index derived from repository snapshots. It is **never** the ground truth. When any discrepancy exists between Codebase Memory and the physical repository, the physical repository and Master Spec govern unconditionally.
- **AI Inference Restriction:** Model assumptions or completions must never override written specs, existing code, or actual test results.

---

## The 12 Non-Negotiable Rules

### 1. Hierarchy Governs All Decisions
Master Spec > approved ADRs/human decisions > actual Git/source > tests/evidence > Codebase Memory > other tools > AI inference. When sources conflict, the higher authority in the hierarchy strictly invalidates the lower.

### 2. Search Existing Codebase First
Before designing or implementing any change, always search the existing codebase. Inspect existing directory layouts, conventions, patterns, and shared packages to avoid duplicate implementations or conflicting patterns.

### 3. Use Codebase Memory MCP for Structural Understanding
Use Codebase Memory MCP (`search_code`, `query_graph`, `search_graph`, `trace_path`, `get_architecture`) to understand existing files, functions, routes, services, data models, call graphs, and module dependencies across the workspace before touching code.

### 4. Verify Codebase Memory Results Against Actual Repository
Always verify critical findings from Codebase Memory (such as file paths, exported symbol signatures, route handlers, schema fields) by inspecting the actual physical files on disk. Never rely blindly on an index that may be stale or partial.

### 5. Zero Inventions
Never invent files, directory paths, APIs, services, database tables, schema columns, dependencies, architectural patterns, or prior work. If a file or function does not exist in the repository or Master Spec, do not act as if it does.

### 6. The "UNVERIFIED" Protocol
If any fact, API, parameter, contract, schema definition, or prior state cannot be verified directly against the Master Spec, ADRs, or the actual codebase, explicitly state:
> **"UNVERIFIED: [Item]"**
Then investigate and verify via filesystem search, git inspection, or documentation before proceeding.

### 7. Stop and Ask on Ambiguity or Conflict
If requirements, security boundaries, tenant isolation (`organization_id`), ADR alignments, or architectural decisions are ambiguous, contradictory, or unspecified: **STOP and ask the user for clarification**. Do not guess or proceed with speculative assumptions.

### 8. Strict Status Discipline
Never treat or report a feature as "tested", "verified", "UAT approved", or "production released" simply because code was written ("implemented"):
- **Implemented** = code was written on disk.
- **Tested** = automated tests or scripts were physically executed and passed with logged output.
- **Verified** = verified against acceptance criteria and specifications with verifiable evidence.
- **UAT Approved** = explicit human sign-off received.
- **Production Released** = deployed and operational in production.

### 9. Smallest Authorized Change & Anti-Overengineering
Make only the smallest change necessary to satisfy the approved requirement.
- Strictly follow the Ponytail Anti-Overengineering Decision Ladder (`.agents/rules/ponytail.md`).
- Do NOT add speculative features, unused generic abstractions, unsolicited refactorings, or unrelated cleanup.

### 10. Zero Credential & Secret Exposure
Never print, expose, log, commit, or mock secrets, private tokens, API keys, certificates, or database credentials. Never invent dummy credentials that resemble production secrets or overwrite existing environment configurations.

### 11. Refresh Codebase Memory on Significant Changes
After completing significant code changes (new modules, deleted files, major refactors, or completed milestone phases), trigger a refresh/re-index of Codebase Memory (`index_repository` or `detect_changes`) so the graph database does not become stale for subsequent tasks.

### 12. Evidence-Based Milestone Completion
Before declaring any milestone or phase complete:
1. Run all required automated verification suites (e.g., unit/integration tests, security checks, `pnpm turbo run typecheck`, `pnpm turbo run build`).
2. Record and report actual stdout/stderr test outputs and exact pass/fail counts.
3. Report only physical, verifiable evidence. Never extrapolate test results.

---

## Tool Roles & Boundaries

| Tool | Dedicated Role & Boundary |
|---|---|
| **Codebase Memory MCP** | Primary tool to explore and understand the Remotfix codebase structure, routes, services, models, and call graphs. Derived index — verify against disk. |
| **Context7 MCP** | Primary tool for querying official, version-accurate public library and framework documentation. Subject to `.agents/rules/context7.md` security and prompt-injection boundaries. |
| **Sequential Thinking MCP** | Tool for deep reasoning, architectural trade-off evaluations, complex multi-step planning, and edge-case analysis. |
| **Ponytail Rule / Skill** | Anti-overengineering decision ladder (v4.9.0). Enforces YAGNI and minimalist code while strictly preserving multi-tenancy, security, and audit invariants. |
| **Playwright / Chrome DevTools** | Real browser interaction, DOM inspection, network monitoring, and end-to-end user-flow validation. |
| **21st / Taste / shadcn / Vercel** | UI component discovery, accessible design system implementation, typography, styling, and modern frontend visual standards. |
| **Git** | Ground truth for commit history, provenance, author attribution, stashes, branch tracking, and file status. |

---

## FINAL RULE

> **DO NOT GUESS.**
>
> **SEARCH → VERIFY → IMPLEMENT → TEST → REPORT.**
>
> **If still uncertain: STOP and ask.**
