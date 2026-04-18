export const artifactTypes = [
  "task_list",
  "implementation_plan",
  "code_diff",
  "walkthrough",
  "test_result",
  "screenshot",
  "execution_log",
] as const;

export type ArtifactType = (typeof artifactTypes)[number];

export type ArtifactRecord = {
  id: string;
  runId: string;
  taskId: string;
  type: ArtifactType;
  title: string;
  uri?: string;
  content?: string;
  createdAt: string;
  createdByAgentRole: string;
  isVerificationEvidence: boolean;
};
