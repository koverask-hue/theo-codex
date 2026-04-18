"use client";

import { useState } from "react";
import type { AgentRun, ArtifactRecord } from "@/core";
import { StatusPill } from "../shared/status-pill";
import { ModelBadge } from "../shared/model-badge";
import type { LiveAgent } from "../mock-data";

const artifactTypeLabel: Record<string, string> = {
  implementation_plan: "Plan",
  code_diff: "Diff",
  execution_log: "Log",
  test_result: "Test",
  screenshot: "Screenshot",
  walkthrough: "Walkthrough",
  task_list: "Tasks",
};

const artifactTypeIcon: Record<string, string> = {
  implementation_plan: "📋",
  code_diff: "🔀",
  execution_log: "📄",
  test_result: "✅",
  screenshot: "🖼",
  walkthrough: "🗺",
  task_list: "📝",
};

type TasksViewProps = {
  run: AgentRun;
  agents: LiveAgent[];
  artifacts: ArtifactRecord[];
};

export function TasksView({ run, agents, artifacts }: TasksViewProps) {
  const [selectedArtifactId, setSelectedArtifactId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");

  const selectedArtifact = artifacts.find((a) => a.id === selectedArtifactId);
  const runArtifacts = artifacts.filter((a) => a.runId === run.id);

  const taskProgress = Math.round(
    (run.taskGraph.filter((t) => t.status === "done").length / run.taskGraph.length) * 100
  );

  return (
    <div className="flex h-full min-h-0 flex-1">
      {/* ── Center panel ── */}
      <div className="flex min-w-0 flex-1 flex-col border-r border-border">
        {/* Goal header */}
        <div className="border-b border-border px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                Current goal
              </p>
              <h2 className="text-sm font-semibold leading-snug text-foreground">
                {run.rootGoal}
              </h2>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="text-xs text-muted tabular-nums">{taskProgress}%</span>
              <StatusPill status={run.status as "executing" | "completed" | "failed" | "planning" | "verifying" | "awaiting_approval"} />
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-elevated">
            <div
              className="h-full rounded-full bg-accent transition-all duration-700"
              style={{ width: `${taskProgress}%` }}
            />
          </div>

          {/* Agent progress pills */}
          <div className="mt-3 flex flex-wrap gap-2">
            {agents.map((agent) => (
              <span
                key={agent.id}
                className="inline-flex items-center gap-1.5 rounded border border-border bg-elevated px-2 py-1 text-[11px] text-secondary"
              >
                <StatusPill status={agent.status === "running" ? "in_progress" : agent.status as "done" | "queued" | "blocked" | "failed"} size="sm" />
                <span className="font-medium">{agent.displayName}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Task list */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
            Task graph · {run.taskGraph.length} tasks
          </p>
          <ol className="space-y-1">
            {run.taskGraph.map((task, idx) => {
              const agent = agents.find((a) => a.taskId === task.id);
              const statusColor =
                task.status === "done"
                  ? "text-success"
                  : task.status === "in_progress"
                  ? "text-accent"
                  : task.status === "failed"
                  ? "text-danger"
                  : task.status === "blocked"
                  ? "text-warning"
                  : "text-muted";

              return (
                <li
                  key={task.id}
                  className={`flex items-start gap-3 rounded px-3 py-2.5 transition-colors ${
                    task.status === "in_progress"
                      ? "bg-accent-subtle"
                      : "hover:bg-elevated"
                  }`}
                >
                  {/* Index / status */}
                  <span
                    className={`mt-0.5 shrink-0 text-xs font-mono font-medium tabular-nums ${statusColor}`}
                  >
                    {task.status === "done" ? "✓" : String(idx + 1).padStart(2, "0")}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs font-medium leading-snug ${
                        task.status === "done"
                          ? "text-secondary line-through decoration-muted/60"
                          : "text-foreground"
                      }`}
                    >
                      {task.title}
                    </p>
                    {task.dependsOnTaskIds.length > 0 && (
                      <p className="mt-0.5 text-[11px] text-muted">
                        Depends on:{" "}
                        {task.dependsOnTaskIds
                          .map((id) => {
                            const dep = run.taskGraph.find((t) => t.id === id);
                            return dep?.title ?? id;
                          })
                          .join(", ")}
                      </p>
                    )}
                    {agent?.lastOutput && task.status === "in_progress" && (
                      <p className="mt-1 line-clamp-1 text-[11px] text-muted">
                        {agent.lastOutput}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {agent && (
                      <ModelBadge model={agent.model} size="sm" />
                    )}
                    <span className="rounded bg-elevated px-1.5 py-0.5 text-[10px] font-medium text-secondary">
                      {task.assignedRole.replace(/_/g, " ")}
                    </span>
                    <StatusPill
                      status={task.status as "done" | "in_progress" | "todo" | "blocked" | "failed"}
                      size="sm"
                    />
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Command bar */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-elevated px-3 py-2.5 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/30 transition-all">
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="shrink-0 text-muted"
            >
              <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm0 13A6 6 0 1 1 8 2a6 6 0 0 1 0 12Z" />
              <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588ZM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
            </svg>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="New goal, task override, or command…"
              className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted outline-none"
            />
            <button
              className="shrink-0 rounded bg-accent px-2.5 py-1 text-[11px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              disabled={!inputValue.trim()}
            >
              Run
            </button>
          </div>
        </div>
      </div>

      {/* ── Right panel: Artifacts ── */}
      <div className="flex w-80 shrink-0 flex-col bg-panel">
        <div className="border-b border-border px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
            Artifacts · {runArtifacts.length}
          </p>
        </div>

        {selectedArtifact ? (
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
              <button
                onClick={() => setSelectedArtifactId(null)}
                className="text-[11px] text-accent hover:underline"
              >
                ← Back
              </button>
              <span className="text-[11px] text-muted truncate">{selectedArtifact.title}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <pre className="whitespace-pre-wrap font-mono text-[11px] text-secondary leading-relaxed">
                {selectedArtifact.content || "(no content)"}
              </pre>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {runArtifacts.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-xs text-muted">No artifacts yet.</p>
                <p className="mt-1 text-[11px] text-muted/70">They will appear as agents complete tasks.</p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {runArtifacts.map((art) => (
                  <li key={art.id}>
                    <button
                      onClick={() => setSelectedArtifactId(art.id)}
                      className="w-full px-4 py-3 text-left transition-colors hover:bg-elevated"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="mt-0.5 text-sm">{artifactTypeIcon[art.type] ?? "📄"}</span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium text-foreground">
                            {art.title}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="rounded bg-elevated border border-border px-1.5 py-0.5 text-[10px] font-medium text-secondary">
                              {artifactTypeLabel[art.type] ?? art.type}
                            </span>
                            {art.isVerificationEvidence && (
                              <span className="rounded bg-success-subtle px-1.5 py-0.5 text-[10px] font-medium text-success">
                                Evidence
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-[11px] text-muted">
                            by {art.createdByAgentRole.replace(/_/g, " ")} ·{" "}
                            {new Date(art.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          className="mt-1 shrink-0 text-muted"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708Z"
                          />
                        </svg>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* Approval checkpoint */}
            <div className="mx-4 my-3 rounded-lg border border-warning/30 bg-warning-subtle p-3">
              <div className="flex items-start gap-2">
                <span className="text-sm">⚠️</span>
                <div>
                  <p className="text-xs font-semibold text-warning">Approval checkpoint</p>
                  <p className="mt-0.5 text-[11px] text-secondary">
                    Review will be required before deployment after agent completion.
                  </p>
                  <button className="mt-2 text-[11px] font-medium text-accent hover:underline">
                    Configure
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
