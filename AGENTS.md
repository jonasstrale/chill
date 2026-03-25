# AGENTS.md

This repository treats delivery policy as code. Human contributors and autonomous agents are expected to follow the same operating rules.

## Standing Instructions

- Everything as code. Avoid manual configuration, click-ops, and one-off machine setup.
- Never hide errors to make the system appear healthy. Fail fast and surface the real issue.
- Prefer test-driven development and keep all validation automated.
- Automate the path from commit to deploy.
- Autonomous specialized agents may work from requirements through a test environment.
- Production deployment requires an explicit human `go`.
- Keep the stack on-prem.
- Prefer open source components, except agent usage billing when needed.
- Use the latest stable versions that fit the repo safely.
- Build and operate securely by default.

## Delivery Contract

1. A change starts from requirements captured in code, docs, tests, or tracked issues.
2. Agents and contributors implement changes with automated checks, not manual verification.
3. `main` is promoted automatically to staging after CI passes.
4. Production promotion is manual and must include an explicit `go` approval signal.
5. Secrets stay encrypted at rest in the repo. Plaintext secrets are treated as a build failure.

## Default Expectations For Agents

- Read the existing code and automation before changing behavior.
- Prefer adding or updating tests alongside implementation changes.
- Do not mute failing checks, swallow exceptions, or bypass security controls.
- Preserve the on-prem deployment model and `registry.local` image flow unless explicitly asked to redesign it.
- If a requested shortcut conflicts with this contract, stop and surface the tradeoff instead of silently weakening the system.
