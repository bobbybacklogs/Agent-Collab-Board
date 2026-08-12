# Board Agent Toolkit

![Status](https://img.shields.io/badge/status-complete-238636)
![Priority](https://img.shields.io/badge/priority-high-f85149)
![Progress](https://img.shields.io/badge/progress-100%25-0969da)
![Updated](https://img.shields.io/badge/updated-2026-08-12-6e7781)

[Board](../BOARD.md) · [Tasks](../tasks/board-agent-toolkit-tasks.md)

> Package the board's Markdown state system as a portable agent toolkit: a zero-dependency CLI over the surgical write layer, plus a shared skills bundle installable by Cursor, Codex, and VS Code Copilot.

---

## Project Overview

| Field | Value |
| --- | --- |
| **Project ID** | `BAT` |
| **Project Name** | Board Agent Toolkit |
| **Status** | `Complete` |
| **Priority** | `High` |
| **Owner** | `Agent` |
| **Started** | `2026-08-12` |
| **Target** | `2026-08-12` |
| **Last Updated** | `2026-08-12` |
| **Task Board** | [`../tasks/board-agent-toolkit-tasks.md`](../tasks/board-agent-toolkit-tasks.md) |

---

## Objective

Expose the board's read layer (`ui/lib/parse.js`, `ui/lib/state.js`) and surgical write layer (`ui/lib/write.js`) to agents working in Cursor, Codex, and VS Code Copilot, through (a) a zero-dependency CLI that shares validation with the dashboard server and (b) a single shared agent-skills bundle with thin per-platform shims, so agents can read canonical state and make safe field edits without hand-rewriting Markdown.

---

## Success Criteria

The project is considered complete when:

- [x] A zero-dependency CLI exposes parsed state reads and validated surgical writes on board files.
- [x] A shared `skills/` bundle (`board-state`, `board-edit`, `board-new-project`) exists in the shared agent-skills `SKILL.md` format.
- [x] Platform wiring exists for Cursor, Codex, and VS Code Copilot, with shims pointing at the single skills source rather than duplicating content.
- [x] The toolkit is validated end to end (CLI round-trips, skill frontmatter, install scripts) without corrupting unrelated Markdown.

---

## Current State

![State](https://img.shields.io/badge/current-complete-238636)

**Summary**

Toolkit delivered, validated end to end (BAT-001 through BAT-004), and approved by the user on 2026-08-12. All four success criteria are satisfied; project marked Complete.

**Current Focus**

None — project complete.

**Next Milestone**

None — M1, M2, and M3 are complete.

**Next Action**

None — project Complete as of 2026-08-12.

---

## Scope

### In Scope

- Zero-dependency CLI (`ui/lib/cli.js`) over state reads and write ops.
- Shared validation guard (`ui/lib/guard.js`) used by both the CLI and the dashboard server.
- Shared `skills/` bundle in the agent-skills `SKILL.md` format.
- Per-platform shims: Cursor rule, Copilot instructions, Codex/VS Code/Cursor install scripts.
- Validation of CLI round-trips and skill/shim structure.

### Out of Scope

- VS Code extension (tracked in backlog as BAT-005).
- MCP server implementation.
- Changing the board Markdown schema, templates, or conventions.
- Remote hosting or authentication for the toolkit.

---

## Requirements

### Functional

- `read` returns parsed board/project/task state as JSON from a terminal.
- `apply` performs validated surgical edits on `BOARD.md`, `projects/*.md`, and `tasks/*-tasks.md` only.
- `--dry-run` and a `validate` subcommand check ops without writing.
- Skills teach agents the read-down path, the op vocabulary, and the new-project procedure.

### Non-Functional

- No third-party runtime dependencies (Node built-ins only).
- Validation and write safety shared between CLI and server (single source of truth).
- Skills content lives once; platform shims reference it.

---

## Deliverables

| Deliverable | Status | Reference |
| --- | --- | --- |
| Shared validation guard | `Complete` | `ui/lib/guard.js` |
| Agent CLI | `Complete` | `ui/lib/cli.js` |
| Skills bundle | `Complete` | `skills/` |
| Platform shims + install scripts | `Complete` | `.cursor/`, `.github/`, `platform/` |
| Toolkit validation notes | `Complete` | task board `BAT-004` |

---

## Milestones

| ID | Milestone | Status | Target |
| --- | --- | --- | --- |
| `M1` | Agent CLI + skills bundle usable by agents | `Complete` | `2026-08-12` |
| `M2` | Platform shims wired for Cursor, Codex, and VS Code | `Complete` | `2026-08-12` |
| `M3` | Toolkit validated end to end | `Complete` | `2026-08-12` |

---

## Dependencies

### Internal

- `ui/lib/write.js` (surgical op language).
- `ui/lib/parse.js` + `ui/lib/state.js` (read layer).
- `ui/server.js` (write API; will consume the shared guard).
- `projects/_TEMPLATE.md` + `tasks/_TEMPLATE.md` (referenced by the new-project skill).

### External

- Node.js >= 18 (runtime only, no packages).

---

## Constraints

- Zero runtime npm dependencies.
- Skills must use the shared agent-skills `SKILL.md` frontmatter (`name` matching folder, `description`).
- Board Markdown files remain the only source of truth; the toolkit never rewrites beyond the targeted op.

---

## Risks

| ID | Risk | Impact | Mitigation | Status |
| --- | --- | --- | --- | --- |
| `RISK-001` | Content drift between install locations | Medium | Shims point at the single `skills/` source; install scripts copy, never fork | Open |
| `RISK-002` | Ops assume current Markdown conventions | Medium | Validate before write; refuse writes that do not re-parse; tolerant parsing | Open |
| `RISK-003` | Agent writes invalid state via CLI | Medium | Target allowlist + op validation enforced in `ui/lib/guard.js`; re-parse guard | Open |

---

## Decisions

| ID | Date | Decision | Reason | Affects |
| --- | --- | --- | --- | --- |
| `DEC-001` | `2026-08-12` | Skills-first packaging: one `skills/` bundle in shared agent-skills format; per-platform shims reference it | Cursor, Codex, and VS Code Copilot all adopt the same `SKILL.md` spec; avoids a three-way content fork | Architecture |
| `DEC-002` | `2026-08-12` | CLI and dashboard server share write validation via `ui/lib/guard.js` | Single source of truth for write safety | Architecture |
| `DEC-003` | `2026-08-12` | VS Code extension deferred to backlog | Skills + CLI deliver the core value; an extension is additive later | Scope |

---

## Open Questions

- None.

---

## References

### Repository

- [`ui/lib/write.js`](../ui/lib/write.js)
- [`ui/lib/parse.js`](../ui/lib/parse.js)
- [`ui/lib/state.js`](../ui/lib/state.js)
- [`ui/server.js`](../ui/server.js)
- [`AGENTS.md`](../AGENTS.md)

### Documentation

- [`docs/HOWTO.md`](../docs/HOWTO.md)
- [`docs/INSTRUCTIONS.md`](../docs/INSTRUCTIONS.md)

### External

- Agent-skills format (`SKILL.md` with `name`/`description` frontmatter), adopted by Cursor, Codex, and VS Code Copilot.

---

## Project Notes

- The dashboard project (UIB) remains the canonical UI; the toolkit exposes the same read/write layer to agents.
- Skills must reference the CLI as the safe edit path and must never instruct hand-rewriting of board Markdown.
- Install scripts copy `skills/` into user-global skill dirs; they must be idempotent.

---

## Activity

| Date | Change |
| --- | --- |
| `2026-08-12` | Project created. |
| `2026-08-12` | Scaffolded project file, task board, and BOARD.md registration. |

---

## Agent Protocol

This file is the canonical source for **project-level state**.

The associated task board is the canonical source for **task-level state**:

[`../tasks/board-agent-toolkit-tasks.md`](../tasks/board-agent-toolkit-tasks.md)

When working on this project:

1. Read this file before beginning project work.
2. Read the associated task board before selecting or modifying tasks.
3. Preserve the project's objective, requirements, scope, decisions, and history unless explicitly changed.
4. Keep detailed task execution state in the task board rather than duplicating it here.
5. Update this file when project-level state materially changes.
6. Update `Current State` when the active phase, focus, milestone, or next action changes.
7. Record durable project decisions in `Decisions`.
8. Record newly identified project-level risks in `Risks`.
9. Update milestone and deliverable status when corresponding work changes.
10. Update `Last Updated` and the updated badge after meaningful changes.
11. Keep the project status and progress synchronized with the task board.
12. Update `BOARD.md` when changes here affect the overall portfolio view.

### State Ownership

| Information | Canonical Location |
| --- | --- |
| Project objective | This file |
| Project scope | This file |
| Project requirements | This file |
| Project milestones | This file |
| Project deliverables | This file |
| Project risks | This file |
| Project decisions | This file |
| Individual tasks | Task board |
| Task status | Task board |
| Task acceptance criteria | Task board |
| Task blockers | Task board |
| Task working notes | Task board |
| Portfolio summary | `BOARD.md` |

### Update Direction

```text
BOARD.md
   ↓
Project file
   ↓
Task board
   ↓
Repository work
```

After meaningful work:

```text
Repository work
      ↓
Task board updated
      ↓
Project file updated if project state changed
      ↓
BOARD.md updated if portfolio state changed
```

---

## Status Reference

### Project Status

```markdown
![Status](https://img.shields.io/badge/status-review-8250df)
![Status](https://img.shields.io/badge/status-review-8250df)
![Status](https://img.shields.io/badge/status-review-8250df)
![Status](https://img.shields.io/badge/status-review-8250df)
![Status](https://img.shields.io/badge/status-review-8250df)
![Status](https://img.shields.io/badge/status-review-8250df)
![Status](https://img.shields.io/badge/status-review-8250df)
![Status](https://img.shields.io/badge/status-review-8250df)
```

### Priority

```markdown
![Priority](https://img.shields.io/badge/priority-low-6e7781)
![Priority](https://img.shields.io/badge/priority-medium-d29922)
![Priority](https://img.shields.io/badge/priority-high-f85149)
![Priority](https://img.shields.io/badge/priority-critical-da3633)
```

### Current State

```markdown
![State](https://img.shields.io/badge/current-review-8250df)
![State](https://img.shields.io/badge/current-review-8250df)
![State](https://img.shields.io/badge/current-review-8250df)
![State](https://img.shields.io/badge/current-review-8250df)
![State](https://img.shields.io/badge/current-review-8250df)
```

---

<!-- Template: projects/_TEMPLATE.md -->
