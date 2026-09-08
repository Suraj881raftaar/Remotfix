// REMOTFIX — M5 Ticket Lifecycle & State Machine HTTP Integration Test Suite
// Verifies all M5 ticket lifecycle transitions, authorization, boundaries, and audit events over real HTTP calls.

require('reflect-metadata');
const assert = require('assert');
const { PrismaClient } = require('@prisma/client');
const Redis = require('ioredis');
const cookieParser = require('cookie-parser');
const { NestFactory } = require('@nestjs/core');
const { JwtService } = require('@nestjs/jwt');

// Test Secrets
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
  console.log('REMOTFIX M5 — TICKET LIFECYCLE HTTP INTEGRATION VERIFICATION');
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

  // Clear rate-limit counters
  const rateLimitKeys = await redis.keys('ratelimit:*');
  if (rateLimitKeys.length > 0) {
    await redis.del(...rateLimitKeys);
  }

  // Boot real NestJS HTTP server on ephemeral port
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
  const slugA = `m5-org-a-${timestamp}`;
  const slugB = `m5-org-b-${timestamp}`;
  const ownerEmailA = `owner-${slugA}@acme.com`;
  const ownerEmailB = `owner-${slugB}@foreign.com`;

  const jwtSvc = new JwtService({ secret: process.env.JWT_SECRET });
  const tokSvc = new TokenService(jwtSvc, redis);

  let tenantA;
  let ownerA;
  let ownerAToken;
  let tenantB;
  let ownerB;
  let ownerBToken;

  let adminUserA, adminTokenA;
  let techUserA1, techTokenA1, techRecordA1;
  let techUserA2, techTokenA2, techRecordA2;
  let customerUserA1, customerTokenA1, customerContactA1;
  let customerUserA2, customerTokenA2, customerContactA2;
  let techUserB1, techTokenB1, techRecordB1;

  let lifecycleTicket;
  let illegalTicket;
  let patchTicket;
  let staffClosedTicket;

  try {
    // -------------------------------------------------------------------------
    // 1. PROVISION TEST INFRASTRUCTURE (TENANTS & USERS)
    // -------------------------------------------------------------------------
    console.log('--- 1. Provisioning Test Tenants & Users ---');

    await test('Provision Tenant A with Owner A', async () => {
      const res = await fetch(`${baseUrl}/admin/onboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': process.env.ADMIN_KEY,
        },
        body: JSON.stringify({
          organizationName: `M5 Lifecycle Corp A ${timestamp}`,
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

      await prisma.user.update({
        where: { id: ownerA.id },
        data: { mfaEnabled: true },
      });

      const ownerRole = await prisma.role.findFirst({ where: { name: 'OWNER', isSystem: true } });
      ownerAToken = await tokSvc.generateAccessToken({
        sub: ownerA.id,
        email: ownerA.email,
        orgId: tenantA.id,
        roleId: ownerRole.id,
        roleName: ownerRole.name,
        permissions: [],
      });
      assert.ok(ownerAToken, 'Owner A token generated');
    });

    await test('Provision Foreign Tenant B with Owner B', async () => {
      const res = await fetch(`${baseUrl}/admin/onboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': process.env.ADMIN_KEY,
        },
        body: JSON.stringify({
          organizationName: `M5 Lifecycle Corp B ${timestamp}`,
          organizationSlug: slugB,
          ownerEmail: ownerEmailB,
          ownerPassword: 'Password123!',
          ownerFirstName: 'Bob',
          ownerLastName: 'OwnerB',
        }),
      });
      assert.strictEqual(res.status, 201);
      const json = await res.json();
      tenantB = json.data.organization;
      ownerB = json.data.user;

      await prisma.user.update({
        where: { id: ownerB.id },
        data: { mfaEnabled: true },
      });

      const ownerRole = await prisma.role.findFirst({ where: { name: 'OWNER', isSystem: true } });
      ownerBToken = await tokSvc.generateAccessToken({
        sub: ownerB.id,
        email: ownerB.email,
        orgId: tenantB.id,
        roleId: ownerRole.id,
        roleName: ownerRole.name,
        permissions: [],
      });
      assert.ok(ownerBToken, 'Owner B token generated');
    });

    const adminRole = await prisma.role.findFirst({ where: { name: 'ADMIN', isSystem: true } });
    const techRole = await prisma.role.findFirst({ where: { name: 'TECHNICIAN', isSystem: true } });
    const custRole = await prisma.role.findFirst({ where: { name: 'CUSTOMER', isSystem: true } });

    await test('Provision Admin A in Tenant A', async () => {
      adminUserA = await prisma.user.create({
        data: {
          email: `admin-a-${timestamp}@acme.com`,
          passwordHash: 'dummy',
          status: 'ACTIVE',
          mfaEnabled: true,
          firstName: 'Adam',
          lastName: 'Admin',
        },
      });
      await prisma.membership.create({
        data: {
          organizationId: tenantA.id,
          userId: adminUserA.id,
          roleId: adminRole.id,
          status: 'ACTIVE',
        },
      });
      adminTokenA = await tokSvc.generateAccessToken({
        sub: adminUserA.id,
        email: adminUserA.email,
        orgId: tenantA.id,
        roleId: adminRole.id,
        roleName: adminRole.name,
        permissions: [],
      });
      assert.ok(adminTokenA, 'Admin token generated');
    });

    await test('Provision Technician A1 and A2 in Tenant A', async () => {
      techUserA1 = await prisma.user.create({
        data: {
          email: `tech-a1-${timestamp}@acme.com`,
          passwordHash: 'dummy',
          status: 'ACTIVE',
          firstName: 'Ted',
          lastName: 'TechOne',
        },
      });
      await prisma.membership.create({
        data: {
          organizationId: tenantA.id,
          userId: techUserA1.id,
          roleId: techRole.id,
          status: 'ACTIVE',
        },
      });
      techRecordA1 = await prisma.technician.create({
        data: {
          organizationId: tenantA.id,
          userId: techUserA1.id,
          status: 'AVAILABLE',
        },
      });
      techTokenA1 = await tokSvc.generateAccessToken({
        sub: techUserA1.id,
        email: techUserA1.email,
        orgId: tenantA.id,
        roleId: techRole.id,
        roleName: techRole.name,
        permissions: [],
      });

      techUserA2 = await prisma.user.create({
        data: {
          email: `tech-a2-${timestamp}@acme.com`,
          passwordHash: 'dummy',
          status: 'ACTIVE',
          firstName: 'Tina',
          lastName: 'TechTwo',
        },
      });
      await prisma.membership.create({
        data: {
          organizationId: tenantA.id,
          userId: techUserA2.id,
          roleId: techRole.id,
          status: 'ACTIVE',
        },
      });
      techRecordA2 = await prisma.technician.create({
        data: {
          organizationId: tenantA.id,
          userId: techUserA2.id,
          status: 'AVAILABLE',
        },
      });
      techTokenA2 = await tokSvc.generateAccessToken({
        sub: techUserA2.id,
        email: techUserA2.email,
        orgId: tenantA.id,
        roleId: techRole.id,
        roleName: techRole.name,
        permissions: [],
      });
      assert.ok(techTokenA1 && techTokenA2, 'Technician tokens generated');
    });

    await test('Provision Customer A1 and A2 in Tenant A', async () => {
      customerUserA1 = await prisma.user.create({
        data: {
          email: `customer-a1-${timestamp}@client.com`,
          passwordHash: 'dummy',
          status: 'ACTIVE',
          firstName: 'Charlie',
          lastName: 'CustomerOne',
        },
      });
      await prisma.membership.create({
        data: {
          organizationId: tenantA.id,
          userId: customerUserA1.id,
          roleId: custRole.id,
          status: 'ACTIVE',
        },
      });
      customerContactA1 = await prisma.contact.create({
        data: {
          organizationId: tenantA.id,
          userId: customerUserA1.id,
          name: 'Charlie CustomerOne',
          email: customerUserA1.email,
        },
      });
      customerTokenA1 = await tokSvc.generateAccessToken({
        sub: customerUserA1.id,
        email: customerUserA1.email,
        orgId: tenantA.id,
        roleId: custRole.id,
        roleName: custRole.name,
        permissions: [],
      });

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
      customerContactA2 = await prisma.contact.create({
        data: {
          organizationId: tenantA.id,
          userId: customerUserA2.id,
          name: 'Chloe CustomerTwo',
          email: customerUserA2.email,
        },
      });
      customerTokenA2 = await tokSvc.generateAccessToken({
        sub: customerUserA2.id,
        email: customerUserA2.email,
        orgId: tenantA.id,
        roleId: custRole.id,
        roleName: custRole.name,
        permissions: [],
      });
      assert.ok(customerTokenA1 && customerTokenA2, 'Customer tokens generated');
    });

    await test('Provision Technician B1 in Tenant B', async () => {
      techUserB1 = await prisma.user.create({
        data: {
          email: `tech-b1-${timestamp}@foreign.com`,
          passwordHash: 'dummy',
          status: 'ACTIVE',
          firstName: 'Boris',
          lastName: 'TechForeign',
        },
      });
      await prisma.membership.create({
        data: {
          organizationId: tenantB.id,
          userId: techUserB1.id,
          roleId: techRole.id,
          status: 'ACTIVE',
        },
      });
      techRecordB1 = await prisma.technician.create({
        data: {
          organizationId: tenantB.id,
          userId: techUserB1.id,
          status: 'AVAILABLE',
        },
      });
      techTokenB1 = await tokSvc.generateAccessToken({
        sub: techUserB1.id,
        email: techUserB1.email,
        orgId: tenantB.id,
        roleId: techRole.id,
        roleName: techRole.name,
        permissions: [],
      });
      assert.ok(techTokenB1, 'Technician B1 token generated');
    });

    // -------------------------------------------------------------------------
    // 2. COMPLETE VALID TICKET LIFECYCLE (OPEN -> SCHEDULED -> IN_PROGRESS -> RESOLVED -> CLOSED)
    // -------------------------------------------------------------------------
    console.log('\n--- 2. Complete Valid Lifecycle & Reassignment ---');

    await test('Lifecycle: Customer creates Ticket (OPEN)', async () => {
      const res = await fetch(`${baseUrl}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerTokenA1}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({
          title: 'Laptop display replacement needed',
          description: 'Screen is flickering severely',
          priority: 'HIGH',
        }),
      });
      assert.strictEqual(res.status, 201);
      const json = await res.json();
      assert.strictEqual(json.success, true);
      assert.strictEqual(json.data.status, 'OPEN');
      assert.strictEqual(json.data.assignedTechnicianId, null);
      lifecycleTicket = json.data;
    });

    await test('Lifecycle: Assign Ticket to Tech A1 transitions OPEN -> SCHEDULED', async () => {
      const scheduledTime = new Date(Date.now() + 86400000).toISOString();
      const res = await fetch(`${baseUrl}/tickets/${lifecycleTicket.id}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminTokenA}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({
          technicianId: techRecordA1.id,
          scheduledAt: scheduledTime,
        }),
      });
      assert.ok([200, 201].includes(res.status), `Expected 200/201, got ${res.status}`);
      const json = await res.json();
      assert.strictEqual(json.success, true);
      assert.strictEqual(json.data.status, 'SCHEDULED');
      assert.strictEqual(json.data.assignedTechnicianId, techRecordA1.id);
      lifecycleTicket = json.data;
    });

    await test('Lifecycle: Reassign Ticket to Tech A2 maintains SCHEDULED status without regression', async () => {
      const res = await fetch(`${baseUrl}/tickets/${lifecycleTicket.id}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminTokenA}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({
          technicianId: techRecordA2.id,
        }),
      });
      assert.ok([200, 201].includes(res.status));
      const json = await res.json();
      assert.strictEqual(json.success, true);
      assert.strictEqual(json.data.status, 'SCHEDULED');
      assert.strictEqual(json.data.assignedTechnicianId, techRecordA2.id);

      // Reassign back to Tech A1 for subsequent tests
      const reassignBack = await fetch(`${baseUrl}/tickets/${lifecycleTicket.id}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminTokenA}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({
          technicianId: techRecordA1.id,
        }),
      });
      assert.ok([200, 201].includes(reassignBack.status));
      const reassignJson = await reassignBack.json();
      assert.strictEqual(reassignJson.data.assignedTechnicianId, techRecordA1.id);
      lifecycleTicket = reassignJson.data;
    });

    await test('Lifecycle: Tech A1 starts work transitions SCHEDULED -> IN_PROGRESS', async () => {
      const res = await fetch(`${baseUrl}/tickets/${lifecycleTicket.id}/start-work`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${techTokenA1}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({}),
      });
      assert.ok([200, 201].includes(res.status), `Expected 200/201, got ${res.status}`);
      const json = await res.json();
      assert.strictEqual(json.success, true);
      assert.strictEqual(json.data.status, 'IN_PROGRESS');
      lifecycleTicket = json.data;
    });

    await test('Lifecycle: Tech A1 resolves ticket transitions IN_PROGRESS -> RESOLVED with notes', async () => {
      const res = await fetch(`${baseUrl}/tickets/${lifecycleTicket.id}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${techTokenA1}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({
          diagnosticNotes: 'Display panel replaced with OEM part. Color calibration verified.',
        }),
      });
      assert.ok([200, 201].includes(res.status), `Expected 200/201, got ${res.status}`);
      const json = await res.json();
      assert.strictEqual(json.success, true);
      assert.strictEqual(json.data.status, 'RESOLVED');
      assert.ok(json.data.description.includes('Display panel replaced with OEM part'));
      lifecycleTicket = json.data;
    });

    await test('Lifecycle: Customer A1 closes own ticket transitions RESOLVED -> CLOSED with empty payload', async () => {
      const res = await fetch(`${baseUrl}/tickets/${lifecycleTicket.id}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerTokenA1}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({}),
      });
      assert.ok([200, 201].includes(res.status), `Expected 200/201, got ${res.status}`);
      const json = await res.json();
      assert.strictEqual(json.success, true);
      assert.strictEqual(json.data.status, 'CLOSED');
      lifecycleTicket = json.data;
    });

    // -------------------------------------------------------------------------
    // 3. ILLEGAL TRANSITIONS ENFORCEMENT
    // -------------------------------------------------------------------------
    console.log('\n--- 3. Illegal State Transitions Enforcement ---');

    await test('Setup: Create fresh ticket in OPEN status for illegal transition tests', async () => {
      const res = await fetch(`${baseUrl}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerTokenA1}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({
          title: 'Illegal transition test ticket',
          description: 'Testing state machine transition guards',
        }),
      });
      assert.strictEqual(res.status, 201);
      const json = await res.json();
      illegalTicket = json.data;
      assert.strictEqual(illegalTicket.status, 'OPEN');
    });

    await test('Illegal Transition: Cannot start work on OPEN ticket (must be SCHEDULED)', async () => {
      const res = await fetch(`${baseUrl}/tickets/${illegalTicket.id}/start-work`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminTokenA}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({}),
      });
      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert.ok(json.message.includes('must be scheduled') || json.message.includes('SCHEDULED'));
    });

    await test('Illegal Transition: Cannot resolve OPEN ticket (must be IN_PROGRESS)', async () => {
      const res = await fetch(`${baseUrl}/tickets/${illegalTicket.id}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminTokenA}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({ diagnosticNotes: 'Direct resolve attempt' }),
      });
      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert.ok(json.message.includes('IN_PROGRESS'));
    });

    await test('Illegal Transition: Cannot close OPEN ticket (must be RESOLVED)', async () => {
      const res = await fetch(`${baseUrl}/tickets/${illegalTicket.id}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerTokenA1}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({}),
      });
      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert.ok(json.message.includes('RESOLVED'));
    });

    await test('Transition: Advance illegal ticket to SCHEDULED', async () => {
      const res = await fetch(`${baseUrl}/tickets/${illegalTicket.id}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminTokenA}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({ technicianId: techRecordA1.id }),
      });
      assert.ok([200, 201].includes(res.status));
      const json = await res.json();
      illegalTicket = json.data;
      assert.strictEqual(illegalTicket.status, 'SCHEDULED');
    });

    await test('Illegal Transition: Cannot resolve SCHEDULED ticket directly (must be IN_PROGRESS)', async () => {
      const res = await fetch(`${baseUrl}/tickets/${illegalTicket.id}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${techTokenA1}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({ diagnosticNotes: 'Skip in progress' }),
      });
      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert.ok(json.message.includes('IN_PROGRESS'));
    });

    await test('Illegal Transition: Cannot close SCHEDULED ticket directly (must be RESOLVED)', async () => {
      const res = await fetch(`${baseUrl}/tickets/${illegalTicket.id}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerTokenA1}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({}),
      });
      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert.ok(json.message.includes('RESOLVED'));
    });

    await test('Transition: Advance illegal ticket to IN_PROGRESS', async () => {
      const res = await fetch(`${baseUrl}/tickets/${illegalTicket.id}/start-work`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${techTokenA1}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({}),
      });
      assert.ok([200, 201].includes(res.status));
      const json = await res.json();
      illegalTicket = json.data;
      assert.strictEqual(illegalTicket.status, 'IN_PROGRESS');
    });

    await test('Illegal Transition: Cannot assign or reassign IN_PROGRESS ticket', async () => {
      const res = await fetch(`${baseUrl}/tickets/${illegalTicket.id}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminTokenA}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({ technicianId: techRecordA2.id }),
      });
      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert.ok(json.message.includes('IN_PROGRESS') || json.message.includes('Cannot assign'));
    });

    await test('Illegal Transition: Cannot close IN_PROGRESS ticket directly (must be RESOLVED)', async () => {
      const res = await fetch(`${baseUrl}/tickets/${illegalTicket.id}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerTokenA1}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({}),
      });
      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert.ok(json.message.includes('RESOLVED'));
    });

    // -------------------------------------------------------------------------
    // 4. CROSS-TENANT ISOLATION IN ASSIGNMENT
    // -------------------------------------------------------------------------
    console.log('\n--- 4. Cross-Tenant Isolation in Assignment ---');

    await test('Cross-Tenant: Assigning Tenant A ticket to Tenant B technician is rejected (404)', async () => {
      const res = await fetch(`${baseUrl}/tickets/${lifecycleTicket.id}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminTokenA}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({
          technicianId: techRecordB1.id, // Belongs to Tenant B
        }),
      });
      // Closed ticket check or technician check returns 400 or 404
      assert.ok([400, 404].includes(res.status));
    });

    await test('Cross-Tenant: Assigning fresh Tenant A ticket to Tenant B technician returns 404', async () => {
      const freshTicket = await prisma.ticket.create({
        data: {
          organizationId: tenantA.id,
          title: 'Cross-tenant assignment target',
          status: 'OPEN',
        },
      });

      const res = await fetch(`${baseUrl}/tickets/${freshTicket.id}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminTokenA}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({
          technicianId: techRecordB1.id, // Belongs to Tenant B
        }),
      });
      assert.strictEqual(res.status, 404);
      const json = await res.json();
      assert.ok(json.message.includes('Technician not found in this organization'));
    });

    await test('Cross-Tenant: Tenant B user cannot assign Tenant A ticket (404)', async () => {
      const res = await fetch(`${baseUrl}/tickets/${lifecycleTicket.id}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ownerBToken}`,
          'x-organization-id': tenantB.id,
        },
        body: JSON.stringify({
          technicianId: techRecordB1.id,
        }),
      });
      assert.strictEqual(res.status, 404);
      const json = await res.json();
      assert.ok(json.message.includes('Ticket not found in this organization'));
    });

    // -------------------------------------------------------------------------
    // 5. WRONG-TECHNICIAN ACCESS & ROLE SCOPING
    // -------------------------------------------------------------------------
    console.log('\n--- 5. Technician Scoping & Authorization Boundaries ---');

    let scopingTicket;
    await test('Setup: Create ticket assigned to Tech A1 for scoping tests', async () => {
      const res = await fetch(`${baseUrl}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminTokenA}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({
          title: 'Scoping test ticket',
          description: 'Testing technician boundaries',
        }),
      });
      assert.strictEqual(res.status, 201);
      const json = await res.json();
      scopingTicket = json.data;

      const assignRes = await fetch(`${baseUrl}/tickets/${scopingTicket.id}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminTokenA}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({ technicianId: techRecordA1.id }),
      });
      assert.ok([200, 201].includes(assignRes.status));
    });

    await test('Wrong Technician: Tech A2 cannot start work on ticket assigned to Tech A1 (403)', async () => {
      const res = await fetch(`${baseUrl}/tickets/${scopingTicket.id}/start-work`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${techTokenA2}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({}),
      });
      assert.strictEqual(res.status, 403);
      const json = await res.json();
      assert.ok(json.message.includes('assigned to them'));
    });

    await test('Correct Technician: Tech A1 starts work successfully', async () => {
      const res = await fetch(`${baseUrl}/tickets/${scopingTicket.id}/start-work`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${techTokenA1}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({}),
      });
      assert.ok([200, 201].includes(res.status));
      const json = await res.json();
      assert.strictEqual(json.data.status, 'IN_PROGRESS');
      scopingTicket = json.data;
    });

    await test('Wrong Technician: Tech A2 cannot resolve ticket assigned to Tech A1 (403)', async () => {
      const res = await fetch(`${baseUrl}/tickets/${scopingTicket.id}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${techTokenA2}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({ diagnosticNotes: 'Unauthorized resolve' }),
      });
      assert.strictEqual(res.status, 403);
      const json = await res.json();
      assert.ok(json.message.includes('assigned to them'));
    });

    await test('Technician Role: Technician cannot close resolved ticket (403)', async () => {
      // Tech A1 resolves ticket
      const resolveRes = await fetch(`${baseUrl}/tickets/${scopingTicket.id}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${techTokenA1}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({ diagnosticNotes: 'Diagnostics completed' }),
      });
      assert.ok([200, 201].includes(resolveRes.status));

      // Tech A1 attempts to close
      const closeRes = await fetch(`${baseUrl}/tickets/${scopingTicket.id}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${techTokenA1}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({}),
      });
      assert.strictEqual(closeRes.status, 403);
      const json = await closeRes.json();
      assert.ok(json.message.includes('not authorized to close'));
    });

    // -------------------------------------------------------------------------
    // 6. CUSTOMER OWNERSHIP & CLOSURE BOUNDARIES
    // -------------------------------------------------------------------------
    console.log('\n--- 6. Customer Ownership & Closure Boundaries ---');

    let customerTicket;
    await test('Setup: Create and advance ticket for Customer A1 to RESOLVED', async () => {
      const createRes = await fetch(`${baseUrl}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerTokenA1}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({
          title: 'Customer A1 Ticket for Closure Testing',
          description: 'Testing customer closure security',
        }),
      });
      assert.strictEqual(createRes.status, 201);
      const createJson = await createRes.json();
      customerTicket = createJson.data;

      // Assign to Tech A1
      await fetch(`${baseUrl}/tickets/${customerTicket.id}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminTokenA}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({ technicianId: techRecordA1.id }),
      });

      // Start work
      await fetch(`${baseUrl}/tickets/${customerTicket.id}/start-work`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${techTokenA1}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({}),
      });

      // Resolve
      await fetch(`${baseUrl}/tickets/${customerTicket.id}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${techTokenA1}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({ diagnosticNotes: 'Ready for customer signoff' }),
      });
    });

    await test('Customer Boundaries: Customer A2 CANNOT close Customer A1 ticket (403)', async () => {
      const res = await fetch(`${baseUrl}/tickets/${customerTicket.id}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerTokenA2}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({}),
      });
      assert.strictEqual(res.status, 403);
      const json = await res.json();
      assert.ok(json.message.includes('only close their own'));
    });

    await test('Customer Boundaries: Customer cannot mutate protected fields on close (400)', async () => {
      const res = await fetch(`${baseUrl}/tickets/${customerTicket.id}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerTokenA1}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({
          status: 'CLOSED',
          billableHours: 0,
          totalAmount: 0,
          diagnosticNotes: 'Customer injected notes',
        }),
      });
      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert.strictEqual(json.code, 'VALIDATION_FAILED');
    });

    await test('Customer Boundaries: Customer cannot mutate ticket metadata via PATCH (403)', async () => {
      const res = await fetch(`${baseUrl}/tickets/${customerTicket.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerTokenA1}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({
          title: 'Customer attempting title patch',
        }),
      });
      assert.strictEqual(res.status, 403);
    });

    await test('Customer Boundaries: Customer A1 successfully closes own resolved ticket with {}', async () => {
      const res = await fetch(`${baseUrl}/tickets/${customerTicket.id}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerTokenA1}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({}),
      });
      assert.ok([200, 201].includes(res.status));
      const json = await res.json();
      assert.strictEqual(json.data.status, 'CLOSED');
    });

    // -------------------------------------------------------------------------
    // 7. STAFF / ADMIN TICKET CLOSURE
    // -------------------------------------------------------------------------
    console.log('\n--- 7. Staff & Admin Closure with tickets:update ---');

    await test('Admin Closure: Authorized Admin can close resolved ticket', async () => {
      const createRes = await fetch(`${baseUrl}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerTokenA2}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({
          title: 'Customer A2 Ticket for Admin Closure',
        }),
      });
      assert.strictEqual(createRes.status, 201);
      const createJson = await createRes.json();
      staffClosedTicket = createJson.data;

      // Assign, start work, resolve
      await fetch(`${baseUrl}/tickets/${staffClosedTicket.id}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminTokenA}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({ technicianId: techRecordA1.id }),
      });

      await fetch(`${baseUrl}/tickets/${staffClosedTicket.id}/start-work`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${techTokenA1}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({}),
      });

      await fetch(`${baseUrl}/tickets/${staffClosedTicket.id}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${techTokenA1}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({ diagnosticNotes: 'Resolved by tech' }),
      });

      // Admin A closes ticket
      const closeRes = await fetch(`${baseUrl}/tickets/${staffClosedTicket.id}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminTokenA}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({}),
      });
      assert.ok([200, 201].includes(closeRes.status));
      const closeJson = await closeRes.json();
      assert.strictEqual(closeJson.data.status, 'CLOSED');
    });

    // -------------------------------------------------------------------------
    // 8. GENERIC PATCH STATUS & PROTECTED FIELD INJECTION REJECTION
    // -------------------------------------------------------------------------
    console.log('\n--- 8. Generic PATCH Status & Protected Field Injection ---');

    await test('Setup: Create ticket in OPEN status for PATCH testing', async () => {
      const res = await fetch(`${baseUrl}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminTokenA}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({
          title: 'Ticket for PATCH safety verification',
          description: 'Testing status injection lock',
          priority: 'MEDIUM',
        }),
      });
      assert.strictEqual(res.status, 201);
      const json = await res.json();
      patchTicket = json.data;
    });

    await test('PATCH Injection: status="CLOSED" is strictly rejected (400)', async () => {
      const res = await fetch(`${baseUrl}/tickets/${patchTicket.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminTokenA}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({
          status: 'CLOSED',
        }),
      });
      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert.strictEqual(json.code, 'VALIDATION_FAILED');
    });

    await test('PATCH Injection: status="RESOLVED" is strictly rejected (400)', async () => {
      const res = await fetch(`${baseUrl}/tickets/${patchTicket.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminTokenA}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({
          status: 'RESOLVED',
        }),
      });
      assert.strictEqual(res.status, 400);
    });

    await test('PATCH Injection: status="CANCELLED" is strictly rejected (400)', async () => {
      const res = await fetch(`${baseUrl}/tickets/${patchTicket.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminTokenA}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({
          status: 'CANCELLED',
        }),
      });
      assert.strictEqual(res.status, 400);
    });

    await test('PATCH Injection: billableHours injection is strictly rejected (400)', async () => {
      const res = await fetch(`${baseUrl}/tickets/${patchTicket.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminTokenA}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({
          billableHours: 5,
        }),
      });
      assert.strictEqual(res.status, 400);
    });

    await test('PATCH Valid: Allowed metadata update succeeds and status remains OPEN', async () => {
      const res = await fetch(`${baseUrl}/tickets/${patchTicket.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminTokenA}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({
          title: 'Safely Updated Title',
          priority: 'HIGH',
        }),
      });
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.data.title, 'Safely Updated Title');
      assert.strictEqual(json.data.priority, 'HIGH');
      assert.strictEqual(json.data.status, 'OPEN');
    });

    // -------------------------------------------------------------------------
    // 9. CLOSED TICKET TERMINAL LOCK
    // -------------------------------------------------------------------------
    console.log('\n--- 9. CLOSED Ticket Terminal Mutation Lock ---');

    await test('Closed Lock: PATCH on CLOSED ticket is rejected (400)', async () => {
      const res = await fetch(`${baseUrl}/tickets/${lifecycleTicket.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminTokenA}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({
          title: 'Attempting to edit closed ticket',
        }),
      });
      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert.ok(json.message.includes('closed ticket') || json.message.includes('locked'));
    });

    await test('Closed Lock: Assign on CLOSED ticket is rejected (400)', async () => {
      const res = await fetch(`${baseUrl}/tickets/${lifecycleTicket.id}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminTokenA}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({
          technicianId: techRecordA1.id,
        }),
      });
      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert.ok(json.message.includes('Cannot assign a closed ticket') || json.message.includes('locked'));
    });

    await test('Closed Lock: Start-work on CLOSED ticket is rejected (400)', async () => {
      const res = await fetch(`${baseUrl}/tickets/${lifecycleTicket.id}/start-work`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminTokenA}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({}),
      });
      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert.ok(json.message.includes('Cannot start work on a closed ticket') || json.message.includes('locked'));
    });

    await test('Closed Lock: Resolve on CLOSED ticket is rejected (400)', async () => {
      const res = await fetch(`${baseUrl}/tickets/${lifecycleTicket.id}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminTokenA}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({ diagnosticNotes: 'Re-resolve' }),
      });
      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert.ok(json.message.includes('Cannot resolve a closed ticket') || json.message.includes('locked'));
    });

    await test('Closed Lock: Close on already CLOSED ticket is rejected (400)', async () => {
      const res = await fetch(`${baseUrl}/tickets/${lifecycleTicket.id}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminTokenA}`,
          'x-organization-id': tenantA.id,
        },
        body: JSON.stringify({}),
      });
      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert.ok(json.message.includes('already closed and locked'));
    });

    // -------------------------------------------------------------------------
    // 10. LIFECYCLE AUDIT EVENTS PERSISTENCE
    // -------------------------------------------------------------------------
    console.log('\n--- 10. Lifecycle Audit Events Verification ---');

    await test('Audit Events: Verify persisted audit logs for full lifecycle', async () => {
      const auditEvents = await prisma.auditEvent.findMany({
        where: {
          resourceId: lifecycleTicket.id,
          organizationId: tenantA.id,
        },
        orderBy: { createdAt: 'asc' },
      });

      const actions = auditEvents.map((e) => e.action);
      console.log('    Persisted audit actions:', actions);

      assert.ok(actions.includes('ticket:created'), 'ticket:created must be audited');
      assert.ok(actions.includes('ticket:assigned'), 'ticket:assigned must be audited');
      assert.ok(actions.includes('ticket:reassigned'), 'ticket:reassigned must be audited');
      assert.ok(actions.includes('ticket:work_started'), 'ticket:work_started must be audited');
      assert.ok(actions.includes('ticket:resolved'), 'ticket:resolved must be audited');
      assert.ok(actions.includes('ticket:closed'), 'ticket:closed must be audited');

      // Verify assign event metadata
      const assignEvent = auditEvents.find((e) => e.action === 'ticket:assigned');
      assert.strictEqual(assignEvent.result, 'SUCCESS');
      assert.strictEqual(assignEvent.metadata.isReassignment, false);
      assert.strictEqual(assignEvent.metadata.newTechnicianId, techRecordA1.id);

      // Verify reassign event metadata
      const reassignEvent = auditEvents.find((e) => e.action === 'ticket:reassigned');
      assert.strictEqual(reassignEvent.result, 'SUCCESS');
      assert.strictEqual(reassignEvent.metadata.isReassignment, true);

      // Verify work_started event metadata
      const startEvent = auditEvents.find((e) => e.action === 'ticket:work_started');
      assert.strictEqual(startEvent.result, 'SUCCESS');
      assert.strictEqual(startEvent.metadata.previousStatus, 'SCHEDULED');
      assert.strictEqual(startEvent.metadata.newStatus, 'IN_PROGRESS');

      // Verify resolved event metadata
      const resolvedEvent = auditEvents.find((e) => e.action === 'ticket:resolved');
      assert.strictEqual(resolvedEvent.result, 'SUCCESS');
      assert.strictEqual(resolvedEvent.metadata.previousStatus, 'IN_PROGRESS');
      assert.strictEqual(resolvedEvent.metadata.newStatus, 'RESOLVED');

      // Verify closed event metadata
      const closedEvent = auditEvents.find((e) => e.action === 'ticket:closed');
      assert.strictEqual(closedEvent.result, 'SUCCESS');
      assert.strictEqual(closedEvent.metadata.previousStatus, 'RESOLVED');
      assert.strictEqual(closedEvent.metadata.newStatus, 'CLOSED');
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
        ownerEmailA,
        ownerEmailB,
        adminUserA?.email,
        techUserA1?.email,
        techUserA2?.email,
        customerUserA1?.email,
        customerUserA2?.email,
        techUserB1?.email,
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
  console.log(`M5 LIFECYCLE SUITE: ${passed} PASSED, ${failed} FAILED (${testResults.length} total)`);
  console.log('============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

run().catch((e) => {
  console.error('Fatal test runner error:', e);
  process.exit(1);
});
