# cospowers Requirements（需求梳理 Plugin）

AI 驱动的需求梳理插件：将原始想法、PRD、issue、需求变更转化为结构化需求和系统需求。

## 什么时候使用

当任务属于 **需求梳理 Plugin** 范围时，直接调用入口 skill：

```text
requirements-intake
```

## 独立性

本插件可单独安装和运行。它可以消费上游插件产出的标准文档，但不要求上游插件存在；如果没有标准文档，也可以从用户描述、issue、PRD、bug report 或当前仓库上下文开始工作。

## 主要 Skills

- `requirement-analysis`
- `system-requirement-analysis`
- `session-context`
- `aireq-evaluator`
- `sysreq-evaluator`
- `requirements-intake`
- `requirements-review`
- `requirements-change-analysis`
- `using-requirements-plugin`

## 输出交付物

- `docs/requirements/ai-requirements.md`
- `docs/requirements/system-requirements.md`
- `docs/requirements/requirements-review-report.md`
- `docs/requirements/requirements-change-impact.md`

## 交接到下一插件

建议下一步：`cospowers-solution-design-plugin / solution-design`。

交接方式是标准文档文件，而不是隐式 skill 依赖。即使下一插件未安装，也可以把本插件输出文件手动提供给其他流程。

## 注意

本插件不再使用旧版全局中央路由。不要先调用 `brainstorming`；请直接调用 `requirements-intake`。
