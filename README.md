# economy-platform-starter-v2

Opinionated on-prem starter repo for a responsive multi-ledger finance app.

## Principles

- everything as code
- fail fast, never hide errors
- test-driven development
- automated validation from commit to staging
- manual approval before production
- on-prem first
- open source first
- latest stable lines by default
- secure by default

## Stack

- Node.js 24 LTS
- pnpm workspaces
- Next.js web app
- Fastify API
- PostgreSQL
- Prisma
- Keycloak (OIDC)
- Gitea Actions
- Argo CD
- Kubernetes / k3s
- OpenTofu
- SOPS + age
- Trivy
- Playwright + Vitest

## Quick start

1. Open the repo in VS Code.
2. Reopen in devcontainer.
3. Run:

```bash
pnpm install
pnpm compose:up
pnpm db:generate
pnpm db:migrate:dev
pnpm verify
```

## Important

This repo is generated as code scaffolding. You still need a first real install in the devcontainer to create the lockfile and validate exact package versions.

## Deploy flow

- push/PR -> lint, typecheck, unit, integration, e2e, image build, Trivy
- merge to main -> update staging manifests
- Argo CD syncs staging
- production deploy only from manual promotion workflow

## Secrets

Secrets are stored encrypted with SOPS. Never commit plaintext secrets.
