---
name: edge-case-test-generation
description: Local 测试生成 Plugin skill for AI 驱动的测试生成插件：从需求、设计、计划、bug 或代码生成测试策略、测试用例和测试代码草稿。
---

# Edge Case Test Generation

## Skill 标识

- Skill name: `edge-case-test-generation`
- Plugin: `cospowers-test-generation`
- Scope: 测试生成 Plugin
- Entry skill: `test-generation`

## Purpose

Use this skill within the independent `cospowers-test-generation` plugin. It supports AI 驱动的测试生成插件：从需求、设计、计划、bug 或代码生成测试策略、测试用例和测试代码草稿。

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

- `docs/tests/test-strategy.md`
- `docs/tests/test-cases.md`
- `docs/tests/acceptance-tests.md`
- `docs/tests/regression-tests.md`
- `docs/tests/coverage-review.md`
- `docs/tests/generated-test-code/`
