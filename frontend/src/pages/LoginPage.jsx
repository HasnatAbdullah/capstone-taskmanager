import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { login as apiLogin } from '../api'

export default function LoginPage() {
    const { signIn } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || '/tasks'

    const [username, setUsername] = useState('admin')
    const [password, setPassword] = useState('admin123')
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setSubmitting(true)
        try {
            const res = await apiLogin(username, password)
            signIn(res)
            navigate(from, { replace: true })
        } catch (err) {
            setError(err.message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div style={{ maxWidth: 400, margin: '80px auto', padding: 24, background: 'white', borderRadius: 8 }}>
            <h2 style={{ marginTop: 0 }}>Sign in</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 12 }}>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        autoComplete="username"
                        style={{ width: '100%', padding: 8 }}
                    />
                </div>
                <div style={{ marginBottom: 12 }}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        autoComplete="current-password"
                        style={{ width: '100%', padding: 8 }}
                    />
                </div>
                <button
                    type="submit"
                    disabled={submitting}
                    style={{ width: '100%', padding: 10 }}
                >
                    {submitting ? 'Signing in…' : 'Sign in'}
                </button>
            </form>
            {error && <p style={{ color: 'crimson' }}>{error}</p>}
            <p style={{ color: '#888', fontSize: 13, marginTop: 16 }}>
                Demo credentials: <code>admin / admin123</code>
            </p>
        </div>
    )
}