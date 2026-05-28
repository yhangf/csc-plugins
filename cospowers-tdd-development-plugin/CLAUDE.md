# cospowers TDD Development — TDD 编码 Plugin

## If You Are an AI Agent

Skills are behavior code. Before modifying this plugin, read the complete `SKILL.md` for every skill you touch.

## Plugin Scope

- Local entry skill: `tdd-implementation`
- Usage skill: `using-tdd-development-plugin`
- It must work without the old monolithic `brainstorming` router.
- It must not require another split cospowers plugin to be installed.
- It may read standard handoff documents from other plugins when the user provides them.

## Skill Authoring Rules

1. `SKILL.md` is English and loaded into AI context.
2. `README.zh.md` is Chinese and human-facing.
3. Every skill must have a `Skill 标识` block after the H1 title.
4. Coding skills must reference this plugin's local `rules/coding-standards/` when applicable.
5. Document-generating skills must reference this plugin's local `templates/`.
6. Skills are referenced by bare name only.
7. Do not add a dependency on `brainstorming` or `using-spec-developer`.
8. Do not reference rules, templates, evaluators, or agents outside this plugin root.
