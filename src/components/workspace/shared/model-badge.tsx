type ModelBadgeProps = {
  model: string;
  size?: "sm" | "md";
};

const providerColor: Record<string, string> = {
  gpt: "text-[#10a37f]",
  "o1": "text-[#10a37f]",
  "o3": "text-[#10a37f]",
  claude: "text-[#d97706]",
  gemini: "text-[#4285f4]",
};

function getProviderColor(model: string): string {
  for (const [prefix, color] of Object.entries(providerColor)) {
    if (model.toLowerCase().startsWith(prefix)) return color;
  }
  return "text-secondary";
}

export function ModelBadge({ model, size = "md" }: ModelBadgeProps) {
  const textSize = size === "sm" ? "text-[10px]" : "text-[11px]";
  const color = getProviderColor(model);

  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 font-mono ${textSize} font-medium bg-elevated border border-border ${color}`}
    >
      {model}
    </span>
  );
}
