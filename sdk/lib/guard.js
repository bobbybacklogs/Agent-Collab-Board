'use strict';

// Shared write-target and op validation for the board write layer.
// Single source of truth for write safety, used by both the dashboard
// server (POST /api/write) and the agent CLI (ui/lib/cli.js).

const fs = require('fs');
const path = require('path');
const { apply, BOARD_STATES, PRIORITY_VALUES, WORKFLOW_NAMES } = require('./write');

// Resolve a write target (repo-relative) to { fileRel, scope } or null.
// Only repo-owned markdown is writable: BOARD.md, projects/*.md, tasks/*-tasks.md.
function resolveTarget(target) {
  if (!target || typeof target !== 'string') return null;
  const norm = path.normalize(target).replace(/^([.\\/]+)/, '');
  const parts = norm.split(/[\\/]/);
  if (parts.length === 1) {
    return parts[0] === 'BOARD.md' ? { fileRel: 'BOARD.md', scope: 'board' } : null;
  }
  if (parts.length === 2 && (parts[0] === 'projects' || parts[0] === 'tasks')) {
    if (!/\.md$/.test(parts[1])) return null;
    if (parts[1].startsWith('_')) return null;
    return { fileRel: `${parts[0]}/${parts[1]}`, scope: parts[0] };
  }
  return null;
}

function validateOps(ops, scope) {
  if (!Array.isArray(ops) || !ops.length) throw new Error('write request needs a non-empty ops array');
  for (const e of ops) {
    if (!e || typeof e !== 'object') throw new Error('each op must be an object');
    switch (e.op) {
      case 'badge':
        if (!e.label) throw new Error('badge op needs label');
        if (e.value === undefined || e.value === null || e.value === '') throw new Error(`badge "${e.label}" needs a value`);
        if (e.label.toLowerCase() === 'status' && e.value && !BOARD_STATES.some((s) => s.toLowerCase() === String(e.value).toLowerCase())) {
          throw new Error(`badge status value must be one of: ${BOARD_STATES.join(', ')}`);
        }
        if (e.label.toLowerCase() === 'priority' && !PRIORITY_VALUES.some((p) => p.toLowerCase() === String(e.value).toLowerCase())) {
          throw new Error(`badge priority value must be one of: ${PRIORITY_VALUES.join(', ')}`);
        }
        break;
      case 'label':
      case 'kv':
        if (!e.key && !e.label) throw new Error(`${e.op} op needs a key`);
        break;
      case 'section':
        if (!e.heading) throw new Error('section op needs a heading');
        break;
      case 'projectState':
        if (!e.title) throw new Error('projectState op needs title');
        if (!BOARD_STATES.some((s) => s.toLowerCase() === String(e.state || '').toLowerCase())) {
          throw new Error(`project state must be one of: ${BOARD_STATES.join(', ')}`);
        }
        break;
      case 'check':
        if (!e.text) throw new Error('check op needs text');
        break;
      case 'task':
        if (!e.taskId) throw new Error('task op needs taskId');
        if (!WORKFLOW_NAMES.some((w) => w.toLowerCase() === String(e.workflow || '').toLowerCase())) {
          throw new Error(`task workflow must be one of: ${WORKFLOW_NAMES.join(', ')}`);
        }
        break;
      case 'taskKV':
        if (!e.taskId) throw new Error('taskKV op needs taskId');
        if (!e.key) throw new Error('taskKV op needs a key');
        break;
      case 'taskBadge':
        if (!e.taskId) throw new Error('taskBadge op needs taskId');
        if (!e.label) throw new Error('taskBadge op needs a label');
        break;
      case 'taskLabel':
        if (!e.taskId) throw new Error('taskLabel op needs taskId');
        break;
      case 'taskCheck':
        if (!e.taskId) throw new Error('taskCheck op needs taskId');
        if (!e.text) throw new Error('taskCheck op needs text');
        break;
      default:
        throw new Error(`unknown op "${e.op}"`);
    }
  }
}

// Read, apply (with a re-parse guard), and write a target file.
// The edited file must still parse cleanly or the write is refused.
function writeTarget(repo, resolved, ops) {
  const file = path.join(repo, resolved.fileRel);
  const current = fs.readFileSync(file, 'utf8');
  const next = apply(current, ops);
  try {
    if (resolved.scope === 'projects') {
      const { parseProject } = require('./parse');
      parseProject(next, path.basename(resolved.fileRel, '.md'));
    } else if (resolved.scope === 'tasks') {
      const { parseTaskBoard } = require('./parse');
      parseTaskBoard(next);
    } else {
      const { parseBoard } = require('./parse');
      parseBoard(next);
    }
  } catch (err) {
    throw new Error(`refusing write: edit does not re-parse: ${err.message}`);
  }
  fs.writeFileSync(file, next, 'utf8');
  return next;
}

module.exports = { resolveTarget, validateOps, writeTarget };
