export const skillScopes = ["global", "workspace"] as const;

export type SkillScope = (typeof skillScopes)[number];

export type SkillDefinition = {
  id: string;
  name: string;
  scope: SkillScope;
  description: string;
  instructions: string[];
  toolRules: string[];
  acceptanceCriteria: string[];
  preferredModelAliases: string[];
  outputFormat: string;
};
