'use strict';

// API-level tests for agent-board using Node's built-in test runner
// (node:test) — zero runtime dependencies, matching the SDK's constraint.
//
//   cd sdk && npm test
//
// Each test runs against its own throwaway scratch repo, so the real
// repository is never read from or modified.

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { createBoard } = require('../index');
const { makeScratchRepo, removeScratchRepo } = require('./harness');

// Fresh isolated repo per test.
function fresh() {
  const repo = makeScratchRepo();
  const board = createBoard(repo);
  return { repo, board };
}

test('createBoard exposes the documented surface', () => {
  const { board } = fresh();
  assert.deepEqual(Object.keys(board).sort(), ['apply', 'ops', 'read', 'repo', 'validate', 'watch']);
  assert.equal(typeof board.read, 'function');
  assert.equal(typeof board.apply, 'function');
  assert.equal(typeof board.validate, 'function');
  assert.equal(typeof board.watch, 'function');
  assert.equal(typeof board.ops, 'function');
  assert.equal(typeof board.repo, 'string');
});

test('createBoard repo resolution: explicit path, env, and cwd', () => {
  const { repo } = fresh();
  const b1 = createBoard(repo);
  assert.equal(b1.repo, path.resolve(repo));

  const prev = process.env.BOARD_REPO;
  process.env.BOARD_REPO = repo;
  try {
    const b2 = createBoard();
    assert.equal(b2.repo, path.resolve(repo));
  } finally {
    if (prev === undefined) delete process.env.BOARD_REPO;
    else process.env.BOARD_REPO = prev;
  }

  const b3 = createBoard(undefined);
  assert.equal(b3.repo, process.cwd());
});

test('read() returns { board, projects } with parsed structure', () => {
  const { repo, board } = fresh();
  const s = board.read();
  assert.equal(typeof s.generatedAt, 'string');
  assert.ok(s.board);
  assert.equal(s.board.source, 'BOARD.md');
  assert.ok(Array.isArray(s.board.sections));
  assert.equal(s.board.sections.length, 8); // Planning..Archived
  const ready = s.board.sections.find((sec) => sec.state === 'Ready');
  assert.ok(ready);
  const card = ready.projects.find((c) => c.name === 'Fixture');
  assert.ok(card, 'Fixture card should be in the Ready section');
  assert.equal(card.refs.project, 'projects/fixture.md');
  assert.equal(card.refs.tasks, 'tasks/fixture-tasks.md');
  assert.ok(Array.isArray(card.badges));
  assert.ok(card.badges.some((b) => b.includes('status-ready-1f6feb')), 'card carries its status badge');

  assert.ok(Array.isArray(s.projects));
  const p = s.projects.find((x) => x.slug === 'fixture');
  assert.ok(p, 'projects should include the fixture slug');
  assert.ok(p.project, 'project parse should succeed');
  assert.equal(p.project.slug, 'fixture');
  assert.equal(p.project.overview['Project ID'], 'FIX');
  assert.ok(p.taskBoard, 'task board parse should succeed');
  assert.ok(p.taskBoard.source.endsWith('fixture-tasks.md'), 'task board source should point at the tasks file');
});

test('read({ board: true }) returns only the board', () => {
  const { board } = fresh();
  const s = board.read({ board: true });
  assert.deepEqual(Object.keys(s), ['board']);
  assert.ok(s.board);
});

test('read({ project }) returns { slug, project, taskBoard }', () => {
  const { board } = fresh();
  const s = board.read({ project: 'fixture' });
  assert.deepEqual(Object.keys(s), ['slug', 'project', 'taskBoard']);
  assert.equal(s.slug, 'fixture');
  assert.equal(s.project.slug, 'fixture');
  assert.ok(s.taskBoard);
});

test('read({ tasks }) returns { slug, taskBoard } with workflow buckets', () => {
  const { board } = fresh();
  const s = board.read({ tasks: 'fixture' });
  assert.deepEqual(Object.keys(s), ['slug', 'taskBoard']);
  assert.equal(s.slug, 'fixture');
  const wf = s.taskBoard.workflows;
  assert.ok(wf.Backlog, 'Backlog bucket should exist');
  const t = wf.Backlog.find((x) => x.id === 'FIX-001');
  assert.ok(t, 'FIX-001 should be in the Backlog bucket');
  assert.equal(t.fields.Status, 'Backlog');
});

test('read({ project }) throws for an unknown slug', () => {
  const { board } = fresh();
  assert.throws(() => board.read({ project: 'nope' }), /project "nope" not found/);
});

test('read({ tasks }) throws for a slug without a task board', () => {
  const { board } = fresh();
  assert.throws(() => board.read({ tasks: 'nope' }), /task board for "nope" not found/);
});

test('ops() returns the full op vocabulary', () => {
  const { board } = fresh();
  const v = board.ops();
  assert.equal(v.ops.length, 11);
  for (const op of ['badge', 'kv', 'label', 'section', 'projectState', 'check', 'task', 'taskKV', 'taskBadge', 'taskLabel', 'taskCheck']) {
    assert.ok(v.ops.includes(op), `missing op ${op}`);
  }
  assert.deepEqual(v.workflows, ['Backlog', 'Ready', 'In Progress', 'Blocked', 'Review', 'Done']);
  assert.deepEqual(v.boardStates, ['Planning', 'Ready', 'Active', 'Blocked', 'Review', 'Paused', 'Complete', 'Archived']);
  assert.deepEqual(v.priorities, ['Low', 'Medium', 'High', 'Critical']);
});

test('validate() accepts a valid op set', () => {
  const { board } = fresh();
  const r = board.validate('projects/fixture.md', [{ op: 'kv', key: 'Status', value: 'Review' }]);
  assert.equal(r.ok, true);
  assert.equal(r.valid, true);
  assert.equal(r.target, 'projects/fixture.md');
  assert.equal(r.ops, 1);
});

test('validate() rejects an unknown op', () => {
  const { board } = fresh();
  assert.throws(() => board.validate('projects/fixture.md', [{ op: 'bogus', key: 'Status', value: 'Review' }]), /unknown op "bogus"/);
});

test('validate() rejects an invalid target', () => {
  const { board } = fresh();
  assert.throws(() => board.validate('../evil.md', [{ op: 'kv', key: 'Status', value: 'Review' }]), /invalid write target/);
});

test('validate() rejects a bad workflow on task op', () => {
  const { board } = fresh();
  assert.throws(() => board.validate('tasks/fixture-tasks.md', [{ op: 'task', taskId: 'FIX-001', workflow: 'Nope' }]), /task workflow must be one of/);
});

test('apply() with dryRun does not write', () => {
  const { repo, board } = fresh();
  const file = path.join(repo, 'projects', 'fixture.md');
  const before = fs.readFileSync(file, 'utf8');
  const r = board.apply('projects/fixture.md', [{ op: 'kv', key: 'Status', value: 'Review' }], { dryRun: true });
  assert.equal(r.ok, true);
  assert.equal(r.dryRun, true);
  assert.equal(r.target, 'projects/fixture.md');
  assert.equal(r.ops, 1);
  assert.ok(typeof r.next === 'string');
  assert.ok(r.next.includes('| **Status** | `Review` |'));
  assert.equal(fs.readFileSync(file, 'utf8'), before, 'file must be unchanged in dryRun');
});

test('apply() kv op round-trips', () => {
  const { board } = fresh();
  const r = board.apply('projects/fixture.md', [{ op: 'kv', key: 'Status', value: 'Review' }]);
  assert.equal(r.ok, true);
  assert.equal(r.target, 'projects/fixture.md');
  const s = board.read({ project: 'fixture' });
  assert.equal(s.project.overview.Status, 'Review');
});

test('apply() badge op updates the badge value (color preserved)', () => {
  const { repo, board } = fresh();
  board.apply('projects/fixture.md', [{ op: 'badge', label: 'status', value: 'review' }]);
  const text = fs.readFileSync(path.join(repo, 'projects', 'fixture.md'), 'utf8');
  assert.ok(text.includes('status-review-1f6feb'), 'badge value should be updated (color preserved)');
  assert.ok(!text.includes('status-ready-1f6feb'), 'old badge value should be gone');
});

test('apply() check op toggles a project success criterion', () => {
  const { board } = fresh();
  board.apply('projects/fixture.md', [{ op: 'check', text: 'Criterion one.', done: true }]);
  const s = board.read({ project: 'fixture' });
  assert.ok(s.project.successCriteria.some((c) => c.done && c.text.includes('Criterion one')));
});

test('apply() label op replaces a labeled block', () => {
  const { board } = fresh();
  board.apply('projects/fixture.md', [{ op: 'label', label: 'Summary', value: 'New summary.' }]);
  const s = board.read({ project: 'fixture' });
  assert.ok(s.project.current.summary.includes('New summary.'));
});

test('apply() section op replaces a heading section', () => {
  const { board } = fresh();
  board.apply('projects/fixture.md', [{ op: 'section', heading: 'Objective', value: 'New objective text.' }]);
  const s = board.read({ project: 'fixture' });
  assert.ok(s.project.objective.includes('New objective text.'));
});

test('apply() projectState op moves the board card', () => {
  const { board } = fresh();
  const r = board.apply('BOARD.md', [{ op: 'projectState', title: 'Fixture', state: 'Review' }]);
  assert.equal(r.ok, true);
  const s = board.read({ board: true });
  const review = s.board.sections.find((sec) => sec.state === 'Review');
  assert.ok(review.projects.some((c) => c.name === 'Fixture'), 'Fixture card should move to Review');
  const ready = s.board.sections.find((sec) => sec.state === 'Ready');
  assert.ok(!ready.projects.some((c) => c.name === 'Fixture'), 'Fixture card should leave Ready');
});

test('apply() task op moves a task between workflow buckets', () => {
  const { board } = fresh();
  const r = board.apply('tasks/fixture-tasks.md', [{ op: 'task', taskId: 'FIX-001', workflow: 'In Progress' }]);
  assert.equal(r.ok, true);
  const s = board.read({ tasks: 'fixture' });
  const wf = s.taskBoard.workflows;
  assert.ok(wf['In Progress'].some((t) => t.id === 'FIX-001'), 'FIX-001 should be in In Progress');
  assert.ok(!wf.Backlog.some((t) => t.id === 'FIX-001'), 'FIX-001 should leave Backlog');
  const t = wf['In Progress'].find((x) => x.id === 'FIX-001');
  assert.equal(t.fields.Status, 'In Progress');
});

test('apply() taskKV op edits a task field in place', () => {
  const { board } = fresh();
  board.apply('tasks/fixture-tasks.md', [{ op: 'taskKV', taskId: 'FIX-001', key: 'Priority', value: 'High' }]);
  const s = board.read({ tasks: 'fixture' });
  const t = s.taskBoard.workflows.Backlog.find((x) => x.id === 'FIX-001');
  assert.equal(t.fields.Priority, 'High');
});

test('apply() taskBadge op updates a task badge value (color preserved)', () => {
  const { board } = fresh();
  board.apply('tasks/fixture-tasks.md', [{ op: 'taskBadge', taskId: 'FIX-001', label: 'priority', value: 'high' }]);
  const s = board.read({ tasks: 'fixture' });
  const t = s.taskBoard.workflows.Backlog.find((x) => x.id === 'FIX-001');
  assert.ok(t.badges.some((b) => b.includes('priority-high-d29922')), 'task badge value should be updated (color preserved)');
});

test('apply() taskLabel op replaces a task label block', () => {
  const { board } = fresh();
  board.apply('tasks/fixture-tasks.md', [{ op: 'taskLabel', taskId: 'FIX-001', label: 'Goal', value: 'New goal text.' }]);
  const s = board.read({ tasks: 'fixture' });
  const t = s.taskBoard.workflows.Backlog.find((x) => x.id === 'FIX-001');
  assert.ok(t.goal.includes('New goal text.'));
});

test('apply() taskCheck op toggles an acceptance criterion (backtick text)', () => {
  const { board } = fresh();
  // Task acceptance criteria contain backticks; the op text must match exactly.
  board.apply('tasks/fixture-tasks.md', [{ op: 'taskCheck', taskId: 'FIX-001', text: '`criterion` with `backticks`.', done: true }]);
  const s = board.read({ tasks: 'fixture' });
  const t = s.taskBoard.workflows.Backlog.find((x) => x.id === 'FIX-001');
  assert.ok(t.criteria.items.some((c) => c.done && c.text.includes('criterion` with `backticks')));
});

test('apply() rejects an unknown op', () => {
  const { board } = fresh();
  assert.throws(() => board.apply('projects/fixture.md', [{ op: 'bogus', key: 'Status', value: 'Review' }]), /unknown op "bogus"/);
});

test('apply() rejects an invalid target', () => {
  const { board } = fresh();
  assert.throws(() => board.apply('../evil.md', [{ op: 'kv', key: 'Status', value: 'Review' }]), /invalid write target/);
});

test('apply() rejects a missing file', () => {
  const { board } = fresh();
  assert.throws(() => board.apply('projects/nope.md', [{ op: 'kv', key: 'Status', value: 'Review' }]), /file not found: projects\/nope\.md/);
});

test('apply() rejects a checklist item that does not exist', () => {
  const { board } = fresh();
  assert.throws(
    () => board.apply('projects/fixture.md', [{ op: 'check', text: 'No such item.', done: true }]),
    /checklist item "No such item\." not found/,
  );
});

test('apply() empty ops array is rejected', () => {
  const { board } = fresh();
  assert.throws(() => board.apply('projects/fixture.md', []), /non-empty ops array/);
});

test('watch() fires onChange on a write and disposer stops it', async () => {
  const { board } = fresh();
  let fired = 0;
  const dispose = board.watch(() => { fired += 1; }, { debounceMs: 40 });
  try {
    await new Promise((r) => setTimeout(r, 100)); // let watchers register
    board.apply('projects/fixture.md', [{ op: 'kv', key: 'Status', value: 'Review' }]);
    await new Promise((r) => setTimeout(r, 300));
    assert.ok(fired >= 1, `expected watch to fire, got ${fired}`);
    const afterDispose = fired;
    dispose();
    board.apply('projects/fixture.md', [{ op: 'kv', key: 'Status', value: 'Active' }]);
    await new Promise((r) => setTimeout(r, 300));
    assert.equal(fired, afterDispose, 'disposer must stop notifications');
  } finally {
    dispose();
  }
});

test('module-level re-exports match the documented surface', () => {
  const api = require('../index');
  for (const name of ['createBoard', 'readState', 'resolveTarget', 'validateOps', 'writeTarget', 'watchRepo', 'apply', 'WORKFLOW_NAMES', 'BOARD_STATES', 'PRIORITY_VALUES', 'OP_NAMES', 'slugFromRef']) {
    assert.ok(api[name] !== undefined, `missing export ${name}`);
  }
  assert.equal(api.OP_NAMES.length, 11);
  assert.equal(api.WORKFLOW_NAMES.length, 6);
  assert.equal(api.BOARD_STATES.length, 8);
  assert.equal(api.PRIORITY_VALUES.length, 4);
  assert.equal(api.slugFromRef('tasks/foo-tasks.md'), 'foo');
});

test('apply() supports multiple ops in one call', () => {
  const { board } = fresh();
  const r = board.apply('projects/fixture.md', [
    { op: 'kv', key: 'Status', value: 'Review' },
    { op: 'check', text: 'Criterion one.', done: true },
  ]);
  assert.equal(r.ok, true);
  assert.equal(r.ops, 2);
  const s = board.read({ project: 'fixture' });
  assert.equal(s.project.overview.Status, 'Review');
  assert.ok(s.project.successCriteria.some((c) => c.done));
});

test('apply() produces a file that still re-parses cleanly', () => {
  const { board } = fresh();
  board.apply('tasks/fixture-tasks.md', [
    { op: 'task', taskId: 'FIX-001', workflow: 'In Progress' },
    { op: 'taskKV', taskId: 'FIX-001', key: 'Priority', value: 'High' },
    { op: 'taskCheck', taskId: 'FIX-001', text: '`criterion` with `backticks`.', done: true },
  ]);
  // Re-read must succeed and reflect all three changes.
  const s = board.read({ tasks: 'fixture' });
  const t = s.taskBoard.workflows['In Progress'].find((x) => x.id === 'FIX-001');
  assert.ok(t, 'task should be in In Progress');
  assert.equal(t.fields.Priority, 'High');
  assert.ok(t.criteria.items.some((c) => c.done));
});
