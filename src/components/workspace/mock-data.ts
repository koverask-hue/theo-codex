import type {
  AgentRun,
  ArtifactRecord,
  RegisteredModel,
  ModelRoutingRule,
  SkillDefinition,
  TaskNode,
} from "@/core";
import { builtInSkills } from "@/core/skills/builtins";

/* ─── Workspaces ─────────────────────────────────────────────── */

export type Workspace = {
  id: string;
  name: string;
  description: string;
  activeRunId?: string;
};

export const mockWorkspaces: Workspace[] = [
  {
    id: "ws-1",
    name: "Core App Platform",
    description: "Auth service, API contracts, persistence layer",
    activeRunId: "run-1",
  },
  {
    id: "ws-2",
    name: "UI System",
    description: "Design tokens, component library, workspace shell",
  },
  {
    id: "ws-3",
    name: "Model Routing Lab",
    description: "Provider adapters and routing rule experiments",
  },
  {
    id: "ws-4",
    name: "Skill Registry",
    description: "Built-in and custom skill packs",
  },
];

/* ─── Active Run ─────────────────────────────────────────────── */

export const mockCurrentRun: AgentRun = {
  id: "run-1",
  workspaceId: "ws-1",
  rootGoal:
    "Implement OAuth2 authentication service with GitHub and Google provider support",
  status: "executing",
  createdAt: "2026-04-18T14:00:00Z",
  updatedAt: "2026-04-18T15:18:42Z",
  taskGraph: [
    {
      id: "t-1",
      title: "Design auth service API contract",
      assignedRole: "planner",
      status: "done",
      dependsOnTaskIds: [],
    },
    {
      id: "t-2",
      title: "Implement OAuth2 provider adapters",
      assignedRole: "coder",
      status: "in_progress",
      dependsOnTaskIds: ["t-1"],
    },
    {
      id: "t-3",
      title: "Build login and callback UI flows",
      assignedRole: "frontend_specialist",
      status: "in_progress",
      dependsOnTaskIds: ["t-1"],
    },
    {
      id: "t-4",
      title: "Write unit tests for auth service",
      assignedRole: "reviewer",
      status: "todo",
      dependsOnTaskIds: ["t-2"],
    },
    {
      id: "t-5",
      title: "Integration test with browser automation",
      assignedRole: "browser_tester",
      status: "todo",
      dependsOnTaskIds: ["t-3", "t-4"],
    },
    {
      id: "t-6",
      title: "Review implementation and generate walkthrough",
      assignedRole: "reviewer",
      status: "todo",
      dependsOnTaskIds: ["t-5"],
    },
  ] satisfies TaskNode[],
};

/* ─── Live Agents ────────────────────────────────────────────── */

export type LiveAgent = {
  id: string;
  role: string;
  displayName: string;
  model: string;
  status: "running" | "done" | "queued" | "blocked" | "failed";
  currentTask: string | null;
  progress: number;
  lastOutput: string | null;
  startedAt: string | null;
  taskId: string | null;
};

export const mockLiveAgents: LiveAgent[] = [
  {
    id: "agent-1",
    role: "planner",
    displayName: "Planner",
    model: "gpt-4o",
    status: "done",
    currentTask: "Design auth service API contract",
    progress: 100,
    lastOutput:
      "Produced implementation_plan artifact. API contract covers token issuance, refresh, revocation, and provider callback endpoints.",
    startedAt: "2026-04-18T14:01:00Z",
    taskId: "t-1",
  },
  {
    id: "agent-2",
    role: "coder",
    displayName: "Coder",
    model: "claude-3.5-sonnet",
    status: "running",
    currentTask: "Implement OAuth2 provider adapters",
    progress: 68,
    lastOutput:
      "GitHub provider adapter complete. Writing Google OAuth2 callback handler. Encountered token expiry edge case — added refresh logic.",
    startedAt: "2026-04-18T14:22:00Z",
    taskId: "t-2",
  },
  {
    id: "agent-3",
    role: "frontend_specialist",
    displayName: "Frontend",
    model: "claude-3.5-sonnet",
    status: "running",
    currentTask: "Build login and callback UI flows",
    progress: 41,
    lastOutput:
      "LoginPage component scaffolded. Social provider buttons done. Working on OAuthCallback route and loading state.",
    startedAt: "2026-04-18T14:23:00Z",
    taskId: "t-3",
  },
  {
    id: "agent-4",
    role: "reviewer",
    displayName: "Reviewer",
    model: "o1",
    status: "queued",
    currentTask: null,
    progress: 0,
    lastOutput: null,
    startedAt: null,
    taskId: "t-4",
  },
  {
    id: "agent-5",
    role: "browser_tester",
    displayName: "Browser Tester",
    model: "gpt-4o",
    status: "queued",
    currentTask: null,
    progress: 0,
    lastOutput: null,
    startedAt: null,
    taskId: "t-5",
  },
];

/* ─── Recent Runs ────────────────────────────────────────────── */

export type RunSummary = {
  id: string;
  goal: string;
  status: AgentRun["status"];
  workspaceId: string;
  updatedAt: string;
  taskCount: number;
  completedTaskCount: number;
};

export const mockRecentRuns: RunSummary[] = [
  {
    id: "run-1",
    goal: "Implement OAuth2 authentication service",
    status: "executing",
    workspaceId: "ws-1",
    updatedAt: "2026-04-18T15:18:42Z",
    taskCount: 6,
    completedTaskCount: 1,
  },
  {
    id: "run-2",
    goal: "Fix TypeScript strict mode errors across workspace",
    status: "completed",
    workspaceId: "ws-2",
    updatedAt: "2026-04-18T13:04:11Z",
    taskCount: 4,
    completedTaskCount: 4,
  },
  {
    id: "run-3",
    goal: "Design system token audit and dark mode refinement",
    status: "completed",
    workspaceId: "ws-2",
    updatedAt: "2026-04-18T10:52:30Z",
    taskCount: 3,
    completedTaskCount: 3,
  },
  {
    id: "run-4",
    goal: "Database schema migration: add workspaces table",
    status: "failed",
    workspaceId: "ws-1",
    updatedAt: "2026-04-17T19:38:00Z",
    taskCount: 2,
    completedTaskCount: 1,
  },
  {
    id: "run-5",
    goal: "Document model routing rule contracts",
    status: "completed",
    workspaceId: "ws-3",
    updatedAt: "2026-04-17T16:10:00Z",
    taskCount: 2,
    completedTaskCount: 2,
  },
];

/* ─── Artifacts ──────────────────────────────────────────────── */

export const mockArtifacts: ArtifactRecord[] = [
  {
    id: "art-1",
    runId: "run-1",
    taskId: "t-1",
    type: "implementation_plan",
    title: "OAuth2 Service — Implementation Plan",
    content:
      "## Auth Service Contract\n\n### Endpoints\n- `POST /auth/github` — Initiate GitHub OAuth2\n- `GET /auth/github/callback` — Handle provider callback\n- `POST /auth/refresh` — Refresh access token\n- `DELETE /auth/session` — Revoke session\n\n### Token Schema\n```ts\ninterface AuthToken {\n  userId: string;\n  provider: 'github' | 'google';\n  accessToken: string;\n  refreshToken: string;\n  expiresAt: Date;\n}\n```",
    createdAt: "2026-04-18T14:20:00Z",
    createdByAgentRole: "planner",
    isVerificationEvidence: false,
  },
  {
    id: "art-2",
    runId: "run-1",
    taskId: "t-2",
    type: "code_diff",
    title: "GitHub OAuth2 Provider Adapter",
    content:
      "+++ src/core/auth/providers/github.ts\n+export class GitHubOAuthProvider {\n+  async initiateFlow(redirectUri: string): Promise<string> {\n+    const params = new URLSearchParams({\n+      client_id: process.env.GITHUB_CLIENT_ID!,\n+      redirect_uri: redirectUri,\n+      scope: 'user:email read:user',\n+    });\n+    return `https://github.com/login/oauth/authorize?${params}`;\n+  }\n+\n+  async handleCallback(code: string): Promise<AuthToken> {\n+    // ... exchange code for access token\n+  }\n+}",
    createdAt: "2026-04-18T15:05:00Z",
    createdByAgentRole: "coder",
    isVerificationEvidence: false,
  },
  {
    id: "art-3",
    runId: "run-1",
    taskId: "t-2",
    type: "execution_log",
    title: "Coder Agent — Execution Log",
    content:
      "[14:22:01] Starting task: Implement OAuth2 provider adapters\n[14:22:03] Reading implementation_plan artifact...\n[14:22:05] Created src/core/auth/providers/\n[14:23:41] GitHub provider adapter: complete\n[14:23:42] Starting Google OAuth2 provider...\n[14:24:10] Edge case: token expiry during callback — adding refresh logic\n[14:25:33] Progress: 68%",
    createdAt: "2026-04-18T15:10:00Z",
    createdByAgentRole: "coder",
    isVerificationEvidence: false,
  },
  {
    id: "art-4",
    runId: "run-2",
    taskId: "t-2",
    type: "code_diff",
    title: "TypeScript Strict Mode Fix — workspace-shell.tsx",
    content: "",
    createdAt: "2026-04-18T13:01:00Z",
    createdByAgentRole: "coder",
    isVerificationEvidence: true,
  },
  {
    id: "art-5",
    runId: "run-2",
    taskId: "t-2",
    type: "test_result",
    title: "TypeScript Compile — All Clean",
    content: "tsc: 0 errors\neslint: 0 warnings",
    createdAt: "2026-04-18T13:03:00Z",
    createdByAgentRole: "reviewer",
    isVerificationEvidence: true,
  },
];

/* ─── Models ─────────────────────────────────────────────────── */

export const mockModels: RegisteredModel[] = [
  {
    alias: "gpt-4o",
    providerId: "openai",
    providerModelId: "gpt-4o",
    costTier: "balanced",
    speedTier: "fast",
    capabilities: {
      toolUse: true,
      vision: true,
      maxContextTokens: 128000,
      reasoningDepth: "medium",
    },
  },
  {
    alias: "claude-3.5-sonnet",
    providerId: "anthropic",
    providerModelId: "claude-3-5-sonnet-20241022",
    costTier: "balanced",
    speedTier: "fast",
    capabilities: {
      toolUse: true,
      vision: true,
      maxContextTokens: 200000,
      reasoningDepth: "high",
    },
  },
  {
    alias: "o1",
    providerId: "openai",
    providerModelId: "o1",
    costTier: "premium",
    speedTier: "slow",
    capabilities: {
      toolUse: false,
      vision: false,
      maxContextTokens: 128000,
      reasoningDepth: "high",
    },
  },
  {
    alias: "o3-mini",
    providerId: "openai",
    providerModelId: "o3-mini",
    costTier: "budget",
    speedTier: "fast",
    capabilities: {
      toolUse: true,
      vision: false,
      maxContextTokens: 128000,
      reasoningDepth: "medium",
    },
  },
  {
    alias: "gemini-2.5-pro",
    providerId: "google",
    providerModelId: "gemini-2.5-pro-preview",
    costTier: "balanced",
    speedTier: "standard",
    capabilities: {
      toolUse: true,
      vision: true,
      maxContextTokens: 1000000,
      reasoningDepth: "high",
    },
  },
  {
    alias: "claude-3-haiku",
    providerId: "anthropic",
    providerModelId: "claude-3-haiku-20240307",
    costTier: "budget",
    speedTier: "fast",
    capabilities: {
      toolUse: true,
      vision: true,
      maxContextTokens: 200000,
      reasoningDepth: "low",
    },
  },
];

export const mockRoutingRules: ModelRoutingRule[] = [
  {
    id: "rule-1",
    taskType: "planning",
    primaryModelAlias: "o1",
    fallbackModelAliases: ["gpt-4o", "claude-3.5-sonnet"],
  },
  {
    id: "rule-2",
    taskType: "coding",
    requiresToolUse: true,
    primaryModelAlias: "claude-3.5-sonnet",
    fallbackModelAliases: ["gpt-4o"],
  },
  {
    id: "rule-3",
    taskType: "frontend",
    requiresVision: true,
    requiresToolUse: true,
    primaryModelAlias: "claude-3.5-sonnet",
    fallbackModelAliases: ["gpt-4o"],
  },
  {
    id: "rule-4",
    taskType: "review",
    primaryModelAlias: "o1",
    fallbackModelAliases: ["gpt-4o"],
  },
  {
    id: "rule-5",
    taskType: "testing",
    requiresToolUse: true,
    primaryModelAlias: "gpt-4o",
    fallbackModelAliases: ["claude-3-haiku"],
  },
  {
    id: "rule-6",
    taskType: "docs",
    preferredCostTier: "budget",
    primaryModelAlias: "claude-3-haiku",
    fallbackModelAliases: ["o3-mini"],
  },
];

export const mockSkills: SkillDefinition[] = builtInSkills;
