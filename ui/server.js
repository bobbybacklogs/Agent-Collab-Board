'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { readState } = require('./lib/state');

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