# cospowers Task Planning（任务拆解 Plugin）

这个插件用于把需求、设计、issue 或功能目标拆成可执行的实施计划、任务依赖图、里程碑和执行策略。

## 这个插件能做什么

- 把需求文档或设计文档拆成按顺序执行的开发任务。
- 生成任务依赖图，说明哪些任务必须先做，哪些任务可以并行。
- 制定里程碑，把大功能拆成多个可检查的阶段。
- 选择执行策略，例如串行开发、并行开发、subagent 分工或 git worktree 分支方案。
- 为每个任务补充目标、输入、输出、验收标准和风险点。
- 在编码前把“要做什么、先做什么、做到什么算完成”讲清楚。

## 适合什么时候使用

- 你已经有需求或设计，希望拆成具体开发任务。
- 你准备开始实现一个较大的功能，需要先制定实施计划。
- 你不确定任务之间的依赖关系，想生成任务图。
- 你希望把工作拆给多个 subagent 或多个 worktree 并行推进。
- 你需要制定里程碑，方便分阶段交付和检查。

## 输入和输出

### 可以输入什么

- 需求文档，例如 `docs/requirements/system-requirements.md`。
- 设计文档，例如 `docs/design/system-design.md` 或子系统设计文档。
- issue、功能请求、bug 修复目标或当前仓库上下文。
- 约束条件，例如时间优先、风险优先、必须保持兼容、需要并行开发。
- 已有任务列表、团队分工或分支策略。

### 会输出什么

- `docs/plans/implementation-plan.md`：实施计划，说明要做哪些改动、按什么顺序做、如何验收。
- `docs/plans/task-graph.md`：任务依赖图，说明任务之间的先后和阻塞关系。
- `docs/plans/milestone-plan.md`：里程碑计划，说明每个阶段的目标和完成标准。
- `docs/plans/subagent-dispatch-plan.md`：subagent 分工计划，说明哪些任务适合分配给哪个执行者。
- `docs/plans/worktree-plan.md`：git worktree/并行分支计划，说明哪些工作适合隔离开发。
- `docs/plans/execution-strategy.md`：执行策略，说明推荐采用串行、并行或混合方式推进。

## 怎么使用

入口 skill 是：

```text
task-planning
```

推荐步骤：

1. 准备输入材料。可以提供需求、设计、issue、功能目标或代码上下文。
2. 调用 `task-planning`，说明你希望生成实施计划、任务图、里程碑，还是并行执行方案。
3. 根据插件追问补充约束，例如风险优先级、依赖模块、测试要求、是否需要 subagent 或 worktree。
4. 查看输出计划，确认任务顺序、依赖关系和验收标准是否合理。
5. 如果要继续推进，可以把实施计划交给测试生成或 TDD 开发流程使用。

## Skills 总览（共 9 个）

| Skill | 对应功能 | 适合什么时候用 |
| --- | --- | --- |
| `task-planning` | 入口 skill，把需求或设计拆成实施任务和计划。 | 不确定该用哪个规划 skill 时，从这里开始。 |
| `writing-plans` | 编写编码前的实施计划。 | 需要明确改哪些文件、做哪些步骤、如何验收时使用。 |
| `task-graph-generation` | 生成任务依赖图。 | 需要看清任务先后顺序、阻塞关系和可并行部分时使用。 |
| `execution-strategy-selection` | 选择执行策略。 | 需要判断串行、并行、subagent 或 worktree 哪种方式更合适时使用。 |
| `subagent-dispatch-planning` | 规划 subagent 分工。 | 工作可以拆给多个执行者并行处理时使用。 |
| `worktree-planning` | 规划 git worktree 或并行分支使用方式。 | 多条开发线需要隔离，避免互相影响时使用。 |
| `milestone-planning` | 拆分里程碑和阶段目标。 | 大任务需要分阶段交付、检查或验收时使用。 |
| `session-context` | 整理或总结当前任务规划会话上下文。 | 会话较长，需要保留背景、决策和未解决问题。 |
| `using-task-planning-plugin` | 解释本插件的使用方式和技能边界。 | 不确定本插件能做什么或如何开始时使用。 |

## 推荐工作流

本插件位于完整研发链路的第三步：任务拆解。它通常消费需求和设计文档，并产出可执行计划。

推荐完整流程：

1. 需求梳理：`requirements-intake`
2. 方案设计：`solution-design`
3. 任务拆解：`task-planning`
4. 测试生成：`test-generation`
5. TDD 编码：`tdd-implementation`
6. 集成验证：`integration-verification`

本插件可以单独使用。如果你已经有需求或设计文档，可以把它们作为输入；如果没有，也可以直接提供 issue、功能目标、bug 描述或当前仓库上下文。后续插件不是硬依赖，你也可以把本插件输出的计划手动交给其他流程。

## 常见使用示例

```text
请根据 docs/design/system-design.md 生成实施计划和任务依赖图。
```

```text
请把这个功能拆成里程碑，并说明每个阶段的验收标准。
```

```text
这个任务能否拆给多个 subagent 并行做？请生成分工计划。
```
