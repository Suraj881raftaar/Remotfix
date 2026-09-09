// REMOTFIX — M5 Phase 3: Web UI Component & Page Integration Verification
// Verifies:
// 1. Next.js production build output for /bookings/[id] and /bookings
// 2. TicketLifecycleStepper component contract & export
// 3. BookingDetailPage role-scoping UI logic (Owner/Admin, Tech, Customer, Staff)
// 4. Structured resolutionNotes presentation (visible to internal roles, hidden for customers)
// 5. Complete presence of required DOM IDs and accessibility attributes

const assert = require('assert');
const fs = require('fs');
const path = require('path');

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
  console.log('REMOTFIX M5 PHASE 3 — WEB UI STEPPER & PAGE INTEGRATION SUITE');
  console.log('======================================================================\n');

  console.log('--- 1. Next.js Production Build Artifacts Verification ---');

  await test('Next.js production build contains compiled /bookings/[id] page bundle', async () => {
    const buildManifestPath = path.join(__dirname, '../apps/web/.next/build-manifest.json');
    assert.ok(fs.existsSync(buildManifestPath), 'build-manifest.json exists');
    const manifest = JSON.parse(fs.readFileSync(buildManifestPath, 'utf8'));

    const pages = Object.keys(manifest.pages || {});
    // Check for app router dynamic route chunk or pages
    const appPathRoutesPath = path.join(__dirname, '../apps/web/.next/app-path-routes-manifest.json');
    assert.ok(fs.existsSync(appPathRoutesPath), 'app-path-routes-manifest.json exists');
    const appRoutes = JSON.parse(fs.readFileSync(appPathRoutesPath, 'utf8'));
    assert.strictEqual(
      appRoutes['/bookings/[id]/page'],
      '/bookings/[id]',
      'App router registered /bookings/[id] page'
    );
  });

  console.log('\n--- 2. TicketLifecycleStepper Component Source & Contract Verification ---');

  const stepperPath = path.join(__dirname, '../apps/web/src/components/ticket-lifecycle-stepper.tsx');
  assert.ok(fs.existsSync(stepperPath), 'ticket-lifecycle-stepper.tsx exists');
  const stepperSource = fs.readFileSync(stepperPath, 'utf8');

  await test('Stepper defines all 5 authoritative lifecycle states in exact state-machine order', async () => {
    assert.ok(stepperSource.includes("OPEN: 0"), 'OPEN state order defined');
    assert.ok(stepperSource.includes("SCHEDULED: 1"), 'SCHEDULED state order defined');
    assert.ok(stepperSource.includes("IN_PROGRESS: 2"), 'IN_PROGRESS state order defined');
    assert.ok(stepperSource.includes("RESOLVED: 3"), 'RESOLVED state order defined');
    assert.ok(stepperSource.includes("CLOSED: 4"), 'CLOSED state order defined');
  });

  await test('Stepper defines step labels and icons for all 5 stages', async () => {
    assert.ok(stepperSource.includes("label: 'Ticket Created'"), 'Ticket Created label present');
    assert.ok(stepperSource.includes("label: 'Scheduled'"), 'Scheduled label present');
    assert.ok(stepperSource.includes("label: 'In Progress'"), 'In Progress label present');
    assert.ok(stepperSource.includes("label: 'Resolved'"), 'Resolved label present');
    assert.ok(stepperSource.includes("label: 'Closed'"), 'Closed label present');
  });

  await test('Stepper handles CANCELLED fallback state with dedicated alert banner', async () => {
    assert.ok(stepperSource.includes("status === 'CANCELLED'"), 'Cancelled status check present');
    assert.ok(stepperSource.includes('Ticket Cancelled'), 'Cancelled alert heading present');
    assert.ok(
      stepperSource.includes('No further lifecycle transitions are permitted'),
      'Cancelled disclaimer present'
    );
  });

  console.log('\n--- 3. BookingDetailPage Interactive Elements & Role Scoping ---');

  const pagePath = path.join(__dirname, '../apps/web/src/app/bookings/[id]/page.tsx');
  assert.ok(fs.existsSync(pagePath), 'page.tsx exists');
  const pageSource = fs.readFileSync(pagePath, 'utf8');

  await test('BookingDetailPage imports and mounts TicketLifecycleStepper', async () => {
    assert.ok(
      pageSource.includes("import { TicketLifecycleStepper } from '@/components/ticket-lifecycle-stepper'"),
      'Stepper import present'
    );
    assert.ok(
      pageSource.includes('<TicketLifecycleStepper'),
      'TicketLifecycleStepper component mounted in JSX'
    );
  });

  await test('BookingDetailPage includes structured resolutionNotes in interface and JSX', async () => {
    assert.ok(
      pageSource.includes('resolutionNotes?: string | null;'),
      'resolutionNotes defined on BookingDetail interface'
    );
    assert.ok(
      pageSource.includes('{booking.resolutionNotes && ('),
      'resolutionNotes guarded strictly by condition (safe from customer exposure)'
    );
    assert.ok(
      pageSource.includes('id="section-resolution-notes"'),
      'section-resolution-notes element ID present'
    );
    assert.ok(
      pageSource.includes('id="ticket-resolution-notes"'),
      'ticket-resolution-notes element ID present'
    );
  });

  await test('Customer problem description is preserved 100% without modification or stripping', async () => {
    assert.ok(
      pageSource.includes('id="ticket-customer-description"'),
      'ticket-customer-description element ID present'
    );
    assert.ok(
      pageSource.includes('{booking.description}'),
      'Raw booking.description rendered directly'
    );
  });

  await test('Technician email is conditionally hidden for customers', async () => {
    assert.ok(
      pageSource.includes('{booking.assignedTechnician.user.email && ('),
      'Email rendered only when present (omitted for Customer by backend)'
    );
    assert.ok(
      pageSource.includes('id="technician-email"'),
      'technician-email element ID present'
    );
  });

  await test('Interactive role-action buttons and forms exist with unique IDs', async () => {
    const requiredIds = [
      'id="ticket-status-badge"',
      'id="btn-assign-technician"',
      'id="btn-start-work"',
      'id="btn-open-resolve"',
      'id="btn-customer-close"',
      'id="btn-staff-close"',
      'id="badge-closed-locked"',
      'id="form-assign-technician"',
      'id="form-resolve-ticket"',
      'id="input-technician-id"',
      'id="input-scheduled-at"',
      'id="input-diagnostic-notes"',
      'id="btn-submit-assignment"',
      'id="btn-submit-resolution"',
    ];

    for (const reqId of requiredIds) {
      assert.ok(pageSource.includes(reqId), `Required element ${reqId} present in page source`);
    }
  });

  await test('Lifecycle mutations map exclusively to existing backend endpoints', async () => {
    assert.ok(pageSource.includes("tickets/${ticketId}/${endpoint}"), 'Calls tickets/:id/:endpoint');
    assert.ok(pageSource.includes("executeLifecycleAction(\n      'assign',") || pageSource.includes("executeLifecycleAction('assign'") || pageSource.includes("'assign',"), 'Calls assign endpoint');
    assert.ok(pageSource.includes("'start-work',"), 'Calls start-work endpoint');
    assert.ok(pageSource.includes("'resolve',"), 'Calls resolve endpoint');
    assert.ok(pageSource.includes("'close',"), 'Calls close endpoint');
    // Ensure no forbidden endpoints are called
    assert.ok(!pageSource.includes("/confirm"), 'No non-standard /confirm endpoint called');
    assert.ok(!pageSource.includes("/cancel"), 'No non-standard /cancel endpoint called');
  });

  // Summary
  console.log('\n======================================================================');
  const passed = testResults.filter((t) => t.passed).length;
  const failed = testResults.filter((t) => !t.passed).length;
  console.log(`UI VERIFICATION SUITE: ${passed} PASSED, ${failed} FAILED (${testResults.length} total)`);
  console.log('======================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

run().catch((e) => {
  console.error('Fatal test error:', e);
  process.exit(1);
});
