import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { SystemRole, TenantContext } from '@remotfix/types';
import { randomBytes } from 'crypto';
import { PrismaService } from '../common/prisma/prisma.service';
import { RedisService } from '../common/redis/redis.service';
import { AuditService } from '../common/services/audit.service';

export interface InviteUserDto {
  email: string;
  roleName: SystemRole;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly auditService: AuditService
  ) {}

  /**
   * Controlled onboarding: Invites a team member to the active tenant.
   * Enforces users:create permission boundary.
   * Locked Decision 2: Only OWNER can invite or assign OWNER.
   */
  async inviteUser(dto: InviteUserDto, tenantContext: TenantContext, actorId: string) {
    // Locked Decision 2: Only OWNER can invite or assign OWNER. ADMIN cannot create, invite, or promote OWNER.
    if (dto.roleName === SystemRole.OWNER && tenantContext.roleName !== SystemRole.OWNER) {
      throw new ForbiddenException('Only an OWNER can invite or assign the OWNER role.');
    }

    const email = dto.email.trim().toLowerCase();

    // 1. Look up role in organization or system role
    const role = await this.prisma.role.findFirst({
      where: {
        name: dto.roleName,
        OR: [{ organizationId: tenantContext.organizationId }, { isSystem: true }],
      },
    });

    if (!role) {
      throw new NotFoundException(`Role ${dto.roleName} not found`);
    }

    // 2. Generate secure invitation token
    const inviteToken = randomBytes(32).toString('hex');
    const inviteData = {
      email,
      organizationId: tenantContext.organizationId,
      roleId: role.id,
    };

    // Store in Redis with 7-day TTL
    await this.redis.set(`auth:invite:${inviteToken}`, JSON.stringify(inviteData), 7 * 24 * 60 * 60);

    // 3. Upsert User in INVITED status
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    const user =
      existingUser ||
      (await this.prisma.user.create({
        data: {
          email,
          passwordHash: 'UNINITIALIZED_INVITED_ACCOUNT',
          status: 'INVITED',
          firstName: 'Invited',
          lastName: 'User',
        },
      }));

    // 4. Check existing membership to prevent privilege downgrade/tampering or duplicate active membership
    const existingMembership = await this.prisma.membership.findUnique({
      where: {
        organizationId_userId: {
          organizationId: tenantContext.organizationId,
          userId: user.id,
        },
      },
      include: { role: true },
    });

    if (existingMembership?.role.name === SystemRole.OWNER && tenantContext.roleName !== SystemRole.OWNER) {
      throw new ForbiddenException('Only an OWNER can modify an OWNER membership.');
    }

    if (existingMembership?.status === 'ACTIVE') {
      throw new BadRequestException('User is already an active member of this organization.');
    }

    // 5. Create or update membership in INVITED status
    await this.prisma.membership.upsert({
      where: {
        organizationId_userId: {
          organizationId: tenantContext.organizationId,
          userId: user.id,
        },
      },
      update: {
        roleId: role.id,
        status: 'INVITED',
      },
      create: {
        organizationId: tenantContext.organizationId,
        userId: user.id,
        roleId: role.id,
        status: 'INVITED',
      },
    });

    // 5. Audit log
    await this.auditService.log({
      action: 'user:invited',
      actorId,
      organizationId: tenantContext.organizationId,
      resourceType: 'User',
      resourceId: user.id,
      result: 'SUCCESS',
      metadata: { email, role: dto.roleName },
    });

    return {
      success: true,
      inviteToken,
      message: `Invitation generated successfully for ${email}`,
    };
  }

  /**
   * Organization-scoped user list. Requires users:read.
   */
  async listTenantUsers(tenantContext: TenantContext) {
    const memberships = await this.prisma.membership.findMany({
      where: { organizationId: tenantContext.organizationId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            status: true,
            mfaEnabled: true,
            lastLoginAt: true,
            createdAt: true,
          },
        },
        role: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    return memberships.map((m) => ({
      membershipId: m.id,
      status: m.status,
      user: m.user,
      role: m.role,
    }));
  }
}
