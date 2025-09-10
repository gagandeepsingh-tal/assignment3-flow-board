// Shared types and utilities for the FlowBoard state

export type ColumnKey = "todo" | "inProgress" | "done";

export type StatusFilter = "all" | ColumnKey;

export interface Task {
  id: string;
  title: string;
  column: ColumnKey;
}

export interface BoardState {
  columns: Record<ColumnKey, Task[]>;
  filter: StatusFilter;
}

// Action Types
export type BoardAction =
  | { type: "ADD_TASK"; payload: { title: string; column?: ColumnKey } }
  | { type: "EDIT_TASK_TITLE"; payload: { id: string; title: string } }
  | { type: "DELETE_TASK"; payload: { id: string } }
  | {
      type: "MOVE_TASK";
      payload: { id: string; toColumn: ColumnKey; toIndex?: number };
    }
  | {
      type: "REORDER_WITHIN_COLUMN";
      payload: { column: ColumnKey; fromIndex: number; toIndex: number };
    }
  | { type: "SET_FILTER"; payload: { filter: StatusFilter } }
  | { type: "HYDRATE"; payload: { state: BoardState } };

export const AllColumnKeys: ColumnKey[] = ["todo", "inProgress", "done"];

export const isColumnKey = (value: unknown): value is ColumnKey => {
  return typeof value === "string" && (AllColumnKeys as string[]).includes(value);
};

export const AllStatusFilters: StatusFilter[] = [
  "all",
  ...AllColumnKeys,
];

export const isStatusFilter = (value: unknown): value is StatusFilter => {
  return (
    typeof value === "string" && (AllStatusFilters as string[]).includes(value)
  );
};

// Validation utilities
export const MAX_TITLE_LENGTH = 100;

export function normalizeWhitespace(input: string): string {
  // Trim and collapse consecutive whitespace to single spaces
  const trimmed = input.trim();
  return trimmed.replace(/\s+/g, " ");
}

export function validateTitle(input: string): {
  ok: boolean;
  value?: string;
  error?: string;
} {
  const normalized = normalizeWhitespace(input);
  if (normalized.length === 0) {
    return { ok: false, error: "Title cannot be empty" };
  }
  if (normalized.length > MAX_TITLE_LENGTH) {
    return { ok: false, error: `Title cannot exceed ${MAX_TITLE_LENGTH} characters` };
  }
  return { ok: true, value: normalized };
}

// ID generation with crypto.randomUUID fallback
export function generateId(): string {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyCrypto = (globalThis as any).crypto;
    if (anyCrypto && typeof anyCrypto.randomUUID === "function") {
      return anyCrypto.randomUUID();
    }
  } catch (_) {
    // ignore
  }
  // Fallback: timestamp + random
  const rand = Math.random().toString(36).slice(2, 10);
  return `tsk_${Date.now().toString(36)}_${rand}`;
}

export function createInitialBoardState(): BoardState {
  return {
    columns: {
      todo: [],
      inProgress: [],
      done: [],
    },
    filter: "all",
  };
}

export function assertUnreachable(x: never): never {
  throw new Error(`Unhandled case: ${String(x)}`);
}

export function cloneState(state: BoardState): BoardState {
  return {
    filter: state.filter,
    columns: {
      todo: [...state.columns.todo],
      inProgress: [...state.columns.inProgress],
      done: [...state.columns.done],
    },
  };
}

export function findTaskLocation(
  state: BoardState,
  taskId: string
): { column: ColumnKey; index: number } | null {
  for (const column of AllColumnKeys) {
    const index = state.columns[column].findIndex((t) => t.id === taskId);
    if (index !== -1) return { column, index };
  }
  return null;
}


