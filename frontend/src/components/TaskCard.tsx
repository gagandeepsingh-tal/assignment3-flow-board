import { useEffect, useRef, useState } from "react"
import type { Task } from "../state/types"
import { validateTitle } from "../state/types"
import { useBoardDispatch } from "../state/context"

interface TaskCardProps {
  task: Task;
  onRequestDelete: (task: Task) => void;
}

export default function TaskCard({ task, onRequestDelete }: TaskCardProps) {
  const dispatch = useBoardDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(task.title);
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing) {
      setValue(task.title);
      setTouched(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isEditing, task.title]);

  const validation = validateTitle(value);

  function save() {
    if (!validation.ok) return;
    if (validation.value !== task.title) {
      dispatch({ type: "EDIT_TASK_TITLE", payload: { id: task.id, title: validation.value! } });
    }
    setIsEditing(false);
  }

  function cancel() {
    setValue(task.title);
    setIsEditing(false);
  }

  return (
    <div
      className="group p-2 rounded-md bg-white border border-gray-200 shadow-sm text-sm relative"
      onDoubleClick={() => setIsEditing(true)}
      draggable={!isEditing}
      aria-grabbed={!isEditing}
      onDragStart={(e) => {
        e.dataTransfer.setData('text/task-id', task.id)
        e.dataTransfer.effectAllowed = 'move'
      }}
    >
      {!isEditing ? (
        <>
          <div className="pr-7 whitespace-pre-wrap break-words">{task.title}</div>
          <button
            aria-label="Delete task"
            className="absolute top-1.5 right-1.5 hidden group-hover:inline-flex items-center justify-center w-6 h-6 rounded hover:bg-gray-100"
            onClick={() => onRequestDelete(task)}
            title="Delete"
          >
            {/* simple trash icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          </button>
        </>
      ) : (
        <div className="space-y-2">
          <input
            ref={inputRef}
            className="w-full px-2 py-1 border rounded"
            value={value}
            onChange={(e) => {
              setTouched(true);
              setValue(e.target.value);
            }}
            onBlur={save}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                save();
              } else if (e.key === "Escape") {
                e.preventDefault();
                cancel();
              }
            }}
          />
          {!validation.ok && touched ? (
            <div className="text-xs text-red-600">{validation.error}</div>
          ) : null}
          <div className="flex gap-2 justify-end">
            <button className="px-2 py-1 border rounded" onClick={cancel}>Cancel</button>
            <button
              className="px-2 py-1 rounded bg-blue-600 text-white disabled:opacity-50"
              onClick={save}
              disabled={!validation.ok}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  )
}


