# cospowers Test Generation（测试生成 Plugin）

AI 驱动的测试生成插件：从需求、设计、计划、bug 或代码生成测试策略、测试用例和测试代码草稿。

## 什么时候使用

当任务属于 **测试生成 Plugin** 范围时，直接调用入口 skill：

```text
test-generation
```

## 独立性

本插件可单独安装和运行。它可以消费上游插件产出的标准文档，但不要求上游插件存在；如果没有标准文档，也可以从用户描述、issue、PRD、bug report 或当前仓库上下文开始工作。

## 主要 Skills

- `test-code-generator`
- `session-context`
- `test-generation`
- `test-strategy-generation`
- `test-case-generation`
- `acceptance-test-generation`
- `regression-test-generation`
- `edge-case-test-generation`
- `test-coverage-review`
- `using-test-generation-plugin`

## 输出交付物

- `docs/tests/test-strategy.md`
- `docs/tests/test-cases.md`
- `docs/tests/acceptance-tests.md`
- `docs/tests/regression-tests.md`
- `docs/tests/coverage-review.md`
- `docs/tests/generated-test-code/`

## 交接到下一插件

建议下一步：`cospowers-tdd-development-plugin / tdd-implementation`。

交接方式是标准文档文件，而不是隐式 skill 依赖。即使下一插件未安装，也可以把本插件输出文件手动提供给其他流程。

## 注意

本插件不再使用旧版全局中央路由。不要先调用 `brainstorming`；请直接调用 `test-generation`。
