import { useState, useEffect } from 'react'
import { Clock, Package, ChevronRight, MapPin, Star, RotateCcw, ShoppingBag } from 'lucide-react'
import { useAuth } from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import Badge from '../components/Badge'
import { useLang } from '../i18n/LangContext'
import api from '../services/api'

function getL(lang, en, th, lo, vi) {
  if (lang === 'th') return th || en
  if (lang === 'lo') return lo || en
  if (lang === 'vi') return vi || en
  return en
}


const steps = ['pending', 'accepted', 'preparing', 'on_the_way', 'delivered']
const stepsEn = ['Pending', 'Accepted', 'Preparing', 'On the way', 'Delivered']
const stepsAr = ['قيد الانتظار', 'تم القبول', 'جاري التحضير', 'في الطريق', 'تم التوصيل']

export default function WebOrders() {
  const [activeTab, setActiveTab] = useState('all')
  const [expanded, setExpanded] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [reviewOrderId, setReviewOrderId] = useState(null)
  const [rating, setRating] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const { t, isAr, lang } = useLang()
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => { console.log("currentUser:", currentUser);
    
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('yuta_token')
        const res = await fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()); const data = Array.isArray(res) ? res : []; setOrders(data); setLoading(false); return
        setOrders(Array.isArray(res.data) ? res.data : res.data.orders || res.data.data || [])
      } catch {}
      setLoading(false)
    }
    fetchOrders()
  }, [currentUser])

  const handleReorder = async (order) => {
    // إضافة نفس الطلب مرة أخرى
    try {
      const token = localStorage.getItem('yuta_token')
      await api.post('/api/orders', {
        store_id: order.store_id,
        items: order.items,
        total: order.total,
        address: order.address,
      }, { headers: { Authorization: `Bearer ${token}` } })
      alert(isAr ? 'تم إعادة الطلب بنجاح!' : 'Order placed successfully!')
      const res = await api.get('/api/orders', { headers: { Authorization: `Bearer ${token}` } })
      setOrders(Array.isArray(res.data) ? res.data : res.data.orders || res.data.data || [])
    } catch {
      alert(isAr ? 'حدث خطأ' : 'Error occurred')
    }
  }

  const handleReview = async (orderId) => {
    try {
      const token = localStorage.getItem('yuta_token')
      await api.post(`/api/orders/${orderId}/review`, { rating, comment: reviewText }, { headers: { Authorization: `Bearer ${token}` } })
      setReviewOrderId(null)
      setReviewText('')
      setRating(5)
      alert(isAr ? 'شكراً على تقييمك!' : 'Thank you for your review!')
    } catch {
      alert(isAr ? 'حدث خطأ' : 'Error occurred')
    }
  }

  const tabs = [
    { id: 'all', label: t('all') },
    { id: 'active', label: t('active') },
    { id: 'completed', label: t('completed') },
    { id: 'cancelled', label: t('cancelled') },
  ]

  const filtered = orders.filter(o => {
    if (activeTab === 'all') return true
    if (activeTab === 'active') return ['pending', 'accepted', 'preparing', 'on_the_way'].includes(o.status)
    if (activeTab === 'completed') return ['completed', 'delivered'].includes(o.status)
    if (activeTab === 'cancelled') return o.status === 'cancelled'
    return true
  })

  const getActiveStep = (status) => steps.indexOf(status)

  if (loading) return (
    <div className="min-h-screen bg-[#F0F9F8] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#00C9A7] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F0F9F8]" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="bg-[#0D1B4B] py-7 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-black text-white">{t('myOrders')}</h1>
          <p className="text-white/50 text-sm mt-1">{getL(lang, `${orders.length} orders`, `${orders.length} รายการ`, `${orders.length} ລາຍການ`, `${orders.length} đơn`)}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-5">
        <div className="flex gap-1 mb-5 bg-white rounded-2xl p-1 shadow-sm border border-[#D0EDEA]">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 rounded-xl text-sm font-black transition-all ${activeTab === tab.id ? 'bg-[#0D1B4B] text-white shadow' : 'text-[#888]'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-400 font-semibold">{getL(lang,'No orders yet','ยังไม่มีคำสั่งซื้อ','ຍັງບໍ່ມີ','Chưa có đơn')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(order => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-[#D0EDEA] overflow-hidden">
                <button onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                  className="w-full flex items-center gap-3 px-4 py-4 text-right">
                  <div className="w-10 h-10 bg-[#F0F9F8] rounded-xl flex items-center justify-center text-xl">
                    🛍️
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-[#222] text-sm">{order.store_id || (getL(lang,'Store','ร้านค้า','ຮ້ານ','Cửa hàng'))}</p>
                    <p className="text-xs text-[#888]">{order.created_at?.split('T')[0]}</p>
                  </div>
                  <div className="text-left">
                    <Badge status={order.status} />
                    <p className="text-xs font-black text-[#0D1B4B] mt-1">{order.total} {getL(lang,'SAR','บาท','ກີບ','VND')}</p>
                  </div>
                  <ChevronRight size={16} className="text-[#00C9A7]" style={{ transform: expanded === order.id ? 'rotate(90deg)' : isAr ? 'rotate(180deg)' : undefined }} />
                </button>

                {expanded === order.id && (
                  <div className="px-4 pb-4 border-t border-[#F0ECE4]">
                    {/* Progress */}
                    {!['cancelled', 'completed'].includes(order.status) && (
                      <div className="flex items-center gap-1 my-4 overflow-x-auto">
                        {steps.map((step, i) => (
                          <div key={step} className="flex items-center gap-1 flex-shrink-0">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${i <= getActiveStep(order.status) ? 'bg-[#00C9A7] text-white' : 'bg-[#D0EDEA] text-[#999]'}`}>{i + 1}</div>
                            <span className={`text-[10px] font-semibold ${i <= getActiveStep(order.status) ? 'text-[#00C9A7]' : 'text-[#999]'}`}>{isAr ? stepsAr[i] : stepsEn[i]}</span>
                            {i < steps.length - 1 && <div className={`w-4 h-0.5 ${i < getActiveStep(order.status) ? 'bg-[#00C9A7]' : 'bg-[#D0EDEA]'}`} />}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Items */}
                    <div className="space-y-1 mb-4">
                      {(Array.isArray(order.items) ? order.items : []).map((item, i) => (
                        <p key={i} className="text-sm text-[#555] font-semibold flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-[#00C9A7] rounded-full flex-shrink-0"></span>
                          {typeof item === 'object' ? (item.nameAr || item.nameEn || item.name || '') : item}
                        </p>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-wrap">
                      {['completed', 'delivered'].includes(order.status) && (
                        <>
                          <button onClick={() => handleReorder(order)}
                            className="flex items-center gap-1.5 px-3 py-2 bg-[#0D1B4B] text-white text-xs font-bold rounded-xl">
                            <RotateCcw size={12} /> {isAr ? 'إعادة الطلب' : 'Reorder'}
                          </button>
                          <button onClick={() => setReviewOrderId(order.id)}
                            className="flex items-center gap-1.5 px-3 py-2 bg-[#F0F9F8] text-[#444] text-xs font-bold rounded-xl border border-[#D0EDEA]">
                            <Star size={12} /> {isAr ? 'تقييم' : 'Rate'}
                          </button>
                        </>
                      )}
                    </div>

                    {/* Review Form */}
                    {reviewOrderId === order.id && (
                      <div className="mt-4 p-4 bg-[#F0F9F8] rounded-xl border border-[#D0EDEA]">
                        <p className="font-black text-sm mb-3">{isAr ? 'قيّم طلبك' : 'Rate your order'}</p>
                        <div className="flex gap-2 mb-3">
                          {[1,2,3,4,5].map(s => (
                            <button key={s} onClick={() => setRating(s)}>
                              <Star size={24} className={s <= rating ? 'fill-[#00C9A7] text-[#00C9A7]' : 'text-gray-300'} />
                            </button>
                          ))}
                        </div>
                        <textarea value={reviewText} onChange={e => setReviewText(e.target.value)}
                          placeholder={isAr ? 'اكتب تعليقك...' : 'Write your comment...'}
                          className="w-full border border-[#D0EDEA] rounded-xl px-3 py-2 text-sm mb-3 resize-none" rows={3} />
                        <div className="flex gap-2">
                          <button onClick={() => handleReview(order.id)}
                            className="flex-1 bg-[#00C9A7] text-white font-bold py-2 rounded-xl text-sm">
                            {isAr ? 'إرسال' : 'Submit'}
                          </button>
                          <button onClick={() => setReviewOrderId(null)}
                            className="px-4 bg-gray-100 text-gray-600 font-bold py-2 rounded-xl text-sm">
                            {getL(lang,'Cancel','ยกเลิก','ຍົກເລີກ','Hủy')}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
