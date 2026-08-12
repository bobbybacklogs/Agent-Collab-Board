// Board SDK — TypeScript declarations (hand-written, matching index.js).

/// <reference types="node" />

import { EventEmitter } from 'events';

// ---------- op vocabulary ----------

export type OpName =
  | 'badge'
  | 'kv'
  | 'label'
  | 'section'
  | 'projectState'
  | 'check'
  | 'task'
  | 'taskKV'
  | 'taskBadge'
  | 'taskLabel'
  | 'taskCheck';

export type WorkflowName = 'Backlog' | 'Ready' | 'In Progress' | 'Blocked' | 'Review' | 'Done';

export type BoardStateName =
  | 'Planning'
  | 'Ready'
  | 'Active'
  | 'Blocked'
  | 'Review'
  | 'Paused'
  | 'Complete'
  | 'Archived';

export type PriorityName = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Op {
  op: OpName;
  [key: string]: unknown;
}

export interface OpsVocabulary {
  ops: OpName[];
  workflows: WorkflowName[];
  boardStates: BoardStateName[];
  priorities: PriorityName[];
}

// ---------- state shapes ----------

export interface BoardState {
  generatedAt: string;
  board: unknown;
  projects: Array<{
    slug: string;
    project: unknown;
    taskBoard: unknown;
  }>;
}

export interface BoardReadOptions {
  /** Return BOARD.md portfolio state only. */
  board?: boolean;
  /** Return a single project (project file + task board). */
  project?: string;
  /** Return a single project's task board only. */
  tasks?: string;
}

export interface ApplyOptions {
  /** Compute and return the resulting text without writing. */
  dryRun?: boolean;
}

export interface ApplyResult {
  ok: boolean;
  dryRun?: boolean;
  target: string;
  ops: number;
  /** Resulting file text (present when dryRun is true, or always from apply). */
  next?: string;
}

export interface ValidateResult {
  ok: boolean;
  valid: boolean;
  target: string;
  ops: number;
}

export interface WatchOptions {
  /** Debounce window in ms (default 150). */
  debounceMs?: number;
}

export type Disposer = () => void;

// ---------- board handle ----------

export interface Board {
  /** Repo root this board is bound to. */
  repo: string;

  /**
   * Read parsed state.
   * read()                        -> full { board, projects }
   * read({ board: true })         -> { board }
   * read({ project: 'slug' })     -> { slug, project, taskBoard }
   * read({ tasks: 'slug' })       -> { slug, taskBoard }
   */
  read(options?: BoardReadOptions): any;

  /**
   * Validate ops for a target and, unless dryRun, write them.
   * target: BOARD.md | projects/<slug>.md | tasks/<slug>-tasks.md
   * Throws on invalid target, invalid ops, missing file, or a write that
   * would no longer re-parse.
   */
  apply(target: string, ops: Op[], options?: ApplyOptions): ApplyResult;

  /** Validate ops for a target without writing. Throws when invalid. */
  validate(target: string, ops: Op[]): ValidateResult;

  /**
   * Watch BOARD.md, projects/*.md, and tasks/*-tasks.md (debounced).
   * Returns a disposer that stops watching.
   */
  watch(onChange: () => void, options?: WatchOptions): Disposer;

  /** Supported op vocabulary + workflow/state/priority constants. */
  ops(): OpsVocabulary;
}

// ---------- factory + re-exports ----------

/**
 * Create a board handle bound to a repo root.
 * @param repo absolute path to the repo; defaults to $BOARD_REPO, then cwd.
 */
export function createBoard(repo?: string): Board;

export const OP_NAMES: readonly OpName[];
export const WORKFLOW_NAMES: readonly WorkflowName[];
export const BOARD_STATES: readonly BoardStateName[];
export const PRIORITY_VALUES: readonly PriorityName[];

// Low-level helpers (re-exported for advanced use).
export function readState(repo: string): BoardState;
export function resolveTarget(target: string): { fileRel: string; scope: string } | null;
export function validateOps(ops: Op[], scope: string): void;
export function writeTarget(repo: string, resolved: { fileRel: string; scope: string }, ops: Op[]): string;
export function watchRepo(
  repo: string,
  onChange: () => void,
  options?: WatchOptions & { filter?: (filename: string) => boolean }
): Disposer;
export function apply(text: string, ops: Op[]): string;
export function slugFromRef(ref: string): string;
