import { useState, useEffect } from 'react'
import { Search, Star, Clock, ArrowLeft, ChevronRight, MapPin } from 'lucide-react'
import { useLang } from '../../i18n/LangContext'
import { useNavigate } from 'react-router-dom'

function getL(lang, en, th, lo, vi) {
  if (lang === 'th') return th || en
  if (lang === 'lo') return lo || en
  if (lang === 'vi') return vi || en
  return en
}


export default function CosmeticsPage() {
  const { isAr, lang } = useLang()
  const navigate = useNavigate()
  const [stores, setStores] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stores?category=cosmetics')
      .then(r => r.json())
      .then(data => { setStores(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = stores.filter(s =>
    (isAr ? s.name_ar : s.name_en)?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#F0F9F8]" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="bg-gradient-to-br from-[#0D1B4B] to-[#0A3D8F] px-4 pt-8 pb-6">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => navigate('/web')} className="mb-4 flex items-center gap-2 text-white/60 text-sm">
            <ArrowLeft size={16} style={{ transform: isAr ? 'rotate(180deg)' : undefined }} />
            {getL(lang,'Home','หน้าแรก','ໜ້າຫຼັກ','Trang chủ')}
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl">{'💄'}</div>
            <div>
              <h1 className="text-2xl font-black text-white">{isAr ? 'الكوزماتكس' : 'Cosmetics'}</h1>
              <p className="text-white/50 text-sm">{filtered.length} {isAr ? 'متجر' : 'stores'}</p>
            </div>
          </div>
          <div className="flex items-center bg-white/10 backdrop-blur rounded-xl px-4 py-3 gap-2">
            <Search size={16} className="text-white/50" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder={isAr ? 'ابحث عن متجر...' : 'Search stores...'}
              className="flex-1 outline-none text-sm bg-transparent text-white placeholder-white/40" />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-5">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#00C9A7] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">{'💄'}</p>
            <p className="font-bold">{isAr ? 'لا توجد الكوزماتكس متاحة حالياً' : 'No Cosmetics available'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(store => (
              <button key={store.id} onClick={() => navigate('/web/store?id=' + store.id)}
                className="w-full bg-white rounded-2xl border border-[#D0EDEA] p-4 flex items-center gap-4 hover:shadow-md transition text-start">
                <div className="w-16 h-16 bg-gradient-to-br from-[#0D1B4B] to-[#0A3D8F] rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 overflow-hidden">
                  {store.logo?.startsWith('/') || store.logo?.startsWith('http')
                    ? <img src={store.logo} className="w-full h-full object-cover rounded-2xl" />
                    : store.logo || '💄'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-[#0D1B4B] text-base">{isAr ? store.name_ar : store.name_en}</h3>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Star size={11} className="fill-[#00C9A7] text-[#00C9A7]" />{store.rating || '4.5'}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock size={11} />{store.delivery_time || '30'} {isAr ? 'دق' : 'min'}
                    </span>
                    {store.address_ar && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <MapPin size={11} />{isAr ? store.address_ar : store.address_en}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${store.is_open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {store.is_open ? (getL(lang,'Open','เปิด','ເປີດ','Mở cửa')) : (getL(lang,'Closed','ปิด','ປິດ','Đóng cửa'))}
                    </span>
                    {store.delivery_fee === 0
                      ? <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold">{isAr ? 'توصيل مجاني' : 'Free delivery'}</span>
                      : <span className="text-xs text-gray-400">{isAr ? 'توصيل:' : 'Delivery:'} {store.delivery_fee} {isAr ? 'ر' : 'SAR'}</span>
                    }
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-300 flex-shrink-0" style={{ transform: isAr ? 'rotate(180deg)' : undefined }} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
