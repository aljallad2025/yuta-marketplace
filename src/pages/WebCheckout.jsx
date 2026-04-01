import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Clock, CreditCard, Wallet, Banknote, Check, ChevronDown, Plus } from 'lucide-react'

const orderItems = [
  { name: 'Mixed Grill Platter', qty: 1, price: 89 },
  { name: 'Lamb Ouzi', qty: 2, price: 75 },
  { name: 'Arabic Coffee', qty: 2, price: 15 },
]

const deliveryTimes = ['ASAP (20–30 min)', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM']
const paymentMethods = [
  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, sub: '**** **** **** 4892' },
  { id: 'wallet', label: 'SUMU Wallet', icon: Wallet, sub: 'Balance: 150.00 AED' },
  { id: 'cash', label: 'Cash on Delivery', icon: Banknote, sub: 'Pay when delivered' },
]

export default function WebCheckout() {
  const [payment, setPayment] = useState('card')
  const [deliveryTime, setDeliveryTime] = useState('ASAP (20–30 min)')
  const [promo, setPromo] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)

  const subtotal = orderItems.reduce((a, b) => a + b.price * b.qty, 0)
  const deliveryFee = 0
  const discount = promoApplied ? 25 : 0
  const total = subtotal + deliveryFee - discount

  return (
    <div className="min-h-screen bg-[#F8F6F1]">
      <div className="bg-[#0F2A47] py-6 px-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Link to="/web/store" className="p-2 bg-white/10 rounded-lg">
            <ArrowLeft size={18} className="text-white" />
          </Link>
          <h1 className="text-xl font-bold text-white">Checkout</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {/* Delivery Address */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8E6E1]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#0F2A47] flex items-center gap-2">
              <MapPin size={16} className="text-[#C8A951]" /> Delivery Address
            </h2>
            <button className="text-sm text-[#C8A951] font-medium">Change</button>
          </div>
          <div className="bg-[#F8F6F1] rounded-xl p-3">
            <p className="font-medium text-[#222] text-sm">Home</p>
            <p className="text-sm text-[#666] mt-0.5">Villa 12, Al Wasl Road, Jumeirah, Dubai</p>
          </div>
          <button className="mt-3 flex items-center gap-2 text-sm text-[#0F2A47] font-medium">
            <Plus size={14} /> Add new address
          </button>
        </div>

        {/* Delivery Time */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8E6E1]">
          <h2 className="font-semibold text-[#0F2A47] flex items-center gap-2 mb-4">
            <Clock size={16} className="text-[#C8A951]" /> Delivery Time
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {deliveryTimes.map(t => (
              <button key={t} onClick={() => setDeliveryTime(t)}
                className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap border transition-all ${
                  deliveryTime === t ? 'bg-[#0F2A47] text-white border-[#0F2A47]' : 'bg-white text-[#444] border-[#E8E6E1]'
                }`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8E6E1]">
          <h2 className="font-semibold text-[#0F2A47] flex items-center gap-2 mb-4">
            <CreditCard size={16} className="text-[#C8A951]" /> Payment Method
          </h2>
          <div className="space-y-2">
            {paymentMethods.map(m => (
              <button key={m.id} onClick={() => setPayment(m.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  payment === m.id ? 'border-[#0F2A47] bg-[#0F2A47]/5' : 'border-[#E8E6E1] hover:border-[#C8A951]/40'
                }`}>
                <div className={`p-2 rounded-lg ${payment === m.id ? 'bg-[#0F2A47] text-white' : 'bg-[#F8F6F1] text-[#666]'}`}>
                  <m.icon size={16} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm text-[#222]">{m.label}</p>
                  <p className="text-xs text-[#666]">{m.sub}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  payment === m.id ? 'border-[#0F2A47] bg-[#0F2A47]' : 'border-[#E8E6E1]'
                }`}>
                  {payment === m.id && <Check size={10} className="text-white" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8E6E1]">
          <h2 className="font-semibold text-[#0F2A47] mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            {orderItems.map(item => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <span className="text-[#666]">{item.qty}x {item.name}</span>
                <span className="font-medium text-[#222]">{item.price * item.qty} AED</span>
              </div>
            ))}
          </div>

          {/* Promo */}
          <div className="flex gap-2 mb-4">
            <input type="text" value={promo} onChange={e => setPromo(e.target.value)}
              placeholder="Promo code (try SUMU10)"
              className="flex-1 border border-[#E8E6E1] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#C8A951]" />
            <button onClick={() => setPromoApplied(promo === 'SUMU10')}
              className="px-4 py-2.5 bg-[#0F2A47] text-white text-sm font-medium rounded-xl">Apply</button>
          </div>
          {promoApplied && <p className="text-xs text-emerald-600 mb-4 font-medium">✓ Promo applied — 25 AED discount</p>}

          <div className="space-y-2 border-t border-[#F0EEE9] pt-4">
            <div className="flex justify-between text-sm text-[#666]">
              <span>Subtotal</span><span>{subtotal} AED</span>
            </div>
            <div className="flex justify-between text-sm text-[#666]">
              <span>Delivery</span><span className="text-emerald-600">Free</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-emerald-600">
                <span>Discount</span><span>−{discount} AED</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-[#0F2A47] pt-2 border-t border-[#F0EEE9]">
              <span>Total</span><span>{total} AED</span>
            </div>
          </div>
        </div>

        {/* Place Order */}
        <Link to="/web/orders">
          <button className="w-full py-4 bg-[#0F2A47] hover:bg-[#1a3a5c] text-white font-bold text-base rounded-2xl shadow-lg transition-all">
            Place Order — {total} AED
          </button>
        </Link>
      </div>
    </div>
  )
}
