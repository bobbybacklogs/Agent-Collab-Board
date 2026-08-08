'use strict';

// Surgical, line-aware writers for the Agent X board Markdown state.
// Maps a small set of validated ops to minimal text edits in
//   projects/<slug>.md , tasks/<slug>-tasks.md
// Ops fail fast when the target cannot be found, and never rewrite the file
// outside the affected structural unit.

const WORKFLOW_NAMES = ['Backlog', 'Ready', 'In Progress', 'Blocked', 'Review', 'Done'];
const BOARD_STATES = ['Planning', 'Ready', 'Active', 'Blocked', 'Review', 'Paused', 'Complete', 'Archived'];
const PRIORITY_VALUES = ['Low', 'Medium', 'High', 'Critical'];

const WORKFLOW_COLOR = {
  Backlog: '8b949e', Ready: '1f6feb', 'In Progress': 'd29922',
  Blocked: 'da3633', Review: '8250df', Done: '238636',
};

const BADGE_RE = /https:\/\/img\.shields\.io\/badge\/([^)\s]+)/g;

function clean(s) {
  return String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
}
function norm(s) {
  return clean(s).toLowerCase();
}
function esc(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function isHr(line) {
  return /^-{3,}\s*$/.test(clean(line));
}
function isHeading(line, level) {
  return new RegExp(`^#{${level}}\\s+`).test(line);
}
function isBoldLabel(line) {
  return /^\*\*[^*]+\*\*\s*$/.test(clean(line));
}

// ---------- op: badge ----------

function parseBadgeSeg(seg) {
  const dash = seg.lastIndexOf('-');
  if (dash < 0) return null;
  const color = seg.slice(dash + 1);
  const rest = decodeURIComponent(seg.slice(0, dash)).toLowerCase();
  const first = rest.indexOf('-');
  if (first < 0) return null;
  return { label: rest.slice(0, first), value: rest.slice(first + 1), color };
}

function replaceBadgeInLine(line, label, value, color) {
  return line.replace(BADGE_RE, (m, seg) => {
    const info = parseBadgeSeg(seg);
    if (!info || info.label !== label) return m;
    const col = color || info.color;
    return `https://img.shields.io/badge/${label}-${encodeURIComponent(String(value).toLowerCase())}-${col}`;
  });
}

function applyBadge(text, label, value, color) {
  const L = norm(label);
  if (!L) throw new Error('badge op requires a label');
  if (value === undefined || value === null || value === '') {
    throw new Error(`badge op requires a value (${label})`);
  }
  let hit = false;
  const out = String(text)
    .split('\n')
    .map((line) => {
      if (line.includes('shields.io')) {
        const next = replaceBadgeInLine(line, L, value, color);
        if (next !== line) hit = true;
        return next;
      }
      return line;
    });
  const joined = out.join('\n');
  // Preserve the original line endings by returning joined; if nothing changed,
  // the op is a no-op (helpful when the same value is sent twice).
  return joined;
}

// ---------- op: kv table row ----------

function parseKVRow(line) {
  const m = line.match(/^\s*\|[ \t]*\*\*([^*]+)\*\*[ \t]*\|[ \t]*(.*?)[ \t]*\|/);
  if (!m) return null;
  return { key: clean(m[1]), value: clean(m[2]) };
}

function applyKV(text, key, value) {
  const K = clean(key);
  if (!K) throw new Error('kv op requires a key');
  if (value === undefined || value === null) {
    throw new Error(`kv op requires a value (${key})`);
  }
  let hit = false;
  const out = String(text)
    .split('\n')
    .map((line) => {
      const row = parseKVRow(line);
      if (row && row.key === K) {
        hit = true;
        return line.replace(/^(\s*\|[ \t]*\*\*[^*]+\*\*[ \t]*\|[ \t]*).*?([ \t]*\|)/,
          `$1\`${value}\`$2`);
      }
      return line;
    });
  if (!hit) throw new Error(`kv row "${key}" not found`);
  return out.join('\n');
}

// ---------- op: label block (e.g. **Summary** in Current State) ----------

function applyLabelBlock(text, label, value) {
  const L = clean(label);
  const lines = String(text).split('\n');
  const idx = lines.findIndex((l) => l.trim() === `**${L}**`);
  if (idx < 0) throw new Error(`label "**${L}**" not found`);
  let end = idx + 1;
  while (end < lines.length) {
    const t = lines[end];
    if (isBoldLabel(t)) break;
    if (isHeading(t, 2) || isHeading(t, 3)) break;
    if (isHr(t)) break;
    if (t.trim() === '') { end++; continue; }
    end++;
  }
  const head = lines.slice(0, idx + 1);
  while (head.length && head[head.length - 1].trim() === '') head.pop();
  const tail = lines.slice(end);
  return [...head, '', String(value).trim(), '', ...tail].join('\n');
}

// ---------- op: checkbox ----------

function applyCheck(text, itemText, done) {
  const needle = clean(itemText);
  let hit = false;
  const out = String(text)
    .split('\n')
    .map((line) => {
      const m = line.match(/^(\s*[-*]\s+)\[([ xX])\]\s*(\S.*)$/);
      if (!m) return line;
      if (clean(m[3]) !== needle) return line;
      hit = true;
      return `${m[1]}[${done ? 'x' : ' '}] ${m[3]}`;
    });
  if (!hit) throw new Error(`checklist item "${itemText}" not found`);
  return out.join('\n');
}

// ---------- scoped task ops (single task block) ----------

function scopedTaskApply(text, taskId, transform) {
  const lines = String(text).split('\n');
  const { start, end } = taskBlockRange(lines, clean(taskId));
  const blockText = lines.slice(start, end).join('\n');
  const updated = transform(blockText);
  return [...lines.slice(0, start), ...updated.split('\n'), ...lines.slice(end)].join('\n');
}

function applyTaskKV(text, taskId, key, value) {
  return scopedTaskApply(text, taskId, (block) => {
    try {
      return applyKV(block, key, value);
    } catch (err) {
      throw new Error(`task "${taskId}" ${err.message}`);
    }
  });
}

function applyTaskBadge(text, taskId, label, value, color) {
  return scopedTaskApply(text, taskId, (block) => {
    try {
      return applyBadge(block, label, value, color);
    } catch (err) {
      throw new Error(`task "${taskId}" ${err.message}`);
    }
  });
}

function applyTaskLabel(text, taskId, label, value) {
  return scopedTaskApply(text, taskId, (block) => {
    try {
      return applyLabelBlock(block, label, value);
    } catch (err) {
      throw new Error(`task "${taskId}" ${err.message}`);
    }
  });
}

function applyTaskCheck(text, taskId, itemText, done) {
  return scopedTaskApply(text, taskId, (block) => {
    try {
      return applyCheck(block, itemText, done);
    } catch (err) {
      throw new Error(`task "${taskId}" ${err.message}`);
    }
  });
}

// ---------- op: task workflow move ----------

function findWorkflowHeader(lines, workflow) {
  const re = new RegExp(`^#{1}\\s+${esc(workflow)}\\s*$`, 'i');
  for (let i = 0; i < lines.length; i++) {
    if (re.test(lines[i].trim())) return i;
  }
  return -1;
}

// detect a task block start: `### `ID` — Title`
function isTaskStart(line) {
  return /^###\s+`.+`\s*[-–—]/.test(line);
}

// extract [start, end) of a task block; end is exclusive.
function taskBlockRange(lines, taskId) {
  const re = new RegExp(`^###\\s+\\\`${esc(taskId)}\\\`\\s*[-–—]`);
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (re.test(lines[i])) { start = i; break; }
  }
  if (start < 0) throw new Error(`task "${taskId}" not found`);
  let end = start + 1;
  while (end < lines.length) {
    const t = lines[end];
    if (isTaskStart(t)) break;
    if (isHeading(t, 1) || isHeading(t, 2)) break;
    if (isHr(t)) break;
    end++;
  }
  return { start, end };
}

function applyTask(text, taskId, workflow) {
  const id = clean(taskId);
  const wf = WORKFLOW_NAMES.find((w) => norm(w) === norm(workflow));
  if (!wf) throw new Error(`unknown workflow "${workflow}"`);
  const lines = String(text).split('\n');

  const { start, end } = taskBlockRange(lines, id);
  const blockLines = lines.slice(start, end);
  // trim trailing blank lines
  while (blockLines.length && blockLines[blockLines.length - 1].trim() === '') blockLines.pop();

  // dynamic section range for a level-1 workflow heading
  // A level-2 heading (`## ...`) also terminates the section, since workflow
  // task blocks never live under a level-2 heading.
  const sectionEnd = (hdr) => {
    for (let i = hdr + 1; i < lines.length; i++) {
      if (isHeading(lines[i], 1) || isHeading(lines[i], 2)) return i;
    }
    return lines.length;
  };

  // Remove the block now (including a trailing blank / `---`).
  let removalEnd = end;
  while (removalEnd < lines.length && lines[removalEnd].trim() === '') removalEnd++;
  if (removalEnd < lines.length && isHr(lines[removalEnd])) removalEnd++;
  lines.splice(start, removalEnd - start);

  const dst = findWorkflowHeader(lines, wf);
  if (dst < 0) throw new Error(`workflow section "${wf}" not found`);

  // Inside the destination section, compute the insertion point:
  // - replace a `_No tasks..._` placeholder if present,
  // - otherwise insert just before the section's closing `---` (after any tasks).
  const secEnd = sectionEnd(dst);
  let insertAt = secEnd;
  let hole = -1;
  for (let i = dst + 1; i < secEnd && hole < 0; i++) {
    const t = lines[i].trim();
    if (/^_[^_]+_$/.test(t)) hole = i;
  }
  if (hole >= 0) {
    insertAt = hole;
    lines.splice(hole, 1);
  } else {
    for (let i = secEnd - 1; i >= dst + 1; i--) {
      if (isHr(lines[i])) { insertAt = i; break; }
    }
  }

  const updated = syncTaskBlock(blockLines, wf);
  const out = [];
  out.push(...lines.slice(0, insertAt));
  out.push(...updated);
  out.push('');
  out.push(...lines.slice(insertAt));
  return out.join('\n');
}

function syncTaskBlock(blockLines, wf) {
  const text = blockLines.join('\n');
  let out = text;
  try { out = applyBadge(out, 'status', wf, WORKFLOW_COLOR[wf]); } catch (_) {}
  try { out = applyKV(out, 'Status', wf); } catch (_) {}
  return out.split('\n');
}

// ---------- op: section heading text (e.g. `## Objective`) ----------

function applyHeadingSection(text, heading, value) {
  const H = clean(heading);
  const re = new RegExp(`^#{1,6}\\s+${esc(H)}\\s*$`, 'i');
  const lines = String(text).split('\n');
  let idx = -1;
  for (let k = 0; k < lines.length; k++) if (re.test(lines[k].trim())) { idx = k; break; }
  if (idx < 0) throw new Error(`section "${heading}" not found`);
  let s = idx + 1;
  while (s < lines.length && lines[s].trim() === '') s++;
  let e = s;
  while (e < lines.length && !isHr(lines[e]) && !isHeading(lines[e], 1) && !isHeading(lines[e], 2)) e++;
  const head = lines.slice(0, s);
  const tail = lines.slice(e);
  return [...head, String(value).trim(), '', ...tail].join('\n');
}

// ---------- op: BOARD.md project-card state move ----------

const BOARD_STATE_COLOR = {
  Planning: '6e7781', Ready: '1f6feb', Active: '238636', Blocked: 'da3633',
  Review: '8250df', Paused: 'd29922', Complete: '238636', Archived: '6e7781',
};

function isBoardCardHead(line) {
  return /^###\s+\S/.test(line.trim());
}

function boardCardRange(lines, title) {
  const re = new RegExp(`^###\\s+${esc(title)}\\s*$`, 'i');
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (re.test(lines[i].trim())) { start = i; break; }
  }
  if (start < 0) throw new Error(`board card "${title}" not found`);
  let end = start + 1;
  while (end < lines.length) {
    const t = lines[end];
    if (isBoardCardHead(t)) break;
    if (isHeading(t, 1)) break;
    if (isHr(t)) { end++; break; }
    end++;
  }
  return { start, end };
}

function applyProjectState(text, title, newState) {
  const name = clean(title);
  const st = BOARD_STATES.find((s) => norm(s) === norm(newState));
  if (!st) throw new Error(`unknown project state "${newState}"`);
  const lines = String(text).split('\n');

  const { start, end } = boardCardRange(lines, name);
  const block = lines.slice(start, end);
  while (block.length && block[block.length - 1].trim() === '') block.pop();

  const sectionEnd = (hdr) => {
    for (let i = hdr + 1; i < lines.length; i++) if (isHeading(lines[i], 1)) return i;
    return lines.length;
  };

  let removalEnd = end;
  while (removalEnd < lines.length && lines[removalEnd].trim() === '') removalEnd++;
  if (removalEnd < lines.length && isHr(lines[removalEnd])) removalEnd++;
  lines.splice(start, removalEnd - start);

  const dst = findWorkflowHeader(lines, st);
  if (dst < 0) throw new Error(`board section "${st}" not found`);

  const secEnd = sectionEnd(dst);
  let insertAt = secEnd;
  let hole = -1;
  for (let i = dst + 1; i < secEnd && hole < 0; i++) {
    const t = lines[i].trim();
    if (/^_[^_]+_$/.test(t)) hole = i;
  }
  if (hole >= 0) {
    insertAt = hole;
    lines.splice(hole, 1);
  } else {
    for (let i = secEnd - 1; i >= dst + 1; i--) {
      if (isHr(lines[i])) { insertAt = i; break; }
    }
  }

  const updated = syncBoardBlock(block, st);
  const out = [];
  out.push(...lines.slice(0, insertAt));
  out.push(...updated);
  out.push('');
  out.push(...lines.slice(insertAt));
  return out.join('\n');
}

function syncBoardBlock(blockLines, st) {
  const text = blockLines.join('\n');
  let out = text;
  try { out = applyBadge(out, 'status', st, BOARD_STATE_COLOR[st]); } catch (_) {}
  try { out = applyKV(out, 'Status', st); } catch (_) {}
  return out.split('\n');
}

// ---------- public ----------

function apply(text, ops) {
  let out = String(text);
  for (const e of ops || []) {
    switch (e.op) {
      case 'badge':
        out = applyBadge(out, e.label, e.value, e.color);
        break;
      case 'kv':
        out = applyKV(out, e.key, e.value);
        break;
      case 'label':
        out = applyLabelBlock(out, e.label, e.value);
        break;
      case 'section':
        out = applyHeadingSection(out, e.heading, e.value);
        break;
      case 'projectState':
        out = applyProjectState(out, e.title, e.state);
        break;
      case 'check':
        out = applyCheck(out, e.text, e.done);
        break;
      case 'taskKV':
        out = applyTaskKV(out, e.taskId, e.key, e.value);
        break;
      case 'taskBadge':
        out = applyTaskBadge(out, e.taskId, e.label, e.value, e.color);
        break;
      case 'taskLabel':
        out = applyTaskLabel(out, e.taskId, e.label, e.value);
        break;
      case 'taskCheck':
        out = applyTaskCheck(out, e.taskId, e.text, e.done);
        break;
      case 'task':
        out = applyTask(out, e.taskId, e.workflow);
        break;
      default:
        throw new Error(`unknown op "${e.op}"`);
    }
  }
  return out;
}

module.exports = {
  apply,
  WORKFLOW_NAMES,
  BOARD_STATES,
  PRIORITY_VALUES,
  STATE_COLOR: {
    Planning: '6e7781', Ready: '1f6feb', Active: '238636', Blocked: 'da3633',
    Review: '8250df', Paused: 'd29922', Complete: '238636', Archived: '6e7781',
  },
  BOARD_STATE_COLOR,
  WORKFLOW_COLOR,
};