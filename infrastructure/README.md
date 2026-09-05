# REMOTFIX Infrastructure Foundation

Local containerized backing services for development (PostgreSQL 16 and Redis 7) adhering to ADR-0004, ADR-0005, and ADR-0006.

## Running Backing Services Locally

Start local PostgreSQL and Redis:
```bash
docker compose -f infrastructure/docker-compose.yml up -d
```

Check health:
```bash
docker compose -f infrastructure/docker-compose.yml ps
```

Stop services:
```bash
docker compose -f infrastructure/docker-compose.yml down
```
