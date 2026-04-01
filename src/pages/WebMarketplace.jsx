import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, SlidersHorizontal, Star, Clock, ChevronDown, MapPin, Filter } from 'lucide-react'

const categories = [
  { id: 'all', label: 'All', emoji: '🏪' },
  { id: 'restaurants', label: 'Restaurants', emoji: '🍔' },
  { id: 'supermarket', label: 'Supermarket', emoji: '🛒' },
  { id: 'pharmacy', label: 'Pharmacies', emoji: '💊' },
  { id: 'beauty', label: 'Beauty', emoji: '💄' },
  { id: 'electronics', label: 'Electronics', emoji: '📱' },
  { id: 'general', label: 'General', emoji: '🏬' },
]

const stores = [
  { id: 1, name: 'Baharat Restaurant', category: 'restaurants', rating: 4.9, time: '20–30 min', minOrder: 15, deliveryFee: 'Free', open: true, featured: true, tag: 'Popular', bg: '#FFF3E0', emoji: '🍽️' },
  { id: 2, name: 'Burgetino', category: 'restaurants', rating: 4.8, time: '25–40 min', minOrder: 10, deliveryFee: '2 AED', open: true, featured: true, tag: 'New', bg: '#E8F5E9', emoji: '🍔' },
  { id: 3, name: 'Al Shifa Pharmacy', category: 'pharmacy', rating: 4.9, time: '10–20 min', minOrder: 0, deliveryFee: 'Free', open: true, tag: 'Open 24h', bg: '#E3F2FD', emoji: '💊' },
  { id: 4, name: 'Fresh Mart Supermarket', category: 'supermarket', rating: 4.7, time: '30–45 min', minOrder: 30, deliveryFee: 'Free', open: true, tag: 'Free Delivery', bg: '#F3E5F5', emoji: '🛒' },
  { id: 5, name: 'Glamour Beauty', category: 'beauty', rating: 4.6, time: '45–60 min', minOrder: 50, deliveryFee: '5 AED', open: true, tag: null, bg: '#FCE4EC', emoji: '💄' },
  { id: 6, name: 'TechZone Electronics', category: 'electronics', rating: 4.5, time: '60–90 min', minOrder: 100, deliveryFee: '10 AED', open: false, tag: null, bg: '#E0F7FA', emoji: '📱' },
  { id: 7, name: 'Al Noor Supermarket', category: 'supermarket', rating: 4.4, time: '35–50 min', minOrder: 20, deliveryFee: '3 AED', open: true, tag: null, bg: '#F1F8E9', emoji: '🛒' },
  { id: 8, name: 'Orient General Store', category: 'general', rating: 4.3, time: '20–30 min', minOrder: 0, deliveryFee: '2 AED', open: true, tag: null, bg: '#FFF8E1', emoji: '🏬' },
]

const sortOptions = ['Most Popular', 'Fastest Delivery', 'Highest Rated', 'Min. Order']

export default function WebMarketplace() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('Most Popular')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = stores.filter(s => {
    const matchCat = activeCategory === 'all' || s.category === activeCategory
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="min-h-screen bg-[#F8F6F1]">
      {/* Header */}
      <div className="bg-[#0F2A47] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
            <MapPin size={14} />
            <span>Dubai Marina, Dubai</span>
            <ChevronDown size={14} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Explore Stores</h1>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center bg-white rounded-xl px-4 py-3 gap-2 shadow-sm">
              <Search size={16} className="text-[#666]" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search stores or products..."
                className="flex-1 outline-none text-[#222] text-sm bg-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl shadow-sm text-sm font-medium text-[#0F2A47]"
            >
              <SlidersHorizontal size={16} />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="bg-white border-b border-[#E8E6E1] sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#0F2A47] text-white'
                    : 'bg-[#F8F6F1] text-[#444] hover:bg-[#E8E6E1]'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Sort & count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-[#666]">
            <span className="font-semibold text-[#222]">{filtered.length}</span> stores found
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#666]">Sort:</span>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="text-sm border border-[#E8E6E1] rounded-lg px-3 py-1.5 bg-white text-[#222] outline-none"
            >
              {sortOptions.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>

        {/* Stores grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(store => (
            <Link key={store.id} to="/web/store"
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E8E6E1] hover:shadow-md hover:border-[#C8A951]/30 group">
              <div className="h-40 relative flex items-center justify-center" style={{ backgroundColor: store.bg }}>
                <span className="text-5xl">{store.emoji}</span>
                {store.tag && (
                  <span className="absolute top-3 left-3 px-2 py-0.5 bg-[#0F2A47] text-white text-xs rounded-full font-medium">
                    {store.tag}
                  </span>
                )}
                {!store.open && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                    <span className="font-semibold text-[#666] text-sm">Currently Closed</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="font-semibold text-[#222] text-sm leading-tight">{store.name}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1 text-xs">
                    <Star size={11} className="fill-[#C8A951] text-[#C8A951]" />
                    <span className="font-semibold text-[#444]">{store.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[#666]">
                    <Clock size={11} />
                    <span>{store.time}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F0EEE9]">
                  <span className="text-xs text-[#666]">Min: {store.minOrder > 0 ? `${store.minOrder} AED` : 'No min.'}</span>
                  <span className={`text-xs font-medium ${store.deliveryFee === 'Free' ? 'text-emerald-600' : 'text-[#666]'}`}>
                    {store.deliveryFee === 'Free' ? '🚚 Free delivery' : `🚚 ${store.deliveryFee}`}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-[#666] font-medium">No stores found matching your search</p>
          </div>
        )}
      </div>
    </div>
  )
}
