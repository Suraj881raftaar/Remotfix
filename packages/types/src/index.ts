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
 * 6 Initial RBAC Roles mandated by ADR-0020 and Master Spec Section 2.7.
 */
export enum SystemRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  TECHNICIAN = 'TECHNICIAN',
  STAFF = 'STAFF',
  CUSTOMER = 'CUSTOMER',
}



/**
 * 13 Explicit Permission Keys mandated by Master Spec Section 2.7.
 */
export const PERMISSION_KEYS = [
  'tickets:read',
  'tickets:create',
  'tickets:update',
  'tickets:assign',
  'users:read',
  'users:create',
  'users:update',
  'billing:read',
  'billing:create',
  'billing:approve',
  'audit:read',
  'security:manage',
  'organization:manage',
] as const;

export type PermissionKey = typeof PERMISSION_KEYS[number];

/**
 * Authenticated User session payload.
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  mfaEnabled: boolean;
}

/**
 * Active tenant context resolved by TenantGuard.
 */
export interface TenantContext {
  organizationId: string;
  membershipId: string;
  roleId: string;
  roleName: SystemRole | string;
  permissions: PermissionKey[];
}

/**
 * Base contract for tenant-scoped entities enforcing organization isolation (ADR-0023).
 */
export interface TenantedEntity {
  organizationId: string;
}

