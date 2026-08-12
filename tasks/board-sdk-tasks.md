# Board SDK — Tasks

![Status](https://img.shields.io/badge/status-review-8250df)
![Backlog](https://img.shields.io/badge/backlog-0-6e7781)
![Ready](https://img.shields.io/badge/ready-0-1f6feb)
![In Progress](https://img.shields.io/badge/in%20progress-0-d29922)
![Blocked](https://img.shields.io/badge/blocked-0-da3633)
![Review](https://img.shields.io/badge/review-0-8250df)
![Done](https://img.shields.io/badge/done-8-238636)
![Updated](https://img.shields.io/badge/updated-2026-08-12-6e7781)

[Board](../BOARD.md) · [Project](../projects/board-sdk.md)

> Canonical task-level state for Board SDK.
> This file tracks executable work, task status, acceptance criteria, blockers, and task history.

---

## Task Board Overview

| Field | Value |
| --- | --- |
| **Project** | Board SDK |
| **Project ID** | `BSD` |
| **Project File** | [`../projects/board-sdk.md`](../projects/board-sdk.md) |
| **Task Prefix** | `BSD` |
| **Board Status** | `Review` |
| **Last Updated** | `2026-08-12` |
| **Active Task** | `None` |
| **Next Ready Task** | `None — all BSD tasks Done (BSD-001..008).` |

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

### `BSD-001` — SDK package skeleton + `createBoard` API

![Status](https://img.shields.io/badge/status-done-238636)
![Priority](https://img.shields.io/badge/priority-high-f85149)
![Type](https://img.shields.io/badge/type-task-0969da)
![Blocked](https://img.shields.io/badge/blocked-no-238636)

| Field | Value |
| --- | --- |
| **ID** | `BSD-001` |
| **Status** | `Done` |
| **Priority** | `High` |
| **Type** | `Task` |
| **Assigned** | `Agent` |
| **Created** | `2026-08-12` |
| **Started** | `2026-08-12` |
| **Updated** | `2026-08-12` |
| **Completed** | `2026-08-12` |

**Goal**

Create the `sdk/` package skeleton: `package.json` (zero deps, `main`/`types`/`files`/`bin`), `index.js` exposing `createBoard(repo)` with `read`, `apply`, `validate`, `watch`, and `ops`, plus placeholder `lib/` and `bin/` directories, so subsequent tasks can move the canonical libs in.

### Acceptance Criteria

- [x] `sdk/package.json` exists with `name: agent-board`, `type: commonjs`, zero `dependencies`, and `main`/`types`/`files`/`bin` fields.
- [x] `sdk/index.js` exports `createBoard(repo)` returning `{ read, apply, validate, watch, ops }` (thin delegation to `sdk/lib/`).
- [x] `node -e "require('./sdk')"` resolves without errors.

### Dependencies

- `None`

### Blockers

`None`

### Files / Resources

- `sdk/package.json`, `sdk/index.js`

### Implementation Notes

- `createBoard(repo)` defaults repo to `process.env.BOARD_REPO || process.cwd()`.
- `read` → `readState` from `sdk/lib/state.js`; `apply`/`validate` → guard + write; `watch` → `watchRepo` from `sdk/lib/watch.js`; `ops` → op names + constants.
- Keep the implementation thin; real logic lands in BSD-002.

### Validation

- [x] `node --check sdk/index.js` passes.
- [x] `node -e "const {createBoard}=require('./sdk'); const b=createBoard(process.env.BOARD_REPO); console.log(Object.keys(b).sort().join(','))"` prints `apply,ops,read,validate,watch`.

### Next Action

`Create sdk/package.json + sdk/index.js and verify the module resolves.`

### Task Activity

| Date | Change |
| --- | --- |
| `2026-08-12` | Task created. |
| `2026-08-12` | Done: `sdk/package.json` + `sdk/index.js` created; `createBoard` surface verified (`apply,ops,read,repo,validate,watch`). |


### `BSD-002` — Move canonical libs into `sdk/lib/`

![Status](https://img.shields.io/badge/status-done-238636)
![Priority](https://img.shields.io/badge/priority-high-f85149)
![Type](https://img.shields.io/badge/type-task-0969da)
![Blocked](https://img.shields.io/badge/blocked-no-238636)

| Field | Value |
| --- | --- |
| **ID** | `BSD-002` |
| **Status** | `Done` |
| **Priority** | `High` |
| **Type** | `Task` |
| **Assigned** | `Agent` |
| **Created** | `2026-08-12` |
| **Started** | `2026-08-12` |
| **Updated** | `2026-08-12` |
| **Completed** | `2026-08-12` |

**Goal**

Move `ui/lib/{parse,state,write,guard}.js` into `sdk/lib/` unchanged except for internal requires, and add `sdk/lib/watch.js` (debounced watcher extracted from `ui/server.js`), so the SDK owns the canonical board logic.

### Acceptance Criteria

- [x] `sdk/lib/` contains `parse.js`, `state.js`, `write.js`, `guard.js`, and `watch.js`.
- [x] All internal requires resolve (`node --check` passes on every file; `readState` works from `sdk/lib/`).
- [x] `ui/server.js` and `ui/lib/cli.js` no longer depend on the moved files.

### Dependencies

- `BSD-001`

### Blockers

`None`

### Files / Resources

- `ui/lib/parse.js`, `ui/lib/state.js`, `ui/lib/write.js`, `ui/lib/guard.js`
- `ui/server.js` (watch logic to extract)

### Implementation Notes

- Move files as-is first; only adjust relative requires (`./parse`, `./write` stay valid inside `sdk/lib/`).
- `watch.js` exports a debounced `watchRepo(repo, onChange, { debounceMs, filter })` returning a disposer, extracted from `ui/server.js`'s `watchDir`/`onChange`.
- Keep CRLF tolerance in `write.js` (`applyCheck` already fixed).

### Validation

- [x] `node --check` passes on `sdk/lib/*.js`.
- [x] `readState` from `sdk/lib/state.js` parses this repo cleanly.
- [x] A scratch `apply` round-trip still produces a one-line diff.

### Next Action

`Move the four lib files and extract the watcher, then run node --check + a scratch round-trip.`

### Task Activity

| Date | Change |
| --- | --- |
| `2026-08-12` | Task created. |
| `2026-08-12` | Done: libs moved to `sdk/lib/` as-is; `sdk/lib/watch.js` extracted; `node --check` clean; E2E lib load OK. |

### `BSD-003` — Rewire `ui/server.js` onto the SDK

![Status](https://img.shields.io/badge/status-done-238636)
![Priority](https://img.shields.io/badge/priority-high-f85149)
![Type](https://img.shields.io/badge/type-task-0969da)
![Blocked](https://img.shields.io/badge/blocked-no-238636)

| Field | Value |
| --- | --- |
| **ID** | `BSD-003` |
| **Status** | `Done` |
| **Priority** | `High` |
| **Type** | `Task` |
| **Assigned** | `Agent` |
| **Created** | `2026-08-12` |
| **Started** | `2026-08-12` |
| **Updated** | `2026-08-12` |
| **Completed** | `2026-08-12` |

**Goal**

Make `ui/server.js` a consumer of the SDK: state reads, writes, and file watching all go through `createBoard(REPO)`, proving the SDK works as the single source of truth.

### Acceptance Criteria

- [x] `ui/server.js` requires the SDK (not `./lib/*` directly).
- [x] `/api/state`, `/api/write`, `/api/health`, and `/events` work identically to before.
- [x] Server watch uses `board.watch(...)` (or `watchRepo` via the SDK) instead of local `watchDir` logic.

### Dependencies

- `BSD-001`, `BSD-002`

### Blockers

`None`

### Files / Resources

- `ui/server.js`

### Implementation Notes

- Replace `require('./lib/state')` / `require('./lib/guard')` with `require('../sdk')`.
- Keep the SSE broadcast and HTTP plumbing untouched; only the state/watch/write internals change.
- Smoke-test with `BOARD_REPO` pointed at a scratch copy.

### Validation

- [x] `node --check ui/server.js` passes.
- [x] `/api/health` reports the scratch repo; `/api/state` returns parsed JSON.
- [x] A `/api/write` op on a scratch task file returns `{"ok":true}` and survives a re-read.

### Next Action

`Rewire server state/watch/write to the SDK, then smoke-test against a scratch repo.`

### Task Activity

| Date | Change |
| --- | --- |
| `2026-08-12` | Task created. |
| `2026-08-12` | Done: server rewired to `require('../sdk')`; smoke-tested `/api/health`, `/api/state`, `/api/write` against scratch (write round-trip OK). |

### `BSD-004` — Move CLI into `sdk/bin/cli.js` + shim

![Status](https://img.shields.io/badge/status-done-238636)
![Priority](https://img.shields.io/badge/priority-high-f85149)
![Type](https://img.shields.io/badge/type-task-0969da)
![Blocked](https://img.shields.io/badge/blocked-no-238636)

| Field | Value |
| --- | --- |
| **ID** | `BSD-004` |
| **Status** | `Done` |
| **Priority** | `High` |
| **Type** | `Task` |
| **Assigned** | `Agent` |
| **Created** | `2026-08-12` |
| **Started** | `2026-08-12` |
| **Updated** | `2026-08-12` |
| **Completed** | `2026-08-12` |

**Goal**

Move the agent CLI into the SDK as `sdk/bin/cli.js` (wired into `package.json` `bin`), and make `ui/lib/cli.js` a thin shim so `node ui/lib/cli.js ...` keeps working for skills and docs.

### Acceptance Criteria

- [x] `sdk/bin/cli.js` exists and runs all subcommands (`read`, `apply`, `validate`, `ops`) against `BOARD_REPO`.
- [x] `ui/lib/cli.js` is a one-line shim: `require('../../sdk/bin/cli')` (or equivalent) and behaves identically.
- [x] `sdk/package.json` declares `bin` (e.g. `agent-board: bin/cli.js`).

### Dependencies

- `BSD-002`

### Blockers

`None`

### Files / Resources

- `ui/lib/cli.js`, `sdk/package.json`

### Implementation Notes

- CLI keeps `BOARD_REPO` env override; default repo root resolves from `sdk/bin` (`..`, `..` → repo root).
- Shim preserves exit codes and argv; run both entry points and compare output.
- Skills (`skills/board-edit`, `board-state`) keep referencing `node ui/lib/cli.js` — verify no skill edits are needed.

### Validation

- [x] `node sdk/bin/cli.js ops` and `node ui/lib/cli.js ops` produce identical output.
- [x] Both entry points exit 0 on `read --board` against a scratch copy.
- [x] A bad op via both entry points exits non-zero with the same error.

### Next Action

`Move the CLI, add the bin field, create the shim, and compare both entry points.`

### Task Activity

| Date | Change |
| --- | --- |
| `2026-08-12` | Task created. |
| `2026-08-12` | Done: CLI moved to `sdk/bin/cli.js`; `ui/lib/cli.js` shim added; both entry points identical (only `generatedAt` differs); exit codes match. |

### `BSD-005` — Hand-written `index.d.ts`

![Status](https://img.shields.io/badge/status-done-238636)
![Priority](https://img.shields.io/badge/priority-medium-d29922)
![Type](https://img.shields.io/badge/type-task-0969da)
![Blocked](https://img.shields.io/badge/blocked-no-238636)

| Field | Value |
| --- | --- |
| **ID** | `BSD-005` |
| **Status** | `Done` |
| **Priority** | `Medium` |
| **Type** | `Task` |
| **Assigned** | `Agent` |
| **Created** | `2026-08-12` |
| **Started** | `2026-08-12` |
| **Updated** | `2026-08-12` |
| **Completed** | `2026-08-12` |

**Goal**

Ship `sdk/index.d.ts` covering `createBoard`, the board instance methods (`read`, `apply`, `validate`, `watch`, `ops`), op types, and the re-exported constants, so TypeScript consumers get real types.

### Acceptance Criteria

- [x] `sdk/index.d.ts` declares `createBoard(repo)` and all instance methods with sensible return types.
- [x] Op type union covers the 11 ops (badge, kv, label, section, projectState, check, task, taskKV, taskBadge, taskLabel, taskCheck).
- [x] Constants (`WORKFLOW_NAMES`, `BOARD_STATES`, `PRIORITY_VALUES`) are typed as readonly arrays.

### Dependencies

- `BSD-001`

### Blockers

`None`

### Files / Resources

- `sdk/index.js`, `sdk/lib/write.js` (exports list)

### Implementation Notes

- Keep declarations broad-but-accurate; no `any` where a real union exists.
- `package.json` `types` field points at `index.d.ts`.

### Validation

- [x] `index.d.ts` is syntactically valid (checked with `tsc --noEmit` if available, else review).
- [x] Declaration names match `sdk/index.js` exports exactly.

### Next Action

`Write index.d.ts from the index.js export surface and verify names match.`

### Task Activity

| Date | Change |
| --- | --- |
| `2026-08-12` | Task created. |
| `2026-08-12` | Done: `sdk/index.d.ts` written from `index.js` export surface; `types` field wired; tsc unavailable locally so validation was a review pass. |

### `BSD-006` — SDK README + publish prep

![Status](https://img.shields.io/badge/status-done-238636)
![Priority](https://img.shields.io/badge/priority-medium-d29922)
![Type](https://img.shields.io/badge/type-task-0969da)
![Blocked](https://img.shields.io/badge/blocked-no-238636)

| Field | Value |
| --- | --- |
| **ID** | `BSD-006` |
| **Status** | `Done` |
| **Priority** | `Medium` |
| **Type** | `Task` |
| **Assigned** | `Agent` |
| **Created** | `2026-08-12` |
| **Started** | `2026-08-12` |
| **Updated** | `2026-08-12` |
| **Completed** | `2026-08-12` |

**Goal**

Write `sdk/README.md` (install, quick start, API reference, CLI usage) and finalize `sdk/package.json` metadata (`name`, `version`, `description`, `main`, `types`, `files`, `bin`, `engines`, `repository`, `license`) so the package is publish-ready.

### Acceptance Criteria

- [x] `sdk/README.md` documents `createBoard` usage with a working example.
- [x] `sdk/package.json` has all publish fields; `files` whitelists `index.js`, `index.d.ts`, `lib/`, `bin/`, `README.md`.
- [x] `npm pack --dry-run` succeeds from `sdk/` and lists only intended files.

### Dependencies

- `BSD-001`, `BSD-005`

### Blockers

`None`

### Files / Resources

- `sdk/README.md`, `sdk/package.json`

### Implementation Notes

- Do not publish (user step with OTP); validate with `npm pack --dry-run` only.
- `bin` name: `board-sdk` (matches DEC-003 working name).
- Note in README that `BOARD_REPO` env or an explicit repo path selects the board repo.

### Validation

- [x] `npm pack --dry-run` lists the intended file set.
- [x] README example code is syntactically valid JS (run it against a scratch repo).

### Next Action

`Write README + finalize package.json, then run npm pack --dry-run.`

### Task Activity

| Date | Change |
| --- | --- |
| `2026-08-12` | Task created. |
| `2026-08-12` | Done: `sdk/README.md` written; `npm pack --dry-run` OK (10 files, 15.5 kB); name `board-sdk` previously unpublished (npm E404) — recorded as TDEC-002. |

### `BSD-007` — End-to-end validation

![Status](https://img.shields.io/badge/status-done-238636)
![Priority](https://img.shields.io/badge/priority-high-f85149)
![Type](https://img.shields.io/badge/type-task-0969da)
![Blocked](https://img.shields.io/badge/blocked-no-238636)

| Field | Value |
| --- | --- |
| **ID** | `BSD-007` |
| **Status** | `Done` |
| **Priority** | `High` |
| **Type** | `Task` |
| **Assigned** | `Agent` |
| **Created** | `2026-08-12` |
| **Started** | `2026-08-12` |
| **Updated** | `2026-08-12` |
| **Completed** | `2026-08-12` |

**Goal**

Validate the SDK end to end on a scratch repo copy: `createBoard` API round-trips, server smoke tests through the SDK, CLI via both entry points, and `npm pack --dry-run`, recording only real results.

### Acceptance Criteria

- [x] `createBoard(scratch).read()` parses board + projects + tasks.
- [x] `createBoard(scratch).apply(target, ops)` round-trips a task status change with a one-line diff.
- [x] `createBoard(scratch).watch(cb)` emits on a file change and disposes cleanly.
- [x] Server `/api/state` + `/api/write` work against scratch through the SDK.
- [x] CLI `read`/`apply`/`validate`/`ops` behave identically via `ui/lib/cli.js` and `sdk/bin/cli.js`.
- [x] `npm pack --dry-run` succeeds and `node --check` is clean across `sdk/`.

### Dependencies

- `BSD-002`, `BSD-003`, `BSD-004`, `BSD-005`, `BSD-006`

### Blockers

`None`

### Files / Resources

- Scratch repo copy (`$env:TEMP\bsd-scratch-*`)
- `sdk/`, `ui/server.js`, `ui/lib/cli.js`

### Implementation Notes

- Reuse the toolkit's scratch approach: copy the repo, run ops, verify diffs, then discard.
- Only record validation that actually ran.

### Validation

- [x] All acceptance criteria above executed with recorded results.

### Next Action

`Run the validation suite on a scratch copy and record results on this task.`

### Task Activity

| Date | Change |
| --- | --- |
| `2026-08-12` | Task created. |
| `2026-08-12` | Done: E2E suite passed on scratch (18/18 assertions: read/apply/validate/watch, server smoke, CLI parity, pack dry-run). |

### `BSD-008` — Zero-dependency test harness (`npm test`)

![Status](https://img.shields.io/badge/status-done-238636)
![Priority](https://img.shields.io/badge/priority-high-f85149)
![Type](https://img.shields.io/badge/type-task-0969da)
![Blocked](https://img.shields.io/badge/blocked-no-238636)

| Field | Value |
| --- | --- |
| **ID** | `BSD-008` |
| **Status** | `Done` |
| **Priority** | `High` |
| **Type** | `Task` |
| **Assigned** | `Agent` |
| **Created** | `2026-08-12` |
| **Started** | `2026-08-12` |
| **Updated** | `2026-08-12` |
| **Completed** | `2026-08-12` |

**Goal**

Build a repeatable pre-publish test harness using only Node's built-in `node:test` runner (zero dependencies), so the SDK can be verified end-to-end before publishing: API surface, every op, error paths, watch, the real CLI, the legacy shim, the packed tarball, and a real-repo consumer smoke test — all against throwaway scratch repos.

### Acceptance Criteria

- [x] `sdk/test/harness.js` generates an isolated scratch board repo (BOARD.md + projects/ + tasks/) in a temp dir; no test touches the real repository.
- [x] `sdk/test/api.test.js` covers `createBoard` repo resolution, all `read` variants + error paths, `ops()` vocabulary, `validate`, `apply` for all 11 ops (incl. backtick taskCheck), dryRun, watch + disposer, module re-exports, multi-op applies, and re-parse round-trips.
- [x] `sdk/test/cli.test.js` spawns `sdk/bin/cli.js` (read/apply/validate/ops, `--dry-run`, `--pretty`) and asserts exit codes 0/1/2; verifies the `ui/lib/cli.js` shim output is identical to the SDK CLI.
- [x] `sdk/package.json` gains `"test": "node --test test/api.test.js test/cli.test.js"`; `npm test` passes (48/48).
- [x] `npm pack --dry-run` still lists only the 10 intended files — `test/` is excluded from the tarball.
- [x] Consumer smoke: packed tarball installs into a scratch consumer, `require('agent-board')` resolves, and the `agent-board` npm bin runs against a copy of the real repo.

### Dependencies

- `BSD-007`

### Blockers

`None`

### Files / Resources

- `sdk/test/harness.js`, `sdk/test/api.test.js`, `sdk/test/cli.test.js`, `sdk/package.json`

### Implementation Notes

- `harness.js` builds a minimal but valid board from fixture strings (`makeScratchRepo`/`removeScratchRepo`) so every test is fully isolated and deterministic.
- Badge ops preserve the existing badge color by design (only label/value change) — tests assert value-only updates.
- Windows note: `path.relative` sources use backslashes, so assertions normalize or check suffixes.
- The old `sdk/test/e2e-sdk-test.js` is superseded by this harness (kept in repo as history; not part of `npm test`).

### Validation

- [x] `npm test --prefix sdk` → 48/48 pass (36 API + 12 CLI) on this machine.
- [x] `npm run check --prefix sdk` → syntax checks pass for all 7 shipped files.
- [x] `npm pack --dry-run` → `agent-board-0.1.0.tgz`, 10 files, 15.5 kB, `test/` excluded.
- [x] Consumer smoke in a temp project: tarball install + `require('agent-board')` + `agent-board` bin against a copy of the real repo → 12/12 passed.

### Next Action

`SDK verified end-to-end; ready for the user's publish step (npm publish with OTP).`

### Task Activity

| Date | Change |
| --- | --- |
| `2026-08-12` | Task created. |
| `2026-08-12` | Done: harness written (harness.js + api.test.js + cli.test.js + `npm test` script); 48/48 pass; pack dry-run clean; consumer smoke 12/12 against a real-repo copy. |

---

## Active Task Detail

> Maintain detailed short-term execution context for the primary active task.
> This section should mirror the actual active task, not become a second task definition.

_No active task — all BSD tasks are Done (BSD-001..008) and the project is in Review awaiting acceptance._

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
| `BSD-001` | — | — | Done |
| `BSD-002` | `BSD-001` | Sequential | Done |
| `BSD-003` | `BSD-001`, `BSD-002` | Sequential | Done |
| `BSD-004` | `BSD-002` | Sequential | Done |
| `BSD-005` | `BSD-001` | Sequential | Done |
| `BSD-006` | `BSD-001`, `BSD-005` | Sequential | Done |
| `BSD-007` | `BSD-002`–`BSD-006` | Sequential | Done |
| `BSD-008` | `BSD-007` | Sequential | Done |

---

## Task Decisions

> Record durable task-level decisions here when they matter beyond temporary working notes.
> Project-level decisions belong in the associated project file.

| ID | Date | Task | Decision | Reason |
| --- | --- | --- | --- | --- |
| `TDEC-001` | `2026-08-12` | `BSD-004` | Keep `ui/lib/cli.js` as a one-line shim over `sdk/bin/cli.js` | Skills and docs reference `node ui/lib/cli.js`; the shim keeps those paths stable while the canonical CLI lives in the SDK |
| `TDEC-002` | `2026-08-12` | `BSD-006` | Package name `board-sdk` was previously published and unpublished (npm E404, 2023-09-15); npm may hold the name | Confirm the final npm name with the user at publish time; fall back to an alternative name if `board-sdk` is unavailable |
| `TDEC-003` | `2026-08-12` | `BSD-006` | Final npm package name: `agent-board` (user decision 2026-08-12); `npm view agent-board` returns E404 — available, no prior publish history | Supersedes TDEC-002's open name question; availability verified before publish |
