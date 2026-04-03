import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import RegisterPage from '../RegisterPage'

vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
    },
  },
}))

function renderRegister() {
  return render(
    <MemoryRouter>
      <RegisterPage />
    </MemoryRouter>
  )
}

it('renders name, email and password fields', () => {
  renderRegister()
  expect(screen.getByPlaceholderText('Imię')).toBeInTheDocument()
  expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
  expect(screen.getByPlaceholderText('Hasło')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /zarejestruj/i })).toBeInTheDocument()
})

it('calls signUp with email, password and name metadata', async () => {
  const { supabase } = await import('../../lib/supabase')
  supabase.auth.signUp.mockResolvedValue({ error: null })

  renderRegister()
  await userEvent.type(screen.getByPlaceholderText('Imię'), 'Jan')
  await userEvent.type(screen.getByPlaceholderText('Email'), 'jan@test.com')
  await userEvent.type(screen.getByPlaceholderText('Hasło'), 'secure123')
  await userEvent.click(screen.getByRole('button', { name: /zarejestruj/i }))

  expect(supabase.auth.signUp).toHaveBeenCalledWith({
    email: 'jan@test.com',
    password: 'secure123',
    options: { data: { name: 'Jan' } },
  })
})

it('shows error on failed registration', async () => {
  const { supabase } = await import('../../lib/supabase')
  supabase.auth.signUp.mockResolvedValue({
    error: { message: 'Email already registered' },
  })

  renderRegister()
  await userEvent.type(screen.getByPlaceholderText('Imię'), 'Jan')
  await userEvent.type(screen.getByPlaceholderText('Email'), 'jan@test.com')
  await userEvent.type(screen.getByPlaceholderText('Hasło'), 'secure123')
  await userEvent.click(screen.getByRole('button', { name: /zarejestruj/i }))

  await waitFor(() => {
    expect(screen.getByText('Email already registered')).toBeInTheDocument()
  })
})
