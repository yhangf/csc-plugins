# cospowers Task Planning — 任务拆解 Plugin Usage Guide

## What this plugin is for

This plugin helps an agent turn requirements, design documents, issues, feature goals, or bug-fix goals into executable implementation plans. It focuses on task decomposition, dependency ordering, task graphs, milestones, execution strategy, subagent dispatch, and worktree planning.

## When to use it

Use this plugin when the user asks to break work into tasks, create an implementation plan, plan a feature or bug fix, identify dependencies, decide what can run in parallel, prepare subagent assignments, plan isolated worktrees, or define milestones before implementation starts.

## Primary entry skill

Start with `task-planning` unless the user explicitly asks for a narrower planning artifact. This skill is the plugin-level entry point and should determine whether the work needs an implementation plan, task graph, execution strategy, milestone plan, subagent plan, worktree plan, or a combination.

## Skill selection guide

- `task-planning`: Use as the default entry point for converting requirements, design, issues, or goals into actionable work.
- `writing-plans`: Use for implementation plans with concrete steps, target files, acceptance criteria, and validation commands.
- `task-graph-generation`: Use to expose sequencing, dependencies, blocked work, critical path, and parallelizable tasks.
- `execution-strategy-selection`: Use to choose serial execution, parallel execution, subagents, worktrees, or a hybrid approach.
- `subagent-dispatch-planning`: Use when work can be delegated to multiple agents with clear inputs, outputs, and boundaries.
- `worktree-planning`: Use when isolated branches or worktrees would reduce risk or enable parallel work.
- `milestone-planning`: Use for staged delivery, checkpoints, phased rollout, or multi-step implementation programs.
- `session-context`: Use to preserve planning-session context across multi-step work.
- `using-task-planning-plugin`: Use when the user asks how to use this plugin or when an agent needs plugin-level workflow guidance.

## Inputs to collect

Collect requirement documents, design documents, issue or bug descriptions, target repository context, affected files or modules if known, constraints, deadlines or milestones if relevant, acceptance criteria, validation commands, test expectations, risks, dependencies, available agents, and whether branch or worktree isolation is allowed.

If the user provides handoff documents from requirements or solution design, read them and keep every task traceable to the original goals and constraints.

## Typical workflow

1. Start from `task-planning` and identify the planning artifact the user needs.
2. Read the available requirements, design documents, issues, and repository context before decomposing work.
3. Use `writing-plans` to produce a concrete implementation plan with tasks, target files, outputs, acceptance criteria, and validation.
4. Use `task-graph-generation` to identify dependencies, ordering, blockers, and parallelizable work.
5. Use `execution-strategy-selection` to decide whether work should be serial, parallel, subagent-based, worktree-based, or hybrid.
6. Use `subagent-dispatch-planning`, `worktree-planning`, or `milestone-planning` when the scope or risk justifies those artifacts.
7. End with a plan that is specific enough for an implementation agent to execute without re-discovering the entire problem.

## Outputs to produce

Use local templates under `templates/` when generating planning artifacts. Typical outputs include:

- `docs/plans/implementation-plan.md` for step-by-step implementation planning.
- `docs/plans/task-graph.md` for dependency graphs and sequencing.
- `docs/plans/execution-strategy.md` for execution mode selection and rationale.
- `docs/plans/subagent-dispatch-plan.md` for delegated task assignments.
- `docs/plans/worktree-plan.md` for isolated or parallel worktree execution.
- `docs/plans/milestone-plan.md` for staged delivery and checkpoints.

Plans should include goals, inputs, outputs, target files or modules, dependencies, assumptions, acceptance criteria, validation commands, risk notes, and handoff instructions.

## Quality checks

Check that every task has a clear outcome, owner or execution mode when relevant, dependency status, validation method, and acceptance criteria. Verify that the plan does not hide blockers, skip required design or testing work, or assign parallel work that depends on unresolved shared state.

## Handoff

Hand off to test generation when test strategy, test cases, or test code drafts are needed before implementation. Hand off to TDD development when the implementation plan is ready to execute. Include the implementation plan, task graph, validation commands, risk notes, and any required branch or worktree strategy.

## Operating constraints

This plugin should generally produce plans and planning artifacts, not modify product code. Use bare skill names. Use only this plugin's local `skills/`, `templates/`, `rules/`, and examples unless the user provides external handoff documents. If modifying this plugin itself, read the complete `SKILL.md` for every skill being changed before editing it.
