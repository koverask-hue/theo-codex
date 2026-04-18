export const toolTypes = [
  "filesystem",
  "terminal",
  "git",
  "browser",
  "screenshot",
  "test_runner",
  "deployment_hook",
] as const;

export type ToolType = (typeof toolTypes)[number];

export type ToolPermission = {
  requiresApproval: boolean;
  deniedPaths?: string[];
  allowNetwork?: boolean;
};

export interface ToolAdapter {
  toolType: ToolType;
  execute(input: Record<string, unknown>): Promise<Record<string, unknown>>;
  permission: ToolPermission;
}
