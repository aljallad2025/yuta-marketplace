import { useState, createContext, useContext, useEffect, useCallback } from 'react'
import { authAPI, usersAPI } from '../services/api.js'
import { resetSocket } from '../hooks/useSocket.js'

const AuthContext = createContext()
const TOKEN_KEY = 'yuta_token'
const USER_KEY = 'yuta_user'

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)) } catch { return null }
  })
  const [users, setUsers] = useState([])
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  // ── Load users list (admin) ──────────────────────────────────────
  const loadUsers = useCallback(async () => {
    try {
      const res = await usersAPI.getAll()
      setUsers(res.data)
    } catch {}
  }, [])

  useEffect(() => {
    if (currentUser?.role === 'admin') loadUsers()
  }, [currentUser, loadUsers])

  // ── Login ────────────────────────────────────────────────────────
  const login = useCallback(async (username, password, requiredRole) => {
    setLoginError('')
    setLoginLoading(true)
    try {
      const res = await authAPI.login(username, password, requiredRole)
      const { token, user } = res.data
      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(USER_KEY, JSON.stringify(user))
      setCurrentUser(user)
      return true
    } catch (err) {
      const code = err.response?.data?.error || err.response?.data?.message || 'unknown_error'
      setLoginError(code)
      return false
    } finally {
      setLoginLoading(false)
    }
  }, [])

  // ── Logout ───────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setCurrentUser(null)
    setLoginError('')
    resetSocket()
  }, [])

  // ── Register ─────────────────────────────────────────────────────
  const register = useCallback(async (data) => {
    try {
      await authAPI.register(data)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'register_failed' }
    }
  }, [])

  // ── Admin: approve/reject/suspend/delete ─────────────────────────
  const approveUser = useCallback(async (id) => {
    await usersAPI.updateStatus(id, 'approved')
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'approved' } : u))
  }, [])

  const rejectUser = useCallback(async (id) => {
    await usersAPI.updateStatus(id, 'rejected')
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'rejected' } : u))
  }, [])

  const suspendUser = useCallback(async (id) => {
    await usersAPI.updateStatus(id, 'suspended')
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'suspended' } : u))
  }, [])

  const deleteUser = useCallback(async (id) => {
    await usersAPI.delete(id)
    setUsers(prev => prev.filter(u => u.id !== id))
  }, [])

  // ── Helpers ──────────────────────────────────────────────────────
  const getPendingVendors = () => users.filter(u => u.role === 'vendor' && u.status === 'pending')
  const getPendingDrivers = () => users.filter(u => u.role === 'driver' && u.status === 'pending')
  const getVendorUsers = () => users.filter(u => u.role === 'vendor')
  const getDriverUsers = () => users.filter(u => u.role === 'driver')

  const isLoggedIn = !!currentUser
  const isAdmin = currentUser?.role === 'admin'
  const isVendor = currentUser?.role === 'vendor'
  const isDriver = currentUser?.role === 'driver'

  return (
    <AuthContext.Provider value={{
      currentUser, users, loginError, loginLoading, setLoginError,
      login, logout, register, loadUsers,
      approveUser, rejectUser, suspendUser, deleteUser,
      getPendingVendors, getPendingDrivers, getVendorUsers, getDriverUsers,
      isLoggedIn, isAdmin, isVendor, isDriver,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
