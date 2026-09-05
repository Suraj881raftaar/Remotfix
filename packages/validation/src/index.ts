/**
 * @remotfix/validation — Monorepo Foundation Validation (M1)
 *
 * Provides shared Zod validation schemas for query parameters,
 * headers, and environment configs. Business request schemas are
 * deferred to later domain milestones.
 */

import { z } from 'zod';

/**
 * Schema for standard pagination query parameters.
 */
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

/**
 * Schema for multi-tenant HTTP headers enforcing organization context (ADR-0023).
 */
export const tenantHeaderSchema = z.object({
  'x-organization-id': z.string().uuid('Invalid organization ID format').optional(),
});

export type TenantHeader = z.infer<typeof tenantHeaderSchema>;

/**
 * Schema for environment validation across services.
 */
export const baseEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'staging', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
});

export type BaseEnv = z.infer<typeof baseEnvSchema>;
