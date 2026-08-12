'use strict';

// Scratch-repo fixture for the agent-board test harness.
// Each test gets an isolated throwaway board in a temp dir, so the real
// repository is never read from or written to.

const fs = require('fs');
const os = require('os');
const path = require('path');

const BOARD_MD = `# Test Board

![Board](https://img.shields.io/badge/board-portfolio-0969da)
![Projects](https://img.shields.io/badge/projects-1-0969da)
![Active](https://img.shields.io/badge/active-0-238636)
![Blocked](https://img.shields.io/badge/blocked-0-da3633)
![Review](https://img.shields.io/badge/review-0-8250df)
![Complete](https://img.shields.io/badge/complete-0-238636)
![Updated](https://img.shields.io/badge/updated-2026-08-12-6e7781)

> Repository-wide project overview and coordination board.

---

## Board Overview

| Field | Value |
| --- | --- |
| **Board Status** | \`Active\` |
| **Total Projects** | \`1\` |
| **Active Projects** | \`0\` |
| **Blocked Projects** | \`0\` |
| **Projects in Review** | \`0\` |
| **Completed Projects** | \`0\` |
| **Current Focus** | \`Fixture\` |
| **Last Updated** | \`2026-08-12\` |

---

## Current Focus

**Primary Project**

\`Fixture\`

**Active Task**

None.

**Next Action**

Run the tests.

**Why This Is Current**

\`Fixture used by the SDK test harness.\`

---

# Ready

![Ready](https://img.shields.io/badge/status-ready-1f6feb)

> Projects sufficiently defined and ready for execution.

### Fixture

![Status](https://img.shields.io/badge/status-ready-1f6feb)
![Priority](https://img.shields.io/badge/priority-medium-d29922)
![Progress](https://img.shields.io/badge/progress-0%25-0969da)
![Blocked](https://img.shields.io/badge/blocked-no-238636)

**Project:** [\`projects/fixture.md\`](projects/fixture.md)  
**Tasks:** [\`tasks/fixture-tasks.md\`](tasks/fixture-tasks.md)

| Field | Value |
| --- | --- |
| **Project ID** | \`FIX\` |
| **Status** | \`Ready\` |
| **Priority** | \`Medium\` |
| **Progress** | \`0%\` |
| **Current Task** | \`None\` |
| **Next Task** | \`FIX-001\` |
| **Target** | \`2026-08-12\` |
| **Updated** | \`2026-08-12\` |

**Objective**

A fixture project for the SDK test harness.

**Current State**

Ready.

**Next Action**

Run the tests.

---

# Active

![Active](https://img.shields.io/badge/status-active-238636)

> Projects currently receiving active execution.

_No projects currently active._

---

# Blocked

![Blocked](https://img.shields.io/badge/status-blocked-da3633)

> Projects whose overall progress is materially prevented by a dependency or unresolved issue.

_No blocked projects._

---

# Review

![Review](https://img.shields.io/badge/status-review-8250df)

> Projects whose primary execution is complete and are undergoing final validation or acceptance.

_No projects currently in review._

# Paused

![Paused](https://img.shields.io/badge/status-paused-d29922)

> Projects intentionally suspended while remaining relevant.

_No paused projects._

---

# Complete

![Complete](https://img.shields.io/badge/status-complete-238636)

> Projects whose project-level success criteria are satisfied.

_No completed projects._

---

# Archived

![Archived](https://img.shields.io/badge/status-archived-6e7781)

> Inactive projects retained for historical reference.

_No archived projects._`;

const PROJECT_MD = `# Fixture

![Status](https://img.shields.io/badge/status-ready-1f6feb)
![Priority](https://img.shields.io/badge/priority-medium-d29922)
![Progress](https://img.shields.io/badge/progress-0%25-0969da)
![Updated](https://img.shields.io/badge/updated-2026-08-12-6e7781)

[Board](../BOARD.md) · [Tasks](../tasks/fixture-tasks.md)

---

## Project Overview

| Field | Value |
| --- | --- |
| **Project ID** | \`FIX\` |
| **Project Name** | Fixture |
| **Status** | \`Ready\` |
| **Priority** | \`Medium\` |
| **Owner** | \`Agent\` |
| **Started** | \`2026-08-12\` |
| **Target** | \`2026-08-12\` |
| **Last Updated** | \`2026-08-12\` |

---

## Objective

Fixture project used by the SDK test harness.

---

## Current State

![State](https://img.shields.io/badge/current-ready-1f6feb)

**Summary**

Fixture project.

**Next Action**

Run the tests.

---

## Success Criteria

- [ ] Criterion one.

---

## Milestones

| ID | Milestone | Status | Target |
| --- | --- | --- | --- |
| \`M1\` | Fixture milestone | \`Not Started\` | \`2026-08-12\` |

---

## Activity

| Date | Change |
| --- | --- |
| \`2026-08-12\` | Created. |`;

const TASKS_MD = `# Fixture — Tasks

![Status](https://img.shields.io/badge/status-active-238636)
![Backlog](https://img.shields.io/badge/backlog-1-6e7781)
![Ready](https://img.shields.io/badge/ready-0-1f6feb)
![In Progress](https://img.shields.io/badge/in%20progress-0-d29922)
![Blocked](https://img.shields.io/badge/blocked-0-da3633)
![Review](https://img.shields.io/badge/review-0-8250df)
![Done](https://img.shields.io/badge/done-0-238636)
![Updated](https://img.shields.io/badge/updated-2026-08-12-6e7781)

[Board](../BOARD.md) · [Project](../projects/fixture.md)

---

## Task Board Overview

| Field | Value |
| --- | --- |
| **Project** | Fixture |
| **Project ID** | \`FIX\` |
| **Task Prefix** | \`FIX\` |
| **Board Status** | \`Active\` |
| **Last Updated** | \`2026-08-12\` |
| **Active Task** | \`None\` |
| **Next Ready Task** | \`FIX-001\` |

---

# Backlog

![Backlog](https://img.shields.io/badge/status-backlog-6e7781)

> Tasks that belong to the project but are not yet ready to begin.

### \`FIX-001\` — First task

![Status](https://img.shields.io/badge/status-backlog-6e7781)
![Priority](https://img.shields.io/badge/priority-medium-d29922)
![Type](https://img.shields.io/badge/type-task-0969da)
![Blocked](https://img.shields.io/badge/blocked-no-238636)

| Field | Value |
| --- | --- |
| **ID** | \`FIX-001\` |
| **Status** | \`Backlog\` |
| **Priority** | \`Medium\` |
| **Type** | \`Task\` |
| **Assigned** | \`Agent\` |
| **Created** | \`2026-08-12\` |
| **Started** | \`2026-08-12\` |
| **Updated** | \`2026-08-12\` |

**Goal**

First task.

### Acceptance Criteria

- [ ] \`criterion\` with \`backticks\`.

### Next Action

\`Run the tests.\`

---

# Ready

![Ready](https://img.shields.io/badge/status-ready-1f6feb)

> Tasks that are sufficiently defined and can be started.

_No tasks currently ready._

---

# In Progress

![In Progress](https://img.shields.io/badge/status-in%20progress-d29922)

> Tasks currently being executed.

_No tasks currently in progress._

---

# Blocked

![Blocked](https://img.shields.io/badge/status-blocked-da3633)

> Tasks that cannot make meaningful progress because of a dependency or unresolved issue.

_No blocked tasks._

---

# Review

![Review](https://img.shields.io/badge/status-review-8250df)

> Tasks believed to be complete but still requiring validation, approval, testing, or acceptance review.

_No tasks currently in review._

---

# Done

![Done](https://img.shields.io/badge/status-done-238636)

> Tasks whose acceptance criteria have been satisfied.

_No tasks currently done._`;

// Create an isolated scratch board repo; returns its absolute path.
function makeScratchRepo() {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-board-test-'));
  fs.mkdirSync(path.join(repo, 'projects'));
  fs.mkdirSync(path.join(repo, 'tasks'));
  fs.writeFileSync(path.join(repo, 'BOARD.md'), BOARD_MD, 'utf8');
  fs.writeFileSync(path.join(repo, 'projects', 'fixture.md'), PROJECT_MD, 'utf8');
  fs.writeFileSync(path.join(repo, 'tasks', 'fixture-tasks.md'), TASKS_MD, 'utf8');
  return repo;
}

function removeScratchRepo(repo) {
  try {
    fs.rmSync(repo, { recursive: true, force: true });
  } catch (_) {
    /* ignore */
  }
}

module.exports = { makeScratchRepo, removeScratchRepo, BOARD_MD, PROJECT_MD, TASKS_MD };
