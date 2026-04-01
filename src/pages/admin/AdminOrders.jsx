import { useState } from 'react'
import { Search, Eye, Edit2, X } from 'lucide-react'
import Badge from '../../components/Badge'
import { useLang } from '../../i18n/LangContext'

const allOrders = [
  { id: 'SUW-2841', customerEn: 'Ahmed Al Mansouri', customerAr: 'أحمد المنصوري', storeEn: 'Baharat Restaurant', storeAr: 'مطعم بهارات', driverEn: 'Mohammed A.', driverAr: 'محمد ع.', items: 3, total: 254, status: 'on_the_way', date: 'Apr 1, 12:45 PM', addressEn: 'Villa 12, Al Wasl Rd', addressAr: 'فيلا ١٢، شارع الوصل' },
  { id: 'SUW-2840', customerEn: 'Fatima Al Rashidi', customerAr: 'فاطمة الراشدي', storeEn: 'Fresh Mart', storeAr: 'فريش مارت', driverEn: 'Ibrahim S.', driverAr: 'إبراهيم س.', items: 12, total: 187, status: 'preparing', date: 'Apr 1, 12:30 PM', addressEn: 'Apt 5B, JBR', addressAr: 'شقة 5B، JBR' },
  { id: 'SUW-2839', customerEn: 'Omar Khalid', customerAr: 'عمر خالد', storeEn: 'Al Shifa Pharmacy', storeAr: 'صيدلية الشفاء', driverEn: 'Yusuf K.', driverAr: 'يوسف ك.', items: 2, total: 48, status: 'completed', date: 'Apr 1, 11:20 AM', addressEn: 'Villa 7, Jumeirah', addressAr: 'فيلا ٧، جميرا' },
  { id: 'SUW-2838', customerEn: 'Layla Hassan', customerAr: 'ليلى حسن', storeEn: 'Burgetino', storeAr: 'برجتينو', driverEn: null, driverAr: null, items: 4, total: 96, status: 'pending', date: 'Apr 1, 1:00 PM', addressEn: 'Tower 3, Downtown', addressAr: 'برج ٣، وسط المدينة' },
  { id: 'SUW-2837', customerEn: 'Khalid Ibrahim', customerAr: 'خالد إبراهيم', storeEn: 'TechZone', storeAr: 'تك زون', driverEn: null, driverAr: null, items: 1, total: 420, status: 'accepted', date: 'Apr 1, 12:55 PM', addressEn: 'Office 202, DIFC', addressAr: 'مكتب ٢٠٢، DIFC' },
  { id: 'SUW-2836', customerEn: 'Sara Mohammed', customerAr: 'سارة محمد', storeEn: 'Baharat Restaurant', storeAr: 'مطعم بهارات', driverEn: null, driverAr: null, items: 2, total: 115, status: 'cancelled', date: 'Apr 1, 10:00 AM', addressEn: 'Marina Walk', addressAr: 'مارينا ووك' },
]

const statusOptions = ['all', 'pending', 'accepted', 'preparing', 'on_the_way', 'completed', 'cancelled']

export default function AdminOrders() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [selected, setSelected] = useState(null)
  const { t, isAr } = useLang()

  const statusLabel = {
    all: isAr ? 'الكل' : 'All',
    pending: isAr ? 'قيد الانتظار' : 'Pending',
    accepted: isAr ? 'تم القبول' : 'Accepted',
    preparing: isAr ? 'يُحضَّر' : 'Preparing',
    on_the_way: isAr ? 'في الطريق' : 'On the way',
    completed: isAr ? 'مكتمل' : 'Completed',
    cancelled: isAr ? 'ملغي' : 'Cancelled',
  }

  const headers = isAr
    ? ['الطلب', 'العميل', 'المتجر', 'السائق', 'الإجمالي', 'الحالة', 'التاريخ', 'إجراءات']
    : ['Order', 'Customer', 'Store', 'Driver', 'Total', 'Status', 'Date', 'Actions']

  const filtered = allOrders.filter(o => {
    const customer = isAr ? o.customerAr : o.customerEn
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
                        customer.toLowerCase().includes(search.toLowerCase())
    const matchStatus = status === 'all' || o.status === status
    return matchSearch && matchStatus
  })

  const quickStats = [
    { labelEn: 'Pending', labelAr: 'قيد الانتظار', count: 8, color: '#F39C12' },
    { labelEn: 'Active', labelAr: 'نشط', count: 24, color: '#3498DB' },
    { labelEn: 'Completed', labelAr: 'مكتمل', count: 298, color: '#2ECC71' },
    { labelEn: 'Cancelled', labelAr: 'ملغي', count: 16, color: '#E74C3C' },
  ]

  return (
    <div className="p-6 space-y-5" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#0F2A47]">{t('orderManagement')}</h1>
          <p className="text-sm text-[#666]">{isAr ? '٣٤٦ طلب اليوم' : '346 orders today'}</p>
        </div>
        <button className="px-4 py-2.5 bg-[#C8A951] text-[#0F2A47] text-sm font-black rounded-xl">{t('exportCSV')}</button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {quickStats.map(s => (
          <div key={s.labelEn} className="bg-white rounded-xl p-4 shadow-sm border border-[#E8E4DC] text-center">
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.count}</p>
            <p className="text-xs text-[#666] mt-0.5">{isAr ? s.labelAr : s.labelEn}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center bg-white rounded-xl px-4 py-2.5 gap-2 shadow-sm border border-[#E8E4DC]">
          <Search size={16} className="text-[#999]" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={isAr ? 'ابحث برقم الطلب أو اسم العميل...' : 'Search by order ID or customer...'}
            className="flex-1 outline-none text-sm bg-transparent text-[#222]"
            dir={isAr ? 'rtl' : 'ltr'} />
        </div>
        <div className="flex gap-1 overflow-x-auto">
          {statusOptions.map(s => (
            <button key={s} onClick={() => setStatus(s)}
              className={`px-3 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                status === s ? 'bg-[#0F2A47] text-white' : 'bg-white text-[#444] border border-[#E8E4DC]'
              }`}>
              {statusLabel[s]}
            </button>
          ))}
        </div>
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
              {filtered.map((order, i) => (
                <tr key={order.id} className={`${i < filtered.length - 1 ? 'border-b border-[#F0ECE4]' : ''} hover:bg-[#FBF8F2] cursor-pointer`}
                  onClick={() => setSelected(selected?.id === order.id ? null : order)}>
                  <td className="px-4 py-3.5">
                    <p className="font-mono font-black text-xs text-[#0F2A47]">{order.id}</p>
                    <p className="text-[10px] text-[#999]">{order.items} {isAr ? 'عناصر' : 'items'}</p>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-[#444]">{isAr ? order.customerAr : order.customerEn}</td>
                  <td className="px-4 py-3.5 text-sm text-[#666]">{isAr ? order.storeAr : order.storeEn}</td>
                  <td className="px-4 py-3.5 text-sm">
                    {(isAr ? order.driverAr : order.driverEn) ? (
                      <span className="text-[#444]">{isAr ? order.driverAr : order.driverEn}</span>
                    ) : (
                      <button className="text-xs text-[#C8A951] font-black border border-[#C8A951]/30 px-2 py-0.5 rounded-full hover:bg-[#C8A951]/10">
                        {t('assignDriver')}
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3.5 font-black text-sm text-[#222]">{order.total} {isAr ? 'د' : 'AED'}</td>
                  <td className="px-4 py-3.5"><Badge status={order.status} label={statusLabel[order.status]} /></td>
                  <td className="px-4 py-3.5 text-xs text-[#666] whitespace-nowrap">{order.date}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                      <button className="p-1.5 hover:bg-[#FBF8F2] rounded-lg text-[#666] hover:text-[#0F2A47]"><Eye size={13} /></button>
                      <button className="p-1.5 hover:bg-[#FBF8F2] rounded-lg text-[#666] hover:text-[#0F2A47]"><Edit2 size={13} /></button>
                      <button className="p-1.5 hover:bg-red-50 rounded-lg text-[#666] hover:text-red-600"><X size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selected && (
          <div className="border-t border-[#E8E4DC] bg-[#FBF8F2] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-[#0F2A47]">
                {isAr ? `تفاصيل الطلب — ${selected.id}` : `Order Details — ${selected.id}`}
              </h3>
              <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-[#E8E4DC] rounded-lg">
                <X size={15} className="text-[#666]" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div><p className="text-xs text-[#666]">{isAr ? 'العميل' : 'Customer'}</p><p className="font-black text-sm text-[#222]">{isAr ? selected.customerAr : selected.customerEn}</p></div>
              <div><p className="text-xs text-[#666]">{isAr ? 'المتجر' : 'Store'}</p><p className="font-black text-sm text-[#222]">{isAr ? selected.storeAr : selected.storeEn}</p></div>
              <div><p className="text-xs text-[#666]">{isAr ? 'العنوان' : 'Address'}</p><p className="font-black text-sm text-[#222]">{isAr ? selected.addressAr : selected.addressEn}</p></div>
              <div><p className="text-xs text-[#666]">{isAr ? 'الإجمالي' : 'Total'}</p><p className="font-black text-sm text-[#0F2A47]">{selected.total} {isAr ? 'درهم' : 'AED'}</p></div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                { en: 'Mark Preparing', ar: 'تحديد: جاري التحضير', danger: false },
                { en: 'Assign Driver', ar: 'تعيين سائق', danger: false },
                { en: 'Cancel Order', ar: 'إلغاء الطلب', danger: true },
                { en: 'Issue Refund', ar: 'إصدار استرداد', danger: true },
              ].map(action => (
                <button key={action.en} className={`px-3 py-2 text-xs font-black rounded-lg border transition-all ${
                  action.danger
                    ? 'border-red-200 text-red-600 hover:bg-red-50'
                    : 'border-[#E8E4DC] text-[#444] hover:bg-white hover:border-[#0F2A47]/20'
                }`}>
                  {isAr ? action.ar : action.en}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="px-5 py-3 border-t border-[#F0ECE4] flex items-center justify-between text-xs text-[#666]">
          <span>{isAr ? `عرض ${filtered.length} من ${allOrders.length} طلب` : `Showing ${filtered.length} of ${allOrders.length} orders`}</span>
          <div className="flex gap-1">
            {[1, 2, 3].map(p => (
              <button key={p} className={`w-7 h-7 rounded-lg ${p === 1 ? 'bg-[#0F2A47] text-white' : 'hover:bg-[#FBF8F2] text-[#666]'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
