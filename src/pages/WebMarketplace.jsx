import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, Star, Clock } from 'lucide-react'
import { useLang } from '../i18n/LangContext'
import { useCategories } from '../store/categoriesStore'

const stores = [
  { id: 1, nameAr: 'مطعم بهارات', nameEn: 'Baharat Restaurant', catId: 1, rating: 4.9, time: '20–30', timeAr: '٢٠–٣٠ دقيقة', minOrder: 15, deliveryFee: 0, open: true, tag: 'popular', bg: '#FFF3E0', emoji: '🍽️' },
  { id: 2, nameAr: 'برجتينو', nameEn: 'Burgetino', catId: 1, rating: 4.8, time: '25–40', timeAr: '٢٥–٤٠ دقيقة', minOrder: 10, deliveryFee: 2, open: true, tag: 'new', bg: '#E8F5E9', emoji: '🍔' },
  { id: 3, nameAr: 'صيدلية الشفاء', nameEn: 'Alshifa Pharmacy', catId: 5, rating: 4.9, time: '10–20', timeAr: '١٠–٢٠ دقيقة', minOrder: 0, deliveryFee: 0, open: true, tag: 'open24', bg: '#E3F2FD', emoji: '💊' },
  { id: 4, nameAr: 'فريش مارت', nameEn: 'Fresh Mart', catId: 2, rating: 4.7, time: '30–45', timeAr: '٣٠–٤٥ دقيقة', minOrder: 30, deliveryFee: 0, open: true, tag: 'free', bg: '#F3E5F5', emoji: '🛒' },
  { id: 5, nameAr: 'ريدا كلين', nameEn: 'Rida Clean', catId: 3, rating: 4.6, time: '45–60', timeAr: '٤٥–٦٠ دقيقة', minOrder: 50, deliveryFee: 5, open: true, tag: null, bg: '#E0F2F1', emoji: '🧹' },
  { id: 6, nameAr: 'غلامور للتجميل', nameEn: 'Glamour Beauty', catId: 4, rating: 4.5, time: '45–60', timeAr: '٤٥–٦٠ دقيقة', minOrder: 50, deliveryFee: 5, open: true, tag: null, bg: '#FCE4EC', emoji: '💄' },
  { id: 7, nameAr: 'النور العام', nameEn: 'Al Noor General', catId: 6, rating: 4.4, time: '20–30', timeAr: '٢٠–٣٠ دقيقة', minOrder: 0, deliveryFee: 2, open: true, tag: null, bg: '#FFF8E1', emoji: '🏪' },
  { id: 8, nameAr: 'مخبز الفرن الذهبي', nameEn: 'Golden Oven Bakery', catId: 7, rating: 4.6, time: '20–35', timeAr: '٢٠–٣٥ دقيقة', minOrder: 20, deliveryFee: 0, open: true, tag: 'popular', bg: '#FBE9E7', emoji: '🍞' },
  { id: 9, nameAr: 'تك زون إلكترونيات', nameEn: 'TechZone Electronics', catId: 8, rating: 4.5, time: '60–90', timeAr: '٦٠–٩٠ دقيقة', minOrder: 100, deliveryFee: 10, open: false, tag: null, bg: '#E0F7FA', emoji: '📱' },
]

const sortOptionsEn = ['Most Popular', 'Fastest Delivery', 'Highest Rated', 'Min. Order']
const sortOptionsAr = ['الأكثر طلباً', 'أسرع توصيل', 'أعلى تقييم', 'أقل طلب']

export default function WebMarketplace() {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState(0)
  const [searchParams] = useSearchParams()
  const initialCat = searchParams.get('cat') ? parseInt(searchParams.get('cat')) : 0
  const [activeCategory, setActiveCategory] = useState(initialCat)
  const { t, isAr } = useLang()
  const { categories } = useCategories()
  const activeCategories = categories.filter(c => c.active)

  const filtered = stores.filter(s => {
    const matchCat = activeCategory === 0 || s.catId === activeCategory
    const matchSearch = (isAr ? s.nameAr : s.nameEn).toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const getTagLabel = (tag) => {
    if (!tag) return null
    const map = { popular: isAr ? 'الأكثر طلباً' : 'Popular', new: isAr ? 'جديد' : 'New', open24: isAr ? 'مفتوح ٢٤ساعة' : 'Open 24h', free: isAr ? 'توصيل مجاني' : 'Free Delivery' }
    return map[tag] || tag
  }

  return (
    <div className="min-h-screen bg-[#FBF8F2]">
      {/* Header */}
      <div className="bg-[#0F2A47] py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-black text-white mb-3">{t('stores')}</h1>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center bg-white rounded-xl px-4 py-3 gap-2 shadow-sm">
              <Search size={15} className="text-[#999]" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="flex-1 outline-none text-sm bg-transparent text-[#222]"
                dir={isAr ? 'rtl' : 'ltr'} />
            </div>
            <button className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl shadow-sm text-sm font-semibold text-[#0F2A47]">
              <SlidersHorizontal size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="bg-white border-b border-[#E8E4DC] sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-none">
            <button onClick={() => setActiveCategory(0)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                activeCategory === 0 ? 'bg-[#0F2A47] text-white' : 'bg-[#FBF8F2] text-[#444] hover:bg-[#E8E4DC]'
              }`}>
              🏪 {isAr ? 'الكل' : 'All'}
            </button>
            {activeCategories.map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat.id ? 'bg-[#0F2A47] text-white' : 'bg-[#FBF8F2] text-[#444] hover:bg-[#E8E4DC]'
                }`}>
                <span>{cat.emoji}</span>
                <span>{isAr ? cat.labelAr : cat.labelEn}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-[#666]">
            <span className="font-bold text-[#0F2A47]">{filtered.length}</span> {isAr ? 'متجر' : 'stores'}
          </p>
          <select value={sort} onChange={e => setSort(+e.target.value)}
            className="text-sm border border-[#E8E4DC] rounded-xl px-3 py-2 bg-white text-[#222] outline-none font-semibold">
            {(isAr ? sortOptionsAr : sortOptionsEn).map((o, i) => <option key={i} value={i}>{o}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(store => (
            <Link key={store.id} to="/web/store"
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E8E4DC] hover:shadow-md hover:border-[#C8A951]/40 transition-all hover-lift">
              <div className="h-36 relative flex items-center justify-center overflow-hidden" style={{ background: `radial-gradient(circle, ${store.bg} 60%, #E8E4DC 100%)` }}>
                <span className="text-5xl drop-shadow-md">{store.emoji}</span>
                {getTagLabel(store.tag) && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#0F2A47] text-white text-[10px] font-bold rounded-full">
                    {getTagLabel(store.tag)}
                  </span>
                )}
                {!store.open && (
                  <div className="absolute inset-0 bg-white/75 flex items-center justify-center">
                    <span className="font-bold text-[#666] text-sm">{t('closed')}</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="font-black text-[#0F2A47] text-sm">{isAr ? store.nameAr : store.nameEn}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1">
                    <Star size={11} className="fill-[#C8A951] text-[#C8A951]" />
                    <span className="text-xs font-bold text-[#444]">{store.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[#666]">
                    <Clock size={11} />
                    <span>{isAr ? store.timeAr : `${store.time} min`}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-[#F0ECE4]">
                  <span className="text-xs text-[#666]">{isAr ? 'الحد الأدنى:' : 'Min:'} {store.minOrder > 0 ? `${store.minOrder} ${isAr ? 'درهم' : 'AED'}` : (isAr ? 'بدون حد' : 'No min')}</span>
                  <span className={`text-xs font-bold ${store.deliveryFee === 0 ? 'text-emerald-600' : 'text-[#666]'}`}>
                    {store.deliveryFee === 0 ? (isAr ? '🚚 مجاني' : '🚚 Free') : `🚚 ${store.deliveryFee} ${isAr ? 'درهم' : 'AED'}`}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-[#666] font-bold">{isAr ? 'لا توجد متاجر مطابقة' : 'No stores found'}</p>
          </div>
        )}
      </div>
    </div>
  )
}
