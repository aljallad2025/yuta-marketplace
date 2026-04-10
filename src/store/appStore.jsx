import { useState, createContext, useContext, useCallback, useEffect } from 'react'
import { productsAPI, ordersAPI, driversAPI, notifAPI, storesAPI, statsAPI } from '../services/api.js'
import { useSocket } from '../hooks/useSocket.js'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [drivers, setDrivers] = useState([])
  const [notifications, setNotifications] = useState([])
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(false)

  // ── Initial data load ─────────────────────────────────────────────
  const loadAll = useCallback(async () => {
    setLoading(true)
    try {
      const [prodRes, orderRes, drvRes, notifRes, storeRes] = await Promise.allSettled([
        productsAPI.getAll(),
        ordersAPI.getAll(),
        driversAPI.getAll(),
        notifAPI.getAll(),
        storesAPI.getAll(),
      ])
      if (prodRes.status === 'fulfilled') setProducts(prodRes.value.data)
      if (orderRes.status === 'fulfilled') setOrders(orderRes.value.data)
      if (drvRes.status === 'fulfilled') setDrivers(drvRes.value.data)
      if (notifRes.status === 'fulfilled') setNotifications(notifRes.value.data)
      if (storeRes.status === 'fulfilled') setStores(storeRes.value.data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('sumu_token')
    if (token) loadAll()
  }, [loadAll])

  // ── Socket.io real-time updates ───────────────────────────────────
  useSocket({
    'order:new': async ({ orderId }) => {
      try {
        const res = await ordersAPI.getOne(orderId)
        setOrders(prev => [res.data, ...prev.filter(o => o.id !== orderId)])
        setNotifications(prev => [{
          id: Date.now(), type: 'order',
          title_ar: 'طلب جديد', title_en: 'New Order',
          msg_ar: `طلب جديد ${orderId}`, msg_en: `New order ${orderId}`,
          is_read: 0, created_at: new Date().toISOString(),
        }, ...prev])
      } catch {}
    },
    'order:updated': async ({ orderId }) => {
      try {
        const res = await ordersAPI.getOne(orderId)
        setOrders(prev => prev.map(o => o.id === orderId ? res.data : o))
      } catch {}
    },
    'driver:status_changed': ({ driverId, is_online }) => {
      setDrivers(prev => prev.map(d => d.id === driverId ? { ...d, is_online } : d))
    },
  })

  // ── Products ──────────────────────────────────────────────────────
  const addProduct = useCallback(async (product) => {
    const res = await productsAPI.create(product)
    setProducts(prev => [...prev, res.data])
    return res.data
  }, [])

  const updateProduct = useCallback(async (id, updates) => {
    const res = await productsAPI.update(id, updates)
    setProducts(prev => prev.map(p => p.id === id ? res.data : p))
  }, [])

  const deleteProduct = useCallback(async (id) => {
    await productsAPI.delete(id)
    setProducts(prev => prev.filter(p => p.id !== id))
  }, [])

  const toggleProduct = useCallback(async (id) => {
    const product = products.find(p => p.id === id)
    if (!product) return
    const res = await productsAPI.update(id, { is_active: product.is_active ? 0 : 1 })
    setProducts(prev => prev.map(p => p.id === id ? res.data : p))
  }, [products])

  const getStoreProducts = useCallback((storeId) => {
    return products.filter(p => p.store_id === storeId || p.storeId === storeId)
  }, [products])

  // ── Orders ────────────────────────────────────────────────────────
  const addOrder = useCallback(async (order) => {
    const res = await ordersAPI.create(order)
    setOrders(prev => [res.data, ...prev])
    return res.data
  }, [])

  const updateOrderStatus = useCallback(async (orderId, status, driverId = null) => {
    const res = await ordersAPI.updateStatus(orderId, status, driverId)
    setOrders(prev => prev.map(o => o.id === orderId ? res.data : o))
    // Socket broadcast
    const token = localStorage.getItem('sumu_token')
    if (token) {
      const { getSocket } = await import('../hooks/useSocket.js')
      getSocket().emit('order:status_update', { orderId, status })
    }
  }, [])

  const getStoreOrders = useCallback((storeId) => {
    return orders.filter(o => o.store_id === storeId || o.storeId === storeId)
  }, [orders])

  const getDriverOrders = useCallback((driverId) => {
    return orders.filter(o => o.driver_id === driverId || o.driverId === driverId)
  }, [orders])

  const getAvailableOrdersForDriver = useCallback(() => {
    return orders.filter(o => o.status === 'accepted' && !o.driver_id && !o.driverId)
  }, [orders])

  // ── Drivers ───────────────────────────────────────────────────────
  const updateDriver = useCallback(async (id, updates) => {
    const res = await driversAPI.update(id, updates)
    setDrivers(prev => prev.map(d => d.id === id ? res.data : d))
  }, [])

  const approveDriver = useCallback(async (id) => {
    const res = await driversAPI.update(id, { status: 'available' })
    setDrivers(prev => prev.map(d => d.id === id ? res.data : d))
  }, [])

  // ── Notifications ─────────────────────────────────────────────────
  const markNotificationRead = useCallback(async (id) => {
    await notifAPI.markRead(id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n))
  }, [])

  const markAllNotificationsRead = useCallback(async () => {
    await notifAPI.markAllRead()
    setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })))
  }, [])

  const unreadCount = notifications.filter(n => !n.is_read && !n.read).length

  // ── Stores ────────────────────────────────────────────────────────
  const addStore = useCallback(async (data) => {
    const res = await storesAPI.create(data)
    setStores(prev => [...prev, res.data])
    return res.data
  }, [])

  const updateStore = useCallback(async (id, data) => {
    const res = await storesAPI.update(id, data)
    setStores(prev => prev.map(s => s.id === id ? res.data : s))
  }, [])

  const deleteStore = useCallback(async (id) => {
    await storesAPI.delete(id)
    setStores(prev => prev.filter(s => s.id !== id))
  }, [])

  // ── Stats helpers (local calculation as fallback) ─────────────────
  const getStats = useCallback(() => {
    const todayOrders = orders.filter(o => {
      const d = new Date(o.created_at || o.createdAt)
      const now = new Date()
      return d.getDate() === now.getDate() && d.getMonth() === now.getMonth()
    })
    const revenue = orders.filter(o => o.status === 'completed').reduce((s, o) => s + (o.total || 0), 0)
    return {
      totalOrders: orders.length,
      todayOrders: todayOrders.length,
      completedOrders: orders.filter(o => o.status === 'completed').length,
      pendingOrders: orders.filter(o => ['pending', 'accepted', 'preparing'].includes(o.status)).length,
      totalRevenue: revenue,
      totalUsers: 0,
      activeDrivers: drivers.filter(d => d.is_online || d.online).length,
      totalDrivers: drivers.length,
    }
  }, [orders, drivers])

  const getStoreStats = useCallback((storeId) => {
    const storeOrders = orders.filter(o => o.store_id === storeId || o.storeId === storeId)
    const completed = storeOrders.filter(o => o.status === 'completed')
    const revenue = completed.reduce((s, o) => s + (o.total || 0), 0)
    const today = storeOrders.filter(o => {
      const d = new Date(o.created_at || o.createdAt)
      const now = new Date()
      return d.getDate() === now.getDate() && d.getMonth() === now.getMonth()
    })
    return {
      totalOrders: storeOrders.length,
      todayOrders: today.length,
      completedOrders: completed.length,
      pendingOrders: storeOrders.filter(o => ['pending', 'accepted', 'preparing'].includes(o.status)).length,
      revenue,
      products: products.filter(p => p.store_id === storeId || p.storeId === storeId).length,
    }
  }, [orders, products])

  const getDriverStats = useCallback((driverId) => {
    const driverOrders = orders.filter(o => (o.driver_id === driverId || o.driverId === driverId) && o.status === 'completed')
    const earnings = driverOrders.length * 15
    const today = driverOrders.filter(o => {
      const d = new Date(o.created_at || o.createdAt)
      const now = new Date()
      return d.getDate() === now.getDate() && d.getMonth() === now.getMonth()
    })
    return {
      totalDeliveries: driverOrders.length,
      todayDeliveries: today.length,
      totalEarnings: earnings,
      todayEarnings: today.length * 15,
    }
  }, [orders])

  // Expose refreshers
  const refreshOrders = useCallback(async () => {
    try {
      const res = await ordersAPI.getAll()
      setOrders(res.data)
    } catch {}
  }, [])

  const refreshProducts = useCallback(async (storeId) => {
    try {
      const res = await productsAPI.getAll(storeId)
      if (storeId) {
        setProducts(prev => [...prev.filter(p => p.store_id !== storeId), ...res.data])
      } else {
        setProducts(res.data)
      }
    } catch {}
  }, [])

  // Users (for admin panels) — loaded on demand
  const [users, setUsers] = useState([])
  const loadUsers = useCallback(async () => {
    try {
      const { usersAPI: uApi } = await import('../services/api.js')
      const res = await uApi.getCustomers()
      setUsers(res.data)
    } catch {}
  }, [])

  const updateUser = useCallback((id, updates) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u))
  }, [])

  return (
    <AppContext.Provider value={{
      // State
      products, orders, users, drivers, notifications, stores, loading,
      // Data refresh
      loadAll, refreshOrders, refreshProducts, loadUsers,
      unreadCount,
      // Products
      addProduct, updateProduct, deleteProduct, toggleProduct, getStoreProducts,
      // Orders
      addOrder, updateOrderStatus, getStoreOrders, getDriverOrders, getAvailableOrdersForDriver,
      // Users
      updateUser,
      // Drivers
      updateDriver, approveDriver,
      // Stores
      addStore, updateStore, deleteStore,
      // Notifications
      markNotificationRead, markAllNotificationsRead,
      // Stats
      getStats, getStoreStats, getDriverStats,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
