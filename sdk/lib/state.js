'use strict';

const fs = require('fs');
const path = require('path');
const { parseBoard, parseProject, parseTaskBoard } = require('./parse');

function slugFromRef(ref) {
  const base = path.basename(String(ref || '')).replace(/\.md$/i, '').replace(/-tasks$/, '');
  if (base.includes('<') || base.includes('>')) return '';
  return base;
}

function readUtf8(file) {
  return fs.readFileSync(file, 'utf8');
}

// Assemble the full dashboard state from the repository Markdown.
function readState(repo) {
  const boardFile = path.join(repo, 'BOARD.md');
  const projectsDir = path.join(repo, 'projects');
  const tasksDir = path.join(repo, 'tasks');

  let board = null;
  if (fs.existsSync(boardFile)) {
    try {
      board = parseBoard(readUtf8(boardFile));
      board.source = 'BOARD.md';
    } catch (err) {
      board = { error: err.message };
    }
  }

  const SCAFFOLD_FILES = new Set(['AGENTS', 'INSTRUCTIONS', 'README']);

  const slugs = new Set();
  if (board && !board.error && Array.isArray(board.sections)) {
    for (const section of board.sections) {
      for (const card of section.projects) {
        if (card.refs.project) slugs.add(slugFromRef(card.refs.project));
        const t = slugFromRef(card.refs.tasks);
        if (t) slugs.add(t);
      }
    }
  }
  if (fs.existsSync(projectsDir)) {
    for (const f of fs.readdirSync(projectsDir)) {
      if (f.startsWith('_') || !f.endsWith('.md')) continue;
      const name = f.slice(0, -3);
      if (SCAFFOLD_FILES.has(name)) continue;
      slugs.add(name);
    }
  }

  const projects = [];
  for (const slug of slugs) {
    const pFile = path.join(projectsDir, `${slug}.md`);
    const tFile = path.join(tasksDir, `${slug}-tasks.md`);

    let project = null;
    if (fs.existsSync(pFile)) {
      try {
        project = parseProject(readUtf8(pFile), slug);
        project.source = path.relative(repo, pFile);
      } catch (err) {
        project = { slug, title: slug, error: err.message };
      }
    }

    let taskBoard = null;
    if (fs.existsSync(tFile)) {
      try {
        taskBoard = parseTaskBoard(readUtf8(tFile));
        taskBoard.source = path.relative(repo, tFile);
      } catch (err) {
        taskBoard = { error: err.message };
      }
    }

    projects.push({ slug, project, taskBoard });
  }

  return {
    generatedAt: new Date().toISOString(),
    board,
    projects,
  };
}

module.exports = { readState, slugFromRef };