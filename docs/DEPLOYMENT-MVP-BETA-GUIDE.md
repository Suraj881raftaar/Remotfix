# REMOTFIX — MVP Beta Deployment Guide (₹0 Architecture)

**Document Reference:** `docs/DEPLOYMENT-MVP-BETA-GUIDE.md`  
**Classification:** TEST / STAGING (Customer Feedback & Demonstration)  
**Governance Approval:** ADR-0051 (Amended for Two-Stage Progression)  
**Cost Target:** ₹0 / $0 per month  
**Paid Production Trigger:** First Genuine Paying Client  

---

## 1. Overview & Architecture

This guide provides step-by-step instructions for deploying the REMOTFIX platform to the approved zero-cost architecture for customer demonstration, stakeholder feedback, and pilot testing.

```
+-------------------------------------------------------------------------------+
|                             CLIENT / BROWSER                                  |
+---------------------------------------+---------------------------------------+
                                        |
                   HTTPS (TLS)          |          HTTPS (TLS) + CORS
                        |               |                   |
                        v               |                   v
+---------------------------------------+   +-----------------------------------+
|             VERCEL HOBBY              |   |            RENDER FREE            |
|       Next.js 14 Frontend Web         |   |    NestJS API (Docker Service)    |
|   https://remotfix-beta.vercel.app    |   |  https://remotfix-api.onrender.com|
+---------------------------------------+   +-----------------+-----------------+
                                                              |
                               +------------------------------+
                               |
                               | TLS (Encrypted Connection)
                               v
            +------------------------------------+------------------------------------+
            |                                                                         |
            v                                                                         v
+---------------------------------------+                 +-----------------------------------+
|               NEON FREE               |                 |           UPSTASH FREE            |
|       PostgreSQL 16 Serverless        |                 |          Redis 7 Serverless       |
|    0.5 GB Storage / Auto-suspend      |                 |    10,000 Commands/Day / TLS      |
+---------------------------------------+                 +-----------------------------------+
```

### Approved Hosting Services
| Service | Role | Free Tier Specification | Cost |
| :--- | :--- | :--- | :--- |
| **Vercel Hobby** | Next.js Frontend | 100 GB Bandwidth, Global Edge CDN, Free SSL | ₹0 / $0 |
| **Render Free** | NestJS API | 512 MB RAM, 0.1 CPU, Spin down after 15m idle | ₹0 / $0 |
| **Neon Free** | PostgreSQL 16 | 0.5 GB Storage, Connection Pooler (PgBouncer), Permanent | ₹0 / $0 |
| **Upstash Free** | Redis 7 | 10,000 commands/day, 256 MB storage, TLS (`rediss://`) | ₹0 / $0 |

> [!WARNING]
> **Beta Cold Start Notice**: The Render Free API service spins down after 15 minutes of inactivity. When a request arrives after spinning down, the first request will take **~30–60 seconds** to respond (cold start). Subsequent requests respond instantly. This is normal and approved under ADR-0051 for the beta testing phase.

> [!IMPORTANT]
> **Vercel Hobby Commercial Policy Boundary**:  
> Vercel Hobby is utilized **exclusively for the approved non-commercial MVP Beta / customer feedback / stakeholder demonstration phase**. Per Vercel Fair Use Guidelines, no customer payments, commercial revenue, or paid service operations are permitted on the Hobby plan.  
> **Trigger**: The **FIRST GENUINE PAYING CLIENT** triggers the mandatory transition to paid MVP Production infrastructure, including upgrading to the appropriate paid Vercel tier (Pro).

---

## 2. Step 1: Set Up Neon PostgreSQL (Free Tier)

Neon provides permanent serverless PostgreSQL without the 30-day inactivity deletion enforced by other platforms.

1. **Sign Up / Log In**: Visit [neon.tech](https://neon.tech) and sign in.
2. **Create Project**:
   - **Project Name:** `remotfix-beta`
   - **Postgres Version:** `16`
   - **Region:** Select **US East (Ohio / us-east-2)** or region closest to your Render service to minimize query latency.
3. **Obtain Connection Strings**:
   Neon provides two connection strings in the dashboard:
   - **Pooled connection string (PgBouncer):**  
     `postgresql://neondb_owner:PASSWORD@ep-sample-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require`  
     *(Supply this to Render API runtime as `DATABASE_URL`)*
   - **Direct connection string (Unpooled):**  
     `postgresql://neondb_owner:PASSWORD@ep-sample.us-east-2.aws.neon.tech/neondb?sslmode=require`  
     *(Supply this temporarily as `DATABASE_URL` during Prisma schema migrations)*

   > [!NOTE]
   > **Prisma Connection Behavior**: In this repository, `database/prisma/prisma/schema.prisma` uses `url = env("DATABASE_URL")`. `DIRECT_URL` is a documentation/configuration convenience only unless the schema is explicitly modified to consume it. Because PgBouncer in transaction pooling mode rejects PostgreSQL advisory locks used by migration engines, running migrations against the pooled endpoint will fail.

4. **Execute Safe Database Migrations**:
   Run the non-destructive Prisma migration deploy command locally against the Neon **Direct** connection:
   ```bash
   DATABASE_URL="postgresql://neondb_owner:PASSWORD@ep-sample.us-east-2.aws.neon.tech/neondb?sslmode=require" pnpm --filter=@remotfix/database exec prisma migrate deploy
   ```
   This strictly applies pending migrations in `database/prisma/prisma/migrations/` in forward order without prompting, resetting, or altering application architecture. Never use destructive commands such as `prisma migrate reset` or `prisma db push --force-reset`.

---

## 3. Step 2: Set Up Upstash Redis (Free Tier)

Upstash provides serverless Redis with native TLS support.

1. **Sign Up / Log In**: Visit [upstash.com](https://upstash.com) and sign in.
2. **Create Database**:
   - **Name:** `remotfix-beta-redis`
   - **Region:** Select region closest to your Render service (e.g., `us-east-1` or `us-east-2`).
   - **TLS:** Ensure **TLS (SSL)** is enabled.
   - **Eviction:** Default (`volatile-lru` or `noeviction`).
3. **Copy Redis Connection URL**:
   In the database details page under **Connect**, select **ioredis** or **Node.js** and copy the `rediss://` connection URL:
   ```
   rediss://default:PASSWORD@endpoint.upstash.io:6379
   ```
   *(Note the double 's' in `rediss://` which enforces encrypted TLS communication).*

---

## 4. Step 3: Deploy NestJS API to Render (Free Tier)

Render builds and hosts the NestJS API container using the root multi-stage `apps/api/Dockerfile`.

### Option A: Using Render Blueprint (`render.yaml`) — Recommended
1. Log in to [render.com](https://render.com).
2. Click **New +** -> **Blueprint**.
3. Connect your `Remotfix` GitHub repository.
4. Render detects `render.yaml` automatically.
5. In the Blueprint creation form, supply the required sync variables:
   - `DATABASE_URL`: Your Neon pooled connection string.
   - `REDIS_URL`: Your Upstash TLS connection string.
   - `CORS_ORIGIN`: Your frontend URL (e.g. `https://remotfix-beta.vercel.app` or `*` temporarily).
6. Click **Apply**. Render will automatically generate high-entropy secrets for `JWT_SECRET`, `APP_SECRET`, `MFA_ENCRYPTION_KEY`, and `ADMIN_KEY`, and deploy the container.

### Option B: Manual Web Service Creation
1. Click **New +** -> **Web Service**.
2. Select your `Remotfix` repository.
3. Configure settings:
   - **Name:** `remotfix-api`
   - **Region:** `Oregon (US West)`
   - **Branch:** `main`
   - **Root Directory:** *(leave blank / repo root)*
   - **Runtime:** `Docker`
   - **Dockerfile Path:** `./apps/api/Dockerfile`
   - **Docker Context:** `.`
   - **Instance Type:** `Free`
4. In **Environment Variables**, add:
   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Production mode |
   | `PORT` | `4000` | Application port |
   | `DATABASE_URL` | `<neon-pooled-url>` | Neon Pooled connection |
   | `REDIS_URL` | `<upstash-tls-url>` | Upstash TLS Redis URL |
   | `CORS_ORIGIN` | `https://remotfix-beta.vercel.app` | Vercel Frontend domain |
   | `JWT_SECRET` | *(generate >= 32 hex chars)* | `openssl rand -hex 32` |
   | `APP_SECRET` | *(generate >= 32 hex chars)* | `openssl rand -hex 32` |
   | `MFA_ENCRYPTION_KEY` | *(generate >= 32 hex chars)* | `openssl rand -hex 32` |
   | `ADMIN_KEY` | *(generate >= 32 hex chars)* | `openssl rand -hex 32` |
5. In **Advanced Settings**, set:
   - **Health Check Path:** `/api/v1/health`
6. Click **Create Web Service**.
7. Once deployed, note your service URL (e.g., `https://remotfix-api.onrender.com`).

---

## 5. Step 4: Deploy Next.js Web to Vercel (Hobby Tier)

Vercel provides native Next.js hosting with edge caching and zero configuration.

1. Log in to [vercel.com](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your `Remotfix` GitHub repository.
4. Configure the **Canonical Vercel Project Setting**:
   - **Framework Preset:** `Next.js` (automatically detected from `apps/web/package.json`).
   - **Root Directory:** Click **Edit** and select `apps/web`.
   - **Include source files outside Root Directory:** Ensure this is **Enabled** (default in Vercel monorepo detection). This allows `apps/web` to access workspace packages `@remotfix/ui` and `@remotfix/types`.
   - **Build & Output Settings:** Leave all toggles **OFF** (use Vercel defaults). Vercel natively detects the Turborepo monorepo root and orchestrates `pnpm turbo run build --filter=@remotfix/web...`.
5. Configure Environment Variables:
   | Key | Value | Notes |
   | :--- | :--- | :--- |
   | `NEXT_PUBLIC_API_URL` | `https://remotfix-api.onrender.com` | **DO NOT** add trailing slash or `/api/v1`. The web code appends `/api/v1/...` automatically. |
6. Click **Deploy**.
7. Vercel will build and publish the frontend at `https://<project-name>.vercel.app`.
8. Copy the published Vercel URL, return to Render, and ensure `CORS_ORIGIN` matches this URL.

---

## 6. Step 5: Post-Deployment Verification

### 1. API Health Check
Test the live API health endpoint:
```bash
curl -i https://remotfix-api.onrender.com/api/v1/health
```
**Expected Response (HTTP 200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2026-09-09T...",
  "version": "0.1.0",
  "environment": "production",
  "uptimeSeconds": 15
}
```

### 2. Swagger API Documentation
Open `https://remotfix-api.onrender.com/api/docs` in your browser to verify the OpenAPI 3.x contract.

### 3. Frontend Web Verification
1. Open `https://<your-vercel-domain>.vercel.app` in your browser.
2. Confirm the dashboard and login screens render with zero errors.
3. Test authentication and tenant switching.

---

## 7. Migration Path to Paid MVP Production

When the first paying client commits, execute the migration checklist in accordance with ADR-0051:

1. **Frontend Web**:
   - Upgrade Vercel from **Hobby** to **Pro** ($20/month/member) to satisfy commercial Fair Use terms upon accepting customer payments or commercial transactions.
   - Configure custom production domain `remotfix.in`.
2. **API Hosting**:
   - Upgrade Render Web Service from **Free** to **Starter / Standard** ($7–$25/mo), eliminating cold starts and allocating dedicated CPU/RAM.
   - Or migrate container to Railway Pro / Managed VPS.
3. **Database Hosting**:
   - Upgrade Neon to Launch plan ($19/mo) or migrate to AWS RDS PostgreSQL / Supabase Pro.
   - Configure automated daily offsite backups.
4. **Redis**:
   - Upgrade Upstash to Pay-as-you-go / Pro plan ($10/mo) for higher throughput limits.
5. **Domain & DNS**:
   - Configure production custom domain `remotfix.in` on Vercel and Render/API.
   - Configure DKIM, SPF, and DMARC for email delivery (Resend).
