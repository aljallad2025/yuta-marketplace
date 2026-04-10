import axios from 'axios'

const BASE_URL = '/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sumu_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// snake_case → camelCase deep converter
function toCamel(str) {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
}
function convertKeys(obj) {
  if (Array.isArray(obj)) return obj.map(convertKeys)
  if (obj && typeof obj === 'object' && !(obj instanceof File)) {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [toCamel(k), convertKeys(v)])
    )
  }
  return obj
}

// Handle auth errors globally + auto-convert keys
api.interceptors.response.use(
  (res) => {
    res.data = convertKeys(res.data)
    return res
  },
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sumu_token')
      localStorage.removeItem('sumu_user')
    }
    return Promise.reject(err)
  }
)

export default api

// ── Auth ─────────────────────────────────────────────────────────────
export const authAPI = {
  login: (username, password, role) => api.post('/auth/login', { username, password, role }),
  register: (data) => api.post('/auth/register', data),
}

// ── Stores ───────────────────────────────────────────────────────────
export const storesAPI = {
  getAll: () => api.get('/stores'),
  getOne: (id) => api.get(`/stores/${id}`),
  create: (data) => api.post('/stores', data),
  update: (id, data) => api.put(`/stores/${id}`, data),
  delete: (id) => api.delete(`/stores/${id}`),
}

// ── Products ─────────────────────────────────────────────────────────
export const productsAPI = {
  getAll: (storeId) => api.get('/products', { params: storeId ? { store_id: storeId } : {} }),
  getOne: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
}

// ── Orders ───────────────────────────────────────────────────────────
export const ordersAPI = {
  getAll: () => api.get('/orders'),
  getAvailable: () => api.get('/orders/available'),
  getOne: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  updateStatus: (id, status, driverId) => api.patch(`/orders/${id}/status`, { status, driver_id: driverId }),
}

// ── Users ────────────────────────────────────────────────────────────
export const usersAPI = {
  getAll: () => api.get('/users'),
  getPending: () => api.get('/users/pending'),
  getCustomers: () => api.get('/users/customers'),
  getOne: (id) => api.get(`/users/${id}`),
  updateStatus: (id, status) => api.patch(`/users/${id}/status`, { status }),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
}

// ── Drivers ──────────────────────────────────────────────────────────
export const driversAPI = {
  getAll: () => api.get('/drivers'),
  getOne: (id) => api.get(`/drivers/${id}`),
  update: (id, data) => api.patch(`/drivers/${id}`, data),
  getStats: (id) => api.get(`/drivers/${id}/stats`),
}

// ── Notifications ────────────────────────────────────────────────────
export const notifAPI = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
}

// ── Stats ────────────────────────────────────────────────────────────
export const statsAPI = {
  admin: () => api.get('/stats'),
  store: (id) => api.get(`/stats/store/${id}`),
}

// ── Uploads ──────────────────────────────────────────────────────────
export const uploadsAPI = {
  image: (file) => {
    const form = new FormData()
    form.append('image', file)
    return api.post('/uploads/image', form, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
}
