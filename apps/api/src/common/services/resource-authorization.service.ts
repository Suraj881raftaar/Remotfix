import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { SystemRole, TenantContext } from '@remotfix/types';
import { PrismaService } from '../prisma/prisma.service';

export interface UpdateTicketInput {
  title?: string;
  description?: string;
  priority?: string;
  status?: string;
  diagnosticNotes?: string;
  billableHours?: number;
  totalAmount?: number;
}

@Injectable()
export class ResourceAuthorizationService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Enforces server-side resource scoping for reading or updating a Ticket.
   * D-M4-03 / Resource-scope rule:
   * - TECHNICIAN: read/update only tickets assigned to that technician.
   * - CUSTOMER: read only tickets belonging to customer's contact record; no metadata update.
   * - STAFF: update subject to field and state authorization.
   * - Cross-tenant queries are transactionally rejected.
   */
  async authorizeTicketAccess(
    ticketId: string,
    userId: string,
    tenantContext: TenantContext,
    action: 'read' | 'update',
    updateData?: UpdateTicketInput
  ) {
    // 1. Fetch ticket and verify organization boundary (ADR-0023 strict multi-tenant isolation)
    const ticket = await this.prisma.ticket.findFirst({
      where: {
        id: ticketId,
        organizationId: tenantContext.organizationId,
      },
      include: {
        contact: true,
        service: true,
        assignedTechnician: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!ticket) {
      // Never leak existence of tickets across tenants
      throw new NotFoundException('Ticket not found in this organization');
    }

    const roleName = tenantContext.roleName;

    // 2. Role-specific scoping
    if (roleName === SystemRole.TECHNICIAN) {
      // TECHNICIAN: May access ONLY tickets assigned to that technician
      if (!ticket.assignedTechnician || ticket.assignedTechnician.userId !== userId) {
        throw new ForbiddenException('Technicians may only access tickets assigned to them');
      }
    } else if (roleName === SystemRole.CUSTOMER) {
      // CUSTOMER: May access only tickets belonging to customer's contact record
      if (!ticket.contact || ticket.contact.userId !== userId) {
        throw new ForbiddenException('Customers may only access their own service tickets');
      }

      if (action === 'update') {
        throw new ForbiddenException('Customers cannot directly mutate ticket metadata');
      }
    } else if (roleName === SystemRole.STAFF) {
      // STAFF: Field-level and state validation
      if (action === 'update' && updateData) {
        // Staff cannot alter protected financial values
        if (updateData.totalAmount !== undefined || updateData.billableHours !== undefined) {
          throw new ForbiddenException('Staff members cannot modify financial or billing values');
        }

        // Staff cannot alter privileged diagnostic notes
        if (updateData.diagnosticNotes !== undefined) {
          throw new ForbiddenException('Staff members cannot alter technical diagnostic records');
        }

        // Staff cannot execute terminal state transitions (CLOSED, CANCELLED)
        if (updateData.status === 'CLOSED' || updateData.status === 'CANCELLED') {
          throw new ForbiddenException('Staff members cannot transition tickets to terminal states');
        }
      }
    } else if (
      roleName === SystemRole.OWNER ||
      roleName === SystemRole.ADMIN ||
      roleName === SystemRole.MANAGER
    ) {
      // Tenant-wide access within active organization
    } else {
      throw new ForbiddenException('Unauthorized role for ticket access');
    }

    return ticket;
  }

  /**
   * Enforces server-side resource scoping for billing operations (ADR-0021 / D-M4-03).
   * Validates tenant isolation and customer contact ownership.
   */
  async authorizeBillingAccess(
    contactId: string,
    userId: string,
    tenantContext: TenantContext
  ) {
    const contact = await this.prisma.contact.findFirst({
      where: {
        id: contactId,
        organizationId: tenantContext.organizationId,
      },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found in this organization');
    }

    const roleName = tenantContext.roleName;

    if (roleName === SystemRole.CUSTOMER) {
      if (contact.userId !== userId) {
        throw new ForbiddenException('Customers may only access their own billing records');
      }
    } else if (
      roleName === SystemRole.OWNER ||
      roleName === SystemRole.ADMIN ||
      roleName === SystemRole.MANAGER
    ) {
      // Tenant-scoped access allowed
    } else {
      throw new ForbiddenException('Role does not have permission to view billing records');
    }

    return contact;
  }
}
