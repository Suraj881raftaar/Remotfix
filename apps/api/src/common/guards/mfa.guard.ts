import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SystemRole } from '@remotfix/types';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class MfaGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const tenant = request.tenant;

    if (!user || !tenant) {
      return true; // Let upstream guards handle missing user/tenant
    }

    // Master Spec & ADR-0018: Privileged accounts (OWNER, ADMIN) MUST enforce MFA
    const isPrivilegedRole =
      tenant.roleName === SystemRole.OWNER || tenant.roleName === SystemRole.ADMIN;

    if (isPrivilegedRole && !user.mfaEnabled) {
      throw new ForbiddenException(
        'MFA_ENROLLMENT_REQUIRED: Privileged accounts (OWNER, ADMIN) must configure and enable MFA'
      );
    }

    return true;
  }
}
