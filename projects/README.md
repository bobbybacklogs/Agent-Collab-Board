# Projects

![Type](https://img.shields.io/badge/type-projects-0969da)
![Format](https://img.shields.io/badge/format-Markdown-000000)
![Agent Ready](https://img.shields.io/badge/agent-ready-238636)

This directory contains the **canonical project-level records** for the repository.

Each project has one Markdown file describing what the project is, why it exists, what success looks like, its scope, requirements, milestones, risks, decisions, and current project-level state.

Detailed task execution does **not** belong here. Tasks are maintained separately in [`../tasks`](../tasks/).

---

## Directory Role

The repository state model is:

```text
BOARD.md
   ↓
projects/<project-slug>.md
   ↓
tasks/<project-slug>-tasks.md
   ↓
project work
```

Each layer has a different responsibility.

| Layer | Purpose |
| --- | --- |
| [`../BOARD.md`](../BOARD.md) | Portfolio overview and cross-project status |
| `projects/` | Durable project-level state |
| [`../tasks`](../tasks/) | Detailed task execution and Kanban state |
| Repository files | Actual implementation and deliverables |

The project file acts as the bridge between the portfolio view and the project's executable task board.

---

## What Belongs in a Project File

Project files should contain durable information such as:

- project objective;
- project success criteria;
- scope;
- requirements;
- deliverables;
- milestones;
- project dependencies;
- constraints;
- risks;
- project-level decisions;
- open questions;
- references;
- current project state;
- project-level next action;
- meaningful project activity.

Project files should remain useful even after an individual work session ends.

---

## What Does Not Belong Here

Avoid storing detailed execution state in project files.

The following belong in the corresponding task board:

- individual tasks;
- task acceptance criteria;
- task status;
- task blockers;
- task working notes;
- task-level implementation details;
- task-specific next steps;
- detailed execution history.

For example:

```text
projects/authentication.md
tasks/authentication-tasks.md
```

The project file defines the authentication project.

The task file tracks the work required to execute it.

---

## Naming Convention

Use lowercase, filesystem-safe project slugs.

```text
projects/
├── authentication.md
├── dashboard-redesign.md
├── api-migration.md
└── documentation-refresh.md
```

Avoid names such as:

```text
Project A.md
New Project.md
final-project-v2.md
```

Prefer stable descriptive slugs:

```text
authentication.md
billing-system.md
client-dashboard.md
```

The corresponding task file should use the same slug:

```text
projects/authentication.md
tasks/authentication-tasks.md
```

This makes relationships predictable for both humans and agents.

---

## Creating a Project

Use [`_TEMPLATE.md`](./_TEMPLATE.md) as the starting point for every new project.

Copy it to:

```text
projects/<project-slug>.md
```

Then replace all template placeholders.

At minimum, define:

- project name;
- project ID;
- objective;
- status;
- priority;
- success criteria;
- scope;
- current state;
- task-board link;
- next action.

Also create the matching task board:

```text
tasks/<project-slug>-tasks.md
```

Finally, add the project to:

```text
BOARD.md
```

---

## Project Lifecycle

Recommended project states are:

```text
Planning
   ↓
Ready
   ↓
Active
   ↓
Review
   ↓
Complete
```

Projects may also enter:

```text
Blocked
Paused
Archived
```

### Planning

The project is still being defined.

Typical work includes:

- clarifying the objective;
- defining scope;
- collecting requirements;
- identifying dependencies;
- establishing success criteria.

### Ready

The project is sufficiently defined to begin execution.

At least one executable task should normally exist in the associated task board.

### Active

Implementation or execution is underway.

The project file should clearly identify:

- current state;
- current focus;
- next milestone;
- next action.

### Blocked

Project-level progress cannot continue because of a material dependency or unresolved issue.

The blocker should be visible in both the project file and `BOARD.md` when it affects portfolio state.

### Review

Primary execution is complete and the project is undergoing final validation.

### Complete

The project's success criteria have been satisfied.

Do not mark a project complete merely because all currently listed tasks are done. Project completion is determined by the project-level success criteria.

### Paused

Work has intentionally stopped but the project remains relevant.

### Archived

The project is no longer active and is retained for historical reference.

---

## State Ownership

To prevent conflicting information, each type of state has a canonical home.

| Information | Canonical Location |
| --- | --- |
| Project objective | Project file |
| Project scope | Project file |
| Project requirements | Project file |
| Project milestones | Project file |
| Project deliverables | Project file |
| Project risks | Project file |
| Project-level decisions | Project file |
| Project status detail | Project file |
| Individual tasks | Task board |
| Task status | Task board |
| Task acceptance criteria | Task board |
| Task blockers | Task board |
| Task execution notes | Task board |
| Portfolio summary | `BOARD.md` |
| Cross-project priority | `BOARD.md` |
| Cross-project blockers | `BOARD.md` |

The general rule is:

> Store information at the lowest appropriate canonical level. Higher-level files summarize and link instead of duplicating detail.

---

## Linking Convention

Every project file should link upward to the board and sideways to its task board.

Example:

```markdown
[Board](../BOARD.md) · [Tasks](../tasks/authentication-tasks.md)
```

The associated task board should link back:

```markdown
[Board](../BOARD.md) · [Project](../projects/authentication.md)
```

`BOARD.md` should link to both.

This keeps navigation bidirectional and predictable.

---

## Updating a Project

Update the project file whenever project-level state materially changes.

Examples include:

- project status changes;
- priority changes;
- scope changes;
- requirements change;
- a milestone is reached;
- a deliverable changes state;
- a project-level dependency appears or clears;
- a new project risk is identified;
- an important decision is made;
- the current focus changes;
- the next project-level action changes;
- the project becomes blocked, paused, or complete.

Do not update the project file for every small task action.

Routine task execution belongs in the associated task board.

---

## Project Progress

Progress should reflect the actual project state.

Task completion can inform the progress value, but the project file should not blindly equate:

```text
tasks complete = project complete
```

A project may still require:

- integration;
- validation;
- documentation;
- approval;
- deployment;
- acceptance review.

Project completion is ultimately determined by the project's success criteria.

---

## Decisions

Record decisions here when they affect the project beyond a single task.

Examples:

```text
DEC-001 — Use PostgreSQL instead of SQLite.
DEC-002 — Support desktop layouts only in version one.
DEC-003 — Authentication will use OAuth rather than local passwords.
```

Task-specific implementation decisions can remain in the task board unless they become durable project constraints.

Do not repeatedly reopen recorded decisions unless new information justifies doing so.

---

## Project Activity

The activity section is intended for meaningful project-level changes.

Good entries:

```text
Project moved from Planning to Ready.
Scope expanded to include CSV export.
M2 completed.
Project blocked pending vendor approval.
DEC-004 recorded.
Project marked Complete after success criteria validation.
```

Avoid entries such as:

```text
Fixed typo.
Updated formatting.
Checked task.
Read project file.
```

Git already records file edits. The project activity log exists to preserve **state history**, not editing history.

---

## Recommended Structure

Each project should follow the shared template structure:

```text
Project Header
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

Keeping project files structurally consistent makes them easier for agents to parse and update safely.

---

## Agent Usage

Agents should treat each project file as persistent project memory.

Before executing project work:

```text
1. Read BOARD.md.
2. Identify the relevant project.
3. Read projects/<project-slug>.md.
4. Read tasks/<project-slug>-tasks.md.
5. Continue from the documented project and task state.
```

After meaningful work:

```text
1. Update the task board.
2. Update the project file if project-level state changed.
3. Update BOARD.md if the portfolio summary changed.
```

See [`INSTRUCTIONS.md`](./INSTRUCTIONS.md) for the complete project-folder agent protocol.

---

## Files

```text
projects/
├── README.md
├── INSTRUCTIONS.md
├── _TEMPLATE.md
└── <project-slug>.md
```

### `README.md`

Human-readable explanation of the project system.

### `INSTRUCTIONS.md`

Operational rules for agents creating and maintaining project files.

### `_TEMPLATE.md`

Canonical structure for new projects.

### `<project-slug>.md`

The persistent state document for an individual project.

---

## Principle

The project directory answers:

> **What are we building, why are we building it, what constraints govern it, and what is its current project-level state?**

The task directory answers:

> **What work needs to happen next to move that project forward?**
