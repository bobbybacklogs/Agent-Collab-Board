'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { createBoard, resolveTarget } = require('../sdk');

const REPO = path.resolve(process.env.BOARD_REPO || path.join(__dirname, '..'));
const PORT = Number(process.env.PORT || 4173);
const HOST = process.env.HOST || '0.0.0.0';
const PUBLIC = path.join(__dirname, 'public');
const WRITE_TOKEN = process.env.BOARD_WRITE_TOKEN || '';
const board = createBoard(REPO);

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
  return { ...board.read(), server: { port: PORT, repo: path.basename(REPO) }, lastChange };
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
// Debounced watching of BOARD.md, projects/*.md, and tasks/*-tasks.md is
// provided by the SDK (sdk/lib/watch.js). The returned disposer is kept for
// symmetry; the server runs for the process lifetime.
const disposeWatcher = board.watch(() => notify(), { debounceMs: 150 });

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

function isAuthorized(req) {
  if (!WRITE_TOKEN) return false;
  const header = req.headers.authorization || '';
  const bearer = header.startsWith('Bearer ') ? header.slice(7) : '';
  const supplied = bearer || req.headers['x-board-write-token'] || '';
  return supplied === WRITE_TOKEN;
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
// Target resolution, op validation, and the re-parse-guarded write are
// handled by the SDK (sdk/lib/guard.js + write.js), shared with the agent
// CLI (sdk/bin/cli.js).

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
  if (!isAuthorized(req)) {
    return sendJson(res, WRITE_TOKEN ? 401 : 503, {
      ok: false,
      error: WRITE_TOKEN ? 'write authorization required' : 'writes are disabled until BOARD_WRITE_TOKEN is configured',
    });
  }
  readJsonBody(req, res, (err, body) => {
    if (err) return sendJson(res, 400, { ok: false, error: err.message });
    try {
      const target = body.file || body.target;
      if (!resolveTarget(target)) return sendJson(res, 400, { ok: false, error: `invalid write target "${target}"` });
      board.apply(target, body.ops);
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
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-Board-Write-Token');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return send(res, 204, '', 'text/plain');

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

server.listen(PORT, HOST, () => {
  console.log(`\n  Board Dashboard`);
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
