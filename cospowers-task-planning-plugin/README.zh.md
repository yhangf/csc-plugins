# cospowers Task Planning（任务拆解 Plugin）

AI 驱动的任务拆解插件：将需求或设计拆解为实现计划、任务图、里程碑和执行策略。

## 什么时候使用

当任务属于 **任务拆解 Plugin** 范围时，直接调用入口 skill：

```text
task-planning
```

## 独立性

本插件可单独安装和运行。它可以消费上游插件产出的标准文档，但不要求上游插件存在；如果没有标准文档，也可以从用户描述、issue、PRD、bug report 或当前仓库上下文开始工作。

## 主要 Skills

- `writing-plans`
- `session-context`
- `task-planning`
- `task-graph-generation`
- `execution-strategy-selection`
- `subagent-dispatch-planning`
- `worktree-planning`
- `milestone-planning`
- `using-task-planning-plugin`

## 输出交付物

- `docs/plans/implementation-plan.md`
- `docs/plans/task-graph.md`
- `docs/plans/milestone-plan.md`
- `docs/plans/subagent-dispatch-plan.md`
- `docs/plans/worktree-plan.md`
- `docs/plans/execution-strategy.md`

## 交接到下一插件

建议下一步：`cospowers-test-generation-plugin / test-generation 或 cospowers-tdd-development-plugin / tdd-implementation`。

交接方式是标准文档文件，而不是隐式 skill 依赖。即使下一插件未安装，也可以把本插件输出文件手动提供给其他流程。

## 注意

本插件不再使用旧版全局中央路由。不要先调用 `brainstorming`；请直接调用 `task-planning`。
