## Task 010: Unit Tests

### Scope
- Unit tests for reducer actions and edge cases.
- Tests for storage helpers (load/save, corrupt JSON handling).
- Component logic tests for CreateTaskModal validation and inline edit behavior.
- Helper tests for DnD target index computation (pure util functions).

### Steps
1) Write reducer tests: add, edit, delete, move, reorder, hydrate, set filter.
2) Mock localStorage for storage util tests; verify debounced save can be awaited.
3) Test CreateTaskModal: disabled/enable states, Enter submit, Esc cancel.
4) Test inline editing on TaskCard: dblclick to edit, Enter/blur save, Esc cancel.
5) Test filter application in Column rendering (shallow/RTL as needed).

### Acceptance Criteria
- `npm run test` passes with meaningful coverage for core logic.
- Edge cases covered (empty/whitespace titles, max length, moving indices).


