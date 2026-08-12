#!/usr/bin/env node
'use strict';

// Agent CLI for the board state: read parsed state, apply surgical ops.
//
// Usage:
//   node sdk/bin/cli.js read [--board|--project <slug>|--tasks <slug>] [--pretty]
//   node sdk/bin/cli.js apply <target> '<ops-json>' [--dry-run]
//   node sdk/bin/cli.js validate <target> '<ops-json>'
//   node sdk/bin/cli.js ops
//   agent-board read ...               (when installed as a global npm bin)
//
// The legacy path `node ui/lib/cli.js` remains available as a one-line shim.
//
// Env:
//   BOARD_REPO   Override the repo root (same as ui/server.js).
//
// Exit codes: 0 ok, 1 usage/validation error, 2 target or file not found.

const fs = require('fs');
const path = require('path');
const { readState } = require('../lib/state');
const { resolveTarget, validateOps, writeTarget } = require('../lib/guard');
const { apply, WORKFLOW_NAMES, BOARD_STATES, PRIORITY_VALUES } = require('../lib/write');

const REPO = path.resolve(process.env.BOARD_REPO || path.join(__dirname, '..', '..'));

const OP_NAMES = [
  'badge', 'kv', 'label', 'section', 'projectState', 'check',
  'task', 'taskKV', 'taskBadge', 'taskLabel', 'taskCheck',
];

class CliError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code || 1;
  }
}

function usage(stream) {
  stream.write(`Board Agent Toolkit CLI

Usage:
  node sdk/bin/cli.js read [options]                Print parsed board state as JSON
  node sdk/bin/cli.js apply <target> <ops-json>     Apply validated ops to a state file
  node sdk/bin/cli.js validate <target> <ops-json>  Validate ops without writing
  node sdk/bin/cli.js ops                           Print the supported op vocabulary

(read is also reachable via node ui/lib/cli.js — a shim over this CLI.)

read options:
  --board          BOARD.md portfolio state only
  --project <slug> Project file + task board for a slug
  --tasks <slug>   Task board only for a slug
  --pretty         Pretty-print JSON (default: compact)

apply/validate options:
  --dry-run        Show the resulting text without writing

target:    BOARD.md | projects/<slug>.md | tasks/<slug>-tasks.md
ops-json:  JSON array of ops, e.g. '[{"op":"kv","key":"Status","value":"Review"}]'

Env:       BOARD_REPO overrides the repo root (default: repo root of this file).
Exit codes: 0 ok, 1 usage/validation error, 2 target or file not found.
`);
}

function parseArgs(argv) {
  const opts = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      if (key === 'pretty' || key === 'dry-run') {
        opts[key] = true;
      } else {
        opts[key] = argv[i + 1];
        i++;
      }
    } else {
      opts._.push(a);
    }
  }
  return opts;
}

function parseOpsJson(raw) {
  try {
    return JSON.parse(raw);
  } catch (err) {
    throw new CliError(`ops must be valid JSON: ${err.message}`, 1);
  }
}

function cmdRead(opts) {
  const state = readState(REPO);
  let out;
  if (opts.board) {
    out = { board: state.board };
  } else if (opts.project) {
    const p = state.projects.find((x) => x.slug === opts.project);
    if (!p) throw new CliError(`project "${opts.project}" not found`, 2);
    out = p;
  } else if (opts.tasks) {
    const p = state.projects.find((x) => x.slug === opts.tasks);
    if (!p || !p.taskBoard) throw new CliError(`task board for "${opts.tasks}" not found`, 2);
    out = { slug: p.slug, taskBoard: p.taskBoard };
  } else {
    out = state;
  }
  return opts.pretty ? JSON.stringify(out, null, 2) : JSON.stringify(out);
}

function cmdApply(opts) {
  const [target, opsRaw] = opts._;
  if (!target || !opsRaw) throw new CliError('apply needs <target> <ops-json>', 1);
  const resolved = resolveTarget(target);
  if (!resolved) throw new CliError(`invalid write target "${target}"`, 2);
  const ops = parseOpsJson(opsRaw);
  validateOps(ops, resolved.scope);

  const file = path.join(REPO, resolved.fileRel);
  if (!fs.existsSync(file)) throw new CliError(`file not found: ${resolved.fileRel}`, 2);

  if (opts['dry-run']) {
    const current = fs.readFileSync(file, 'utf8');
    const next = apply(current, ops);
    process.stderr.write(`[dry-run] ${resolved.fileRel} (${ops.length} ops) — no file written\n`);
    return next;
  }

  writeTarget(REPO, resolved, ops);
  return { ok: true, target: resolved.fileRel, ops: ops.length };
}

function cmdValidate(opts) {
  const [target, opsRaw] = opts._;
  if (!target || !opsRaw) throw new CliError('validate needs <target> <ops-json>', 1);
  const resolved = resolveTarget(target);
  if (!resolved) throw new CliError(`invalid write target "${target}"`, 2);
  const ops = parseOpsJson(opsRaw);
  validateOps(ops, resolved.scope);
  return { ok: true, valid: true, target: resolved.fileRel, ops: ops.length };
}

function cmdOps() {
  return {
    ops: OP_NAMES,
    workflows: WORKFLOW_NAMES,
    boardStates: BOARD_STATES,
    priorities: PRIORITY_VALUES,
    note: 'Use `node ui/lib/cli.js apply <target> \'<ops-json>\'` to edit state; see skills/board-edit/SKILL.md.',
  };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const cmd = opts._.shift();
  if (!cmd) {
    usage(process.stdout);
    return;
  }
  let result;
  switch (cmd) {
    case 'read':
      result = cmdRead(opts);
      break;
    case 'apply':
      result = cmdApply(opts);
      break;
    case 'validate':
      result = cmdValidate(opts);
      break;
    case 'ops':
      result = cmdOps();
      break;
    default:
      usage(process.stderr);
      throw new CliError(`unknown command "${cmd}"`, 1);
  }
  process.stdout.write((typeof result === 'string' ? result : JSON.stringify(result)) + '\n');
}

try {
  main();
} catch (err) {
  process.stderr.write(`error: ${err.message}\n`);
  process.exit(err instanceof CliError ? err.code : 1);
}
