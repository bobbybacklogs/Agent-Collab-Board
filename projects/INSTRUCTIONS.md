# Project Agent Instructions

![Scope](https://img.shields.io/badge/scope-projects-0969da)
![Agent](https://img.shields.io/badge/agent-instructions-238636)
![State](https://img.shields.io/badge/state-canonical-d29922)

These instructions govern agent interaction with files inside `/projects`.

Project files are persistent project-level state documents. They must remain accurate, structured, navigable, and synchronized with their associated task boards and the repository-level `BOARD.md`.

---

## Core Rule

Treat:

```text
projects/<project-slug>.md
```

as the **canonical source of durable project-level state**.

Treat:

```text
tasks/<project-slug>-tasks.md
```

as the **canonical source of detailed task-level state**.

Treat:

```text
BOARD.md
```

as the **canonical portfolio overview**.

Do not allow these layers to become competing copies of the same information.

---

## Required Read Order

Before working on an existing project:

```text
1. ../BOARD.md
2. ./<project-slug>.md
3. ../tasks/<project-slug>-tasks.md
4. Relevant repository files
```

This order establishes:

- portfolio context;
- project intent;
- task execution state;
- implementation context.

Do not begin execution from a task in isolation when the associated project context is available.

---

## Creating a New Project

When creating a project:

1. Copy `_TEMPLATE.md`.
2. Save it as:

   ```text
   projects/<project-slug>.md
   ```

3. Use a stable lowercase slug.

4. Replace all placeholders.

5. Create the matching task board:

   ```text
   tasks/<project-slug>-tasks.md
   ```

6. Link the project file to:

   ```text
   ../BOARD.md
   ../tasks/<project-slug>-tasks.md
   ```

7. Link the task board back to the project file.

8. Add the project to `BOARD.md`.

9. Establish initial project status and priority.

10. Define enough success criteria to determine when the project is actually complete.

Do not create a project file with unresolved template placeholders unless the missing information genuinely cannot yet be determined.

---

## Naming Rules

Project filenames must use predictable slugs.

Preferred:

```text
authentication.md
dashboard-redesign.md
api-migration.md
documentation-refresh.md
```

Avoid:

```text
Project-A.md
new project.md
test.md
project-final-v2.md
```

Matching task files must use:

```text
tasks/<project-slug>-tasks.md
```

Example:

```text
projects/api-migration.md
tasks/api-migration-tasks.md
```

Do not rename established project slugs casually because other repository documents may depend on their paths.

---

## Preserve Structure

Maintain the shared project structure unless the project genuinely requires an additional section.

Expected major sections:

```text
Project Overview
Objective
Success Criteria
Current State
Scope
Requirements
Deliverables
Milestones
Dependencies
Constraints
Risks
Decisions
Open Questions
References
Project Notes
Activity
Agent Protocol
```

Do not reorder sections without a clear reason.

Predictable structure improves agent parsing and reduces accidental state loss.

---

## Project-Level State

The project file owns:

- project identity;
- objective;
- summary;
- success criteria;
- scope;
- requirements;
- deliverables;
- milestones;
- project dependencies;
- project constraints;
- project risks;
- durable project decisions;
- project-level open questions;
- durable references;
- current project focus;
- next project milestone;
- next project-level action;
- project-level activity.

Update these fields whenever their real state changes.

---

## Task-Level State

Do not duplicate detailed task state into the project file.

The associated task board owns:

- task IDs;
- task descriptions;
- task Kanban placement;
- task status;
- task priority;
- task acceptance criteria;
- task blockers;
- task dependencies;
- task working notes;
- task-specific next actions;
- task execution history.

A project file may summarize task state where useful, but the task board remains authoritative.

For example, this is acceptable:

```markdown
**Current Focus**

`Complete authentication integration and validate session persistence.`
```

Do not copy the complete authentication task definition into the project file.

---

## Update Rules

Update the project file when a material project-level change occurs.

Examples:

- `Planning` → `Ready`;
- `Ready` → `Active`;
- project becomes blocked;
- project resumes;
- scope changes;
- requirement changes;
- milestone completes;
- deliverable completes;
- a new risk is discovered;
- an old risk is resolved;
- a project-level decision is made;
- project focus changes;
- target date changes;
- project enters review;
- project completes.

Do not create project-level churn for insignificant execution details.

---

## Current State

The `Current State` section should always provide useful continuation context.

Keep these values current:

```text
Summary
Current Focus
Next Milestone
Next Action
```

### Summary

Describe the actual project condition in one to three concise sentences.

### Current Focus

State the present project-level emphasis.

### Next Milestone

Name the next meaningful project outcome.

### Next Action

State one concrete project-level action.

Avoid:

```text
Continue project.
Keep working.
Finish remaining tasks.
```

Prefer:

```text
Complete authentication validation, then move the project into final review.
```

---

## Status Management

Use one primary project status.

Supported statuses:

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

### Status Rules

`Planning`
: Project definition is incomplete.

`Ready`
: Project is adequately defined and executable work can begin.

`Active`
: Work is currently underway.

`Blocked`
: A project-level dependency prevents meaningful progress.

`Review`
: Execution is substantially complete and final validation is underway.

`Complete`
: Project success criteria are satisfied.

`Paused`
: Work is intentionally suspended.

`Archived`
: Project is no longer active and is retained for reference.

Do not mark a project `Complete` solely because its task board has no open tasks.

Verify the project success criteria.

---

## Progress Management

Keep project progress synchronized with actual state.

Progress may be informed by:

- completed tasks;
- milestone completion;
- deliverables;
- remaining validation;
- unresolved success criteria.

Do not manufacture false precision.

If a meaningful percentage cannot be inferred safely, use a conservative estimate based on explicit project state rather than pretending task count alone is sufficient.

---

## Success Criteria

Success criteria are authoritative for project completion.

When modifying them:

- preserve the original intent;
- do not weaken criteria merely to mark the project complete;
- record material changes in `Activity`;
- record a decision if the change reflects a significant scope or product decision.

Check criteria only when they are actually satisfied.

---

## Scope

Maintain explicit separation between:

```text
In Scope
Out of Scope
```

If scope changes materially:

1. update the appropriate section;
2. update requirements or deliverables if needed;
3. record the change in `Activity`;
4. record a decision when the change is significant;
5. update `BOARD.md` if priority, timeline, status, or portfolio impact changes.

Do not silently expand project scope through task creation.

---

## Requirements

Requirements belong in the project file when they define project behavior or constraints.

Keep functional and non-functional requirements separate where practical.

When a requirement changes:

- update it directly;
- preserve meaning and technical detail;
- update affected tasks;
- record a durable decision if appropriate;
- note the change in project activity when material.

---

## Milestones

Milestones represent meaningful project outcomes, not individual tasks.

Good milestones:

```text
M1 — Architecture approved
M2 — Core implementation complete
M3 — Validation complete
M4 — Production release
```

Poor milestones:

```text
M1 — Edit file
M2 — Fix button
M3 — Run command
```

Task-level implementation belongs in `/tasks`.

---

## Deliverables

Deliverables should point to concrete outputs when possible.

Examples:

```text
src/auth/
docs/api.md
dist/application.zip
deployment configuration
migration report
```

Update deliverable status when its actual state changes.

Do not mark deliverables complete merely because the associated task was attempted.

---

## Dependencies

Use `Dependencies` for project-level dependencies.

Examples:

- another project;
- vendor availability;
- an external API;
- organizational approval;
- infrastructure readiness;
- required upstream architecture.

Task-specific dependencies belong in the task board.

If a dependency blocks the entire project, update:

```text
Project Status → Blocked
Current State
Dependencies
BOARD.md
```

when appropriate.

---

## Constraints

Constraints are durable limitations that should inform future work.

Examples:

- required platform;
- compatibility target;
- budget;
- deployment environment;
- fixed technology;
- deadline;
- regulatory requirement;
- performance limitation.

Do not treat temporary task blockers as project constraints.

---

## Risks

Add a risk when a plausible future condition could materially affect project success.

Each risk should identify:

```text
Risk
Impact
Mitigation
Status
```

Do not use the risk table as a general notes area.

When a risk is resolved, update its status rather than deleting it.

---

## Decisions

Record durable project-level decisions.

Use sequential IDs:

```text
DEC-001
DEC-002
DEC-003
```

Do not reuse decision IDs.

Record:

```text
Date
Decision
Reason
Affects
```

A decision belongs here when future agents should know it without reconstructing the reasoning from Git history or task notes.

Preserve old decisions even if a later decision supersedes them.

If superseded, record the new decision and note the relationship.

Example:

```text
DEC-008 supersedes DEC-003.
```

---

## Open Questions

Use this section for unresolved project-level questions.

When a question is answered:

1. remove it from the open checklist;
2. update the relevant canonical section;
3. record a decision if the answer is durable and consequential.

Do not leave resolved questions checked indefinitely when their answer belongs elsewhere in the document.

---

## References

Prefer repository-relative links for internal resources.

Examples:

```markdown
[`../docs/architecture.md`](../docs/architecture.md)

[`../src/auth`](../src/auth)
```

Keep references useful and durable.

Avoid copying large external or internal documents directly into the project file when a reference is sufficient.

---

## Activity Log

Record meaningful project-level state transitions only.

Add entries such as:

```text
2026-08-07 — Project created.
2026-08-09 — Project moved to Active.
2026-08-11 — Scope expanded to include export support.
2026-08-14 — M2 completed.
2026-08-17 — Project blocked pending API access.
```

Do not log:

- formatting changes;
- typo fixes;
- routine reads;
- insignificant task movement;
- every commit.

Git already provides low-level history.

---

## Synchronization Rules

After task work, synchronize state upward only as necessary.

```text
Repository work
      ↓
Task board
      ↓
Project file
      ↓
BOARD.md
```

### Always update the task board when:

- task state changes;
- acceptance criteria change;
- task work is completed;
- task blockers change;
- task-level next action changes.

### Update the project file when:

- task changes affect project-level state;
- milestone status changes;
- deliverable status changes;
- scope or requirements change;
- project status changes;
- focus changes;
- project-level next action changes;
- risk or decision state changes.

### Update `BOARD.md` when:

- project status changes;
- project priority changes;
- overall progress materially changes;
- project becomes blocked or unblocked;
- portfolio-level next focus changes;
- project completes;
- a new project is added;
- a project is archived.

Do not update all three files mechanically after every minor edit.

Synchronize only state that belongs at each layer.

---

## Conflict Resolution

If project and task files disagree:

1. determine which file canonically owns the disputed information;
2. inspect actual repository state when necessary;
3. correct the non-canonical summary;
4. preserve meaningful history;
5. do not silently invent missing state.

Examples:

Task status conflict:

```text
Canonical source → task board
```

Project objective conflict:

```text
Canonical source → project file
```

Portfolio status conflict:

```text
Detailed project state → project file
Portfolio summary → BOARD.md should be synchronized to it
```

---

## Editing Safety

When updating project files:

- preserve project IDs;
- preserve decision IDs;
- preserve historical activity;
- preserve success criteria unless explicitly changed;
- preserve established scope unless intentionally modified;
- preserve links;
- preserve table structure;
- preserve badge style;
- keep dates in `YYYY-MM-DD`;
- avoid destructive rewrites of unrelated sections;
- make the smallest coherent state update required.

Do not delete history merely to make the file look cleaner.

---

## Badge Rules

Use Shields.io badges consistently.

Do not use emojis for status indicators.

Keep textual state authoritative even when badges are present.

Example:

```markdown
![Status](https://img.shields.io/badge/status-active-238636)
```

The badge is presentation.

The structured project data is state.

When status changes, keep the badge and corresponding textual metadata synchronized.

---

## Completion Protocol

Before marking a project complete:

1. Read all project success criteria.
2. Confirm each required criterion is satisfied.
3. Review the task board for unresolved work.
4. Review open questions.
5. Review unresolved project risks or blockers.
6. Confirm required deliverables exist.
7. Update milestones.
8. Update project status to `Complete`.
9. Update progress.
10. Update `Current State`.
11. Record completion in `Activity`.
12. Update `Last Updated`.
13. Update `BOARD.md`.

Do not mark a project complete because work merely appears finished.

---

## End-of-Session Protocol

Before ending meaningful project work:

1. Ensure the task board reflects actual task state.
2. Update the project file if project-level state changed.
3. Ensure `Current State` is accurate.
4. Set a concrete `Next Action`.
5. Record new durable decisions.
6. Record new project-level risks.
7. Update milestones and deliverables where applicable.
8. Update `Last Updated`.
9. Update `BOARD.md` if the overview changed.
10. Leave the repository in a state another agent can resume without relying on conversational memory.

---

## Operating Principle

A project file should allow another agent to answer:

```text
What is this project?
Why does it exist?
What does success require?
What is included?
What constraints matter?
What has been decided?
What is the current state?
What is the next project-level action?
Where is the detailed task board?
```

If those questions cannot be answered from the file, the project state is incomplete.

---

<!--
AGENT INSTRUCTION SUMMARY

PROJECT FILE:
Canonical durable project-level state.

TASK FILE:
Canonical detailed execution state.

BOARD:
Canonical portfolio overview.

READ ORDER:
BOARD → PROJECT → TASKS → WORK

UPDATE ORDER:
WORK → TASKS → PROJECT IF NEEDED → BOARD IF NEEDED

PRESERVE:
IDs, scope history, decisions, success criteria, meaningful activity.

DO NOT:
Duplicate detailed task state here.
Invent completion.
Delete useful history.
Use conversational memory instead of updating repository state.

GOAL:
Leave every project resumable by another agent from repository state alone.
-->