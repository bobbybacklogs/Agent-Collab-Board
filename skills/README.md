# Board Agent Toolkit — Skills Bundle

![Skills](https://img.shields.io/badge/skills-3-0969da)
![Format](https://img.shields.io/badge/format-agent%20skills-238636)
![Platform](https://img.shields.io/badge/platform-cursor%20%7C%20codex%20%7C%20vscode-6e7781)

> One skills bundle, three agent platforms. This directory is the single source for agent skills about the Agent Collab Board; platform wiring points here rather than duplicating content.

---

## Skills

| Skill | Folder | Purpose |
| --- | --- | --- |
| Board State | [`board-state/`](./board-state/) | Read the board: portfolio, projects, task boards, focus, next action |
| Board Edit | [`board-edit/`](./board-edit/) | Surgical, validated edits to board Markdown via the op vocabulary |
| Board New Project | [`board-new-project/`](./board-new-project/) | Scaffold a new project + task board from the templates |

Each skill is a `SKILL.md` with `name` / `description` frontmatter (the shared agent-skills format adopted by Cursor, Codex, and VS Code Copilot).

---

## Quick Start (in this repo)

Agents can use the skills in place:

1. Read `skills/board-state/SKILL.md` before project work.
2. Use the CLI for edits:

   ```text
   node ui/lib/cli.js read --board
   node ui/lib/cli.js apply tasks/<slug>-tasks.md '[{"op":"task","taskId":"TASK-001","workflow":"Done"}]'
   ```

---

## Install Matrix

| Platform | Where skills live | Install |
| --- | --- | --- |
| Cursor | `.cursor/skills/` (project) or `~/.cursor/skills/` (global) | `platform/install-cursor.ps1` or copy `skills/*` manually |
| Codex | `~/.codex/skills/` (global) | `platform/install-codex.ps1` or copy `skills/*` manually |
| VS Code Copilot | `~/.agents/skills/` (global) or `.github/copilot-instructions/skills/` (project) | `platform/install-vscode.ps1` or copy `skills/*` manually |

All install scripts are idempotent: they copy the current `skills/` contents over any previous install.

> Note: Cursor and Codex also read the repository's `AGENTS.md` files natively; the skills are the deeper "how to operate the board" layer on top.

---

## Manual Install

```powershell
# Codex
Copy-Item skills/* -Destination "$HOME\.codex\skills" -Recurse -Force

# VS Code Copilot (global)
Copy-Item skills/* -Destination "$HOME\.agents\skills" -Recurse -Force

# Cursor (global)
Copy-Item skills/* -Destination "$HOME\.cursor\skills" -Recurse -Force
```

---

## Keeping Skills Current

- Edit skills only under `skills/`.
- Platform shims (`.cursor/rules/`, `.github/`, `platform/`) reference this directory; they must not fork its content.
- After meaningful skill changes, re-run the relevant install script or re-copy so agents see the update.
