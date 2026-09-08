/**
 * @remotfix/validation — Monorepo Foundation Validation (M1)
 *
 * Provides shared Zod validation schemas for query parameters,
 * headers, and environment configs. Business request schemas are
 * deferred to later domain milestones.
 */

import { z } from 'zod';
export { z, ZodSchema, ZodError } from 'zod';

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

// ==========================================
// M4 Request Validation Schemas
// ==========================================

export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address format').max(255),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128, 'Password must not exceed 128 characters'),
  organizationId: z.string().uuid('Invalid organization ID format').optional(),
  mfaCode: z.string().trim().length(6, 'MFA code must be exactly 6 digits').optional(),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const refreshTokenSchema = z.object({
  refreshToken: z.string().trim().min(32).max(128).optional(),
});
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;

export const mfaSetupSchema = z.object({
  token: z.string().trim().length(6, 'Verification code must be exactly 6 digits'),
});
export type MfaSetupInput = z.infer<typeof mfaSetupSchema>;

export const mfaVerifySchema = z.object({
  token: z.string().trim().length(6, 'Verification code must be exactly 6 digits'),
});
export type MfaVerifyInput = z.infer<typeof mfaVerifySchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Invalid email address format').max(255),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  token: z.string().trim().min(32).max(128),
  newPassword: z.string().min(8, 'Password must be at least 8 characters').max(128, 'Password must not exceed 128 characters'),
});
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const acceptInviteSchema = z.object({
  token: z.string().trim().min(32).max(128),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128, 'Password must not exceed 128 characters'),
  firstName: z.string().trim().min(1).max(100).optional(),
  lastName: z.string().trim().min(1).max(100).optional(),
});
export type AcceptInviteInput = z.infer<typeof acceptInviteSchema>;

export const inviteUserSchema = z.object({
  email: z.string().trim().email('Invalid email address format').max(255),
  roleName: z.enum(['OWNER', 'ADMIN', 'MANAGER', 'TECHNICIAN', 'STAFF', 'CUSTOMER']),
});
export type InviteUserInput = z.infer<typeof inviteUserSchema>;

export const createTicketSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(255, 'Title must not exceed 255 characters'),
  description: z.string().trim().max(5000).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional().default('MEDIUM'),
  contactId: z.string().uuid('Invalid contact ID format').optional(),
  serviceId: z.string().uuid('Invalid service ID format').optional(),
});
export type CreateTicketInput = z.infer<typeof createTicketSchema>;

export const updateTicketSchema = z.object({
  title: z.string().trim().min(1, 'Title cannot be empty').max(255).optional(),
  description: z.string().trim().max(5000).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
}).strict();
export type UpdateTicketInput = z.infer<typeof updateTicketSchema>;

export const assignTicketSchema = z.object({
  technicianId: z.string().uuid('Invalid technician ID format'),
  scheduledAt: z.string().datetime({ message: 'Invalid ISO datetime format' }).optional(),
}).strict();
export type AssignTicketInput = z.infer<typeof assignTicketSchema>;

export const resolveTicketSchema = z.object({
  diagnosticNotes: z.string().trim().max(5000).optional(),
}).strict().optional().default({});
export type ResolveTicketInput = z.infer<typeof resolveTicketSchema>;

export const emptyBodySchema = z.object({}).strict().optional().default({});
export type EmptyBodyInput = z.infer<typeof emptyBodySchema>;

export const provisionTenantSchema = z.object({
  organizationName: z.string().trim().min(2, 'Organization name must be at least 2 characters').max(100),
  organizationSlug: z.string().trim().min(2, 'Slug must be at least 2 characters').max(50).regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase alphanumeric characters and hyphens'),
  ownerEmail: z.string().trim().email('Invalid owner email address').max(255),
  ownerPassword: z.string().min(8, 'Owner password must be at least 8 characters').max(128),
  ownerFirstName: z.string().trim().min(1, 'First name is required').max(100),
  ownerLastName: z.string().trim().min(1, 'Last name is required').max(100),
});
export type ProvisionTenantInput = z.infer<typeof provisionTenantSchema>;

export const createServiceSchema = z.object({
  name: z.string().trim().min(2, 'Service name must be at least 2 characters').max(150, 'Service name must not exceed 150 characters'),
  description: z.string().trim().max(5000).optional(),
  priceAmount: z.coerce.number().min(0, 'Price must be non-negative').max(1000000, 'Price exceeds maximum allowed').default(0),
  currency: z.string().trim().length(3, 'Currency code must be 3 characters').default('INR'),
  durationMinutes: z.coerce.number().int().min(5, 'Duration must be at least 5 minutes').max(1440, 'Duration must not exceed 24 hours').default(60),
});
export type CreateServiceInput = z.infer<typeof createServiceSchema>;

export const listTicketsQuerySchema = z.object({
  status: z.enum(['OPEN', 'SCHEDULED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'CANCELLED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});
export type ListTicketsQueryInput = z.infer<typeof listTicketsQuerySchema>;
