import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { listTasks, createTask, deleteTask } from '../api'

export default function TasksPage() {
    const { token, username, signOut } = useAuth()
    const [tasks, setTasks] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [newTitle, setNewTitle] = useState('')

    async function refresh() {
        setError('')
        setLoading(true)
        try {
            setTasks(await listTasks(token))
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

    async function handleDelete(id) {
        setError('')
        try {
            await deleteTask(token, id)
            await refresh()
        } catch (err) {
            setError(err.message)
        }
    }

    useEffect(() => {
        refresh()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div style={{ maxWidth: 640, margin: '40px auto', padding: 24, background: 'white', borderRadius: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0 }}>Tasks</h2>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ color: '#888', fontSize: 13 }}>signed in as {username}</span>
                    <button onClick={signOut}>Sign out</button>
                </div>
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
                    <li
                        key={t.id}
                        style={{
                            padding: 10,
                            borderBottom: '1px solid #eee',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <div>
                            <strong>{t.title}</strong>
                            <span style={{ marginLeft: 8, color: '#888', fontSize: 13 }}>{t.status}</span>
                        </div>
                        <button
                            onClick={() => handleDelete(t.id)}
                            style={{ fontSize: 12, color: 'crimson' }}
                        >
                            Delete
                        </button>
                    </li>
                ))}
                {tasks.length === 0 && !loading && <li style={{ color: '#888' }}>No tasks yet.</li>}
            </ul>
        </div>
    )
}