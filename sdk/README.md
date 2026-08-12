# agent-board

Zero-dependency Node SDK for the **Agent Collab Board** Markdown state system.

The board repository stores its operational state in Markdown (`BOARD.md`,
`projects/<slug>.md`, `tasks/<slug>-tasks.md`). This SDK exposes that state as
a programmatic API: read it, apply validated surgical edits, watch for
changes, and inspect the op vocabulary.

The dashboard server (`ui/server.js`) and the agent CLI (`sdk/bin/cli.js`,
also reachable at `node ui/lib/cli.js`) both consume this SDK.

## Install

```bash
npm install agent-board
```

Requires Node.js >= 18. No runtime dependencies.

## Quick start

```js
const { createBoard } = require('agent-board');

const board = createBoard('/path/to/repo'); // or $BOARD_REPO / process.cwd()

// Read parsed state
const state = board.read();                       // full board + projects
const portfolio = board.read({ board: true });    // BOARD.md only
const project = board.read({ project: 'auth' });  // project + task board
const tasks = board.read({ tasks: 'auth' });      // task board only

// Apply a validated, surgical edit
const result = board.apply('tasks/auth-tasks.md', [
  { op: 'taskKV', taskId: 'AUTH-001', key: 'Status', value: 'Done' },
]);
console.log(result); // { ok: true, target: 'tasks/auth-tasks.md', ops: 1, next }

// Validate without writing
board.validate('BOARD.md', [{ op: 'kv', key: 'Status', value: 'Ready' }]);

// Watch for changes (debounced); returns a disposer
const dispose = board.watch(() => console.log('board changed'), { debounceMs: 150 });
// ...later:
dispose();

// Op vocabulary
console.log(board.ops());
```

## API

### `createBoard(repo?) -> Board`

Create a board handle. `repo` defaults to `$BOARD_REPO`, then `process.cwd()`.

### `board.read(options?)`

| options | returns |
| --- | --- |
| *(none)* | `{ board, projects }` |
| `{ board: true }` | `{ board }` |
| `{ project: 'slug' }` | `{ slug, project, taskBoard }` |
| `{ tasks: 'slug' }` | `{ slug, taskBoard }` |

### `board.apply(target, ops, options?)`

Write validated ops to a target file. Throws on invalid target, invalid ops,
missing file, or a write that would no longer re-parse (the write is
re-parse-guarded).

Targets: `BOARD.md` | `projects/<slug>.md` | `tasks/<slug>-tasks.md`

`options.dryRun` returns the resulting text without writing.

### `board.validate(target, ops)`

Validate ops against a target without writing. Throws when invalid.

### `board.watch(onChange, options?)`

Watch `BOARD.md`, `projects/*.md`, and `tasks/*-tasks.md` and call
`onChange` (debounced, default 150 ms). Returns a disposer.

### `board.ops()`

Op vocabulary: `ops`, `workflows`, `boardStates`, `priorities`.

Supported ops: `badge`, `kv`, `label`, `section`, `projectState`, `check`,
`task`, `taskKV`, `taskBadge`, `taskLabel`, `taskCheck`.

## CLI

When installed, the package provides an `agent-board` bin:

```bash
agent-board read [--board|--project <slug>|--tasks <slug>] [--pretty]
agent-board apply <target> '<ops-json>' [--dry-run]
agent-board validate <target> '<ops-json>'
agent-board ops
```

The legacy path also works inside the repo: `node ui/lib/cli.js ...`.

`BOARD_REPO` overrides the repo root everywhere.

## TypeScript

Hand-written declarations ship at `index.d.ts` (see `types` in
`package.json`). No build step required.

## License

MIT
