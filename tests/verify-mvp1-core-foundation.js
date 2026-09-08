// REMOTFIX — MVP-1 Core Foundation Verification Suite
// Verifies all newly implemented MVP-1 Core Foundation behaviors over real HTTP calls.

require('reflect-metadata');
const assert = require('assert');
const { PrismaClient } = require('@prisma/client');
const Redis = require('ioredis');
const cookieParser = require('cookie-parser');
const { NestFactory } = require('@nestjs/core');

process.env.APP_SECRET = process.env.APP_SECRET || 'remotfix-test-app-secret-32-chars-long!';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'remotfix-test-jwt-secret-32-chars-long!';
process.env.MFA_ENCRYPTION_KEY = process.env.MFA_ENCRYPTION_KEY || 'remotfix-test-mfa-key-32-chars-long!';
process.env.ADMIN_KEY = process.env.ADMIN_KEY || 'remotfix-test-operator-provisioning-key-32!';

const { AppModule } = require('../apps/api/dist/app.module');

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
  console.log('REMOTFIX MVP-1 — CORE FOUNDATION HTTP VERIFICATION');
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

  // Clear rate-limit counters from previous test runs
  const rateLimitKeys = await redis.keys('ratelimit:*');
  if (rateLimitKeys.length > 0) {
    await redis.del(...rateLimitKeys);
  }

  // Boot real NestJS HTTP server
  console.log('--- Booting NestJS HTTP Server ---');
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

  const timestamp = Date.now();
  const slugA = `mvp1-org-a-${timestamp}`;
  const slugB = `mvp1-org-b-${timestamp}`;
  const ownerEmailA = `owner-${slugA}@acme.com`;
  const ownerEmailB = `owner-${slugB}@foreign.com`;

  let tenantA;
  let ownerA;
  let ownerATokens;
  let tenantB;
  let ownerB;
  let ownerBTokens;
  let customerUser;
  let customerToken;
  let createdServiceA;
  let createdTicketA;

  try {
    // -------------------------------------------------------------------------
    // 1. PROVISION TEST TENANTS VIA ONBOARDING API
    // -------------------------------------------------------------------------
    console.log('--- 1. Provisioning Test Tenants ---');

    await test('Provision Tenant A with Owner A', async () => {
      const res = await fetch(`${baseUrl}/admin/onboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': process.env.ADMIN_KEY,
        },
        body: JSON.stringify({
          organizationName: 'MVP1 Alpha Corp',
          organizationSlug: slugA,
          ownerEmail: ownerEmailA,
          ownerPassword: 'OwnerPassword123!',
          ownerFirstName: 'Alice',
          ownerLastName: 'Alpha',
        }),
      });
      assert.strictEqual(res.status, 201);
      const json = await res.json();
      tenantA = json.data.organization;
      ownerA = json.data.user;

      // Login Owner A first to obtain valid accessToken
      const loginRes = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: ownerEmailA, password: 'OwnerPassword123!' }),
      });
      assert.strictEqual(loginRes.status, 200);
      ownerATokens = (await loginRes.json()).data;
      assert.ok(ownerATokens.accessToken, 'Owner A must receive accessToken');

      // Now enable MFA in database so MfaGuard permits privileged operations
      await prisma.user.update({
        where: { id: ownerA.id },
        data: { mfaEnabled: true },
      });
    });

    await test('Provision Foreign Tenant B with Owner B', async () => {
      const res = await fetch(`${baseUrl}/admin/onboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': process.env.ADMIN_KEY,
        },
        body: JSON.stringify({
          organizationName: 'MVP1 Beta Foreign Corp',
          organizationSlug: slugB,
          ownerEmail: ownerEmailB,
          ownerPassword: 'OwnerPassword123!',
          ownerFirstName: 'Bob',
          ownerLastName: 'Beta',
        }),
      });
      assert.strictEqual(res.status, 201);
      const json = await res.json();
      tenantB = json.data.organization;
      ownerB = json.data.user;

      // Login Owner B first
      const loginRes = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: ownerEmailB, password: 'OwnerPassword123!' }),
      });
      assert.strictEqual(loginRes.status, 200);
      ownerBTokens = (await loginRes.json()).data;
      assert.ok(ownerBTokens.accessToken, 'Owner B must receive accessToken');

      // Now enable MFA in database
      await prisma.user.update({
        where: { id: ownerB.id },
        data: { mfaEnabled: true },
      });
    });

    // Create a customer user in Tenant A
    const custRole = await prisma.role.findFirst({ where: { name: 'CUSTOMER', isSystem: true } });
    customerUser = await prisma.user.create({
      data: {
        email: `cust-${slugA}@acme.com`,
        passwordHash: 'dummy',
        status: 'ACTIVE',
        firstName: 'Charlie',
        lastName: 'Customer',
      },
    });
    await prisma.membership.create({
      data: {
        organizationId: tenantA.id,
        userId: customerUser.id,
        roleId: custRole.id,
        status: 'ACTIVE',
      },
    });

    const { TokenService } = require('../apps/api/dist/auth/token.service');
    const { JwtService } = require('@nestjs/jwt');
    const jwtSvc = new JwtService({ secret: process.env.JWT_SECRET });
    const tokSvc = new TokenService(jwtSvc, redis);
    customerToken = await tokSvc.generateAccessToken({
      sub: customerUser.id,
      email: customerUser.email,
      orgId: tenantA.id,
      roleId: custRole.id,
    });

    // -------------------------------------------------------------------------
    // 2. SERVICES CATALOG API (MVP-1)
    // -------------------------------------------------------------------------
    console.log('\n--- 2. Services Catalog API (/api/v1/services) ---');

    await test('Services: Anonymous request to /services rejected with 401 (Global fail-closed)', async () => {
      const res = await fetch(`${baseUrl}/services`);
      assert.strictEqual(res.status, 401);
    });

    await test('Services: Validation rejects negative price or short name (400)', async () => {
      const res = await fetch(`${baseUrl}/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ownerATokens.accessToken}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({
          name: 'A', // Too short
          priceAmount: -50, // Negative price
        }),
      });
      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert.strictEqual(json.code, 'VALIDATION_FAILED');
    });

    await test('Services: Customer role cannot create service (403 Forbidden - requires organization:manage)', async () => {
      const res = await fetch(`${baseUrl}/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerToken}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({
          name: 'Unauthorized Customer Service',
          priceAmount: 100,
        }),
      });
      assert.strictEqual(res.status, 403);
    });

    await test('Services: Owner creates service successfully (201 Created)', async () => {
      const res = await fetch(`${baseUrl}/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ownerATokens.accessToken}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({
          name: 'Remote Virus Removal & Diagnostic',
          description: 'Comprehensive remote malware elimination and system tuning.',
          priceAmount: 149.99,
          currency: 'INR',
          durationMinutes: 45,
        }),
      });
      assert.strictEqual(res.status, 201);
      const json = await res.json();
      assert.strictEqual(json.success, true);
      assert.strictEqual(json.data.name, 'Remote Virus Removal & Diagnostic');
      assert.strictEqual(json.data.organizationId, tenantA.id);
      assert.strictEqual(Number(json.data.priceAmount), 149.99);
      createdServiceA = json.data;
    });

    await test('Services: Duplicate service name in same organization is rejected with 409 Conflict', async () => {
      const res = await fetch(`${baseUrl}/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ownerATokens.accessToken}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({
          name: 'Remote Virus Removal & Diagnostic',
          priceAmount: 199.99,
        }),
      });
      assert.strictEqual(res.status, 409);
    });

    await test('Services: List services returns active services for Tenant A (200)', async () => {
      const res = await fetch(`${baseUrl}/services`, {
        headers: {
          Authorization: `Bearer ${ownerATokens.accessToken}`,
          'x-organization-id': tenantA.id,
        },
      });
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.ok(Array.isArray(json.data));
      assert.strictEqual(json.data.length, 1);
      assert.strictEqual(json.data[0].id, createdServiceA.id);
    });

    await test('Services: Foreign Tenant B listing services sees 0 services (Tenant isolation)', async () => {
      const res = await fetch(`${baseUrl}/services`, {
        headers: {
          Authorization: `Bearer ${ownerBTokens.accessToken}`,
          'x-organization-id': tenantB.id,
        },
      });
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.ok(Array.isArray(json.data));
      assert.strictEqual(json.data.length, 0, 'Tenant B must NOT see services of Tenant A');
    });

    await test('Services: Foreign Tenant B accessing Tenant A service ID returns 404 (IDOR protection)', async () => {
      const res = await fetch(`${baseUrl}/services/${createdServiceA.id}`, {
        headers: {
          Authorization: `Bearer ${ownerBTokens.accessToken}`,
          'x-organization-id': tenantB.id,
        },
      });
      assert.strictEqual(res.status, 404, 'Must return 404 for cross-tenant service ID');
    });

    // -------------------------------------------------------------------------
    // 3. TICKET LISTING & SCOPING API (MVP-1)
    // -------------------------------------------------------------------------
    console.log('\n--- 3. Ticket Listing & Scoping API (GET /api/v1/tickets) ---');

    await test('Tickets: Anonymous request to /tickets rejected with 401', async () => {
      const res = await fetch(`${baseUrl}/tickets`);
      assert.strictEqual(res.status, 401);
    });

    await test('Tickets: Owner creates ticket tied to service in Tenant A (201)', async () => {
      const res = await fetch(`${baseUrl}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ownerATokens.accessToken}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({
          title: 'Laptop Infected with Adware',
          description: 'Popups appearing every 30 seconds.',
          serviceId: createdServiceA.id,
          priority: 'HIGH',
        }),
      });
      assert.strictEqual(res.status, 201);
      const json = await res.json();
      assert.strictEqual(json.data.organizationId, tenantA.id);
      assert.strictEqual(json.data.serviceId, createdServiceA.id);
      createdTicketA = json.data;
    });

    await test('Tickets: Customer creates ticket auto-provisioning contact record (201)', async () => {
      const res = await fetch(`${baseUrl}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerToken}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({
          title: 'Customer Self-Service Support Request',
          description: 'Cannot connect to company VPN.',
          serviceId: createdServiceA.id,
          priority: 'MEDIUM',
        }),
      });
      assert.strictEqual(res.status, 201);
      const json = await res.json();
      assert.ok(json.data.contactId, 'Customer contactId must be auto-provisioned');

      // Verify contact record was created in database
      const contactInDb = await prisma.contact.findUnique({
        where: { id: json.data.contactId },
      });
      assert.ok(contactInDb);
      assert.strictEqual(contactInDb.userId, customerUser.id);
      assert.strictEqual(contactInDb.organizationId, tenantA.id);
    });

    await test('Tickets: GET /tickets returns paginated list for Owner A in Tenant A (200)', async () => {
      const res = await fetch(`${baseUrl}/tickets`, {
        headers: {
          Authorization: `Bearer ${ownerATokens.accessToken}`,
          'x-organization-id': tenantA.id,
        },
      });
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.success, true);
      assert.ok(json.data.items);
      assert.strictEqual(json.data.total, 2);
      assert.strictEqual(json.data.items.length, 2);
      assert.strictEqual(json.data.page, 1);
    });

    await test('Tickets: GET /tickets with filter status=OPEN returns filtered items (200)', async () => {
      const res = await fetch(`${baseUrl}/tickets?status=OPEN`, {
        headers: {
          Authorization: `Bearer ${ownerATokens.accessToken}`,
          'x-organization-id': tenantA.id,
        },
      });
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.data.total, 2);
    });

    await test('Tickets: GET /tickets with invalid status returns 400 Validation Error', async () => {
      const res = await fetch(`${baseUrl}/tickets?status=INVALID_STATUS`, {
        headers: {
          Authorization: `Bearer ${ownerATokens.accessToken}`,
          'x-organization-id': tenantA.id,
        },
      });
      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert.strictEqual(json.code, 'VALIDATION_FAILED');
    });

    await test('Tickets: Customer GET /tickets sees only their own tickets (Resource Scoping)', async () => {
      const res = await fetch(`${baseUrl}/tickets`, {
        headers: {
          Authorization: `Bearer ${customerToken}`,
          'x-organization-id': tenantA.id,
        },
      });
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      // Customer should see only 1 ticket (their own), not the owner's ticket
      assert.strictEqual(json.data.total, 1);
      assert.strictEqual(json.data.items[0].title, 'Customer Self-Service Support Request');
    });

    await test('Tickets: Foreign Tenant B GET /tickets sees 0 tickets (Tenant Isolation)', async () => {
      const res = await fetch(`${baseUrl}/tickets`, {
        headers: {
          Authorization: `Bearer ${ownerBTokens.accessToken}`,
          'x-organization-id': tenantB.id,
        },
      });
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.data.total, 0, 'Foreign Tenant B must see zero tickets');
      assert.strictEqual(json.data.items.length, 0);
    });
  } finally {
    console.log('\n--- Teardown: Purging test entities from database ---');
    try {
      const orgIds = [tenantA?.id, tenantB?.id].filter(Boolean);

      if (orgIds.length > 0) {
        await prisma.ticket.deleteMany({ where: { organizationId: { in: orgIds } } });
        await prisma.service.deleteMany({ where: { organizationId: { in: orgIds } } });
        await prisma.contact.deleteMany({ where: { organizationId: { in: orgIds } } });
        await prisma.technician.deleteMany({ where: { organizationId: { in: orgIds } } });
        await prisma.auditEvent.deleteMany({ where: { organizationId: { in: orgIds } } });
        await prisma.membership.deleteMany({ where: { organizationId: { in: orgIds } } });
        await prisma.organization.deleteMany({ where: { id: { in: orgIds } } });
      }

      const userIds = [ownerA?.id, ownerB?.id, customerUser?.id].filter(Boolean);
      if (userIds.length > 0) {
        await prisma.user.deleteMany({ where: { id: { in: userIds } } });
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

  console.log('\n============================================================');
  const passed = testResults.filter((t) => t.passed).length;
  const failed = testResults.filter((t) => !t.passed).length;
  console.log(`MVP-1 HTTP SUITE: ${passed} PASSED, ${failed} FAILED (${testResults.length} total)`);
  console.log('============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

run().catch((e) => {
  console.error('Fatal test runner error:', e);
  process.exit(1);
});
