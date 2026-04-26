import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, Star, Clock } from 'lucide-react'
import { useLang } from '../i18n/LangContext'
import { useCategories } from '../store/categoriesStore.jsx'
import { useStores } from '../store/storesStore.jsx'

const CAT_NAMES = {
  th: { restaurant: 'ร้านอาหาร', supermarket: 'ซูเปอร์มาร์เก็ต', delivery: 'จัดส่ง', cosmetics: 'เครื่องสำอาง', pharmacy: 'ร้านขายยา', hotels: 'โรงแรม', flights: 'เที่ยวบิน', doctors: 'แพทย์', insurance: 'ประกัน', taxi: 'แท็กซี่' },
  lo: { restaurant: 'ຮ້ານອາຫານ', supermarket: 'ຊູເປີມາເກັດ', delivery: 'ການສົ່ງ', cosmetics: 'ເຄື່ອງສຳອາງ', pharmacy: 'ຮ້ານຂາຍຢາ', hotels: 'ໂຮງແຮມ', flights: 'ສາຍການບິນ', doctors: 'ທ່ານໝໍ', insurance: 'ປະກັນ', taxi: 'ແທັກຊີ' },
  vi: { restaurant: 'Nhà hàng', supermarket: 'Siêu thị', delivery: 'Giao hàng', cosmetics: 'Mỹ phẩm', pharmacy: 'Nhà thuốc', hotels: 'Khách sạn', flights: 'Chuyến bay', doctors: 'Bác sĩ', insurance: 'Bảo hiểm', taxi: 'Taxi' },
  ar: { restaurant: 'مطاعم', supermarket: 'سوبرماركت', delivery: 'توصيل', cosmetics: 'كوزماتكس', pharmacy: 'صيدلية', hotels: 'فنادق', flights: 'طيران', doctors: 'أطباء', insurance: 'تأمين', taxi: 'تاكسي' },
}
const getCatName = (cat, lang) => CAT_NAMES[lang]?.[cat.slug] || (lang === 'ar' ? cat.name_ar : cat.name_en) || cat.labelEn || cat.name_en

function getL(lang, en, th, lo, vi) {
  if (lang === 'th') return th || en
  if (lang === 'lo') return lo || en
  if (lang === 'vi') return vi || en
  return en
}

const SORT_OPTIONS = {
  en: ['Most Popular', 'Fastest Delivery', 'Highest Rated', 'Min. Order'],
  th: ['ยอดนิยม', 'จัดส่งเร็ว', 'คะแนนสูงสุด', 'ขั้นต่ำ'],
  lo: ['ນິຍົມ', 'ສົ່ງໄວ', 'ຄະແນນສູງ', 'ຂັ້ນຕ່ຳ'],
  vi: ['Phổ biến', 'Giao nhanh', 'Đánh giá cao', 'Đơn tối thiểu'],
}

const TAG_MAP = {
  popular: { en: 'Popular', th: 'ยอดนิยม', lo: 'ນິຍົມ', vi: 'Phổ biến' },
  new:     { en: 'New',     th: 'ใหม่',    lo: 'ໃໝ່',   vi: 'Mới' },
  open24:  { en: 'Open 24h',th: 'เปิด 24ชม',lo: 'ເປີດ 24ຊມ', vi: 'Mở 24h' },
  free:    { en: 'Free Delivery', th: 'จัดส่งฟรี', lo: 'ສົ່ງຟຣີ', vi: 'Giao miễn phí' },
}

export default function WebMarketplace() {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState(0)
  const [searchParams] = useSearchParams()
  const initialCat = searchParams.get('cat') ? parseInt(searchParams.get('cat')) : 0
  const [activeCategory, setActiveCategory] = useState(initialCat)
  const { t, lang } = useLang()
  const { categories } = useCategories()
  const { stores } = useStores()

  const activeCategories = categories.filter(c => c.active)
  const visibleStores = stores.filter(s => s.active)

  const filtered = visibleStores.filter(s => {
    const matchCat = activeCategory === 0 || s.catId === activeCategory
    const name = (s.nameEn || '').toLowerCase()
    const matchSearch = name.includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const getTagLabel = (tag) => {
    if (!tag || !TAG_MAP[tag]) return null
    return TAG_MAP[tag][lang] || TAG_MAP[tag].en
  }

  const sortOpts = SORT_OPTIONS[lang] || SORT_OPTIONS.en

  return (
    <div className="min-h-screen bg-[#F0F9F8]">
      <div className="bg-[#0D1B4B] py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-black text-white mb-3">{t('stores')}</h1>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center bg-white rounded-xl px-4 py-3 gap-2 shadow-sm">
              <Search size={15} className="text-[#999]" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="flex-1 outline-none text-sm bg-transparent text-[#222]" />
            </div>
            <button className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl shadow-sm text-sm font-semibold text-[#0D1B4B]">
              <SlidersHorizontal size={15} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-[#D0EDEA] sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-none">
            <button onClick={() => setActiveCategory(0)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                activeCategory === 0 ? 'bg-[#0D1B4B] text-white' : 'bg-[#F0F9F8] text-[#444] hover:bg-[#D0EDEA]'
              }`}>
              🏪 {getL(lang, 'All', 'ทั้งหมด', 'ທັງໝົດ', 'Tất cả')}
            </button>
            {activeCategories.map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat.id ? 'bg-[#0D1B4B] text-white' : 'bg-[#F0F9F8] text-[#444] hover:bg-[#D0EDEA]'
                }`}>
                <span>{cat.emoji}</span>
                <span>{getCatName(cat, lang)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-[#666]">
            <span className="font-bold text-[#0D1B4B]">{filtered.length}</span>{' '}
            {getL(lang, 'stores', 'ร้านค้า', 'ຮ້ານຄ້າ', 'cửa hàng')}
          </p>
          <select value={sort} onChange={e => setSort(+e.target.value)}
            className="text-sm border border-[#D0EDEA] rounded-xl px-3 py-2 bg-white text-[#222] outline-none font-semibold">
            {sortOpts.map((o, i) => <option key={i} value={i}>{o}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(store => (
            <Link key={store.id} to={`/web/store?id=${store.id}`}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#D0EDEA] hover:shadow-md hover:border-[#00C9A7]/40 transition-all">
              <div className="h-36 relative flex items-center justify-center overflow-hidden"
                style={{ background: `radial-gradient(circle, ${store.bg || '#F0F9F8'} 60%, #D0EDEA 100%)` }}>
                <span className="text-5xl drop-shadow-md">{store.emoji}</span>
                {getTagLabel(store.tag) && (
                  <span className="absolute top-2 start-2 px-2 py-0.5 bg-[#0D1B4B] text-white text-[10px] font-bold rounded-full">
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
                <p className="font-black text-[#0D1B4B] text-sm">{store.nameEn || store.name_en}</p>
                <div className="flex items-center gap-3 mt-2">
                  {store.rating > 0 ? (
                    <div className="flex items-center gap-1">
                      <Star size={11} className="fill-[#00C9A7] text-[#00C9A7]" />
                      <span className="text-xs font-bold text-[#444]">{store.rating}</span>
                    </div>
                  ) : (
                    <span className="text-xs bg-emerald-100 text-emerald-700 font-black px-1.5 py-0.5 rounded-full">
                      {t('new')}
                    </span>
                  )}
                  <div className="flex items-center gap-1 text-xs text-[#666]">
                    <Clock size={11} />
                    <span>{store.time || store.deliveryTime} min</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-[#F0ECE4]">
                  <span className="text-xs text-[#666]">
                    {getL(lang,'Min:','ขั้นต่ำ:','ຂັ້ນຕ່ຳ:','Tối thiểu:')} {store.minOrder > 0 ? `${store.minOrder} AED` : getL(lang,'No min','ไม่มี','ບໍ່ມີ','Không có')}
                  </span>
                  <span className={`text-xs font-bold ${store.deliveryFee === 0 ? 'text-emerald-600' : 'text-[#666]'}`}>
                    {store.deliveryFee === 0 ? `🚚 ${getL(lang,'Free','ฟรี','ຟຣີ','Miễn phí')}` : `🚚 ${store.deliveryFee} AED`}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-[#666] font-bold">
              {getL(lang,'No stores found','ไม่พบร้านค้า','ບໍ່ພົບຮ້ານຄ້າ','Không tìm thấy cửa hàng')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
