import { useState } from 'react'
import { MapPin, Navigation, Clock, ArrowLeft, Phone, MessageCircle, X } from 'lucide-react'
import { useLang } from '../../i18n/LangContext'
import { useMobile } from '../../store/mobileStore.jsx'

const RIDE_TYPES = [
  { id: 'economy', emoji: '🚗', labelAr: 'اقتصادي', labelEn: 'Economy', etaEn: '4 min', etaAr: '٤ دق', fare: 12 },
  { id: 'comfort', emoji: '🚙', labelAr: 'مريح', labelEn: 'Comfort',   etaEn: '6 min', etaAr: '٦ دق', fare: 19 },
  { id: 'premium', emoji: '🚘', labelAr: 'بريميوم', labelEn: 'Premium', etaEn: '8 min', etaAr: '٨ دق', fare: 31 },
  { id: 'xl',      emoji: '🚐', labelAr: 'XL', labelEn: 'XL',           etaEn: '10 min',etaAr: '١٠ دق',fare: 36 },
]

export default function MobileTaxi() {
  const [selected, setSelected] = useState('economy')
  const [booked, setBooked] = useState(false)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [callModal, setCallModal] = useState(false)
  const { isAr } = useLang()
  const { walletBalance } = useMobile()

  const ride = RIDE_TYPES.find(r => r.id === selected)
  const canBook = from.trim() || to.trim()

  if (booked) return (
    <div className="bg-[#FBF8F2] min-h-full" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Map */}
      <div className="relative bg-[#d4edda] h-56 flex items-center justify-center overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 390 230">
          {[0,30,60,90,120,150,180,210,240,270,300,330,360,390].map(x=>(
            <line key={x} x1={x} y1="0" x2={x} y2="230" stroke="#94a3b8" strokeWidth="0.5"/>
          ))}
          {[0,30,60,90,120,150,180,210,230].map(y=>(
            <line key={y} x1="0" y1={y} x2="390" y2={y} stroke="#94a3b8" strokeWidth="0.5"/>
          ))}
          <path d="M60 200 C110 170, 170 140, 230 100 C290 60, 330 45, 340 30" stroke="#0F2A47" strokeWidth="3" fill="none" strokeDasharray="7,4"/>
          <circle cx="60" cy="200" r="8" fill="#2ECC71"/>
          <circle cx="340" cy="30" r="8" fill="#E74C3C"/>
          <circle cx="200" cy="118" r="14" fill="#0F2A47"/>
          <text x="200" y="124" textAnchor="middle" fill="white" fontSize="11">{ride.emoji}</text>
        </svg>
        <div className="absolute top-3 start-3 bg-white rounded-xl px-3 py-1.5 shadow text-xs font-black text-[#0F2A47]">
          {isAr ? `السائق على بُعد ${ride.etaAr}` : `Driver ${ride.etaEn} away`}
        </div>
        <button
          onClick={() => setBooked(false)}
          className="absolute top-3 end-3 bg-white rounded-xl px-3 py-1.5 shadow text-xs font-black text-red-600 active:bg-red-50"
        >
          {isAr ? 'إلغاء' : 'Cancel'}
        </button>
      </div>

      {/* Driver Card */}
      <div className="p-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#E8E4DC]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#FBF8F2] rounded-full flex items-center justify-center text-2xl border border-[#E8E4DC]">
              👨‍✈️
            </div>
            <div className="flex-1">
              <p className="font-black text-[#222] text-sm">{isAr ? 'أحمد الراشدي' : 'Ahmed Al Rashidi'}</p>
              <p className="text-xs text-[#666]">⭐ 4.94 · {isAr ? 'تويوتا كامري' : 'Toyota Camry'}</p>
            </div>
            <div className="text-end">
              <p className="font-black text-[#0F2A47] text-base">{ride.fare}</p>
              <p className="text-[10px] text-[#999]">{isAr ? 'درهم' : 'AED'}</p>
            </div>
          </div>
          <div className="bg-[#0F2A47] text-white text-center rounded-xl py-2 mt-3 text-sm font-black tracking-widest">
            DXB 3421
          </div>
          {/* Animated progress */}
          <div className="mt-3 h-1.5 bg-[#E8E4DC] rounded-full overflow-hidden">
            <div className="h-full bg-[#0F2A47] rounded-full animate-pulse" style={{ width: '40%' }} />
          </div>
          <p className="text-[10px] text-[#999] mt-1 text-center">{isAr ? 'السائق في الطريق إليك' : 'Driver is on the way'}</p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setCallModal(true)}
              className="flex-1 py-2.5 bg-[#FBF8F2] text-[#0F2A47] text-xs rounded-xl border border-[#E8E4DC] font-black flex items-center justify-center gap-1.5 active:bg-[#F0ECE4]"
            >
              <Phone size={13} /> {isAr ? 'اتصال' : 'Call'}
            </button>
            <button className="flex-1 py-2.5 bg-[#FBF8F2] text-[#0F2A47] text-xs rounded-xl border border-[#E8E4DC] font-black flex items-center justify-center gap-1.5 active:bg-[#F0ECE4]">
              <MessageCircle size={13} /> {isAr ? 'رسالة' : 'Message'}
            </button>
          </div>
        </div>
      </div>

      {/* Call Modal */}
      {callModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setCallModal(false)} />
          <div className="relative bg-white rounded-3xl p-6 mx-6 text-center shadow-2xl">
            <div className="text-4xl mb-3">📞</div>
            <p className="font-black text-[#0F2A47]">{isAr ? 'أحمد الراشدي' : 'Ahmed Al Rashidi'}</p>
            <p className="text-sm text-[#666] mt-1 mb-6">+971 50 123 4567</p>
            <div className="flex gap-3">
              <button
                onClick={() => setCallModal(false)}
                className="flex-1 py-2.5 bg-[#F0ECE4] text-[#444] font-black rounded-xl text-sm"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={() => setCallModal(false)}
                className="flex-1 py-2.5 bg-emerald-500 text-white font-black rounded-xl text-sm"
              >
                {isAr ? 'اتصال' : 'Call'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="bg-[#FBF8F2] min-h-full" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="bg-[#0F2A47] px-4 pt-2 pb-4">
        <h2 className="text-white font-black text-base">{isAr ? 'احجز رحلة' : 'Book a Ride'}</h2>
        <p className="text-white/50 text-xs mt-0.5">{isAr ? 'رحلات سريعة وآمنة' : 'Fast, safe rides across UAE'}</p>
      </div>

      {/* Map */}
      <div className="mx-3 mt-3 bg-[#e8f4e8] rounded-2xl h-36 relative overflow-hidden border border-[#d4edda]">
        <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 350 150">
          {[0,30,60,90,120,150,180,210,240,270,300,330,350].map(x=>(
            <line key={x} x1={x} y1="0" x2={x} y2="150" stroke="#94a3b8" strokeWidth="0.5"/>
          ))}
          {[0,30,60,90,120,150].map(y=>(
            <line key={y} x1="0" y1={y} x2="350" y2={y} stroke="#94a3b8" strokeWidth="0.5"/>
          ))}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-xs text-[#0F2A47] font-black">📍 {isAr ? 'أدخل المواقع أدناه' : 'Enter locations below'}</p>
        </div>
        <button className="absolute top-2 end-2 bg-white rounded-lg px-2 py-1 text-[10px] font-black text-[#0F2A47] shadow">
          {isAr ? 'الموقع الحالي' : 'My location'}
        </button>
      </div>

      {/* Location Inputs */}
      <div className="px-3 mt-3 space-y-2">
        <div className="flex items-center gap-3 bg-white rounded-xl px-3 py-3 shadow-sm border border-[#E8E4DC]">
          <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0" />
          <input
            value={from}
            onChange={e => setFrom(e.target.value)}
            placeholder={isAr ? 'موقعك الحالي' : 'Your location'}
            className="flex-1 outline-none text-xs text-[#222] bg-transparent"
            dir={isAr ? 'rtl' : 'ltr'}
          />
          <button onClick={() => setFrom(isAr ? 'دبي مارينا' : 'Dubai Marina')} className="active:opacity-70">
            <Navigation size={13} className="text-[#C8A951]" />
          </button>
        </div>
        <div className="flex items-center gap-3 bg-white rounded-xl px-3 py-3 shadow-sm border border-[#E8E4DC]">
          <div className="w-3 h-3 rounded-full bg-[#0F2A47] flex-shrink-0" />
          <input
            value={to}
            onChange={e => setTo(e.target.value)}
            placeholder={isAr ? 'الوجهة؟' : 'Where to?'}
            className="flex-1 outline-none text-xs text-[#222] bg-transparent"
            dir={isAr ? 'rtl' : 'ltr'}
          />
          {to && (
            <button onClick={() => setTo('')}><X size={12} className="text-[#999]" /></button>
          )}
        </div>
      </div>

      {/* Quick Destinations */}
      <div className="px-3 mt-2">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { ar: 'المطار', en: 'Airport', emoji: '✈️' },
            { ar: 'مول الإمارات', en: 'Mall of Emirates', emoji: '🏬' },
            { ar: 'برج خليفة', en: 'Burj Khalifa', emoji: '🏙️' },
            { ar: 'دبي مول', en: 'Dubai Mall', emoji: '🛍️' },
          ].map(dest => (
            <button
              key={dest.en}
              onClick={() => setTo(isAr ? dest.ar : dest.en)}
              className="flex items-center gap-1.5 bg-white rounded-xl px-3 py-2 text-[10px] font-black text-[#0F2A47] border border-[#E8E4DC] whitespace-nowrap active:bg-[#FBF8F2] flex-shrink-0"
            >
              <span>{dest.emoji}</span>
              <span>{isAr ? dest.ar : dest.en}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Ride Types */}
      <div className="px-3 mt-3">
        <p className="text-xs font-black text-[#0F2A47] mb-2">{isAr ? 'اختر نوع الرحلة' : 'Choose Ride'}</p>
        <div className="grid grid-cols-2 gap-2">
          {RIDE_TYPES.map(rt => (
            <button
              key={rt.id}
              onClick={() => setSelected(rt.id)}
              className={"p-3 rounded-xl border text-start transition-all " +
                (selected === rt.id ? 'border-[#0F2A47] bg-[#0F2A47]/5' : 'border-[#E8E4DC] bg-white')}
            >
              <span className="text-2xl">{rt.emoji}</span>
              <p className="font-black text-xs text-[#222] mt-1">{isAr ? rt.labelAr : rt.labelEn}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-[#666] flex items-center gap-0.5">
                  <Clock size={9}/> {isAr ? rt.etaAr : rt.etaEn}
                </span>
                <span className="text-xs font-black text-[#0F2A47]">{rt.fare} {isAr ? 'د' : 'AED'}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Wallet info */}
      <div className="px-3 mt-3">
        <div className="bg-[#0F2A47]/5 rounded-xl px-3 py-2 flex items-center justify-between">
          <span className="text-xs text-[#0F2A47]">💳 {isAr ? 'محفظة SUMU' : 'SUMU Wallet'}</span>
          <span className="text-xs font-black text-[#0F2A47]">{walletBalance} {isAr ? 'د' : 'AED'}</span>
        </div>
      </div>

      <div className="px-3 mt-4 pb-4">
        <button
          onClick={() => { if (canBook || true) setBooked(true) }}
          className="w-full py-3.5 bg-[#0F2A47] text-white font-black text-sm rounded-2xl shadow-lg active:opacity-90"
        >
          {isAr ? `تأكيد الرحلة — ${ride.fare} درهم` : `Confirm Ride — ${ride.fare} AED`}
        </button>
      </div>
    </div>
  )
}
