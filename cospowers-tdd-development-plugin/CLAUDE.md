# cospowers TDD Development — TDD 编码 Plugin Usage Guide

## What this plugin is for

This plugin helps an agent implement, fix, debug, and review code using test-driven development and local engineering standards. It supports red-green-refactor execution, implementation-plan execution, systematic debugging, code compliance checks, code review preparation, implementation review, subagent-assisted development, git worktree workflows, and structured commits when explicitly requested.

## When to use it

Use this plugin when the user asks to implement a feature, fix a bug, execute an implementation plan, write code using TDD, debug failing tests or runtime errors, check code compliance, prepare a code review request, coordinate subagents for development, work in isolated worktrees, or create a commit after implementation.

## Primary entry skill

Start with `tdd-implementation` unless the user explicitly asks for a narrower development task. This skill is the plugin-level entry point and should decide whether the work needs strict TDD, plan execution, debugging, review, compliance checking, subagent coordination, worktree isolation, or commit preparation.

## Skill selection guide

- `tdd-implementation`: Use as the default entry point for implementation, bug fixing, and code-change work.
- `test-driven-development`: Use for strict red-green-refactor: write or confirm a failing test, implement the minimum code, pass tests, then refactor safely.
- `executing-plans`: Use when the user provides an implementation plan, task graph, issue plan, or design-to-code handoff.
- `subagent-driven-development`: Use when a complex task can be split into independent, well-scoped implementation or investigation tasks.
- `systematic-debugging`: Use for failing tests, exceptions, logs, reproduction steps, unclear behavior, or regression diagnosis.
- `code-compliance-check`: Use after implementation to check local coding standards, testing standards, review rules, and process expectations.
- `implementation-review`: Use to evaluate whether code changes satisfy requirements, design, plans, and tests.
- `requesting-code-review`: Use to prepare review materials, summaries, risk notes, and reviewer-facing context.
- `using-git-worktrees`: Use when isolated or parallel development branches/worktrees are appropriate and authorized.
- `spec-commit`: Use only when the user explicitly asks to create a commit.
- `session-context`: Use to preserve development-session context across multi-step work.
- `using-tdd-development-plugin`: Use when the user asks how to use this plugin or when an agent needs plugin-level workflow guidance.
- `agents/code-reviewer.md`: Use as the local code review agent definition when a dedicated review pass is needed.

## Inputs to collect

Collect the implementation goal, requirement or design documents, implementation plan, target files or modules, existing code context, relevant tests, expected behavior, reproduction steps for bugs, failing command output, target language and framework, coding/testing standards, branch/worktree constraints, and whether the user permits code edits, test execution, branch or worktree operations, and commits.

For commits, require an explicit user request. Do not infer commit permission from implementation permission.

## Typical workflow

1. Start from `tdd-implementation` and identify whether the task is new implementation, bug fix, debugging, plan execution, review, or commit preparation.
2. Read the relevant requirements, plans, tests, and code before proposing or making code changes.
3. Use `test-driven-development` when TDD is possible: establish the failing test, make the minimum implementation, run tests, then refactor.
4. Use `executing-plans` when a plan exists and keep progress aligned to the plan's acceptance criteria and validation commands.
5. Use `systematic-debugging` when behavior is unclear or verification fails; diagnose root cause before changing approach.
6. Use `code-compliance-check` and `implementation-review` after changes to verify standards and requirement satisfaction.
7. Use `requesting-code-review` when preparing handoff for human or agent review.
8. Use `spec-commit` only after the user explicitly asks for a commit and after checking the final diff and status.

## Outputs to produce

Use local templates under `templates/` when generating development artifacts. Typical outputs include:

- Code changes and corresponding tests.
- Test command results and relevant logs.
- TDD cycle notes or report when useful.
- Debugging reports for investigated failures.
- Code compliance reports.
- Implementation review reports.
- Code review request materials.
- Commit messages or commits only when explicitly requested.

The exact files changed should be limited to what the user's task requires. Avoid unrelated refactors or speculative abstractions.

## Quality checks

Run the validation commands required by the plan or repository context when permitted. Confirm tests fail for the expected reason before implementation when using TDD, and confirm they pass after the change. Check coding standards, testing standards, security-sensitive behavior, error handling at system boundaries, compatibility risks, and whether the implementation satisfies the original requirement without adding unrequested scope.

## Handoff

Hand off to integration verification with the code changes, tests added or updated, commands run, results, known risks, unresolved questions, and any contracts or behavior that should be verified across modules or services.

## Operating constraints

Match code edits, test execution, branch/worktree operations, and commits to the user's authorization. Commits require an explicit user request. Use bare skill names. Use only this plugin's local `skills/`, `templates/`, `rules/`, `agents/`, and examples unless the user provides external handoff documents or repository code. If modifying this plugin itself, read the complete `SKILL.md` for every skill being changed before editing it.
