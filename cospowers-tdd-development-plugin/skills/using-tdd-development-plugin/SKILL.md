---
name: using-tdd-development-plugin
description: Local TDD 编码 Plugin skill for AI 驱动的 TDD 编码插件：基于任务、测试、issue 或 bug 执行测试优先开发、调试、代码检查和提交。
---

# Using Tdd Development Plugin

## Skill 标识

- Skill name: `using-tdd-development-plugin`
- Plugin: `cospowers-tdd-development`
- Scope: TDD 编码 Plugin
- Entry skill: `tdd-implementation`

## Purpose

Use this skill within the independent `cospowers-tdd-development` plugin. It supports AI 驱动的 TDD 编码插件：基于任务、测试、issue 或 bug 执行测试优先开发、调试、代码检查和提交。

## Operating Boundaries

- Use only this plugin's local `templates/`, `rules/`, `skills/`, and `cospowers.config.json`.
- Accept standard handoff documents when provided, but also work from direct user input.

## Workflow

1. Classify the user's input for this plugin's scope.
2. Reuse local skills and local assets only.
3. Produce or update the expected artifacts.
4. Record assumptions, traceability, risks, and next steps.
5. Ask the user when a material decision is ambiguous.

## Expected Outputs

- `code changes`
- `unit tests`
- `passing local tests`
- `debugging report`
- `code compliance report`
- `code review report`
- `git commit / branch changes`
