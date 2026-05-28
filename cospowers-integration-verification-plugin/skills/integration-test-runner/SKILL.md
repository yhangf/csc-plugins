---
name: integration-test-runner
description: Local 集成测试 Plugin skill for AI 驱动的集成验证插件：执行集成测试、回归验证、契约验证、发布前检查和分支收尾。
---

# Integration Test Runner

## Skill 标识

- Skill name: `integration-test-runner`
- Plugin: `cospowers-integration-verification`
- Scope: 集成测试 Plugin
- Entry skill: `integration-verification`

## Purpose

Use this skill within the independent `cospowers-integration-verification` plugin. It supports AI 驱动的集成验证插件：执行集成测试、回归验证、契约验证、发布前检查和分支收尾。

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

- `docs/verification/integration-test-report.md`
- `docs/verification/regression-report.md`
- `docs/verification/contract-verification-report.md`
- `docs/verification/release-readiness-report.md`
- `docs/verification/final-verification-report.md`
