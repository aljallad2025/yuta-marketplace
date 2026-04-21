import { useState, useEffect, createContext, useContext } from 'react'

const CategoriesContext = createContext()

export function CategoriesProvider({ children }) {
  const [categories, setCategories] = useState([])

  const fetchCategories = () => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setCategories(data) })
      .catch(() => {})
  }

  useEffect(() => { fetchCategories() }, [])

  const toggleCategory = async (id) => {
    const cat = categories.find(c => c.id === id)
    if (!cat) return
    const token = localStorage.getItem('sumu_token')
    await fetch('/api/categories/' + id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify({ active: !cat.active })
    })
    fetchCategories()
  }

  const updateCategory = async (id, updates) => {
    const token = localStorage.getItem('sumu_token')
    await fetch('/api/categories/' + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify(updates)
    })
    fetchCategories()
  }

  return (
    <CategoriesContext.Provider value={{ categories, toggleCategory, updateCategory, refetch: fetchCategories }}>
      {children}
    </CategoriesContext.Provider>
  )
}

export const useCategories = () => useContext(CategoriesContext)
