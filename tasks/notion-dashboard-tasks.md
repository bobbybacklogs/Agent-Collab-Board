# Notion-like Agent Dashboard — Tasks

![Status](https://img.shields.io/badge/status-active-238636)
![Backlog](https://img.shields.io/badge/backlog-0-6e7781)
![Ready](https://img.shields.io/badge/ready-0-1f6feb)
![In Progress](https://img.shields.io/badge/in%20progress-1-d29922)
![Blocked](https://img.shields.io/badge/blocked-0-da3633)
![Review](https://img.shields.io/badge/review-3-8250df)
![Done](https://img.shields.io/badge/done-0-238636)
![Updated](https://img.shields.io/badge/updated-2026--09--15-6e7781)

[Board](../BOARD.md) · [Project](../projects/notion-dashboard.md)

> Canonical task-level state for Notion-like Agent Dashboard.

---

## Task Board Overview

| Field | Value |
| --- | --- |
| **Project** | Notion-like Agent Dashboard |
| **Project ID** | `NTN` |
| **Project File** | [`../projects/notion-dashboard.md`](../projects/notion-dashboard.md) |
| **Task Prefix** | `NTN` |
| **Board Status** | `Active` |
| **Last Updated** | `2026-09-15` |
| **Active Task** | `NTN-004` |
| **Next Ready Task** | `None` |

---

## Workflow

```text
Backlog → Ready → In Progress → Review → Done
```

---

# Backlog

![Backlog](https://img.shields.io/badge/status-backlog-6e7781)

_No tasks currently in backlog._

---

# Ready

![Ready](https://img.shields.io/badge/status-ready-1f6feb)

_No tasks currently ready._

---

# In Progress

![In Progress](https://img.shields.io/badge/status-in%20progress-d29922)

### `NTN-004` — Browser-verify workspace flows

![Status](https://img.shields.io/badge/status-in%20progress-d29922)
![Priority](https://img.shields.io/badge/priority-high-f85149)
![Type](https://img.shields.io/badge/type-validation-0969da)
![Blocked](https://img.shields.io/badge/blocked-no-238636)

| Field | Value |
| --- | --- |
| **ID** | `NTN-004` |
| **Status** | `In Progress` |
| **Priority** | `High` |
| **Type** | `Validation` |
| **Assigned** | `Agent` |
| **Created** | `2026-09-15` |
| **Started** | `2026-09-15` |
| **Updated** | `2026-09-15` |
| **Completed** | `—` |

**Goal**

Verify the workspace in a browser the way a user would: board, project page, task peek, search, theme, and a drag-and-drop write.

### Acceptance Criteria

- [ ] Board page shows portfolio columns and project cards.
- [ ] Opening a project page shows properties and a task kanban.
- [ ] Opening a task peek shows goal / criteria.
- [ ] Search finds a known project.
- [ ] Drag-and-drop of a project or task issues `/api/write` and Markdown state changes, then the card is restored if the move was only a test.

### Dependencies

- `NTN-001`
- `NTN-002`
- `NTN-003`

### Blockers

`None`

### Files / Resources

- `ui/public/index.html`
- `ui/public/app.js`
- `ui/server.js`

### Implementation Notes

- Restore any test drag so canonical board state is not left dirty unless the move is intentional.

### Validation

- [ ] Browser pass recorded
- [ ] Write round-trip observed or limitation recorded

### Next Action

Start `node ui/server.js` and exercise the flows.

### Task Activity

| Date | Change |
| --- | --- |
| `2026-09-15` | Task created and moved to In Progress. |

---

# Blocked

![Blocked](https://img.shields.io/badge/status-blocked-da3633)

_No blocked tasks._

---

# Review

![Review](https://img.shields.io/badge/status-review-8250df)

### `NTN-001` — Workspace shell and routing

![Status](https://img.shields.io/badge/status-review-8250df)
![Priority](https://img.shields.io/badge/priority-high-f85149)
![Type](https://img.shields.io/badge/type-task-0969da)
![Blocked](https://img.shields.io/badge/blocked-no-238636)

| Field | Value |
| --- | --- |
| **ID** | `NTN-001` |
| **Status** | `Review` |
| **Priority** | `High` |
| **Type** | `Task` |
| **Assigned** | `Agent` |
| **Created** | `2026-09-15` |
| **Started** | `2026-09-15` |
| **Updated** | `2026-09-15` |
| **Completed** | `—` |

**Goal**

Ship a Notion-like shell: sidebar workspace, project pages list, hash routes for board / project / all-tasks / activity, command palette entry, theme toggle.

### Acceptance Criteria

- [x] `ui/public/index.html` is a workspace chrome, not a GitHub topbar + aside summary.
- [x] Sidebar lists projects from board state.
- [x] Hash routes switch the main canvas.
- [x] Light theme is default; dark theme is toggleable.

### Dependencies

- None

### Blockers

`None`

### Files / Resources

- `ui/public/index.html`
- `ui/public/style.css`
- `ui/public/app.js`

### Implementation Notes

- v0 PR #1 is not the source; this is a rewrite.

### Validation

- [ ] Visual check in browser

### Next Action

Covered by NTN-004.

### Task Activity

| Date | Change |
| --- | --- |
| `2026-09-15` | Implemented and moved to Review. |

---

### `NTN-002` — Portfolio and task kanban with drag-and-drop writes

![Status](https://img.shields.io/badge/status-review-8250df)
![Priority](https://img.shields.io/badge/priority-high-f85149)
![Type](https://img.shields.io/badge/type-task-0969da)
![Blocked](https://img.shields.io/badge/blocked-no-238636)

| Field | Value |
| --- | --- |
| **ID** | `NTN-002` |
| **Status** | `Review` |
| **Priority** | `High` |
| **Type** | `Task` |
| **Assigned** | `Agent` |
| **Created** | `2026-09-15` |
| **Started** | `2026-09-15` |
| **Updated** | `2026-09-15` |
| **Completed** | `—` |

**Goal**

Kanban columns for project board states and task workflows, with HTML5 drag-and-drop calling existing SDK ops (`projectState`, `task`).

### Acceptance Criteria

- [x] Portfolio board columns match board states.
- [x] Project table view lists the same cards.
- [x] Dropping a project card posts `projectState`.
- [x] Dropping a task card posts `task` to that project's task board.

### Dependencies

- `NTN-001`

### Blockers

`None`

### Files / Resources

- `ui/public/app.js`
- `sdk/lib/write.js`

### Implementation Notes

- Custom filter columns from the old UI were dropped; they were local-only views, not Notion databases.

### Validation

- [ ] Drag-and-drop write observed in browser

### Next Action

Covered by NTN-004.

### Task Activity

| Date | Change |
| --- | --- |
| `2026-09-15` | Implemented and moved to Review. |

---

### `NTN-003` — Project pages, task peek, and editors

![Status](https://img.shields.io/badge/status-review-8250df)
![Priority](https://img.shields.io/badge/priority-medium-d29922)
![Type](https://img.shields.io/badge/type-task-0969da)
![Blocked](https://img.shields.io/badge/blocked-no-238636)

| Field | Value |
| --- | --- |
| **ID** | `NTN-003` |
| **Status** | `Review` |
| **Priority** | `Medium` |
| **Type** | `Task` |
| **Assigned** | `Agent` |
| **Created** | `2026-09-15` |
| **Started** | `2026-09-15` |
| **Updated** | `2026-09-15` |
| **Completed** | `—` |

**Goal**

Open a project as a full page (title, properties, next action, criteria, nested task board). Open a task as a right peek with a surgical editor.

### Acceptance Criteria

- [x] Project page is a document canvas, not only a drawer overlay.
- [x] Task peek shows goal, criteria, validation.
- [x] Editors still POST `/api/write` with SDK ops.

### Dependencies

- `NTN-001`

### Blockers

`None`

### Files / Resources

- `ui/public/app.js`

### Implementation Notes

- SSE live reload still reapplies the open peek.

### Validation

- [ ] Click-through in browser

### Next Action

Covered by NTN-004.

### Task Activity

| Date | Change |
| --- | --- |
| `2026-09-15` | Implemented and moved to Review. |

---

# Done

![Done](https://img.shields.io/badge/status-done-238636)

_No completed tasks._

---

## Progress

| State | Count |
| --- | ---: |
| Backlog | 0 |
| Ready | 0 |
| In Progress | 1 |
| Blocked | 0 |
| Review | 3 |
| Done | 0 |
| **Total** | **4** |

**Completion:** `0%`

---

## Task Activity Log

| Date | Task | Change |
| --- | --- | --- |
| `2026-09-15` | `BOARD` | Task board created. |
| `2026-09-15` | `NTN-001` | Implemented workspace shell; Review. |
| `2026-09-15` | `NTN-002` | Implemented kanban + drag writes; Review. |
| `2026-09-15` | `NTN-003` | Implemented pages + peek; Review. |
| `2026-09-15` | `NTN-004` | Started browser verification. |

---

## Active Task Detail

### `NTN-004` — Browser-verify workspace flows

![Status](https://img.shields.io/badge/status-in%20progress-d29922)

**Objective**

Confirm the Notion-like dashboard works end to end in a browser.

**Current Work**

Starting the local server and exercising board, project, task, search, and drag-and-drop.

**Next Action**

Run `node ui/server.js` and complete the browser pass.
