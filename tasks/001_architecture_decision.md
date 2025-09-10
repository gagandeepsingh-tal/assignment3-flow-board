## ADR-001: Architecture Decision for FlowBoard

### Status
Accepted (v1)

### Context
Build a lightweight, desktop-first Kanban (To Do, In Progress, Done) with HTML5 drag-and-drop, localStorage persistence, and a small but well-documented architecture. No external DnD libraries; unit tests only.

### Decisions
- Framework: React + TypeScript using Vite
- Styling: Tailwind CSS
- State management: Context + reducer for global board state
- Persistence: localStorage under key `flowboard_tasks_v1` (debounced ~150ms on state changes)
- Filter: Included (All/To Do/In Progress/Done) with key `flowboard_filter_v1`; show all columns but only tasks matching selected status in each; persists across reloads
- Drag-and-drop: HTML5 DnD (desktop-only v1), default browser drag preview; whole card is draggable; supports reordering within a column
- Task editing: Inline on card (double-click to edit; Enter/blur saves; Escape cancels); non-empty trimmed title; max length 100
- Delete: Custom Tailwind modal confirmation; trash icon on hover triggers it
- Ordering model: Per-column order arrays (three independent sequences of task IDs)
- Initial data: Empty board on first launch
- Testing: Unit/integration tests only with Vitest + React Testing Library + jest-dom; no E2E

### State Shape (TypeScript types)
```ts
export type ColumnKey = 'todo' | 'in_progress' | 'done';

export interface Task {
  id: string;           // crypto.randomUUID() with timestamp fallback
  title: string;        // 1..100 chars (trimmed)
}

export interface ColumnsOrder {
  todo: string[];
  in_progress: string[];
  done: string[];
}

export type StatusFilter = 'all' | 'todo' | 'in_progress' | 'done';

export interface BoardState {
  tasksById: Record<string, Task>;
  orderByColumn: ColumnsOrder;      // controls ordering and membership
  filter: StatusFilter;             // persisted separately
}
```

Notes:
- A task belongs to exactly one column by virtue of the column array containing its `id`.
- Moving a task updates the two arrays (remove from source, insert into target at `targetIndex`).
- Reorder within a column uses array splice based on indices.

### Actions (Reducer API)
- ADD_TASK(title: string) → creates `Task` in `tasksById` and unshifts/pushes into `orderByColumn.todo`
- EDIT_TASK_TITLE(taskId: string, title: string)
- DELETE_TASK(taskId: string) → removes from `tasksById` and from whichever column contains it
- MOVE_TASK(taskId: string, toColumn: ColumnKey, targetIndex: number) → handles intra- and inter-column moves
- REORDER_WITHIN_COLUMN(column: ColumnKey, fromIndex: number, toIndex: number)
- SET_FILTER(filter: StatusFilter) → persisted under `flowboard_filter_v1`
- HYDRATE(stateFromStorage: BoardState | null) → initialize from localStorage (with validation/migrations)

### Persistence Strategy
- On any reducer state change, persist `tasksById` and `orderByColumn` to localStorage under `flowboard_tasks_v1`, debounced ~150ms.
- Persist `filter` under `flowboard_filter_v1` when changed.
- On load, `HYDRATE` from storage; if invalid/missing, start with empty defaults.

### Component Hierarchy
- App
  - Providers: `BoardProvider` (Context + reducer)
  - Layout: `TopBar`, `Board`
    - TopBar: app title (FlowBoard), status filter dropdown, "Create Task" button (right-aligned, sticky)
    - Board (3 columns, each independently scrollable)
      - Column (one of To Do / In Progress / Done)
        - TaskCard (draggable; inline edit; hover controls incl. trash)
  - Modals
    - CreateTaskModal (title input with validation)
    - ConfirmDeleteModal (confirm/cancel; closes on Esc/outside; accessible)

### Drag-and-Drop Flow (HTML5)
- TaskCard has `draggable` and sets `dataTransfer` with `{ taskId }` on `dragstart`.
- Columns (and card list containers) handle `dragover` (preventDefault) and compute `targetIndex` based on current pointer vs. child elements.
- On `drop`, dispatch `MOVE_TASK(taskId, toColumn, targetIndex)`.
- Default browser drag preview is used in v1.

### Validation Rules
- Create/Edit title: trimmed, non-empty, ≤ 100 chars.
- Disable Add/Save until valid; Enter submits; Escape cancels.

### Risks & Trade-offs
- HTML5 DnD has limited mobile support → desktop-only in v1; consider pointer events in v2.
- jsdom lacks full DnD → rely on unit tests for reducer and logic; keep DnD logic thin.
- localStorage limits and JSON corruption → add simple schema guards and safe parse; small data footprint expected.

### Acceptance Criteria for ADR-001
- Documented stack, state shape, actions, DnD approach, and persistence.
- Component hierarchy defined and aligns with requirements.
- Clear validation rules and delete confirmation behavior specified.
- Subtask plan enumerated for implementation.

### Proposed Task Breakdown (next files)
- 002_project_scaffold.md – Vite React+TS scaffold, Tailwind setup, lint/test config
- 003_state_context_and_reducer.md – Context provider, reducer, types, initial state, HYDRATE
- 004_persistence.md – localStorage utilities, debounce hook, load/save integration
- 005_layout_topbar_board_columns.md – Sticky top bar, 3-column layout, scroll behavior
- 006_create_task_modal.md – Modal with validation, create flow into To Do
- 007_task_card_edit_and_delete.md – Inline edit, trash icon, ConfirmDeleteModal
- 008_drag_and_drop.md – HTML5 DnD across/within columns, reordering logic
- 009_filtering.md – Status filter dropdown, persistence, and rendering rules
- 010_unit_tests.md – Reducer tests, persistence tests, component logic tests
- 011_docs.md – README, ARCHITECTURE.md, PROJECT_STRUCTURE.md, TEST_STRATEGY.md, CHAT_HISTORY.md


