import { render, screen } from '@testing-library/react'
import DashboardSkeleton from '../DashboardSkeleton'

it('renders skeleton container', () => {
  const { container } = render(<DashboardSkeleton />)
  expect(container.firstChild).toBeInTheDocument()
})

it('does not show old loading text', () => {
  render(<DashboardSkeleton />)
  expect(screen.queryByText(/Ładowanie Twoich postępów/)).not.toBeInTheDocument()
})

it('renders path card placeholders', () => {
  render(<DashboardSkeleton />)
  expect(document.querySelectorAll('[data-testid="skeleton-card"]').length).toBe(2)
})
