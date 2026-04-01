import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Clock, CreditCard, Wallet, Banknote, Check, Plus } from 'lucide-react'
import { useLang } from '../i18n/LangContext'

const orderItems = [
  { nameEn: 'Mixed Grill Platter', nameAr: 'طبق المشاوي المشكلة', qty: 1, price: 89 },
  { nameEn: 'Lamb Ouzi', nameAr: 'لحم أوزي', qty: 2, price: 75 },
  { nameEn: 'Arabic Coffee', nameAr: 'قهوة عربية', qty: 2, price: 15 },
]

export default function WebCheckout() {
  const [payment, setPayment] = useState('card')
  const [deliveryTime, setDeliveryTime] = useState(0)
  const [promo, setPromo] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const { t, isAr } = useLang()

  const deliveryTimes = isAr
    ? ['في أقرب وقت (٢٠–٣٠ دق)', '١٢:٣٠ م', '١:٠٠ م', '١:٣٠ م', '٢:٠٠ م']
    : ['ASAP (20–30 min)', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM']

  const paymentMethods = [
    { id: 'card', label: t('creditCard'), icon: CreditCard, sub: '**** **** **** 4892' },
    { id: 'wallet', label: t('wallet'), icon: Wallet, sub: `${t('balance')}: 150.00 ${isAr ? 'درهم' : 'AED'}` },
    { id: 'cash', label: t('cash'), icon: Banknote, sub: t('payWhenDelivered') },
  ]

  const subtotal = orderItems.reduce((a, b) => a + b.price * b.qty, 0)
  const discount = promoApplied ? 25 : 0
  const total = subtotal - discount

  return (
    <div className="min-h-screen bg-[#FBF8F2]" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="bg-[#0F2A47] py-5 px-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Link to="/web/store" className="p-2 bg-white/10 rounded-xl hover:bg-white/20">
            <ArrowLeft size={17} className="text-white" style={{ transform: isAr ? 'rotate(180deg)' : undefined }} />
          </Link>
          <h1 className="text-xl font-black text-white">{t('checkout')}</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-5 space-y-4">
        {/* Delivery Address */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8E4DC]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-[#0F2A47] flex items-center gap-2">
              <MapPin size={16} className="text-[#C8A951]" /> {t('deliveryAddress')}
            </h2>
            <button className="text-sm text-[#C8A951] font-black">{t('changeAddress')}</button>
          </div>
          <div className="bg-[#FBF8F2] rounded-xl p-3 border border-[#E8E4DC]">
            <p className="font-black text-[#222] text-sm">{isAr ? 'المنزل' : 'Home'}</p>
            <p className="text-sm text-[#666] mt-0.5">{isAr ? 'فيلا ١٢، شارع الوصل، جميرا، دبي' : 'Villa 12, Al Wasl Road, Jumeirah, Dubai'}</p>
          </div>
          <button className="mt-3 flex items-center gap-2 text-sm text-[#0F2A47] font-black">
            <Plus size={14} /> {t('addAddress')}
          </button>
        </div>

        {/* Delivery Time */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8E4DC]">
          <h2 className="font-black text-[#0F2A47] flex items-center gap-2 mb-4">
            <Clock size={16} className="text-[#C8A951]" /> {t('deliveryTime')}
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {deliveryTimes.map((time, i) => (
              <button key={i} onClick={() => setDeliveryTime(i)}
                className={`px-3 py-2 rounded-xl text-xs font-black whitespace-nowrap border-2 transition-all ${
                  deliveryTime === i ? 'bg-[#0F2A47] text-white border-[#0F2A47]' : 'bg-white text-[#444] border-[#E8E4DC]'
                }`}>{time}</button>
            ))}
          </div>
        </div>

        {/* Payment */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8E4DC]">
          <h2 className="font-black text-[#0F2A47] flex items-center gap-2 mb-4">
            <CreditCard size={16} className="text-[#C8A951]" /> {t('paymentMethod')}
          </h2>
          <div className="space-y-2">
            {paymentMethods.map(m => (
              <button key={m.id} onClick={() => setPayment(m.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-start ${
                  payment === m.id ? 'border-[#0F2A47] bg-[#0F2A47]/5' : 'border-[#E8E4DC] hover:border-[#C8A951]/40'
                }`}>
                <div className={`p-2 rounded-xl ${payment === m.id ? 'bg-[#0F2A47] text-white' : 'bg-[#FBF8F2] text-[#666]'}`}>
                  <m.icon size={16} />
                </div>
                <div className="flex-1">
                  <p className="font-black text-sm text-[#222]">{m.label}</p>
                  <p className="text-xs text-[#666] font-semibold">{m.sub}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${payment === m.id ? 'border-[#0F2A47] bg-[#0F2A47]' : 'border-[#E8E4DC]'}`}>
                  {payment === m.id && <Check size={10} className="text-white" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8E4DC]">
          <h2 className="font-black text-[#0F2A47] mb-4">{t('orderSummary')}</h2>
          <div className="space-y-3 mb-4">
            {orderItems.map(item => (
              <div key={item.nameEn} className="flex items-center justify-between text-sm">
                <span className="text-[#666] font-semibold">{item.qty}× {isAr ? item.nameAr : item.nameEn}</span>
                <span className="font-black text-[#222]">{item.price * item.qty} {isAr ? 'د' : 'AED'}</span>
              </div>
            ))}
          </div>

          {/* Promo */}
          <div className="flex gap-2 mb-3">
            <input type="text" value={promo} onChange={e => setPromo(e.target.value)}
              placeholder={isAr ? 'كود الخصم (جرب SUMU10)' : 'Promo code (try SUMU10)'}
              className="flex-1 border border-[#E8E4DC] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#C8A951] font-semibold"
              dir={isAr ? 'rtl' : 'ltr'} />
            <button onClick={() => setPromoApplied(promo === 'SUMU10')}
              className="px-4 py-2.5 bg-[#0F2A47] text-white text-sm font-black rounded-xl">{t('apply')}</button>
          </div>
          {promoApplied && <p className="text-xs text-emerald-600 mb-3 font-black">✓ {isAr ? 'تم تطبيق الكود — خصم ٢٥ درهم' : 'Promo applied — 25 AED discount'}</p>}

          <div className="space-y-2 border-t border-[#F0ECE4] pt-4">
            <div className="flex justify-between text-sm text-[#666] font-semibold">
              <span>{t('subtotal')}</span><span>{subtotal} {isAr ? 'درهم' : 'AED'}</span>
            </div>
            <div className="flex justify-between text-sm text-[#666] font-semibold">
              <span>{t('deliveryFee')}</span><span className="text-emerald-600 font-black">{isAr ? 'مجاني' : 'Free'}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-emerald-600 font-black">
                <span>{t('discount')}</span><span>−{discount} {isAr ? 'درهم' : 'AED'}</span>
              </div>
            )}
            <div className="flex justify-between font-black text-[#0F2A47] pt-2 border-t border-[#F0ECE4] text-base">
              <span>{t('total')}</span><span>{total} {isAr ? 'درهم' : 'AED'}</span>
            </div>
          </div>
        </div>

        <Link to="/web/orders">
          <button className="w-full py-4 bg-[#0F2A47] hover:bg-[#1a3a5c] text-white font-black text-base rounded-2xl shadow-lg transition-all">
            {t('placeOrder')} — {total} {isAr ? 'درهم' : 'AED'}
          </button>
        </Link>
      </div>
    </div>
  )
}
