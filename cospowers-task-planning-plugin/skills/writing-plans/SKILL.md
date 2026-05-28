---
name: writing-plans
description: Use when you have a spec or requirements for a multi-step task, before touching code
---

# Writing Plans

## Skill 标识

- Skill name: `writing-plans`
- Plugin: `cospowers-task-planning`
- Scope: Independent split plugin package `cospowers-task-planning-plugin`
- Entry skill: `task-planning`


**Skill 标识**: `writing-plans`

其他 skill 通过 `writing-plans` 引用本 skill。

## Overview

Write comprehensive implementation plans assuming the engineer has zero context for our codebase and questionable taste. Document everything they need to know: which files to touch for each task, code, testing, docs they might need to check, how to test it. Give them the whole plan as bite-sized tasks. DRY. YAGNI. TDD. Frequent commits.

Assume they are a skilled developer, but know almost nothing about our toolset or problem domain. Assume they don't know good test design very well.

**Announce at start:** "I'm using the writing-plans skill to create the implementation plan."

**Context:** This can run from the independent task-planning plugin using an issue, design summary, or standard handoff document.

**Save plans to:**
- **System mode** (single plan): `docs/plans/YYYY-MM-DD-<feature-name>.md`
- **Subsystem mode** (one plan per service): `docs/plans/YYYY-MM-DD-<project>/<feature-name>-<service-name>-plan.md`
- (User preferences for plan location override this default)

**Team Phase Workflow:** In end-to-end team projects, writing-plans receives input from the design phase. Two entry points exist:

- **From `design-spec`**: Input is the system-level design document. Plan covers system-wide architecture implementation.
- **From `subsystem-design-spec`**: Input is per-subsystem design document(s). Plan covers per-service implementation with service-level task splitting.

### Source Detection and Input Loading

Before writing the plan, detect which design phase produced the input:

1. Scan standard handoff locations such as `docs/design/` for subsystem design documents (`subsystem-*-design.md` or a dated subsystem design directory). If found, you are in **subsystem mode**.
2. Otherwise, scan `docs/design/system-design.md` and related design handoff files; if found, you are in **system mode**.
3. If neither directory exists: ask the user to provide the design document path directly. Do NOT proceed until a valid path is confirmed.

### Subsystem Mode: Service-Aware Task Splitting

When input comes from subsystem design, the plan must be split by service. Follow this procedure:

**Step A: Load subsystem design documents.** For each subsystem design document under `docs/design/`:

- Read `index.md` — identify subsystem name, responsibilities overview, code repo, and chapter TOC
- Read `01-design-specification.md` — extract subsystem responsibilities, module boundaries, and code repository paths (from init template §1)
- Read `02-external-interfaces.md` — extract API interfaces this subsystem owns (from OpenAPI refs) and external dependencies (DEP-XXX)

**Step B: Load and verify the OpenAPI spec.** Read `docs/design/openapi.yaml` or another OpenAPI handoff file explicitly provided by the user. Extract:

- All endpoint definitions (method, path, request/response schemas) for each subsystem
- Error code definitions that implementation must handle
- Type constraints and validation rules for request validation

**⛔ HARD GATE — Step B check: OpenAPI must be valid before writing ANY plan.**

| Check | How to Verify | Blocking? |
|-------|---------------|-----------|
| File exists | Verify the exact OpenAPI handoff path, normally `docs/design/openapi.yaml` | **YES** — STOP if missing |
| Valid YAML | Parse the file; confirm it loads without error | **YES** — STOP if invalid |
| Has endpoints | At least one `paths:` entry with a method defined | **YES** — STOP if empty |

**If any check fails: DO NOT proceed.** Tell the user:

> "OpenAPI 规范文件缺失或无效：`docs/design/openapi.yaml`
> [具体问题]
> 请回到 `design-spec` 修正 OpenAPI 后再调用 `writing-plans`。"

Present a pass summary before continuing:

```
🔍 OpenAPI 就绪检查
✅ 文件存在: docs/design/openapi.yaml
✅ YAML 合法
✅ 包含 N 个端点
```

**Step C: Discover local service code.** For each subsystem, check if service code exists locally:

- Read `01-design-specification.md` for code repository paths (from the subsystem init template §1)
- For each repo path listed, verify the directory exists on disk (`ls` or `Glob`)
- If code exists: read representative files (entry point, router, existing API handlers, models) to understand existing patterns — the plan must extend existing code, not rewrite
- If code does NOT exist: plan starts from scaffold; note that the engineer must create the project first

**Step D: Split tasks by service — one plan file per service.** Each service gets its own plan document. Create a parent `index.md` listing all service plans, then write each service plan as a separate file.

**Parent index:** `docs/plans/YYYY-MM-DD-<project>/index.md`

```markdown
# <Project> Implementation Plans

> **For downstream implementation:** Hand this task package to the TDD Development plugin (`tdd-implementation`) or another execution environment. This planning plugin does not execute tasks.

**Source:** subsystem design handoff → `docs/design/`
**OpenAPI:** `docs/design/openapi.yaml`

## Service Plans

| Service | Plan File | Code Status |
|---------|-----------|-------------|
| <service-1> | [<feature-name>-<service-1>-plan.md](<feature-name>-<service-1>-plan.md) | ✅ existing / ❌ new |
| <service-2> | [<feature-name>-<service-2>-plan.md](<feature-name>-<service-2>-plan.md) | ✅ existing / ❌ new |
```

**Per-service plan:** `docs/plans/YYYY-MM-DD-<project>/<feature-name>-<service-name>-plan.md`

Each service plan starts with its own header and follows the standard plan structure:

```markdown
# [Service Name] Implementation Plan

> **For downstream implementation:** Hand this service task package to `tdd-implementation` or another execution environment. This planning plugin does not execute tasks.

**Goal:** [What this service implements]

**Code:** <repo-path>  ✅ existing / ❌ new service

**APIs owned:** [list endpoints from OpenAPI spec this service implements]

**Dependencies:** DEP-XXX: <service> — <purpose>

---
## Conventions
...

### Task 1: ...
```

Each service plan is self-contained — one service's tasks do not depend on another service's implementation (only on API contracts defined in the OpenAPI spec).

**Step E: Cross-service integration tasks.** After all service groups, add integration tasks for:

- End-to-end flow validation across services
- Contract testing against the OpenAPI spec
- Deployment coordination (if multiple services deploy together)

### System Mode: Standard Plan

When input comes from system-level design, the plan follows the standard structure below (no per-service splitting required). Ensure every requirement from the design task book has corresponding implementation tasks.

## Codebase Style Analysis (MUST Do Before Writing Plan)

Before writing any implementation task, you MUST analyze the current project's code style and conventions. The plan's code examples must match the existing codebase — not your default style preferences.

### Step 1: Identify Project Language and Framework

```bash
# Check project files
ls *.py *.go *.js *.ts pyproject.toml go.mod package.json Makefile 2>/dev/null

# Check existing structure
find . -maxdepth 3 -type f -name "*.py" -o -name "*.go" -o -name "*.js" | head -20
```

### Step 2: Learn Code Conventions

Read 3-5 representative files from the project to learn:

| Convention | What to Look For | Example |
|---|---|---|
| **Naming** | snake_case vs camelCase, prefix patterns, abbreviation style | `get_user_info()` vs `getUserInfo()` |
| **File organization** | One class per file? Module structure? Barrel exports? | `models/user.py` vs `models.py` |
| **Import style** | Absolute vs relative, grouping, order | `from app.models import User` vs `from .models import User` |
| **Error handling** | Custom exceptions? Error codes? Result types? | `raise ServiceError(code=...)` vs `return None` |
| **Logging** | Logger pattern, format, levels | `logger = logging.getLogger(__name__)` |
| **Testing** | Framework, fixture patterns, mock approach, file naming | `test_*.py` vs `*_test.go`, pytest vs unittest |
| **API patterns** | Router registration, serialization, middleware | Django views vs FastAPI routes |
| **Database** | ORM vs raw SQL, migration framework, model definition | SQLAlchemy vs Django ORM vs GORM |
| **Configuration** | env vars, config files, settings pattern | `settings.py` vs `config.yaml` |
| **Comments/Docstrings** | Style, language (Chinese/English), detail level | Google-style vs Sphinx vs no docstrings |

### Step 3: Check for Project-Specific Standards

```bash
# Check if project has its own coding standards
ls .editorconfig .pylintrc .flake8 .golangci.yml .eslintrc* pyproject.toml 2>/dev/null
cat pyproject.toml 2>/dev/null | head -30  # Check tool configs
```

Also check `doc/kb/` or project README for any documented conventions.

### Step 4: Document Conventions in Plan Header

Add a **Conventions** section to the plan header:

```markdown
**Conventions (learned from codebase):**
- Language: Python 3, Django 4.x
- Naming: snake_case for functions/variables, PascalCase for classes
- Imports: absolute imports, grouped (stdlib → third-party → local)
- Error handling: custom ServiceError with error codes
- Testing: pytest, fixtures in conftest.py, mock with unittest.mock
- Logging: structlog, logger per module
- API: Django REST Framework, ViewSet pattern
- DB: Django ORM, migrations via manage.py
```

**All code examples in the plan MUST follow these conventions.** Do not write Go-style code in a Python project, do not use camelCase in a snake_case codebase, do not use raw SQL in an ORM project.

## Domain Skill Discovery (MUST Do Before Writing Tasks)

After analyzing codebase conventions, scan the current session's loaded skills (from the system-reminder skill list) and categorize any relevant ones into four groups:

| Category | Look for skills that... | Applied at |
|---|---|---|
| 单测编写 | Generate or write unit test code | Steps that write test code |
| 测试方法 | Define testing strategy or TDD cycle | All implementation task test phases |
| 排障调试 | Diagnose failures, debug errors, investigate faults | Blocker handling, failure investigation |
| 代码编写 | Enforce coding standards, generate code, check quality | All code implementation steps |

If multiple skills match one category, list all and mark the recommended one.

**Write results into the plan header as a `Domain Skills` block** (after the `Conventions` block):

```markdown
**Domain Skills (from session context):**
- 单测编写: `test-code-generator` — generate go test / pytest code from test docs (recommended)
- 测试方法: `test-driven-development` — TDD red-green cycle, write failing test first
- 排障调试: `systematic-debugging` — evidence-first fault investigation
- 代码编写: `code-compliance-check` — coding standards check + lint auto-fix
- (If no skill found for a category, write: "None — use default approach")
```

**When writing each task's steps**, at steps where a domain skill applies, add an inline reference immediately after the step description:

```markdown
- [ ] **Step 1: Write the failing test**

  > **调用 `test-driven-development`** 执行 RED 阶段 — 先写失败测试，确认测试因"功能未实现"而失败，而非语法错误

- [ ] **Step 3: Write minimal implementation**

  > **调用 `code-compliance-check`** 检查代码规范
```

The inline reference format is: `> **调用 \`[skill-name]\`** [purpose in this specific step]`

## Test Case Closure (HARD GATE)

Every implementation task MUST carry its own executable test-case design before any code steps.

For each task, add a `Test Cases` section before the checkbox steps. It must include:
- Test case ID(s) traced to the source design or requirement (`TC-XXX`, `REQ-XXX`, design section, or API path)
- Scenario type: normal, boundary, exception, regression, contract, or E2E
- Preconditions and test data/input
- Expected result and meaningful assertions
- Automation level: unit, integration, API/contract, E2E, or manual with reason
- Exact test file/function name to create or modify
- Exact command to run and expected RED/GREEN result

**No task may be implementation-only.** If a code change truly cannot be automated, the task must state why, provide a manual verification case, and still include regression coverage where possible.

These are plan failures and must be fixed before handoff:
- A task has implementation steps but no `Test Cases` section
- A test case says only "verify it works" or "write tests"
- Test steps lack input, expected result, assertions, or command
- A source design test case is not mapped to any implementation task

## Scope Check

If the spec covers multiple independent subsystems, suggest breaking this into separate plans -- one per subsystem. Each plan should produce working, testable software on its own.

## File Structure

Before defining tasks, map out which files will be created or modified and what each one is responsible for. This is where decomposition decisions get locked in.

- Design units with clear boundaries and well-defined interfaces. Each file should have one clear responsibility.
- You reason best about code you can hold in context at once, and your edits are more reliable when files are focused. Prefer smaller, focused files over large ones that do too much.
- Files that change together should live together. Split by responsibility, not by technical layer.
- In existing codebases, follow established patterns. If the codebase uses large files, don't unilaterally restructure - but if a file you're modifying has grown unwieldy, including a split in the plan is reasonable.

This structure informs the task decomposition. Each task should produce self-contained changes that make sense independently.

## Bite-Sized Task Granularity

**Each step is one action (2-5 minutes):**
- "Write the failing test" - step
- "Run it to make sure it fails" - step
- "Implement the minimal code to make the test pass" - step
- "Run the tests and make sure they pass" - step
- "Commit" - step

## Plan Document Header

**Every plan MUST start with this header:**

```markdown
# [Feature Name] Implementation Plan

> **For downstream implementation:** Hand this service task package to `tdd-implementation` or another execution environment. This planning plugin does not execute tasks. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** [One sentence describing what this builds]

**Architecture:** [2-3 sentences about approach]

**Tech Stack:** [Key technologies/libraries]

**Conventions (learned from codebase):**
- Language: [e.g., Python 3, Django 4.x]
- Naming: [e.g., snake_case for functions, PascalCase for classes]
- Testing: [e.g., pytest, fixtures in conftest.py]
- ...

**Domain Skills (from session context):**
- 单测编写: `[skill-name]` — [purpose] (or "None — use default approach")
- 测试方法: `[skill-name]` — [purpose]
- 排障调试: `[skill-name]` — [purpose]
- 代码编写: `[skill-name]` — [purpose]

---
```

## Task Structure

````markdown
### Task N: [Component Name]

**Files:**
- Create: `exact/path/to/file.py`
- Modify: `exact/path/to/existing.py:123-145`
- Test: `tests/exact/path/to/test.py`

**Test Cases:**

| ID | Source | Type | Preconditions/Input | Expected Assertions | Automation | Test Target | Command |
|---|---|---|---|---|---|---|---|
| TC-001 | REQ-001 / §3.2 | normal | `input = ...` | return value equals ...; side effect ... | unit | `tests/path/test_file.py::test_specific_behavior` | `pytest tests/path/test_file.py::test_specific_behavior -v` |
| TC-002 | §5.3 ET-001 | exception | invalid `input = ...` | raises `ValidationError`; no data persisted | unit | `tests/path/test_file.py::test_rejects_invalid_input` | `pytest tests/path/test_file.py::test_rejects_invalid_input -v` |

- [ ] **Step 1: Write the failing test for TC-001**

```python
def test_specific_behavior():
    result = function(input)
    assert result == expected
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests/path/test.py::test_name -v`
Expected: FAIL with "function not defined"

- [ ] **Step 3: Write minimal implementation**

```python
def function(input):
    return expected
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest tests/path/test.py::test_name -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/path/test.py src/path/file.py
git commit -m "feat: add specific feature"
```
````

## No Placeholders

Every step must contain the actual content an engineer needs. These are **plan failures** -- never write them:
- "TBD", "TODO", "implement later", "fill in details"
- "Add appropriate error handling" / "add validation" / "handle edge cases"
- "Write tests for the above" (without actual test code)
- "Similar to Task N" (repeat the code -- the engineer may be reading tasks out of order)
- Steps that describe what to do without showing how (code blocks required for code steps)
- References to types, functions, or methods not defined in any task

## Remember
- Exact file paths always
- Complete code in every step -- if a step changes code, show the code
- Exact commands with expected output
- DRY, YAGNI, TDD, frequent commits

## Self-Review

After writing the complete plan, look at the spec with fresh eyes and check the plan against it.

**1. Spec coverage:** Skim each section/requirement in the spec. Can you point to a task that implements it? List any gaps.

**2. Test-case coverage:** Skim every design/requirement test case. Can you point to a task `Test Cases` row and a checkbox step that implements it? Verify every implementation task has normal behavior coverage plus boundary/exception/regression cases where applicable. Add missing cases before handoff.

**3. Placeholder scan:** Search your plan for red flags -- any of the patterns from the "No Placeholders" section above. Fix them.

**4. Type consistency:** Do the types, method signatures, and property names you used in later tasks match what you defined in earlier tasks? A function called `clearLayers()` in Task 3 but `clearFullLayers()` in Task 7 is a bug.

**5. Convention consistency:** Do ALL code examples follow the conventions documented in the plan header? Check naming style, import style, error handling pattern, test framework usage. Code that doesn't match the existing codebase will cause friction during execution.

If you find issues, fix them inline. No need to re-review -- just fix and move on. If you find a spec requirement with no task, add the task.

## Execution Handoff

This split plugin stops at planning. It must not invoke `/goal`, `subagent-driven-development`, or `executing-plans` directly.

At the end of the plan, add a handoff block:

```markdown
## Downstream Handoff

Recommended next plugin: `cospowers-tdd-development-plugin` / `tdd-implementation`

Inputs to provide:
- This implementation plan: `docs/plans/<filename>.md`
- Task graph, if generated: `docs/plans/task-graph.md`
- Test strategy or test cases, if available: `docs/tests/`

Execution strategy recommendation:
- Subagent-driven execution for independent tasks, or
- Inline execution for tightly coupled tasks or small changes.

This planning plugin has not executed code or tests.
```
