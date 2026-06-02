# cospowers 插件集合

本仓库把 cospowers 拆分成 6 个可以独立安装和使用的插件。每个插件负责研发流程中的一个阶段，并通过标准文档交付物衔接：前一个插件的输出可以作为后一个插件的输入，但它们不是强依赖关系。

## 这套插件用来做什么

这套插件覆盖从需求到验证的完整软件工程流程：

1. 把想法、PRD、issue 或 bug 描述整理成需求。
2. 根据需求生成系统设计、子系统设计和 API 契约。
3. 把需求和设计拆成可执行的任务、里程碑和执行策略。
4. 根据需求、设计或计划生成测试策略、测试用例和测试代码草稿。
5. 按 TDD（测试驱动开发）方式完成编码、调试和实现评审。
6. 在完成前做集成测试、回归验证、契约验证、E2E 验证和发布前检查。

## 插件目录总览

| 插件目录 | 入口 skill | 主要功能 | 常见输出 |
| --- | --- | --- | --- |
| `cospowers-requirements-plugin/` | `requirements-intake` | 需求梳理、需求分析、系统需求分析、需求评审、需求变更影响分析。 | `docs/requirements/ai-requirements.md`、`docs/requirements/system-requirements.md`、需求评审报告、需求变更影响报告。 |
| `cospowers-solution-design-plugin/` | `solution-design` | 系统设计、子系统设计、API 契约设计、架构评审、设计变更分析、文档一致性检查。 | `docs/design/system-design.md`、`docs/design/openapi.yaml`、`docs/design/asyncapi.yaml`、子系统设计和架构评审报告。 |
| `cospowers-task-planning-plugin/` | `task-planning` | 实施计划、任务依赖图、执行策略、subagent 分工、worktree 规划、里程碑规划。 | `docs/plans/implementation-plan.md`、`docs/plans/task-graph.md`、`docs/plans/milestone-plan.md`、执行策略和分工计划。 |
| `cospowers-test-generation-plugin/` | `test-generation` | 测试策略、测试用例、验收测试、回归测试、边界测试、测试覆盖审查、测试代码草稿。 | `docs/tests/test-strategy.md`、`docs/tests/test-cases.md`、验收测试、回归测试、覆盖审查和测试代码草稿。 |
| `cospowers-tdd-development-plugin/` | `tdd-implementation` | TDD 编码、计划执行、系统化调试、代码规范检查、实现评审、代码审查请求和结构化提交。 | 代码变更、单元测试、本地测试结果、调试报告、代码规范检查报告和实现评审结果。 |
| `cospowers-integration-verification-plugin/` | `integration-verification` | 集成验证、回归验证、契约验证、E2E 验证、发布就绪检查、最终验证和分支收尾。 | `docs/verification/integration-test-report.md`、回归验证报告、契约验证报告、发布就绪报告和最终验证报告。 |

## 推荐工作流

完整流程如下：

```text
需求梳理 → 方案设计 → 任务拆解 → 测试生成 → TDD 编码 → 集成验证
```

对应入口 skills：

```text
requirements-intake
solution-design
task-planning
test-generation
tdd-implementation
integration-verification
```

你可以按完整流程逐步使用，也可以只安装和使用其中一个插件。例如：

- 只有一个产品想法时，从 `requirements-intake` 开始。
- 已经有需求文档时，可以直接从 `solution-design` 或 `task-planning` 开始。
- 已经有实现计划时，可以直接使用 `test-generation` 或 `tdd-implementation`。
- 功能已经开发完成时，可以直接使用 `integration-verification` 做最终检查。

## 输入和输出如何衔接

每个插件都可以直接消费用户描述、issue、PRD、bug report 或当前仓库上下文。若上游文档已经存在，推荐按下面方式衔接：

| 上一步输出 | 下一步使用 |
| --- | --- |
| `docs/requirements/ai-requirements.md`、`docs/requirements/system-requirements.md` | 作为 `solution-design` 的输入，生成设计文档和 API 契约。 |
| `docs/design/system-design.md`、`docs/design/subsystem-xxx-design.md`、`docs/design/openapi.yaml` | 作为 `task-planning` 或 `test-generation` 的输入，生成实施计划或测试用例。 |
| `docs/plans/implementation-plan.md`、`docs/plans/task-graph.md` | 作为 `test-generation` 或 `tdd-implementation` 的输入，生成测试或执行开发。 |
| `docs/tests/test-cases.md`、`docs/tests/generated-test-code/` | 作为 `tdd-implementation` 的输入，按 TDD 流程实现功能。 |
| 代码变更、本地测试结果、接口契约和发布检查清单 | 作为 `integration-verification` 的输入，完成最终验证。 |

## 每个插件是否必须一起使用

不需要。每个插件都是独立插件包：

- 可以单独安装和运行。
- 可以直接从用户描述、issue、PRD、bug report 或仓库上下文开始工作。
- 可以使用其他插件产出的标准文档作为输入。
- 插件之间通过文档交接，而不是通过隐式 skill 依赖交接。

## 如何开始

如果你是初次使用，建议先进入对应插件目录阅读它的 `README.zh.md`。每个插件 README 都会说明：

- 插件能做什么。
- 适合什么时候使用。
- 可以输入什么。
- 会输出什么。
- 怎么调用入口 skill。
- 一共有多少个 skills。
- 每个 skill 分别对应什么功能。

常见起步方式：

```text
请根据这个 issue 梳理需求。
```

```text
请根据 docs/requirements/system-requirements.md 生成系统设计。
```

```text
请根据 docs/design/system-design.md 生成实施计划。
```

```text
请根据实现计划生成测试用例。
```

```text
请按 TDD 流程实现这个任务。
```

```text
请对当前分支做集成验证和发布前检查。
```
