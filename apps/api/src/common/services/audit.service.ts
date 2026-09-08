import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface LogAuditParams {
  action: string;
  actorId?: string | null;
  organizationId?: string | null;
  resourceType: string;
  resourceId?: string | null;
  requestId?: string | null;
  result: 'SUCCESS' | 'FAILURE' | 'DENIED' | 'ERROR';
  metadata?: Record<string, unknown> | null;
}

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Appends an immutable audit event to the audit_events table.
   * Treats audit events as strictly append-only.
   */
  async log(params: LogAuditParams): Promise<void> {
    try {
      await this.prisma.auditEvent.create({
        data: {
          action: params.action,
          actorId: params.actorId || null,
          organizationId: params.organizationId || null,
          resourceType: params.resourceType,
          resourceId: params.resourceId || null,
          requestId: params.requestId || null,
          result: params.result,
          metadata: params.metadata ? (params.metadata as any) : undefined,
        },
      });
    } catch (err) {
      // Never crash the primary application flow if audit logging fails, but log error to console
      console.error('[AuditService] Failed to record audit event:', err);
    }
  }
}
