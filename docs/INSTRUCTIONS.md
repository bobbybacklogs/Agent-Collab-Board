# Repository Instructions

![Scope](https://img.shields.io/badge/scope-repository-0969da)
![Role](https://img.shields.io/badge/role-operating%20policy-238636)
![State](https://img.shields.io/badge/state-canonical-d29922)

This document defines the full repository-wide operating policy for the agent-forward project board.

The concise canonical agent entrypoint is:

[`../AGENTS.md`](../AGENTS.md)

The live portfolio state is:

[`../BOARD.md`](../BOARD.md)

---

## Purpose

This repository uses Markdown as persistent operational state.

The system should allow another human or agent to understand and resume work without depending on prior conversation history.

The state hierarchy is:

```text
BOARD.md
   ↓
projects/<project-slug>.md
   ↓
tasks/<project-slug>-tasks.md
   ↓
repository work
```

After work:

```text
repository work
      ↓
task board
      ↓
project file if project state changed
      ↓
BOARD.md if portfolio state changed
```

---

## Instruction Hierarchy

Repository-wide agent instructions live in:

```text
AGENTS.md
```

Scoped agent instructions live in:

```text
projects/AGENTS.md
tasks/AGENTS.md
```

Detailed policy lives in:

```text
docs/INSTRUCTIONS.md
projects/INSTRUCTIONS.md
tasks/INSTRUCTIONS.md
```

The intended relationship is:

```text
AGENTS.md
→ concise rules agents need routinely

Scoped AGENTS.md
→ directory-specific rules

INSTRUCTIONS.md
→ deeper policy and edge cases
```

Do not duplicate the entire detailed policy into `AGENTS.md`.

---

## Core Principle

> Store information at the lowest appropriate canonical level.

Higher-level state summarizes lower-level state.

It should not become a competing source of truth.

Examples:

```text
Task acceptance criteria
→ task board

Project success criteria
→ project file

Current repository focus
→ BOARD.md
```

---

## Canonical Ownership

### Portfolio

Canonical:

```text
BOARD.md
```

Owns:

- project placement;
- portfolio priority;
- current focus;
- cross-project blockers;
- cross-project dependencies;
- portfolio review state;
- portfolio-level summaries.

### Projects

Canonical:

```text
projects/<project-slug>.md
```

Owns:

- project identity;
- objective;
- success criteria;
- scope;
- requirements;
- deliverables;
- milestones;
- project dependencies;
- constraints;
- risks;
- project-level decisions;
- open project questions;
- current project state;
- next project-level action.

### Tasks

Canonical:

```text
tasks/<project-slug>-tasks.md
```

Owns:

- task IDs;
- task goals;
- task workflow state;
- priorities;
- types;
- acceptance criteria;
- dependencies;
- blockers;
- validation;
- implementation notes;
- task decisions;
- next actions;
- task history;
- board counts.

### Repository Reality

Actual repository files are authoritative for what has really been implemented, created, tested, or delivered.

Operational Markdown must remain synchronized with repository reality.

---

## Required Agent Read Order

Before normal project execution:

```text
1. AGENTS.md
2. BOARD.md
3. relevant project file
4. projects/AGENTS.md
5. relevant task board
6. tasks/AGENTS.md
7. relevant repository files
```

For complex operations or ambiguity, also consult:

```text
projects/INSTRUCTIONS.md
tasks/INSTRUCTIONS.md
docs/INSTRUCTIONS.md
```

Agents that automatically load nested `AGENTS.md` files may receive scoped rules automatically, but repository links and explicit state should remain understandable without relying on that behavior.

---

## Repository Structure

```text
.
├── README.md
├── AGENTS.md
├── BOARD.md
├── CLAUDE.md
├── GEMINI.md
│
├── docs/
│   ├── README.md
│   ├── HOWTO.md
│   └── INSTRUCTIONS.md
│
├── projects/
│   ├── README.md
│   ├── AGENTS.md
│   ├── INSTRUCTIONS.md
│   ├── _TEMPLATE.md
│   └── <project-slug>.md
│
└── tasks/
    ├── README.md
    ├── AGENTS.md
    ├── INSTRUCTIONS.md
    ├── _TEMPLATE.md
    └── <project-slug>-tasks.md
```

---

## Project Naming

Use stable lowercase slugs.

Preferred:

```text
authentication-refresh
dashboard-redesign
api-migration
documentation-refresh
```

Files become:

```text
projects/authentication-refresh.md
tasks/authentication-refresh-tasks.md
```

Do not casually rename established slugs.

If a rename is intentional, update all repository references coherently.

---

## Stable IDs

Task IDs should use stable project prefixes:

```text
AUTH-001
AUTH-002
AUTH-003
```

Task IDs must not be reused.

Project decisions use:

```text
DEC-001
DEC-002
```

Task decisions use:

```text
TDEC-001
TDEC-002
```

Do not reuse or rewrite historical IDs.

---

## Project Lifecycle

Supported states:

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

Each project appears in exactly one primary state section of `BOARD.md`.

### Planning

Project definition is incomplete.

### Ready

Project definition is sufficient for executable work to begin.

### Active

Project execution is underway.

### Blocked

The project as a whole cannot make meaningful progress.

### Review

Primary execution is complete but project-level validation or acceptance remains.

### Complete

Project-level success criteria are satisfied.

### Paused

Work is intentionally suspended.

### Archived

The project is retained for history but no longer operationally active.

---

## Task Workflow

Supported task states:

```text
Backlog
Ready
In Progress
Blocked
Review
Done
```

Normal flow:

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

`Blocked` is a temporary interruption state.

Each task exists in exactly one workflow section.

---

## Selecting Work

Agents should normally:

1. inspect `BOARD.md`;
2. identify current portfolio focus;
3. inspect the relevant project;
4. inspect its task board;
5. continue actionable `In Progress` work first;
6. otherwise select the highest-priority executable `Ready` task;
7. respect blockers and dependencies;
8. prefer work aligned with current project focus.

Do not select work solely because it appears first in a file.

Prefer one primary active task unless parallel execution is intentional.

---

## Creating Projects

When creating a project:

1. read `projects/AGENTS.md`;
2. inspect `projects/_TEMPLATE.md`;
3. create `projects/<project-slug>.md`;
4. choose a stable task prefix;
5. read `tasks/AGENTS.md`;
6. inspect `tasks/_TEMPLATE.md`;
7. create `tasks/<project-slug>-tasks.md`;
8. link project and task files bidirectionally;
9. add the project to `BOARD.md`;
10. define initial project status and priority;
11. create executable tasks when enough information exists.

Do not create a project only in `BOARD.md`.

Do not create a task board without an identifiable project.

---

## Creating Tasks

A normal task should define:

- stable ID;
- outcome-focused title;
- goal;
- status;
- priority;
- type;
- acceptance criteria;
- dependencies;
- blockers;
- relevant resources;
- implementation notes;
- validation;
- next action.

Place new work in:

```text
Backlog
```

or:

```text
Ready
```

depending on whether it is executable.

---

## Acceptance Criteria

Acceptance criteria must describe observable outcomes.

Good:

```markdown
- [ ] Invalid credentials return `401`.
- [ ] Valid login creates a session.
- [ ] Authentication tests pass.
```

Poor:

```markdown
- [ ] Work on authentication.
- [ ] Try logging in.
- [ ] Check tests.
```

Do not weaken acceptance criteria merely to close a task.

---

## Validation

Validation must reflect checks actually performed.

Examples:

- automated tests;
- integration tests;
- builds;
- type checks;
- lint checks;
- API verification;
- visual inspection;
- manual review;
- artifact verification;
- user approval.

Never fabricate validation.

If validation cannot be completed, record that limitation.

---

## Task Completion

A task may enter `Done` only when:

- its stated goal is achieved;
- required acceptance criteria are satisfied;
- required validation has been performed;
- no unresolved blocker prevents completion.

When completing a task:

1. update acceptance criteria;
2. update validation;
3. move the task to `Done`;
4. set completion metadata;
5. update counts;
6. update completion percentage;
7. update badges;
8. update active-task context;
9. preserve relevant activity history.

Attempted work is not completed work.

---

## Project Completion

A project may enter `Complete` only when:

- project success criteria are satisfied;
- required deliverables exist;
- relevant milestones are complete;
- necessary validation or approval has finished;
- no unresolved project blocker prevents completion.

Do not infer project completion solely from task counts.

---

## Blockers

Store blockers at the level they affect.

```text
Task
→ task board

Project
→ project file

Cross-project
→ BOARD.md
```

Promote blocker state upward only when it materially affects the higher-level view.

A useful blocker states:

```text
What prevents progress?
What is required to resume?
```

---

## Dependencies

Task dependencies belong in the task board.

Project dependencies belong in the project file.

Cross-project dependencies may be summarized in `BOARD.md`.

Do not duplicate ordinary internal sequencing into the portfolio layer.

---

## Scope Changes

Do not silently change project scope through task creation or implementation.

When scope materially changes:

1. update the project file;
2. update affected requirements or deliverables;
3. record a project decision when appropriate;
4. update affected tasks;
5. update `BOARD.md` if portfolio state changes.

---

## Requirement Changes

When a project requirement changes:

1. update the canonical project file;
2. identify affected tasks;
3. update acceptance criteria where necessary;
4. preserve meaningful decision history;
5. update portfolio state only if materially affected.

---

## Decisions

Record durable decisions when future work should know the chosen direction and why.

Task-level choices belong in task decisions.

Project-wide choices belong in project decisions.

Portfolio-level decisions belong in `BOARD.md` only when they materially affect multiple projects.

Preserve superseded decisions.

---

## Progress

Task-board completion may normally use:

```text
Done / Total
```

Project progress may use task progress as an input but should also consider:

- milestones;
- deliverables;
- project validation;
- success criteria;
- unresolved project work.

Avoid false precision.

---

## Activity Logs

Task activity records meaningful task transitions.

Project activity records meaningful project-level changes.

Board activity records meaningful portfolio-level changes.

Do not log every command, formatting edit, or trivial file change.

Git already provides detailed revision history.

---

## Editing Safety

When modifying operational state:

- make the smallest coherent update;
- preserve stable IDs;
- preserve meaningful history;
- preserve completed work;
- preserve links;
- preserve acceptance criteria unless intentionally changed;
- preserve project success criteria unless intentionally changed;
- preserve project scope unless intentionally changed;
- keep badges synchronized;
- keep tables valid;
- use `YYYY-MM-DD` dates.

Avoid rewriting unrelated state for style.

---

## Template Integrity

Templates are canonical starting structures.

When creating a live file:

```text
copy template
→ create project/task file
→ edit the copy
```

Do not turn `_TEMPLATE.md` itself into live project state.

---

## Synchronization

State flows upward only as necessary.

```text
repository work
      ↓
task board
      ↓
project file if needed
      ↓
BOARD.md if needed
```

Examples:

```text
Task implementation note changed
→ task board only
```

```text
Milestone completed
→ task board + project file
```

```text
Project becomes blocked
→ relevant task state + project file + BOARD.md
```

Do not propagate trivial changes through every layer.

---

## Conflict Resolution

When state disagrees:

```text
Task detail
→ task board is canonical

Project detail
→ project file is canonical

Portfolio summary
→ BOARD.md should reflect project state
```

If Markdown conflicts with actual repository evidence:

1. inspect the implementation;
2. determine actual state;
3. correct the appropriate canonical state file;
4. synchronize summaries upward;
5. preserve meaningful history.

Do not invent missing information.

---

## Missing Information

When facts cannot be established, prefer:

```text
Unknown
None
Pending
Open Question
```

over fabrication.

Never invent:

- validation;
- completion;
- approvals;
- requirements;
- dependencies;
- dates;
- decisions.

---

## Durable Notes

Operational Markdown should preserve useful conclusions rather than transient reasoning.

Store:

- constraints;
- implementation facts;
- evidence;
- decisions;
- blockers;
- next actions.

Avoid conversational scratchpad narration.

Do not store private chain-of-thought.

---

## Security

Do not place secrets in operational Markdown.

Never store:

- passwords;
- access tokens;
- API secrets;
- private keys;
- credentials.

Refer to the dependency abstractly.

Example:

```text
Blocked until deployment credentials are available.
```

---

## Tool-Specific Context

The repository may include lightweight adapters such as:

```text
CLAUDE.md
GEMINI.md
```

These should direct the tool toward the canonical repository system rather than maintain separate state or policy.

`AGENTS.md` remains the canonical general agent entrypoint.

---

## End-of-Session Protocol

Before ending meaningful work, ensure:

### Tasks

- touched tasks are in the correct workflow state;
- acceptance criteria are current;
- validation is current;
- blockers and dependencies are current;
- next actions are concrete;
- active-task context is current;
- counts and badges are synchronized.

### Projects

- project status matches reality;
- current focus is accurate;
- milestones and deliverables are current;
- project decisions and risks are recorded when needed;
- next project-level action is clear.

### Portfolio

- affected project cards are in the correct board section;
- portfolio focus is accurate;
- project counts are current;
- blockers and cross-project dependencies are current;
- board badges and dates are synchronized.

Leave the repository resumable from files alone.

---

## Human Overrides

Human maintainers may intentionally change:

- priority;
- scope;
- requirements;
- success criteria;
- workflow state;
- project focus;
- task selection;
- project lifecycle.

When this happens:

1. treat the intentional change as authoritative;
2. update the canonical state file;
3. synchronize dependent state;
4. preserve useful history.

---

## Final Rule

When uncertain where information belongs, ask:

> What is the lowest layer that canonically owns this state?

Store it there.

Summarize upward only when the change materially affects the higher-level view.