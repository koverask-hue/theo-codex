type Status =
  | "running"
  | "in_progress"
  | "done"
  | "completed"
  | "queued"
  | "todo"
  | "blocked"
  | "failed"
  | "planning"
  | "executing"
  | "awaiting_approval"
  | "verifying";

const statusConfig: Record<
  Status,
  { label: string; dotColor: string; textColor: string }
> = {
  running: {
    label: "Running",
    dotColor: "bg-success",
    textColor: "text-success",
  },
  in_progress: {
    label: "In progress",
    dotColor: "bg-accent",
    textColor: "text-accent",
  },
  done: { label: "Done", dotColor: "bg-success", textColor: "text-success" },
  completed: {
    label: "Completed",
    dotColor: "bg-success",
    textColor: "text-success",
  },
  queued: {
    label: "Queued",
    dotColor: "bg-muted",
    textColor: "text-muted",
  },
  todo: { label: "Todo", dotColor: "bg-muted", textColor: "text-muted" },
  blocked: {
    label: "Blocked",
    dotColor: "bg-warning",
    textColor: "text-warning",
  },
  failed: {
    label: "Failed",
    dotColor: "bg-danger",
    textColor: "text-danger",
  },
  planning: {
    label: "Planning",
    dotColor: "bg-purple",
    textColor: "text-purple",
  },
  executing: {
    label: "Executing",
    dotColor: "bg-accent",
    textColor: "text-accent",
  },
  awaiting_approval: {
    label: "Needs review",
    dotColor: "bg-warning",
    textColor: "text-warning",
  },
  verifying: {
    label: "Verifying",
    dotColor: "bg-purple",
    textColor: "text-purple",
  },
};

type StatusPillProps = {
  status: Status;
  pulse?: boolean;
  size?: "sm" | "md";
};

export function StatusPill({ status, pulse, size = "md" }: StatusPillProps) {
  const cfg = statusConfig[status] ?? {
    label: status,
    dotColor: "bg-muted",
    textColor: "text-muted",
  };
  const isLive = status === "running" || status === "executing" || status === "in_progress";
  const textSize = size === "sm" ? "text-[11px]" : "text-xs";
  const dotSize = size === "sm" ? "size-1.5" : "size-2";

  return (
    <span className={`inline-flex items-center gap-1.5 ${textSize} ${cfg.textColor} font-medium tabular-nums`}>
      <span className="relative inline-flex">
        {(pulse ?? isLive) && (
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${cfg.dotColor}`}
          />
        )}
        <span className={`relative inline-flex rounded-full ${dotSize} ${cfg.dotColor}`} />
      </span>
      {cfg.label}
    </span>
  );
}
