import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, Star, Clock, ArrowRight, ChevronLeft, ChevronRight, Bell, Zap } from 'lucide-react'
import SumuLogo from '../components/SumuLogo'
import { useLang } from '../i18n/LangContext'
import { useCategories } from '../store/categoriesStore.jsx'

const slides = [
  { key: 'exclusiveOffers', key2: 'browseNow', bg: 'from-[#8B6914] via-[#C8A951] to-[#a88b3a]', badge: '✨' },
  { key: 'freeDelivery', key2: 'freeDeliverySub', bg: 'from-[#0F2A47] to-[#1a3a5c]', badge: '🚚' },
  { key: 'ramadanOffers', key2: 'ramadanSub', bg: 'from-[#7B3F00] to-[#C8A951]', badge: '🌙' },
  { key: 'taxiFrom', key2: 'taxiSub', bg: 'from-[#1a3a5c] to-[#0F2A47]', badge: '🚗' },
]

const featuredStores = [
  { id: 1, nameAr: 'مطعم بهارات', nameEn: 'Baharat Restaurant', cat: 'restaurants', rating: 4.9, time: '20 min', timeAr: '٢٠ دقيقة', bg: '#FFF3E0', emoji: '🍽️', tag: 'popular' },
  { id: 2, nameAr: 'برجتينو', nameEn: 'Burgetino', cat: 'restaurants', rating: 4.9, time: '40 min', timeAr: '٤٠ دقيقة', bg: '#E8F5E9', emoji: '🍔', tag: 'new' },
  { id: 3, nameAr: 'صيدلية الشفاء', nameEn: 'Alshifa Pharmacy', cat: 'pharmacies', rating: 4.9, time: '15 min', timeAr: '١٥ دقيقة', bg: '#E3F2FD', emoji: '💊', tag: 'open' },
]

export default function WebHome() {
  const [slide, setSlide] = useState(0)
  const [search, setSearch] = useState('')
  const { t, isAr } = useLang()
  const { categories } = useCategories()
  const activeCategories = categories.filter(c => c.active)

  const prev = () => setSlide((slide - 1 + slides.length) % slides.length)
  const next = () => setSlide((slide + 1) % slides.length)

  return (
    <div className="min-h-screen bg-[#FBF8F2]">
      {/* Top bar below navbar — location + notification */}
      <div className="bg-[#0F2A47] px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-white/70 text-xs">
          <MapPin size={12} className="text-[#C8A951]" />
          <span>{isAr ? 'دبي مارينا، دبي' : 'Dubai Marina, Dubai'}</span>
        </div>
        <button className="relative p-1.5 text-white/70 hover:text-white">
          <Bell size={15} />
          <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-[#C8A951] rounded-full"></span>
        </button>
      </div>

      {/* Hero Banner */}
      <div className={`relative bg-gradient-to-br ${slides[slide].bg} overflow-hidden`} style={{ minHeight: 220 }}>
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full"></div>
        <div className="absolute -bottom-10 -left-6 w-40 h-40 bg-white/5 rounded-full"></div>

        <div className="relative z-10 px-4 pt-6 pb-8 max-w-2xl mx-auto text-center">
          {/* Logo centered */}
          <div className="flex justify-center mb-3">
            <SumuLogo size={64} variant="stacked" />
          </div>
          <h1 className="text-xl font-black text-white mb-1">{t('welcomeTo')}</h1>
          <p className="text-white/70 text-sm mb-4">{t('appTagline')}</p>

          {/* Search */}
          <div className="flex gap-2 max-w-md mx-auto">
            <div className="flex-1 flex items-center bg-white rounded-xl px-3 py-3 gap-2 shadow-md">
              <Search size={15} className="text-[#999] flex-shrink-0" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="flex-1 outline-none text-sm text-[#222] bg-transparent min-w-0"
                dir={isAr ? 'rtl' : 'ltr'} />
            </div>
            <button className="bg-[#C8A951] hover:bg-[#b8942f] text-[#0F2A47] font-bold px-4 py-3 rounded-xl shadow-md text-sm">
              {t('search')}
            </button>
          </div>
        </div>

        {/* Slide controls */}
        <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-black/20 hover:bg-black/30 rounded-full">
          <ChevronLeft size={16} className="text-white" />
        </button>
        <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-black/20 hover:bg-black/30 rounded-full">
          <ChevronRight size={16} className="text-white" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)}
              className={`rounded-full transition-all ${i === slide ? 'w-5 h-1.5 bg-[#C8A951]' : 'w-1.5 h-1.5 bg-white/40'}`} />
          ))}
        </div>
      </div>

      {/* Gold Exclusive Offers Banner */}
      <div className="mx-4 mt-4">
        <div className="gold-gradient rounded-2xl p-4 flex items-center justify-between shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-full opacity-10">
            <img src="/sumu-logo.png" alt="" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="font-black text-[#0F2A47] text-base">{t('exclusiveOffers')}</p>
            <p className="text-[#0F2A47]/70 text-xs mt-0.5">{isAr ? 'عروض حصرية لأعضاء سمو' : 'Exclusive deals for SUMU members'}</p>
          </div>
          <Link to="/web/marketplace" className="bg-[#0F2A47] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md whitespace-nowrap">
            {t('browseNow')} →
          </Link>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 mt-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-black text-[#0F2A47] text-base">{t('browseCategories')}</h2>
          <Link to="/web/categories" className="text-xs text-[#C8A951] font-bold flex items-center gap-1">
            {t('viewAll')} <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {activeCategories.map(cat => (
            <Link key={cat.id} to={cat.path || "/web/marketplace"}
              className="bg-white rounded-2xl p-3 text-center shadow-sm border border-[#E8E4DC] hover:border-[#C8A951]/50 hover:shadow-md transition-all cursor-pointer hover-lift">
              <div className="text-2xl sm:text-3xl mb-1.5">{cat.emoji}</div>
              <p className="text-xs font-bold text-[#0F2A47] leading-tight">
                {isAr ? cat.labelAr : cat.labelEn}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Stores — matching reference design */}
      <div className="px-4 mt-5 pb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-black text-[#0F2A47] text-base">{t('featuredStores')} <span className="text-[#C8A951]">+</span></h2>
          <Link to="/web/marketplace" className="text-xs text-[#C8A951] font-bold flex items-center gap-1">
            {t('viewAll')} <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {featuredStores.map(store => (
            <Link key={store.id} to="/web/store"
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E8E4DC] hover:shadow-md hover:border-[#C8A951]/30 transition-all hover-lift">
              {/* Store image area */}
              <div className="relative h-28 flex items-center justify-center overflow-hidden" style={{ background: `radial-gradient(circle at center, ${store.bg} 60%, #E8E4DC 100%)` }}>
                <span className="text-5xl drop-shadow-md">{store.emoji}</span>
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#0F2A47] text-white text-[10px] font-bold rounded-full uppercase tracking-wide">
                  {store.tag === 'popular' ? (isAr ? 'الأكثر طلباً' : 'Popular') :
                   store.tag === 'new' ? (isAr ? 'جديد' : 'New') : (isAr ? 'مفتوح' : 'Open 24h')}
                </div>
              </div>
              <div className="p-3">
                <p className="font-black text-[#0F2A47] text-sm leading-tight">
                  {isAr ? store.nameAr : store.nameEn}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1">
                    <Star size={11} className="fill-[#C8A951] text-[#C8A951]" />
                    <span className="text-xs font-bold text-[#444]">{store.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[#666]">
                    <Clock size={11} />
                    <span>{isAr ? store.timeAr : store.time}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Active Order Banner */}
      <div className="px-4 pb-8">
        <div className="bg-[#0F2A47] rounded-2xl p-4 flex items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#C8A951]/20 rounded-xl">
              <Zap size={20} className="text-[#C8A951]" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">{t('activeOrder')}</p>
              <p className="text-white/50 text-xs mt-0.5">{isAr ? '~١٢ دقيقة · #SUW-2841' : '~12 min · #SUW-2841'}</p>
            </div>
          </div>
          <Link to="/web/orders" className="px-4 py-2 bg-[#C8A951] text-[#0F2A47] font-bold text-xs rounded-xl whitespace-nowrap">
            {t('trackOrder')}
          </Link>
        </div>
      </div>
    </div>
  )
}
