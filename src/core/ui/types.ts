export type WorkspaceView =
  | "projects_sidebar"
  | "conversation_panel"
  | "artifacts_panel"
  | "task_graph"
  | "logs_view"
  | "routing_view";

export type InteractionGuardrail = {
  action: string;
  requiresApproval: boolean;
  reason: string;
};
