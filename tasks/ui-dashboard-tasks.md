# Dashboard Board UI — Tasks

![Status](https://img.shields.io/badge/status-active-238636)
![Backlog](https://img.shields.io/badge/backlog-0-6e7781)
![Ready](https://img.shields.io/badge/ready-0-1f6feb)
![In Progress](https://img.shields.io/badge/in%20progress-0-d29922)
![Blocked](https://img.shields.io/badge/blocked-0-da3633)
![Review](https://img.shields.io/badge/review-2-8250df)
![Done](https://img.shields.io/badge/done-5-238636)
![Updated](https://img.shields.io/badge/updated-2026-08-07-6e7781)

[Board](../BOARD.md) · [Project](../projects/ui-dashboard.md)

> Canonical task-level state for Dashboard Board UI.
> This file tracks executable work, task status, acceptance criteria, blockers, and task history.

---

## Task Board Overview

| Field | Value |
| --- | --- |
| **Project** | Dashboard Board UI |
| **Project ID** | `UIB` |
| **Project File** | [`../projects/ui-dashboard.md`](../projects/ui-dashboard.md) |
| **Task Prefix** | `UIB` |
| **Board Status** | `Active` |
| **Last Updated** | `2026-08-07` |
| **Active Task** | `UIB-007 editor UI (validation)` |
| **Next Ready Task** | `None open` |

---

## Workflow

Tasks move through the following lifecycle:

```text
Backlog
   ↓
Ready
   ↓
In Progress
   ↓
Review
   ↓
Done
```

Tasks that cannot proceed move to:

```text
Blocked
```

---

# Backlog

![Backlog](https://img.shields.io/badge/status-backlog-6e7781)

> Tasks that belong to the project but are not yet ready to begin.

_No tasks currently in backlog._

---

# Ready

![Ready](https://img.shields.io/badge/status-ready-1f6feb)

> Tasks that are sufficiently defined and can be started.



# In Progress

![In Progress](https://img.shields.io/badge/status-in%20progress-d29922)

> Tasks currently being executed.

_No tasks currently in progress._

---

# Blocked

![Blocked](https://img.shields.io/badge/status-blocked-da3633)

> Tasks that cannot make meaningful progress because of a dependency or unresolved issue.

_No blocked tasks._

---

# Review

![Review](https://img.shields.io/badge/status-review-8250df)

> Tasks believed to be complete but still requiring validation, approval, testing, or acceptance review.

### `UIB-004` — Project and task detail views

![Status](https://img.shields.io/badge/status-review-8250df)
![Priority](https://img.shields.io/badge/priority-medium-d29922)
![Type](https://img.shields.io/badge/type-task-0969da)
![Blocked](https://img.shields.io/badge/blocked-no-238636)

| Field | Value |
| --- | --- |
| **ID** | `UIB-004` |
| **Status** | `Review` |
| **Priority** | `Medium` |
| **Type** | `Task` |
| **Assigned** | `Agent` |
| **Created** | `2026-08-07` |
| **Started** | `2026-08-07` |
| **Updated** | `2026-08-07` |
| **Completed** | `—` |

**Goal**

Show project detail (objective, success criteria, milestones, decisions, risks) and the task board as a workflow Kanban.

### Acceptance Criteria

- [ ] Clicking a project card opens a detail drawer with project fields.
- [ ] Detail drawer includes tasks grouped by workflow state.
- [ ] Task cards show ID, priority, and acceptance completion.

### Dependencies

- `UIB-003`

### Blockers

`None`

### Files / Resources

- `ui/public/app.js`
- `ui/lib/parse.js`

### Implementation Notes

- Single-page drawer + task modal; reuse parsed JSON.

### Validation

- [ ] Parser output confirmed for project and task fields (Node e2e).
- [ ] Visual interaction (click-through) remains to be accepted in a browser.

### Acceptance

Open the dashboard, open the `ui-dashboard` project card, and open a task card to confirm rendering.

### Task History

| Date | Change |
| --- | --- |
| `2026-08-07` | Task created. |
| `2026-08-07` | Implementation complete; moved to Review pending visual acceptance. |


### `UIB-007` — Editor UI for the drawer and task modal

![Status](https://img.shields.io/badge/status-review-8250df)
![Priority](https://img.shields.io/badge/priority-high-f85149)
![Type](https://img.shields.io/badge/type-task-0969da)
![Blocked](https://img.shields.io/badge/blocked-no-238636)

| Field | Value |
| --- | --- |
| **ID** | `UIB-007` |
| **Status** | `Review` |
| **Priority** | `High` |
| **Type** | `Task` |
| **Assigned** | `Agent` |
| **Created** | `2026-08-07` |
| **Started** | `2026-08-07` |
| **Updated** | `2026-08-07` |
| **Completed** | `—` |

**Goal**

Add an Edit button to the project drawer and task modal that opens an inline editor form and saves via `POST /api/write` (task-scoped for task fields), updating the rendered view immediately.

### Acceptance Criteria

- [x] Project drawer has an Edit entry that toggles the read-only view into an inline editor.
- [x] Editor forms cover status, priority, progress, objective, current state fields, and success-criteria list lines.
- [x] Task modal editor covers task status (workflow), priority, and task text lines (scoped KV/badge/check ops).
- [x] Saving the form calls `POST /api/write` and refreshes the relevant part of the view.
- [x] Cancel leaves the drawer/modal unchanged.

### Dependencies

- `UIB-006` (write endpoint)

### Blockers

`None`

### Files / Resources

- `ui/public/app.js` (editor forms + save handlers)
- `ui/lib/write.js` (task-scoped taskKV/taskBadge/taskLabel/taskCheck ops)
- `ui/server.js` (`POST /api/write` + `/api/state`)

### Implementation Notes

- Drawer edit form saves badge/`kv`/section/label/check ops to `projects/<slug>.md` and syncs BOARD.md card state+priority/progress badges via `projectState`.
- Task edit uses task-scoped ops (`task`, `taskKV`, `taskBadge`, `taskLabel`, `taskCheck`) so one task's fields cannot clobber another task's fields.
- Save re-fetches `/api/state` and re-renders the open drawer/modal; server SSE also broadcasts after a successful write.

### Acceptance

Open the dashboard, click a project card, then Edit; make edits and confirm the card/drawer reflect changes live without a full page reload; repeat in the task modal.

### Task History

| Date | Change |
| --- | --- |
| `2026-08-07` | Task created. |
| `2026-08-07` | Editor UI implemented and validated via live `/api/write` round-trips; moved to Review pending visual acceptance. |

# Done

![Done](https://img.shields.io/badge/status-done-238636)

> Tasks whose acceptance criteria have been satisfied.

### `UIB-003` — Portfolio dashboard frontend

![Status](https://img.shields.io/badge/status-done-238636)
![Priority](https://img.shields.io/badge/priority-high-f85149)
![Type](https://img.shields.io/badge/type-task-0969da)
![Blocked](https://img.shields.io/badge/blocked-no-238636)

| Field | Value |
| --- | --- |
| **ID** | `UIB-003` |
| **Status** | `Done` |
| **Priority** | `High` |
| **Type** | `Task` |
| **Assigned** | `Agent` |
| **Created** | `2026-08-07` |
| **Started** | `2026-08-07` |
| **Updated** | `2026-08-07` |
| **Completed** | `2026-08-07` |

**Goal**

Render the portfolio: summary badges, current focus, and project cards grouped by project state, updating in place on SSE events.

### Acceptance Criteria

- [x] Portfolio counts and current focus render from `/api/state`.
- [x] Project cards appear in columns matching their view; 5 board-state columns shown by default with addable custom columns.
- [x] SSE events cause an in-place refresh with a live indicator.
- [x] Empty board renders gracefully.

### Dependencies

- `UIB-002`

### Blockers

`None`

### Files / Resources

- `ui/public/index.html`
- `ui/public/style.css`
- `ui/public/app.js`

### Implementation Notes

- Plain HTML/CSS/JS; no build step; fetch state; re-render on `update` event.
- Board shows **5 board-state columns by default** (`Planning, Ready, Active, Blocked, Review`); other states and custom rule-based columns are addable via the Columns toolbar. Visibility + custom columns persist in `localStorage` (`uib.cols.v1`).
- Sidebar panels styled to a compact SaaS look; thin scrollbars only when overflow; Portfolio shown as a label/value list.

### Validation (performed)

- [x] JS syntax check passed in Node (`node --check`).
- [x] Static pages served (`GET /` 200); `/api/state` supplies render data.
- [x] Human visual pass: columns, popover alignment, side panel, and Portfolio list accepted.

### Task History

| Date | Change |
| --- | --- |
| `2026-08-07` | Task created. |
| `2026-08-07` | Implementation complete; moved to Review pending visual acceptance. |
| `2026-08-07` | Board default reduced to 5 board-state columns; column visibility and custom columns implemented in app.js. |
| `2026-08-07` | Visual polish accepted by user; moved to Done. |

---

### `UIB-001` — Markdown state parser

| Field | Value |
| --- | --- |
| **ID** | `UIB-001` |
| **Status** | `Done` |
| **Priority** | `High` |
| **Type** | `Task` |
| **Assigned** | `Agent` |
| **Created** | `2026-08-07` |
| **Started** | `2026-08-07` |
| **Updated** | `2026-08-07` |
| **Completed** | `2026-08-07` |

**Goal**

Parse the repository Markdown into structured JSON: `BOARD.md` portfolio state, project files, and task boards.

### Acceptance Criteria

- [x] `BOARD.md` yields counts, focus, and project cards grouped by state section.
- [x] Project files yield metadata, objective, success criteria, milestones, decisions, and risks.
- [x] Task boards yield workflow groups with per-task fields, criterion checks, and validation.
- [x] Parser tolerates empty/template boards without crashing.

### Validation (performed)

- Parsed current repo state; boards/card counts correctly resolved.
- Task workflow grouping (Ready=4, In Progress=1) matched source.
- Empty/template configs produce empty content, no crashes.

### Task History

| Date | Change |
| --- | --- |
| `2026-08-07` | Created, started. |
| `2026-08-07` | Moved to Done after parsing verified. |

---

### `UIB-002` — Live server with file watching and SSE

| Field | Value |
| --- | --- |
| **ID** | `UIB-002` |
| **Status** | `Done` |
| **Priority** | `High` |
| **Type** | `Task` |
| **Assigned** | `Agent` |
| **Created** | `2026-08-07` |
| **Started** | `2026-08-07` |
| **Updated** | `2026-08-07` |
| **Completed** | `2026-08-07` |

**Goal**

Serve the UI and a JSON API with zero dependencies, watch `BOARD.md`, `projects/`, and `tasks/` for changes, and push SSE updates to open browser sessions.

### Acceptance Criteria

- [x] `node ui/server.js` starts a local HTTP server using only Node built-ins.
- [x] `GET /api/state` returns parsed board, project, and task data as JSON.
- [x] Changing a watched Markdown file triggers a debounced SSE `update` event.
- [x] Static assets in `ui/public` are served.

### Validation (performed by automated e2e)

- [x] Server started on test port; `GET /`, `/api/state`, `/events` returned 200.
- [x] `projects/` probe write generated SSE `update`; streamed events `hello, update`.
- [x] Port-in-use error handled with a clear message.

### Dependencies

- `UIB-001`

### Blockers

`None`

### Files / Resources

- `ui/server.js`
- `ui/lib/state.js`

### Task History

| Date | Change |
| --- | --- |
| `2026-08-07` | Task created. |
| `2026-08-07` | Server live reload validated; Done. |

---

### `UIB-005` — Validation and live-update check

| Field | Value |
| --- | --- |
| **ID** | `UIB-005` |
| **Status** | `Done` |
| **Priority** | `Medium` |
| **Type** | `Test` |
| **Assigned** | `Agent` |
| **Created** | `2026-08-07` |
| **Started** | `2026-08-07` |
| **Updated** | `2026-08-07` |
| **Completed** | `2026-08-07` |

**Goal**

Verify the server, parser, and live reload work end to end, including empty-board tolerance.

### Validation (performed)

- [x] Server serves `/`, `/api/state`, and `/events`.
- [x] `/api/state` reflects current repo state.
- [x] SSE `update` event observed after touching a watched file.
- [x] Parser tolerates the empty-board template structure.

### Acceptance Criteria

- [x] Same as the validation list above (all satisfied).

### Blockers

`None`

### Task History

| Date | Change |
| --- | --- |
| `2026-08-07` | Task created. |
| `2026-08-07` | Completed (server-side validation). |

### `UIB-006` — Surgical write layer for Markdown state

![Status](https://img.shields.io/badge/status-done-238636)
![Priority](https://img.shields.io/badge/priority-high-f85149)
![Type](https://img.shields.io/badge/type-task-0969da)
![Blocked](https://img.shields.io/badge/blocked-no-238636)

| Field | Value |
| --- | --- |
| **ID** | `UIB-006` |
| **Status** | `Done` |
| **Priority** | `High` |
| **Type** | `Task` |
| **Assigned** | `Agent` |
| **Created** | `2026-08-07` |
| **Started** | `2026-08-07` |
| **Updated** | `2026-08-07` |
| **Completed** | `2026-08-07` |

**Goal**

Provide a server-side surgical writer for the project Markdown files (project status/priority/objective and current state) and the task board (workflow moves, priorities, criteria toggles) that updates only the requested line/blocks, plus a write API that re-notifies connected sessions after a successful write.

### Acceptance Criteria

- [x] `ui/lib/write.js` applies a small set of surgical ops against a project or task board file.
- [x] The server exposes `POST /api/write` that calls the writer and, on success, notifies open sessions.
- [x] Write requests validate the target file (projects/ or tasks/) and reject values outside the allowed enumerations.
- [x] Badges and structured fields are written without rewriting the surrounding file.
- [x] The engine dispatches the new task board state back to open sessions.

### Dependencies

- `UIB-001` (parser), `UIB-002` (server/SSE)

### Blockers

`None`

### Files / Resources

- `ui/lib/write.js`
- `ui/server.js`

### Implementation Notes

- Ops: badge, kv, label, section, check, task (workflow move), projectState (BOARD.md card move), taskKV/taskBadge/taskLabel/taskCheck (task-scoped edits).
- Round-trip ops against the same files the parser reads, then assertion of re-parse in a Node check.

### Validation

- [x] `node --check` passes for `write.js` and `server.js`.
- [x] Node round-trip: badge, table cell, section body, checklist toggle, board card move, scoped task edits apply and re-parse (verified via live `/api/write` against a temp repo copy).
- [x] `POST /api/write` with invalid paths/values/enumerations returns `400`/`422` (verified live).

### Acceptance

A written edit appears on the board/at the card with no manual restart.

### Task History

| Date | Change |
| --- | --- |
| `2026-08-07` | Task created. |
| `2026-08-07` | Write layer + `/api/write` implemented and validated live; moved to Done. |

---

## Progress

| State | Count |
| --- | ---: |
| Backlog | 0 |
| Ready | 0 |
| In Progress | 0 |
| Blocked | 0 |
| Review | 2 |
| Done | 5 |
| **Total** | **7** |

**Completion:** `71%`

> Completion reflects done tasks against total (`5/7`). UIB-004 and UIB-007 await visual acceptance review.

---

## Task Activity Log

| Date | Task | Change |
| --- | --- | --- |
| `2026-08-07` | `BOARD` | Task board created. |
| `2026-08-07` | `UIB-001` | Moved Ready → In Progress. |
| `2026-08-07` | `UIB-001` | Done — parser validated. |
| `2026-08-07` | `UIB-002` | Done — server + SSE validated. |
| `2026-08-07` | `UIB-003` | Moved to Review — implementation done, visual accept pending. |
| `2026-08-07` | `UIB-004` | Moved to Review — implementation done, visual accept pending. |
| `2026-08-07` | `UIB-005` | Done — end-to-end validation passed. |
| `2026-08-07` | `UIB-003` | Column/custom-column and sidebar polish accepted; moved to Done. |
| `2026-08-07` | `UIB-006` | Added: surgical write layer for edit-from-UI (DEC-003). |
| `2026-08-07` | `UIB-007` | Added: editor UI for draw tasks; depends on UIB-006. |
| `2026-08-07` | `UIB-006` | Moved Ready → In Progress. |
| `2026-08-07` | `UIB-006` | Done — write layer + `/api/write` validated live. |
| `2026-08-07` | `UIB-007` | Moved Ready → Review — editor implemented, visual accept pending. |

---

## Blocker Register

> Track active blockers that affect task execution.

| Task | Blocker | Required To Unblock | Since | Status |
| --- | --- | --- | --- | --- |
| — | — | — | — | — |

---

## Task Dependencies

| Task | Depends On | Dependency Type | Status |
| --- | --- | --- | --- |
| `UIB-002` | `UIB-001` | Parser first | `Resolved` |
| `UIB-003` | `UIB-002` | Server first | `Resolved` |
| `UIB-004` | `UIB-003` | Portfolio first | `Resolved` |
| `UIB-005` | `UIB-004` | Implementation first | `Done` |
| `UIB-006` | `UIB-001`, `UIB-002` | Parser + server | `Resolved` |
| `UIB-007` | `UIB-006` | Write API first | `Resolved` |

---

## Task Decisions

| ID | Date | Task | Decision | Reason |
| --- | --- | --- | --- | --- |
| `TDEC-001` | `2026-08-07` | `UIB-001` | Tolerant line/regex parsing | Handles formatting variance |

---

## Agent Protocol

This file is the canonical source for **task-level state** for Dashboard Board UI.

Project file:

[`../projects/ui-dashboard.md`](../projects/ui-dashboard.md)

Board: [`../BOARD.md`](../BOARD.md)

### Task Selection

Continue the current `In Progress`. Otherwise pull `Ready`, respect dependencies and blockers. Visual acceptance of UIB-004 and UIB-007 is the current review queue item.

### Creating/Moving Tasks

- Preserve IDs (`UIB-00x`), never reuse.
- One task in one workflow section only.
- Set `Started` when work begins; `Completed` only at `Done`.
- Update counts, badges, and this log.

### Completion Rules

A task may enter `Done` only when its goal is achieved, acceptance criteria are satisfied, and validation actually passed. UIB-004 and UIB-007 remain in `Review` until a browser visual pass confirms rendering.

### Acceptance Criteria Rules

Criteria must describe verifiable, observable outcomes; do not invent validation.

---

## Synchronization Rules

State flows upward when needed: implementation → task board → project file if state changed → `BOARD.md` if portfolio state changed.

### Update this board when

- task status, criteria, blockers, validation change;
- the active task changes;
- a task completes a task reopens.

### Update the project file when

- milestones, deliverables, scope/requirements, status, risks, decisions, focus, next milestone change.

### Update `BOARD.md` when

- project status/priority/progress/focus changes materially,
- the project completes.

---

## State Ownership

Lower-level canonical state wins: task detail → this file; project detail → project file; portfolio summary → `BOARD.md`.


## End-of-Session Protocol

- Correct task workflow sections to repository reality.
- Preserve IDs, completed history, acceptance criteria.
- Set a concrete next action before stopping.

Leave the repository resumable from files alone.