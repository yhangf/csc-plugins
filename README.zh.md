# cospowers Plugin 拆分说明

本仓库当前保留根目录 monolith 插件作为兼容包，同时新增六个独立插件包目录：

1. `cospowers-requirements-plugin/`
2. `cospowers-solution-design-plugin/`
3. `cospowers-task-planning-plugin/`
4. `cospowers-test-generation-plugin/`
5. `cospowers-tdd-development-plugin/`
6. `cospowers-integration-verification-plugin/`

新插件不再依赖旧版全局 `brainstorming` 中央路由。每个插件都有自己的入口 skill，并通过标准文档交付物与其他插件衔接。

根目录原有 `skills/`、`rules/`、`templates/` 暂不删除，用于兼容已有安装方式。
