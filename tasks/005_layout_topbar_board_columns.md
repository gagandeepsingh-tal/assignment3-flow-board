## Task 005: Layout - TopBar, Board, Columns

### Scope
- Create sticky TopBar with title, filter dropdown, and "Create Task" button.
- Implement 3-column board layout (To Do, In Progress, Done) filling viewport height.
- Each column independently scrollable.

### Steps
1) Create `src/components/TopBar.tsx`, `src/components/Board.tsx`, `src/components/Column.tsx`.
2) Wire filter to context; persist on change.
3) Apply Tailwind layout utilities for sticky header and scrolling columns.

### Acceptance Criteria
- TopBar sticky, columns fill remaining height, and scroll independently.
- Filter shows all columns but only tasks matching selected status in each.


