# cospowers Plugin 拆分说明

本仓库对cospowers进行拆分，六个独立插件包目录：

1. `cospowers-requirements-plugin/`
2. `cospowers-solution-design-plugin/`
3. `cospowers-task-planning-plugin/`
4. `cospowers-test-generation-plugin/`
5. `cospowers-tdd-development-plugin/`
6. `cospowers-integration-verification-plugin/`

每个插件都有自己的入口 skill，并通过标准文档交付物与其他插件衔接。

