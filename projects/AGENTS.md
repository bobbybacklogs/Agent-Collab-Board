# Projects — Agent Instructions

![Scope](https://img.shields.io/badge/scope-projects-0969da)
![Canonical](https://img.shields.io/badge/canonical-project%20state-238636)

> These instructions apply to files under `/projects`.

Project files own durable project-level state.

For full project policy, read [`INSTRUCTIONS.md`](./INSTRUCTIONS.md).

---

## Scope

Use these instructions when creating, reading, or modifying:

```text
projects/<project-slug>.md
````

Project files describe:

* what the project is;
* why it exists;
* what success requires;
* what is in scope;
* what constraints matter;
* what has been decided;
* what the current project-level state is.

Detailed task execution belongs in `/tasks`.

---

## Required Context

Before modifying an existing project, read:

```text
../BOARD.md
./<project-slug>.md
../tasks/<project-slug>-tasks.md
```

When creating a project, also read:

```text
./_TEMPLATE.md
./INSTRUCTIONS.md
../tasks/_TEMPLATE.md
```

---

## Canonical Ownership

This folder is authoritative for:

* project identity;
* objective;
* success criteria;
* scope;
* requirements;
* deliverables;
* milestones;
* project dependencies;
* constraints;
* risks;
* project-level decisions;
* project-level open questions;
* current project state;
* project-level next action.

Do not duplicate detailed task state here.

Task detail is canonical in:

```text
../tasks/<project-slug>-tasks.md
```

Portfolio summary is canonical in:

```text
../BOARD.md
```

---

## Project Files

Use stable lowercase slugs.

Example:

```text
projects/authentication.md
tasks/authentication-tasks.md
```

Do not casually rename established project slugs.

When creating a project:

1. copy `_TEMPLATE.md`;
2. create `projects/<project-slug>.md`;
3. create the matching task board;
4. link both files;
5. add the project to `BOARD.md`.

---

## Update Rules

Update the project file when project-level state changes, including:

* status;
* scope;
* requirements;
* milestones;
* deliverables;
* project dependencies;
* constraints;
* risks;
* durable decisions;
* current focus;
* next milestone;
* next project-level action.

Do not update the project file for every minor task action.

---

## Status

Supported project statuses:

```text
Planning
Ready
Active
Blocked
Review
Complete
Paused
Archived
```

Use one primary status at a time.

Do not mark a project `Complete` until its project-level success criteria are satisfied.

Task completion alone does not prove project completion.

---

## Decisions

Use project decision IDs:

```text
DEC-001
DEC-002
DEC-003
```

Preserve decision history.

If a later decision replaces an earlier one, record the new decision rather than deleting the old one.

Task-specific decisions belong in the task board unless they become project-wide.

---

## Scope and Requirements

Do not silently change:

* project scope;
* requirements;
* success criteria.

When one changes materially:

1. update the project file;
2. update affected tasks;
3. record a decision when appropriate;
4. update `BOARD.md` if portfolio state changes.

Do not expand scope solely by adding tasks.

---

## Current State

Keep the following concise and current:

```text
Summary
Current Focus
Next Milestone
Next Action
```

Use a concrete next action.

Prefer:

```text
Complete authentication validation and move the project into Review.
```

Avoid:

```text
Continue working.
Finish remaining tasks.
```

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

Update `BOARD.md` when changes here affect:

* project status;
* project priority;
* portfolio focus;
* project blockers;
* material project progress;
* review state;
* project completion.

Do not propagate trivial edits upward.

---

## Preserve

Always preserve:

* project IDs;
* stable slugs;
* success criteria;
* decision IDs;
* meaningful project history;
* established links;
* completed milestones and deliverables;
* documented scope unless intentionally changed.

---

## Do Not

* duplicate complete task definitions;
* use project files as task backlogs;
* invent project completion;
* silently weaken success criteria;
* silently alter scope;
* delete meaningful history for cleanliness;
* rely on conversation memory when repository state exists;
* rewrite unrelated project sections during a narrow state update.

---

## Handoff

Before finishing meaningful project work, ensure the project file answers:

```text
What is this project?
What does success require?
What is in scope?
What constraints matter?
What has been decided?
What is the current state?
What is the next milestone?
What is the next project-level action?
Where is the task board?
```

If those answers are unclear, update the project file before stopping.

---

## Full Policy

Read:

[`INSTRUCTIONS.md`](./INSTRUCTIONS.md)

Template:

[`_TEMPLATE.md`](./_TEMPLATE.md)

Human overview:

[`README.md`](./README.md)
