## Task 003: Board State Context and Reducer

### Scope
- Define TypeScript types for `Task`, `BoardState`, `ColumnKey`, `StatusFilter`.
- Implement reducer with actions: ADD_TASK, EDIT_TASK_TITLE, DELETE_TASK, MOVE_TASK, REORDER_WITHIN_COLUMN, SET_FILTER, HYDRATE.
- Provide `BoardContext` and `BoardProvider` with typed hooks.
- Generate IDs via crypto.randomUUID with fallback.

### Steps
1) Create `src/state/types.ts`, `src/state/reducer.ts`, `src/state/context.tsx`.
2) Implement reducer with pure updates and exhaustive switch.
3) Add hooks: `useBoardState`, `useBoardDispatch`.
4) Add input validation utils (trim, max length 100).

### Acceptance Criteria
- Reducer compiles with strict TypeScript.
- Unit tests cover all actions and edge cases.
- Context provides stable references and is tree-shakable.


