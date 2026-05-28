# cospowers TDD Development（TDD 编码 Plugin）

AI 驱动的 TDD 编码插件：基于任务、测试、issue 或 bug 执行测试优先开发、调试、代码检查和提交。

## 什么时候使用

当任务属于 **TDD 编码 Plugin** 范围时，直接调用入口 skill：

```text
tdd-implementation
```

## 独立性

本插件可单独安装和运行。它可以消费上游插件产出的标准文档，但不要求上游插件存在；如果没有标准文档，也可以从用户描述、issue、PRD、bug report 或当前仓库上下文开始工作。

## 主要 Skills

- `test-driven-development`
- `executing-plans`
- `subagent-driven-development`
- `systematic-debugging`
- `code-compliance-check`
- `requesting-code-review`
- `using-git-worktrees`
- `spec-commit`
- `session-context`
- `tdd-implementation`
- `implementation-review`
- `using-tdd-development-plugin`

## 输出交付物

- `code changes`
- `unit tests`
- `passing local tests`
- `debugging report`
- `code compliance report`
- `code review report`
- `git commit / branch changes`

## 交接到下一插件

建议下一步：`cospowers-integration-verification-plugin / integration-verification`。

交接方式是标准文档文件，而不是隐式 skill 依赖。即使下一插件未安装，也可以把本插件输出文件手动提供给其他流程。

## 注意

本插件不再使用旧版全局中央路由。不要先调用 `brainstorming`；请直接调用 `tdd-implementation`。
