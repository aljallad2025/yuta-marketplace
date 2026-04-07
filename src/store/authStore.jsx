import { useState, createContext, useContext, useEffect } from 'react'

// ─── Default accounts ────────────────────────────────────────────────
const defaultUsers = [
  // Admin
  {
    id: 'ADM-001',
    role: 'admin',
    username: 'admin',
    password: 'admin123',
    nameAr: 'المدير العام',
    nameEn: 'Super Admin',
    email: 'admin@sumu.ae',
    status: 'approved',
    avatar: '🛡️',
  },
  // Vendors
  {
    id: 'VND-001',
    role: 'vendor',
    storeId: 1,
    username: 'baharat',
    password: 'baharat123',
    nameAr: 'مطعم بهارات',
    nameEn: 'Baharat Restaurant',
    email: 'baharat@sumu.ae',
    phone: '+971501110001',
    status: 'approved',
    avatar: '🍽️',
    appliedAt: '2024-01-10',
  },
  {
    id: 'VND-002',
    role: 'vendor',
    storeId: 2,
    username: 'burgetino',
    password: 'burger123',
    nameAr: 'برجتينو',
    nameEn: 'Burgetino',
    email: 'burgetino@sumu.ae',
    phone: '+971501110002',
    status: 'approved',
    avatar: '🍔',
    appliedAt: '2024-02-15',
  },
  {
    id: 'VND-003',
    role: 'vendor',
    storeId: 4,
    username: 'freshmart',
    password: 'fresh123',
    nameAr: 'فريش مارت',
    nameEn: 'Fresh Mart',
    email: 'freshmart@sumu.ae',
    phone: '+971501110003',
    status: 'pending',
    avatar: '🛒',
    appliedAt: '2024-03-20',
  },
  // Drivers
  {
    id: 'DRV-001',
    role: 'driver',
    driverId: 'DRV-001',
    username: 'ameri',
    password: 'driver123',
    nameAr: 'محمد العامري',
    nameEn: 'Mohammed Al Ameri',
    email: 'ameri@sumu.ae',
    phone: '+971505001001',
    status: 'approved',
    avatar: '🚗',
    appliedAt: '2023-06-10',
  },
  {
    id: 'DRV-002',
    role: 'driver',
    driverId: 'DRV-002',
    username: 'mutairi',
    password: 'driver456',
    nameAr: 'علي المطيري',
    nameEn: 'Ali Al Mutairi',
    email: 'mutairi@sumu.ae',
    phone: '+971505002002',
    status: 'approved',
    avatar: '🚙',
    appliedAt: '2023-09-22',
  },
  {
    id: 'DRV-003',
    role: 'driver',
    driverId: 'DRV-003',
    username: 'shammari',
    password: 'driver789',
    nameAr: 'خالد الشمري',
    nameEn: 'Khalid Al Shammari',
    email: 'shammari@sumu.ae',
    phone: '+971505003003',
    status: 'pending',
    avatar: '🛵',
    appliedAt: '2024-01-15',
  },
]

// ─── Context ──────────────────────────────────────────────────────────
const AuthContext = createContext()

const SESSION_KEY = 'sumu_session'

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(defaultUsers)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY)
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })
  const [loginError, setLoginError] = useState('')

  // Persist session
  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(currentUser))
    } else {
      sessionStorage.removeItem(SESSION_KEY)
    }
  }, [currentUser])

  // ── Login ────────────────────────────────────────────────────────
  const login = (username, password, requiredRole) => {
    setLoginError('')
    const user = users.find(
      u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    )
    if (!user) {
      setLoginError('username_password_wrong')
      return false
    }
    if (requiredRole && user.role !== requiredRole) {
      setLoginError('wrong_role')
      return false
    }
    if (user.status === 'pending') {
      setLoginError('pending_approval')
      return false
    }
    if (user.status === 'rejected') {
      setLoginError('rejected')
      return false
    }
    if (user.status === 'suspended') {
      setLoginError('suspended')
      return false
    }
    setCurrentUser(user)
    return true
  }

  // ── Logout ───────────────────────────────────────────────────────
  const logout = () => {
    setCurrentUser(null)
    setLoginError('')
  }

  // ── Register (vendor / driver) ───────────────────────────────────
  const register = (data) => {
    // Check duplicate username
    if (users.find(u => u.username.toLowerCase() === data.username.toLowerCase())) {
      return { success: false, error: 'username_taken' }
    }
    if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: 'email_taken' }
    }
    const newUser = {
      id: `${data.role === 'vendor' ? 'VND' : 'DRV'}-${Date.now()}`,
      ...data,
      status: 'pending',
      appliedAt: new Date().toISOString().split('T')[0],
    }
    setUsers(prev => [...prev, newUser])
    return { success: true }
  }

  // ── Admin approvals ──────────────────────────────────────────────
  const approveUser = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'approved' } : u))
  }

  const rejectUser = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'rejected' } : u))
  }

  const suspendUser = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'suspended' } : u))
  }

  const deleteUser = (id) => {
    setUsers(prev => prev.filter(u => u.id !== id))
  }

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
      currentUser, users, loginError, setLoginError,
      login, logout, register,
      approveUser, rejectUser, suspendUser, deleteUser,
      getPendingVendors, getPendingDrivers, getVendorUsers, getDriverUsers,
      isLoggedIn, isAdmin, isVendor, isDriver,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
