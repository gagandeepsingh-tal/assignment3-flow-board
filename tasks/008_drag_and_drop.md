## Task 008: Drag-and-Drop (HTML5) – Move and Reorder

### Scope
- Enable HTML5 DnD on `TaskCard` (whole card draggable).
- Allow moving between columns and reordering within a column.
- Use default browser drag preview; show valid drop targets.

### Steps
1) Add `draggable` to cards; on dragstart set `dataTransfer` with `taskId`.
2) On column list containers, handle `dragover` (preventDefault) and compute `targetIndex` relative to hovered items.
3) On drop, dispatch MOVE_TASK(taskId, targetColumn, targetIndex).
4) Add a11y attributes (aria-dropeffect, aria-grabbed) where reasonable.

### Acceptance Criteria
- Tasks can be moved across columns and reordered within a column reliably on desktop.
- No page scroll jumps; columns accept drops smoothly.
- Unit tests cover targetIndex computation helpers.


