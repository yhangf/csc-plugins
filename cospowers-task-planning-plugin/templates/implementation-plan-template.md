# [Feature Name] Implementation Plan

> Template owned by `cospowers-task-planning`.
> **For downstream implementation:** Hand this plan to `tdd-implementation` or another execution environment. This planning plugin does not execute tasks.

**Goal:**
**Architecture:**
**Tech Stack:**

## Metadata

- Source input:
- Owner:
- Date:
- Related artifacts:
- Planning mode: System / Subsystem / Innovation

## Conventions

Record conventions learned from the target codebase before writing tasks.

| Convention | Observed pattern | Source files |
|---|---|---|
| Language/framework |  |  |
| Naming style |  |  |
| File organization |  |  |
| Import style |  |  |
| Error handling |  |  |
| Logging |  |  |
| Testing |  |  |
| API pattern |  |  |
| Database/persistence |  |  |
| Comments/docs |  |  |

## Domain Skills

List local or configured skills that should inform the plan. Use `None` when no skill is available for a category.

| Category | Skill | How it applies |
|---|---|---|
| Unit test writing | None |  |
| Test execution | None |  |
| Debugging/troubleshooting | None |  |
| Code implementation | None |  |

## Files

| Path | Action | Responsibility |
|---|---|---|
|  | Create / Modify / Test |  |

## Traceability

| Source | Requirement / decision | Planned task |
|---|---|---|
|  |  |  |

## Task Graph

| Task | Depends on | Blocks | Parallelizable |
|---|---|---|---|
|  |  |  |  |

## Implementation Tasks

### Task 1: [Task Name]

**Source:**

**Files**

| Create | Modify | Test |
|---|---|---|
|  |  |  |

**Test Cases**

| TC-ID | Source | Type | Preconditions | Assertions | Automation | Target file | Command |
|---|---|---|---|---|---|---|---|
|  |  | Normal / Boundary / Exception |  |  | Unit / Integration / Manual |  |  |

**Steps**

- [ ] Write the failing test.
- [ ] Run the focused test and confirm it fails for the expected reason.
- [ ] Implement the minimum code needed to pass.
- [ ] Run the focused test and confirm it passes.
- [ ] Refactor only if needed, then rerun the focused test.

**Validation**

```bash
# focused validation command
```

Expected result:

**Commit**

```bash
git add <files>
git commit -m "<message>"
```

## Risks / Gaps

-

## Acceptance Criteria

-

## Plan Quality Gate

- Evaluator skill: `plan-evaluator`
- Dispatch template: `skills/plan-evaluator/agents/evaluator-dispatch-prompt.md`
- Report path: `docs/plans/<...>/quality-reports/YYYY-MM-DD-plan-quality-report.md`
- Required grade before downstream handoff: A or B (score >= 80)

## Downstream Handoff

- Recommended downstream plugin: `cospowers-tdd-development-plugin` / `tdd-implementation`
- Implementation plan: `docs/plans/<filename>.md`
- Plan quality report: `docs/plans/<...>/quality-reports/YYYY-MM-DD-plan-quality-report.md`
- Task graph, if generated: `docs/plans/task-graph.md`
- Test strategy or test cases, if available: `docs/tests/`
- Execution strategy recommendation:
- This plugin has not executed code or tests.
