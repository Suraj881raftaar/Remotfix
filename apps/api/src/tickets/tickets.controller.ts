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
  assignTicketSchema,
  AssignTicketInput,
  createTicketSchema,
  emptyBodySchema,
  EmptyBodyInput,
  listTicketsQuerySchema,
  ListTicketsQueryInput,
  resolveTicketSchema,
  ResolveTicketInput,
  updateTicketSchema,
  UpdateTicketInput,
} from '@remotfix/validation';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
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

  @Post(':id/assign')
  @RequirePermission('tickets:assign')
  @ApiOperation({ summary: 'Assign ticket to technician within active tenant' })
  async assignTicket(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ZodValidationPipe(assignTicketSchema)) dto: AssignTicketInput,
    @CurrentUser() user: AuthenticatedUser,
    @CurrentTenant() tenant: TenantContext
  ) {
    const data = await this.ticketsService.assignTicket(id, user.id, tenant, dto);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Post(':id/start-work')
  @RequirePermission('tickets:update')
  @ApiOperation({ summary: 'Transition ticket from SCHEDULED to IN_PROGRESS' })
  async startWork(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ZodValidationPipe(emptyBodySchema)) _dto: EmptyBodyInput,
    @CurrentUser() user: AuthenticatedUser,
    @CurrentTenant() tenant: TenantContext
  ) {
    const data = await this.ticketsService.startWork(id, user.id, tenant);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Post(':id/resolve')
  @RequirePermission('tickets:update')
  @ApiOperation({ summary: 'Transition ticket from IN_PROGRESS to RESOLVED with diagnostic notes' })
  async resolveTicket(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ZodValidationPipe(resolveTicketSchema)) dto: ResolveTicketInput,
    @CurrentUser() user: AuthenticatedUser,
    @CurrentTenant() tenant: TenantContext
  ) {
    const data = await this.ticketsService.resolveTicket(id, user.id, tenant, dto);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Post(':id/close')
  @ApiOperation({ summary: 'Close resolved ticket (Customer own-ticket or staff tickets:update)' })
  async closeTicket(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ZodValidationPipe(emptyBodySchema)) _dto: EmptyBodyInput,
    @CurrentUser() user: AuthenticatedUser,
    @CurrentTenant() tenant: TenantContext
  ) {
    const data = await this.ticketsService.closeTicket(id, user.id, tenant);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }
}
