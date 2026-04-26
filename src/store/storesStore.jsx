import { useState, createContext, useContext, useEffect, useCallback } from 'react'
import { storesAPI } from '../services/api.js'

// Static rich data to supplement API (categories, commission, revenue etc.)
const storesMeta = {
  1: { catId: 1, tag: 'popular', bg: '#FFF3E0', emoji: '🍽️', ownerEn: 'Khalid Al Nasser', ownerAr: 'خالد الناصر', commission: 12, revenue: 48600, orders: 1240 },
  2: { catId: 1, tag: 'new', bg: '#E8F5E9', emoji: '🍔', ownerEn: 'Saeed Hamdan', ownerAr: 'سعيد حمدان', commission: 12, revenue: 22000, orders: 580 },
  3: { catId: 5, tag: 'open24', bg: '#E3F2FD', emoji: '💊', ownerEn: 'Dr. Fatima Hassan', ownerAr: 'د. فاطمة حسن', commission: 8, revenue: 22800, orders: 640 },
  4: { catId: 2, tag: 'free', bg: '#F3E5F5', emoji: '🛒', ownerEn: 'Ahmed Saeed', ownerAr: 'أحمد سعيد', commission: 10, revenue: 38200, orders: 890 },
}

// Map API snake_case store → component-expected shape
function mapStore(s) {
  const meta = storesMeta[s.id] || { catId: 6, bg: '#F0F9F8', emoji: s.logo || '🏪', commission: 10, revenue: 0, orders: 0 }
  return {
    ...s,
    // keep snake_case originals AND add camelCase aliases
    nameAr: s.nameAr || s.name_ar,
    nameEn: s.nameEn || s.name_en,
    minOrder: s.minOrder ?? s.min_order ?? 0,
    deliveryFee: s.deliveryFee ?? s.delivery_fee ?? 0,
    deliveryTime: s.deliveryTime || s.delivery_time || '30-45',
    isOpen: s.isOpen ?? s.is_open ?? 1,
    open: !!(s.isOpen ?? s.is_open ?? 1),
    active: !!(s.isOpen ?? s.is_open ?? 1),
    time: s.deliveryTime || s.delivery_time || '30-45',
    timeAr: s.deliveryTime || s.delivery_time || '30-45',
    rating: s.rating || 4.5,
    ...meta,
  }
}

const StoresContext = createContext()

export function StoresProvider({ children }) {
  const [stores, setStores] = useState([])

  const loadStores = useCallback(async () => {
    try {
      const res = await storesAPI.getAll()
      setStores((res.data || []).map(mapStore))
    } catch {
      // silently fail — pages will show empty
    }
  }, [])

  useEffect(() => { loadStores() }, [loadStores])

  const addStore = useCallback(async (store) => {
    const payload = {
      name_ar: store.nameAr || store.name_ar || '',
      name_en: store.nameEn || store.name_en || '',
      category: store.category || (store.catId === 1 ? 'restaurant' : store.catId === 2 ? 'supermarket' : store.catId === 5 ? 'pharmacy' : store.catId === 6 ? 'cosmetics' : 'restaurant'),
      logo: store.emoji || store.logo || '🏪',
      phone: store.phone || '',
      min_order: store.minOrder ?? store.min_order ?? 0,
      delivery_fee: store.deliveryFee ?? store.delivery_fee ?? 0,
      delivery_time: store.deliveryTime || store.delivery_time || '30-45',
    }
    try {
      const res = await storesAPI.create(payload)
      setStores(prev => [...prev, mapStore(res.data)])
      return res.data
    } catch {
      const newStore = mapStore({ id: Date.now(), ...payload, is_open: 1, rating: 0 })
      setStores(prev => [...prev, newStore])
      return newStore
    }
  }, [])

  const updateStore = useCallback(async (id, updates) => {
    // optimistic
    setStores(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))
    try {
      // Map camelCase back to snake_case for API
      const apiUpdates = {}
      if (updates.nameAr !== undefined) apiUpdates.name_ar = updates.nameAr
      if (updates.nameEn !== undefined) apiUpdates.name_en = updates.nameEn
      if (updates.minOrder !== undefined) apiUpdates.min_order = updates.minOrder
      if (updates.deliveryFee !== undefined) apiUpdates.delivery_fee = updates.deliveryFee
      if (updates.deliveryTime !== undefined) apiUpdates.delivery_time = updates.deliveryTime
      if (updates.open !== undefined) apiUpdates.is_open = updates.open ? 1 : 0
      if (updates.phone !== undefined) apiUpdates.phone = updates.phone
      // pass through any snake_case keys directly
      Object.keys(updates).forEach(k => {
        if (k.includes('_')) apiUpdates[k] = updates[k]
      })
      const res = await storesAPI.update(id, apiUpdates)
      setStores(prev => prev.map(s => s.id === id ? mapStore(res.data) : s))
    } catch {}
  }, [])

  const deleteStore = useCallback(async (id) => {
    setStores(prev => prev.filter(s => s.id !== id))
    try { await storesAPI.delete(id) } catch {}
  }, [])

  const toggleStore = useCallback(async (id) => {
    const store = stores.find(s => s.id === id)
    if (!store) return
    const newOpen = !store.open
    updateStore(id, { open: newOpen, active: newOpen, isOpen: newOpen ? 1 : 0 })
  }, [stores, updateStore])

  const approveStore = useCallback((id) => {
    updateStore(id, { active: true, open: true, status: 'active' })
  }, [updateStore])

  return (
    <StoresContext.Provider value={{ stores, addStore, updateStore, deleteStore, toggleStore, approveStore, loadStores }}>
      {children}
    </StoresContext.Provider>
  )
}

export const useStores = () => useContext(StoresContext)
