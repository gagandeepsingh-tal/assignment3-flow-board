import { useState } from 'react'
import TopBar from './components/TopBar'
import Board from './components/Board'
import CreateTaskModal from './components/modals/CreateTaskModal'

export default function App() {
  const [open, setOpen] = useState(false)
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <TopBar onCreateTask={() => setOpen(true)} />
      <main className="flex-1 min-h-0">
        <Board />
      </main>
      <CreateTaskModal open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
