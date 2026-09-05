/**
 * @remotfix/ui — Monorepo Foundation UI Primitives (M1)
 *
 * Minimal UI foundation adhering to shadcn/ui alignment and Master Specification.
 * Does NOT construct full product UI in M1.
 */

export { cn } from './lib/utils';

/**
 * Design token definitions aligned with REMOTFIX aesthetic tokens.
 */
export const themeTokens = {
  colors: {
    primary: '#1E293B',
    accent: '#0284C7',
    success: '#16A34A',
    warning: '#D97706',
    danger: '#DC2626',
    background: '#FFFFFF',
    foreground: '#0F172A',
  },
  radius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
  },
} as const;
