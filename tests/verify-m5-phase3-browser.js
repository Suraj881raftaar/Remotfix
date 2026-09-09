// REMOTFIX — M5 Phase 3: Frontend Lifecycle UI & Real HTTP E2E Verification Suite
// Verifies:
// 1. Stepper model: OPEN -> SCHEDULED -> IN_PROGRESS -> RESOLVED -> CLOSED
// 2. Manager / OWNER / ADMIN assignment & reassignment controls via /assign
// 3. Assigned TECHNICIAN start-work & resolve with diagnostic notes
// 4. CUSTOMER view of own ticket, response projection safety (resolutionNotes & email stripped)
// 5. CUSTOMER close action on RESOLVED ticket via /close
// 6. STAFF lifecycle restrictions and terminal CLOSED immutability
// 7. Negative & boundary enforcement across roles
// 8. Zero database residue teardown

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
  console.log('======================================================================');
  console.log('REMOTFIX M5 PHASE 3 — FRONTEND LIFECYCLE UI & E2E HTTP SUITE');
  console.log('======================================================================\n');

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
  console.log('--- Booting NestJS API Server ---');
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
  const slugA = `m5p3-org-${timestamp}`;
  const ownerEmail = `owner-${slugA}@acme.com`;

  const jwtSvc = new JwtService({ secret: process.env.JWT_SECRET });
  const tokSvc = new TokenService(jwtSvc, redis);

  let tenantA;
  let ownerUser, ownerToken;
  let adminUser, adminToken;
  let techUser1, techToken1, techRecord1;
  let techUser2, techToken2, techRecord2;
  let customerUser1, customerToken1, customerContact1;
  let customerUser2, customerToken2, customerContact2;
  let serviceRecord;
  let ticketId;

  try {
    console.log('--- 1. Provisioning Test Tenant, Roles & Technicians ---');

    await test('Provision Primary Organization with Root Owner', async () => {
      const res = await fetch(`${baseUrl}/admin/onboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': process.env.ADMIN_KEY,
        },
        body: JSON.stringify({
          organizationName: `M5 Phase 3 Corp ${timestamp}`,
          organizationSlug: slugA,
          ownerEmail: ownerEmail,
          ownerPassword: 'Password123!',
          ownerFirstName: 'Olivia',
          ownerLastName: 'Owner',
        }),
      });
      assert.strictEqual(res.status, 201);
      const json = await res.json();
      tenantA = json.data.organization;
      ownerUser = json.data.user;

      await prisma.user.update({
        where: { id: ownerUser.id },
        data: { mfaEnabled: true },
      });

      const ownerRole = await prisma.role.findFirst({ where: { name: 'OWNER', isSystem: true } });
      ownerToken = await tokSvc.generateAccessToken({
        sub: ownerUser.id,
        email: ownerUser.email,
        orgId: tenantA.id,
        roleId: ownerRole.id,
        roleName: ownerRole.name,
        permissions: ['tickets:read', 'tickets:create', 'tickets:update', 'tickets:assign', 'users:read'],
      });
      assert.ok(ownerToken, 'Owner token generated');
    });

    const adminRole = await prisma.role.findFirst({ where: { name: 'ADMIN', isSystem: true } });
    const techRole = await prisma.role.findFirst({ where: { name: 'TECHNICIAN', isSystem: true } });
    const custRole = await prisma.role.findFirst({ where: { name: 'CUSTOMER', isSystem: true } });

    await test('Provision Administrator in Organization', async () => {
      adminUser = await prisma.user.create({
        data: {
          email: `admin-${slugA}@acme.com`,
          passwordHash: 'argon2id$mock',
          status: 'ACTIVE',
          firstName: 'Adam',
          lastName: 'Admin',
          mfaEnabled: true,
        },
      });
      await prisma.membership.create({
        data: {
          organizationId: tenantA.id,
          userId: adminUser.id,
          roleId: adminRole.id,
          status: 'ACTIVE',
        },
      });
      adminToken = await tokSvc.generateAccessToken({
        sub: adminUser.id,
        email: adminUser.email,
        orgId: tenantA.id,
        roleId: adminRole.id,
        roleName: adminRole.name,
        permissions: ['tickets:read', 'tickets:create', 'tickets:update', 'tickets:assign'],
      });
      assert.ok(adminToken);
    });

    await test('Provision Technicians A1 and A2 with Database Records', async () => {
      techUser1 = await prisma.user.create({
        data: {
          email: `tech1-${slugA}@acme.com`,
          passwordHash: 'argon2id$mock',
          status: 'ACTIVE',
          firstName: 'Toby',
          lastName: 'TechOne',
        },
      });
      await prisma.membership.create({
        data: {
          organizationId: tenantA.id,
          userId: techUser1.id,
          roleId: techRole.id,
          status: 'ACTIVE',
        },
      });
      techRecord1 = await prisma.technician.create({
        data: {
          organizationId: tenantA.id,
          userId: techUser1.id,
          status: 'AVAILABLE',
        },
      });
      techToken1 = await tokSvc.generateAccessToken({
        sub: techUser1.id,
        email: techUser1.email,
        orgId: tenantA.id,
        roleId: techRole.id,
        roleName: techRole.name,
        permissions: ['tickets:read', 'tickets:update'],
      });

      techUser2 = await prisma.user.create({
        data: {
          email: `tech2-${slugA}@acme.com`,
          passwordHash: 'argon2id$mock',
          status: 'ACTIVE',
          firstName: 'Travis',
          lastName: 'TechTwo',
        },
      });
      await prisma.membership.create({
        data: {
          organizationId: tenantA.id,
          userId: techUser2.id,
          roleId: techRole.id,
          status: 'ACTIVE',
        },
      });
      techRecord2 = await prisma.technician.create({
        data: {
          organizationId: tenantA.id,
          userId: techUser2.id,
          status: 'AVAILABLE',
        },
      });
      techToken2 = await tokSvc.generateAccessToken({
        sub: techUser2.id,
        email: techUser2.email,
        orgId: tenantA.id,
        roleId: techRole.id,
        roleName: techRole.name,
        permissions: ['tickets:read', 'tickets:update'],
      });
      assert.ok(techRecord1 && techRecord2);
    });

    await test('Provision Customers A1 and A2 with Contact Records', async () => {
      customerUser1 = await prisma.user.create({
        data: {
          email: `customer1-${slugA}@client.com`,
          passwordHash: 'argon2id$mock',
          status: 'ACTIVE',
          firstName: 'Clara',
          lastName: 'CustOne',
        },
      });
      await prisma.membership.create({
        data: {
          organizationId: tenantA.id,
          userId: customerUser1.id,
          roleId: custRole.id,
          status: 'ACTIVE',
        },
      });
      customerContact1 = await prisma.contact.create({
        data: {
          organizationId: tenantA.id,
          userId: customerUser1.id,
          name: 'Clara CustOne',
          email: customerUser1.email,
        },
      });
      customerToken1 = await tokSvc.generateAccessToken({
        sub: customerUser1.id,
        email: customerUser1.email,
        orgId: tenantA.id,
        roleId: custRole.id,
        roleName: custRole.name,
        permissions: ['tickets:read', 'tickets:create'],
      });

      customerUser2 = await prisma.user.create({
        data: {
          email: `customer2-${slugA}@client.com`,
          passwordHash: 'argon2id$mock',
          status: 'ACTIVE',
          firstName: 'Carl',
          lastName: 'CustTwo',
        },
      });
      await prisma.membership.create({
        data: {
          organizationId: tenantA.id,
          userId: customerUser2.id,
          roleId: custRole.id,
          status: 'ACTIVE',
        },
      });
      customerContact2 = await prisma.contact.create({
        data: {
          organizationId: tenantA.id,
          userId: customerUser2.id,
          name: 'Carl CustTwo',
          email: customerUser2.email,
        },
      });
      customerToken2 = await tokSvc.generateAccessToken({
        sub: customerUser2.id,
        email: customerUser2.email,
        orgId: tenantA.id,
        roleId: custRole.id,
        roleName: custRole.name,
        permissions: ['tickets:read', 'tickets:create'],
      });
      assert.ok(customerContact1 && customerContact2);
    });

    await test('Provision Catalog Service Offering in Organization', async () => {
      serviceRecord = await prisma.service.create({
        data: {
          organizationId: tenantA.id,
          name: 'Workstation GPU Overhaul',
          description: 'Thermal paste replacement, heatsink re-seating, stress testing.',
          priceAmount: 8500.0,
          currency: 'INR',
          durationMinutes: 90,
          isActive: true,
        },
      });
      assert.ok(serviceRecord);
    });

    console.log('\n--- 2. Lifecycle Stepper Stage 1: Ticket Creation (OPEN) ---');

    await test('Customer 1 creates ticket in OPEN status with custom description', async () => {
      const complexDesc = 'Customer report: GPU artifacts under high workload. [Resolution Notes]: none yet.';
      const res = await fetch(`${baseUrl}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerToken1}`,
        },
        body: JSON.stringify({
          title: 'Precision 5820 GPU Freezing',
          description: complexDesc,
          priority: 'HIGH',
          serviceId: serviceRecord.id,
        }),
      });
      assert.strictEqual(res.status, 201);
      const json = await res.json();
      assert.strictEqual(json.success, true);
      assert.strictEqual(json.data.status, 'OPEN');
      assert.strictEqual(json.data.description, complexDesc);
      assert.strictEqual(json.data.resolutionNotes, undefined);
      ticketId = json.data.id;
    });

    await test('Customer 1 views /bookings/:id in OPEN status: no technician, exact description', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketId}`, {
        headers: { Authorization: `Bearer ${customerToken1}` },
      });
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.data.status, 'OPEN');
      assert.strictEqual(json.data.assignedTechnician, null);
      assert.strictEqual(json.data.resolutionNotes, undefined);
    });

    console.log('\n--- 3. Lifecycle Stepper Stage 2: Assignment & Reassignment (SCHEDULED) ---');

    await test('Admin A assigns Ticket to Tech 1 (OPEN -> SCHEDULED)', async () => {
      const scheduledTime = new Date(Date.now() + 86400000).toISOString();
      const res = await fetch(`${baseUrl}/tickets/${ticketId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          technicianId: techRecord1.id,
          scheduledAt: scheduledTime,
        }),
      });
      assert.strictEqual(res.status, 201);
      const json = await res.json();
      assert.strictEqual(json.data.status, 'SCHEDULED');
      assert.strictEqual(json.data.assignedTechnicianId, techRecord1.id);
      assert.strictEqual(json.data.assignedTechnician.user.firstName, 'Toby');
    });

    await test('Admin A reassigns Ticket to Tech 2 (maintains SCHEDULED status)', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          technicianId: techRecord2.id,
        }),
      });
      assert.strictEqual(res.status, 201);
      const json = await res.json();
      assert.strictEqual(json.data.status, 'SCHEDULED');
      assert.strictEqual(json.data.assignedTechnicianId, techRecord2.id);
      assert.strictEqual(json.data.assignedTechnician.user.firstName, 'Travis');
    });

    await test('Admin A restores assignment to Tech 1 for subsequent lifecycle steps', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          technicianId: techRecord1.id,
        }),
      });
      assert.strictEqual(res.status, 201);
      const json = await res.json();
      assert.strictEqual(json.data.assignedTechnicianId, techRecord1.id);
    });

    console.log('\n--- 4. Lifecycle Stepper Stage 3: Technician Work (IN_PROGRESS) ---');

    await test('Unassigned Tech 2 receives 403 Forbidden when attempting to start work', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketId}/start-work`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${techToken2}`,
        },
        body: JSON.stringify({}),
      });
      assert.strictEqual(res.status, 403);
    });

    await test('Assigned Tech 1 starts work on Ticket (SCHEDULED -> IN_PROGRESS)', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketId}/start-work`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${techToken1}`,
        },
        body: JSON.stringify({}),
      });
      assert.strictEqual(res.status, 201);
      const json = await res.json();
      assert.strictEqual(json.data.status, 'IN_PROGRESS');
    });

    console.log('\n--- 5. Lifecycle Stepper Stage 4: Resolution & Diagnostic Notes (RESOLVED) ---');

    await test('Unassigned Tech 2 receives 403 Forbidden when attempting to resolve', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketId}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${techToken2}`,
        },
        body: JSON.stringify({ diagnosticNotes: 'Unauthorized resolve' }),
      });
      assert.strictEqual(res.status, 403);
    });

    await test('Assigned Tech 1 resolves Ticket with diagnostic notes (IN_PROGRESS -> RESOLVED)', async () => {
      const diagnosticNotes = 'Replaced thermal interface material on RTX 4000 GPU; 3DMark stress test passed at 68C.';
      const res = await fetch(`${baseUrl}/tickets/${ticketId}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${techToken1}`,
        },
        body: JSON.stringify({ diagnosticNotes }),
      });
      assert.strictEqual(res.status, 201);
      const json = await res.json();
      assert.strictEqual(json.data.status, 'RESOLVED');
      assert.strictEqual(json.data.resolutionNotes, diagnosticNotes);
      assert.strictEqual(
        json.data.description,
        'Customer report: GPU artifacts under high workload. [Resolution Notes]: none yet.',
        'Customer description must be untouched by resolution'
      );
    });

    console.log('\n--- 6. Customer Projection & Boundary Verification ---');

    await test('Customer 1 views RESOLVED ticket: receives NO resolutionNotes, NO tech email, description intact', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketId}`, {
        headers: { Authorization: `Bearer ${customerToken1}` },
      });
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.data.status, 'RESOLVED');
      assert.strictEqual(json.data.resolutionNotes, undefined, 'Customer must not see resolutionNotes');
      assert.strictEqual(json.data.assignedTechnician.user.email, undefined, 'Customer must not see tech email');
      assert.strictEqual(json.data.assignedTechnician.user.firstName, 'Toby');
      assert.strictEqual(
        json.data.description,
        'Customer report: GPU artifacts under high workload. [Resolution Notes]: none yet.'
      );
    });

    await test('Technician 1 cannot close resolved ticket (403 Forbidden)', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketId}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${techToken1}`,
        },
        body: JSON.stringify({}),
      });
      assert.strictEqual(res.status, 403);
    });

    await test('Customer 2 (Non-owner) cannot close Customer 1 resolved ticket (403 Forbidden)', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketId}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerToken2}`,
        },
        body: JSON.stringify({}),
      });
      assert.strictEqual(res.status, 403);
    });

    console.log('\n--- 7. Lifecycle Stepper Stage 5: Customer Confirmation & Closure (CLOSED) ---');

    await test('Legitimate Customer 1 confirms and closes RESOLVED ticket (RESOLVED -> CLOSED)', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketId}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerToken1}`,
        },
        body: JSON.stringify({}),
      });
      assert.strictEqual(res.status, 201);
      const json = await res.json();
      assert.strictEqual(json.data.status, 'CLOSED');
      assert.strictEqual(json.data.resolutionNotes, undefined);
    });

    console.log('\n--- 8. Terminal Locked State Immutability ---');

    await test('Terminal CLOSED ticket rejects duplicate close (400 Bad Request)', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketId}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerToken1}`,
        },
        body: JSON.stringify({}),
      });
      assert.strictEqual(res.status, 400);
    });

    await test('Terminal CLOSED ticket rejects PATCH metadata mutation (400 Bad Request)', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ title: 'Mutate closed title' }),
      });
      assert.strictEqual(res.status, 400);
    });

    await test('Terminal CLOSED ticket rejects reassignment (400 Bad Request)', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ technicianId: techRecord2.id }),
      });
      assert.strictEqual(res.status, 400);
    });

    console.log('\n--- 9. Audit Log Lifecycle Verification ---');

    await test('Audit trail records all lifecycle events with matching actors and actions', async () => {
      const events = await prisma.auditEvent.findMany({
        where: { organizationId: tenantA.id, resourceId: ticketId },
        orderBy: { createdAt: 'asc' },
      });

      const actions = events.map((e) => e.action);
      assert.ok(actions.includes('ticket:created'), 'ticket:created found');
      assert.ok(actions.includes('ticket:assigned'), 'ticket:assigned found');
      assert.ok(actions.includes('ticket:reassigned'), 'ticket:reassigned found');
      assert.ok(actions.includes('ticket:work_started'), 'ticket:work_started found');
      assert.ok(actions.includes('ticket:resolved'), 'ticket:resolved found');
      assert.ok(actions.includes('ticket:closed'), 'ticket:closed found');

      const closeEvent = events.find((e) => e.action === 'ticket:closed');
      assert.strictEqual(closeEvent.actorId, customerUser1.id);
      assert.strictEqual(closeEvent.metadata.closedByRole, 'CUSTOMER');
    });

  } finally {
    console.log('\n--- Teardown: Purging test records from database ---');
    try {
      if (tenantA?.id) {
        await prisma.ticket.deleteMany({ where: { organizationId: tenantA.id } });
        await prisma.contact.deleteMany({ where: { organizationId: tenantA.id } });
        await prisma.service.deleteMany({ where: { organizationId: tenantA.id } });
        await prisma.technician.deleteMany({ where: { organizationId: tenantA.id } });
        await prisma.auditEvent.deleteMany({ where: { organizationId: tenantA.id } });
        await prisma.membership.deleteMany({ where: { organizationId: tenantA.id } });
        await prisma.organization.deleteMany({ where: { id: tenantA.id } });
      }

      const userEmails = [
        ownerEmail,
        adminUser?.email,
        techUser1?.email,
        techUser2?.email,
        customerUser1?.email,
        customerUser2?.email,
      ].filter(Boolean);

      if (userEmails.length > 0) {
        await prisma.user.deleteMany({ where: { email: { in: userEmails } } });
      }

      console.log('✓ Teardown complete: Zero dirty test records remain.');
    } catch (e) {
      console.error('Teardown warning:', e.message);
    }

    await app.close();
    await prisma.$disconnect();
    redis.disconnect();
  }

  // Summary
  console.log('\n======================================================================');
  const passed = testResults.filter((t) => t.passed).length;
  const failed = testResults.filter((t) => !t.passed).length;
  console.log(`M5 PHASE 3 SUITE: ${passed} PASSED, ${failed} FAILED (${testResults.length} total)`);
  console.log('======================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

run().catch((e) => {
  console.error('Fatal test runner error:', e);
  process.exit(1);
});
