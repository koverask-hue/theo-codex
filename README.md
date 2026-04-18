# theo-codex

Theo Codex is a production-oriented foundation for a multi-agent, multi-model AI coding workspace.

## What is implemented in this phase
- Product definition and architecture artifacts (`/docs/foundation-architecture.md`)
- Initial workspace app shell (left project panel, main planning panel, right artifacts/routing panel)
- Strongly typed foundation modules:
  - `src/core/agents`
  - `src/core/skills`
  - `src/core/models`
  - `src/core/tools`
  - `src/core/memory`
  - `src/core/artifacts`
  - `src/core/orchestration`
  - `src/core/ui`

## Run locally
```bash
npm install
npm run dev
```

## Validation commands
```bash
npm run lint
npm run build
```

## Phase intent
This phase establishes product architecture and contracts. It intentionally stops before deep runtime implementation so orchestration internals can proceed after approval.
