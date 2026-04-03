# Admin Notion Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a service and UI for administrators to manually trigger content synchronization from Notion to Supabase.

**Architecture:** A service layer (`adminService.js`) handles the API request to the backend. The `AdminPage.jsx` provides a "Dark Tech" themed interface with a password input for the admin secret and a sync button, displaying status and results.

**Tech Stack:** React, Vite, CSS Variables (Dark Tech theme), Vitest for testing.

---

### Task 1: Admin Service Layer

**Files:**
- Create: `frontend/src/services/adminService.js`
- Test: `frontend/src/services/__tests__/adminService.test.js`

- [ ] **Step 1: Write the failing test for adminService**

```javascript
// frontend/src/services/__tests__/adminService.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { syncNotionContent } from '../adminService'

global.fetch = vi.fn()

describe('adminService', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  it('syncNotionContent sends POST request with correct headers', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: 'success', lessons_synced: 5, slides_created: 20 }),
    })

    const result = await syncNotionContent('test-secret')

    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/sync/notion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-secret': 'test-secret',
      },
    })
    expect(result).toEqual({ lessons_synced: 5, slides_created: 20 })
  })

  it('throws error on failure', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ detail: 'Unauthorized' }),
    })

    await expect(syncNotionContent('wrong-secret')).rejects.toThrow('Unauthorized')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test frontend/src/services/__tests__/adminService.test.js` (or equivalent in the root)
Expected: FAIL (module not found)

- [ ] **Step 3: Implement syncNotionContent**

```javascript
// frontend/src/services/adminService.js
export async function syncNotionContent(adminSecret) {
  const response = await fetch('http://localhost:8000/sync/notion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-secret': adminSecret,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || 'Błąd synchronizacji')
  }

  return {
    lessons_synced: data.lessons_synced,
    slides_created: data.slides_created,
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test frontend/src/services/__tests__/adminService.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add frontend/src/services/
git commit -m "feat: add admin service for notion sync"
```

---

### Task 2: Admin Page UI and Logic

**Files:**
- Modify: `frontend/src/pages/AdminPage.jsx`
- Test: `frontend/src/pages/__tests__/AdminPage.test.jsx`

- [ ] **Step 1: Write the failing test for AdminPage**

```javascript
// frontend/src/pages/__tests__/AdminPage.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import AdminPage from '../AdminPage'
import { syncNotionContent } from '../../services/adminService'
import { vi, it, expect, describe } from 'vitest'

vi.mock('../../services/adminService', () => ({
  syncNotionContent: vi.fn(),
}))

vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      signOut: vi.fn().mockResolvedValue({}),
    },
  },
}))

const renderAdminPage = () => {
  return render(
    <AuthContext.Provider value={{ user: { email: 'admin@kursai.pl' }, role: 'admin', loading: false }}>
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    </AuthContext.Provider>
  )
}

describe('AdminPage', () => {
  it('renders sync interface', () => {
    renderAdminPage()
    expect(screen.getByPlaceholderText(/sekret/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /synchronizuj/i })).toBeInTheDocument()
  })

  it('handles successful sync', async () => {
    syncNotionContent.mockResolvedValueOnce({ lessons_synced: 2, slides_created: 10 })
    renderAdminPage()
    
    const input = screen.getByPlaceholderText(/sekret/i)
    const button = screen.getByRole('button', { name: /synchronizuj/i })
    
    fireEvent.change(input, { target: { value: 'dev_secret' } })
    fireEvent.click(button)
    
    expect(screen.getByText(/synchronizowanie/i)).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByText(/sukces/i)).toBeInTheDocument()
      expect(screen.getByText(/2 lekcje/i)).toBeInTheDocument()
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test frontend/src/pages/__tests__/AdminPage.test.jsx`
Expected: FAIL (missing elements or functions)

- [ ] **Step 3: Implement AdminPage UI and logic**

```jsx
// frontend/src/pages/AdminPage.jsx
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { syncNotionContent } from '../services/adminService'

export default function AdminPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [secret, setSecret] = useState('')
  const [status, setStatus] = useState('idle') // idle, loading, success, error
  const [result, setResult] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  async function handleSync() {
    if (!secret) return
    setStatus('loading')
    setErrorMsg('')
    try {
      const data = await syncNotionContent(secret)
      setResult(data)
      setStatus('success')
    } catch (err) {
      setErrorMsg(err.message)
      setStatus('error')
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1 className="admin-title">Panel Administratora</h1>
        <p className="admin-user">Zalogowany jako: {user?.email}</p>

        <div className="sync-box">
          <input
            type="password"
            className="admin-input"
            placeholder="Sekret administracyjny..."
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            disabled={status === 'loading'}
          />
          <button 
            className={`admin-button ${status === 'loading' ? 'loading' : ''}`}
            onClick={handleSync}
            disabled={status === 'loading' || !secret}
          >
            {status === 'loading' ? 'Synchronizowanie...' : 'Synchronizuj z Notion'}
          </button>
        </div>

        {status === 'success' && result && (
          <div className="status-box success">
            <h3>✅ Sukces!</h3>
            <p>Lekcje: {result.lessons_synced}</p>
            <p>Slajdy: {result.slides_created}</p>
          </div>
        )}

        {status === 'error' && (
          <div className="status-box error">
            <h3>❌ Błąd</h3>
            <p>{errorMsg}</p>
          </div>
        )}

        <button className="logout-btn" onClick={handleLogout}>
          Wyloguj się
        </button>
      </div>

      <style jsx>{`
        .admin-page {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-primary);
          padding: 20px;
        }
        .admin-container {
          width: 100%;
          max-width: 400px;
          background: var(--bg-secondary);
          padding: 32px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-subtle);
          text-align: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .admin-title {
          font-size: 24px;
          margin-bottom: 8px;
          color: var(--cyan-light);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .admin-user {
          color: var(--text-secondary);
          font-size: 14px;
          margin-bottom: 32px;
        }
        .sync-box {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .admin-input {
          padding: 12px 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          color: white;
          outline: none;
          transition: border-color 0.2s;
        }
        .admin-input:focus {
          border-color: var(--cyan-light);
        }
        .admin-button {
          padding: 14px;
          background: var(--cyan-gradient);
          color: white;
          font-weight: bold;
          border-radius: var(--radius-md);
          border: none;
          cursor: pointer;
          transition: transform 0.1s, opacity 0.2s;
        }
        .admin-button:hover:not(:disabled) {
          transform: translateY(-1px);
          filter: brightness(1.1);
        }
        .admin-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .status-box {
          margin-top: 24px;
          padding: 16px;
          border-radius: var(--radius-md);
          font-size: 14px;
        }
        .status-box.success {
          background: var(--cyan-dim);
          border: 1px solid var(--cyan-border);
          color: var(--cyan-light);
        }
        .status-box.error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
        }
        .logout-btn {
          margin-top: 32px;
          background: transparent;
          color: var(--text-secondary);
          font-size: 13px;
          text-decoration: underline;
          cursor: pointer;
          border: none;
        }
        .logout-btn:hover {
          color: white;
        }
      `}</style>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test frontend/src/pages/__tests__/AdminPage.test.jsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add frontend/src/pages/AdminPage.jsx frontend/src/pages/__tests__/AdminPage.test.jsx
git commit -m "feat: implement admin notion sync UI"
```

---

### Task 3: Final Verification

- [ ] **Step 1: Check build**

Run: `npm run build` (in frontend)
Expected: Success

- [ ] **Step 2: Manual verification (Optional but recommended)**
Ensure the backend is running and verify the `/admin` route redirects correctly based on role.
