# cospowers Integration Verification（集成测试 Plugin）

AI 驱动的集成验证插件：执行集成测试、回归验证、契约验证、发布前检查和分支收尾。

## 什么时候使用

当任务属于 **集成测试 Plugin** 范围时，直接调用入口 skill：

```text
integration-verification
```

## 独立性

本插件可单独安装和运行。它可以消费上游插件产出的标准文档，但不要求上游插件存在；如果没有标准文档，也可以从用户描述、issue、PRD、bug report 或当前仓库上下文开始工作。

## 主要 Skills

- `verification-before-completion`
- `finishing-a-development-branch`
- `code-compliance-check`
- `requesting-code-review`
- `systematic-debugging`
- `spec-commit`
- `session-context`
- `doc-quality-evaluator`
- `integration-verification`
- `integration-test-runner`
- `regression-verification`
- `contract-verification`
- `e2e-verification`
- `release-readiness-check`
- `using-integration-verification-plugin`

## 输出交付物

- `docs/verification/integration-test-report.md`
- `docs/verification/regression-report.md`
- `docs/verification/contract-verification-report.md`
- `docs/verification/release-readiness-report.md`
- `docs/verification/final-verification-report.md`

## 交接到下一插件

建议下一步：`final delivery / PR / MR / release readiness decision`。

交接方式是标准文档文件，而不是隐式 skill 依赖。即使下一插件未安装，也可以把本插件输出文件手动提供给其他流程。

## 注意

本插件不再使用旧版全局中央路由。不要先调用 `brainstorming`；请直接调用 `integration-verification`。
