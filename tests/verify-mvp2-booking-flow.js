// REMOTFIX — MVP-2 Booking Flow & Detail Verification Suite
// Verifies authenticated booking creation using Ticket model and persisted detail retrieval over real HTTP calls.

require('reflect-metadata');
const assert = require('assert');
const { PrismaClient } = require('@prisma/client');
const Redis = require('ioredis');
const cookieParser = require('cookie-parser');
const { NestFactory } = require('@nestjs/core');
const { JwtService } = require('@nestjs/jwt');

process.env.APP_SECRET = process.env.APP_SECRET || 'remotfix-test-app-secret-32-chars-long!';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'remotfix-test-jwt-secret-32-chars-long!';
process.env.MFA_ENCRYPTION_KEY = process.env.MFA_ENCRYPTION_KEY || 'remotfix-test-mfa-key-32-chars-long!';
process.env.ADMIN_KEY = process.env.ADMIN_KEY || 'remotfix-test-operator-provisioning-key-32!';

const { AppModule } = require('../apps/api/dist/app.module');
const { TokenService } = require('../apps/api/dist/auth/token.service');

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
  console.log('REMOTFIX MVP-2 — BOOKING FLOW & DETAIL HTTP VERIFICATION');
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
  const slugA = `mvp2-org-a-${timestamp}`;
  const slugB = `mvp2-org-b-${timestamp}`;
  const ownerEmailA = `owner-${slugA}@acme.com`;
  const ownerEmailB = `owner-${slugB}@foreign.com`;

  const jwtSvc = new JwtService({ secret: process.env.JWT_SECRET });
  const tokSvc = new TokenService(jwtSvc, redis);

  let tenantA;
  let ownerA;
  let ownerATokens;
  let tenantB;
  let ownerB;
  let ownerBTokens;
  let customerUserA;
  let customerTokenA;
  let customerUserA2;
  let customerTokenA2;
  let customerUserB;
  let customerTokenB;
  let createdServiceA;
  let createdServiceB;
  let customerBookingTicket;

  try {
    // -------------------------------------------------------------------------
    // 1. PROVISION TEST TENANTS & USERS
    // -------------------------------------------------------------------------
    console.log('--- 1. Provisioning Test Infrastructure ---');

    await test('Provision Tenant A with Owner A', async () => {
      const res = await fetch(`${baseUrl}/admin/onboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': process.env.ADMIN_KEY,
        },
        body: JSON.stringify({
          organizationName: `Acme Corp ${timestamp}`,
          organizationSlug: slugA,
          ownerEmail: ownerEmailA,
          ownerPassword: 'Password123!',
          ownerFirstName: 'Alice',
          ownerLastName: 'Owner',
        }),
      });
      assert.strictEqual(res.status, 201);
      const json = await res.json();
      tenantA = json.data.organization;
      ownerA = json.data.user;

      const loginRes = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: ownerEmailA,
          password: 'Password123!',
          organizationId: tenantA.id,
        }),
      });
      assert.strictEqual(loginRes.status, 200);
      const loginJson = await loginRes.json();
      ownerATokens = loginJson.data;

      // Enable MFA in DB so MfaGuard permits privileged operations (organization:manage)
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
          organizationName: `Foreign Corp ${timestamp}`,
          organizationSlug: slugB,
          ownerEmail: ownerEmailB,
          ownerPassword: 'Password123!',
          ownerFirstName: 'Bob',
          ownerLastName: 'Foreign',
        }),
      });
      assert.strictEqual(res.status, 201);
      const json = await res.json();
      tenantB = json.data.organization;
      ownerB = json.data.user;

      const loginRes = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: ownerEmailB,
          password: 'Password123!',
          organizationId: tenantB.id,
        }),
      });
      assert.strictEqual(loginRes.status, 200);
      const loginJson = await loginRes.json();
      ownerBTokens = loginJson.data;

      await prisma.user.update({
        where: { id: ownerB.id },
        data: { mfaEnabled: true },
      });
    });

    const custRole = await prisma.role.findFirst({ where: { name: 'CUSTOMER', isSystem: true } });

    await test('Provision Customer A in Tenant A', async () => {
      customerUserA = await prisma.user.create({
        data: {
          email: `customer-a-${timestamp}@client.com`,
          passwordHash: 'dummy',
          status: 'ACTIVE',
          firstName: 'Charlie',
          lastName: 'Customer',
        },
      });
      await prisma.membership.create({
        data: {
          organizationId: tenantA.id,
          userId: customerUserA.id,
          roleId: custRole.id,
          status: 'ACTIVE',
        },
      });
      customerTokenA = await tokSvc.generateAccessToken({
        sub: customerUserA.id,
        email: customerUserA.email,
        orgId: tenantA.id,
        roleId: custRole.id,
      });
      assert.ok(customerTokenA, 'Customer token A generated');
    });

    await test('Provision Customer A2 (Second Customer) in Tenant A', async () => {
      customerUserA2 = await prisma.user.create({
        data: {
          email: `customer-a2-${timestamp}@client.com`,
          passwordHash: 'dummy',
          status: 'ACTIVE',
          firstName: 'Chloe',
          lastName: 'CustomerTwo',
        },
      });
      await prisma.membership.create({
        data: {
          organizationId: tenantA.id,
          userId: customerUserA2.id,
          roleId: custRole.id,
          status: 'ACTIVE',
        },
      });
      customerTokenA2 = await tokSvc.generateAccessToken({
        sub: customerUserA2.id,
        email: customerUserA2.email,
        orgId: tenantA.id,
        roleId: custRole.id,
      });
      assert.ok(customerTokenA2, 'Customer token A2 generated');
    });

    await test('Provision Customer B in Foreign Tenant B', async () => {
      customerUserB = await prisma.user.create({
        data: {
          email: `customer-b-${timestamp}@foreign-client.com`,
          passwordHash: 'dummy',
          status: 'ACTIVE',
          firstName: 'Dave',
          lastName: 'ForeignCustomer',
        },
      });
      await prisma.membership.create({
        data: {
          organizationId: tenantB.id,
          userId: customerUserB.id,
          roleId: custRole.id,
          status: 'ACTIVE',
        },
      });
      customerTokenB = await tokSvc.generateAccessToken({
        sub: customerUserB.id,
        email: customerUserB.email,
        orgId: tenantB.id,
        roleId: custRole.id,
      });
      assert.ok(customerTokenB, 'Customer token B generated');
    });

    await test('Owner A creates Service A in Tenant A', async () => {
      const res = await fetch(`${baseUrl}/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ownerATokens.accessToken}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({
          name: 'Standard Hardware Diagnostic',
          description: 'Comprehensive physical workstation and internal hardware triage',
          priceAmount: 1500,
          currency: 'INR',
          durationMinutes: 45,
        }),
      });
      assert.strictEqual(res.status, 201);
      const json = await res.json();
      createdServiceA = json.data;
      assert.strictEqual(createdServiceA.name, 'Standard Hardware Diagnostic');
    });

    await test('Owner B creates Service B in Foreign Tenant B', async () => {
      const res = await fetch(`${baseUrl}/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ownerBTokens.accessToken}`,
          'x-organization-id': tenantB.id,
        },
        body: JSON.stringify({
          name: 'Remote Network Audit',
          description: 'Virtual inspection of gateway firewall and VLAN routing topology',
          priceAmount: 3000,
          currency: 'INR',
          durationMinutes: 60,
        }),
      });
      assert.strictEqual(res.status, 201);
      const json = await res.json();
      createdServiceB = json.data;
    });

    // -------------------------------------------------------------------------
    // 2. POSITIVE BOOKING FLOW TESTS
    // -------------------------------------------------------------------------
    console.log('\n--- 2. Positive Booking Creation & Retrieval Flows ---');

    await test('Customer A books Service A in Tenant A (Creates Persisted Ticket)', async () => {
      const res = await fetch(`${baseUrl}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerTokenA}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({
          serviceId: createdServiceA.id,
          title: 'Workstation 04 Kernel Panic Diagnostic',
          description: 'Machine crashes with memory fault after 30 minutes under load',
          priority: 'HIGH',
        }),
      });
      assert.strictEqual(res.status, 201);
      const json = await res.json();
      customerBookingTicket = json.data;

      assert.ok(customerBookingTicket.id, 'Expected persisted ticket ID');
      assert.strictEqual(customerBookingTicket.title, 'Workstation 04 Kernel Panic Diagnostic');
      assert.strictEqual(customerBookingTicket.priority, 'HIGH');
      assert.strictEqual(customerBookingTicket.status, 'OPEN');
      assert.strictEqual(customerBookingTicket.serviceId, createdServiceA.id);
      assert.ok(customerBookingTicket.contactId, 'Expected auto-provisioned contactId');
      assert.ok(customerBookingTicket.service, 'Expected service relation in response');
      assert.strictEqual(customerBookingTicket.service.name, 'Standard Hardware Diagnostic');
    });

    await test('Customer A retrieves persisted booking detail (GET /tickets/:id)', async () => {
      const res = await fetch(`${baseUrl}/tickets/${customerBookingTicket.id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${customerTokenA}`,
          'x-organization-id': tenantA.id,
        },
      });
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      const ticket = json.data;

      assert.strictEqual(ticket.id, customerBookingTicket.id);
      assert.strictEqual(ticket.title, 'Workstation 04 Kernel Panic Diagnostic');
      assert.strictEqual(ticket.service.id, createdServiceA.id);
      assert.strictEqual(ticket.service.name, 'Standard Hardware Diagnostic');
      assert.strictEqual(ticket.contact.userId, customerUserA.id);
      assert.strictEqual(ticket.contact.email, customerUserA.email);
    });

    await test('Customer A views Service Detail (GET /services/:id)', async () => {
      const res = await fetch(`${baseUrl}/services/${createdServiceA.id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${customerTokenA}`,
          'x-organization-id': tenantA.id,
        },
      });
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.data.id, createdServiceA.id);
      assert.strictEqual(json.data.name, 'Standard Hardware Diagnostic');
    });

    await test('Owner A retrieves ticket detail (GET /tickets/:id)', async () => {
      const res = await fetch(`${baseUrl}/tickets/${customerBookingTicket.id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${ownerATokens.accessToken}`,
          'x-organization-id': tenantA.id,
        },
      });
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.data.id, customerBookingTicket.id);
      assert.strictEqual(json.data.title, 'Workstation 04 Kernel Panic Diagnostic');
    });

    await test('Customer A lists tickets (GET /tickets includes created booking)', async () => {
      const res = await fetch(`${baseUrl}/tickets`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${customerTokenA}`,
          'x-organization-id': tenantA.id,
        },
      });
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      const match = json.data.items.find((t) => t.id === customerBookingTicket.id);
      assert.ok(match, 'Created ticket must appear in customer ticket listing');
    });

    // -------------------------------------------------------------------------
    // 3. NEGATIVE VALIDATION & AUTHORIZATION TESTS
    // -------------------------------------------------------------------------
    console.log('\n--- 3. Negative Validation & Authorization Tests ---');

    await test('Validation: Empty booking title is rejected with 400 Bad Request', async () => {
      const res = await fetch(`${baseUrl}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerTokenA}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({
          serviceId: createdServiceA.id,
          title: '',
          priority: 'HIGH',
        }),
      });
      assert.strictEqual(res.status, 400);
    });

    await test('Validation: Invalid priority enum is rejected with 400 Bad Request', async () => {
      const res = await fetch(`${baseUrl}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerTokenA}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({
          serviceId: createdServiceA.id,
          title: 'Valid Title',
          priority: 'SUPER_URGENT',
        }),
      });
      assert.strictEqual(res.status, 400);
    });

    await test('Validation: Non-UUID route parameter on GET /tickets/:id returns 400 Bad Request', async () => {
      const res = await fetch(`${baseUrl}/tickets/invalid-not-a-uuid`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${customerTokenA}`,
          'x-organization-id': tenantA.id,
        },
      });
      assert.strictEqual(res.status, 400);
    });

    await test('Validation: Non-UUID route parameter on GET /services/:id returns 400 Bad Request', async () => {
      const res = await fetch(`${baseUrl}/services/invalid-not-a-uuid`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${customerTokenA}`,
          'x-organization-id': tenantA.id,
        },
      });
      assert.strictEqual(res.status, 400);
    });

    await test('Unauthorized: Unauthenticated booking request is rejected with 401', async () => {
      const res = await fetch(`${baseUrl}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({
          serviceId: createdServiceA.id,
          title: 'Unauthenticated Request',
        }),
      });
      assert.strictEqual(res.status, 401);
    });

    await test('Unauthorized: Unauthenticated ticket detail request is rejected with 401', async () => {
      const res = await fetch(`${baseUrl}/tickets/${customerBookingTicket.id}`, {
        method: 'GET',
        headers: { 'x-organization-id': tenantA.id },
      });
      assert.strictEqual(res.status, 401);
    });

    // -------------------------------------------------------------------------
    // 4. SECURITY & ISOLATION BOUNDARY TESTS
    // -------------------------------------------------------------------------
    console.log('\n--- 4. Security & Tenant Isolation Boundary Tests ---');

    await test('BOLA / IDOR: Customer A cannot reference foreign Service B from Tenant B (404)', async () => {
      const res = await fetch(`${baseUrl}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerTokenA}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({
          serviceId: createdServiceB.id, // Belongs to Tenant B!
          title: 'Sneaky Cross-Tenant Booking',
          priority: 'MEDIUM',
        }),
      });
      assert.strictEqual(res.status, 404);
      const json = await res.json();
      assert.ok(json.message.includes('Service not found in this organization'));
    });

    await test('Tenant Isolation: Customer B in Tenant B cannot read Ticket A from Tenant A (404)', async () => {
      const res = await fetch(`${baseUrl}/tickets/${customerBookingTicket.id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${customerTokenB}`,
          'x-organization-id': tenantB.id,
        },
      });
      // Strictly 404: Foreign tenant must never learn whether ticket ID exists in Tenant A
      assert.strictEqual(res.status, 404);
    });

    await test('Customer Resource Scoping: Customer A2 in Tenant A cannot view Customer A ticket (403)', async () => {
      const res = await fetch(`${baseUrl}/tickets/${customerBookingTicket.id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${customerTokenA2}`,
          'x-organization-id': tenantA.id,
        },
      });
      // Same organization, but different Customer contact: must be forbidden
      assert.strictEqual(res.status, 403);
      const json = await res.json();
      assert.ok(json.message.includes('Customers may only access their own service tickets'));
    });

    await test('Nonexistent ticket UUID in tenant returns 404 Not Found', async () => {
      const res = await fetch(`${baseUrl}/tickets/e0000000-0000-4000-8000-000000000000`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${customerTokenA}`,
          'x-organization-id': tenantA.id,
        },
      });
      assert.strictEqual(res.status, 404);
    });

  } finally {
    // -------------------------------------------------------------------------
    // TEARDOWN
    // -------------------------------------------------------------------------
    console.log('\n--- Teardown: Purging test entities from database ---');

    await prisma.auditEvent.deleteMany({
      where: {
        organization: {
          slug: { in: [slugA, slugB] },
        },
      },
    });

    await prisma.ticket.deleteMany({
      where: {
        organization: {
          slug: { in: [slugA, slugB] },
        },
      },
    });

    await prisma.service.deleteMany({
      where: {
        organization: {
          slug: { in: [slugA, slugB] },
        },
      },
    });

    await prisma.contact.deleteMany({
      where: {
        organization: {
          slug: { in: [slugA, slugB] },
        },
      },
    });

    await prisma.membership.deleteMany({
      where: {
        organization: {
          slug: { in: [slugA, slugB] },
        },
      },
    });

    await prisma.organization.deleteMany({
      where: {
        slug: { in: [slugA, slugB] },
      },
    });

    await prisma.user.deleteMany({
      where: {
        email: {
          in: [
            ownerEmailA,
            ownerEmailB,
            `customer-a-${timestamp}@client.com`,
            `customer-a2-${timestamp}@client.com`,
            `customer-b-${timestamp}@foreign-client.com`,
          ],
        },
      },
    });

    // Clean redis keys
    const cleanupRateKeys = await redis.keys('ratelimit:*');
    if (cleanupRateKeys.length > 0) {
      await redis.del(...cleanupRateKeys);
    }
    const sessionKeys = await redis.keys('session:*');
    if (sessionKeys.length > 0) {
      await redis.del(...sessionKeys);
    }

    // Verify clean database
    const remainingCount =
      (await prisma.organization.count({ where: { slug: { in: [slugA, slugB] } } })) +
      (await prisma.ticket.count({ where: { organization: { slug: { in: [slugA, slugB] } } } }));

    if (remainingCount === 0) {
      console.log('✓ Teardown complete: Zero dirty test records remain.');
    } else {
      console.error(`✗ Teardown warning: ${remainingCount} test records remain.`);
    }

    await app.close();
    await prisma.$disconnect();
    redis.disconnect();
  }

  console.log('\n============================================================');
  const passed = testResults.filter((r) => r.passed).length;
  const failed = testResults.filter((r) => !r.passed).length;
  console.log(`MVP-2 HTTP SUITE: ${passed} PASSED, ${failed} FAILED (${testResults.length} total)`);
  console.log('============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Fatal test runner failure:', err);
  process.exit(1);
});
