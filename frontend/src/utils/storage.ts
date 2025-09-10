import type { BoardState, ColumnKey, StatusFilter } from "../state/types";
import { AllColumnKeys, createInitialBoardState, isStatusFilter } from "../state/types";

const TASKS_KEY = "flowboard_tasks_v1";
const FILTER_KEY = "flowboard_filter_v1";

type StoredColumns = Record<ColumnKey, Array<{ id: string; title: string; column?: ColumnKey }>>;

function safeJsonParse<T>(input: string | null): T | null {
  if (typeof input !== "string") return null;
  try {
    return JSON.parse(input) as T;
  } catch {
    return null;
  }
}

function coerceStoredColumns(value: unknown): StoredColumns | null {
  if (typeof value !== "object" || value === null) return null;
  const obj = value as Record<string, unknown>;
  const result: StoredColumns = {
    todo: [],
    inProgress: [],
    done: [],
  };

  for (const column of AllColumnKeys) {
    const arr = obj[column];
    if (!Array.isArray(arr)) continue;
    const sanitized = arr
      .map((item) => (typeof item === "object" && item !== null ? (item as Record<string, unknown>) : null))
      .filter((item): item is Record<string, unknown> => !!item)
      .map((item) => {
        const id = typeof item.id === "string" ? item.id : null;
        const title = typeof item.title === "string" ? item.title : null;
        if (!id || !title) return null;
        return { id, title, column } as { id: string; title: string; column: ColumnKey };
      })
      .filter((x): x is { id: string; title: string; column: ColumnKey } => !!x);
    result[column] = sanitized;
  }

  return result;
}

export function loadBoardState(): BoardState {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    const parsed = safeJsonParse<unknown>(raw);
    const columns = coerceStoredColumns(parsed);
    if (!columns) return createInitialBoardState();
    return {
      columns: {
        todo: columns.todo.map((t) => ({ ...t, column: "todo" } as const)),
        inProgress: columns.inProgress.map((t) => ({ ...t, column: "inProgress" } as const)),
        done: columns.done.map((t) => ({ ...t, column: "done" } as const)),
      },
      filter: "all",
    };
  } catch {
    return createInitialBoardState();
  }
}

export function saveBoardState(state: BoardState): void {
  const toStore: StoredColumns = {
    todo: state.columns.todo.map(({ id, title }) => ({ id, title })),
    inProgress: state.columns.inProgress.map(({ id, title }) => ({ id, title })),
    done: state.columns.done.map(({ id, title }) => ({ id, title })),
  } as StoredColumns;
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(toStore));
  } catch {
    // ignore quota errors
  }
}

export function loadFilter(): StatusFilter {
  try {
    const raw = localStorage.getItem(FILTER_KEY);
    const parsed = safeJsonParse<unknown>(raw);
    if (typeof parsed === "string" && isStatusFilter(parsed)) return parsed;
    return "all";
  } catch {
    return "all";
  }
}

export function saveFilter(filter: StatusFilter): void {
  try {
    localStorage.setItem(FILTER_KEY, JSON.stringify(filter));
  } catch {
    // ignore
  }
}

export const StorageKeys = {
  TASKS_KEY,
  FILTER_KEY,
} as const;


