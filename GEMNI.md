# Gemini Repository Context

![Agent](https://img.shields.io/badge/agent-Gemini-0969da)
![Canonical](https://img.shields.io/badge/canonical-AGENT.md-238636)

This repository uses persistent Markdown files for project planning, task execution, and agent handoff.

Import the canonical repository guidance:

@./AGENT.md

@./INSTRUCTIONS.md

Import the current portfolio state:

@./BOARD.md

---

## Operating Sequence

Before performing work:

```text
BOARD.md
   ↓
projects/<project-slug>.md
   ↓
tasks/<project-slug>-tasks.md
   ↓
repository files
````

After meaningful work:

```text
repository files
      ↓
task board
      ↓
project file if needed
      ↓
BOARD.md if needed
```

---

## Required Behavior

* Read canonical state before execution.
* Continue actionable `In Progress` work before selecting new work.
* Otherwise select an appropriate executable `Ready` task.
* Respect dependencies and blockers.
* Treat acceptance criteria as the task completion contract.
* Perform required validation before marking work complete.
* Preserve IDs and meaningful history.
* Keep badges, textual state, counts, and dates synchronized.
* Do not propagate trivial changes through every state layer.
* Do not use this file as a duplicate project or task tracker.

---

## Additional Agent Guides

Project operations:

@./projects/AGENT.md

Task operations:

@./tasks/AGENT.md

Read their full `INSTRUCTIONS.md` files when deeper policy is required.

---

## Canonical Ownership

```text
Portfolio state
→ BOARD.md

Project state
→ projects/<project-slug>.md

Task state
→ tasks/<project-slug>-tasks.md

Repository behavior
→ AGENT.md + INSTRUCTIONS.md
```

---

## Handoff

Before finishing meaningful work:

1. synchronize touched tasks;
2. record acceptance and validation state;
3. record blockers and dependencies;
4. leave a concrete next action;
5. update project state if materially changed;
6. update `BOARD.md` if portfolio state materially changed.

Repository state must remain sufficient for another agent to continue without previous conversation context.