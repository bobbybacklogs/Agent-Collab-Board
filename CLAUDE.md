# Claude Code Repository Context

![Agent](https://img.shields.io/badge/agent-Claude%20Code-0969da)
![Canonical](https://img.shields.io/badge/canonical-AGENT.md-238636)

The repository uses a Markdown-based operational project-management system.

The canonical agent guide is:

@AGENT.md

The complete repository operating policy is:

@INSTRUCTIONS.md

The current portfolio state is:

@BOARD.md

---

## Operating Rule

Before performing project work:

1. Read the imported repository instructions.
2. Identify the current or requested project from `BOARD.md`.
3. Read `projects/<project-slug>.md`.
4. Read `projects/AGENT.md`.
5. Read `tasks/<project-slug>-tasks.md`.
6. Read `tasks/AGENT.md`.
7. Inspect relevant repository files.
8. Perform and validate the work.
9. Update canonical task state.
10. Update project state only if project-level state changed.
11. Update `BOARD.md` only if portfolio state changed.

---

## Canonical Ownership

```text
Portfolio → BOARD.md
Project   → projects/<project-slug>.md
Tasks     → tasks/<project-slug>-tasks.md
````

Do not maintain separate project state in this file.

Do not rely on conversation memory when canonical repository state exists.

---

## Completion

A task is complete only when its acceptance criteria and required validation are satisfied.

A project is complete only when its project-level success criteria are satisfied.

Attempted work is not completed work.

---

## Handoff

Before ending meaningful work:

* synchronize touched task state;
* record validation;
* record blockers;
* update relevant decisions;
* leave a concrete next action;
* update project state if necessary;
* update portfolio state if necessary.

Another agent should be able to resume from repository files alone.
