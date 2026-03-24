# ADR 0001: Monorepo and GitOps

## Status
Accepted

## Decision
Use a pnpm monorepo and GitOps deployment flow. Staging auto-syncs. Production requires explicit manual promotion.

## Consequences
- reproducible changes
- auditable promotions
- clear separation of dev/staging/prod
