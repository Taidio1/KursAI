import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import LoginPage from '../LoginPage'
import React from 'react'

vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { role: 'user' } }),
    }),
  },
}))

function renderLogin() {
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  )
}

it('renders email and password fields', () => {
  renderLogin()
  expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
  expect(screen.getByPlaceholderText('Hasło')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /zaloguj/i })).toBeInTheDocument()
})

it('calls signInWithPassword with form values', async () => {
  const { supabase } = await import('../../lib/supabase')
  supabase.auth.signInWithPassword.mockResolvedValue({ 
    data: { user: { id: 'test-id' } },
    error: null 
  })

  renderLogin()
  await userEvent.type(screen.getByPlaceholderText('Email'), 'test@test.com')
  await userEvent.type(screen.getByPlaceholderText('Hasło'), 'password123')
  await userEvent.click(screen.getByRole('button', { name: /zaloguj/i }))

  expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
    email: 'test@test.com',
    password: 'password123',
  })
})

it('shows error message on failed login', async () => {
  const { supabase } = await import('../../lib/supabase')
  supabase.auth.signInWithPassword.mockResolvedValue({
    data: { user: null },
    error: { message: 'Invalid credentials' },
  })

  renderLogin()
  await userEvent.type(screen.getByPlaceholderText('Email'), 'bad@test.com')
  await userEvent.type(screen.getByPlaceholderText('Hasło'), 'wrongpass')
  await userEvent.click(screen.getByRole('button', { name: /zaloguj/i }))

  await waitFor(() => {
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
  })
})
