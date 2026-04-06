import { useState } from 'react'
import { Search, Bell, MapPin, Star, Clock } from 'lucide-react'
import { useLang } from '../../i18n/LangContext'
import { useCategories } from '../../store/categoriesStore.jsx'
import { useStores } from '../../store/storesStore.jsx'

const slides = [
  { key: 'exclusiveOffers', bg: 'from-[#8B6914] to-[#C8A951]' },
  { key: 'freeDelivery', bg: 'from-[#0F2A47] to-[#1a3a5c]' },
  { key: 'taxiFrom', bg: 'from-[#1a3a5c] to-[#0F2A47]' },
]

export default function MobileHome() {
  const [slide, setSlide] = useState(0)
  const { t, isAr } = useLang()
  const { categories } = useCategories()
  const { stores } = useStores()
  const activeCategories = categories.filter(c => c.active).slice(0, 6)
  const featuredStores = stores.filter(s => s.active && s.rating >= 4.5).slice(0, 3)

  return (
    <div className="bg-[#FBF8F2]" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-[#0F2A47] px-4 pt-2 pb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 text-white/60 text-xs">
            <MapPin size={11} className="text-[#C8A951]" />
            <span>{isAr ? 'دبي مارينا' : 'Dubai Marina'}</span>
          </div>
          {/* Real logo */}
          <img src="/sumu-logo.png" alt="SUMU" className="w-8 h-8 rounded-lg object-cover" />
          <button className="relative p-1.5 bg-white/10 rounded-lg">
            <Bell size={14} className="text-white" />
            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-[#C8A951] rounded-full"></span>
          </button>
        </div>
        {/* Search */}
        <div className="flex items-center bg-white rounded-xl px-3 py-2.5 gap-2">
          <Search size={13} className="text-[#999]" />
          <input placeholder={t('searchPlaceholder')} className="flex-1 outline-none text-xs text-[#222] bg-transparent"
            dir={isAr ? 'rtl' : 'ltr'} />
        </div>
      </div>

      {/* Hero Slider */}
      <div className={`relative bg-gradient-to-r ${slides[slide].bg} mx-3 mt-3 rounded-2xl overflow-hidden`} style={{ minHeight: 110 }}>
        <div className="p-4 flex items-center gap-3">
          <img src="/sumu-logo.png" alt="SUMU" className="w-12 h-12 rounded-xl object-cover shadow-md flex-shrink-0" />
          <div className="flex-1">
            <p className="text-white font-black text-sm">{t(slides[slide].key)}</p>
            <button className="mt-2 px-3 py-1.5 bg-[#C8A951] text-[#0F2A47] font-bold text-xs rounded-full">
              {t('browseNow')} →
            </button>
          </div>
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)}
              className={`rounded-full transition-all ${i === slide ? 'w-4 h-1.5 bg-[#C8A951]' : 'w-1.5 h-1.5 bg-white/40'}`} />
          ))}
        </div>
      </div>

      {/* Exclusive Offers */}
      <div className="mx-3 mt-3">
        <div className="gold-gradient rounded-2xl p-3 flex items-center justify-between">
          <p className="font-black text-[#0F2A47] text-xs">{t('exclusiveOffers')}</p>
          <button className="px-3 py-1.5 bg-[#0F2A47] text-white text-[10px] font-bold rounded-full">{t('browseNow')}</button>
        </div>
      </div>

      {/* Categories */}
      <div className="px-3 mt-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-black text-[#0F2A47]">{t('browseCategories')}</p>
          <span className="text-xs text-[#C8A951] font-bold">{t('seeAll')}</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {activeCategories.map(cat => (
            <div key={cat.id} className="bg-white rounded-xl p-2 text-center shadow-sm border border-[#E8E4DC]">
              <div className="text-xl mb-1">{cat.emoji}</div>
              <p className="text-[9px] font-bold text-[#0F2A47] leading-tight">{isAr ? cat.labelAr : cat.labelEn}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Stores */}
      <div className="px-3 mt-4 pb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-black text-[#0F2A47]">{t('featuredStores')} +</p>
          <span className="text-xs text-[#C8A951] font-bold">{t('viewAll')}</span>
        </div>
        <div className="space-y-2">
          {featuredStores.map(store => (
            <div key={store.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#E8E4DC] flex">
              <div className="w-16 flex items-center justify-center text-2xl flex-shrink-0" style={{ backgroundColor: store.bg || '#FBF8F2' }}>
                {store.emoji}
              </div>
              <div className="flex-1 p-3">
                <p className="font-black text-[#0F2A47] text-xs">{isAr ? store.nameAr : store.nameEn}</p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-0.5">
                    <Star size={10} className="fill-[#C8A951] text-[#C8A951]" />
                    <span className="text-[10px] font-bold text-[#444]">{store.rating}</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-[10px] text-[#666]">
                    <Clock size={10} />
                    <span>{isAr ? store.timeAr : store.time} {isAr ? 'دقيقة' : 'min'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Order */}
      <div className="px-3 pb-4">
        <div className="bg-[#0F2A47] rounded-xl p-3 flex items-center gap-3">
          <div className="p-2 bg-[#C8A951]/20 rounded-lg">
            <Zap size={14} className="text-[#C8A951]" />
          </div>
          <div className="flex-1">
            <p className="text-white text-xs font-black">{t('activeOrder')}</p>
            <p className="text-white/50 text-[10px]">{isAr ? '~١٢ دقيقة · #SUW-2841' : '~12 min · #SUW-2841'}</p>
          </div>
          <span className="text-[#C8A951] text-xs font-bold">{t('trackOrder')} →</span>
        </div>
      </div>
    </div>
  )
}
