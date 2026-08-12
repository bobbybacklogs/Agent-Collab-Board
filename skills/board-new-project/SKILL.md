---
name: board-new-project
description: Scaffold a new project in the Agent Collab Board — create projects/<slug>.md and tasks/<slug>-tasks.md from the templates, wire bidirectional links, register the project in BOARD.md, and establish initial state with executable tasks. Use when asked to add a new project, create a project board, or start tracking new work in this repository.
---

# Board New Project

Scaffold a new project in the Agent Collab Board following the repository's creation procedure.

## When to Use

Use this skill when asked to:

- add a new project to the board;
- create a project file and task board;
- start tracking new work.

## Required Reading First

```text
AGENTS.md
projects/AGENTS.md
tasks/AGENTS.md
projects/_TEMPLATE.md
tasks/_TEMPLATE.md
BOARD.md
```

## Procedure

1. Choose a stable lowercase slug, e.g. `authentication-refresh`.
2. Copy `projects/_TEMPLATE.md` → `projects/<slug>.md`.
3. Replace every placeholder (`<PROJECT_NAME>`, `<PROJECT_SLUG>`, `<PROJECT_ID>`, dates, objective, scope, success criteria, decisions, etc.). Do not leave unresolved placeholders unless the information genuinely cannot be determined yet.
4. Copy `tasks/_TEMPLATE.md` → `tasks/<slug>-tasks.md`.
5. Replace task-board placeholders; set a stable task prefix (e.g. `AUTH-001`).
6. Link bidirectionally:
   - project file → `../BOARD.md` and `../tasks/<slug>-tasks.md`;
   - task board → `../BOARD.md` and `../projects/<slug>.md`.
7. Register the project in `BOARD.md`:
   - add a project card in the correct project-state section;
   - update board badges, the overview table, and the current-focus section if portfolio state changed.
8. Establish initial project status and priority (one primary status; use status badge colors from the templates).
9. Define project-level success criteria that determine when the project is actually complete.
10. Create executable tasks when enough information exists (unique IDs, goals, acceptance criteria, dependencies, validation, next actions).

## Conventions

- Filenames: `projects/<slug>.md`, `tasks/<slug>-tasks.md`. Never `Project-A.md` or `new project.md`.
- Task IDs: stable prefix + sequential number (`AUTH-001`, `AUTH-002`); never reuse IDs; gaps are acceptable.
- Project IDs: short uppercase prefix (`AUTH`, `UIB`, `BAT`).
- Dates: `YYYY-MM-DD`.
- Keep badges synchronized with textual state.
- Do not create a board-only project without its canonical project file, or a task board disconnected from a project.

## After Scaffolding

Update the task board counts, `Last Updated`, and the task activity log, then verify the new project renders (for example, `node ui/lib/cli.js read --project <slug>`).
