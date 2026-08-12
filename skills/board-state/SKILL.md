---
name: board-state
description: Read and report the Agent Collab Board repository state — portfolio overview (BOARD.md), project definitions (projects/*.md), and task boards (tasks/*-tasks.md) — including current focus, active task, blockers, and next action. Use when asked about project status, what to work on next, current focus, or before starting any project work in this repository.
---

# Board State

Understand and report the current state of the Agent Collab Board repository from its files.

## When to Use

Use this skill whenever you are asked to:

- report the current project focus, active task, or next action;
- determine what to work on next;
- summarize a project or task board;
- check blockers or dependencies;
- start any project work in this repository.

## Canonical State Model

Repository state lives in Markdown files, not conversation memory.

```text
BOARD.md                         portfolio: focus, priority, project cards by state
   ↓
projects/<slug>.md               project: objective, success criteria, scope, decisions
   ↓
tasks/<slug>-tasks.md            tasks: workflow groups, acceptance criteria, blockers
   ↓
repository work                  actual implementation
```

Each layer owns specific state; do not duplicate detailed task state in higher layers.

| Information | Canonical Location |
| --- | --- |
| Portfolio summary, focus, priority | `BOARD.md` |
| Project definition, success criteria, decisions | `projects/<slug>.md` |
| Task status, acceptance criteria, blockers | `tasks/<slug>-tasks.md` |
| What is actually implemented | repository files |

## Read Order

Before any project work:

1. Read `AGENTS.md` (repository instructions).
2. Read `BOARD.md`.
3. Identify the current or requested project.
4. Read `projects/<slug>.md`.
5. Read `tasks/<slug>-tasks.md`.
6. Read the applicable scoped `AGENTS.md` under `projects/` or `tasks/`.
7. Inspect repository files relevant to the task.

## CLI Reads

The board CLI prints parsed state as JSON without touching files:

```text
node ui/lib/cli.js read                     # full parsed state (board + projects + task boards)
node ui/lib/cli.js read --board             # BOARD.md portfolio only
node ui/lib/cli.js read --project <slug>    # one project file + its task board
node ui/lib/cli.js read --tasks <slug>      # one task board only
node ui/lib/cli.js read --pretty            # pretty-printed JSON
```

`BOARD_REPO` overrides the repo root if the CLI is invoked from elsewhere.

## What to Report

When asked for a status, report from the files:

- current portfolio focus and primary project (`BOARD.md`);
- project status, progress, and next action (project file);
- active task, its workflow state, blockers, and next task (task board);
- any open blockers and what is required to unblock them.

## Rules

- Repository files are authoritative. If operational Markdown disagrees with repository reality, say so and reconcile from evidence.
- Do not fabricate validation, completion, approvals, or dates.
- Do not rely on chat history when canonical repository state exists.
- Keep reports short and grounded in what the files actually say.
