import { describe, it, expect, beforeEach, vi } from "vitest";
import { loadBoardState, saveBoardState, loadFilter, saveFilter } from "./storage";
import { createInitialBoardState } from "../state/types";

const TASKS_KEY = "flowboard_tasks_v1";
const FILTER_KEY = "flowboard_filter_v1";

function getItem(key: string): string | null {
  return (globalThis as any).localStorage?.getItem(key) ?? null;
}

function setItem(key: string, value: string) {
  (globalThis as any).localStorage?.setItem(key, value);
}

describe("storage helpers", () => {
  beforeEach(() => {
    const store = new Map<string, string>();
    (globalThis as any).localStorage = {
      getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
      setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k),
      clear: () => void store.clear(),
      key: (i: number) => Array.from(store.keys())[i] ?? null,
      get length() {
        return store.size;
      },
    } as Storage;
  });

  it("saves and loads board state roundtrip", () => {
    const state = createInitialBoardState();
    state.columns.todo.push({ id: "1", title: "A", column: "todo" });
    saveBoardState(state);
    const raw = getItem(TASKS_KEY);
    expect(raw).toBeTruthy();
    const loaded = loadBoardState();
    expect(loaded.columns.todo).toHaveLength(1);
    expect(loaded.columns.todo[0].title).toBe("A");
  });

  it("handles corrupt JSON safely", () => {
    setItem(TASKS_KEY, "{not json");
    const loaded = loadBoardState();
    expect(loaded.columns.todo).toHaveLength(0);
  });

  it("ignores malformed items but keeps valid ones", () => {
    setItem(
      TASKS_KEY,
      JSON.stringify({
        todo: [{ id: "1", title: "ok" }, { id: 5 }],
        inProgress: "nope",
        done: [{ id: "2", title: "done" }],
      })
    );
    const loaded = loadBoardState();
    expect(loaded.columns.todo).toHaveLength(1);
    expect(loaded.columns.done).toHaveLength(1);
  });

  it("saves and loads filter with guard", () => {
    saveFilter("inProgress");
    expect(loadFilter()).toBe("inProgress");
    setItem(FILTER_KEY, JSON.stringify("weird"));
    expect(loadFilter()).toBe("all");
  });
});


