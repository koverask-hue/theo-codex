"use client";

import { StatusPill } from "../shared/status-pill";
import { ModelBadge } from "../shared/model-badge";
import { ProgressBar } from "../shared/progress-bar";
import type { LiveAgent } from "../mock-data";

const roleIcon: Record<string, string> = {
  planner: "🧠",
  coder: "⚡",
  frontend_specialist: "🎨",
  backend_specialist: "🔧",
  reviewer: "🔍",
  browser_tester: "🌐",
  design_specialist: "✏️",
  docs_specialist: "📚",
  devops_specialist: "🚀",
  animation_specialist: "✨",
};

type AgentsViewProps = {
  agents: LiveAgent[];
};

export function AgentsView({ agents }: AgentsViewProps) {
  const activeAgents = agents.filter(
    (a) => a.status === "running" || a.status === "done"
  );
  const queuedAgents = agents.filter((a) => a.status === "queued");
  const failedAgents = agents.filter((a) => a.status === "failed" || a.status === "blocked");

  const runningCount = agents.filter((a) => a.status === "running").length;

  return (
    <div className="flex h-full flex-1 flex-col overflow-y-auto">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Active agents</h2>
            <p className="mt-0.5 text-xs text-muted">
              {runningCount > 0
                ? `${runningCount} agent${runningCount > 1 ? "s" : ""} running`
                : "No agents running"}
              {" · "}
              {agents.length} total
            </p>
          </div>
          <div className="flex items-center gap-2">
            {runningCount > 0 && (
              <StatusPill status="executing" />
            )}
            <button className="rounded border border-danger/40 bg-danger-subtle px-2.5 py-1 text-xs font-medium text-danger transition-colors hover:bg-danger/10">
              Stop all
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {/* Active + done agents */}
        {activeAgents.length > 0 && (
          <section>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
              Active · {activeAgents.length}
            </p>
            <div className="space-y-2">
              {activeAgents.map((agent) => (
                <AgentRow key={agent.id} agent={agent} />
              ))}
            </div>
          </section>
        )}

        {/* Queued agents */}
        {queuedAgents.length > 0 && (
          <section>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
              Queued · {queuedAgents.length}
            </p>
            <div className="space-y-2">
              {queuedAgents.map((agent) => (
                <AgentRow key={agent.id} agent={agent} />
              ))}
            </div>
          </section>
        )}

        {/* Failed / blocked */}
        {failedAgents.length > 0 && (
          <section>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
              Blocked · {failedAgents.length}
            </p>
            <div className="space-y-2">
              {failedAgents.map((agent) => (
                <AgentRow key={agent.id} agent={agent} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function AgentRow({ agent }: { agent: LiveAgent }) {
  const isActive = agent.status === "running";
  const isDone = agent.status === "done";
  const isQueued = agent.status === "queued";

  return (
    <div
      className={`rounded-lg border p-4 transition-colors ${
        isActive
          ? "border-accent/30 bg-accent-subtle"
          : isDone
          ? "border-border bg-panel"
          : isQueued
          ? "border-border bg-panel opacity-60"
          : "border-danger/30 bg-danger-subtle"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Role icon */}
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-elevated text-sm">
          {roleIcon[agent.role] ?? "🤖"}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs font-semibold text-foreground">
              {agent.displayName}
            </span>
            <ModelBadge model={agent.model} size="sm" />
            <StatusPill
              status={
                agent.status === "running"
                  ? "in_progress"
                  : (agent.status as "done" | "queued" | "blocked" | "failed")
              }
              size="sm"
            />
          </div>

          {agent.currentTask && (
            <p className="mt-1.5 text-xs text-secondary leading-snug">
              {agent.currentTask}
            </p>
          )}

          {!agent.currentTask && isQueued && (
            <p className="mt-1.5 text-xs text-muted">Waiting for upstream tasks…</p>
          )}

          {agent.lastOutput && (
            <div className="mt-2 rounded border border-border bg-background/50 px-2.5 py-2">
              <p className="line-clamp-2 font-mono text-[11px] text-secondary leading-relaxed">
                {agent.lastOutput}
              </p>
            </div>
          )}

          {isActive && agent.progress > 0 && (
            <div className="mt-2.5 flex items-center gap-2">
              <ProgressBar value={agent.progress} className="flex-1" />
              <span className="text-[11px] text-muted tabular-nums">
                {agent.progress}%
              </span>
            </div>
          )}

          {isDone && (
            <div className="mt-2 flex items-center gap-1.5">
              <span className="text-[11px] text-success font-medium">
                ✓ Completed
              </span>
              {agent.startedAt && (
                <span className="text-[11px] text-muted">
                  at{" "}
                  {new Date(agent.startedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
