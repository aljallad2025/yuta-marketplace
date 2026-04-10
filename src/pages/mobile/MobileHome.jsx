import { useState, useEffect } from 'react'
import { Search, Bell, MapPin, Star, Clock, Zap, Heart, X, ChevronRight } from 'lucide-react'
import { useLang } from '../../i18n/LangContext'
import { useMobile } from '../../store/mobileStore.jsx'

const slides = [
  { key: 'exclusiveOffers', sub: 'حتى 40% على متاجر مختارة', bg: 'from-[#8B6914] to-[#C8A951]' },
  { key: 'freeDelivery',    sub: 'على أول طلب',               bg: 'from-[#0F2A47] to-[#1a3a5c]' },
  { key: 'taxiFrom',        sub: 'احجز رحلتك الآن',           bg: 'from-[#1a3a5c] to-[#0F2A47]', tab: 'taxi' },
]

export default function MobileHome() {
  const [slide, setSlide] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const { t, isAr } = useLang()
  const {
    stores, categories, orders,
    openStore, setActiveTab,
    wishlist, toggleWishlist,
    setNotifOpen, unreadNotifs,
    notifications, markAllRead, notifOpen,
  } = useMobile()

  useEffect(() => {
    const timer = setInterval(() => setSlide(s => (s + 1) % slides.length), 4000)
    return () => clearInterval(timer)
  }, [])

  const activeOrder = orders.find(o => ['preparing', 'on_the_way', 'pending'].includes(o.status))
  const featuredStores = stores.filter(s => s.open).slice(0, 4)
  const topCategories = categories.slice(0, 8)
  const searchResults = searchQuery.trim().length > 1
    ? stores.filter(s => {
        const q = searchQuery.toLowerCase()
        return (s.nameAr || '').includes(q) || (s.nameEn || '').toLowerCase().includes(q)
      })
    : []

  return (
    <div className="bg-[#FBF8F2] min-h-full" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-[#0F2A47] px-4 pt-2 pb-4 relative z-20">
        <div className="flex items-center justify-between mb-2">
          <button className="flex items-center gap-1 text-white/60 text-xs active:opacity-70">
            <MapPin size={11} className="text-[#C8A951]" />
            <span>{isAr ? 'دبي مارينا' : 'Dubai Marina'}</span>
            <ChevronRight size={10} className="text-[#C8A951]" />
          </button>
          <img src="/sumu-logo.png" alt="SUMU" className="w-8 h-8 rounded-lg object-cover" />
          <button
            onClick={() => setNotifOpen(true)}
            className="relative p-1.5 bg-white/10 rounded-lg active:bg-white/20"
          >
            <Bell size={14} className="text-white" />
            {unreadNotifs > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#C8A951] rounded-full text-[7px] font-black text-[#0F2A47] flex items-center justify-center">
                {unreadNotifs}
              </span>
            )}
          </button>
        </div>
        {/* Search */}
        <div className="flex items-center bg-white rounded-xl px-3 py-2.5 gap-2">
          <Search size={13} className="text-[#999] flex-shrink-0" />
          <input
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setShowSearch(true) }}
            onFocus={() => setShowSearch(true)}
            placeholder={isAr ? 'ابحث عن متجر أو منتج...' : 'Search stores or products...'}
            className="flex-1 outline-none text-xs text-[#222] bg-transparent"
            dir={isAr ? 'rtl' : 'ltr'}
          />
          {searchQuery ? (
            <button onClick={() => { setSearchQuery(''); setShowSearch(false) }}>
              <X size={12} className="text-[#999]" />
            </button>
          ) : null}
        </div>

        {/* Search Dropdown */}
        {showSearch && searchQuery.trim().length > 1 && (
          <div className="absolute start-3 end-3 top-full mt-1 bg-white rounded-2xl shadow-xl z-50 border border-[#E8E4DC] overflow-hidden">
            {searchResults.length === 0 ? (
              <p className="p-4 text-xs text-[#999] text-center">{isAr ? 'لا نتائج' : 'No results'}</p>
            ) : searchResults.map(store => (
              <button
                key={store.id}
                onClick={() => { openStore(store); setShowSearch(false); setSearchQuery('') }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#FBF8F2] border-b border-[#F0ECE4] last:border-0 active:bg-[#F0ECE4]"
              >
                <span className="text-xl">{store.emoji}</span>
                <span className="text-xs font-bold text-[#222]">{isAr ? store.nameAr : store.nameEn}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {showSearch && searchQuery.trim().length > 1 && (
        <div className="fixed inset-0 z-10" onClick={() => setShowSearch(false)} />
      )}

      {/* Hero Slider */}
      <button
        className={`relative bg-gradient-to-r ${slides[slide].bg} mx-3 mt-3 rounded-2xl overflow-hidden w-[calc(100%-24px)] active:opacity-90 text-start`}
        style={{ minHeight: 110 }}
        onClick={() => slides[slide].tab ? setActiveTab(slides[slide].tab) : setActiveTab('stores')}
      >
        <div className="p-4 flex items-center gap-3">
          <img src="/sumu-logo.png" alt="SUMU" className="w-12 h-12 rounded-xl object-cover shadow-md flex-shrink-0" />
          <div className="flex-1">
            <p className="text-white font-black text-sm">{t(slides[slide].key)}</p>
            <p className="text-white/60 text-[10px] mt-0.5">{slides[slide].sub}</p>
            <span className="mt-2 inline-block px-3 py-1.5 bg-[#C8A951] text-[#0F2A47] font-bold text-xs rounded-full">
              {t('browseNow')} →
            </span>
          </div>
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={e => { e.stopPropagation(); setSlide(i) }}
              className={`rounded-full transition-all ${i === slide ? 'w-4 h-1.5 bg-[#C8A951]' : 'w-1.5 h-1.5 bg-white/40'}`}
            />
          ))}
        </div>
      </button>

      {/* Active Order Banner */}
      {activeOrder && (
        <button
          onClick={() => setActiveTab('orders')}
          className="mx-3 mt-3 w-[calc(100%-24px)] bg-[#0F2A47] rounded-xl p-3 flex items-center gap-3 active:opacity-80"
        >
          <div className="p-2 bg-[#C8A951]/20 rounded-lg">
            <Zap size={14} className="text-[#C8A951]" />
          </div>
          <div className="flex-1 text-start">
            <p className="text-white text-xs font-black">{isAr ? 'طلبك في الطريق!' : 'Order on the way!'}</p>
            <p className="text-white/50 text-[10px]">~{activeOrder.eta} {isAr ? 'دقيقة' : 'min'} · #{activeOrder.id}</p>
          </div>
          <span className="text-[#C8A951] text-xs font-bold">{isAr ? 'تتبع ←' : '→ Track'}</span>
        </button>
      )}

      {/* Categories */}
      <div className="px-3 mt-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-black text-[#0F2A47]">{t('browseCategories')}</p>
          <button onClick={() => setActiveTab('stores')} className="text-xs text-[#C8A951] font-bold active:opacity-70">
            {t('seeAll')}
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {topCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveTab('stores')}
              className="bg-white rounded-xl p-2 text-center shadow-sm border border-[#E8E4DC] active:bg-[#FBF8F2] active:border-[#C8A951]/40 transition-all"
            >
              <div className="text-xl mb-1">{cat.emoji}</div>
              <p className="text-[9px] font-bold text-[#0F2A47] leading-tight">{isAr ? cat.labelAr : cat.labelEn}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Stores */}
      <div className="px-3 mt-4 pb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-black text-[#0F2A47]">{t('featuredStores')}</p>
          <button onClick={() => setActiveTab('stores')} className="text-xs text-[#C8A951] font-bold active:opacity-70">
            {t('viewAll')}
          </button>
        </div>
        <div className="space-y-2">
          {featuredStores.map(store => (
            <button
              key={store.id}
              onClick={() => openStore(store)}
              className="w-full bg-white rounded-xl overflow-hidden shadow-sm border border-[#E8E4DC] flex active:bg-[#FBF8F2] transition-all text-start"
            >
              <div className="w-16 h-16 flex items-center justify-center text-2xl flex-shrink-0" style={{ backgroundColor: store.bg }}>
                {store.emoji}
              </div>
              <div className="flex-1 p-3">
                <div className="flex items-center justify-between">
                  <p className="font-black text-[#0F2A47] text-xs">{isAr ? store.nameAr : store.nameEn}</p>
                  <button
                    onClick={e => { e.stopPropagation(); toggleWishlist(store.id) }}
                    className="p-1 active:scale-110"
                  >
                    <Heart size={13} className={wishlist.includes(store.id) ? 'fill-red-500 text-red-500' : 'text-[#ccc]'} />
                  </button>
                </div>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <div className="flex items-center gap-0.5">
                    <Star size={10} className="fill-[#C8A951] text-[#C8A951]" />
                    <span className="text-[10px] font-bold text-[#444]">{store.rating}</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-[10px] text-[#666]">
                    <Clock size={10} />
                    <span>{isAr ? store.timeAr : store.time} {isAr ? 'دق' : 'min'}</span>
                  </div>
                  {store.deliveryFee === 0 && (
                    <span className="text-[9px] text-emerald-600 font-bold">{isAr ? 'توصيل مجاني' : 'Free'}</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Notifications Drawer */}
      {notifOpen && (
        <div className="fixed inset-0 z-50 flex flex-col" dir={isAr ? 'rtl' : 'ltr'}>
          <div className="absolute inset-0 bg-black/40" onClick={() => setNotifOpen(false)} />
          <div className="absolute bottom-0 start-0 end-0 bg-white rounded-t-3xl max-h-[75vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#F0ECE4]">
              <p className="font-black text-sm text-[#0F2A47]">{isAr ? 'الإشعارات' : 'Notifications'}</p>
              <div className="flex items-center gap-3">
                <button onClick={markAllRead} className="text-[10px] text-[#C8A951] font-bold">
                  {isAr ? 'قراءة الكل' : 'Mark all read'}
                </button>
                <button onClick={() => setNotifOpen(false)}>
                  <X size={16} className="text-[#999]" />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto flex-1">
              {notifications.map(n => (
                <div key={n.id} className={`px-4 py-3 border-b border-[#F0ECE4] flex gap-3 ${!n.read ? 'bg-[#FFFBF0]' : ''}`}>
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.read ? 'bg-[#C8A951]' : 'bg-[#E8E4DC]'}`} />
                  <div className="flex-1">
                    <p className="text-xs text-[#222]">{isAr ? n.ar : n.en}</p>
                    <p className="text-[10px] text-[#999] mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
