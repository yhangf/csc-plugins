# Doc Quality Evaluator (Cross-Document Consistency) Dispatch Prompt Template

Use this template when dispatching a `doc-quality-evaluator` subagent from `subsystem-design-spec`, after all individual document evaluations by `sysreq-evaluator`, `sysdesign-evaluator`, and `subsystem-evaluator` are complete.

**Purpose:** Check cross-document consistency across system requirements, system design, and subsystem design documents — verifying REQ traceability, technical solution alignment, API contracts, DFX number consistency, and subsystem boundary alignment.

**Dispatch after:** All three document types have been individually evaluated and their quality issues resolved.

```
Task tool (general-purpose):
  description: "Cross-document consistency check: [project/feature name]"
  prompt: |
    You are a cross-document consistency evaluator. Run consistency checks by following the doc-quality-evaluator skill.

    **Step 1:** Invoke the `doc-quality-evaluator` skill using the Skill tool before doing anything else.
    **Step 2:** Follow all phases exactly as the skill instructs.

    **Document paths (all required; omit a type only if it does not exist for this project):**

    系统需求文档路径:   [SYSREQ_PATH]
    系统设计文档路径:   [SYSDESIGN_PATH]
    子系统设计文档路径列表:
      - [SUBSYSTEM1_PATH]
      - [SUBSYSTEM2_PATH]

    Replace the bracketed placeholders with the actual file paths, for example:
      - docs/agent-rules/specs/2026-04-13-xxx-system-requirements.md
      - docs/agent-rules/specs/2026-04-13-xxx-system-design.md
      - docs/agent-rules/specs/2026-04-13-xxx-auth-design.md
      - docs/agent-rules/specs/2026-04-13-xxx-api-design.md

    Execute phases in order:
    - Phase 1: Receive document paths (confirm which checks will be skipped if a document type is absent)
    - Phase 2: Cross-document consistency checks (REQ traceability, technical solution alignment, API contracts, DFX numbers, subsystem boundaries)
    - Phase 3: Output consistency report

    **Return to parent agent — compact summary only:**

    ## Cross-Document Consistency Result

    **Conclusion:** ✅ pass / ❌ fail
    **REQ traceability:** [N]/[N] covered
    **Technical solution consistency:** ✅ all consistent / ❌ [m] conflicts
    **API contract consistency:** ✅ all consistent / ❌ [m] mismatches
    **DFX number consistency:** ✅ all consistent / ❌ [m] mismatches
    **Subsystem boundary consistency:** ✅ all consistent / ❌ [m] conflicts

    **Inconsistency issues (fail only):**

    | ID | Location | Inconsistency | Fix Direction |
    |----|----------|---------------|---------------|
    | ISSUE-001 | [doc / § X.X] | [what differs between documents] | [specific action to fix] |
    | ISSUE-002 | ... | ... | ... |

    **Proceed?** Yes (conclusion: pass) / No (fix required)
```

**Parent agent action based on returned result:**

| Result | Action |
|---|---|
| **pass** | Continue with the next step in the workflow |
| **fail** | Fix all listed inconsistency issues across the relevant documents; re-dispatch this subagent with the same paths; repeat until conclusion is pass |
