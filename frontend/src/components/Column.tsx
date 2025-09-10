import { useState } from "react"
import type { Task, ColumnKey } from "../state/types"
import TaskCard from "./TaskCard"
import ConfirmDeleteModal from "./modals/ConfirmDeleteModal"
import { useBoardDispatch } from "../state/context"
import { computeDropIndex } from "../utils/dnd"

interface ColumnProps {
  columnKey: ColumnKey;
  title: string;
  tasks: Task[];
}

export default function Column({ columnKey, title, tasks }: ColumnProps) {
  const dispatch = useBoardDispatch()
  const [toDelete, setToDelete] = useState<Task | null>(null)
  
  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const taskId = e.dataTransfer.getData('text/task-id')
    if (!taskId) return
    // compute target index by sampling child rects
    const container = e.currentTarget
    const cards = Array.from(container.querySelectorAll('[data-task-card]')) as HTMLElement[]
    const rects = cards.map((el) => ({ top: el.offsetTop, height: el.offsetHeight }))
    const targetIndex = computeDropIndex(rects, (e.nativeEvent as DragEvent).clientY)
    dispatch({ type: 'MOVE_TASK', payload: { id: taskId, toColumn: columnKey, toIndex: targetIndex } })
  }
  return (
    <section className="flex flex-col min-h-0 bg-gray-50 rounded-lg border border-gray-200">
      <header className="px-3 py-2 border-b text-sm font-medium text-gray-700">
        {title}
      </header>
      <div
        className="flex-1 overflow-auto p-3 space-y-2"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        aria-dropeffect="move"
      >
        {tasks.length === 0 ? (
          <div className="text-xs text-gray-500">No tasks</div>
        ) : (
          tasks.map((t) => (
            <div data-task-card>
              <TaskCard key={t.id} task={t} onRequestDelete={setToDelete} />
            </div>
          ))
        )}
      </div>
      <ConfirmDeleteModal
        open={!!toDelete}
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) dispatch({ type: "DELETE_TASK", payload: { id: toDelete.id } })
          setToDelete(null)
        }}
      />
    </section>
  )
}


