---
name: system-requirement-analysis
description: Use when (A) AI requirements (Epic/Feature/Story) exist and need deepening into system-level requirements, OR (B) a structured user requirement document already exists and can skip requirement-analysis — produces Given-When-Then acceptance criteria with 5 scenario types for enterprise projects
---

# System Requirement Analysis

## Skill 标识

- Skill name: `system-requirement-analysis`
- Plugin: `cospowers-requirements`
- Scope: Independent split plugin package `cospowers-requirements-plugin`
- Entry skill: `requirements-intake`


**Skill 标识**: `system-requirement-analysis`

其他 skill 通过 `system-requirement-analysis` 引用本 skill。

## Overview

Deepen AI requirements into a formal system requirement document following the team's standard template structure. The output is a single document covering: document metadata, key application scenarios, design requirement items (REQ-XXX), DFX non-functional requirements, key test points, platform constraints, and a design task assignment sheet. Each requirement item gets comprehensive acceptance criteria with 5 scenario types using Given-When-Then format.

**Core principle:** Single structured document, all sections filled (mark "not applicable" with reason if not relevant), independently verifiable requirements, all scenarios covered with concrete testable criteria.

## Extension Points

Before starting, read `cospowers.config.json` from the plugin root (2 levels above this skill's base directory — the directory shown in "Base directory for this skill" at skill load time). No fallback needed — the config always has valid defaults.

| Config field | Used for |
|---|---|
| `config.env.SPEC_DEVELOPER_SERVER_URL` | Remote KB server URL for knowledge discovery |
| `config.kb.skill` | KB skill to invoke (null = use kb-query auto-detection) |
| `config.kb.localPath` | Local KB directory for file-based lookup |
| `config.templates["system-requirement"]` | Template file path for the system requirement document |
| `config.evaluators["sysreq"]` | Evaluator skill name dispatched at step 4.2; `false` = skip gate |

## When to Use

- **Route A**: AI requirements (Epic/Feature/Story) already exist and need system-level deepening (called from `requirement-analysis`)
- **Route B**: A structured user requirement document already exists — skip `requirement-analysis` and start here directly through `requirements-intake` or this skill.
- Enterprise projects requiring formal system requirement documents
- User explicitly requests system requirement document generation (e.g., "生成系统需求文档")

**Don't use when:**
- Innovation/prototype projects (use `requirements-intake` directly when requirement artifacts are needed)
- Raw ideas with no documentation yet (use `requirement-analysis` first)

## Workflow

You MUST create a TodoWrite task for each major step (0.1 through 4.2) and complete them in order.

### Step 0: Background Intelligence & Preparation

**⛔ GATE — Do NOT proceed to Step 1 until Step 0 is fully complete.**

#### 0.1 Init Template

**Init template section → analysis step mapping:**

| Section | What to extract | Fed into |
|---|---|---|
| §1 业务背景 | Business context and problem description | Step 1: informs REQ item descriptions and Ch.1 of output doc |
| §2 关键业务场景 | User scenarios (freeform text) | Step 1: primary input for scenario-based REQ items |
| §3 历史版本文档 | File paths of previous requirement/design docs | Step 0.5: load for change-diff; supersedes asking the user |
| §4 关联服务和系统 | Service/module names | Step 0.6: primary search terms for knowledge base / architecture analysis |
| §5 现有架构图 | Diagram path, draw.io file, Mermaid code, or link | Step 0.6: extract component names → add to knowledge base search; Ch.6 platform constraints |
| §6 领域术语和业务规则 | Domain terms and business rules | Step 1: Ch.1 definitions; informs DFX constraints |
| §7 其他上下文 | Free-text additional context | Background knowledge applied across all steps |
| §10 结构化补充信息 | 手动填写的数据模型字段、API接口、枚举/状态机、业务规则 | §1–§2 确认填写后：读取 §10.1–§10.4 四个子节，将提取结果作为 Step 1 REQ 生成的结构化补充输入 |

**Template resolution logic:**

- **If running within a role context** (`requirement_analyst` or `ainative_requirement_analyst`): check for the pre-installed file at `docs/agent-rules/2-system-requirements/input/init-sysreq-template.md`.
  - **If file does not exist**: write the template (read `templates/init-sysreq-template.md` from skill base directory, pre-fill project name if mentioned) to that path, then tell the user: "我已将背景情报简报写入 `docs/agent-rules/2-system-requirements/input/init-sysreq-template.md`，请在 IDE 中打开并填写。**§1 业务背景** 和 **§2 关键业务场景** 为必填项，其余按需填写，不知道的跳过。填写完成后告知我。" Wait for user confirmation, then re-read and apply the mapping table.
  - **If file exists but still has placeholders** (`*(在这里写...)*` or `*(在这里贴`): tell the user: "请先在 IDE 中填写 `docs/agent-rules/2-system-requirements/input/init-sysreq-template.md` 的背景情报简报（§1 业务背景和 §2 关键场景为必填），完成后告知我。" Wait for user confirmation, then re-read and apply the mapping table.
  - **If file exists and is filled**: apply the mapping table above to extract all background knowledge.
- **If no role context and no file provided**: write the init template to the project and wait:
  1. Read `templates/init-sysreq-template.md` from the skill's base directory
  2. Pre-fill any known information (project name if mentioned, related services already visible in conversation)
  3. Write to `docs/agent-rules/2-system-requirements/input/init-sysreq-template.md` (create directory if needed)
  4. Tell the user: "我已将背景情报简报写入 `docs/agent-rules/2-system-requirements/input/init-sysreq-template.md`，请在 IDE 中打开并填写。**§1 业务背景** 和 **§2 关键业务场景** 为必填项，其余按需填写，不知道的跳过。填写完成后告知我，我再开始分析。"
  5. Wait for user confirmation, then read the file and apply the mapping table. If §1 and §2 are still empty, ask the user to complete only those two sections.
- **If user provides a file path** (XMind, user requirement document, PRD): copy it to `docs/agent-rules/2-system-requirements/input/` automatically — do NOT ask the user to move it. The file is the **content input**. The init template is still **required** — it collects background context (business motivation, related services, domain terms) NOT in the document. Check whether init-sysreq-template.md exists and is filled; if not, generate it (pre-filling known info from the document) and ask the user to complete §1 and §2 before proceeding.
- **If user provides content inline** (XMind content, AI requirements, raw PRD text): treat it as the content input. Still check for and generate the init template — inline content does not replace background context collection.
- **Architecture diagrams (§5) must be processed before knowledge base queries**: read/display the diagram, then extract all visible component/module names and add them as additional search terms in Step 0.6. Diagram content takes precedence over AI inference for identifying existing modules.
- **§10 结构化补充信息处理**（在 §1 和 §2 确认填写后执行）：
  1. 检查 §10 是否填写"不涉及"→ 跳过
  2. 读取 §10.1–§10.4 四个子节的内容：
     - §10.1 数据模型字段需求 → 提取实体名、字段名称、类型约束、必填/唯一规则
     - §10.2 API 接口推导 → 提取页面/操作对应的 CRUD 接口清单和请求体结构提示
     - §10.3 枚举值与状态机 → 提取枚举取值列表、状态转换规则
     - §10.4 业务规则 → 提取校验规则、计算逻辑、权限控制规则
  3. 将上述提取结果存为**结构化补充数据**，在 Step 1 生成 REQ 描述和验收条件时引用

**⛔ Do NOT proceed to 0.2 until init template is filled and user confirms.**

#### 0.2 ⛔ HARD GATE — Init Completeness Validation

Evaluate **information quality** (not just non-empty) for each section. Present a completeness report. **Do NOT proceed until all blocking items are resolved.**

| Section | Blocking? | Sufficient when... | Insufficient example |
|---|---|---|---|
| §1 业务背景 | **YES** | Clearly states: who is the user, what problem is solved, why now | "做这个功能" / placeholder text |
| §2 关键业务场景 | **YES** | At least 1 concrete scenario with: user role + trigger + expected outcome | "用户使用该功能" / generic description |
| §4 关联服务和系统 | No | Has specific service/module names | Acceptable to leave blank |
| §6 领域术语和业务规则 | No | Each term has a definition | Acceptable to leave blank |
| §8 版本需求范围界定 | No | Has explicit "本版本包含" and "本版本不包含" lists | Acceptable to leave blank |
| 用户需求文档（如提供） | **YES** | Document is readable, has chapter structure, can be parsed | File not found / unreadable |

**Report format:**
```
📋 Init 完整性校验结果
✅ §1 业务背景：[一句话概括]
✅ §2 关键场景：识别到 N 个场景
⚠️ §6 领域术语：未填写，后续将使用通用术语（非阻塞）
🚫 §1 业务背景：信息过于简单——请补充说明
```

If any blocking section is insufficient: tell user exactly what's missing, wait for update, re-validate. Non-blocking gaps: note and proceed.

**⛔ Do NOT proceed to 0.3 until all blocking items pass.**

#### 0.3 ⛔ HARD GATE — Knowledge Archival

Use the Skill tool to invoke `evo-knowledge-wheel` to archive reusable domain knowledge from the init template (§1 business patterns, §6 domain terms, §2/§6 business rules, §4/§5 architecture constraints). Skip project-specific details, already-archived items, and empty sections.

After archival: "背景情报已校验完整，可复用知识已归档至团队知识库。开始系统需求分析。"

**⛔ Do NOT proceed to 0.4 until archival is confirmed complete.**

#### 0.4 Load Input Requirements

- **XMind file** (`.xmind` or folder with `content.json`): read `content.json`/`content.xml`, extract requirement tree, map nodes to REQ items.
- **AI requirements (Epic/Feature/Story)**: check `docs/agent-rules/1-ai-requirements/output/` for latest `YYYY-MM-DD-{project}-requirements.md`.
- **Structured user requirement document** (numbered sections + at least 2 of: functional/non-functional classification, acceptance criteria, business scenarios): read directly, map to REQ items.
- **Raw PRD** (no chapter structure): should have been routed through `requirement-analysis` first. Tell user and ask for confirmation before proceeding.
- **Init template only** (no separate requirement doc): treat §2 and §6 as primary source; §3/§4 as supplementary context.

#### 0.5 Historical Version Check

Check §3 of init template first. If no historical docs there, ask user. If previous version exists, load it for change diff. See [Historical Version Handling](#historical-version-handling) for change classification and presentation format.

#### 0.6 Query Product Knowledge Base

**Apply the three-mode detection** (see [Knowledge Base Discovery](#knowledge-base-discovery)):
- **config.kb.skill / kb-query available** → invoke KB skill with module/service names from §4 and §5 as search terms
- **config.kb.localPath exists** → Grep local KB files for module names and API keywords
- **code-first** → Grep source files for interface definitions, API handlers, data models

Unlike requirement-analysis, this stage queries API capabilities and tech stacks — they inform REQ delta analysis and DFX targets.

#### 0.7 Read the Template

Load the template file from `config.templates["system-requirement"]` (default: `templates/system-requirement-template.md`) and internalize its full 9-chapter structure.

#### 0.8 Search DFX Baselines

Invoke `daedalus-knowledge` to query platform DFX constraints (reads `SPEC_DEVELOPER_SERVER_URL` from `cospowers.config.json`; if not configured, skip KB lookup and fall back to local `rules/dfx/` files). **Apply the three-mode detection** for additional context (see [Knowledge Base Discovery](#knowledge-base-discovery)):
- **kb-query/local-kb** → query DFX constraint keywords listed below
- **code-first** → search for performance configs, SLA comments, monitoring setup in codebase

| Query keyword | Target section | What to extract |
|---|---|---|
| `性能指标` / `响应时间基线` | §4.1 性能要求 | Specific TPS/latency targets |
| `可用性要求` / `故障恢复` | §4.2 可靠性要求 | SLA targets, RTO/RPO baselines |
| `业务监控` / `监控指标规范` | §4.4 可运维性 | Business metric registration patterns |
| `安全基线` / `鉴权规范` | §4.3 安全性要求 | Auth patterns, data classification rules |
| `可测试性规范` / `测试工具接入` | §4.7 可测试性 | Standard test tools and CI integration |

Pre-fill `init-sysreq-template.md` §9 with results. If no results for a query: mark `[待确认：知识库无基线，请人工填写]` — do NOT substitute generic text.

---

### Step 1: Scope Analysis & User Confirmation

#### 1.1 Present Requirement Item Plan

Show REQ-XXX list mapped from Stories, with change tags if historical version exists (`[新增]` / `[变更]` / `[延续]` / `[废弃]`). Get user confirmation.

#### 1.2 Infer Missing Requirements

Based on confirmed REQ list, reason about what is typically needed but not yet stated. Ask user one thematic group at a time. See [Requirement Completeness Inference](#requirement-completeness-inference) for patterns and rules.

#### 1.3 Handle Adjustment Requests

Iterate REQ items until user is satisfied.

#### 1.4 Confirm Generation Scope

Ask the user to choose one of three generation modes:

- **A) Full analysis** — write all 9 chapter files with complete content for every REQ item (all priorities, full AC, full DFX). Default choice.
- **B) Core-first (P0 only)** — write all 9 chapter files, but fully develop only P0 REQ items; P1/P2 items appear in the REQ table as stubs (`[待完善]` in description and AC fields) to be filled later.
- **C) Example-based** — write 2–3 REQ items as fully worked examples with complete AC and DFX; list all remaining REQ items as stubs. Useful for early alignment reviews.

**⛔ Do NOT proceed to Step 2 until user confirms the REQ plan and generation scope.**

---

### Step 2: Generate System Requirement Document

#### 2.1 Create Output Directory & index.md

**Output directory:** `docs/agent-rules/2-system-requirements/output/YYYY-MM-DD-<project>/`

**File structure:**
- `index.md` — metadata table + chapter TOC with one-line summaries (write first, summaries filled last)
- `ch01-doc-description.md` — §1 文档说明
- `ch02-key-scenarios.md` — §2 关键应用场景
- `ch03-functional-requirements.md` — §3 功能性需求（all REQ items）
- `ch04-dfx.md` — §4 非功能性需求（DFX）
- `ch05-test-points.md` — §5 关键测试点
- `ch06-platform-constraints.md` — §6 平台约束需求
- `ch07-design-task-sheet.md` — §7 设计任务书
- `ch08-priority.md` — §8 需求优先级说明
- `ch09-revision-history.md` — §9 修订记录

**Write order:** (1) Create `index.md` with metadata and chapter list (summaries marked `[待写入]`). (2) Write chapter files following Incremental Alignment checkpoints below. (3) Back-fill `index.md` summaries (line count, key item counts).

**`index.md` required content:** document metadata table; high-density summary (scope, REQ counts by priority); chapter TOC as `- [§N Title](chNN-filename.md) — one-line description, key counts`; global constraints (no empty sections rule — stated once here, not per chapter).

Downstream discovery: `design-spec` finds this by scanning `docs/agent-rules/2-system-requirements/output/` for newest subdirectory by YYYY-MM-DD prefix.

#### 2.2 Write Chapters

**Chapter 1 — 文档说明**: Fill purpose, define all abbreviations, list references. Add a **Reader Roadmap** at end:

| 读者角色 | 重点章节 |
|---------|---------|
| 开发工程师 | Ch.3 功能性需求 + Ch.7 设计任务书 |
| 测试工程师 | Ch.5 关键测试点 + Ch.4 非功能性需求（DFX） |
| 架构师/设计师 | Ch.2 关键应用场景 + Ch.4 DFX + Ch.6 平台约束 |
| 产品/项目经理 | Ch.2 关键应用场景 + Ch.8 需求优先级 |

**Chapter 2 — 关键应用场景**: Write each scenario with role, workflow, expected outcome.

**Chapter 3 — 功能性需求**: For each REQ item:
- Fill summary table (REQ-XXX, name, priority, description, acceptance criteria, linked scenario)
- Write detailed description with functional/non-functional requirements, acceptance standards (5 scenario types + Given-When-Then), and dependencies
- Follow [REQ Writing Rules](#req-writing-rules)

**Chapter 4 — 非功能性需求（DFX）**: Before writing any DFX metric:
1. Check team knowledge base for platform-specific DFX baselines
2. If historical version exists, extract actual baselines
3. For metrics with no source, ask user — group related metrics into one question
4. Mark unresolved metrics `[待确认: 需与XX确认]` — never fill template example numbers
5. Fill all 7 DFX dimensions; write "不涉及" with reason if not applicable

See [DFX Non-Functional Requirements](#dfx-non-functional-requirements) for the 7 dimensions.

**Chapter 5 — 关键测试点**: Derive test points from REQ items — do not invent standalone points:
- Each P0 REQ must have at least one TC (functional) and one PT (performance) test point
- Security REQ items → ST test points; Reliability requirements → RT test points
- Every test point must reference its source REQ (e.g., `REQ-001`)

**Chapter 6 — 平台约束需求**:
- 6.1 各产品功能约束: for each dependent product, query the knowledge base for API capabilities and known limits
- 6.2 开发规范约束: check team knowledge base for mandated standards
- 6.3-6.4: document common platform features and environment constraints

**Chapter 7 — 设计任务书**: Responsibility document for downstream designers:
- 7.1 需求跟踪表: every REQ item must appear; "自检" column stays blank for designers
- 7.2 DFX targets: copy exactly from Ch.4 — same numbers, same units, no paraphrasing; "自检" column stays blank
- Incomplete task sheets = unclear accountability. Any missing REQ is a defect.

**Chapter 8 — 需求优先级说明**: Confirm P0/P1/P2 definitions and timeline based on user input.

**Chapter 9 — 修订记录**:
- V1.0 (no historical version): initialize with "V1.0 | 初始版本"
- Has historical version: populate from change diff — one row per `[变更]` or `[废弃]` item
- Each row must record **what changed AND why** — a record that only says "更新需求" is useless
- Example: "V1.1 | REQ-003 性能指标从固定阈值改为比例制+绝对上限 | 原固定值在压测中发现无法适应不同规模部署"

---

#### 2.3 ⛔ MANDATORY — Dispatch IPD Epic Generation (Background)

**You MUST dispatch this subagent before proceeding to Step 3. Do not skip.**

After Step 2.2 completes (all 9 chapter files written), dispatch `generate-ipd-story` as a **background subagent** using `skills/generate-ipd-story/agents/dispatch-prompt.md`.

Replace `[SYSREQ_DIR]` with the output directory just written (e.g. `docs/agent-rules/2-system-requirements/output/YYYY-MM-DD-<project>/`) and `[PROJECT_NAME]` with the project name.

**Dispatch now, then proceed immediately to Step 3 without waiting for the result.** The E/F/S document path and quality grade will be reported in the background subagent's completion notification.

Tell user: "System requirement chapters written. Generating IPD Epic/Feature/Story document in the background (quality gate included) — this runs in parallel with the system requirement quality checks."

---

### Step 3: Verification & Quality

#### 3.1 Completeness Verification

Verify all 9 chapter files exist, none are empty, each has substantive content. Back-fill `index.md` summaries if not done.

#### 3.2 Cross-Chapter Consistency Check

1. **Term consistency** — pick key terms from §1.2, search all chapters. Flag term drift (same term used with different meaning).
2. **Numeric consistency** — every DFX number in Ch.4 must match exactly in Ch.7. Any discrepancy is a defect.
3. **REQ cross-references** — every REQ-XXX in Ch.5 and Ch.7 must exist in Ch.3. Orphaned references are defects.
4. **Scenario coverage** — every REQ item in Ch.3 must link to at least one scenario in Ch.2.
5. **Term redefinition** — if this version changes a term's meaning, explicitly redefine in §1.2: "本版本重新定义：原含义为X，现含义为Y".

#### 3.3 Quality Check

**SMART per REQ:** Specific (clear descriptions), Measurable (concrete acceptance criteria), Achievable (feasible, reasonable workload), Relevant (aligned with business goals), Time-bound (priority assigned).

**Testability:** Acceptance criteria use GWT format; all 5 scenario types covered per REQ; performance metrics are quantifiable; Chapter 5 test points cover all REQ items.

---

### Step 4: Review Gates

#### 4.1 Subagent Review (Light Pass)

Dispatch subagent reviewer using `skills/system-requirement-analysis/agents/system-requirement-reviewer-prompt.md`. Quick sanity check for blocking-level gaps: missing chapters, uncovered REQs, empty DFX sections, cross-chapter contradictions. Fix issues found. (Not a full quality evaluation — catches blockers only.)

#### 4.2 Quality Evaluation (Stage Gate, Deep Pass)

Dispatch quality evaluator subagent using the skill name from `config.evaluators["sysreq"]` (default: `sysreq-evaluator`) via `skills/<evaluator>/agents/evaluator-dispatch-prompt.md`. Runs in isolated context: full 75-item rule-by-rule scan (REQ-01~38 + AIN-01~16 + FN-01~04 + IA-01~05 + SUP-01~09) with weighted scoring.

If `config.evaluators["sysreq"]` is `false`, skip this gate and proceed directly to user review.

| Grade | Action |
|---|---|
| **A or B (≥ 80)** | Present document to user, proceed to `design-spec` |
| **C (65–79)** | Apply all Error+ fixes, re-evaluate until ≥ 80 |
| **D (< 65) or F** | Return to earlier steps to fix root issues, then re-evaluate |

**Do NOT present the document to user until grade ≥ B.**

Common fix patterns: empty acceptance criteria → fill 5 scenario types + GWT; sourceless DFX numbers → source or mark `[待确认]`; empty/token-only sections → add content or reason; missing REQ items in Ch.7 → add rows.

---

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

**Knowledge base guides direction, code verifies truth.**

### Identify Affected Modules

| Mode | Action |
|------|--------|
| **kb-query / config.kb.skill** | Query by product/module name to discover relevant modules, APIs, tech stacks |
| **local-kb** | `ls <config.kb.localPath>` → search by module keyword; read matched files |
| **code-first** | Glob for module directories and entry files; read README and architecture comments |

### Deep Module Knowledge

| Mode | Action |
|------|--------|
| **kb-query / config.kb.skill** | Retrieve module overview, architecture, API specs, business domain docs |
| **local-kb** | Read all relevant `*.md` files under `config.kb.localPath` for the affected modules |
| **code-first** | Read key handler/service/router/model files; Grep for interface definitions and data structures |

### Code Verification

Always verify regardless of mode — Glob/Grep to find files, Read to verify signatures and models. **When knowledge base and code disagree, code is authoritative.**

### Informing Requirements

| Knowledge Base Finding | Informs Chapter |
|---|---|
| 产品架构、子系统边界 | Ch.2 — align scenarios with existing modules |
| 现有 API 和能力 | Ch.3 — identify delta (new vs. modify existing) |
| 技术栈（语言、DB、框架） | Ch.4.1 性能要求, Ch.4.6 兼容性要求 |
| 监控/日志基础设施 | Ch.4.4 可运维性要求 |
| 依赖产品的能力边界 | Ch.6.1 — document what each product provides and limits |
| 测试基础设施 | Ch.4.7 可测试性要求, Ch.5 关键测试点 |

---

## Historical Version Handling

### Change Classification

| Tag | Meaning | Action |
|---|---|---|
| `[延续]` | Requirement unchanged | Copy forward, verify still valid |
| `[新增]` | New requirement | Write from scratch |
| `[变更-来自REQ-XXX]` | Modified from previous | Document what changed and why |
| `[废弃]` | Previous REQ dropped | Record in Ch.9 with reason |

### Presenting the Change Summary

```
变更摘要：
  延续: REQ-001, REQ-002, REQ-004 (3项)
  新增: REQ-008, REQ-009 (2项)
  变更: REQ-003 (来自旧版REQ-003，调整了性能指标)
  废弃: 旧版REQ-005 (功能合并到REQ-003)
```

---

## Requirement Completeness Inference

After user confirms initial REQ list, challenge it: look for what is typically required but not yet stated. Ask one thematic group per message.

**Rules:**
- Only infer requirements plausible given the actual REQ list — do not invent unrelated features
- Group related inferences into one question (e.g., "登录相关安全机制" as one question)
- If user says no → mark explicitly out of scope
- If user says yes → add as `[新增-推理补充]`

| If REQ includes... | Consider asking about... |
|---|---|
| 用户登录/认证 | 登录失败锁定、会话超时、审计日志、密码强度策略 |
| 数据导入/导出 | 进度展示、失败重试、文件格式校验、大文件限制 |
| 权限/角色管理 | 权限变更审计、最小权限原则、临时授权、权限继承 |
| 消息/通知 | 通知偏好设置、消息重复发送防护、未读计数 |
| 搜索/列表查询 | 分页参数、排序维度、筛选条件、查询结果导出 |
| 文件上传/存储 | 文件大小上限、类型白名单、重复文件处理 |
| 定时/异步任务 | 任务执行状态可见性、失败告警、手动触发能力 |
| 多用户/多租户 | 并发写冲突处理、数据隔离边界 |
| 对外 API 接口 | 限流策略、接口版本管理、调用方鉴权 |
| 配置管理 | 配置变更历史、回滚能力、配置生效方式（热更新/重启）|

---

## REQ Writing Rules

**Rule 1: REQ descriptions must NOT contain implementation decisions.**

| Belongs in REQ | Belongs in design-spec |
|---|---|
| "系统必须支持对用户操作的完整审计" | "使用 Elasticsearch 存储审计日志" |
| "接口响应时间 P95 < 200ms" | "通过 Redis 缓存降低响应时间" |
| "支持1000并发用户" | "采用消息队列异步处理" |

**Rule 2: Mark unconfirmed requirements with `[待确认]`.**

If a requirement has not been explicitly confirmed by product owner or customer, tag `[待确认: 需与XX确认]`. Unconfirmed requirements must NOT be treated as P0.

**Rule 3: DFX numbers must have a real source — never invent them.**

Priority order: (1) team knowledge base for platform baselines, (2) historical version actuals, (3) ask user. Template example numbers (e.g., ">= 1000 concurrent users", "< 200ms P95") are format placeholders, not defaults. If no source available, mark `[待确认]` — do NOT fill a number.

---

## 5 Scenario Types

Every REQ item must include acceptance criteria covering all 5 types:

1. **Normal Flow** (2-4 scenarios) — specific data success paths
2. **Exception Flow** (2-3 scenarios) — error input, system failures, network issues
3. **Security** (2 scenarios) — permission verification, data encryption, access control
4. **Boundary** (2 scenarios) — limit values, resource caps, concurrency limits
5. **Testable** (1-2 scenarios) — test data construction and verification methods

Each scenario follows Given-When-Then format:
```markdown
##### [Normal Flow Scenario 1: Successful Template Creation]
**Given**: Administrator logged into management console, "Service Templates" page loaded, template name "Web-App-Standard" not yet used
**When**: Administrator clicks "New Template", fills in name "Web-App-Standard", selects base image "Ubuntu 22.04", sets resource limit CPU=2 cores Memory=4GB, clicks "Save"
**Then**: System displays "Template created successfully", template list shows new entry "Web-App-Standard" with status "Available", creation time shows current time
```

---

## DFX Non-Functional Requirements

All 7 dimensions must be addressed:

| Section | Dimension | Key Metrics |
|---|---|---|
| **4.1** | 性能要求 | Concurrency, response time, throughput, CPU/memory usage; resource requirements |
| **4.2** | 可靠性要求 | Availability (e.g., 99.9%), RTO, RPO, MTBF, MTTR; fault detection/recovery/backup |
| **4.3** | 安全性要求 | Authentication/authorization, data encryption/masking/backup, security protection, audit logs |
| **4.4** | 可运维性要求 | Deployment method, monitoring/alerting, log management, config management, upgrade/rollback |
| **4.5** | 可扩展性要求 | Horizontal/vertical scaling capability |
| **4.6** | 兼容性要求 | Browser, OS, database, backward compatibility |
| **4.7** | 可测试性要求 | Interface testability, state observability, data constructability, fault injectability, environment isolation, log traceability |

---

## Next Steps

After quality evaluation passes (grade ≥ B) and user approves the system requirement document, invoke `design-spec` for the design phase.
