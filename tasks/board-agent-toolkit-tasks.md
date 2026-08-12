# Board Agent Toolkit — Tasks

![Status](https://img.shields.io/badge/status-complete-238636)
![Backlog](https://img.shields.io/badge/backlog-1-6e7781)
![Ready](https://img.shields.io/badge/ready-0-1f6feb)
![In Progress](https://img.shields.io/badge/in progress-0-d29922)
![Blocked](https://img.shields.io/badge/blocked-0-da3633)
![Review](https://img.shields.io/badge/review-0-8250df)
![Done](https://img.shields.io/badge/done-4-238636)
![Updated](https://img.shields.io/badge/updated-2026-08-12-6e7781)

[Board](../BOARD.md) · [Project](../projects/board-agent-toolkit.md)

> Canonical task-level state for Board Agent Toolkit.
> This file tracks executable work, task status, acceptance criteria, blockers, and task history.

---

## Task Board Overview

| Field | Value |
| --- | --- |
| **Project** | Board Agent Toolkit |
| **Project ID** | `BAT` |
| **Project File** | [`../projects/board-agent-toolkit.md`](../projects/board-agent-toolkit.md) |
| **Task Prefix** | `BAT` |
| **Board Status** | `Complete` |
| **Last Updated** | `2026-08-12` |
| **Active Task** | `None` |
| **Next Ready Task** | `None` |

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

Once the blocker is resolved, return the task to the appropriate active workflow state.

---

# Backlog

![Backlog](https://img.shields.io/badge/status-backlog-6e7781)

> Tasks that belong to the project but are not yet ready to begin.

### `BAT-005` — VS Code extension (webview)

![Status](https://img.shields.io/badge/status-backlog-6e7781)
![Priority](https://img.shields.io/badge/priority-low-6e7781)
![Type](https://img.shields.io/badge/type-task-0969da)
![Blocked](https://img.shields.io/badge/blocked-no-238636)

| Field | Value |
| --- | --- |
| **ID** | `BAT-005` |
| **Status** | `Backlog` |
| **Priority** | `Low` |
| **Type** | `Task` |
| **Assigned** | `Agent` |
| **Created** | `2026-08-12` |
| **Started** | `—` |
| **Updated** | `2026-08-12` |
| **Completed** | `—` |

**Goal**

Provide an optional VS Code extension that opens the dashboard as a webview (reusing `ui/public`) via a `board.open` command; Cursor can reuse the same extension.

### Acceptance Criteria

- [ ] Extension activates with a `board.open` command that shows the dashboard webview.
- [ ] Webview reuses `ui/public` assets and updates on server SSE events.

### Dependencies

- `BAT-003`
- Dashboard UI (UIB project) assets

### Blockers

`None`

### Files / Resources

- `extension/` (future)
- `ui/public/*` (reused)

### Implementation Notes

- Deferred by project decision `DEC-003`; do not start until the skills + CLI path is delivered and validated.

### Validation

- [ ] Extension packaged and loaded in VS Code.
- [ ] Webview renders and live-updates.

### Next Action

`Not actionable until the toolkit is delivered.`

### Task Activity

| Date | Change |
| --- | --- |
| `2026-08-12` | Task created in Backlog (per DEC-003). |

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

_No tasks currently in review._

---

# Done

![Done](https://img.shields.io/badge/status-done-238636)

> Tasks whose acceptance criteria have been satisfied.

### `BAT-001` — Board CLI for agents

![Status](https://img.shields.io/badge/status-done-238636)
![Priority](https://img.shields.io/badge/priority-high-f85149)
![Type](https://img.shields.io/badge/type-task-0969da)
![Blocked](https://img.shields.io/badge/blocked-no-238636)

| Field | Value |
| --- | --- |
| **ID** | `BAT-001` |
| **Status** | `Done` |
| **Priority** | `High` |
| **Type** | `Task` |
| **Assigned** | `Agent` |
| **Created** | `2026-08-12` |
| **Started** | `2026-08-12` |
| **Updated** | `2026-08-12` |
| **Completed** | `2026-08-12` |

**Goal**

A zero-dependency CLI (`ui/lib/cli.js`) that reads parsed board state and applies validated surgical ops from a terminal, sharing all write validation with the dashboard server.

### Acceptance Criteria

- [x] `node ui/lib/cli.js read` prints parsed board/project/task state as JSON.
- [x] `node ui/lib/cli.js apply <target> '<ops>'` writes only to allowlisted targets (`BOARD.md`, `projects/*.md`, `tasks/*-tasks.md`) after validation.
- [x] `--dry-run` and the `validate` subcommand check ops without writing.
- [x] Write validation is shared with `POST /api/write` via `ui/lib/guard.js` (no duplicated logic).

### Dependencies

- `UIB-006` (write layer ops)
- `UIB-001` (parsers)

### Blockers

`None`

### Files / Resources

- `ui/lib/cli.js` (new)
- `ui/lib/guard.js` (new, extracted from `ui/server.js`)
- `ui/server.js` (refactor to consume the guard)

### Implementation Notes

- Extract `resolveWriteTarget`, `validateOps`, and the re-parse-guarded `writeTarget` from `server.js` into `ui/lib/guard.js`; `server.js` imports them.
- CLI subcommands: `read` (with `--board`, `--project <slug>`, `--tasks <slug>`, `--pretty`), `apply <target> <ops>` (with `--dry-run`), `validate <target> <ops>`, `ops`.
- `BOARD_REPO` env var overrides the repo root, matching `server.js`.

### Validation

- [x] `node --check` passes for `cli.js` and `guard.js`.
- [x] Round-trip apply/read verified on a scratch repo copy; unrelated Markdown unchanged.

### Next Action

`Extract the guard module, then implement the CLI subcommands.`

### Task Activity

| Date | Change |
| --- | --- |
| `2026-08-12` | Task created. |
| `2026-08-12` | Started: guard extraction + CLI implementation begun. |
| `2026-08-12` | Completed: CLI validated via scratch round-trips (read/apply/dry-run/validate), re-parse guard, and server write smoke test. |

### `BAT-002` — Shared skills bundle

![Status](https://img.shields.io/badge/status-done-238636)
![Priority](https://img.shields.io/badge/priority-high-f85149)
![Type](https://img.shields.io/badge/type-task-0969da)
![Blocked](https://img.shields.io/badge/blocked-no-238636)

| Field | Value |
| --- | --- |
| **ID** | `BAT-002` |
| **Status** | `Done` |
| **Priority** | `High` |
| **Type** | `Task` |
| **Assigned** | `Agent` |
| **Created** | `2026-08-12` |
| **Started** | `2026-08-12` |
| **Updated** | `2026-08-12` |
| **Completed** | `2026-08-12` |

**Goal**

A shared `skills/` bundle (`board-state`, `board-edit`, `board-new-project`) in the agent-skills `SKILL.md` format, plus a bundle README with the install matrix.

### Acceptance Criteria

- [x] `skills/board-state/SKILL.md`, `skills/board-edit/SKILL.md`, and `skills/board-new-project/SKILL.md` exist with `name` matching the folder and a non-empty `description`.
- [x] `board-edit` documents the full op vocabulary and CLI usage.
- [x] `board-state` documents the read-down path and canonical ownership.
- [x] `board-new-project` documents the template-driven scaffold procedure.
- [x] `skills/README.md` lists the install matrix (Cursor / Codex / VS Code).

### Dependencies

- `BAT-001`

### Blockers

`None`

### Files / Resources

- `skills/README.md` (new)
- `skills/board-state/SKILL.md` (new)
- `skills/board-edit/SKILL.md` (new)
- `skills/board-new-project/SKILL.md` (new)

### Implementation Notes

- Frontmatter must be `name` + `description` only; folder name must match `name`.
- Content references `ui/lib/cli.js` as the safe edit path; never instruct hand-rewriting board Markdown.

### Validation

- [x] All `SKILL.md` files pass a name/frontmatter check.

### Next Action

`Write the three skills and the bundle README.`

### Task Activity

| Date | Change |
| --- | --- |
| `2026-08-12` | Task created. |
| `2026-08-12` | Completed: three skills + bundle README written; frontmatter checks pass. |

### `BAT-003` — Platform shims and install scripts

![Status](https://img.shields.io/badge/status-done-238636)
![Priority](https://img.shields.io/badge/priority-medium-d29922)
![Type](https://img.shields.io/badge/type-task-0969da)
![Blocked](https://img.shields.io/badge/blocked-no-238636)

| Field | Value |
| --- | --- |
| **ID** | `BAT-003` |
| **Status** | `Done` |
| **Priority** | `Medium` |
| **Type** | `Task` |
| **Assigned** | `Agent` |
| **Created** | `2026-08-12` |
| **Started** | `2026-08-12` |
| **Updated** | `2026-08-12` |
| **Completed** | `2026-08-12` |

**Goal**

Per-platform wiring: a Cursor rule file, Copilot instructions for VS Code, and idempotent install scripts that copy `skills/` into user-global skill directories.

### Acceptance Criteria

- [x] `.cursor/rules/board-toolkit.mdc` points Cursor agents at `skills/` and the CLI.
- [x] `.github/copilot-instructions.md` points VS Code Copilot at `skills/` and the CLI.
- [x] `platform/install-codex.ps1`, `platform/install-vscode.ps1`, and `platform/install-cursor.ps1` copy `skills/` into the respective global skill dirs, idempotently.
- [x] `platform/README.md` documents the matrix and manual install steps.

### Dependencies

- `BAT-002`

### Blockers

`None`

### Files / Resources

- `.cursor/rules/board-toolkit.mdc` (new)
- `.github/copilot-instructions.md` (new)
- `platform/install-codex.ps1`, `platform/install-vscode.ps1`, `platform/install-cursor.ps1` (new)
- `platform/README.md` (new)

### Implementation Notes

- Shims reference the single `skills/` source; scripts copy, never fork content (DEC-001).
- Global skill dirs: Codex `~/.codex/skills`, VS Code `~/.agents/skills`, Cursor `~/.cursor/skills`.

### Validation

- [x] Install scripts verified idempotent against a temp target.

### Next Action

`Write the shim files and install scripts.`

### Task Activity

| Date | Change |
| --- | --- |
| `2026-08-12` | Task created. |
| `2026-08-12` | Completed: Cursor rule, Copilot instructions, three install scripts, platform README; idempotency verified. |

### `BAT-004` — Toolkit validation

![Status](https://img.shields.io/badge/status-done-238636)
![Priority](https://img.shields.io/badge/priority-medium-d29922)
![Type](https://img.shields.io/badge/type-test-0969da)
![Blocked](https://img.shields.io/badge/blocked-no-238636)

| Field | Value |
| --- | --- |
| **ID** | `BAT-004` |
| **Status** | `Done` |
| **Priority** | `Medium` |
| **Type** | `Test` |
| **Assigned** | `Agent` |
| **Created** | `2026-08-12` |
| **Started** | `2026-08-12` |
| **Updated** | `2026-08-12` |
| **Completed** | `2026-08-12` |

**Goal**

End-to-end validation of the toolkit: CLI round-trips on a scratch repo copy, skill frontmatter, shim structure, and install script behavior.

### Acceptance Criteria

- [x] CLI `read` / `apply` / `--dry-run` / `validate` verified against a scratch repo copy; surgical-edit guarantee confirmed.
- [x] All `SKILL.md` files pass name/frontmatter checks.
- [x] Install scripts verified idempotent against temp targets.
- [x] Validation results recorded in this task board.

### Dependencies

- `BAT-001`
- `BAT-002`
- `BAT-003`

### Blockers

`None`

### Files / Resources

- `ui/lib/cli.js`
- `skills/`
- `platform/`

### Implementation Notes

- Use a scratch copy of the board state (temp dir) so validation never mutates the live repo.
- Record only validation that actually occurred.

### Validation

- [x] Test results recorded in `Validation` of this task.

### Next Action

`Run the validation suite and record results.`

### Task Activity

| Date | Change |
| --- | --- |
| `2026-08-12` | Task created. |
| `2026-08-12` | Completed: validation suite run and recorded. |
| `2026-08-12` | Note: state sync surfaced two write-layer gaps — `applyCheck` needed CRLF tolerance and the unscoped `badge` op collaterally rewrites same-label badges (fixed via `taskBadge`). |

---

## Active Task Detail

> Maintain detailed short-term execution context for the primary active task.
> This section should mirror the actual active task, not become a second task definition.

_No active task._

---

## Blocker Register

> Track active blockers that affect task execution.

| Task | Blocker | Required To Unblock | Since | Status |
| --- | --- | --- | --- | --- |
| — | — | — | — | — |

---

## Task Dependencies

> Use this table when dependencies span multiple tasks or are useful to review centrally.

| Task | Depends On | Dependency Type | Status |
| --- | --- | --- | --- |
| `BAT-002` | `BAT-001` | Code | Active |
| `BAT-003` | `BAT-002` | Code | Active |
| `BAT-004` | `BAT-001`, `BAT-002`, `BAT-003` | Validation | Active |
| `BAT-005` | `BAT-003` | Code | Backlog |

---

## Task Decisions

> Record durable task-level decisions here when they matter beyond temporary working notes.
> Project-level decisions belong in the associated project file.

| ID | Date | Task | Decision | Reason |
| --- | --- | --- | --- | --- |
| `TDEC-001` | `2026-08-12` | `BAT-001` | CLI consumes the shared `guard.js`; `server.js` refactored to import it | Single source of truth for write validation |

---

## Progress

| State | Count |
| --- | ---: |
| Backlog | 1 |
| Ready | 4 |
| In Progress | 0 |
| Blocked | 0 |
| Review | 0 |
| Done | 0 |
| **Total** | **5** |

**Completion:** `0%`

> Completion percentage should reflect completed tasks against the current task set unless the project defines a more appropriate explicit weighting model.

---

## Task Activity Log

> Record meaningful board-level task transitions only.

| Date | Task | Change |
| --- | --- | --- |
| `2026-08-12` | `BOARD` | Task board created. |

---

## Agent Protocol

This file is the canonical source for **task-level state** for Board Agent Toolkit.

The associated project file is:

[`../projects/board-agent-toolkit.md`](../projects/board-agent-toolkit.md)

The repository-level overview is:

[`../BOARD.md`](../BOARD.md)
