---
name: executing-plans
description: Use when you have a written implementation plan to execute in a separate session with review checkpoints
---

# Executing Plans

## Skill 标识

- Skill name: `executing-plans`
- Plugin: `cospowers-tdd-development`
- Scope: Independent split plugin package `cospowers-tdd-development-plugin`
- Entry skill: `tdd-implementation`


**Skill 标识**: `executing-plans`

其他 skill 通过 `executing-plans` 引用本 skill。

## Overview

Load plan, review critically, execute all tasks, report when complete.

**Announce at start:** "I'm using the executing-plans skill to implement this plan."

**Note on execution mode:** This skill supports two execution paths:
- **Inline mode** (this skill directly): Execute tasks sequentially in the current session. Suitable for small plans (≤ 3 tasks) or platforms without subagent support.
- **Subagent mode** (`subagent-driven-development`): Dispatch each task as an isolated subagent with code review between tasks. **Recommended for plans with 4+ tasks or tasks that are independent of each other.** This skill auto-detects subagent availability — if the Agent tool is available, prefer subagent mode for quality.

If running in subagent mode, the steps below still apply as the orchestration framework — each task subagent follows the same TDD → code review → compliance check → commit cycle.

## Team Coding Standards

- **Git commits**: All commits must follow `spec-commit` (AI tags, protected branch checks, structured messages)
- **Knowledge Hub**: Before solving technical problems encountered during execution, search the team knowledge Hub via `evo-knowledge-wheel`
- **No `git add -A`**: Stage files individually, exclude `agent-rules/` directory
- **Separate concerns**: Different purposes go in separate commits

- Code + tests must be generated together (follow `test-driven-development`)
- Tests must cover normal, boundary, and exception scenarios

Coding standards (E-rules, language conventions, security, logging) and format tools are enforced by `code-compliance-check` (Step 6). DFX constraints and test quality are checked by `code-reviewer` (Step 5). Do NOT duplicate these checks inline.

## The Process

### Step 1: Load and Review Plan
1. Read plan file
2. Review critically - identify any questions or concerns about the plan
3. If concerns: Raise them with the user before starting
4. If no concerns: Create TodoWrite and proceed
5. **Discover and map Domain Skills:**
   - Read the plan header's `Domain Skills` block (written by writing-plans)
   - Cross-check against current session's loaded skills (system-reminder):
     - Skill listed in plan but not currently loaded → warn user, fall back to default
     - New relevant skill loaded now but absent from plan → add to execution mapping
   - Build a mental execution map: for each task category (test writing, code impl, debugging), know which skill to invoke
   - If plan has no `Domain Skills` block (older plan): scan session skills now and build the map from scratch using the same four categories (单测编写 / 测试方法 / 排障调试 / 代码编写)

## ⏱️ Time-Stats Logging (MANDATORY)

executing-plans 启动后必须在两个关键时间点追加写入 `time-stats.log`：

### T_EXEC_START: After loading plan, before first task

```bash
echo "T_EXEC_START: $(date '+%Y-%m-%d %H:%M:%S')" >> docs/agent-rules/spec_developer/output/time-stats.log
```

### T_FIRST_COMPLETE: After all tasks complete, before COMPLETE handoff

```bash
echo "T_FIRST_COMPLETE: $(date '+%Y-%m-%d %H:%M:%S')" >> docs/agent-rules/spec_developer/output/time-stats.log
```

> ⚠️ 此文件由 planner 创建（写入 T_TASK_START），executor 追加写入，最终由 committer 读取用于生成 `[TIME-STATS]` 块。三个角色通过此文件传递时间数据，**不可跳过任何打点**。

### Step 2: Execute Tasks

**Before first task:** Record T_EXEC_START (see Time-Stats Logging above).

For each task:
1. Mark as in_progress
2. Read the task's code conventions from the plan header (Conventions section written by writing-plans)
3. For each implementation step, follow TDD cycle strictly:
   - **RED**: Write the failing test first (invoke `test-driven-development`)
   - **Run**: Verify the test fails for the expected reason (not a typo or import error)
   - **GREEN**: Write the minimal code to make the test pass
   - **Run**: Verify the test passes AND all other tests still pass
   - **REFACTOR**: Clean up if needed, keep tests green
4. **invoke `verification-before-completion`** — run tests (C1: new test file + C2: linked modules), show evidence
5. **Spec compliance review** — verify implementation matches task requirements:
   - Read the task's full requirements from `tasks.md`
   - Compare actual implementation against requirements line by line
   - Check for: missing requirements, extra/unneeded work, misunderstandings
   - Reference `./skills/subagent-driven-development/agents/spec-reviewer-prompt.md` for review methodology
   - **Gate**: PASS → proceed to step 6. FAIL → fix → re-verify (max 3 rounds)
6. **Dispatch code-reviewer subagent** using `requesting-code-review` skill — independent review of per-task changes:
   - Scope: `git diff HEAD~1..HEAD` (this task's commit)
   - Checks: code structure, test quality, scenario coverage, fault tolerance, DFX constraints
   - **Gate**: PASS → proceed to step 7. FAIL → fix → re-dispatch (max 3 rounds)
7. Run `code-compliance-check` skill (KB semantic check → lint auto-fix). Violations block commit. On pass, writes `compliance-cache.json` so `spec-commit` Step 0 can skip re-checking already-verified documents.
8. Commit following `spec-commit` (AI tag, structured message, no `git add -A`)
9. Mark as completed

After 3 FAIL rounds on any gate: `AskUserQuestion` for human intervention.

### Step 3: Complete Execution

After all tasks complete:
1. Record T_FIRST_COMPLETE time-stat (see Time-Stats Logging above)
2. **Dispatch final code-reviewer subagent** using `./skills/subagent-driven-development/agents/final-code-reviewer-prompt.md` — cross-task review of the entire implementation (scope: `git diff <plan-start-commit>..HEAD`)
3. **Run full test suite**: `pytest tests/ -v` (Python) or `go test ./... -v` (Go); API tests if applicable
4. **REQUIRED SUB-SKILL:** Use finishing-a-development-branch

## When to Stop and Ask for Help

**STOP executing immediately when:**
- Hit a blocker (missing dependency, test fails, instruction unclear)
- Plan has critical gaps preventing starting
- You don't understand an instruction
- Verification fails repeatedly

**Ask for clarification rather than guessing.**

## Integration

**Required workflow skills:**
- **using-git-worktrees** - REQUIRED: Set up isolated workspace before starting
- **writing-plans** - Creates the plan this skill executes
- **verification-before-completion** - REQUIRED: Evidence before claiming task complete
- **requesting-code-review** - Per-task code review via code-reviewer agent
- **finishing-a-development-branch** - Complete development after verification

## Domain Skills (Dynamic Selection)

**Use the skills discovered in Step 1 (Domain Skill map), not a hardcoded list.**

When executing task steps:
- Steps with an inline skill reference (`> **调用 \`[skill-name]\`**`) → **invoke that skill immediately**
- Steps that involve writing tests but have no inline reference → invoke the mapped 测试方法 skill (fallback: `test-driven-development`)
- Steps that involve generating test code → invoke mapped 单测编写 skill (fallback: `test-code-generator`)
- Steps where you hit a blocker, test unexpectedly fails, or behavior is unclear → invoke mapped 排障调试 skill (fallback: `systematic-debugging`)
- Steps that write implementation code → invoke mapped 代码编写 skill for compliance check (fallback: `code-compliance-check`)

**Fallback defaults** (used when no matching skill found in session or plan):

| Category | Fallback Skill |
|---|---|
| 测试方法 | `test-driven-development` (MANDATORY for all features) |
| 单测编写 | `test-code-generator` |
| 排障调试 | `systematic-debugging` |
| 代码编写 | `code-compliance-check` |
