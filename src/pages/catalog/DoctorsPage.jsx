import { useState, useEffect } from 'react'
import { Search, Star, Clock, ArrowLeft, ChevronRight, X, CheckCircle } from 'lucide-react'
import { useLang } from '../../i18n/LangContext'
import { useNavigate } from 'react-router-dom'

export default function DoctorsPage() {
  const { isAr } = useLang()
  const navigate = useNavigate()
  const [stores, setStores] = useState([])
  const [doctors, setDoctors] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [activeStore, setActiveStore] = useState(null)
  const [activeDoctor, setActiveDoctor] = useState(null)
  const [day, setDay] = useState('')
  const [time, setTime] = useState('')
  const [form, setForm] = useState({ name: '', phone: '', notes: '' })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/stores?category=doctors').then(r => r.json()),
      fetch('/api/catalog/doctors').then(r => r.json())
    ]).then(([s, d]) => {
      setStores(Array.isArray(s) ? s : [])
      setDoctors(Array.isArray(d) ? d : [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const parse = (v) => { try { return JSON.parse(v) } catch { return (v || '').split(',').map(x => x.trim()).filter(Boolean) } }
  const storeDocs = activeStore ? doctors.filter(d => d.store_id === activeStore.id) : []
  const filteredStores = stores.filter(s => (isAr ? s.name_ar : s.name_en)?.toLowerCase().includes(search.toLowerCase()))

  const openBooking = (doc) => { setActiveDoctor(doc); setDay(''); setTime(''); setSubmitted(false); setForm({ name: '', phone: '', notes: '' }) }

  return (
    <div className="min-h-screen bg-[#FBF8F2]" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="bg-gradient-to-br from-[#0F2A47] to-[#1a4a6b] px-4 pt-8 pb-6">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => activeStore ? setActiveStore(null) : navigate('/web')}
            className="mb-4 flex items-center gap-2 text-white/60 text-sm">
            <ArrowLeft size={16} style={{ transform: isAr ? 'rotate(180deg)' : undefined }} />
            {activeStore ? (isAr ? 'العيادات' : 'Clinics') : (isAr ? 'الرئيسية' : 'Home')}
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl">
              {activeStore ? activeStore.logo : '👨‍⚕️'}
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">
                {activeStore ? (isAr ? activeStore.name_ar : activeStore.name_en) : (isAr ? 'الأطباء' : 'Doctors')}
              </h1>
              <p className="text-white/50 text-sm">
                {activeStore ? `${storeDocs.length} ${isAr ? 'طبيب' : 'doctors'}` : `${filteredStores.length} ${isAr ? 'عيادة' : 'clinics'}`}
              </p>
            </div>
          </div>
          {!activeStore && (
            <div className="flex items-center bg-white/10 backdrop-blur rounded-xl px-4 py-3 gap-2">
              <Search size={16} className="text-white/50" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder={isAr ? 'ابحث عن عيادة...' : 'Search clinics...'}
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
                <div className="w-16 h-16 bg-gradient-to-br from-[#0F2A47] to-[#1a4a6b] rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                  {store.logo}
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-[#0F2A47]">{isAr ? store.name_ar : store.name_en}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-gray-400"><Star size={11} className="fill-[#C8A951] text-[#C8A951]" />{store.rating}</span>
                    <span className="text-xs text-gray-400">{doctors.filter(d => d.store_id === store.id).length} {isAr ? 'طبيب' : 'doctors'}</span>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-300" style={{ transform: isAr ? 'rotate(180deg)' : undefined }} />
              </button>
            ))}
          </div>
        ) : storeDocs.length === 0 ? (
          <div className="text-center py-20 text-gray-400">{isAr ? 'لا يوجد أطباء' : 'No doctors'}</div>
        ) : (
          <div className="space-y-4">
            {storeDocs.map(doc => (
              <div key={doc.id} className="bg-white rounded-2xl border border-[#E8E4DC] p-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#0F2A47] to-[#1a4a6b] rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">👨‍⚕️</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-black text-[#0F2A47]">{isAr ? doc.name_ar : doc.name_en}</h3>
                        <p className="text-sm text-[#C8A951] font-bold">{isAr ? doc.specialty_ar : doc.specialty_en}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{doc.experience_years} {isAr ? 'سنة خبرة' : 'yrs exp'}</p>
                      </div>
                      <span className="flex items-center gap-1 text-[#C8A951]"><Star size={12} className="fill-[#C8A951]" /><span className="text-xs font-bold">{doc.rating || '4.8'}</span></span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {parse(doc.available_days).map((d, i) => (
                        <span key={i} className="text-xs bg-[#FBF8F2] text-[#0F2A47] px-2 py-0.5 rounded-lg font-bold">{d}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-black text-[#0F2A47]">{doc.price_consultation} <span className="text-xs font-normal text-gray-400">{isAr ? 'ريال' : 'SAR'}</span></span>
                      <button onClick={() => openBooking(doc)} className="bg-[#0F2A47] text-white font-black px-4 py-2 rounded-xl text-sm">
                        {isAr ? 'احجز موعد' : 'Book'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {activeDoctor && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setActiveDoctor(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-t-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-[#E8E4DC]">
              <div><h2 className="font-black text-[#0F2A47]">{isAr ? 'حجز موعد' : 'Book Appointment'}</h2>
                <p className="text-xs text-gray-400">{isAr ? activeDoctor.name_ar : activeDoctor.name_en}</p></div>
              <button onClick={() => setActiveDoctor(null)} className="p-2 bg-[#FBF8F2] rounded-xl"><X size={16} /></button>
            </div>
            {submitted ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle size={32} className="text-green-500" /></div>
                <h3 className="font-black text-[#0F2A47] text-xl mb-2">{isAr ? 'تم تأكيد الحجز!' : 'Booking Confirmed!'}</h3>
                <p className="text-gray-400 text-sm mb-1">{day} — {time}</p>
                <button onClick={() => setActiveDoctor(null)} className="mt-4 bg-[#0F2A47] text-white font-black px-8 py-3 rounded-2xl">{isAr ? 'حسناً' : 'OK'}</button>
              </div>
            ) : (
              <div className="p-5 space-y-4">
                <div className="bg-[#FBF8F2] rounded-2xl p-4 flex gap-3">
                  <span className="text-3xl">👨‍⚕️</span>
                  <div>
                    <p className="font-black text-[#0F2A47]">{isAr ? activeDoctor.name_ar : activeDoctor.name_en}</p>
                    <p className="text-xs text-[#C8A951] font-bold">{isAr ? activeDoctor.specialty_ar : activeDoctor.specialty_en}</p>
                    <p className="font-black text-[#0F2A47] mt-1">{activeDoctor.price_consultation} {isAr ? 'ريال' : 'SAR'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-black text-gray-600 mb-2">{isAr ? 'اختر اليوم' : 'Select Day'}</p>
                  <div className="flex flex-wrap gap-2">
                    {parse(activeDoctor.available_days).map((d, i) => (
                      <button key={i} onClick={() => setDay(d)} className={`px-3 py-2 rounded-xl text-xs font-black ${day === d ? 'bg-[#0F2A47] text-white' : 'bg-[#FBF8F2] text-gray-600'}`}>{d}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-black text-gray-600 mb-2">{isAr ? 'اختر الوقت' : 'Select Time'}</p>
                  <div className="flex flex-wrap gap-2">
                    {parse(activeDoctor.available_times).map((t, i) => (
                      <button key={i} onClick={() => setTime(t)} className={`px-3 py-2 rounded-xl text-xs font-black ${time === t ? 'bg-[#C8A951] text-white' : 'bg-[#FBF8F2] text-gray-600'}`}>{t}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black text-gray-600 block mb-1.5">{isAr ? 'الاسم *' : 'Name *'}</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full border border-[#E8E4DC] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C8A951]" />
                </div>
                <div>
                  <label className="text-xs font-black text-gray-600 block mb-1.5">{isAr ? 'الجوال *' : 'Phone *'}</label>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full border border-[#E8E4DC] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C8A951]" />
                </div>
                <div>
                  <label className="text-xs font-black text-gray-600 block mb-1.5">{isAr ? 'سبب الزيارة' : 'Reason'}</label>
                  <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="w-full border border-[#E8E4DC] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C8A951] resize-none" />
                </div>
                <button onClick={() => { if (form.name && form.phone && day && time) setSubmitted(true) }}
                  disabled={!form.name || !form.phone || !day || !time}
                  className="w-full bg-[#0F2A47] text-white font-black py-4 rounded-2xl disabled:opacity-50">
                  {isAr ? 'تأكيد الحجز' : 'Confirm Booking'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
