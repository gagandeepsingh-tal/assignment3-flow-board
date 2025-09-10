import { render, screen } from '@testing-library/react'
import App from './App'
import { BoardProvider } from './state/context'

it('renders top bar title and filter', () => {
  render(
    <BoardProvider>
      <App />
    </BoardProvider>
  )
  expect(screen.getByText('FlowBoard')).toBeInTheDocument()
  expect(screen.getByLabelText('Filter')).toBeInTheDocument()
})
