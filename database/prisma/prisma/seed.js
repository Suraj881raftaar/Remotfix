// REMOTFIX — Authoritative RBAC Foundation Seed (M4)
// Seeds the 6 system roles, 13 explicit permission keys, and approved Role-Permission matrix.

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

// Approved D-M4-03 RBAC Matrix
const APPROVED_ROLE_PERMISSIONS = {
  OWNER: [
    'tickets:read',
    'tickets:create',
    'tickets:update',
    'tickets:assign',
    'users:read',
    'users:create',
    'users:update',
    'billing:read',
    'billing:create',
    'billing:approve',
    'audit:read',
    'security:manage',
    'organization:manage',
  ],
  ADMIN: [
    'tickets:read',
    'tickets:create',
    'tickets:update',
    'tickets:assign',
    'users:read',
    'users:create',
    'users:update',
    'billing:read',
    'billing:create',
    'billing:approve',
    'audit:read',
    'security:manage',
    'organization:manage',
  ],
  MANAGER: [
    'tickets:read',
    'tickets:create',
    'tickets:update',
    'tickets:assign',
    'users:read',
    'billing:read',
  ],
  TECHNICIAN: [
    'tickets:read',
    'tickets:update',
  ],
  STAFF: [
    'tickets:read',
    'tickets:create',
    'tickets:update',
  ],
  CUSTOMER: [
    'tickets:read',
    'tickets:create',
    'billing:read',
  ],
};

async function main() {
  console.log('Seeding authoritative RBAC foundation (M4)...');

  // 1. Seed 6 system roles
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

  // 2. Seed 13 explicit permissions
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

  // 3. Seed Approved Role-Permission mappings (40 total)
  const roles = await prisma.role.findMany({ where: { isSystem: true, organizationId: null } });
  const permissions = await prisma.permission.findMany();
  const roleMap = new Map(roles.map((r) => [r.name, r.id]));
  const permMap = new Map(permissions.map((p) => [p.key, p.id]));

  let mappingsCount = 0;
  for (const [roleName, permKeys] of Object.entries(APPROVED_ROLE_PERMISSIONS)) {
    const roleId = roleMap.get(roleName);
    if (!roleId) throw new Error(`Role ${roleName} not found`);

    for (const permKey of permKeys) {
      const permissionId = permMap.get(permKey);
      if (!permissionId) throw new Error(`Permission ${permKey} not found`);

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId,
            permissionId,
          },
        },
        update: {},
        create: {
          roleId,
          permissionId,
        },
      });
      mappingsCount++;
    }
  }

  console.log(`Seeded ${mappingsCount} role_permission mappings.`);

  // Verify counts
  const roleCount = await prisma.role.count({ where: { isSystem: true, organizationId: null } });
  const permissionCount = await prisma.permission.count();
  const rolePermissionCount = await prisma.rolePermission.count();

  console.log(`Verification:`);
  console.log(`- System roles: ${roleCount} (expected: 6)`);
  console.log(`- Permissions: ${permissionCount} (expected: 13)`);
  console.log(`- Role Permissions: ${rolePermissionCount} (expected: 40)`);

  if (roleCount !== 6 || permissionCount !== 13 || rolePermissionCount !== 40) {
    throw new Error(
      `Counts mismatch! Roles: ${roleCount}, Permissions: ${permissionCount}, RolePermissions: ${rolePermissionCount}`
    );
  }

  console.log('RBAC foundation seed successfully verified.');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
