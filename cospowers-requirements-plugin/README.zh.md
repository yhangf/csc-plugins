# cospowers Requirements（需求梳理 Plugin）

这个插件用于把零散想法、PRD、issue、bug 描述或变更请求整理成清晰、可评审、可交给后续设计使用的需求文档。

## 这个插件能做什么

- 把一句话想法、用户反馈、产品需求文档（PRD）或 issue 梳理成结构化需求。
- 区分“用户/业务需求”和“系统需求”：前者说明用户或业务想要什么，后者说明系统需要具备什么能力。
- 检查需求是否清楚、完整、一致，是否存在遗漏、冲突或风险。
- 分析需求变更会影响哪些功能、文档、设计、测试或实现任务。
- 使用本插件内置的需求模板、检查清单和 DFX（可维护性、可靠性、安全性等质量属性）规则辅助需求整理。

## 适合什么时候使用

- 你只有一个粗略想法，希望先整理成可讨论的需求。
- 你拿到 PRD、issue、客户反馈或 bug report，需要提炼出真正要做的功能。
- 你准备进入方案设计前，需要先补齐用户需求和系统需求。
- 你已经有需求文档，希望检查质量、发现遗漏或不一致。
- 需求发生变化，需要判断影响范围和后续要改哪些内容。

## 输入和输出

### 可以输入什么

- 一段自然语言描述，例如“我想给系统增加批量导入功能”。
- PRD、用户故事、GitHub/GitLab issue、客户反馈、bug report。
- 已有的需求文档或当前仓库上下文。
- 需求变更说明，例如“原来只支持单租户，现在要支持多租户”。
- 业务规则、约束条件、验收标准或非功能要求。

### 会输出什么

- `docs/requirements/ai-requirements.md`：用户/业务需求文档，说明目标、用户场景、业务规则和验收标准。
- `docs/requirements/system-requirements.md`：系统需求文档，说明系统需要提供的能力、约束和质量要求。
- `docs/requirements/requirements-review-report.md`：需求评审报告，指出清晰度、完整性、一致性和风险问题。
- `docs/requirements/requirements-change-impact.md`：需求变更影响分析，说明变更会影响哪些模块、文档、测试和实现工作。

## 怎么使用

入口 skill 是：

```text
requirements-intake
```

推荐步骤：

1. 准备输入材料。可以是一句话想法，也可以是 PRD、issue、bug 描述或已有需求文档。
2. 调用 `requirements-intake`，说明你希望整理新需求、评审需求，还是分析需求变更。
3. 根据插件追问补充背景，例如目标用户、业务规则、边界条件、成功标准。
4. 查看输出的需求文档或评审报告，确认是否符合真实业务意图。
5. 如果要继续推进，可以把需求文档交给方案设计、任务拆解、测试生成或开发流程使用。

## Skills 总览（共 9 个）

| Skill | 对应功能 | 适合什么时候用 |
| --- | --- | --- |
| `requirements-intake` | 入口 skill，把想法、PRD、issue、bug report 或变更请求整理成结构化需求。 | 不确定该用哪个需求 skill 时，从这里开始。 |
| `requirement-analysis` | 分析用户/业务需求，把粗略输入变成更清晰的需求描述。 | 已有想法或业务描述，需要整理成用户需求。 |
| `system-requirement-analysis` | 把用户/业务需求转换成系统层面的能力、约束和质量要求。 | 准备交给方案设计前，需要明确系统必须支持什么。 |
| `requirements-review` | 检查需求的清晰度、完整性、一致性、可验证性和风险。 | 已经有需求文档，需要做质量评审。 |
| `requirements-change-analysis` | 分析需求变更带来的影响。 | 需求范围、规则或验收标准发生变化时使用。 |
| `aireq-evaluator` | 评估用户/AI 需求文档质量。 | 想知道用户需求是否足够清楚、完整、可执行。 |
| `sysreq-evaluator` | 评估系统需求文档质量。 | 想知道系统需求是否覆盖功能、约束和质量属性。 |
| `session-context` | 整理或总结当前需求梳理会话上下文。 | 会话较长，需要保留背景、决策和未解决问题。 |
| `using-requirements-plugin` | 解释本插件的使用方式和技能边界。 | 不确定本插件能做什么或如何开始时使用。 |

## 推荐工作流

本插件位于完整研发链路的第一步：需求梳理。

推荐完整流程：

1. 需求梳理：`requirements-intake`
2. 方案设计：`solution-design`
3. 任务拆解：`task-planning`
4. 测试生成：`test-generation`
5. TDD 编码：`tdd-implementation`
6. 集成验证：`integration-verification`

本插件可以单独使用。如果你已经有上游材料，可以把 PRD、issue、bug report 或已有文档作为输入；如果没有，也可以直接从一句话想法开始。后续插件不是硬依赖，你也可以把本插件输出的标准文档手动交给其他流程。

## 常见使用示例

```text
请根据这个 issue 梳理用户需求和系统需求。
```

```text
请评审 docs/requirements/system-requirements.md，找出不清楚、遗漏或冲突的地方。
```

```text
需求从“单用户导入”改成“批量导入并支持失败重试”，请分析变更影响。
```
