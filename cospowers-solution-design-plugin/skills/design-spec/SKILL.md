---
name: design-spec
description: Use when system requirements are clear and a design document is needed - for projects requiring formal design documentation with DFX constraints and design review compliance
---

# Design Specification

## Skill 标识

- Skill name: `design-spec`
- Plugin: `cospowers-solution-design`
- Scope: Independent split plugin package `cospowers-solution-design-plugin`
- Entry skill: `solution-design`


**Skill 标识**: `design-spec`

其他 skill 通过 `design-spec` 引用本 skill。

## Overview

Transform system requirements into formal design documents that strictly follow the team's standard templates. Two document types are produced **in order**:

1. **System-level design** (template: `config.templates["system-design"]`, default `templates/system-design-template.md`) -- system-wide architecture, subsystem decomposition, cross-subsystem interactions, and system-level DFX
2. **API/Interface specification** (template: `config.templates["openapi"]`, default `templates/openapi-template.yaml`) -- defines the contracts between subsystems based on the architecture from step 1

**Production order matters:** System-level design defines WHAT subsystems exist and HOW they interact → API specification locks down the contracts → subsystem-level design (`subsystem-design-spec` skill) implements internals respecting those contracts.

**Core principle:** No empty chapters, mandatory Mermaid diagrams at all marked sections, DFX coverage mandatory, design traceable to requirements, review-ready output.

## Extension Points

Before starting, read `cospowers.config.json` from the plugin root (2 levels above this skill's base directory — the directory shown in "Base directory for this skill" at skill load time). No fallback needed — the config always has valid defaults.

| Config field | Used for |
|---|---|
| `config.env.SPEC_DEVELOPER_SERVER_URL` | Remote KB server URL for knowledge discovery |
| `config.kb.skill` | KB skill to invoke (null = use kb-query auto-detection) |
| `config.kb.localPath` | Local KB directory for file-based lookup |
| `config.templates["system-design"]` | Template file path for the system design document |
| `config.templates["openapi"]` | Template file path for the OpenAPI spec |
| `config.rules["design-review"]` | Design review rules directory |
| `config.rules["dfx"]` | DFX rules directory |
| `config.evaluators["sysdesign"]` | Evaluator skill name dispatched at step 12; `false` = skip gate |

## When to Use

- System requirements exist and system-level design documentation is needed
- Projects requiring formal design review compliance
- User explicitly requests system design or OpenAPI spec creation
- Following system-requirement-analysis in the end-to-end team project workflow

**Don't use when:**
- System requirements are not yet defined (use system-requirement-analysis first)
- Simple tasks not requiring design documents (use `solution-design` only when design artifacts are needed)
- Only subsystem-level design is needed (use `subsystem-design-spec` instead)

## Checklist

You MUST create a task for each of these items and complete them in order:

1. **Load system requirements** -- read requirement documents, understand all Stories and REQ items. Scan `docs/agent-rules/2-system-requirements/output/` for subdirectories with `YYYY-MM-DD-` prefix; take the newest one (sort descending). Read `index.md` inside that directory to understand the chapter structure and summary. Then read `ch03-functional-requirements.md` and `ch07-design-task-sheet.md` in full; read other chapters as needed. If no subdirectory found, ask the user for the document path.
2. **Check historical design documents** -- if a previous design doc exists, note what subsystems/APIs/flows existed (see "Historical Design Handling" section below)
3. **Query product knowledge base** -- detect mode first using `cospowers.config.json`: config.kb.skill set → use that skill; else kb-query available → use kb-query; else config.kb.localPath exists → Grep local files; else → code-first (Glob + Grep + Read). See "Knowledge Base Discovery" section below.
4. **Search knowledge base for DFX / platform constraints** -- invoke `daedalus-knowledge` to query platform DFX constraints, design guidelines, and technical standards relevant to this design. The skill reads `SPEC_DEVELOPER_SERVER_URL` from `cospowers.config.json`; if not configured, it degrades gracefully (skips KB lookup, no blocking). Search keywords: system name, tech stack keywords, relevant DFX dimensions (安全、可靠性、性能 etc.).
5. **Assess complexity and read template(s)** -- determine if system-level design is needed (see Complexity Routing below); load and internalize the full template structure before writing
6. **Collect system design constraints via init template** -- before proposing architecture, gather human-only knowledge about existing constraints, historical decisions, and architecture context:

   **Init template section → design step mapping (apply whenever processing the filled template):**

   | Section | What to extract | Fed into |
   |---|---|---|
   | §1 现有架构图 | Diagram path, draw.io, Mermaid, or link | Step 3: search with component names from diagram; Step 7: hard constraint |
   | §2 历史设计文档 | File paths of previous design docs | Step 2: load historical design; Step 7: preserve existing subsystem decomposition |
   | §3 已确定的技术选型 | Explicit tech choices | Step 7: **hard constraint** — do NOT re-propose already-decided options |
   | §4 不能改动的服务 | Service/table names | Step 7: hard constraints; Step 3: additional knowledge base search terms |
   | §5 外部集成 | External system names and data flows | Step 7: integration design; Ch.8 deployment |
   | §6 性能规模约束 | Specific numbers (QPS, availability) | Steps 7: DFX targets — use user-provided numbers, not template defaults |
   | §7 其他约束 | Free-text | Step 7: mark as `[待确认]` if unverifiable |
   | §8 本地代码路径 | Local root directory path per service | Step 7 (before proposing approaches): use Glob/Read on each path to scan entry files, core model files, and route files — build accurate understanding of existing implementation before proposing architecture |

   - Read `templates/init-sysdesign-template.md` from the skill's base directory
   - Pre-fill known sections from system requirements and knowledge base results:
     - §3: any tech constraints already visible from system requirements or knowledge base records
     - §4: existing services identified from knowledge base results in step 3
   - Write the pre-filled content to `docs/agent-rules/3-system-design/input/init-sysdesign-template.md` (create the directory if it does not exist)
   - Tell the user:
     > "我已将总系统设计背景情报简报写入 `docs/agent-rules/3-system-design/input/init-sysdesign-template.md`，请在 IDE 中打开填写。**§1 现有架构图强烈建议提供**（AI 看到架构图才能准确识别现有模块，避免重复设计）。**§8 涉及服务的本地代码路径强烈建议填写**（AI 将先读取代码再提出架构方案，避免与现有实现冲突）。填写完成后告知我。"
   - **Wait for user confirmation. Do NOT propose any architecture approaches until the file is returned.**
   - After user confirms: read `docs/agent-rules/3-system-design/input/init-sysdesign-template.md` and apply the mapping table above. Architecture diagrams (§1) must be read/displayed first — extract all visible component names and add them as search terms before step 7.
   - If §1 and §2 are both still empty (no architecture context at all): proceed to step 7 but mark all inferred subsystem assumptions as `[待确认]`.

   **⛔ HARD GATE — Step 6a: Init completeness validation**

   After reading the filled init template, evaluate **information quality** (not just non-empty). Present a completeness report and **DO NOT proceed to Step 7 until all blocking items are resolved.**

   | Section | Blocking? | Sufficient when... |
   |---|---|---|
   | §1 现有架构图 OR §2 历史设计文档 | **YES (at least one)** | Diagram/doc is readable and shows existing subsystem boundaries; purely blank on both means AI will make too many unverifiable assumptions |
   | §3 已确定的技术选型 | No | Each listed choice has a one-line rationale (avoids re-debating settled decisions) |
   | §4 不能改动的服务 | No | Service or table names are specific (not just "有些服务不能动") |
   | §6 性能规模约束 | No | At least one numeric target (QPS / concurrency / latency) — mark as `[待确认]` if none provided |
   | §8 本地代码路径 | No (soft block) | Each listed service path actually exists on disk (Glob-verify); if path not found, tell user before proceeding |

   **Completeness report format:**
   ```
   📋 系统设计 Init 完整性校验
   ✅ §1 架构图：已提供 [diagram type]
   ✅ §3 技术选型：已确定 N 项
   ⚠️ §6 性能约束：未填写，DFX 章节数值将标 [待确认]（非阻塞）
   🚫 §1 + §2 均为空：无法识别现有子系统边界，请至少提供其中一项
   ```

7. **Present design approach** -- propose 2-3 approaches; apply **Challenger mode**: for each approach, ask "what could fail?" and "what am I assuming?". Mark unconfirmed assumptions as `[待确认]`. Reference knowledge base guidance and all hard constraints from step 6. Get user approval. (See "Exploring Design Approaches" below for how to structure this step.)
8. **Write system-level design document** -- following the template at `config.templates["system-design"]` (default: `templates/system-design-template.md`) (master entry + 9 sub-documents). Write in alignment checkpoints (see "Incremental Alignment" below): pause after architecture (Ch.2-3), DFX (Ch.5), and deployment (Ch.8) for user confirmation before continuing. Save as a **directory of files** to `docs/agent-rules/3-system-design/output/YYYY-MM-DD-<project>/`.

    **File structure (9 sub-documents):**
    - `index.md` — metadata + §1 介绍（inlined, no separate file）+ chapter TOC with one-line summaries (write first, summaries filled last)
    - `ch02-system-architecture.md` — §2 系统总体架构（子系统划分、架构图⭐、依赖关系、技术选型）
    - `ch03-working-principles.md` — §3 系统工作原理（工作原理图⭐、核心机制、关键场景实现）
    - `ch04-design-spec.md` — §4 概要设计说明（方案选型、静态结构图⭐、子系统间交互流程、数据流转、§4.5 系统数据架构⭐）
    - `ch05-dfx.md` — §5 系统DFX特性设计（安全性、可靠性、性能、可扩展性、可运维性、兼容性、可测试性；可测试性必须包含端到端/契约/回归测试用例矩阵）
    - `ch06-architecture-impact.md` — §6 对软件总体架构的影响
    - `ch07-risk.md` — §7 方案风险分析
    - `ch08-deployment.md` — §8 部署视图（部署架构图⭐、部署说明）
    - `ch09-summary.md` — §9 总结（关联分析、后续工作）
    - `ch10-revision-history.md` — §10 修订记录

    **Write order:**
    1. Create `index.md` with metadata table and chapter list (each chapter entry marked `[待写入]` for summary)
    2. Write chapter files one by one, following Incremental Alignment checkpoints (pause at Tech Requirements / Software Solution / DFX / Summary checkpoints for confirmation)
    3. After all chapters complete, back-fill `index.md` chapter summaries (key counts, diagram counts)

    **`index.md` required content:**
    - Document metadata table (all fields from template header)
    - High-density summary: what architecture approach was chosen, how many subsystems, key DFX targets
    - Chapter TOC: `- [§N Title](chNN-filename.md) — one-line description` for each chapter
    - Global constraint reminder: "All chapters must be non-empty; mark inapplicable sections with reason"
9. **Write API/Interface specification** -- output as **OpenAPI 3.0 YAML** following the template at `config.templates["openapi"]` (default: `templates/openapi-template.yaml`). Present the endpoint list first and get user confirmation before writing full schemas. Apply your project's type system constraints to field parameters (see "OpenAPI 3.0 Specification Requirements" below for generic patterns). Save to `docs/agent-rules/3-system-design/output/YYYY-MM-DD-<project>/<project>-openapi.yaml` (inside the same directory as the system design, not alongside it).

   **⛔ HARD GATE — Step 9a: OpenAPI self-check (MUST pass before proceeding)**

   After writing the OpenAPI spec, verify it is complete and correct:

   | Check | How to Verify | Blocking? |
   |-------|---------------|-----------|
   | File exists | `ls` the output path | **YES** — STOP if missing |
   | Valid YAML | Parse the file; confirm it loads without error | **YES** — STOP if invalid |
   | Endpoint coverage | Cross-reference system design §2.2 subsystem list — every subsystem that owns APIs must have at least one endpoint defined in the spec | **YES** — STOP if any subsystem has zero endpoints without explicit "[无对外API]" notation in §2.2 |
   | Required fields | Every endpoint has: `operationId`, `summary`, `parameters` (if applicable), `responses` with at least 200 and error codes | **YES** — STOP if any endpoint is incomplete |
   | Schema definitions | All `$ref` references resolve to defined schemas in `components/schemas` | **YES** — STOP if any orphan refs |

   Present the self-check result before moving to step 10:
   ```
   🔍 OpenAPI 自检结果
   ✅ 文件存在: docs/agent-rules/3-system-design/output/2026-05-06-xxx/xxx-openapi.yaml
   ✅ YAML 合法
   ✅ 端点覆盖: N 个子系统 / M 个端点（子系统 auth: 5, api: 3, ...）
   ✅ 必有字段完整
   ✅ Schema 引用全部可解析
   ```
   **If any blocking check fails: fix the OpenAPI spec, re-run self-check, repeat until all pass.**
10. **Cross-chapter consistency check** -- verify DFX numbers, requirement traceability, terminology consistency, and test-case traceability within the system design document (see "Cross-Chapter Consistency Check" section below). Every REQ item and API contract that changes behavior must map to at least one executable test case in Ch.5 covering normal, boundary, exception, or regression behavior; gaps must be fixed before review.
11. **Subagent review** -- dispatch a subagent reviewer using `skills/design-spec/agents/design-document-reviewer-prompt.md`. Fix any issues found before step 12.
12. **Quality evaluation (Stage Gate)** -- dispatch a quality evaluator subagent using the skill name from `config.evaluators["sysdesign"]` (default: `sysdesign-evaluator`) via `skills/<evaluator>/agents/evaluator-dispatch-prompt.md`. The subagent runs in an isolated context and returns a compact grade + issue list. Apply all Critical/Error fixes. If the document scores < B (< 80): present the issue list to the user and identify which init template sections are relevant — ask the user to supplement those sections, then re-run from step 7. Do NOT proceed until grade ≥ B.

    If `config.evaluators["sysdesign"]` is `false`, skip this gate and proceed directly to step 13.
13. **User reviews design** -- ask user to review the system design and OpenAPI spec, iterate if needed
14. **Transition to subsystem design** — system design and OpenAPI spec are complete. Tell the user:

    > "系统设计及 OpenAPI 契约已完成，保存在 `docs/agent-rules/3-system-design/output/YYYY-MM-DD-<project>/`。
    >
    > 下一步：各子系统负责人分别调用 `subsystem-design-spec`，该 skill 会引导你选择自己负责的子系统并完成详细设计。
    >
    > 当前系统包含以下子系统（来自 §2.2）：
    > - <subsystem-1>
    > - <subsystem-2>
    > - ..."

    Each subsystem owner invokes `subsystem-design-spec` independently. The skill handles init template creation and validation per-person, per-subsystem.

## Design Phase AI Roles

Design quality comes from applying the right mode at each stage. Switch modes deliberately.

### Writer Mode
Generate design document sections following team templates. The default mode for producing document content.

### Challenger Mode
Applied during step 7 (approach selection) and throughout writing. For every design decision:
- Ask: "What could fail with this choice?"
- Ask: "What am I assuming that hasn't been confirmed?"
- Ask: "Is there a simpler alternative I'm dismissing too quickly?"
- Force proposing an alternative before committing to the first idea.

Mark unconfirmed assumptions inline as `[待确认: reason]`.

### Reviewer Mode
Defines what the subagent reviewer (step 11) checks. These are also the criteria the Writer should be aware of throughout writing to avoid obvious issues.

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
- A knowledge base document (verified via `daedalus-knowledge`, if `SPEC_DEVELOPER_SERVER_URL` is configured)
- An explicit statement in the system requirements document
- Team standards from `rules/` files
- User confirmation in this session

Write locked judgments as declarative statements: "The system uses Redis for session storage."

### Assumption ([待确认])
A design decision made without explicit backing. Mark these inline:

> The API gateway will handle up to 5000 concurrent connections. **[待确认: no knowledge base baseline, no historical data found — confirm with user before finalizing DFX section]**

**Rules:**
- Never present an assumption as a judgment
- Every `[待确认]` item must be surfaced to the user before the design is marked approved
- DFX numbers are almost always assumptions — if no knowledge base value exists and no historical baseline is available, ask the user. **Never use template example values as real requirements.**
- Assumptions about existing system behavior must be verified against code (not just knowledge base)

## Exploring Design Approaches

Step 7 is an interactive conversation with the user — not a template-filling exercise. The goal is to agree on the architectural direction **before** writing any document. The result of this conversation directly feeds into Section 4.1 (方案选型) of the design document.

### How to Propose Approaches

- Propose 2-3 distinct approaches with different trade-offs — not minor variations of the same idea
- **Lead with your recommended approach** and explain why you recommend it
- Present options conversationally, not as a wall of text — one approach at a time, then ask
- After presenting all options, explicitly state: "I recommend Option X because..."
- Check if any knowledge base document already constrains the choice — if so, mention it and explain how it narrows the options

### Challenger Mode Applied to Approaches

For each proposed approach, apply Challenger mode before presenting it to the user:

- "What fails first under load?"
- "What's the hardest part to test?"
- "What operational burden does this create on-call?"
- "Which assumptions am I making that could be wrong?"

If a proposed approach doesn't survive Challenger questioning, replace it with a better one. Don't present an approach you can't defend.

### DFX 6 Dimensions for Evaluation

When trade-offs involve non-functional aspects, evaluate against DFX 6 dimensions:

| Dimension | Key Question |
|-----------|-------------|
| **Debuggability** | Can problems be found and diagnosed quickly? |
| **Testability** | Can it be tested efficiently and independently? |
| **Reliability** | Will it keep working under failure conditions? |
| **Operability** | Can it be maintained and operated in production? |
| **Extensibility** | Can it grow without breaking existing behavior? |
| **Reusability** | Can components be shared across subsystems or projects? |

Not every approach needs all 6 dimensions — focus on the dimensions that actually differentiate the options.

### Connecting to Section 4.1 (方案选型)

The approved approach from this conversation becomes Section 4.1 of the design document. When writing Section 4.1:
- Include a **备选方案表**: all proposed approaches with their key trade-offs (use the conversation as source)
- Include a **加权评估表**: weight the criteria you and the user agreed matter most, score each option
- State the final selection and the reasoning that led to it

The weighted table is not invented at document-writing time — it should reflect the actual decision made with the user in step 7. If the user didn't explicitly weigh criteria, infer from what they said they cared about (e.g., "we need this to be maintainable by a small team" implies Operability and Simplicity weight higher).

## Incremental Alignment

Design documents are written in layers with user checkpoints — not dumped as a complete draft. Each checkpoint is a natural decision boundary: if something is wrong here, fixing it is cheap. If you skip the checkpoint and write 5 more chapters on a wrong foundation, rework is expensive.

**Do NOT write an entire document and then ask for approval at the end.** Ask after meaningful chunks.

### System-Level Design Alignment Points

| Checkpoint | Chapters covered | What to confirm |
|-----------|-----------------|-----------------|
| **Architecture checkpoint** | Ch.1-3 (目的 + 系统架构 + 工作原理) | Subsystem decomposition correct? Core flow makes sense? Missing subsystems? |
| **Data architecture checkpoint** | Ch.4.5 (系统数据架构) | Core entities complete? Data ownership boundaries correct? Any ownership conflicts? Cross-subsystem data flows covered? Confirm before writing §5 DFX. |
| **DFX checkpoint** | Ch.5 (系统DFX) | Performance targets realistic? Security approach approved? Reliability architecture makes sense? |
| **Deployment checkpoint** | Ch.8 (部署视图) | Deployment topology matches infrastructure? HA strategy feasible? |
| **Full document review** | All chapters | Final complete review before moving to API spec |

### API Specification Alignment Points

| Checkpoint | What to confirm |
|-----------|-----------------|
| **Endpoint list** | Present all endpoints (method + path + one-line purpose) before writing schemas. Confirm: correct scope? any missing? naming conventions right? |
| **Full spec review** | After schemas and error codes are written |

### How to Phrase Checkpoints

After completing a checkpoint's chapters, write:

> "Ch.2-3 written — covering [summary of what's in there]. A few things to confirm before I continue:
> 1. [Specific question 1]
> 2. [Specific question 2]
> Does this look right, or should I adjust anything?"

Keep checkpoint messages short. Don't summarize every sentence — just the decisions that the user needs to validate.

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

**Knowledge base guides direction, code verifies truth.** Always verify findings against actual code (Step C).

### Step A: Architecture Understanding

| Mode | Action |
|------|--------|
| **kb-skill / kb-query** | Query system architecture, tech stack, cross-product shared modules |
| **local-kb** | Read `<config.kb.localPath>` for architecture/module overview files |
| **code-first** | Glob for entry points, routers, main service files; read top-level README and directory structure |

Goal: understand subsystem decomposition, tech stack per module, shared components.

### Step B: Affected Module Deep Dive

| Mode | Action |
|------|--------|
| **kb-skill / kb-query** | Query each affected module for APIs, dependencies, troubleshooting knowledge |
| **local-kb** | Grep `<config.kb.localPath>` for module-specific files |
| **code-first** | Read handler/service/router files for the affected modules; Grep for interface definitions |

Things to find per module:
- Internal component relationships, design patterns
- Existing APIs (request/response formats)
- Dependencies (what this module depends on, who depends on it)
- Known failure patterns

### Step C: Code Verification

Always verify regardless of mode:

1. **Glob** to find files mentioned in knowledge base or README
2. **Grep** for key functions, classes, interface definitions
3. **Read** to verify module boundaries, API signatures, data models
4. **When knowledge base and code disagree, code is authoritative**

### Informing Design Decisions

| Knowledge Base Finding | Informs Which Design Element |
|----------------------|-------------------------------|
| System architecture diagram | System-level design Ch.2 -- respect existing subsystem boundaries, extend not replace |
| Tech stack per module | System-level design Ch.2.4 -- align tech selection with existing stack |
| Existing APIs | OpenAPI spec -- extend existing endpoints, maintain backward compatibility |
| Module dependencies | System-level design Ch.2.3 -- dependency impact analysis |
| Known failure patterns | System-level design Ch.5.2 -- address known reliability issues in design |

## Historical Design Handling

If a previous design document exists for this system, classify every major section, subsystem, and interface with a change tag:

| Tag | Meaning |
|-----|---------|
| `[延续]` | Unchanged from previous design |
| `[新增]` | New in this iteration, no prior equivalent |
| `[变更-来自§X.X]` | Modified from previous design section X.X — describe what changed |
| `[废弃]` | Previously existed, removed this iteration — explain why |

**Revision record requirements (ch10-revision-history 变更控制):**
Every revision entry must state what changed AND why, not just list a version number:

```
| V2.0 | 张三 | 2026-04-09 | 新增用户权限子系统（来自REQ-012），废弃旧ACL实现（安全合规要求）|
```

"更新设计" or "按需求修改" are NOT acceptable revision descriptions.

## OpenAPI 3.0 Specification Requirements

### Output Format

The API/Interface specification (step 9) **must** be produced as **OpenAPI 3.0 YAML** (not JSON, not a Markdown table). The file structure follows `config.templates["openapi"]` (default: `templates/openapi-template.yaml`). Output file extension is `.yaml`.

### Parameter Constraints

For projects with a formal API type system, all API field constraints should follow the project's type system conventions. When writing an OpenAPI schema field:

1. Identify the appropriate type constraint for this field (string length, numeric range, enum values, format)
2. Translate its constraints into OpenAPI 3.0 schema properties (`minLength`, `maxLength`, `minimum`, `maximum`, `enum`, `format`, `pattern`)
3. Add extension attributes if your project uses a custom type system (e.g., `x-type`) to record the original type for backend reference

## Design Standards (MUST Read Before Writing)

Before writing any design document, read and apply the relevant team design standards from the configured rules directories:

### Design Review Standards

The hub uses a modular M1-M6 design review system. Read files from `config.rules["design-review"]` (default: `rules/design-review/`):

- `<design-review-dir>/design-01-doc-writing-standards-checklist.md` — M1: Document writing standards
- `<design-review-dir>/design-02-tech-requirements-design-checklist.md` — M2: Technical requirements design checklist
- `<design-review-dir>/design-03-overall-design-checklist.md` — M3: Overall design checklist
- `<design-review-dir>/design-04-high-level-design-checklist.md` — M4: High-level (outline) design checklist
- `<design-review-dir>/design-05-i18n-design-checklist.md` — M5: Internationalization design checklist
- `<design-review-dir>/design-06-never-again-principles-checklist.md` — M6: "Don't repeat mistakes" design principles

### DFX Standards

Read files from `config.rules["dfx"]` (default: `rules/dfx/`):

- `<dfx-dir>/安全.md` — Security design standards
- `<dfx-dir>/性能.md` — Performance design standards

### Interface Design Standards
- `rules/design-methods/RESTful_API格式规范v3.0.md` — RESTful API format specification (for OpenAPI document)
- `rules/business/01-OPENAPI开发规范.md` — OpenAPI development standards
- `rules/business/API开发规范.md` — General API development standards
- `rules/business/错误码规范.md` — Error code standards (for API error responses)

### How to Apply

| Design Phase | Read These Standards |
|---|---|
| System-level design (architecture, subsystem decomposition) | M3 (overall), M4 (outline), DFX安全/性能 |
| OpenAPI interface document | RESTful_API格式规范v3.0, OPENAPI开发规范, API开发规范, 错误码规范 |
| All documents | M1 (writing standards), M6 (never-again principles) |
| Technical requirements | M2 (tech requirements design) |
| Internationalization | M5 (i18n design) |

## Complexity Routing

### Simple Requirements → Subsystem-Level Design

For single subsystem or module changes that don't need system-level architecture work, use `subsystem-design-spec` directly. That skill handles the simplified case where only subsystem-level documentation is needed.

### Complex Requirements → Full Design

When the full design process is needed:
- Multiple subsystems affected or new subsystem decomposition needed
- Architectural decisions or cross-subsystem trade-offs needed
- Cross-subsystem dependencies, interactions, or data flows
- System-level DFX requirements (performance, security, reliability across subsystems)

This skill produces (in order):
1. **System-level design** (template: `config.templates["system-design"]`, master entry + 9 sub-documents) -- defines architecture, subsystem decomposition, cross-subsystem interactions
2. **API/Interface specification** (template: `config.templates["openapi"]`) -- defines all API contracts, message schemas, event definitions between subsystems

After both documents are complete and evaluated, invoke `subsystem-design-spec` for per-subsystem implementation design.

## 3 Design Red Lines

These are **mandatory** and must be verified before marking design as complete:

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

When generating design documents, the following elements from the template are **mandatory** and must not be skipped or simplified:

### Mermaid Diagrams (marked with star-mandatory in template)

All sections marked ⭐必填 in the template require Mermaid or PlantUML diagrams. ASCII-only diagrams are explicitly forbidden. Each diagram must be followed by a structured text description table.

**System-level design mandatory diagrams:**
- Section 2.2.2 -- System architecture diagram (subsystem relationships and external boundaries)
- Section 3.0 -- Working principles diagram (core data/control flow)
- Section 4.2 -- Subsystem static structure diagram (layered/component structure)
- Section 8.1 -- Deployment architecture diagram (network zones, nodes, HA topology)

### AI Readability Annotations

The template contains `[AI可读性要求]` and `[AI读取引导]` annotations that define structured output requirements. These must be followed precisely:
- Every flow must include both a diagram (for humans) AND a step description table (for AI)
- Interface references must use standard format: `接口名 (HTTP方法 路径)，详见《API Schema文档》§X.X.X`
- Configuration files must specify: storage path, format, field types, defaults, value ranges, and whether restart is required

### Document Metadata Table

The template starts with a structured metadata table that must be filled in completely, including: document type, system name, iteration version, input/output documents, keywords.

## DFX Dimensions

### System-Level DFX (Template Section 5)

The system-level design template requires 7 DFX dimensions, each addressing **cross-subsystem architectural decisions** (not single-subsystem implementation details):

| Dimension | Template Section | Key Content |
|---|---|---|
| **安全性 (Security)** | 5.1 | Security architecture, security zone partitioning, data transmission security |
| **可靠性 (Reliability)** | 5.2 | HA architecture, fault detection/recovery mechanisms, data reliability |
| **性能 (Performance)** | 5.3 | Performance optimization strategies, bottleneck analysis |
| **可扩展性 (Scalability)** | 5.4 | Horizontal and vertical scaling capabilities |
| **可运维性 (Operability)** | 5.5 | Monitoring architecture, logging architecture, deployment architecture |
| **兼容性 (Compatibility)** | 5.6 | API versioning, upgrade/migration strategy, cross-subsystem compatibility constraints |
| **可测试性 (Testability)** | 5.7 | Test environment architecture, cross-subsystem integration strategy, E2E test design |

**Layer positioning rule** (from template): System-level DFX only covers cross-subsystem architectural solutions. The three-document DFX division is:
- System requirements document Section 4: Defines DFX **metrics and requirements** (e.g., 99.9% availability, RTO<5min)
- System-level design Section 5: Defines **architectural solutions** to meet those metrics (e.g., security zone design, HA topology, monitoring system selection)
- Subsystem-level design Section 7: Defines each subsystem's **specific implementation** (e.g., health check endpoints, retry logic, log format) — handled by `subsystem-design-spec`

## Design Review Checklist

The system-level design must pass these checks organized by template section:

- [ ] Document metadata table complete (system name, iteration, input/output docs)
- [ ] All requirements traced to design (Section 1.4 traceability table)
- [ ] System architecture diagram present with Mermaid (Section 2.2.2 ⭐)
- [ ] Working principles diagram present with Mermaid (Section 3.0 ⭐)
- [ ] Solution selection includes weighted comparison table (Section 4.1)
- [ ] Static structure diagram present with Mermaid (Section 4.2 ⭐)
- [ ] Cross-subsystem interaction flows have both sequence diagrams and step tables (Section 4.3)
- [ ] Cross-subsystem interaction flows cover all 3 scenario types: normal path, exception path, and boundary conditions (Section 4.3)
- [ ] All 7 system DFX dimensions addressed with substantive content (Section 5)
- [ ] Risk analysis completed with mitigation plans (Section 7)
- [ ] Deployment architecture diagram present with Mermaid (Section 8.1 ⭐)

## Cross-Chapter Consistency Check

Run after completing the system design draft (checklist step 10). When you find any inconsistency, don't fix it in isolation — **scan the full document for the same class of problem**.

| Check Type | What to Verify |
|------------|---------------|
| **DFX numbers alignment** | Values in design DFX chapters must match the system requirements document §4. If they differ, the design must justify the deviation. |
| **Requirement traceability completeness** | Every REQ-XXX in system requirements must appear in the design's traceability table (§1.4). Flag uncovered REQs as explicit gaps. |
| **Terminology consistency** | Terms defined in §1.2 must be used consistently across all chapters. Check 5-10 key terms. |

## Next Steps

After quality evaluation passes (grade B or above) and user approves the system design and OpenAPI spec:

- Invoke `subsystem-design-spec` to produce per-subsystem implementation design documents
