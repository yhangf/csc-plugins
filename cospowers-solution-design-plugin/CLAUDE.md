# cospowers Solution Design — 方案设计 Plugin Usage Guide

## What this plugin is for

This plugin helps an agent turn approved requirements, PRDs, issue context, existing system context, or design goals into architecture and design artifacts. It covers system design, subsystem design, API and message contracts, architecture review, design change impact analysis, cross-document consistency checks, design quality evaluation, and design-session context preservation.

## When to use it

Use this plugin when the user asks to design a system, convert requirements into technical architecture, write subsystem or module design, define APIs or event contracts, review an existing design, analyze the effect of design changes, check whether requirements, design documents, and contracts agree with each other, or preserve design context for downstream planning and implementation.

## Primary entry skill

Start with `solution-design` unless the user explicitly asks for a specific design task. This skill is the plugin-level entry point and should route the work toward system design, subsystem design, API contract design, review, change analysis, consistency checking, evaluation, session context, or a combination.

## Skill selection guide

- `solution-design`: Use as the default entry point for architecture and solution design from requirements, PRDs, issues, or system context.
- `design-spec`: Use for system-level design, including architecture, components, data flow, deployment, dependencies, constraints, risks, and DFX considerations.
- `subsystem-design-spec`: Use for detailed service, module, subsystem, component, responsibility, interface, and internal behavior design.
- `api-contract-design`: Use for OpenAPI, AsyncAPI, interface, service boundary, request/response, event, and compatibility contract design.
- `architecture-review`: Use when reviewing an existing design draft for correctness, completeness, consistency, risks, and feasibility.
- `design-change-analysis`: Use when architecture, interfaces, data flow, deployment, dependencies, or module responsibilities change.
- `doc-consistency-check`: Use when requirements, system design, subsystem design, API contracts, or other design documents may conflict.
- `design-master-perspective`: Use as a design-quality diagnostic lens for system and subsystem designs, especially for risk, boundary, decomposition, abstraction, and anti-pattern checks.
- `sysdesign-evaluator`: Use to evaluate system design document quality.
- `subsystem-evaluator`: Use to evaluate subsystem design document quality.
- `doc-quality-evaluator`: Use to evaluate document quality and cross-document issues.
- `session-context`: Use to preserve design-session context across multi-step work.
- `using-solution-design-plugin`: Use when the user asks how to use this plugin or when an agent needs plugin-level workflow guidance.

## Inputs to collect

Collect requirement documents, target users and flows, system boundaries, existing architecture, affected modules, data model expectations, API or event needs, deployment environment, external dependencies, scalability and performance targets, security and compliance constraints, compatibility needs, observability expectations, reliability requirements, known trade-offs, and any design-session context that should carry into planning or implementation.

If the user provides handoff documents from requirements, planning, testing, or implementation work, read those documents and keep design decisions traceable to them.

## Typical workflow

1. Start from `solution-design` and identify the design scope: system, subsystem, API contract, review, change analysis, consistency check, evaluation, or context preservation.
2. Read provided requirement artifacts, existing system context, and preserved session context before proposing a design.
3. Use `design-spec` for end-to-end architecture and system-level decisions.
4. Use `subsystem-design-spec` for detailed module or service design after system boundaries are clear.
5. Use `api-contract-design` when service boundaries, external interfaces, messages, OpenAPI, or AsyncAPI contracts are needed.
6. Use review, change-analysis, consistency-check, and evaluator skills before treating design output as ready for downstream planning.
7. Use `session-context` when design decisions, risks, assumptions, or unresolved questions need durable handoff context.
8. Record assumptions, unresolved decisions, risks, alternatives considered, and validation needs.

## Outputs to produce

Use local templates under `templates/` when generating design artifacts. Typical outputs include:

- `docs/design/system-design.md` for system-level architecture.
- `docs/design/subsystem-<name>-design.md` for subsystem or module design.
- `docs/design/openapi.yaml` for HTTP API contracts.
- `docs/design/asyncapi.yaml` for event or message contracts.
- `docs/design/architecture-review-report.md` for review findings.
- `docs/design/design-change-impact.md` for design change impact analysis.
- `docs/design/doc-consistency-report.md` for cross-document consistency results.
- Session-context summaries or archival notes when continuity is needed.

The exact path may vary if the user requests a different location, but outputs should be specific enough for task planning, implementation, and testing.

## Quality checks

Use `sysdesign-evaluator`, `subsystem-evaluator`, and `doc-quality-evaluator` where appropriate. Check traceability to requirements, unclear boundaries, missing interfaces, incomplete data flow, unhandled errors, security gaps, performance risks, compatibility risks, deployment assumptions, inconsistent terminology, contradictions across documents, and stale or incomplete session context.

## Handoff

Hand off to task planning with design documents, contracts, assumptions, dependencies, risks, validation needs, and any preserved session context. If test design is needed next, hand off API contracts, acceptance criteria, quality requirements, and risk areas to test generation.

## Maintenance reporting

When reporting plugin maintenance updates, use Chinese sections: `变更摘要`, `修改文件列表`, and `具体内容变更`.

## Operating constraints

Use bare skill names. Use only this plugin's local `skills/`, `templates/`, `rules/`, `evaluators/`, and examples unless the user provides external handoff documents. If modifying this plugin itself, read the complete `SKILL.md` for every skill being changed before editing it.
