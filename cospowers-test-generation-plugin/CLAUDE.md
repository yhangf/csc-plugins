# cospowers Test Generation — 测试生成 Plugin Usage Guide

## What this plugin is for

This plugin helps an agent derive test strategy, test cases, acceptance checks, regression checks, edge and exception cases, coverage reviews, and test code drafts from requirements, design documents, implementation plans, bug reports, API contracts, or existing code.

## When to use it

Use this plugin when the user asks to design tests, generate test cases, turn acceptance criteria into tests, protect a bug fix with regression tests, identify edge cases, review existing test coverage, or draft test code for a known language and framework.

## Primary entry skill

Start with `test-generation` unless the user explicitly asks for a narrower testing task. This skill is the plugin-level entry point and should decide whether the work needs strategy, cases, acceptance tests, regression tests, edge-case analysis, coverage review, test code generation, or a combination.

## Skill selection guide

- `test-generation`: Use as the default entry point for producing test artifacts from requirements, designs, plans, bug reports, APIs, or code.
- `test-strategy-generation`: Use for test scope, test levels, risk areas, priorities, environments, data needs, and execution strategy.
- `test-case-generation`: Use for detailed test cases with preconditions, steps, data, expected results, and traceability.
- `acceptance-test-generation`: Use for user-facing acceptance checks and business-flow validation.
- `regression-test-generation`: Use for bug fixes, changed behavior, compatibility risks, and existing behavior protection.
- `edge-case-test-generation`: Use for boundaries, nulls, invalid input, extremes, permissions, concurrency, failures, and exceptional paths.
- `test-coverage-review`: Use when existing tests need gap analysis against requirements, design, code, or risk areas.
- `test-code-generator`: Use only after test scenarios are clear and target language, framework, interfaces, and execution environment are known.
- `session-context`: Use to preserve testing-session context across multi-step work.
- `using-test-generation-plugin`: Use when the user asks how to use this plugin or when an agent needs plugin-level workflow guidance.

## Inputs to collect

Collect requirement documents, design documents, implementation plans, bug reports, API or message contracts, existing test files, target language, test framework, test level, interface type, data setup, environment constraints, external dependencies, risk areas, excluded scope, and expected validation commands.

If the user provides repository code, inspect the relevant production and test code before generating executable test code. If only documents are available, produce document-level test scenarios and clearly mark assumptions.

## Typical workflow

1. Start from `test-generation` and identify the needed test artifact.
2. Read requirements, designs, plans, contracts, bug reports, and relevant code or existing tests.
3. Use `test-strategy-generation` when scope, priorities, environments, or risk-based testing need to be defined first.
4. Use `test-case-generation`, `acceptance-test-generation`, `regression-test-generation`, and `edge-case-test-generation` to produce concrete scenarios.
5. Use `test-coverage-review` when the task is to evaluate existing test coverage or find gaps.
6. Use `test-code-generator` only after scenarios are stable and framework details are known.
7. Include traceability from tests to requirements, design decisions, defects, or code paths.

## Outputs to produce

Use local templates under `templates/` when generating test artifacts. Typical outputs include:

- `docs/tests/test-strategy.md` for test strategy and scope.
- `docs/tests/test-cases.md` for detailed functional and non-functional test cases.
- `docs/tests/acceptance-tests.md` for acceptance checks.
- `docs/tests/regression-tests.md` for regression protection.
- `docs/tests/coverage-review.md` for coverage gaps and recommendations.
- `docs/tests/generated-test-code/` for generated test code drafts when requested.

The exact path may vary if the user requests a different location. Test code should follow local testing standards and match the repository's existing conventions.

## Quality checks

Check that tests are traceable, executable or clearly marked as scenarios, meaningful, non-duplicative, and aligned with risk. Cover normal flows, boundaries, invalid inputs, permissions, failures, compatibility, concurrency, and non-functional requirements where applicable. For generated code, verify the framework, imports, setup, fixtures, and assertions match the repository context.

## Handoff

Hand off to TDD development with generated test cases, test code drafts, target framework, expected failing/passing behavior, setup requirements, and validation commands. Hand off to integration verification when the work needs end-to-end, contract, regression, or release-readiness evidence.

## Operating constraints

Use bare skill names. Use only this plugin's local `skills/`, `templates/`, `rules/`, and examples unless the user provides external handoff documents or repository code. If modifying this plugin itself, read the complete `SKILL.md` for every skill being changed before editing it.
