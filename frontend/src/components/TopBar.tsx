import { useBoardDispatch, useBoardState } from "../state/context";
import type { StatusFilter } from "../state/types";
import { AllStatusFilters } from "../state/types";

interface TopBarProps {
  onCreateTask?: () => void;
}

export default function TopBar({ onCreateTask }: TopBarProps) {
  const state = useBoardState();
  const dispatch = useBoardDispatch();

  function onChangeFilter(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value as StatusFilter;
    dispatch({ type: "SET_FILTER", payload: { filter: value } });
  }

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        <h1 className="text-xl font-semibold">FlowBoard</h1>
        <div className="ml-auto flex items-center gap-3">
          <label className="text-sm text-gray-600" htmlFor="filter">Filter</label>
          <select
            id="filter"
            className="px-2 py-1 border rounded-md text-sm"
            value={state.filter}
            onChange={onChangeFilter}
          >
            {AllStatusFilters.map((f) => (
              <option key={f} value={f}>
                {f === "all" ? "All" : f === "inProgress" ? "In Progress" : f === "todo" ? "To Do" : "Done"}
              </option>
            ))}
          </select>
          <button
            className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
            onClick={onCreateTask}
          >
            Create Task
          </button>
        </div>
      </div>
    </header>
  );
}


