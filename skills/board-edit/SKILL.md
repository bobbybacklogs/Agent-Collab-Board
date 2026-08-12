---
name: board-edit
description: Make safe, surgical edits to Agent Collab Board Markdown state (BOARD.md, projects/*.md, tasks/*-tasks.md) using the validated op vocabulary through ui/lib/cli.js — updating task status, project state, badges, overview keys, checklist items, or moving tasks between workflow sections — without corrupting unrelated Markdown. Use when a task, project, or board field must change in this repository.
---

# Board Edit

Update board state surgically through the validated op vocabulary. Never hand-rewrite board Markdown.

## When to Use

Use this skill when a field in the board state must change:

- task status / workflow move (`task`);
- task overview keys, badges, checklists, or labeled blocks (`taskKV`, `taskBadge`, `taskLabel`, `taskCheck`);
- project state move on `BOARD.md` (`projectState`);
- project badges, overview keys, labeled blocks, or checklist items (`badge`, `kv`, `label`, `check`);
- section content (`section`).

## Core Rule

Never rewrite a board file wholesale. Make one validated op per concern and let the write layer keep the rest of the file byte-identical.

## CLI

```text
node ui/lib/cli.js validate <target> '<ops-json>'      # check ops without writing
node ui/lib/cli.js apply <target> '<ops-json>'         # validate + write
node ui/lib/cli.js apply <target> '<ops-json>' --dry-run  # preview the result
node ui/lib/cli.js ops                                 # list supported ops
```

`target` is repo-relative: `BOARD.md`, `projects/<slug>.md`, or `tasks/<slug>-tasks.md`.

`ops-json` is a JSON array. Example:

```text
node ui/lib/cli.js apply tasks/ui-dashboard-tasks.md '[{"op":"taskKV","taskId":"UIB-004","key":"Status","value":"Review"}]'
```

## Op Vocabulary

| Op | Purpose | Required fields |
| --- | --- | --- |
| `badge` | Update a shields.io badge in a project/task block | `label`, `value`, `color?` |
| `kv` | Update a `\| **Key** \| value \|` overview row | `key`, `value` |
| `label` | Replace a `**Label**` block's content | `label`, `value` |
| `section` | Replace a heading section's content | `heading`, `value` |
| `projectState` | Move a project card between `BOARD.md` state sections | `title`, `state` |
| `check` | Toggle a checklist item in a project file | `text`, `done` |
| `task` | Move a task between workflow sections | `taskId`, `workflow` |
| `taskKV` | Update a task overview row (scoped to one task) | `taskId`, `key`, `value` |
| `taskBadge` | Update a task badge (scoped) | `taskId`, `label`, `value`, `color?` |
| `taskLabel` | Replace a task labeled block (scoped) | `taskId`, `label`, `value` |
| `taskCheck` | Toggle a task checklist item (scoped) | `taskId`, `text`, `done` |

## Enumerated Values

- Workflows: `Backlog, Ready, In Progress, Blocked, Review, Done`
- Project states: `Planning, Ready, Active, Blocked, Review, Paused, Complete, Archived`
- Priorities: `Low, Medium, High, Critical`

## Safety

- Only `BOARD.md`, `projects/*.md`, and `tasks/*-tasks.md` are writable; anything else is rejected.
- Ops are validated before writing; a write that would not re-parse cleanly is refused.
- Scoped task ops (`task*`) touch only the named task's block.
- Use `--dry-run` or `validate` first for unfamiliar edits.

## Synchronize Upward

After work, update state from the bottom up, only when owned state changed:

```text
repository work
      ↓
task board        (task-level changes)
      ↓
project file      (project-level changes)
      ↓
BOARD.md          (portfolio-level changes)
```

## Guardrails

- Record only validation that actually occurred.
- Keep task IDs and decision IDs stable; never reuse IDs.
- Do not silently change scope, requirements, or acceptance criteria.
- Never store secrets in board Markdown.
- Leave one concrete next action before finishing.
