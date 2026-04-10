import { useEffect, useState } from 'react'
import { CheckCircle, MapPin, Clock } from 'lucide-react'
import { useLang } from '../../i18n/LangContext'
import { useMobile } from '../../store/mobileStore.jsx'

const STEPS = [
  { ar: 'تم استلام الطلب', en: 'Order received' },
  { ar: 'جارٍ التحضير', en: 'Preparing' },
  { ar: 'في الطريق إليك', en: 'On the way' },
  { ar: 'تم التسليم', en: 'Delivered' },
]

export default function MobileOrderPlaced() {
  const { isAr } = useLang()
  const { viewData, setActiveTab } = useMobile()
  const [step, setStep] = useState(1)
  const order = viewData?.order

  // Simulate progress
  useEffect(() => {
    const t1 = setTimeout(() => setStep(2), 3000)
    return () => clearTimeout(t1)
  }, [])

  if (!order) return null

  return (
    <div className="bg-[#FBF8F2] min-h-full flex flex-col" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Success Header */}
      <div className="bg-[#0F2A47] px-4 pt-6 pb-8 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mb-3 shadow-lg animate-bounce">
          <CheckCircle size={32} className="text-white" />
        </div>
        <p className="text-white font-black text-lg">{isAr ? 'تم تأكيد طلبك! 🎉' : 'Order Confirmed! 🎉'}</p>
        <p className="text-white/60 text-xs mt-1">#{order.id}</p>
        <div className="flex items-center gap-4 mt-4">
          <div className="text-center">
            <p className="text-white font-black text-sm">{order.total}</p>
            <p className="text-white/50 text-[10px]">{isAr ? 'درهم' : 'AED'}</p>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center">
            <p className="text-white font-black text-sm">~{order.eta}</p>
            <p className="text-white/50 text-[10px]">{isAr ? 'دقيقة' : 'min'}</p>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center">
            <p className="text-white font-black text-sm">{order.emoji}</p>
            <p className="text-white/50 text-[10px]">{isAr ? order.storeAr : order.storeEn}</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mx-3 mt-4 bg-white rounded-2xl p-4 border border-[#E8E4DC] shadow-sm">
        <p className="font-black text-[#0F2A47] text-xs mb-4">{isAr ? 'حالة الطلب' : 'Order Status'}</p>
        <div className="space-y-3">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                i < step ? 'bg-emerald-500' : i === step ? 'bg-[#C8A951] animate-pulse' : 'bg-[#E8E4DC]'
              }`}>
                {i < step
                  ? <CheckCircle size={14} className="text-white" />
                  : <div className="w-2 h-2 rounded-full bg-white" />
                }
              </div>
              <p className={`text-xs font-bold ${i <= step ? 'text-[#0F2A47]' : 'text-[#ccc]'}`}>
                {isAr ? s.ar : s.en}
              </p>
              {i === step && <span className="text-[10px] text-[#C8A951] font-bold ms-auto">{isAr ? 'الآن' : 'Now'}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Map placeholder */}
      <div className="mx-3 mt-3 bg-[#e8f4e8] rounded-2xl h-32 flex items-center justify-center relative overflow-hidden border border-[#d4edda]">
        <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 350 130">
          {[0,30,60,90,120,150,180,210,240,270,300,330,350].map(x => (
            <line key={x} x1={x} y1="0" x2={x} y2="130" stroke="#94a3b8" strokeWidth="0.5"/>
          ))}
          {[0,30,60,90,120,130].map(y => (
            <line key={y} x1="0" y1={y} x2="350" y2={y} stroke="#94a3b8" strokeWidth="0.5"/>
          ))}
          <path d="M50 110 C100 90, 160 70, 220 50 C270 35, 300 30, 310 25" stroke="#0F2A47" strokeWidth="3" fill="none" strokeDasharray="6,3"/>
          <circle cx="50" cy="110" r="6" fill="#2ECC71"/>
          <circle cx="310" cy="25" r="6" fill="#E74C3C"/>
          <circle cx="180" cy="65" r="10" fill="#0F2A47"/>
          <text x="180" y="70" textAnchor="middle" fill="white" fontSize="9">🛵</text>
        </svg>
        <div className="absolute top-2 start-2 bg-white rounded-lg px-2 py-1 shadow text-[10px] font-black text-[#0F2A47]">
          <Clock size={9} className="inline me-1" />
          ~{order.eta} {isAr ? 'دقيقة' : 'min'}
        </div>
      </div>

      {/* Items */}
      <div className="mx-3 mt-3 bg-white rounded-2xl p-4 border border-[#E8E4DC] shadow-sm">
        <p className="font-black text-[#0F2A47] text-xs mb-3">{isAr ? 'تفاصيل الطلب' : 'Order Details'}</p>
        <div className="space-y-2">
          {(order.items || []).map((item, i) => (
            <div key={i} className="flex justify-between text-xs text-[#666]">
              <span>{item.qty}x {isAr ? item.nameAr : item.nameEn}</span>
              <span>{item.price * item.qty} {isAr ? 'د' : 'AED'}</span>
            </div>
          ))}
          <div className="border-t border-[#F0ECE4] pt-2 flex justify-between font-black text-[#0F2A47]">
            <span>{isAr ? 'الإجمالي' : 'Total'}</span>
            <span>{order.total} {isAr ? 'د' : 'AED'}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-3 mt-4 pb-6 flex gap-2">
        <button
          onClick={() => setActiveTab('orders')}
          className="flex-1 py-3 bg-[#0F2A47] text-white font-black text-xs rounded-2xl active:opacity-90"
        >
          {isAr ? 'تتبع الطلب' : 'Track Order'}
        </button>
        <button
          onClick={() => setActiveTab('home')}
          className="flex-1 py-3 bg-white text-[#0F2A47] font-black text-xs rounded-2xl border border-[#E8E4DC] active:bg-[#FBF8F2]"
        >
          {isAr ? 'الرئيسية' : 'Back Home'}
        </button>
      </div>
    </div>
  )
}
