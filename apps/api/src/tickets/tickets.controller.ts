import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser, TenantContext } from '@remotfix/types';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RequirePermission } from '../common/decorators/require-permission.decorator';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { MfaGuard } from '../common/guards/mfa.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import {
  createTicketSchema,
  listTicketsQuerySchema,
  ListTicketsQueryInput,
  updateTicketSchema,
} from '@remotfix/validation';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { UpdateTicketInput } from '../common/services/resource-authorization.service';
import { CreateTicketDto, TicketsService } from './tickets.service';

@ApiTags('Tickets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionGuard, MfaGuard)
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  @RequirePermission('tickets:read')
  @ApiOperation({ summary: 'List tickets within active tenant with server-side resource scoping' })
  async listTickets(
    @Query(new ZodValidationPipe(listTicketsQuerySchema)) query: ListTicketsQueryInput,
    @CurrentUser() user: AuthenticatedUser,
    @CurrentTenant() tenant: TenantContext
  ) {
    const data = await this.ticketsService.listTickets(user.id, tenant, query);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id')
  @RequirePermission('tickets:read')
  @ApiOperation({ summary: 'Get ticket details with server-side resource scoping' })
  async getTicket(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() user: AuthenticatedUser,
    @CurrentTenant() tenant: TenantContext
  ) {
    const data = await this.ticketsService.getTicket(id, user.id, tenant);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Patch(':id')
  @RequirePermission('tickets:update')
  @ApiOperation({ summary: 'Update ticket with field and state level authorization' })
  async updateTicket(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ZodValidationPipe(updateTicketSchema)) dto: UpdateTicketInput,
    @CurrentUser() user: AuthenticatedUser,
    @CurrentTenant() tenant: TenantContext
  ) {
    const data = await this.ticketsService.updateTicket(id, user.id, tenant, dto);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Post()
  @RequirePermission('tickets:create')
  @ApiOperation({ summary: 'Create a new ticket within active tenant' })
  async createTicket(
    @Body(new ZodValidationPipe(createTicketSchema)) dto: CreateTicketDto,
    @CurrentUser() user: AuthenticatedUser,
    @CurrentTenant() tenant: TenantContext
  ) {
    const data = await this.ticketsService.createTicket(user.id, tenant, dto);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }
}
