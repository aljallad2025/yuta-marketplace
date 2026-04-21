import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Clock, CreditCard, Wallet, Banknote, Check, ShoppingBag } from 'lucide-react'
import { useLang } from '../i18n/LangContext'
import { useAuth } from '../store/authStore'
import { ordersAPI } from '../services/api'

export default function WebCheckout() {
  const [payment, setPayment] = useState('cash')
  const [deliveryTime, setDeliveryTime] = useState(0)
  const [promo, setPromo] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const { t, isAr } = useLang()
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  // السلة من localStorage
  const cart = JSON.parse(localStorage.getItem('web_cart') || '[]')
  const storeId = localStorage.getItem('web_cart_store') || null

  const deliveryTimes = isAr
    ? ['في أقرب وقت (٢٠–٣٠ دق)', '١٢:٣٠ م', '١:٠٠ م', '١:٣٠ م', '٢:٠٠ م']
    : ['ASAP (20–30 min)', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM']

  const paymentMethods = [
    { id: 'card', label: t('creditCard'), icon: CreditCard, sub: '**** **** **** 4892' },
    { id: 'wallet', label: t('wallet'), icon: Wallet, sub: `${t('balance')}: 150.00 ${isAr ? 'ريال' : 'SAR'}` },
    { id: 'cash', label: t('cash'), icon: Banknote, sub: t('payWhenDelivered') },
  ]

  const subtotal = cart.reduce((a, b) => a + b.price * b.qty, 0)
  const discount = promoApplied ? 25 : 0
  const delivery = 15
  const total = subtotal - discount + delivery

  const handleOrder = async () => {
    if (!currentUser) { navigate('/login'); return }
    if (cart.length === 0) { alert(isAr ? 'السلة فارغة' : 'Cart is empty'); return }
    if (!address) { alert(isAr ? 'أدخل عنوان التوصيل' : 'Enter delivery address'); return }
    setLoading(true)
    try {
      const token = localStorage.getItem('sumu_token')
      await ordersAPI.create({
        store_id: parseInt(storeId) || 1,
        customer_phone: currentUser?.phone || '+966500000000',
        customer_name_ar: currentUser?.name_ar || 'عميل',
        customer_name_en: currentUser?.name_en || 'Customer',
        customer_id: currentUser?.id || null,
        address_ar: address,
        address_en: address,
        items: cart,
        subtotal,
        delivery_fee: delivery,
        total,
        notes: payment,
      })
      localStorage.removeItem('web_cart')
      localStorage.removeItem('web_cart_store')
      navigate('/web/orders')
    } catch (err) { console.error(err.response?.data || err.message);
      alert(isAr ? 'حدث خطأ، حاول مرة أخرى' : 'Error occurred, try again')
    }
    setLoading(false)
  }

  if (cart.length === 0) return (
    <div className="min-h-screen bg-[#FBF8F2] flex flex-col items-center justify-center" dir={isAr ? 'rtl' : 'ltr'}>
      <ShoppingBag size={48} className="text-gray-300 mb-4" />
      <p className="text-gray-500 font-semibold mb-4">{isAr ? 'السلة فارغة' : 'Cart is empty'}</p>
      <Link to="/web/marketplace" className="bg-[#C8A951] text-white font-bold px-6 py-3 rounded-xl">
        {isAr ? 'تسوق الآن' : 'Shop Now'}
      </Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FBF8F2]" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="bg-[#0F2A47] py-5 px-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link to="/web/marketplace" className="text-white/60 hover:text-white">
            <ArrowLeft size={20} style={{ transform: isAr ? 'rotate(180deg)' : undefined }} />
          </Link>
          <h1 className="text-xl font-black text-white">{t('checkout')}</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        {/* العنوان */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#E8E4DC]">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={18} className="text-[#C8A951]" />
            <p className="font-black text-[#0F2A47]">{isAr ? 'عنوان التوصيل' : 'Delivery Address'}</p>
          </div>
          <input value={address} onChange={e => setAddress(e.target.value)}
            placeholder={isAr ? 'أدخل عنوانك...' : 'Enter your address...'}
            className="w-full border border-[#E8E4DC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#C8A951]" />
        </div>

        {/* وقت التوصيل */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#E8E4DC]">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={18} className="text-[#C8A951]" />
            <p className="font-black text-[#0F2A47]">{t('deliveryTime')}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {deliveryTimes.map((time, i) => (
              <button key={i} onClick={() => setDeliveryTime(i)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${deliveryTime === i ? 'bg-[#0F2A47] text-white border-[#0F2A47]' : 'border-[#E8E4DC] text-[#555]'}`}>
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* المنتجات */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#E8E4DC]">
          <p className="font-black text-[#0F2A47] mb-3">{isAr ? 'طلبك' : 'Your Order'}</p>
          <div className="space-y-2">
            {cart.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-[#555] font-semibold">{isAr ? item.nameAr : item.nameEn} ×{item.qty}</span>
                <span className="font-black text-[#0F2A47]">{item.price * item.qty} {isAr ? 'ريال' : 'SAR'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* طريقة الدفع */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#E8E4DC]">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard size={18} className="text-[#C8A951]" />
            <p className="font-black text-[#0F2A47]">{t('paymentMethod')}</p>
          </div>
          <div className="space-y-2">
            {paymentMethods.map(m => (
              <button key={m.id} onClick={() => setPayment(m.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition ${payment === m.id ? 'border-[#C8A951] bg-[#FBF8F2]' : 'border-[#E8E4DC]'}`}>
                <m.icon size={18} className={payment === m.id ? 'text-[#C8A951]' : 'text-[#999]'} />
                <div className="flex-1 text-right">
                  <p className="font-black text-sm text-[#222]">{m.label}</p>
                  <p className="text-xs text-[#888]">{m.sub}</p>
                </div>
                {payment === m.id && <Check size={16} className="text-[#C8A951]" />}
              </button>
            ))}
          </div>
        </div>

        {/* الملخص */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#E8E4DC] space-y-2">
          <div className="flex justify-between text-sm"><span className="text-[#666]">{t('subtotal')}</span><span className="font-bold">{subtotal} {isAr ? 'ريال' : 'SAR'}</span></div>
          <div className="flex justify-between text-sm"><span className="text-[#666]">{t('delivery')}</span><span className="font-bold">{delivery} {isAr ? 'ريال' : 'SAR'}</span></div>
          {promoApplied && <div className="flex justify-between text-sm text-green-600"><span>{t('discount')}</span><span>-{discount} {isAr ? 'ريال' : 'SAR'}</span></div>}
          <div className="border-t border-[#E8E4DC] pt-2 flex justify-between font-black text-[#0F2A47]">
            <span>{t('total')}</span><span>{total} {isAr ? 'ريال' : 'SAR'}</span>
          </div>
        </div>

        <button onClick={handleOrder} disabled={loading}
          className="w-full bg-[#C8A951] text-[#0F2A47] font-black py-4 rounded-2xl text-lg hover:bg-[#d4b55a] transition disabled:opacity-50">
          {loading ? '...' : isAr ? `تأكيد الطلب — ${total} ريال` : `Place Order — ${total} SAR`}
        </button>
      </div>
    </div>
  )
}
