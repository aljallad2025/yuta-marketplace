import { useState } from 'react'
import { ArrowLeft, Minus, Plus, Trash2, Tag, X } from 'lucide-react'
import { useLang } from '../../i18n/LangContext'
import { useMobile } from '../../store/mobileStore.jsx'

export default function MobileCart() {
  const { isAr } = useLang()
  const {
    cart, cartTotal, cartStoreId,
    addToCart, removeFromCart, clearCart,
    stores, goBack, openCheckout,
    appliedPromo, applyPromo,
  } = useMobile()

  const [promoInput, setPromoInput] = useState('')
  const [promoError, setPromoError] = useState(false)

  const store = stores.find(s => s.id === cartStoreId)
  const deliveryFee = store?.deliveryFee || 0
  const discount = appliedPromo ? Math.round(cartTotal * appliedPromo.discount / 100) : 0
  const finalTotal = cartTotal + deliveryFee - discount

  const handlePromo = () => {
    const ok = applyPromo(promoInput)
    if (!ok) { setPromoError(true); setTimeout(() => setPromoError(false), 2000) }
    else setPromoInput('')
  }

  if (cart.length === 0) {
    return (
      <div className="bg-[#FBF8F2] min-h-full flex flex-col items-center justify-center p-6" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="text-6xl mb-4">🛒</div>
        <p className="font-black text-[#0F2A47] text-base mb-1">{isAr ? 'السلة فارغة' : 'Your cart is empty'}</p>
        <p className="text-xs text-[#999] mb-6 text-center">{isAr ? 'أضف منتجات من المتاجر' : 'Add items from stores to get started'}</p>
        <button onClick={goBack} className="px-6 py-3 bg-[#0F2A47] text-white font-black rounded-2xl text-sm">
          {isAr ? 'تصفح المتاجر' : 'Browse Stores'}
        </button>
      </div>
    )
  }

  return (
    <div className="bg-[#FBF8F2] min-h-full" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="bg-[#0F2A47] px-4 pt-2 pb-4 flex items-center gap-3">
        <button onClick={goBack} className="p-2 bg-white/10 rounded-xl active:bg-white/20">
          <ArrowLeft size={16} className="text-white" style={{ transform: isAr ? 'rotate(180deg)' : undefined }} />
        </button>
        <div className="flex-1">
          <p className="text-white font-black text-sm">{isAr ? 'سلة التسوق' : 'Cart'}</p>
          {store && <p className="text-white/50 text-[10px]">{isAr ? store.nameAr : store.nameEn}</p>}
        </div>
        <button onClick={clearCart} className="p-2 bg-red-500/20 rounded-xl active:bg-red-500/30">
          <Trash2 size={14} className="text-red-400" />
        </button>
      </div>

      <div className="p-3 space-y-2">
        {cart.map(({ product, qty }) => (
          <div key={product.id} className="bg-white rounded-2xl p-3 shadow-sm border border-[#E8E4DC] flex items-center gap-3">
            <div className="w-12 h-12 bg-[#FBF8F2] rounded-xl flex items-center justify-center text-xl flex-shrink-0">
              {product.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-[#222] text-xs">{isAr ? product.nameAr : product.nameEn}</p>
              <p className="font-bold text-[#0F2A47] text-sm mt-0.5">{product.price * qty} <span className="text-[10px] text-[#999]">{isAr ? 'د' : 'AED'}</span></p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => removeFromCart(product.id)}
                className="w-7 h-7 bg-[#F0ECE4] rounded-full flex items-center justify-center active:bg-[#E8E4DC]"
              >
                <Minus size={12} className="text-[#0F2A47]" />
              </button>
              <span className="font-black text-[#0F2A47] w-4 text-center">{qty}</span>
              <button
                onClick={() => addToCart(product, cartStoreId)}
                className="w-7 h-7 bg-[#0F2A47] rounded-full flex items-center justify-center active:scale-95"
              >
                <Plus size={12} className="text-white" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Promo Code */}
      <div className="px-3">
        <div className={`flex items-center gap-2 bg-white rounded-2xl px-3 py-2.5 border ${promoError ? 'border-red-400' : appliedPromo ? 'border-emerald-400' : 'border-[#E8E4DC]'}`}>
          <Tag size={13} className={appliedPromo ? 'text-emerald-500' : 'text-[#999]'} />
          {appliedPromo ? (
            <div className="flex-1 flex items-center justify-between">
              <span className="text-xs font-black text-emerald-600">{appliedPromo.code} — {appliedPromo.discount}% {isAr ? 'خصم' : 'off'}</span>
              <button onClick={() => applyPromo('REMOVE_PROMO')} className="text-[#999]">
                <X size={12} />
              </button>
            </div>
          ) : (
            <>
              <input
                value={promoInput}
                onChange={e => setPromoInput(e.target.value.toUpperCase())}
                placeholder={isAr ? 'كود الخصم' : 'Promo code'}
                className="flex-1 outline-none text-xs text-[#222] bg-transparent"
                dir="ltr"
                onKeyDown={e => e.key === 'Enter' && handlePromo()}
              />
              <button
                onClick={handlePromo}
                disabled={!promoInput}
                className="text-xs font-black text-[#0F2A47] disabled:text-[#999]"
              >
                {isAr ? 'تطبيق' : 'Apply'}
              </button>
            </>
          )}
        </div>
        {promoError && <p className="text-[10px] text-red-500 mt-1 px-1">{isAr ? 'كود غير صحيح' : 'Invalid promo code'}</p>}
        {!promoError && !appliedPromo && (
          <p className="text-[9px] text-[#999] mt-1 px-1">{isAr ? 'جرب: SUMU10 · SUMU20 · WELCOME' : 'Try: SUMU10 · SUMU20 · WELCOME'}</p>
        )}
      </div>

      {/* Order Summary */}
      <div className="mx-3 mt-3 bg-white rounded-2xl p-4 border border-[#E8E4DC] shadow-sm">
        <p className="font-black text-[#0F2A47] text-xs mb-3">{isAr ? 'ملخص الطلب' : 'Order Summary'}</p>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-[#666]">
            <span>{isAr ? 'المجموع الجزئي' : 'Subtotal'}</span>
            <span>{cartTotal} {isAr ? 'د' : 'AED'}</span>
          </div>
          <div className="flex justify-between text-xs text-[#666]">
            <span>{isAr ? 'رسوم التوصيل' : 'Delivery fee'}</span>
            <span className={deliveryFee === 0 ? 'text-emerald-600 font-bold' : ''}>
              {deliveryFee === 0 ? (isAr ? 'مجاني' : 'Free') : `${deliveryFee} ${isAr ? 'د' : 'AED'}`}
            </span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-xs text-emerald-600 font-bold">
              <span>{isAr ? 'الخصم' : 'Discount'}</span>
              <span>-{discount} {isAr ? 'د' : 'AED'}</span>
            </div>
          )}
          <div className="border-t border-[#F0ECE4] pt-2 flex justify-between">
            <span className="font-black text-[#0F2A47]">{isAr ? 'الإجمالي' : 'Total'}</span>
            <span className="font-black text-[#0F2A47] text-base">{finalTotal} {isAr ? 'درهم' : 'AED'}</span>
          </div>
        </div>
      </div>

      <div className="px-3 mt-4 pb-6">
        <button
          onClick={openCheckout}
          className="w-full py-4 bg-[#0F2A47] text-white font-black text-sm rounded-2xl shadow-lg active:opacity-90"
        >
          {isAr ? `المتابعة للدفع — ${finalTotal} درهم` : `Proceed to Checkout — ${finalTotal} AED`}
        </button>
      </div>
    </div>
  )
}
