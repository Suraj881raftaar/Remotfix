// REMOTFIX M4.5 — HTTP Integration Test Suite
// Verifies all M4/M4.5 security remediations over real HTTP calls through NestJS.

require('reflect-metadata');
const assert = require('assert');
const { PrismaClient } = require('@prisma/client');
const Redis = require('ioredis');
const { generateSync } = require('otplib');
const cookieParser = require('cookie-parser');
const { NestFactory } = require('@nestjs/core');

// Test Environment Secrets
process.env.APP_SECRET = process.env.APP_SECRET || 'remotfix-test-app-secret-32-chars-long!';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'remotfix-test-jwt-secret-32-chars-long!';
process.env.MFA_ENCRYPTION_KEY = process.env.MFA_ENCRYPTION_KEY || 'remotfix-test-mfa-key-32-chars-long!';
process.env.ADMIN_KEY = process.env.ADMIN_KEY || 'remotfix-test-operator-provisioning-key-32!';

const { AppModule } = require('../apps/api/dist/app.module');
const { CryptoService } = require('../apps/api/dist/common/crypto/crypto.service');

const testResults = [];
async function test(name, fn) {
  try {
    await fn();
    testResults.push({ name, passed: true });
    console.log(`  ✓ PASS: ${name}`);
  } catch (err) {
    testResults.push({ name, passed: false, error: err.message });
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    ${err.stack || err.message}`);
  }
}

async function run() {
  console.log('============================================================');
  console.log('REMOTFIX M4.5 — HTTP INTEGRATION SECURITY VERIFICATION');
  console.log('============================================================\n');

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url:
          process.env.DATABASE_URL ||
          'postgresql://remotfix_user:remotfix_pass@localhost:5432/remotfix_dev?schema=public',
      },
    },
  });

  const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
  });

  const cryptoService = new CryptoService();

  // 1. Verify Startup & Cryptographic Secrets Validation (SEC-01)
  console.log('--- 1. Secrets & Startup Validation (SEC-01) ---');
  await test('CryptoService: Missing key throws fatal error on startup', () => {
    const origKey = process.env.MFA_ENCRYPTION_KEY;
    const origSecret = process.env.APP_SECRET;
    delete process.env.MFA_ENCRYPTION_KEY;
    delete process.env.APP_SECRET;

    let caught = false;
    try {
      new CryptoService();
    } catch (e) {
      caught = true;
      assert.ok(e.message.includes('FATAL: MFA_ENCRYPTION_KEY or APP_SECRET'));
    } finally {
      process.env.MFA_ENCRYPTION_KEY = origKey;
      process.env.APP_SECRET = origSecret;
    }
    assert.strictEqual(caught, true, 'CryptoService must refuse to boot without keys');
  });

  // Boot real NestJS HTTP server on ephemeral port
  console.log('\n--- Booting NestJS HTTP Server ---');
  const app = await NestFactory.create(AppModule, { logger: false });
  app.use(cookieParser());
  app.setGlobalPrefix('api/v1');

  const httpAdapter = app.getHttpAdapter();
  if (typeof httpAdapter.getInstance === 'function') {
    const expressApp = httpAdapter.getInstance();
    if (expressApp && typeof expressApp.set === 'function') {
      expressApp.set('trust proxy', 1);
    }
  }

  const server = await app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}/api/v1`;
  console.log(`NestJS server listening on ${baseUrl}\n`);

  // Tracking entities for cleanup
  const timestamp = Date.now();
  const slugA = `tenant-a-${timestamp}`;
  const emailA = `owner-${slugA}@acme.com`;
  const slugB = `tenant-b-${timestamp}`;
  const emailB = `owner-${slugB}@foreign.com`;
  const staffEmail = `staff-${slugA}@acme.com`;
  const adminEmail = `admin-${slugA}@acme.com`;

  let tenantA;
  let ownerA;
  let tenantB;
  let ownerB;
  let invitedUser;
  let tenantAContact;
  let tenantBContact;
  let tenantAService;
  let tenantBService;
  let createdTicketA;

  try {
    // -------------------------------------------------------------------------
    // 2. CONTROLLED ONBOARDING (ARCH-02, D-M4-05)
    // -------------------------------------------------------------------------
    console.log('--- 2. Controlled Onboarding via HTTP (ARCH-02) ---');

    await test('Onboarding: Missing operator key is rejected (401)', async () => {
      const res = await fetch(`${baseUrl}/admin/onboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationName: 'Tenant A',
          organizationSlug: `tenant-a-${Date.now()}`,
          ownerEmail: `owner-a-${Date.now()}@acme.com`,
          ownerPassword: 'Password123!',
          ownerFirstName: 'Owner',
          ownerLastName: 'A',
        }),
      });
      assert.strictEqual(res.status, 401, 'Should reject unauthorized onboarding');
    });

    await test('Onboarding: Malformed payload fails with 400 Bad Request (Zod validation)', async () => {
      const res = await fetch(`${baseUrl}/admin/onboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': process.env.ADMIN_KEY,
        },
        body: JSON.stringify({
          organizationName: 'A', // Too short (< 2)
          organizationSlug: 'INVALID SLUG WITH SPACES',
          ownerEmail: 'not-an-email',
          ownerPassword: 'short',
        }),
      });
      assert.strictEqual(res.status, 400, 'Zod validation pipe must return 400');
      const body = await res.json();
      assert.strictEqual(body.code, 'VALIDATION_FAILED');
      assert.ok(body.details, 'Should return validation error details');
    });

    await test('Onboarding: Valid operator request provisions Tenant A and Owner A', async () => {
      const res = await fetch(`${baseUrl}/admin/onboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': process.env.ADMIN_KEY,
        },
        body: JSON.stringify({
          organizationName: 'Tenant Alpha Corp',
          organizationSlug: slugA,
          ownerEmail: emailA,
          ownerPassword: 'OwnerPassword123!',
          ownerFirstName: 'Alice',
          ownerLastName: 'Alpha',
        }),
      });
      assert.strictEqual(res.status, 201);
      const json = await res.json();
      assert.strictEqual(json.success, true);
      assert.strictEqual(json.data.organization.slug, slugA);
      assert.strictEqual(json.data.user.email, emailA);

      tenantA = json.data.organization;
      ownerA = json.data.user;
    });

    await test('Onboarding: Provisions Foreign Tenant B and Owner B', async () => {
      const res = await fetch(`${baseUrl}/admin/onboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': process.env.ADMIN_KEY,
        },
        body: JSON.stringify({
          organizationName: 'Tenant Beta Foreign',
          organizationSlug: slugB,
          ownerEmail: emailB,
          ownerPassword: 'OwnerPassword123!',
          ownerFirstName: 'Bob',
          ownerLastName: 'Beta',
        }),
      });
      assert.strictEqual(res.status, 201);
      const json = await res.json();
      tenantB = json.data.organization;
      ownerB = json.data.user;
    });

    // -------------------------------------------------------------------------
    // 3. AUTHENTICATION, COOKIE PATH & TOKEN EXPOSURE (SEC-03, SEC-12)
    // -------------------------------------------------------------------------
    console.log('\n--- 3. Authentication & Cookie Pathing (SEC-03, SEC-12) ---');

    await test('Login: Malformed login input returns 400 Bad Request', async () => {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'not-an-email', password: '' }),
      });
      assert.strictEqual(res.status, 400);
    });

    await test('Login: Non-existent email returns uniform 401', async () => {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'nonexistent@nowhere.com', password: 'Password123!' }),
      });
      assert.strictEqual(res.status, 401);
      const json = await res.json();
      assert.strictEqual(json.message, 'Invalid email or password');
    });

    let ownerATokens;
    let refreshCookieHeader;
    await test('Login: Success sets HttpOnly cookie on /api/v1/auth and omits refreshToken from JSON (SEC-03, SEC-12)', async () => {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailA, password: 'OwnerPassword123!' }),
      });
      assert.strictEqual(res.status, 200);

      const setCookie = res.headers.get('set-cookie');
      assert.ok(setCookie, 'Must set Set-Cookie header');
      assert.ok(setCookie.includes('refreshToken='), 'Must set refreshToken cookie');
      assert.ok(setCookie.includes('Path=/api/v1/auth'), 'Path must be /api/v1/auth (SEC-03 fix)');
      assert.ok(setCookie.includes('HttpOnly'), 'Must be HttpOnly');

      refreshCookieHeader = setCookie.split(';')[0]; // refreshToken=...

      const json = await res.json();
      assert.ok(json.data.accessToken, 'Must return accessToken');
      assert.strictEqual(
        json.data.refreshToken,
        undefined,
        'CRITICAL: refreshToken MUST NOT be exposed in JSON response body (SEC-12 fix)'
      );

      ownerATokens = json.data;
    });

    // -------------------------------------------------------------------------
    // 4. REFRESH TOKEN ROTATION & REPLAY PROTECTION (SEC-10)
    // -------------------------------------------------------------------------
    console.log('\n--- 4. Refresh Token Rotation & Replay Protection (SEC-10) ---');

    let rotatedCookieHeader;
    await test('Refresh: Rotates refresh token and returns new accessToken', async () => {
      const res = await fetch(`${baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: refreshCookieHeader,
        },
      });
      assert.strictEqual(res.status, 200);

      const setCookie = res.headers.get('set-cookie');
      assert.ok(setCookie, 'Must set new rotated cookie');
      assert.ok(setCookie.includes('Path=/api/v1/auth'));

      rotatedCookieHeader = setCookie.split(';')[0];
      assert.notStrictEqual(
        rotatedCookieHeader,
        refreshCookieHeader,
        'Rotated token must be different from original token'
      );

      const json = await res.json();
      assert.ok(json.data.accessToken, 'Must issue new access token');
      assert.strictEqual(json.data.refreshToken, undefined, 'Must not expose refresh token in JSON');
    });

    await test('Refresh: Replaying old consumed token fails (401) (SEC-10 Replay Protection)', async () => {
      const res = await fetch(`${baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: refreshCookieHeader, // Attempt to replay the old token
        },
      });
      assert.strictEqual(res.status, 401, 'Replay of consumed refresh token must be rejected');
    });

    // -------------------------------------------------------------------------
    // 5. LOGOUT REVOCATION (SEC-03)
    // -------------------------------------------------------------------------
    console.log('\n--- 5. Logout & Redis Session Revocation (SEC-03) ---');

    await test('Logout: Clears cookie on /api/v1/auth and revokes token in Redis', async () => {
      const res = await fetch(`${baseUrl}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: rotatedCookieHeader,
        },
      });
      assert.strictEqual(res.status, 200);

      const setCookie = res.headers.get('set-cookie');
      assert.ok(setCookie, 'Must set cookie clearing header');
      assert.ok(setCookie.includes('Path=/api/v1/auth'), 'Must clear on /api/v1/auth path');

      // Subsequent refresh with that token must be rejected
      const refreshRes = await fetch(`${baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: rotatedCookieHeader,
        },
      });
      assert.strictEqual(refreshRes.status, 401, 'Logged out refresh token must be rejected');
    });

    // Log back in to obtain fresh tokens for remaining tests
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailA, password: 'OwnerPassword123!' }),
    });
    const freshLogin = await loginRes.json();
    ownerATokens = freshLogin.data;

    // -------------------------------------------------------------------------
    // 6. SERVER-SIDE MFA ENROLLMENT (SEC-04)
    // -------------------------------------------------------------------------
    console.log('\n--- 6. Server-Side MFA Pending State (SEC-04) ---');

    let mfaSecret;
    await test('MFA Setup: Generates secret and stores encrypted pending state in Redis (SEC-04)', async () => {
      const res = await fetch(`${baseUrl}/auth/mfa/setup`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${ownerATokens.accessToken}`,
        },
      });
      assert.strictEqual(res.status, 201);
      const json = await res.json();
      assert.ok(json.data.secret, 'Must return secret');
      assert.ok(json.data.otpauthUrl.startsWith('otpauth://totp/'));
      mfaSecret = json.data.secret;

      // Verify Redis contains encrypted pending secret for this user
      const pendingInRedis = await redis.get(`mfa:pending:${ownerA.id}`);
      assert.ok(pendingInRedis, 'Secret must be stored in Redis under mfa:pending:userId');
      const decrypted = cryptoService.decrypt(pendingInRedis);
      assert.strictEqual(decrypted, mfaSecret, 'Decrypted secret in Redis must match generated secret');

      const ttl = await redis.ttl(`mfa:pending:${ownerA.id}`);
      assert.ok(ttl > 0 && ttl <= 600, 'Pending secret must have 600s TTL');
    });

    await test('MFA Enable: Does NOT accept encryptedSecret from client, activates from Redis', async () => {
      const code = generateSync({ secret: mfaSecret });

      // Client only submits token code (no client-submitted ciphertext)
      const res = await fetch(`${baseUrl}/auth/mfa/enable`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ownerATokens.accessToken}`,
        },
        body: JSON.stringify({ token: code }),
      });
      assert.strictEqual(res.status, 200);

      // Verify user has mfaEnabled = true in DB
      const userInDb = await prisma.user.findUnique({ where: { id: ownerA.id } });
      assert.strictEqual(userInDb.mfaEnabled, true);
      assert.ok(userInDb.mfaSecret, 'Database must have encrypted secret');

      // Verify Redis pending key was cleared
      const pendingAfter = await redis.get(`mfa:pending:${ownerA.id}`);
      assert.strictEqual(pendingAfter, null, 'Pending key must be cleaned up from Redis');
    });

    // -------------------------------------------------------------------------
    // 7. /AUTH/ME TENANT CONTEXT & PROTECTION (SEC-11, ARCH-01)
    // -------------------------------------------------------------------------
    console.log('\n--- 7. /auth/me Profile & Tenant Protection (SEC-11, ARCH-01) ---');

    await test('/auth/me: Anonymous request rejected with 401 (Global fail-closed JwtAuthGuard)', async () => {
      const res = await fetch(`${baseUrl}/auth/me`);
      assert.strictEqual(res.status, 401, 'Anonymous request must be rejected');
    });

    await test('/auth/me: Populates activeTenant context matching token org (SEC-11 fix)', async () => {
      const res = await fetch(`${baseUrl}/auth/me`, {
        headers: {
          Authorization: `Bearer ${ownerATokens.accessToken}`,
        },
      });
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.data.user.email, emailA);
      assert.ok(json.data.activeTenant, 'activeTenant must NOT be null (SEC-11 fix)');
      assert.strictEqual(json.data.activeTenant.organizationId, tenantA.id);
      assert.strictEqual(json.data.activeTenant.roleName, 'OWNER');
    });

    await test('/auth/me: Cross-tenant organizationId header is rejected with 403 (TenantGuard isolation)', async () => {
      const res = await fetch(`${baseUrl}/auth/me`, {
        headers: {
          Authorization: `Bearer ${ownerATokens.accessToken}`,
          'x-organization-id': tenantB.id, // Foreign organization
        },
      });
      assert.strictEqual(res.status, 403, 'Cross-tenant organization ID must be rejected with 403');
    });

    // -------------------------------------------------------------------------
    // 8. INVITATION BOUNDARY & ANTI-TAKEOVER (LOCKED DECISION 1 & 2, SEC-05, SEC-06)
    // -------------------------------------------------------------------------
    console.log('\n--- 8. Controlled Invitations & Anti-Takeover (Locked Decisions 1 & 2) ---');

    // Create an ADMIN in Tenant A with MFA enabled to test privilege boundary
    const adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: 'dummy',
        status: 'ACTIVE',
        firstName: 'Admin',
        lastName: 'User',
        mfaEnabled: true, // Satisfies MfaGuard so we test the usersService OWNER boundary
      },
    });
    const adminRole = await prisma.role.findFirst({ where: { name: 'ADMIN', isSystem: true } });
    await prisma.membership.create({
      data: {
        organizationId: tenantA.id,
        userId: adminUser.id,
        roleId: adminRole.id,
        status: 'ACTIVE',
      },
    });

    // Generate token for admin
    const { TokenService } = require('../apps/api/dist/auth/token.service');
    const { JwtService } = require('@nestjs/jwt');
    const jwtSvc = new JwtService({ secret: process.env.JWT_SECRET });
    const tokSvc = new TokenService(jwtSvc, redis);
    const adminAccessToken = await tokSvc.generateAccessToken({
      sub: adminUser.id,
      email: adminUser.email,
      orgId: tenantA.id,
      roleId: adminRole.id,
    });

    await test('Locked Decision 2: ADMIN inviting OWNER is rejected with 403 Forbidden', async () => {
      const res = await fetch(`${baseUrl}/users/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminAccessToken}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({
          email: 'newowner@acme.com',
          roleName: 'OWNER',
        }),
      });
      assert.strictEqual(res.status, 403);
      const json = await res.json();
      assert.ok(json.message.includes('Only an OWNER can invite or assign the OWNER role'));
    });

    let staffInviteToken;
    await test('Invitation: OWNER invites new user with STAFF role successfully', async () => {
      const res = await fetch(`${baseUrl}/users/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ownerATokens.accessToken}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({
          email: staffEmail,
          roleName: 'STAFF',
        }),
      });
      assert.strictEqual(res.status, 201);
      const json = await res.json();
      assert.ok(json.inviteToken, 'Must generate inviteToken');
      staffInviteToken = json.inviteToken;
    });

    await test('Accept Invite: New user sets password and activates account', async () => {
      const res = await fetch(`${baseUrl}/auth/accept-invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: staffInviteToken,
          password: 'StaffInitialPassword123!',
          firstName: 'Sam',
          lastName: 'Staff',
        }),
      });
      assert.strictEqual(res.status, 200);

      invitedUser = await prisma.user.findUnique({ where: { email: staffEmail } });
      assert.ok(invitedUser);
      assert.strictEqual(invitedUser.status, 'ACTIVE');
      assert.strictEqual(invitedUser.firstName, 'Sam');
    });

    // Test Locked Decision 1: Existing account anti-takeover
    // Owner B invites the existing staff user to Foreign Tenant B
    let crossOrgInviteToken;
    await test('Locked Decision 1: Owner B invites existing user to Tenant B', async () => {
      // 1. Login Owner B to obtain accessToken
      const loginBRes = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailB, password: 'OwnerPassword123!' }),
      });
      const loginBData = (await loginBRes.json()).data;
      assert.ok(loginBData?.accessToken, 'Owner B must obtain accessToken');

      // 2. Enable MFA in DB so MfaGuard permits privileged operations
      await prisma.user.update({
        where: { id: ownerB.id },
        data: { mfaEnabled: true },
      });

      const inviteRes = await fetch(`${baseUrl}/users/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${loginBData.accessToken}`,
          'x-organization-id': tenantB.id,
        },
        body: JSON.stringify({
          email: staffEmail,
          roleName: 'STAFF',
        }),
      });
      assert.strictEqual(inviteRes.status, 201);
      crossOrgInviteToken = (await inviteRes.json()).inviteToken;
    });

    await test('Locked Decision 1: Accepting invite with wrong password fails (401)', async () => {
      const res = await fetch(`${baseUrl}/auth/accept-invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: crossOrgInviteToken,
          password: 'WrongPassword!',
        }),
      });
      assert.strictEqual(res.status, 401);
    });

    await test('Locked Decision 1: Accepting invite verifies password, NEVER overwrites profile/password', async () => {
      const originalPasswordHash = invitedUser.passwordHash;
      const originalFirstName = invitedUser.firstName;

      const res = await fetch(`${baseUrl}/auth/accept-invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: crossOrgInviteToken,
          password: 'StaffInitialPassword123!', // Valid existing password
          firstName: 'AttackerOverwrittenName',
          lastName: 'AttackerOverwrittenLast',
        }),
      });
      assert.strictEqual(res.status, 200);

      // Verify user profile and passwordHash were NOT overwritten
      const userAfter = await prisma.user.findUnique({ where: { email: staffEmail } });
      assert.strictEqual(
        userAfter.passwordHash,
        originalPasswordHash,
        'CRITICAL: Password hash must NOT be overwritten (Locked Decision 1)'
      );
      assert.strictEqual(
        userAfter.firstName,
        originalFirstName,
        'CRITICAL: Name must NOT be overwritten (Locked Decision 1)'
      );

      // Verify membership in Tenant B is now ACTIVE
      const membershipB = await prisma.membership.findFirst({
        where: { organizationId: tenantB.id, userId: userAfter.id },
      });
      assert.ok(membershipB);
      assert.strictEqual(membershipB.status, 'ACTIVE');
    });

    // -------------------------------------------------------------------------
    // 9. CROSS-TENANT TICKET INTEGRITY & BOLA (SEC-02)
    // -------------------------------------------------------------------------
    console.log('\n--- 9. Cross-Tenant Ticket Integrity (SEC-02 BOLA Fix) ---');

    // Create Contacts and Services in Tenant A and Tenant B
    tenantAContact = await prisma.contact.create({
      data: {
        organizationId: tenantA.id,
        name: 'Contact Alpha',
        email: 'alpha-contact@acme.com',
      },
    });

    tenantBContact = await prisma.contact.create({
      data: {
        organizationId: tenantB.id,
        name: 'Foreign Contact Beta',
        email: 'beta-contact@foreign.com',
      },
    });

    tenantAService = await prisma.service.create({
      data: {
        organizationId: tenantA.id,
        name: 'Alpha Repair Service',
        priceAmount: 150,
      },
    });

    tenantBService = await prisma.service.create({
      data: {
        organizationId: tenantB.id,
        name: 'Beta Foreign Service',
        priceAmount: 300,
      },
    });

    await test('Ticket BOLA: Creating ticket in Tenant A with foreign contactId (Tenant B) is rejected (404/400)', async () => {
      const res = await fetch(`${baseUrl}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ownerATokens.accessToken}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({
          title: 'Cross Tenant Malicious Ticket',
          contactId: tenantBContact.id, // Foreign contact!
        }),
      });
      assert.ok(
        res.status === 404 || res.status === 400,
        `Expected 404/400 for cross-tenant contact, got ${res.status}`
      );
    });

    await test('Ticket BOLA: Creating ticket in Tenant A with foreign serviceId (Tenant B) is rejected (404/400)', async () => {
      const res = await fetch(`${baseUrl}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ownerATokens.accessToken}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({
          title: 'Cross Tenant Service Malicious Ticket',
          contactId: tenantAContact.id,
          serviceId: tenantBService.id, // Foreign service!
        }),
      });
      assert.ok(
        res.status === 404 || res.status === 400,
        `Expected 404/400 for cross-tenant service, got ${res.status}`
      );
    });

    await test('Ticket: Valid creation within Tenant A succeeds (201)', async () => {
      const res = await fetch(`${baseUrl}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ownerATokens.accessToken}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({
          title: 'Legitimate Ticket in Tenant A',
          contactId: tenantAContact.id,
          serviceId: tenantAService.id,
          priority: 'HIGH',
        }),
      });
      assert.strictEqual(res.status, 201);
      const json = await res.json();
      assert.strictEqual(json.data.title, 'Legitimate Ticket in Tenant A');
      assert.strictEqual(json.data.organizationId, tenantA.id);
      createdTicketA = json.data;
    });

    // -------------------------------------------------------------------------
    // 10. INPUT VALIDATION ON TICKETS (SEC-07)
    // -------------------------------------------------------------------------
    console.log('\n--- 10. Request Validation on Tickets (SEC-07) ---');

    await test('Ticket Validation: Invalid priority enum returns 400 Bad Request', async () => {
      const res = await fetch(`${baseUrl}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ownerATokens.accessToken}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({
          title: 'Valid Title',
          priority: 'SUPER_URGENT_INVALID',
        }),
      });
      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert.strictEqual(json.code, 'VALIDATION_FAILED');
    });

    await test('Ticket Validation: Empty title returns 400 Bad Request', async () => {
      const res = await fetch(`${baseUrl}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ownerATokens.accessToken}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({
          title: '',
        }),
      });
      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert.strictEqual(json.code, 'VALIDATION_FAILED');
    });
  } finally {
    console.log('\n--- Teardown: Purging test entities from database ---');
    try {
      const orgIds = [tenantA?.id, tenantB?.id].filter(Boolean);

      if (orgIds.length > 0) {
        await prisma.ticket.deleteMany({ where: { organizationId: { in: orgIds } } });
        await prisma.contact.deleteMany({ where: { organizationId: { in: orgIds } } });
        await prisma.service.deleteMany({ where: { organizationId: { in: orgIds } } });
        await prisma.technician.deleteMany({ where: { organizationId: { in: orgIds } } });
        await prisma.auditEvent.deleteMany({ where: { organizationId: { in: orgIds } } });
        await prisma.membership.deleteMany({ where: { organizationId: { in: orgIds } } });
        await prisma.organization.deleteMany({ where: { id: { in: orgIds } } });
      }

      const userEmails = [
        emailA,
        emailB,
        staffEmail,
        adminEmail,
      ].filter(Boolean);

      if (userEmails.length > 0) {
        await prisma.user.deleteMany({ where: { email: { in: userEmails } } });
      }

      await prisma.auditEvent.deleteMany({});

      console.log('✓ Teardown complete: Zero dirty test records remain.');
    } catch (e) {
      console.error('Teardown warning:', e.message);
    }

    await app.close();
    await prisma.$disconnect();
    redis.disconnect();
  }

  // Summary
  console.log('\n============================================================');
  const passed = testResults.filter((t) => t.passed).length;
  const failed = testResults.filter((t) => !t.passed).length;
  console.log(`HTTP INTEGRATION SUITE: ${passed} PASSED, ${failed} FAILED (${testResults.length} total)`);
  console.log('============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

run().catch((e) => {
  console.error('Fatal test runner error:', e);
  process.exit(1);
});
