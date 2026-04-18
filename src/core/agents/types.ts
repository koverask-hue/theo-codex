import type { ArtifactType } from "@/core/artifacts/types";

export const agentRoles = [
  "planner",
  "coder",
  "reviewer",
  "browser_tester",
  "frontend_specialist",
  "backend_specialist",
  "design_specialist",
  "animation_specialist",
  "docs_specialist",
  "devops_specialist",
] as const;

export type AgentRole = (typeof agentRoles)[number];

export type AgentDefinition = {
  role: AgentRole;
  mission: string;
  preferredSkillIds: string[];
  preferredModelAliases: string[];
  requiresHumanApprovalFor: string[];
  requiredArtifacts: ArtifactType[];
};
