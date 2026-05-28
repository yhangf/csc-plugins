# cospowers Plugin 拆分方案

本文档给出将当前 `cospowers` 通用任务路由工作流 Plugin 拆分为六个独立 Plugin 的方案：

1. 需求梳理 Plugin
2. 方案设计 Plugin
3. 任务拆解 Plugin
4. 测试生成 Plugin
5. TDD 编码 Plugin
6. 集成测试 Plugin

目标是：**不遗漏现有能力**，并保证每个 Plugin **功能独立、职责完整、可单独安装和运行**。

---

## 一、总体拆分原则

### 1. 每个 Plugin 必须独立完整

每个 Plugin 建议具备如下结构：

```text
plugin-name/
├── skills/
│   └── ...
├── rules/
│   └── ...
├── templates/
│   └── ...
├── evaluators/
│   └── ...
├── README.zh.md
├── CLAUDE.md
└── plugin.json / manifest.json
```

每个 Plugin 不能依赖“另一个 Plugin 必须存在”才能工作。

允许通过标准文档交接，例如：

- 方案设计 Plugin 可以读取需求梳理 Plugin 产出的需求文档；
- 但如果没有需求梳理 Plugin，它也应能从用户给出的 PRD、issue、口头需求中生成方案设计。

也就是说：

> Plugin 之间可以通过标准文档输入/输出衔接，但不能通过隐式 skill 依赖强耦合。

---

### 2. 拆分后不再保留中央大路由器

当前架构中 `brainstorming` 是中央路由：

```text
brainstorming
├── requirement-analysis
├── system-requirement-analysis
├── design-spec
├── subsystem-design-spec
├── writing-plans
├── executing-plans
├── test-driven-development
├── verification-before-completion
└── spec-commit
```

拆分后，每个 Plugin 内部可以有自己的局部入口，但不再依赖一个全局 `brainstorming`。

建议入口如下：

| Plugin | 入口 Skill |
|---|---|
| 需求梳理 Plugin | `requirements-intake` |
| 方案设计 Plugin | `solution-design` |
| 任务拆解 Plugin | `task-planning` |
| 测试生成 Plugin | `test-generation` |
| TDD 编码 Plugin | `tdd-implementation` |
| 集成测试 Plugin | `integration-verification` |

---

### 3. 使用标准交付物衔接六个 Plugin

主流程建议如下：

```text
用户原始想法 / PRD / Bug / Feature Request
        ↓
[1] 需求梳理 Plugin
        ↓ 输出：AI Requirement Spec + System Requirement Spec
[2] 方案设计 Plugin
        ↓ 输出：System Design Spec + Subsystem Design Specs + API Spec
[3] 任务拆解 Plugin
        ↓ 输出：Implementation Plan + Task Graph + Execution Strategy
[4] 测试生成 Plugin
        ↓ 输出：Test Plan + Test Cases + Test Code Drafts
[5] TDD 编码 Plugin
        ↓ 输出：Code Changes + Unit Tests + Local Verification
[6] 集成测试 Plugin
        ↓ 输出：Integration Test Report + Verification Report + Release Readiness
```

---

## 二、现有能力完整归类

### 1. 当前核心 Skills 归属

| 当前 Skill | 拆分归属 |
|---|---|
| `using-spec-developer` | 每个 Plugin 都需要本地化一份简化入口说明 |
| `session-context` | 每个 Plugin 都需要本地化一份上下文恢复能力 |
| `brainstorming` | 拆分成各 Plugin 的局部入口，不再作为中央路由 |
| `requirement-analysis` | 需求梳理 Plugin |
| `system-requirement-analysis` | 需求梳理 Plugin |
| `design-spec` | 方案设计 Plugin |
| `subsystem-design-spec` | 方案设计 Plugin |
| `systematic-debugging` | TDD 编码 Plugin + 集成测试 Plugin |
| `writing-plans` | 任务拆解 Plugin |
| `executing-plans` | TDD 编码 Plugin |
| `spec-commit` | TDD 编码 Plugin + 集成测试 Plugin |
| `code-compliance-check` | TDD 编码 Plugin + 集成测试 Plugin |
| `subagent-driven-development` | 任务拆解 Plugin + TDD 编码 Plugin |
| `finishing-a-development-branch` | 集成测试 Plugin |
| `verification-before-completion` | 集成测试 Plugin |
| `test-driven-development` | TDD 编码 Plugin |
| `test-code-generator` | 测试生成 Plugin |
| `requesting-code-review` | TDD 编码 Plugin + 集成测试 Plugin |
| `using-git-worktrees` | TDD 编码 Plugin + 集成测试 Plugin |
| `evo-knowledge-wheel` | 每个 Plugin 可保留轻量版，或作为公共规则复制 |
| `mcp-builder` | 建议拆为可选工具 Plugin，或放入方案设计 Plugin 的工具扩展区 |

---

### 2. 当前质量门 Evaluator 归属

| 当前 Evaluator | 拆分归属 |
|---|---|
| `aireq-evaluator` | 需求梳理 Plugin |
| `sysreq-evaluator` | 需求梳理 Plugin |
| `sysdesign-evaluator` | 方案设计 Plugin |
| `subsystem-evaluator` | 方案设计 Plugin |
| `doc-quality-evaluator` | 方案设计 Plugin + 集成测试 Plugin 可复用 |

---

## 三、六个 Plugin 详细设计

---

## 1. 需求梳理 Plugin

### 名称建议

```text
requirements-plugin
```

中文名：

```text
需求梳理 Plugin
```

### 核心职责

把用户的原始想法、口头描述、issue、PRD、业务诉求，转化为结构化、可评审、可追踪的需求文档。

覆盖当前系统中的两类需求路径：

```text
增量项目 A：无用户需求文档
用户口头想法 → requirement-analysis → system-requirement-analysis

增量项目 B：已有用户需求文档
PRD / 需求文档 → system-requirement-analysis
```

### 应包含的 Skills

```text
skills/
├── requirements-intake/
├── requirement-analysis/
├── system-requirement-analysis/
├── requirements-review/
├── requirements-change-analysis/
├── session-context/
└── using-requirements-plugin/
```

#### `requirements-intake`

新的入口 Skill，负责判断输入类型：

| 输入类型 | 路由 |
|---|---|
| 原始想法 / 口头需求 | 进入 `requirement-analysis` |
| 已有 PRD / 需求文档 | 进入 `system-requirement-analysis` |
| bug / 故障 | 生成问题需求或交给 TDD / 集成测试 Plugin |
| 需求变更 | 进入 `requirements-change-analysis` |

#### `requirement-analysis`

保留当前能力，输出 AI Requirement 文档，包括：

```text
Epic
Feature
Story
Acceptance Criteria
AI-native Notes
Quality Scenarios
Non-functional Requirements
```

#### `system-requirement-analysis`

保留当前能力，输出 System Requirement 文档，包括：

```text
REQ-XXX
Given-When-Then
功能场景
异常场景
边界场景
权限场景
AI-native 场景
补充约束
```

#### `requirements-review`

新增或从 evaluator 调用中抽象，负责人工评审前完整性检查：

```text
- 是否有孤立层级
- 是否有无 AC 的 Story
- 是否有未追踪的 Feature
- 是否缺少安全需求
- 是否缺少质量需求
- 是否存在占位符
```

#### `requirements-change-analysis`

用于增量项目需求变更：

```text
旧需求文档 + 新需求变更
        ↓
变更影响分析
        ↓
受影响 REQ / Feature / Story
        ↓
后续设计影响提示
```

### 应包含的 Evaluators

```text
evaluators/
├── aireq-evaluator/
└── sysreq-evaluator/
```

### 应包含的 Templates

```text
templates/
├── ai-requirement-template.md
├── system-requirement-template.md
├── requirements-review-template.md
└── requirements-change-impact-template.md
```

### 输入

```text
- 用户口头需求
- PRD
- issue
- bug report
- existing requirement docs
- business goals
```

### 输出

```text
docs/requirements/
├── ai-requirements.md
├── system-requirements.md
├── requirements-review-report.md
└── requirements-change-impact.md
```

### 独立性要求

即使没有其他五个 Plugin，它也能完整完成：

```text
需求收集 → 结构化需求 → 系统需求 → 质量评审
```

---

## 2. 方案设计 Plugin

### 名称建议

```text
solution-design-plugin
```

中文名：

```text
方案设计 Plugin
```

### 核心职责

把需求转化为系统设计、架构设计、接口设计、子系统设计和技术约束。

当前对应：

```text
design-spec
subsystem-design-spec
sysdesign-evaluator
subsystem-evaluator
doc-quality-evaluator
```

### 应包含的 Skills

```text
skills/
├── solution-design/
├── design-spec/
├── subsystem-design-spec/
├── api-contract-design/
├── architecture-review/
├── design-change-analysis/
├── doc-consistency-check/
├── session-context/
└── using-solution-design-plugin/
```

#### `solution-design`

新的入口 Skill，负责判断当前输入：

| 输入 | 行为 |
|---|---|
| 有 system requirements | 直接设计 |
| 只有 PRD | 先提炼最低限度系统需求，再设计 |
| 只有用户想法 | 做轻量需求澄清后设计 |
| 有旧设计 + 变更 | 进入 `design-change-analysis` |

#### `design-spec`

保留当前系统设计能力，输出：

```text
- 系统上下文
- 架构目标
- 模块划分
- 关键流程
- 数据模型
- API 设计
- 安全设计
- 可观测性设计
- 可靠性设计
- 性能设计
- 部署设计
- 风险分析
```

#### `subsystem-design-spec`

保留当前子系统设计能力。每个子系统输出：

```text
- 子系统职责
- 输入输出
- 内部模块
- 数据结构
- API / Event / Job
- 错误处理
- 状态机
- 边界条件
- FMEA
- 测试建议
```

#### `api-contract-design`

建议新增。当前 `design-spec` 中包含 OpenAPI，拆分后独立 Plugin 最好显式提供 API 契约能力。

输出：

```text
openapi.yaml
asyncapi.yaml
event-contracts.md
```

#### `architecture-review`

设计质量门前置评审，检查：

```text
- 是否满足需求
- 是否存在不可实现设计
- 是否模块边界混乱
- 是否 API 契约缺失
- 是否安全方案缺失
- 是否可靠性策略缺失
- 是否可测试性不足
```

#### `design-change-analysis`

用于增量设计，输入旧设计和新需求，输出：

```text
- 受影响模块
- 受影响 API
- 受影响数据结构
- 受影响测试
- 兼容性风险
```

#### `doc-consistency-check`

承接当前 `doc-quality-evaluator` 的交叉文档一致性能力。

### 应包含的 Evaluators

```text
evaluators/
├── sysdesign-evaluator/
├── subsystem-evaluator/
└── doc-quality-evaluator/
```

### 应包含的 Templates

```text
templates/
├── system-design-template.md
├── subsystem-design-template.md
├── openapi-template.yaml
├── asyncapi-template.yaml
├── architecture-review-template.md
├── fmea-template.md
└── design-change-impact-template.md
```

### 输入

```text
- system-requirements.md
- ai-requirements.md
- PRD
- existing architecture docs
- existing API specs
```

### 输出

```text
docs/design/
├── system-design.md
├── openapi.yaml
├── asyncapi.yaml
├── subsystem-xxx-design.md
├── architecture-review-report.md
└── doc-consistency-report.md
```

### 独立性要求

即使没有需求梳理 Plugin，也可以从 PRD 或用户描述中生成设计。

---

## 3. 任务拆解 Plugin

### 名称建议

```text
task-planning-plugin
```

中文名：

```text
任务拆解 Plugin
```

### 核心职责

把方案设计或需求文档拆成可执行任务、任务图、开发顺序、并行策略、交付检查点。

当前主要对应：

```text
writing-plans
subagent-driven-development 的规划部分
using-git-worktrees 的规划部分
```

### 应包含的 Skills

```text
skills/
├── task-planning/
├── writing-plans/
├── task-graph-generation/
├── execution-strategy-selection/
├── subagent-dispatch-planning/
├── worktree-planning/
├── milestone-planning/
├── session-context/
└── using-task-planning-plugin/
```

#### `task-planning`

新的入口 Skill，负责从以下输入中拆任务：

```text
- system-design.md
- subsystem-design.md
- system-requirements.md
- issue
- PRD
- bug report
```

#### `writing-plans`

保留当前实现计划能力，输出：

```text
- Implementation Plan
- Step-by-step Tasks
- File-level Change Plan
- Risk Points
- Verification Plan
```

#### `task-graph-generation`

新增，把线性计划转成任务依赖图：

```text
Task A → Task B → Task C
Task A → Task D
Task D → Task E
```

每个任务包含：

```text
- 任务目标
- 输入
- 输出
- 依赖
- 预计修改文件
- 验收标准
- 测试要求
```

#### `execution-strategy-selection`

承接当前 `writing-plans` 中让用户选择执行方式的逻辑。

输出两种执行建议：

| 模式 | 对应后续 |
|---|---|
| Subagent-Driven | 推荐用于多模块、多文件、多任务 |
| Inline Execution | 推荐用于小型改动 |

拆分后它不直接执行，只产出建议。

#### `subagent-dispatch-planning`

从当前 `subagent-driven-development` 中抽出“如何分配任务”的规划部分。

输出：

```text
- subagent task package
- review checkpoint
- merge checkpoint
- conflict strategy
```

#### `worktree-planning`

从 `using-git-worktrees` 中抽出规划能力，决定：

```text
- 是否需要 worktree
- 每个 worktree 的任务范围
- 分支命名建议
- 合并顺序
```

#### `milestone-planning`

新增，用于较大项目。

输出：

```text
M1: 基础结构
M2: 核心功能
M3: 测试补齐
M4: 集成验证
M5: 发布准备
```

### 应包含的 Templates

```text
templates/
├── implementation-plan-template.md
├── task-graph-template.md
├── subagent-task-template.md
├── milestone-plan-template.md
├── execution-strategy-template.md
└── worktree-plan-template.md
```

### 输入

```text
- system-design.md
- subsystem-design.md
- system-requirements.md
- issue
- bug report
```

### 输出

```text
docs/plans/
├── implementation-plan.md
├── task-graph.md
├── milestone-plan.md
├── subagent-dispatch-plan.md
├── worktree-plan.md
└── execution-strategy.md
```

### 独立性要求

即使没有方案设计 Plugin，它也可以基于 issue、PRD、用户描述生成可执行计划。

---

## 4. 测试生成 Plugin

### 名称建议

```text
test-generation-plugin
```

中文名：

```text
测试生成 Plugin
```

### 核心职责

从需求、设计、任务计划中生成测试策略、测试用例和测试代码草稿。

当前主要对应：

```text
test-code-generator
test-driven-development 的 test-first 部分
system-requirement-analysis 里的 Given-When-Then 场景
```

### 应包含的 Skills

```text
skills/
├── test-generation/
├── test-strategy-generation/
├── test-case-generation/
├── test-code-generator/
├── acceptance-test-generation/
├── regression-test-generation/
├── edge-case-test-generation/
├── test-coverage-review/
├── session-context/
└── using-test-generation-plugin/
```

#### `test-generation`

新的入口 Skill，根据输入判断生成哪种测试：

| 输入 | 输出 |
|---|---|
| system requirements | 验收测试 / 行为测试 |
| design spec | 集成测试 / 契约测试 |
| task plan | 单元测试 / 任务级测试 |
| bug report | 回归测试 |
| existing code | 覆盖率补全测试 |

#### `test-strategy-generation`

生成测试策略：

```text
- 单元测试
- 集成测试
- 契约测试
- 端到端测试
- 回归测试
- 性能测试
- 安全测试
```

#### `test-case-generation`

从 REQ 的 Given-When-Then 生成测试用例。

输出：

```text
TC-XXX
Given
When
Then
Priority
Type
Requirement Trace
```

#### `test-code-generator`

保留当前能力。拆分后应增强为可独立生成：

```text
- unit tests
- integration test skeletons
- contract tests
- regression tests
- fixtures
- mocks
```

#### `acceptance-test-generation`

从需求生成验收测试。

#### `regression-test-generation`

从 bug report 或变更影响分析生成回归测试。

#### `edge-case-test-generation`

补充边界、异常、安全、权限、并发、幂等类测试。

#### `test-coverage-review`

检查生成的测试是否覆盖：

```text
- 正常路径
- 异常路径
- 边界条件
- 权限
- 数据一致性
- 并发
- 回滚
- 超时
- 外部依赖失败
```

### 应包含的 Templates

```text
templates/
├── test-strategy-template.md
├── test-case-template.md
├── unit-test-template.md
├── integration-test-template.md
├── contract-test-template.md
├── regression-test-template.md
└── test-coverage-review-template.md
```

### 输入

```text
- system-requirements.md
- system-design.md
- subsystem-design.md
- implementation-plan.md
- bug report
- existing code
```

### 输出

```text
docs/tests/
├── test-strategy.md
├── test-cases.md
├── acceptance-tests.md
├── regression-tests.md
├── coverage-review.md
└── generated-test-code/
```

### 独立性要求

即使没有其他 Plugin，它也能根据已有代码或用户描述生成测试方案和测试代码。

---

## 5. TDD 编码 Plugin

### 名称建议

```text
tdd-development-plugin
```

中文名：

```text
TDD 编码 Plugin
```

### 核心职责

执行开发任务，遵循测试优先、最小实现、重构、质量检查、代码审查。

当前主要对应：

```text
test-driven-development
executing-plans
subagent-driven-development 的执行部分
systematic-debugging
code-compliance-check
requesting-code-review
using-git-worktrees
spec-commit
```

### 应包含的 Skills

```text
skills/
├── tdd-implementation/
├── test-driven-development/
├── executing-plans/
├── subagent-driven-development/
├── systematic-debugging/
├── code-compliance-check/
├── requesting-code-review/
├── using-git-worktrees/
├── implementation-review/
├── spec-commit/
├── session-context/
└── using-tdd-development-plugin/
```

#### `tdd-implementation`

新的入口 Skill，支持输入：

```text
- implementation-plan.md
- task-graph.md
- test-cases.md
- generated tests
- issue
- bug report
```

#### `test-driven-development`

保留当前 TDD 主流程：

```text
Red → Green → Refactor
```

要求：

```text
1. 先写失败测试
2. 运行测试确认失败
3. 写最小代码
4. 运行测试通过
5. 重构
6. 再运行测试
```

#### `executing-plans`

保留 inline 执行能力。

#### `subagent-driven-development`

保留并行开发能力，但职责限定为“执行”，不再负责前期任务拆解。

#### `systematic-debugging`

保留排障能力，适用于：

```text
- 测试失败
- bug 修复
- CI 失败
- 回归问题
```

#### `code-compliance-check`

保留编码规范检查。

#### `requesting-code-review`

保留代码审查子代理调用能力。

#### `using-git-worktrees`

保留隔离开发能力。

#### `implementation-review`

新增，开发完成后的实现自检：

```text
- 是否按任务实现
- 是否有未使用代码
- 是否过度设计
- 是否缺测试
- 是否破坏既有行为
```

#### `spec-commit`

保留提交能力，但需适配独立 Plugin。

### 应包含的 Rules

```text
rules/
├── coding-standards/
├── commit-standards/
├── tdd-rules/
└── code-review-rules/
```

### 应包含的 Templates

```text
templates/
├── tdd-cycle-template.md
├── debugging-report-template.md
├── code-review-request-template.md
├── code-compliance-report-template.md
└── commit-message-template.md
```

### 输入

```text
- task-graph.md
- implementation-plan.md
- test-cases.md
- generated tests
- issue
- bug report
```

### 输出

```text
- code changes
- unit tests
- passing local tests
- debugging report
- code compliance report
- code review report
- git commit / branch changes
```

### 独立性要求

即使没有前置 Plugin，它也可以根据用户 issue 或 bug report 完成 TDD 开发。

---

## 6. 集成测试 Plugin

### 名称建议

```text
integration-verification-plugin
```

中文名：

```text
集成测试 Plugin
```

### 核心职责

在开发完成后执行集成测试、回归验证、质量门检查、发布前验证和分支收尾。

当前主要对应：

```text
verification-before-completion
finishing-a-development-branch
code-compliance-check
requesting-code-review
systematic-debugging
spec-commit
```

### 应包含的 Skills

```text
skills/
├── integration-verification/
├── verification-before-completion/
├── integration-test-runner/
├── regression-verification/
├── contract-verification/
├── e2e-verification/
├── release-readiness-check/
├── finishing-a-development-branch/
├── code-compliance-check/
├── requesting-code-review/
├── systematic-debugging/
├── spec-commit/
├── session-context/
└── using-integration-verification-plugin/
```

#### `integration-verification`

新的入口 Skill，负责统一集成验证流程。

#### `verification-before-completion`

保留当前完成前验证能力。

检查：

```text
- 测试是否通过
- lint 是否通过
- 类型检查是否通过
- build 是否通过
- 需求是否满足
- 是否有未提交变更
- 是否存在调试代码
```

#### `integration-test-runner`

新增，专门运行集成测试。

#### `regression-verification`

新增，运行回归验证。

#### `contract-verification`

新增，验证 API / Event 契约。

#### `e2e-verification`

新增，运行端到端测试。

#### `release-readiness-check`

新增，发布前检查：

```text
- 版本号
- changelog
- migrations
- feature flags
- rollback plan
- monitoring
- alerting
- known issues
```

#### `finishing-a-development-branch`

保留分支收尾流程。

#### `systematic-debugging`

当集成测试失败时进行证据优先排障。

#### `spec-commit`

保留提交、push、MR / PR 创建能力。

### 应包含的 Evaluators

```text
evaluators/
└── doc-quality-evaluator/
```

用于最终交付前检查文档与实现是否一致。

### 应包含的 Templates

```text
templates/
├── integration-test-report-template.md
├── regression-report-template.md
├── contract-verification-report-template.md
├── release-readiness-template.md
├── verification-report-template.md
└── branch-finish-template.md
```

### 输入

```text
- code changes
- test cases
- generated tests
- system-design.md
- openapi.yaml
- implementation-plan.md
- CI logs
```

### 输出

```text
docs/verification/
├── integration-test-report.md
├── regression-report.md
├── contract-verification-report.md
├── release-readiness-report.md
└── final-verification-report.md
```

以及：

```text
- passing build
- passing integration tests
- passing regression tests
- ready-to-merge branch
- commit / PR / MR
```

### 独立性要求

即使没有其他 Plugin，它也可以基于当前代码仓库独立运行测试、验证和发布前检查。

---

## 四、推荐仓库拆分结构

建议拆分为六个独立仓库或六个独立包：

```text
cospowers-requirements-plugin/
cospowers-solution-design-plugin/
cospowers-task-planning-plugin/
cospowers-test-generation-plugin/
cospowers-tdd-development-plugin/
cospowers-integration-verification-plugin/
```

每个仓库内部统一结构：

```text
.
├── CLAUDE.md
├── README.zh.md
├── plugin.json
├── skills/
├── rules/
├── templates/
├── evaluators/
└── examples/
```

---

## 五、跨 Plugin 交付物契约

为了保证六个 Plugin 可组合但不耦合，建议定义统一文档契约。

### 1. 需求梳理 → 方案设计

```text
docs/requirements/ai-requirements.md
docs/requirements/system-requirements.md
```

### 2. 方案设计 → 任务拆解

```text
docs/design/system-design.md
docs/design/openapi.yaml
docs/design/subsystem-*-design.md
```

### 3. 任务拆解 → 测试生成 / TDD 编码

```text
docs/plans/implementation-plan.md
docs/plans/task-graph.md
docs/plans/execution-strategy.md
```

### 4. 测试生成 → TDD 编码 / 集成测试

```text
docs/tests/test-strategy.md
docs/tests/test-cases.md
docs/tests/generated-test-code/
```

### 5. TDD 编码 → 集成测试

```text
code changes
unit tests
local verification result
code compliance report
code review report
```

### 6. 集成测试 → 最终交付

```text
docs/verification/final-verification-report.md
release-readiness-report.md
PR / MR / commit
```

---

## 六、原始 Pipeline 到新 Plugin 的映射

### 原始创新应用流程

```text
brainstorming
→ writing-plans
→ subagent-driven-development / executing-plans
→ test-driven-development
→ verification-before-completion
→ spec-commit
```

### 拆分后

```text
方案设计 Plugin
→ 任务拆解 Plugin
→ 测试生成 Plugin
→ TDD 编码 Plugin
→ 集成测试 Plugin
```

---

### 原始增量项目 A：无需求文档

```text
brainstorming
→ requirement-analysis
→ system-requirement-analysis
→ design-spec
→ subsystem-design-spec
→ writing-plans
→ execution
→ spec-commit
```

### 拆分后

```text
需求梳理 Plugin
→ 方案设计 Plugin
→ 任务拆解 Plugin
→ 测试生成 Plugin
→ TDD 编码 Plugin
→ 集成测试 Plugin
```

---

### 原始增量项目 B：已有需求文档

```text
brainstorming
→ system-requirement-analysis
→ design-spec
→ subsystem-design-spec
→ writing-plans
→ execution
→ spec-commit
```

### 拆分后

```text
需求梳理 Plugin
→ 方案设计 Plugin
→ 任务拆解 Plugin
→ 测试生成 Plugin
→ TDD 编码 Plugin
→ 集成测试 Plugin
```

其中需求梳理 Plugin 可跳过 `requirement-analysis`，直接执行 `system-requirement-analysis`。

---

### 原始排障流程

```text
brainstorming
→ systematic-debugging
→ test-driven-development
→ verification-before-completion
→ spec-commit
```

### 拆分后

```text
TDD 编码 Plugin
→ 集成测试 Plugin
```

如需补充回归测试：

```text
测试生成 Plugin
→ TDD 编码 Plugin
→ 集成测试 Plugin
```

---

## 七、需要复制或下沉的公共能力

为了保证每个 Plugin 独立，应把以下公共能力复制或下沉到每个 Plugin：

```text
- session-context：上下文恢复
- using-xxx-plugin：当前 Plugin 使用说明
- README.zh.md：中文人类说明
- CLAUDE.md：当前 Plugin 的 Agent 行为约束
- rules/common：通用术语、文档格式、交付物命名
- templates/common：基础文档头、追踪矩阵格式
```

TDD 编码 Plugin 和集成测试 Plugin 还需要：

```text
- coding-standards
- commit-standards
- git workflow rules
- code review rules
```

---

## 八、建议迁移步骤

### Step 1：冻结现有 Plugin

```text
- 给当前 cospowers 打 tag
- 标记为 monolith workflow plugin
- 不再直接新增大型能力
```

### Step 2：抽取公共规范

```text
- Skill 标识规范
- README.zh.md 规范
- CLAUDE.md 规范
- templates 引用规范
- rules/coding-standards 引用规范
- evaluator 调用规范
```

### Step 3：先拆需求梳理和方案设计

优先拆：

```text
requirements-plugin
solution-design-plugin
```

原因：它们是上游，影响后续所有流程。

### Step 4：拆任务拆解 Plugin

抽取：

```text
writing-plans
subagent-driven-development 的规划部分
using-git-worktrees 的规划部分
```

### Step 5：拆测试生成 Plugin

抽取并增强：

```text
test-code-generator
Given-When-Then → test case 的转换逻辑
```

### Step 6：拆 TDD 编码 Plugin

抽取：

```text
test-driven-development
executing-plans
subagent-driven-development 的执行部分
systematic-debugging
code-compliance-check
requesting-code-review
using-git-worktrees
spec-commit
```

### Step 7：拆集成测试 Plugin

抽取：

```text
verification-before-completion
finishing-a-development-branch
code-compliance-check
requesting-code-review
systematic-debugging
spec-commit
```

并新增：

```text
integration-test-runner
regression-verification
contract-verification
e2e-verification
release-readiness-check
```

### Step 8：补齐跨 Plugin examples

每个 Plugin 至少提供：

```text
examples/
├── minimal-input.md
├── full-input.md
├── expected-output.md
└── handoff-to-next-plugin.md
```

---

## 九、拆分后的最终能力矩阵

| 能力 | 需求梳理 | 方案设计 | 任务拆解 | 测试生成 | TDD 编码 | 集成测试 |
|---|---:|---:|---:|---:|---:|---:|
| 原始想法理解 | ✅ | ✅ 轻量 | ✅ 轻量 | ✅ 轻量 | ✅ 轻量 | ✅ 轻量 |
| PRD 解析 | ✅ | ✅ | ✅ | ✅ | 可选 | 可选 |
| AI Requirement | ✅ | 可读 | 可读 | 可读 | 可读 | 可读 |
| System Requirement | ✅ | 可读/可补 | 可读 | 可读 | 可读 | 可读 |
| 系统设计 | - | ✅ | 可读 | 可读 | 可读 | 可读 |
| 子系统设计 | - | ✅ | 可读 | 可读 | 可读 | 可读 |
| API 契约 | - | ✅ | 可读 | 可读 | 可读 | ✅ 验证 |
| 任务计划 | - | - | ✅ | 可读 | ✅ 执行 | 可读 |
| 测试策略 | - | 建议 | 建议 | ✅ | 可读 | ✅ 执行 |
| 测试代码生成 | - | - | - | ✅ | ✅ 使用/补充 | ✅ 使用 |
| TDD 编码 | - | - | - | - | ✅ | 可触发修复 |
| 调试排障 | - | - | 可计划 | 可补测试 | ✅ | ✅ |
| 代码检查 | - | - | - | - | ✅ | ✅ |
| 集成测试 | - | - | - | 生成用例 | 可运行局部 | ✅ |
| 发布前验证 | - | - | - | - | 可选 | ✅ |
| 提交 / PR | - | - | - | - | ✅ | ✅ |

---

## 十、结论

推荐将当前 `cospowers` 拆成以下六个独立 Plugin：

```text
1. cospowers-requirements-plugin
2. cospowers-solution-design-plugin
3. cospowers-task-planning-plugin
4. cospowers-test-generation-plugin
5. cospowers-tdd-development-plugin
6. cospowers-integration-verification-plugin
```

拆分后：

- 每个 Plugin 都有自己的入口 skill；
- 每个 Plugin 都能单独处理用户输入；
- Plugin 之间通过标准文档交付物衔接；
- 当前 23 个核心 skills 和 5 个质量门 evaluator 均被覆盖；
- 原有创新应用、增量项目 A、增量项目 B、排障四类流程均可被新架构表达；
- 后续可以独立维护、独立发布、独立测试、独立演进。
