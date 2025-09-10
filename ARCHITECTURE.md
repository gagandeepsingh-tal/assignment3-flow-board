# Architecture

- Pattern: React Context + Reducer for global board state (tasks, filter).
- Persistence: localStorage with schema guards and debounced writes.
- UI: Tailwind CSS for layout/styling. No DnD libraries; native HTML5 drag events.

## Components
- TopBar: title, filter dropdown, create task button.
- Board: 3-column layout; passes columnKey to Column.
- Column: scrollable column, drop target; renders TaskCard list.
- TaskCard: draggable card with inline editing and delete affordance.
- Modals: CreateTaskModal, ConfirmDeleteModal, primitive Modal.

## State Flow
- Context provides BoardState and Dispatch<BoardAction>.
- HYDRATE on mount from localStorage. Debounced saves on state/filter change.
- Reducer actions: ADD_TASK, EDIT_TASK_TITLE, DELETE_TASK, MOVE_TASK, REORDER_WITHIN_COLUMN, SET_FILTER, HYDRATE.

## DnD
- Card sets dataTransfer with taskId on dragstart.
- Column computes drop index via midpoint algorithm (computeDropIndex).
- Dispatches MOVE_TASK with toColumn and toIndex.
