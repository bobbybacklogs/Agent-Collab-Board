# `<PROJECT_NAME>` — Tasks

![Status](https://img.shields.io/badge/status-active-238636)
![Backlog](https://img.shields.io/badge/backlog-0-6e7781)
![Ready](https://img.shields.io/badge/ready-0-1f6feb)
![In Progress](https://img.shields.io/badge/in%20progress-0-d29922)
![Blocked](https://img.shields.io/badge/blocked-0-da3633)
![Review](https://img.shields.io/badge/review-0-8250df)
![Done](https://img.shields.io/badge/done-0-238636)
![Updated](https://img.shields.io/badge/updated-YYYY--MM--DD-6e7781)

[Board](../BOARD.md) · [Project](../projects/<PROJECT_SLUG>.md)

> Canonical task-level state for `<PROJECT_NAME>`.
> This file tracks executable work, task status, acceptance criteria, blockers, and task history.

---

## Task Board Overview

| Field | Value |
| --- | --- |
| **Project** | `<PROJECT_NAME>` |
| **Project ID** | `<PROJECT_ID>` |
| **Project File** | [`../projects/<PROJECT_SLUG>.md`](../projects/<PROJECT_SLUG>.md) |
| **Task Prefix** | `<TASK_PREFIX>` |
| **Board Status** | `Active` |
| **Last Updated** | `YYYY-MM-DD` |
| **Active Task** | `<TASK_ID_OR_NONE>` |
| **Next Ready Task** | `<TASK_ID_OR_NONE>` |

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

_No tasks currently in backlog._

---

# Ready

![Ready](https://img.shields.io/badge/status-ready-1f6feb)

> Tasks that are sufficiently defined and can be started.

_No tasks currently ready._

---

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

_No completed tasks._

---

## Task Template

> Copy this complete block into the appropriate workflow section when creating a new task.

### `<TASK_ID>` — `<TASK_TITLE>`

![Status](https://img.shields.io/badge/status-ready-1f6feb)
![Priority](https://img.shields.io/badge/priority-medium-d29922)
![Type](https://img.shields.io/badge/type-task-0969da)
![Blocked](https://img.shields.io/badge/blocked-no-238636)

| Field | Value |
| --- | --- |
| **ID** | `<TASK_ID>` |
| **Status** | `Ready` |
| **Priority** | `Medium` |
| **Type** | `Task` |
| **Assigned** | `<OWNER_OR_AGENT>` |
| **Created** | `YYYY-MM-DD` |
| **Started** | `—` |
| **Updated** | `YYYY-MM-DD` |
| **Completed** | `—` |

**Goal**

`<CLEAR_DESCRIPTION_OF_THE_RESULT_THIS_TASK_SHOULD_PRODUCE>`

### Acceptance Criteria

- [ ] `<VERIFIABLE_RESULT>`
- [ ] `<VERIFIABLE_RESULT>`
- [ ] `<VERIFIABLE_RESULT>`

### Dependencies

- `<TASK_ID_PROJECT_DEPENDENCY_OR_NONE>`

### Blockers

`None`

### Files / Resources

- `<PATH_LINK_OR_REFERENCE>`

### Implementation Notes

- `<IMPORTANT_TASK_CONTEXT>`
- `<CONSTRAINT_OR_RELEVANT_DETAIL>`

### Validation

- [ ] `<TEST_CHECK_REVIEW_OR_VALIDATION_STEP>`
- [ ] `<TEST_CHECK_REVIEW_OR_VALIDATION_STEP>`

### Next Action

`<SINGLE_CONCRETE_NEXT_STEP>`

### Task Activity

| Date | Change |
| --- | --- |
| `YYYY-MM-DD` | Task created. |

---

## Active Task Detail

> Maintain detailed short-term execution context for the primary active task.
> This section should mirror the actual active task, not become a second task definition.

### `<TASK_ID>` — `<TASK_TITLE>`

![Status](https://img.shields.io/badge/status-in%20progress-d29922)

**Objective**

`<WHAT_IS_BEING_WORKED_ON_RIGHT_NOW>`

**Current Work**

- [ ] `<CURRENT_ACTION>`
- [ ] `<NEXT_EXECUTION_STEP>`

**Completed This Session**

- `<MEANINGFUL_COMPLETED_WORK_OR_NONE>`

**Constraints**

- `<TASK_LEVEL_CONSTRAINT_OR_NONE>`

**Blockers**

- `<BLOCKER_OR_NONE>`

**Relevant Files**

- `<PATH>`

**Working Notes**

- `<SHORT_DURABLE_EXECUTION_NOTE>`

**Next Action**

`<SINGLE_CONCRETE_CONTINUATION_STEP>`

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
| — | — | — | — |

---

## Task Decisions

> Record durable task-level decisions here when they matter beyond temporary working notes.
> Project-level decisions belong in the associated project file.

| ID | Date | Task | Decision | Reason |
| --- | --- | --- | --- | --- |
| `TDEC-001` | `YYYY-MM-DD` | `<TASK_ID>` | `<DECISION>` | `<RATIONALE>` |

---

## Progress

| State | Count |
| --- | ---: |
| Backlog | 0 |
| Ready | 0 |
| In Progress | 0 |
| Blocked | 0 |
| Review | 0 |
| Done | 0 |
| **Total** | **0** |

**Completion:** `0%`

> Completion percentage should reflect completed tasks against the current task set unless the project defines a more appropriate explicit weighting model.

---

## Task Activity Log

> Record meaningful board-level task transitions only.

| Date | Task | Change |
| --- | --- | --- |
| `YYYY-MM-DD` | `BOARD` | Task board created. |

---

## Agent Protocol

This file is the canonical source for **task-level state** for `<PROJECT_NAME>`.

The associated project file is:

[`../projects/<PROJECT_SLUG>.md`](../projects/<PROJECT_SLUG>.md)

The repository-level overview is:

[`../BOARD.md`](../BOARD.md)

### Required Read Order

Before executing work for this project:

```text
1. ../BOARD.md
2. ../projects/<PROJECT_SLUG>.md
3. This task board
4. Relevant repository files
```

### Task Selection

When selecting work:

1. Continue the current `In Progress` task when one exists and remains actionable.
2. Otherwise select the highest-priority executable task from `Ready`.
3. Do not start a `Backlog` task unless it is first made ready.
4. Do not work on a `Blocked` task unless the blocker has been resolved.
5. Respect task dependencies before beginning dependent work.
6. Prefer one primary `In Progress` task unless parallel execution is intentional.

### Creating Tasks

When creating a new task:

1. Assign a unique task ID using the project prefix.
2. Use sequential IDs.
3. Never reuse an old task ID.
4. Define a clear task goal.
5. Add verifiable acceptance criteria.
6. Record dependencies.
7. Add relevant file or resource references.
8. Place the task in `Backlog` or `Ready`.
9. Update board counts.
10. Update `Last Updated`.

Example task IDs:

```text
AUTH-001
AUTH-002
AUTH-003
```

or:

```text
A-001
A-002
A-003
```

Use one stable convention per project.

### Moving Tasks

When task status changes:

1. Move the entire task block to the correct workflow section.
2. Update its status badge.
3. Update its `Status` field.
4. Update the `Updated` date.
5. Set `Started` when work first begins.
6. Set `Completed` only when the task reaches `Done`.
7. Update board progress counts.
8. Update the top summary badges when counts change.
9. Add a meaningful task activity entry.
10. Update `Active Task Detail` when the primary active task changes.

Do not duplicate one task in multiple workflow sections.

### Backlog → Ready

Move a task to `Ready` when:

- the goal is clear;
- acceptance criteria are usable;
- required context exists;
- known dependencies allow execution.

### Ready → In Progress

Move a task to `In Progress` when active work actually begins.

Set:

```text
Started
Updated
Active Task
```

accordingly.

### In Progress → Blocked

Move a task to `Blocked` when meaningful progress cannot continue.

Update:

```text
Blocked badge → yes
Blockers
Blocker Register
Updated
```

Document exactly what is required to resume.

### Blocked → Active Workflow

When the blocker resolves:

1. update the blocker register;
2. remove or resolve the task blocker;
3. change the blocked badge to `no`;
4. return the task to `Ready` or `In Progress`;
5. record the transition.

### In Progress → Review

Move a task to `Review` when implementation is believed complete but validation remains.

Do not check acceptance criteria merely because implementation appears finished.

### Review → Done

Move a task to `Done` only when:

- required acceptance criteria are satisfied;
- required validation has passed;
- no unresolved blocker prevents completion;
- the result matches the intended task goal.

Set:

```text
Status → Done
Completed → YYYY-MM-DD
Updated → YYYY-MM-DD
```

### Reopening Tasks

If completed work is later found incomplete:

1. preserve the same task ID;
2. move the task from `Done` to the appropriate active state;
3. record why it was reopened;
4. clear or adjust `Completed` if necessary;
5. update progress counts.

Do not create a duplicate replacement task merely to hide a failed completion unless the new work is genuinely separate.

---

## Acceptance Criteria Rules

Acceptance criteria must describe observable or verifiable outcomes.

Prefer:

```markdown
- [ ] API returns `200` for valid requests.
- [ ] Invalid credentials return `401`.
- [ ] Existing authentication tests pass.
```

Avoid:

```markdown
- [ ] Work on API.
- [ ] Try login.
- [ ] Look into tests.
```

Do not mark a criterion complete based only on an attempted action.

---

## Validation Rules

Use `Validation` for explicit checks that confirm the task result.

Examples:

- automated tests;
- build success;
- lint checks;
- manual review;
- API response verification;
- file existence;
- visual inspection;
- user approval.

Validation and acceptance criteria may overlap, but neither should be fabricated.

---

## Task Notes

Use `Implementation Notes` for durable execution context.

Good notes include:

- important architecture details;
- edge cases;
- relevant limitations;
- unusual file relationships;
- constraints another agent would need.

Avoid conversational logs such as:

```text
I think this might work.
Trying another approach now.
Let's see what happens.
```

Keep notes concise and reusable.

---

## Task Decisions

Use `Task Decisions` for choices that should survive across work sessions but do not rise to project-level importance.

Examples:

```text
TDEC-004 — Use batch inserts for this migration task.
TDEC-005 — Keep test fixtures local to this module.
```

If a decision affects the broader project, promote it to the project file.

---

## State Ownership

| Information | Canonical Location |
| --- | --- |
| Task ID | This file |
| Task goal | This file |
| Task status | This file |
| Task priority | This file |
| Task acceptance criteria | This file |
| Task dependencies | This file |
| Task blockers | This file |
| Task validation | This file |
| Task execution notes | This file |
| Task next action | This file |
| Project objective | Project file |
| Project scope | Project file |
| Project requirements | Project file |
| Project milestones | Project file |
| Portfolio summary | `BOARD.md` |

The general rule is:

> Store information at the lowest appropriate canonical level. Summaries may exist above it, but detailed state should not be duplicated.

---

## Synchronization Rules

After execution work:

```text
Repository work
      ↓
Task board
      ↓
Project file if project state changed
      ↓
BOARD.md if portfolio state changed
```

### Always update this task board when:

- task status changes;
- acceptance criteria change;
- blockers change;
- validation state changes;
- the active task changes;
- a task is completed;
- task-level next action changes materially.

### Update the project file when:

- a milestone changes;
- a deliverable changes;
- project scope or requirements change;
- project status changes;
- project-level risk changes;
- a durable project decision is made;
- project focus or next milestone changes.

### Update `BOARD.md` when:

- project status changes;
- project priority changes;
- project progress changes materially;
- the project becomes blocked or unblocked;
- the project's overall current focus changes;
- the project completes.

Do not propagate trivial task edits into every layer.

---

## Conflict Resolution

If this task file conflicts with another state document:

### Task-level conflict

This file is authoritative for:

```text
task status
task acceptance criteria
task blockers
task dependencies
task execution state
```

### Project-level conflict

The project file is authoritative for:

```text
objective
scope
requirements
project milestones
project decisions
project status detail
```

### Portfolio-level conflict

`BOARD.md` summarizes project state and should be synchronized with the canonical project file.

Do not silently guess which value is correct when repository evidence can resolve the conflict.

---

## Editing Safety

When editing this board:

- preserve task IDs;
- preserve completed tasks;
- preserve meaningful task history;
- preserve acceptance criteria unless intentionally changed;
- preserve decision IDs;
- keep workflow sections intact;
- keep badges synchronized with textual state;
- keep dates in `YYYY-MM-DD`;
- avoid destructive rewrites of unrelated tasks;
- make the smallest coherent update needed;
- do not reorder completed history without reason.

---

## End-of-Session Protocol

Before ending meaningful task work:

1. Synchronize each touched task with actual repository state.
2. Move tasks to the correct workflow section.
3. Update acceptance criteria.
4. Record validation results.
5. Record blockers.
6. Update the active task.
7. Set a concrete next action.
8. Update counts and completion percentage.
9. Update the task-board summary badges.
10. Update `Last Updated`.
11. Update the project file if project-level state changed.
12. Update `BOARD.md` if portfolio state changed.

The repository should be resumable without relying on conversational memory.

---

## Status Reference

### Task Status

```markdown
![Status](https://img.shields.io/badge/status-backlog-6e7781)
![Status](https://img.shields.io/badge/status-ready-1f6feb)
![Status](https://img.shields.io/badge/status-in%20progress-d29922)
![Status](https://img.shields.io/badge/status-blocked-da3633)
![Status](https://img.shields.io/badge/status-review-8250df)
![Status](https://img.shields.io/badge/status-done-238636)
```

### Priority

```markdown
![Priority](https://img.shields.io/badge/priority-low-6e7781)
![Priority](https://img.shields.io/badge/priority-medium-d29922)
![Priority](https://img.shields.io/badge/priority-high-f85149)
![Priority](https://img.shields.io/badge/priority-critical-da3633)
```

### Task Type

```markdown
![Type](https://img.shields.io/badge/type-task-0969da)
![Type](https://img.shields.io/badge/type-feature-8250df)
![Type](https://img.shields.io/badge/type-bug-da3633)
![Type](https://img.shields.io/badge/type-research-1f6feb)
![Type](https://img.shields.io/badge/type-docs-6e7781)
![Type](https://img.shields.io/badge/type-maintenance-d29922)
![Type](https://img.shields.io/badge/type-test-238636)
```

### Blocked State

```markdown
![Blocked](https://img.shields.io/badge/blocked-no-238636)
![Blocked](https://img.shields.io/badge/blocked-yes-da3633)
```

---

<!--
AGENT TASK STATE

ROLE
This document owns detailed task-level state for one project.

PROJECT
../projects/<PROJECT_SLUG>.md

BOARD
../BOARD.md

READ ORDER
BOARD → PROJECT → TASK BOARD → REPOSITORY WORK

UPDATE ORDER
REPOSITORY WORK → TASK BOARD → PROJECT IF NEEDED → BOARD IF NEEDED

PRESERVE
- task IDs
- acceptance criteria
- completed tasks
- task history
- task decisions
- meaningful blockers

UPDATE
- status
- priority
- workflow placement
- task dates
- validation
- blockers
- dependencies
- next action
- progress counts
- active task
- board badges

RULES
- Never duplicate one task across workflow sections.
- Never mark a task Done solely because work was attempted.
- Never delete completed tasks to simplify the board.
- Never rely on conversational memory instead of updating this file.
- Keep one primary active task unless parallel work is explicitly intended.

COMPLETION
A task is Done only when its acceptance criteria and required validation are satisfied.
-->