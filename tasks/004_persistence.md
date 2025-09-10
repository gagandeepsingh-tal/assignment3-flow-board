## Task 004: Persistence to localStorage

### Scope
- Implement load/save of board state to localStorage under `flowboard_tasks_v1` and filter under `flowboard_filter_v1`.
- Add debounce (≈150ms) to save to avoid excessive writes.
- Add schema guards and safe JSON parse.

### Steps
1) Create `src/utils/storage.ts` with `loadBoardState`, `saveBoardState`, `loadFilter`, `saveFilter`.
2) Create `src/hooks/useDebouncedEffect.ts` and integrate persistence in provider.
3) On app start, dispatch HYDRATE with validated state.

### Acceptance Criteria
- State persists across reloads.
- Corrupt JSON fails safe to empty defaults.
- Unit tests for storage helpers and HYDRATE path.


