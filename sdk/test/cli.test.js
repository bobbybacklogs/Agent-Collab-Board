'use strict';

// CLI-level tests for agent-board using Node's built-in test runner.
// Spawns the real CLI (sdk/bin/cli.js) and the legacy shim (ui/lib/cli.js)
// against a throwaway scratch repo via BOARD_REPO. No real files touched.

const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('path');
const { makeScratchRepo, removeScratchRepo } = require('./harness');

const SDK_CLI = path.join(__dirname, '..', 'bin', 'cli.js');
const SHIM_CLI = path.join(__dirname, '..', '..', 'ui', 'lib', 'cli.js');

function run(cli, args, repo) {
  return spawnSync(process.execPath, [cli, ...args], {
    encoding: 'utf8',
    env: { ...process.env, BOARD_REPO: repo },
  });
}

function fresh() {
  const repo = makeScratchRepo();
  return { repo };
}

test('cli ops prints the op vocabulary', () => {
  const { repo } = fresh();
  const r = run(SDK_CLI, ['ops'], repo);
  assert.equal(r.status, 0);
  const v = JSON.parse(r.stdout);
  assert.equal(v.ops.length, 11);
  assert.deepEqual(v.workflows, ['Backlog', 'Ready', 'In Progress', 'Blocked', 'Review', 'Done']);
  assert.deepEqual(v.boardStates, ['Planning', 'Ready', 'Active', 'Blocked', 'Review', 'Paused', 'Complete', 'Archived']);
  assert.deepEqual(v.priorities, ['Low', 'Medium', 'High', 'Critical']);
});

test('cli read --board prints the board JSON', () => {
  const { repo } = fresh();
  const r = run(SDK_CLI, ['read', '--board'], repo);
  assert.equal(r.status, 0);
  const s = JSON.parse(r.stdout);
  assert.ok(s.board);
  assert.equal(s.board.source, 'BOARD.md');
});

test('cli read --project prints project + task board', () => {
  const { repo } = fresh();
  const r = run(SDK_CLI, ['read', '--project', 'fixture'], repo);
  assert.equal(r.status, 0);
  const s = JSON.parse(r.stdout);
  assert.equal(s.slug, 'fixture');
  assert.ok(s.project);
  assert.ok(s.taskBoard);
});

test('cli read --tasks prints workflow buckets', () => {
  const { repo } = fresh();
  const r = run(SDK_CLI, ['read', '--tasks', 'fixture'], repo);
  assert.equal(r.status, 0);
  const s = JSON.parse(r.stdout);
  assert.equal(s.slug, 'fixture');
  assert.ok(s.taskBoard.workflows.Backlog.some((t) => t.id === 'FIX-001'));
});

test('cli read --tasks with an unknown slug exits 2', () => {
  const { repo } = fresh();
  const r = run(SDK_CLI, ['read', '--tasks', 'nope'], repo);
  assert.equal(r.status, 2);
  assert.match(r.stderr, /task board for "nope" not found/);
});

test('cli validate exits 0 on valid ops', () => {
  const { repo } = fresh();
  const ops = JSON.stringify([{ op: 'kv', key: 'Status', value: 'Review' }]);
  const r = run(SDK_CLI, ['validate', 'projects/fixture.md', ops], repo);
  assert.equal(r.status, 0);
  assert.equal(JSON.parse(r.stdout).valid, true);
});

test('cli validate exits 1 on an unknown op', () => {
  const { repo } = fresh();
  const ops = JSON.stringify([{ op: 'bogus', key: 'Status', value: 'Review' }]);
  const r = run(SDK_CLI, ['validate', 'projects/fixture.md', ops], repo);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /unknown op "bogus"/);
});

test('cli apply writes a real change', () => {
  const { repo } = fresh();
  const ops = JSON.stringify([{ op: 'kv', key: 'Status', value: 'Review' }]);
  const r = run(SDK_CLI, ['apply', 'projects/fixture.md', ops], repo);
  assert.equal(r.status, 0);
  assert.equal(JSON.parse(r.stdout).ok, true);
  // Round-trip through the CLI itself.
  const read = run(SDK_CLI, ['read', '--project', 'fixture'], repo);
  assert.equal(JSON.parse(read.stdout).project.overview.Status, 'Review');
});

test('cli apply --dry-run writes nothing', () => {
  const { repo } = fresh();
  const ops = JSON.stringify([{ op: 'kv', key: 'Status', value: 'Review' }]);
  const r = run(SDK_CLI, ['apply', 'projects/fixture.md', ops, '--dry-run'], repo);
  assert.equal(r.status, 0);
  assert.ok(r.stdout.includes('| **Status** | `Review` |'));
  const read = run(SDK_CLI, ['read', '--project', 'fixture'], repo);
  assert.equal(JSON.parse(read.stdout).project.overview.Status, 'Ready', 'dry-run must not write');
});

test('cli apply exits 1 on an unknown op', () => {
  const { repo } = fresh();
  const ops = JSON.stringify([{ op: 'bogus', key: 'Status', value: 'Review' }]);
  const r = run(SDK_CLI, ['apply', 'projects/fixture.md', ops], repo);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /unknown op "bogus"/);
});

test('cli apply exits 2 on an invalid target', () => {
  const { repo } = fresh();
  const ops = JSON.stringify([{ op: 'kv', key: 'Status', value: 'Review' }]);
  const r = run(SDK_CLI, ['apply', '../evil.md', ops], repo);
  assert.equal(r.status, 2);
  assert.match(r.stderr, /invalid write target/);
});

test('cli apply exits 2 on a missing file', () => {
  const { repo } = fresh();
  const ops = JSON.stringify([{ op: 'kv', key: 'Status', value: 'Review' }]);
  const r = run(SDK_CLI, ['apply', 'projects/nope.md', ops], repo);
  assert.equal(r.status, 2);
  assert.match(r.stderr, /file not found/);
});

test('legacy shim (ui/lib/cli.js) matches the SDK CLI output', () => {
  const { repo } = fresh();
  const sdk = run(SDK_CLI, ['ops'], repo);
  const shim = run(SHIM_CLI, ['ops'], repo);
  assert.equal(sdk.status, 0);
  assert.equal(shim.status, 0);
  assert.equal(shim.stdout, sdk.stdout, 'shim and SDK CLI must produce identical ops output');

  const sdkRead = run(SDK_CLI, ['read', '--board'], repo);
  const shimRead = run(SHIM_CLI, ['read', '--board'], repo);
  const a = JSON.parse(sdkRead.stdout);
  const b = JSON.parse(shimRead.stdout);
  delete a.generatedAt;
  delete b.generatedAt;
  assert.deepEqual(a, b, 'shim and SDK CLI read output must match (except generatedAt)');
});

test('cli read --pretty pretty-prints JSON', () => {
  const { repo } = fresh();
  const r = run(SDK_CLI, ['read', '--pretty'], repo);
  assert.equal(r.status, 0);
  assert.ok(r.stdout.includes('\n  '), 'pretty output should be indented');
});
