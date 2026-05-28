---
name: design-change-analysis
description: Local 方案设计 Plugin skill for AI 驱动的方案设计插件：从需求、PRD 或现有系统上下文生成系统设计、子系统设计和 API 契约。
---

# Design Change Analysis

## Skill 标识

- Skill name: `design-change-analysis`
- Plugin: `cospowers-solution-design`
- Scope: 方案设计 Plugin
- Entry skill: `solution-design`

## Purpose

Use this skill within the independent `cospowers-solution-design` plugin. It supports AI 驱动的方案设计插件：从需求、PRD 或现有系统上下文生成系统设计、子系统设计和 API 契约。

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

- `docs/design/system-design.md`
- `docs/design/openapi.yaml`
- `docs/design/asyncapi.yaml`
- `docs/design/subsystem-xxx-design.md`
- `docs/design/architecture-review-report.md`
- `docs/design/doc-consistency-report.md`
