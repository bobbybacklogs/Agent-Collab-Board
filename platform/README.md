# Platform Wiring

![Platform](https://img.shields.io/badge/platform-shims-0969da)
![Idempotent](https://img.shields.io/badge/install-idempotent-238636)

> Thin wiring so Cursor, Codex, and VS Code Copilot all reach the same skills bundle. Nothing here forks skill content — `skills/` is the single source (project decision `DEC-001`).

---

## What's Here

| File | Platform | What it does |
| --- | --- | --- |
| `install-cursor.ps1` | Cursor | Copies `skills/*` → `~/.cursor/skills` |
| `install-codex.ps1` | Codex | Copies `skills/*` → `~/.codex/skills` |
| `install-vscode.ps1` | VS Code Copilot | Copies `skills/*` → `~/.agents/skills` |
| `../.cursor/rules/board-toolkit.mdc` | Cursor | Repo rule: always-apply pointer to the skills + CLI fast path |
| `../.github/copilot-instructions.md` | VS Code Copilot | Project instructions pointing at `AGENTS.md` + skills |

All install scripts are idempotent (`Copy-Item -Force`, `-Recurse`). Running them twice yields the same result; the last run wins.

---

## Install

```powershell
# from the repository root
powershell -ExecutionPolicy Bypass -File platform/install-cursor.ps1
powershell -ExecutionPolicy Bypass -File platform/install-codex.ps1
powershell -ExecutionPolicy Bypass -File platform/install-vscode.ps1
```

Custom target (e.g. project-local):

```powershell
powershell -ExecutionPolicy Bypass -File platform/install-codex.ps1 -Target "C:\some\repo\.codex\skills"
```

---

## Notes

- Codex and Cursor both read `AGENTS.md` natively; the skills add the operational how-to on top.
- VS Code Copilot reads `.github/copilot-instructions.md` when present; the skills are optional global extras (`~/.agents/skills`).
- Keep shims minimal: they reference the skills bundle and the CLI; content changes belong in `skills/`.
