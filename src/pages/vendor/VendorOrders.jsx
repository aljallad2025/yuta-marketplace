import { useState } from 'react'
import { Search, ChevronDown, ChevronUp, Phone, MapPin, Clock, Package } from 'lucide-react'
import { useLang } from '../../i18n/LangContext'
import { useApp } from '../../store/appStore'
import { useAuth } from '../../store/authStore'
import Badge from '../../components/Badge'

const statusMap = {
  pending:    { ar: 'قيد الانتظار', en: 'Pending',    color: 'pending',    next: 'preparing', nextAr: 'قبول وتحضير', nextEn: 'Accept & Prepare' },
  accepted:   { ar: 'مقبول',        en: 'Accepted',   color: 'accepted',   next: 'preparing', nextAr: 'بدء التحضير', nextEn: 'Start Preparing' },
  preparing:  { ar: 'يتحضر',        en: 'Preparing',  color: 'preparing',  next: 'accepted',  nextAr: 'جاهز للتوصيل', nextEn: 'Ready for Pickup' },
  on_the_way: { ar: 'في الطريق',    en: 'On the Way', color: 'on_the_way', next: null },
  completed:  { ar: 'مكتمل',        en: 'Completed',  color: 'completed',  next: null },
  cancelled:  { ar: 'ملغي',         en: 'Cancelled',  color: 'cancelled',  next: null },
}

export default function VendorOrders() {
  const { isAr } = useLang()
  const { currentUser } = useAuth()
  const activeVendorId = currentUser?.storeId || currentUser?.store_id || 1
  const { getStoreOrders, updateOrderStatus } = useApp()
  const orders = getStoreOrders(activeVendorId)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [expanded, setExpanded] = useState(null)

  const filtered = orders.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
      (isAr ? o.customerNameAr : o.customerNameEn).toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    return matchSearch && matchStatus
  })

  const tabs = [
    { key: 'all', ar: 'الكل', en: 'All', count: orders.length },
    { key: 'pending', ar: 'انتظار', en: 'Pending', count: orders.filter(o => o.status === 'pending').length },
    { key: 'preparing', ar: 'تحضير', en: 'Preparing', count: orders.filter(o => o.status === 'preparing').length },
    { key: 'on_the_way', ar: 'في الطريق', en: 'On Way', count: orders.filter(o => o.status === 'on_the_way').length },
    { key: 'completed', ar: 'مكتمل', en: 'Completed', count: orders.filter(o => o.status === 'completed').length },
    { key: 'cancelled', ar: 'ملغي', en: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length },
  ]

  return (
    <div className="p-6" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="mb-6">
        <h1 className="text-xl font-black text-[#0D1B4B]">{isAr ? 'إدارة الطلبات' : 'Order Management'}</h1>
        <p className="text-sm text-[#888] mt-0.5">{filtered.length} {isAr ? 'طلب' : 'orders'}</p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setStatusFilter(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
              statusFilter === tab.key ? 'bg-[#0D1B4B] text-white' : 'bg-white border border-[#D0EDEA] text-[#666] hover:bg-[#F0F9F8]'
            }`}>
            {isAr ? tab.ar : tab.en}
            {tab.count > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${statusFilter === tab.key ? 'bg-white/20 text-white' : 'bg-[#F0ECE4] text-[#666]'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center bg-white border border-[#D0EDEA] rounded-xl px-3 py-2.5 gap-2 mb-4 max-w-sm">
        <Search size={14} className="text-[#999]" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder={isAr ? 'بحث باسم العميل أو رقم الطلب...' : 'Search by customer or order ID...'}
          className="flex-1 outline-none text-sm bg-transparent" dir={isAr ? 'rtl' : 'ltr'} />
      </div>

      {/* Orders list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#D0EDEA]">
            <div className="text-4xl mb-3">📋</div>
            <p className="font-black text-[#444]">{isAr ? 'لا توجد طلبات' : 'No orders found'}</p>
          </div>
        ) : filtered.map(order => (
          <div key={order.id} className={`bg-white rounded-2xl border-2 overflow-hidden transition-all ${
            order.status === 'pending' ? 'border-amber-300' : 'border-[#D0EDEA]'
          }`}>
            {/* Order header */}
            <div className="p-4 flex items-center gap-3">
              {/* Urgent indicator */}
              {order.status === 'pending' && (
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse flex-shrink-0"></div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-black text-[#0D1B4B] text-sm">{order.id}</span>
                  <Badge variant={statusMap[order.status]?.color || 'pending'}>
                    {isAr ? statusMap[order.status]?.ar : statusMap[order.status]?.en}
                  </Badge>
                </div>
                <p className="text-sm text-[#444] mt-0.5">{isAr ? order.customerNameAr : order.customerNameEn}</p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1 text-xs text-[#888]">
                    <Clock size={10} />
                    {new Date(order.createdAt).toLocaleTimeString(isAr ? 'ar-AE' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <span className="text-xs text-[#888]">{order.items.length} {isAr ? 'عناصر' : 'items'}</span>
                </div>
              </div>
              <div className="text-end flex-shrink-0">
                <p className="font-black text-[#0D1B4B] text-lg">{order.total}</p>
                <p className="text-xs text-[#888]">{isAr ? 'درهم' : 'AED'}</p>
              </div>
              <button onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                className="p-2 rounded-xl hover:bg-[#F0F9F8] text-[#888]">
                {expanded === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            {/* Expanded details */}
            {expanded === order.id && (
              <div className="border-t border-[#F0ECE4] px-4 py-4 bg-[#F0F9F8]/50">
                {/* Items */}
                <div className="mb-4">
                  <p className="text-xs font-black text-[#666] uppercase mb-2">{isAr ? 'المنتجات' : 'Items'}</p>
                  <div className="space-y-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between bg-white rounded-xl p-3 border border-[#D0EDEA]">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-[#0D1B4B]/10 rounded-lg flex items-center justify-center text-xs font-black text-[#0D1B4B]">{item.qty}x</span>
                          <span className="text-sm font-black text-[#222]">{isAr ? item.nameAr : item.nameEn}</span>
                        </div>
                        <span className="text-sm font-black text-[#00C9A7]">{item.price * item.qty} {isAr ? 'د' : 'AED'}</span>
                      </div>
                    ))}
                  </div>
                  {/* Total breakdown */}
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-xs text-[#666]">
                      <span>{isAr ? 'المجموع الفرعي' : 'Subtotal'}</span>
                      <span className="font-black">{order.subtotal} {isAr ? 'د' : 'AED'}</span>
                    </div>
                    <div className="flex justify-between text-xs text-[#666]">
                      <span>{isAr ? 'رسوم التوصيل' : 'Delivery Fee'}</span>
                      <span className="font-black">{order.deliveryFee} {isAr ? 'د' : 'AED'}</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-[#0D1B4B] pt-1 border-t border-[#D0EDEA]">
                      <span>{isAr ? 'الإجمالي' : 'Total'}</span>
                      <span>{order.total} {isAr ? 'درهم' : 'AED'}</span>
                    </div>
                  </div>
                </div>

                {/* Customer info */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white rounded-xl p-3 border border-[#D0EDEA]">
                    <p className="text-xs font-black text-[#666] mb-1">{isAr ? 'معلومات العميل' : 'Customer Info'}</p>
                    <p className="text-sm font-black text-[#222]">{isAr ? order.customerNameAr : order.customerNameEn}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Phone size={11} className="text-[#888]" />
                      <span className="text-xs text-[#666]">{order.customerPhone}</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-[#D0EDEA]">
                    <p className="text-xs font-black text-[#666] mb-1">{isAr ? 'عنوان التوصيل' : 'Delivery Address'}</p>
                    <div className="flex items-start gap-1">
                      <MapPin size={11} className="text-[#00C9A7] mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-[#444]">{isAr ? order.addressAr : order.addressEn}</span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {order.notes && (
                  <div className="mb-4 bg-amber-50 rounded-xl p-3 border border-amber-200">
                    <p className="text-xs font-black text-amber-700 mb-1">📝 {isAr ? 'ملاحظات' : 'Notes'}</p>
                    <p className="text-sm text-amber-800">{order.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 flex-wrap">
                  {order.status === 'pending' && (
                    <>
                      <button onClick={() => updateOrderStatus(order.id, 'preparing')}
                        className="flex-1 py-2.5 bg-[#0D1B4B] text-white text-sm font-black rounded-xl hover:bg-[#0A3D8F]">
                        ✓ {isAr ? 'قبول وتحضير' : 'Accept & Prepare'}
                      </button>
                      <button onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        className="px-4 py-2.5 bg-red-50 text-red-600 text-sm font-black rounded-xl border border-red-200 hover:bg-red-100">
                        {isAr ? 'رفض' : 'Decline'}
                      </button>
                    </>
                  )}
                  {order.status === 'preparing' && (
                    <button onClick={() => updateOrderStatus(order.id, 'accepted')}
                      className="flex-1 py-2.5 bg-emerald-600 text-white text-sm font-black rounded-xl hover:bg-emerald-700">
                      🚀 {isAr ? 'جاهز للاستلام' : 'Ready for Pickup'}
                    </button>
                  )}
                  {(order.status === 'accepted' || order.status === 'on_the_way') && (
                    <div className="w-full bg-blue-50 rounded-xl p-3 flex items-center gap-2 border border-blue-200">
                      <Package size={16} className="text-blue-600" />
                      <span className="text-sm font-black text-blue-700">
                        {isAr ? 'جاري التوصيل...' : 'Out for delivery...'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
