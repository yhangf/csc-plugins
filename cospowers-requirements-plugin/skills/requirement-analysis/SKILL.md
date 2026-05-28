---
name: requirement-analysis
description: Use when user provides raw product requirements that need structuring into AI requirements (Epic/Feature/Story format) - typically for enterprise/multi-service projects requiring formal requirement documents
---

# Requirement Analysis

## Skill 标识

- Skill name: `requirement-analysis`
- Plugin: `cospowers-requirements`
- Scope: Independent split plugin package `cospowers-requirements-plugin`
- Entry skill: `requirements-intake`


**Skill 标识**: `requirement-analysis`

其他 skill 通过 `requirement-analysis` 引用本 skill。

## Overview

Transform raw product requirements into structured, traceable AI requirement documents following the Epic -> Feature -> Story hierarchy. This skill bridges the gap between informal user needs and formal development inputs.

**Core principle:** User-centric language, testable acceptance criteria, complete traceability from business value to user stories.

## Extension Points

Before starting, read `cospowers.config.json` from the plugin root (2 levels above this skill's base directory — the directory shown in "Base directory for this skill" at skill load time). No fallback needed — the config always has valid defaults.

| Config field | Used for |
|---|---|
| `config.env.SPEC_DEVELOPER_SERVER_URL` | Remote KB server URL for knowledge discovery |
| `config.kb.skill` | KB skill to invoke (null = use kb-query auto-detection) |
| `config.kb.localPath` | Local KB directory for file-based lookup |
| `config.templates["ai-requirement"]` | Output template file path for the TR1 用户需求规格说明书 (default: `templates/user-requirement-template.md`) |
| `config.templates["user-requirement"]` | Input schema reference: TR1 用户需求规格说明书 template — use to parse when input documents match this structure |
| `config.evaluators["aireq"]` | Evaluator skill name dispatched at step 13; `false` = skip gate |

## When to Use

- User provides raw feature descriptions, PRDs, or verbal requirements
- Enterprise or multi-service projects requiring formal requirement documents
- User explicitly asks for requirement decomposition or analysis
- Starting the end-to-end team project workflow (before system-requirement-analysis)

**Don't use when:**
- Requirements are already structured (skip to system-requirement-analysis or requirements-intake)
- Innovation/prototype projects (use requirements-intake directly and produce requirement handoff artifacts)
- Simple single-function tasks

## Checklist

You MUST create a task for each of these items and complete them in order:

1. **⛔ GATE — Collect background intelligence via init template** -- **Do NOT proceed to step 2 until this step is complete.**

   **Init template section → analysis step mapping：**

   | Section | What to extract | Fed into |
   |---|---|---|
   | §1 原始需求描述 | Core feature/business value description | Step 5: primary requirement source |
   | §2 目标用户画像 | User role names | Step 9: Epic/Feature/Story 角色填写 |
   | §3 关键业务场景 | Key usage scenarios per role | Step 9: Feature/Story 场景说明 |
   | §4 历史版本文档 | File paths of previous requirement docs | Step 5: change diff (new/modified/deprecated) |
   | §5 竞品或参考资料 | Reference materials | Step 8: supplementary materials grading |
   | §6 领域术语约定 | Domain term definitions | Step 9: consistent naming across E/F/S |
   | §7 约束与不做的事 | Out-of-scope items, constraints | Step 6: clarification baseline; Step 9: scope discipline |

   - **If running within a role context** (`ai_requirement_analyst` or `ainative_ai_requirement_analyst`): check for pre-installed file at `docs/agent-rules/1-ai-requirements/input/init-aireq-template.md`.
     - **If file does not exist**: write the template (read `templates/init-aireq-template.md` from skill base directory, pre-fill project name if mentioned) to `docs/agent-rules/1-ai-requirements/input/init-aireq-template.md`, then tell the user:
       > "我已将 AI 需求背景情报简报写入 `docs/agent-rules/1-ai-requirements/input/init-aireq-template.md`，请在 IDE 中打开填写。**§1 原始需求描述** 和 **§2 目标用户画像** 为必填，其余按需填写。填写完成后告知我。"
       Wait for confirmation, then re-read and apply the mapping table.
     - **If file exists but still has placeholders** (`*(在这里...)*`): tell the user to complete §1 and §2 at minimum, then wait.
     - **If file is filled**: apply the mapping table above.
   - **If user provides a file path or attaches a document** (XMind, PRD, any format): copy it to `docs/agent-rules/1-ai-requirements/input/` automatically. Treat as primary input, skip init template.
   - **If no role context and user provides content inline**: use directly, skip init template.
   - **Architecture diagrams (§5 of init template)**: extract component/module names and add as search terms in step 2.

2. **Query product knowledge base** -- if your project has a product knowledge base tool (e.g., `kb-query`), invoke it to understand existing system boundaries and business flows (see "Knowledge Base Discovery" section below). If no knowledge base tool is configured, skip this step.
3. **Explore project context** -- check existing docs, codebase, domain knowledge; invoke `daedalus-knowledge` to search for relevant team standards, coding norms, and technical guidelines (reads `SPEC_DEVELOPER_SERVER_URL` from `cospowers.config.json`; if not configured, fall back to local `rules/` files instead).
4. **Read the template** -- load the output template from `config.templates["ai-requirement"]` (default: `templates/user-requirement-template.md`) and internalize its structure (9 main chapters, QS checklist, DFX baseline, etc.). The output document MUST follow this template — it is a TR1 用户需求规格说明书. Use the Epic/Feature/Story hierarchy (see Decomposition Method) as an internal thinking framework to organize content, but write the final output into the TR1 structure.
5. **Read raw requirements** -- read all input materials from `docs/agent-rules/1-ai-requirements/input/` (or from the conversation) to form an initial understanding; do NOT start decomposing yet.

   **TR1 document detection**: When reading each input document, check if its structure matches the `user-requirement-template.md` schema internalized in Step 4 (i.e., contains sections like "详细用户需求规格", "客户验证结论", "QS-xxx" markers, etc.). If matched — the input is already a TR1 user requirements specification:
   - Map §1.1.x (root features) directly to the output TR1 §1.1.x, enhancing with any supplementary materials
   - Carry forward customer validation (§客户验证结论) and QS compliance data (文档完成自检清单)
   - Carry forward DFX baseline (§2.2), enriching with additional analysis from supplementary materials
   - Mark the source TR1 document in the output's material summary
   - For gaps between input TR1 and the full template (e.g., missing DFX dimensions, incomplete QS checks), flag to the user for supplementation
6. **Clarify ambiguous requirements** -- before decomposing, resolve ambiguities one question at a time (see "Requirement Clarification" section below). Do NOT proceed until scope, assumptions, and key terms are clear.
7. **Confirm supplementary materials** -- ask the user whether additional materials exist: historical test cases, previous version designs, competitor/vendor research, or other constraints. If none, proceed directly.
8. **Load and grade materials** -- if supplementary materials exist:
   - Few (1-2 docs): load directly and proceed
   - Many (3+): classify before consuming:
     - **Authoritative**: main requirement doc, confirmed customer inputs — use as ground truth
     - **Reference**: historical designs, competitor research — use with judgment
     - **Isolated**: test cases, test tooling — extract intent only, never let structure or naming pollute requirements
   - Produce a one-line material summary before decomposition
9. **Decompose into Epic/Feature/Story** -- follow the 3-level hierarchy with user-centric language
10. **Present decomposition for review** -- show the tree structure, get user confirmation
11. **Write requirements.md** -- output the complete requirement document to `docs/agent-rules/1-ai-requirements/output/YYYY-MM-DD-<project>-requirements.md` (create the directory if it does not exist)
12. **Quick pre-flight self-check** — before dispatching the evaluator subagent, do a fast structural scan (NOT a full quality review — that's step 13's job):
    - **Epic**: all 8 required sections present and non-empty (【关键价值点】through【责任人】)
    - **Feature**: all 6 required sections present (【关联关键价值点】through【包含 Story】)
    - **Story**: 【安全需求】not blank, 【技术思路】="待开发负责人填写", 【工作量评估】="待评估", 🔴/🟡/🟢 markers present
    - **Fix any obviously missing sections inline** — don't spend time on quality nuances, leave that to the evaluator subagent
13. **Quality evaluation (Stage Gate)** — dispatch an isolated quality evaluator subagent using the skill name from `config.evaluators["aireq"]` (default: `aireq-evaluator`) via `skills/<evaluator>/agents/evaluator-dispatch-prompt.md`. Performs the full 33-item rule-by-rule scan (REQ-AI-01~33) + weighted scoring. Apply all Critical/Error fixes reported. If grade < B (< 80): present the issue list to the user, ask them to supplement context if needed, then re-run from step 9. Do NOT hand off to `system-requirement-analysis` until grade ≥ B.

    If `config.evaluators["aireq"]` is `false`, skip this gate and proceed directly to step 14.
14. **User reviews output** -- ask user to review, iterate if needed
15. **Transition** -- invoke `system-requirement-analysis` directly

## Knowledge Base Discovery

**Before querying, determine which mode applies by reading `cospowers.config.json`:**

```
1. KB lookup (supplements context, use best available source):
   - config.kb.skill set AND skill available in environment? → invoke that skill
   - else kb-query available in environment? → use kb-query
   - else config.kb.localPath exists? (default: doc/kb/) → Grep/Read local KB files
   - else docs/kb/ exists? → Grep/Read docs/kb/ files
   - else → skip KB lookup

2. code-first: always Glob + Grep + Read directly on codebase
```

**Knowledge base guides direction, code verifies truth.** Regardless of mode, always verify findings against actual code (Step C below).

**At requirement analysis stage, only query three things: product boundaries, module scope, and existing business flows. Do NOT query API details or tech stacks — those belong in later stages.**

### Step A: Product-Level Understanding (define boundaries)

| Mode | Action |
|------|--------|
| **kb-skill / kb-query** | Invoke the configured KB skill to get product overview, module count, scope |
| **local-kb** | `ls <config.kb.localPath>` → read overview/architecture files |
| **code-first** | Glob entry points (`main.go`, `app.py`, `__init__.py`); read README and top-level directory structure |

Goal: understand which layer the new requirements fall into, align Epic decomposition with existing domain boundaries.

### Step B: Module-Level Understanding (find existing business flows)

| Mode | Action |
|------|--------|
| **kb-skill / kb-query** | Query relevant modules by keyword; read business flows for affected modules |
| **local-kb** | `Grep "keyword" <config.kb.localPath>` → read matched files |
| **code-first** | Grep for domain terms in source files; read key handler/service/router files |

Key things to find per module:
- Project structure / module overview
- Architecture / component relationships
- Existing business flows (critical for requirement gap analysis)

**Do NOT query at this stage**: API details, troubleshooting docs, tech stacks (save for later stages).

### Step C: Code Verification

Always verify against actual code regardless of mode:

1. Use **Glob** to find files mentioned in knowledge base or README
2. Use **Grep** to search for key functions, classes, interface definitions
3. Use **Read** to verify knowledge base descriptions are accurate
4. **When knowledge base and code disagree, code is authoritative** — update your understanding accordingly

### Using Results

- **Architecture understanding** informs Epic/Feature decomposition — align with existing subsystem boundaries
- **Module knowledge** identifies which features already exist (avoid re-specifying)
- **Business flows** reveal gaps between current state and desired state (focus requirements on the delta)

## Requirement Clarification

Before decomposing requirements, resolve all ambiguities. **Do NOT start Epic/Feature/Story decomposition until scope, key terms, and assumptions are clear.**

### Rules

- **One question at a time** — do not ask multiple questions in one message
- **Prefer multiple choice** — easier to answer than open-ended when possible
- **Stop when clear** — once you can answer "what does this do, who uses it, and what is out of scope", proceed

### What to Clarify

**Scope boundaries** — confirm what is included and explicitly what is NOT:
> "Does this requirement include X, or is that out of scope for this iteration?"

**Ambiguous terms** — surface terms that could mean different things:
> "When you say '用户', do you mean end users, administrators, or both?"

**Hidden assumptions** — make implicit assumptions explicit before they become design decisions:
> "I'm assuming this replaces the existing Y flow rather than running in parallel — is that correct?"

**Multiple valid interpretations** — when a requirement can be read two ways, pick and confirm:
> "This could mean A (behavior X) or B (behavior Y) — which do you intend?"

### Anti-Patterns

- Do NOT ask about implementation details — those belong in system-requirement-analysis
- Do NOT ask about performance numbers or technical constraints — those belong in DFX
- Do NOT batch multiple questions — ask one, wait for answer, ask next

## Supplementary Materials

After reading the main requirement document, always ask the user before starting decomposition:

> "Besides the main requirement document, do you have any of the following?
> - Historical test cases (helps identify existing acceptance scenarios)
> - Previous version design or requirement docs (helps distinguish incremental vs. new features)
> - Competitor or vendor research (helps define scenario boundaries and differentiators)
> - Other constraints or confirmed agreements not in the document"

**If no supplementary materials**: proceed directly to decomposition.

**If few materials (1-2 docs)**: load and read them, use alongside the main document.

**If many materials (3+)**: classify before consuming. Do not treat all documents equally.

| Grade | Typical Sources | How to Use |
|-------|----------------|------------|
| **Authoritative** | Main requirement doc, signed-off customer inputs | Ground truth — use directly |
| **Reference** | Historical designs, competitor analysis, research docs | Use with architect judgment, filter before applying |
| **Isolated** | Test cases, test tooling, test-specific naming | Extract user intent only — never let naming or structure pollute requirement design |

**Isolation rule for test cases**: test case titles describe user intent in natural language — useful for expanding acceptance criteria. But test infrastructure, naming conventions, and implementation assumptions must not enter the main requirement structure.

Produce a one-line **Material Summary** at the top of the requirements doc:
```
Input: [main doc name] (authoritative) + [X historical test cases] (intent reference) + [Y competitor docs] (reference)
```

## Decomposition Method

> **Note**: The Epic → Feature → Story hierarchy below is an **internal thinking framework** to organize analysis. The actual output document follows the TR1 用户需求规格说明书 structure (see Output Template section). Use this decomposition to identify and structure content, then populate the corresponding TR1 sections (§1.1.x 根特性 → feature → requirement ID).

### 3-Level Hierarchy

```
Epic (Business Theme / Product Module)
  -> Feature (Complete User Value Functional Scenario)
    -> Story (Specific User Operation)
```

| Level | Definition | Focus | Acceptance Perspective |
|-------|-----------|-------|----------------------|
| **Epic** | Business theme / product module | Business value | Market value delivery |
| **Feature** | Complete functional scenario | User scenario | Feature set completeness |
| **Story** | Specific user operation | User behavior | User acceptance |

### Story Writing Rules

Each Story must follow:

**User Story Format:**
```
As a <user role>, I want <function/behavior>, so that <value achieved>
```

- Must be from external user perspective, not internal system role
- Use business language, non-technical people should understand
- Each Story should be independently testable

### Simplified Acceptance Criteria (A/C)

Each Story requires:

**Normal scenario** (required): 1-2 typical success path scenarios
- **Given**: Describe prerequisites and initial state (use business language)
- **When**: Describe specific user operation (avoid technical details)
- **Then**: Describe user-visible expected result

**Main exception scenario** (optional): Most common error or exception situations

### Quality Rules

1. Focus on core scenarios, don't require covering all boundary cases
2. Use business language, non-technical people should also understand
3. Each Story's acceptance criteria controlled to 2-4 scenarios
4. Mark items needing deeper analysis for system requirement phase

## Output Template

The output document MUST follow the TR1 用户需求规格说明书 template. Load the template from `config.templates["ai-requirement"]` (default: `templates/user-requirement-template.md`) in step 4 and internalize the full structure before writing. The document has 9 main chapters with the following key requirements:

**Chapter 1 — 详细用户需求规格** (root features with user scenario analysis):
- Each `§1.1.x 价值根特性` represents one business value domain (战场)
  - `§1.1.1 用户场景分析` — user journey, scenario modeling, pain points (quantified, with sources), value planning, competitor analysis
  - `§1.1.2 设计策略总结` — design intent/goals (quantifiable), design strategy, innovation points
  - `§1.1.3 产品主场景 Playbook` — customer pain → solution → FAB selling points
  - `§1.1.4 特性详细需求规格` — product features with Playbook, usage scenarios, constraint tables, requirement ID list (REQ-XXX with priority), key遗留问题
  - `§1.1.5 技术需求设计与评审结论` — feasibility assessment, pre-research items, risks
- `§1.3 关键质量问题改进说明` — P0/P1 quality improvements with sources
- `§1.4 跨部门协作需求` — QS-002: cross-team collaboration requirements

**客户验证结论** — QS-001: ≥3 customer validations with evidence. Include verification summary.

**协作方需求共识** — QS-002: cross-team consensus confirmation. Write "裁剪说明" if no cross-team requirements.

**质量需求** — QS-003: P0/P1 problem pool. List problems with sources (legacy/chaos engineering/customer issues), impact scope, and whether included in this version.

**Chapter 2 — 非功能性需求**:
- `§2.1 产品规格汇总` — spec changes vs previous version, hardware support, licensing
- `§2.2 DFX 需求基线` — QS-004: full DFX baseline coverage
  - Performance parameters (L0底线: Web console ≤3s for 99% of high-freq pages)
  - Reliability (SLA, fault detection, HA, dangerous operation prevention)
  - Usability (business availability metrics)
  - Compliance (QS-007: 道德合规 Checklist 4 categories)
  - Openness (standardized interfaces)
  - Compatibility (OS, browser, hardware, upgrade paths)
  - Serviceability (deliverability, maintainability)
- `§2.3 国际化支持` — QS-006: overseas baseline self-check (can be skipped if not applicable)
- `§2.4 NFV 支持` — NFV version sync status

**XAAS 客户成功相关需求** — QS-008: customer success requirements (can be skipped for non-XAAS)

**Chapter 3 — 附录** — glossary, change history

**文档完成自检清单** — mandatory self-check before submission:
- All 8 QS items checked (QS-001~008) with pass/fail and evidence links
- AI-Native format check (frontmatter with `stage: TR1`, high-density summary, no fuzzy words)

**Critical rules:**
- **NO fuzzy words**: 合理 / 适当 / 较好 / 尽量 / 性能好 / 适当考虑 — strictly forbidden
- **Customer validation ≥3** (QS-001, non-negotiable)
- **DFX baseline full coverage** (QS-004, non-negotiable); non-compliant items must have Story tracking
- **Security requirements explicitly stated** (QS-007) — "不涉及" is acceptable, blank is NOT
- **All placeholder text** `*[说明文字]*` must be replaced with actual content
- AI does NOT assign people, estimate effort, or invent technical designs — mark those as "待填写" / "待评估"

## Next Steps

After user approves the requirements document, invoke `system-requirement-analysis` directly.
