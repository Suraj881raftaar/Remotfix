/**
 * @remotfix/types — Monorepo Foundation Types (M1)
 *
 * Provides shared API contract types, response envelopes, role enums,
 * and base multi-tenant contracts. Does NOT declare business models
 * (deferred to later domain/schema milestones).
 */

/**
 * Standard API error detail payload.
 */
export interface ApiErrorDetail {
  code: string;
  message: string;
  details?: unknown;
}

/**
 * Authoritative API response envelope for all /api/v1 endpoints.
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiErrorDetail;
  timestamp: string;
  requestId?: string;
}

/**
 * Standard paginated response envelope.
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Infrastructure health and readiness status contract.
 */
export interface HealthStatus {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  version: string;
  environment: string;
  uptimeSeconds?: number;
}

/**
 * 6 Initial RBAC Roles mandated by ADR-0020.
 */
export enum UserRole {
  TENANT_OWNER = 'TENANT_OWNER',
  TENANT_ADMIN = 'TENANT_ADMIN',
  TECHNICIAN = 'TECHNICIAN',
  CUSTOMER = 'CUSTOMER',
  SECURITY_ADMIN = 'SECURITY_ADMIN',
  SUPPORT_AGENT = 'SUPPORT_AGENT',
}

/**
 * Base contract for tenant-scoped entities enforcing organization isolation (ADR-0023).
 */
export interface TenantedEntity {
  organizationId: string;
}
