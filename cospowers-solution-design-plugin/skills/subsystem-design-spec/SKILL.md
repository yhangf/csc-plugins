---
name: subsystem-design-spec
description: Use when system design and OpenAPI spec exist and subsystem-level design documents are needed — invoked per-person, per-subsystem to produce implementation design with internal flows, data structures, exception handling, and DFX
---

# Subsystem Design Specification

## Skill 标识

- Skill name: `subsystem-design-spec`
- Plugin: `cospowers-solution-design`
- Scope: Independent split plugin package `cospowers-solution-design-plugin`
- Entry skill: `solution-design`


**Skill 标识**: `subsystem-design-spec`

其他 skill 通过 `subsystem-design-spec` 引用本 skill。

## Overview

Transform system design and API contracts into a subsystem-level implementation design document that strictly follows the template at `config.templates["subsystem-design"]` (default: `templates/subsystem-design-template.md`). **Each invocation handles ONE subsystem** — multiple subsystem owners invoke this skill independently.

**Input:** System-level design document + OpenAPI spec (produced by `design-spec`)
**Output:** One subsystem-level design document, as a directory of chapter files under the shared project output directory

**Core principle:** No empty chapters, mandatory Mermaid sequence diagrams with alt/else branches, SQL DDL for database tables, DFX coverage mandatory, API references point to OpenAPI spec (not duplicated), review-ready output.

## Extension Points

Before starting, read `cospowers.config.json` from the plugin root (2 levels above this skill's base directory — the directory shown in "Base directory for this skill" at skill load time). No fallback needed — the config always has valid defaults.

| Config field | Used for |
|---|---|
| `config.templates["subsystem-design"]` | Template file path for the subsystem design document |
| `config.rules["design-review"]` | Design review rules directory |
| `config.rules["dfx"]` | DFX rules directory |
| `config.evaluators["subsystem"]` | Evaluator skill name dispatched per subsystem (step 6); `false` = skip |
| `config.evaluators["doc-quality"]` | Evaluator skill name dispatched for last subsystem only; `false` = skip |

## When to Use

- System design + OpenAPI spec exist and YOU need to write YOUR subsystem's implementation design
- Each subsystem owner invokes this skill independently for their assigned subsystem(s)
- Following `design-spec` in the end-to-end team project workflow
- User explicitly requests subsystem design document creation

**Don't use when:**
- System design and OpenAPI spec are not yet defined (use `design-spec` first)
- Simple tasks not requiring design documents (use `solution-design` only when design artifacts are needed)

## Checklist

You MUST create a task for each of these items and complete them in order:

1. **Load system design and OpenAPI spec** — scan `docs/agent-rules/3-system-design/output/` for subdirectories with `YYYY-MM-DD-` prefix; take the newest one (sort descending).

   **1a. Load system design:** Read `index.md` to understand the project and chapter TOC. Read sub-doc 4 (软件方案) §4.2 to extract the full subsystem list. Read sub-doc 4 §4.6 for cross-subsystem interaction flows relevant to interface design.

   **1b. Load OpenAPI spec:** Read `<project>-openapi.yaml` from the same directory. Extract:
   - All endpoint definitions grouped by subsystem tag (method, path, request/response schemas)
   - Error code definitions
   - Type constraints from API schema definitions

   **⛔ HARD GATE — OpenAPI must be valid before proceeding.**

   | Check | How to Verify | Blocking? |
   |-------|---------------|-----------|
   | File exists | `ls` the path `docs/agent-rules/3-system-design/output/YYYY-MM-DD-<project>/<project>-openapi.yaml` | **YES** — STOP if missing |
   | Valid YAML | Parse; confirm it loads without error | **YES** — STOP if invalid |
   | Has endpoints | At least one `paths:` entry with a method | **YES** — STOP if empty |

   **If any check fails: DO NOT proceed.** Tell the user:

   > "OpenAPI 规范文件缺失或无效：`docs/agent-rules/3-system-design/output/YYYY-MM-DD-<project>/<project>-openapi.yaml`
   > [具体问题]
   > 请回到 `design-spec` 修正 OpenAPI 后再调用 `subsystem-design-spec`。"

   **1c. Select target subsystem:** Present the subsystem list from §2.2 to the user:

   Present the subsystem list to the user and ask which one they own:

   > "系统设计包含以下子系统（来自 §2.2）：
   > - <subsystem-1>
   > - <subsystem-2>
   > - ...
   >
   > 你负责哪个子系统的设计？"

   **Scope to ONE subsystem** for this invocation. If the user is responsible for multiple subsystems, they invoke this skill separately for each.

2. **Collect subsystem implementation context via init template** — for the selected subsystem, gather the owner's knowledge about implementation constraints:

   **Init template section → subsystem design mapping:**

   | Section | What to extract | Fed into |
   |---|---|---|
   | §1 基本信息 | Repo URL, language/framework, owner | Ch.1 of subsystem design doc; required before proceeding |
   | §2 内部架构图 | Internal component diagram | Ch.2 module decomposition; verify against knowledge base |   | §3 历史设计文档 | File paths of previous subsystem designs | Load and preserve existing module structure |
   | §4 技术债务 | Known bugs, frozen code, legacy constraints | Flag as `[已知债务: ...]` wherever they affect design choices |
   | §5 业务规则 | Domain rules not visible in code | Add as explicit design constraints, not comments |
   | §6 依赖的外部接口 | Known API quirks, limits, failure modes | Ch.5 exception handling; integration notes |
   | §7 其他信息 | Any additional context | Background knowledge applied across all sections |

   - Check if `docs/agent-rules/4-subsystem-design/input/init-{subsystem-name}-subsystem.md` already exists:
     - **If exists and filled**: read it, validate, proceed to step 3
     - **If exists but empty or partially filled**: tell the user what's still needed, wait for completion
     - **If does NOT exist**: read `templates/init-subsystem-template.md`, pre-fill known info (§1: subsystem name from §2.2, API interfaces from OpenAPI spec), write to the path above, tell the user:

       > "我已为「{subsystem-name}」生成情报简报，保存在 `docs/agent-rules/4-subsystem-design/input/init-{subsystem-name}-subsystem.md`，请在 IDE 中打开填写。
       > **§1 基本信息（代码仓库/语言）为必填项**，§2 内部架构图强烈建议提供，§4 技术债务务必如实填写。填写完成后告知我。"

   - **Wait for user confirmation before proceeding.**

   **⛔ HARD GATE — Step 2a: Init completeness validation**

   After reading the filled init template, evaluate information quality. Note: this gate only checks sufficiency of input information (can we start designing?), NOT design quality. The design quality check is step 6's subsystem-evaluator subagent.

   | Section | Blocking? | Sufficient when... |
   |---|---|---|
   | §1 基本信息（代码仓库/语言） | **YES** | Repo URL or local path provided and verifiable; language/framework identified |
   | §4 技术债务 | **YES (explicit answer required)** | Either lists specific known issues/frozen code, OR user explicitly writes "无已知债务" — blank is NOT acceptable (silent debt is the most dangerous kind) |
   | §2 内部架构图 | No | Diagram is present; if absent, note that module decomposition will be inferred from code |
   | §5 业务规则 | No | Domain rules are specific and testable (not just "按业务需求") |
   | §6 依赖的外部接口 | No | Known quirks / failure modes are documented for each dependency listed |

   If any blocking item fails: tell the user exactly what is needed, wait for update, re-read and re-validate. **Do NOT begin writing until blocking items pass.**

   **⛔ HARD GATE — Step 2b: Knowledge archival to evo-knowledge-wheel**

   After completeness validation passes, archive reusable knowledge before designing:

   - **技术债务**（§4）: Specific frozen code areas, known bugs with workarounds, or legacy constraints that AI must avoid touching — contribute as "no-go zone" capsules so future design sessions don't rediscover these.
   - **业务规则**（§5）: Domain rules invisible in code (state machine constraints, calculation formulas, regulatory requirements) — contribute as domain rule capsules.
   - **外部接口怪癖**（§6）: Non-obvious API behaviors, rate limits, failure modes of dependencies — contribute as integration pattern capsules.
   - **内部架构决策**: If §2 reveals non-obvious design choices (e.g., "this service uses event sourcing for audit, not CRUD"), contribute as architectural decision capsules.

   After archival completes (or if nothing is worth contributing), proceed to step 3.

3. **Write subsystem-level design document** — following the template at `config.templates["subsystem-design"]` (default: `templates/subsystem-design-template.md`) (master entry + 11 sub-documents). Write in alignment checkpoints: pause after interfaces (Ch.3) and internal design (Ch.4) for user confirmation. API references in ch03 MUST point to the OpenAPI spec from `design-spec`. Save to `docs/agent-rules/4-subsystem-design/output/YYYY-MM-DD-<project>/<subsystem>/`.

   **File structure (11 sub-documents):**
   - `index.md` — metadata + chapter TOC with one-line summaries (write first, summaries filled last)
   - `ch02-responsibilities.md` — §2 职责和边界（子系统核心职责、代码仓库映射、接口概述）
   - `ch03-interfaces.md` — §3 对外接口（API接口定义、消息接口）
   - `ch04-internal-design.md` — §4 内部设计（背景与方案选型、静态结构、内部流程⭐、数据流转）
   - `ch05-exceptions.md` — §5 异常处理设计（错误码定义、异常场景处理策略）
   - `ch06-test-design.md` — §6 测试设计（功能测试用例、异常测试用例、边界测试用例、回归测试用例；每个用例必须包含前置条件、步骤/输入、预期结果、自动化层级、关联设计项）
   - `ch07-dfx.md` — §7 DFX特性设计（安全、可靠性、性能、可运维性 + FMEA⭐）
   - `ch08-code-standards.md` — §8 编码规范（语言/框架规范、命名约定、代码审查重点）
   - `ch09-deployment.md` — §9 部署说明（部署拓扑、配置管理、运维操作）
   - `ch10-summary.md` — §10 总结（版本变化、已知问题、后续工作）
   - `ch11-appendix.md` — §11 附录（参考文档、术语表）
   - `ch12-revision-history.md` — §12 修订记录


   **Write order:**
   1. Create `index.md` with metadata and chapter list (each entry marked `[待写入]`)
   2. Write chapter files following alignment checkpoints (Interface checkpoint at Ch.3, Internal design checkpoint at Ch.4)
   3. After all chapters complete, back-fill `index.md` chapter summaries

   **`index.md` required content:**
   - Subsystem metadata table (subsystem name, code repo, language/framework, owner, input docs)
   - Responsibility summary: one paragraph on what this subsystem does and does NOT do
   - Chapter TOC: `- [§N Title](chNN-filename.md) — one-line description` for each chapter

4. **Cross-chapter consistency check** — verify DFX numbers, interface references, terminology, risk completeness, and test-case traceability within this subsystem document (see "Cross-Chapter Consistency Check" section below). Every key flow in Ch.4 and every exception strategy in Ch.5 must have at least one executable test case in Ch.6; each changed public interface must have normal, boundary, and exception cases where applicable.
5. **Subagent review** — dispatch a subagent reviewer using `skills/subsystem-design-spec/agents/design-document-reviewer-prompt.md`. Fix any issues found before step 6.
6. **Quality evaluation (Stage Gate)** — dispatch a quality evaluator subagent using the skill name from `config.evaluators["subsystem"]` (default: `subsystem-evaluator`) via `skills/<evaluator>/agents/evaluator-dispatch-prompt.md`. The subagent runs in an isolated context and returns a compact grade + issue list. Apply all Critical/Error fixes. If the document scores < B (< 80): present the issue list to the user and identify which init template sections are relevant — ask the user to supplement those sections, then re-run from step 3.

   If `config.evaluators["subsystem"]` is `false`, skip this gate and proceed to cross-document check.

   **Cross-document consistency** — dispatch a cross-document evaluator subagent using `skills/doc-quality-evaluator/agents/evaluator-dispatch-prompt.md` (runs `config.evaluators["doc-quality"]`, default: `doc-quality-evaluator`). Only runs when ALL subsystems have completed designs under `docs/agent-rules/4-subsystem-design/output/YYYY-MM-DD-<project>/`. Before dispatching, check: does every subsystem listed in system design §2.2 have a subdirectory here? If any are missing, skip this step — the last subsystem owner to complete their design will trigger the cross-document check.

   If `config.evaluators["doc-quality"]` is `false`, skip cross-document consistency check entirely.

7. **User reviews design** — ask user to review the document, iterate if needed
8. **Transition to implementation** — invoke `writing-plans`

## Design Phase AI Roles

Design quality comes from applying the right mode at each stage. Switch modes deliberately.

### Writer Mode
Generate design document sections following team templates. The default mode for producing document content.

### Challenger Mode
Applied throughout writing. For every design decision:
- Ask: "What could fail with this choice?"
- Ask: "What am I assuming that hasn't been confirmed?"
- Ask: "Is there a simpler alternative I'm dismissing too quickly?"
- Force proposing an alternative before committing to the first idea.

Mark unconfirmed assumptions inline as `[待确认: reason]`.

### Reviewer Mode
Defines what the subagent reviewer (step 5) checks. These are also the criteria the Writer should be aware of throughout writing to avoid obvious issues.

**Completeness checks (what's missing):**
- Does every REQ-XXX in the system requirements have a corresponding design element?
- Could a different team implement this without asking questions?
- Are any sections under-specified ("refer to existing implementation" without detail)?

**Rigor checks (what's there but shouldn't be trusted):**
- **Pseudo-precise numbers**: Every specific number must have a verifiable source. If not, replace with a range or mark `[待验证: 无基准数据，需压测确认]`.
- **Cross-chapter contradictions**: When one inconsistency is found, scan ALL related chapters — a single spotted conflict typically hides a cluster. Fix as a group.
- **Selection rationale**: A comparison table is not enough. Does each criterion have a verifiable basis? Are rejected options explained with specific technical reasons?
- **Objective chapter naming**: Design documents present solutions — they do not self-promote. "独有的设计创新" → restructure as analysis ("领域需求 vs 框架能力差距").
- **Interface lists without backing**: An API list derived from analysis before implementation is a projection, not a design commitment. Label it "初步规划（待实现验证）" and document the architectural principles separately.

**The core question for every assertion: "What is the evidence?" — If none, either supply it or label it `[待验证]`.**

**The Challenger prevents bad decisions during design. The Reviewer catches what's missing and what shouldn't be trusted. Both are mandatory.**

## Design Judgment vs Assumption

Every design decision is either a **locked judgment** or an **assumption**.

### Locked Judgment
Backed by one of:
- A knowledge base document (verified via team knowledge base)
- An explicit statement in the system requirements document
- Team standards from `rules/` files
- User confirmation in this session

Write locked judgments as declarative statements: "The subsystem uses Redis for session storage."

### Assumption ([待确认])
A design decision made without explicit backing. Mark these inline:

> The cache will hold up to 10000 entries. **[待确认: no knowledge base baseline, no historical data found — confirm with user before finalizing DFX section]**

**Rules:**
- Never present an assumption as a judgment
- Every `[待确认]` item must be surfaced to the user before the design is marked approved
- DFX numbers are almost always assumptions — if no knowledge base value exists and no historical baseline is available, ask the user. **Never use template example values as real requirements.**
- Assumptions about existing system behavior must be verified against code (not just knowledge base)

## Incremental Alignment

Design documents are written in layers with user checkpoints — not dumped as a complete draft. Each checkpoint is a natural decision boundary: if something is wrong here, fixing it is cheap. If you skip the checkpoint and write 5 more chapters on a wrong foundation, rework is expensive.

**Do NOT write an entire document and then ask for approval at the end.** Ask after meaningful chunks.

### Subsystem-Level Design Alignment Points

| Checkpoint | Chapters covered | What to confirm |
|-----------|-----------------|-----------------|
| **Interface checkpoint** | Ch.2-3 (职责边界 + 对外接口) | Responsibilities correctly bounded? External interfaces complete? Dependencies correctly identified? |
| **Internal design checkpoint** | Ch.4 (内部设计) | Module decomposition sensible? Key flows cover the main scenarios? Data structures appropriate? |
| **Full document review** | All chapters | Final review before consistency check |

### How to Phrase Checkpoints

After completing a checkpoint's chapters, write:

> "Ch.2-3 written — covering [summary of what's in there]. A few things to confirm before I continue:
> 1. [Specific question 1]
> 2. [Specific question 2]
> Does this look right, or should I adjust anything?"

Keep checkpoint messages short. Don't summarize every sentence — just the decisions that the user needs to validate.

## Historical Design Handling

If a previous subsystem design document exists, classify every major section and interface with a change tag:

| Tag | Meaning |
|-----|---------|
| `[延续]` | Unchanged from previous design |
| `[新增]` | New in this iteration, no prior equivalent |
| `[变更-来自§X.X]` | Modified from previous design section X.X — describe what changed |
| `[废弃]` | Previously existed, removed this iteration — explain why |

**Revision record requirements (sub-doc 8 变更控制):**
Every revision entry must state what changed AND why, not just list a version number:

```
| V2.0 | 张三 | 2026-04-09 | 新增用户权限子系统（来自REQ-012），废弃旧ACL实现（安全合规要求）|
```

"更新设计" or "按需求修改" are NOT acceptable revision descriptions.

## Design Standards (MUST Read Before Writing)

Before writing any subsystem design document, read and apply the relevant team design standards from the configured rules directories:

### Design Review Standards

Read files from `config.rules["design-review"]` (default: `rules/design-review/`):

- `<design-review-dir>/design-01-doc-writing-standards-checklist.md` — M1: Document writing standards
- `<design-review-dir>/design-04-high-level-design-checklist.md` — M4: High-level design checklist (subsystem-level)
- `<design-review-dir>/design-05-i18n-design-checklist.md` — M5: Internationalization design checklist
- `<design-review-dir>/design-06-never-again-principles-checklist.md` — M6: "Don't repeat mistakes" design principles
- `<design-review-dir>/模块设计规范.md` — Module design standards

### DFX Standards

Read files from `config.rules["dfx"]` (default: `rules/dfx/`):

- `<dfx-dir>/安全.md` — Security design standards
- `<dfx-dir>/性能.md` — Performance design standards

### Interface & Business Standards
- `rules/business/02-MySQL开发规范.md` — MySQL development standards (for database table design)
- `rules/business/错误码规范.md` — Error code standards (for API error responses)
- `rules/business/日志规范.md` — Logging standards (for operability DFX)
- `rules/business/I18N_规范.md` — Internationalization standards

### How to Apply

| Design Phase | Read These Standards |
|---|---|
| Subsystem boundary & module decomposition | M4 (high-level design), 模块设计规范 |
| Internal flow design & data structures | MySQL开发规范, 模块设计规范 |
| DFX chapters | DFX安全/性能, 日志规范 |
| All documents | M1 (writing standards), M6 (never-again principles) |
| Internationalization | M5 (i18n design) |

## 3 Design Red Lines

These are **mandatory** and must be verified before marking subsystem design as complete:

### Red Line 1: Chapter Completeness

**No chapter in the design document may be empty.** Every chapter must contain substantive content. If a chapter is not applicable, it must explicitly state "Not applicable" with a reason. This rule is stated at the top of the template.

### Red Line 2: Reliability Section

The design **must** include a reliability section covering:
- Fault tolerance analysis for the feature's carrier components
- Resource usage analysis (no uncontrolled resource consumption)
- Business process reliability (each business flow is reliable)
- Based on fault-tolerance thinking, not code defect analysis

### Red Line 3: Security Section

The design **must** include a security section covering:
- Security baseline mechanism integration
- Threat modeling analysis (if required by security manager)
- Security design based on identified risks
- Pre-use component version compliance and vulnerability status

## Mandatory Template Elements

When generating subsystem design documents, the following elements from the template are **mandatory** and must not be skipped or simplified:

### Mermaid Diagrams (marked with star-mandatory in template)

All sections marked ⭐必填 in the template require Mermaid or PlantUML diagrams. ASCII-only diagrams are explicitly forbidden. Each diagram must be followed by a structured text description table.

**Subsystem-level design mandatory diagrams:**
- Section 4.2 -- Internal flow diagrams with sequence diagrams showing both normal and exception branches (alt/else blocks)

### SQL DDL for Database Tables

Subsystem-level design Section 4.4.1 requires database tables defined using SQL DDL (not Markdown tables). Each DDL must include:
- COMMENT on every column explaining its meaning
- Enum fields listing all legal values
- Index comments explaining which queries they serve
- Table-level comment and associated code repository annotation

### AI Readability Annotations

The template contains `[AI可读性要求]` and `[AI读取引导]` annotations that define structured output requirements. These must be followed precisely:
- Every flow must include both a diagram (for humans) AND a step description table (for AI)
- Interface references must use standard format: `接口名 (HTTP方法 路径)，详见《API Schema文档》§X.X.X`
- Configuration files must specify: storage path, format, field types, defaults, value ranges, and whether restart is required

### Document Metadata Table

The template starts with a structured metadata table that must be filled in completely, including: document type, subsystem name, system name, iteration version, input/output documents, code repository, keywords.

## DFX Dimensions

Every subsystem design document **must** address 6 DFX dimensions, each addressing **concrete implementation within the subsystem**:

| Dimension | Template Section | Key Content |
|---|---|---|
| **安全性 (Security)** | 7.1 | Input validation, sensitive data handling, threat modeling results |
| **可靠性 (Reliability)** | 7.2 | Process/service reliability, data reliability, FMEA analysis |
| **可运维性 (Operability)** | 7.3 | Log design (levels, format, storage), monitoring metrics (Prometheus), deployment operations |
| **可测试性 (Testability)** | 7.4 | Dependency injection, test interfaces |
| **可扩展性 (Scalability)** | 7.5 | Plugin mechanisms, configuration-driven extension |
| **可复用性 (Reusability)** | 7.6 | Reusable modules, design pattern application |

**Important template rules (apply when writing subsystem-level design):**
- When a subsystem has more than 3 groups of CRUD interfaces, the document must be split into per-module sub-documents (template Section 4.2 拆分规则)
- Flow design sections must NOT include code examples; code examples are only allowed in Section 4.3 (core algorithms and public framework mechanisms)
- External calls in step tables must be marked `[外部]` with DEP-XXX reference numbers matching Section 3.5

## Design Review Checklist

The subsystem design must pass these checks organized by template section:

- [ ] Document metadata table complete (subsystem name, input docs, code repository)
- [ ] Subsystem responsibilities and boundaries clearly defined (Section 2)
- [ ] API interface list references OpenAPI definitions, not duplicated (Section 3.1)
- [ ] External dependency interfaces listed with DEP-XXX numbers and degradation strategies (Section 3.5)
- [ ] Internal flows have Mermaid sequence diagrams with alt/else exception branches (Section 4.2)
- [ ] Test scenario coverage verified: every functional flow documents normal path, exception path, and boundary conditions — gaps are explicit design defects (Section 4.2 + Section 5)
- [ ] Database tables defined using SQL DDL with COMMENTs (Section 4.4.1)
- [ ] Configuration files specify path, format, field types, defaults, ranges (Section 4.4.3)
- [ ] Exception scenarios comprehensively listed with recovery strategies (Section 5)
- [ ] All 6 subsystem DFX dimensions addressed with substantive content (Section 7)
- [ ] Logging, audit, and permission requirements fully specified (Section 8)

## Cross-Chapter Consistency Check

Run after completing the subsystem document draft (checklist step 4). When you find any inconsistency, don't fix it in isolation — **scan the full document for the same class of problem**.

| Check Type | What to Verify |
|------------|---------------|
| **DFX numbers alignment** | Values in design DFX chapters must match the system requirements document §4. If they differ, the design must justify the deviation. |
| **Interface reference integrity** | Every API reference in subsystem design §3.1 must point to a section that exists in the OpenAPI spec. No orphaned references. |
| **Terminology consistency** | Terms defined in §1.2 must be used consistently across all chapters. Check 5-10 key terms. |
| **Risk/dependency completeness** | External dependencies in subsystem design §3.5 must appear in the risk analysis. Unanalyzed external dependencies are design gaps. |

## Quality Checklist

- [ ] All 3 design red lines pass (no empty chapters, reliability section, security section)
- [ ] Cross-chapter consistency check passed: DFX numbers aligned, interface references valid, terminology consistent, risks complete
- [ ] Test scenario coverage complete: every functional flow and exception section covers normal path, exception path, and boundary conditions — any missing scenario type is an explicit gap
- [ ] All `[待确认]` items surfaced to user and resolved before marking design approved
- [ ] ALL 8 sub-documents from the template are present
- [ ] All ⭐必填 Mermaid diagrams included (not ASCII substitutes), each followed by structured text table
- [ ] Database tables defined with SQL DDL (not Markdown tables), including COMMENTs and index annotations
- [ ] AI可读性 annotations followed: flows have both diagrams AND step tables, interfaces use standard reference format
- [ ] All 6 DFX dimensions addressed with substantive content
- [ ] Requirements fully traced to design (every requirement has corresponding design anchor)
- [ ] Risk analysis completed with mitigation plans
- [ ] External interfaces fully defined with degradation strategies

## Next Steps

After quality evaluation passes (grade B or above) and user approves the subsystem design document:

- If this was the last subsystem (all subsystems in §2.2 have completed designs): dispatch `config.evaluators["doc-quality"]` (default: `doc-quality-evaluator`) using `skills/doc-quality-evaluator/agents/evaluator-dispatch-prompt.md` for cross-document consistency, then invoke `writing-plans`
- If other subsystems are still pending: remind the user that the remaining subsystem owners should also invoke `subsystem-design-spec`. Cross-document consistency will run when the last subsystem is complete.
