import { useState } from 'react'
import { Search, Eye, Edit2, X } from 'lucide-react'
import Badge from '../../components/Badge'
import { useLang } from '../../i18n/LangContext'
import { useApp } from '../../store/appStore'
import { useStores } from '../../store/storesStore'

const statusOptions = ['all', 'pending', 'accepted', 'preparing', 'on_the_way', 'completed', 'cancelled']

export default function AdminOrders() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [selected, setSelected] = useState(null)
  const { t, isAr } = useLang()
  const { orders, updateOrderStatus, drivers } = useApp()
  const { stores } = useStores()

  const getStoreName = (storeId) => {
    const s = stores.find(st => st.id === storeId)
    return s ? (isAr ? s.nameAr : s.nameEn) : (isAr ? 'متجر' : 'Store')
  }
  const getDriverName = (driverId) => {
    const d = drivers.find(dr => dr.id === driverId)
    return d ? (isAr ? d.nameAr : d.nameEn) : null
  }

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
    ? ['الطلب', 'العميل', 'المتجر', 'السائق', 'الإجمالي', 'الحالة', 'الوقت', 'إجراءات']
    : ['Order', 'Customer', 'Store', 'Driver', 'Total', 'Status', 'Time', 'Actions']

  const filtered = orders.filter(o => {
    const customer = isAr ? o.customerNameAr : o.customerNameEn
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
                        customer.toLowerCase().includes(search.toLowerCase())
    const matchStatus = status === 'all' || o.status === status
    return matchSearch && matchStatus
  })

  const quickStats = [
    { labelEn: 'Pending', labelAr: 'قيد الانتظار', count: orders.filter(o => o.status === 'pending').length, color: '#F39C12' },
    { labelEn: 'Active', labelAr: 'نشط', count: orders.filter(o => ['accepted','preparing','on_the_way'].includes(o.status)).length, color: '#3498DB' },
    { labelEn: 'Completed', labelAr: 'مكتمل', count: orders.filter(o => o.status === 'completed').length, color: '#2ECC71' },
    { labelEn: 'Cancelled', labelAr: 'ملغي', count: orders.filter(o => o.status === 'cancelled').length, color: '#E74C3C' },
  ]

  return (
    <div className="p-6 space-y-5" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#0D1B4B]">{t('orderManagement')}</h1>
          <p className="text-sm text-[#666]">{orders.length} {isAr ? 'طلب إجمالي' : 'total orders'}</p>
        </div>
        <button className="px-4 py-2.5 bg-[#00C9A7] text-[#0D1B4B] text-sm font-black rounded-xl">{t('exportCSV')}</button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {quickStats.map(s => (
          <div key={s.labelEn} className="bg-white rounded-xl p-4 shadow-sm border border-[#D0EDEA] text-center">
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.count}</p>
            <p className="text-xs text-[#666] mt-0.5">{isAr ? s.labelAr : s.labelEn}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center bg-white rounded-xl px-4 py-2.5 gap-2 shadow-sm border border-[#D0EDEA]">
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
                status === s ? 'bg-[#0D1B4B] text-white' : 'bg-white text-[#444] border border-[#D0EDEA]'
              }`}>
              {statusLabel[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#D0EDEA] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F0F9F8] border-b border-[#D0EDEA]">
                {headers.map(h => (
                  <th key={h} className="text-start px-4 py-3.5 text-xs font-black text-[#666] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-10 text-[#999] text-sm">{isAr ? 'لا توجد طلبات' : 'No orders found'}</td></tr>
              ) : filtered.map((order, i) => (
                <tr key={order.id} className={`${i < filtered.length - 1 ? 'border-b border-[#F0ECE4]' : ''} hover:bg-[#F0F9F8] cursor-pointer`}
                  onClick={() => setSelected(selected?.id === order.id ? null : order)}>
                  <td className="px-4 py-3.5">
                    <p className="font-mono font-black text-xs text-[#0D1B4B]">{order.id}</p>
                    <p className="text-[10px] text-[#999]">{order.items?.length || 0} {isAr ? 'عناصر' : 'items'}</p>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-[#444]">{isAr ? order.customerNameAr : order.customerNameEn}</td>
                  <td className="px-4 py-3.5 text-sm text-[#666]">{getStoreName(order.storeId)}</td>
                  <td className="px-4 py-3.5 text-sm">
                    {order.driverId ? (
                      <span className="text-[#444]">{getDriverName(order.driverId) || order.driverId}</span>
                    ) : (
                      <button
                        onClick={e => { e.stopPropagation(); updateOrderStatus(order.id, order.status, 'DRV-002') }}
                        className="text-xs text-[#00C9A7] font-black border border-[#00C9A7]/30 px-2 py-0.5 rounded-full hover:bg-[#00C9A7]/10">
                        {t('assignDriver')}
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3.5 font-black text-sm text-[#222]">{order.total} {isAr ? 'د' : 'SAR'}</td>
                  <td className="px-4 py-3.5"><Badge status={order.status} label={statusLabel[order.status]} /></td>
                  <td className="px-4 py-3.5 text-xs text-[#666] whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleTimeString(isAr ? 'ar-AE' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                      <button className="p-1.5 hover:bg-[#F0F9F8] rounded-lg text-[#666] hover:text-[#0D1B4B]"><Eye size={13} /></button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        className="p-1.5 hover:bg-red-50 rounded-lg text-[#666] hover:text-red-600"><X size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selected && (
          <div className="border-t border-[#D0EDEA] bg-[#F0F9F8] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-[#0D1B4B]">
                {isAr ? `تفاصيل الطلب — ${selected.id}` : `Order Details — ${selected.id}`}
              </h3>
              <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-[#D0EDEA] rounded-lg">
                <X size={15} className="text-[#666]" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div><p className="text-xs text-[#666]">{isAr ? 'العميل' : 'Customer'}</p><p className="font-black text-sm text-[#222]">{isAr ? selected.customerNameAr : selected.customerNameEn}</p></div>
              <div><p className="text-xs text-[#666]">{isAr ? 'المتجر' : 'Store'}</p><p className="font-black text-sm text-[#222]">{getStoreName(selected.storeId)}</p></div>
              <div><p className="text-xs text-[#666]">{isAr ? 'العنوان' : 'Address'}</p><p className="font-black text-sm text-[#222]">{isAr ? selected.addressAr : selected.addressEn}</p></div>
              <div><p className="text-xs text-[#666]">{isAr ? 'الإجمالي' : 'Total'}</p><p className="font-black text-sm text-[#0D1B4B]">{selected.total} {isAr ? 'درهم' : 'SAR'}</p></div>
            </div>
            {/* Items */}
            {selected.items && (
              <div className="mb-4">
                <p className="text-xs font-black text-[#666] mb-2">{isAr ? 'المنتجات' : 'Items'}</p>
                <div className="flex flex-wrap gap-2">
                  {selected.items.map((item, i) => (
                    <span key={i} className="bg-white border border-[#D0EDEA] rounded-xl px-3 py-1.5 text-xs font-black text-[#444]">
                      {item.qty}x {isAr ? item.nameAr : item.nameEn} — {item.price * item.qty} {isAr ? 'د' : 'SAR'}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-2 flex-wrap">
              {selected.status === 'pending' && (
                <button onClick={() => { updateOrderStatus(selected.id, 'preparing'); setSelected(null) }}
                  className="px-3 py-2 text-xs font-black rounded-lg border border-[#D0EDEA] text-[#444] hover:bg-white">
                  {isAr ? 'تحديد: جاري التحضير' : 'Mark Preparing'}
                </button>
              )}
              {!selected.driverId && (
                <button onClick={() => { updateOrderStatus(selected.id, selected.status, 'DRV-002'); setSelected(s => ({ ...s, driverId: 'DRV-002' })) }}
                  className="px-3 py-2 text-xs font-black rounded-lg border border-[#D0EDEA] text-[#444] hover:bg-white">
                  {t('assignDriver')}
                </button>
              )}
              <button onClick={() => { updateOrderStatus(selected.id, 'cancelled'); setSelected(null) }}
                className="px-3 py-2 text-xs font-black rounded-lg border border-red-200 text-red-600 hover:bg-red-50">
                {isAr ? 'إلغاء الطلب' : 'Cancel Order'}
              </button>
            </div>
          </div>
        )}

        <div className="px-5 py-3 border-t border-[#F0ECE4] flex items-center justify-between text-xs text-[#666]">
          <span>{isAr ? `عرض ${filtered.length} من ${orders.length} طلب` : `Showing ${filtered.length} of ${orders.length} orders`}</span>
        </div>
      </div>
    </div>
  )
}
