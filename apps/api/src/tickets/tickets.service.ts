import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { SystemRole, TenantContext } from '@remotfix/types';
import { PrismaService } from '../common/prisma/prisma.service';
import { AuditService } from '../common/services/audit.service';
import {
  ResourceAuthorizationService,
  UpdateTicketInput,
} from '../common/services/resource-authorization.service';

export interface CreateTicketDto {
  contactId?: string;
  serviceId?: string;
  title: string;
  description?: string;
  priority?: string;
}

@Injectable()
export class TicketsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly resourceAuth: ResourceAuthorizationService,
    private readonly auditService: AuditService
  ) {}

  /**
   * Lists tickets within the active tenant, enforcing role-based resource scoping.
   * - OWNER, ADMIN, MANAGER, STAFF: All tickets in the tenant.
   * - TECHNICIAN: Only tickets assigned to that technician.
   * - CUSTOMER: Only tickets created for that customer's contact record.
   */
  async listTickets(
    userId: string,
    tenant: TenantContext,
    query?: { status?: string; priority?: string; page?: number; pageSize?: number }
  ) {
    const page = query?.page && query.page > 0 ? query.page : 1;
    const pageSize =
      query?.pageSize && query.pageSize > 0 && query.pageSize <= 100 ? query.pageSize : 20;
    const skip = (page - 1) * pageSize;

    const where: any = {
      organizationId: tenant.organizationId,
    };

    if (query?.status) {
      where.status = query.status;
    }

    if (query?.priority) {
      where.priority = query.priority;
    }

    if (tenant.roleName === SystemRole.TECHNICIAN) {
      where.assignedTechnician = { userId };
    } else if (tenant.roleName === SystemRole.CUSTOMER) {
      where.contact = { userId };
    }

    const [items, total] = await Promise.all([
      this.prisma.ticket.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          contact: true,
          service: true,
          assignedTechnician: {
            include: { user: true },
          },
        },
      }),
      this.prisma.ticket.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Retrieves ticket details subject to server-side resource-level scoping.
   */
  async getTicket(ticketId: string, userId: string, tenant: TenantContext) {
    return this.resourceAuth.authorizeTicketAccess(ticketId, userId, tenant, 'read');
  }

  /**
   * Updates ticket details subject to role, state, and field-level scoping.
   */
  async updateTicket(
    ticketId: string,
    userId: string,
    tenant: TenantContext,
    dto: UpdateTicketInput
  ) {
    // 1. Authorize access and field mutations
    await this.resourceAuth.authorizeTicketAccess(ticketId, userId, tenant, 'update', dto);

    // 2. Perform update
    const updated = await this.prisma.ticket.update({
      where: { id: ticketId },
      data: {
        title: dto.title,
        description: dto.description,
        priority: dto.priority ? (dto.priority as any) : undefined,
        status: dto.status ? (dto.status as any) : undefined,
      },
    });

    // 3. Log audit event
    await this.auditService.log({
      action: 'ticket:updated',
      actorId: userId,
      organizationId: tenant.organizationId,
      resourceType: 'Ticket',
      resourceId: ticketId,
      result: 'SUCCESS',
      metadata: { fieldsUpdated: Object.keys(dto) },
    });

    return updated;
  }

  /**
   * Submits a new ticket within the active tenant. Requires tickets:create.
   * Fix SEC-02: Validates contactId and serviceId within tenant boundary.
   */
  async createTicket(userId: string, tenant: TenantContext, dto: CreateTicketDto) {
    let resolvedContactId: string | null = null;

    // 1. Validate contactId within tenant boundary (Fix SEC-02)
    if (dto.contactId) {
      const contact = await this.prisma.contact.findFirst({
        where: {
          id: dto.contactId,
          organizationId: tenant.organizationId,
        },
      });

      if (!contact) {
        throw new NotFoundException('Contact not found in this organization');
      }

      // If caller is CUSTOMER, they may only create tickets for their own contact record
      if (tenant.roleName === SystemRole.CUSTOMER && contact.userId !== userId) {
        throw new ForbiddenException('Customers may only create tickets for their own contact record');
      }

      resolvedContactId = contact.id;
    } else if (tenant.roleName === SystemRole.CUSTOMER) {
      // Auto-resolve or create customer's contact record in this organization
      let customerContact = await this.prisma.contact.findFirst({
        where: {
          userId,
          organizationId: tenant.organizationId,
        },
      });

      if (!customerContact) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (user) {
          customerContact = await this.prisma.contact.create({
            data: {
              organizationId: tenant.organizationId,
              userId: user.id,
              name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
              email: user.email,
            },
          });
        }
      }

      if (customerContact) {
        resolvedContactId = customerContact.id;
      }
    }

    // 2. Validate serviceId within tenant boundary (Fix SEC-02)
    let resolvedServiceId: string | null = null;
    if (dto.serviceId) {
      const service = await this.prisma.service.findFirst({
        where: {
          id: dto.serviceId,
          organizationId: tenant.organizationId,
        },
      });

      if (!service) {
        throw new NotFoundException('Service not found in this organization');
      }

      resolvedServiceId = service.id;
    }

    const ticket = await this.prisma.ticket.create({
      data: {
        organizationId: tenant.organizationId,
        contactId: resolvedContactId,
        serviceId: resolvedServiceId,
        title: dto.title,
        description: dto.description || '',
        priority: (dto.priority as any) || 'MEDIUM',
        status: 'OPEN',
      },
      include: {
        contact: true,
        service: true,
      },
    });

    await this.auditService.log({
      action: 'ticket:created',
      actorId: userId,
      organizationId: tenant.organizationId,
      resourceType: 'Ticket',
      resourceId: ticket.id,
      result: 'SUCCESS',
    });

    return ticket;
  }
}
