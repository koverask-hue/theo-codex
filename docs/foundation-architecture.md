# Theo Codex Foundation Architecture (Phase 0)

## 1) Product definition
Theo Codex is a desktop-first, artifact-trust AI software engineering workspace that coordinates multiple specialized agents and model providers to convert software goals into verified implementation outcomes.

## 2) Core feature map
1. Workspace shell (projects, conversation, artifacts panel)
2. Multi-agent orchestration (planner, coder, reviewer, browser/testing + specialists)
3. Skills system (global/workspace modular skills)
4. Multi-model routing (provider registry, BYOK, fallback)
5. Tool runtime (files, terminal, git diff, browser, screenshots, tests)
6. Verification and trust artifacts (plan, diffs, logs, screenshots, walkthroughs)
7. Memory and reusable workspace knowledge
8. Extensibility for plugins, marketplace, and collaboration

## 3) System architecture
Layered architecture:
- **Presentation**: Next.js workspace app with operational visibility
- **Application**: run/task APIs, orchestration service, approvals
- **Domain core**: strongly typed contracts for agents/skills/models/tools/memory/artifacts
- **Infrastructure**: provider and tool adapters, queues, storage
- **Data**: run history, artifacts, skill configs, memory records, audit logs

## 4) Data model / schema draft
Core entities:
- `Workspace`
- `Run`
- `TaskNode`
- `RunEvent`
- `AgentDefinition`
- `SkillDefinition`
- `ModelProvider` / `RegisteredModel` / `ModelRoutingRule`
- `ArtifactRecord`
- `MemoryRecord`

## 5) Agent orchestration design
- Planner generates task graph with dependencies.
- Orchestrator dispatches tasks to role agents.
- Parallel sub-agent execution allowed only when dependency constraints are satisfied.
- Reviewer and browser/test agents gate completion.
- High-risk actions enter `awaiting_approval` with human checkpoint.

## 6) Skills system spec
Skill contract includes:
- purpose and instructions
- tool usage rules
- acceptance criteria
- preferred model aliases
- required output format

Built-ins bootstrapped: frontend, backend, design, animation, testing, docs, DevOps.

## 7) Model provider abstraction spec
- Provider adapter interface (`validateConfiguration`, invocation boundary)
- Canonical model registry (`alias`, provider model id, capability metadata)
- Routing rule contract (task type, constraints, primary + fallback models)
- Per-agent preferred model aliases

## 8) Tool runtime spec
Tool adapter contract with explicit permissions:
- filesystem
- terminal
- git
- browser
- screenshot
- test runner
- deployment hook (placeholder)

Each tool run should emit execution logs and attach evidence artifacts.

## 9) UX / screen map
- **Left panel**: workspaces/projects
- **Center panel**: goal prompt, task timeline, plan progress
- **Right panel**: artifacts, task graph, logs, routing decisions, approvals

UX style: premium, technical, high-clarity, restrained motion, dark/light aware.

## 10) Delivery roadmap (MVP -> V2 -> V3)
### MVP
- Workspace shell
- Task graph + basic orchestration pipeline
- Built-in skills registry
- Model routing rules + fallback
- Tool adapters + artifact bundle output

### V2
- Persistent memory retrieval
- plugin/tool adapter marketplace foundation
- deeper reviewer/testing automation
- richer model policy management

### V3
- collaborative multi-user runs
- shared skill marketplace
- enterprise-grade policy controls and observability

## Current implementation status
Phase 0 foundation is now scaffolded in `src/core/*` with strongly typed contracts and a first workspace UI shell in `src/components/workspace/workspace-shell.tsx`.
