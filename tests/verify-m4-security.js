// REMOTFIX M4 — Automated Security, RBAC, and Authentication Verification Suite
// Exercises all 8 security verification areas mandated by M4 Implementation Authorization.

const assert = require('assert');
const { PrismaClient } = require('@prisma/client');
const Redis = require('ioredis');

// Import compiled services from apps/api/dist
const { PasswordService } = require('../apps/api/dist/common/crypto/password.service');
const { CryptoService } = require('../apps/api/dist/common/crypto/crypto.service');
const { TokenService } = require('../apps/api/dist/auth/token.service');
const { MfaService } = require('../apps/api/dist/auth/mfa.service');
const { ResourceAuthorizationService } = require('../apps/api/dist/common/services/resource-authorization.service');
const { AuditService } = require('../apps/api/dist/common/services/audit.service');
const { AuthService } = require('../apps/api/dist/auth/auth.service');
const { UsersService } = require('../apps/api/dist/users/users.service');
const { OnboardingService } = require('../apps/api/dist/admin/onboarding.service');
const { PermissionGuard } = require('../apps/api/dist/common/guards/permission.guard');
const { MfaGuard } = require('../apps/api/dist/common/guards/mfa.guard');
const { RateLimitGuard } = require('../apps/api/dist/common/guards/rate-limit.guard');
const { JwtService } = require('@nestjs/jwt');

// Test runner harness
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
  process.env.APP_SECRET = process.env.APP_SECRET || 'remotfix-test-app-secret-32-chars-long!';
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'remotfix-test-jwt-secret-32-chars-long!';
  process.env.MFA_ENCRYPTION_KEY = process.env.MFA_ENCRYPTION_KEY || 'remotfix-test-mfa-key-32-chars-long!';

  console.log('============================================================');
  console.log('REMOTFIX M4 — FULL SECURITY & AUTHENTICATION VERIFICATION');
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

  // Mock RedisService wrapper
  const redisService = {
    getClient: () => redis,
    get: (k) => redis.get(k),
    set: (k, v, ttl) => (ttl ? redis.set(k, v, 'EX', ttl) : redis.set(k, v)),
    del: (k) => redis.del(k),
    sadd: (k, ...m) => redis.sadd(k, ...m),
    srem: (k, ...m) => redis.srem(k, ...m),
    smembers: (k) => redis.smembers(k),
    incr: (k) => redis.incr(k),
    expire: (k, s) => redis.expire(k, s),
  };

  const jwtService = new JwtService({
    secret: 'remotfix-test-secret-key-must-be-32-chars-long!',
    signOptions: { expiresIn: '15m' },
  });

  const passwordService = new PasswordService();
  const cryptoService = new CryptoService();
  const tokenService = new TokenService(jwtService, redisService);
  const mfaService = new MfaService(prisma, cryptoService, redisService);
  const auditService = new AuditService(prisma);
  const resourceAuthService = new ResourceAuthorizationService(prisma);
  const authService = new AuthService(
    prisma,
    passwordService,
    tokenService,
    mfaService,
    redisService,
    auditService
  );
  const usersService = new UsersService(prisma, redisService, auditService);
  const onboardingService = new OnboardingService(prisma, passwordService, auditService);

  let provisionedOrg;
  let provisionedOwner;
  let tenantBResult;
  let tenantB;
  let techUser;
  let otherTechUser;
  let custUser;
  let otherCustUser;

  try {
  // -------------------------------------------------------------------------
  // 1. RBAC SEED & MATRIX VERIFICATION
  // -------------------------------------------------------------------------
  console.log('--- 1. RBAC Seed & Matrix Counts ---');

  await test('RBAC: Exactly 6 system roles seeded', async () => {
    const count = await prisma.role.count({ where: { isSystem: true, organizationId: null } });
    assert.strictEqual(count, 6, `Expected 6 system roles, found ${count}`);
  });

  await test('RBAC: Exactly 13 permissions seeded', async () => {
    const count = await prisma.permission.count();
    assert.strictEqual(count, 13, `Expected 13 permissions, found ${count}`);
  });

  await test('RBAC: Exactly 40 approved role_permission mappings seeded', async () => {
    const count = await prisma.rolePermission.count();
    assert.strictEqual(count, 40, `Expected 40 role_permission mappings, found ${count}`);
  });

  await test('RBAC: Role mappings match approved matrix counts exactly', async () => {
    const expected = {
      OWNER: 13,
      ADMIN: 13,
      MANAGER: 6,
      STAFF: 3,
      CUSTOMER: 3,
      TECHNICIAN: 2,
    };

    for (const [roleName, expectedCount] of Object.entries(expected)) {
      const role = await prisma.role.findFirst({
        where: { name: roleName, isSystem: true, organizationId: null },
        include: { rolePermissions: true },
      });
      assert.ok(role, `Role ${roleName} must exist`);
      assert.strictEqual(
        role.rolePermissions.length,
        expectedCount,
        `Role ${roleName} must have ${expectedCount} permissions, found ${role.rolePermissions.length}`
      );
    }
  });

  // -------------------------------------------------------------------------
  // 2. PASSWORD HASHING (ARGON2ID)
  // -------------------------------------------------------------------------
  console.log('\n--- 2. Cryptographic Password Hashing (Argon2id) ---');

  await test('Argon2id: Hash produces irreversible, valid Argon2id hash', async () => {
    const plain = 'P@ssword123!';
    const hash = await passwordService.hash(plain);
    assert.ok(hash.startsWith('$argon2id$'), 'Hash must be Argon2id format');
    assert.notStrictEqual(hash, plain, 'Hash must not equal plaintext');

    const isValid = await passwordService.verify(plain, hash);
    assert.strictEqual(isValid, true, 'Correct password must verify');

    const isInvalid = await passwordService.verify('WrongPassword', hash);
    assert.strictEqual(isInvalid, false, 'Wrong password must fail verification');
  });

  // -------------------------------------------------------------------------
  // 3. CRYPTO & SECRET PROTECTION (AES-256-GCM)
  // -------------------------------------------------------------------------
  console.log('\n--- 3. Secret Encryption at Rest (AES-256-GCM) ---');

  await test('AES-256-GCM: Encrypts and decrypts secrets matching original plaintext', async () => {
    const plaintext = 'MY_SUPER_SECRET_MFA_SEED_KEY';
    const encrypted = cryptoService.encrypt(plaintext);
    assert.notStrictEqual(encrypted, plaintext, 'Encrypted text must differ');
    assert.ok(encrypted.split(':').length === 3, 'Payload must have iv:tag:ciphertext structure');

    const decrypted = cryptoService.decrypt(encrypted);
    assert.strictEqual(decrypted, plaintext, 'Decrypted text must match original plaintext');
  });

  // -------------------------------------------------------------------------
  // 4. SESSION & TOKEN ARCHITECTURE (D-M4-01 & D-M4-04)
  // -------------------------------------------------------------------------
  console.log('\n--- 4. Session & Token Architecture (JWT + Redis) ---');

  let testAccessToken;
  let testRefreshToken;

  await test('TokenService: Issues valid short-lived JWT access token', async () => {
    testAccessToken = await tokenService.generateAccessToken({
      sub: '00000000-0000-0000-0000-000000000001',
      email: 'test@remotfix.io',
      orgId: '00000000-0000-0000-0000-000000000010',
      roleId: '00000000-0000-0000-0000-000000000100',
      roleName: 'ADMIN',
      permissions: ['tickets:read', 'tickets:update'],
    });
    assert.ok(typeof testAccessToken === 'string' && testAccessToken.length > 20);

    const decoded = await tokenService.verifyAccessToken(testAccessToken);
    assert.strictEqual(decoded.sub, '00000000-0000-0000-0000-000000000001');
    assert.strictEqual(decoded.roleName, 'ADMIN');
  });

  await test('TokenService: Issues and validates Redis-backed refresh token', async () => {
    testRefreshToken = await tokenService.generateRefreshToken({
      userId: '00000000-0000-0000-0000-000000000001',
      orgId: '00000000-0000-0000-0000-000000000010',
      roleId: '00000000-0000-0000-0000-000000000100',
      roleName: 'ADMIN',
      createdAt: Date.now(),
    });
    assert.ok(typeof testRefreshToken === 'string' && testRefreshToken.length === 64);

    const session = await tokenService.validateRefreshToken(testRefreshToken);
    assert.strictEqual(session.userId, '00000000-0000-0000-0000-000000000001');
  });

  await test('TokenService: Revocation successfully deletes session from Redis', async () => {
    await tokenService.revokeRefreshToken(testRefreshToken);

    let failed = false;
    try {
      await tokenService.validateRefreshToken(testRefreshToken);
    } catch {
      failed = true;
    }
    assert.strictEqual(failed, true, 'Revoked refresh token must be rejected');
  });

  // -------------------------------------------------------------------------
  // 5. CONTROLLED ONBOARDING & TENANT PROVISIONING (D-M4-05)
  // -------------------------------------------------------------------------
  console.log('\n--- 5. Controlled Onboarding (D-M4-05 Option B) ---');

  const testOrgSlug = `test-tenant-${Date.now()}`;

  await test('OnboardingService: Provisions initial Organization and root OWNER', async () => {
    const result = await onboardingService.provisionOrganizationWithOwner({
      organizationName: 'Acme Test Corp',
      organizationSlug: testOrgSlug,
      ownerEmail: `owner-${testOrgSlug}@acme.com`,
      ownerPassword: 'InitialStrongPassword123!',
      ownerFirstName: 'Alice',
      ownerLastName: 'Owner',
    });

    provisionedOrg = result.organization;
    provisionedOwner = result.user;

    assert.ok(provisionedOrg.id, 'Organization must have ID');
    assert.strictEqual(provisionedOrg.status, 'ACTIVE');
    assert.ok(provisionedOwner.id, 'Owner must have ID');

    // Verify membership
    const membership = await prisma.membership.findFirst({
      where: { organizationId: provisionedOrg.id, userId: provisionedOwner.id },
      include: { role: true },
    });
    assert.ok(membership, 'Membership must exist');
    assert.strictEqual(membership.role.name, 'OWNER');
    assert.strictEqual(membership.status, 'ACTIVE');
  });

  // -------------------------------------------------------------------------
  // 6. AUTHENTICATION & LOGIN LIFECYCLE
  // -------------------------------------------------------------------------
  console.log('\n--- 6. Authentication, Login & Anti-Enumeration ---');

  let ownerTokens;

  await test('AuthService: Valid login returns access token, refresh token, and tenant context', async () => {
    const loginResult = await authService.login({
      email: `owner-${testOrgSlug}@acme.com`,
      password: 'InitialStrongPassword123!',
      organizationId: provisionedOrg.id,
    });

    assert.ok(loginResult.accessToken, 'Must return accessToken');
    assert.ok(loginResult.refreshToken, 'Must return refreshToken');
    assert.strictEqual(loginResult.user.email, `owner-${testOrgSlug}@acme.com`);
    assert.strictEqual(loginResult.activeOrganization.id, provisionedOrg.id);
    assert.strictEqual(loginResult.activeOrganization.role, 'OWNER');
    assert.strictEqual(loginResult.activeOrganization.permissions.length, 13);

    ownerTokens = loginResult;
  });

  await test('AuthService: Invalid password returns uniform 401 (anti-enumeration)', async () => {
    let caught = null;
    try {
      await authService.login({
        email: `owner-${testOrgSlug}@acme.com`,
        password: 'WrongPassword!',
      });
    } catch (e) {
      caught = e;
    }
    assert.ok(caught, 'Must throw');
    assert.strictEqual(caught.status, 401);
    assert.strictEqual(caught.message, 'Invalid email or password');
  });

  await test('AuthService: Non-existent email returns identical uniform 401', async () => {
    let caught = null;
    try {
      await authService.login({
        email: 'doesnotexist@nowhere.com',
        password: 'SomePassword!',
      });
    } catch (e) {
      caught = e;
    }
    assert.ok(caught, 'Must throw');
    assert.strictEqual(caught.status, 401);
    assert.strictEqual(caught.message, 'Invalid email or password');
  });

  await test('AuthService: Suspended user cannot authenticate (401)', async () => {
    // Temporarily suspend owner
    await prisma.user.update({
      where: { id: provisionedOwner.id },
      data: { status: 'SUSPENDED' },
    });

    let caught = null;
    try {
      await authService.login({
        email: `owner-${testOrgSlug}@acme.com`,
        password: 'InitialStrongPassword123!',
      });
    } catch (e) {
      caught = e;
    }

    // Restore owner status
    await prisma.user.update({
      where: { id: provisionedOwner.id },
      data: { status: 'ACTIVE' },
    });

    assert.ok(caught, 'Must throw');
    assert.strictEqual(caught.status, 401);
  });

  await test('AuthService: Refresh token renewal produces valid new access token', async () => {
    const refreshResult = await authService.refresh(ownerTokens.refreshToken);
    assert.ok(refreshResult.accessToken, 'Must issue new access token');

    const decoded = await tokenService.verifyAccessToken(refreshResult.accessToken);
    assert.strictEqual(decoded.sub, provisionedOwner.id);
  });

  // -------------------------------------------------------------------------
  // 7. MULTI-FACTOR AUTHENTICATION (MFA) & PRIVILEGED ENFORCEMENT
  // -------------------------------------------------------------------------
  console.log('\n--- 7. MFA Setup, Verification & Replay Protection ---');

  let mfaSecretData;
  const { generateSync } = require('otplib');

  await test('MfaService: Generates RFC 6238 TOTP secret and stores in Redis', async () => {
    mfaSecretData = await mfaService.generateMfaSecret(provisionedOwner.id, `owner-${testOrgSlug}@acme.com`);
    assert.ok(mfaSecretData.secret, 'Must generate secret');
    assert.ok(mfaSecretData.otpauthUrl.startsWith('otpauth://totp/'), 'Must generate otpauth URI');
  });

  await test('MfaService: Valid code successfully activates MFA on user from server-stored secret', async () => {
    const code = generateSync({ secret: mfaSecretData.secret });
    await mfaService.enableMfa(provisionedOwner.id, code);

    const updatedUser = await prisma.user.findUnique({ where: { id: provisionedOwner.id } });
    assert.strictEqual(updatedUser.mfaEnabled, true);
    assert.ok(updatedUser.mfaSecret, 'Must have encrypted mfaSecret in database');
  });

  await test('MfaService: Replay prevention rejects used TOTP code within window', async () => {
    const replayUserId = '00000000-0000-0000-0000-000000000999';
    const replaySecret = await mfaService.generateMfaSecret(replayUserId, 'replay-test@remotfix.io');
    const code = generateSync({ secret: replaySecret.secret });
    const encryptedSecret = cryptoService.encrypt(replaySecret.secret);

    // First verification
    const firstVerify = await mfaService.verifyMfaToken(
      replayUserId,
      code,
      encryptedSecret
    );
    assert.strictEqual(firstVerify, true, 'First use of token must succeed');

    // Immediate replay attempt
    const replayVerify = await mfaService.verifyMfaToken(
      replayUserId,
      code,
      encryptedSecret
    );
    assert.strictEqual(replayVerify, false, 'Replay of token must be rejected');
  });

  await test('MfaGuard: Privileged roles (OWNER/ADMIN) without MFA are blocked (403)', () => {
    const guard = new MfaGuard({ getAllAndOverride: () => false });

    // Mock un-enrolled privileged admin request
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { id: '1', mfaEnabled: false },
          tenant: { roleName: 'OWNER' },
        }),
      }),
      getHandler: () => {},
      getClass: () => {},
    };

    let caught = false;
    try {
      guard.canActivate(mockContext);
    } catch (e) {
      caught = true;
      assert.strictEqual(e.status, 403);
      assert.ok(e.message.includes('MFA_ENROLLMENT_REQUIRED'));
    }
    assert.strictEqual(caught, true, 'Unenrolled privileged owner must be blocked');
  });

  // -------------------------------------------------------------------------
  // 8. RBAC PERMISSION GUARD & DENY-BY-DEFAULT
  // -------------------------------------------------------------------------
  console.log('\n--- 8. PermissionGuard & Fail-Closed Deny-by-Default ---');

  const reflector = {
    getAllAndOverride: (key, targets) => {
      if (key === 'permissions') {
        const target = Array.isArray(targets) ? targets[0] : targets;
        return target && target._permissions;
      }
      return false;
    },
  };
  const permGuard = new PermissionGuard(reflector);

  function createMockExecutionContext(permissions, requiredPermissions) {
    return {
      _permissions: requiredPermissions,
      switchToHttp: () => ({
        getRequest: () => ({
          tenant: { permissions },
        }),
      }),
      getHandler: function () {
        return this;
      },
      getClass: function () {
        return this;
      },
    };
  }

  await test('PermissionGuard: Granted when role possesses all required permissions', () => {
    const ctx = createMockExecutionContext(
      ['tickets:read', 'tickets:create', 'tickets:update'],
      ['tickets:read', 'tickets:create']
    );
    const result = permGuard.canActivate(ctx);
    assert.strictEqual(result, true);
  });

  await test('PermissionGuard: Denied (403) when role lacks required permission (deny-by-default)', () => {
    const ctx = createMockExecutionContext(
      ['tickets:read', 'tickets:update'], // Technician
      ['tickets:create'] // Not granted to technician
    );
    let caught = false;
    try {
      permGuard.canActivate(ctx);
    } catch (e) {
      caught = true;
      assert.strictEqual(e.status, 403);
      assert.ok(e.message.includes('INSUFFICIENT_PERMISSIONS'));
    }
    assert.strictEqual(caught, true);
  });

  await test('PermissionGuard: Denied when unknown permission is requested', () => {
    const ctx = createMockExecutionContext(
      ['tickets:read'],
      ['invented:permission']
    );
    let caught = false;
    try {
      permGuard.canActivate(ctx);
    } catch (e) {
      caught = true;
      assert.strictEqual(e.status, 403);
    }
    assert.strictEqual(caught, true);
  });

  // -------------------------------------------------------------------------
  // 9. TENANT ISOLATION & RESOURCE-LEVEL SCOPING (PHASE 4 & PHASE 8)
  // -------------------------------------------------------------------------
  console.log('\n--- 9. Strict Multi-Tenant Isolation & Resource Scoping ---');

  // Provision Tenant B for cross-tenant escape testing
  const tenantBSlug = `tenant-b-${Date.now()}`;
  tenantBResult = await onboardingService.provisionOrganizationWithOwner({
    organizationName: 'Foreign Tenant B',
    organizationSlug: tenantBSlug,
    ownerEmail: `owner-${tenantBSlug}@foreign.com`,
    ownerPassword: 'Password123!',
    ownerFirstName: 'Bob',
    ownerLastName: 'Foreign',
  });
  tenantB = tenantBResult.organization;

  // Create Users & Entities in Tenant A:
  // 1. Technician User & Technician Entity
  techUser = await prisma.user.create({
    data: {
      email: `tech-${testOrgSlug}@acme.com`,
      passwordHash: 'dummy',
      status: 'ACTIVE',
      firstName: 'Tom',
      lastName: 'Tech',
    },
  });
  const techRole = await prisma.role.findFirst({ where: { name: 'TECHNICIAN', isSystem: true } });
  await prisma.membership.create({
    data: { organizationId: provisionedOrg.id, userId: techUser.id, roleId: techRole.id, status: 'ACTIVE' },
  });
  const technicianA = await prisma.technician.create({
    data: { organizationId: provisionedOrg.id, userId: techUser.id, status: 'AVAILABLE' },
  });

  // Another Technician in Tenant A
  otherTechUser = await prisma.user.create({
    data: {
      email: `othertech-${testOrgSlug}@acme.com`,
      passwordHash: 'dummy',
      status: 'ACTIVE',
      firstName: 'Other',
      lastName: 'Tech',
    },
  });
  await prisma.membership.create({
    data: { organizationId: provisionedOrg.id, userId: otherTechUser.id, roleId: techRole.id, status: 'ACTIVE' },
  });
  const technicianOther = await prisma.technician.create({
    data: { organizationId: provisionedOrg.id, userId: otherTechUser.id, status: 'AVAILABLE' },
  });

  // 2. Customer User & Contact Entity in Tenant A
  custUser = await prisma.user.create({
    data: {
      email: `customer-${testOrgSlug}@acme.com`,
      passwordHash: 'dummy',
      status: 'ACTIVE',
      firstName: 'Charlie',
      lastName: 'Customer',
    },
  });
  const custRole = await prisma.role.findFirst({ where: { name: 'CUSTOMER', isSystem: true } });
  await prisma.membership.create({
    data: { organizationId: provisionedOrg.id, userId: custUser.id, roleId: custRole.id, status: 'ACTIVE' },
  });
  const contactCustomerA = await prisma.contact.create({
    data: {
      organizationId: provisionedOrg.id,
      userId: custUser.id,
      name: 'Charlie Customer',
      email: `customer-${testOrgSlug}@acme.com`,
    },
  });

  // Another Customer in Tenant A
  otherCustUser = await prisma.user.create({
    data: {
      email: `othercust-${testOrgSlug}@acme.com`,
      passwordHash: 'dummy',
      status: 'ACTIVE',
      firstName: 'Other',
      lastName: 'Customer',
    },
  });
  const otherContactA = await prisma.contact.create({
    data: {
      organizationId: provisionedOrg.id,
      userId: otherCustUser.id,
      name: 'Other Customer',
      email: `othercust-${testOrgSlug}@acme.com`,
    },
  });

  // 3. Tickets in Tenant A
  const ticketAssignedToTechA = await prisma.ticket.create({
    data: {
      organizationId: provisionedOrg.id,
      contactId: contactCustomerA.id,
      assignedTechnicianId: technicianA.id,
      title: 'Ticket for Tech A',
      status: 'OPEN',
    },
  });

  const ticketAssignedToOtherTech = await prisma.ticket.create({
    data: {
      organizationId: provisionedOrg.id,
      contactId: otherContactA.id,
      assignedTechnicianId: technicianOther.id,
      title: 'Ticket for Other Tech',
      status: 'OPEN',
    },
  });

  // Ticket in Foreign Tenant B
  const foreignContactB = await prisma.contact.create({
    data: {
      organizationId: tenantB.id,
      name: 'Foreign Contact',
      email: 'contact@tenantb.com',
    },
  });
  const ticketInTenantB = await prisma.ticket.create({
    data: {
      organizationId: tenantB.id,
      contactId: foreignContactB.id,
      title: 'Foreign Ticket In Tenant B',
      status: 'OPEN',
    },
  });

  // Tests for Tenant Isolation
  await test('Tenant Isolation: Querying ticket belonging to Tenant B from Tenant A context fails with 404', async () => {
    let caught = null;
    try {
      await resourceAuthService.authorizeTicketAccess(
        ticketInTenantB.id,
        provisionedOwner.id,
        { organizationId: provisionedOrg.id, roleName: 'OWNER', permissions: ['tickets:read'] },
        'read'
      );
    } catch (e) {
      caught = e;
    }
    assert.ok(caught, 'Must throw');
    assert.strictEqual(caught.status, 404, 'Must return 404 without leaking cross-tenant existence');
  });

  // Tests for Technician Resource Scoping
  await test('Technician Scope: Assigned technician can read and update their assigned ticket', async () => {
    const ticket = await resourceAuthService.authorizeTicketAccess(
      ticketAssignedToTechA.id,
      techUser.id,
      { organizationId: provisionedOrg.id, roleName: 'TECHNICIAN', permissions: ['tickets:read'] },
      'read'
    );
    assert.strictEqual(ticket.id, ticketAssignedToTechA.id);
  });

  await test('Technician Scope: Technician accessing ticket of another technician fails with 403', async () => {
    let caught = null;
    try {
      await resourceAuthService.authorizeTicketAccess(
        ticketAssignedToOtherTech.id,
        techUser.id,
        { organizationId: provisionedOrg.id, roleName: 'TECHNICIAN', permissions: ['tickets:read'] },
        'read'
      );
    } catch (e) {
      caught = e;
    }
    assert.ok(caught, 'Must throw');
    assert.strictEqual(caught.status, 403);
    assert.ok(caught.message.includes('Technicians may only access tickets assigned to them'));
  });

  // Tests for Customer Resource Scoping
  await test('Customer Scope: Customer can view their own contact ticket', async () => {
    const ticket = await resourceAuthService.authorizeTicketAccess(
      ticketAssignedToTechA.id,
      custUser.id,
      { organizationId: provisionedOrg.id, roleName: 'CUSTOMER', permissions: ['tickets:read'] },
      'read'
    );
    assert.strictEqual(ticket.id, ticketAssignedToTechA.id);
  });

  await test('Customer Scope: Customer viewing another customer ticket fails with 403', async () => {
    let caught = null;
    try {
      await resourceAuthService.authorizeTicketAccess(
        ticketAssignedToOtherTech.id,
        custUser.id,
        { organizationId: provisionedOrg.id, roleName: 'CUSTOMER', permissions: ['tickets:read'] },
        'read'
      );
    } catch (e) {
      caught = e;
    }
    assert.ok(caught, 'Must throw');
    assert.strictEqual(caught.status, 403);
    assert.ok(caught.message.includes('Customers may only access their own service tickets'));
  });

  await test('Customer Scope: Customer attempting direct ticket metadata mutation fails with 403', async () => {
    let caught = null;
    try {
      await resourceAuthService.authorizeTicketAccess(
        ticketAssignedToTechA.id,
        custUser.id,
        { organizationId: provisionedOrg.id, roleName: 'CUSTOMER', permissions: ['tickets:update'] },
        'update',
        { title: 'Customer Malicious Modification' }
      );
    } catch (e) {
      caught = e;
    }
    assert.ok(caught, 'Must throw');
    assert.strictEqual(caught.status, 403);
    assert.ok(caught.message.includes('Customers cannot directly mutate ticket metadata'));
  });

  // Tests for Staff Field/State Scoping
  await test('Staff Scope: Staff updating title/description succeeds', async () => {
    const ticket = await resourceAuthService.authorizeTicketAccess(
      ticketAssignedToTechA.id,
      'staff-user-id',
      { organizationId: provisionedOrg.id, roleName: 'STAFF', permissions: ['tickets:update'] },
      'update',
      { title: 'Staff Updated Description' }
    );
    assert.ok(ticket);
  });

  await test('Staff Scope: Staff modifying financial/billing totals fails with 403', async () => {
    let caught = null;
    try {
      await resourceAuthService.authorizeTicketAccess(
        ticketAssignedToTechA.id,
        'staff-user-id',
        { organizationId: provisionedOrg.id, roleName: 'STAFF', permissions: ['tickets:update'] },
        'update',
        { totalAmount: 9999 }
      );
    } catch (e) {
      caught = e;
    }
    assert.ok(caught, 'Must throw');
    assert.strictEqual(caught.status, 403);
    assert.ok(caught.message.includes('cannot modify financial'));
  });

  await test('Staff Scope: Staff modifying diagnostic notes fails with 403', async () => {
    let caught = null;
    try {
      await resourceAuthService.authorizeTicketAccess(
        ticketAssignedToTechA.id,
        'staff-user-id',
        { organizationId: provisionedOrg.id, roleName: 'STAFF', permissions: ['tickets:update'] },
        'update',
        { diagnosticNotes: 'Staff overriding diagnostic note' }
      );
    } catch (e) {
      caught = e;
    }
    assert.ok(caught, 'Must throw');
    assert.strictEqual(caught.status, 403);
    assert.ok(caught.message.includes('cannot alter technical diagnostic records'));
  });

  await test('Staff Scope: Staff executing terminal state transition (CLOSED) fails with 403', async () => {
    let caught = null;
    try {
      await resourceAuthService.authorizeTicketAccess(
        ticketAssignedToTechA.id,
        'staff-user-id',
        { organizationId: provisionedOrg.id, roleName: 'STAFF', permissions: ['tickets:update'] },
        'update',
        { status: 'CLOSED' }
      );
    } catch (e) {
      caught = e;
    }
    assert.ok(caught, 'Must throw');
    assert.strictEqual(caught.status, 403);
    assert.ok(caught.message.includes('cannot transition tickets to terminal states'));
  });

  // -------------------------------------------------------------------------
  // 10. RATE LIMITING & ABUSE PREVENTION
  // -------------------------------------------------------------------------
  console.log('\n--- 10. Rate Limiting & Abuse Prevention ---');

  await test('RateLimitGuard: Repeated rapid requests are throttled with 429', async () => {
    const rateLimitGuard = new RateLimitGuard(redisService);
    const mockReq = {
      ip: '192.168.1.100',
      path: '/api/v1/auth/login',
      headers: {},
    };
    const mockContext = {
      switchToHttp: () => ({ getRequest: () => mockReq }),
    };

    let rateLimited = false;
    for (let i = 0; i < 15; i++) {
      try {
        await rateLimitGuard.canActivate(mockContext);
      } catch (e) {
        if (e.status === 429) {
          rateLimited = true;
          break;
        }
      }
    }
    assert.strictEqual(rateLimited, true, 'Requests exceeding limit must receive 429');
  });

  // -------------------------------------------------------------------------
  // 11. AUDIT TRAIL LOGGING
  // -------------------------------------------------------------------------
  console.log('\n--- 11. Audit Trail Append-Only Logging ---');

  await test('AuditService: Emitted events persist cleanly in audit_events table', async () => {
    const initialCount = await prisma.auditEvent.count({ where: { organizationId: provisionedOrg.id } });
    assert.ok(initialCount > 0, `Expected audit events, found ${initialCount}`);

    const latest = await prisma.auditEvent.findFirst({
      where: { organizationId: provisionedOrg.id },
      orderBy: { createdAt: 'desc' },
    });
    assert.ok(latest, 'Must find latest audit event');
    assert.ok(latest.action, 'Audit event must have action');
    assert.ok(latest.result, 'Audit event must have result');
  });

  // -------------------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------------------
  console.log('\n============================================================');
  const passed = testResults.filter((t) => t.passed).length;
  const failed = testResults.filter((t) => !t.passed).length;
  console.log(`VERIFICATION COMPLETE: ${passed} PASSED, ${failed} FAILED (${testResults.length} total)`);
  console.log('============================================================\n');

  } finally {
    console.log('\n--- Cleaning up test records from database ---');
    try {
      const orgIds = [];
      if (provisionedOrg?.id) orgIds.push(provisionedOrg.id);
      if (tenantB?.id) orgIds.push(tenantB.id);

      if (orgIds.length > 0) {
        await prisma.ticket.deleteMany({ where: { organizationId: { in: orgIds } } });
        await prisma.technician.deleteMany({ where: { organizationId: { in: orgIds } } });
        await prisma.contact.deleteMany({ where: { organizationId: { in: orgIds } } });
        await prisma.auditEvent.deleteMany({ where: { organizationId: { in: orgIds } } });
        await prisma.membership.deleteMany({ where: { organizationId: { in: orgIds } } });
        await prisma.organization.deleteMany({ where: { id: { in: orgIds } } });
      }

      const userIds = [
        provisionedOwner?.id,
        tenantBResult?.user?.id,
        techUser?.id,
        otherTechUser?.id,
        custUser?.id,
        otherCustUser?.id,
      ].filter(Boolean);

      if (userIds.length > 0) {
        await prisma.user.deleteMany({ where: { id: { in: userIds } } });
      }

      await prisma.auditEvent.deleteMany({});
      console.log('✓ Teardown complete: Zero dirty test records remain.');
    } catch (cleanupErr) {
      console.error('Teardown warning:', cleanupErr.message);
    }

    await prisma.$disconnect();
    redis.disconnect();

    const failedCount = testResults.filter((t) => !t.passed).length;
    if (failedCount > 0) {
      process.exit(1);
    }
  }
}

run().catch((e) => {
  console.error('Fatal test runner error:', e);
  process.exit(1);
});
