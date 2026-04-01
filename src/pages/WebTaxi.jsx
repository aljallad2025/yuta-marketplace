import { useState } from 'react'
import { MapPin, Navigation, Car, Clock, Star, ArrowRight } from 'lucide-react'
import { useLang } from '../i18n/LangContext'

const rideTypes = [
  { id: 'economy', emoji: '🚗', basePrice: 3, perKm: 1.2, eta: '4', etaAr: '٤', seats: 4 },
  { id: 'comfort', emoji: '🚙', basePrice: 6, perKm: 1.8, eta: '6', etaAr: '٦', seats: 4 },
  { id: 'premium', emoji: '🚘', basePrice: 10, perKm: 2.5, eta: '8', etaAr: '٨', seats: 4 },
  { id: 'xl', emoji: '🚐', basePrice: 12, perKm: 2.8, eta: '10', etaAr: '١٠', seats: 7 },
]

const recentRides = [
  { fromEn: 'Dubai Mall', fromAr: 'دبي مول', toEn: 'Airport T3', toAr: 'المطار T3', price: 42, typeId: 'economy' },
  { fromEn: 'JBR Beach', fromAr: 'شاطئ JBR', toEn: 'Mall of Emirates', toAr: 'مول الإمارات', price: 28, typeId: 'comfort' },
  { fromEn: 'Business Bay', fromAr: 'خليج الأعمال', toEn: 'Palm Jumeirah', toAr: 'نخلة جميرا', price: 35, typeId: 'economy' },
]

export default function WebTaxi() {
  const [selectedRide, setSelectedRide] = useState('economy')
  const [step, setStep] = useState('select')
  const { t, isAr } = useLang()

  const distance = 8.4
  const ride = rideTypes.find(r => r.id === selectedRide)
  const fare = (ride.basePrice + ride.perKm * distance).toFixed(0)

  const labelMap = { economy: t('economy'), comfort: t('comfort'), premium: t('premium'), xl: t('xl') }

  return (
    <div className="min-h-screen bg-[#FBF8F2]" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="bg-[#0F2A47] py-7 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-black text-white">{t('bookRide')}</h1>
          <p className="text-white/50 text-sm mt-1">{t('premiumRides')}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Booking panel */}
          <div className="lg:col-span-2 space-y-4">
            {/* Location inputs */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8E4DC]">
              <h2 className="font-black text-[#0F2A47] mb-4">{t('whereToGo')}</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-[#FBF8F2] rounded-xl px-4 py-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0"></div>
                  <input placeholder={isAr ? 'موقعك الحالي' : 'Your location'} className="flex-1 outline-none text-sm bg-transparent text-[#222] font-medium" dir={isAr ? 'rtl' : 'ltr'} />
                  <Navigation size={15} className="text-[#C8A951]" />
                </div>
                <div className="flex items-center gap-3 bg-[#FBF8F2] rounded-xl px-4 py-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0F2A47] flex-shrink-0"></div>
                  <input placeholder={isAr ? 'إلى أين؟' : 'Where to?'} className="flex-1 outline-none text-sm bg-transparent text-[#222] font-medium" dir={isAr ? 'rtl' : 'ltr'} />
                  <MapPin size={15} className="text-[#C8A951]" />
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {(isAr
                  ? ['مطار دبي', 'دبي مول', 'برج خليفة', 'نخلة جميرا']
                  : ['Dubai Airport', 'Dubai Mall', 'Burj Khalifa', 'Palm Jumeirah']
                ).map(loc => (
                  <button key={loc} className="px-3 py-1.5 bg-[#FBF8F2] text-[#444] text-xs rounded-xl border border-[#E8E4DC] hover:border-[#C8A951]/40 font-semibold">{loc}</button>
                ))}
              </div>
            </div>

            {/* Ride types */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8E4DC]">
              <h2 className="font-black text-[#0F2A47] mb-3">{t('chooseRide')}</h2>
              <div className="space-y-2">
                {rideTypes.map(rt => (
                  <button key={rt.id} onClick={() => setSelectedRide(rt.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                      selectedRide === rt.id ? 'border-[#0F2A47] bg-[#0F2A47]/5' : 'border-[#E8E4DC] hover:border-[#C8A951]/40'
                    }`}>
                    <span className="text-2xl">{rt.emoji}</span>
                    <div className="flex-1 text-start">
                      <p className="font-black text-sm text-[#222]">{labelMap[rt.id]}</p>
                      <div className="flex items-center gap-2 text-xs text-[#666] font-semibold">
                        <Clock size={10} /> {isAr ? rt.etaAr : rt.eta} {isAr ? 'دقيقة' : 'min'}
                      </div>
                    </div>
                    <div className="text-end">
                      <p className="font-black text-[#0F2A47] text-sm">
                        ~{(rt.basePrice + rt.perKm * distance).toFixed(0)} {isAr ? 'درهم' : 'AED'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Confirm */}
            <div className="bg-[#0F2A47] rounded-2xl p-5 text-white">
              <div className="flex items-center justify-between mb-3">
                <p className="font-black">{t('fareEstimate')}</p>
                <span className="text-xs text-white/50 bg-white/10 px-2 py-1 rounded-full font-semibold">{labelMap[selectedRide]}</span>
              </div>
              <div className="space-y-2 text-sm text-white/60">
                <div className="flex justify-between font-semibold">
                  <span>{isAr ? 'رسوم أساسية' : 'Base fare'}</span><span>{ride.basePrice} {isAr ? 'د' : 'AED'}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>{isAr ? `المسافة (${distance} كم)` : `Distance (${distance} km)`}</span><span>{(ride.perKm * distance).toFixed(1)} {isAr ? 'د' : 'AED'}</span>
                </div>
                <div className="flex justify-between border-t border-white/20 pt-2 font-black text-white text-base">
                  <span>{t('total')}</span><span>{fare} {isAr ? 'درهم' : 'AED'}</span>
                </div>
              </div>
              <button onClick={() => setStep(step === 'tracking' ? 'select' : 'tracking')}
                className="w-full mt-4 py-3.5 bg-[#C8A951] hover:bg-[#b8942f] text-[#0F2A47] font-black rounded-xl transition-all">
                {step === 'tracking' ? (isAr ? 'إلغاء الرحلة' : 'Cancel Ride') : `${t('confirmRide')} — ${fare} ${isAr ? 'درهم' : 'AED'}`}
              </button>
            </div>
          </div>

          {/* Map + history */}
          <div className="lg:col-span-3 space-y-4">
            {/* Map */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E8E4DC]">
              <div className="relative bg-[#e8f4e8] overflow-hidden" style={{ height: 320 }}>
                <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 600 320">
                  {[0,50,100,150,200,250,300,350,400,450,500,550,600].map(x => (
                    <line key={x} x1={x} y1="0" x2={x} y2="320" stroke="#94a3b8" strokeWidth="0.5"/>
                  ))}
                  {[0,50,100,150,200,250,300].map(y => (
                    <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="#94a3b8" strokeWidth="0.5"/>
                  ))}
                  {step === 'tracking' && <>
                    <path d="M80 260 C140 220, 220 180, 300 140 C380 100, 450 80, 500 60" stroke="#0F2A47" strokeWidth="3" fill="none" strokeDasharray="8,4"/>
                    <circle cx="80" cy="260" r="8" fill="#2ECC71"/>
                    <circle cx="500" cy="60" r="8" fill="#E74C3C"/>
                    <circle cx="280" cy="150" r="14" fill="#0F2A47"/>
                    <text x="280" y="155" textAnchor="middle" fill="white" fontSize="11">🚗</text>
                  </>}
                </svg>
                {step === 'tracking' ? (
                  <div className="absolute top-4 start-4 bg-white rounded-xl px-4 py-2 shadow-sm text-xs font-black text-[#0F2A47]">
                    {isAr ? `السائق على بُعد ${ride.etaAr} دقيقة` : `Driver ${ride.eta} min away`}
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-[#0F2A47] font-black text-sm">📍 {isAr ? 'أدخل المواقع للتتبع' : 'Enter locations to see route'}</p>
                  </div>
                )}
              </div>
              {step === 'tracking' && (
                <div className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-[#FBF8F2] rounded-full flex items-center justify-center text-xl border border-[#E8E4DC]">👨‍✈️</div>
                    <div className="flex-1">
                      <p className="font-black text-[#222]">{isAr ? 'أحمد الراشدي' : 'Ahmed Al Rashidi'}</p>
                      <div className="flex items-center gap-2 text-sm text-[#666] font-semibold">
                        <Star size={13} className="fill-[#C8A951] text-[#C8A951]" />
                        <span>4.94 · {isAr ? 'تويوتا كامري' : 'Toyota Camry'} · <strong>DXB 3421</strong></span>
                      </div>
                    </div>
                    <p className="font-black text-[#0F2A47]">{fare} {isAr ? 'د' : 'AED'}</p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 py-2.5 bg-[#FBF8F2] text-[#0F2A47] text-sm rounded-xl border border-[#E8E4DC] font-bold">📞 {t('call')}</button>
                    <button className="flex-1 py-2.5 bg-[#FBF8F2] text-[#0F2A47] text-sm rounded-xl border border-[#E8E4DC] font-bold">💬 {t('message')}</button>
                  </div>
                </div>
              )}
            </div>

            {/* Recent rides */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8E4DC]">
              <h2 className="font-black text-[#0F2A47] mb-4">{t('recentRides')}</h2>
              <div className="space-y-3">
                {recentRides.map((ride, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-[#FBF8F2] rounded-xl">
                    <div className="p-2 bg-white rounded-xl shadow-sm border border-[#E8E4DC]">
                      <Car size={16} className="text-[#0F2A47]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black text-[#222]">
                        {isAr ? ride.fromAr : ride.fromEn} → {isAr ? ride.toAr : ride.toEn}
                      </p>
                      <p className="text-xs text-[#666] font-semibold">{labelMap[ride.typeId]}</p>
                    </div>
                    <p className="font-black text-[#0F2A47] text-sm">{ride.price} {isAr ? 'د' : 'AED'}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
