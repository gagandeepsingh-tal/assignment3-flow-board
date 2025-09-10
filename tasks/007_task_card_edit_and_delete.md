## Task 007: Task Card – Inline Edit and Delete Confirmation

### Scope
- Implement `TaskCard` with inline editing (double-click to edit; Enter/blur saves; Esc cancels).
- Show trash icon on hover to trigger custom delete confirmation modal.
- Enforce title validation (1..100 chars, trimmed).

### Steps
1) Create `src/components/TaskCard.tsx` with hover affordances and editable state.
2) Implement `ConfirmDeleteModal.tsx` and reuse modal primitives.
3) Wire dispatches: EDIT_TASK_TITLE, DELETE_TASK.

### Acceptance Criteria
- Inline editing works with keyboard interactions per spec.
- Delete prompts a modal; confirm deletes; cancel restores.
- Titles validate and errors display inline; save disabled until valid.


