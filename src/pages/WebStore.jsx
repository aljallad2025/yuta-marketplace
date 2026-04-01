import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Star, Clock, ShoppingCart, Plus, Minus, Heart, Search } from 'lucide-react'
import { useLang } from '../i18n/LangContext'

const products = [
  { id: 1, nameEn: 'Mixed Grill Platter', nameAr: 'طبق المشاوي المشكلة', descEn: 'Premium mix of grilled meats with Arabic bread', descAr: 'مشاوي فاخرة مشكلة مع خبز عربي', price: 89, catKey: 'Grills', emoji: '🥩', popular: true },
  { id: 2, nameEn: 'Lamb Ouzi', nameAr: 'لحم أوزي', descEn: 'Slow-cooked tender lamb on saffron rice', descAr: 'لحم خروف طري مطبوخ على رز بالزعفران', price: 75, catKey: 'Mains', emoji: '🍚', popular: true },
  { id: 3, nameEn: 'Hummus & Bread', nameAr: 'حمص وخبز', descEn: 'Creamy hummus with warm Arabic bread', descAr: 'حمص كريمي مع خبز عربي ساخن', price: 18, catKey: 'Starters', emoji: '🫘', popular: false },
  { id: 4, nameEn: 'Chicken Shawarma', nameAr: 'شاورما دجاج', descEn: 'Marinated chicken with garlic sauce & pickles', descAr: 'دجاج متبل مع صلصة ثوم ومخللات', price: 32, catKey: 'Mains', emoji: '🌯', popular: true },
  { id: 5, nameEn: 'Fresh Juice', nameAr: 'عصير طازج', descEn: 'Seasonal fresh-pressed fruits', descAr: 'عصير فواكه طازج موسمي', price: 22, catKey: 'Drinks', emoji: '🥤', popular: false },
  { id: 6, nameEn: 'Fattoush Salad', nameAr: 'سلطة فتوش', descEn: 'Fresh vegetables with crispy bread, lemon dressing', descAr: 'خضروات طازجة مع خبز مقرمش وتتبيلة ليمون', price: 24, catKey: 'Starters', emoji: '🥗', popular: false },
  { id: 7, nameEn: 'Kunafa', nameAr: 'كنافة', descEn: 'Traditional cheese pastry in sweet syrup', descAr: 'حلوى الكنافة التقليدية بالجبن والقطر', price: 28, catKey: 'Desserts', emoji: '🍮', popular: true },
  { id: 8, nameEn: 'Arabic Coffee', nameAr: 'قهوة عربية', descEn: 'Saffron-infused qahwa with dates', descAr: 'قهوة عربية بالزعفران مع تمر', price: 15, catKey: 'Drinks', emoji: '☕', popular: false },
]

const catKeys =  ['all',   'Starters', 'Mains',         'Grills',  'Drinks',    'Desserts']
const catLabEn = ['All',   'Starters', 'Mains',         'Grills',  'Drinks',    'Desserts']
const catLabAr = ['الكل',  'مقبلات',   'أطباق رئيسية', 'مشاوي',   'مشروبات',   'حلويات']

export default function WebStore() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [cart, setCart] = useState({})
  const [search, setSearch] = useState('')
  const { t, isAr } = useLang()

  const addToCart = (id) => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }))
  const removeFromCart = (id) => setCart(c => { const n = { ...c }; if (n[id] > 1) n[id]--; else delete n[id]; return n })
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0)
  const cartTotal = Object.entries(cart).reduce((acc, [id, qty]) => acc + (products.find(p => p.id === +id)?.price || 0) * qty, 0)

  const filtered = products.filter(p => {
    const matchCat = activeCategory === 'all' || p.catKey === activeCategory
    const matchSearch = (isAr ? p.nameAr : p.nameEn).toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="min-h-screen bg-[#FBF8F2]" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="relative bg-[#FFF3E0] h-52 flex items-center justify-center overflow-hidden">
        <span className="text-8xl opacity-60">🍽️</span>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F2A47]/70 to-transparent"></div>
        <Link to="/web/marketplace" className="absolute top-4 start-4 p-2 bg-white/90 rounded-lg shadow-sm">
          <ArrowLeft size={18} className="text-[#0F2A47]" style={{ transform: isAr ? 'rotate(180deg)' : undefined }} />
        </Link>
        <button className="absolute top-4 end-4 p-2 bg-white/90 rounded-lg shadow-sm">
          <Heart size={18} className="text-[#666]" />
        </button>
        <div className="absolute bottom-4 start-4 end-4">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-black text-white">{isAr ? 'مطعم بهارات' : 'Baharat Restaurant'}</h1>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1 text-xs text-white/80">
                  <Star size={12} className="fill-[#C8A951] text-[#C8A951]" />
                  <span className="font-black">4.9</span>
                  <span>({isAr ? '٢٨٤ تقييم' : '284 reviews'})</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-white/80">
                  <Clock size={12} />
                  <span>{isAr ? '٢٠–٣٠ دق' : '20–30 min'}</span>
                </div>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-black rounded-full">{t('open')}</span>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-[#E8E4DC] px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-sm text-[#666]">
          <span>{t('minOrder')}: <strong className="text-[#222]">15 {isAr ? 'درهم' : 'AED'}</strong></span>
          <span>{t('deliveryFee')}: <strong className="text-emerald-600">{isAr ? 'مجاني' : 'Free'}</strong></span>
          <span>{t('categories')}: <strong className="text-[#222]">{isAr ? 'المطاعم' : 'Restaurants'}</strong></span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center bg-white rounded-xl px-4 py-3 gap-2 shadow-sm border border-[#E8E4DC] mb-5">
          <Search size={16} className="text-[#666]" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder={isAr ? 'ابحث في القائمة...' : 'Search menu...'}
            className="flex-1 outline-none text-sm bg-transparent text-[#222]"
            dir={isAr ? 'rtl' : 'ltr'} />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-3 mb-5">
          {catKeys.map((key, i) => (
            <button key={key} onClick={() => setActiveCategory(key)}
              className={`px-4 py-2 rounded-full text-sm font-black whitespace-nowrap transition-all ${
                activeCategory === key ? 'bg-[#0F2A47] text-white' : 'bg-white text-[#444] border border-[#E8E4DC] hover:border-[#C8A951]/40'
              }`}
            >{isAr ? catLabAr[i] : catLabEn[i]}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(product => (
            <div key={product.id} className="bg-white rounded-2xl p-4 shadow-sm border border-[#E8E4DC] flex gap-4">
              <div className="w-20 h-20 rounded-xl bg-[#FBF8F2] flex items-center justify-center text-3xl flex-shrink-0">
                {product.emoji}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="font-black text-[#222] text-sm">{isAr ? product.nameAr : product.nameEn}</p>
                  {product.popular && (
                    <span className="px-1.5 py-0.5 bg-[#C8A951]/15 text-[#a88b3a] text-xs rounded font-black">
                      {isAr ? 'الأكثر طلباً' : 'Popular'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#666] leading-relaxed">{isAr ? product.descAr : product.descEn}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-black text-[#0F2A47]">{product.price} {isAr ? 'درهم' : 'AED'}</span>
                  {cart[product.id] ? (
                    <div className="flex items-center gap-2">
                      <button onClick={() => removeFromCart(product.id)}
                        className="w-7 h-7 rounded-full bg-[#0F2A47] text-white flex items-center justify-center">
                        <Minus size={12} />
                      </button>
                      <span className="font-black text-[#222] w-4 text-center text-sm">{cart[product.id]}</span>
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

      {cartCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
          <Link to="/web/checkout">
            <div className="bg-[#0F2A47] rounded-2xl px-5 py-4 flex items-center justify-between shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#C8A951] rounded-lg flex items-center justify-center">
                  <ShoppingCart size={15} className="text-[#0F2A47]" />
                </div>
                <span className="text-white font-black text-sm">
                  {isAr ? `${cartCount} عنصر في السلة` : `${cartCount} item${cartCount > 1 ? 's' : ''} in cart`}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#C8A951] font-black">{cartTotal} {isAr ? 'د' : 'AED'}</span>
                <span className="text-white/70 text-sm">{isAr ? '← عرض' : 'View →'}</span>
              </div>
            </div>
          </Link>
        </div>
      )}
    </div>
  )
}
