# Engineering Charter

This charter converts the project's operating principles into repository rules that can be reviewed, tested, and enforced.

## Non-Negotiables

- Everything as code: infrastructure, environments, policy, and delivery steps must be declarative and versioned.
- Honest failures: errors must be visible. We do not suppress failures to keep pipelines green.
- Automated validation: linting, typechecking, unit, integration, end-to-end, and policy checks run without manual intervention.
- Autonomous to staging: automation and specialized agents may carry work from requirements to a validated test environment.
- Human-controlled production: production deployment happens only after an explicit human `go`.
- On-prem by default: infrastructure and delivery targets remain self-hosted.
- Open source first: choose open source components whenever practical.
- Latest stable versions: prefer current stable releases over legacy branches.
- Secure by default: secrets, dependencies, images, and runtime configuration are treated as security-sensitive.

## Repository Enforcement

- [`/workspace/AGENTS.md`](/workspace/AGENTS.md) defines the contributor and agent contract.
- [`/workspace/.gitea/workflows/ci.yaml`](/workspace/.gitea/workflows/ci.yaml) runs automated validation and security checks.
- [`/workspace/.gitea/workflows/deploy-staging.yaml`](/workspace/.gitea/workflows/deploy-staging.yaml) promotes validated `main` builds to staging automatically.
- [`/workspace/.gitea/workflows/promote-prod.yaml`](/workspace/.gitea/workflows/promote-prod.yaml) requires a manual dispatch plus an explicit `go` approval phrase for production.
- [`/workspace/scripts/check-no-plaintext-secrets.sh`](/workspace/scripts/check-no-plaintext-secrets.sh) blocks plaintext secrets.
- [`/workspace/scripts/validate-platform-policy.mjs`](/workspace/scripts/validate-platform-policy.mjs) checks that key workflow and repo policy guardrails stay intact.

## Delivery Model

1. Contributors or agents change code, infra, or tests in the repo.
2. CI validates the change and runs security and policy checks.
3. Merge to `main` updates staging manifests automatically.
4. Argo CD syncs staging from Git.
5. A human reviews staging results and sends the explicit production `go`.
6. The production promotion workflow updates prod manifests for Argo CD to reconcile.
