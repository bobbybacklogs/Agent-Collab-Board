# Task Agent Instructions

![Scope](https://img.shields.io/badge/scope-tasks-0969da)
![Agent](https://img.shields.io/badge/agent-instructions-238636)
![Workflow](https://img.shields.io/badge/workflow-Kanban-d29922)

These instructions govern agent interaction with task boards inside `/tasks`.

Task boards are persistent execution-state documents. They must accurately represent what work exists, what is actionable, what is active, what is blocked, what has been validated, and what should happen next.

---

## Core Rule

Treat:

```text
tasks/<project-slug>-tasks.md
```

as the **canonical source of detailed task-level state**.

Treat:

```text
projects/<project-slug>.md
```

as the **canonical source of durable project-level state**.

Treat:

```text
BOARD.md
```

as the **canonical portfolio overview**.

Do not create competing copies of the same state.

---

## Required Read Order

Before executing task work:

```text
1. ../BOARD.md
2. ../projects/<project-slug>.md
3. ./<project-slug>-tasks.md
4. Relevant repository files
```

This establishes:

- portfolio priority;
- project intent;
- task execution state;
- implementation context.

Do not execute a task from its title alone when its project context is available.

---

## Creating a Task Board

When a new project requires a task board:

1. Copy `_TEMPLATE.md`.
2. Save it as:

   ```text
   tasks/<project-slug>-tasks.md
   ```

3. Match the slug used by:

   ```text
   projects/<project-slug>.md
   ```

4. Replace all placeholders.
5. Assign a stable project task prefix.
6. Link the task board to the project file.
7. Link the task board to `BOARD.md`.
8. Confirm the project file links back.
9. Add initial tasks when enough information exists.
10. Set board counts and `Last Updated`.

Do not create a task board disconnected from an identifiable project.

---

## Task Prefixes

Use a stable prefix that identifies the owning project.

Preferred:

```text
AUTH-001
AUTH-002
```

```text
API-001
API-002
```

```text
DOCS-001
DOCS-002
```

A shorter prefix may be used when it remains unambiguous:

```text
A-001
A-002
```

Do not change the prefix after tasks exist unless repository-wide references are intentionally migrated.

---

## Task IDs

Task IDs must be:

- unique;
- stable;
- sequential where practical;
- never reused.

If the highest task is:

```text
AUTH-014
```

the next task should normally be:

```text
AUTH-015
```

If `AUTH-008` was deleted or cancelled, do not reuse `AUTH-008`.

Stable IDs are more important than perfectly contiguous numbering.

---

## Required Task Structure

A normal task should contain:

```text
Task ID and title
Status badge
Priority badge
Type badge
Blocked badge
Metadata
Goal
Acceptance Criteria
Dependencies
Blockers
Files / Resources
Implementation Notes
Validation
Next Action
Task Activity
```

Preserve this structure unless a task genuinely requires additional information.

Do not remove sections merely because they are currently empty. Use concise values such as:

```text
None
—
```

when appropriate.

---

## Task Creation Rules

When creating a task:

1. assign a unique task ID;
2. write an outcome-focused title;
3. define a clear goal;
4. set a priority;
5. set a task type;
6. write verifiable acceptance criteria;
7. identify known dependencies;
8. identify relevant files or references;
9. include necessary execution context;
10. define validation where possible;
11. place it in `Backlog` or `Ready`;
12. update counts and dates.

Do not create tasks solely as reminders when they cannot describe actionable work.

---

## Task Granularity

Tasks should be large enough to produce a meaningful result but small enough to reason about, validate, and move independently.

Prefer:

```text
AUTH-004 — Add password reset token validation
```

over:

```text
AUTH-004 — Build authentication system
```

and over:

```text
AUTH-004 — Rename one variable
```

A large piece of work should be decomposed when its subparts have distinct acceptance criteria or dependencies.

A tiny change may remain inside a larger task when splitting it would add administrative noise without improving execution clarity.

---

## Workflow

Supported workflow:

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

Temporary interruption state:

```text
Blocked
```

Every task must exist in exactly one workflow section.

---

## Backlog Rules

Place a task in `Backlog` when it belongs to the project but is not yet executable.

Typical reasons:

- requirements are incomplete;
- acceptance criteria are unclear;
- dependencies are unresolved;
- task priority is intentionally deferred;
- project sequencing does not permit execution yet.

Do not execute a backlog task directly.

Move it to `Ready` first once it becomes actionable.

---

## Ready Rules

A task may enter `Ready` when:

- its goal is clear;
- acceptance criteria are usable;
- required project context exists;
- known blocking dependencies are resolved;
- the work can reasonably begin.

`Ready` means executable, not merely desirable.

---

## Task Selection

When selecting the next task:

1. continue an existing actionable `In Progress` task;
2. otherwise choose the highest-priority executable task from `Ready`;
3. respect dependencies;
4. prefer work aligned with the project's current focus;
5. avoid starting new work when existing active work should be completed first.

Prefer one primary active task unless parallel work is explicitly justified.

Do not select tasks based only on file order.

---

## Starting a Task

When active work begins:

1. move the complete task block to `In Progress`;
2. update the status badge;
3. set `Status` to `In Progress`;
4. set `Started` if it was previously unset;
5. update `Updated`;
6. set the board's `Active Task`;
7. update `Active Task Detail`;
8. update board counts;
9. update top summary badges;
10. record the transition.

Do not mark a task `In Progress` merely because it was discussed.

---

## Active Task Detail

Maintain `Active Task Detail` for the primary active task.

It should reflect:

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

Keep this section concise and current.

Do not let it become a second full task definition.

When the active task changes, replace the section contents with the new primary active task context.

---

## In-Progress Rules

While executing a task:

- keep acceptance criteria synchronized with verified progress;
- record durable implementation notes;
- record meaningful task decisions;
- update blockers when they appear;
- keep the next action concrete;
- do not continuously rewrite unrelated task metadata.

Temporary scratch reasoning does not belong in the task file.

Store only context useful to future work.

---

## Blocking a Task

Move a task to `Blocked` when meaningful execution cannot continue.

When blocking:

1. move the complete task block to `Blocked`;
2. set status to `Blocked`;
3. change the blocked badge to `yes`;
4. describe the blocker;
5. state exactly what is required to unblock it;
6. update the blocker register;
7. update `Updated`;
8. clear or replace `Active Task` if necessary;
9. update counts and badges;
10. record the transition.

Avoid vague blockers such as:

```text
Waiting.
Issue exists.
Need more info.
```

Prefer:

```text
Blocked until API credentials with write access are provided.
```

---

## Unblocking a Task

When a blocker resolves:

1. update the blocker register;
2. record the resolution if useful;
3. set the blocked badge to `no`;
4. clear the active blocker field;
5. move the task to `Ready` or `In Progress`;
6. update `Updated`;
7. update counts;
8. record the transition.

Return it to `In Progress` only if work is actively resuming.

Otherwise move it to `Ready`.

---

## Review Rules

Move a task to `Review` when implementation is believed complete but required validation or acceptance remains.

Review may include:

- automated test execution;
- manual validation;
- code review;
- visual review;
- artifact inspection;
- stakeholder approval.

Do not use `Review` as a generic holding area.

---

## Completion Rules

A task may enter `Done` only when:

- its goal has been achieved;
- required acceptance criteria are satisfied;
- required validation is complete;
- no unresolved blocker prevents completion.

When completing:

1. check satisfied acceptance criteria;
2. check completed validation;
3. move the complete task block to `Done`;
4. set status to `Done`;
5. set the blocked badge to `no`;
6. set `Completed` to the current date;
7. update `Updated`;
8. update board counts;
9. update completion percentage;
10. update summary badges;
11. clear or change `Active Task`;
12. record completion in task activity;
13. update the board activity log where meaningful.

Do not mark work complete because code was written, a tool ran, or an attempt was made.

---

## Reopening Tasks

If completed work later proves incomplete or incorrect:

1. retain the same task ID;
2. move the task back to the appropriate active state;
3. record why it was reopened;
4. update acceptance criteria if the original contract was incomplete;
5. clear or revise `Completed` as appropriate;
6. update counts and progress.

Do not create a duplicate task merely to preserve the appearance of completion.

Create a new task only when the newly discovered work is genuinely separate.

---

## Cancelling Tasks

If a task is intentionally abandoned because it is no longer needed, do not silently delete it if meaningful history exists.

Preferred approaches:

- mark it cancelled in its metadata;
- move it to an appropriate historical section if the board defines one;
- record the reason in activity.

If the task was only a newly created placeholder with no history or references, removing it may be reasonable.

Never reuse its task ID.

---

## Priority

Supported priorities:

```text
Low
Medium
High
Critical
```

Priority should reflect execution importance within the project.

Do not mark every task `High`.

Use `Critical` sparingly for work that materially blocks or threatens project success.

If project-level priority changes, update the project file or `BOARD.md` as appropriate.

---

## Task Types

Common task types include:

```text
Task
Feature
Bug
Research
Docs
Maintenance
Test
```

Use types to improve scanability, not to create unnecessary taxonomy.

If a task does not clearly fit a specialized category, use:

```text
Task
```

---

## Acceptance Criteria

Acceptance criteria must represent verifiable outcomes.

Good:

```markdown
- [ ] Invalid tokens return `401`.
- [ ] Valid tokens populate the authenticated user context.
- [ ] Authentication tests pass.
```

Poor:

```markdown
- [ ] Work on tokens.
- [ ] Try the tests.
- [ ] Look at authentication.
```

Do not weaken criteria merely to move a task to `Done`.

If criteria materially change because requirements changed, update the associated project file when appropriate.

---

## Validation

Validation should answer:

> How do we know this task actually works?

Use checks such as:

```text
Tests pass.
Build completes.
Expected API response observed.
File generated.
UI manually reviewed.
User acceptance received.
```

Do not claim validation that was not performed.

If validation cannot be performed, leave it incomplete and explain the limitation.

---

## Dependencies

Task dependencies belong in this file.

Examples:

```text
AUTH-005 depends on AUTH-004.
API-013 depends on migration output.
DOCS-008 depends on the deployment command being finalized.
```

If a dependency affects the entire project rather than one task, promote it to the project file.

---

## Blocker Register

The blocker register provides a centralized view of current impediments.

Keep it synchronized with blocked task blocks.

When a blocker is resolved:

- update or remove the active blocker row;
- preserve meaningful resolution history in task activity when useful.

Do not allow the register and task block to contradict one another.

---

## Task Dependency Register

Use the dependency register for relationships worth seeing across the board.

Not every simple dependency must be duplicated here.

Add it when the relationship:

- affects sequencing;
- spans several tasks;
- is important to agent planning;
- could cause accidental premature execution.

The task's own dependency section remains canonical for that task.

---

## Implementation Notes

Implementation notes should contain durable execution context.

Good examples:

```text
The legacy endpoint must remain supported during migration.
The schema is generated from `src/schema.ts`.
Tests require the local SQLite fixture.
```

Avoid conversational scratchpad text.

Do not preserve hidden reasoning, speculative chains of thought, or unnecessary narrative.

Keep only useful conclusions and context.

---

## Task Decisions

Use sequential IDs:

```text
TDEC-001
TDEC-002
TDEC-003
```

Never reuse decision IDs.

Record:

```text
Date
Task
Decision
Reason
```

Preserve superseded decisions.

If necessary:

```text
TDEC-009 supersedes TDEC-004.
```

Promote decisions to the project file when they become project-wide.

---

## Activity Logging

Per-task activity should capture meaningful state changes.

Good:

```text
Task created.
Moved to In Progress.
Blocked pending schema approval.
Returned to Ready.
Validation passed.
Task completed.
Task reopened after regression.
```

Board activity should capture broader execution events.

Avoid:

```text
Read file.
Changed formatting.
Updated wording.
Ran command.
```

Git already records low-level edits.

---

## Progress Counts

Whenever a task changes workflow state, update:

```text
Backlog
Ready
In Progress
Blocked
Review
Done
Total
```

Also synchronize the summary badges at the top of the task board.

Do not allow badge counts and the progress table to diverge.

---

## Completion Percentage

Unless the project defines another explicit model:

```text
Completion = Done / Total
```

Use the current task set.

If:

```text
Done = 4
Total = 10
```

then:

```text
Completion = 40%
```

Do not use task-board completion as the sole authority for project completion.

The project file's success criteria remain authoritative.

---

## State Ownership

This task board owns:

```text
task IDs
task goals
task workflow states
task priorities
task types
task acceptance criteria
task dependencies
task blockers
task validation
task implementation notes
task decisions
task-level next actions
task history
task-board counts
```

The project file owns:

```text
project objective
project scope
project requirements
project milestones
project deliverables
project-level risks
project-level decisions
project status detail
```

`BOARD.md` owns:

```text
portfolio overview
cross-project prioritization
cross-project status summary
portfolio-level blockers
```

---

## Synchronization

After execution:

```text
Repository work
      ↓
Task board
      ↓
Project file if project state changed
      ↓
BOARD.md if portfolio state changed
```

### Always update the task board when:

- a task starts;
- a task changes state;
- acceptance criteria change;
- validation state changes;
- a blocker appears or resolves;
- task dependencies change;
- task completion occurs;
- a task is reopened;
- the primary next action changes.

### Update the project file when:

- project status changes;
- milestone state changes;
- deliverable state changes;
- scope changes;
- requirements change;
- project-level risk changes;
- a task decision becomes a project decision;
- current project focus materially changes.

### Update `BOARD.md` when:

- project status changes;
- project priority changes;
- project progress materially changes;
- the project becomes blocked or unblocked;
- cross-project focus changes;
- the project completes.

Do not propagate trivial edits through all layers.

---

## Conflict Resolution

If documents disagree, resolve according to state ownership.

### Task State

Canonical:

```text
tasks/<project-slug>-tasks.md
```

### Project State

Canonical:

```text
projects/<project-slug>.md
```

### Portfolio Summary

Canonical overview:

```text
BOARD.md
```

When a higher-level summary disagrees with lower-level canonical state:

1. verify actual repository state if necessary;
2. correct the stale summary;
3. preserve meaningful history;
4. avoid inventing missing facts.

---

## Editing Safety

When modifying a task board:

- preserve task IDs;
- preserve task history;
- preserve completed tasks;
- preserve meaningful acceptance criteria;
- preserve task decision IDs;
- preserve workflow section headings;
- preserve link relationships;
- preserve badge conventions;
- keep dates in `YYYY-MM-DD`;
- avoid unrelated rewrites;
- make the smallest coherent state update;
- keep summaries synchronized.

Do not delete useful historical state merely for visual cleanliness.

---

## Agent Navigation

Use repository links rather than relying on remembered paths.

Expected relationship:

```text
BOARD.md
   │
   └── projects/authentication.md
            │
            └── tasks/authentication-tasks.md
```

Task board navigation:

```markdown
[Board](../BOARD.md) · [Project](../projects/authentication.md)
```

Follow these links before inferring project relationships from filenames alone.

---

## End-of-Session Protocol

Before ending meaningful task work:

1. inspect every task touched during the session;
2. ensure workflow placement matches reality;
3. update acceptance criteria;
4. update validation results;
5. update blockers;
6. update dependencies if changed;
7. update durable notes;
8. update task decisions;
9. set a concrete next action;
10. synchronize `Active Task Detail`;
11. update counts;
12. update completion percentage;
13. update summary badges;
14. update `Last Updated`;
15. update the project file if project-level state changed;
16. update `BOARD.md` if portfolio state changed.

Leave the repository resumable from files alone.

---

## Agent Handoff Standard

Another agent opening the task board should be able to determine:

```text
What tasks exist?
Which task is active?
Which tasks are ready?
What is blocked?
What dependencies matter?
What has already been completed?
What acceptance criteria remain?
What validation remains?
What should happen next?
```

If these cannot be answered from the task board, execution state is incomplete.

---

## Operating Principle

A task is not merely a note.

A task is an explicit execution contract containing:

```text
a defined result
a known state
verifiable completion criteria
relevant execution context
a concrete continuation path
```

The goal is not to document every action.

The goal is to leave enough accurate state that another human or agent can continue the work safely without depending on conversational memory.

---

<!--
AGENT INSTRUCTION SUMMARY

TASK BOARD:
Canonical detailed execution state.

PROJECT FILE:
Canonical durable project state.

BOARD:
Canonical portfolio overview.

READ ORDER:
BOARD → PROJECT → TASK BOARD → REPOSITORY WORK

UPDATE ORDER:
REPOSITORY WORK → TASK BOARD → PROJECT IF NEEDED → BOARD IF NEEDED

TASK FLOW:
BACKLOG → READY → IN PROGRESS → REVIEW → DONE
                        ↕
                     BLOCKED

PRESERVE:
- task IDs
- acceptance criteria
- completed tasks
- task decisions
- meaningful history
- dependencies
- blocker history when useful

DO NOT:
- duplicate tasks across workflow sections
- reuse task IDs
- mark attempted work complete
- silently ignore blockers
- fabricate validation
- rely on conversational memory
- propagate trivial edits through every state layer

GOAL:
Leave executable project state accurate, resumable, and verifiable.
-->