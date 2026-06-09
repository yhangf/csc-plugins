---
name: requirements-intake
description: Local 需求梳理 Plugin skill for AI 驱动的需求梳理插件：将原始想法、PRD、issue、需求变更转化为结构化需求和系统需求。
---

# Requirements Intake

## Skill 标识

- Skill name: `requirements-intake`
- Plugin: `cospowers-requirements`
- Scope: 需求梳理 Plugin
- Entry skill: `requirements-intake`

## Purpose

Use this skill within the independent `cospowers-requirements` plugin. It supports AI 驱动的需求梳理插件：将原始想法、PRD、issue、需求变更转化为结构化需求和系统需求。

## Operating Boundaries

- Use only this plugin's local `templates/`, `rules/`, `skills/`, and `cospowers.config.json`.
- Accept standard handoff documents when provided, but also work from direct user input.

## Workflow

1. Classify the user's input for this plugin's scope.
2. If the request is vague, mixed, or contains unresolved branches, enter clarification before artifact generation.
3. Reuse local skills and local assets only.
4. Produce or update the expected artifacts.
5. Record assumptions, traceability, risks, and next steps.
6. Ask the user when a material decision is ambiguous.

## Clarification Intake

For raw ideas, PRDs, issues, feature requests, feedback, or mixed requirement inputs, clarify before routing when missing information blocks a useful requirement artifact.

- Ask exactly one high-leverage question at a time; do not send bulk questionnaires.
- Prefer concise options when the answer space is known, and include a recommended/default answer when it helps the user decide.
- Resolve prerequisite decisions first, then ask follow-up questions based on the user's answer.
- Inspect provided documents, repository context, templates, and existing requirement artifacts before asking for information that can be inferred.
- Use `requirement-analysis` clarification behavior for user/business requirement scope, actors, acceptance criteria, assumptions, exclusions, and terminology.
- Keep clarification at the requirement level; defer implementation design, DFX details, and technical constraints to the appropriate later skill unless they directly affect requirement boundaries.

## Expected Outputs

- `docs/requirements/ai-requirements.md`
- `docs/requirements/system-requirements.md`
- `docs/requirements/requirements-review-report.md`
- `docs/requirements/requirements-change-impact.md`
