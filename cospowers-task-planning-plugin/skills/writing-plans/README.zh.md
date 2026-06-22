# Writing Plans — 中文参考说明

> 本文件仅供人阅读，不加入 AI 上下文。AI 使用的是同目录下的 `SKILL.md`（英文）。

## 概述

编写详尽的实施计划，假设执行者对代码库零上下文。记录每个任务需要知道的一切：哪些文件、具体代码、测试方法、相关文档。将计划拆分为小粒度任务。原则：DRY、YAGNI、TDD、频繁提交。

**计划保存位置：**
- System mode：`docs/plans/YYYY-MM-DD-<feature-name>.md`
- Subsystem mode：`docs/plans/YYYY-MM-DD-<project>/<feature-name>-<service-name>-plan.md`
- 用户偏好优先

## 代码风格分析（写计划前必须执行）

在编写任何实施任务之前，**必须**先分析当前项目的代码风格和约定。计划中的代码示例必须匹配已有代码库 — 不是 AI 的默认风格。

### 4 步分析流程

1. **识别语言和框架** — 查看 `*.py`/`*.go`/`*.js`、`pyproject.toml`/`go.mod`/`package.json`
2. **学习代码约定** — 读 3-5 个代表性文件，学习：

| 约定 | 关注点 |
|------|--------|
| 命名风格 | snake_case vs camelCase，前缀模式 |
| 文件组织 | 每文件一个类？模块结构？ |
| 导入风格 | 绝对 vs 相对，分组顺序 |
| 错误处理 | 自定义异常？错误码？ |
| 日志模式 | 日志框架、格式、级别 |
| 测试模式 | 框架、fixture、mock 方式、文件命名 |
| API 模式 | 路由注册、序列化、中间件 |
| 数据库 | ORM vs 原生 SQL，迁移框架 |
| 注释/文档 | 风格、语言、详细程度 |

3. **检查项目标准** — `.editorconfig`、`.pylintrc`、`pyproject.toml` 等配置
4. **在计划头部记录约定** — 添加 Conventions 章节，所有代码示例必须遵循

## 范围检查

如果规格覆盖多个独立子系统，建议拆分为独立计划——每个计划产出可独立工作和测试的软件。

## 文件结构

在定义任务之前，先列出将创建或修改的文件及其职责：
- 设计边界清晰、接口明确的单元
- 偏好小而聚焦的文件
- 一起变更的文件放在一起
- 遵循现有代码库的模式

## 任务粒度

**每步一个动作（2-5 分钟）：**

1. 编写失败测试 — 一步
2. 运行确认失败 — 一步
3. 编写最少代码使测试通过 — 一步
4. 运行确认通过 — 一步
5. 提交 — 一步

## 计划文档头部（必填）

```markdown
# [功能名] Implementation Plan

> **For downstream implementation:** Hand this plan to `tdd-implementation` or another execution environment. This planning plugin does not execute tasks.

**Goal:** [一句话描述构建目标]
**Architecture:** [2-3 句话描述方法]
**Tech Stack:** [关键技术/库]
```

## 任务结构

每个任务包含：
- **Files** — 创建/修改/测试的精确文件路径
- **步骤** — 使用 `- [ ]` 复选框语法，包含完整代码块
- **验证** — 精确命令和预期输出
- **提交** — 具体的 git add 和 commit 命令

## 禁止占位符

以下内容是计划失败，绝不能出现：

| 禁止写法 | 原因 |
|---------|------|
| "TBD"、"TODO"、"后续实现" | 未完成的计划 |
| "添加适当的错误处理" | 没有具体代码 |
| "写上面的测试"（无实际测试代码） | 空洞指令 |
| "类似任务 N" | 执行者可能不按顺序读 |
| 描述做什么但不展示怎么做 | 缺少代码块 |

## 自审

计划完成后，对照规格重新检查：

1. **规格覆盖** — 每个需求都能指向对应任务？
2. **占位符扫描** — 搜索上述红旗模式
3. **类型一致性** — 后续任务的类型、方法签名与前面定义一致？
4. **风格一致性** — 所有代码示例都遵循计划头部记录的代码约定？命名风格、导入方式、错误处理模式都与现有代码库一致？

## 质量门禁

计划完成并自审后，先派遣本地 `plan-evaluator` 进行被动评估，再进入下游交接。

- 评估器使用 `skills/plan-evaluator/agents/evaluator-dispatch-prompt.md` 作为派遣模板。
- 评级 A/B（≥ 80）时，把质量报告路径写入 Downstream Handoff。
- 评级 C/D/F 时，只修复评估器列出的 Critical 和 Error 问题，最多重新评估 2 轮；仍未通过时交给用户人工介入。

## 执行交接

本拆分插件止步于规划，不直接调用执行 skill。计划末尾应包含 Downstream Handoff，说明：

- 推荐下游插件：`cospowers-tdd-development-plugin` / `tdd-implementation`
- 输入：实施计划、质量报告、任务图（如有）、测试策略或测试用例（如有）
- 执行策略建议：独立任务可 subagent-driven，紧耦合或小改动可 inline execution
- 明确声明本插件未执行代码或测试

## 下一步

- 将通过质量门禁的计划交给 `tdd-implementation` 或其他执行环境。
- 如果质量门禁未通过，先根据评估报告修复计划再交接。
