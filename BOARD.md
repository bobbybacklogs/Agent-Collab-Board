# Project Board

![Board](https://img.shields.io/badge/board-portfolio-0969da)
![Projects](https://img.shields.io/badge/projects-4-0969da)
![Active](https://img.shields.io/badge/active-1-238636)
![Blocked](https://img.shields.io/badge/blocked-0-da3633)
![Review](https://img.shields.io/badge/review-1-8250df)
![Complete](https://img.shields.io/badge/complete-2-238636)
![Updated](https://img.shields.io/badge/updated-2026--09--15-6e7781)

> Repository-wide project overview and coordination board.
> Detailed project state lives in `/projects`. Detailed task execution lives in `/tasks`.

---

## Board Overview

| Field | Value |
| --- | --- |
| **Board Status** | `Active` |
| **Total Projects** | `4` |
| **Active Projects** | `1` |
| **Blocked Projects** | `0` |
| **Projects in Review** | `1` |
| **Completed Projects** | `2` |
| **Current Focus** | `Notion-like Agent Dashboard` |
| **Last Updated** | `2026-09-15` |

---

## Current Focus

![Focus](https://img.shields.io/badge/focus-notion%20dashboard-238636)

**Primary Project**

`Notion-like Agent Dashboard`

**Current Objective**

`A real Notion-like workspace over the Markdown board — sidebar pages, kanban, drag-and-drop writes — replacing the gutted v0 PR #1 reskin.`

**Active Task**

NTN-004 browser verification of workspace flows.

**Next Action**

Finish the browser pass on `node ui/server.js`, then move NTN tasks through Review.

**Why This Is Current**

`PR #1 (v0) deleted the dashboard stylesheet and did not ship a usable kanban. This project rebuilds the UI the original request asked for, on the existing SDK write path.`

---

## Projects

> Each project appears exactly once in one primary project-state section below.

---

# Planning

![Planning](https://img.shields.io/badge/status-planning-6e7781)

> Projects still being defined.

_No projects currently in planning._

---

# Ready

![Ready](https://img.shields.io/badge/status-ready-1f6feb)

> Projects sufficiently defined and ready for execution.

_No projects currently in ready._

---

# Active

![Active](https://img.shields.io/badge/status-active-238636)

> Projects currently receiving active execution.

### Notion-like Agent Dashboard

![Status](https://img.shields.io/badge/status-active-238636)
![Priority](https://img.shields.io/badge/priority-high-f85149)
![Progress](https://img.shields.io/badge/progress-90%25-238636)
![Blocked](https://img.shields.io/badge/blocked-no-238636)

**Project:** [`projects/notion-dashboard.md`](projects/notion-dashboard.md)  
**Tasks:** [`tasks/notion-dashboard-tasks.md`](tasks/notion-dashboard-tasks.md)

| Field | Value |
| --- | --- |
| **Project ID** | `NTN` |
| **Status** | `Active` |
| **Priority** | `High` |
| **Progress** | `90%` |
| **Current Task** | `NTN-004` |
| **Next Task** | `Browser verification, then Review` |
| **Target** | `2026-09-15` |
| **Updated** | `2026-09-15` |

**Objective**

A Notion-like workspace dashboard for agents and humans over the Markdown board: sidebar pages, portfolio kanban, nested task boards, and drag-and-drop surgical writes.

**Current State**

UI rewrite implemented (`ui/public/*`). Browser verification in progress. v0 PR #1 is not merged.

**Next Action**

Complete NTN-004 browser verification.

# Blocked

![Blocked](https://img.shields.io/badge/status-blocked-da3633)

> Projects whose overall progress is materially prevented by a dependency or unresolved issue.

_No blocked projects._

---

# Review

![Review](https://img.shields.io/badge/status-review-8250df)

> Projects whose primary execution is complete and are undergoing final validation or acceptance.

### Board SDK

![Status](https://img.shields.io/badge/status-review-8250df)
![Priority](https://img.shields.io/badge/priority-high-f85149)
![Progress](https://img.shields.io/badge/progress-100%25-238636)
![Blocked](https://img.shields.io/badge/blocked-no-238636)

**Project:** [`projects/board-sdk.md`](projects/board-sdk.md)  
**Tasks:** [`tasks/board-sdk-tasks.md`](tasks/board-sdk-tasks.md)

| Field | Value |
| --- | --- |
| **Project ID** | `BSD` |
| **Status** | `Review` |
| **Priority** | `High` |
| **Progress** | `100%` |
| **Current Task** | `None` |
| **Next Task** | `None — awaiting user acceptance` |
| **Target** | `2026-08-12` |
| **Updated** | `2026-08-12` |

**Objective**

A publishable, zero-dependency Node SDK exposing `createBoard(repo)` with read, apply, validate, watch, and ops — the programmatic interface that the dashboard server and agent CLI both consume.

**Current State**

Implemented end to end; validated on a scratch repo (E2E 18/18, server + CLI smoke, `npm pack --dry-run` clean) and a repeatable test harness now covers the full API/CLI surface (`npm test` 48/48) plus a packed-tarball consumer smoke test (12/12 against a real-repo copy). In Review awaiting user acceptance.

**Next Action**

User review; on approval publish `agent-board` (user step with OTP).

# Paused

![Paused](https://img.shields.io/badge/status-paused-d29922)

> Projects intentionally suspended while remaining relevant.

_No paused projects._

---

# Complete

![Complete](https://img.shields.io/badge/status-complete-238636)

> Projects whose project-level success criteria are satisfied.

### Local Board Dashboard

![Status](https://img.shields.io/badge/status-complete-238636)
![Priority](https://img.shields.io/badge/priority-medium-d29922)
![Progress](https://img.shields.io/badge/progress-100%25-0969da)
![Blocked](https://img.shields.io/badge/blocked-no-238636)

**Project:** [`projects/ui-dashboard.md`](projects/ui-dashboard.md)  
**Tasks:** [`tasks/ui-dashboard-tasks.md`](tasks/ui-dashboard-tasks.md)

| Field | Value |
| --- | --- |
| **Project ID** | `UIB` |
| **Status** | `Complete` |
| **Priority** | `Medium` |
| **Progress** | `85%` |
| **Current Task** | `UIB-007 editor UI (validation)` |
| **Next Task** | `None open` |
| **Target** | `2026-08-07` |
| **Updated** | `2026-08-07` |

**Objective**

A local, zero-dependency, read-only web dashboard for the Markdown board that live-updates when repo files change.

**Current State**

Parser, server, and frontend implemented; server + live reload validated; dashboard frontend (UIB-003) visually accepted. Write layer + `/api/write` (UIB-006) complete and live-validated; editor UI (UIB-007) implemented, in review.

**Next Action**

Accept the editor UI (UIB-007) in a browser pass, then accept UIB-004 detail-view review to finish the remaining criterion.

---


### Board Agent Toolkit

![Status](https://img.shields.io/badge/status-complete-238636)
![Priority](https://img.shields.io/badge/priority-high-f85149)
![Progress](https://img.shields.io/badge/progress-100%25-0969da)
![Blocked](https://img.shields.io/badge/blocked-no-238636)

**Project:** [`projects/board-agent-toolkit.md`](projects/board-agent-toolkit.md)  
**Tasks:** [`tasks/board-agent-toolkit-tasks.md`](tasks/board-agent-toolkit-tasks.md)

| Field | Value |
| --- | --- |
| **Project ID** | `BAT` |
| **Status** | `Complete` |
| **Priority** | `High` |
| **Progress** | `100%` |
| **Current Task** | `None` |
| **Next Task** | `None` |
| **Target** | `2026-08-12` |
| **Updated** | `2026-08-12` |

**Objective**

Package the board's Markdown state system as a portable agent toolkit: a CLI over the surgical write layer and a shared skills bundle for Cursor, Codex, and VS Code Copilot.

**Current State**

Delivery complete (CLI, skills bundle, platform shims); validated end to end on a scratch repo. User approved on 2026-08-12.

**Next Action**

None — project Complete.


---

---

# Archived

![Archived](https://img.shields.io/badge/status-archived-6e7781)

> Inactive projects retained for historical reference.

_No archived projects._

---

## Project Card Template

> Copy this complete block into the appropriate project-state section.

### `<PROJECT_NAME>`

![Status](https://img.shields.io/badge/status-active-238636)
![Priority](https://img.shields.io/badge/priority-medium-d29922)
![Progress](https://img.shields.io/badge/progress-100%25-0969da)
![Blocked](https://img.shields.io/badge/blocked-no-238636)

**Project:** [`projects/<PROJECT_SLUG>.md`](projects/<PROJECT_SLUG>.md)  
**Tasks:** [`tasks/<PROJECT_SLUG>-tasks.md`](tasks/<PROJECT_SLUG>-tasks.md)

| Field | Value |
| --- | --- |
| **Project ID** | `<PROJECT_ID>` |
| **Status** | `Active` |
| **Priority** | `Medium` |
| **Progress** | `0%` |
| **Current Task** | `None` |
| **Next Task** | `None` |
| **Target** | `YYYY-MM-DD` |
| **Updated** | `YYYY-MM-DD` |

**Objective**

`<ONE_SENTENCE_PROJECT_OBJECTIVE>`

**Current State**

`<SHORT_PROJECT_STATE_SUMMARY>`

**Next Action**

`<SINGLE_CONCRETE_PROJECT_LEVEL_NEXT_ACTION>`

---

## Portfolio Priorities

> Use this section to express cross-project execution order without changing project-internal task priority.

| Rank | Project | Priority | Reason |
| ---: | --- | --- | --- |
| `1` | `<PROJECT_NAME>` | `High` | `<WHY_THIS_PROJECT_IS_CURRENTLY_IMPORTANT>` |

---

## Cross-Project Blockers

> Record only blockers that affect project-level or cross-project execution.

| ID | Project | Blocker | Needed To Unblock | Since | Status |
| --- | --- | --- | --- | --- | --- |
| `BLK-001` | `<PROJECT_NAME>` | `<BLOCKER>` | `<REQUIRED_ACTION_OR_DEPENDENCY>` | `YYYY-MM-DD` | `Open` |

Task-specific blockers belong in the corresponding `/tasks/<project-slug>-tasks.md`.

---

## Cross-Project Dependencies

> Track dependencies where one project materially depends on another.

| Project | Depends On | Dependency | Status |
| --- | --- | --- | --- |
| `<PROJECT_A>` | `<PROJECT_B>` | `<WHAT_MUST_BE_AVAILABLE>` | `Pending` |

Do not duplicate ordinary task dependencies here.

---

## Upcoming Milestones

> Surface only the milestones most relevant to portfolio planning.

| Project | Milestone | Target | Status |
| --- | --- | --- | --- |
| `<PROJECT_NAME>` | `<MILESTONE>` | `YYYY-MM-DD` | `Not Started` |

Canonical milestone detail remains in the associated project file.

---

## Review Queue

> Surface projects or project-level outcomes requiring attention before completion.

| Project | Review Needed | Owner | Status |
| --- | --- | --- | --- |
| `<PROJECT_NAME>` | `<VALIDATION_APPROVAL_OR_DECISION>` | `<OWNER_OR_AGENT>` | `Pending` |

Task-level review remains in the task board.

---

## Recently Completed

> Keep this section concise. Detailed completion history remains in project and task files.

| Date | Project | Result |
| --- | --- | --- |
| `YYYY-MM-DD` | `<PROJECT_NAME>` | `<COMPLETION_SUMMARY>` |

---

## Portfolio Notes

> Keep only repository-wide context here.

### Constraints

- `<CROSS_PROJECT_CONSTRAINT_OR_NONE>`

### Decisions

- `<PORTFOLIO_LEVEL_DECISION_OR_NONE>`

### Open Questions

- [ ] `<CROSS_PROJECT_QUESTION_OR_NONE>`

---

## Board Activity

> Record meaningful repository-level project-state changes only.

| Date | Change |
| --- | --- |
| `2026-09-15` | `Notion-like Agent Dashboard` added to Active after v0 PR #1 wrecked the intended kanban UI; portfolio focus moved from Board SDK. |
| `2026-08-07` | Board created with initial template state. |
| `2026-08-07` | `Local Dashboard UI` project added to Active with project card, project file, and task board; counts and focus updated. |
| `2026-08-07` | UI editor scope authorized (DEC-003); UIB-006/UIB-007 added; focus moved to write layer + editor UI. |
| `2026-08-07` | Write layer (UIB-006) completed and live-validated; editor UI (UIB-007) implemented and moved to Review; progress 85%. |

Good entries include:

```text
Authentication moved from Ready to Active.
Dashboard redesign blocked pending design approval.
API migration moved to Review.
Documentation refresh completed.
Current focus changed from API migration to authentication.
```

Do not log routine task movement here unless it materially changes portfolio state.

---

## Repository Navigation

```text
.
├── BOARD.md
│
├── projects/
│   ├── README.md
│   ├── AGENT.md
│   ├── INSTRUCTIONS.md
│   ├── _TEMPLATE.md
│   └── <project-slug>.md
│
└── tasks/
    ├── README.md
    ├── AGENT.md
    ├── INSTRUCTIONS.md
    ├── _TEMPLATE.md
    └── <project-slug>-tasks.md
```

---

## State Model

```text
BOARD.md
   ↓
projects/<project-slug>.md
   ↓
tasks/<project-slug>-tasks.md
   ↓
repository work
```

After execution:

```text
repository work
      ↓
task board updated
      ↓
project file updated if project state changed
      ↓
BOARD.md updated if portfolio state changed
```

---

## State Ownership

| Information | Canonical Location |
| --- | --- |
| Portfolio overview | `BOARD.md` |
| Cross-project priority | `BOARD.md` |
| Current portfolio focus | `BOARD.md` |
| Cross-project blockers | `BOARD.md` |
| Cross-project dependencies | `BOARD.md` |
| Project objective | `/projects/<project>.md` |
| Project scope | `/projects/<project>.md` |
| Project requirements | `/projects/<project>.md` |
| Project milestones | `/projects/<project>.md` |
| Project risks | `/projects/<project>.md` |
| Project decisions | `/projects/<project>.md` |
| Individual tasks | `/tasks/<project>-tasks.md` |
| Task status | `/tasks/<project>-tasks.md` |
| Task acceptance criteria | `/tasks/<project>-tasks.md` |
| Task blockers | `/tasks/<project>-tasks.md` |
| Task validation | `/tasks/<project>-tasks.md` |

> Store information at the lowest appropriate canonical level. Higher-level files summarize and link rather than duplicate detail.

---

## Agent Protocol

This file is the canonical **portfolio overview** for the repository.

It should be read before project or task execution begins.

### Required Read Order

```text
1. BOARD.md
2. projects/<project-slug>.md
3. tasks/<project-slug>-tasks.md
4. Relevant repository files
```

### Board Responsibilities

`BOARD.md` should answer:

```text
What projects exist?
What state is each project in?
Which project matters most right now?
What is currently active?
What is blocked?
What needs review?
What recently completed?
What should happen next?
Where are the detailed project and task files?
```

If these cannot be answered from this board, the portfolio overview is incomplete.

---

## Project Placement

Each project must appear in exactly one primary project-state section:

```text
Planning
Ready
Active
Blocked
Review
Paused
Complete
Archived
```

Do not duplicate the same project card across multiple sections.

When project status changes, move the entire project card.

---

## Adding a Project

When adding a new project:

1. create:

   ```text
   projects/<project-slug>.md
   ```

2. create:

   ```text
   tasks/<project-slug>-tasks.md
   ```

3. confirm both files link to each other and this board;

4. add one project card to the appropriate board section;

5. add it to portfolio priorities if necessary;

6. update project counts;

7. update top badges;

8. update `Last Updated`;

9. record the addition in `Board Activity`.

Do not add a board card for a project whose canonical project file does not exist.

---

## Moving a Project

When project status changes:

1. verify the canonical project file reflects the new status;
2. move the entire project card to the matching section;
3. update its status badge;
4. update its status field;
5. update progress if necessary;
6. update blockers if applicable;
7. update portfolio counts;
8. update top badges;
9. update `Current Focus` if affected;
10. record the transition in `Board Activity`.

The project file should usually be updated before the board summary.

---

## Current Focus Rules

`Current Focus` identifies the repository's primary execution attention.

It does not necessarily mean only one project may be active.

Use it to clarify:

- which project has precedence;
- which task is currently central;
- what the immediate portfolio-level objective is;
- what should happen next.

When focus changes materially, update:

```text
Primary Project
Current Objective
Active Task
Next Action
Why This Is Current
```

Avoid vague focus such as:

```text
Work on projects.
Continue development.
Handle tasks.
```

Prefer:

```text
Complete AUTH-014 session validation so Authentication can move into Review.
```

---

## Priority Rules

Project priority uses:

```text
Low
Medium
High
Critical
```

Priority describes relative importance across projects.

Do not automatically derive project priority from the highest-priority task.

Do not mark every active project `High`.

Use `Critical` only when delay materially threatens repository goals, delivery, or dependent work.

---

## Progress Rules

Project progress displayed here is a summary.

Canonical interpretation belongs in the associated project file.

Task completion can inform progress, but:

```text
task completion ≠ automatic project completion
```

Project success criteria remain authoritative.

Avoid overly precise progress percentages when project state does not justify them.

---

## Blocker Rules

Add a blocker here when it:

- blocks an entire project;
- changes portfolio priority;
- affects multiple projects;
- requires repository-level attention.

Do not surface every task blocker.

Task-specific blocker:

```text
tasks/<project-slug>-tasks.md
```

Project-level blocker:

```text
projects/<project-slug>.md
BOARD.md
```

Cross-project blocker:

```text
BOARD.md
```

---

## Cross-Project Dependency Rules

Use this section only when one project materially depends on another.

Example:

```text
Client Dashboard depends on Authentication exposing stable session APIs.
```

Do not duplicate ordinary internal task sequencing here.

When a dependency resolves, update its status rather than leaving stale pending state.

---

## Review Queue Rules

Use the review queue when portfolio-level attention is required.

Examples:

- final project acceptance;
- owner approval;
- deployment approval;
- architecture sign-off;
- release validation.

Do not list every task currently in `Review`.

---

## Completion Rules

Before a project appears under `Complete`:

1. verify its project file is marked `Complete`;
2. verify project-level success criteria are satisfied;
3. verify no unresolved blocker prevents completion;
4. update progress;
5. update current focus if necessary;
6. move the project card;
7. add a concise `Recently Completed` entry;
8. update counts and badges;
9. record completion in board activity.

Do not infer completion solely from task-board counts.

---

## Archiving Rules

Use `Archived` for projects retained for reference but no longer operationally relevant.

Before archiving:

- preserve the project file;
- preserve the task board;
- preserve history;
- update project status;
- remove it from active priority views;
- move its board card to `Archived`.

Archiving is not deletion.

---

## Synchronization Rules

Update this board when:

- a new project is added;
- a project is archived;
- project status changes;
- project priority changes;
- project progress changes materially;
- a project becomes blocked or unblocked;
- current portfolio focus changes;
- a project enters review;
- a project completes;
- a cross-project dependency changes;
- a portfolio-level blocker changes.

Do not update this board for every task transition.

---

## Conflict Resolution

If this board disagrees with lower-level state:

### Project detail

Canonical:

```text
projects/<project-slug>.md
```

### Task detail

Canonical:

```text
tasks/<project-slug>-tasks.md
```

### Portfolio summary

This board should be synchronized to the canonical lower-level state.

When a conflict exists:

1. inspect the canonical file;
2. verify repository reality if necessary;
3. correct stale board summary state;
4. preserve meaningful history;
5. do not invent missing information.

---

## Editing Safety

When updating this board:

- preserve project links;
- preserve project IDs;
- preserve meaningful board history;
- preserve completed and archived project references;
- keep each project in one state section;
- keep badges synchronized with textual state;
- keep counts accurate;
- keep dates in `YYYY-MM-DD`;
- avoid duplicating detailed project or task information;
- make the smallest coherent update required.

---

## End-of-Session Protocol

Before ending meaningful repository work:

- [ ] Touched task boards reflect actual task state.
- [ ] Touched project files reflect actual project state.
- [ ] Project cards are in the correct sections.
- [ ] Current focus is accurate.
- [ ] Cross-project blockers are current.
- [ ] Cross-project dependencies are current.
- [ ] Portfolio priorities are current.
- [ ] Review queue is current.
- [ ] Recently completed is current.
- [ ] Project counts are synchronized.
- [ ] Summary badges are synchronized.
- [ ] `Last Updated` is current.
- [ ] Board activity records meaningful portfolio changes.

Leave the repository navigable and resumable from files alone.

---

## Status Reference

### Project Status

```markdown
![Status](https://img.shields.io/badge/status-planning-6e7781)
![Status](https://img.shields.io/badge/status-ready-1f6feb)
![Status](https://img.shields.io/badge/status-active-238636)
![Status](https://img.shields.io/badge/status-blocked-da3633)
![Status](https://img.shields.io/badge/status-review-8250df)
![Status](https://img.shields.io/badge/status-paused-d29922)
![Status](https://img.shields.io/badge/status-complete-238636)
![Status](https://img.shields.io/badge/status-archived-6e7781)
```

### Priority

```markdown
![Priority](https://img.shields.io/badge/priority-medium-d29922)
![Priority](https://img.shields.io/badge/priority-medium-d29922)
![Priority](https://img.shields.io/badge/priority-medium-d29922)
![Priority](https://img.shields.io/badge/priority-medium-d29922)
```

### Blocked

```markdown
![Blocked](https://img.shields.io/badge/blocked-no-238636)
![Blocked](https://img.shields.io/badge/blocked-yes-da3633)
```

---

<!--
AGENT BOARD STATE

ROLE
This document owns repository-wide portfolio overview state.

PROJECT DETAIL
projects/<project-slug>.md

TASK DETAIL
tasks/<project-slug>-tasks.md

READ ORDER
BOARD → PROJECT → TASK BOARD → REPOSITORY WORK

UPDATE ORDER
REPOSITORY WORK → TASK BOARD → PROJECT IF NEEDED → BOARD IF NEEDED

BOARD OWNS
- project placement
- portfolio priority
- current focus
- cross-project blockers
- cross-project dependencies
- portfolio review queue
- portfolio summary counts
- recent project completion summary

BOARD DOES NOT OWN
- detailed requirements
- detailed project decisions
- task definitions
- task acceptance criteria
- task working notes
- task-level blockers

PRESERVE
- project links
- project IDs
- meaningful board history
- completed project references
- archived project references

RULES
- One project card per project.
- One primary state section per project.
- Lower-level canonical files win detail conflicts.
- Higher-level state summarizes; it does not duplicate.
- Do not infer project completion from task count alone.
- Keep Current Focus concrete and actionable.
- Keep the board compact enough to scan quickly.

GOAL
A human or agent should understand repository-wide state from this file before drilling into project and task detail.
-->