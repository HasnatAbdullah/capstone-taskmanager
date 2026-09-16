const BASE = '/api'

function authHeaders(token) {
    return token ? { Authorization: `Bearer ${token}` } : {}
}

async function handle(res) {
    const text = await res.text()
    const body = text ? JSON.parse(text) : null
    if (!res.ok) {
        const message = body?.error || body?.message || `HTTP ${res.status}`
        throw new Error(message)
    }
    return body
}

export async function login(username, password) {
    const res = await fetch(`${BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    })
    return handle(res)
}

export async function listTasks(token, status) {
    const qs = status ? `?status=${encodeURIComponent(status)}` : ''
    const res = await fetch(`${BASE}/tasks${qs}`, {
        headers: authHeaders(token),
    })
    return handle(res)
}

export async function createTask(token, task) {
    const res = await fetch(`${BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
        body: JSON.stringify(task),
    })
    return handle(res)
}

export async function updateTask(token, id, task) {
    const res = await fetch(`${BASE}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
        body: JSON.stringify(task),
    })
    return handle(res)
}

export async function deleteTask(token, id) {
    const res = await fetch(`${BASE}/tasks/${id}`, {
        method: 'DELETE',
        headers: authHeaders(token),
    })
    if (!res.ok && res.status !== 204) {
        return handle(res)
    }
    return null
}