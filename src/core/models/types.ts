export type ModelCapability = {
  toolUse: boolean;
  vision: boolean;
  maxContextTokens: number;
  reasoningDepth: "low" | "medium" | "high";
};

export type RegisteredModel = {
  alias: string;
  providerId: string;
  providerModelId: string;
  costTier: "budget" | "balanced" | "premium";
  speedTier: "fast" | "standard" | "slow";
  capabilities: ModelCapability;
};

export type ModelRoutingRule = {
  id: string;
  taskType: string;
  requiresVision?: boolean;
  requiresToolUse?: boolean;
  preferredCostTier?: RegisteredModel["costTier"];
  minimumContextTokens?: number;
  primaryModelAlias: string;
  fallbackModelAliases: string[];
};

export interface ModelProviderAdapter {
  providerId: string;
  validateConfiguration(config: Record<string, string>): Promise<void>;
}
