import { useState } from 'react'
import { Search } from 'lucide-react'
import { useLang } from '../../i18n/LangContext'
import { useCategories } from '../../store/categoriesStore'

export default function MobileCategories() {
  const [search, setSearch] = useState('')
  const { t, isAr } = useLang()
  const { categories } = useCategories()

  const filtered = categories.filter(c => {
    const name = isAr ? c.labelAr : c.labelEn
    return name.toLowerCase().includes(search.toLowerCase()) && c.active
  })

  return (
    <div className="bg-[#FBF8F2]" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="bg-[#0F2A47] px-4 pt-2 pb-4">
        <h2 className="text-white font-black text-base mb-3">{t('categories')}</h2>
        <div className="flex items-center bg-white rounded-xl px-3 py-2.5 gap-2">
          <Search size={13} className="text-[#999]" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={isAr ? 'ابحث في الأقسام...' : 'Search categories...'}
            className="flex-1 outline-none text-xs text-[#222] bg-transparent" dir={isAr ? 'rtl' : 'ltr'} />
        </div>
      </div>

      <div className="p-3 grid grid-cols-3 gap-2.5">
        {filtered.map(cat => (
          <div key={cat.id} className="bg-white rounded-2xl p-3 text-center shadow-sm border border-[#E8E4DC] cursor-pointer hover:border-[#C8A951]/40 transition-all">
            <div className="text-3xl mb-2">{cat.emoji}</div>
            <p className="text-xs font-black text-[#0F2A47] leading-tight">{isAr ? cat.labelAr : cat.labelEn}</p>
            <p className="text-[9px] text-[#999] mt-0.5">{cat.count} {isAr ? 'متجر' : 'stores'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
