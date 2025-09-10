import { useBoardState } from "../state/context";
import Column from "./Column";

export default function Board() {
  const state = useBoardState();

  const showTodo = state.filter === "all" || state.filter === "todo";
  const showInProgress = state.filter === "all" || state.filter === "inProgress";
  const showDone = state.filter === "all" || state.filter === "done";

  return (
    <div className="max-w-6xl mx-auto px-4 pt-4 pb-6 h-[calc(100vh-56px)]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full min-h-0">
        <div className="min-h-0">
          <Column columnKey="todo" title="To Do" tasks={showTodo ? state.columns.todo : []} />
        </div>
        <div className="min-h-0">
          <Column
            columnKey="inProgress"
            title="In Progress"
            tasks={showInProgress ? state.columns.inProgress : []}
          />
        </div>
        <div className="min-h-0">
          <Column columnKey="done" title="Done" tasks={showDone ? state.columns.done : []} />
        </div>
      </div>
    </div>
  );
}


