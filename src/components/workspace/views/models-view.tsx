"use client";

import { useState } from "react";
import type { RegisteredModel, ModelRoutingRule, SkillDefinition } from "@/core";

type ModelsViewProps = {
  models: RegisteredModel[];
  routingRules: ModelRoutingRule[];
  skills: SkillDefinition[];
};

type Section = "models" | "routing" | "skills";

const costTierColor: Record<string, string> = {
  budget: "text-success bg-success-subtle",
  balanced: "text-accent bg-accent-subtle",
  premium: "text-purple bg-purple-subtle",
};

const speedTierColor: Record<string, string> = {
  fast: "text-success",
  standard: "text-secondary",
  slow: "text-muted",
};

const providerLabel: Record<string, string> = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  google: "Google",
};

export function ModelsView({ models, routingRules, skills }: ModelsViewProps) {
  const [section, setSection] = useState<Section>("models");

  const sections: { key: Section; label: string }[] = [
    { key: "models", label: "Models" },
    { key: "routing", label: "Routing rules" },
    { key: "skills", label: "Skills" },
  ];

  return (
    <div className="flex h-full flex-1 flex-col overflow-y-auto">
      {/* Header + tabs */}
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-sm font-semibold text-foreground">Models & Skills</h2>
        <p className="mt-0.5 text-xs text-muted">
          Registered providers, routing rules, and skill assignments
        </p>
        <div className="mt-3 flex gap-1">
          {sections.map((s) => (
            <button
              key={s.key}
              onClick={() => setSection(s.key)}
              className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                section === s.key
                  ? "bg-elevated text-foreground"
                  : "text-muted hover:text-secondary"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        {section === "models" && (
          <ModelsSection models={models} />
        )}
        {section === "routing" && (
          <RoutingSection rules={routingRules} models={models} />
        )}
        {section === "skills" && (
          <SkillsSection skills={skills} />
        )}
      </div>
    </div>
  );
}

function ModelsSection({ models }: { models: RegisteredModel[] }) {
  const byProvider = models.reduce<Record<string, RegisteredModel[]>>(
    (acc, m) => {
      (acc[m.providerId] ??= []).push(m);
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-6">
      {Object.entries(byProvider).map(([providerId, providerModels]) => (
        <section key={providerId}>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
            {providerLabel[providerId] ?? providerId}
          </p>
          <div className="space-y-1">
            {providerModels.map((model) => (
              <div
                key={model.alias}
                className="flex items-center justify-between rounded-lg border border-border bg-panel px-4 py-3 hover:bg-elevated transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-semibold text-foreground">
                      {model.alias}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${costTierColor[model.costTier]}`}
                    >
                      {model.costTier}
                    </span>
                  </div>
                  <p className="mt-0.5 font-mono text-[11px] text-muted">
                    {model.providerModelId}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-[11px]">
                  <div className="text-right">
                    <p className="text-muted">Speed</p>
                    <p className={`font-medium ${speedTierColor[model.speedTier]}`}>
                      {model.speedTier}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted">Context</p>
                    <p className="font-medium text-secondary">
                      {(model.capabilities.maxContextTokens / 1000).toFixed(0)}k
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {model.capabilities.toolUse && (
                      <span className="rounded border border-border bg-elevated px-1.5 py-0.5 text-[10px] font-medium text-secondary">
                        tools
                      </span>
                    )}
                    {model.capabilities.vision && (
                      <span className="rounded border border-border bg-elevated px-1.5 py-0.5 text-[10px] font-medium text-secondary">
                        vision
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function RoutingSection({
  rules,
  models,
}: {
  rules: ModelRoutingRule[];
  models: RegisteredModel[];
}) {
  return (
    <div className="space-y-2">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
          {rules.length} routing rules
        </p>
        <button className="text-xs font-medium text-accent hover:underline">
          + Add rule
        </button>
      </div>

      {rules.map((rule) => {
        const primaryModel = models.find((m) => m.alias === rule.primaryModelAlias);
        return (
          <div
            key={rule.id}
            className="rounded-lg border border-border bg-panel px-4 py-3 hover:bg-elevated transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="rounded bg-elevated border border-border px-2 py-0.5 font-mono text-[11px] font-semibold text-foreground">
                    {rule.taskType}
                  </span>
                  {rule.requiresToolUse && (
                    <span className="text-[11px] text-muted">requires tools</span>
                  )}
                  {rule.requiresVision && (
                    <span className="text-[11px] text-muted">requires vision</span>
                  )}
                  {rule.preferredCostTier && (
                    <span className="text-[11px] text-muted">
                      prefer {rule.preferredCostTier}
                    </span>
                  )}
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[11px] text-muted">Primary:</span>
                  <span className="font-mono text-[11px] font-semibold text-accent">
                    {rule.primaryModelAlias}
                  </span>
                  {primaryModel && (
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${costTierColor[primaryModel.costTier]}`}
                    >
                      {primaryModel.costTier}
                    </span>
                  )}
                </div>

                {rule.fallbackModelAliases.length > 0 && (
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[11px] text-muted">Fallback:</span>
                    <span className="text-[11px] text-secondary">
                      {rule.fallbackModelAliases.join(" → ")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SkillsSection({ skills }: { skills: SkillDefinition[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {skills.map((skill) => {
        const isExpanded = expanded === skill.id;
        return (
          <div
            key={skill.id}
            className="rounded-lg border border-border bg-panel overflow-hidden"
          >
            <button
              onClick={() => setExpanded(isExpanded ? null : skill.id)}
              className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-elevated"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-foreground">
                    {skill.name}
                  </span>
                  <span className="rounded border border-border bg-elevated px-1.5 py-0.5 text-[10px] font-medium text-secondary">
                    {skill.scope}
                  </span>
                </div>
                {!isExpanded && (
                  <p className="mt-0.5 text-[11px] text-muted line-clamp-1">
                    {skill.description}
                  </p>
                )}
              </div>
              <svg
                width="12"
                height="12"
                viewBox="0 0 16 16"
                fill="currentColor"
                className={`ml-3 shrink-0 text-muted transition-transform ${isExpanded ? "rotate-90" : ""}`}
              >
                <path
                  fillRule="evenodd"
                  d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708Z"
                />
              </svg>
            </button>

            {isExpanded && (
              <div className="border-t border-border px-4 pb-4 pt-3">
                <p className="text-xs text-secondary">{skill.description}</p>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
                      Instructions
                    </p>
                    <ul className="space-y-1">
                      {skill.instructions.map((inst) => (
                        <li key={inst} className="text-[11px] text-secondary leading-relaxed">
                          · {inst}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
                      Acceptance criteria
                    </p>
                    <ul className="space-y-1">
                      {skill.acceptanceCriteria.map((crit) => (
                        <li key={crit} className="text-[11px] text-secondary leading-relaxed">
                          ✓ {crit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {skill.preferredModelAliases.map((alias) => (
                    <span
                      key={alias}
                      className="rounded border border-border bg-elevated px-2 py-0.5 font-mono text-[10px] font-medium text-secondary"
                    >
                      {alias}
                    </span>
                  ))}
                </div>

                <p className="mt-2 text-[11px] text-muted">
                  Output: <span className="font-mono text-secondary">{skill.outputFormat}</span>
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
