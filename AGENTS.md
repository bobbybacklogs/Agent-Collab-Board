# Repository Agent Instructions

![Scope](https://img.shields.io/badge/scope-repository-0969da)
![Role](https://img.shields.io/badge/role-agent%20entrypoint-238636)
![State](https://img.shields.io/badge/state-canonical-d29922)

> These instructions apply repository-wide.
>
> More specific `AGENTS.md` files under subdirectories add or override instructions within their scope.

This repository uses a Markdown-first operational state system for project planning, task execution, validation, and agent handoff.

The repository itself should contain enough current state for another human or agent to continue work without relying on previous conversation history.

---

## Start Here

Before performing project work:

1. Read [`BOARD.md`](./BOARD.md).
2. Identify the current or requested project.
3. Read its project file under [`projects/`](./projects/).
4. Read its matching task board under [`tasks/`](./tasks/).
5. Read the applicable scoped `AGENTS.md`.
6. Inspect the repository files relevant to the task.
7. Perform and validate the work.
8. Synchronize canonical state before finishing.

For the full repository operating policy, read:

[`docs/INSTRUCTIONS.md`](./docs/INSTRUCTIONS.md)

For user guidance, read:

[`docs/HOWTO.md`](./docs/HOWTO.md)

---

## State Model

Read downward:

```text
BOARD.md
   ↓
projects/<project-slug>.md
   ↓
tasks/<project-slug>-tasks.md
   ↓
repository work
```

Update upward:

```text
repository work
      ↓
task board
      ↓
project file if project state changed
      ↓
BOARD.md if portfolio state changed
```

Do not mechanically update every layer after every edit.

Update a layer only when state owned by that layer materially changed.

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
- current repository focus;
- cross-project blockers;
- cross-project dependencies;
- portfolio review state;
- portfolio summary.

### Project

Canonical:

```text
projects/<project-slug>.md
```

Owns:

- project objective;
- success criteria;
- scope;
- requirements;
- deliverables;
- milestones;
- project dependencies;
- constraints;
- risks;
- project-level decisions;
- current project state;
- project-level next action.

### Tasks

Canonical:

```text
tasks/<project-slug>-tasks.md
```

Owns:

- task IDs;
- task goals;
- workflow state;
- priorities;
- acceptance criteria;
- task dependencies;
- blockers;
- validation;
- implementation notes;
- task decisions;
- task-level next actions;
- task history.

### Implementation

Repository files are authoritative for what has actually been implemented, created, tested, or delivered.

If operational Markdown disagrees with repository reality, reconcile the state rather than preserving incorrect documentation.

---

## Scoped Instructions

When operating under `/projects`, also follow:

[`projects/AGENTS.md`](./projects/AGENTS.md)

Full project policy:

[`projects/INSTRUCTIONS.md`](./projects/INSTRUCTIONS.md)

When operating under `/tasks`, also follow:

[`tasks/AGENTS.md`](./tasks/AGENTS.md)

Full task policy:

[`tasks/INSTRUCTIONS.md`](./tasks/INSTRUCTIONS.md)

More-specific instructions take precedence within their scope when they intentionally refine a repository-wide rule.

---

## Selecting Work

When deciding what to execute:

1. inspect `BOARD.md`;
2. identify current portfolio focus;
3. read the relevant project;
4. inspect its task board;
5. continue an actionable `In Progress` task first;
6. otherwise select the highest-priority executable task from `Ready`;
7. respect dependencies and blockers;
8. prefer work aligned with documented project focus.

Do not select tasks only because they appear first in a file.

Prefer one primary active task unless parallel execution is intentional.

---

## Project Lifecycle

Supported project states:

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

Each project should appear in exactly one primary state section of `BOARD.md`.

Do not mark a project `Complete` merely because all currently listed tasks are done.

Project completion is governed by project-level success criteria.

---

## Task Workflow

Supported task flow:

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

## Completion Rules

### Task Completion

A task may enter `Done` only when:

- its goal is achieved;
- required acceptance criteria are satisfied;
- required validation has been performed;
- no unresolved blocker prevents completion.

Attempted work is not completed work.

### Project Completion

A project may enter `Complete` only when:

- project success criteria are satisfied;
- required deliverables exist;
- relevant milestones are complete;
- necessary review or validation has finished;
- no unresolved project blocker prevents completion.

Do not fabricate completion or validation.

---

## Blockers

Store blockers at the level they affect.

```text
Task blocker
→ tasks/<project-slug>-tasks.md

Project blocker
→ projects/<project-slug>.md

Cross-project blocker
→ BOARD.md
```

Promote blocker state upward only when it materially affects the higher-level view.

A blocker should state what is preventing progress and what is required to resume.

---

## Decisions

Task-level decisions:

```text
TDEC-001
TDEC-002
```

belong in the task board.

Project-level decisions:

```text
DEC-001
DEC-002
```

belong in the project file.

Preserve decision history.

If a new decision supersedes an old one, record that relationship instead of deleting the original decision.

---

## IDs

Preserve stable identifiers.

Do not reuse or casually renumber:

- project IDs;
- task IDs;
- decision IDs.

Task IDs should normally use a stable project prefix:

```text
AUTH-001
AUTH-002
AUTH-003
```

Gaps are acceptable.

Stable references are more important than contiguous numbering.

---

## Naming

Use stable lowercase project slugs.

Example:

```text
projects/authentication-refresh.md
tasks/authentication-refresh-tasks.md
```

Do not casually rename established project files.

If a rename is intentional, update all repository references coherently.

---

## Editing Rules

When updating operational state:

- make the smallest coherent change;
- preserve IDs;
- preserve meaningful history;
- preserve completed work;
- preserve established links;
- preserve acceptance criteria unless intentionally changed;
- preserve project success criteria unless intentionally changed;
- preserve scope unless intentionally changed;
- keep badges synchronized with textual state;
- keep tables structurally valid;
- use repository-relative links where practical;
- use `YYYY-MM-DD` for operational dates.

Do not perform unrelated stylistic rewrites during narrow state updates.

---

## Scope and Requirement Changes

Do not silently change project scope, requirements, or success criteria through task execution.

When a material project definition changes:

1. update the project file;
2. update affected task state;
3. record a project decision when appropriate;
4. update `BOARD.md` if portfolio state changes.

Do not expand project scope solely by creating additional tasks.

---

## Validation

Record only validation that actually occurred.

Examples include:

- tests;
- builds;
- type checks;
- lint checks;
- API verification;
- manual review;
- visual inspection;
- artifact verification;
- user approval.

If validation cannot be performed, record the limitation rather than assuming success.

---

## Durable Notes

Operational files are not conversational scratchpads.

Store information useful to future work:

- conclusions;
- constraints;
- evidence;
- implementation facts;
- decisions;
- blockers;
- next actions.

Avoid transient narration such as:

```text
Trying another idea.
Maybe this works.
Need to think about it.
```

Do not store private reasoning transcripts.

---

## State Synchronization

Always update the task board when relevant task state changes.

Update the project file when project-level state changes.

Update `BOARD.md` when portfolio-level state changes.

Examples:

```text
Implementation note changed
→ task board only
```

```text
Milestone completed
→ task board + project file
```

```text
Project becomes blocked
→ affected task state + project file + BOARD.md
```

```text
Task moves Ready → In Progress
→ task board
```

Do not propagate trivial state changes upward.

---

## Conflict Resolution

When operational files disagree, use canonical ownership.

```text
Task detail
→ task board wins

Project detail
→ project file wins

Portfolio summary
→ BOARD.md should reflect canonical project state
```

If Markdown disagrees with actual repository output:

1. inspect repository evidence;
2. determine actual implementation state;
3. correct the canonical operational file;
4. synchronize higher-level summaries if needed;
5. preserve meaningful history.

Do not invent missing facts.

---

## Missing Information

When required information cannot be established from repository evidence:

use explicit values such as:

```text
Unknown
None
Pending
Open Question
```

rather than fabricating:

- validation results;
- completion;
- approvals;
- requirements;
- dependencies;
- dates;
- decisions.

---

## New Projects

When creating a project:

1. read `projects/AGENTS.md`;
2. use `projects/_TEMPLATE.md`;
3. create `projects/<project-slug>.md`;
4. read `tasks/AGENTS.md`;
5. use `tasks/_TEMPLATE.md`;
6. create `tasks/<project-slug>-tasks.md`;
7. link the files bidirectionally;
8. add the project to `BOARD.md`;
9. establish initial project state;
10. create executable tasks when enough information exists.

Do not create a board-only project without its canonical project file.

---

## End-of-Session Handoff

Before ending meaningful work:

- ensure touched tasks reflect reality;
- update acceptance criteria;
- record validation;
- record blockers;
- update dependencies if changed;
- keep task next actions concrete;
- synchronize active-task context;
- update project state if necessary;
- record project decisions or risks when necessary;
- update `BOARD.md` if portfolio state changed;
- synchronize relevant badges, counts, and dates.

Leave one concrete continuation path.

Another agent should be able to resume without previous conversation context.

---

## Do

- read repository state before working;
- respect scoped `AGENTS.md` files;
- follow documented priorities;
- respect dependencies;
- keep blockers explicit;
- validate before completion;
- preserve durable decisions;
- synchronize state after meaningful work;
- keep next actions concrete;
- leave repository state resumable.

---

## Do Not

- rely on chat history as canonical state;
- fabricate validation;
- invent completion;
- reuse IDs;
- duplicate detailed state across layers;
- silently change scope;
- silently weaken acceptance criteria;
- silently weaken success criteria;
- delete meaningful history for visual cleanliness;
- expose secrets or credentials;
- propagate trivial changes through every layer.

---

## Security

Do not store secrets in operational Markdown.

Never place:

- passwords;
- API secrets;
- access tokens;
- private keys;
- sensitive credentials

inside:

```text
BOARD.md
projects/
tasks/
docs/
```

When credentials are required, refer to the dependency abstractly.

Example:

```text
Blocked until deployment credentials are available.
```

---

## Repository Map

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

## Documentation

Human overview:

[`README.md`](./README.md)

User guide:

[`docs/HOWTO.md`](./docs/HOWTO.md)

Full repository policy:

[`docs/INSTRUCTIONS.md`](./docs/INSTRUCTIONS.md)

Project agent instructions:

[`projects/AGENTS.md`](./projects/AGENTS.md)

Task agent instructions:

[`tasks/AGENTS.md`](./tasks/AGENTS.md)

---

## Final Rule

Before working:

> Read the canonical repository state.

Before finishing:

> Synchronize the canonical repository state.

The repository should remain understandable and resumable from files alone.
