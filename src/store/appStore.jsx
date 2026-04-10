import { useState, createContext, useContext, useCallback, useEffect } from 'react'
import { productsAPI, ordersAPI, driversAPI, notifAPI, storesAPI, statsAPI } from '../services/api.js'
import { useSocket, getSocket } from '../hooks/useSocket.js'

const AppContext = createContext()

// Normalise product from API → shape expected by components
function normProduct(p) {
  return {
    ...p,
    nameAr: p.nameAr ?? p.name_ar,
    nameEn: p.nameEn ?? p.name_en,
    image: p.image ?? p.emoji,
    emoji: p.emoji ?? p.image,
    active: p.active ?? (p.isActive === 1 || p.isActive === true),
    isActive: p.isActive ?? p.active,
    storeId: p.storeId ?? p.store_id,
    store_id: p.store_id ?? p.storeId,
  }
}

// Normalise order from API → shape expected by components
function normOrder(o) {
  return {
    ...o,
    customerNameAr: o.customerNameAr ?? o.customer_name_ar,
    customerNameEn: o.customerNameEn ?? o.customer_name_en,
    customerPhone: o.customerPhone ?? o.customer_phone,
    addressAr: o.addressAr ?? o.address_ar,
    addressEn: o.addressEn ?? o.address_en,
    storeId: o.storeId ?? o.store_id,
    store_id: o.store_id ?? o.storeId,
    driverId: o.driverId ?? o.driver_id,
    driver_id: o.driver_id ?? o.driverId,
    createdAt: o.createdAt ?? o.created_at,
    created_at: o.created_at ?? o.createdAt,
  }
}

// Normalise driver from API → shape expected by components
function normDriver(d) {
  return {
    ...d,
    nameAr: d.nameAr ?? d.name_ar,
    nameEn: d.nameEn ?? d.name_en,
    vehicleAr: d.vehicleAr ?? d.vehicle_ar,
    vehicleEn: d.vehicleEn ?? d.vehicle_en,
    isOnline: d.isOnline ?? d.is_online,
    online: !!(d.isOnline ?? d.is_online),
    joinDate: d.joinDate ?? d.joinedAt ?? d.joined_at,
    locationAr: d.locationAr ?? d.location_ar,
    locationEn: d.locationEn ?? d.location_en,
  }
}

// Normalise notification from API → shape expected by components
function normNotif(n) {
  return {
    ...n,
    titleAr: n.titleAr ?? n.title_ar,
    titleEn: n.titleEn ?? n.title_en,
    msgAr: n.msgAr ?? n.msg_ar,
    msgEn: n.msgEn ?? n.msg_en,
    storeId: n.storeId ?? n.store_id,
    read: !!(n.isRead ?? n.is_read ?? n.read),
    isRead: !!(n.isRead ?? n.is_read ?? n.read),
    time: n.time ?? n.createdAt ?? n.created_at,
  }
}

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
      if (prodRes.status === 'fulfilled') setProducts(prodRes.value.data.map(normProduct))
      if (orderRes.status === 'fulfilled') setOrders(orderRes.value.data.map(normOrder))
      if (drvRes.status === 'fulfilled') setDrivers(drvRes.value.data.map(normDriver))
      if (notifRes.status === 'fulfilled') setNotifications(notifRes.value.data.map(normNotif))
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
        setOrders(prev => [normOrder(res.data), ...prev.filter(o => o.id !== orderId)])
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
        setOrders(prev => prev.map(o => o.id === orderId ? normOrder(res.data) : o))
      } catch {}
    },
    'driver:status_changed': ({ driverId, is_online }) => {
      setDrivers(prev => prev.map(d => d.id === driverId ? { ...d, is_online } : d))
    },
  })

  // ── Products ──────────────────────────────────────────────────────
  const addProduct = useCallback(async (product) => {
    // Map camelCase form fields to snake_case for API
    const payload = {
      name_ar: product.nameAr, name_en: product.nameEn,
      emoji: product.image || product.emoji,
      price: product.price, stock: product.stock,
      category: product.category, description: product.description,
      store_id: product.storeId || product.store_id,
    }
    const res = await productsAPI.create(payload)
    const norm = normProduct(res.data)
    setProducts(prev => [...prev, norm])
    return norm
  }, [])

  const updateProduct = useCallback(async (id, updates) => {
    const payload = {
      name_ar: updates.nameAr, name_en: updates.nameEn,
      emoji: updates.image || updates.emoji,
      price: updates.price, stock: updates.stock,
      category: updates.category, description: updates.description,
      is_active: updates.isActive ?? (updates.active ? 1 : undefined),
    }
    // Remove undefined keys
    Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k])
    const res = await productsAPI.update(id, payload)
    setProducts(prev => prev.map(p => p.id === id ? normProduct(res.data) : p))
  }, [])

  const deleteProduct = useCallback(async (id) => {
    await productsAPI.delete(id)
    setProducts(prev => prev.filter(p => p.id !== id))
  }, [])

  const toggleProduct = useCallback(async (id) => {
    const product = products.find(p => p.id === id)
    if (!product) return
    const currentActive = product.active || product.isActive
    const res = await productsAPI.update(id, { is_active: currentActive ? 0 : 1 })
    setProducts(prev => prev.map(p => p.id === id ? normProduct(res.data) : p))
  }, [products])

  const getStoreProducts = useCallback((storeId) => {
    return products.filter(p => p.store_id === storeId || p.storeId === storeId)
  }, [products])

  // ── Orders ────────────────────────────────────────────────────────
  const addOrder = useCallback(async (order) => {
    const res = await ordersAPI.create(order)
    const norm = normOrder(res.data)
    setOrders(prev => [norm, ...prev])
    return norm
  }, [])

  const updateOrderStatus = useCallback(async (orderId, status, driverId = null) => {
    const res = await ordersAPI.updateStatus(orderId, status, driverId)
    setOrders(prev => prev.map(o => o.id === orderId ? normOrder(res.data) : o))
    // Socket broadcast
    try { getSocket().emit('order:status_update', { orderId, status }) } catch {}
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
    const payload = {}
    if (updates.isOnline !== undefined) payload.is_online = updates.isOnline ? 1 : 0
    if (updates.online !== undefined) payload.is_online = updates.online ? 1 : 0
    if (updates.status !== undefined) payload.status = updates.status
    if (updates.locationAr !== undefined) payload.location_ar = updates.locationAr
    if (updates.locationEn !== undefined) payload.location_en = updates.locationEn
    const res = await driversAPI.update(id, Object.keys(payload).length ? payload : updates)
    setDrivers(prev => prev.map(d => d.id === id ? normDriver(res.data) : d))
  }, [])

  const approveDriver = useCallback(async (id) => {
    const res = await driversAPI.update(id, { status: 'available' })
    setDrivers(prev => prev.map(d => d.id === id ? normDriver(res.data) : d))
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
