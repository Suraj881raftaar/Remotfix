import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser, TenantContext } from '@remotfix/types';
import { createServiceSchema, CreateServiceInput } from '@remotfix/validation';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RequirePermission } from '../common/decorators/require-permission.decorator';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { MfaGuard } from '../common/guards/mfa.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { ServicesService } from './services.service';

@ApiTags('Services')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionGuard, MfaGuard)
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @RequirePermission('tickets:read')
  @ApiOperation({ summary: 'List active services in organization catalog' })
  async listServices(@CurrentTenant() tenant: TenantContext) {
    const data = await this.servicesService.listServices(tenant);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id')
  @RequirePermission('tickets:read')
  @ApiOperation({ summary: 'Get service catalog item details' })
  async getService(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentTenant() tenant: TenantContext
  ) {
    const data = await this.servicesService.getService(id, tenant);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Post()
  @RequirePermission('organization:manage')
  @ApiOperation({ summary: 'Create service catalog item (organization:manage)' })
  async createService(
    @Body(new ZodValidationPipe(createServiceSchema)) dto: CreateServiceInput,
    @CurrentTenant() tenant: TenantContext,
    @CurrentUser() user: AuthenticatedUser
  ) {
    const data = await this.servicesService.createService(dto, tenant, user.id);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }
}
