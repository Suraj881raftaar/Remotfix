import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { TenantContext } from '@remotfix/types';
import { CreateServiceInput } from '@remotfix/validation';
import { PrismaService } from '../common/prisma/prisma.service';
import { AuditService } from '../common/services/audit.service';

@Injectable()
export class ServicesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService
  ) {}

  /**
   * Lists active service catalog items for the active tenant.
   */
  async listServices(tenant: TenantContext) {
    return this.prisma.service.findMany({
      where: {
        organizationId: tenant.organizationId,
        isActive: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Retrieves single service by ID strictly scoped to active tenant.
   */
  async getService(serviceId: string, tenant: TenantContext) {
    const service = await this.prisma.service.findFirst({
      where: {
        id: serviceId,
        organizationId: tenant.organizationId,
      },
    });

    if (!service) {
      throw new NotFoundException('Service not found in this organization');
    }

    return service;
  }

  /**
   * Adds a new service to the organization service catalog.
   * Requires organization:manage (held by OWNER, ADMIN).
   */
  async createService(dto: CreateServiceInput, tenant: TenantContext, actorId: string) {
    const existing = await this.prisma.service.findFirst({
      where: {
        organizationId: tenant.organizationId,
        name: { equals: dto.name, mode: 'insensitive' },
      },
    });

    if (existing) {
      throw new ConflictException(`Service '${dto.name}' already exists in this organization`);
    }

    const service = await this.prisma.service.create({
      data: {
        organizationId: tenant.organizationId,
        name: dto.name,
        description: dto.description || '',
        priceAmount: dto.priceAmount,
        currency: dto.currency || 'INR',
        durationMinutes: dto.durationMinutes || 60,
        isActive: true,
      },
    });

    await this.auditService.log({
      action: 'service:created',
      actorId,
      organizationId: tenant.organizationId,
      resourceType: 'Service',
      resourceId: service.id,
      result: 'SUCCESS',
      metadata: { serviceName: service.name, priceAmount: Number(service.priceAmount) },
    });

    return service;
  }
}
