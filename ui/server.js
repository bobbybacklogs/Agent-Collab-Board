'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { readState } = require('./lib/state');
const { apply: applyOps, WORKFLOW_NAMES, BOARD_STATES, PRIORITY_VALUES } = require('./lib/write');

const REPO = path.resolve(process.env.BOARD_REPO || path.join(__dirname, '..'));
const PORT = Number(process.env.PORT || 4173);
const PUBLIC = path.join(__dirname, 'public');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
};

// ---------- state ----------

let lastChange = null;
function buildState() {
  return { ...readState(REPO), server: { port: PORT, repo: path.basename(REPO) }, lastChange };
}

// ---------- SSE clients ----------

const clients = new Set();

function broadcast(serialized) {
  for (const res of clients) {
    try {
      res.write(`data: ${serialized}\n\n`);
    } catch (_) {
      clients.delete(res);
      try { res.destroy(); } catch (_) {}
    }
  }
}

function notify() {
  lastChange = new Date().toISOString();
  const state = buildState();
  broadcast(JSON.stringify({ event: 'update', state }));
}

// ---------- file watching ----------

let timer = null;

function onChange() {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    try {
      notify();
    } catch (err) {
      console.error('[watch] rebuild failed:', err.message);
    }
  }, 150);
}

function watchDir(dir, filter) {
  try {
    const watcher = fs.watch(dir, { persistent: true }, (event, filename) => {
      try {
        if (!filename) return onChange();
        const name = String(filename);
        if (filter && !filter(name)) return;
        onChange();
      } catch (_) {
        /* ignore */
      }
    });
    watcher.on('error', () => {
      /* directory may be transient */
    });
    return watcher;
  } catch (err) {
    console.warn(`[watcher] cannot watch ${path.basename(dir)}:`, err.message);
    return null;
  }
}

const watchers = [];
watchers.push(watchDir(REPO, (n) => n === 'BOARD.md'));
if (fs.existsSync(path.join(REPO, 'projects'))) {
  watchers.push(watchDir(path.join(REPO, 'projects'), (n) => n.endsWith('.md')));
}
if (fs.existsSync(path.join(REPO, 'tasks'))) {
  watchers.push(watchDir(path.join(REPO, 'tasks'), (n) => n.endsWith('.md')));
}

// ---------- http helpers ----------

function send(res, status, body, type) {
  res.writeHead(status, {
    'Content-Type': type,
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

function sendJson(res, status, obj) {
  send(res, status, JSON.stringify(obj), 'application/json; charset=utf-8');
}

function serveStatic(res, relPath) {
  const safePath = path.normalize(relPath).replace(/^([.][.][/\\])+/, '');
  const candidate = path.join(PUBLIC, safePath);
  if (!candidate.startsWith(PUBLIC)) return send(res, 403, 'Forbidden', 'text/plain');
  if (!fs.existsSync(candidate) || fs.statSync(candidate).isDirectory()) {
    return send(res, 404, 'Not found', 'text/plain');
  }
  const ext = path.extname(candidate).toLowerCase();
  send(res, 200, fs.readFileSync(candidate), MIME[ext] || 'application/octet-stream');
}

// ---------- write API ----------

const ALLOWED_WRITE_PATHS = [
  ['BOARD.md'],
  ['projects'],
  ['tasks'],
];

// Resolve a write target to a real file, allowing only repo-owned markdown.
function resolveWriteTarget(target) {
  if (!target || typeof target !== 'string') return null;
  const norm = path.normalize(target).replace(/^([.\\/]+)/, '');
  const parts = norm.split(/[\\/]/);
  if (parts.length === 1) {
    return parts[0] === 'BOARD.md' ? { file: path.join(REPO, 'BOARD.md') } : null;
  }
  if (parts.length === 2 && (parts[0] === 'projects' || parts[0] === 'tasks')) {
    if (!/\.md$/.test(parts[1])) return null;
    if (parts[1].startsWith('_')) return null;
    return { file: path.join(REPO, parts[0], parts[1]), scope: parts[0] };
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

function writeTarget(resolved, ops) {
  const current = fs.readFileSync(resolved.file, 'utf8');
  const next = applyOps(current, ops);
  // Round-trip re-parse guard: ensure the edited file still parses cleanly.
  try {
    if (resolved.scope === 'projects') {
      const { parseProject } = require('./lib/parse');
      parseProject(next, path.basename(resolved.file, '.md'));
    } else if (resolved.scope === 'tasks') {
      const { parseTaskBoard } = require('./lib/parse');
      parseTaskBoard(next);
    } else {
      const { parseBoard } = require('./lib/parse');
      parseBoard(next);
    }
  } catch (err) {
    throw new Error(`refusing write: edit does not re-parse: ${err.message}`);
  }
  fs.writeFileSync(resolved.file, next, 'utf8');
  return next;
}

function readJsonBody(req, res, cb) {
  let body = '';
  let size = 0;
  req.on('data', (chunk) => {
    size += chunk.length;
    if (size > 512 * 1024) {
      res.destroy();
      return;
    }
    body += chunk;
  });
  req.on('end', () => {
    let parsed;
    try {
      parsed = body ? JSON.parse(body) : {};
    } catch (err) {
      return cb(new Error('invalid JSON body'));
    }
    cb(null, parsed);
  });
  req.on('error', (err) => cb(err));
}

function handleWrite(req, res) {
  readJsonBody(req, res, (err, body) => {
    if (err) return sendJson(res, 400, { ok: false, error: err.message });
    try {
      const target = body.file || body.target;
      const resolved = resolveWriteTarget(target);
      if (!resolved) return sendJson(res, 400, { ok: false, error: `invalid write target "${target}"` });
      const ops = body.ops;
      validateOps(ops, resolved.scope || null);
      writeTarget(resolved, ops);
    } catch (err) {
      return sendJson(res, 422, { ok: false, error: err.message });
    }
    try {
      notify();
    } catch (err) {
      // state refresh failure shouldn't hide a successful write
    }
    return sendJson(res, 200, { ok: true });
  });
}

const server = http.createServer((req, res) => {
  const u = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(u.pathname);

  if (req.method === 'GET' && pathname === '/api/state') {
    try {
      return sendJson(res, 200, buildState());
    } catch (err) {
      return sendJson(res, 500, { error: err.message });
    }
  }

  if (req.method === 'GET' && pathname === '/api/health') {
    return sendJson(res, 200, { ok: true, repo: REPO, watched: true });
  }

  if (req.method === 'POST' && pathname === '/api/write') {
    return handleWrite(req, res);
  }

  if (req.method === 'GET' && pathname === '/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });
    res.write('retry: 2000\n\n');
    res.write(`data: ${JSON.stringify({ event: 'hello', ...buildState() })}\n\n`);
    clients.add(res);
    const heartbeat = setInterval(() => {
      try {
        res.write(': ping\n\n');
      } catch (_) {
        /* closed */
      }
    }, 25000);
    req.on('close', () => {
      clients.delete(res);
      clearInterval(heartbeat);
    });
    return;
  }

  if (req.method === 'GET' && (pathname === '/' || pathname === '')) {
    return serveStatic(res, 'index.html');
  }

  if (req.method === 'GET') {
    return serveStatic(res, pathname.startsWith('/') ? pathname.slice(1) : pathname);
  }

  send(res, 405, 'Method not allowed', 'text/plain');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is in use. Set PORT to another value.`);
    process.exit(1);
  }
  throw err;
});

server.listen(PORT, () => {
  console.log(`\n  Local Board Dashboard`);
  console.log(`  Repo : ${REPO}`);
  console.log(`  UI   : http://localhost:${PORT}`);
  console.log(`  API  : http://localhost:${PORT}/api/state`);
  console.log(`  Live : watching BOARD.md, projects/, tasks/ (SSE auto-refresh)\n`);
  try {
    buildState();
  } catch (err) {
    console.warn('[startup] state build warning:', err.message);
  }
});