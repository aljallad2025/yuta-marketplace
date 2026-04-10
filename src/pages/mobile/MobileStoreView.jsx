import { useState } from 'react'
import { ArrowLeft, Star, Clock, Minus, Plus, ShoppingCart, Heart, Search, X } from 'lucide-react'
import { useLang } from '../../i18n/LangContext'
import { useMobile } from '../../store/mobileStore.jsx'

export default function MobileStoreView() {
  const { isAr } = useLang()
  const { viewData, goBack, openCart, addToCart, removeFromCart, getQty, cartCount, cartTotal, wishlist, toggleWishlist } = useMobile()
  const [searchQ, setSearchQ] = useState('')
  const [added, setAdded] = useState(null) // flash feedback

  const { store, products = [] } = viewData || {}
  if (!store) return null

  const filtered = searchQ.trim()
    ? products.filter(p => p.nameAr.includes(searchQ) || p.nameEn.toLowerCase().includes(searchQ.toLowerCase()))
    : products

  const handleAdd = (product) => {
    addToCart(product, store.id)
    setAdded(product.id)
    setTimeout(() => setAdded(null), 800)
  }

  return (
    <div className="bg-[#FBF8F2] min-h-full" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-[#0F2A47] px-4 pt-2 pb-4">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={goBack} className="p-2 bg-white/10 rounded-xl active:bg-white/20">
            <ArrowLeft size={16} className="text-white" style={{ transform: isAr ? 'rotate(180deg)' : undefined }} />
          </button>
          <div className="flex-1">
            <p className="text-white font-black text-sm">{isAr ? store.nameAr : store.nameEn}</p>
          </div>
          <button
            onClick={() => toggleWishlist(store.id)}
            className="p-2 bg-white/10 rounded-xl active:bg-white/20"
          >
            <Heart size={16} className={wishlist.includes(store.id) ? 'fill-red-400 text-red-400' : 'text-white'} />
          </button>
        </div>

        {/* Store info */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0" style={{ backgroundColor: store.bg }}>
            {store.emoji}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-0.5">
                <Star size={10} className="fill-[#C8A951] text-[#C8A951]" />
                <span className="text-[10px] font-bold text-white">{store.rating}</span>
              </div>
              <div className="flex items-center gap-0.5 text-[10px] text-white/60">
                <Clock size={10} />
                <span>{isAr ? store.timeAr : store.time} {isAr ? 'دق' : 'min'}</span>
              </div>
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${store.open ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                {store.open ? (isAr ? 'مفتوح' : 'Open') : (isAr ? 'مغلق' : 'Closed')}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] text-white/50">
                {isAr ? 'حد أدنى:' : 'Min:'} {store.minOrder} {isAr ? 'د' : 'AED'}
              </span>
              <span className="text-[10px] text-white/50">
                {store.deliveryFee === 0 ? (isAr ? 'توصيل مجاني' : 'Free delivery') : `${isAr ? 'توصيل:' : 'Delivery:'} ${store.deliveryFee} ${isAr ? 'د' : 'AED'}`}
              </span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center bg-white rounded-xl px-3 py-2 gap-2">
          <Search size={12} className="text-[#999]" />
          <input
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            placeholder={isAr ? 'ابحث في المنيو...' : 'Search menu...'}
            className="flex-1 outline-none text-xs text-[#222] bg-transparent"
            dir={isAr ? 'rtl' : 'ltr'}
          />
          {searchQ && <button onClick={() => setSearchQ('')}><X size={12} className="text-[#999]" /></button>}
        </div>
      </div>

      {/* Products */}
      <div className="p-3 space-y-2 pb-28">
        <p className="text-xs font-black text-[#0F2A47] mb-1">{isAr ? 'القائمة' : 'Menu'} ({filtered.length})</p>
        {filtered.map(product => {
          const qty = getQty(product.id)
          const isAdding = added === product.id
          return (
            <div key={product.id} className="bg-white rounded-2xl p-3 shadow-sm border border-[#E8E4DC] flex items-center gap-3">
              <div className="w-14 h-14 bg-[#FBF8F2] rounded-xl flex items-center justify-center text-2xl flex-shrink-0 border border-[#F0ECE4]">
                {product.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-[#222] text-xs">{isAr ? product.nameAr : product.nameEn}</p>
                <p className="text-[10px] text-[#999] mt-0.5 truncate">{product.desc}</p>
                <p className="font-black text-[#0F2A47] text-sm mt-1">{product.price} <span className="text-[10px] text-[#999]">{isAr ? 'درهم' : 'AED'}</span></p>
              </div>
              <div className="flex-shrink-0">
                {qty === 0 ? (
                  <button
                    onClick={() => handleAdd(product)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isAdding ? 'bg-emerald-500 scale-110' : 'bg-[#0F2A47] active:scale-95'}`}
                  >
                    <Plus size={14} className="text-white" />
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="w-7 h-7 bg-[#F0ECE4] rounded-full flex items-center justify-center active:bg-[#E8E4DC]"
                    >
                      <Minus size={12} className="text-[#0F2A47]" />
                    </button>
                    <span className="font-black text-[#0F2A47] text-sm w-4 text-center">{qty}</span>
                    <button
                      onClick={() => handleAdd(product)}
                      className="w-7 h-7 bg-[#0F2A47] rounded-full flex items-center justify-center active:scale-95"
                    >
                      <Plus size={12} className="text-white" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Cart Floating Button */}
      {cartCount > 0 && (
        <button
          onClick={openCart}
          className="fixed bottom-20 start-3 end-3 bg-[#0F2A47] text-white rounded-2xl py-3.5 flex items-center justify-between px-4 shadow-2xl active:opacity-90 z-30"
          dir={isAr ? 'rtl' : 'ltr'}
        >
          <div className="flex items-center gap-2">
            <div className="bg-[#C8A951] text-[#0F2A47] font-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </div>
            <span className="font-black text-sm">{isAr ? 'عرض السلة' : 'View Cart'}</span>
          </div>
          <span className="font-black text-[#C8A951]">{cartTotal} {isAr ? 'د' : 'AED'}</span>
        </button>
      )}
    </div>
  )
}
