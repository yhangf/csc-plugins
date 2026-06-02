# cospowers Solution Design（方案设计 Plugin）

这个插件用于把需求、PRD 或现有系统上下文转换成可落地的系统设计、子系统设计、API 契约和架构评审结果。

## 这个插件能做什么

- 根据需求文档或业务描述生成系统设计，说明整体架构、核心模块、数据流和关键决策。
- 为某个模块、服务或子系统生成更细的设计说明。
- 设计 API 契约，例如 OpenAPI、AsyncAPI，用来明确系统之间如何交互。
- 审查架构方案，发现风险、权衡点、缺失的边界条件和质量属性问题。
- 分析设计变更影响，判断改动会影响哪些接口、模块、文档、测试和实现任务。
- 检查设计文档与需求文档、API 文档或子系统文档之间是否一致。

## 适合什么时候使用

- 你已经有需求文档，希望生成系统设计。
- 你需要为某个模块、服务或子系统补充详细设计。
- 你准备开发 API，希望先明确请求、响应、错误码和契约格式。
- 你已经有设计草稿，希望做架构评审或文档一致性检查。
- 设计方案发生变化，需要分析影响范围。

## 输入和输出

### 可以输入什么

- `docs/requirements/ai-requirements.md` 或 `docs/requirements/system-requirements.md`。
- PRD、业务规则、用户故事、issue 或架构背景说明。
- 当前仓库结构、已有代码、已有接口文档或历史设计文档。
- 某个模块、服务、页面、任务流或 API 的设计目标。
- 设计变更说明，例如“从同步调用改成异步事件”。

### 会输出什么

- `docs/design/system-design.md`：系统设计文档，说明整体架构、模块职责、数据流、关键方案和风险。
- `docs/design/openapi.yaml`：HTTP API 契约草稿。
- `docs/design/asyncapi.yaml`：异步消息或事件接口契约草稿。
- `docs/design/subsystem-xxx-design.md`：某个子系统、模块或服务的详细设计。
- `docs/design/architecture-review-report.md`：架构评审报告，记录风险、问题和建议。
- `docs/design/doc-consistency-report.md`：文档一致性检查报告。

## 怎么使用

入口 skill 是：

```text
solution-design
```

推荐步骤：

1. 准备输入材料。最好提供需求文档，也可以直接提供 PRD、issue、设计目标或当前仓库上下文。
2. 调用 `solution-design`，说明你要生成系统设计、子系统设计、API 契约，还是评审已有设计。
3. 根据插件追问补充约束，例如性能、安全、兼容性、部署方式、外部系统依赖。
4. 查看输出的设计文档、API 契约或评审报告，确认方案是否满足需求。
5. 如果要继续推进，可以把设计文档交给任务拆解、测试生成或开发流程使用。

## Skills 总览（共 12 个）

| Skill | 对应功能 | 适合什么时候用 |
| --- | --- | --- |
| `solution-design` | 入口 skill，从需求或系统上下文生成方案设计。 | 不确定该用哪个设计 skill 时，从这里开始。 |
| `design-spec` | 生成或整理系统设计说明。 | 需要整体架构、模块职责、数据流和关键决策时使用。 |
| `subsystem-design-spec` | 生成子系统或模块级详细设计。 | 某个模块、服务或子系统需要更具体的设计时使用。 |
| `api-contract-design` | 设计 API 契约，例如 OpenAPI 或 AsyncAPI。 | 需要明确接口请求、响应、事件、错误码和兼容性时使用。 |
| `architecture-review` | 审查架构决策、风险、权衡和遗漏。 | 已有设计草稿，需要评审可行性和风险时使用。 |
| `design-change-analysis` | 分析设计变更影响。 | 架构、接口、数据流或模块职责发生变化时使用。 |
| `doc-consistency-check` | 检查设计文档与相关文档是否一致。 | 需求、设计、接口文档之间可能不一致时使用。 |
| `sysdesign-evaluator` | 评估系统设计质量。 | 想判断整体设计是否完整、清晰、可落地时使用。 |
| `subsystem-evaluator` | 评估子系统设计质量。 | 想判断模块/服务设计是否足够细、边界是否清楚时使用。 |
| `doc-quality-evaluator` | 评估文档质量。 | 想检查文档结构、表达、可读性和完整性时使用。 |
| `session-context` | 整理或总结当前设计会话上下文。 | 会话较长，需要保留背景、决策和未解决问题。 |
| `using-solution-design-plugin` | 解释本插件的使用方式和技能边界。 | 不确定本插件能做什么或如何开始时使用。 |

## 推荐工作流

本插件位于完整研发链路的第二步：方案设计。它通常消费需求文档，并产出设计文档与 API 契约。

推荐完整流程：

1. 需求梳理：`requirements-intake`
2. 方案设计：`solution-design`
3. 任务拆解：`task-planning`
4. 测试生成：`test-generation`
5. TDD 编码：`tdd-implementation`
6. 集成验证：`integration-verification`

本插件可以单独使用。如果你已经有需求文档，可以把它作为输入；如果没有，也可以直接提供 PRD、issue、业务描述或当前仓库上下文。后续插件不是硬依赖，你也可以把本插件输出的设计文档手动交给其他流程。

## 常见使用示例

```text
请根据 docs/requirements/system-requirements.md 生成系统设计。
```

```text
请为订单模块生成子系统设计，并说明主要接口和数据流。
```

```text
请检查 docs/design/system-design.md 和 openapi.yaml 是否一致。
```
