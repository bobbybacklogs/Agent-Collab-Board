# Tasks

![Type](https://img.shields.io/badge/type-tasks-0969da)
![Workflow](https://img.shields.io/badge/workflow-Kanban-0969da)
![Format](https://img.shields.io/badge/format-Markdown-000000)
![Agent Ready](https://img.shields.io/badge/agent-ready-238636)

This directory contains the **canonical task-level state** for projects in the repository.

Each project has one task board that tracks executable work through a GitHub-friendly Kanban workflow.

Project definition and durable project context live separately in [`../projects`](../projects/). Portfolio-level status lives in [`../BOARD.md`](../BOARD.md).

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
repository work
```

Each layer has a distinct responsibility.

| Layer | Purpose |
| --- | --- |
| [`../BOARD.md`](../BOARD.md) | Portfolio overview and cross-project status |
| [`../projects`](../projects/) | Durable project-level state |
| `tasks/` | Detailed executable task state |
| Repository files | Actual implementation and deliverables |

The task board is the working execution layer between project intent and repository changes.

---

## What Belongs in a Task Board

Task boards should contain:

- task IDs;
- task titles;
- task goals;
- task priority;
- task type;
- task workflow state;
- acceptance criteria;
- task dependencies;
- blockers;
- implementation notes;
- validation steps;
- task-level next actions;
- task-level decisions;
- task activity;
- active-task context;
- board progress.

Task boards should answer:

> What work exists, what is ready, what is active, what is blocked, and what should happen next?

---

## What Does Not Belong Here

Avoid storing durable project-definition state in task boards.

The following belong in the corresponding project file:

- project objective;
- project scope;
- project requirements;
- project milestones;
- project deliverables;
- project-level risks;
- project-level decisions;
- project-level current state.

For example:

```text
projects/authentication.md
tasks/authentication-tasks.md
```

The project file defines the authentication project.

The task board tracks the executable work needed to complete it.

---

## File Naming

Use the same stable project slug as the associated project file.

```text
projects/authentication.md
tasks/authentication-tasks.md
```

Examples:

```text
tasks/
├── authentication-tasks.md
├── dashboard-redesign-tasks.md
├── api-migration-tasks.md
└── documentation-refresh-tasks.md
```

Avoid:

```text
A-Tasks.md
tasks-final.md
new-tasks.md
project1.md
```

Predictable filenames make project-task relationships easier for humans and agents to resolve.

---

## Task IDs

Each project should use a stable task prefix.

Examples:

```text
AUTH-001
AUTH-002
AUTH-003
```

```text
API-001
API-002
API-003
```

```text
DOCS-001
DOCS-002
```

Short project-based prefixes make task ownership immediately clear.

Task IDs must:

- be unique within the project;
- remain stable;
- use sequential numbering where practical;
- never be reused after deletion or completion.

Do not renumber existing tasks merely to remove gaps.

---

## Kanban Workflow

Tasks move through:

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

When the blocker is resolved, the task returns to the appropriate workflow state.

---

## Workflow States

### Backlog

Tasks that belong to the project but are not yet ready to execute.

A backlog task may still need:

- clearer requirements;
- acceptance criteria;
- dependencies resolved;
- prioritization;
- supporting context.

### Ready

Tasks that can be started without further project clarification.

A ready task should normally have:

- a clear goal;
- usable acceptance criteria;
- known dependencies;
- sufficient implementation context.

### In Progress

Tasks currently being executed.

Prefer one primary active task unless parallel work is intentional.

### Blocked

Tasks that cannot make meaningful progress.

A blocked task should state:

- what is blocking it;
- what is required to unblock it;
- when the blocker began;
- any relevant dependency.

### Review

Tasks whose implementation is believed complete but still require validation.

Examples:

- automated tests;
- manual verification;
- user review;
- code review;
- build validation;
- acceptance checks.

### Done

Tasks whose acceptance criteria and required validation are satisfied.

Completed tasks remain in the board for history.

---

## Creating a Task Board

Use [`_TEMPLATE.md`](./_TEMPLATE.md).

Copy it to:

```text
tasks/<project-slug>-tasks.md
```

Then configure:

- project name;
- project ID;
- project slug;
- task prefix;
- associated project link;
- board status;
- initial tasks.

The matching project file should already exist at:

```text
projects/<project-slug>.md
```

Both files should link to each other.

---

## Creating Tasks

Use the task block included in `_TEMPLATE.md`.

A task should define:

```text
ID
Title
Status
Priority
Type
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

At minimum, an executable task should have:

- a unique ID;
- a clear goal;
- verifiable acceptance criteria;
- known dependencies;
- a workflow state.

---

## Good Task Design

Tasks should represent coherent executable outcomes.

Prefer:

```text
AUTH-004 — Add session expiration handling
API-012 — Validate pagination parameters
DOCS-007 — Document local deployment workflow
```

Avoid vague tasks such as:

```text
AUTH-004 — Work on auth
API-012 — Fix API
DOCS-007 — Improve docs
```

A task should be specific enough that another agent can understand what successful completion means.

---

## Acceptance Criteria

Acceptance criteria are the primary completion contract for a task.

Good criteria are observable and verifiable:

```markdown
- [ ] Expired sessions redirect to the login page.
- [ ] The session cookie is cleared after expiration.
- [ ] Existing authentication tests continue to pass.
```

Avoid criteria that merely describe activity:

```markdown
- [ ] Work on expiration.
- [ ] Test the code.
- [ ] Look into login behavior.
```

A task should not move to `Done` until its required criteria are satisfied.

---

## Validation

Validation confirms that implementation actually satisfies the task.

Typical validation may include:

- unit tests;
- integration tests;
- build success;
- lint checks;
- type checks;
- visual review;
- API response checks;
- file inspection;
- user approval.

Validation should be recorded honestly.

Do not mark validation complete if the check was not performed.

---

## Dependencies

Dependencies identify work or conditions that must exist before or during execution.

Examples:

```text
AUTH-004 depends on AUTH-003.
API-010 depends on database migration completion.
DOCS-007 depends on the deployment workflow being finalized.
```

Use the central dependency table when relationships span several tasks.

Do not use task dependencies for broad project constraints. Those belong in the project file.

---

## Blockers

A blocker prevents meaningful task progress.

Examples:

- missing credentials;
- unavailable API;
- unresolved requirement;
- failing upstream dependency;
- pending approval;
- inaccessible environment.

When blocked:

1. move the task to `Blocked`;
2. set its blocked badge to `yes`;
3. document the blocker;
4. update the blocker register;
5. state what is required to resume.

Do not leave blocked work silently in `In Progress`.

---

## Active Task Detail

The task board includes an `Active Task Detail` section.

This section provides short-term execution context for the primary active task.

It should capture:

- current objective;
- current work;
- work completed during the session;
- constraints;
- blockers;
- relevant files;
- durable working notes;
- concrete next action.

This section is not a second copy of the task.

The task block remains canonical.

---

## Task Decisions

Task-level decisions use IDs such as:

```text
TDEC-001
TDEC-002
TDEC-003
```

Use them for implementation choices that should survive across sessions but do not affect the entire project.

Examples:

```text
TDEC-004 — Keep migration batching at 500 records.
TDEC-005 — Mock the payment provider in integration tests.
```

If a decision affects broader project behavior, record it in the associated project file instead.

---

## Task Activity

There are two levels of task history.

### Per-Task Activity

Use the task's own activity table for meaningful changes specific to that task.

Examples:

```text
Task created.
Moved to In Progress.
Blocked pending API access.
Returned to In Progress.
Acceptance criteria satisfied.
Completed.
```

### Board Activity

Use the board-level activity log for meaningful workflow events across the task board.

Avoid logging trivial edits.

Git already tracks file-level changes.

---

## Progress

The task board maintains counts for:

```text
Backlog
Ready
In Progress
Blocked
Review
Done
Total
```

Completion may normally be calculated as:

```text
Done / Total
```

However, task count should not be treated as equivalent to project completion.

The associated project file remains authoritative for project success criteria and project completion.

---

## State Ownership

| Information | Canonical Location |
| --- | --- |
| Task ID | Task board |
| Task goal | Task board |
| Task status | Task board |
| Task priority | Task board |
| Acceptance criteria | Task board |
| Task dependencies | Task board |
| Task blockers | Task board |
| Task validation | Task board |
| Task notes | Task board |
| Task-level next action | Task board |
| Project objective | Project file |
| Project scope | Project file |
| Project requirements | Project file |
| Project milestones | Project file |
| Project-level decisions | Project file |
| Portfolio overview | `BOARD.md` |

The general rule is:

> Store information at the lowest appropriate canonical level. Higher-level documents summarize rather than duplicate.

---

## Linking Convention

Every task board should link to:

```text
../BOARD.md
../projects/<project-slug>.md
```

Example:

```markdown
[Board](../BOARD.md) · [Project](../projects/authentication.md)
```

The associated project file should link back:

```markdown
[Board](../BOARD.md) · [Tasks](../tasks/authentication-tasks.md)
```

`BOARD.md` should link to both.

---

## Agent Workflow

Agents should work through the repository in this order:

```text
1. Read BOARD.md.
2. Identify the relevant project.
3. Read projects/<project-slug>.md.
4. Read tasks/<project-slug>-tasks.md.
5. Identify the active or next executable task.
6. Inspect relevant repository files.
7. Perform the work.
8. Validate the result.
9. Update the task board.
10. Update the project file if project-level state changed.
11. Update BOARD.md if portfolio state changed.
```

Detailed instructions are in [`INSTRUCTIONS.md`](./INSTRUCTIONS.md).

---

## Files

```text
tasks/
├── README.md
├── INSTRUCTIONS.md
├── _TEMPLATE.md
└── <project-slug>-tasks.md
```

### `README.md`

Human-readable explanation of the task system.

### `INSTRUCTIONS.md`

Operational rules for agents creating, moving, validating, and maintaining tasks.

### `_TEMPLATE.md`

Canonical structure for new task boards.

### `<project-slug>-tasks.md`

Persistent executable task state for one project.

---

## Design Principles

### Executable

Tasks should describe work that can actually be performed.

### Verifiable

Completion should be determined through acceptance criteria and validation.

### Persistent

Another agent should be able to resume from the task board without relying on conversational memory.

### Canonical

Task state should have one authoritative location.

### Git Native

Task changes remain readable, reviewable, diffable, and version-controlled.

### Human Readable

The board should remain useful when viewed directly on GitHub.

### Agent Forward

Structure should be predictable enough for agents to safely read, modify, and synchronize.

---

## Principle

The task directory answers:

> **What executable work moves this project forward, what state is each task in, and what should happen next?**

The project directory answers:

> **What are we building and what does successful completion require?**

The root board answers:

> **What matters across the repository right now?**