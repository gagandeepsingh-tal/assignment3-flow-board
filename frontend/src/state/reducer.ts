import type { BoardAction, BoardState, ColumnKey } from "./types";
import {
  AllColumnKeys,
  assertUnreachable,
  cloneState,
  createInitialBoardState,
  findTaskLocation,
  generateId,
  validateTitle,
} from "./types";

export function boardReducer(
  state: BoardState = createInitialBoardState(),
  action: BoardAction
): BoardState {
  switch (action.type) {
    case "HYDRATE": {
      // Trust the provided state but ensure immutability
      const next: BoardState = {
        filter: action.payload.state.filter,
        columns: {
          todo: [...action.payload.state.columns.todo],
          inProgress: [...action.payload.state.columns.inProgress],
          done: [...action.payload.state.columns.done],
        },
      };
      return next;
    }

    case "ADD_TASK": {
      const targetColumn: ColumnKey = action.payload.column ?? "todo";
      if (!AllColumnKeys.includes(targetColumn)) return state;
      const validated = validateTitle(action.payload.title);
      if (!validated.ok) return state;
      const newTask = {
        id: generateId(),
        title: validated.value!,
        column: targetColumn,
      };
      const next = cloneState(state);
      next.columns[targetColumn] = [newTask, ...next.columns[targetColumn]];
      return next;
    }

    case "EDIT_TASK_TITLE": {
      const validated = validateTitle(action.payload.title);
      if (!validated.ok) return state;
      const loc = findTaskLocation(state, action.payload.id);
      if (!loc) return state;
      const next = cloneState(state);
      const tasks = next.columns[loc.column];
      const original = tasks[loc.index];
      tasks[loc.index] = { ...original, title: validated.value! };
      return next;
    }

    case "DELETE_TASK": {
      const loc = findTaskLocation(state, action.payload.id);
      if (!loc) return state;
      const next = cloneState(state);
      next.columns[loc.column] = next.columns[loc.column].filter(
        (t) => t.id !== action.payload.id
      );
      return next;
    }

    case "MOVE_TASK": {
      const loc = findTaskLocation(state, action.payload.id);
      if (!loc) return state;
      const toColumn = action.payload.toColumn;
      if (!AllColumnKeys.includes(toColumn)) return state;

      const next = cloneState(state);
      const [task] = next.columns[loc.column].splice(loc.index, 1);
      const insertIndex = clampIndex(
        action.payload.toIndex ?? next.columns[toColumn].length,
        0,
        next.columns[toColumn].length
      );
      next.columns[toColumn] = [
        ...next.columns[toColumn].slice(0, insertIndex),
        { ...task, column: toColumn },
        ...next.columns[toColumn].slice(insertIndex),
      ];
      return next;
    }

    case "REORDER_WITHIN_COLUMN": {
      const { column, fromIndex, toIndex } = action.payload;
      if (!AllColumnKeys.includes(column)) return state;
      const tasks = state.columns[column];
      if (
        fromIndex < 0 ||
        fromIndex >= tasks.length ||
        toIndex < 0 ||
        toIndex >= tasks.length
      )
        return state;
      if (fromIndex === toIndex) return state;

      const next = cloneState(state);
      const list = next.columns[column];
      const [moved] = list.splice(fromIndex, 1);
      list.splice(toIndex, 0, moved);
      return next;
    }

    case "SET_FILTER": {
      return { ...state, filter: action.payload.filter };
    }

    default:
      assertUnreachable(action.type);
      return state;
  }
}

function clampIndex(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  if (value < min) return min;
  if (value > max) return max;
  return value;
}


