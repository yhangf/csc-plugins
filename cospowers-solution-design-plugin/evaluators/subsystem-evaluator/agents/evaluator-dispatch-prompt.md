# Subsystem Evaluator Dispatch Prompt Template

Use this template when dispatching a `subsystem-evaluator` subagent from `subsystem-design-spec` after each subsystem design document is written.

**Purpose:** Run an automated quality evaluation of a single subsystem design document (`*-<subsystem>-design.md`) **in an isolated context**. The subagent executes Phase 0, Phase 1, Phase 3, and Phase 4 (rule loading, item-by-item scanning, scoring, report generation) without filling the main conversation context with hundreds of per-rule check lines.

> Phase 2 (cross-document consistency) is not executed by this skill — use `doc-quality-evaluator` for full cross-document evaluation.

**Dispatch after:** The subsystem design document is written to `docs/agent-rules/specs/` and the subagent reviewer step is complete.

```
Agent:
  subagent_type: "general-purpose"
  description: "Subsystem design quality evaluation: [subsystem name]"
  prompt: |
    You are a subsystem design document quality evaluator. Run a full quality evaluation by following the subsystem-evaluator skill.

    **Step 1:** Invoke the `subsystem-evaluator` skill using the Skill tool before doing anything else.
    **Step 2:** Follow all evaluation phases exactly as the skill instructs.

    **Document to evaluate:** [DOC_PATH]
    Replace [DOC_PATH] with the actual subsystem design document path, for example:
      - docs/agent-rules/specs/2026-04-13-xxx-<subsystem>-design.md
    If the path is not yet known, omit this field and let the skill auto-discover.

    Complete all phases:
    - Phase 0: Load the subsystem design document and all relevant evaluation rule files
    - Phase 1: Item-by-item rule scanning (output each check result in real time)
    - Phase 3: Weighted scoring with full deduction breakdown
    - Phase 4: Save quality report to quality-reports/

    **Return to parent agent — compact summary only (do NOT dump the full report):**

    ## Subsystem Design Quality Evaluation Result

    **Document:** [subsystem design file name]
    **Grade:** [A/B/C/D/F] — [score]/100
    **Report saved:** [path/to/quality-reports/YYYY-MM-DD-xxx-<subsystem>-quality-report.md]
    **Red line status:** R1 [✅/❌] | R2 [✅/❌] | R3 [✅/❌]

    **Issues requiring fixes (Critical + Error only, ordered by severity):**

    | ID | Location | Issue | Fix Direction |
    |----|----------|-------|---------------|
    | ISSUE-001 | § X.X [section name] | [what is wrong] | [specific action to fix] |
    | ISSUE-002 | ... | ... | ... |

    **Warning-level issues (advisory):**
    - ISSUE-XXX: [brief description]

    **Proceed?** Yes (grade B or above, ≥ 80) / No (fix required)
```

**Parent agent action based on returned result:**

| Grade | Action |
|---|---|
| **A or B (≥ 80)** | Apply any Warning-level fixes if straightforward; continue to next subsystem design or proceed to `writing-plans` |
| **C (65–79)** | Apply all Error+ fixes from the issues table; re-dispatch this subagent with the updated document path; repeat until grade B or above |
| **D (< 65) or F** | Major rework needed — return to `subsystem-design-spec` and fix root issues before re-dispatching |

**Re-dispatch on C/D/F:** use the same prompt template with the same document path. The skill will re-evaluate from scratch and produce a fresh score. Iterate until grade B or above.
