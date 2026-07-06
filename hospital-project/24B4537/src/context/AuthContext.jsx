import { createContext, useState, useEffect } from 'react'
import api from '../api/axiosConfig'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      api.get('user/')
        .then((res) => setUser(res.data))
        .catch(() => localStorage.removeItem('access_token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const res = await api.post('token/', { email, password })
    localStorage.setItem('access_token', res.data.access)
    if (res.data.refresh) {
      localStorage.setItem('refresh_token', res.data.refresh)
    }
    const userRes = await api.get('user/')
    setUser(userRes.data)
    return userRes.data
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
