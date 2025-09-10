import { describe, it, expect } from "vitest";
import { boardReducer } from "./reducer";
import {
  AllColumnKeys,
  BoardAction,
  BoardState,
  ColumnKey,
  MAX_TITLE_LENGTH,
  createInitialBoardState,
  validateTitle,
} from "./types";

function makeState(tasks: Array<{ id: string; title: string; column: ColumnKey }>): BoardState {
  const base = createInitialBoardState();
  const next: BoardState = {
    filter: base.filter,
    columns: {
      todo: [],
      inProgress: [],
      done: [],
    },
  };
  for (const t of tasks) {
    next.columns[t.column].push({ ...t });
  }
  return next;
}

describe("validateTitle", () => {
  it("trims and collapses whitespace", () => {
    const res = validateTitle("  Hello   world   ");
    expect(res.ok).toBe(true);
    expect(res.value).toBe("Hello world");
  });

  it("rejects empty titles", () => {
    const res = validateTitle("   \n\t ");
    expect(res.ok).toBe(false);
  });

  it("rejects too long titles", () => {
    const long = "x".repeat(MAX_TITLE_LENGTH + 1);
    const res = validateTitle(long);
    expect(res.ok).toBe(false);
  });
});

describe("boardReducer - HYDRATE", () => {
  it("replaces state immutably", () => {
    const initial = createInitialBoardState();
    const hydrated: BoardState = makeState([
      { id: "1", title: "A", column: "todo" },
      { id: "2", title: "B", column: "inProgress" },
    ]);
    const next = boardReducer(initial, { type: "HYDRATE", payload: { state: hydrated } });
    expect(next).not.toBe(initial);
    expect(next.columns.todo).toHaveLength(1);
    expect(next.columns.inProgress).toHaveLength(1);
  });
});

describe("boardReducer - ADD_TASK", () => {
  it("adds to todo by default", () => {
    const state = createInitialBoardState();
    const next = boardReducer(state, { type: "ADD_TASK", payload: { title: "Task" } });
    expect(next.columns.todo).toHaveLength(1);
    expect(next.columns.todo[0].title).toBe("Task");
    expect(next.columns.todo[0].column).toBe("todo");
    expect(state.columns.todo).toHaveLength(0); // immutability
  });

  it("adds to a specified column", () => {
    const state = createInitialBoardState();
    const next = boardReducer(state, {
      type: "ADD_TASK",
      payload: { title: "X", column: "inProgress" },
    });
    expect(next.columns.inProgress).toHaveLength(1);
  });

  it("rejects invalid title", () => {
    const state = createInitialBoardState();
    const next = boardReducer(state, { type: "ADD_TASK", payload: { title: "   " } });
    expect(next).toBe(state);
  });
});

describe("boardReducer - EDIT_TASK_TITLE", () => {
  it("updates title immutably", () => {
    const state = makeState([{ id: "t1", title: "Old", column: "todo" }]);
    const next = boardReducer(state, {
      type: "EDIT_TASK_TITLE",
      payload: { id: "t1", title: "New" },
    });
    expect(next.columns.todo[0].title).toBe("New");
    expect(state.columns.todo[0].title).toBe("Old");
  });

  it("no-op when id not found or title invalid", () => {
    const state = makeState([{ id: "t1", title: "Old", column: "todo" }]);
    const nextMissing = boardReducer(state, {
      type: "EDIT_TASK_TITLE",
      payload: { id: "nope", title: "New" },
    });
    expect(nextMissing).toBe(state);

    const nextInvalid = boardReducer(state, {
      type: "EDIT_TASK_TITLE",
      payload: { id: "t1", title: "   " },
    });
    expect(nextInvalid).toBe(state);
  });
});

describe("boardReducer - DELETE_TASK", () => {
  it("removes by id", () => {
    const state = makeState([
      { id: "a", title: "A", column: "todo" },
      { id: "b", title: "B", column: "todo" },
    ]);
    const next = boardReducer(state, { type: "DELETE_TASK", payload: { id: "a" } });
    expect(next.columns.todo.map((t) => t.id)).toEqual(["b"]);
  });

  it("no-op when id not found", () => {
    const state = makeState([{ id: "a", title: "A", column: "todo" }]);
    const next = boardReducer(state, { type: "DELETE_TASK", payload: { id: "x" } });
    expect(next).toBe(state);
  });
});

describe("boardReducer - MOVE_TASK", () => {
  it("moves across columns with index clamping", () => {
    const state = makeState([
      { id: "a", title: "A", column: "todo" },
      { id: "b", title: "B", column: "todo" },
    ]);
    const next = boardReducer(state, {
      type: "MOVE_TASK",
      payload: { id: "a", toColumn: "inProgress", toIndex: 5 },
    });
    expect(next.columns.todo.map((t) => t.id)).toEqual(["b"]);
    expect(next.columns.inProgress.map((t) => t.id)).toEqual(["a"]);
    expect(next.columns.inProgress[0].column).toBe("inProgress");
  });

  it("moves within the same column by removal+insertion", () => {
    const state = makeState([
      { id: "a", title: "A", column: "todo" },
      { id: "b", title: "B", column: "todo" },
      { id: "c", title: "C", column: "todo" },
    ]);
    const next = boardReducer(state, {
      type: "MOVE_TASK",
      payload: { id: "a", toColumn: "todo", toIndex: 2 },
    });
    expect(next.columns.todo.map((t) => t.id)).toEqual(["b", "c", "a"]);
  });

  it("no-op on unknown id", () => {
    const state = createInitialBoardState();
    const next = boardReducer(state, {
      type: "MOVE_TASK",
      payload: { id: "z", toColumn: "done" },
    });
    expect(next).toBe(state);
  });
});

describe("boardReducer - REORDER_WITHIN_COLUMN", () => {
  it("reorders items in place", () => {
    const state = makeState([
      { id: "a", title: "A", column: "done" },
      { id: "b", title: "B", column: "done" },
      { id: "c", title: "C", column: "done" },
    ]);
    const next = boardReducer(state, {
      type: "REORDER_WITHIN_COLUMN",
      payload: { column: "done", fromIndex: 0, toIndex: 2 },
    });
    expect(next.columns.done.map((t) => t.id)).toEqual(["b", "c", "a"]);
  });

  it("no-op when out of bounds or same index", () => {
    const state = makeState([
      { id: "a", title: "A", column: "todo" },
      { id: "b", title: "B", column: "todo" },
    ]);
    const same = boardReducer(state, {
      type: "REORDER_WITHIN_COLUMN",
      payload: { column: "todo", fromIndex: 1, toIndex: 1 },
    });
    expect(same).toBe(state);

    const oob = boardReducer(state, {
      type: "REORDER_WITHIN_COLUMN",
      payload: { column: "todo", fromIndex: -1, toIndex: 3 },
    });
    expect(oob).toBe(state);
  });
});

describe("boardReducer - SET_FILTER", () => {
  it("sets filter value", () => {
    const state = createInitialBoardState();
    const next = boardReducer(state, { type: "SET_FILTER", payload: { filter: "inProgress" } });
    expect(next.filter).toBe("inProgress");
  });
});


