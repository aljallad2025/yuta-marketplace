import { useState } from 'react'
import { DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Wallet, Clock } from 'lucide-react'
import { useLang } from '../../i18n/LangContext'
import { useApp } from '../../store/appStore'
import { useStores } from '../../store/storesStore'

const transactions = [
  { id: 'TXN-001', type: 'credit', ar: 'إيرادات الطلبات', en: 'Order Revenue', amount: 580, date: new Date(Date.now() - 1 * 3600000).toISOString() },
  { id: 'TXN-002', type: 'debit', ar: 'عمولة المنصة (12%)', en: 'Platform Commission (12%)', amount: -69.6, date: new Date(Date.now() - 1 * 3600000).toISOString() },
  { id: 'TXN-003', type: 'credit', ar: 'إيرادات الطلبات', en: 'Order Revenue', amount: 860, date: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: 'TXN-004', type: 'debit', ar: 'عمولة المنصة (12%)', en: 'Platform Commission (12%)', amount: -103.2, date: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: 'TXN-005', type: 'withdrawal', ar: 'سحب إلى الحساب البنكي', en: 'Bank Withdrawal', amount: -1000, date: new Date(Date.now() - 24 * 3600000).toISOString() },
  { id: 'TXN-006', type: 'credit', ar: 'إيرادات الطلبات', en: 'Order Revenue', amount: 1240, date: new Date(Date.now() - 24 * 3600000).toISOString() },
]

export default function VendorWallet() {
  const { isAr } = useLang()
  const { getStoreStats, activeVendorId } = useApp()
  const { stores } = useStores()
  const store = stores.find(s => s.id === activeVendorId) || stores[0]
  const stats = getStoreStats(activeVendorId)

  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [withdrawn, setWithdrawn] = useState(false)

  const balance = stats.revenue * (1 - (store?.commission || 12) / 100)
  const pending = stats.pendingOrders * 45 // avg order value

  const handleWithdraw = () => {
    if (!withdrawAmount || Number(withdrawAmount) <= 0) return
    setWithdrawn(true)
    setShowWithdraw(false)
    setWithdrawAmount('')
    setTimeout(() => setWithdrawn(false), 3000)
  }

  return (
    <div className="p-6" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="mb-6">
        <h1 className="text-xl font-black text-[#0F2A47]">{isAr ? 'المحفظة والمالية' : 'Wallet & Finance'}</h1>
        <p className="text-sm text-[#888] mt-0.5">{isAr ? 'تتبع إيراداتك وسحب أموالك' : 'Track your earnings and withdraw funds'}</p>
      </div>

      {withdrawn && (
        <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="text-2xl">✅</div>
          <p className="font-black text-emerald-700">{isAr ? 'تم طلب السحب بنجاح! سيصل خلال 1-3 أيام عمل' : 'Withdrawal requested! Will arrive in 1-3 business days'}</p>
        </div>
      )}

      {/* Balance cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#0F2A47] rounded-2xl p-5 col-span-1 md:col-span-2">
          <p className="text-white/60 text-sm">{isAr ? 'الرصيد المتاح للسحب' : 'Available Balance'}</p>
          <p className="text-4xl font-black text-[#C8A951] mt-2">{balance.toFixed(0).toLocaleString()}</p>
          <p className="text-white/60 text-sm">{isAr ? 'درهم إماراتي' : 'AED'}</p>
          <div className="flex gap-3 mt-4">
            <button onClick={() => setShowWithdraw(true)}
              className="flex-1 py-2.5 bg-[#C8A951] text-[#0F2A47] text-sm font-black rounded-xl flex items-center justify-center gap-2">
              <ArrowUpRight size={16} /> {isAr ? 'سحب الأموال' : 'Withdraw'}
            </button>
            <button className="px-4 py-2.5 bg-white/10 text-white text-sm font-black rounded-xl">
              {isAr ? 'كشف الحساب' : 'Statement'}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-white rounded-2xl border border-[#E8E4DC] p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock size={14} className="text-amber-500" />
              <p className="text-xs font-black text-[#666]">{isAr ? 'قيد المعالجة' : 'Pending'}</p>
            </div>
            <p className="text-xl font-black text-[#0F2A47]">{pending.toFixed(0)} <span className="text-sm font-normal text-[#888]">{isAr ? 'د' : 'AED'}</span></p>
          </div>
          <div className="bg-white rounded-2xl border border-[#E8E4DC] p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={14} className="text-emerald-500" />
              <p className="text-xs font-black text-[#666]">{isAr ? 'إجمالي الإيرادات' : 'Total Revenue'}</p>
            </div>
            <p className="text-xl font-black text-[#0F2A47]">{stats.revenue.toLocaleString()} <span className="text-sm font-normal text-[#888]">{isAr ? 'د' : 'AED'}</span></p>
          </div>
        </div>
      </div>

      {/* Commission info */}
      <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="text-2xl">📊</div>
          <div>
            <p className="font-black text-amber-800 text-sm">
              {isAr ? `عمولة المنصة: ${store?.commission || 12}%` : `Platform Commission: ${store?.commission || 12}%`}
            </p>
            <p className="text-amber-600 text-xs mt-0.5">
              {isAr ? 'يتم خصم العمولة تلقائياً من كل طلب مكتمل' : 'Commission is automatically deducted from each completed order'}
            </p>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-2xl border border-[#E8E4DC] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#F0ECE4]">
          <h2 className="font-black text-[#0F2A47]">{isAr ? 'سجل المعاملات' : 'Transaction History'}</h2>
        </div>
        <div className="divide-y divide-[#F0ECE4]">
          {transactions.map(txn => (
            <div key={txn.id} className="flex items-center gap-4 px-5 py-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                txn.type === 'credit' ? 'bg-emerald-50' : txn.type === 'withdrawal' ? 'bg-blue-50' : 'bg-red-50'
              }`}>
                {txn.type === 'credit' ? (
                  <ArrowDownRight size={16} className="text-emerald-600" />
                ) : txn.type === 'withdrawal' ? (
                  <Wallet size={16} className="text-blue-600" />
                ) : (
                  <ArrowUpRight size={16} className="text-red-500" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-[#222]">{isAr ? txn.ar : txn.en}</p>
                <p className="text-xs text-[#888]">{txn.id} · {new Date(txn.date).toLocaleString(isAr ? 'ar-AE' : 'en-US', { dateStyle: 'short', timeStyle: 'short' })}</p>
              </div>
              <p className={`font-black text-sm ${txn.amount > 0 ? 'text-emerald-600' : 'text-[#666]'}`}>
                {txn.amount > 0 ? '+' : ''}{txn.amount.toFixed(1)} {isAr ? 'د' : 'AED'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Withdraw modal */}
      {showWithdraw && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6">
            <h2 className="font-black text-[#0F2A47] text-lg mb-1">{isAr ? 'سحب الأموال' : 'Withdraw Funds'}</h2>
            <p className="text-sm text-[#888] mb-4">{isAr ? `الرصيد المتاح: ${balance.toFixed(0)} درهم` : `Available: ${balance.toFixed(0)} AED`}</p>
            <div className="mb-4">
              <label className="block text-xs font-black text-[#666] mb-1.5">{isAr ? 'المبلغ (درهم)' : 'Amount (AED)'}</label>
              <input type="number" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)}
                placeholder="0.00"
                className="w-full border-2 border-[#E8E4DC] rounded-xl px-4 py-3 text-lg font-black outline-none focus:border-[#C8A951]" />
            </div>
            <div className="bg-[#FBF8F2] rounded-xl p-3 mb-4">
              <p className="text-xs font-black text-[#666]">{isAr ? 'الحساب البنكي' : 'Bank Account'}</p>
              <p className="text-sm font-black text-[#0F2A47] mt-1">IBAN: AE07 0331 2345 6789 0123 456</p>
              <p className="text-xs text-[#888]">Emirates NBD</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowWithdraw(false)}
                className="flex-1 py-3 border border-[#E8E4DC] text-[#666] font-black rounded-xl text-sm">
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button onClick={handleWithdraw}
                className="flex-1 py-3 bg-[#0F2A47] text-white font-black rounded-xl text-sm">
                {isAr ? 'تأكيد السحب' : 'Confirm Withdrawal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
