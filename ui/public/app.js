'use strict';

(function () {
  const $ = (sel) => document.querySelector(sel);

  const els = {
    repo: $('#repo'),
    live: $('#live'),
    liveText: $('#liveText'),
    updated: $('#updated'),
    focusBody: $('#focus-body'),
    countsBody: $('#counts-body'),
    auxBody: $('#aux-body'),
    board: $('#board'),
    colsBtn: $('#colsBtn'),
    colsCount: $('#colsCount'),
    colsHint: $('#colsHint'),
    colsPop: $('#colsPop'),
    addColBtn: $('#addColBtn'),
    drawerOverlay: $('#drawerOverlay'),
    drawerBody: $('#drawerBody'),
    drawerClose: $('#drawerClose'),
    taskOverlay: $('#taskOverlay'),
    taskBody: $('#taskBody'),
    taskClose: $('#taskClose'),
    customOverlay: $('#customOverlay'),
    customModal: $('#customModal'),
    customBody: $('#customBody'),
    customClose: $('#customClose'),
    toast: $('#toast'),
  };

  const BOARD_STATES = ['Planning', 'Ready', 'Active', 'Blocked', 'Review', 'Paused', 'Complete', 'Archived'];
  const DEFAULT_STATES = ['Planning', 'Ready', 'Active', 'Blocked', 'Review'];
  const PRIO_VALUES = ['Low', 'Medium', 'High', 'Critical'];
  const WORKFLOW_ORDER = ['Backlog', 'Ready', 'In Progress', 'Blocked', 'Review', 'Done'];
  const STATE_COLOR = {
    Planning: '#6e7781', Ready: '#1f6feb', Active: '#238636', Blocked: '#da3633',
    Review: '#8250df', Paused: '#d29922', Complete: '#238636', Archived: '#6e7781',
  };
  const PRIO_COLOR = { Low: '#8b949e', Medium: '#d29922', High: '#f85149', Critical: '#da3633' };
  const PALETTE = ['#6e7781', '#1f6feb', '#238636', '#da3633', '#8250df', '#d29922', '#f85149', '#3fb950', '#79b8ff', '#8b949e'];
  const WF_COLOR = {
    Backlog: '#8b949e', Ready: '#1f6feb', 'In Progress': '#d29922',
    Blocked: '#da3633', Review: '#8250df', Done: '#238636',
  };
  const STORE_KEY = 'uib.cols.v1';
  const EDIT_KEY = 'uib.editing.v1';

  let data = null;
  let currentSlug = null;
  let currentTask = null;
  let draftCol = null;
  let stateBySlug = {};
  let editing = false;

  function editingSlotKey() {
    return { slug: currentSlug, task: currentTask ? currentTask.id : null };
  }

  function saveEditing(mode) {
    try {
      const key = editingSlotKey();
      localStorage.setItem(EDIT_KEY, JSON.stringify({ mode, key, ts: Date.now() }));
    } catch (err) { /* ignore */ }
  }

  function clearEditing() {
    try { localStorage.removeItem(EDIT_KEY); } catch (err) { /* ignore */ }
  }

  // ---------- column config ----------

  function defaultCols() {
    const states = {};
    for (const s of BOARD_STATES) states[s] = DEFAULT_STATES.includes(s);
    return { states, custom: [] };
  }

  function loadCols() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.states && Array.isArray(parsed.custom)) return parsed;
      }
    } catch (err) { /* ignore */ }
    return defaultCols();
  }

  function saveCols() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(cols));
    } catch (err) { /* ignore */ }
  }

  const cols = loadCols();

  function visibleCols() {
    const out = [];
    for (const s of BOARD_STATES) {
      if (cols.states[s]) out.push({ kind: 'state', key: s, title: s, color: STATE_COLOR[s] });
    }
    for (const c of cols.custom) {
      if (c.visible !== false) out.push({ kind: 'custom', key: 'custom:' + c.id, title: c.name, color: c.color, custom: c });
    }
    return out;
  }

  function hiddenProjectsCount() {
    if (!data || !data.board) return 0;
    let n = 0;
    for (const sec of data.board.sections || []) {
      if (!cols.states[sec.state]) n += (sec.projects || []).length;
    }
    return n;
  }

  // ---------- helpers ----------

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function isOpen(overlay) { return overlay.classList.contains('open'); }

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
    return `<span class="chip" style="--c:${c}"><span class="sw" style="background:${c}"></span>${esc(badge.value)}</span>`;
  }

  function slugOfProjectRef(ref) {
    return String(ref || '').replace(/^projects\//, '').replace(/\.md$/, '').trim();
  }

  function projectDetail(slug) {
    if (!data || !data.projects) return null;
    return data.projects.find((p) => p.slug === slug) || null;
  }

  function boardCard(slug) {
    if (!data || !data.board || !data.board.sections) return null;
    for (const sec of data.board.sections) {
      for (const card of sec.projects || []) {
        if (slugOfProjectRef(card.refs.project) === slug) return card;
      }
    }
    return null;
  }

  function fmtTime(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  function itemsOr(items, fallback) {
    if (items && Array.isArray(items.items)) return items;
    return fallback || { items: [], done: 0, total: 0, pct: 0 };
  }

  // ---------- toast ----------

  let toastTimer = null;
  function toast(msg) {
    els.toast.hidden = false;
    els.toast.textContent = msg;
    els.toast.classList.remove('hide');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      els.toast.classList.add('hide');
      setTimeout(() => { els.toast.hidden = true; }, 350);
    }, 2600);
  }

  // ---------- header / status ----------

  function setLive(on) {
    if (!els.live) return;
    els.live.classList.toggle('on', !!on);
    els.live.classList.toggle('off', !on);
    els.liveText.textContent = on ? 'Live' : 'Offline';
  }

  function renderHeader() {
    els.repo.textContent = data && data.server ? `repo — ${esc(data.server.repo)}` : '';
    els.updated.textContent = data && data.generatedAt ? `updated ${fmtTime(data.generatedAt)}` : '';
  }

  // ---------- summary ----------

  function renderFocus() {
    const f = data && data.board && data.board.focus;
    if (!f || !Object.keys(f).length) {
      els.focusBody.innerHTML = '<div class="aux-empty">No current focus set.</div>';
      return;
    }
    const entries = [
      ['Primary Project', f['Primary Project']],
      ['Current Objective', f['Current Objective']],
      ['Active Task', f['Active Task']],
      ['Next Action', f['Next Action']],
      ['Why This Is Current', f['Why This Is Current']],
    ].filter(([, v]) => v && v.trim());
    els.focusBody.innerHTML = entries.length
      ? entries.map(([k, v]) => `<div class="focus-line"><div class="k">${esc(k)}</div><div class="v">${esc(v)}</div></div>`).join('')
      : '<div class="aux-empty">No current focus set.</div>';
  }

  function renderCounts() {
    const o = data && data.board && data.board.overview;
    if (!o || !Object.keys(o).length) {
      els.countsBody.innerHTML = '<div class="aux-empty">No portfolio data.</div>';
      return;
    }
    const cells = [
      ['Total Projects', o['Total Projects']],
      ['Active', o['Active Projects']],
      ['Blocked', o['Blocked Projects']],
      ['In Review', o['Projects in Review']],
      ['Completed', o['Completed Projects']],
    ];
    els.countsBody.innerHTML = cells
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .map(([l, n]) => `<div class="stat-row"><span class="stat-l">${esc(l)}</span><span class="stat-v">${esc(n)}</span></div>`)
      .join('');
  }

  function renderAux() {
    const act = data && data.board && data.board.activity;
    els.auxBody.innerHTML = act && act.length
      ? act.slice(0, 6)
          .map((r) => `<div class="aux-row"><span class="when">${esc(r.Date || '')}</span><span>${esc(r.Change || '')}</span></div>`)
          .join('')
      : '<div class="aux-empty">No board activity recorded.</div>';
  }

  // ---------- board columns ----------

  function computeStateBySlug() {
    stateBySlug = {};
    if (!data || !data.board || !data.board.sections) return;
    for (const sec of data.board.sections) {
      for (const card of sec.projects || []) {
        const slug = slugOfProjectRef(card.refs.project);
        if (slug) stateBySlug[slug] = sec.state;
      }
    }
  }

  function renderProjectCard(card) {
    const slug = slugOfProjectRef(card.refs.project);
    const pr = projectDetail(slug);
    const status = findBadge(card.badges, 'status');
    const priority = findBadge(card.badges, 'priority');
    const progress = findBadge(card.badges, 'progress');
    const obj = (pr && pr.project && pr.project.objective) || '';
    let taskCount = 0;
    const tb = pr && pr.taskBoard;
    if (tb && tb.workflows) {
      for (const w of WORKFLOW_ORDER) taskCount += (tb.workflows[w] || []).length;
    }

    const el = document.createElement('div');
    el.className = 'pcard';
    el.dataset.slug = slug || '';
    el.innerHTML = `
      <h3>${esc(card.name)}</h3>
      <div class="num">${esc(slug || '')}</div>
      <div class="obj">${esc(obj) || ''}</div>
      <div class="meta">
        ${chip(status)}${chip(priority)}${chip(progress)}
        ${taskCount ? `<span class="tasks-pill">${taskCount} tasks</span>` : ''}
      </div>`;
    return el;
  }

  function matchesRule(card, rule) {
    if (!rule) return false;
    if (rule.blocked && stateBySlug[slugOfProjectRef(card.refs.project)] !== 'Blocked') return false;
    const label = rule.type === 'status' ? 'status' : 'priority';
    const b = findBadge(card.badges, label);
    if (!b) return false;
    if (Array.isArray(rule.values) && rule.values.length && !rule.values.includes(b.value)) return false;
    return true;
  }

  function buildColumn(col) {
    const inner = document.createElement('div');
    inner.className = 'col';

    const head = document.createElement('div');
    head.className = 'col-head';
    head.innerHTML = `
      <span class="swatch" style="background:${col.color}"></span>
      <span class="name">${esc(col.title)}</span>
      ${col.kind === 'custom' ? '<span class="ctag">custom</span>' : ''}
      <div class="col-actions">
        <button class="eye" data-hide="${esc(col.key)}" title="Hide column">✕</button>
      </div>
      <span class="count">0</span>`;
    inner.appendChild(head);

    const body = document.createElement('div');
    body.className = 'col-body';
    inner.appendChild(body);

    let cards = [];
    if (col.kind === 'state') {
      for (const sec of data.board.sections || []) {
        if (sec.state === col.key) cards = sec.projects || [];
      }
    } else if (col.kind === 'custom' && col.custom) {
      for (const sec of data.board.sections || []) {
        for (const card of sec.projects || []) {
          if (matchesRule(card, col.custom)) cards.push(card);
        }
      }
    }

    head.querySelector('.count').textContent = cards.length;
    body.innerHTML = cards.length ? '' : '<div class="empty">No projects here yet.</div>';
    for (const card of cards) body.appendChild(renderProjectCard(card));
    return inner;
  }

  function renderBoard() {
    els.board.innerHTML = '';
    if (!data || !data.board) {
      els.board.innerHTML = '<div class="empty" style="margin:auto">No board data.</div>';
      return;
    }
    computeStateBySlug();
    const colsList = visibleCols();
    if (!colsList.length) {
      els.board.innerHTML = '<div class="empty" style="margin:auto">All columns hidden. Use "Columns" to show one.</div>';
    } else {
      for (const col of colsList) els.board.appendChild(buildColumn(col));
    }
    syncColsUI();
  }

  // ---------- column toolbar / popover ----------

  function syncColsUI() {
    const vis = visibleCols();
    els.colsCount.textContent = vis.length;
    const hidden = hiddenProjectsCount();
    els.colsHint.textContent = hidden
      ? `${hidden} project${hidden === 1 ? '' : 's'} in hidden columns`
      : `${vis.length} column${vis.length === 1 ? '' : 's'} shown`;
  }

  function renderColsPop() {
    if (els.colsPop.hidden) return;
    let rows = '';
    for (const s of BOARD_STATES) {
      const on = !!cols.states[s];
      rows += `
        <label class="pop-row">
          <span class="row-check"><input type="checkbox" data-state="${esc(s)}" ${on ? 'checked' : ''}></span>
          <span class="ndot" style="background:${STATE_COLOR[s]}"></span>
          <span class="lbl">${esc(s)}</span>
          <span class="grow"></span>
          <span class="mini-tag">${DEFAULT_STATES.includes(s) ? 'default' : 'extra'}</span>
        </label>`;
    }
    let customs = '';
    for (const c of cols.custom) {
      customs += `
        <div class="pop-row">
          <span class="row-check"><input type="checkbox" data-custom="${esc(c.id)}" ${c.visible !== false ? 'checked' : ''}></span>
          <span class="ndot" style="background:${esc(c.color)}"></span>
          <span class="lbl">${esc(c.name)}</span>
          <span class="grow"></span>
          <button class="iconbtn" data-edit="${esc(c.id)}" title="Edit">✎</button>
          <button class="iconbtn del" data-del="${esc(c.id)}" title="Delete">✕</button>
        </div>`;
    }
    const foot = `
      <div class="pop-foot">
        <button data-act="reset" class="danger">Reset</button>
        <button data-act="add">+ Custom column</button>
      </div>`;
    els.colsPop.innerHTML = `
      <div class="pop-group"><h4>Board states</h4>${rows}</div>
      <div class="pop-group"><h4>Custom columns</h4>${customs || '<div class="pop-row" style="color:var(--muted)">None yet.</div>'}</div>
      ${foot}`;
  }

  function togglePop(forceOpen) {
    const willOpen = forceOpen !== undefined ? !!forceOpen : els.colsPop.hidden;
    els.colsPop.hidden = !willOpen;
    if (willOpen) renderColsPop();
  }

  // ---------- custom column modal ----------

  function valueOptionsFor(type) {
    return type === 'status' ? BOARD_STATES : PRIO_VALUES;
  }

  function valueColorFor(type, v) {
    return type === 'status' ? (STATE_COLOR[v] || '#8b949e') : (PRIO_COLOR[v] || '#8b949e');
  }

  function openCustom(id) {
    draftCol = id ? cols.custom.find((c) => c.id === id) || null : null;
    renderCustomForm();
    els.customOverlay.classList.add('open');
  }

  function renderCustomForm() {
    const type = draftCol ? draftCol.type : 'status';
    const values = draftCol ? draftCol.values : (type === 'status' ? ['Active'] : ['High']);
    const color = draftCol ? draftCol.color : PALETTE[2];
    const blocked = draftCol ? !!draftCol.blocked : false;

    const chips = valueOptionsFor(type)
      .map((v) => {
        const on = values.includes(v);
        return `<label class="opt ${on ? 'on' : ''}" data-value="${esc(v)}">
          <input type="checkbox" value="${esc(v)}" ${on ? 'checked' : ''}>
          <span class="ndot" style="background:${valueColorFor(type, v)}"></span>${esc(v)}</label>`;
      })
      .join('');

    const swatches = PALETTE
      .map((c) => `<span class="swatchpick ${c === color ? 'on' : ''}" data-color="${c}" style="background:${c}"></span>`)
      .join('');

    els.customBody.innerHTML = `
      <div class="detail-head"><div><h2>${draftCol ? 'Edit custom column' : 'New custom column'}</h2></div></div>
      <div class="field"><label>Name</label><input type="text" id="cc-name" value="${esc(draftCol ? draftCol.name : '')}" placeholder="e.g. High priority"></div>
      <div class="field"><label>Basis</label><select id="cc-type">
        <option value="status" ${type === 'status' ? 'selected' : ''}>Board state</option>
        <option value="priority" ${type === 'priority' ? 'selected' : ''}>Priority</option>
      </select></div>
      <div class="field"><label>Include</label><div class="opts" id="cc-opts">${chips}</div></div>
      <div class="field"><label class="rule-inline"><input type="checkbox" id="cc-blocked" ${blocked ? 'checked' : ''}> Only show blocked projects</label></div>
      <div class="field"><label>Color</label><div class="swatches" id="cc-swatches">${swatches}</div></div>
      <div class="form-actions">
        ${draftCol ? '<button class="danger" id="cc-del">Delete column</button>' : ''}
        <button class="apply" id="cc-save">${draftCol ? 'Save changes' : 'Add column'}</button>
      </div>
      <div class="form-note">Custom columns match project cards by their board-state or priority badge.</div>`;
  }

  function readCustomForm() {
    const name = $('#cc-name').value.trim();
    const type = $('#cc-type').value;
    const values = [];
    $('#cc-opts').querySelectorAll('input[type=checkbox]:checked').forEach((i) => values.push(i.value));
    const color = $('#cc-swatches').querySelector('.swatchpick.on').dataset.color;
    const blocked = $('#cc-blocked').checked;
    return { name, type, values, color, blocked };
  }

  function saveCustom() {
    const f = readCustomForm();
    if (!f.name) { toast('Give the column a name'); return; }
    if (!f.values.length) { toast('Pick at least one value'); return; }
    if (draftCol) {
      Object.assign(draftCol, f);
    } else {
      cols.custom.push(Object.assign({ id: 'c' + Date.now().toString(36), visible: true }, f));
    }
    saveCols();
    els.customOverlay.classList.remove('open');
    renderBoard();
    if (!els.colsPop.hidden) renderColsPop();
    toast(draftCol ? 'Column updated' : 'Column added');
  }

  function deleteCustom(id) {
    cols.custom = cols.custom.filter((c) => c.id !== id);
    saveCols();
    els.customOverlay.classList.remove('open');
    renderBoard();
    if (!els.colsPop.hidden) renderColsPop();
    toast('Column deleted');
  }

  // ---------- shared renderers ----------

  function section(title, inner) {
    if (!inner || !inner.trim()) return '';
    return `<section class="section"><h3>${esc(title)}</h3>${inner}</section>`;
  }

  function checklist(items) {
    if (!items || !items.length) return '<div class="body-text">None</div>';
    return `<ul class="checklist">${items
      .map((i) => `<li class="${i.done ? 'done' : ''}"><span class="box">${i.done ? '✓' : ''}</span><span class="txt">${esc(i.text)}</span></li>`)
      .join('')}</ul>`;
  }

  function bulletList(items) {
    if (!items || !items.length) return '<div class="body-text">None</div>';
    return `<ul class="checklist">${items.map((i) => `<li><span class="box">&nbsp;</span><span class="txt">${esc(i)}</span></li>`).join('')}</ul>`;
  }

  function kvTable(rows) {
    if (!rows || !rows.length) return '';
    const keys = Object.keys(rows[0]).filter((k) => k.trim());
    return `<table class="flat"><thead><tr>${keys.map((k) => `<th>${esc(k)}</th>`).join('')}</tr></thead><tbody>${rows
      .map((r) => `<tr>${keys.map((k) => `<td>${esc(r[k] || '')}</td>`).join('')}</tr>`)
      .join('')}</tbody></table>`;
  }

  function metaGrid(overview) {
    if (!overview) return '';
    const keys = ['Project ID', 'Status', 'Priority', 'Owner', 'Started', 'Target', 'Last Updated'];
    let cells = '';
    for (const k of keys) {
      if (overview[k]) cells += `<div class="g-cell"><div class="l">${esc(k)}</div><div class="v">${esc(overview[k])}</div></div>`;
    }
    return cells ? `<div class="grid">${cells}</div>` : '';
  }

  // ---------- drawer (project detail) ----------

  function wfTaskCard(t) {
    const priority = findBadge(t.badges, 'priority');
    const crit = itemsSummary(t.criteria);
    return `<div class="tcard" data-task="${esc(t.id)}">
      <div class="t-title">${esc(t.id)} · ${esc(t.title)}</div>
      <div class="t-meta">
        ${priority ? chip(priority) : ''}
        <span class="meter" title="Acceptance criteria completion">
          <div class="bar"><div class="fill" style="width:${crit.pct}%"></div></div>
          <div class="lbl">${crit.done}/${crit.total}</div>
        </span>
      </div>
    </div>`;
  }

  function itemsSummary(crit) {
    if (crit && crit.items) return crit;
    return { items: [], done: 0, total: 0, pct: 0 };
  }

  function renderTasks(taskBoard) {
    if (!taskBoard || !taskBoard.workflows) return '';
    let cols = '';
    for (const w of WORKFLOW_ORDER) {
      const tasks = taskBoard.workflows[w] || [];
      const color = WF_COLOR[w] || '#8b949e';
      const body = tasks.length
        ? tasks.map(wfTaskCard).join('')
        : '<div class="empty" style="margin:0">—</div>';
      cols += `<div class="wf-col">
        <div class="wf-head"><span class="state" style="background:${color};width:8px;height:8px;border-radius:2px"></span>
          ${esc(w)}<span class="n">${tasks.length}</span></div>
        <div class="wf-body">${body}</div>
      </div>`;
    }
    return `<div class="wf">${cols}</div>`;
  }

  function openDrawer(slug) {
    currentSlug = slug;
    const pr = projectDetail(slug);
    const p = pr && pr.project;
    if (!p) {
      els.drawerBody.innerHTML = `<p class="body-text">No project file found for <b>${esc(slug)}</b>.</p>`;
      els.drawerOverlay.classList.add('open');
      return;
    }

    const obj = p.objective ? `<p class="body-text">${esc(p.objective)}</p>` : '';
    const cur = p.current || {};
    const curEntries = [
      ['Summary', cur.summary],
      ['Current Focus', cur.focus],
      ['Next Milestone', cur.nextMilestone],
      ['Next Action', cur.nextAction],
    ].filter(([, v]) => v && v.trim());
    const curHtml = curEntries.length
      ? curEntries.map(([k, v]) => `<div class="focus-line"><div class="k">${esc(k)}</div><div class="v">${esc(v)}</div></div>`).join('')
      : '';

    const crit = p.successCriteria || [];
    const critDone = crit.filter((c) => c.done).length;

    let scope = '';
    if (p.scope && ((p.scope.in && p.scope.in.length) || (p.scope.out && p.scope.out.length))) {
      const parts = [];
      if (p.scope.in && p.scope.in.length) parts.push(section('In Scope', bulletList(p.scope.in)));
      if (p.scope.out && p.scope.out.length) parts.push(section('Out of Scope', bulletList(p.scope.out)));
      scope = parts.join('');
    }

    const card = boardCard(slug);
    const badges = (card && card.badges || []).map(parseBadge).filter(Boolean).map(chip).join('');

    const html = `
      <div class="detail-head">
        <div>
          <h2>${esc(p.title || p.slug)}</h2>
          <div class="sub">projects/${esc(slug)}.md · ${esc(pr.slug)}</div>
        </div>
        <button class="editbtn" data-edit-project="${esc(slug)}">✎ Edit</button>
      </div>
      ${badges ? `<div class="badges">${badges}</div>` : ''}
      ${metaGrid(p.overview || {})}
      ${section('Objective', obj)}
      ${section('Current State', curHtml)}
      ${section(`Success Criteria (${critDone}/${crit.length})`, checklist(crit))}
      ${scope}
      ${section('Milestones', kvTable(p.milestones))}
      ${section('Deliverables', kvTable(p.deliverables))}
      ${section('Risks', kvTable(p.risks))}
      ${section('Decisions', kvTable(p.decisions))}
      ${section('Dependencies', bulletList(p.dependencies))}
      ${section('Constraints', bulletList(p.constraints))}
      ${section('Open Questions', checklist(p.openQuestions))}
      ${section('Task Board', renderTasks(pr.taskBoard))}`;

    els.drawerBody.innerHTML = html;
    els.drawerOverlay.classList.add('open');
  }

  // ---------- editor (project drawer) ----------

  async function postWrite(file, ops) {
    const resp = await fetch('/api/write', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file, ops }),
    });
    let body;
    try { body = await resp.json(); } catch (err) { body = {}; }
    if (!resp.ok || !body.ok) {
      throw new Error(body.error || `write failed (HTTP ${resp.status})`);
    }
  }

  function editorHead(title, sub) {
    return `<div class="detail-head"><div><h2>${esc(title)}</h2><div class="sub">${esc(sub)}</div></div></div>`;
  }

  function editorChecks(id, items) {
    const rows = (items || []).map((it, i) => `
      <label class="crit" data-i="${i}">
        <input type="checkbox" data-idx="${i}" ${it.done ? 'checked' : ''}>
        <span class="txt">${esc(it.text)}</span>
      </label>`).join('');
    return `<div class="field"><label>${esc(id)}</label><div class="crits" id="pe-criteria">${rows || '<div class="body-text">None</div>'}</div></div>`;
  }

  function renderProjectEditor() {
    const pr = projectDetail(currentSlug);
    const p = pr && pr.project;
    const card = boardCard(currentSlug);
    if (!p) return;
    const status = (p.overview && p.overview['Status']) || (card && findBadge(card.badges, 'status') && findBadge(card.badges, 'status').value) || '';
    const priority = (p.overview && p.overview.Priority) || (card && findBadge(card.badges, 'priority') && findBadge(card.badges, 'priority').value) || '';
    const progress = (p.overview && p.overview.Progress) || (card && findBadge(card.badges, 'progress') && findBadge(card.badges, 'progress').value) || '';
    const cur = p.current || {};

    els.drawerBody.innerHTML = `
      ${editorHead('Edit project', `projects/${currentSlug}.md`)}
      <div class="edit-form" data-edit="project">
        ${fieldField('Status', { choices: BOARD_STATES, current: status }, 'pe-status')}
        ${fieldField('Priority', { choices: PRIO_VALUES, current: priority }, 'pe-priority')}
        <div class="field"><label>Progress</label>
          <select id="pe-progress">
            ${[0,10,20,30,40,50,60,70,80,90,100].map((n) => {
              const label = `${n}%`;
              return `<option value="${esc(label)}" ${normalizeProgress(progress) === label ? 'selected' : ''}>${esc(label)}</option>`;
            }).join('')}
          </select>
        </div>
        <div class="field"><label>Objective</label>
          <textarea id="pe-objective" rows="3">${esc(p.objective || '')}</textarea>
        </div>
        <div class="field"><label>Current Focus</label>
          <textarea id="pe-focus" rows="2">${esc(cur.focus || '')}</textarea>
        </div>
        <div class="field"><label>Next Milestone</label>
          <textarea id="pe-milestone" rows="2">${esc(cur.nextMilestone || '')}</textarea>
        </div>
        <div class="field"><label>Next Action</label>
          <textarea id="pe-next" rows="2">${esc(cur.nextAction || '')}</textarea>
        </div>
        ${editorChecks('Success Criteria', p.successCriteria)}
        <div class="form-actions">
          <button class="plain" id="pe-cancel">Cancel</button>
          <button class="apply" id="pe-save">Save changes</button>
        </div>
      </div>`;
    els.drawerOverlay.classList.add('open');
  }

  function normalizeProgress(v) {
    const n = parseInt(String(v || '').replace(/[^0-9]/g, ''), 10);
    return Number.isNaN(n) ? '' : `${n}%`;
  }

  function fieldField(label, value, id) {
    if (typeof value === 'object' && value.choices) {
      return `<div class="field"><label>${esc(label)}</label>
        <select id="${esc(id)}">${value.choices.map((v) => `<option value="${esc(v)}" ${v === value.current ? 'selected' : ''}>${esc(v)}</option>`).join('')}</select></div>`;
    }
    return `<div class="field"><label>${esc(label)}</label><input type="text" id="${esc(id)}" value="${esc(value || '')}"></div>`;
  }

  function boardStateFor(slug) {
    if (!data || !data.board || !data.board.sections) return '';
    for (const sec of data.board.sections) {
      for (const c of sec.projects || []) {
        if (slugOfProjectRef(c.refs.project) === slug) return sec.state;
      }
    }
    return '';
  }

  function readProjectEditor() {
    return {
      status: $('#pe-status').value,
      priority: $('#pe-priority').value,
      progress: $('#pe-progress').value,
      objective: $('#pe-objective').value.trim(),
      focus: $('#pe-focus').value.trim(),
      milestone: $('#pe-milestone').value.trim(),
      next: $('#pe-next').value.trim(),
      criteria: Array.prototype.map.call($('#pe-criteria').querySelectorAll('input[type=checkbox]'), (i, idx) => {
        const items = projectDetail(currentSlug).project.successCriteria;
        return { idx, text: items[idx].text, done: i.checked };
      }),
    };
  }

  function statusOfCard(card) {
    const b = findBadge(card && card.badges, 'status');
    return (b && b.value) || '';
  }

  function priorityOfCard(card) {
    const b = findBadge(card && card.badges, 'priority');
    return (b && b.value) || '';
  }

  function progressOfCard(card) {
    const b = findBadge(card && card.badges, 'progress');
    return (b && b.value) || '';
  }

  function stateBadgeColor(s) {
    const c = { Planning: '#6e7781', Ready: '#1f6feb', Active: '#238636', Blocked: '#da3633', Review: '#8250df', Paused: '#d29922', Complete: '#238636', Archived: '#6e7781' }[s] || '#6e7781';
    return c.replace(/^#/, '');
  }

  function priorityBadgeColor(v) {
    const c = { Low: '#8b949e', Medium: '#d29922', High: '#f85149', Critical: '#da3633' }[v] || '#8b949e';
    return c.replace(/^#/, '');
  }

  async function saveProjectEditor() {
    const slug = currentSlug;
    const pr = projectDetail(slug);
    const p = pr && pr.project;
    const card = boardCard(slug);
    if (!p || !card) { toast('Cannot edit: missing project data'); return; }
    const f = readProjectEditor();
    const cur = p.current || {};
    const oldStatus = boardStateFor(slug);
    const ops = [];
    const bOps = [];

    if (p.overview && 'Status' in p.overview) ops.push({ op: 'kv', key: 'Status', value: f.status });
    if (p.overview && 'Priority' in p.overview) ops.push({ op: 'kv', key: 'Priority', value: f.priority });
    if (p.overview && 'Progress' in p.overview) ops.push({ op: 'kv', key: 'Progress', value: f.progress });
    if (p.objective !== f.objective) ops.push({ op: 'section', heading: 'Objective', value: f.objective });
    if ((cur.focus || '') !== f.focus) ops.push({ op: 'label', label: 'Current Focus', value: f.focus });
    if ((cur.nextMilestone || '') !== f.milestone) ops.push({ op: 'label', label: 'Next Milestone', value: f.milestone });
    if ((cur.nextAction || '') !== f.next) ops.push({ op: 'label', label: 'Next Action', value: f.next });
    for (const c of f.criteria) {
      const item = p.successCriteria[c.idx];
      if (item && item.done !== c.done) ops.push({ op: 'check', text: item.text, done: c.done });
    }

    // Sync priority + status/progress onto the board card.
    if (statusOfCard(card) !== f.status) {
      bOps.push({ op: 'projectState', title: card.name, state: f.status });
      ops.push({ op: 'badge', label: 'status', value: f.status.toLowerCase(), color: stateBadgeColor(f.status) });
    }
    if (priorityOfCard(card) !== f.priority) {
      bOps.push({ op: 'badge', label: 'priority', value: f.priority.toLowerCase(), color: priorityBadgeColor(f.priority) });
      ops.push({ op: 'badge', label: 'priority', value: f.priority.toLowerCase(), color: priorityBadgeColor(f.priority) });
    }
    if (progressOfCard(card) !== f.progress) {
      bOps.push({ op: 'badge', label: 'progress', value: f.progress.toLowerCase() });
      ops.push({ op: 'badge', label: 'progress', value: f.progress.toLowerCase() });
    }

    try {
      if (ops.length) await postWrite(`projects/${slug}.md`, ops);
      if (bOps.length) await postWrite('BOARD.md', bOps);
      toast('Project saved');
      const st = await fetch('/api/state').then((r) => r.json());
      if (st && st.generatedAt) apply(st);
      if (isOpen(els.drawerOverlay)) openDrawer(slug);
    } catch (err) {
      toast(`Save failed: ${err.message}`);
    }
  }

  // ---------- task modal ----------

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

  function openTask(slug, id) {
    currentTask = { slug, id };
    const t = findTask(slug, id);
    if (!t) {
      els.taskBody.innerHTML = `<h2>${esc(id)}</h2><p class="body-text">Task not found.</p>`;
      els.taskOverlay.classList.add('open');
      return;
    }
    const crit = itemsSummary(t.criteria);
    const val = itemsSummary(t.validation);
    const badges = (t.badges || []).map(parseBadge).filter(Boolean).map(chip).join('');

    els.taskBody.innerHTML = `
      <div class="detail-head"><div><h2>${esc(t.id)} · ${esc(t.title)}</h2></div>
        <button class="editbtn" data-edit-task="${esc(t.id)}">✎ Edit</button></div></div>
      ${badges ? `<div class="badges">${badges}</div>` : ''}
      ${section('Fields', metaGrid(t.fields || {}))}
      ${section('Goal', t.goal ? `<p class="body-text">${esc(t.goal)}</p>` : '')}
      ${section(`Acceptance Criteria (${crit.done}/${crit.total})`, checklist(crit.items))}
      ${section(`Validation (${val.done}/${val.total})`, checklist(val.items))}
      ${section('Blockers', bulletList(t.blockers))}
      ${section('Dependencies', bulletList(t.dependencies))}
      ${section('Implementation Notes', bulletList(t.notes))}
      ${section('Resources', bulletList(t.resources))}
      ${section('Next Action', t.nextAction ? `<p class="body-text">${esc(t.nextAction)}</p>` : '')}`;
    els.taskOverlay.classList.add('open');
  }

  // ---------- task editor ----------

  function findTaskWorkflow(slug, id) {
    const pr = projectDetail(slug);
    const tb = pr && pr.taskBoard;
    if (!tb || !tb.workflows) return '';
    for (const w of WORKFLOW_ORDER) {
      if ((tb.workflows[w] || []).some((t) => t.id === id)) return w;
    }
    return '';
  }

  function renderTaskEditor() {
    const t = findTask(currentSlug, currentTask.id);
    if (!t) return;
    const wf = findTaskWorkflow(currentSlug, currentTask.id);
    const priority = (t.fields && t.fields.Priority) || (findBadge(t.badges, 'priority') && findBadge(t.badges, 'priority').value) || '';

    const crit = itemsSummary(t.criteria);
    const val = itemsSummary(t.validation);

    els.taskBody.innerHTML = `
      ${editorHead(`Edit task · ${esc(t.id)}`, `${esc(t.id)} · ${esc(t.title)}`)}
      <div class="edit-form" data-edit="task">
        <div class="field"><label>Workflow</label>
          <select id="te-workflow">${WORKFLOW_ORDER.map((w) => `<option value="${esc(w)}" ${w === wf ? 'selected' : ''}>${esc(w)}</option>`).join('')}</select>
        </div>
        <div class="field"><label>Priority</label>
          <select id="te-priority">${PRIO_VALUES.map((v) => `<option value="${esc(v)}" ${v === priority ? 'selected' : ''}>${esc(v)}</option>`).join('')}</select>
        </div>
        <div class="field"><label>Goal</label>
          <textarea id="te-goal" rows="3">${esc(t.goal || '')}</textarea>
        </div>
        <div class="field"><label>Next Action</label>
          <textarea id="te-next" rows="2">${esc(t.nextAction || '')}</textarea>
        </div>
        <div class="field"><label>Acceptance Criteria</label><div class="crits" id="te-criteria">
          ${(crit.items || []).map((it, i) => `<label class="crit"><input type="checkbox" data-idx="${i}" data-kind="criteria" ${it.done ? 'checked' : ''}><span class="txt">${esc(it.text)}</span></label>`).join('') || '<div class="body-text">None</div>'}
        </div></div>
        <div class="field"><label>Validation</label><div class="crits" id="te-validation">
          ${(val.items || []).map((it, i) => `<label class="crit"><input type="checkbox" data-idx="${i}" data-kind="validation" ${it.done ? 'checked' : ''}><span class="txt">${esc(it.text)}</span></label>`).join('') || '<div class="body-text">None</div>'}
        </div></div>
        <div class="form-actions">
          <button class="plain" id="te-cancel">Cancel</button>
          <button class="apply" id="te-save">Save changes</button>
        </div>
      </div>`;
    els.taskOverlay.classList.add('open');
  }

  async function saveTaskEditor() {
    const slug = currentSlug;
    const id = currentTask.id;
    const t = findTask(slug, id);
    if (!t) { toast('Cannot edit: task missing'); return; }
    const wf = $('#te-workflow').value;
    const priority = $('#te-priority').value;
    const goal = $('#te-goal').value.trim();
    const next = $('#te-next').value.trim();

    const ops = [];
    if (wf !== findTaskWorkflow(slug, id)) ops.push({ op: 'task', taskId: id, workflow: wf });
    if (t.fields && 'Priority' in t.fields) ops.push({ op: 'taskKV', taskId: id, key: 'Priority', value: priority });
    if (findBadge(t.badges, 'priority') && priorityOfBadges(t.badges) !== priority) ops.push({ op: 'taskBadge', taskId: id, label: 'priority', value: priority.toLowerCase(), color: priorityBadgeColor(priority) });
    if ((t.goal || '') !== goal) ops.push({ op: 'taskLabel', taskId: id, label: 'Goal', value: goal });
    if ((t.nextAction || '') !== next) ops.push({ op: 'taskLabel', taskId: id, label: 'Next Action', value: next });

    // criteria + validation toggles
    const kinds = ['criteria', 'validation'];
    for (const kind of kinds) {
      const items = kind === 'criteria' ? itemsSummary(t.criteria).items : itemsSummary(t.validation).items;
      const boxes = document.querySelectorAll(kind === 'criteria' ? '#te-criteria input' : '#te-validation input');
      items.forEach((it, i) => {
        if (boxes[i] && it.done !== boxes[i].checked) {
          ops.push({ op: 'taskCheck', taskId: id, text: it.text, done: boxes[i].checked });
        }
      });
    }

    try {
      if (ops.length) await postWrite(`tasks/${slug}-tasks.md`, ops);
      toast('Task saved');
      const st = await fetch('/api/state').then((r) => r.json());
      if (st && st.generatedAt) apply(st);
      if (isOpen(els.taskOverlay)) openTask(slug, id);
    } catch (err) {
      toast(`Save failed: ${err.message}`);
    }
  }

  function priorityOfBadges(badges) {
    const b = findBadge(badges, 'priority');
    return (b && b.value) || '';
  }

  // ---------- apply / refresh ----------

  function apply(st) {
    data = st;
    renderHeader();
    renderFocus();
    renderCounts();
    renderAux();
    renderBoard();
    if (isOpen(els.drawerOverlay) && currentSlug) openDrawer(currentSlug);
    if (isOpen(els.taskOverlay) && currentTask) openTask(currentTask.slug, currentTask.id);
  }

  // ---------- SSE ----------

  function connectEvents() {
    const es = new EventSource('/events');
    es.onopen = () => setLive(true);
    es.onmessage = (ev) => {
      let msg;
      try {
        msg = JSON.parse(ev.data);
      } catch (err) {
        return;
      }
      if (msg.event === 'update' && msg.state) {
        apply(msg.state);
        toast('Board updated live');
      } else if (msg.event === 'hello' && msg.state) {
        if (!data) apply(msg.state);
      }
    };
    es.onerror = () => setLive(false);
  }

  // ---------- events ----------

  els.colsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePop();
  });

  els.addColBtn.addEventListener('click', () => openCustom(null));

  document.addEventListener('click', (e) => {
    if (!els.colsPop.hidden && !e.target.closest('.board-toolbar')) togglePop(false);
  });

  els.colsPop.addEventListener('click', (e) => {
    const stateInput = e.target.closest('input[data-state]');
    if (stateInput) {
      cols.states[stateInput.dataset.state] = stateInput.checked;
      saveCols();
      renderBoard();
      return;
    }
    const customInput = e.target.closest('input[data-custom]');
    if (customInput) {
      const c = cols.custom.find((x) => x.id === customInput.dataset.custom);
      if (c) {
        c.visible = customInput.checked;
        saveCols();
        renderBoard();
      }
      return;
    }
    const del = e.target.closest('[data-del]');
    if (del) {
      deleteCustom(del.dataset.del);
      renderColsPop();
      return;
    }
    const edit = e.target.closest('[data-edit]');
    if (edit) {
      openCustom(edit.dataset.edit);
      return;
    }
    const act = e.target.closest('[data-act]');
    if (!act) return;
    if (act.dataset.act === 'reset') {
      const next = defaultCols();
      cols.states = next.states;
      cols.custom = [];
      saveCols();
      renderBoard();
      renderColsPop();
      toast('Columns reset to defaults');
    } else if (act.dataset.act === 'add') {
      openCustom(null);
    }
  });

  els.board.addEventListener('click', (e) => {
    const hide = e.target.closest('[data-hide]');
    if (hide) {
      const key = hide.dataset.hide;
      if (key.startsWith('custom:')) {
        const c = cols.custom.find((x) => x.id === key.slice(7));
        if (c) c.visible = false;
      } else {
        cols.states[key] = false;
      }
      saveCols();
      renderBoard();
      toast('Column hidden');
      return;
    }
    const card = e.target.closest('.pcard');
    if (card && card.dataset.slug) openDrawer(card.dataset.slug);
  });

  els.customBody.addEventListener('click', (e) => {
    const opt = e.target.closest('.opt');
    if (opt) {
      opt.classList.toggle('on', opt.querySelector('input').checked === false);
      opt.querySelector('input').checked = !opt.querySelector('input').checked;
      return;
    }
    const sw = e.target.closest('.swatchpick');
    if (sw) {
      els.customBody.querySelectorAll('.swatchpick').forEach((x) => x.classList.remove('on'));
      sw.classList.add('on');
      return;
    }
    if (e.target.closest('#cc-save')) { saveCustom(); return; }
    if (e.target.closest('#cc-del')) { deleteCustom(draftCol.id); return; }
  });

  els.customBody.addEventListener('change', (e) => {
    if (e.target.id === 'cc-type') {
      const type = e.target.value;
      const values = type === 'status' ? ['Active'] : ['High'];
      draftCol = draftCol || { name: '', type, values, color: PALETTE[2], blocked: false };
      draftCol.type = type;
      draftCol.values = values;
      renderCustomForm();
    }
  });

  els.drawerBody.addEventListener('click', (e) => {
    const tc = e.target.closest('.tcard');
    if (tc && tc.dataset.task && currentSlug) openTask(currentSlug, tc.dataset.task);
    const editBtn = e.target.closest('[data-edit-project]');
    if (editBtn) {
      currentSlug = editBtn.dataset.editProject;
      saveEditing('project');
      renderProjectEditor();
      return;
    }
    if (e.target.closest('#pe-save')) { saveProjectEditor(); return; }
    if (e.target.closest('#pe-cancel')) { openDrawer(currentSlug); return; }
  });

  els.taskBody.addEventListener('click', (e) => {
    if (e.target.closest('[data-edit-task]')) {
      const id = e.target.closest('[data-edit-task]').dataset.editTask;
      currentTask = { slug: currentSlug, id };
      renderTaskEditor();
      return;
    }
    if (e.target.closest('#te-save')) { saveTaskEditor(); return; }
    if (e.target.closest('#te-cancel')) { openTask(currentSlug, currentTask.id); return; }
  });

  els.drawerClose.addEventListener('click', () => els.drawerOverlay.classList.remove('open'));
  els.taskClose.addEventListener('click', () => els.taskOverlay.classList.remove('open'));
  els.customClose.addEventListener('click', () => els.customOverlay.classList.remove('open'));
  [els.drawerOverlay, els.taskOverlay, els.customOverlay].forEach((o) => {
    o.addEventListener('click', (e) => {
      if (e.target === o) o.classList.remove('open');
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      els.drawerOverlay.classList.remove('open');
      els.taskOverlay.classList.remove('open');
      els.customOverlay.classList.remove('open');
      togglePop(false);
    }
  });

  window.addEventListener('focus', async () => {
    try {
      const st = await fetch('/api/state').then((r) => r.json());
      if (st && st.generatedAt) apply(st);
    } catch (err) { /* ignore */ }
  });

  // ---------- boot ----------

  async function boot() {
    connectEvents();
    try {
      const st = await fetch('/api/state').then((r) => {
        if (!r.ok) throw new Error(r.status + ' ' + r.statusText);
        return r.json();
      });
      if (!data) apply(st);
    } catch (err) {
      setLive(false);
      els.board.innerHTML = `<div class="empty" style="margin:auto">Could not load state: ${esc(err.message)}</div>`;
    }
  }

  boot();
})();
