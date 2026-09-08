import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionKey } from '@remotfix/types';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { PERMISSIONS_KEY } from '../decorators/require-permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const requiredPermissions = this.reflector.getAllAndOverride<PermissionKey[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()]
    );

    // If no specific permissions are required for this endpoint, allow (guard was satisfied by TenantGuard)
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const tenantContext = request.tenant;

    if (!tenantContext || !tenantContext.permissions) {
      throw new ForbiddenException('DENIED: Missing tenant authorization context');
    }

    const userPermissions: Set<string> = new Set(tenantContext.permissions);

    // Fail closed (deny by default): Every required permission must be explicitly present
    const hasAllPermissions = requiredPermissions.every((perm) => userPermissions.has(perm));

    if (!hasAllPermissions) {
      throw new ForbiddenException(
        `INSUFFICIENT_PERMISSIONS: Required permissions: [${requiredPermissions.join(', ')}]`
      );
    }

    return true;
  }
}
