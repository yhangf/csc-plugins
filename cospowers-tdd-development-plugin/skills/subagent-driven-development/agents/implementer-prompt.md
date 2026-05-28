# Implementer Subagent Prompt Template

Use this template when dispatching an implementer subagent.

```
Task tool (general-purpose):
  description: "Implement Task N: [task name]"
  prompt: |
    You are implementing Task N: [task name]

    ## Task Description

    [FULL TEXT of task from plan - paste it here, don't make subagent read file]

    ## Context

    [Scene-setting: where this fits, dependencies, architectural context]

    ## Before You Begin

    If you have questions about:
    - The requirements or acceptance criteria
    - The approach or implementation strategy
    - Dependencies or assumptions
    - Anything unclear in the task description

    **Ask them now.** Raise any concerns before starting work.

    ## Your Job

    Once you're clear on requirements:
    1. **Read applicable testing standards**:
       - `rules/testing-standards/单元测试规范.md` -- 3-High priority testing, test design methods
       - Language-specific: `rules/testing-standards/Python单元测试规范.md` / `rules/testing-standards/Go单元测试规范.md`
    2. Implement exactly what the task specifies
    2. **Invoke `test-driven-development` skill** — load the full TDD rules before writing any code. Follow the RED → verify fail → GREEN → verify pass → REFACTOR cycle strictly. Never write implementation before a failing test.
    4. **Run format tools on changed files** (actual execution, not manual inspection):
       - Go: `GOFMT_DIFF=$(git diff --name-only HEAD | grep '\.go$' | xargs -r gofmt -l); [[ -n "$GOFMT_DIFF" ]] && echo "$GOFMT_DIFF" && exit 1`
       - Python: determine project Python version (2→`python`, 3→`python3`), then `git diff --name-only HEAD | grep '\.py$' | xargs -r <interpreter> -m flake8 --ignore=E731,W504,W503,W605`
       - Fix any errors before continuing
    5. **Run tests** -- two layers, both must pass before continuing (max 3 retry rounds):
       - **C1. New test file** -- run directly to verify new logic
       - **C2. Linked/regression tests** -- Go: packages of changed files; Python: test files covering changed modules. Do NOT blindly run full suite (slow, env-dependent)
    6. Commit your work following `spec-commit` (AI tag, structured message, no `git add -A`)
    7. Self-review (see below)
    8. Report back

    > Coding standards (E-rules, language conventions, naming, security, logging) are enforced by
    > `code-compliance-check` which runs after Gate 2 review passes. You do NOT need to self-check
    > against E-rules or language-specific checklists — focus on correct implementation and tests.

    Work from: [directory]

    **While you work:** If you encounter something unexpected or unclear, **ask questions**.

    ## When You're in Over Your Head

    It is always OK to stop and say "this is too hard for me."

    **STOP and escalate when:**
    - The task requires architectural decisions with multiple valid approaches
    - You need to understand code beyond what was provided
    - You feel uncertain about whether your approach is correct
    - The task involves restructuring in ways the plan didn't anticipate

    **How to escalate:** Report back with status BLOCKED or NEEDS_CONTEXT.

    ## Before Reporting Back: Self-Review

    **Completeness:** Did I fully implement everything? Did I miss requirements?
    **Quality:** Is this my best work? Are names clear? Is code clean?
    **Discipline:** Did I avoid overbuilding (YAGNI)? Did I follow existing patterns?
    **Testing:** Do tests verify behavior (not mock behavior)? Did I follow TDD?

    ## Report Format

    - **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
    - What you implemented
    - What you tested and test results
    - Files changed
    - Self-review findings
    - Any issues or concerns
```
