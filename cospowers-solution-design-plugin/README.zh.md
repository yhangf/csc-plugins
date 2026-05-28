# cospowers Solution Design（方案设计 Plugin）

AI 驱动的方案设计插件：从需求、PRD 或现有系统上下文生成系统设计、子系统设计和 API 契约。

## 什么时候使用

当任务属于 **方案设计 Plugin** 范围时，直接调用入口 skill：

```text
solution-design
```

## 独立性

本插件可单独安装和运行。它可以消费上游插件产出的标准文档，但不要求上游插件存在；如果没有标准文档，也可以从用户描述、issue、PRD、bug report 或当前仓库上下文开始工作。

## 主要 Skills

- `design-spec`
- `subsystem-design-spec`
- `session-context`
- `sysdesign-evaluator`
- `subsystem-evaluator`
- `doc-quality-evaluator`
- `solution-design`
- `api-contract-design`
- `architecture-review`
- `design-change-analysis`
- `doc-consistency-check`
- `using-solution-design-plugin`

## 输出交付物

- `docs/design/system-design.md`
- `docs/design/openapi.yaml`
- `docs/design/asyncapi.yaml`
- `docs/design/subsystem-xxx-design.md`
- `docs/design/architecture-review-report.md`
- `docs/design/doc-consistency-report.md`

## 交接到下一插件

建议下一步：`cospowers-task-planning-plugin / task-planning`。

交接方式是标准文档文件，而不是隐式 skill 依赖。即使下一插件未安装，也可以把本插件输出文件手动提供给其他流程。

## 注意

本插件不再使用旧版全局中央路由。不要先调用 `brainstorming`；请直接调用 `solution-design`。
