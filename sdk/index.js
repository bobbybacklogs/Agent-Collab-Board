'use strict';

// Board SDK — programmatic access to the Agent Collab Board state system.
//
//   const { createBoard } = require('agent-board');
//   const board = createBoard('/path/to/repo'); // or BOARD_REPO env / cwd
//   const state = board.read();
//   board.apply('tasks/my-project-tasks.md', [{ op: 'taskKV', taskId: 'X-001', key: 'Status', value: 'Done' }]);
//
// Zero runtime dependencies. The dashboard server (ui/server.js) and the agent
// CLI (ui/lib/cli.js -> sdk/bin/cli.js) both consume this package.

const fs = require('fs');
const path = require('path');
const { readState, slugFromRef } = require('./lib/state');
const { resolveTarget, validateOps, writeTarget } = require('./lib/guard');
const { apply: applyOps, WORKFLOW_NAMES, BOARD_STATES, PRIORITY_VALUES } = require('./lib/write');
const { watchRepo } = require('./lib/watch');

const OP_NAMES = [
  'badge', 'kv', 'label', 'section', 'projectState', 'check',
  'task', 'taskKV', 'taskBadge', 'taskLabel', 'taskCheck',
];

function resolveRepo(repo) {
  return path.resolve(repo || process.env.BOARD_REPO || process.cwd());
}

// Create a board handle bound to a repo root.
// repo: optional absolute path; defaults to $BOARD_REPO, then process.cwd().
function createBoard(repo) {
  const root = resolveRepo(repo);

  // read({ board: true }) -> { board }
  // read({ project: slug }) -> { slug, project, taskBoard }
  // read({ tasks: slug }) -> { slug, taskBoard }
  // read() -> full { board, projects }
  function read(options = {}) {
    if (options.board) {
      const s = readState(root);
      return { board: s.board };
    }
    const s = readState(root);
    if (options.project) {
      const p = s.projects.find((x) => x.slug === options.project);
      if (!p) throw new Error(`project "${options.project}" not found`);
      return { slug: p.slug, project: p.project, taskBoard: p.taskBoard };
    }
    if (options.tasks) {
      const p = s.projects.find((x) => x.slug === options.tasks);
      if (!p || !p.taskBoard) throw new Error(`task board for "${options.tasks}" not found`);
      return { slug: p.slug, taskBoard: p.taskBoard };
    }
    return s;
  }

  // apply(target, ops, { dryRun }) -> { ok, target, ops, next? }
  // Validates ops, refuses writes that do not re-parse, and returns the
  // resulting text when dryRun is set (without writing).
  function apply(target, ops, options = {}) {
    const resolved = resolveTarget(target);
    if (!resolved) throw new Error(`invalid write target "${target}"`);
    validateOps(ops, resolved.scope);
    const file = path.join(root, resolved.fileRel);
    if (!fs.existsSync(file)) throw new Error(`file not found: ${resolved.fileRel}`);
    const current = fs.readFileSync(file, 'utf8');
    if (options.dryRun) {
      const next = applyOps(current, ops);
      return { ok: true, dryRun: true, target: resolved.fileRel, ops: ops.length, next };
    }
    const next = writeTarget(root, resolved, ops);
    return { ok: true, target: resolved.fileRel, ops: ops.length, next };
  }

  // validate(target, ops) -> { ok, valid, target, ops }
  function validate(target, ops) {
    const resolved = resolveTarget(target);
    if (!resolved) throw new Error(`invalid write target "${target}"`);
    validateOps(ops, resolved.scope);
    return { ok: true, valid: true, target: resolved.fileRel, ops: ops.length };
  }

  // watch(onChange, { debounceMs }) -> disposer
  // Calls onChange (debounced) when BOARD.md, projects/*.md, or tasks/*-tasks.md change.
  function watch(onChange, options = {}) {
    return watchRepo(root, onChange, options);
  }

  // ops() -> { ops, workflows, boardStates, priorities }
  function ops() {
    return {
      ops: OP_NAMES,
      workflows: WORKFLOW_NAMES,
      boardStates: BOARD_STATES,
      priorities: PRIORITY_VALUES,
    };
  }

  return { read, apply, validate, watch, ops, repo: root };
}

module.exports = {
  createBoard,
  readState,
  resolveTarget,
  validateOps,
  writeTarget,
  watchRepo,
  apply: applyOps,
  WORKFLOW_NAMES,
  BOARD_STATES,
  PRIORITY_VALUES,
  OP_NAMES,
  slugFromRef,
};
