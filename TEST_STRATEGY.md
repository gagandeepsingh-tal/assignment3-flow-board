# Test Strategy

Scope:
- Reducer actions and edge cases
- Storage helpers (load/save, corrupt JSON handling)
- Component logic for CreateTaskModal and TaskCard inline editing
- DnD helper computeDropIndex

Rationale:
- Core logic is unit-tested for correctness and resilience
- UI interactions tested at component level with Testing Library

Commands:
- `npm run test` – run all unit tests
- `npm run coverage` – coverage with v8
