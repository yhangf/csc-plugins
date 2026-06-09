# cospowers Requirements — 需求梳理 Plugin Usage Guide

## What this plugin is for

This plugin helps an agent turn rough ideas, PRDs, issues, bug reports, customer feedback, or requirement changes into structured requirement artifacts. It separates user/business requirements from system requirements, supports requirement quality review, and analyzes requirement change impact.

## When to use it

Use this plugin when the user asks to clarify requirements, write requirement documents, analyze a feature request, transform business goals into system needs, review existing requirement documents, or evaluate the impact of changed scope, rules, acceptance criteria, constraints, or non-functional requirements.

## Primary entry skill

Start with `requirements-intake` unless the user explicitly asks for a narrower requirement task. This skill is the plugin-level intake path and should decide whether to produce user requirements, system requirements, review output, change-impact output, or a combination.

## Skill selection guide

- `requirements-intake`: Use as the default entry point for raw ideas, PRDs, issue descriptions, bug reports, feedback, or mixed requirement inputs.
- `requirement-analysis`: Use when the task is focused on user/business requirements, user goals, scenarios, business rules, acceptance criteria, and requirement boundaries.
- `system-requirement-analysis`: Use when the task is focused on system capabilities, constraints, interfaces, quality attributes, security, performance, reliability, maintainability, and other DFX requirements.
- `requirements-review`: Use when the user already has requirement documents and wants completeness, clarity, consistency, feasibility, or traceability review.
- `requirements-change-analysis`: Use when requirements have changed and the user needs impact analysis across scope, design, tests, delivery, or risks.
- `aireq-evaluator`: Use to evaluate user/business requirement documents.
- `sysreq-evaluator`: Use to evaluate system requirement documents.
- `session-context`: Use to capture or restore requirement-session context when a multi-step workflow needs continuity.
- `using-requirements-plugin`: Use when the user asks how to use this plugin or when an agent needs plugin-level workflow guidance.

## Inputs to collect

Collect the user's goal, target users, business process, pain points, existing PRD or issue text, acceptance criteria, constraints, explicit exclusions, dependencies, affected systems, security/performance/reliability expectations, and whether this is a new requirement or a change to existing requirements.

Collect missing inputs through dependency-aware clarification instead of bulk questionnaires: ask one targeted question at a time, prefer concise options when possible, and include a recommended/default answer when it helps the user decide.

If the user provides handoff documents from other plugins or existing repository documents, read those documents and keep analysis grounded in the provided material.

## Typical workflow

1. Start from `requirements-intake` and identify whether the request needs user requirements, system requirements, review, change analysis, or evaluation.
2. Ask clarifying questions only for missing information that blocks a useful requirement artifact. Ask one targeted question at a time, inspect available context first, and offer options plus a recommended/default answer when useful.
3. Use `requirement-analysis` for business/user-facing requirement structure.
4. Use `system-requirement-analysis` to derive implementation-facing capabilities, constraints, interfaces, and quality requirements.
5. Use `requirements-review`, `requirements-change-analysis`, `aireq-evaluator`, or `sysreq-evaluator` when the user asks for review, impact analysis, or quality scoring.
6. Produce clear requirement documents and note assumptions, open questions, risks, and traceability links.
7. Hand off the resulting requirement artifacts to solution design when the user is ready for architecture or technical design.

## Outputs to produce

Use local templates under `templates/` when generating documents. Typical outputs include:

- `docs/requirements/ai-requirements.md` for user/business requirements.
- `docs/requirements/system-requirements.md` for system requirements.
- `docs/requirements/requirements-review-report.md` for requirement review findings.
- `docs/requirements/requirements-change-impact.md` for change-impact analysis.

The exact path may vary if the user requests a different location, but the output should remain structured, traceable, and suitable for handoff.

## Quality checks

Use `aireq-evaluator` for user/business requirement quality and `sysreq-evaluator` for system requirement quality. Check for ambiguity, missing actors, missing acceptance criteria, conflicting rules, unstated constraints, unverifiable requirements, incomplete quality attributes, and unclear scope boundaries.

## Handoff

When requirements are complete enough, hand off to the solution-design stage with the generated requirement documents, assumptions, unresolved questions, impacted systems, constraints, and acceptance criteria. Do not require another cospowers plugin to be installed; simply provide artifacts that a later design workflow can consume.

## Operating constraints

Use bare skill names. Use only this plugin's local `skills/`, `templates/`, `rules/`, `evaluators/`, and examples unless the user provides external handoff documents. The clarification interview behavior is built into this plugin's intake and requirement-analysis flow; do not require a separate `grill-me` skill invocation. If modifying this plugin itself, read the complete `SKILL.md` for every skill being changed before editing it.
