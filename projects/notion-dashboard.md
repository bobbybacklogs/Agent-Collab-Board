# Notion-like Agent Dashboard

![Status](https://img.shields.io/badge/status-review-8250df)
![Priority](https://img.shields.io/badge/priority-high-f85149)
![Progress](https://img.shields.io/badge/progress-100%25-238636)
![Updated](https://img.shields.io/badge/updated-2026--09--15-6e7781)

[Board](../BOARD.md) · [Tasks](../tasks/notion-dashboard-tasks.md)

> Replace the GitHub-dark local board UI (and the v0 reskin that gutted it) with a real Notion-like workspace: sidebar pages, portfolio kanban, project pages, and drag-and-drop writes back to Markdown.

---

## Project Overview

| Field | Value |
| --- | --- |
| **Project ID** | `NTN` |
| **Project Name** | Notion-like Agent Dashboard |
| **Status** | `Review` |
| **Priority** | `High` |
| **Owner** | `Agent` |
| **Started** | `2026-09-15` |
| **Target** | `2026-09-15` |
| **Last Updated** | `2026-09-15` |
| **Task Board** | [`../tasks/notion-dashboard-tasks.md`](../tasks/notion-dashboard-tasks.md) |

---

## Objective

Give humans and agents a shared Notion-style workspace over the existing Markdown board: a sidebar of project pages, a portfolio kanban, nested task boards, search, and surgical writes so dragging a card actually moves state in `BOARD.md` / `projects/*.md` / `tasks/*-tasks.md`.

---

## Success Criteria

The project is considered complete when:

- [x] The local dashboard looks and behaves like a workspace (sidebar, pages, board/table views), not a GitHub-issues reskin or a gutted v0 stylesheet.
- [x] Portfolio projects can be dragged between board-state columns and the write lands in Markdown via `/api/write`.
- [x] A project page shows properties plus a task kanban; tasks can be dragged between workflow columns.
- [x] Search (`⌘K`) finds projects and tasks; live SSE still refreshes the UI.
- [x] Browser verification of the main flows has been recorded.

---

## Current State

![State](https://img.shields.io/badge/current-review-8250df)

**Summary**

Workspace implemented and browser-verified: sidebar pages, portfolio kanban/table, project pages, task peek, command palette, theme toggle, live SSE, and write round-trip. Awaiting user review of PR 2.

**Current Focus**

User review of the Notion-like dashboard PR.

**Next Milestone**

User acceptance; then mark the project Complete.

**Next Action**

Review the dashboard PR in the browser with node ui/server.js.

---

## Scope

### In Scope

- Notion-like visual language (light default, optional dark).
- Sidebar workspace + project pages + hash routing.
- Portfolio kanban and table views.
- Project pages with properties and nested task kanban.
- Task peek panel with surgical editors.
- Drag-and-drop project state and task workflow writes.
- Command palette search.
- Keep Markdown files as source of truth; keep zero npm runtime deps.

### Out of Scope

- Replacing the board SDK or write op vocabulary.
- Multiplayer presence, comments, or Notion sync.
- Hosted auth (optional token hardening from the v0 PR is not required for local use).
- Rewriting BOARD.md by hand from the UI.

---

## Requirements

### Functional

- Serve the workspace from `node ui/server.js`.
- Render live board state from `/api/state` and `/events`.
- Persist column visibility and theme in localStorage.
- Writes use existing SDK ops only.

### Non-Functional

- No third-party runtime dependencies.
- Small enough to review without a bundler.

---

## Deliverables

| Deliverable | Status | Reference |
| --- | --- | --- |
| Workspace HTML shell | `Done` | `ui/public/index.html` |
| Notion-like stylesheet | `Done` | `ui/public/style.css` |
| Workspace client | `Done` | `ui/public/app.js` |
| Live server (unchanged contract) | `Done` | `ui/server.js` |

---

## Milestones

| ID | Milestone | Status | Target |
| --- | --- | --- | --- |
| `M1` | Workspace + kanban UI | `Done` | `2026-09-15` |
| `M2` | Drag-and-drop Markdown writes | `Done` | `2026-09-15` |
| `M3` | Browser verification | `In Progress` | `2026-09-15` |

---

## Dependencies

### Internal

- Board SDK (`sdk/`) read/apply/watch used by `ui/server.js`.
- Existing parsers and surgical write ops.

### External

- None.

---

## Constraints

- Zero npm runtime dependencies for the dashboard.
- Do not expand the write op vocabulary unless a move cannot be expressed with existing ops.
- Do not take the v0 PR's "writes disabled without token" default; local dashboard writes must work.

---

## Risks

| ID | Risk | Impact | Mitigation | Status |
| --- | --- | --- | --- | --- |
| `RISK-001` | `badge` ops on BOARD.md can touch every matching badge | `Medium` | Prefer `projectState`, which scopes badge sync to the moved card | `Open` |

---

## Decisions

| ID | Date | Decision | Reason | Affects |
| --- | --- | --- | --- | --- |
| `DEC-001` | `2026-09-15` | Rebuild the UI rather than salvage the v0 PR | v0 deleted the stylesheet (2 lines left) and replaced a working kanban with a thin "command center" shell | `ui/public` |
| `DEC-002` | `2026-09-15` | Keep the zero-dep Node server and SDK write path | Markdown remains canonical; agents already speak those ops | `ui/server.js` |

---

## Open Questions

- [ ] Whether hosted deploys should optionally require `BOARD_WRITE_TOKEN` without breaking local `node ui/server.js`.

---

## References

### Repository

- `ui/public/index.html`
- `ui/public/style.css`
- `ui/public/app.js`
- `ui/server.js`

### External

- v0 PR: https://github.com/bobbybacklogs/Agent-Collab-Board/pull/1

---

## Project Notes

- PR #1 (`v0/notion-agent-dashboard`) is the wrecked attempt: −880 CSS lines, 2-line leftover stylesheet.
- This project is the replacement, not a merge of that branch.

---

## Activity

| Date | Change |
| --- | --- |
| `2026-09-15` | Project created after reviewing PR #1; workspace UI implemented. |

---

## Agent Protocol

This file is the canonical source for **project-level state**.

Task detail: [`../tasks/notion-dashboard-tasks.md`](../tasks/notion-dashboard-tasks.md)
