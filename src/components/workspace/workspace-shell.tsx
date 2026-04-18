"use client";

import { useState } from "react";
import { NavSidebar, type ActiveView } from "./nav-sidebar";
import { TasksView } from "./views/tasks-view";
import { AgentsView } from "./views/agents-view";
import { PlanningView } from "./views/planning-view";
import { ArtifactsView } from "./views/artifacts-view";
import { ModelsView } from "./views/models-view";
import {
  mockWorkspaces,
  mockCurrentRun,
  mockLiveAgents,
  mockArtifacts,
  mockRecentRuns,
  mockModels,
  mockRoutingRules,
  mockSkills,
} from "./mock-data";

const VIEW_LABELS: Record<ActiveView, string> = {
  tasks: "Tasks",
  agents: "Agents",
  planning: "Planning",
  artifacts: "Artifacts",
  models: "Models & Skills",
};

export function WorkspaceShell() {
  const [activeView, setActiveView] = useState<ActiveView>("tasks");
  const [activeWorkspaceId, setActiveWorkspaceId] = useState("ws-1");

  const activeWorkspace = mockWorkspaces.find((w) => w.id === activeWorkspaceId);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground antialiased">
      {/* Left sidebar */}
      <NavSidebar
        workspaces={mockWorkspaces}
        activeWorkspaceId={activeWorkspaceId}
        activeView={activeView}
        onWorkspaceChange={setActiveWorkspaceId}
        onViewChange={setActiveView}
        activeRunStatus={mockCurrentRun.status}
      />

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-panel px-5">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-foreground">
              {activeWorkspace?.name ?? "Workspace"}
            </span>
            <span className="text-muted">·</span>
            <span className="text-xs text-secondary">
              {VIEW_LABELS[activeView]}
            </span>
          </div>

          {/* Run stats */}
          {activeView !== "models" && (
            <div className="flex items-center gap-4 text-[11px] text-muted">
              <span>
                {mockLiveAgents.filter((a) => a.status === "running").length} agents running
              </span>
              <span>
                {mockArtifacts.filter((a) => a.runId === mockCurrentRun.id).length} artifacts
              </span>
              <button className="rounded border border-border bg-elevated px-2.5 py-1 text-xs font-medium text-secondary transition-colors hover:text-foreground">
                New run
              </button>
            </div>
          )}
        </header>

        {/* View content */}
        <main className="flex min-h-0 flex-1 overflow-hidden">
          {activeView === "tasks" && (
            <TasksView
              run={mockCurrentRun}
              agents={mockLiveAgents}
              artifacts={mockArtifacts}
            />
          )}
          {activeView === "agents" && (
            <AgentsView agents={mockLiveAgents} />
          )}
          {activeView === "planning" && (
            <PlanningView run={mockCurrentRun} agents={mockLiveAgents} />
          )}
          {activeView === "artifacts" && (
            <ArtifactsView artifacts={mockArtifacts} runs={mockRecentRuns} />
          )}
          {activeView === "models" && (
            <ModelsView
              models={mockModels}
              routingRules={mockRoutingRules}
              skills={mockSkills}
            />
          )}
        </main>
      </div>
    </div>
  );
}
