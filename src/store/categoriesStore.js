import { useState, createContext, useContext } from 'react'

const defaultCategories = [
  { id: 1, emoji: '🍔', labelEn: 'Restaurants', labelAr: 'المطاعم', active: true, count: 48 },
  { id: 2, emoji: '🛒', labelEn: 'Supermarket', labelAr: 'السوبرماركت', active: true, count: 12 },
  { id: 3, emoji: '🧹', labelEn: 'Rida Clean', labelAr: 'ريدا كلين', active: true, count: 6 },
  { id: 4, emoji: '💄', labelEn: 'Cosmetics', labelAr: 'مستحضرات التجميل', active: true, count: 18 },
  { id: 5, emoji: '💊', labelEn: 'Pharmacies', labelAr: 'الصيدليات', active: true, count: 15 },
  { id: 6, emoji: '🏪', labelEn: 'General Stores', labelAr: 'المحلات العامة', active: true, count: 34 },
  { id: 7, emoji: '🍰', labelEn: 'Bakeries', labelAr: 'المخابز', active: true, count: 9 },
  { id: 8, emoji: '📱', labelEn: 'Electronics', labelAr: 'الإلكترونيات', active: true, count: 18 },
]

const CategoriesContext = createContext()

export function CategoriesProvider({ children }) {
  const [categories, setCategories] = useState(defaultCategories)

  const addCategory = (cat) => setCategories(prev => [
    ...prev,
    { id: Date.now(), ...cat, active: true, count: 0 }
  ])

  const updateCategory = (id, updates) => setCategories(prev =>
    prev.map(c => c.id === id ? { ...c, ...updates } : c)
  )

  const deleteCategory = (id) => setCategories(prev => prev.filter(c => c.id !== id))

  const toggleCategory = (id) => setCategories(prev =>
    prev.map(c => c.id === id ? { ...c, active: !c.active } : c)
  )

  return (
    <CategoriesContext.Provider value={{ categories, addCategory, updateCategory, deleteCategory, toggleCategory }}>
      {children}
    </CategoriesContext.Provider>
  )
}

export const useCategories = () => useContext(CategoriesContext)
