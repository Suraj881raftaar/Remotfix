// REMOTFIX — Authoritative RBAC Foundation Seed (M3)
// Strictly seeds 6 system roles and 13 explicit permission keys.
// In accordance with Decision 5: role_permissions remains strictly empty.

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url:
        process.env.DATABASE_URL ||
        'postgresql://remotfix_user:remotfix_pass@localhost:5432/remotfix_dev?schema=public',
    },
  },
});

const SYSTEM_ROLES = [
  { name: 'OWNER', description: 'Platform or tenant root account owner with complete authority.' },
  { name: 'ADMIN', description: 'Tenant administrator managing operational settings, users, and billing.' },
  { name: 'MANAGER', description: 'Operations manager supervising dispatch, scheduling, and SLA escalations.' },
  { name: 'TECHNICIAN', description: 'Service personnel executing diagnostic, remote, or field repair jobs.' },
  { name: 'STAFF', description: 'Support and intake staff creating tickets and managing customer contacts.' },
  { name: 'CUSTOMER', description: 'Customer portal user requesting service and reviewing booking status.' },
];

const EXPLICIT_PERMISSIONS = [
  { key: 'tickets:read', description: 'View service tickets and booking requests' },
  { key: 'tickets:create', description: 'Submit new service requests and bookings' },
  { key: 'tickets:update', description: 'Modify ticket details, priority, and status' },
  { key: 'tickets:assign', description: 'Assign technician or service team to a ticket' },
  { key: 'users:read', description: 'View tenant user accounts and roster' },
  { key: 'users:create', description: 'Invite and provision new user accounts' },
  { key: 'users:update', description: 'Modify user details and account status' },
  { key: 'billing:read', description: 'View commercial contracts, quotes, and invoices' },
  { key: 'billing:create', description: 'Generate invoices and commercial service quotes' },
  { key: 'billing:approve', description: 'Authorize discounts and approve commercial invoices' },
  { key: 'audit:read', description: 'Access immutable security and operational audit trail' },
  { key: 'security:manage', description: 'Configure MFA policies, session timeouts, and access controls' },
  { key: 'organization:manage', description: 'Modify tenant profile, business details, and operating locations' },
];

async function main() {
  console.log('Seeding authoritative RBAC foundation (M3)...');

  // Seed 6 system roles
  for (const role of SYSTEM_ROLES) {
    const existing = await prisma.role.findFirst({
      where: {
        name: role.name,
        organizationId: null,
      },
    });

    if (!existing) {
      await prisma.role.create({
        data: {
          name: role.name,
          description: role.description,
          isSystem: true,
          organizationId: null,
        },
      });
      console.log(`Created system role: ${role.name}`);
    } else {
      console.log(`System role already exists: ${role.name}`);
    }
  }

  // Seed 13 explicit permissions
  for (const perm of EXPLICIT_PERMISSIONS) {
    await prisma.permission.upsert({
      where: { key: perm.key },
      update: { description: perm.description },
      create: {
        key: perm.key,
        description: perm.description,
      },
    });
    console.log(`Upserted permission: ${perm.key}`);
  }

  // Decision 5: role_permissions MUST remain empty in M3
  const rolePermissionCount = await prisma.rolePermission.count();
  console.log(`role_permissions count: ${rolePermissionCount} (must remain 0)`);

  console.log('RBAC foundation seed completed.');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
