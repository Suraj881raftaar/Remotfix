import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser, SystemRole, TenantContext } from '@remotfix/types';
import { inviteUserSchema } from '@remotfix/validation';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RequirePermission } from '../common/decorators/require-permission.decorator';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { MfaGuard } from '../common/guards/mfa.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { UsersService } from './users.service';

export class InviteUserRequestDto {
  email!: string;
  roleName!: SystemRole;
}

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionGuard, MfaGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('invite')
  @RequirePermission('users:create')
  @ApiOperation({ summary: 'Invite a new user to the organization (users:create)' })
  async invite(
    @Body(new ZodValidationPipe(inviteUserSchema)) dto: InviteUserRequestDto,
    @CurrentTenant() tenant: TenantContext,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.usersService.inviteUser(dto, tenant, user.id);
  }

  @Get()
  @RequirePermission('users:read')
  @ApiOperation({ summary: 'List organization users and staff roster (users:read)' })
  async list(@CurrentTenant() tenant: TenantContext) {
    const data = await this.usersService.listTenantUsers(tenant);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }
}
