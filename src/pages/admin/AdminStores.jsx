import { useState } from 'react'
import { Search, CheckCircle, XCircle, Eye, Edit2, Star } from 'lucide-react'
import Badge from '../../components/Badge'
import { useLang } from '../../i18n/LangContext'

const stores = [
  { id: 'STR-001', nameEn: 'Baharat Restaurant', nameAr: 'مطعم بهارات', catEn: 'Restaurants', catAr: 'المطاعم', ownerEn: 'Khalid Al Nasser', ownerAr: 'خالد الناصر', status: 'active', rating: 4.9, orders: 1240, commission: 12, revenue: 48600 },
  { id: 'STR-002', nameEn: 'Fresh Mart', nameAr: 'فريش مارت', catEn: 'Supermarket', catAr: 'سوبرماركت', ownerEn: 'Ahmed Saeed', ownerAr: 'أحمد سعيد', status: 'active', rating: 4.7, orders: 890, commission: 10, revenue: 38200 },
  { id: 'STR-003', nameEn: 'Al Shifa Pharmacy', nameAr: 'صيدلية الشفاء', catEn: 'Pharmacy', catAr: 'صيدلية', ownerEn: 'Dr. Fatima Hassan', ownerAr: 'د. فاطمة حسن', status: 'active', rating: 4.9, orders: 640, commission: 8, revenue: 22800 },
  { id: 'STR-004', nameEn: 'Glamour Beauty', nameAr: 'غلامور بيوتي', catEn: 'Beauty', catAr: 'مستحضرات التجميل', ownerEn: 'Sara Mohammed', ownerAr: 'سارة محمد', status: 'active', rating: 4.6, orders: 320, commission: 15, revenue: 18400 },
  { id: 'STR-005', nameEn: 'TechZone Electronics', nameAr: 'تك زون', catEn: 'Electronics', catAr: 'إلكترونيات', ownerEn: 'Omar Al Rashidi', ownerAr: 'عمر الراشدي', status: 'inactive', rating: 4.5, orders: 145, commission: 8, revenue: 28900 },
  { id: 'STR-006', nameEn: 'Desert Sweets', nameAr: 'حلويات الصحراء', catEn: 'Restaurants', catAr: 'المطاعم', ownerEn: 'Ibrahim Yusuf', ownerAr: 'إبراهيم يوسف', status: 'pending', rating: 0, orders: 0, commission: 12, revenue: 0 },
]

const catEmoji = { Restaurants: '🍽️', Supermarket: '🛒', Pharmacy: '💊', Beauty: '💄', Electronics: '📱' }

export default function AdminStores() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const { t, isAr } = useLang()

  const filterLabels = {
    all: isAr ? 'الكل' : 'All',
    active: isAr ? 'نشط' : 'Active',
    inactive: isAr ? 'غير نشط' : 'Inactive',
    pending: isAr ? 'بانتظار الموافقة' : 'Pending',
  }

  const headers = isAr
    ? ['المتجر', 'القسم', 'المالك', 'الحالة', 'التقييم', 'الطلبات', 'العمولة', 'الإيرادات', 'إجراءات']
    : ['Store', 'Category', 'Owner', 'Status', 'Rating', 'Orders', 'Commission', 'Revenue', 'Actions']

  const filtered = stores.filter(s => {
    const name = isAr ? s.nameAr : s.nameEn
    const matchSearch = name.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || s.status === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="p-6 space-y-5" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#0F2A47]">{t('storeManagement')}</h1>
          <p className="text-sm text-[#666]">{isAr ? '٢٨٤ متجر نشط على المنصة' : '284 active stores on platform'}</p>
        </div>
        <button className="px-4 py-2.5 bg-[#0F2A47] text-white text-sm font-black rounded-xl">
          {isAr ? '+ إضافة متجر' : '+ Add Store'}
        </button>
      </div>

      <div className="flex gap-3">
        <div className="flex-1 flex items-center bg-white rounded-xl px-4 py-2.5 gap-2 shadow-sm border border-[#E8E4DC]">
          <Search size={16} className="text-[#999]" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={isAr ? 'ابحث عن المتاجر...' : 'Search stores...'}
            className="flex-1 outline-none text-sm bg-transparent text-[#222]"
            dir={isAr ? 'rtl' : 'ltr'} />
        </div>
        {Object.keys(filterLabels).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2.5 rounded-xl text-sm font-black ${
              filter === f ? 'bg-[#0F2A47] text-white' : 'bg-white text-[#444] border border-[#E8E4DC]'
            }`}>{filterLabels[f]}</button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#E8E4DC] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#FBF8F2] border-b border-[#E8E4DC]">
                {headers.map(h => (
                  <th key={h} className="text-start px-4 py-3.5 text-xs font-black text-[#666] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((store, i) => (
                <tr key={store.id} className={`${i < filtered.length - 1 ? 'border-b border-[#F0ECE4]' : ''} hover:bg-[#FBF8F2]`}>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#C8A951]/20 rounded-xl flex items-center justify-center text-lg">
                        {catEmoji[store.catEn] || '🏪'}
                      </div>
                      <div>
                        <p className="font-black text-sm text-[#222]">{isAr ? store.nameAr : store.nameEn}</p>
                        <p className="text-xs text-[#999] font-mono">{store.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-xs text-[#666]">{isAr ? store.catAr : store.catEn}</td>
                  <td className="px-4 py-4 text-sm text-[#444]">{isAr ? store.ownerAr : store.ownerEn}</td>
                  <td className="px-4 py-4">
                    <Badge status={store.status} label={
                      isAr ? (store.status === 'active' ? 'نشط' : store.status === 'inactive' ? 'غير نشط' : 'بانتظار الموافقة') : undefined
                    } />
                  </td>
                  <td className="px-4 py-4">
                    {store.rating > 0 ? (
                      <div className="flex items-center gap-1">
                        <Star size={12} className="fill-[#C8A951] text-[#C8A951]" />
                        <span className="text-sm font-black text-[#222]">{store.rating}</span>
                      </div>
                    ) : <span className="text-xs text-[#999]">{isAr ? 'جديد' : 'New'}</span>}
                  </td>
                  <td className="px-4 py-4 text-sm font-black text-[#222]">{store.orders.toLocaleString()}</td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-black text-[#C8A951]">{store.commission}%</span>
                  </td>
                  <td className="px-4 py-4 text-sm font-black text-[#0F2A47]">{store.revenue.toLocaleString()} {isAr ? 'د' : 'AED'}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 hover:bg-[#FBF8F2] rounded-lg text-[#666] hover:text-[#0F2A47]"><Eye size={13} /></button>
                      <button className="p-1.5 hover:bg-[#FBF8F2] rounded-lg text-[#666] hover:text-[#0F2A47]"><Edit2 size={13} /></button>
                      {store.status === 'pending' && (
                        <>
                          <button className="p-1.5 hover:bg-green-50 rounded-lg text-green-600"><CheckCircle size={13} /></button>
                          <button className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"><XCircle size={13} /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
