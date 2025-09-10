## Task 009: Status Filtering

### Scope
- Add status filter dropdown (All / To Do / In Progress / Done) in TopBar.
- Persist selection to localStorage under `flowboard_filter_v1`.
- Show all columns; display only tasks whose status matches the selected filter within each column.

### Steps
1) Create a controlled select component bound to context filter.
2) On change, dispatch SET_FILTER and persist.
3) Apply filter function in `Column` render loop.

### Acceptance Criteria
- Filter defaults to All on first run and persists across reloads.
- Columns remain visible; only matching tasks are shown.


