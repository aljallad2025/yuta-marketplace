import { useState, useEffect } from 'react'
import { Search, Shield, ArrowLeft, ChevronRight, X, CheckCircle } from 'lucide-react'
import { useLang } from '../../i18n/LangContext'
import { useNavigate } from 'react-router-dom'

export default function InsurancePage() {
  const { isAr } = useLang()
  const navigate = useNavigate()
  const [stores, setStores] = useState([])
  const [plans, setPlans] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [activeStore, setActiveStore] = useState(null)
  const [activePlan, setActivePlan] = useState(null)
  const [period, setPeriod] = useState('monthly')
  const [form, setForm] = useState({ name: '', phone: '', email: '' })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/stores?category=insurance').then(r => r.json()),
      fetch('/api/catalog/insurance').then(r => r.json())
    ]).then(([s, p]) => {
      setStores(Array.isArray(s) ? s : [])
      setPlans(Array.isArray(p) ? p : [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const storePlans = activeStore ? plans.filter(p => p.store_id === activeStore.id) : []
  const filteredStores = stores.filter(s => (isAr ? s.name_ar : s.name_en)?.toLowerCase().includes(search.toLowerCase()))

  const TYPE_ICONS = { Health: '🏥', Car: '🚗', Life: '❤️', Travel: '✈️', Home: '🏠' }

  const openPlan = (plan) => { setActivePlan(plan); setSubmitted(false); setForm({ name: '', phone: '', email: '' }) }

  return (
    <div className="min-h-screen bg-[#FBF8F2]" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="bg-gradient-to-br from-[#0F2A47] to-[#1a4a6b] px-4 pt-8 pb-6">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => activeStore ? setActiveStore(null) : navigate('/web')}
            className="mb-4 flex items-center gap-2 text-white/60 text-sm">
            <ArrowLeft size={16} style={{ transform: isAr ? 'rotate(180deg)' : undefined }} />
            {activeStore ? (isAr ? 'شركات التأمين' : 'Insurance Companies') : (isAr ? 'الرئيسية' : 'Home')}
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl">{activeStore ? activeStore.logo : '🛡️'}</div>
            <div>
              <h1 className="text-2xl font-black text-white">
                {activeStore ? (isAr ? activeStore.name_ar : activeStore.name_en) : (isAr ? 'التأمين' : 'Insurance')}
              </h1>
              <p className="text-white/50 text-sm">
                {activeStore ? `${storePlans.length} ${isAr ? 'خطة' : 'plans'}` : `${filteredStores.length} ${isAr ? 'شركة' : 'companies'}`}
              </p>
            </div>
          </div>
          {!activeStore && (
            <div className="flex items-center bg-white/10 backdrop-blur rounded-xl px-4 py-3 gap-2">
              <Search size={16} className="text-white/50" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder={isAr ? 'ابحث عن شركة تأمين...' : 'Search companies...'}
                className="flex-1 outline-none text-sm bg-transparent text-white placeholder-white/40" />
            </div>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-5">
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-[#C8A951] border-t-transparent rounded-full animate-spin" /></div>
        ) : !activeStore ? (
          <div className="space-y-3">
            {filteredStores.map(store => (
              <button key={store.id} onClick={() => setActiveStore(store)}
                className="w-full bg-white rounded-2xl border border-[#E8E4DC] p-4 flex items-center gap-4 hover:shadow-md transition text-start">
                <div className="w-16 h-16 bg-gradient-to-br from-[#0F2A47] to-[#1a4a6b] rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">{store.logo}</div>
                <div className="flex-1">
                  <h3 className="font-black text-[#0F2A47]">{isAr ? store.name_ar : store.name_en}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{plans.filter(p => p.store_id === store.id).length} {isAr ? 'خطة متاحة' : 'plans available'}</p>
                </div>
                <ChevronRight size={18} className="text-gray-300" style={{ transform: isAr ? 'rotate(180deg)' : undefined }} />
              </button>
            ))}
          </div>
        ) : (
          <div>
            <div className="flex bg-white border border-[#E8E4DC] rounded-xl overflow-hidden mb-4">
              <button onClick={() => setPeriod('monthly')} className={`flex-1 py-2.5 text-xs font-black transition ${period === 'monthly' ? 'bg-[#0F2A47] text-white' : 'text-gray-500'}`}>{isAr ? 'شهري' : 'Monthly'}</button>
              <button onClick={() => setPeriod('yearly')} className={`flex-1 py-2.5 text-xs font-black transition ${period === 'yearly' ? 'bg-[#0F2A47] text-white' : 'text-gray-500'}`}>{isAr ? 'سنوي' : 'Yearly'} <span className="text-green-500">-17%</span></button>
            </div>
            <div className="space-y-4">
              {storePlans.map(plan => (
                <div key={plan.id} className="bg-white rounded-2xl border border-[#E8E4DC] overflow-hidden">
                  <div className="bg-gradient-to-r from-[#0F2A47] to-[#1a4a6b] p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{TYPE_ICONS[plan.type_en] || '🛡️'}</span>
                      <div>
                        <p className="font-black text-white">{isAr ? plan.plan_name_ar : plan.plan_name_en}</p>
                        <p className="text-xs text-white/60">{isAr ? plan.type_ar : plan.type_en}</p>
                      </div>
                    </div>
                    <div className="text-end">
                      <p className="text-xl font-black text-[#C8A951]">{period === 'monthly' ? plan.price_monthly : plan.price_yearly}</p>
                      <p className="text-xs text-white/50">{isAr ? (period === 'monthly' ? 'ريال/شهر' : 'ريال/سنة') : (period === 'monthly' ? 'SAR/mo' : 'SAR/yr')}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-3">{isAr ? plan.coverage_ar : plan.coverage_en}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{isAr ? 'أقصى تغطية:' : 'Max:'} <b>{plan.max_coverage?.toLocaleString()} {isAr ? 'ريال' : 'SAR'}</b></span>
                      <button onClick={() => openPlan(plan)} className="bg-[#C8A951] text-white font-black px-4 py-2 rounded-xl text-sm">
                        {isAr ? 'اشترك' : 'Subscribe'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {activePlan && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setActivePlan(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-t-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-[#E8E4DC]">
              <div><h2 className="font-black text-[#0F2A47]">{isAr ? 'طلب اشتراك' : 'Subscribe'}</h2>
                <p className="text-xs text-gray-400">{isAr ? activePlan.plan_name_ar : activePlan.plan_name_en}</p></div>
              <button onClick={() => setActivePlan(null)} className="p-2 bg-[#FBF8F2] rounded-xl"><X size={16} /></button>
            </div>
            {submitted ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle size={32} className="text-green-500" /></div>
                <h3 className="font-black text-[#0F2A47] text-xl mb-2">{isAr ? 'تم إرسال طلبك!' : 'Request Sent!'}</h3>
                <p className="text-gray-400 text-sm mb-6">{isAr ? 'سيتواصل معك فريقنا خلال 24 ساعة' : 'Our team will contact you within 24 hours'}</p>
                <button onClick={() => setActivePlan(null)} className="bg-[#0F2A47] text-white font-black px-8 py-3 rounded-2xl">{isAr ? 'حسناً' : 'OK'}</button>
              </div>
            ) : (
              <div className="p-5 space-y-4">
                <div className="bg-[#FBF8F2] rounded-2xl p-4 flex items-center justify-between">
                  <div><p className="font-black text-[#0F2A47]">{isAr ? activePlan.plan_name_ar : activePlan.plan_name_en}</p>
                    <p className="text-xs text-gray-400">{isAr ? activePlan.type_ar : activePlan.type_en}</p></div>
                  <div className="text-end"><p className="font-black text-[#C8A951]">{period === 'monthly' ? activePlan.price_monthly : activePlan.price_yearly} {isAr ? 'ريال' : 'SAR'}</p>
                    <p className="text-xs text-gray-400">{isAr ? (period === 'monthly' ? 'شهرياً' : 'سنوياً') : (period === 'monthly' ? '/month' : '/year')}</p></div>
                </div>
                <div><label className="text-xs font-black text-gray-600 block mb-1.5">{isAr ? 'الاسم الكامل *' : 'Full Name *'}</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full border border-[#E8E4DC] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C8A951]" /></div>
                <div><label className="text-xs font-black text-gray-600 block mb-1.5">{isAr ? 'رقم الجوال *' : 'Phone *'}</label>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full border border-[#E8E4DC] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C8A951]" /></div>
                <div><label className="text-xs font-black text-gray-600 block mb-1.5">{isAr ? 'البريد الإلكتروني' : 'Email'}</label>
                  <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full border border-[#E8E4DC] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C8A951]" /></div>
                <button onClick={() => { if (form.name && form.phone) setSubmitted(true) }}
                  disabled={!form.name || !form.phone}
                  className="w-full bg-[#0F2A47] text-white font-black py-4 rounded-2xl disabled:opacity-50 flex items-center justify-center gap-2">
                  <Shield size={18} />{isAr ? 'تأكيد الاشتراك' : 'Confirm Subscription'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
