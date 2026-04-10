import { useState } from 'react'
import { Clock, Package, ChevronRight, Star, X } from 'lucide-react'
import { useLang } from '../../i18n/LangContext'
import { useMobile } from '../../store/mobileStore.jsx'

const STATUS_CONFIG = {
  on_the_way: { ar: 'في الطريق', en: 'On the way', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  preparing:  { ar: 'قيد التحضير', en: 'Preparing', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  pending:    { ar: 'قيد الانتظار', en: 'Pending',  color: 'bg-gray-50 text-gray-600 border-gray-200' },
  completed:  { ar: 'مكتمل', en: 'Completed',        color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  cancelled:  { ar: 'ملغي', en: 'Cancelled',          color: 'bg-red-50 text-red-600 border-red-200' },
}

export default function MobileOrders() {
  const [tab, setTab] = useState('all')
  const [ratingOrder, setRatingOrder] = useState(null)
  const [rating, setRating] = useState(0)
  const { isAr } = useLang()
  const { orders, reorder } = useMobile()

  const tabs = [
    { key: 'all', ar: 'الكل', en: 'All' },
    { key: 'active', ar: 'نشط', en: 'Active' },
    { key: 'done', ar: 'مكتمل', en: 'Done' },
  ]

  const filtered = orders.filter(o => {
    if (tab === 'active') return ['on_the_way', 'preparing', 'pending'].includes(o.status)
    if (tab === 'done') return ['completed', 'cancelled'].includes(o.status)
    return true
  })

  const formatDate = (iso) => {
    const d = new Date(iso)
    const now = new Date()
    const diff = now - d
    if (diff < 86400000) return isAr ? 'اليوم' : 'Today'
    if (diff < 172800000) return isAr ? 'أمس' : 'Yesterday'
    return d.toLocaleDateString(isAr ? 'ar-AE' : 'en-AE', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="bg-[#FBF8F2] min-h-full" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="bg-[#0F2A47] px-4 pt-2 pb-4">
        <h2 className="text-white font-black text-base mb-3">{isAr ? 'طلباتي' : 'My Orders'}</h2>
        <div className="flex gap-1 bg-white/10 rounded-xl p-1">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={"flex-1 py-1.5 rounded-lg text-xs font-black transition-all " +
                (tab === t.key ? 'bg-white text-[#0F2A47]' : 'text-white/70')}
            >
              {isAr ? t.ar : t.en}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3 space-y-2.5">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <Package size={40} className="text-[#E8E4DC] mx-auto mb-3" />
            <p className="text-sm font-bold text-[#999]">{isAr ? 'لا توجد طلبات' : 'No orders here'}</p>
          </div>
        ) : filtered.map(order => {
          const st = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
          const isActive = ['on_the_way', 'preparing', 'pending'].includes(order.status)
          return (
            <div key={order.id} className="bg-white rounded-2xl p-3 shadow-sm border border-[#E8E4DC]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FBF8F2] rounded-xl flex items-center justify-center text-xl flex-shrink-0 border border-[#F0ECE4]">
                  {order.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-black text-[#222] text-xs truncate">{isAr ? order.storeAr : order.storeEn}</p>
                    <span className={"text-[9px] px-2 py-0.5 rounded-full border font-bold flex-shrink-0 " + st.color}>
                      {isAr ? st.ar : st.en}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#666] mt-0.5">{order.id} · {formatDate(order.date)}</p>
                </div>
              </div>

              {isActive && (
                <div className="mt-3 bg-[#0F2A47]/5 rounded-xl p-2.5 flex items-center gap-2">
                  <Clock size={12} className="text-[#0F2A47]" />
                  <p className="text-xs text-[#0F2A47] font-black">
                    {isAr ? `يصل خلال ~${order.eta} دقيقة` : `Arriving in ~${order.eta} min`}
                  </p>
                  {/* Progress bar */}
                  <div className="flex-1 h-1.5 bg-[#E8E4DC] rounded-full ms-2">
                    <div className="h-full bg-[#0F2A47] rounded-full" style={{ width: order.status === 'on_the_way' ? '70%' : '30%' }} />
                  </div>
                </div>
              )}

              {/* Items preview */}
              {order.items && order.items.length > 0 && (
                <div className="mt-2 text-[10px] text-[#999]">
                  {order.items.slice(0, 2).map((item, i) => (
                    <span key={i}>{i > 0 ? ' · ' : ''}{item.qty}x {isAr ? item.nameAr : item.nameEn}</span>
                  ))}
                  {order.items.length > 2 && <span> +{order.items.length - 2} {isAr ? 'أكثر' : 'more'}</span>}
                </div>
              )}

              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#F0ECE4]">
                <p className="font-black text-[#0F2A47] text-sm">{order.total} <span className="text-[10px] font-normal text-[#999]">{isAr ? 'د' : 'AED'}</span></p>
                <div className="flex gap-1.5">
                  {order.status === 'completed' && (
                    <>
                      <button
                        onClick={() => reorder(order)}
                        className="px-2.5 py-1.5 bg-[#0F2A47] text-white text-[10px] rounded-xl font-black active:opacity-80"
                      >
                        {isAr ? 'إعادة الطلب' : 'Reorder'}
                      </button>
                      <button
                        onClick={() => setRatingOrder(order)}
                        className="px-2.5 py-1.5 bg-[#FBF8F2] text-[#444] text-[10px] rounded-xl border border-[#E8E4DC] font-black active:bg-[#F0ECE4]"
                      >
                        {isAr ? 'تقييم' : 'Rate'}
                      </button>
                    </>
                  )}
                  {isActive && (
                    <button className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 text-[10px] rounded-xl border border-emerald-200 font-black flex items-center gap-1">
                      <Clock size={10} /> {isAr ? 'تتبع مباشر' : 'Track'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Rating Modal */}
      {ratingOrder && (
        <div className="fixed inset-0 z-50 flex items-end" dir={isAr ? 'rtl' : 'ltr'}>
          <div className="absolute inset-0 bg-black/40" onClick={() => { setRatingOrder(null); setRating(0) }} />
          <div className="relative w-full bg-white rounded-t-3xl p-6">
            <button onClick={() => { setRatingOrder(null); setRating(0) }} className="absolute top-4 end-4">
              <X size={18} className="text-[#999]" />
            </button>
            <p className="font-black text-[#0F2A47] text-sm mb-1">{isAr ? 'كيف كانت تجربتك؟' : 'How was your experience?'}</p>
            <p className="text-xs text-[#999] mb-4">{isAr ? ratingOrder.storeAr : ratingOrder.storeEn}</p>
            <div className="flex justify-center gap-3 mb-6">
              {[1,2,3,4,5].map(i => (
                <button key={i} onClick={() => setRating(i)}>
                  <Star size={32} className={i <= rating ? 'fill-[#C8A951] text-[#C8A951]' : 'text-[#E8E4DC]'} />
                </button>
              ))}
            </div>
            <button
              disabled={rating === 0}
              onClick={() => { setRatingOrder(null); setRating(0) }}
              className="w-full py-3 bg-[#0F2A47] text-white font-black rounded-2xl text-sm disabled:opacity-40"
            >
              {isAr ? 'إرسال التقييم' : 'Submit Rating'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
