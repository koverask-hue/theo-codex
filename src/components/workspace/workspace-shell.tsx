import {
  architectureLayers,
  featureTree,
  mvpScope,
  productDefinition,
  proposedModuleStructure,
  recommendedStack,
} from "@/core/product/definition";

export function WorkspaceShell() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px]">
        <aside className="hidden w-72 border-r border-border/80 bg-panel p-4 lg:block">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Workspaces</p>
          <h1 className="mt-2 text-lg font-semibold">Theo Codex</h1>
          <ul className="mt-6 space-y-2 text-sm">
            {[
              "Core App Platform",
              "UI System",
              "Model Routing Lab",
              "Skill Registry",
            ].map((workspace, index) => (
              <li key={workspace} className="rounded-md border border-border/70 p-3">
                <p className="font-medium">{workspace}</p>
                <p className="text-xs text-muted">
                  {index === 0 ? "Active workspace" : "Pinned"}
                </p>
              </li>
            ))}
          </ul>
        </aside>

        <main className="flex-1 border-r border-border/80 bg-background p-6 lg:p-8">
          <header className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Phase 0 · Product Definition</p>
            <h2 className="text-2xl font-semibold tracking-tight lg:text-3xl">
              Multi-agent coding workspace foundation
            </h2>
            <p className="max-w-3xl text-sm text-muted lg:text-base">{productDefinition.positioning}</p>
          </header>

          <section className="mt-8 grid gap-4 lg:grid-cols-2">
            <article className="rounded-lg border border-border/80 bg-panel p-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">Concise Product Definition</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <span className="font-medium">Primary user:</span> {productDefinition.primaryUser}
                </li>
                <li>
                  <span className="font-medium">Primary outcome:</span> {productDefinition.primaryOutcome}
                </li>
              </ul>
            </article>

            <article className="rounded-lg border border-border/80 bg-panel p-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">MVP Scope Cut</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {mvpScope.included.slice(0, 3).map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </article>
          </section>

          <section className="mt-8 space-y-5">
            <article className="rounded-lg border border-border/80 bg-panel p-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">Feature Tree</h3>
              <div className="mt-4 space-y-4 text-sm">
                {featureTree.map((node) => (
                  <div key={node.name}>
                    <p className="font-semibold">{node.name}</p>
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-muted">
                      {node.children?.map((child) => <li key={child.name}>{child.name}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-lg border border-border/80 bg-panel p-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">Proposed Architecture</h3>
              <div className="mt-4 space-y-3 text-sm">
                {architectureLayers.map((layer) => (
                  <div key={layer.layer} className="rounded-md border border-border/70 p-3">
                    <p className="font-semibold">{layer.layer}</p>
                    <ul className="mt-1 list-disc pl-5 text-muted">
                      {layer.responsibilities.map((responsibility) => (
                        <li key={responsibility}>{responsibility}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-lg border border-border/80 bg-panel p-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">
                Recommended Stack (with rationale)
              </h3>
              <ul className="mt-3 space-y-3 text-sm">
                {recommendedStack.map((choice) => (
                  <li key={choice.category}>
                    <p className="font-semibold">{choice.category}: {choice.choice}</p>
                    <p className="text-muted">{choice.rationale}</p>
                  </li>
                ))}
              </ul>
            </article>
          </section>
        </main>

        <aside className="hidden w-96 bg-panel p-6 xl:block">
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">Artifacts & Routing</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                "Task list (required before major work)",
                "Implementation plan",
                "Git-aware diff bundle",
                "Screenshot evidence",
                "Test run output",
                "Walkthrough summary",
              ].map((item) => (
                <li key={item} className="rounded-md border border-border/70 p-3">{item}</li>
              ))}
            </ul>
          </section>

          <section className="mt-8">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">Initial Module Structure</h3>
            <ul className="mt-3 space-y-2 text-xs text-muted">
              {proposedModuleStructure.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </section>

          <section className="mt-8 rounded-lg border border-border/80 p-4">
            <h3 className="text-sm font-semibold">Approval Checkpoint</h3>
            <p className="mt-2 text-sm text-muted">
              Foundation architecture and contracts are ready. Awaiting approval before deep implementation.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
