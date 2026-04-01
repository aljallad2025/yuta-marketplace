import { useState } from 'react'
import { Search, Bell, MapPin, Star, Clock, ChevronLeft, ChevronRight, Zap } from 'lucide-react'
import SumuLogo from '../../components/SumuLogo'

const slides = [
  { label: 'Free Delivery!', sub: 'On first order', bg: 'from-[#0F2A47] to-[#1a3a5c]' },
  { label: 'Ramadan Offers', sub: 'Up to 40% off', bg: 'from-[#8B6914] to-[#C8A951]' },
  { label: 'Taxi from 3 AED', sub: 'Book now', bg: 'from-[#1a3a5c] to-[#0F2A47]' },
]

const services = [
  { emoji: '🏪', label: 'Marketplace' },
  { emoji: '🚚', label: 'Delivery' },
  { emoji: '🚗', label: 'Taxi' },
]

const categories = [
  { emoji: '🍔', label: 'Food' },
  { emoji: '🛒', label: 'Market' },
  { emoji: '💊', label: 'Pharma' },
  { emoji: '💄', label: 'Beauty' },
  { emoji: '📱', label: 'Tech' },
  { emoji: '🏪', label: 'General' },
]

const stores = [
  { name: 'Baharat', cat: 'Restaurant', rating: 4.9, time: '20 min', bg: '#FFF3E0', emoji: '🍽️' },
  { name: 'Burgetino', cat: 'Fast Food', rating: 4.8, time: '35 min', bg: '#E8F5E9', emoji: '🍔' },
  { name: 'Al Shifa', cat: 'Pharmacy', rating: 4.9, time: '15 min', bg: '#E3F2FD', emoji: '💊' },
]

export default function MobileHome() {
  const [slide, setSlide] = useState(0)
  const [search, setSearch] = useState('')

  return (
    <div className="bg-[#F8F6F1]">
      {/* Header */}
      <div className="bg-[#0F2A47] px-4 pt-2 pb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 text-white/60 text-xs">
            <MapPin size={11} />
            <span>Dubai Marina</span>
          </div>
          <SumuLogo size={28} variant="icon" />
          <button className="relative p-1.5 bg-white/10 rounded-lg">
            <Bell size={15} className="text-white" />
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#C8A951] rounded-full"></span>
          </button>
        </div>
        {/* Search */}
        <div className="flex items-center bg-white rounded-xl px-3 py-2.5 gap-2">
          <Search size={14} className="text-[#999]" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search stores or products..." className="flex-1 outline-none text-xs text-[#222] bg-transparent" />
        </div>
      </div>

      {/* Hero Slider */}
      <div className={`relative bg-gradient-to-r ${slides[slide].bg} mx-3 mt-3 rounded-2xl p-4 overflow-hidden`} style={{ minHeight: '100px' }}>
        <div className="flex justify-center mb-2">
          <SumuLogo size={28} variant="full" />
        </div>
        <p className="text-white font-bold text-center text-base">{slides[slide].label}</p>
        <p className="text-white/70 text-center text-xs">{slides[slide].sub}</p>
        <button className="block mx-auto mt-2 px-4 py-1.5 bg-[#C8A951] text-[#0F2A47] font-semibold text-xs rounded-full">
          Browse Now →
        </button>
        {/* dots */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)}
              className={`rounded-full transition-all ${i === slide ? 'w-4 h-1.5 bg-[#C8A951]' : 'w-1.5 h-1.5 bg-white/40'}`}
            />
          ))}
        </div>
      </div>

      {/* Services */}
      <div className="px-3 mt-4">
        <div className="grid grid-cols-3 gap-2">
          {services.map(s => (
            <div key={s.label} className="bg-white rounded-xl p-3 text-center shadow-sm border border-[#E8E6E1]">
              <div className="text-2xl mb-1">{s.emoji}</div>
              <p className="text-xs font-medium text-[#0F2A47]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="px-3 mt-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-[#0F2A47]">Categories</p>
          <span className="text-xs text-[#C8A951]">See all</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map(c => (
            <div key={c.label} className="flex-shrink-0 bg-white rounded-xl p-2.5 text-center shadow-sm border border-[#E8E6E1] w-14">
              <div className="text-xl">{c.emoji}</div>
              <p className="text-[9px] font-medium text-[#444] mt-0.5">{c.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Stores */}
      <div className="px-3 mt-4 pb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-[#0F2A47]">Featured Stores</p>
          <span className="text-xs text-[#C8A951]">View all</span>
        </div>
        <div className="space-y-2">
          {stores.map(store => (
            <div key={store.name} className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#E8E6E1] flex">
              <div className="w-16 flex items-center justify-center text-2xl" style={{ backgroundColor: store.bg }}>
                {store.emoji}
              </div>
              <div className="flex-1 p-3">
                <p className="font-semibold text-[#222] text-xs">{store.name}</p>
                <p className="text-[10px] text-[#666]">{store.cat}</p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-0.5">
                    <Star size={10} className="fill-[#C8A951] text-[#C8A951]" />
                    <span className="text-[10px] font-medium text-[#444]">{store.rating}</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-[10px] text-[#666]">
                    <Clock size={10} />
                    <span>{store.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Order Banner */}
      <div className="px-3 pb-4">
        <div className="bg-[#0F2A47] rounded-xl p-3 flex items-center gap-3">
          <div className="p-2 bg-[#C8A951]/20 rounded-lg">
            <Zap size={16} className="text-[#C8A951]" />
          </div>
          <div className="flex-1">
            <p className="text-white text-xs font-semibold">Order on the way!</p>
            <p className="text-white/60 text-[10px]">~12 min · #SUW-2841</p>
          </div>
          <span className="text-[#C8A951] text-xs font-medium">Track →</span>
        </div>
      </div>
    </div>
  )
}
