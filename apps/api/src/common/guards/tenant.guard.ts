import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionKey, SystemRole, TenantContext } from '@remotfix/types';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User authentication required before tenant evaluation');
    }

    // Resolve tenant from header 'x-organization-id' or token claim
    const headerOrgId = request.headers['x-organization-id'] as string | undefined;
    const tokenOrgId = request.tokenPayload?.orgId as string | undefined;
    const organizationId = headerOrgId || tokenOrgId;

    if (!organizationId) {
      throw new ForbiddenException('MISSING_TENANT_CONTEXT: Organization context is required');
    }

    // Verify active membership and active organization (ADR-0023 multi-tenant isolation)
    const membership = await this.prisma.membership.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId: user.id,
        },
      },
      include: {
        organization: true,
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!membership || membership.status !== 'ACTIVE') {
      throw new ForbiddenException('NO_ACTIVE_MEMBERSHIP: Access denied to target organization');
    }

    if (membership.organization.status !== 'ACTIVE') {
      throw new ForbiddenException('TENANT_SUSPENDED: Target organization is inactive or suspended');
    }

    const permissions = membership.role.rolePermissions.map(
      (rp) => rp.permission.key as PermissionKey
    );

    const tenantContext: TenantContext = {
      organizationId,
      membershipId: membership.id,
      roleId: membership.roleId,
      roleName: membership.role.name as SystemRole,
      permissions,
    };

    request.tenant = tenantContext;

    return true;
  }
}
