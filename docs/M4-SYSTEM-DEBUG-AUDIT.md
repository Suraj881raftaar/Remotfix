# REMOTFIX M4.5 — SYSTEM-LABEL DEBUG AUDIT

## 1. Audit Metadata
- **Audit Type:** Hostile, Whole-Repository Forensic Code & Security Audit
- **Milestone Under Audit:** Milestone 4 (M4) — Authentication & Authorization Foundation
- **Target Repository:** `C:\SURAJ\Remotfix`
- **Baseline Git Commit:** `0325838fdedae396f301a17e15acc0c09e3517a9` (`feat: establish domain database foundation`)
- **Audit Mode:** READ-ONLY FORENSIC AUDIT (Zero code changes, zero migrations, zero database mutations, zero git operations)
- **Timestamp:** 2026-09-08T12:45:00+05:30
- **Auditor:** Antigravity System Forensic Audit Engine

---

## 2. Scope
The audit examined all monorepo workspaces and assets introduced or modified for Milestone 4, including:
1. **API Application (`apps/api`):**
   - Authentication & Token Lifecycle (`auth.controller.ts`, `auth.service.ts`, `token.service.ts`, `auth.dto.ts`)
   - Multi-Factor Authentication (`mfa.service.ts`, `mfa.guard.ts`)
   - Cryptographic Services (`crypto.service.ts`, `password.service.ts`)
   - Authorization & Guards (`jwt-auth.guard.ts`, `tenant.guard.ts`, `permission.guard.ts`, `rate-limit.guard.ts`)
   - Services & Resource Scoping (`audit.service.ts`, `resource-authorization.service.ts`, `users.service.ts`, `tickets.service.ts`, `onboarding.service.ts`)
   - Module Architecture & Main Entrypoint (`main.ts`, `app.module.ts`, `admin.module.ts`, `health.controller.ts`)
2. **Web Frontend (`apps/web`):**
   - Authentication State & Context (`auth-context.tsx`)
   - Route Protection & App Shell (`app-shell.tsx`, `layout.tsx`)
   - Login Page & MFA Challenge UI (`login/page.tsx`)
   - Navigation & Dashboard (`nav-links.tsx`, `dashboard/page.tsx`)
3. **Database & RBAC Catalog (`database/prisma`):**
   - Schema drift verification (`schema.prisma` vs M3 baseline)
   - Seed script verification (`seed.js`)
   - Migration integrity (`migrations/`)
4. **Shared Packages (`packages/*`):**
   - Shared Types (`@remotfix/types`)
   - Validation Schemas (`@remotfix/validation`)
5. **Test Harness & Verification Scripts (`tests/*`):**
   - Security verification suite (`tests/verify-m4-security.js`)

---

## 3. Authority Used
In accordance with the locked authority hierarchy:
1. `docs/MASTER-SPEC-001-002.md`
2. `docs/MASTER-ARCHITECTURE-DECISION-REGISTER.md`
3. `docs/MASTER-BASELINE-AUDIT.md`
4. `docs/MASTER-BASELINE-VERIFICATION.md`
5. `docs/MASTER-ARCHITECTURE-ANALYSIS.md`
6. `docs/MASTER-ARCHITECTURE-REDTEAM.md`
7. `docs/MASTER-ARCHITECTURE-REDTEAM-CORRECTED.md`
8. `docs/REMOTFIX_MASTER_AGENTIC_MVP_PRODUCTION_LAUNCH.md`
9. `docs/implementation_plan_m4.md` (Approved M4 implementation plan)
10. Approved M4 Decisions:
    - **D-M4-01:** JWT access tokens + Redis-backed refresh tracking and revocation
    - **D-M4-02:** Argon2id password hashing
    - **D-M4-03:** Approved 13-permission × 6-role RBAC matrix
    - **D-M4-04:** Redis session state; NO PostgreSQL sessions table
    - **D-M4-05:** Controlled/invited onboarding; NO unrestricted public registration

---

## 4. Executive Summary
Milestone 4 was reported as `IMPLEMENTED + VERIFIED` with 34/34 passing tests in `tests/verify-m4-security.js`. This forensic audit independently scrutinized the codebase and revealed that **the previous verification report substantially overstated security, isolation, and completeness.**

While core cryptographic primitives (Argon2id and AES-256-GCM) and the database RBAC seed (6 roles, 13 permissions, 40 mappings) are correctly structured, the implementation contains **5 CRITICAL vulnerabilities**, **9 HIGH severity architectural and authorization defects**, and **several misleading claims**:

1. **Hardcoded Fallback Cryptographic Secrets:** Both JWT signing (`auth.module.ts`) and AES-256-GCM encryption (`crypto.service.ts`) fall back to static hardcoded strings in source code if environment variables are absent, allowing token forgery and database secret decryption.
2. **Cross-Tenant BOLA/IDOR in Ticket Creation:** `TicketsService.createTicket` accepts `contactId` and `serviceId` directly from request bodies without validating tenant ownership, violating M3 Decision 1 and polluting cross-tenant relational integrity.
3. **Broken Refresh Token Revocation on Logout:** Setting `path: '/api/v1/auth/refresh'` on the HTTP-only cookie prevents browsers from ever transmitting the cookie to `/api/v1/auth/logout`. Consequently, logout silently fails to revoke the refresh token in Redis.
4. **Client-Controlled MFA Secret Submission:** `POST /api/v1/auth/mfa/enable` accepts `encryptedSecret` from the client body and saves it to the database without validating server-side state or user association.
5. **Account Takeover via Multi-Tenant Invitation Acceptance:** `acceptInvite` executes an upsert that unconditionally overwrites the user's password and profile across all organizations if the invited email already exists.
6. **Admin-to-Owner Privilege Escalation:** An `ADMIN` can invite and provision an `OWNER` account because `UsersService.inviteUser` lacks hierarchical role assignment restrictions.
7. **Phantom Route:** The reported `/admin/onboard` endpoint does not exist. `AdminModule` has no controller and is unreachable via HTTP.
8. **Broken `/auth/me` Tenant Context:** `AuthController.me` omits `TenantGuard`, causing `@CurrentTenant()` to always return `null`.
9. **Zero Runtime Input Validation:** No global validation pipes exist, and DTOs have zero validation decorators. Malformed requests trigger unhandled 500 crashes.
10. **Spoofable Rate Limiting & Account Enumeration:** `RateLimitGuard` parses unverified `X-Forwarded-For` headers, and `login` exhibits a ~100ms timing discrepancy between existing and non-existing accounts.

---

## 5. Overall Health Assessment
- **Status:** **RED (FAIL / NOT READY FOR M5 OR PRODUCTION)**
- **Code Quality:** Inconsistent. Core algorithms are sound, but the application integration layer has severe omissions (missing controllers, missing guards, missing DTO validation, client-controlled secrets, and broken cookie pathing).
- **Test Integrity:** **MISLEADING.** `tests/verify-m4-security.js` tests isolated class instances and manually mocked execution contexts, entirely bypassing the NestJS HTTP request pipeline, which masked all controller, route, and cookie failures.
- **Git State:** Clean working tree preserved (no commits or pushes made).

---

## 6. CRITICAL Findings

### SEC-01 (CRITICAL): Hardcoded Fallback Cryptographic Signing & Encryption Keys
- **ID:** CRITICAL-01
- **Severity:** CRITICAL
- **Category:** Cryptography / Secrets Management
- **File:** `apps/api/src/common/crypto/crypto.service.ts` (lines 9-14) & `apps/api/src/auth/auth.module.ts` (lines 13-17)
- **Finding:** Hardcoded fallback strings are embedded in source code for AES-256-GCM key derivation (`'remotfix-mfa-encryption-key-must-be-32-chars-long!'`) and JWT signing (`'remotfix-super-secret-jwt-signing-key-32-chars!'`).
- **Evidence:**
  ```typescript
  // crypto.service.ts:
  const rawKey = process.env.MFA_ENCRYPTION_KEY || process.env.APP_SECRET || 'remotfix-mfa-encryption-key-must-be-32-chars-long!';
  this.key = createHash('sha256').update(rawKey).digest();

  // auth.module.ts:
  secret: process.env.JWT_SECRET || process.env.APP_SECRET || 'remotfix-super-secret-jwt-signing-key-32-chars!',
  ```
- **Why it matters:** If environment variables are missing or misconfigured in staging or production, the application silently boots using public keys. An attacker can forge valid JWT access tokens with arbitrary claims (e.g. `roleName: 'OWNER'`, full permissions) or decrypt all stored TOTP secrets in the database.
- **Authority violated:** Master Spec Sec 2.7, ADR-0010, D-M4-01.
- **Recommended fix:** Remove hardcoded fallback strings. Throw a fatal initialization exception during application bootstrap if `JWT_SECRET` or `MFA_ENCRYPTION_KEY` is not defined or is shorter than 32 bytes.
- **M5 blocker:** YES.

---

### SEC-02 (CRITICAL): Cross-Tenant Foreign Key BOLA / IDOR on Ticket Creation
- **ID:** CRITICAL-02
- **Severity:** CRITICAL
- **Category:** Multi-Tenant Isolation / IDOR
- **File:** `apps/api/src/tickets/tickets.service.ts` (lines 73-84) & `apps/api/src/tickets/tickets.controller.ts` (lines 62-76)
- **Finding:** `createTicket` inserts user-supplied `contactId` and `serviceId` directly into PostgreSQL without verifying that those entities belong to the caller's active `tenant.organizationId`.
- **Evidence:**
  ```typescript
  // tickets.service.ts:
  async createTicket(userId: string, tenant: TenantContext, dto: CreateTicketDto) {
    const ticket = await this.prisma.ticket.create({
      data: {
        organizationId: tenant.organizationId,
        contactId: dto.contactId || null,
        serviceId: dto.serviceId || null,
        title: dto.title,
        description: dto.description || '',
        priority: (dto.priority as any) || 'MEDIUM',
        status: 'OPEN',
      },
    });
  ```
- **Why it matters:** In M3 Decision 1 (Option 2), database foreign keys were kept standard, and tenant isolation for relational references was explicitly mandated to be enforced at the application tier. Because `contactId` and `serviceId` are not verified against `tenant.organizationId`, an attacker in Tenant A can associate tickets with Customer contacts or Services from Tenant B, causing cross-tenant data leakage and relational integrity violations.
- **Authority violated:** Master Spec Sec 2.7, ADR-0023, M3 Architectural Decision 1 (Option 2).
- **Recommended fix:** Query `prisma.contact.findFirst` and `prisma.service.findFirst` filtering strictly by `id` AND `organizationId: tenant.organizationId` before permitting creation. Reject with 404/400 if foreign keys belong to another tenant.
- **M5 blocker:** YES.

---

### SEC-03 (CRITICAL): Path-Restricted Refresh Cookie Prevents Token Revocation on Logout
- **ID:** CRITICAL-03
- **Severity:** CRITICAL
- **Category:** Session Management / Token Revocation
- **File:** `apps/api/src/auth/auth.controller.ts` (lines 59-65, 108-116) & `apps/web/src/components/auth-context.tsx` (lines 76-88)
- **Finding:** The `refreshToken` cookie is set with `Path=/api/v1/auth/refresh`. In compliance with RFC 6265, browsers will never transmit this cookie to `/api/v1/auth/logout`.
- **Evidence:**
  ```typescript
  // auth.controller.ts (login):
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/v1/auth/refresh', // <--- Cookie path restricted to /refresh
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // auth.controller.ts (logout):
  @Post('logout')
  async logout(@Body() body: RefreshTokenDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = body.refreshToken || req.cookies?.refreshToken; // <--- undefined!
    res.clearCookie('refreshToken', { path: '/api/v1/auth/refresh' });
    const result = await this.authService.logout(token); // token is undefined
  ```
- **Why it matters:** When the web client invokes `/logout`, the browser omits the cookie and the client sends an empty body. `req.cookies?.refreshToken` is `undefined`. `authService.logout(undefined)` runs, which skips revocation (`if (refreshToken) ...`). The refresh token remains permanently active and valid in Redis for 7 days.
- **Authority violated:** D-M4-01 ("Logout must reliably invalidate active refresh state in Redis").
- **Recommended fix:** Change the refresh cookie path to `/api/v1/auth` so it is automatically transmitted on both `/api/v1/auth/refresh` and `/api/v1/auth/logout`.
- **M5 blocker:** YES.

---

### SEC-04 (CRITICAL): Client-Controlled MFA Secret Submission in `mfaEnable`
- **ID:** CRITICAL-04
- **Severity:** CRITICAL
- **Category:** MFA Forensics / Authentication
- **File:** `apps/api/src/auth/mfa.service.ts` (lines 18-32, 72-85) & `apps/api/src/auth/auth.controller.ts` (lines 189-202) & `apps/api/src/auth/dto/auth.dto.ts` (lines 22-28)
- **Finding:** In `POST /api/v1/auth/mfa/enable`, the client submits `encryptedSecret` back to the server in the request body, and `mfaService.enableMfa` saves this client-supplied string directly to `user.mfaSecret`.
- **Evidence:**
  ```typescript
  // auth.controller.ts:
  async mfaEnable(@CurrentUser() user: AuthenticatedUser, @Body() dto: MfaSetupDto) {
    await this.mfaService.enableMfa(user.id, dto.token, dto.encryptedSecret); // dto.encryptedSecret comes from client!
  }

  // mfa.service.ts:
  async enableMfa(userId: string, token: string, encryptedSecret: string): Promise<void> {
    const isValid = await this.verifyMfaToken(userId, token, encryptedSecret);
    if (!isValid) throw new BadRequestException('Invalid MFA verification code');
    await this.prisma.user.update({
      where: { id: userId },
      data: { mfaEnabled: true, mfaSecret: encryptedSecret },
    });
  }
  ```
- **Why it matters:** The server maintains no pending enrollment state tied to the authenticated user. Instead of storing the unconfirmed secret in Redis with a short TTL, the server trusts whatever ciphertext the client supplies. An attacker who knows or intercepts any valid ciphertext can submit it to lock or re-bind MFA.
- **Authority violated:** Master Spec Sec 2.7, ADR-0018.
- **Recommended fix:** Store pending MFA secrets in Redis under `mfa:pending:${userId}` with a 10-minute TTL during `/mfa/setup`. In `/mfa/enable`, retrieve the secret directly from Redis; do not accept secrets from the client request body.
- **M5 blocker:** YES.

---

### SEC-05 (CRITICAL): Global Account Takeover / Password Overwrite in `acceptInvite`
- **ID:** CRITICAL-05
- **Severity:** CRITICAL
- **Category:** Authentication / Multi-Tenant Integrity
- **File:** `apps/api/src/auth/auth.service.ts` (lines 353-386)
- **Finding:** `acceptInvite` performs an unconditional `prisma.user.upsert` that overwrites `passwordHash`, `firstName`, and `lastName` of any user matching `email`.
- **Evidence:**
  ```typescript
  // auth.service.ts:
  const user = await this.prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      status: 'ACTIVE',
      firstName: dto.firstName || 'Team',
      lastName: dto.lastName || 'Member',
    },
    create: { email, passwordHash, status: 'ACTIVE', ... },
  });
  ```
- **Why it matters:** In REMOTFIX, a `User` is a global identity entity that can hold memberships in multiple organizations. If user `alice@acme.com` is active in Tenant 1, and Tenant 2 invites `alice@acme.com`, anyone who accepts that invitation token will OVERWRITE Alice's primary password across all tenants, locking her out of Tenant 1 and taking over her account.
- **Authority violated:** Master Spec Sec 2.7, D-M4-05.
- **Recommended fix:** If `user` already exists, verify whether the user already has a valid `passwordHash`. If the user is already initialized, do NOT overwrite `passwordHash` or profile names; simply activate the new `membership` for the target organization.
- **M5 blocker:** YES.

---

## 7. HIGH Findings

### SEC-06 (HIGH): Privilege Escalation: Admin Can Invite and Provision Root `OWNER`
- **ID:** HIGH-01
- **Severity:** HIGH
- **Category:** RBAC / Privilege Escalation
- **File:** `apps/api/src/users/users.service.ts` (lines 28-39) & `apps/api/src/users/users.controller.ts` (lines 25-34)
- **Finding:** Any user with `users:create` can invite users with any role name, including `SystemRole.OWNER`.
- **Evidence:**
  ```typescript
  // users.service.ts:
  const role = await this.prisma.role.findFirst({
    where: {
      name: dto.roleName,
      OR: [{ organizationId: tenantContext.organizationId }, { isSystem: true }],
    },
  });
  ```
- **Why it matters:** Both `OWNER` and `ADMIN` possess `users:create`. A tenant `ADMIN` can invite themselves or a collaborator with `roleName: SystemRole.OWNER`, elevating their privilege to root owner without owner authorization.
- **Authority violated:** Master Spec Sec 2.7 (Hierarchical privilege integrity).
- **Recommended fix:** Restrict role assignment in `UsersService.inviteUser`: only an `OWNER` can invite an `OWNER`. An `ADMIN` may only invite roles at or below `ADMIN` (e.g. `MANAGER`, `TECHNICIAN`, `STAFF`, `CUSTOMER`).
- **M5 blocker:** YES.

---

### SEC-07 (HIGH): Missing Global ValidationPipe and DTO Validation Decorators
- **ID:** HIGH-02
- **Severity:** HIGH
- **Category:** Input Validation / Robustness
- **File:** `apps/api/src/main.ts` (lines 8-43) & `apps/api/src/auth/dto/auth.dto.ts` (lines 1-61)
- **Finding:** No NestJS `ValidationPipe` is registered globally. DTO classes contain only `@ApiProperty` Swagger annotations and zero validation decorators (`@IsEmail`, `@IsNotEmpty`, `@IsString`).
- **Evidence:**
  `apps/api/src/auth/dto/auth.dto.ts` defines `LoginDto` with plain TypeScript properties. `apps/api/package.json` does not include `class-validator` or `class-transformer`.
- **Why it matters:** If an attacker sends `{ email: 12345 }`, `auth.service.ts` crashes with `TypeError: loginDto.email.trim is not a function`, producing unhandled 500 errors.
- **Authority violated:** Master Spec Sec 2.7, ADR-0010.
- **Recommended fix:** Install `class-validator` and `class-transformer` (or wire `@remotfix/validation` Zod schemas via custom pipes) and register `app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))` in `main.ts`.
- **M5 blocker:** YES.

---

### SEC-08 (HIGH): Rate Limiting Bypass via Spoofed `X-Forwarded-For` Header
- **ID:** HIGH-03
- **Severity:** HIGH
- **Category:** Abuse Prevention / Rate Limiting
- **File:** `apps/api/src/common/guards/rate-limit.guard.ts` (lines 19-23)
- **Finding:** `RateLimitGuard` reads the client IP directly from `request.headers['x-forwarded-for']?.toString().split(',')[0].trim()` without configuring Express `trust proxy` or checking reverse proxy authenticity.
- **Evidence:**
  ```typescript
  const ip = request.headers['x-forwarded-for']?.toString().split(',')[0].trim() || request.ip || '127.0.0.1';
  ```
- **Why it matters:** An attacker can bypass the 10 req/min limit on `/auth/login` and `/auth/forgot-password` by sending a random `X-Forwarded-For` header on each request.
- **Authority violated:** Master Spec Sec 2.7, ADR-0010.
- **Recommended fix:** Enable `app.set('trust proxy', 1)` in `main.ts` and rely on `request.ip` as resolved by Express using trusted proxy hops.
- **M5 blocker:** YES.

---

### SEC-09 (HIGH): Timing Attack Discrepancy on Login (Account Enumeration)
- **ID:** HIGH-04
- **Severity:** HIGH
- **Category:** Authentication / Anti-Enumeration
- **File:** `apps/api/src/auth/auth.service.ts` (lines 64-90)
- **Finding:** If an email does not exist, `login` throws immediately (~2ms). If an email exists, it executes `passwordService.verify` (Argon2id computing for ~100-200ms).
- **Evidence:**
  ```typescript
  if (!user || user.status !== 'ACTIVE' || !user.passwordHash) {
    await this.auditService.log(...);
    throw invalidAuthError; // <--- Returns in 2ms without running Argon2id!
  }
  const isPasswordValid = await this.passwordService.verify(loginDto.password, user.passwordHash);
  ```
- **Why it matters:** The ~50-100x latency difference allows attackers to accurately enumerate registered emails despite uniform error messages. Contradicts previous report claims of "matching response timing".
- **Authority violated:** Master Spec Sec 2.7, D-M4-02.
- **Recommended fix:** If `user` is not found, execute a dummy `passwordService.verify` against a static pre-computed Argon2id hash before throwing `invalidAuthError`.
- **M5 blocker:** NO (Important security hardening item).

---

### SEC-10 (HIGH): Lack of Refresh Token Rotation & Replay Detection
- **ID:** HIGH-05
- **Severity:** HIGH
- **Category:** Token Security / Session Management
- **File:** `apps/api/src/auth/auth.service.ts` (line 259) & `apps/api/src/auth/token.service.ts` (lines 75-88)
- **Finding:** `AuthService.refresh` does not rotate the refresh token upon use. It re-returns the exact same token with comment: `refreshToken, // preserves active refresh token or can rotate`.
- **Evidence:**
  ```typescript
  return {
    accessToken: newAccessToken,
    refreshToken, // preserves active refresh token or can rotate
  };
  ```
- **Why it matters:** If an attacker intercepts a refresh token, they can renew access tokens indefinitely for 7 days without triggering any replay detection or invalidation.
- **Authority violated:** D-M4-01.
- **Recommended fix:** Invalidate the used refresh token and issue a new one on every call to `/auth/refresh`. Detect reuse of already-consumed refresh tokens and revoke all sessions if replay occurs.
- **M5 blocker:** YES.

---

### ARCH-01 (HIGH): Missing Global Auth & Tenant Guards (Fail-Open Architecture)
- **ID:** HIGH-06
- **Severity:** HIGH
- **Category:** Architecture / Authorization
- **File:** `apps/api/src/app.module.ts` & `apps/api/src/main.ts`
- **Finding:** Guards (`JwtAuthGuard`, `TenantGuard`, `PermissionGuard`, `MfaGuard`) are decorated manually on controllers rather than registered globally via `APP_GUARD`.
- **Evidence:**
  Neither `APP_GUARD` nor `app.useGlobalGuards` is used anywhere in `apps/api`.
- **Why it matters:** Any new controller created in M5 is completely public by default if the developer forgets to add `@UseGuards(...)`.
- **Authority violated:** Master Spec Sec 2.7, D-M4-03.
- **Recommended fix:** Register `JwtAuthGuard`, `TenantGuard`, `PermissionGuard`, and `MfaGuard` as global providers in `AppModule` using `APP_GUARD`, and use the `@Public()` decorator to declare unauthenticated endpoints.
- **M5 blocker:** YES.

---

### SEC-11 (HIGH): `GET /api/v1/auth/me` Missing `TenantGuard` (Always Returns Null Tenant)
- **ID:** HIGH-07
- **Severity:** HIGH
- **Category:** Authorization / API Contract
- **File:** `apps/api/src/auth/auth.controller.ts` (lines 124-140)
- **Finding:** `AuthController.me` is decorated with `@UseGuards(JwtAuthGuard)` but lacks `TenantGuard`. The parameter `@CurrentTenant() tenant?: TenantContext` reads `request.tenant`, which is never populated.
- **Evidence:**
  ```typescript
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  async me(@CurrentUser() user: AuthenticatedUser, @CurrentTenant() tenant?: TenantContext) {
    return { success: true, data: { user, activeTenant: tenant || null } };
  }
  ```
- **Why it matters:** `GET /api/v1/auth/me` ALWAYS returns `"activeTenant": null`, breaking frontend profile display and tenant role resolution.
- **Authority violated:** ADR-0023, Master Spec Sec 2.7.
- **Recommended fix:** Add `TenantGuard` to `@UseGuards(JwtAuthGuard, TenantGuard)` on `@Get('me')`.
- **M5 blocker:** YES.

---

### ARCH-02 (HIGH): Phantom Route Claim: `/admin/onboard` Has No Controller or HTTP Route
- **ID:** HIGH-08
- **Severity:** HIGH
- **Category:** Missing Implementation / Architecture
- **File:** `apps/api/src/admin/admin.module.ts` (lines 1-9) & `apps/api/src/admin/onboarding.service.ts`
- **Finding:** `OnboardingService` exists, but `AdminModule` provides no controller. There is zero HTTP route or CLI script exposing `provisionOrganizationWithOwner`.
- **Evidence:**
  `admin.module.ts` exports `OnboardingService`, but `controllers: []` is empty. Grep shows `OnboardingService` is only called inside `tests/verify-m4-security.js`.
- **Why it matters:** The reported feature "Controlled/invited onboarding workflow (`/admin/onboard`)" does not exist. Initial tenant provisioning cannot be triggered by an administrator or operator.
- **Authority violated:** D-M4-05, M4 Implementation Plan.
- **Recommended fix:** Create `AdminController` with a protected endpoint or provide an administrative CLI script (`pnpm --filter @remotfix/api onboard`) to execute controlled provisioning.
- **M5 blocker:** YES.

---

### SEC-12 (HIGH): Sensitive Refresh Token Returned in JSON Response Payload
- **ID:** HIGH-09
- **Severity:** HIGH
- **Category:** Token Security
- **File:** `apps/api/src/auth/auth.service.ts` (line 190) & `apps/api/src/auth/auth.controller.ts` (lines 57-73)
- **Finding:** `AuthService.login` includes `refreshToken` in the JSON return payload in addition to setting the HTTP-only cookie.
- **Evidence:**
  ```typescript
  // auth.service.ts:
  return {
    accessToken,
    refreshToken, // <--- Sent to client in plaintext JSON body!
    user: { ... },
    activeOrganization: { ... },
  };
  ```
- **Why it matters:** Returning `refreshToken` in the JSON response exposes it to browser JavaScript, defeating the XSS protection of HTTP-only cookies. Contradicts previous claims that refresh tokens are never exposed to JavaScript.
- **Authority violated:** D-M4-01, Master Spec Sec 2.7.
- **Recommended fix:** Strip `refreshToken` from the returned JSON payload in `auth.controller.ts` when set as an HTTP-only cookie.
- **M5 blocker:** YES.

---

## 8. MEDIUM Findings

### SEC-13 (MEDIUM): Stateless JWT Invalidation Gap ("Instant Revocation" Contradiction)
- **ID:** MEDIUM-01
- **Severity:** MEDIUM
- **Category:** Token Lifecycle / Session Revocation
- **File:** `apps/api/src/common/guards/jwt-auth.guard.ts` (lines 32-55) & `apps/api/src/auth/token.service.ts` (lines 90-123)
- **Finding:** `revokeRefreshToken` and `invalidateAllUserSessions` delete refresh tokens from Redis, but `JwtAuthGuard` only checks JWT signature and `user.status === 'ACTIVE'` in PostgreSQL. It never checks Redis or a token blacklist/revocation timestamp.
- **Evidence:**
  `JwtAuthGuard` verifies the JWT signature with `tokenService.verifyAccessToken(token)`. If the user logs out, their 15-minute access token remains completely valid until expiry.
- **Why it matters:** Contradicts previous claims of "instant revocation" and "universal session revocation".
- **Authority violated:** D-M4-01.
- **Recommended fix:** Store a `user:revoked_before:${userId}` timestamp in Redis when sessions are invalidated, and verify `payload.iat * 1000 > revokedBefore` in `JwtAuthGuard`.
- **M5 blocker:** NO.

---

### CODE-01 (MEDIUM): Dead Code: `authorizeBillingAccess` in `ResourceAuthorizationService`
- **ID:** MEDIUM-02
- **Severity:** MEDIUM
- **Category:** Dead Code / Speculative Abstraction
- **File:** `apps/api/src/common/services/resource-authorization.service.ts` (lines 103-137)
- **Finding:** Method `authorizeBillingAccess` is implemented in `ResourceAuthorizationService` but is never referenced by any controller, service, or test.
- **Evidence:**
  Grep for `authorizeBillingAccess` finds only its own declaration on line 103.
- **Why it matters:** Unused speculative code violating Ponytail Decision Ladder.
- **Authority violated:** Ponytail Anti-Overengineering Ladder.
- **Recommended fix:** Remove or defer until billing module is built in M5/M6.
- **M5 blocker:** NO.

---

### CODE-02 (MEDIUM): Dead Legacy Enum `UserRole` in `@remotfix/types`
- **ID:** MEDIUM-03
- **Severity:** MEDIUM
- **Category:** Code Duplication / Dead Types
- **File:** `packages/types/src/index.ts` (lines 64-73)
- **Finding:** `UserRole` defines legacy role names (`TENANT_OWNER`, `SECURITY_ADMIN`, `SUPPORT_AGENT`) that contradict canonical `SystemRole`. Grep shows zero usages across the repository.
- **Why it matters:** Dead type creating naming confusion with canonical `SystemRole`.
- **Authority violated:** D-M4-03, Ponytail Rule.
- **Recommended fix:** Delete `UserRole` enum.
- **M5 blocker:** NO.

---

### ARCH-03 (MEDIUM): Unused Dependency `@remotfix/validation` in `apps/api`
- **ID:** MEDIUM-04
- **Severity:** MEDIUM
- **Category:** Dependencies
- **File:** `apps/api/package.json` (line 22)
- **Finding:** `@remotfix/validation` is listed as a dependency in `apps/api/package.json` but is never imported anywhere in `apps/api/src`.
- **Why it matters:** Unused dependency declaration.
- **Authority violated:** Monorepo hygiene.
- **Recommended fix:** Either wire `@remotfix/validation` Zod schemas into NestJS pipes or remove the dependency.
- **M5 blocker:** NO.

---

### SEC-14 (MEDIUM): Silent Failure and Lack of Transactional Coupling in `AuditService`
- **ID:** MEDIUM-05
- **Severity:** MEDIUM
- **Category:** Audit Logging
- **File:** `apps/api/src/common/services/audit.service.ts` (lines 37-40)
- **Finding:** `AuditService.log` catches database write errors with `console.error` and swallows them. Furthermore, audit calls are executed outside the database transaction of the business operation.
- **Evidence:**
  ```typescript
  try {
    await this.prisma.auditEvent.create({ ... });
  } catch (err) {
    console.error('[AuditService] Failed to record audit event:', err);
  }
  ```
- **Why it matters:** If the database write fails or the process crashes after an entity update, the audit record is lost with no rollback of the business change. Uses `console.error` instead of `@remotfix/telemetry`.
- **Authority violated:** Master Spec Sec 2.7, ADR-0010.
- **Recommended fix:** Use structured `@remotfix/telemetry` logger. For high-assurance operations, support passing an active Prisma transaction client (`tx`) to `AuditService.log`.
- **M5 blocker:** NO.

---

### TEST-01 (MEDIUM): Test Suite Bypasses HTTP Pipeline and Mocks Execution Contexts
- **ID:** MEDIUM-06
- **Severity:** MEDIUM
- **Category:** Test Quality
- **File:** `tests/verify-m4-security.js` (lines 419-485, 783-805)
- **Finding:** `verify-m4-security.js` tests isolated TypeScript classes directly rather than issuing real HTTP requests to the running NestJS application. Execution contexts and reflector metadata are mocked in memory.
- **Evidence:**
  `const permGuard = new PermissionGuard(reflector); permGuard.canActivate(createMockExecutionContext(...));`
- **Why it matters:** Direct class testing gave false confidence (34/34 pass) while failing to detect that `OnboardingService` has no route, `/me` lacks `TenantGuard`, cookie paths break logout, and validation pipes are absent.
- **Authority violated:** Master Verification Requirements.
- **Recommended fix:** Augment unit tests with Supertest HTTP integration tests against the compiled NestJS HTTP server.
- **M5 blocker:** NO.

---

### DB-01 (MEDIUM): Test Script Pollutes Database Without Teardown
- **ID:** MEDIUM-07
- **Severity:** MEDIUM
- **Category:** Database Hygiene / Test Artifacts
- **File:** `tests/verify-m4-security.js` (lines 227-252, 494-619)
- **Finding:** Running `verify-m4-security.js` creates organizations, users, technicians, contacts, and tickets, but never removes them.
- **Why it matters:** Repeated test runs leave dirty rows in `remotfix_dev`, violating the clean authoritative seed requirement.
- **Authority violated:** M3 Baseline Rules.
- **Recommended fix:** Add a cleanup teardown hook in `finally` to delete test-created entities.
- **M5 blocker:** NO.

---

### SEC-15 (MEDIUM): Missing Redis Password and Host Configuration Robustness
- **ID:** MEDIUM-08
- **Severity:** MEDIUM
- **Category:** Configuration / Redis Security
- **File:** `apps/api/src/common/redis/redis.service.ts` (lines 8-19)
- **Finding:** `RedisService` only parses `REDIS_HOST` and `REDIS_PORT`. It does not support `REDIS_PASSWORD` or `REDIS_URL`.
- **Why it matters:** Any staging or production environment requiring authenticated Redis will fail to connect.
- **Authority violated:** Production Deployment Standards.
- **Recommended fix:** Support `REDIS_PASSWORD` and `REDIS_URL` in `RedisService`.
- **M5 blocker:** YES (Before staging/prod).

---

## 9. LOW Findings

### SEC-16 (LOW): Missing Maximum Length Checks on Password Inputs (DoS Vector)
- **ID:** LOW-01
- **Severity:** LOW
- **Category:** Robustness / Denial of Service
- **File:** `apps/api/src/auth/auth.service.ts` (lines 324, 363) & `apps/api/src/auth/dto/auth.dto.ts`
- **Finding:** `resetPassword` and `acceptInvite` enforce `password.length >= 8` but specify no upper bound.
- **Why it matters:** Submitting excessively long passwords (e.g. 50MB strings) to Argon2id can exhaust CPU and memory.
- **Authority violated:** OWASP Password Storage Guidelines.
- **Recommended fix:** Enforce maximum password length of 128 characters in DTO validation.
- **M5 blocker:** NO.

---

### FRONT-01 (LOW): Absence of Token Refresh Interceptor in Frontend
- **ID:** LOW-02
- **Severity:** LOW
- **Category:** Frontend / User Experience
- **File:** `apps/web/src/components/auth-context.tsx`
- **Finding:** The frontend has no HTTP fetch interceptor or 401 retry logic to invoke `/api/v1/auth/refresh`. When the 15-minute access token expires, all requests fail.
- **Why it matters:** Contradicts previous verification report claim of "token refresh interceptor".
- **Authority violated:** Frontend UX Architecture.
- **Recommended fix:** Implement an `apiFetch` utility with automatic 401 token renewal.
- **M5 blocker:** NO.

---

### SEC-17 (LOW): Non-Atomic Rate Limiting Incurring Key Expiration Race Condition
- **ID:** LOW-03
- **Severity:** LOW
- **Category:** Redis / Concurrency
- **File:** `apps/api/src/common/guards/rate-limit.guard.ts` (lines 27-30)
- **Finding:** `RateLimitGuard` performs `redis.incr(key)` followed by `redis.expire(key, 60)` in separate commands instead of an atomic script or `SET EX NX`.
- **Why it matters:** Process failure between `incr` and `expire` leaves keys with infinite TTL.
- **Authority violated:** Redis Best Practices.
- **Recommended fix:** Use a Redis Lua script or `multi()` transaction for atomic increment and expiration.
- **M5 blocker:** NO.

---

### CODE-03 (LOW): Placeholder User Field Values in `acceptInvite` and `inviteUser`
- **ID:** LOW-04
- **Severity:** LOW
- **Category:** Code Quality
- **File:** `apps/api/src/auth/auth.service.ts` (line 375) & `apps/api/src/users/users.service.ts` (lines 60-61)
- **Finding:** Fallback values `firstName: 'Team'`, `lastName: 'Member'` and `'UNINITIALIZED_INVITED_ACCOUNT'` are hardcoded into database fields.
- **Why it matters:** Clutters user profile attributes with arbitrary placeholder strings.
- **Authority violated:** Code Hygiene.
- **Recommended fix:** Make invited user names nullable or require user to provide their name upon accepting the invite.
- **M5 blocker:** NO.

---

## 10. Security Findings Summary
| Finding ID | Severity | Description | M5 Blocker |
|---|---|---|---|
| **SEC-01** | CRITICAL | Hardcoded fallback keys for JWT signing and AES-GCM encryption | YES |
| **SEC-02** | CRITICAL | Cross-tenant foreign key BOLA/IDOR on ticket creation | YES |
| **SEC-03** | CRITICAL | Refresh cookie path prevents token revocation on logout | YES |
| **SEC-04** | CRITICAL | Client-controlled encrypted secret submission in `mfaEnable` | YES |
| **SEC-05** | CRITICAL | Global account takeover / password overwrite in `acceptInvite` | YES |
| **SEC-06** | HIGH | Privilege escalation: ADMIN can invite/provision root OWNER | YES |
| **SEC-07** | HIGH | Missing global validation pipe and DTO validation decorators | YES |
| **SEC-08** | HIGH | Rate limiting bypass via spoofed `X-Forwarded-For` header | YES |
| **SEC-09** | HIGH | Timing attack discrepancy on login (~100ms enumeration leak) | NO |
| **SEC-10** | HIGH | Lack of refresh token rotation & replay detection | YES |
| **SEC-11** | HIGH | `GET /api/v1/auth/me` missing `TenantGuard` (returns null activeTenant) | YES |
| **SEC-12** | HIGH | Sensitive refresh token returned in plaintext JSON response body | YES |
| **SEC-13** | MEDIUM | Access tokens cannot be revoked before 15m expiration | NO |
| **SEC-14** | MEDIUM | Audit logging swallowed errors and lack of transaction coupling | NO |
| **SEC-15** | MEDIUM | Missing Redis password support for authenticated staging/prod | YES |
| **SEC-16** | LOW | Missing maximum password length limit (DoS vector) | NO |
| **SEC-17** | LOW | Non-atomic rate limit counter expiration race condition | NO |

---

## 11. Authentication Findings
- **Password Hashing (Argon2id):** Memory-hard configuration (`64MB`, `3 iterations`, `4 parallelism`) correctly implemented using `@node-rs/argon2`.
- **Anti-Enumeration:** Error messages are uniform (`Invalid email or password`), but execution timing is NOT uniform (2ms vs 150ms).
- **Session Lifecycle:** Ephemeral refresh token state is tracked in Redis. However, refresh tokens are not rotated on use, and logout fails to revoke them over HTTP due to cookie path mismatch.

---

## 12. RBAC Findings
- **Catalog Verification:** Exactly 6 system roles and 13 permission keys seeded.
- **Mapping Verification:** Exactly 40 role-permission mappings verified in PostgreSQL matching the approved matrix.
- **Deny-by-Default:** Enforced in `PermissionGuard` (unassigned permission = 403 Forbidden).
- **Flaws:** Missing global guard registration; privilege escalation vulnerability in `UsersService.inviteUser` allows `ADMIN` to invite `OWNER`.

---

## 13. Tenant Isolation Findings
- **Guard Level:** `TenantGuard` validates that `user.id` possesses an active `Membership` in `organizationId`.
- **Data Query Level:** `ResourceAuthorizationService.authorizeTicketAccess` correctly filters `where: { id: ticketId, organizationId }`.
- **Data Write Level (FAILURE):** `TicketsService.createTicket` does NOT validate that `contactId` or `serviceId` belong to `organizationId`.

---

## 14. MFA Findings
- **Algorithm:** RFC 6238 TOTP using `otplib` and AES-256-GCM encryption verified.
- **Replay Protection:** 60-second Redis replay lock verified.
- **Flaws:** Client supplies `encryptedSecret` in `/mfa/enable`; hardcoded fallback encryption key in `crypto.service.ts`; `MfaGuard` checks database boolean `user.mfaEnabled` rather than session token claims.

---

## 15. Redis/Session Findings
- **Storage Strategy:** D-M4-04 respected (zero sessions table in PostgreSQL).
- **Key Design:** `session:refresh:${token}` with 7-day TTL and `user:sessions:${userId}` set index.
- **Flaws:** Non-atomic rate limit expiration; missing Redis password configuration.

---

## 16. Audit Logging Findings
- **Structure:** Append-only structure (`created_at`, no `updated_at`) respected.
- **Immutability Check:** Immutability is enforced at the application tier only; direct SQL update/delete is possible in PostgreSQL (as noted in M3). M4 did not claim DB-level immutability in schema.
- **Flaws:** Swallows errors with `console.error`; audit calls not included in database transactions; `auth:logout` audit events never emitted because controller omits `userId`.

---

## 17. Database/Prisma Findings
- **Schema Drift:** Zero schema changes (`schema.prisma` is identical to M3 commit `0325838`).
- **Migrations:** Zero new migrations generated (D-M4-04 satisfied).
- **Flaw:** Test suite accumulates un-cleared test rows in `remotfix_dev`.

---

## 18. Code Duplication Findings
1. **Role Definitions:** `SystemRole` (canonical enum in `packages/types/src/index.ts`) duplicated by dead `UserRole` enum.
   - *Recommendation:* Delete `UserRole`.
2. **Hardcoded Database URLs:** `seed.js` and `prisma.service.ts` duplicate default connection strings.
   - *Recommendation:* Centralize in `@remotfix/config`.

---

## 19. AI/Gibberish/Garbage Findings
1. **Dead Speculative Abstraction:** `authorizeBillingAccess` in `ResourceAuthorizationService` (lines 103-137) is never invoked anywhere.
2. **Misleading Comments:**
   - `auth.service.ts` line 35: "Resists user enumeration by returning uniform error messages" (ignores massive 100ms timing leak).
   - `auth.service.ts` line 259: `// preserves active refresh token or can rotate` (documents unrotated security flaw).
3. **Magic Fallback Strings:** `firstName: 'Team'`, `lastName: 'Member'`, and `passwordHash: 'UNINITIALIZED_INVITED_ACCOUNT'`.

---

## 20. Dependency Findings
- **New Dependencies:**
  - `@nestjs/jwt`: ^12.0.1 (Approved D-M4-01)
  - `@node-rs/argon2`: ^2.2.0 (Approved D-M4-02)
  - `cookie-parser`: ^1.4.7 (Approved)
  - `ioredis`: ^6.0.0 (Approved D-M4-04)
  - `otplib`: ^13.5.0 (Approved)
- **Unused Dependency:** `@remotfix/validation` is in `package.json` but not used in `apps/api`.
- **Missing Dependencies:** `class-validator` and `class-transformer` are missing, resulting in complete lack of DTO validation.

---

## 21. Frontend Findings
- **Token Storage:** Access token is stored in `localStorage`, exposing it to potential XSS token theft.
- **Route Protection:** Pure client-side `useEffect` redirect without Next.js middleware.
- **Missing Feature:** No HTTP fetch interceptor or automatic token refresh logic exists.

---

## 22. Test Quality Findings
| Test Suite / Area | Quality Classification | Finding |
|---|:---:|---|
| **RBAC Seed Counts** | STRONG | Validates 6 roles, 13 permissions, 40 mappings against database |
| **Argon2id Hashing** | STRONG | Verifies hash format and valid/invalid password verification |
| **AES-256-GCM Crypto** | ADEQUATE | Verifies round-trip encryption/decryption matching plaintext |
| **Rate Limiting** | WEAK | Tests static IP in loop; does not test spoofed headers |
| **MFA Setup / Enable** | MISLEADING | Tests direct class method; masks client-supplied secret flaw |
| **Tenant Isolation** | MISLEADING | Tests read authorization only; never tests `createTicket` BOLA |
| **HTTP Guards** | MISLEADING | Uses mocked execution contexts; never tests actual NestJS routes |
| **Onboarding** | MISLEADING | Calls class directly; masks complete absence of HTTP route |

---

## 23. Architecture/ADR Compliance
- **Modular Monolith (ADR-0001):** Compliant.
- **PostgreSQL Authority (ADR-0002):** Compliant.
- **Redis Session Cache (D-M4-04):** Compliant.
- **API Prefix `/api/v1` (ADR-0010):** Compliant.
- **Tenant Isolation (ADR-0023):** NON-COMPLIANT in `createTicket` (missing cross-tenant contact/service validation).
- **MFA Enforcement (ADR-0018):** NON-COMPLIANT (MFA secret is client-controlled in enable flow).

---

## 24. Claim-vs-Evidence Review
| Claim from Previous M4 Report | Forensic Audit Finding | Evidence |
|---|:---:|---|
| "Matching response timing resists enumeration" | **CONTRADICTED** | 2ms vs 150ms timing leak in `auth.service.ts` |
| "Instant session revocation across devices" | **PARTIALLY VERIFIED** | Revokes refresh tokens; 15m access tokens remain valid |
| "Secure HTTP-only refresh cookie" | **CONTRADICTED** | Cookie path breaks logout; raw refresh token returned in JSON body |
| "Controlled onboarding workflow (`/admin/onboard`)" | **CONTRADICTED** | No controller or route exists in `AdminModule` |
| "Completely preventing IDOR" | **CONTRADICTED** | `createTicket` allows cross-tenant `contactId`/`serviceId` injection |
| "Frontend token refresh interceptor" | **CONTRADICTED** | Zero token refresh logic exists in frontend |

---

## 25. Human Decisions Required

### DECISION-01: Multi-Tenant User Identity Boundary
- **Context:** In REMOTFIX, `User` is globally unique by email, while `Membership` binds a user to an `Organization`.
- **Conflict:** When an existing user accepts an invite to a new organization, `acceptInvite` currently overwrites the user's primary password.
- **Options:**
  - *Option A (Recommended):* If user already exists, require the user to log in with their existing credentials to accept the invite; do not overwrite password.
  - *Option B:* Enforce strictly partitioned tenant identities where user accounts cannot span multiple organizations.

### DECISION-02: Privilege Hierarchy Between `OWNER` and `ADMIN`
- **Context:** Both `OWNER` and `ADMIN` possess `users:create`.
- **Conflict:** Currently an `ADMIN` can invite and assign an `OWNER`.
- **Options:**
  - *Option A (Recommended):* Strictly forbid `ADMIN` from inviting or modifying `OWNER` roles.
  - *Option B:* Allow `ADMIN` to invite any role within the tenant.

---

## 26. Recommended Fix Plan
Prior to Milestone 5 authorization, execute the following remediation plan:
1. **Phase 1: Secrets & Security Hardening (Blockers):**
   - Fail startup if `JWT_SECRET` or `MFA_ENCRYPTION_KEY` is not configured; delete hardcoded fallbacks.
   - Fix refresh cookie path from `/api/v1/auth/refresh` to `/api/v1/auth`.
   - Strip `refreshToken` from the JSON response body.
   - Validate `contactId` and `serviceId` against `tenant.organizationId` in `createTicket`.
   - Store pending MFA secrets in Redis (`mfa:pending:${userId}`) during setup; eliminate client-submitted `encryptedSecret`.
   - Protect existing user passwords in `acceptInvite`.
   - Restrict `ADMIN` from inviting `OWNER`.
2. **Phase 2: Architectural & Route Integrity (Blockers):**
   - Add `TenantGuard` to `GET /api/v1/auth/me`.
   - Register global guards (`APP_GUARD`) in `AppModule` with `@Public()` decorator opt-outs.
   - Install `class-validator` / `class-transformer` and enable global `ValidationPipe`.
   - Implement `AdminController` or an onboarding CLI command for `OnboardingService`.
   - Support `REDIS_PASSWORD` in `RedisService`.
3. **Phase 3: Quality & Test Hardening (Non-Blockers):**
   - Implement dummy Argon2id verification for non-existent users on login.
   - Implement refresh token rotation.
   - Delete dead code (`authorizeBillingAccess`, `UserRole`).
   - Add teardown cleanup to `verify-m4-security.js`.

---

## 27. M5 Blockers
The following items MUST be resolved before Milestone 5 begins:
1. **SEC-01:** Hardcoded fallback cryptographic keys.
2. **SEC-02:** Cross-tenant foreign key BOLA/IDOR on ticket creation.
3. **SEC-03:** Refresh cookie path preventing revocation on logout.
4. **SEC-04:** Client-controlled encrypted secret in `mfaEnable`.
5. **SEC-05:** Account takeover / password overwrite in `acceptInvite`.
6. **SEC-06:** Admin-to-Owner privilege escalation in `inviteUser`.
7. **SEC-07:** Missing global validation pipe and DTO validation.
8. **SEC-08:** Spoofed `X-Forwarded-For` rate limit bypass.
9. **SEC-10:** Missing refresh token rotation.
10. **ARCH-01:** Missing global auth and tenant guards.
11. **SEC-11:** `GET /api/v1/auth/me` missing `TenantGuard`.
12. **ARCH-02:** Missing controller/route for `OnboardingService`.
13. **SEC-12:** Sensitive refresh token exposed in JSON response body.
14. **SEC-15:** Missing Redis password support for staging/production.

---

## 28. Non-Blockers
The following items should be addressed before production release but do not block M5 domain service development:
- **SEC-09:** Login timing attack discrepancy (~100ms account enumeration).
- **SEC-13:** Stateless JWT 15m expiration invalidation gap.
- **CODE-01:** Dead `authorizeBillingAccess` method.
- **CODE-02:** Dead `UserRole` enum.
- **ARCH-03:** Unused `@remotfix/validation` dependency.
- **SEC-14:** Audit logging error swallowing and transaction decoupling.
- **TEST-01:** Integration tests bypassing HTTP pipeline.
- **DB-01:** Test script database cleanup.
- **SEC-16:** Missing maximum password length limit.
- **FRONT-01:** Frontend automatic token refresh interceptor.
- **SEC-17:** Non-atomic rate limit expiration.
- **CODE-03:** Placeholder strings in user entity fields.

---

## 29. Final Gate Recommendation
- **Recommendation:** **REJECT M4 COMPLETION — HOLD GATE BEFORE M5.**
- **Gate Status:** **BLOCKED.**
- Milestone 4 cannot be certified as complete. The critical security vulnerabilities (hardcoded secrets, cross-tenant IDOR, broken logout revocation, client-controlled MFA secrets, and account takeover) must be remediated and verified through real HTTP integration tests before proceeding to Milestone 5.
