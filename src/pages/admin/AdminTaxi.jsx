import { useState } from 'react'
import { Search, MapPin, Car, Star, X } from 'lucide-react'
import Badge from '../../components/Badge'
import { useLang } from '../../i18n/LangContext'

const rides = [
  { id: 'RID-441', customerEn: 'Ahmed M.', customerAr: 'أحمد م.', driverEn: 'Hassan M.', driverAr: 'حسن م.', fromEn: 'Dubai Mall', fromAr: 'دبي مول', toEn: 'Dubai Airport T3', toAr: 'مطار دبي T3', typeEn: 'Economy', typeAr: 'اقتصادي', fare: 42, status: 'completed', date: 'Today, 9:15 AM', rating: 5 },
  { id: 'RID-440', customerEn: 'Fatima K.', customerAr: 'فاطمة ك.', driverEn: 'Yusuf K.', driverAr: 'يوسف ك.', fromEn: 'JBR Beach', fromAr: 'شاطئ JBR', toEn: 'Mall of Emirates', toAr: 'مول الإمارات', typeEn: 'Comfort', typeAr: 'مريح', fare: 28, status: 'on_the_way', date: 'Today, 1:30 PM', rating: null },
  { id: 'RID-439', customerEn: 'Omar S.', customerAr: 'عمر س.', driverEn: null, driverAr: null, fromEn: 'Business Bay', fromAr: 'خليج الأعمال', toEn: 'Palm Jumeirah', toAr: 'نخلة جميرا', typeEn: 'Premium', typeAr: 'مميز', fare: 55, status: 'pending', date: 'Today, 1:45 PM', rating: null },
  { id: 'RID-438', customerEn: 'Layla A.', customerAr: 'ليلى ع.', driverEn: 'Mohammed A.', driverAr: 'محمد ع.', fromEn: 'Downtown', fromAr: 'وسط المدينة', toEn: 'Sharjah', toAr: 'الشارقة', typeEn: 'XL', typeAr: 'XL', fare: 88, status: 'completed', date: 'Yesterday', rating: 4 },
  { id: 'RID-437', customerEn: 'Khalid R.', customerAr: 'خالد ر.', driverEn: null, driverAr: null, fromEn: 'Burj Khalifa', fromAr: 'برج خليفة', toEn: 'Marina Walk', toAr: 'مارينا ووك', typeEn: 'Economy', typeAr: 'اقتصادي', fare: 22, status: 'cancelled', date: 'Yesterday', rating: null },
]

const statusFilters = ['all', 'pending', 'on_the_way', 'completed', 'cancelled']

export default function AdminTaxi() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const { t, isAr } = useLang()

  const statusLabel = {
    all: isAr ? 'الكل' : 'All',
    pending: isAr ? 'قيد الانتظار' : 'Pending',
    on_the_way: isAr ? 'نشط' : 'Active',
    completed: isAr ? 'مكتمل' : 'Completed',
    cancelled: isAr ? 'ملغي' : 'Cancelled',
  }

  const stats = [
    { labelEn: 'Active Rides', labelAr: 'رحلات نشطة', count: 38, color: '#3498DB' },
    { labelEn: 'Completed Today', labelAr: 'مكتملة اليوم', count: 142, color: '#2ECC71' },
    { labelEn: 'Pending Assignment', labelAr: 'بانتظار السائق', count: 7, color: '#F39C12' },
    { labelEn: 'Cancelled Today', labelAr: 'ملغية اليوم', count: 12, color: '#E74C3C' },
  ]

  const headers = isAr
    ? ['معرف الرحلة', 'العميل', 'المسار', 'السائق', 'النوع', 'الأجرة', 'الحالة', 'التاريخ', 'إجراءات']
    : ['Ride ID', 'Customer', 'Route', 'Driver', 'Type', 'Fare', 'Status', 'Date', 'Actions']

  const filtered = rides.filter(r => {
    const customer = isAr ? r.customerAr : r.customerEn
    const matchSearch = r.id.toLowerCase().includes(search.toLowerCase()) || customer.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || r.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="p-6 space-y-5" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#0F2A47]">{t('taxiManagement')}</h1>
          <p className="text-sm text-[#666]">{isAr ? '٣٨ رحلة نشطة الآن' : '38 active rides right now'}</p>
        </div>
        <button className="px-4 py-2.5 bg-[#C8A951] text-[#0F2A47] text-sm font-black rounded-xl">{t('exportReport')}</button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.labelEn} className="bg-white rounded-xl p-4 shadow-sm border border-[#E8E4DC] text-center">
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.count}</p>
            <p className="text-xs text-[#666] mt-0.5">{isAr ? s.labelAr : s.labelEn}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <div className="flex-1 flex items-center bg-white rounded-xl px-4 py-2.5 gap-2 shadow-sm border border-[#E8E4DC]">
          <Search size={16} className="text-[#999]" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={isAr ? 'ابحث برقم الرحلة أو اسم العميل...' : 'Search by ride ID or customer...'}
            className="flex-1 outline-none text-sm bg-transparent text-[#222]"
            dir={isAr ? 'rtl' : 'ltr'} />
        </div>
        {statusFilters.map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3 py-2.5 rounded-xl text-xs font-black whitespace-nowrap ${
              statusFilter === s ? 'bg-[#0F2A47] text-white' : 'bg-white text-[#444] border border-[#E8E4DC]'
            }`}>
            {statusLabel[s]}
          </button>
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
              {filtered.map((ride, i) => (
                <tr key={ride.id} className={`${i < filtered.length - 1 ? 'border-b border-[#F0ECE4]' : ''} hover:bg-[#FBF8F2]`}>
                  <td className="px-4 py-3.5 font-mono text-xs text-[#0F2A47] font-black">{ride.id}</td>
                  <td className="px-4 py-3.5 text-sm text-[#444]">{isAr ? ride.customerAr : ride.customerEn}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1 text-xs text-[#666]">
                      <MapPin size={10} className="text-emerald-500 flex-shrink-0" />
                      <span className="truncate max-w-20">{isAr ? ride.fromAr : ride.fromEn}</span>
                      <span>→</span>
                      <MapPin size={10} className="text-red-500 flex-shrink-0" />
                      <span className="truncate max-w-20">{isAr ? ride.toAr : ride.toEn}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm">
                    {(isAr ? ride.driverAr : ride.driverEn) ? (
                      <span className="text-[#444]">{isAr ? ride.driverAr : ride.driverEn}</span>
                    ) : (
                      <button className="text-xs text-[#C8A951] border border-[#C8A951]/30 px-2 py-0.5 rounded-full font-black">
                        {t('assignDriver')}
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs bg-[#0F2A47]/10 text-[#0F2A47] px-2 py-0.5 rounded-full font-black">
                      {isAr ? ride.typeAr : ride.typeEn}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-black text-sm text-[#222]">{ride.fare} {isAr ? 'د' : 'AED'}</td>
                  <td className="px-4 py-3.5">
                    <Badge status={ride.status} label={
                      isAr ? (ride.status === 'on_the_way' ? 'نشط' : ride.status === 'completed' ? 'مكتمل' : ride.status === 'cancelled' ? 'ملغي' : 'قيد الانتظار') : undefined
                    } />
                  </td>
                  <td className="px-4 py-3.5 text-xs text-[#666] whitespace-nowrap">{ride.date}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 hover:bg-[#FBF8F2] rounded-lg text-[#666] hover:text-[#0F2A47]"><Car size={13} /></button>
                      {ride.status !== 'completed' && ride.status !== 'cancelled' && (
                        <button className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"><X size={13} /></button>
                      )}
                      {ride.status === 'completed' && ride.rating && (
                        <div className="flex items-center gap-0.5 text-xs">
                          <Star size={11} className="fill-[#C8A951] text-[#C8A951]" />
                          <span className="text-[#666]">{ride.rating}</span>
                        </div>
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
