'use strict';

// Debounced repository watcher for the board state files:
// BOARD.md, projects/*.md, tasks/*-tasks.md.
// Extracted from ui/server.js so both the SDK and the dashboard consume one implementation.

const fs = require('fs');
const path = require('path');

// Watch the board repo and invoke onChange (debounced) when a relevant file changes.
// Returns a disposer function that stops the watchers.
function watchRepo(repo, onChange, opts = {}) {
  const debounceMs = opts.debounceMs != null ? opts.debounceMs : 150;

  let timer = null;
  const watchers = [];

  function schedule() {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      try {
        onChange();
      } catch (err) {
        console.error('[watch] rebuild failed:', err.message);
      }
    }, debounceMs);
  }

  function watchDir(dir, filter) {
    try {
      const watcher = fs.watch(dir, { persistent: true }, (event, filename) => {
        try {
          if (!filename) return schedule();
          const name = String(filename);
          if (filter && !filter(name)) return;
          schedule();
        } catch (_) {
          /* ignore */
        }
      });
      watcher.on('error', () => {
        /* directory may be transient */
      });
      watchers.push(watcher);
    } catch (err) {
      console.warn(`[watcher] cannot watch ${path.basename(dir)}:`, err.message);
    }
  }

  watchDir(repo, (n) => n === 'BOARD.md');
  if (fs.existsSync(path.join(repo, 'projects'))) {
    watchDir(path.join(repo, 'projects'), (n) => n.endsWith('.md'));
  }
  if (fs.existsSync(path.join(repo, 'tasks'))) {
    watchDir(path.join(repo, 'tasks'), (n) => n.endsWith('.md'));
  }

  return function dispose() {
    if (timer) clearTimeout(timer);
    for (const w of watchers) {
      try {
        w.close();
      } catch (_) {
        /* ignore */
      }
    }
    watchers.length = 0;
  };
}

module.exports = { watchRepo };
