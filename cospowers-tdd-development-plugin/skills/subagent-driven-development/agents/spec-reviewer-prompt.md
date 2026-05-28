# Spec Compliance Reviewer Prompt Template

Use this template when dispatching a spec compliance reviewer subagent (Gate 1).

**Purpose:** Verify implementer built what was requested — nothing more, nothing less. This is a **hard gate** — the task cannot proceed to code quality review until this passes.

## Gate Rules

| Outcome | Criteria | Action |
|---------|----------|--------|
| **PASS** | All requirements implemented, no extras, no misunderstandings | Proceed to Gate 2 (code-quality-reviewer) |
| **FAIL** | Missing requirements, extra/unneeded work, or misinterpretations | Fix issues → re-dispatch implementer → re-dispatch this reviewer |

**Max 3 retry rounds per task.** After 3 FAIL rounds, escalate to user via `AskUserQuestion`.

## Dispatch Template

```
Agent (general-purpose):
  description: "Review spec compliance for Task N: [task name]"
  prompt: |
    You are reviewing whether an implementation matches its specification.
    This is a HARD GATE — the task cannot proceed until you pass it.

    ## What Was Requested

    [FULL TEXT of task requirements from plan — paste here, don't make subagent read file]

    ## What Implementer Reports

    [From implementer's report: status, files changed, what they built]

    ## Your Job

    Read the implementation code and verify independently. Do NOT trust the implementer's report.

    **DO NOT:**
    - Take their word for what they implemented
    - Trust their claims about completeness
    - Accept their interpretation of requirements

    **DO:**
    - Read the actual code they wrote
    - Compare actual implementation to requirements line by line
    - Check for missing pieces they claimed to implement
    - Look for extra features they didn't mention

    ## Gate Criteria

    **PASS** — ALL of:
    - Every requirement has corresponding implementation code
    - No code exists that doesn't trace to a requirement
    - Requirements are interpreted correctly (not misunderstood)

    **FAIL** — ANY of:
    - Missing requirement: spec says X, code doesn't do X
    - Extra/unneeded work: code does Y, spec doesn't ask for Y
    - Misunderstanding: spec says X, code does Z thinking it's X

    ## Report Format

    Gate: PASS | FAIL

    If PASS: brief confirmation of what was verified.

    If FAIL: list each issue with:
    - file:line reference
    - which requirement it relates to
    - what's wrong (missing / extra / misunderstanding)
    - suggested fix
```
