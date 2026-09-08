import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SystemRole, TenantContext } from '@remotfix/types';
import {
  AssignTicketInput,
  ResolveTicketInput,
  UpdateTicketInput,
} from '@remotfix/validation';
import { PrismaService } from '../common/prisma/prisma.service';
import { AuditService } from '../common/services/audit.service';
import { ResourceAuthorizationService } from '../common/services/resource-authorization.service';

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
   * Updates ticket metadata subject to role, state, and field-level scoping.
   * Generic PATCH strictly disallows modifying lifecycle status or mutating CLOSED tickets.
   */
  async updateTicket(
    ticketId: string,
    userId: string,
    tenant: TenantContext,
    dto: UpdateTicketInput
  ) {
    // 1. Authorize access and field mutations (rejects closed tickets and status injection)
    await this.resourceAuth.authorizeTicketAccess(ticketId, userId, tenant, 'update', dto);

    // 2. Perform metadata update only (no status mutation)
    const updated = await this.prisma.ticket.update({
      where: { id: ticketId },
      data: {
        title: dto.title,
        description: dto.description,
        priority: dto.priority ? (dto.priority as any) : undefined,
      },
      include: {
        contact: true,
        service: true,
        assignedTechnician: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true },
            },
          },
        },
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
   * Assigns a ticket to a technician. Transitions OPEN -> SCHEDULED.
   * Reassignment of an already-SCHEDULED ticket keeps status SCHEDULED and emits ticket:reassigned.
   */
  async assignTicket(
    ticketId: string,
    userId: string,
    tenant: TenantContext,
    dto: AssignTicketInput
  ) {
    const ticket = await this.prisma.ticket.findFirst({
      where: {
        id: ticketId,
        organizationId: tenant.organizationId,
      },
      include: {
        contact: true,
        service: true,
        assignedTechnician: true,
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found in this organization');
    }

    if (ticket.status === 'CLOSED') {
      throw new BadRequestException('Cannot assign a closed ticket. Closed tickets are locked and read-only.');
    }

    if (ticket.status !== 'OPEN' && ticket.status !== 'SCHEDULED') {
      throw new BadRequestException(
        `Cannot assign ticket in ${ticket.status} status. Only OPEN or SCHEDULED tickets can be assigned.`
      );
    }

    // Validate technician belongs to active tenant
    const technician = await this.prisma.technician.findFirst({
      where: {
        id: dto.technicianId,
        organizationId: tenant.organizationId,
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    if (!technician) {
      throw new NotFoundException('Technician not found in this organization');
    }

    const isReassignment = ticket.status === 'SCHEDULED';
    const previousTechnicianId = ticket.assignedTechnicianId;

    const updated = await this.prisma.ticket.update({
      where: { id: ticketId },
      data: {
        assignedTechnicianId: dto.technicianId,
        status: 'SCHEDULED',
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : ticket.scheduledAt,
      },
      include: {
        contact: true,
        service: true,
        assignedTechnician: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true, email: true } },
          },
        },
      },
    });

    await this.auditService.log({
      action: isReassignment ? 'ticket:reassigned' : 'ticket:assigned',
      actorId: userId,
      organizationId: tenant.organizationId,
      resourceType: 'Ticket',
      resourceId: ticketId,
      result: 'SUCCESS',
      metadata: {
        isReassignment,
        previousTechnicianId,
        newTechnicianId: dto.technicianId,
        status: 'SCHEDULED',
      },
    });

    return updated;
  }

  /**
   * Begins technical work on a ticket. Transitions SCHEDULED -> IN_PROGRESS.
   */
  async startWork(ticketId: string, userId: string, tenant: TenantContext) {
    const ticket = await this.prisma.ticket.findFirst({
      where: {
        id: ticketId,
        organizationId: tenant.organizationId,
      },
      include: {
        contact: true,
        service: true,
        assignedTechnician: true,
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found in this organization');
    }

    if (ticket.status === 'CLOSED') {
      throw new BadRequestException('Cannot start work on a closed ticket. Closed tickets are locked.');
    }

    if (ticket.status !== 'SCHEDULED') {
      if (ticket.status === 'OPEN') {
        throw new BadRequestException('Ticket must be scheduled with an assigned technician before starting work');
      }
      throw new BadRequestException(
        `Cannot start work on ticket in ${ticket.status} status. Ticket must be in SCHEDULED status.`
      );
    }

    // Scoping check for TECHNICIAN role
    if (tenant.roleName === SystemRole.TECHNICIAN) {
      if (!ticket.assignedTechnician || ticket.assignedTechnician.userId !== userId) {
        throw new ForbiddenException('Technicians may only start work on tickets assigned to them');
      }
    }

    const updated = await this.prisma.ticket.update({
      where: { id: ticketId },
      data: {
        status: 'IN_PROGRESS',
      },
      include: {
        contact: true,
        service: true,
        assignedTechnician: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true, email: true } },
          },
        },
      },
    });

    await this.auditService.log({
      action: 'ticket:work_started',
      actorId: userId,
      organizationId: tenant.organizationId,
      resourceType: 'Ticket',
      resourceId: ticketId,
      result: 'SUCCESS',
      metadata: { previousStatus: 'SCHEDULED', newStatus: 'IN_PROGRESS' },
    });

    return updated;
  }

  /**
   * Resolves a ticket with diagnostic notes. Transitions IN_PROGRESS -> RESOLVED.
   * Direct resolution from SCHEDULED or OPEN is strictly prohibited.
   */
  async resolveTicket(
    ticketId: string,
    userId: string,
    tenant: TenantContext,
    dto: ResolveTicketInput
  ) {
    const ticket = await this.prisma.ticket.findFirst({
      where: {
        id: ticketId,
        organizationId: tenant.organizationId,
      },
      include: {
        contact: true,
        service: true,
        assignedTechnician: true,
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found in this organization');
    }

    if (ticket.status === 'CLOSED') {
      throw new BadRequestException('Cannot resolve a closed ticket. Closed tickets are locked.');
    }

    if (ticket.status !== 'IN_PROGRESS') {
      throw new BadRequestException(
        `Ticket must be IN_PROGRESS before it can be resolved. Direct resolution from ${ticket.status} is not permitted.`
      );
    }

    // Scoping check for TECHNICIAN role
    if (tenant.roleName === SystemRole.TECHNICIAN) {
      if (!ticket.assignedTechnician || ticket.assignedTechnician.userId !== userId) {
        throw new ForbiddenException('Technicians may only resolve tickets assigned to them');
      }
    }

    const updatedDescription = dto.diagnosticNotes
      ? `${ticket.description || ''}\n\n[Resolution Notes]: ${dto.diagnosticNotes}`.trim()
      : ticket.description;

    const updated = await this.prisma.ticket.update({
      where: { id: ticketId },
      data: {
        status: 'RESOLVED',
        description: updatedDescription,
      },
      include: {
        contact: true,
        service: true,
        assignedTechnician: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true, email: true } },
          },
        },
      },
    });

    await this.auditService.log({
      action: 'ticket:resolved',
      actorId: userId,
      organizationId: tenant.organizationId,
      resourceType: 'Ticket',
      resourceId: ticketId,
      result: 'SUCCESS',
      metadata: {
        previousStatus: 'IN_PROGRESS',
        newStatus: 'RESOLVED',
        notesProvided: !!dto.diagnosticNotes,
      },
    });

    return updated;
  }

  /**
   * Closes a resolved ticket. Transitions RESOLVED -> CLOSED.
   * ADR-0063 / M5-01:
   * - CUSTOMER: only their own ticket, same tenant, status RESOLVED
   * - STAFF/MANAGER/ADMIN/OWNER: requires tickets:update
   * - No other role may close.
   * Customer close accepts an empty payload and changes ONLY status.
   */
  async closeTicket(ticketId: string, userId: string, tenant: TenantContext) {
    const ticket = await this.prisma.ticket.findFirst({
      where: {
        id: ticketId,
        organizationId: tenant.organizationId,
      },
      include: {
        contact: true,
        service: true,
        assignedTechnician: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true, email: true } },
          },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found in this organization');
    }

    if (ticket.status === 'CLOSED') {
      throw new BadRequestException('Ticket is already closed and locked');
    }

    if (ticket.status !== 'RESOLVED') {
      throw new BadRequestException(
        `Ticket must be in RESOLVED status before it can be closed. Current status is ${ticket.status}.`
      );
    }

    // Authorization rule (ADR-0063 / M5-01)
    if (tenant.roleName === SystemRole.CUSTOMER) {
      // CUSTOMER: only their own ticket, same tenant, status RESOLVED
      if (!ticket.contact || ticket.contact.userId !== userId) {
        throw new ForbiddenException('Customers may only close their own tickets');
      }
    } else if (
      tenant.roleName === SystemRole.STAFF ||
      tenant.roleName === SystemRole.MANAGER ||
      tenant.roleName === SystemRole.ADMIN ||
      tenant.roleName === SystemRole.OWNER
    ) {
      // STAFF/MANAGER/ADMIN/OWNER: requires tickets:update
      if (!tenant.permissions.includes('tickets:update')) {
        throw new ForbiddenException('Missing tickets:update permission required to close ticket');
      }
    } else {
      // TECHNICIAN or other roles cannot close
      throw new ForbiddenException(`Role ${tenant.roleName} is not authorized to close tickets`);
    }

    const updated = await this.prisma.ticket.update({
      where: { id: ticketId },
      data: {
        status: 'CLOSED',
      },
      include: {
        contact: true,
        service: true,
        assignedTechnician: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true, email: true } },
          },
        },
      },
    });

    await this.auditService.log({
      action: 'ticket:closed',
      actorId: userId,
      organizationId: tenant.organizationId,
      resourceType: 'Ticket',
      resourceId: ticketId,
      result: 'SUCCESS',
      metadata: {
        previousStatus: 'RESOLVED',
        newStatus: 'CLOSED',
        closedByRole: tenant.roleName,
      },
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
