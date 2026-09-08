// REMOTFIX — M5 Phase 2: Role Scoping & Boundary Hardening HTTP Integration Test Suite
// Verifies:
// 1. Cross-tenant denial (404 on all ticket access across tenant boundaries)
// 2. Cross-technician denial (403 on read, update, start-work, resolve of tickets assigned to other technicians)
// 3. Customer ownership denial (403 on read, update, close, or contact-spoofing on other customers' tickets)
// 4. Protected-field exposure prevention (sanitization of diagnostic notes, financial fields, and staff PII for CUSTOMER)
// 5. STAFF lifecycle boundary enforcement (cannot bypass status, cannot assign, cannot prematurely resolve or close, can close resolved)
// 6. Legitimate access verification for all roles

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
  console.log('REMOTFIX M5 PHASE 2 — ROLE SCOPING & BOUNDARY HARDENING HTTP SUITE');
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
  const slugA = `m5p2-org-a-${timestamp}`;
  const slugB = `m5p2-org-b-${timestamp}`;
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
  let staffUserA, staffTokenA;
  let techUserA1, techTokenA1, techRecordA1;
  let techUserA2, techTokenA2, techRecordA2;
  let customerUserA1, customerTokenA1, customerContactA1;
  let customerUserA2, customerTokenA2, customerContactA2;
  let serviceA1;

  let techUserB1, techTokenB1, techRecordB1;
  let customerUserB1, customerTokenB1, customerContactB1;

  let ticketA1Id;
  let ticketAStaffId;

  try {
    console.log('--- 1. Provisioning Test Tenants and Roles ---');

    await test('Provision Primary Tenant A with Owner A', async () => {
      const res = await fetch(`${baseUrl}/admin/onboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': process.env.ADMIN_KEY,
        },
        body: JSON.stringify({
          organizationName: `M5 Phase 2 Corp A ${timestamp}`,
          organizationSlug: slugA,
          ownerEmail: ownerEmailA,
          ownerPassword: 'Password123!',
          ownerFirstName: 'Alice',
          ownerLastName: 'OwnerA',
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
          organizationName: `M5 Phase 2 Corp B ${timestamp}`,
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
    const staffRole = await prisma.role.findFirst({ where: { name: 'STAFF', isSystem: true } });
    const techRole = await prisma.role.findFirst({ where: { name: 'TECHNICIAN', isSystem: true } });
    const custRole = await prisma.role.findFirst({ where: { name: 'CUSTOMER', isSystem: true } });

    await test('Provision Admin A and Staff A in Tenant A', async () => {
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

      staffUserA = await prisma.user.create({
        data: {
          email: `staff-a-${timestamp}@acme.com`,
          passwordHash: 'dummy',
          status: 'ACTIVE',
          mfaEnabled: false,
          firstName: 'Sam',
          lastName: 'Staff',
        },
      });
      await prisma.membership.create({
        data: {
          organizationId: tenantA.id,
          userId: staffUserA.id,
          roleId: staffRole.id,
          status: 'ACTIVE',
        },
      });
      staffTokenA = await tokSvc.generateAccessToken({
        sub: staffUserA.id,
        email: staffUserA.email,
        orgId: tenantA.id,
        roleId: staffRole.id,
        roleName: staffRole.name,
        permissions: [],
      });

      assert.ok(adminTokenA && staffTokenA, 'Admin and Staff tokens generated');
    });

    await test('Provision Technicians A1 and A2 in Tenant A', async () => {
      techUserA1 = await prisma.user.create({
        data: {
          email: `tech-a1-${timestamp}@acme.com`,
          passwordHash: 'dummy',
          status: 'ACTIVE',
          mfaEnabled: false,
          firstName: 'Tom',
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
          mfaEnabled: false,
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

      assert.ok(techTokenA1 && techTokenA2, 'Technicians A1 and A2 initialized');
    });

    await test('Provision Customers A1 and A2 in Tenant A', async () => {
      customerUserA1 = await prisma.user.create({
        data: {
          email: `cust-a1-${timestamp}@acme.com`,
          passwordHash: 'dummy',
          status: 'ACTIVE',
          mfaEnabled: false,
          firstName: 'Claire',
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
          name: 'Claire CustomerOne',
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
          email: `cust-a2-${timestamp}@acme.com`,
          passwordHash: 'dummy',
          status: 'ACTIVE',
          mfaEnabled: false,
          firstName: 'Carl',
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
          name: 'Carl CustomerTwo',
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

      assert.ok(customerTokenA1 && customerTokenA2, 'Customers A1 and A2 initialized');
    });

    await test('Provision Tech B1 and Customer B1 in Foreign Tenant B', async () => {
      techUserB1 = await prisma.user.create({
        data: {
          email: `tech-b1-${timestamp}@foreign.com`,
          passwordHash: 'dummy',
          status: 'ACTIVE',
          mfaEnabled: false,
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

      customerUserB1 = await prisma.user.create({
        data: {
          email: `cust-b1-${timestamp}@foreign.com`,
          passwordHash: 'dummy',
          status: 'ACTIVE',
          mfaEnabled: false,
          firstName: 'Brenda',
          lastName: 'CustForeign',
        },
      });
      await prisma.membership.create({
        data: {
          organizationId: tenantB.id,
          userId: customerUserB1.id,
          roleId: custRole.id,
          status: 'ACTIVE',
        },
      });
      customerContactB1 = await prisma.contact.create({
        data: {
          organizationId: tenantB.id,
          userId: customerUserB1.id,
          name: 'Brenda CustForeign',
          email: customerUserB1.email,
        },
      });
      customerTokenB1 = await tokSvc.generateAccessToken({
        sub: customerUserB1.id,
        email: customerUserB1.email,
        orgId: tenantB.id,
        roleId: custRole.id,
        roleName: custRole.name,
        permissions: [],
      });

      assert.ok(techTokenB1 && customerTokenB1, 'Foreign Tenant B users initialized');
    });

    await test('Provision Service Catalog item in Tenant A', async () => {
      serviceA1 = await prisma.service.create({
        data: {
          organizationId: tenantA.id,
          name: 'Hardware Diagnostic and Board Repair',
          description: 'Full inspection and board repair',
          priceAmount: 1499.0,
          currency: 'INR',
          durationMinutes: 90,
          isActive: true,
        },
      });
      assert.ok(serviceA1.id, 'Service created in Tenant A');
    });

    console.log('\n--- 2. Cross-Tenant Denial Tests ---');

    await test('Customer A1 creates initial Ticket A1 in Tenant A', async () => {
      const res = await fetch(`${baseUrl}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerTokenA1}`,
        },
        body: JSON.stringify({
          title: 'Laptop display flickering on battery',
          description: 'Screen flashes black every 30 seconds when unplugged.',
          priority: 'HIGH',
          serviceId: serviceA1.id,
        }),
      });
      assert.strictEqual(res.status, 201);
      const json = await res.json();
      ticketA1Id = json.data.id;
      assert.ok(ticketA1Id, 'Ticket A1 created');
      assert.strictEqual(json.data.status, 'OPEN');
    });

    await test('Admin A assigns Ticket A1 to Tech A1 (transitions to SCHEDULED)', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketA1Id}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminTokenA}`,
        },
        body: JSON.stringify({
          technicianId: techRecordA1.id,
          scheduledAt: new Date(Date.now() + 86400000).toISOString(),
        }),
      });
      assert.strictEqual(res.status, 201);
      const json = await res.json();
      assert.strictEqual(json.data.status, 'SCHEDULED');
      assert.strictEqual(json.data.assignedTechnicianId, techRecordA1.id);
    });

    await test('Foreign Owner B receives 404 Not Found on GET /tickets/:ticketA1Id', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketA1Id}`, {
        headers: { Authorization: `Bearer ${ownerBToken}` },
      });
      assert.strictEqual(res.status, 404);
      const json = await res.json();
      assert.match(json.message, /not found in this organization/i);
    });

    await test('Foreign Tech B1 receives 404 Not Found on GET /tickets/:ticketA1Id', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketA1Id}`, {
        headers: { Authorization: `Bearer ${techTokenB1}` },
      });
      assert.strictEqual(res.status, 404);
    });

    await test('Foreign Customer B1 receives 404 Not Found on GET /tickets/:ticketA1Id', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketA1Id}`, {
        headers: { Authorization: `Bearer ${customerTokenB1}` },
      });
      assert.strictEqual(res.status, 404);
    });

    await test('Foreign Owner B receives 404 Not Found on PATCH /tickets/:ticketA1Id', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketA1Id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ownerBToken}`,
        },
        body: JSON.stringify({ title: 'Tampered Title by Foreign Owner' }),
      });
      assert.strictEqual(res.status, 404);
    });

    await test('Foreign Tech B1 receives 404 Not Found on POST /tickets/:ticketA1Id/start-work', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketA1Id}/start-work`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${techTokenB1}`,
        },
        body: JSON.stringify({}),
      });
      assert.strictEqual(res.status, 404);
    });

    await test('Foreign Tech B1 receives 404 Not Found on POST /tickets/:ticketA1Id/resolve', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketA1Id}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${techTokenB1}`,
        },
        body: JSON.stringify({ diagnosticNotes: 'Foreign resolve attempt' }),
      });
      assert.strictEqual(res.status, 404);
    });

    await test('Foreign Customer B1 receives 404 Not Found on POST /tickets/:ticketA1Id/close', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketA1Id}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerTokenB1}`,
        },
        body: JSON.stringify({}),
      });
      assert.strictEqual(res.status, 404);
    });

    await test('Foreign Tech B1 listing GET /tickets returns 0 items', async () => {
      const res = await fetch(`${baseUrl}/tickets`, {
        headers: { Authorization: `Bearer ${techTokenB1}` },
      });
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.data.items.length, 0);
      assert.strictEqual(json.data.total, 0);
    });

    await test('Foreign Customer B1 listing GET /tickets returns 0 items', async () => {
      const res = await fetch(`${baseUrl}/tickets`, {
        headers: { Authorization: `Bearer ${customerTokenB1}` },
      });
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.data.items.length, 0);
      assert.strictEqual(json.data.total, 0);
    });

    console.log('\n--- 3. Cross-Technician Denial Tests ---');

    await test('Unassigned Tech A2 receives 403 Forbidden on GET /tickets/:ticketA1Id', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketA1Id}`, {
        headers: { Authorization: `Bearer ${techTokenA2}` },
      });
      assert.strictEqual(res.status, 403);
      const json = await res.json();
      assert.match(json.message, /technicians may only access tickets assigned to them/i);
    });

    await test('Unassigned Tech A2 receives 403 Forbidden on PATCH /tickets/:ticketA1Id', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketA1Id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${techTokenA2}`,
        },
        body: JSON.stringify({ title: 'Unauthorized tech patch' }),
      });
      assert.strictEqual(res.status, 403);
    });

    await test('Unassigned Tech A2 receives 403 Forbidden on POST /tickets/:ticketA1Id/start-work', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketA1Id}/start-work`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${techTokenA2}`,
        },
        body: JSON.stringify({}),
      });
      assert.strictEqual(res.status, 403);
      const json = await res.json();
      assert.match(json.message, /technicians may only start work on tickets assigned to them/i);
    });

    await test('Unassigned Tech A2 listing GET /tickets does NOT contain Ticket A1', async () => {
      const res = await fetch(`${baseUrl}/tickets`, {
        headers: { Authorization: `Bearer ${techTokenA2}` },
      });
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      const found = json.data.items.find((t) => t.id === ticketA1Id);
      assert.strictEqual(found, undefined, 'Ticket A1 must not be in Tech A2 list');
    });

    await test('Legitimate Tech A1 receives 200 OK on GET /tickets/:ticketA1Id', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketA1Id}`, {
        headers: { Authorization: `Bearer ${techTokenA1}` },
      });
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.data.id, ticketA1Id);
      assert.strictEqual(json.data.assignedTechnicianId, techRecordA1.id);
    });

    await test('Legitimate Tech A1 listing GET /tickets contains Ticket A1', async () => {
      const res = await fetch(`${baseUrl}/tickets`, {
        headers: { Authorization: `Bearer ${techTokenA1}` },
      });
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      const found = json.data.items.find((t) => t.id === ticketA1Id);
      assert.ok(found, 'Ticket A1 must be present in Tech A1 list');
    });

    await test('Legitimate Tech A1 calls POST /tickets/:ticketA1Id/start-work (SCHEDULED -> IN_PROGRESS)', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketA1Id}/start-work`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${techTokenA1}`,
        },
        body: JSON.stringify({}),
      });
      assert.strictEqual(res.status, 201);
      const json = await res.json();
      assert.strictEqual(json.data.status, 'IN_PROGRESS');
    });

    await test('Unassigned Tech A2 receives 403 Forbidden on POST /tickets/:ticketA1Id/resolve', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketA1Id}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${techTokenA2}`,
        },
        body: JSON.stringify({ diagnosticNotes: 'Tech 2 illegal resolve' }),
      });
      assert.strictEqual(res.status, 403);
      const json = await res.json();
      assert.match(json.message, /technicians may only resolve tickets assigned to them/i);
    });

    await test('Tech A1 receives 400 Bad Request on premature POST /tickets/:ticketA1Id/close while IN_PROGRESS', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketA1Id}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${techTokenA1}`,
        },
        body: JSON.stringify({}),
      });
      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert.match(json.message, /ticket must be in resolved status before it can be closed/i);
    });

    await test('Legitimate Tech A1 resolves Ticket A1 with diagnostic notes (IN_PROGRESS -> RESOLVED)', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketA1Id}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${techTokenA1}`,
        },
        body: JSON.stringify({
          diagnosticNotes: 'Replaced inverter board capacitor C12; voltage rails stabilized at 3.3V.',
        }),
      });
      assert.strictEqual(res.status, 201);
      const json = await res.json();
      assert.strictEqual(json.data.status, 'RESOLVED');
      assert.strictEqual(
        json.data.resolutionNotes,
        'Replaced inverter board capacitor C12; voltage rails stabilized at 3.3V.',
        'Structured resolutionNotes must be stored'
      );
      assert.strictEqual(
        json.data.description,
        'Screen flashes black every 30 seconds when unplugged.',
        'Customer description must remain untouched'
      );
    });

    await test('Tech A1 (or any technician) receives 403 Forbidden on POST /tickets/:ticketA1Id/close on RESOLVED ticket', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketA1Id}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${techTokenA1}`,
        },
        body: JSON.stringify({}),
      });
      assert.strictEqual(res.status, 403);
      const json = await res.json();
      assert.match(json.message, /role TECHNICIAN is not authorized to close tickets/i);
    });

    console.log('\n--- 4. Customer Ownership Denial Tests ---');

    await test('Customer A2 receives 403 Forbidden on GET /tickets/:ticketA1Id', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketA1Id}`, {
        headers: { Authorization: `Bearer ${customerTokenA2}` },
      });
      assert.strictEqual(res.status, 403);
      const json = await res.json();
      assert.match(json.message, /customers may only access their own service tickets/i);
    });

    await test('Customer A2 receives 403 Forbidden on PATCH /tickets/:ticketA1Id', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketA1Id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerTokenA2}`,
        },
        body: JSON.stringify({ title: 'Customer 2 tamper' }),
      });
      // Customer has no tickets:update permission -> 403
      assert.strictEqual(res.status, 403);
    });

    await test('Customer A2 receives 403 Forbidden on POST /tickets/:ticketA1Id/close', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketA1Id}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerTokenA2}`,
        },
        body: JSON.stringify({}),
      });
      assert.strictEqual(res.status, 403);
      const json = await res.json();
      assert.match(json.message, /customers may only close their own tickets/i);
    });

    await test('Customer A2 listing GET /tickets does NOT contain Customer A1 Ticket A1', async () => {
      const res = await fetch(`${baseUrl}/tickets`, {
        headers: { Authorization: `Bearer ${customerTokenA2}` },
      });
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      const found = json.data.items.find((t) => t.id === ticketA1Id);
      assert.strictEqual(found, undefined, 'Customer A1 ticket must not appear in Customer A2 list');
    });

    await test('Customer A2 receives 403 Forbidden when creating ticket with Customer A1 contactId', async () => {
      const res = await fetch(`${baseUrl}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerTokenA2}`,
        },
        body: JSON.stringify({
          title: 'Spoofed contact ticket',
          contactId: customerContactA1.id,
        }),
      });
      assert.strictEqual(res.status, 403);
      const json = await res.json();
      assert.match(json.message, /customers may only create tickets for their own contact record/i);
    });

    await test('Legitimate Customer A1 receives 200 OK on GET /tickets/:ticketA1Id', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketA1Id}`, {
        headers: { Authorization: `Bearer ${customerTokenA1}` },
      });
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.data.id, ticketA1Id);
    });

    await test('Legitimate Customer A1 listing GET /tickets contains Ticket A1', async () => {
      const res = await fetch(`${baseUrl}/tickets`, {
        headers: { Authorization: `Bearer ${customerTokenA1}` },
      });
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      const found = json.data.items.find((t) => t.id === ticketA1Id);
      assert.ok(found, 'Ticket A1 must be present in Customer A1 list');
    });

    console.log('\n--- 5. Protected-Field Exposure Prevention Tests ---');

    await test('Customer A1 GET /tickets/:ticketA1Id omits resolutionNotes, billing, and staff PII', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketA1Id}`, {
        headers: { Authorization: `Bearer ${customerTokenA1}` },
      });
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      const ticket = json.data;

      // Description remains 100% exactly as stored by customer
      assert.strictEqual(
        ticket.description,
        'Screen flashes black every 30 seconds when unplugged.',
        'Customer original description must be preserved exactly'
      );

      // Sensitive / internal operational fields must be omitted
      assert.strictEqual(ticket.resolutionNotes, undefined, 'resolutionNotes must be omitted for CUSTOMER');
      assert.strictEqual(ticket.diagnosticNotes, undefined, 'diagnosticNotes must be omitted for CUSTOMER');
      assert.strictEqual(ticket.internalNotes, undefined, 'internalNotes must be omitted for CUSTOMER');
      assert.strictEqual(ticket.technicianNotes, undefined, 'technicianNotes must be omitted for CUSTOMER');
      assert.strictEqual(ticket.billableHours, undefined, 'billableHours must be omitted for CUSTOMER');
      assert.strictEqual(ticket.totalAmount, undefined, 'totalAmount must be omitted for CUSTOMER');

      // Internal staff email must be omitted from assignedTechnician relation
      assert.ok(ticket.assignedTechnician, 'assignedTechnician relation present');
      assert.ok(ticket.assignedTechnician.user, 'assignedTechnician.user present');
      assert.strictEqual(
        ticket.assignedTechnician.user.email,
        undefined,
        'Staff user email must be omitted for CUSTOMER'
      );
      assert.strictEqual(
        ticket.assignedTechnician.user.firstName,
        'Tom',
        'Staff firstName is appropriately visible'
      );
      assert.strictEqual(
        ticket.assignedTechnician.user.lastName,
        'TechOne',
        'Staff lastName is appropriately visible'
      );
    });

    await test('Customer A1 GET /tickets (list) omits resolutionNotes and sanitizes all items', async () => {
      const res = await fetch(`${baseUrl}/tickets`, {
        headers: { Authorization: `Bearer ${customerTokenA1}` },
      });
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      const item = json.data.items.find((t) => t.id === ticketA1Id);
      assert.ok(item, 'Ticket A1 found in list');

      assert.strictEqual(item.description, 'Screen flashes black every 30 seconds when unplugged.');
      assert.strictEqual(item.resolutionNotes, undefined, 'resolutionNotes must be omitted in list for CUSTOMER');
      assert.strictEqual(item.diagnosticNotes, undefined);
      assert.strictEqual(item.billableHours, undefined);
      assert.strictEqual(item.totalAmount, undefined);
      assert.strictEqual(item.assignedTechnician.user.email, undefined);
    });

    await test('Non-Customer (Tech A1, Admin A, Staff A) receives structured resolutionNotes and staff details', async () => {
      // Tech A1 read
      const resTech = await fetch(`${baseUrl}/tickets/${ticketA1Id}`, {
        headers: { Authorization: `Bearer ${techTokenA1}` },
      });
      assert.strictEqual(resTech.status, 200);
      const jsonTech = await resTech.json();
      assert.strictEqual(
        jsonTech.data.resolutionNotes,
        'Replaced inverter board capacitor C12; voltage rails stabilized at 3.3V.',
        'Tech sees structured resolutionNotes'
      );
      assert.strictEqual(jsonTech.data.description, 'Screen flashes black every 30 seconds when unplugged.');
      assert.ok(jsonTech.data.assignedTechnician.user.email, 'Tech sees technician email');

      // Admin A read
      const resAdmin = await fetch(`${baseUrl}/tickets/${ticketA1Id}`, {
        headers: { Authorization: `Bearer ${adminTokenA}` },
      });
      assert.strictEqual(resAdmin.status, 200);
      const jsonAdmin = await resAdmin.json();
      assert.strictEqual(
        jsonAdmin.data.resolutionNotes,
        'Replaced inverter board capacitor C12; voltage rails stabilized at 3.3V.',
        'Admin sees structured resolutionNotes'
      );
      assert.strictEqual(jsonAdmin.data.description, 'Screen flashes black every 30 seconds when unplugged.');
      assert.ok(jsonAdmin.data.assignedTechnician.user.email, 'Admin sees technician email');

      // Staff A read
      const resStaff = await fetch(`${baseUrl}/tickets/${ticketA1Id}`, {
        headers: { Authorization: `Bearer ${staffTokenA}` },
      });
      assert.strictEqual(resStaff.status, 200);
      const jsonStaff = await resStaff.json();
      assert.strictEqual(
        jsonStaff.data.resolutionNotes,
        'Replaced inverter board capacitor C12; voltage rails stabilized at 3.3V.',
        'Staff sees structured resolutionNotes'
      );
      assert.strictEqual(jsonStaff.data.description, 'Screen flashes black every 30 seconds when unplugged.');
      assert.ok(jsonStaff.data.assignedTechnician.user.email, 'Staff sees technician email');
    });

    await test('Customer description containing marker strings is preserved exactly without truncation', async () => {
      const complexDescription =
        'Customer troubleshooting: [Resolution Notes]: swapped HDMI cable. [Diagnostic Notes]: led is amber.';

      // Customer creates ticket with marker text
      const createRes = await fetch(`${baseUrl}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerTokenA1}`,
        },
        body: JSON.stringify({
          title: 'Special marker collision test ticket',
          description: complexDescription,
          priority: 'LOW',
        }),
      });
      assert.strictEqual(createRes.status, 201);
      const createJson = await createRes.json();
      const testTicketId = createJson.data.id;
      assert.strictEqual(createJson.data.description, complexDescription, 'Created description preserved exactly');
      assert.strictEqual(createJson.data.resolutionNotes, undefined, 'No resolutionNotes on creation');

      // Admin assigns to Tech A1
      const assignRes = await fetch(`${baseUrl}/tickets/${testTicketId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminTokenA}`,
        },
        body: JSON.stringify({ technicianId: techRecordA1.id }),
      });
      assert.strictEqual(assignRes.status, 201);

      // Tech A1 starts work
      const startRes = await fetch(`${baseUrl}/tickets/${testTicketId}/start-work`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${techTokenA1}`,
        },
        body: JSON.stringify({}),
      });
      assert.strictEqual(startRes.status, 201);

      // Tech A1 resolves ticket with notes
      const resolveRes = await fetch(`${baseUrl}/tickets/${testTicketId}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${techTokenA1}`,
        },
        body: JSON.stringify({
          diagnosticNotes: 'Technician verified power rail and replaced fuse F1.',
        }),
      });
      assert.strictEqual(resolveRes.status, 201);

      // Customer reads resolved ticket
      const custReadRes = await fetch(`${baseUrl}/tickets/${testTicketId}`, {
        headers: { Authorization: `Bearer ${customerTokenA1}` },
      });
      assert.strictEqual(custReadRes.status, 200);
      const custTicket = (await custReadRes.json()).data;
      assert.strictEqual(
        custTicket.description,
        complexDescription,
        'Customer description must NOT be truncated or modified by marker strings'
      );
      assert.strictEqual(custTicket.resolutionNotes, undefined, 'Customer must not see resolutionNotes');

      // Tech reads resolved ticket
      const techReadRes = await fetch(`${baseUrl}/tickets/${testTicketId}`, {
        headers: { Authorization: `Bearer ${techTokenA1}` },
      });
      assert.strictEqual(techReadRes.status, 200);
      const techTicket = (await techReadRes.json()).data;
      assert.strictEqual(
        techTicket.description,
        complexDescription,
        'Tech sees unchanged original customer description'
      );
      assert.strictEqual(
        techTicket.resolutionNotes,
        'Technician verified power rail and replaced fuse F1.',
        'Tech sees structured resolutionNotes'
      );
    });

    await test('Customer A1 closes resolved Ticket A1 and receives sanitized response', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketA1Id}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerTokenA1}`,
        },
        body: JSON.stringify({}),
      });
      assert.strictEqual(res.status, 201);
      const json = await res.json();
      assert.strictEqual(json.data.status, 'CLOSED');
      assert.strictEqual(
        json.data.description,
        'Screen flashes black every 30 seconds when unplugged.',
        'Description preserved exactly on close'
      );
      assert.strictEqual(json.data.resolutionNotes, undefined, 'resolutionNotes omitted on close for CUSTOMER');
      assert.strictEqual(json.data.assignedTechnician.user.email, undefined);
    });

    console.log('\n--- 6. STAFF Lifecycle Boundary Enforcement Tests ---');

    await test('Staff A creates Ticket A_Staff in Tenant A (status: OPEN)', async () => {
      const res = await fetch(`${baseUrl}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${staffTokenA}`,
        },
        body: JSON.stringify({
          title: 'Staff intake: Corporate printer jam',
          description: 'Paper tray 2 rollers skipping continuously.',
          priority: 'MEDIUM',
          contactId: customerContactA1.id,
          serviceId: serviceA1.id,
        }),
      });
      assert.strictEqual(res.status, 201);
      const json = await res.json();
      ticketAStaffId = json.data.id;
      assert.ok(ticketAStaffId, 'Staff ticket created');
      assert.strictEqual(json.data.status, 'OPEN');
    });

    await test('Staff A receives 403 Forbidden on POST /tickets/:id/assign (lacks tickets:assign)', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketAStaffId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${staffTokenA}`,
        },
        body: JSON.stringify({
          technicianId: techRecordA1.id,
        }),
      });
      assert.strictEqual(res.status, 403);
      const json = await res.json();
      assert.match(json.message, /insufficient_permissions|forbidden resource|missing permission/i);
    });

    await test('Staff A receives 400 Bad Request when attempting to mutate status via PATCH', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketAStaffId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${staffTokenA}`,
        },
        body: JSON.stringify({
          status: 'IN_PROGRESS',
        }),
      });
      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert.ok(json.message, 'Status mutation rejected on PATCH');
    });

    await test('Staff A receives 400 Bad Request when attempting to inject financial values via PATCH', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketAStaffId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${staffTokenA}`,
        },
        body: JSON.stringify({
          totalAmount: 15000,
        }),
      });
      assert.strictEqual(res.status, 400);
    });

    await test('Staff A receives 400 Bad Request on premature resolve of OPEN ticket', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketAStaffId}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${staffTokenA}`,
        },
        body: JSON.stringify({ diagnosticNotes: 'Premature staff resolve' }),
      });
      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert.match(json.message, /ticket must be in_progress before it can be resolved/i);
    });

    await test('Staff A receives 400 Bad Request on premature close of OPEN ticket', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketAStaffId}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${staffTokenA}`,
        },
        body: JSON.stringify({}),
      });
      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert.match(json.message, /ticket must be in resolved status before it can be closed/i);
    });

    await test('Admin A assigns Ticket A_Staff to Tech A1 (OPEN -> SCHEDULED)', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketAStaffId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminTokenA}`,
        },
        body: JSON.stringify({
          technicianId: techRecordA1.id,
        }),
      });
      assert.strictEqual(res.status, 201);
      const json = await res.json();
      assert.strictEqual(json.data.status, 'SCHEDULED');
    });

    await test('Staff A receives 400 Bad Request on premature close of SCHEDULED ticket', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketAStaffId}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${staffTokenA}`,
        },
        body: JSON.stringify({}),
      });
      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert.match(json.message, /ticket must be in resolved status before it can be closed/i);
    });

    await test('Tech A1 starts work on Ticket A_Staff (SCHEDULED -> IN_PROGRESS)', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketAStaffId}/start-work`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${techTokenA1}`,
        },
        body: JSON.stringify({}),
      });
      assert.strictEqual(res.status, 201);
      const json = await res.json();
      assert.strictEqual(json.data.status, 'IN_PROGRESS');
    });

    await test('Staff A receives 400 Bad Request on premature close of IN_PROGRESS ticket', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketAStaffId}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${staffTokenA}`,
        },
        body: JSON.stringify({}),
      });
      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert.match(json.message, /ticket must be in resolved status before it can be closed/i);
    });

    await test('Tech A1 resolves Ticket A_Staff (IN_PROGRESS -> RESOLVED)', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketAStaffId}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${techTokenA1}`,
        },
        body: JSON.stringify({
          diagnosticNotes: 'Cleaned intake rollers and cleared paper dust sensor.',
        }),
      });
      assert.strictEqual(res.status, 201);
      const json = await res.json();
      assert.strictEqual(json.data.status, 'RESOLVED');
    });

    await test('Staff A legitimately closes RESOLVED Ticket A_Staff (RESOLVED -> CLOSED)', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketAStaffId}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${staffTokenA}`,
        },
        body: JSON.stringify({}),
      });
      assert.strictEqual(res.status, 201);
      const json = await res.json();
      assert.strictEqual(json.data.status, 'CLOSED');
    });

    await test('Terminal lock: Staff A receives 400 Bad Request on PATCH to CLOSED ticket', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketAStaffId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${staffTokenA}`,
        },
        body: JSON.stringify({ title: 'Mutate closed title' }),
      });
      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert.match(json.message, /cannot update a closed ticket/i);
    });

    await test('Terminal lock: Staff A receives 400 Bad Request on duplicate close of CLOSED ticket', async () => {
      const res = await fetch(`${baseUrl}/tickets/${ticketAStaffId}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${staffTokenA}`,
        },
        body: JSON.stringify({}),
      });
      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert.match(json.message, /ticket is already closed and locked/i);
    });

    console.log('\n--- 7. Audit Trail Integrity Verification ---');

    await test('Verify audit events emitted for all lifecycle actions with correct roles & actors', async () => {
      const events = await prisma.auditEvent.findMany({
        where: { organizationId: tenantA.id },
        orderBy: { createdAt: 'asc' },
      });

      const actions = events.map((e) => e.action);
      assert.ok(actions.includes('ticket:created'), 'ticket:created logged');
      assert.ok(actions.includes('ticket:assigned'), 'ticket:assigned logged');
      assert.ok(actions.includes('ticket:work_started'), 'ticket:work_started logged');
      assert.ok(actions.includes('ticket:resolved'), 'ticket:resolved logged');
      assert.ok(actions.includes('ticket:closed'), 'ticket:closed logged');

      // Verify closed events: one by CUSTOMER, one by STAFF
      const closeEvents = events.filter((e) => e.action === 'ticket:closed');
      assert.strictEqual(closeEvents.length, 2, 'Two tickets closed');

      const customerClose = closeEvents.find((e) => e.resourceId === ticketA1Id);
      assert.ok(customerClose, 'Customer close event exists');
      assert.strictEqual(customerClose.metadata.closedByRole, 'CUSTOMER');
      assert.strictEqual(customerClose.actorId, customerUserA1.id);

      const staffClose = closeEvents.find((e) => e.resourceId === ticketAStaffId);
      assert.ok(staffClose, 'Staff close event exists');
      assert.strictEqual(staffClose.metadata.closedByRole, 'STAFF');
      assert.strictEqual(staffClose.actorId, staffUserA.id);
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
        staffUserA?.email,
        techUserA1?.email,
        techUserA2?.email,
        customerUserA1?.email,
        customerUserA2?.email,
        techUserB1?.email,
        customerUserB1?.email,
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
  console.log('\n======================================================================');
  const passed = testResults.filter((t) => t.passed).length;
  const failed = testResults.filter((t) => !t.passed).length;
  console.log(`M5 PHASE 2 SUITE: ${passed} PASSED, ${failed} FAILED (${testResults.length} total)`);
  console.log('======================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

run().catch((e) => {
  console.error('Fatal test runner error:', e);
  process.exit(1);
});
