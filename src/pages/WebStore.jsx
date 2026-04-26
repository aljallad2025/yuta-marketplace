import { useState, useEffect } from 'react'
import { ArrowLeft, Star, Clock, ShoppingCart, Plus, Minus, Search, X, ChevronRight } from 'lucide-react'
import { useLang } from '../i18n/LangContext'
import { useNavigate, useLocation } from 'react-router-dom'

function getL(lang, en, th, lo, vi) {
  if (lang === 'th') return th || en
  if (lang === 'lo') return lo || en
  if (lang === 'vi') return vi || en
  return en
}


export default function WebStore() {
  const { isAr, lang } = useLang()
  const navigate = useNavigate()
  const location = useLocation()
  const storeId = new URLSearchParams(location.search).get('id')

  const [store, setStore] = useState(null)
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState({})
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [qty, setQty] = useState(1)
  const [options, setOptions] = useState([])
  const [selectedOpts, setSelectedOpts] = useState({})

  useEffect(() => {
    if (!storeId) { navigate("/web"); return }
    Promise.all([
      fetch('/api/stores/' + storeId).then(r => r.json()),
      fetch('/api/products?store_id=' + storeId).then(r => r.json())
    ]).then(([s, p]) => {
      setStore(s)
      setProducts(Array.isArray(p) ? p : [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [storeId])

  const add = (id, n = 1) => setCart(c => ({ ...c, [id]: (c[id] || 0) + n }))
  const remove = (id) => setCart(c => ({ ...c, [id]: Math.max(0, (c[id] || 0) - 1) }))
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0)
  const cartTotal = Object.entries(cart).reduce((acc, [id, q]) => acc + (products.find(p => p.id === +id)?.price || 0) * q, 0)

  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))]
  const filtered = products.filter(p => {
    const matchCat = activeTab === 'all' || p.category === activeTab
    const matchSearch = (isAr ? p.name_ar : p.name_en)?.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch && p.is_active
  })

  const openProduct = (p) => {
    setSelected(p)
    setQty(cart[p.id] || 1)
    setSelectedOpts({})
    fetch('/api/options?product_id=' + p.id).then(r => r.json()).then(setOptions).catch(() => setOptions([]))
  }
  const closeProduct = () => { setSelected(null); setOptions([]) }

  const addToCartFromModal = () => {
    setCart(c => ({ ...c, [selected.id]: qty }))
    closeProduct()
  }

  const goCheckout = () => {
    const items = Object.entries(cart).map(([id, q]) => {
      const p = products.find(x => x.id === +id)
      return { id, qty: q, nameAr: p?.name_ar, nameEn: p?.name_en, price: p?.price, storeId }
    }).filter(i => i.qty > 0)
    localStorage.setItem('web_cart', JSON.stringify({ items, store }))
    navigate('/web/checkout')
  }

  const backPath = { restaurant: '/web/restaurants', supermarket: '/web/supermarket', pharmacy: '/web/pharmacy' }

  if (loading) return <div className="min-h-screen bg-[#F0F9F8] flex items-center justify-center"><div className="w-10 h-10 border-4 border-[#00C9A7] border-t-transparent rounded-full animate-spin" /></div>
  if (!store) return <div className="min-h-screen bg-[#F0F9F8] flex flex-col items-center justify-center gap-4"><p className="text-gray-400">{isAr ? 'المتجر غير موجود' : 'Store not found'}</p><button onClick={() => navigate(-1)} className="text-[#00C9A7] font-bold">{isAr ? 'رجوع' : 'Go back'}</button></div>

  return (
    <div className="min-h-screen bg-[#F0F9F8] pb-28" dir={isAr ? 'rtl' : 'ltr'}>

      {/* HERO */}
      <div className="relative h-56 overflow-hidden">
        {store.cover_image
          ? <img src={store.cover_image} className="w-full h-full object-cover" />
          : <div className="w-full h-full bg-gradient-to-br from-[#0D1B4B] to-[#0A3D8F] flex items-center justify-center text-8xl opacity-20">{store.logo}</div>}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B4B] via-[#0D1B4B]/40 to-transparent" />
        <button onClick={() => navigate(backPath[store.category] || -1)}
          className="absolute top-4 start-4 w-9 h-9 bg-white/90 backdrop-blur rounded-xl flex items-center justify-center shadow">
          <ArrowLeft size={18} className="text-[#0D1B4B]" style={{ transform: isAr ? 'rotate(180deg)' : undefined }} />
        </button>
        <div className="absolute bottom-4 start-4 end-4 flex items-end gap-3">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-lg flex-shrink-0 overflow-hidden">
            {store.logo?.startsWith('/') || store.logo?.startsWith('http') ? <img src={store.logo} className="w-full h-full object-cover" /> : store.logo || '🏪'}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-black text-white leading-tight">{isAr ? store.name_ar : store.name_en}</h1>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="flex items-center gap-1 text-white/80 text-xs"><Star size={10} className="fill-[#00C9A7] text-[#00C9A7]" />{store.rating || '4.5'} ({store.rating_count || 0})</span>
              <span className="flex items-center gap-1 text-white/80 text-xs"><Clock size={10} />{store.delivery_time || '30'} {isAr ? 'دق' : 'min'}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${store.is_open ? 'bg-green-500/25 text-green-300' : 'bg-red-500/25 text-red-300'}`}>
                {store.is_open ? (getL(lang,'Open','เปิด','ເປີດ','Mở cửa')) : (getL(lang,'Closed','ปิด','ປິດ','Đóng cửa'))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* INFO BAR */}
      <div className="bg-white border-b border-[#D0EDEA] px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between text-xs text-gray-500">
          <span>{isAr ? 'حد أدنى:' : 'Min:'} <b className="text-[#0D1B4B]">{store.min_order} {getL(lang,'SAR','บาท','ກີບ','VND')}</b></span>
          <span>{isAr ? 'التوصيل:' : 'Delivery:'} <b className="text-[#0D1B4B]">{store.delivery_fee === 0 ? (isAr ? 'مجاني' : 'Free') : store.delivery_fee + (isAr ? ' ريال' : ' SAR')}</b></span>
          <span>{isAr ? 'الأقسام:' : 'Sections:'} <b className="text-[#0D1B4B]">{categories.length - 1}</b></span>
        </div>
      </div>

      {/* SEARCH */}
      <div className="sticky top-0 z-10 bg-[#F0F9F8]/95 backdrop-blur px-4 py-3 border-b border-[#D0EDEA]/50">
        <div className="max-w-3xl mx-auto flex items-center bg-white rounded-xl px-4 py-2.5 gap-2 shadow-sm">
          <Search size={15} className="text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={isAr ? 'ابحث في القائمة...' : 'Search menu...'}
            className="flex-1 outline-none text-sm bg-transparent" />
        </div>
      </div>

      {/* TABS */}
      {categories.length > 1 && (
        <div className="bg-white border-b border-[#D0EDEA] sticky top-[57px] z-10">
          <div className="max-w-3xl mx-auto flex gap-1 px-4 py-2 overflow-x-auto">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveTab(cat)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-black transition flex-shrink-0 ${activeTab === cat ? 'bg-[#0D1B4B] text-white' : 'bg-[#F0F9F8] text-gray-500'}`}>
                {cat === 'all' ? (getL(lang,'All','ทั้งหมด','ທັງໝົດ','Tất cả')) : cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PRODUCTS LIST */}
      <div className="max-w-3xl mx-auto px-4 py-5">
        {filtered.length === 0
          ? <div className="text-center py-20 text-gray-400">{isAr ? 'لا توجد منتجات' : 'No products'}</div>
          : <div className="space-y-3">
              {filtered.map(p => (
                <button key={p.id} onClick={() => openProduct(p)}
                  className="w-full bg-white rounded-2xl border border-[#D0EDEA] overflow-hidden flex items-stretch hover:shadow-md transition text-start">
                  <div className="w-28 h-28 bg-[#F0F9F8] flex-shrink-0 flex items-center justify-center text-4xl overflow-hidden">
                    {p.image_url ? <img src={p.image_url} className="w-full h-full object-cover" /> : p.emoji || '🛍️'}
                  </div>
                  <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-black text-[#0D1B4B] text-sm">{isAr ? p.name_ar : p.name_en}</h3>
                        {p.category && <span className="text-xs bg-[#F0F9F8] text-gray-400 px-2 py-0.5 rounded-full flex-shrink-0">{p.category}</span>}
                      </div>
                      {p.description && <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{p.description}</p>}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[#00C9A7] font-black">{p.price} <span className="text-xs">{getL(lang,'SAR','บาท','ກີບ','VND')}</span></span>
                      <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                        {cart[p.id] ? (
                          <div className="flex items-center gap-2 bg-[#0D1B4B] rounded-xl px-2 py-1">
                            <button onClick={() => remove(p.id)} className="text-white w-5 h-5 flex items-center justify-center"><Minus size={12} /></button>
                            <span className="text-white font-black text-sm w-4 text-center">{cart[p.id]}</span>
                            <button onClick={() => add(p.id)} className="text-white w-5 h-5 flex items-center justify-center"><Plus size={12} /></button>
                          </div>
                        ) : (
                          <button onClick={() => add(p.id)} className="w-8 h-8 bg-[#00C9A7] rounded-xl flex items-center justify-center shadow-sm">
                            <Plus size={16} className="text-white" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>}
      </div>

      {/* CART BAR */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md z-50">
          <button onClick={goCheckout} className="w-full bg-[#0D1B4B] rounded-2xl px-5 py-4 flex items-center justify-between shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#00C9A7] rounded-lg flex items-center justify-center relative">
                <ShoppingCart size={15} className="text-white" />
                <span className="absolute -top-1.5 -end-1.5 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] font-black flex items-center justify-center">{cartCount}</span>
              </div>
              <span className="text-white font-black text-sm">{cartCount} {isAr ? 'منتج' : 'items'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#00C9A7] font-black">{cartTotal} {getL(lang,'SAR','บาท','ກີບ','VND')}</span>
              <span className="text-white/60 text-xs">{isAr ? '← اطلب' : 'Order →'}</span>
            </div>
          </button>
        </div>
      )}

      {/* PRODUCT DETAIL MODAL */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={closeProduct}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-t-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>

            {/* Product Image */}
            <div className="relative h-56 bg-[#F0F9F8] flex items-center justify-center text-8xl overflow-hidden rounded-t-3xl">
              {selected.image_url
                ? <img src={selected.image_url} className="w-full h-full object-cover" />
                : <span>{selected.emoji || '🛍️'}</span>}
              <button onClick={closeProduct}
                className="absolute top-4 end-4 w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow">
                <X size={18} className="text-[#0D1B4B]" />
              </button>
              {selected.category && (
                <span className="absolute bottom-4 start-4 bg-white/90 text-[#0D1B4B] text-xs font-black px-3 py-1 rounded-full">
                  {selected.category}
                </span>
              )}
            </div>

            {/* Product Info */}
            <div className="p-5">
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-xl font-black text-[#0D1B4B] flex-1">{isAr ? selected.name_ar : selected.name_en}</h2>
                <span className="text-2xl font-black text-[#00C9A7] ms-3">{selected.price} <span className="text-sm">{getL(lang,'SAR','บาท','ກີບ','VND')}</span></span>
              </div>

              {selected.description && (
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{selected.description}</p>
              )}

              {/* Extra info based on store type */}
              {store.category === 'pharmacy' && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-4">
                  <p className="text-xs font-black text-orange-700">
                    {selected.requires_prescription
                      ? (isAr ? '⚠️ يحتاج وصفة طبية' : '⚠️ Requires prescription')
                      : (isAr ? '✅ لا يحتاج وصفة طبية' : '✅ No prescription needed')}
                  </p>
                  {selected.generic_name && <p className="text-xs text-orange-600 mt-1">{isAr ? 'الاسم العلمي:' : 'Generic:'} {selected.generic_name}</p>}
                </div>
              )}

              {selected.stock > 0 && selected.stock < 10 && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-4">
                  <p className="text-xs font-black text-red-600">{isAr ? `⚡ آخر ${selected.stock} قطع فقط!` : `⚡ Only ${selected.stock} left!`}</p>
                </div>
              )}

              {/* Qty Selector */}
              <div className="flex items-center justify-between bg-[#F0F9F8] rounded-2xl p-4 mb-5">
                <span className="font-black text-[#0D1B4B] text-sm">{isAr ? 'الكمية' : 'Quantity'}</span>
                <div className="flex items-center gap-4">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-9 h-9 bg-white border border-[#D0EDEA] rounded-xl flex items-center justify-center shadow-sm">
                    <Minus size={14} className="text-[#0D1B4B]" />
                  </button>
                  <span className="font-black text-[#0D1B4B] text-lg w-6 text-center">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)}
                    className="w-9 h-9 bg-[#0D1B4B] rounded-xl flex items-center justify-center shadow-sm">
                    <Plus size={14} className="text-white" />
                  </button>
                </div>
              </div>

              {/* Add to cart button */}
              <button onClick={addToCartFromModal}
                className="w-full bg-[#0D1B4B] text-white font-black py-4 rounded-2xl flex items-center justify-between px-5 shadow-lg">
                <span className="flex items-center gap-2"><ShoppingCart size={18} />{isAr ? 'أضف للسلة' : 'Add to Cart'}</span>
                <span className="text-[#00C9A7]">{selected.price * qty} {getL(lang,'SAR','บาท','ກີບ','VND')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
