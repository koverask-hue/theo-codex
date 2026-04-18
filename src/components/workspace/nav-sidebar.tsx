"use client";

import type { Workspace } from "./mock-data";
import { StatusPill } from "./shared/status-pill";

export type ActiveView =
  | "tasks"
  | "agents"
  | "planning"
  | "artifacts"
  | "models";

type NavItem = {
  id: ActiveView;
  label: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  {
    id: "tasks",
    label: "Tasks",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M2 2.5A.5.5 0 0 1 2.5 2h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 2.5Zm0 4A.5.5 0 0 1 2.5 6h8a.5.5 0 0 1 0 1h-8A.5.5 0 0 1 2 6.5Zm0 4A.5.5 0 0 1 2.5 10h5a.5.5 0 0 1 0 1h-5A.5.5 0 0 1 2 10.5Z" />
      </svg>
    ),
  },
  {
    id: "agents",
    label: "Agents",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0a5 5 0 1 0 0 10A5 5 0 0 0 8 0ZM4.5 5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0Z" />
        <path d="M0 14.5a8.5 8.5 0 0 1 16 0 .5.5 0 0 1-.5.5H.5a.5.5 0 0 1-.5-.5Z" />
      </svg>
    ),
  },
  {
    id: "planning",
    label: "Planning",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-4A.5.5 0 0 0 14.5 1h-13Zm0 6a.5.5 0 0 0-.5.5v4a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-4A.5.5 0 0 0 14.5 7h-13Z" />
      </svg>
    ),
  },
  {
    id: "artifacts",
    label: "Artifacts",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1Z" />
        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3Zm-3-1A1.5 1.5 0 0 0 5 1.5H4.5A1.5 1.5 0 0 0 3 3h10a1.5 1.5 0 0 0-1.5-1.5H11A1.5 1.5 0 0 0 9.5 0h-3Z" />
      </svg>
    ),
  },
  {
    id: "models",
    label: "Models",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12ZM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2Z" />
      </svg>
    ),
  },
];

type NavSidebarProps = {
  workspaces: Workspace[];
  activeWorkspaceId: string;
  activeView: ActiveView;
  onWorkspaceChange: (id: string) => void;
  onViewChange: (view: ActiveView) => void;
  activeRunStatus?: string;
};

export function NavSidebar({
  workspaces,
  activeWorkspaceId,
  activeView,
  onWorkspaceChange,
  onViewChange,
  activeRunStatus,
}: NavSidebarProps) {
  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-r border-border bg-panel overflow-y-auto">
      {/* Logo */}
      <div className="flex h-12 items-center gap-2.5 border-b border-border px-4">
        <span className="flex size-6 items-center justify-center rounded bg-accent text-white text-xs font-bold">
          T
        </span>
        <span className="text-sm font-semibold tracking-tight">Theo Codex</span>
      </div>

      {/* Workspaces */}
      <div className="px-3 pt-4 pb-2">
        <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
          Workspaces
        </p>
        <ul className="space-y-0.5">
          {workspaces.map((ws) => {
            const isActive = ws.id === activeWorkspaceId;
            return (
              <li key={ws.id}>
                <button
                  onClick={() => onWorkspaceChange(ws.id)}
                  className={`w-full rounded px-2.5 py-2 text-left transition-colors ${
                    isActive
                      ? "bg-accent-subtle text-foreground"
                      : "text-secondary hover:bg-elevated hover:text-foreground"
                  }`}
                >
                  <p className={`text-xs font-medium leading-tight ${isActive ? "text-foreground" : ""}`}>
                    {ws.name}
                  </p>
                  {isActive && ws.activeRunId && (
                    <div className="mt-1">
                      <StatusPill
                        status={
                          (activeRunStatus as
                            | "executing"
                            | "completed"
                            | "failed") ?? "executing"
                        }
                        size="sm"
                      />
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mx-3 border-t border-border" />

      {/* Nav */}
      <div className="px-3 pt-3 pb-2">
        <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
          Views
        </p>
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = item.id === activeView;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left transition-colors ${
                    isActive
                      ? "bg-elevated text-foreground"
                      : "text-secondary hover:bg-elevated hover:text-foreground"
                  }`}
                >
                  <span className={isActive ? "text-accent" : ""}>{item.icon}</span>
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex-1" />

      {/* Footer */}
      <div className="border-t border-border p-3">
        <button className="flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-secondary transition-colors hover:bg-elevated hover:text-foreground">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492ZM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0Z" />
            <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319Z" />
          </svg>
          <span className="text-xs font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
}
