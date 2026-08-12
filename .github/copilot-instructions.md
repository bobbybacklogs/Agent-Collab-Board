# Agent Collab Board — Copilot Instructions (VS Code)

This repository is a Markdown-first operational state system for humans and AI agents.

## Start Here

1. Read `AGENTS.md` for the repository operating policy.
2. Read `BOARD.md` for current portfolio focus.
3. Read the current project (`projects/<slug>.md`) and its task board (`tasks/<slug>-tasks.md`).
4. Before project work, consult the board skills:

   - `skills/board-state/SKILL.md` — how to read and report board state.
   - `skills/board-edit/SKILL.md` — how to edit board Markdown safely.
   - `skills/board-new-project/SKILL.md` — how to scaffold a new project.

## State Model

```text
BOARD.md → projects/<slug>.md → tasks/<slug>-tasks.md
```

Read downward, update upward. Repository files are authoritative; do not rely on conversation memory.

## Edits

Never hand-rewrite board Markdown. Use the board CLI:

```text
node ui/lib/cli.js read --board
node ui/lib/cli.js apply <target> '<ops-json>' --dry-run
node ui/lib/cli.js apply <target> '<ops-json>'
node ui/lib/cli.js ops
```

Writable targets: `BOARD.md`, `projects/*.md`, `tasks/*-tasks.md` only.

## Install the Skills Globally (optional)

```powershell
powershell -ExecutionPolicy Bypass -File platform/install-vscode.ps1
```

Installs to `~/.agents/skills` so Copilot skills are available across workspaces.
