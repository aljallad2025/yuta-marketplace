import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useLang } from '../i18n/LangContext'
import { useCategories } from '../store/categoriesStore.jsx'

const CATEGORY_PATHS = {
  restaurant: '/web/restaurants',
  supermarket: '/web/supermarket',
  pharmacy: '/web/pharmacy',
  cosmetics: '/web/cosmetics',
  delivery: '/web/delivery',
  hotels: '/web/hotels',
  flights: '/web/flights',
  doctors: '/web/doctors',
  insurance: '/web/insurance',
}

export default function WebCategories() {
  const { isAr } = useLang()
  const navigate = useNavigate()
  const { categories } = useCategories()
  const active = categories.filter(c => c.active)

  return (
    <div className="min-h-screen bg-[#FBF8F2]" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="bg-gradient-to-br from-[#0F2A47] to-[#1a4a6b] px-4 pt-8 pb-8">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => navigate('/web')}
            className="mb-4 flex items-center gap-2 text-white/60 text-sm">
            <ArrowLeft size={16} style={{ transform: isAr ? 'rotate(180deg)' : undefined }} />
            {isAr ? 'الرئيسية' : 'Home'}
          </button>
          <h1 className="text-2xl font-black text-white">{isAr ? 'تصفح الأقسام' : 'Browse Categories'}</h1>
          <p className="text-white/50 text-sm mt-1">{active.length} {isAr ? 'قسم متاح' : 'categories'}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {active.map(cat => (
            <button key={cat.id}
              onClick={() => navigate(CATEGORY_PATHS[cat.slug] || '/web/marketplace')}
              className="bg-white rounded-2xl p-4 text-center shadow-sm border border-[#E8E4DC] hover:border-[#C8A951] hover:shadow-md transition-all">
              <div className="text-4xl mb-2">{cat.emoji || cat.icon}</div>
              <p className="text-xs font-black text-[#0F2A47] leading-tight">
                {isAr ? cat.name_ar : cat.name_en}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
