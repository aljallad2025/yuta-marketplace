import { useState } from 'react'
import { ArrowLeft, MapPin, Clock, CreditCard, Wallet, DollarSign, ChevronRight, Check } from 'lucide-react'
import { useLang } from '../../i18n/LangContext'
import { useMobile } from '../../store/mobileStore.jsx'

const PAYMENT_METHODS = [
  { id: 'wallet', iconComp: Wallet, labelAr: 'محفظة YUTA', labelEn: 'YUTA Wallet', subAr: null, subEn: null },
  { id: 'card',   iconComp: CreditCard, labelAr: 'بطاقة ائتمانية', labelEn: 'Credit Card', subAr: '•••• 4521', subEn: '•••• 4521' },
  { id: 'cash',   iconComp: DollarSign, labelAr: 'نقداً عند الاستلام', labelEn: 'Cash on Delivery', subAr: null, subEn: null },
]

export default function MobileCheckout() {
  const { isAr } = useLang()
  const {
    cart, cartTotal, cartStoreId, stores,
    addresses, selectedAddress, setSelectedAddress,
    walletBalance, placeOrder, goBack,
    appliedPromo,
  } = useMobile()

  const [payMethod, setPayMethod] = useState('wallet')
  const [placing, setPlacing] = useState(false)

  const store = stores.find(s => s.id === cartStoreId)
  const deliveryFee = store?.deliveryFee || 0
  const discount = appliedPromo ? Math.round(cartTotal * appliedPromo.discount / 100) : 0
  const finalTotal = cartTotal + deliveryFee - discount

  const currentAddress = addresses.find(a => a.id === selectedAddress) || addresses[0]

  const handlePlace = async () => {
    if (payMethod === 'wallet' && walletBalance < finalTotal) return
    setPlacing(true)
    await new Promise(r => setTimeout(r, 1200))
    placeOrder(payMethod)
    setPlacing(false)
  }

  return (
    <div className="bg-[#F0F9F8] min-h-full" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="bg-[#0D1B4B] px-4 pt-2 pb-4 flex items-center gap-3">
        <button onClick={goBack} className="p-2 bg-white/10 rounded-xl active:bg-white/20">
          <ArrowLeft size={16} className="text-white" style={{ transform: isAr ? 'rotate(180deg)' : undefined }} />
        </button>
        <p className="text-white font-black text-sm">{isAr ? 'إتمام الطلب' : 'Checkout'}</p>
      </div>

      <div className="p-3 space-y-3">
        {/* Delivery Address */}
        <div className="bg-white rounded-2xl p-4 border border-[#D0EDEA] shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="font-black text-[#0D1B4B] text-xs flex items-center gap-1.5">
              <MapPin size={13} className="text-[#00C9A7]" /> {isAr ? 'عنوان التوصيل' : 'Delivery Address'}
            </p>
          </div>
          <div className="space-y-2">
            {addresses.map(addr => (
              <button
                key={addr.id}
                onClick={() => setSelectedAddress(addr.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border text-start transition-all ${
                  selectedAddress === addr.id ? 'border-[#0D1B4B] bg-[#0D1B4B]/5' : 'border-[#F0ECE4]'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  selectedAddress === addr.id ? 'border-[#0D1B4B] bg-[#0D1B4B]' : 'border-[#ccc]'
                }`}>
                  {selectedAddress === addr.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
                <div>
                  <p className="font-black text-xs text-[#222]">{isAr ? addr.labelAr : addr.labelEn}</p>
                  <p className="text-[10px] text-[#999]">{addr.addr}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Delivery Time */}
        <div className="bg-white rounded-2xl p-4 border border-[#D0EDEA] shadow-sm">
          <p className="font-black text-[#0D1B4B] text-xs flex items-center gap-1.5 mb-3">
            <Clock size={13} className="text-[#00C9A7]" /> {isAr ? 'وقت التوصيل' : 'Delivery Time'}
          </p>
          <div className="flex gap-2">
            {[
              { id: 'asap', ar: 'أسرع وقت ممكن', en: 'ASAP' },
              { id: 'schedule', ar: 'جدولة لاحقاً', en: 'Schedule' },
            ].map(opt => (
              <button
                key={opt.id}
                className={`flex-1 py-2 rounded-xl text-xs font-black border transition-all ${
                  opt.id === 'asap' ? 'border-[#0D1B4B] bg-[#0D1B4B]/5 text-[#0D1B4B]' : 'border-[#D0EDEA] text-[#999]'
                }`}
              >
                {isAr ? opt.ar : opt.en}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-[#999] mt-2">
            {isAr ? `يصل خلال ${store?.time || '30-45'} دقيقة` : `Arrives in ${store?.time || '30-45'} min`}
          </p>
        </div>

        {/* Payment */}
        <div className="bg-white rounded-2xl p-4 border border-[#D0EDEA] shadow-sm">
          <p className="font-black text-[#0D1B4B] text-xs flex items-center gap-1.5 mb-3">
            <CreditCard size={13} className="text-[#00C9A7]" /> {isAr ? 'طريقة الدفع' : 'Payment Method'}
          </p>
          <div className="space-y-2">
            {PAYMENT_METHODS.map(pm => {
              const Icon = pm.iconComp
              const isWallet = pm.id === 'wallet'
              const insufficientFunds = isWallet && walletBalance < finalTotal
              return (
                <button
                  key={pm.id}
                  onClick={() => setPayMethod(pm.id)}
                  disabled={insufficientFunds}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-start transition-all ${
                    payMethod === pm.id ? 'border-[#0D1B4B] bg-[#0D1B4B]/5' : 'border-[#F0ECE4]'
                  } ${insufficientFunds ? 'opacity-50' : ''}`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    payMethod === pm.id ? 'border-[#0D1B4B] bg-[#0D1B4B]' : 'border-[#ccc]'
                  }`}>
                    {payMethod === pm.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <Icon size={14} className="text-[#0D1B4B] flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-black text-[#222]">{isAr ? pm.labelAr : pm.labelEn}</p>
                    {isWallet && (
                      <p className={`text-[10px] ${insufficientFunds ? 'text-red-500' : 'text-emerald-600'} font-bold`}>
                        {walletBalance} {isAr ? 'د متاح' : 'AED available'}{insufficientFunds ? ` — ${isAr ? 'رصيد غير كافٍ' : 'Insufficient'}` : ''}
                      </p>
                    )}
                    {pm.subEn && <p className="text-[10px] text-[#999]">{pm.subEn}</p>}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl p-4 border border-[#D0EDEA] shadow-sm">
          <p className="font-black text-[#0D1B4B] text-xs mb-3">{isAr ? 'ملخص الطلب' : 'Order Summary'}</p>
          <div className="space-y-2 text-xs text-[#666]">
            {cart.map(({ product, qty }) => (
              <div key={product.id} className="flex justify-between">
                <span>{qty}x {isAr ? product.nameAr : product.nameEn}</span>
                <span>{product.price * qty} {isAr ? 'د' : 'AED'}</span>
              </div>
            ))}
            <div className="border-t border-[#F0ECE4] pt-2 flex justify-between">
              <span>{isAr ? 'المجموع' : 'Subtotal'}</span>
              <span>{cartTotal} {isAr ? 'د' : 'AED'}</span>
            </div>
            {deliveryFee > 0 && (
              <div className="flex justify-between">
                <span>{isAr ? 'التوصيل' : 'Delivery'}</span>
                <span>{deliveryFee} {isAr ? 'د' : 'AED'}</span>
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>{isAr ? 'الخصم' : 'Discount'}</span>
                <span>-{discount} {isAr ? 'د' : 'AED'}</span>
              </div>
            )}
            <div className="border-t border-[#F0ECE4] pt-2 flex justify-between font-black text-[#0D1B4B] text-sm">
              <span>{isAr ? 'الإجمالي' : 'Total'}</span>
              <span>{finalTotal} {isAr ? 'درهم' : 'AED'}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handlePlace}
          disabled={placing || (payMethod === 'wallet' && walletBalance < finalTotal)}
          className="w-full py-4 bg-[#0D1B4B] text-white font-black text-sm rounded-2xl shadow-lg active:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {placing ? (
            <span className="animate-pulse">{isAr ? 'جارٍ التأكيد...' : 'Placing order...'}</span>
          ) : (
            <>{isAr ? `تأكيد الطلب — ${finalTotal} درهم` : `Place Order — ${finalTotal} AED`}</>
          )}
        </button>
      </div>
    </div>
  )
}
