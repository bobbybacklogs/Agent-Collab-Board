'use strict';

// Tolerant Markdown parsers for the Agent Collab Board state.
// Handles BOARD.md (portfolio), projects/<slug>.md, and tasks/<slug>-tasks.md.

// ---------- low-level helpers ----------

function clean(s) {
  return String(s == null ? '' : s).trim();
}

function unbacktick(s) {
  return clean(s).replace(/^`+|`+$/g, '');
}

// Split a markdown document into sections keyed by heading level.
function splitSections(text) {
  const lines = String(text || '').split(/\r?\n/);
  const re = /^(#{1,6})\s+(.*)$/;
  const sections = [];
  let current = null;
  for (const line of lines) {
    const m = line.match(re);
    if (m) {
      current = { level: m[1].length, heading: m[2].trim(), text: '' };
      sections.push(current);
    } else if (current) {
      current.text += (current.text ? '\n' : '') + line;
    }
  }
  return sections;
}

function getSection(sections, heading) {
  for (const s of sections) {
    if (s.heading === heading) return s;
  }
  return null;
}

// Parse a markdown table into an array of objects.
function parseTable(text) {
  const rows = [];
  for (const line of String(text || '').split(/\r?\n/)) {
    const t = line.trim();
    if (!t.startsWith('|') || !t.endsWith('|')) continue;
    rows.push(
      t.replace(/^\|/, '').replace(/\|$/, '').split('|').map(clean)
    );
  }
  if (!rows.length) return [];
  const header = rows[0];
  const sep = rows[1];
  const isSep =
    sep && sep.length && sep.length <= 16 && sep.every((c) => /^:?-{2,}:?$/.test(c));
  const start = isSep ? 2 : 1;
  const out = [];
  for (let i = start; i < rows.length; i++) {
    const cells = rows[i];
    const row = {};
    header.forEach((h, j) => {
      if (h && cells[j] !== undefined && cells[j] !== '') row[h] = unbacktick(cells[j]);
    });
    if (Object.keys(row).length) out.push(row);
  }
  return out;
}

// Parse | **Key** | value | rows into an object.
function parseKVTable(text) {
  const out = {};
  for (const line of String(text || '').split(/\r?\n/)) {
    const m = line.trim().match(/^\|\s*\*\*([^*]+)\*\*\s*\|\s*(.*?)\s*\|\s*$/);
    if (m) out[clean(m[1])] = unbacktick(clean(m[2]));
  }
  return out;
}

// Extract bold field/value pairs:  **Field** \n value  or  **Field:** value.
function extractKeyedText(text) {
  const out = {};
  const lines = String(text || '').split(/\r?\n/);
  let cur = null;
  for (const raw of lines) {
    const t = clean(raw);
    if (!t || t === '---') continue;
    let m = t.match(/^\*\*([^*]+)\*\*\s*:?\s*$/);
    if (m) {
      cur = clean(m[1]);
      out[cur] = '';
      continue;
    }
    m = t.match(/^\*\*([^*]+)\*\*\s*:\s*(.+)$/);
    if (m) {
      cur = null;
      const k = clean(m[1]);
      out[k] = (out[k] ? out[k] + ' ' : '') + unbacktick(clean(m[2]));
      continue;
    }
    if (cur) out[cur] = (out[cur] ? out[cur] + ' ' : '') + unbacktick(t);
  }
  return out;
}

function bulletItems(text) {
  const out = [];
  for (const line of String(text || '').split(/\r?\n/)) {
    const m = line.match(/^\s*[-*]\s+(.*)$/);
    if (m) out.push(clean(m[1]));
  }
  return out;
}

function checkItems(text) {
  const out = [];
  for (const line of String(text || '').split(/\r?\n/)) {
    const m = line.match(/^\s*[-*]\s+\[([ xX])\]\s+(.*)$/);
    if (m) out.push({ done: m[1].toLowerCase() === 'x', text: clean(m[2]) });
  }
  return out;
}

// Collect shields.io badge URLs from a block of text.
function badgeUrls(text) {
  const out = [];
  for (const line of String(text || '').split(/\r?\n/)) {
    const m = line.match(/https:\/\/img\.shields\.io\/badge\/[^)\s]+/);
    if (m) out.push(m[0].replace(/[)\s]$/, ''));
  }
  return out;
}

// Extract text after a bold label like **Goal** up to the next heading/bold/hr.
function extractBoldLabel(text, label) {
  const lines = String(text || '').split(/\r?\n/);
  let i = 0;
  for (; i < lines.length; i++) if (clean(lines[i]) === `**${label}**`) break;
  if (i === lines.length) return '';
  i++;
  const out = [];
  for (; i < lines.length; i++) {
    const t = clean(lines[i]);
    if (!t) continue;
    if (/^#{1,6}\s+/.test(t)) break;
    if (t.startsWith('**') && t.endsWith('**')) break;
    if (t === '---') break;
    out.push(unbacktick(t));
  }
  return out.join(' ');
}

// Split body text into subsections headed by "### Title".
function splitBodySections(text) {
  const groups = [];
  let cur = null;
  for (const line of String(text || '').split(/\r?\n/)) {
    const m = line.match(/^###\s+(.*)$/);
    if (m) {
      cur = { title: clean(m[1]), lines: [] };
      groups.push(cur);
    } else if (cur) {
      cur.lines.push(line);
    }
  }
  return groups;
}

// Extract bullet items that appear under a "### Heading" subsection.
function sectionItems(body, heading) {
  for (const g of splitBodySections(body)) {
    if (g.title === heading) return bulletItems(g.lines.join('\n'));
  }
  return [];
}

function itemsSummary(items) {
  const done = items.filter((i) => i.done).length;
  return { items, done, total: items.length, pct: done && items.length ? Math.round((done / items.length) * 100) : 0 };
}

// ---------- BOARD.md ----------

const BOARD_STATES = [
  'Planning',
  'Ready',
  'Active',
  'Blocked',
  'Review',
  'Paused',
  'Complete',
  'Archived',
];

function parseBoardCard(name, body) {
  const nm = unbacktick(clean(name));
  if (/^<.*>$/.test(nm)) return null;
  const card = { name: nm, refs: {}, badges: [] };
  for (const line of String(body || '').split(/\r?\n/)) {
    let m = line.match(/^\*\*Project:\*\*\s+\[[^\]]*\]\(([^)]+)\)/);
    if (m) card.refs.project = clean(m[1]);
    m = line.match(/^\*\*Tasks:\*\*\s+\[[^\]]*\]\(([^)]+)\)/);
    if (m) card.refs.tasks = clean(m[1]);
    const b = line.match(/https:\/\/img\.shields\.io\/badge\/[^)\s]+/);
    if (b) card.badges.push(b[0].replace(/[)\s]$/, ''));
  }
  return card;
}

function parseBoard(text) {
  const sections = splitSections(text);
  const board = {
    overview: {},
    focus: {},
    sections: [],
    priorities: [],
    blockers: [],
    dependencies: [],
    milestones: [],
    reviewQueue: [],
    recentlyCompleted: [],
    activity: [],
  };

  const cardsByState = {};
  let currentState = null;

  for (const s of sections) {
    const h = clean(s.heading);
    if (s.level === 1) {
      if (BOARD_STATES.includes(h)) {
        currentState = h;
        if (!cardsByState[h]) cardsByState[h] = [];
      } else {
        currentState = null;
      }
      continue;
    }
    if (s.level === 2) {
      currentState = null;
      switch (h) {
        case 'Board Overview':
          board.overview = parseKVTable(s.text);
          break;
        case 'Current Focus':
          board.focus = extractKeyedText(s.text);
          break;
        case 'Portfolio Priorities':
          board.priorities = parseTable(s.text);
          break;
        case 'Cross-Project Blockers':
          board.blockers = parseTable(s.text);
          break;
        case 'Cross-Project Dependencies':
          board.dependencies = parseTable(s.text);
          break;
        case 'Upcoming Milestones':
          board.milestones = parseTable(s.text);
          break;
        case 'Review Queue':
          board.reviewQueue = parseTable(s.text);
          break;
        case 'Recently Completed':
          board.recentlyCompleted = parseTable(s.text);
          break;
        case 'Board Activity':
          board.activity = parseTable(s.text);
          break;
      }
      continue;
    }
    if (s.level === 3 && currentState) {
      const card = parseBoardCard(h, s.text);
      if (card) cardsByState[currentState].push(card);
    }
  }

  for (const state of BOARD_STATES) {
    board.sections.push({ state, projects: cardsByState[state] || [] });
  }

  return board;
}

// ---------- PROJECT file ----------

function parseProject(text, slug) {
  const sections = splitSections(text);
  const titleM = String(text).match(/^#\s+(.*)$/m);
  const P = {
    slug,
    title: titleM ? clean(titleM[1]) : slug,
    overview: {},
    currentState: {},
    objective: '',
    successCriteria: [],
    scope: { in: [], out: [] },
    constraints: [],
    deliverables: [],
    milestones: [],
    dependencies: [],
    risks: [],
    decisions: [],
    openQuestions: [],
    activity: [],
  };

  const ov = getSection(sections, 'Project Overview');
  if (ov) P.overview = parseKVTable(ov.text);

  const obj = getSection(sections, 'Objective');
  if (obj) P.objective = clean(obj.text);

  const st = getSection(sections, 'Current State');
  if (st) {
    const ks = extractKeyedText(st.text);
    P.current = {
      summary: ks.Summary || '',
      focus: ks['Current Focus'] || '',
      nextMilestone: ks['Next Milestone'] || '',
      nextAction: ks['Next Action'] || '',
    };
  }

  const sc = getSection(sections, 'Success Criteria');
  if (sc) P.successCriteria = checkItems(sc.text);

  const so = getSection(sections, 'Scope');
  if (so) {
    P.scope.in = sectionItems(so.text, 'In Scope');
    P.scope.out = sectionItems(so.text, 'Out of Scope');
  }

  const de = getSection(sections, 'Deliverables');
  if (de) P.deliverables = parseTable(de.text);

  const mi = getSection(sections, 'Milestones');
  if (mi) P.milestones = parseTable(mi.text);

  const dp = getSection(sections, 'Dependencies');
  if (dp) P.dependencies = bulletItems(dp.text);

  const co = getSection(sections, 'Constraints');
  if (co) P.constraints = bulletItems(co.text);

  const ri = getSection(sections, 'Risks');
  if (ri) P.risks = parseTable(ri.text);

  const dc = getSection(sections, 'Decisions');
  if (dc) P.decisions = parseTable(dc.text);

  const oq = getSection(sections, 'Open Questions');
  if (oq) P.openQuestions = checkItems(oq.text);

  const ac = getSection(sections, 'Activity');
  if (ac) P.activity = parseTable(ac.text);

  return P;
}

// ---------- TASK BOARD ----------

const WORKFLOW_NAMES = ['Backlog', 'Ready', 'In Progress', 'Blocked', 'Review', 'Done'];

function normWorkflow(name) {
  const n = clean(name);
  for (const w of WORKFLOW_NAMES) {
    if (w.toLowerCase() === n.toLowerCase()) return w;
  }
  return null;
}

function parseTaskBlock(title, body) {
  const m = title.match(/^`([^`]+)`\s*(?:[-–—])\s*(.*)$/);
  if (!m) return null;
  const kv = parseKVTable(body);
  if (!kv.ID && !kv.Status) return null;

  const subs = {};
  for (const g of splitBodySections(body)) subs[g.title] = g.lines.join('\n');

const criteria = checkItems(subs['Acceptance Criteria'] || '');
  const validation = checkItems(subs['Validation'] || '');

  return {
    id: m[1],
    title: clean(m[2]),
    fields: kv,
    badges: badgeUrls(body),
    goal: extractBoldLabel(body, 'Goal'),
    criteria: itemsSummary(criteria),
    validation: itemsSummary(validation),
    dependencies: bulletItems(subs.Dependencies || ''),
    blockers: bulletItems(subs.Blockers || ''),
    notes: bulletItems(subs['Implementation Notes'] || ''),
    resources: bulletItems(subs['Files / Resources'] || ''),
    nextAction: subs['Next Action'] ? clean(subs['Next Action']) : '',
  };
}

function parseWorkflows(text) {
  const lines = String(text).split(/\r?\n/);
  const buckets = {};
  for (const w of WORKFLOW_NAMES) buckets[w] = [];

  let curWorkflow = null;
  let curTask = null;

  for (const line of lines) {
    const t = line.trim();
    if (!t.startsWith('#')) {
      if (curTask) curTask.body.push(line);
      continue;
    }
    const tm = t.match(/^###\s+`([^`]+)`\s*(?:[-–—])\s*(.*)$/);
    if (tm && curWorkflow) {
      curTask = { title: t.replace(/^###\s+/, '').trim(), body: [] };
      buckets[curWorkflow].push(curTask);
      continue;
    }
    if (t.startsWith('###')) {
      // Level-3 subsection heading inside a task (e.g. ### Acceptance Criteria).
      if (curTask) curTask.body.push(line);
      continue;
    }
    if (t.startsWith('##')) {
      curWorkflow = null;
      curTask = null;
      continue;
    }
    // Level-1 heading
    const w = normWorkflow(t.replace(/^#\s+/, ''));
    curWorkflow = w;
    curTask = null;
  }

  const out = {};
  for (const w of WORKFLOW_NAMES) {
    out[w] = buckets[w]
      .map((b) => parseTaskBlock(b.title, b.body.join('\n')))
      .filter(Boolean);
  }
  return out;
}

function parseTaskBoard(text) {
  const sections = splitSections(text);
  const overviewSec = getSection(sections, 'Task Board Overview');
  const progressSec = getSection(sections, 'Progress');

  const progress =
    progressSec && progressSec.text
      ? {
          completion: progressSec.text.includes('**Completion')
            ? (() => {
                const m = progressSec.text.match(/\*\*Completion:\*\*\s*`?([\d.]+)%/);
                return m ? Number(m[1]) : null;
              })()
            : null,
          table: parseTable(progressSec.text),
        }
      : null;

  return {
    overview: overviewSec ? parseKVTable(overviewSec.text) : {},
    workflows: parseWorkflows(text),
    progress,
  };
}

module.exports = {
  parseBoard,
  parseProject,
  parseTaskBoard,
};