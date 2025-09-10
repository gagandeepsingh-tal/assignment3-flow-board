import React, { Dispatch, PropsWithChildren, createContext, useContext, useEffect, useMemo, useReducer } from "react";
import type { BoardAction, BoardState } from "./types";
import { createInitialBoardState } from "./types";
import { boardReducer } from "./reducer";
import { loadBoardState, loadFilter, saveBoardState, saveFilter } from "../utils/storage";
import { useDebouncedEffect } from "../hooks/useDebouncedEffect";

const BoardStateContext = createContext<BoardState | undefined>(undefined);
const BoardDispatchContext = createContext<Dispatch<BoardAction> | undefined>(
  undefined
);

export function BoardProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(boardReducer, undefined, () =>
    createInitialBoardState()
  );

  const stateValue = useMemo(() => state, [state]);
  const dispatchValue = useMemo(() => dispatch, [dispatch]);

  // HYDRATE on mount from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const persisted = loadBoardState();
    const persistedFilter = loadFilter();
    dispatch({ type: "HYDRATE", payload: { state: { ...persisted, filter: persistedFilter } } });
  }, []);

  // Debounced persistence for tasks and filter
  useDebouncedEffect(
    () => {
      if (typeof window === "undefined") return;
      saveBoardState(stateValue);
    },
    [stateValue.columns]
  );

  useDebouncedEffect(
    () => {
      if (typeof window === "undefined") return;
      saveFilter(stateValue.filter);
    },
    [stateValue.filter]
  );

  return (
    <BoardStateContext.Provider value={stateValue}>
      <BoardDispatchContext.Provider value={dispatchValue}>
        {children}
      </BoardDispatchContext.Provider>
    </BoardStateContext.Provider>
  );
}

export function useBoardState(): BoardState {
  const ctx = useContext(BoardStateContext);
  if (!ctx) throw new Error("useBoardState must be used within a BoardProvider");
  return ctx;
}

export function useBoardDispatch(): Dispatch<BoardAction> {
  const ctx = useContext(BoardDispatchContext);
  if (!ctx)
    throw new Error("useBoardDispatch must be used within a BoardProvider");
  return ctx;
}


