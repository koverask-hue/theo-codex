"use client";

import type { AgentRun } from "@/core";
import { StatusPill } from "../shared/status-pill";
import type { LiveAgent } from "../mock-data";

const roleIcon: Record<string, string> = {
  planner: "🧠",
  coder: "⚡",
  frontend_specialist: "🎨",
  backend_specialist: "🔧",
  reviewer: "🔍",
  browser_tester: "🌐",
};

const statusOrder = ["done", "in_progress", "todo", "blocked", "failed"];

type PlanningViewProps = {
  run: AgentRun;
  agents: LiveAgent[];
};

export function PlanningView({ run, agents }: PlanningViewProps) {
  const sortedTasks = [...run.taskGraph].sort(
    (a, b) =>
      statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
  );

  const completedCount = run.taskGraph.filter((t) => t.status === "done").length;
  const totalCount = run.taskGraph.length;

  return (
    <div className="flex h-full flex-1 flex-col overflow-y-auto">
      {/* Goal */}
      <div className="border-b border-border bg-panel px-6 py-5">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
          Root goal
        </p>
        <h2 className="text-base font-semibold leading-snug text-foreground">
          {run.rootGoal}
        </h2>
        <div className="mt-3 flex items-center gap-4">
          <StatusPill
            status={
              run.status as
                | "executing"
                | "planning"
                | "completed"
                | "failed"
                | "awaiting_approval"
            }
          />
          <span className="text-xs text-muted tabular-nums">
            {completedCount} / {totalCount} tasks complete
          </span>
          <span className="text-xs text-muted">
            Started{" "}
            {new Date(run.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      <div className="flex-1 px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
            Execution plan · {totalCount} tasks
          </p>
        </div>

        {/* Task graph */}
        <div className="space-y-2">
          {sortedTasks.map((task, idx) => {
            const agent = agents.find((a) => a.taskId === task.id);
            const depTasks = task.dependsOnTaskIds.map((id) =>
              run.taskGraph.find((t) => t.id === id)
            );
            const isActive = task.status === "in_progress";
            const isDone = task.status === "done";
            const isBlocked =
              task.status === "blocked" ||
              (task.status === "todo" &&
                task.dependsOnTaskIds.some(
                  (id) =>
                    run.taskGraph.find((t) => t.id === id)?.status !== "done"
                ));

            return (
              <div
                key={task.id}
                className={`rounded-lg border px-4 py-3 transition-colors ${
                  isActive
                    ? "border-accent/40 bg-accent-subtle"
                    : isDone
                    ? "border-border bg-elevated/40 opacity-70"
                    : isBlocked
                    ? "border-border bg-panel"
                    : "border-border bg-panel"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Step number */}
                  <span
                    className={`mt-0.5 w-5 shrink-0 text-center text-xs font-mono font-medium ${
                      isDone ? "text-success" : isActive ? "text-accent" : "text-muted"
                    }`}
                  >
                    {isDone ? "✓" : String(idx + 1)}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p
                        className={`text-xs font-semibold ${
                          isDone ? "text-secondary line-through decoration-muted/50" : "text-foreground"
                        }`}
                      >
                        {task.title}
                      </p>
                    </div>

                    {/* Metadata row */}
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      {/* Role */}
                      <span className="inline-flex items-center gap-1 text-[11px] text-secondary">
                        <span>{roleIcon[task.assignedRole] ?? "🤖"}</span>
                        <span>{task.assignedRole.replace(/_/g, " ")}</span>
                      </span>

                      {/* Agent model */}
                      {agent && (
                        <span className="text-[11px] text-muted">
                          {agent.model}
                        </span>
                      )}

                      {/* Dependencies */}
                      {depTasks.length > 0 && (
                        <span className="text-[11px] text-muted">
                          after:{" "}
                          {depTasks
                            .map((d) => d?.title ?? "unknown")
                            .join(", ")}
                        </span>
                      )}
                    </div>

                    {/* Blocked message */}
                    {isBlocked && !isActive && task.status === "todo" && (
                      <p className="mt-1.5 text-[11px] text-muted">
                        Waiting for upstream tasks to complete
                      </p>
                    )}
                  </div>

                  <StatusPill
                    status={
                      task.status as
                        | "done"
                        | "in_progress"
                        | "todo"
                        | "blocked"
                        | "failed"
                    }
                    size="sm"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Approval checkpoint */}
        <div className="mt-6 rounded-lg border border-border bg-panel p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-foreground">
                Human approval checkpoint
              </p>
              <p className="mt-0.5 text-[11px] text-muted">
                Required before the reviewer agent finalizes the implementation.
              </p>
            </div>
            <button className="rounded border border-accent/40 bg-accent-subtle px-2.5 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent/20">
              Configure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
