'use strict';
// BSD-007 E2E validation: SDK read / apply / validate / watch round-trips on a scratch repo copy.
// Usage: node e2e-sdk-test.js <scratchRepo>
const path = require('path');
const { createBoard } = require(path.join(__dirname, '..')); // sdk/

const repo = process.argv[2] || process.env.BOARD_REPO;
if (!repo) { console.error('usage: node e2e-sdk-test.js <scratchRepo>'); process.exit(2); }

const assert = (cond, msg) => { if (!cond) { console.error('FAIL:', msg); process.exit(1); } console.log('ok:', msg); };

(async () => {
  const b = createBoard(repo);
  assert(Array.isArray(b.ops().ops) && b.ops().ops.includes('taskKV'), 'ops vocabulary present');
  assert(b.ops().workflows.includes('Done'), 'workflows include Done');

  // read: board only
  const boardOnly = b.read({ board: true });
  assert(boardOnly.board && Array.isArray(boardOnly.board.sections), 'read({board:true}) shape');

  // read: full
  const full = b.read();
  assert(Array.isArray(full.projects), 'read() full has projects array');

  // read: tasks
  const tasks = b.read({ tasks: 'board-sdk' });
  const wf = tasks.taskBoard.workflows;
  assert(wf && Array.isArray(wf.Ready) && wf.Ready.length > 0, 'read({tasks}) has workflow buckets');
  assert(wf.Ready.some((t) => t.id === 'BSD-001'), 'BSD-001 present in Ready bucket');

  // validate (no write)
  const v = b.validate('BOARD.md', [{ op: 'kv', key: 'Status', value: 'Ready' }]);
  assert(v.ok === true && v.valid === true, 'validate ok');

  // dry-run apply (no write)
  const dry = b.apply('tasks/board-sdk-tasks.md', [{ op: 'taskKV', taskId: 'BSD-001', key: 'Status', value: 'In Progress' }], { dryRun: true });
  assert(dry.ok && dry.dryRun === true && typeof dry.next === 'string' && dry.next.includes('In Progress'), 'dry-run returns next text');

  // real apply + re-read round-trip: taskKV edits KV in place
  const r = b.apply('tasks/board-sdk-tasks.md', [{ op: 'taskKV', taskId: 'BSD-001', key: 'Status', value: 'In Progress' }]);
  assert(r.ok === true && r.ops === 1, 'apply ok');
  const after = b.read({ tasks: 'board-sdk' });
  const bsd001InPlace = after.taskBoard.workflows.Ready.find((t) => t.id === 'BSD-001');
  assert(bsd001InPlace && bsd001InPlace.fields.Status === 'In Progress', 'taskKV updates KV in place');

  // task op moves the task into the In Progress workflow section
  const mv = b.apply('tasks/board-sdk-tasks.md', [{ op: 'task', taskId: 'BSD-001', workflow: 'In Progress' }]);
  assert(mv.ok === true, 'task move op ok');
  const moved = b.read({ tasks: 'board-sdk' });
  const bsd001Moved = moved.taskBoard.workflows['In Progress'].find((t) => t.id === 'BSD-001');
  assert(bsd001Moved && bsd001Moved.fields.Status === 'In Progress', 'task op moves workflow section');
  assert(!moved.taskBoard.workflows.Ready.some((t) => t.id === 'BSD-001'), 'task removed from Ready');

  // invalid op rejected
  let threw = false;
  try { b.apply('BOARD.md', [{ op: 'notAnOp', key: 'x', value: 'y' }]); } catch (e) { threw = true; }
  assert(threw, 'invalid op throws');

  // invalid target rejected
  threw = false;
  try { b.apply('../evil.md', []); } catch (e) { threw = true; }
  assert(threw, 'invalid target throws');

  // watch fires on change (debounced), then disposer stops it
  const changed = [];
  const dispose = b.watch(() => changed.push(Date.now()), { debounceMs: 40 });
  setTimeout(() => b.apply('projects/board-sdk.md', [{ op: 'kv', key: 'Status', value: 'Active' }]), 80);
  setTimeout(() => {
    assert(changed.length > 0, 'watch fired after change (' + changed.length + ')');
    dispose();
    const count = changed.length;
    setTimeout(() => {
      assert(changed.length === count, 'disposer stops watch');
      console.log('E2E SDK OK on', repo);
      process.exit(0);
    }, 120);
  }, 250);
})();
