# syntax=docker/dockerfile:1
# ------------------------------------------------------------------------------
# REMOTFIX API — Production Multi-Stage Dockerfile (ADR-0009 & ADR-0051)
# ------------------------------------------------------------------------------

FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@11.25.0 --activate
RUN apk add --no-cache libc6-compat openssl

# Stage 1: Pruner (Isolate @remotfix/api and @remotfix/database workspace dependencies)
FROM base AS pruner
WORKDIR /app
RUN npm install -g turbo@^2.4.4
COPY . .
RUN turbo prune @remotfix/api @remotfix/database --docker --out-dir=out

# Stage 2: Builder
FROM base AS builder
WORKDIR /app

# First install dependencies for pruned packages
COPY --from=pruner /app/out/pnpm-lock.yaml /app/out/pnpm-workspace.yaml /app/out/json/ ./

RUN pnpm config set fetch-retries 5 && \
    pnpm config set fetch-retry-mintimeout 20000 && \
    pnpm config set fetch-retry-maxtimeout 120000 && \
    pnpm install --frozen-lockfile

# Copy pruned source files
COPY --from=pruner /app/out/full/ ./

# Generate Prisma Client and compile API
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder?schema=public"
RUN pnpm --filter=@remotfix/database run generate
RUN pnpm turbo run build --filter=@remotfix/api...

# ------------------------------------------------------------------------------
# Stage 3: Production Runner
# ------------------------------------------------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
RUN apk add --no-cache openssl

# Security: non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

COPY --from=builder --chown=nestjs:nodejs /app ./

USER nestjs
WORKDIR /app/apps/api

EXPOSE 4000
ENV PORT=4000

CMD ["node", "dist/main.js"]
