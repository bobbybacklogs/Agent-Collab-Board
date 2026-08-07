# Tasks — Agent Instructions

![Scope](https://img.shields.io/badge/scope-tasks-0969da)
![Canonical](https://img.shields.io/badge/canonical-task%20state-238636)

> These instructions apply to files under `/tasks`.

Task boards own detailed executable work and Kanban state.

For full task policy, read [`INSTRUCTIONS.md`](./INSTRUCTIONS.md).

---

## Scope

Use these instructions when creating, reading, or modifying:

```text
tasks/<project-slug>-tasks.md
````

Task boards describe:

* what work exists;
* what is actionable;
* what is active;
* what is blocked;
* what requires review;
* what is complete;
* what should happen next.

Project definition belongs in `/projects`.

---

## Required Context

Before executing or modifying task work, read:

```text
../BOARD.md
../projects/<project-slug>.md
./<project-slug>-tasks.md
```

When creating a task board, also read:

```text
./_TEMPLATE.md
./INSTRUCTIONS.md
../projects/<project-slug>.md
```

---

## Canonical Ownership

This folder is authoritative for:

* task IDs;
* task goals;
* task workflow state;
* task priority;
* task type;
* acceptance criteria;
* task dependencies;
* blockers;
* validation;
* implementation notes;
* task decisions;
* task-level next actions;
* task activity;
* task-board counts.

Project detail is canonical in:

```text
../projects/<project-slug>.md
```

Portfolio summary is canonical in:

```text
../BOARD.md
```

---

## Workflow

Use:

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

Temporary interruption:

```text
Blocked
```

Each task must exist in exactly one workflow section.

Do not duplicate task blocks.

---

## Task Selection

When choosing work:

1. continue an actionable `In Progress` task;
2. otherwise choose the highest-priority executable task from `Ready`;
3. respect dependencies;
4. respect blockers;
5. prefer work aligned with current project focus.

Do not execute directly from `Backlog`.

Prefer one primary active task unless parallel work is intentional.

---

## Creating Tasks

New tasks must have:

* unique stable ID;
* outcome-focused title;
* clear goal;
* status;
* priority;
* type;
* acceptance criteria;
* known dependencies;
* relevant resources;
* validation where practical;
* concrete next action.

Use stable project prefixes:

```text
AUTH-001
AUTH-002
AUTH-003
```

Never reuse task IDs.

Do not renumber existing tasks to remove gaps.

---

## Starting Work

When work begins:

1. move the entire task block to `In Progress`;
2. update its status badge;
3. set `Status` to `In Progress`;
4. set `Started` if unset;
5. update `Updated`;
6. update `Active Task`;
7. synchronize `Active Task Detail`;
8. update counts and badges;
9. record the transition.

Discussion alone does not make a task active.

---

## Blocking Work

When meaningful progress cannot continue:

1. move the task to `Blocked`;
2. set blocked state to `yes`;
3. record the blocker;
4. record what is required to unblock it;
5. update the blocker register;
6. update dates and counts;
7. record the transition.

Prefer explicit blockers.

Example:

```text
Blocked until staging OAuth credentials with write access are available.
```

Avoid:

```text
Waiting.
Need info.
Issue exists.
```

---

## Review

Move a task to `Review` when implementation appears complete but validation or approval remains.

Review may include:

* tests;
* build checks;
* manual verification;
* code review;
* user approval;
* artifact inspection.

Do not use `Review` as a generic holding state.

---

## Completion

A task may enter `Done` only when:

* the task goal is achieved;
* required acceptance criteria are satisfied;
* required validation is complete;
* no unresolved blocker prevents completion.

Attempted work is not completed work.

When completing:

1. update acceptance criteria;
2. update validation;
3. move the task to `Done`;
4. set `Completed`;
5. update `Updated`;
6. update counts;
7. update completion percentage;
8. update badges;
9. update active-task state;
10. record completion.

---

## Reopening

If completed work proves incomplete:

1. preserve the same task ID;
2. move the task to the correct active state;
3. record why it reopened;
4. update criteria if necessary;
5. revise `Completed` as appropriate;
6. update counts and progress.

Do not create a duplicate task simply to preserve a previous `Done` state.

---

## Acceptance Criteria

Acceptance criteria must describe verifiable outcomes.

Good:

```markdown
- [ ] Invalid tokens return `401`.
- [ ] Valid tokens populate authenticated user context.
- [ ] Authentication tests pass.
```

Poor:

```markdown
- [ ] Work on tokens.
- [ ] Try tests.
- [ ] Check authentication.
```

Do not weaken criteria solely to close a task.

---

## Validation

Record only validation that was actually performed.

Examples:

```text
Tests pass.
Build completes.
Expected API response observed.
UI manually verified.
Artifact exists.
User approval received.
```

If validation cannot be performed, leave it incomplete and record the limitation.

---

## Task Decisions

Use:

```text
TDEC-001
TDEC-002
TDEC-003
```

Preserve task decision history.

If a task decision affects the broader project, promote it to the associated project file as a project-level decision.

---

## Active Task Detail

Keep the primary active task context concise.

Maintain:

```text
Objective
Current Work
Completed This Session
Constraints
Blockers
Relevant Files
Working Notes
Next Action
```

Do not duplicate the full task definition here.

---

## Counts

When workflow state changes, synchronize:

```text
Backlog
Ready
In Progress
Blocked
Review
Done
Total
Completion
```

Keep top-level badges and progress tables consistent.

---

## Synchronization

State flows upward only when needed:

```text
repository work
      ↓
task board
      ↓
project file if project state changed
      ↓
BOARD.md if portfolio state changed
```

Always update the task board when:

* task status changes;
* acceptance criteria change;
* validation changes;
* blockers change;
* dependencies change;
* active task changes;
* next action changes materially;
* a task completes or reopens.

Update the project file only when project-level state changes.

Update `BOARD.md` only when portfolio-level state changes.

---

## Preserve

Always preserve:

* task IDs;
* completed tasks;
* acceptance criteria unless intentionally changed;
* task decision IDs;
* meaningful task history;
* dependencies;
* established links.

---

## Do Not

* duplicate tasks across workflow sections;
* reuse task IDs;
* fabricate validation;
* mark attempted work complete;
* silently ignore blockers;
* delete completed history for cleanliness;
* use conversational scratchpad text as durable state;
* rewrite unrelated tasks during a narrow update;
* rely on chat memory instead of repository state.

---

## Handoff

Before finishing meaningful task work, ensure another agent can answer:

```text
What tasks exist?
What is active?
What is ready?
What is blocked?
What dependencies matter?
What has been completed?
What acceptance criteria remain?
What validation remains?
What should happen next?
```

If those answers are unclear, update the task board before stopping.

---

## Full Policy

Read:

[`INSTRUCTIONS.md`](./INSTRUCTIONS.md)

Template:

[`_TEMPLATE.md`](./_TEMPLATE.md)

Human overview:

[`README.md`](./README.md)