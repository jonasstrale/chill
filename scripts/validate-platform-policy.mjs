import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = "/workspace";

function read(relativePath) {
  return readFileSync(resolve(root, relativePath), "utf8");
}

function check(condition, message, failures) {
  if (!condition) {
    failures.push(message);
  }
}

const failures = [];

const packageJson = JSON.parse(read("package.json"));
const ciWorkflow = read(".gitea/workflows/ci.yaml");
const stagingWorkflow = read(".gitea/workflows/deploy-staging.yaml");
const prodWorkflow = read(".gitea/workflows/promote-prod.yaml");
const agentsDoc = read("AGENTS.md");
const charterDoc = read("docs/engineering-charter.md");

check(
  typeof packageJson.packageManager === "string" && packageJson.packageManager.startsWith("pnpm@"),
  "Root package manager must pin pnpm.",
  failures,
);

check(
  packageJson.engines?.node === ">=24.0.0",
  "Root package.json must require the current stable Node 24 line.",
  failures,
);

check(
  packageJson.scripts?.verify?.includes("pnpm policy:check"),
  "verify must include the automated platform policy check.",
  failures,
);

check(
  ciWorkflow.includes("pnpm policy:check"),
  "CI workflow must run the platform policy check.",
  failures,
);

check(
  ciWorkflow.includes("pnpm sops:check"),
  "CI workflow must run the plaintext secret guard.",
  failures,
);

check(
  ciWorkflow.includes("aquasec/trivy"),
  "CI workflow must include a Trivy scan.",
  failures,
);

check(
  stagingWorkflow.includes("registry.local/economy/web:${{ gitea.sha }}") &&
    stagingWorkflow.includes("registry.local/economy/api:${{ gitea.sha }}"),
  "Staging promotion must update on-prem registry.local images.",
  failures,
);

check(
  prodWorkflow.includes("workflow_dispatch:"),
  "Production promotion must remain manually triggered.",
  failures,
);

check(
  prodWorkflow.includes("approval_phrase:"),
  "Production promotion must require an approval phrase input.",
  failures,
);

check(
  prodWorkflow.includes('if [ "${{ inputs.approval_phrase }}" != "go" ]; then'),
  'Production promotion must validate an explicit "go" approval phrase.',
  failures,
);

check(
  agentsDoc.includes("Production deployment requires an explicit human `go`."),
  "AGENTS.md must document the explicit production go gate.",
  failures,
);

check(
  charterDoc.includes("Human-controlled production"),
  "Engineering charter must document the manual production gate.",
  failures,
);

if (failures.length > 0) {
  console.error("Platform policy validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Platform policy validation passed.");
