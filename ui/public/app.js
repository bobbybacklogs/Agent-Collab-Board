'use strict';

(function () {
  const $ = (sel, root = document) => root.querySelector(sel);

  const els = {
    repo: $('#repo'),
    live: $('#live'),
    liveText: $('#liveText'),
    updated: $('#updated'),
    page: $('#page'),
    crumbs: $('#crumbs'),
    sidePages: $('#sidePages'),
    sidebar: $('#sidebar'),
    taskOverlay: $('#taskOverlay'),
    taskBody: $('#taskBody'),
    taskClose: $('#taskClose'),
    cmdOverlay: $('#cmdOverlay'),
    cmdInput: $('#cmdInput'),
    cmdResults: $('#cmdResults'),
    toast: $('#toast'),
    themeBtn: $('#themeBtn'),
    openSearch: $('#openSearch'),
    sidebarToggle: $('#sidebarToggle'),
  };

  const BOARD_STATES = ['Planning', 'Ready', 'Active', 'Blocked', 'Review', 'Paused', 'Complete', 'Archived'];
  const DEFAULT_STATES = ['Planning', 'Ready', 'Active', 'Blocked', 'Review'];
  const PRIO_VALUES = ['Low', 'Medium', 'High', 'Critical'];
  const WORKFLOW_ORDER = ['Backlog', 'Ready', 'In Progress', 'Blocked', 'Review', 'Done'];
  const STATE_COLOR = {
    Planning: '#787774', Ready: '#2383e2', Active: '#0f7b6c', Blocked: '#e03e3e',
    Review: '#9065b0', Paused: '#d9730d', Complete: '#0f7b6c', Archived: '#9b9a97',
  };
  const PRIO_COLOR = { Low: '#9b9a97', Medium: '#d9730d', High: '#e03e3e', Critical: '#c4554d' };
  const WF_COLOR = {
    Backlog: '#9b9a97', Ready: '#2383e2', 'In Progress': '#d9730d',
    Blocked: '#e03e3e', Review: '#9065b0', Done: '#0f7b6c',
  };
  const STORE_KEY = 'uib.cols.v1';
  const THEME_KEY = 'uib.theme.v1';
  const STATE_BADGE = {
    Planning: '6e7781', Ready: '1f6feb', Active: '238636', Blocked: 'da3633',
    Review: '8250df', Paused: 'd29922', Complete: '238636', Archived: '6e7781',
  };
  const PRIO_BADGE = { Low: '8b949e', Medium: 'd29922', High: 'f85149', Critical: 'da3633' };

  let data = null;
  let route = { name: 'board' };
  let currentSlug = null;
  let currentTask = null;
  let skipClick = false;
  let cmdIndex = 0;
  let cmdItems = [];
  let projectView = 'board';

  function defaultCols() {
    const states = {};
    for (const s of BOARD_STATES) states[s] = DEFAULT_STATES.includes(s);
    return { states };
  }
  function loadCols() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORE_KEY) || '');
      if (parsed && parsed.states) return { states: parsed.states };
    } catch (_) { /* ignore */ }
    return defaultCols();
  }
  const cols = loadCols();
  function saveCols() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(cols)); } catch (_) { /* ignore */ }
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function parseBadge(url) {
    const m = String(url || '').match(/\/badge\/([^)#]+)$/);
    if (!m) return null;
    const seg = m[1];
    const dash = seg.lastIndexOf('-');
    if (dash < 0) return null;
    const color = seg.slice(dash + 1);
    const rest = decodeURIComponent(seg.slice(0, dash));
    const first = rest.indexOf('-');
    if (first < 0) return null;
    return { label: rest.slice(0, first).toLowerCase(), value: rest.slice(first + 1), color };
  }
  function findBadge(badges, label) {
    for (const u of badges || []) {
      const b = parseBadge(u);
      if (b && b.label === label) return b;
    }
    return null;
  }
  function chip(badge) {
    if (!badge) return '';
    const c = '#' + badge.color;
    return `<span class="chip"><span class="sw" style="background:${c}"></span>${esc(badge.value)}</span>`;
  }
  function slugOfProjectRef(ref) {
    return String(ref || '').replace(/^projects\//, '').replace(/\.md$/, '').trim();
  }
  function projectDetail(slug) {
    return (data && data.projects || []).find((p) => p.slug === slug) || null;
  }
  function boardCard(slug) {
    for (const sec of (data && data.board && data.board.sections) || []) {
      for (const card of sec.projects || []) {
        if (slugOfProjectRef(card.refs.project) === slug) return card;
      }
    }
    return null;
  }
  function allProjects() {
    const out = [];
    for (const sec of (data && data.board && data.board.sections) || []) {
      for (const card of sec.projects || []) {
        out.push({ card, state: sec.state, slug: slugOfProjectRef(card.refs.project) });
      }
    }
    return out;
  }
  function itemsSummary(crit) {
    if (crit && crit.items) return crit;
    return { items: [], done: 0, total: 0, pct: 0 };
  }
  function fmtTime(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  function visibleStates() {
    return BOARD_STATES.filter((s) => cols.states[s]);
  }

  let toastTimer = null;
  function toast(msg) {
    els.toast.hidden = false;
    els.toast.textContent = msg;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { els.toast.hidden = true; }, 2400);
  }

  async function postWrite(file, ops) {
    if (!ops.length) return;
    const resp = await fetch('/api/write', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file, ops }),
    });
    let body = {};
    try { body = await resp.json(); } catch (_) { /* ignore */ }
    if (!resp.ok || !body.ok) throw new Error(body.error || `write failed (HTTP ${resp.status})`);
  }

  function setLive(on) {
    els.live.classList.toggle('on', !!on);
    els.live.classList.toggle('off', !on);
    els.liveText.textContent = on ? 'Live' : 'Offline';
  }

  function parseHash() {
    const raw = (location.hash || '#/board').replace(/^#/, '');
    const parts = raw.split('/').filter(Boolean);
    if (parts[0] === 'project' && parts[1]) return { name: 'project', slug: parts[1] };
    if (parts[0] === 'tasks') return { name: 'tasks' };
    if (parts[0] === 'activity') return { name: 'activity' };
    return { name: 'board' };
  }
  function go(hash) {
    if (location.hash !== hash) location.hash = hash;
    else { route = parseHash(); render(); }
  }

  function renderCrumbs() {
    const bits = ['<a href="#/board">Agent Collab</a>'];
    if (route.name === 'board') bits.push('<span class="sep">/</span><span>Board</span>');
    if (route.name === 'tasks') bits.push('<span class="sep">/</span><span>All tasks</span>');
    if (route.name === 'activity') bits.push('<span class="sep">/</span><span>Activity</span>');
    if (route.name === 'project') {
      const p = projectDetail(route.slug);
      const title = (p && p.project && (p.project.title || p.project.slug)) || route.slug;
      bits.push(`<span class="sep">/</span><span>${esc(title)}</span>`);
    }
    els.crumbs.innerHTML = bits.join('');
  }

  function renderSidebar() {
    document.querySelectorAll('.side-link').forEach((a) => {
      a.classList.toggle('active', a.dataset.route === route.name);
    });
    const pages = allProjects();
    els.sidePages.innerHTML = pages.map(({ card, state, slug }) => `
      <a class="page-link ${route.name === 'project' && route.slug === slug ? 'active' : ''}" href="#/project/${esc(slug)}">
        <span class="dot" style="background:${STATE_COLOR[state] || '#9b9a97'}"></span>
        <span class="name">${esc(card.name)}</span>
      </a>`).join('') || '<div class="empty">No projects</div>';
  }

  function renderHeader() {
    els.repo.textContent = data && data.server ? data.server.repo : '';
    els.updated.textContent = data && data.generatedAt ? fmtTime(data.generatedAt) : '';
  }

  function focusFields() {
    return (data && data.board && data.board.focus) || {};
  }

  function renderBoardPage() {
    const f = focusFields();
    const o = (data && data.board && data.board.overview) || {};
    const vis = visibleStates();
    els.page.className = 'page wide';
    els.page.innerHTML = `
      <div class="page-icon">▦</div>
      <h1 class="page-title">Board</h1>
      <p class="page-lede">Markdown-native portfolio for humans and agents. Drag a project between columns to change its board state.</p>
      <div class="props">
        <div class="prop"><div class="k">Focus</div><div class="v">${esc(f['Primary Project'] || '—')}</div></div>
        <div class="prop"><div class="k">Next action</div><div class="v">${esc(f['Next Action'] || '—')}</div></div>
        <div class="prop"><div class="k">Projects</div><div class="v">${esc(o['Total Projects'] || '0')}</div></div>
      </div>
      <div class="callout">
        <div class="k">Current objective</div>
        <div class="v">${esc(f['Current Objective'] || 'No current focus set.')}</div>
      </div>
      <div class="toolbar">
        <h2>Projects</h2>
        <button class="tool ${projectView === 'board' ? 'primary' : ''}" data-view="board" type="button">Board</button>
        <button class="tool ${projectView === 'table' ? 'primary' : ''}" data-view="table" type="button">Table</button>
        <span class="grow"></span>
        <button class="tool" id="colsToggle" type="button">Columns</button>
        <span class="hint" id="colsHint"></span>
      </div>
      <div id="colsPop" class="cmd-results" hidden></div>
      <div id="boardMount"></div>`;
    $('#colsHint').textContent = `${vis.length} columns`;
    if (projectView === 'table') renderProjectTable($('#boardMount'));
    else renderProjectBoard($('#boardMount'));
  }

  function renderProjectBoard(mount) {
    mount.innerHTML = '';
    const board = document.createElement('section');
    board.className = 'board';
    board.setAttribute('aria-label', 'Projects by state');
    const vis = visibleStates();
    if (!vis.length) {
      mount.innerHTML = '<div class="empty">All columns hidden.</div>';
      return;
    }
    for (const state of vis) {
      const sec = ((data && data.board && data.board.sections) || []).find((s) => s.state === state);
      const cards = (sec && sec.projects) || [];
      const col = document.createElement('div');
      col.className = 'col';
      col.dataset.state = state;
      col.innerHTML = `<div class="col-head"><span class="swatch" style="background:${STATE_COLOR[state]}"></span>${esc(state)}<span class="count">${cards.length}</span></div>`;
      const body = document.createElement('div');
      body.className = 'col-body';
      if (!cards.length) body.innerHTML = '<div class="empty">Empty</div>';
      for (const card of cards) body.appendChild(projectCardEl(card, state));
      col.appendChild(body);
      enableDrop(col, async (payload) => {
        if (payload.kind !== 'project') return;
        await moveProject(payload.slug, payload.title, state);
      });
      board.appendChild(col);
    }
    mount.appendChild(board);
  }

  function projectCardEl(card, state) {
    const slug = slugOfProjectRef(card.refs.project);
    const pr = projectDetail(slug);
    const obj = (pr && pr.project && pr.project.objective) || '';
    let taskCount = 0;
    const tb = pr && pr.taskBoard;
    if (tb && tb.workflows) {
      for (const w of WORKFLOW_ORDER) taskCount += (tb.workflows[w] || []).length;
    }
    const el = document.createElement('article');
    el.className = 'pcard';
    el.draggable = true;
    el.dataset.slug = slug;
    el.dataset.title = card.name;
    el.dataset.kind = 'project';
    el.innerHTML = `
      <h3>${esc(card.name)}</h3>
      <div class="num">${esc(slug)}</div>
      <div class="obj">${esc(obj)}</div>
      <div class="meta">${chip(findBadge(card.badges, 'priority'))}${chip(findBadge(card.badges, 'progress'))}
        ${taskCount ? `<span class="tasks-pill">${taskCount} tasks</span>` : ''}</div>`;
    enableDrag(el, { kind: 'project', slug, title: card.name, from: state });
    el.addEventListener('click', () => {
      if (skipClick) return;
      go(`#/project/${slug}`);
    });
    return el;
  }

  function renderProjectTable(mount) {
    const rows = allProjects().map(({ card, state, slug }) => {
      const pr = projectDetail(slug);
      const prio = findBadge(card.badges, 'priority');
      return `<tr data-slug="${esc(slug)}">
        <td>${esc(card.name)}</td>
        <td>${esc(state)}</td>
        <td>${prio ? esc(prio.value) : ''}</td>
        <td>${esc((pr && pr.project && pr.project.current && pr.project.current.nextAction) || '')}</td>
      </tr>`;
    }).join('');
    mount.innerHTML = `<table class="table"><thead><tr><th>Name</th><th>Status</th><th>Priority</th><th>Next action</th></tr></thead><tbody>${rows || ''}</tbody></table>`;
    mount.querySelectorAll('tr[data-slug]').forEach((tr) => {
      tr.addEventListener('click', () => go(`#/project/${tr.dataset.slug}`));
    });
  }

  async function moveProject(slug, title, state) {
    const current = allProjects().find((p) => p.slug === slug);
    if (current && current.state === state) return;
    try {
      await postWrite('BOARD.md', [{ op: 'projectState', title, state }]);
      const ops = [
        { op: 'kv', key: 'Status', value: state },
        { op: 'badge', label: 'status', value: state.toLowerCase(), color: STATE_BADGE[state] },
      ];
      try { await postWrite(`projects/${slug}.md`, ops); } catch (_) { /* kv may not exist */ }
      toast(`Moved to ${state}`);
      await refresh();
    } catch (err) {
      toast(`Move failed: ${err.message}`);
    }
  }

  function renderProjectPage() {
    const slug = route.slug;
    currentSlug = slug;
    const pr = projectDetail(slug);
    const p = pr && pr.project;
    if (!p) {
      els.page.className = 'page';
      els.page.innerHTML = `<h1 class="page-title">Missing project</h1><p class="page-lede">No file for ${esc(slug)}.</p>`;
      return;
    }
    const card = boardCard(slug);
    const state = (allProjects().find((x) => x.slug === slug) || {}).state || '';
    const cur = p.current || {};
    const ov = p.overview || {};
    const crit = p.successCriteria || [];
    els.page.className = 'page wide';
    els.page.innerHTML = `
      <div class="page-icon">📄</div>
      <h1 class="page-title">${esc(p.title || p.slug)}</h1>
      <p class="page-lede">${esc(p.objective || '')}</p>
      <div class="props">
        <div class="prop"><div class="k">Status</div><div class="v">${esc(ov.Status || state)}</div></div>
        <div class="prop"><div class="k">Priority</div><div class="v">${esc(ov.Priority || '')}</div></div>
        <div class="prop"><div class="k">Owner</div><div class="v">${esc(ov.Owner || '')}</div></div>
        <div class="prop"><div class="k">Updated</div><div class="v">${esc(ov['Last Updated'] || '')}</div></div>
      </div>
      <div class="toolbar">
        <button class="tool primary" id="editProject" type="button">Edit</button>
        <span class="grow"></span>
        <span class="hint">projects/${esc(slug)}.md</span>
      </div>
      ${cur.nextAction ? `<div class="callout"><div class="k">Next action</div><div class="v">${esc(cur.nextAction)}</div></div>` : ''}
      <div class="section"><h3>Current state</h3><p class="body-text">${esc(cur.summary || cur.focus || '')}</p></div>
      <div class="section"><h3>Success criteria (${crit.filter((c) => c.done).length}/${crit.length})</h3>${checklist(crit)}</div>
      <div class="toolbar"><h2>Tasks</h2><span class="grow"></span><span class="hint">Drag cards to change workflow</span></div>
      <div id="taskBoard"></div>
      ${p.decisions && p.decisions.length ? `<div class="section"><h3>Decisions</h3>${kvTable(p.decisions)}</div>` : ''}
      ${p.risks && p.risks.length ? `<div class="section"><h3>Risks</h3>${kvTable(p.risks)}</div>` : ''}`;
    renderTaskBoard($('#taskBoard'), slug, pr.taskBoard);
    $('#editProject').addEventListener('click', () => renderProjectEditor());
  }

  function checklist(items) {
    if (!items || !items.length) return '<p class="body-text">None</p>';
    return `<ul class="checklist">${items.map((i) => `<li class="${i.done ? 'done' : ''}"><span class="box">${i.done ? '✓' : ''}</span><span class="txt">${esc(i.text)}</span></li>`).join('')}</ul>`;
  }
  function kvTable(rows) {
    if (!rows || !rows.length) return '';
    const keys = Object.keys(rows[0]).filter((k) => k.trim());
    return `<table class="flat"><thead><tr>${keys.map((k) => `<th>${esc(k)}</th>`).join('')}</tr></thead><tbody>${rows
      .map((r) => `<tr>${keys.map((k) => `<td>${esc(r[k] || '')}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  }

  function renderTaskBoard(mount, slug, taskBoard) {
    const board = document.createElement('section');
    board.className = 'board';
    for (const w of WORKFLOW_ORDER) {
      const tasks = (taskBoard && taskBoard.workflows && taskBoard.workflows[w]) || [];
      const col = document.createElement('div');
      col.className = 'col';
      col.dataset.workflow = w;
      col.innerHTML = `<div class="col-head"><span class="swatch" style="background:${WF_COLOR[w]}"></span>${esc(w)}<span class="count">${tasks.length}</span></div>`;
      const body = document.createElement('div');
      body.className = 'col-body';
      if (!tasks.length) body.innerHTML = '<div class="empty">Empty</div>';
      for (const t of tasks) body.appendChild(taskCardEl(slug, t, w));
      col.appendChild(body);
      enableDrop(col, async (payload) => {
        if (payload.kind !== 'task') return;
        await moveTask(payload.slug, payload.id, w);
      });
      board.appendChild(col);
    }
    mount.innerHTML = '';
    mount.appendChild(board);
  }

  function taskCardEl(slug, t, workflow) {
    const crit = itemsSummary(t.criteria);
    const el = document.createElement('article');
    el.className = 'tcard';
    el.draggable = true;
    el.dataset.kind = 'task';
    el.innerHTML = `
      <div class="tid">${esc(t.id)}</div>
      <div class="t-title">${esc(t.title)}</div>
      <div class="meta">${chip(findBadge(t.badges, 'priority'))}
        <span class="tasks-pill">${crit.done}/${crit.total}</span></div>`;
    enableDrag(el, { kind: 'task', slug, id: t.id, from: workflow });
    el.addEventListener('click', () => {
      if (skipClick) return;
      openTask(slug, t.id);
    });
    return el;
  }

  async function moveTask(slug, id, workflow) {
    const current = findTaskWorkflow(slug, id);
    if (current === workflow) return;
    try {
      await postWrite(`tasks/${slug}-tasks.md`, [{ op: 'task', taskId: id, workflow }]);
      toast(`${id} → ${workflow}`);
      await refresh();
      if (els.taskOverlay.classList.contains('open')) openTask(slug, id);
    } catch (err) {
      toast(`Move failed: ${err.message}`);
    }
  }

  function renderAllTasks() {
    els.page.className = 'page wide';
    els.page.innerHTML = `
      <div class="page-icon">☰</div>
      <h1 class="page-title">All tasks</h1>
      <p class="page-lede">Every task across projects, grouped by workflow. Drag to move; the write lands in that project's task board.</p>
      <div id="taskBoard"></div>`;
    const merged = {};
    for (const w of WORKFLOW_ORDER) merged[w] = [];
    for (const { slug, card } of allProjects()) {
      const pr = projectDetail(slug);
      const tb = pr && pr.taskBoard;
      if (!tb || !tb.workflows) continue;
      for (const w of WORKFLOW_ORDER) {
        for (const t of tb.workflows[w] || []) {
          merged[w].push({ ...t, _slug: slug, _project: card.name });
        }
      }
    }
    const mount = $('#taskBoard');
    const board = document.createElement('section');
    board.className = 'board';
    for (const w of WORKFLOW_ORDER) {
      const tasks = merged[w];
      const col = document.createElement('div');
      col.className = 'col';
      col.innerHTML = `<div class="col-head"><span class="swatch" style="background:${WF_COLOR[w]}"></span>${esc(w)}<span class="count">${tasks.length}</span></div>`;
      const body = document.createElement('div');
      body.className = 'col-body';
      if (!tasks.length) body.innerHTML = '<div class="empty">Empty</div>';
      for (const t of tasks) {
        const el = taskCardEl(t._slug, t, w);
        const sub = document.createElement('div');
        sub.className = 'num';
        sub.textContent = t._project;
        el.insertBefore(sub, el.querySelector('.t-title'));
        body.appendChild(el);
      }
      col.appendChild(body);
      enableDrop(col, async (payload) => {
        if (payload.kind !== 'task') return;
        await moveTask(payload.slug, payload.id, w);
      });
      board.appendChild(col);
    }
    mount.appendChild(board);
  }

  function renderActivity() {
    const act = (data && data.board && data.board.activity) || [];
    els.page.className = 'page';
    els.page.innerHTML = `
      <div class="page-icon">◷</div>
      <h1 class="page-title">Activity</h1>
      <p class="page-lede">Portfolio-level changes recorded in BOARD.md.</p>
      <div class="activity">${act.length
        ? act.map((r) => `<div class="row"><div class="when">${esc(r.Date || '')}</div><div>${esc(r.Change || '')}</div></div>`).join('')
        : '<div class="empty">No activity recorded.</div>'}</div>`;
  }

  function renderProjectEditor() {
    const slug = route.slug;
    const pr = projectDetail(slug);
    const p = pr && pr.project;
    const card = boardCard(slug);
    if (!p) return;
    const status = (p.overview && p.overview.Status) || '';
    const priority = (p.overview && p.overview.Priority) || '';
    const progress = (p.overview && p.overview.Progress) || '';
    const cur = p.current || {};
    els.page.className = 'page';
    els.page.innerHTML = `
      <h1 class="page-title">Edit project</h1>
      <p class="page-lede">projects/${esc(slug)}.md — surgical writes only.</p>
      <div class="field"><label>Status</label><select id="pe-status">${BOARD_STATES.map((s) => `<option ${s === status ? 'selected' : ''}>${esc(s)}</option>`).join('')}</select></div>
      <div class="field"><label>Priority</label><select id="pe-priority">${PRIO_VALUES.map((s) => `<option ${s === priority ? 'selected' : ''}>${esc(s)}</option>`).join('')}</select></div>
      <div class="field"><label>Progress</label><select id="pe-progress">${[0,10,20,30,40,50,60,70,80,90,100].map((n) => {
        const label = `${n}%`;
        return `<option value="${label}" ${String(progress).replace(/[^0-9]/g, '') === String(n) ? 'selected' : ''}>${label}</option>`;
      }).join('')}</select></div>
      <div class="field"><label>Objective</label><textarea id="pe-objective" rows="3">${esc(p.objective || '')}</textarea></div>
      <div class="field"><label>Current Focus</label><textarea id="pe-focus" rows="2">${esc(cur.focus || '')}</textarea></div>
      <div class="field"><label>Next Action</label><textarea id="pe-next" rows="2">${esc(cur.nextAction || '')}</textarea></div>
      <div class="field"><label>Success criteria</label><div class="crits" id="pe-criteria">${(p.successCriteria || []).map((it, i) => `<label class="crit"><input type="checkbox" data-idx="${i}" ${it.done ? 'checked' : ''}><span class="txt">${esc(it.text)}</span></label>`).join('')}</div></div>
      <div class="form-actions"><button class="plain" id="pe-cancel" type="button">Cancel</button><button class="apply" id="pe-save" type="button">Save</button></div>`;
    $('#pe-cancel').addEventListener('click', () => renderProjectPage());
    $('#pe-save').addEventListener('click', saveProjectEditor);
  }

  async function saveProjectEditor() {
    const slug = route.slug;
    const pr = projectDetail(slug);
    const p = pr.project;
    const card = boardCard(slug);
    const f = {
      status: $('#pe-status').value,
      priority: $('#pe-priority').value,
      progress: $('#pe-progress').value,
      objective: $('#pe-objective').value.trim(),
      focus: $('#pe-focus').value.trim(),
      next: $('#pe-next').value.trim(),
    };
    const cur = p.current || {};
    const ops = [];
    if (p.overview && 'Status' in p.overview) ops.push({ op: 'kv', key: 'Status', value: f.status });
    if (p.overview && 'Priority' in p.overview) ops.push({ op: 'kv', key: 'Priority', value: f.priority });
    if (p.overview && 'Progress' in p.overview) ops.push({ op: 'kv', key: 'Progress', value: f.progress });
    if (p.objective !== f.objective) ops.push({ op: 'section', heading: 'Objective', value: f.objective });
    if ((cur.focus || '') !== f.focus) ops.push({ op: 'label', label: 'Current Focus', value: f.focus });
    if ((cur.nextAction || '') !== f.next) ops.push({ op: 'label', label: 'Next Action', value: f.next });
    $('#pe-criteria').querySelectorAll('input').forEach((box, i) => {
      const item = p.successCriteria[i];
      if (item && item.done !== box.checked) ops.push({ op: 'check', text: item.text, done: box.checked });
    });
    const bOps = [];
    const currentState = (allProjects().find((x) => x.slug === slug) || {}).state;
    if (card && currentState !== f.status) bOps.push({ op: 'projectState', title: card.name, state: f.status });
    try {
      if (ops.length) await postWrite(`projects/${slug}.md`, ops);
      if (bOps.length) await postWrite('BOARD.md', bOps);
      toast('Project saved');
      await refresh();
      renderProjectPage();
    } catch (err) {
      toast(`Save failed: ${err.message}`);
    }
  }

  function findTask(slug, id) {
    const pr = projectDetail(slug);
    const tb = pr && pr.taskBoard;
    if (!tb || !tb.workflows) return null;
    for (const w of WORKFLOW_ORDER) {
      const found = (tb.workflows[w] || []).find((t) => t.id === id);
      if (found) return found;
    }
    return null;
  }
  function findTaskWorkflow(slug, id) {
    const pr = projectDetail(slug);
    const tb = pr && pr.taskBoard;
    if (!tb || !tb.workflows) return '';
    for (const w of WORKFLOW_ORDER) {
      if ((tb.workflows[w] || []).some((t) => t.id === id)) return w;
    }
    return '';
  }

  function openTask(slug, id) {
    currentTask = { slug, id };
    const t = findTask(slug, id);
    if (!t) {
      els.taskBody.innerHTML = `<h2>Missing task</h2><p class="body-text">${esc(id)}</p>`;
      els.taskOverlay.classList.add('open');
      return;
    }
    const crit = itemsSummary(t.criteria);
    const val = itemsSummary(t.validation);
    els.taskBody.innerHTML = `
      <div class="detail-head"><div><h2>${esc(t.title)}</h2><div class="sub">${esc(t.id)} · ${esc(slug)}</div></div>
        <button class="editbtn" id="editTask" type="button">Edit</button></div>
      ${section('Goal', t.goal)}
      ${section('Next action', t.nextAction)}
      <div class="section"><h3>Acceptance (${crit.done}/${crit.total})</h3>${checklist(crit.items)}</div>
      <div class="section"><h3>Validation (${val.done}/${val.total})</h3>${checklist(val.items)}</div>
      ${t.blockers && t.blockers.length ? `<div class="section"><h3>Blockers</h3><p class="body-text">${esc(t.blockers.join('; '))}</p></div>` : ''}`;
    els.taskOverlay.classList.add('open');
    $('#editTask').addEventListener('click', renderTaskEditor);
  }
  function section(title, text) {
    if (!text) return '';
    return `<div class="section"><h3>${esc(title)}</h3><p class="body-text">${esc(text)}</p></div>`;
  }

  function renderTaskEditor() {
    const { slug, id } = currentTask;
    const t = findTask(slug, id);
    const wf = findTaskWorkflow(slug, id);
    const priority = (t.fields && t.fields.Priority) || '';
    const crit = itemsSummary(t.criteria);
    const val = itemsSummary(t.validation);
    els.taskBody.innerHTML = `
      <div class="detail-head"><div><h2>Edit ${esc(t.id)}</h2></div></div>
      <div class="field"><label>Workflow</label><select id="te-workflow">${WORKFLOW_ORDER.map((w) => `<option ${w === wf ? 'selected' : ''}>${esc(w)}</option>`).join('')}</select></div>
      <div class="field"><label>Priority</label><select id="te-priority">${PRIO_VALUES.map((v) => `<option ${v === priority ? 'selected' : ''}>${esc(v)}</option>`).join('')}</select></div>
      <div class="field"><label>Goal</label><textarea id="te-goal" rows="3">${esc(t.goal || '')}</textarea></div>
      <div class="field"><label>Next action</label><textarea id="te-next" rows="2">${esc(t.nextAction || '')}</textarea></div>
      <div class="field"><label>Acceptance</label><div class="crits" id="te-criteria">${crit.items.map((it, i) => `<label class="crit"><input type="checkbox" data-idx="${i}" ${it.done ? 'checked' : ''}><span class="txt">${esc(it.text)}</span></label>`).join('')}</div></div>
      <div class="field"><label>Validation</label><div class="crits" id="te-validation">${val.items.map((it, i) => `<label class="crit"><input type="checkbox" data-idx="${i}" ${it.done ? 'checked' : ''}><span class="txt">${esc(it.text)}</span></label>`).join('')}</div></div>
      <div class="form-actions"><button class="plain" id="te-cancel" type="button">Cancel</button><button class="apply" id="te-save" type="button">Save</button></div>`;
    $('#te-cancel').addEventListener('click', () => openTask(slug, id));
    $('#te-save').addEventListener('click', saveTaskEditor);
  }

  async function saveTaskEditor() {
    const { slug, id } = currentTask;
    const t = findTask(slug, id);
    const wf = $('#te-workflow').value;
    const priority = $('#te-priority').value;
    const goal = $('#te-goal').value.trim();
    const next = $('#te-next').value.trim();
    const ops = [];
    if (wf !== findTaskWorkflow(slug, id)) ops.push({ op: 'task', taskId: id, workflow: wf });
    if (t.fields && 'Priority' in t.fields) ops.push({ op: 'taskKV', taskId: id, key: 'Priority', value: priority });
    if ((t.goal || '') !== goal) ops.push({ op: 'taskLabel', taskId: id, label: 'Goal', value: goal });
    if ((t.nextAction || '') !== next) ops.push({ op: 'taskLabel', taskId: id, label: 'Next Action', value: next });
    const crit = itemsSummary(t.criteria).items;
    $('#te-criteria').querySelectorAll('input').forEach((box, i) => {
      if (crit[i] && crit[i].done !== box.checked) ops.push({ op: 'taskCheck', taskId: id, text: crit[i].text, done: box.checked });
    });
    const val = itemsSummary(t.validation).items;
    $('#te-validation').querySelectorAll('input').forEach((box, i) => {
      if (val[i] && val[i].done !== box.checked) ops.push({ op: 'taskCheck', taskId: id, text: val[i].text, done: box.checked });
    });
    try {
      await postWrite(`tasks/${slug}-tasks.md`, ops);
      toast('Task saved');
      await refresh();
      openTask(slug, id);
    } catch (err) {
      toast(`Save failed: ${err.message}`);
    }
  }

  let pointerDrag = null;

  function enableDrag(el, payload) {
    el.addEventListener('dragstart', (e) => {
      el.classList.add('dragging');
      e.dataTransfer.setData('application/json', JSON.stringify(payload));
      e.dataTransfer.effectAllowed = 'move';
    });
    el.addEventListener('dragend', () => {
      el.classList.remove('dragging');
      skipClick = true;
      setTimeout(() => { skipClick = false; }, 80);
    });
    el.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      pointerDrag = { payload, startX: e.clientX, startY: e.clientY, moved: false, el };
    });
  }
  function enableDrop(col, onDrop) {
    col.addEventListener('dragover', (e) => {
      e.preventDefault();
      col.classList.add('drag-over');
    });
    col.addEventListener('dragleave', () => col.classList.remove('drag-over'));
    col.addEventListener('drop', async (e) => {
      e.preventDefault();
      col.classList.remove('drag-over');
      let payload;
      try { payload = JSON.parse(e.dataTransfer.getData('application/json')); } catch (_) { return; }
      await onDrop(payload);
    });
    col._onCardDrop = onDrop;
  }

  document.addEventListener('pointermove', (e) => {
    if (!pointerDrag) return;
    if (!pointerDrag.moved && Math.hypot(e.clientX - pointerDrag.startX, e.clientY - pointerDrag.startY) < 6) return;
    pointerDrag.moved = true;
    pointerDrag.el.classList.add('dragging');
    document.querySelectorAll('.col').forEach((c) => c.classList.remove('drag-over'));
    const over = document.elementFromPoint(e.clientX, e.clientY);
    const col = over && over.closest('.col');
    if (col) col.classList.add('drag-over');
  });
  document.addEventListener('pointerup', async (e) => {
    if (!pointerDrag) return;
    const drag = pointerDrag;
    pointerDrag = null;
    document.querySelectorAll('.col').forEach((c) => c.classList.remove('drag-over'));
    drag.el.classList.remove('dragging');
    if (!drag.moved) return;
    skipClick = true;
    setTimeout(() => { skipClick = false; }, 80);
    const over = document.elementFromPoint(e.clientX, e.clientY);
    const col = over && over.closest('.col');
    if (col && typeof col._onCardDrop === 'function') await col._onCardDrop(drag.payload);
  });

  function renderColsPop(host) {
    host.hidden = !host.hidden;
    if (host.hidden) return;
    host.innerHTML = BOARD_STATES.map((s) => `
      <label class="cmd-item"><input type="checkbox" data-state="${esc(s)}" ${cols.states[s] ? 'checked' : ''}> ${esc(s)}</label>`).join('');
    host.querySelectorAll('input').forEach((input) => {
      input.addEventListener('change', () => {
        cols.states[input.dataset.state] = input.checked;
        saveCols();
        renderBoardPage();
      });
    });
  }

  function searchIndex() {
    const items = [];
    for (const { card, slug, state } of allProjects()) {
      items.push({ kind: 'project', title: card.name, sub: slug + ' · ' + state, href: `#/project/${slug}` });
      const pr = projectDetail(slug);
      const tb = pr && pr.taskBoard;
      if (!tb) continue;
      for (const w of WORKFLOW_ORDER) {
        for (const t of tb.workflows[w] || []) {
          items.push({
            kind: 'task',
            title: `${t.id} ${t.title}`,
            sub: `${card.name} · ${w}`,
            href: `#/project/${slug}`,
            open: () => { go(`#/project/${slug}`); openTask(slug, t.id); },
          });
        }
      }
    }
    return items;
  }
  function openCmd() {
    els.cmdOverlay.classList.add('open');
    els.cmdInput.value = '';
    cmdIndex = 0;
    renderCmd('');
    setTimeout(() => els.cmdInput.focus(), 0);
  }
  function closeCmd() { els.cmdOverlay.classList.remove('open'); }
  function renderCmd(q) {
    const term = q.trim().toLowerCase();
    cmdItems = searchIndex().filter((it) => !term || `${it.title} ${it.sub}`.toLowerCase().includes(term)).slice(0, 20);
    els.cmdResults.innerHTML = cmdItems.map((it, i) => `
      <div class="cmd-item ${i === cmdIndex ? 'active' : ''}" data-i="${i}">
        <span class="kind">${esc(it.kind)}</span>
        <strong>${esc(it.title)}</strong>
        <span class="num">${esc(it.sub)}</span>
      </div>`).join('') || '<div class="empty">No matches</div>';
  }
  function activateCmd(item) {
    closeCmd();
    if (item.open) item.open();
    else go(item.href);
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme === 'dark' ? 'dark' : 'light';
    try { localStorage.setItem(THEME_KEY, document.documentElement.dataset.theme); } catch (_) { /* ignore */ }
  }

  function render() {
    if (!data) return;
    renderHeader();
    renderCrumbs();
    renderSidebar();
    if (route.name === 'project') renderProjectPage();
    else if (route.name === 'tasks') renderAllTasks();
    else if (route.name === 'activity') renderActivity();
    else renderBoardPage();
  }

  function apply(st) {
    data = st;
    if (els.taskOverlay.classList.contains('open') && currentTask && route.name !== 'project') {
      /* keep peek */
    }
    render();
    if (els.taskOverlay.classList.contains('open') && currentTask) openTask(currentTask.slug, currentTask.id);
  }

  async function refresh() {
    const st = await fetch('/api/state').then((r) => r.json());
    apply(st);
  }

  function connectEvents() {
    const es = new EventSource('/events');
    es.onopen = () => setLive(true);
    es.onmessage = (ev) => {
      let msg;
      try { msg = JSON.parse(ev.data); } catch (_) { return; }
      if (msg.event === 'update' && msg.state) { apply(msg.state); toast('Board updated'); }
      else if (msg.event === 'hello' && msg.state && !data) apply(msg.state);
    };
    es.onerror = () => setLive(false);
  }

  els.page.addEventListener('click', (e) => {
    const view = e.target.closest('[data-view]');
    if (view) {
      projectView = view.dataset.view;
      renderBoardPage();
      return;
    }
    if (e.target.closest('#colsToggle')) {
      renderColsPop($('#colsPop'));
    }
  });

  els.taskClose.addEventListener('click', () => els.taskOverlay.classList.remove('open'));
  els.taskOverlay.addEventListener('click', (e) => {
    if (e.target === els.taskOverlay) els.taskOverlay.classList.remove('open');
  });
  els.openSearch.addEventListener('click', openCmd);
  els.cmdOverlay.addEventListener('click', (e) => {
    if (e.target === els.cmdOverlay) closeCmd();
  });
  els.cmdInput.addEventListener('input', () => { cmdIndex = 0; renderCmd(els.cmdInput.value); });
  els.cmdResults.addEventListener('click', (e) => {
    const item = e.target.closest('.cmd-item');
    if (!item) return;
    activateCmd(cmdItems[Number(item.dataset.i)]);
  });
  els.themeBtn.addEventListener('click', () => {
    applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  });
  els.sidebarToggle.addEventListener('click', () => els.sidebar.classList.toggle('collapsed'));
  $('#workspaceBtn').addEventListener('click', () => go('#/board'));

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (els.cmdOverlay.classList.contains('open')) closeCmd();
      else openCmd();
    }
    if (e.key === 'Escape') {
      closeCmd();
      els.taskOverlay.classList.remove('open');
    }
    if (!els.cmdOverlay.classList.contains('open')) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); cmdIndex = Math.min(cmdItems.length - 1, cmdIndex + 1); renderCmd(els.cmdInput.value); }
    if (e.key === 'ArrowUp') { e.preventDefault(); cmdIndex = Math.max(0, cmdIndex - 1); renderCmd(els.cmdInput.value); }
    if (e.key === 'Enter' && cmdItems[cmdIndex]) activateCmd(cmdItems[cmdIndex]);
  });

  window.addEventListener('hashchange', () => { route = parseHash(); render(); });

  try {
    applyTheme(localStorage.getItem(THEME_KEY) || 'light');
  } catch (_) { applyTheme('light'); }

  async function boot() {
    route = parseHash();
    connectEvents();
    try {
      const st = await fetch('/api/state').then((r) => {
        if (!r.ok) throw new Error(r.status + ' ' + r.statusText);
        return r.json();
      });
      if (!data) apply(st);
    } catch (err) {
      setLive(false);
      els.page.innerHTML = `<div class="empty">Could not load state: ${esc(err.message)}</div>`;
    }
  }
  boot();
})();
