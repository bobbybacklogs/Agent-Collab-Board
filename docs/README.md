# Documentation Index

![Docs](https://img.shields.io/badge/docs-index-0969da)
![Server](https://img.shields.io/badge/server-Local%20Dashboard-238636)
![Read](https://img.shields.io/badge/read-only-6e7781)

The `docs/` folder holds human-oriented and policy documentation for the repository.

| File | Purpose |
| --- | --- |
| [`README.md`](./README.md) | This index and the local dashboard server guide |
| [`HOWTO.md`](./HOWTO.md) | Practical user guide for working with coding agents |
| [`INSTRUCTIONS.md`](./INSTRUCTIONS.md) | Full repository operating policy |

---

## Live Dashboard Server

The repository includes a small local server that renders the board as a readable dashboard in a browser. It is a companion to the Markdown files, not a replacement for them.

### What It Does

- Shows the portfolio (`BOARD.md`) as columns grouped by project state.
- Opens project cards and their task boards in detail views.
- Refreshes the open page automatically whenever a watched Markdown file changes.
- Reads only. It never edits the files it renders.

### Starting It

From the `ui/` directory, run:

```text
node server.js
```

Then open the printed local address in a browser (default `http://localhost:4173`).

The server uses Node.js built-ins only. No package install is required.

### What It Watches

The server reloads the page when any of these change:

```text
BOARD.md
projects/*.md
tasks/*-tasks.md
```

Keep that in mind while editing state: the open page updates live.

### Using the Dashboard

- **Board columns.** The board shows five state columns by default (`Planning`, `Ready`, `Active`, `Blocked`, `Review`). Use the `Columns` button to show or hide any state, and `+ Custom column` to add rule-based columns. Column choices are remembered per browser.
- **Project detail.** Click a project card to open its project file as a detail drawer.
- **Task detail.** Click a task card inside a project to open its task record.
- **Live indicator.** The top bar shows `Live` when connected to the update stream and `Offline` when it is not.

### Configuration

Two optional environment variables:

```text
PORT       Port number     (default 4173)
BOARD_REPO Path to repo     (default: parent of ui/)
```

To run on another port, set `PORT` in your shell before starting, for example:

```text
set PORT=8080
node server.js
```

Then open `http://localhost:8080`.

### Troubleshooting

**Port already in use**

The server prints a message about the port being taken. Start it on another port, for example:

```bash
set PORT=8080
node server.js
```

**Page shows Offline**

The server is not running or the page lost its live feed. Restart the server and refresh.

---

## Documentation Roadmap

| Document | Audience |
| --- | --- |
| [`HOWTO.md`](./HOWTO.md) | People working with coding agents |
| [`INSTRUCTIONS.md`](./INSTRUCTIONS.md) | Full operating policy for the state system |
| [`README.md`](./README.md) | Dashboard server usage (this document) |

---

## Repository Links

- [`BOARD.md`](../BOARD.md) — live portfolio state.
- [`AGENTS.md`](../AGENTS.md) — canonical agent entrypoint.
- [`HOWTO.md`](./HOWTO.md) — working with agents.