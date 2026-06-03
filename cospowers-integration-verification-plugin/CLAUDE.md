# cospowers Integration Verification — 集成验证 Plugin Usage Guide

## What this plugin is for

This plugin helps an agent prove that completed or near-completed work is safe to finish, merge, release, or deliver. It supports integration testing, regression verification, contract verification, end-to-end verification, release readiness checks, final verification before completion, development branch finishing, compliance checks, debugging, review preparation, and structured commits when explicitly requested.

## When to use it

Use this plugin when the user asks to verify completed work, run integration checks, confirm a bug fix did not regress, validate API or message compatibility, test a complete user flow, assess release readiness, finish a development branch, prepare verification evidence, or decide whether work is ready to report as done.

## Primary entry skill

Start with `integration-verification` unless the user explicitly asks for a narrower verification task. This skill is the plugin-level entry point and should decide whether the work needs integration, regression, contract, E2E, release-readiness, final-completion, branch-finishing, debugging, compliance, or review support.

## Skill selection guide

- `integration-verification`: Use as the default entry point for verification after implementation or before delivery.
- `integration-test-runner`: Use for multi-module, multi-component, service interaction, dependency, environment, or integration-suite checks.
- `regression-verification`: Use to prove existing behavior and previously fixed bugs remain protected after a change.
- `contract-verification`: Use for API contracts, message schemas, service boundaries, OpenAPI, AsyncAPI, backward compatibility, and consumer/provider expectations.
- `e2e-verification`: Use for complete user-facing or business-critical flows across system boundaries.
- `release-readiness-check`: Use before merge, release, deployment, or delivery to assess readiness, risks, blockers, and required evidence.
- `verification-before-completion`: Use before declaring a task complete; require concrete command output, inspection evidence, or a clear statement of what could not be verified.
- `finishing-a-development-branch`: Use for final branch cleanup, status checks, review preparation, and closing verification steps.
- `systematic-debugging`: Use when verification fails or results are unclear.
- `code-compliance-check`: Use to check local coding, testing, review, and process standards as part of final verification.
- `requesting-code-review`: Use to prepare review materials after verification.
- `doc-quality-evaluator`: Use to evaluate verification, design, or release-readiness documents where document quality matters.
- `spec-commit`: Use only when the user explicitly asks to create a commit.
- `session-context`: Use to preserve verification-session context across multi-step work.
- `using-integration-verification-plugin`: Use when the user asks how to use this plugin or when an agent needs plugin-level workflow guidance.
- `agents/code-reviewer.md`: Use as the local code review agent definition when a dedicated review pass is needed.

## Inputs to collect

Collect the change summary, requirements and design artifacts, implementation plan, code diff, test plan, existing test commands, build commands, API or message contracts, affected modules and services, environment availability, external dependency constraints, branch status, prior failures, bug reproduction steps, release criteria, and user authorization for running commands, branch operations, or commits.

If some environments, services, credentials, or dependencies are unavailable, record the limitation and verify what can be verified locally or by inspection.

## Typical workflow

1. Start from `integration-verification` and identify the verification scope: integration, regression, contract, E2E, release readiness, branch finishing, or final completion.
2. Read the relevant requirements, design, plan, code diff, tests, contracts, and prior command output before choosing verification steps.
3. Use `integration-test-runner`, `regression-verification`, `contract-verification`, or `e2e-verification` based on the risk and artifact type.
4. Use `systematic-debugging` when a verification command fails or evidence contradicts expectations.
5. Use `code-compliance-check`, `doc-quality-evaluator`, and `requesting-code-review` as supporting checks when the task needs final readiness or review preparation.
6. Use `release-readiness-check`, `verification-before-completion`, or `finishing-a-development-branch` before merge, release, delivery, or declaring work complete.
7. Report pass/fail status with evidence, risks, blockers, limitations, and next actions.

## Outputs to produce

Use local templates under `templates/` when generating verification artifacts. Typical outputs include:

- `docs/verification/integration-test-report.md` for integration results.
- `docs/verification/regression-report.md` for regression verification.
- `docs/verification/contract-verification-report.md` for contract and compatibility evidence.
- `docs/verification/release-readiness-report.md` for release readiness.
- `docs/verification/final-verification-report.md` for completion evidence.
- `docs/verification/branch-finish-report.md` for development branch closing checks.

Reports should include the verification scope, commands or inspections performed, relevant output, pass/fail conclusion, risks, blockers, unverified areas, and recommended next actions.

## Quality checks

Never claim completion without evidence. Prefer command output, test results, build results, contract checks, code inspection notes, or documented environment limitations. Check that verification covers changed behavior, surrounding integration points, critical user flows, compatibility boundaries, release criteria, and known risk areas.

## Handoff

Hand off the final result with a clear pass/fail conclusion, evidence, unresolved risks, blockers, and next actions. If failures are found, hand off to TDD development or debugging with reproduction steps, failing commands, relevant logs, and suspected impact.

## Operating constraints

Match command execution, branch operations, environment access, and commits to the user's authorization. Commits require an explicit user request. Use bare skill names. Use only this plugin's local `skills/`, `templates/`, `rules/`, `evaluators/`, `agents/`, and examples unless the user provides external handoff documents or repository code. If modifying this plugin itself, read the complete `SKILL.md` for every skill being changed before editing it.
