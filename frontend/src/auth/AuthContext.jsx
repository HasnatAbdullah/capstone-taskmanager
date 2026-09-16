import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY = 'capstone.auth'

export function AuthProvider({ children }) {
    const [auth, setAuth] = useState(() => {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : { token: '', username: '', role: '' }
    })

    useEffect(() => {
        if (auth.token) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(auth))
        } else {
            localStorage.removeItem(STORAGE_KEY)
        }
    }, [auth])

    function signIn({ token, username, role }) {
        setAuth({ token, username, role })
    }

    function signOut() {
        setAuth({ token: '', username: '', role: '' })
    }

    const value = {
        token: auth.token,
        username: auth.username,
        role: auth.role,
        isAuthenticated: Boolean(auth.token),
        signIn,
        signOut,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
    return ctx
}