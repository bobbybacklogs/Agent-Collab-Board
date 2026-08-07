# How to Use the Agent Project Board

![Guide](https://img.shields.io/badge/guide-HOWTO-0969da)
![Workflow](https://img.shields.io/badge/workflow-agent%20forward-238636)
![Platform](https://img.shields.io/badge/platform-agent%20agnostic-d29922)

This guide explains how to use the repository with AI coding agents.

The system is designed to work with modern agent environments while remaining tool-independent.

The canonical agent entrypoint is:

[`../AGENTS.md`](../AGENTS.md)

The live repository portfolio state is:

[`../BOARD.md`](../BOARD.md)

---

## The Basic Idea

Agents should work from repository state rather than conversational memory.

The normal path is:

```text
AGENTS.md
   ↓
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
project file if needed
      ↓
BOARD.md if needed
```

At the beginning:

> Read the repository state.

At the end:

> Synchronize the repository state.

---

## Quick Start

A good first prompt is:

```text
Read AGENTS.md and BOARD.md first.

Identify the current project focus.

Read the relevant project file and matching task board.

Tell me:
1. the current project state;
2. the active task;
3. any blockers;
4. the next recommended action.

Do not make changes yet.
```

Once the agent has correctly understood the state:

```text
Proceed with the current highest-priority executable task.

Follow the repository and scoped AGENTS.md instructions.

Perform the work, validate it, and synchronize canonical state afterward.

Update the project file and BOARD.md only if their owned state materially changes.
```

---

## Starting a New Session

You should not need to reconstruct previous conversations.

Use:

```text
Resume from repository state.

Read AGENTS.md and BOARD.md first, then the current project's project and task files.

Continue from the documented state.

Before making changes, briefly tell me the current focus and next task.
```

For a known project:

```text
Resume the authentication-refresh project.

Read:
- AGENTS.md
- BOARD.md
- projects/authentication-refresh.md
- projects/AGENTS.md
- tasks/authentication-refresh-tasks.md
- tasks/AGENTS.md

Continue from canonical repository state.
```

For a known task:

```text
Continue AUTH-014.

Read the applicable repository, project, and task state first.

Verify that AUTH-014 is still actionable.

Perform the task, validate it, and synchronize state afterward.
```

---

## Creating a New Project With an Agent

Example:

```text
Create a new project called "Authentication Refresh".

Use the repository project-management system.

Read:
- AGENTS.md
- docs/INSTRUCTIONS.md
- projects/AGENTS.md
- projects/INSTRUCTIONS.md
- projects/_TEMPLATE.md
- tasks/AGENTS.md
- tasks/INSTRUCTIONS.md
- tasks/_TEMPLATE.md

Create:
- projects/authentication-refresh.md
- tasks/authentication-refresh-tasks.md

Use AUTH as the task prefix.

Create an initial task breakdown and add the project to BOARD.md.

Do not invent missing requirements. Record unresolved information as open questions.
```

Then provide the project requirements.

The agent should create and connect:

```text
BOARD.md
projects/authentication-refresh.md
tasks/authentication-refresh-tasks.md
```

---

## Planning Without Executing

Use:

```text
Read the current project and task state.

Review:
- objective;
- scope;
- requirements;
- success criteria;
- milestones;
- dependencies;
- existing tasks.

Improve the task breakdown where necessary.

You may:
- add missing tasks;
- clarify goals;
- improve acceptance criteria;
- identify dependencies;
- identify blockers.

Do not perform implementation work yet.

Preserve existing IDs and history.
```

---

## Asking What to Work on Next

Simple:

```text
Read the board and tell me what we should work on next.
```

More disciplined:

```text
Read AGENTS.md, BOARD.md, the current project file, and its task board.

Recommend the next executable task using:
- portfolio focus;
- project priority;
- task priority;
- dependencies;
- blockers;
- existing In Progress work.

Do not make changes yet.
```

---

## Letting the Agent Select Work

```text
Read repository state and select the next task according to the documented workflow.

Continue actionable In Progress work first.

Otherwise select the highest-priority executable Ready task.

Respect dependencies and blockers.

Perform the work, validate it, and synchronize repository state afterward.
```

---

## Assigning a Specific Task

```text
Work on AUTH-014.

Read the complete project and task context first.

If AUTH-014 is blocked or its dependencies are incomplete, do not bypass them.

Otherwise execute the task, validate its acceptance criteria, and update canonical state.
```

---

## Adding a Task

```text
Add a task to the authentication-refresh project:

"Add configurable session timeout."

Determine the next available AUTH task ID.

Define:
- goal;
- acceptance criteria;
- dependencies;
- validation;
- next action.

Place it in Backlog or Ready based on whether it is currently executable.

Do not implement it yet.
```

---

## Blocking Work

```text
AUTH-014 is blocked because staging OAuth credentials are unavailable.

Update the task state.

Record exactly what is required to unblock it.

Update project or BOARD state only if this blocker materially affects those layers.
```

---

## Unblocking Work

```text
The staging OAuth credentials are now available.

Resolve the blocker for AUTH-014.

Return it to Ready or In Progress depending on whether work is actually resuming.

Then continue the task.
```

---

## Auditing State

Use periodically:

```text
Audit the repository project-management state.

Read:
- AGENTS.md;
- BOARD.md;
- all active project files;
- associated task boards.

Check for:
- stale status;
- inconsistent badges;
- incorrect counts;
- stale blockers;
- duplicated tasks;
- broken links;
- project/board disagreement;
- Done tasks without satisfied criteria;
- missing next actions.

Report findings only.

Do not modify files.
```

---

## Repairing State

```text
Reconcile repository project-management state.

Treat:
- task boards as canonical for task detail;
- project files as canonical for project detail;
- repository output as evidence of actual implementation state.

Correct stale summaries.

Preserve IDs and meaningful history.

Do not fabricate validation or completion.
```

---

## Ending a Work Session

```text
Finish this work session.

Do not start a new unrelated task.

Synchronize all state related to the work performed.

Ensure:
- task status matches reality;
- acceptance criteria are current;
- validation is recorded;
- blockers are recorded;
- Active Task Detail is current;
- next action is concrete;
- counts and badges are synchronized;
- project state is updated if needed;
- BOARD.md is updated if needed.

Leave the repository ready for another agent.
```

---

# Working With Modern Agents

The board itself is tool-independent.

`AGENTS.md` is the canonical general-purpose agent instruction file.

Additional files may exist for agent ecosystems with their own automatic project-context conventions.

The important principle is:

```text
Agent-specific adapter
        ↓
AGENTS.md
        ↓
Scoped AGENTS.md
        ↓
Canonical project/task state
```

Do not maintain separate project-management systems for each agent.

---

## OpenAI Codex

Codex can work naturally with the repository's `AGENTS.md` hierarchy.

A starting prompt can be as small as:

```text
Read the repository state and resume the current task.
```

Or more explicitly:

```text
Read AGENTS.md and BOARD.md.

Follow any scoped AGENTS.md files applicable to the project and task directories.

Continue the active executable task, validate the work, and synchronize canonical state.
```

For a specific task:

```text
Work on AUTH-014.

Read the applicable AGENTS.md instructions and canonical project/task state first.

Validate the task before marking it Done.
```

The root and scoped instruction structure is:

```text
AGENTS.md
projects/AGENTS.md
tasks/AGENTS.md
```

---

## Cursor

Use:

```text
Read AGENTS.md and BOARD.md before making changes.

Follow the project and task state from the repository.

Perform the requested work and synchronize canonical state afterward.
```

For continuation:

```text
Resume the current board task from repository state.

Do not rely on prior chat context when repository state differs.
```

If Cursor-specific rules are later added under `.cursor/rules`, keep them focused on codebase or tool behavior and point them toward the canonical project-board system instead of reproducing it.

---

## Claude Code

The repository may include:

```text
CLAUDE.md
```

as a lightweight Claude-specific entrypoint.

Its job should be to direct Claude toward:

```text
AGENTS.md
BOARD.md
projects/
tasks/
```

A normal prompt remains:

```text
Read the repository instructions and board state.

Resume the current task, validate it, and synchronize repository state before finishing.
```

Do not maintain independent project state in `CLAUDE.md`.

---

## Gemini

The repository may include:

```text
GEMINI.md
```

as a lightweight Gemini-specific context adapter.

It should direct Gemini toward:

```text
AGENTS.md
BOARD.md
projects/
tasks/
```

A normal prompt:

```text
Read the canonical repository instructions and current board state.

Continue the relevant task and synchronize state after validation.
```

Do not maintain separate task state in `GEMINI.md`.

---

## GitHub Copilot

When using Copilot interactively:

```text
Read AGENTS.md and BOARD.md before making repository changes.

Follow the relevant project and task files.

Treat acceptance criteria as the task completion contract.

Synchronize canonical state after meaningful work.
```

If `.github/copilot-instructions.md` is used later, reserve it primarily for Copilot-specific repository conventions such as:

- build commands;
- test commands;
- coding conventions;
- PR requirements;
- environment details.

It should reference the canonical board system rather than duplicate it.

---

## Other Coding Agents

For agents without automatic instruction discovery:

```text
This repository contains its own persistent project-management state.

Before making changes:

1. Read AGENTS.md.
2. Read BOARD.md.
3. Read the relevant project file.
4. Read the matching task board.
5. Inspect relevant repository files.

Perform the requested work.

Validate it.

Synchronize canonical state before finishing.
```

---

# Multiple Agents

Parallel work is possible, but avoid simultaneous edits to the same task state.

Safer patterns:

```text
Agent A → Project A
Agent B → Project B
```

or:

```text
Agent A → AUTH-014
Agent B → AUTH-018
```

when those tasks are genuinely independent.

Before parallelizing, inspect:

- dependencies;
- shared files;
- migrations;
- configuration;
- overlapping acceptance criteria;
- architectural decisions.

---

## Parallel Agent Prompt

```text
You are responsible for AUTH-018 only.

Read repository, project, and task state first.

Do not modify unrelated tasks except where synchronization is required.

If this task conflicts with another active task or touches the same critical state, report the conflict instead of silently overwriting work.

After completing the task, update its canonical state and propagate higher only where necessary.
```

---

# Common Workflows

## Feature Request

```text
We need CSV export in the dashboard.

Integrate this request into the project-management system first.

Determine whether it changes scope or requirements.

Update the project file if needed.

Create executable tasks with acceptance criteria.

Update BOARD.md only if portfolio state changes.

Do not implement the feature yet.
```

Then:

```text
Proceed with the highest-priority Ready task for CSV export.
```

---

## Bug Report

```text
Users are occasionally redirected to login immediately after authenticating.

Add this bug to the Authentication project.

Investigate enough to define a useful task and acceptance criteria.

If actionable, place it in Ready.

Do not claim a root cause without evidence.
```

---

## Research

```text
Create a research task to evaluate migration from SQLite to PostgreSQL.

The task should produce:
- requirements;
- tradeoffs;
- migration implications;
- recommendation.

Do not change the project database decision until the research task is complete.
```

---

## User Decision Required

Tell the agent:

```text
If project work requires a product, scope, or design decision from me, do not invent the answer.

Record the unresolved question or blocker and state exactly what decision is required.
```

After deciding:

```text
Use this decision to update canonical project state.

Record a project decision if it affects future work.

Then unblock affected tasks.
```

---

## Agent Discovers Additional Work

```text
If you discover work outside the current task's acceptance criteria:

- do not silently expand the task;
- create a new task if the work is genuinely separate;
- record dependencies;
- preserve the current task scope.

If the discovery changes project scope or requirements, update the project file.
```

---

## Stop After Planning

```text
Review the project and prepare the next three executable tasks.

Do not implement anything.

Update task definitions, priorities, dependencies, and acceptance criteria only.

Finish by identifying which task should begin first and why.
```

---

## Autonomous Single-Task Session

```text
Operate from repository state.

Read applicable AGENTS.md instructions.

Continue the current actionable task or select the highest-priority Ready task.

Perform the work.

Run appropriate validation.

Update canonical task state.

Update project state only if materially changed.

Update BOARD.md only if portfolio state materially changed.

Do not start a second unrelated task.

Finish with a concise handoff.
```

---

## Work Until Blocked

```text
Continue the current task until either:

- its acceptance criteria are satisfied; or
- meaningful progress becomes blocked.

If completed:
- validate;
- update workflow state;
- synchronize canonical state.

If blocked:
- stop;
- document the blocker;
- state exactly what is required to continue.

Do not bypass unresolved blockers.
```

---

# User Overrides

Humans remain authoritative for intentional changes.

You can say:

```text
Pause this project.
```

```text
Make Project B the current priority.
```

```text
Do not start AUTH-015.
```

```text
Move this requirement out of scope.
```

```text
Reopen AUTH-008.
```

```text
Archive the project.
```

The agent should update canonical state and preserve meaningful history.

---

# Troubleshooting

## Agent Starts Coding Without Reading State

```text
Stop.

Read AGENTS.md, BOARD.md, the relevant project file, and task board before continuing.

Reconcile your intended work against canonical repository state.
```

---

## Agent Marks Work Done Too Early

```text
Re-evaluate the task against its acceptance criteria and validation requirements.

Implementation attempt is not completion.

Move the task to the correct workflow state.
```

---

## Agent Updates Every File After Every Change

```text
Follow canonical ownership.

Task changes belong in the task board.

Project changes belong in the project file.

Portfolio changes belong in BOARD.md.

Do not propagate trivial changes upward.
```

---

## Agent Creates Duplicate Tasks

```text
Inspect the complete task board before creating new work.

Preserve existing IDs.

Do not create a duplicate when an existing task already represents the same execution contract.
```

---

## Agent Relies on Old Chat Context

```text
Treat repository state as canonical.

If conversation history conflicts with repository files, inspect repository reality and reconcile the state.
```

---

## Agent Rewrites Too Much

```text
Make the smallest coherent state update required.

Do not rewrite unrelated tasks, projects, or board sections for style.
```

---

# Useful Short Prompts

### Inspect

```text
Read the repository board state and summarize current work. Do not change anything.
```

### Resume

```text
Resume from repository state and continue the active task.
```

### Execute

```text
Perform TASK-ID according to its acceptance criteria, validate it, and update canonical state afterward.
```

### Plan

```text
Review the project and improve the task plan without implementing work.
```

### Audit

```text
Audit BOARD.md, active project files, and task boards for inconsistent state. Report only.
```

### Repair

```text
Reconcile stale board state against canonical project/task files and repository reality.
```

### Handoff

```text
Synchronize state and leave one concrete next action for the next agent.
```

---

# Recommended Habit

At the beginning:

```text
Read the board.
```

During work:

```text
Work from the task contract.
```

At the end:

```text
Synchronize state.
```

You should not normally need to restate weeks of project history in a new chat.

Instead:

```text
Read the repository and resume.
```

That is the purpose of the system.

---

## Mental Model

```text
You
 │
 │ goals, priorities, requirements, decisions
 ↓
BOARD.md
 │
 ↓
Project
 │
 ↓
Tasks
 │
 ↓
Agent Execution
 │
 ↓
Repository Work
 │
 ↓
Task State
 │
 ↓
Project State
 │
 ↓
BOARD.md
 │
 ↓
You
```

The board is the durable handoff layer between humans, agents, tools, and sessions.

---

## Final Rule

When an agent begins:

> **Read the canonical repository state before working.**

When an agent finishes:

> **Synchronize the canonical repository state before stopping.**

If those two rules are followed, work can move between agents and sessions without rebuilding context from conversation history.