import { useState } from 'react'
import { Search, X, Star, Clock, Heart } from 'lucide-react'
import { useLang } from '../../i18n/LangContext'
import { useMobile } from '../../store/mobileStore.jsx'

export default function MobileCategories() {
  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState(null)
  const { isAr } = useLang()
  const { stores, categories, openStore, wishlist, toggleWishlist } = useMobile()

  const filteredStores = stores.filter(s => {
    const matchCat = !activeCat || s.catId === activeCat
    const matchSearch = !search.trim() ||
      s.nameAr.includes(search) ||
      s.nameEn.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="bg-[#FBF8F2] min-h-full" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="bg-[#0F2A47] px-4 pt-2 pb-4">
        <h2 className="text-white font-black text-base mb-3">{isAr ? 'المتاجر' : 'Stores'}</h2>
        <div className="flex items-center bg-white rounded-xl px-3 py-2.5 gap-2">
          <Search size={13} className="text-[#999] flex-shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={isAr ? 'ابحث في المتاجر...' : 'Search stores...'}
            className="flex-1 outline-none text-xs text-[#222] bg-transparent"
            dir={isAr ? 'rtl' : 'ltr'}
          />
          {search && (
            <button onClick={() => setSearch('')}><X size={12} className="text-[#999]" /></button>
          )}
        </div>
      </div>

      <div className="px-3 pt-3 overflow-x-auto">
        <div className="flex gap-2 pb-1" style={{ width: 'max-content' }}>
          <button
            onClick={() => setActiveCat(null)}
            className={"flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black border transition-all whitespace-nowrap " +
              (!activeCat ? 'bg-[#0F2A47] text-white border-[#0F2A47]' : 'bg-white text-[#444] border-[#E8E4DC]')}
          >
            {isAr ? 'الكل' : 'All'}
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(activeCat === cat.id ? null : cat.id)}
              className={"flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black border transition-all whitespace-nowrap " +
                (activeCat === cat.id ? 'bg-[#0F2A47] text-white border-[#0F2A47]' : 'bg-white text-[#444] border-[#E8E4DC]')}
            >
              <span>{cat.emoji}</span>
              <span>{isAr ? cat.labelAr : cat.labelEn}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-3 pb-4">
        {filteredStores.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-3xl mb-2">🔍</p>
            <p className="text-sm font-bold text-[#999]">{isAr ? 'لا توجد نتائج' : 'No results'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            {filteredStores.map(store => (
              <button
                key={store.id}
                onClick={() => openStore(store)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E8E4DC] active:bg-[#FBF8F2] text-start transition-all"
              >
                <div className="h-20 flex items-center justify-center text-4xl relative" style={{ backgroundColor: store.bg }}>
                  {store.emoji}
                  <button
                    onClick={e => { e.stopPropagation(); toggleWishlist(store.id) }}
                    className="absolute top-2 end-2 p-1 bg-white/80 rounded-full"
                  >
                    <Heart size={12} className={wishlist.includes(store.id) ? 'fill-red-500 text-red-500' : 'text-[#ccc]'} />
                  </button>
                  {!store.open && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white text-[10px] font-black bg-black/60 px-2 py-0.5 rounded-full">
                        {isAr ? 'مغلق' : 'Closed'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-2.5">
                  <p className="font-black text-[#0F2A47] text-xs leading-tight">{isAr ? store.nameAr : store.nameEn}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <div className="flex items-center gap-0.5">
                      <Star size={9} className="fill-[#C8A951] text-[#C8A951]" />
                      <span className="text-[9px] text-[#666]">{store.rating}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-[9px] text-[#999]">
                      <Clock size={9} />
                      <span>{isAr ? store.timeAr : store.time}</span>
                    </div>
                  </div>
                  {store.tagAr && (
                    <span className="mt-1.5 inline-block text-[9px] bg-[#0F2A47]/10 text-[#0F2A47] px-1.5 py-0.5 rounded-full font-bold">
                      {isAr ? store.tagAr : store.tagEn}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
