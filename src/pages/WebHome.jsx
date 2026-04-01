import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, Star, Clock, ArrowRight, ChevronLeft, ChevronRight, Zap, ShoppingBag, Car, Package } from 'lucide-react'
import SumuLogo from '../components/SumuLogo'

const slides = [
  { id: 1, title: 'Free Delivery on First Order', subtitle: 'Use code SUMU10 at checkout', bg: 'from-[#0F2A47] to-[#1a3a5c]', badge: 'New Users' },
  { id: 2, title: 'Ramadan Special Offers', subtitle: 'Up to 40% off on selected stores', bg: 'from-[#8B6914] to-[#C8A951]', badge: 'Limited Time' },
  { id: 3, title: 'Taxi Rides from 3 AED', subtitle: 'Book your premium ride now', bg: 'from-[#1a3a5c] to-[#0F2A47]', badge: 'Best Price' },
]

const services = [
  { icon: ShoppingBag, label: 'Marketplace', desc: 'Shop from local stores', href: '/web/marketplace', color: '#0F2A47' },
  { icon: Package, label: 'Delivery', desc: 'Fast food & grocery delivery', href: '/web/delivery', color: '#C8A951' },
  { icon: Car, label: 'Taxi', desc: 'Book premium rides', href: '/web/taxi', color: '#0F2A47' },
]

const categories = [
  { emoji: '🍔', label: 'Restaurants' },
  { emoji: '🛒', label: 'Supermarket' },
  { emoji: '💊', label: 'Pharmacies' },
  { emoji: '💄', label: 'Beauty' },
  { emoji: '📱', label: 'Electronics' },
  { emoji: '🏪', label: 'General Stores' },
]

const featuredStores = [
  { name: 'Baharat Restaurant', category: 'Restaurants', rating: 4.9, time: '20 min', tag: 'Popular', color: '#FFF3E0' },
  { name: 'Burgetino', category: 'Fast Food', rating: 4.9, time: '40 min', tag: 'New', color: '#E8F5E9' },
  { name: 'Al Shifa Pharmacy', category: 'Pharmacy', rating: 4.9, time: '15 min', tag: 'Open 24h', color: '#E3F2FD' },
  { name: 'Fresh Mart', category: 'Supermarket', rating: 4.7, time: '30 min', tag: 'Free Del.', color: '#F3E5F5' },
]

export default function WebHome() {
  const [slide, setSlide] = useState(0)
  const [search, setSearch] = useState('')

  const prev = () => setSlide((slide - 1 + slides.length) % slides.length)
  const next = () => setSlide((slide + 1) % slides.length)

  return (
    <div className="min-h-screen bg-[#F8F6F1]">
      {/* Hero Slider */}
      <div className={`relative bg-gradient-to-r ${slides[slide].bg} text-white overflow-hidden`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center relative z-10">
            {/* Small SUMU logo in hero */}
            <div className="flex justify-center mb-6">
              <SumuLogo size={52} variant="full" />
            </div>
            <span className="inline-block px-3 py-1 bg-[#C8A951]/20 border border-[#C8A951]/40 text-[#C8A951] text-xs font-semibold rounded-full mb-3">
              {slides[slide].badge}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold mb-3 text-white">
              {slides[slide].title}
            </h1>
            <p className="text-white/70 text-lg mb-8">{slides[slide].subtitle}</p>

            {/* Search bar */}
            <div className="max-w-xl mx-auto flex gap-2">
              <div className="flex-1 flex items-center bg-white rounded-xl px-4 py-3 gap-2 shadow-lg">
                <Search size={18} className="text-[#666]" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search stores, products, rides..."
                  className="flex-1 outline-none text-[#222] text-sm bg-transparent"
                />
                <MapPin size={18} className="text-[#C8A951]" />
              </div>
              <button className="bg-[#C8A951] hover:bg-[#b8942f] text-[#0F2A47] font-semibold px-5 py-3 rounded-xl shadow-lg">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Slide controls */}
        <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm">
          <ChevronLeft size={20} className="text-white" />
        </button>
        <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm">
          <ChevronRight size={20} className="text-white" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)}
              className={`rounded-full transition-all ${i === slide ? 'w-6 h-2 bg-[#C8A951]' : 'w-2 h-2 bg-white/40'}`}
            />
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.map(s => (
            <Link key={s.label} to={s.href}
              className="group bg-white rounded-2xl p-6 shadow-sm border border-[#E8E6E1] hover:shadow-md hover:border-[#C8A951]/40 flex items-center gap-4">
              <div className="p-4 rounded-xl" style={{ backgroundColor: s.color + '15' }}>
                <s.icon size={26} style={{ color: s.color }} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[#222]">{s.label}</p>
                <p className="text-sm text-[#666]">{s.desc}</p>
              </div>
              <ArrowRight size={18} className="text-[#C8A951] group-hover:translate-x-1 transition-transform" />
            </Link>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#0F2A47]">Browse Categories</h2>
          <Link to="/web/marketplace" className="text-sm text-[#C8A951] hover:text-[#a88b3a] font-medium flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {categories.map(c => (
            <Link key={c.label} to="/web/marketplace"
              className="bg-white rounded-xl p-4 text-center shadow-sm border border-[#E8E6E1] hover:border-[#C8A951]/40 hover:shadow-md cursor-pointer">
              <div className="text-3xl mb-2">{c.emoji}</div>
              <p className="text-xs font-medium text-[#444]">{c.label}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Stores */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#0F2A47]">Featured Stores</h2>
          <Link to="/web/marketplace" className="text-sm text-[#C8A951] hover:text-[#a88b3a] font-medium flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredStores.map(store => (
            <Link key={store.name} to="/web/store"
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E8E6E1] hover:shadow-md hover:border-[#C8A951]/30 group">
              {/* Store banner */}
              <div className="h-36 flex items-center justify-center relative" style={{ backgroundColor: store.color }}>
                <span className="text-4xl">
                  {store.category === 'Restaurants' || store.category === 'Fast Food' ? '🍽️' :
                   store.category === 'Pharmacy' ? '💊' : '🛒'}
                </span>
                <span className="absolute top-3 left-3 px-2 py-0.5 bg-[#0F2A47] text-white text-xs rounded-full font-medium">
                  {store.tag}
                </span>
              </div>
              <div className="p-4">
                <p className="font-semibold text-[#222] text-sm">{store.name}</p>
                <p className="text-xs text-[#666] mt-0.5">{store.category}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1 text-xs text-[#444]">
                    <Star size={12} className="fill-[#C8A951] text-[#C8A951]" />
                    <span className="font-medium">{store.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[#666]">
                    <Clock size={12} />
                    <span>{store.time}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Active Order Tracking Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-[#0F2A47] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#C8A951]/20 rounded-xl">
              <Zap size={24} className="text-[#C8A951]" />
            </div>
            <div>
              <p className="font-semibold text-white">Order #SUW-2841 is on the way!</p>
              <p className="text-white/60 text-sm mt-0.5">Estimated arrival: 12 minutes</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {['Accepted', 'Preparing', 'On the way', 'Delivered'].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${i <= 2 ? 'bg-[#C8A951]' : 'bg-white/20'}`}></div>
                <span className={`text-xs hidden md:block ${i <= 2 ? 'text-[#C8A951] font-medium' : 'text-white/40'}`}>{step}</span>
                {i < 3 && <div className={`h-px w-6 hidden md:block ${i < 2 ? 'bg-[#C8A951]' : 'bg-white/20'}`}></div>}
              </div>
            ))}
          </div>
          <Link to="/web/orders" className="px-5 py-2.5 bg-[#C8A951] hover:bg-[#b8942f] text-[#0F2A47] font-semibold text-sm rounded-xl whitespace-nowrap">
            Track Order
          </Link>
        </div>
      </div>
    </div>
  )
}
