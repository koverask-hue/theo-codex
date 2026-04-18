type ProgressBarProps = {
  value: number;
  max?: number;
  className?: string;
};

export function ProgressBar({ value, max = 100, className = "" }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`h-1 w-full rounded-full bg-elevated overflow-hidden ${className}`}>
      <div
        className="h-full rounded-full bg-accent transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
