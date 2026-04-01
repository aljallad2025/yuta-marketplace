import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Star, Clock, ShoppingCart, Plus, Minus, Heart, Search, ChevronDown } from 'lucide-react'

const menuCategories = ['All', 'Starters', 'Mains', 'Grills', 'Sides', 'Drinks', 'Desserts']

const products = [
  { id: 1, name: 'Mixed Grill Platter', desc: 'Premium mix of grilled meats with Arabic bread', price: 89, category: 'Grills', emoji: '🥩', popular: true },
  { id: 2, name: 'Lamb Ouzi', desc: 'Slow-cooked tender lamb on saffron rice', price: 75, category: 'Mains', emoji: '🍚', popular: true },
  { id: 3, name: 'Hummus & Bread', desc: 'Creamy hummus with warm Arabic bread', price: 18, category: 'Starters', emoji: '🫘', popular: false },
  { id: 4, name: 'Chicken Shawarma', desc: 'Marinated chicken with garlic sauce & pickles', price: 32, category: 'Mains', emoji: '🌯', popular: true },
  { id: 5, name: 'Fresh Juice', desc: 'Seasonal fresh-pressed fruits', price: 22, category: 'Drinks', emoji: '🥤', popular: false },
  { id: 6, name: 'Fattoush Salad', desc: 'Fresh vegetables with crispy bread, lemon dressing', price: 24, category: 'Starters', emoji: '🥗', popular: false },
  { id: 7, name: 'Kunafa', desc: 'Traditional cheese pastry in sweet syrup', price: 28, category: 'Desserts', emoji: '🍮', popular: true },
  { id: 8, name: 'Arabic Coffee', desc: 'Saffron-infused qahwa with dates', price: 15, category: 'Drinks', emoji: '☕', popular: false },
]

export default function WebStore() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [cart, setCart] = useState({})
  const [search, setSearch] = useState('')

  const addToCart = (id) => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }))
  const removeFromCart = (id) => setCart(c => { const n = { ...c }; if (n[id] > 1) n[id]--; else delete n[id]; return n })
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0)
  const cartTotal = Object.entries(cart).reduce((acc, [id, qty]) => acc + (products.find(p => p.id === +id)?.price || 0) * qty, 0)

  const filtered = products.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="min-h-screen bg-[#F8F6F1]">
      {/* Store Banner */}
      <div className="relative bg-[#FFF3E0] h-52 flex items-center justify-center overflow-hidden">
        <span className="text-8xl opacity-60">🍽️</span>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F2A47]/70 to-transparent"></div>
        <Link to="/web/marketplace" className="absolute top-4 left-4 p-2 bg-white/90 rounded-lg shadow-sm">
          <ArrowLeft size={18} className="text-[#0F2A47]" />
        </Link>
        <button className="absolute top-4 right-4 p-2 bg-white/90 rounded-lg shadow-sm">
          <Heart size={18} className="text-[#666]" />
        </button>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Baharat Restaurant</h1>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1 text-xs text-white/80">
                  <Star size={12} className="fill-[#C8A951] text-[#C8A951]" />
                  <span className="font-semibold">4.9</span>
                  <span>(284 reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-white/80">
                  <Clock size={12} />
                  <span>20–30 min</span>
                </div>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full">Open</span>
          </div>
        </div>
      </div>

      {/* Store info strip */}
      <div className="bg-white border-b border-[#E8E6E1] px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-sm text-[#666]">
          <span>Min. order: <strong className="text-[#222]">15 AED</strong></span>
          <span>Delivery: <strong className="text-emerald-600">Free</strong></span>
          <span>Category: <strong className="text-[#222]">Restaurants</strong></span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Search */}
        <div className="flex items-center bg-white rounded-xl px-4 py-3 gap-2 shadow-sm border border-[#E8E6E1] mb-5">
          <Search size={16} className="text-[#666]" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search menu..." className="flex-1 outline-none text-sm bg-transparent text-[#222]" />
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-5">
          {menuCategories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat ? 'bg-[#0F2A47] text-white' : 'bg-white text-[#444] border border-[#E8E6E1] hover:border-[#C8A951]/40'
              }`}
            >{cat}</button>
          ))}
        </div>

        {/* Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(product => (
            <div key={product.id} className="bg-white rounded-xl p-4 shadow-sm border border-[#E8E6E1] flex gap-4">
              <div className="w-20 h-20 rounded-xl bg-[#F8F6F1] flex items-center justify-center text-3xl flex-shrink-0">
                {product.emoji}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-[#222] text-sm">{product.name}</p>
                      {product.popular && <span className="px-1.5 py-0.5 bg-[#C8A951]/15 text-[#a88b3a] text-xs rounded font-medium">Popular</span>}
                    </div>
                    <p className="text-xs text-[#666] mt-0.5 leading-relaxed">{product.desc}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-bold text-[#0F2A47]">{product.price} AED</span>
                  {cart[product.id] ? (
                    <div className="flex items-center gap-2">
                      <button onClick={() => removeFromCart(product.id)}
                        className="w-7 h-7 rounded-full bg-[#0F2A47] text-white flex items-center justify-center">
                        <Minus size={12} />
                      </button>
                      <span className="font-semibold text-[#222] w-4 text-center text-sm">{cart[product.id]}</span>
                      <button onClick={() => addToCart(product.id)}
                        className="w-7 h-7 rounded-full bg-[#0F2A47] text-white flex items-center justify-center">
                        <Plus size={12} />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => addToCart(product.id)}
                      className="w-7 h-7 rounded-full bg-[#0F2A47] text-white flex items-center justify-center shadow-sm hover:bg-[#1a3a5c]">
                      <Plus size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Cart */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
          <Link to="/web/checkout">
            <div className="bg-[#0F2A47] rounded-2xl px-5 py-4 flex items-center justify-between shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#C8A951] rounded-lg flex items-center justify-center">
                  <ShoppingCart size={15} className="text-[#0F2A47]" />
                </div>
                <span className="text-white font-medium text-sm">{cartCount} item{cartCount > 1 ? 's' : ''} in cart</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#C8A951] font-bold">{cartTotal} AED</span>
                <span className="text-white/70 text-sm">View →</span>
              </div>
            </div>
          </Link>
        </div>
      )}
    </div>
  )
}
