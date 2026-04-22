const BASE_URL = 'https://sumu-app.store/api'

const get = async (path) => {
  const res = await fetch(`${BASE_URL}${path}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

const post = async (path, body) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

/* ── Auth (محلي مبسط) ── */
export const authService = {
  signIn: async (email, password) => {
    const data = await post('/auth/login', { email, password })
    return data
  },
  signUp: async (email, password, name, phone) => {
    const data = await post('/auth/register', { email, password, name, phone })
    return data
  },
  signOut: async () => {},
  getSession: async () => {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null
    return token ? { access_token: token } : null
  },
  onAuthStateChange: (callback) => {
    return { data: { subscription: { unsubscribe: () => {} } } }
  },
}

/* ── Profile ── */
export const profileService = {
  getProfile: async (userId) => {
    try { return await get(`/users/${userId}`) } catch { return null }
  },
  updateProfile: async (userId, updates) => {
    return await post(`/users/${userId}`, updates)
  },
}

/* ── Stores ── */
export const storeService = {
  getStores: async (category = null) => {
    const path = category && category !== 'all'
      ? `/stores?category=${category}`
      : '/stores'
    const data = await get(path)
    return Array.isArray(data) ? data.map(normalizeStore) : []
  },
  getFeaturedStores: async () => {
    const data = await get('/stores?featured=1')
    return Array.isArray(data) ? data.map(normalizeStore) : []
  },
  getStoreById: async (id) => {
    const data = await get(`/stores/${id}`)
    return normalizeStore(data)
  },
}

/* ── Categories ── */
export const categoryService = {
  getCategories: async () => {
    const data = await get('/categories')
    return Array.isArray(data) ? data.map(normalizeCat) : []
  },
}

/* ── Products ── */
export const productService = {
  getProducts: async (storeId) => {
    const data = await get(`/products?store_id=${storeId}`)
    return Array.isArray(data) ? data : []
  },
}

/* ── Orders ── */
export const orderService = {
  createOrder: async (orderData) => {
    return await post('/orders', orderData)
  },
  getOrders: async () => {
    try { return await get('/orders/my') } catch { return [] }
  },
  getOrderById: async (id) => {
    return await get(`/orders/${id}`)
  },
}

/* ── Offers ── */
export const offerService = {
  getOffers: async () => {
    try {
      const data = await get('/offers')
      return Array.isArray(data) ? data : []
    } catch {
      return [
        { id:1, title_ar:'خصم 30% على أول طلب', title_en:'30% off your first order', subtitle_ar:'استخدم كود: SUMU30', subtitle_en:'Use code: SUMU30', color:'#0F2A47', emoji:'🎉' },
        { id:2, title_ar:'توصيل مجاني', title_en:'Free Delivery', subtitle_ar:'لطلبات فوق 50 ريال', subtitle_en:'Orders above 50 SAR', color:'#C8A951', emoji:'🚀' },
        { id:3, title_ar:'اطلب الآن وادفع لاحقاً', title_en:'Order Now Pay Later', subtitle_ar:'بدون فوائد مع سومو', subtitle_en:'Interest-free with Sumu', color:'#1A6B4A', emoji:'💳' },
      ]
    }
  },
}

/* ── Catalog (فنادق، طيران، أطباء، تأمين) ── */
export const catalogService = {
  getHotels: async () => get('/catalog/hotels'),
  getFlights: async () => get('/catalog/flights'),
  getDoctors: async () => get('/catalog/doctors'),
  getInsurance: async () => get('/catalog/insurance'),
}

/* ── Taxi ── */
export const taxiService = {
  requestRide: async (rideData) => post('/taxi/request', rideData),
  getRides: async () => {
    try { return await get('/taxi/rides') } catch { return [] }
  },
}

/* ── Normalize helpers ── */
function normalizeStore(s) {
  return {
    id: s.id,
    nameAr: s.name_ar || s.nameAr || '',
    nameEn: s.name_en || s.nameEn || '',
    name_ar: s.name_ar || s.nameAr || '',
    name_en: s.name_en || s.nameEn || '',
    category: s.category || '',
    rating: s.rating || 4.5,
    reviewCount: s.review_count || s.reviewCount || 0,
    deliveryTime: s.delivery_time || s.deliveryTime || '30-45',
    deliveryFee: s.delivery_fee ?? s.deliveryFee ?? 0,
    minOrder: s.min_order || s.minOrder || 0,
    emoji: s.logo || s.emoji || '🏪',
    logo: s.logo || s.emoji || '🏪',
    descriptionAr: s.description_ar || s.descriptionAr || '',
    descriptionEn: s.description_en || s.descriptionEn || '',
    isOpen: s.is_open ?? s.isOpen ?? true,
    isFeatured: s.is_featured ?? s.isFeatured ?? false,
    address_ar: s.address_ar || '',
    address_en: s.address_en || '',
  }
}

function normalizeCat(c) {
  return {
    id: c.id,
    nameAr: c.name_ar || c.nameAr || '',
    nameEn: c.name_en || c.nameEn || '',
    name_ar: c.name_ar || c.nameAr || '',
    name_en: c.name_en || c.nameEn || '',
    icon: c.icon || c.emoji || '🏪',
    emoji: c.icon || c.emoji || '🏪',
    slug: c.slug || c.id,
  }
}
