import { useState, createContext, useContext, useCallback } from 'react'

// ─── Default Products ───────────────────────────────────────────────
const defaultProducts = [
  // Baharat Restaurant (storeId: 1)
  { id: 101, storeId: 1, nameAr: 'مشاوي مشكلة', nameEn: 'Mixed Grill', price: 55, category: 'مشويات', image: '🥩', active: true, stock: 50, description: 'تشكيلة من أشهى المشويات' },
  { id: 102, storeId: 1, nameAr: 'كبسة دجاج', nameEn: 'Chicken Kabsa', price: 38, category: 'أرز', image: '🍗', active: true, stock: 30, description: 'كبسة دجاج بالبهارات العربية' },
  { id: 103, storeId: 1, nameAr: 'عصير برتقال', nameEn: 'Orange Juice', price: 12, category: 'مشروبات', image: '🍊', active: true, stock: 100, description: 'عصير برتقال طازج' },
  { id: 104, storeId: 1, nameAr: 'حمص', nameEn: 'Hummus', price: 15, category: 'مقبلات', image: '🫘', active: true, stock: 40, description: 'حمص بطحينة' },
  // Burgetino (storeId: 2)
  { id: 201, storeId: 2, nameAr: 'برجر كلاسيك', nameEn: 'Classic Burger', price: 28, category: 'برجر', image: '🍔', active: true, stock: 60, description: 'برجر لحم أنجوس مشوي' },
  { id: 202, storeId: 2, nameAr: 'برجر دجاج', nameEn: 'Chicken Burger', price: 25, category: 'برجر', image: '🍗', active: true, stock: 45, description: 'برجر دجاج مقرمش' },
  { id: 203, storeId: 2, nameAr: 'بطاطس مقلية', nameEn: 'French Fries', price: 15, category: 'وجبات جانبية', image: '🍟', active: true, stock: 80, description: 'بطاطس مقلية مقرمشة' },
  // Fresh Mart (storeId: 4)
  { id: 401, storeId: 4, nameAr: 'حليب طازج', nameEn: 'Fresh Milk', price: 8, category: 'ألبان', image: '🥛', active: true, stock: 200, description: 'حليب طازج كامل الدسم' },
  { id: 402, storeId: 4, nameAr: 'خبز عربي', nameEn: 'Arabic Bread', price: 3, category: 'خبز', image: '🫓', active: true, stock: 150, description: 'خبز عربي طازج' },
  { id: 403, storeId: 4, nameAr: 'بيض طازج', nameEn: 'Fresh Eggs', price: 12, category: 'بيض', image: '🥚', active: true, stock: 100, description: 'بيض طازج 12 حبة' },
  // Al Shifa Pharmacy (storeId: 3)
  { id: 301, storeId: 3, nameAr: 'باراسيتامول', nameEn: 'Paracetamol', price: 5, category: 'مسكنات', image: '💊', active: true, stock: 500, description: 'مسكن ألم وخافض حرارة' },
  { id: 302, storeId: 3, nameAr: 'فيتامين سي', nameEn: 'Vitamin C', price: 18, category: 'فيتامينات', image: '🍋', active: true, stock: 200, description: 'فيتامين سي 1000mg' },
]

// ─── Default Orders ───────────────────────────────────────────────────
const defaultOrders = [
  { id: 'ORD-5001', storeId: 1, customerId: 'USR-001', customerNameAr: 'نورة الكثيري', customerNameEn: 'Noura Al Ketheri', customerPhone: '+971501234567', addressAr: 'دبي مارينا، مبنى A، شقة 304', addressEn: 'Dubai Marina, Block A, Apt 304', items: [{ productId: 101, nameAr: 'مشاوي مشكلة', nameEn: 'Mixed Grill', qty: 2, price: 55 }, { productId: 103, nameAr: 'عصير برتقال', nameEn: 'Orange Juice', qty: 1, price: 12 }], subtotal: 122, deliveryFee: 0, total: 122, status: 'preparing', driverId: null, createdAt: new Date(Date.now() - 15 * 60000).toISOString(), notes: '' },
  { id: 'ORD-5002', storeId: 4, customerId: 'USR-002', customerNameAr: 'فيصل الزهراني', customerNameEn: 'Faisal Al Zahrani', customerPhone: '+971509876543', addressAr: 'برشا هايتس، برج المرسى', addressEn: 'Barsha Heights, Al Mursa Tower', items: [{ productId: 401, nameAr: 'حليب طازج', nameEn: 'Fresh Milk', qty: 3, price: 8 }, { productId: 402, nameAr: 'خبز عربي', nameEn: 'Arabic Bread', qty: 2, price: 3 }], subtotal: 30, deliveryFee: 0, total: 30, status: 'pending', driverId: null, createdAt: new Date(Date.now() - 5 * 60000).toISOString(), notes: '' },
  { id: 'ORD-5003', storeId: 2, customerId: 'USR-003', customerNameAr: 'سارة البلوشي', customerNameEn: 'Sara Al Balushi', customerPhone: '+971556543210', addressAr: 'الخليج التجاري، برج أوبوس', addressEn: 'Business Bay, Opus Tower', items: [{ productId: 201, nameAr: 'برجر كلاسيك', nameEn: 'Classic Burger', qty: 1, price: 28 }, { productId: 203, nameAr: 'بطاطس مقلية', nameEn: 'French Fries', qty: 1, price: 15 }], subtotal: 43, deliveryFee: 2, total: 45, status: 'on_the_way', driverId: 'DRV-001', createdAt: new Date(Date.now() - 40 * 60000).toISOString(), notes: 'بدون بصل' },
  { id: 'ORD-5004', storeId: 3, customerId: 'USR-004', customerNameAr: 'محمد القحطاني', customerNameEn: 'Mohammed Al Qahtani', customerPhone: '+971521122334', addressAr: 'نخلة جميرا، فيلا 12', addressEn: 'Palm Jumeirah, Villa 12', items: [{ productId: 301, nameAr: 'باراسيتامول', nameEn: 'Paracetamol', qty: 2, price: 5 }, { productId: 302, nameAr: 'فيتامين سي', nameEn: 'Vitamin C', qty: 1, price: 18 }], subtotal: 28, deliveryFee: 0, total: 28, status: 'completed', driverId: 'DRV-002', createdAt: new Date(Date.now() - 3 * 3600000).toISOString(), notes: '' },
  { id: 'ORD-5005', storeId: 1, customerId: 'USR-005', customerNameAr: 'لطيفة المنصوري', customerNameEn: 'Latifa Al Mansoori', customerPhone: '+971504455667', addressAr: 'وسط مدينة دبي، برج ستاندرد', addressEn: 'Downtown Dubai, Standard Tower', items: [{ productId: 102, nameAr: 'كبسة دجاج', nameEn: 'Chicken Kabsa', qty: 2, price: 38 }, { productId: 104, nameAr: 'حمص', nameEn: 'Hummus', qty: 1, price: 15 }], subtotal: 91, deliveryFee: 0, total: 91, status: 'accepted', driverId: 'DRV-003', createdAt: new Date(Date.now() - 25 * 60000).toISOString(), notes: '' },
  { id: 'ORD-5006', storeId: 2, customerId: 'USR-006', customerNameAr: 'جاسم الحربي', customerNameEn: 'Jasim Al Harbi', customerPhone: '+971507788990', addressAr: 'الجميرا بيتش ريزيدنس', addressEn: 'JBR, Beach Residence', items: [{ productId: 202, nameAr: 'برجر دجاج', nameEn: 'Chicken Burger', qty: 2, price: 25 }], subtotal: 50, deliveryFee: 2, total: 52, status: 'cancelled', driverId: null, createdAt: new Date(Date.now() - 5 * 3600000).toISOString(), notes: '' },
]

// ─── Default Users ────────────────────────────────────────────────────
const defaultUsers = [
  { id: 'USR-001', nameAr: 'نورة الكثيري', nameEn: 'Noura Al Ketheri', email: 'noura@email.com', phone: '+971501234567', status: 'active', orders: 34, wallet: 120, joinDate: '2024-03-15' },
  { id: 'USR-002', nameAr: 'فيصل الزهراني', nameEn: 'Faisal Al Zahrani', email: 'faisal@email.com', phone: '+971509876543', status: 'active', orders: 18, wallet: 50, joinDate: '2024-05-20' },
  { id: 'USR-003', nameAr: 'سارة البلوشي', nameEn: 'Sara Al Balushi', email: 'sara@email.com', phone: '+971556543210', status: 'active', orders: 52, wallet: 200, joinDate: '2024-01-10' },
  { id: 'USR-004', nameAr: 'محمد القحطاني', nameEn: 'Mohammed Al Qahtani', email: 'mq@email.com', phone: '+971521122334', status: 'active', orders: 9, wallet: 0, joinDate: '2024-08-01' },
  { id: 'USR-005', nameAr: 'لطيفة المنصوري', nameEn: 'Latifa Al Mansoori', email: 'latifa@email.com', phone: '+971504455667', status: 'suspended', orders: 5, wallet: 30, joinDate: '2024-11-14' },
  { id: 'USR-006', nameAr: 'جاسم الحربي', nameEn: 'Jasim Al Harbi', email: 'jasim@email.com', phone: '+971507788990', status: 'active', orders: 27, wallet: 80, joinDate: '2024-02-28' },
]

// ─── Default Drivers ──────────────────────────────────────────────────
const defaultDrivers = [
  { id: 'DRV-001', nameAr: 'محمد العامري', nameEn: 'Mohammed Al Ameri', phone: '+971505001001', vehicleEn: 'Toyota Corolla', vehicleAr: 'تويوتا كورولا', plate: 'DXB-2341', status: 'delivering', rating: 4.9, trips: 1240, earnings: 12400, locationAr: 'دبي مارينا', locationEn: 'Dubai Marina', online: true, joinDate: '2023-06-10' },
  { id: 'DRV-002', nameAr: 'علي المطيري', nameEn: 'Ali Al Mutairi', phone: '+971505002002', vehicleEn: 'Honda Civic', vehicleAr: 'هوندا سيفيك', plate: 'SHJ-1122', status: 'available', rating: 4.7, trips: 860, earnings: 8600, locationAr: 'الخليج التجاري', locationEn: 'Business Bay', online: true, joinDate: '2023-09-22' },
  { id: 'DRV-003', nameAr: 'خالد الشمري', nameEn: 'Khalid Al Shammari', phone: '+971505003003', vehicleEn: 'Hyundai Elantra', vehicleAr: 'هيونداي إلنترا', plate: 'AJM-5678', status: 'available', rating: 4.8, trips: 540, earnings: 5400, locationAr: 'الجميرا', locationEn: 'Jumeirah', online: true, joinDate: '2024-01-15' },
  { id: 'DRV-004', nameAr: 'سالم الكعبي', nameEn: 'Salem Al Kaabi', phone: '+971505004004', vehicleEn: 'Nissan Altima', vehicleAr: 'نيسان ألتيما', plate: 'FUJ-9900', status: 'inactive', rating: 4.5, trips: 220, earnings: 2200, locationAr: 'عجمان', locationEn: 'Ajman', online: false, joinDate: '2024-04-30' },
  { id: 'DRV-005', nameAr: 'يوسف البريكي', nameEn: 'Yousif Al Breiki', phone: '+971505005005', vehicleEn: 'Kia Cerato', vehicleAr: 'كيا سيراتو', plate: 'RAS-3456', status: 'pending', rating: 0, trips: 0, earnings: 0, locationAr: 'رأس الخيمة', locationEn: 'Ras Al Khaimah', online: false, joinDate: '2025-01-20' },
]

// ─── Default Notifications ────────────────────────────────────────────
const defaultNotifications = [
  { id: 1, type: 'order', titleAr: 'طلب جديد', titleEn: 'New Order', msgAr: 'طلب جديد #ORD-5002 من فيصل الزهراني', msgEn: 'New order #ORD-5002 from Faisal Al Zahrani', time: new Date(Date.now() - 5 * 60000).toISOString(), read: false, storeId: 4 },
  { id: 2, type: 'driver', titleAr: 'سائق جديد', titleEn: 'New Driver', msgAr: 'يوسف البريكي طلب الانضمام كسائق', msgEn: 'Yousif Al Breiki applied as driver', time: new Date(Date.now() - 20 * 60000).toISOString(), read: false, storeId: null },
  { id: 3, type: 'store', titleAr: 'متجر جديد', titleEn: 'New Store', msgAr: 'طلب فتح متجر جديد بانتظار الموافقة', msgEn: 'New store opening request awaiting approval', time: new Date(Date.now() - 60 * 60000).toISOString(), read: true, storeId: null },
]

// ─── Context ──────────────────────────────────────────────────────────
const AppContext = createContext()

export function AppProvider({ children }) {
  const [products, setProducts] = useState(defaultProducts)
  const [orders, setOrders] = useState(defaultOrders)
  const [users, setUsers] = useState(defaultUsers)
  const [drivers, setDrivers] = useState(defaultDrivers)
  const [notifications, setNotifications] = useState(defaultNotifications)
  const [activeVendorId, setActiveVendorId] = useState(1) // current logged-in vendor store
  const [activeDriverId, setActiveDriverId] = useState('DRV-001') // current logged-in driver

  // ── Products ──────────────────────────────────────────────────────
  const addProduct = useCallback((product) => {
    const newProduct = { id: Date.now(), active: true, stock: 0, ...product }
    setProducts(prev => [...prev, newProduct])
  }, [])

  const updateProduct = useCallback((id, updates) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
  }, [])

  const deleteProduct = useCallback((id) => {
    setProducts(prev => prev.filter(p => p.id !== id))
  }, [])

  const toggleProduct = useCallback((id) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p))
  }, [])

  const getStoreProducts = useCallback((storeId) => {
    return products.filter(p => p.storeId === storeId)
  }, [products])

  // ── Orders ────────────────────────────────────────────────────────
  const addOrder = useCallback((order) => {
    const newOrder = {
      id: `ORD-${5000 + Date.now() % 1000}`,
      status: 'pending',
      driverId: null,
      createdAt: new Date().toISOString(),
      ...order
    }
    setOrders(prev => [newOrder, ...prev])
    // Add notification
    setNotifications(prev => [{
      id: Date.now(),
      type: 'order',
      titleAr: 'طلب جديد',
      titleEn: 'New Order',
      msgAr: `طلب جديد ${newOrder.id}`,
      msgEn: `New order ${newOrder.id}`,
      time: new Date().toISOString(),
      read: false,
      storeId: newOrder.storeId
    }, ...prev])
    return newOrder
  }, [])

  const updateOrderStatus = useCallback((orderId, status, driverId = null) => {
    setOrders(prev => prev.map(o =>
      o.id === orderId ? { ...o, status, ...(driverId ? { driverId } : {}) } : o
    ))
  }, [])

  const getStoreOrders = useCallback((storeId) => {
    return orders.filter(o => o.storeId === storeId)
  }, [orders])

  const getDriverOrders = useCallback((driverId) => {
    return orders.filter(o => o.driverId === driverId)
  }, [orders])

  const getAvailableOrdersForDriver = useCallback(() => {
    return orders.filter(o => o.status === 'accepted' && !o.driverId)
  }, [orders])

  // ── Users ──────────────────────────────────────────────────────────
  const updateUser = useCallback((id, updates) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u))
  }, [])

  // ── Drivers ───────────────────────────────────────────────────────
  const updateDriver = useCallback((id, updates) => {
    setDrivers(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d))
  }, [])

  const approveDriver = useCallback((id) => {
    setDrivers(prev => prev.map(d => d.id === id ? { ...d, status: 'available', online: false } : d))
  }, [])

  // ── Notifications ─────────────────────────────────────────────────
  const markNotificationRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }, [])

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  // ── Stats helpers ─────────────────────────────────────────────────
  const getStats = useCallback(() => {
    const todayOrders = orders.filter(o => {
      const d = new Date(o.createdAt)
      const now = new Date()
      return d.getDate() === now.getDate() && d.getMonth() === now.getMonth()
    })
    const revenue = orders.filter(o => o.status === 'completed').reduce((s, o) => s + o.total, 0)
    return {
      totalOrders: orders.length,
      todayOrders: todayOrders.length,
      completedOrders: orders.filter(o => o.status === 'completed').length,
      pendingOrders: orders.filter(o => ['pending', 'accepted', 'preparing'].includes(o.status)).length,
      totalRevenue: revenue,
      totalUsers: users.length,
      activeDrivers: drivers.filter(d => d.online).length,
      totalDrivers: drivers.length,
    }
  }, [orders, users, drivers])

  const getStoreStats = useCallback((storeId) => {
    const storeOrders = orders.filter(o => o.storeId === storeId)
    const completed = storeOrders.filter(o => o.status === 'completed')
    const revenue = completed.reduce((s, o) => s + o.total, 0)
    const today = storeOrders.filter(o => {
      const d = new Date(o.createdAt)
      const now = new Date()
      return d.getDate() === now.getDate() && d.getMonth() === now.getMonth()
    })
    return {
      totalOrders: storeOrders.length,
      todayOrders: today.length,
      completedOrders: completed.length,
      pendingOrders: storeOrders.filter(o => ['pending', 'accepted', 'preparing'].includes(o.status)).length,
      revenue,
      products: products.filter(p => p.storeId === storeId).length,
    }
  }, [orders, products])

  const getDriverStats = useCallback((driverId) => {
    const driverOrders = orders.filter(o => o.driverId === driverId && o.status === 'completed')
    const earnings = driverOrders.length * 15 // avg 15 AED per delivery
    const today = driverOrders.filter(o => {
      const d = new Date(o.createdAt)
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

  return (
    <AppContext.Provider value={{
      // State
      products, orders, users, drivers, notifications,
      activeVendorId, setActiveVendorId,
      activeDriverId, setActiveDriverId,
      unreadCount,
      // Products
      addProduct, updateProduct, deleteProduct, toggleProduct, getStoreProducts,
      // Orders
      addOrder, updateOrderStatus, getStoreOrders, getDriverOrders, getAvailableOrdersForDriver,
      // Users
      updateUser,
      // Drivers
      updateDriver, approveDriver,
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
