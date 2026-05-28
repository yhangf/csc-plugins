---
name: requirements-review
description: Local 需求梳理 Plugin skill for AI 驱动的需求梳理插件：将原始想法、PRD、issue、需求变更转化为结构化需求和系统需求。
---

# Requirements Review

## Skill 标识

- Skill name: `requirements-review`
- Plugin: `cospowers-requirements`
- Scope: 需求梳理 Plugin
- Entry skill: `requirements-intake`

## Purpose

Use this skill within the independent `cospowers-requirements` plugin. It supports AI 驱动的需求梳理插件：将原始想法、PRD、issue、需求变更转化为结构化需求和系统需求。

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

- `docs/requirements/ai-requirements.md`
- `docs/requirements/system-requirements.md`
- `docs/requirements/requirements-review-report.md`
- `docs/requirements/requirements-change-impact.md`
