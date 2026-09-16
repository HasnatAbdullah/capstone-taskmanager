import { useEffect, useState } from 'react'
import { login, listTasks, createTask } from './api'

export default function App() {
  const [token, setToken] = useState('')
  const [tasks, setTasks] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')

  const [newTitle, setNewTitle] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    try {
      const res = await login(username, password)
      setToken(res.token)
    } catch (err) {
      setError(err.message)
    }
  }

  async function refresh(t = token) {
    if (!t) return
    setError('')
    setLoading(true)
    try {
      setTasks(await listTasks(t))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!newTitle.trim()) return
    setError('')
    try {
      await createTask(token, { title: newTitle })
      setNewTitle('')
      await refresh()
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    if (token) refresh(token)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  if (!token) {
    return (
        <div style={{ maxWidth: 400, margin: '80px auto', padding: 24, background: 'white', borderRadius: 8 }}>
          <h2>Sign in</h2>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 12 }}>
              <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  style={{ width: '100%', padding: 8 }}
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  style={{ width: '100%', padding: 8 }}
              />
            </div>
            <button type="submit" style={{ width: '100%', padding: 10 }}>Sign in</button>
          </form>
          {error && <p style={{ color: 'crimson' }}>{error}</p>}
        </div>
    )
  }

  return (
      <div style={{ maxWidth: 640, margin: '40px auto', padding: 24, background: 'white', borderRadius: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>Tasks</h2>
          <button onClick={() => setToken('')}>Sign out</button>
        </div>

        <form onSubmit={handleCreate} style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="New task title"
              style={{ flex: 1, padding: 8 }}
          />
          <button type="submit">Add</button>
        </form>

        {error && <p style={{ color: 'crimson' }}>{error}</p>}
        {loading && <p>Loading…</p>}

        <ul style={{ listStyle: 'none', padding: 0, marginTop: 16 }}>
          {tasks.map((t) => (
              <li key={t.id} style={{ padding: 10, borderBottom: '1px solid #eee' }}>
                <strong>{t.title}</strong>
                <span style={{ marginLeft: 8, color: '#888', fontSize: 13 }}>{t.status}</span>
              </li>
          ))}
          {tasks.length === 0 && !loading && <li style={{ color: '#888' }}>No tasks yet.</li>}
        </ul>
      </div>
  )
}