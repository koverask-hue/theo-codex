export type ProductDefinition = {
  name: string;
  positioning: string;
  primaryUser: string;
  primaryOutcome: string;
  constraints: string[];
};

export type FeatureNode = {
  name: string;
  children?: FeatureNode[];
};

export type ArchitectureLayer = {
  layer: string;
  responsibilities: string[];
};

export type TechChoice = {
  category: string;
  choice: string;
  rationale: string;
};

export type ScopeItem = {
  name: string;
  included: string[];
  excluded: string[];
};

export const productDefinition: ProductDefinition = {
  name: "Theo Codex",
  positioning:
    "A desktop-first, artifact-trust AI software engineering workspace for orchestrating multiple coding agents.",
  primaryUser:
    "Individual developers and small engineering teams shipping production software with AI assistance.",
  primaryOutcome:
    "Turn high-level software goals into verified implementation artifacts through coordinated, model-routed agent workflows.",
  constraints: [
    "Never degrade into a plain chat surface.",
    "Every major operation must produce auditable artifacts.",
    "Provider and tool integrations must remain adapter-driven.",
  ],
};

export const featureTree: FeatureNode[] = [
  {
    name: "Workspace",
    children: [
      { name: "Project sidebar and workspace switcher" },
      { name: "Task conversation timeline" },
      { name: "Artifacts, graph, and logs panel" },
    ],
  },
  {
    name: "Orchestration",
    children: [
      { name: "Planner, coder, reviewer, browser/tester agents" },
      { name: "Parallel sub-agent execution with checkpoints" },
      { name: "Approval gates for risky actions" },
    ],
  },
  {
    name: "Skills",
    children: [
      { name: "Global and workspace skill registries" },
      { name: "Composable instructions + acceptance criteria" },
      { name: "Built-ins: frontend, backend, design, animation, testing, docs, DevOps" },
    ],
  },
  {
    name: "Models",
    children: [
      { name: "Provider adapter registry and BYOK" },
      { name: "Rule-based model routing with fallback" },
      { name: "Per-agent model assignment" },
    ],
  },
  {
    name: "Tool Runtime",
    children: [
      { name: "Repo file operations + git-aware diffs" },
      { name: "Terminal execution and test runs" },
      { name: "Browser automation + screenshot evidence" },
    ],
  },
  {
    name: "Trust + Memory",
    children: [
      { name: "Plans, walkthroughs, diffs, logs, screenshots" },
      { name: "Project conventions and architectural memory" },
      { name: "Run history and reusable workspace knowledge" },
    ],
  },
];

export const architectureLayers: ArchitectureLayer[] = [
  {
    layer: "Presentation Layer (Next.js App)",
    responsibilities: [
      "Workspace shell with sidebar, conversation panel, and artifacts panel",
      "Task graph and evidence timeline views",
      "Human approvals and run controls",
    ],
  },
  {
    layer: "Application Layer (API + Services)",
    responsibilities: [
      "Task/run lifecycle APIs",
      "Agent orchestration service and event handling",
      "Authorization and policy checks",
    ],
  },
  {
    layer: "Domain Layer (Core Modules)",
    responsibilities: [
      "Agents, skills, model routing, tools, memory, artifacts contracts",
      "Deterministic state transitions for tasks/runs",
      "Verification rules and evidence requirements",
    ],
  },
  {
    layer: "Infrastructure Layer",
    responsibilities: [
      "Provider adapters (LLM vendors)",
      "Tool adapters (filesystem, terminal, browser)",
      "Persistence and queueing backends",
    ],
  },
  {
    layer: "Data Layer",
    responsibilities: [
      "Runs, tasks, artifacts, skills, model configs, knowledge records",
      "Event streams and audit log storage",
      "Search/retrieval for workspace memory",
    ],
  },
];

export const recommendedStack: TechChoice[] = [
  {
    category: "App Framework",
    choice: "Next.js (App Router) + TypeScript",
    rationale:
      "Ships quickly with strong SSR/RSC capabilities while allowing a cohesive frontend + API product surface.",
  },
  {
    category: "UI System",
    choice: "Tailwind CSS + typed component primitives",
    rationale:
      "Fast iteration with consistent visual language and maintainable compositional UI patterns.",
  },
  {
    category: "Backend Runtime",
    choice: "Node.js service modules within Next.js route handlers (MVP), then split worker service",
    rationale:
      "Enables fast MVP delivery while preserving a clean boundary for future horizontal scaling.",
  },
  {
    category: "Persistence",
    choice: "PostgreSQL + Prisma",
    rationale:
      "Reliable relational model for runs/tasks/artifacts with strong typing and migration support.",
  },
  {
    category: "Queue / Concurrency",
    choice: "Redis-backed job queue (e.g., BullMQ)",
    rationale:
      "Supports parallel sub-agent execution, retries, and durable run orchestration.",
  },
  {
    category: "Browser Automation",
    choice: "Playwright",
    rationale:
      "Production-grade browser control and screenshot/video evidence capture for verification workflows.",
  },
];

export const mvpScope: ScopeItem = {
  name: "MVP (Ambitious but shippable)",
  included: [
    "Workspace shell UI with task input, run timeline, and artifact panel",
    "Planner -> coder -> reviewer orchestration with optional parallel specialist agents",
    "Skill registry with built-in skill packs",
    "Provider/model registry abstraction with static routing rules and fallback",
    "Core tool adapters for files, terminal, git diff, browser screenshot, and tests",
    "Evidence bundle generation (plan, diff summary, logs, screenshots, test output, walkthrough)",
  ],
  excluded: [
    "Marketplace for shared community skills",
    "Real-time multi-user collaboration",
    "Deployment target integrations beyond webhook placeholder",
  ],
};

export const proposedModuleStructure = [
  "src/app (workspace routes and API handlers)",
  "src/components/workspace (UI shell, graph, artifact surfaces)",
  "src/core/agents (agent contracts + role definitions)",
  "src/core/orchestration (run/task lifecycle + event model)",
  "src/core/skills (skill schema + built-in registry)",
  "src/core/models (provider/model registry + routing contracts)",
  "src/core/tools (tool adapter + permission contracts)",
  "src/core/memory (knowledge and convention contracts)",
  "src/core/artifacts (artifact evidence model)",
  "src/core/ui (screen metadata and interaction contracts)",
  "docs (architecture and delivery roadmap)",
];
