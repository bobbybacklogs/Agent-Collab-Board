# `<PROJECT_NAME>`

![Status](https://img.shields.io/badge/status-planning-6e7781)
![Priority](https://img.shields.io/badge/priority-medium-d29922)
![Progress](https://img.shields.io/badge/progress-0%25-0969da)
![Updated](https://img.shields.io/badge/updated-YYYY--MM--DD-6e7781)

[Board](../BOARD.md) · [Tasks](../tasks/<PROJECT_SLUG>-tasks.md)

> `<ONE_SENTENCE_PROJECT_SUMMARY>`

---

## Project Overview

| Field | Value |
| --- | --- |
| **Project ID** | `<PROJECT_ID>` |
| **Project Name** | `<PROJECT_NAME>` |
| **Status** | `Planning` |
| **Priority** | `Medium` |
| **Owner** | `<OWNER_OR_AGENT>` |
| **Started** | `YYYY-MM-DD` |
| **Target** | `YYYY-MM-DD` |
| **Last Updated** | `YYYY-MM-DD` |
| **Task Board** | [`../tasks/<PROJECT_SLUG>-tasks.md`](../tasks/<PROJECT_SLUG>-tasks.md) |

---

## Objective

`<CLEAR_DESCRIPTION_OF_WHAT_THIS_PROJECT_IS_INTENDED_TO_ACCOMPLISH>`

---

## Success Criteria

The project is considered complete when:

- [ ] `<SUCCESS_CRITERION_1>`
- [ ] `<SUCCESS_CRITERION_2>`
- [ ] `<SUCCESS_CRITERION_3>`

---

## Current State

![State](https://img.shields.io/badge/current-planning-6e7781)

**Summary**

`<CURRENT_PROJECT_STATE_IN_1_TO_3_SENTENCES>`

**Current Focus**

`<CURRENT_PROJECT_FOCUS_OR_NONE>`

**Next Milestone**

`<NEXT_MEANINGFUL_PROJECT_MILESTONE>`

**Next Action**

`<SINGLE_CONCRETE_NEXT_PROJECT_LEVEL_ACTION>`

---

## Scope

### In Scope

- `<IN_SCOPE_ITEM>`
- `<IN_SCOPE_ITEM>`
- `<IN_SCOPE_ITEM>`

### Out of Scope

- `<OUT_OF_SCOPE_ITEM>`
- `<OUT_OF_SCOPE_ITEM>`

---

## Requirements

### Functional

- `<FUNCTIONAL_REQUIREMENT>`
- `<FUNCTIONAL_REQUIREMENT>`

### Non-Functional

- `<NON_FUNCTIONAL_REQUIREMENT>`
- `<NON_FUNCTIONAL_REQUIREMENT>`

---

## Deliverables

| Deliverable | Status | Reference |
| --- | --- | --- |
| `<DELIVERABLE>` | `Not Started` | `<PATH_OR_LINK>` |
| `<DELIVERABLE>` | `Not Started` | `<PATH_OR_LINK>` |

---

## Milestones

| ID | Milestone | Status | Target |
| --- | --- | --- | --- |
| `M1` | `<MILESTONE>` | `Not Started` | `YYYY-MM-DD` |
| `M2` | `<MILESTONE>` | `Not Started` | `YYYY-MM-DD` |
| `M3` | `<MILESTONE>` | `Not Started` | `YYYY-MM-DD` |

---

## Dependencies

### Internal

- `<PROJECT_TASK_FILE_OR_COMPONENT>`
- `<DEPENDENCY_OR_NONE>`

### External

- `<SERVICE_LIBRARY_APPROVAL_OR_NONE>`

---

## Constraints

- `<TECHNICAL_CONSTRAINT>`
- `<BUSINESS_OR_PROJECT_CONSTRAINT>`
- `<TIME_BUDGET_PLATFORM_OR_COMPATIBILITY_CONSTRAINT>`

---

## Risks

| ID | Risk | Impact | Mitigation | Status |
| --- | --- | --- | --- | --- |
| `RISK-001` | `<RISK>` | `Low / Medium / High` | `<MITIGATION>` | `Open` |

---

## Decisions

> Record durable project-level decisions here. Task-specific decisions should remain in the task board unless they affect the broader project.

| ID | Date | Decision | Reason | Affects |
| --- | --- | --- | --- | --- |
| `DEC-001` | `YYYY-MM-DD` | `<DECISION>` | `<RATIONALE>` | `<PROJECT_AREA>` |

---

## Open Questions

- [ ] `<OPEN_QUESTION>`
- [ ] `<OPEN_QUESTION>`

---

## References

### Repository

- `<PATH_TO_RELEVANT_FILE_OR_DIRECTORY>`

### Documentation

- `<DOCUMENTATION_LINK_OR_PATH>`

### External

- `<EXTERNAL_REFERENCE_OR_NONE>`

---

## Project Notes

> Keep only durable project context here. Detailed execution notes belong in the task board.

- `<IMPORTANT_PROJECT_CONTEXT>`
- `<IMPORTANT_PROJECT_CONTEXT>`

---

## Activity

> Record meaningful project-level state changes only.

| Date | Change |
| --- | --- |
| `YYYY-MM-DD` | Project created. |

---

## Agent Protocol

This file is the canonical source for **project-level state**.

The associated task board is the canonical source for **task-level state**:

[`../tasks/<PROJECT_SLUG>-tasks.md`](../tasks/<PROJECT_SLUG>-tasks.md)

When working on this project:

1. Read this file before beginning project work.
2. Read the associated task board before selecting or modifying tasks.
3. Preserve the project's objective, requirements, scope, decisions, and history unless explicitly changed.
4. Keep detailed task execution state in the task board rather than duplicating it here.
5. Update this file when project-level state materially changes.
6. Update `Current State` when the active phase, focus, milestone, or next action changes.
7. Record durable project decisions in `Decisions`.
8. Record newly identified project-level risks in `Risks`.
9. Update milestone and deliverable status when corresponding work changes.
10. Update `Last Updated` and the updated badge after meaningful changes.
11. Keep the project status and progress synchronized with the task board.
12. Update `BOARD.md` when changes here affect the overall portfolio view.

### State Ownership

| Information | Canonical Location |
| --- | --- |
| Project objective | This file |
| Project scope | This file |
| Project requirements | This file |
| Project milestones | This file |
| Project deliverables | This file |
| Project risks | This file |
| Project decisions | This file |
| Individual tasks | Task board |
| Task status | Task board |
| Task acceptance criteria | Task board |
| Task blockers | Task board |
| Task working notes | Task board |
| Portfolio summary | `BOARD.md` |

### Update Direction

```text
BOARD.md
   ↓
Project file
   ↓
Task board
   ↓
Repository work
```

After meaningful work:

```text
Repository work
      ↓
Task board updated
      ↓
Project file updated if project state changed
      ↓
BOARD.md updated if portfolio state changed
```

---

## Status Reference

### Project Status

```markdown
![Status](https://img.shields.io/badge/status-planning-6e7781)
![Status](https://img.shields.io/badge/status-ready-1f6feb)
![Status](https://img.shields.io/badge/status-active-238636)
![Status](https://img.shields.io/badge/status-blocked-da3633)
![Status](https://img.shields.io/badge/status-review-8250df)
![Status](https://img.shields.io/badge/status-complete-238636)
![Status](https://img.shields.io/badge/status-paused-d29922)
![Status](https://img.shields.io/badge/status-archived-6e7781)
```

### Priority

```markdown
![Priority](https://img.shields.io/badge/priority-low-6e7781)
![Priority](https://img.shields.io/badge/priority-medium-d29922)
![Priority](https://img.shields.io/badge/priority-high-f85149)
![Priority](https://img.shields.io/badge/priority-critical-da3633)
```

### Current State

```markdown
![State](https://img.shields.io/badge/current-planning-6e7781)
![State](https://img.shields.io/badge/current-execution-d29922)
![State](https://img.shields.io/badge/current-blocked-da3633)
![State](https://img.shields.io/badge/current-validation-8250df)
![State](https://img.shields.io/badge/current-complete-238636)
```

---

<!--
AGENT PROJECT STATE

ROLE
This document owns durable project-level state.
Do not use it as the detailed task backlog.

PRESERVE
- Project ID
- objective
- success criteria
- scope
- requirements
- decision history
- activity history
- established constraints

UPDATE WHEN NEEDED
- project status
- priority
- progress
- current state
- current focus
- milestones
- deliverables
- dependencies
- constraints
- risks
- open questions
- references
- next action
- last updated

TASK STATE
Detailed task state belongs in:
../tasks/<PROJECT_SLUG>-tasks.md

BOARD STATE
Portfolio-level summary belongs in:
../BOARD.md

RULE
Store information at the lowest appropriate canonical level.
Higher-level files summarize and link rather than duplicate detail.

COMPLETION
Do not mark the project complete until its success criteria are satisfied.
-->