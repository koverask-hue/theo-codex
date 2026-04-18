"use client";

import { useState } from "react";
import type { ArtifactRecord } from "@/core";
import type { RunSummary } from "../mock-data";

const typeLabel: Record<string, string> = {
  implementation_plan: "Plan",
  code_diff: "Diff",
  execution_log: "Log",
  test_result: "Test",
  screenshot: "Screenshot",
  walkthrough: "Walkthrough",
  task_list: "Task list",
};

const typeIcon: Record<string, string> = {
  implementation_plan: "📋",
  code_diff: "🔀",
  execution_log: "📄",
  test_result: "✅",
  screenshot: "🖼",
  walkthrough: "🗺",
  task_list: "📝",
};

type ArtifactsViewProps = {
  artifacts: ArtifactRecord[];
  runs: RunSummary[];
};

type FilterType = "all" | ArtifactRecord["type"];

export function ArtifactsView({ artifacts, runs }: ArtifactsViewProps) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered =
    filter === "all" ? artifacts : artifacts.filter((a) => a.type === filter);

  const selected = artifacts.find((a) => a.id === selectedId);

  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: "All" },
    { key: "implementation_plan", label: "Plans" },
    { key: "code_diff", label: "Diffs" },
    { key: "execution_log", label: "Logs" },
    { key: "test_result", label: "Tests" },
    { key: "screenshot", label: "Screenshots" },
    { key: "walkthrough", label: "Walkthroughs" },
  ];

  return (
    <div className="flex h-full flex-1 min-h-0">
      {/* List panel */}
      <div
        className={`flex flex-col border-r border-border ${
          selected ? "w-80 shrink-0" : "flex-1"
        }`}
      >
        {/* Header + filters */}
        <div className="border-b border-border px-5 py-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">Artifacts</h2>
            <span className="text-xs text-muted">{filtered.length} items</span>
          </div>
          <div className="flex gap-1 overflow-x-auto pb-0.5">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`shrink-0 rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                  filter === f.key
                    ? "bg-elevated text-foreground"
                    : "text-muted hover:text-secondary"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-xs text-muted">No artifacts match this filter.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {filtered.map((art) => {
                const run = runs.find((r) => r.id === art.runId);
                const isSelected = art.id === selectedId;
                return (
                  <li key={art.id}>
                    <button
                      onClick={() =>
                        setSelectedId(isSelected ? null : art.id)
                      }
                      className={`w-full px-5 py-3 text-left transition-colors ${
                        isSelected
                          ? "bg-accent-subtle"
                          : "hover:bg-elevated"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 text-sm">
                          {typeIcon[art.type] ?? "📄"}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium text-foreground">
                            {art.title}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-1.5">
                            <span className="rounded border border-border bg-elevated px-1.5 py-0.5 text-[10px] font-medium text-secondary">
                              {typeLabel[art.type] ?? art.type}
                            </span>
                            {art.isVerificationEvidence && (
                              <span className="rounded bg-success-subtle px-1.5 py-0.5 text-[10px] font-medium text-success">
                                Evidence
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-[11px] text-muted">
                            {art.createdByAgentRole.replace(/_/g, " ")} ·{" "}
                            {run?.goal.slice(0, 28)}… ·{" "}
                            {new Date(art.createdAt).toLocaleDateString([], {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="flex flex-1 flex-col min-w-0">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-foreground">
                {selected.title}
              </p>
              <p className="mt-0.5 text-[11px] text-muted">
                {typeLabel[selected.type]} · by{" "}
                {selected.createdByAgentRole.replace(/_/g, " ")} ·{" "}
                {new Date(selected.createdAt).toLocaleString([], {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <button
              onClick={() => setSelectedId(null)}
              className="ml-4 shrink-0 text-muted hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708Z" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-5">
            {selected.content ? (
              <pre className="whitespace-pre-wrap font-mono text-[12px] text-secondary leading-relaxed">
                {selected.content}
              </pre>
            ) : (
              <div className="py-8 text-center">
                <p className="text-xs text-muted">No preview available.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
