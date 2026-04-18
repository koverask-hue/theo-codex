export const runStatuses = [
  "queued",
  "planning",
  "executing",
  "awaiting_approval",
  "verifying",
  "completed",
  "failed",
] as const;

export type RunStatus = (typeof runStatuses)[number];

export type TaskNode = {
  id: string;
  parentId?: string;
  title: string;
  assignedRole: string;
  status: "todo" | "in_progress" | "blocked" | "done" | "failed";
  dependsOnTaskIds: string[];
};

export type AgentRun = {
  id: string;
  workspaceId: string;
  rootGoal: string;
  status: RunStatus;
  createdAt: string;
  updatedAt: string;
  taskGraph: TaskNode[];
};

export type RunEvent = {
  id: string;
  runId: string;
  type:
    | "run_created"
    | "task_started"
    | "task_completed"
    | "approval_requested"
    | "artifact_created"
    | "run_completed"
    | "run_failed";
  timestamp: string;
  payload: Record<string, unknown>;
};
