import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TenantContext } from '@remotfix/types';

export const CurrentTenant = createParamDecorator(
  (data: keyof TenantContext | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const tenant = request.tenant;
    return data ? tenant?.[data] : tenant;
  }
);
