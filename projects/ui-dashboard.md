# Local Board Dashboard

![Status](https://img.shields.io/badge/status-active-238636)
![Priority](https://img.shields.io/badge/priority-medium-d29922)
![Progress](https://img.shields.io/badge/progress-80%25-0969da)
![Updated](https://img.shields.io/badge/updated-2026-08-07-6e7781)

[Board](../BOARD.md) · [Tasks](../tasks/ui-dashboard-tasks.md)

> A local, read-only web dashboard that renders the repository board and refreshes itself live whenever its Markdown state changes.

---

## Project Overview

| Field | Value |
| --- | --- |
| **Project ID** | `UIB` |
| **Project Name** | Dashboard Board UI |
| **Status** | `Active` |
| **Priority** | `Medium` |
| **Owner** | `Agent` |
| **Started** | `2026-08-07` |
| **Target** | `2026-08-07` |
| **Last Updated** | `2026-08-07` |
| **Task Board** | [`../tasks/ui-dashboard-tasks.md`](../tasks/ui-dashboard-tasks.md) |

---

## Objective

Provide a lightweight, zero-dependency, locally served browser UI that renders the Markdown-first project board (portfolio, projects, and task boards) and automatically updates in the browser whenever the underlying repo files change.

---

## Success Criteria

The project is considered complete when:

- [ ] A local server runs with `node ui/server.js` and needs no third-party npm packages.
- [ ] The UI renders BOARD.md portfolio state (counts, focus, project cards by state).
- [ ] The UI renders each project's project file and task board.
- [ ] Editing a repo Markdown file causes the open browser session to update automatically.
- [ ] The UI is read-only; it never writes to repo files.

---

## Current State

![State](https://img.shields.io/badge/current-validation-8250df)

**Summary**

Parser, live server, and dashboard frontend are implemented. Portfolio dashboard (UIB-003) accepted; server-side validation passed end to end (API + SSE live reload).

**Current Focus**

Visual acceptance of the project drawer and task detail views.

**Next Milestone**

Dashboard rendering review and project acceptance.

**Next Action**

Open `http://localhost:4173`, open the `ui-dashboard` project card and a task card to confirm the drawer/task views render, then accept UIB-004.

---

## Scope

### In Scope

- Zero-dependency Node.js local HTTP server.
- Markdown parsers for `BOARD.md`, `projects/*.md`, `tasks/*-tasks.md`.
- Read-only Kanban-style dashboard: portfolio + project cards.
- Project detail and task-board views.
- File watching with SSE live updates in the open browser session.

### Out of Scope

- Writing or editing Markdown state from the UI.
- Authentication, multi-user, or remote hosting.
- Replacing the Markdown files as the source of truth.

---

## Requirements

### Functional

- Serve static UI and a JSON API reading repo Markdown.
- Detect changes to watched files and notify open browser sessions.
- Render portfolio project cards grouped by project state.
- Render project detail and its task board grouped by workflow state.

### Non-Functional

- No third-party runtime dependencies.
- Runs entirely locally.
- Small, reviewable codebase.

---

## Deliverables

| Deliverable | Status | Reference |
| --- | --- | --- |
| Markdown parser module | `Done` | `ui/lib/parse.js` |
| State assembler | `Done` | `ui/lib/state.js` |
| Live server | `Done` | `ui/server.js` |
| Dashboard frontend | `Done` | `ui/public/*` |
| Validation notes | `Done` | task board `UIB-005` |

---

## Milestones

| ID | Milestone | Status | Target |
| --- | --- | --- | --- |
| `M1` | Parser + server functional | `Complete` | `2026-08-07` |
| `M2` | Dashboard renders portfolio + project + tasks | `Review` | `2026-08-07` |
| `M3` | Live-update validated on file change | `Complete` | `2026-08-07` |

---

## Dependencies

### Internal

- Markdown project/task/board files as canonical state.

### External

- Node.js (runtime only, no packages).

---

## Constraints

- Zero runtime npm dependencies.
- Browser UI must remain functional without a build step.
- Board/repo files remain the only source of truth.

---

## Risks

| ID | Risk | Impact | Mitigation | Status |
| --- | --- | --- | --- | --- |
| `RISK-001` | Regex parsing of Markdown breaks on formatting changes | Medium | Parse tolerant important fields; degrade gracefully | Open |

---

## Decisions

| ID | Date | Decision | Reason | Affects |
| --- | --- | --- | --- | --- |
| `DEC-001` | `2026-08-07` | Read-only dashboard; repo Markdown stays canonical | Avoids split-brain state | Architecture |
| `DEC-002` | `2026-08-07` | Zero-dependency Node server with SSE live reload | Simplest local setup | Architecture |

---

## Open Questions

- None.

---

## References

### Repository

- [`BOARD.md`](../BOARD.md)
- [`projects/_TEMPLATE.md`](../projects/_TEMPLATE.md)
- [`tasks/_TEMPLATE.md`](../tasks/_TEMPLATE.md)

---

## Project Notes

- The dashboard must tolerate zero projects (empty board) and reveal projects as they appear.
- Use SSE rather than WebSocket to keep dependencies zero.

---

## Activity

| Date | Change |
| --- | --- |
| `2026-08-07` | Project created. |
| `2026-08-07` | Parser, server, and frontend implemented; backend validated end to end; dashboard rendering in Review. |
| `2026-08-07` | Dashboard frontend (UIB-003) accepted by user: 5-column default, custom columns, sidebar polish. Progress 80%. |

---

## Agent Protocol

This file is the canonical source for **project-level state**.

The associated task board is the canonical source for **task-level state**:

[`../tasks/ui-dashboard-tasks.md`](../tasks/ui-dashboard-tasks.md)

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
![Status](https://img.shields.io/badge/status-planning-6e7781)
![Status](https://img.shields.io/badge/status-ready-1f6feb)
![Status](https://img.shields.io/badge/status-active-238636)
![Status](https://img.shields.io/badge/status-blocked-da3633)
![Status](https://img.shields.io/badge/status-review-8250df)
![Status](https://img.shields.io/badge/status-complete-238636)
![Status](https://img.shields.io/badge/status-paused-d29922)
![Status](https://img.shields.io/badge/status-archived-6e7781)
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
![State](https://img.shields.io/badge/current-planning-6e7781)
![State](https://img.shields.io/badge/current-execution-d29922)
![State](https://img.shields.io/badge/current-blocked-da3633)
![State](https://img.shields.io/badge/current-validation-8250df)
![State](https://img.shields.io/badge/current-complete-238636)
```

---

<!--
AGENT PROJECT STATE

ROLE
This document owns durable project-level state.
Do not use it as the detailed task backlog.

PRESERVE
- Project ID
- objective
- success criteria
- scope
- requirements
- decision history
- activity history
- established constraints

UPDATE WHEN NEEDED
- project status
- priority
- progress
- current state
- current focus
- milestones
- deliverables
- dependencies
- constraints
- risks
- open questions
- references
- next action
- last updated

TASK STATE
Detailed task state belongs in:
../tasks/ui-dashboard-tasks.md

BOARD STATE
Portfolio-level summary belongs in:
../BOARD.md

RULE
Store information at the lowest appropriate canonical level.
Higher-level files summarize and link rather than duplicate detail.

COMPLETION
Do not mark the project complete until its success criteria are satisfied.
-->