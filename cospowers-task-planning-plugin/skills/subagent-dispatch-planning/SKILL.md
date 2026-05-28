---
name: subagent-dispatch-planning
description: Local 任务拆解 Plugin skill for AI 驱动的任务拆解插件：将需求或设计拆解为实现计划、任务图、里程碑和执行策略。
---

# Subagent Dispatch Planning

## Skill 标识

- Skill name: `subagent-dispatch-planning`
- Plugin: `cospowers-task-planning`
- Scope: 任务拆解 Plugin
- Entry skill: `task-planning`

## Purpose

Use this skill within the independent `cospowers-task-planning` plugin. It supports AI 驱动的任务拆解插件：将需求或设计拆解为实现计划、任务图、里程碑和执行策略。

## Operating Boundaries

- Do not route through or require the old monolithic `brainstorming` skill.
- Do not require any other cospowers split plugin to be installed.
- Use only this plugin's local `templates/`, `rules/`, `skills/`, and `cospowers.config.json`.
- Accept standard handoff documents when provided, but also work from direct user input.

## Workflow

1. Classify the user's input for this plugin's scope.
2. Reuse local skills and local assets only.
3. Produce or update the expected artifacts.
4. Record assumptions, traceability, risks, and next steps.
5. Ask the user when a material decision is ambiguous.

## Expected Outputs

- `docs/plans/implementation-plan.md`
- `docs/plans/task-graph.md`
- `docs/plans/milestone-plan.md`
- `docs/plans/subagent-dispatch-plan.md`
- `docs/plans/worktree-plan.md`
- `docs/plans/execution-strategy.md`
