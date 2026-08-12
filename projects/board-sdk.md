# Board SDK

![Status](https://img.shields.io/badge/status-review-8250df)
![Priority](https://img.shields.io/badge/priority-high-f85149)
![Progress](https://img.shields.io/badge/progress-100%25-238636)
![Updated](https://img.shields.io/badge/updated-2026-08-12-6e7781)

[Board](../BOARD.md) · [Tasks](../tasks/board-sdk-tasks.md)

> A publishable, zero-dependency Node SDK that wraps the board's read layer, surgical write layer, and file watching behind a single `createBoard(repo)` API — the programmatic interface that the dashboard server and agent CLI both consume.

---

## Project Overview

| Field | Value |
| --- | --- |
| **Project ID** | `BSD` |
| **Project Name** | Board SDK |
| **Status** | `Review` |
| **Priority** | `High` |
| **Owner** | `Agent` |
| **Started** | `2026-08-12` |
| **Target** | `2026-08-12` |
| **Last Updated** | `2026-08-12` |
| **Task Board** | [`../tasks/board-sdk-tasks.md`](../tasks/board-sdk-tasks.md) |

---

## Objective

Turn the board's Markdown state system into a working SDK: a standalone, npm-publishable package (zero runtime dependencies, CommonJS) that exposes `createBoard(repo) -> { read, apply, validate, watch, ops }`. The canonical board libraries move into `sdk/lib/`, and the dashboard server (`ui/server.js`) plus the agent CLI (`ui/lib/cli.js`) become consumers of the SDK so all programmatic access shares one source of truth.

---

## Success Criteria

The project is considered complete when:

- [x] `sdk/` is a standalone zero-dependency package exposing `createBoard(repo)` with `read`, `apply`, `validate`, `watch`, and `ops`.
- [x] Canonical board libs (`parse`, `state`, `write`, `guard`, plus a new `watch` module) live in `sdk/lib/`; `ui/server.js` and `ui/lib/cli.js` consume the SDK.
- [x] `sdk/index.d.ts` covers the public API, and `sdk/package.json` is publish-ready (`main`, `types`, `files`, `bin`).
- [x] Validated end to end: scratch-repo read/apply round-trips, server + CLI smoke tests, consumer `require`, and a publish dry-run.

---

## Current State

![State](https://img.shields.io/badge/current-review-8250df)

**Summary**

SDK implemented end to end and validated on a scratch repo: `createBoard(repo)` with `read`/`apply`/`validate`/`watch`/`ops`; canonical libs in `sdk/lib/`; server and CLI both consume the SDK; `index.d.ts` + publish-ready package; E2E suite 18/18 and `npm pack --dry-run` clean. A repeatable zero-dependency test harness (`npm test`, BSD-008) now verifies the full API + CLI surface, the packed tarball, and a real-repo consumer smoke test (48/48 + 12/12). Awaiting user acceptance; publishing under the user-chosen npm name `agent-board` is the user's step.

**Current Focus**

None — all BSD tasks Done (BSD-001..008).

**Next Milestone**

None — M1, M2, and M3 complete.

**Next Action**

User review of the SDK delivery; on approval, publish `agent-board` (user step with OTP).

---

## Scope

### In Scope

- Standalone `sdk/` package: `package.json`, `index.js`, `index.d.ts`, `README.md`, `lib/`, `bin/`.
- Moving `ui/lib/{parse,state,write,guard}.js` into `sdk/lib/` unchanged except for internal requires.
- New `sdk/lib/watch.js` (debounced file watcher extracted from `ui/server.js`).
- `createBoard(repo)` public API: `read`, `apply`, `validate`, `watch`, `ops`.
- Rewiring `ui/server.js` and `ui/lib/cli.js` to consume the SDK (CLI stays reachable at `node ui/lib/cli.js`).
- Publish prep: package metadata, README, `npm pack --dry-run` check.

### Out of Scope

- Publishing to npm (requires user credentials/OTP; final package name to be confirmed).
- TypeScript compilation (plain JS + hand-written `.d.ts`).
- MCP server or remote hosting.
- Changing the board Markdown schema, templates, or op vocabulary.
- VS Code extension (backlog BAT-005).

---

## Requirements

### Functional

- `createBoard(repo)` returns a board instance with `read`, `apply`, `validate`, `watch`, and `ops`.
- `apply` supports `--dry-run`-style preview (`{ dryRun: true }`) and refuses writes that do not re-parse.
- `watch` reports changes to `BOARD.md`, `projects/*.md`, and `tasks/*-tasks.md` with debounce, and returns a disposer.
- `ui/server.js` serves state and writes exclusively through the SDK.
- `node ui/lib/cli.js ...` continues to work unchanged (thin shim over the SDK's CLI).

### Non-Functional

- Zero runtime npm dependencies (Node built-ins only).
- CommonJS, plain JS; hand-written `index.d.ts` for consumers.
- Single source of truth: canonical libs live in `sdk/lib/`; the server and CLI never fork them.
- `node --check` clean on every moved or new file.

---

## Deliverables

| Deliverable | Status | Reference |
| --- | --- | --- |
| SDK package metadata + entry | `Done` | `sdk/package.json`, `sdk/index.js` |
| Canonical libs in `sdk/lib/` | `Done` | `sdk/lib/` |
| Watch module | `Done` | `sdk/lib/watch.js` |
| Server consuming SDK | `Done` | `ui/server.js` |
| CLI in SDK + `ui/lib/cli.js` shim | `Done` | `sdk/bin/cli.js`, `ui/lib/cli.js` |
| Type declarations | `Done` | `sdk/index.d.ts` |
| SDK README + publish prep | `Done` | `sdk/README.md` |

---

## Milestones

| ID | Milestone | Status | Target |
| --- | --- | --- | --- |
| `M1` | SDK core: package + `createBoard` API | `Complete` | `2026-08-12` |
| `M2` | Consumers rewired (server + CLI) | `Complete` | `2026-08-12` |
| `M3` | Types, publish prep, and validation | `Complete` | `2026-08-12` |

---

## Dependencies

### Internal

- `ui/lib/parse.js`, `ui/lib/state.js`, `ui/lib/write.js`, `ui/lib/guard.js` (to move into `sdk/lib/`).
- `ui/server.js`, `ui/lib/cli.js` (to rewire onto the SDK).
- `skills/board-edit/SKILL.md` (documents `node ui/lib/cli.js`; path must keep working).

### External

- Node.js >= 18 (runtime only, no packages).

---

## Constraints

- Zero runtime npm dependencies.
- Plain CommonJS; hand-written `.d.ts` (no TypeScript build step).
- Canonical libs must live in exactly one place (`sdk/lib/`); server and CLI consume, never fork.
- `node ui/lib/cli.js` remains a working agent entry point (skills and docs reference it).

---

## Risks

| ID | Risk | Impact | Mitigation | Status |
| --- | --- | --- | --- | --- |
| `RISK-001` | Moving libs breaks internal relative requires | High | Move files as-is, run `node --check` + scratch round-trips immediately after | Closed — libs moved cleanly; all checks green |
| `RISK-002` | Rewiring server/CLI introduces regressions | High | Smoke-test `/api/state`, `/api/write`, and all CLI subcommands after rewiring | Closed — server + CLI smoke tests passed |
| `RISK-003` | Desired npm package name is taken | Low | Verify with `npm view` before publish; rename is a one-field change (see DEC-003) | Open — `board-sdk` previously published/unpublished (npm E404); confirm at publish |

---

## Decisions

| ID | Date | Decision | Reason | Affects |
| --- | --- | --- | --- | --- |
| `DEC-001` | `2026-08-12` | SDK lives in-repo at `sdk/`; canonical libs move from `ui/lib/` to `sdk/lib/`; server and CLI consume the SDK | Single source of truth for all programmatic access; matches DEC-002 of the toolkit project | Architecture |
| `DEC-002` | `2026-08-12` | Plain CommonJS + hand-written `index.d.ts` instead of TypeScript | Zero-dep constraint and no build step; types still ship for consumers | Language |
| `DEC-003` | `2026-08-12` | Package name `agent-board` (user-chosen 2026-08-12); `npm view agent-board` returns E404 — currently available; supersedes provisional `board-sdk` | Name availability checked before publish; rename is a single-field change | Packaging |

---

## Open Questions

- [x] Final npm package name — resolved 2026-08-12: user chose `agent-board`; `npm view agent-board` returns E404 (available, no prior publish history). Supersedes provisional `board-sdk` (see TDEC-002/TDEC-003).

---

## References

### Repository

- `ui/lib/parse.js`, `ui/lib/state.js`, `ui/lib/write.js`, `ui/lib/guard.js`
- `ui/server.js`, `ui/lib/cli.js`
- `skills/board-edit/SKILL.md`, `skills/board-state/SKILL.md`

### Documentation

- `docs/INSTRUCTIONS.md`, `docs/HOWTO.md`

### External

- Node.js CommonJS module system (Node >= 18).

---

## Project Notes

- The CLI must stay reachable at `node ui/lib/cli.js`; it becomes a thin shim over the SDK's CLI (`sdk/bin/cli.js`) so skills and docs keep working.
- The SDK watch reuses the debounced `fs.watch` approach already proven in `ui/server.js` — extracted, not forked.
- Publishing is a user step (npm credentials/OTP); this project prepares the package and validates it with `npm pack --dry-run`.

---

## Activity

> Record meaningful project-level state changes only.

| Date | Change |
| --- | --- |
| `2026-08-12` | Project created after user approved the SDK idea (publishable npm package, plain JS, full read/write/validate/watch surface). |
| `2026-08-12` | All BSD tasks (001-007) implemented and validated; project moved to Review awaiting user acceptance. |
| `2026-08-12` | BSD-008 added: zero-dependency test harness (`npm test` — API + CLI suites, 48/48) plus a packed-tarball consumer smoke test (12/12 against a real-repo copy). SDK verified end to end; still in Review awaiting user acceptance. |

---

## Agent Protocol

This file is the canonical source for **project-level state**.

The associated task board is the canonical source for **task-level state**:

[`../tasks/board-sdk-tasks.md`](../tasks/board-sdk-tasks.md)

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
