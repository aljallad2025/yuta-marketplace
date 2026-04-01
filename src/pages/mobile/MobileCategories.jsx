import { useState } from 'react'
import { Search } from 'lucide-react'

const categories = [
  { emoji: '🍔', label: 'Restaurants', count: 48 },
  { emoji: '🛒', label: 'Supermarket', count: 12 },
  { emoji: '💊', label: 'Pharmacies', count: 15 },
  { emoji: '💄', label: 'Beauty', count: 22 },
  { emoji: '📱', label: 'Electronics', count: 18 },
  { emoji: '🏪', label: 'General Stores', count: 34 },
  { emoji: '🍰', label: 'Bakeries', count: 9 },
  { emoji: '🏋️', label: 'Sports', count: 7 },
  { emoji: '🌸', label: 'Flowers', count: 6 },
  { emoji: '🐾', label: 'Pets', count: 5 },
  { emoji: '📚', label: 'Books', count: 8 },
  { emoji: '🧴', label: 'Health', count: 14 },
]

export default function MobileCategories() {
  const [search, setSearch] = useState('')
  const filtered = categories.filter(c => c.label.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="bg-[#F8F6F1]">
      <div className="bg-[#0F2A47] px-4 pt-2 pb-4">
        <h2 className="text-white font-bold text-base mb-3">All Categories</h2>
        <div className="flex items-center bg-white rounded-xl px-3 py-2.5 gap-2">
          <Search size={14} className="text-[#999]" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="flex-1 outline-none text-xs text-[#222] bg-transparent" />
        </div>
      </div>

      <div className="p-3 grid grid-cols-3 gap-2.5">
        {filtered.map(cat => (
          <div key={cat.label} className="bg-white rounded-2xl p-3 text-center shadow-sm border border-[#E8E6E1] hover:border-[#C8A951]/40 cursor-pointer">
            <div className="text-3xl mb-2">{cat.emoji}</div>
            <p className="text-xs font-semibold text-[#222] leading-tight">{cat.label}</p>
            <p className="text-[9px] text-[#999] mt-0.5">{cat.count} stores</p>
          </div>
        ))}
      </div>
    </div>
  )
}
