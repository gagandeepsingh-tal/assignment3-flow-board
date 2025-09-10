## Task 006: Create Task Modal

### Scope
- Add global "Create Task" button in TopBar to open modal.
- Modal with title input, validation (trimmed, 1..100 chars), Add and Cancel.
- Close on Esc and outside click.

### Steps
1) Create `src/components/modals/CreateTaskModal.tsx` and modal primitives.
2) Implement validation UX (disabled Add until valid; inline error message).
3) On submit, dispatch ADD_TASK and close modal.

### Acceptance Criteria
- Users can open the modal from TopBar and create a task in To Do.
- Invalid input cannot be submitted; Enter submits when valid.


