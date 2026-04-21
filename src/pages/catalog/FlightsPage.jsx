import { useState, useEffect, useMemo } from 'react'
import { Search, PlaneTakeoff, PlaneLanding, Users, ArrowLeft, X, CheckCircle, ArrowLeftRight, SlidersHorizontal, ChevronDown, Clock, Filter } from 'lucide-react'
import { useLang } from '../../i18n/LangContext'
import { useNavigate } from 'react-router-dom'

const CITY_FLAGS = {
  'Riyadh': '🇸🇦', 'Jeddah': '🇸🇦', 'Dammam': '🇸🇦',
  'Dubai': '🇦🇪', 'Cairo': '🇪🇬', 'London': '🇬🇧',
  'Paris': '🇫🇷', 'Istanbul': '🇹🇷', 'Beirut': '🇱🇧',
}

const AIRLINE_LOGOS = {
  'السعودية': '🇸🇦', 'مصر للطيران': '🇪🇬', 'فلاي ناس': '🟠',
  'الاتحاد': '🇦🇪', 'طيران ناس': '🟠', 'Emirates': '🇦🇪',
}

function getDuration(dep, arr) {
  try {
    const diff = Math.abs(new Date(arr) - new Date(dep)) / 60000
    const h = Math.floor(diff / 60), m = diff % 60
    return { text: `${h}h ${m > 0 ? m + 'm' : ''}`.trim(), minutes: diff }
  } catch { return { text: '', minutes: 0 } }
}

function formatDate(dt) {
  try {
    const d = new Date(dt)
    return d.toLocaleDateString('ar-SA', { weekday: 'short', month: 'short', day: 'numeric' })
  } catch { return dt }
}

export default function FlightsPage() {
  const { isAr } = useLang()
  const navigate = useNavigate()
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFlight, setActiveFlight] = useState(null)
  const [passengers, setPassengers] = useState(1)
  const [form, setForm] = useState({ name: '', phone: '', passport: '' })
  const [submitted, setSubmitted] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  // Search fields
  const [fromCity, setFromCity] = useState('')
  const [toCity, setToCity] = useState('')
  const [tripDate, setTripDate] = useState('')
  const [paxCount, setPaxCount] = useState(1)
  const [searched, setSearched] = useState(false)

  // Filters
  const [classFilter, setClassFilter] = useState('all')
  const [airlineFilter, setAirlineFilter] = useState('all')
  const [maxPrice, setMaxPrice] = useState(5000)
  const [sortBy, setSortBy] = useState('price')

  useEffect(() => {
    fetch('/api/catalog/flights')
      .then(r => r.json())
      .then(data => { setFlights(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const allCitiesFrom = useMemo(() => [...new Set(flights.map(f => isAr ? f.from_ar : f.from_en))], [flights, isAr])
  const allCitiesTo = useMemo(() => [...new Set(flights.map(f => isAr ? f.to_ar : f.to_en))], [flights, isAr])
  const allAirlines = useMemo(() => [...new Set(flights.map(f => f.airline))], [flights])

  const filtered = useMemo(() => {
    let result = [...flights]
    if (searched) {
      if (fromCity) result = result.filter(f => (isAr ? f.from_ar : f.from_en).toLowerCase().includes(fromCity.toLowerCase()))
      if (toCity) result = result.filter(f => (isAr ? f.to_ar : f.to_en).toLowerCase().includes(toCity.toLowerCase()))
    }
    if (classFilter !== 'all') result = result.filter(f => f.class_en === classFilter)
    if (airlineFilter !== 'all') result = result.filter(f => f.airline === airlineFilter)
    result = result.filter(f => f.price <= maxPrice)
    result.sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price
      if (sortBy === 'duration') return getDuration(a.departure, a.arrival).minutes - getDuration(b.departure, b.arrival).minutes
      if (sortBy === 'departure') return new Date(a.departure) - new Date(b.departure)
      return 0
    })
    return result
  }, [flights, searched, fromCity, toCity, classFilter, airlineFilter, maxPrice, sortBy, isAr])

  const swap = () => { const t = fromCity; setFromCity(toCity); setToCity(t) }

  const openBooking = (f) => {
    setActiveFlight(f)
    setPassengers(paxCount)
    setSubmitted(false)
    setForm({ name: '', phone: '', passport: '' })
  }

  const minPrice = useMemo(() => Math.min(...flights.map(f => f.price), 0), [flights])
  const maxPriceAll = useMemo(() => Math.max(...flights.map(f => f.price), 5000), [flights])

  return (
    <div className="min-h-screen bg-[#F0F4F8]" dir={isAr ? 'rtl' : 'ltr'}>

      {/* HERO SEARCH */}
      <div className="bg-gradient-to-br from-[#0F2A47] via-[#1a3a5c] to-[#0a1f36] px-4 pt-8 pb-16">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => navigate('/web')} className="mb-5 flex items-center gap-2 text-white/50 text-sm hover:text-white/80 transition">
            <ArrowLeft size={15} style={{ transform: isAr ? 'rotate(180deg)' : undefined }} />
            {isAr ? 'الرئيسية' : 'Home'}
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl">✈️</div>
            <div>
              <h1 className="text-2xl font-black text-white">{isAr ? 'تذاكر الطيران' : 'Flight Tickets'}</h1>
              <p className="text-white/40 text-xs">{isAr ? 'ابحث وقارن أفضل الأسعار' : 'Search and compare best prices'}</p>
            </div>
          </div>

          {/* SEARCH BOX */}
          <div className="bg-white rounded-3xl p-5 shadow-2xl">
            {/* From / To */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 bg-[#F8FAFC] rounded-2xl p-3">
                <p className="text-[10px] font-black text-gray-400 mb-1 uppercase tracking-wide">{isAr ? 'من' : 'FROM'}</p>
                <div className="flex items-center gap-2">
                  <PlaneTakeoff size={14} className="text-[#C8A951] flex-shrink-0" />
                  <input value={fromCity} onChange={e => setFromCity(e.target.value)}
                    list="cities-from"
                    placeholder={isAr ? 'مدينة المغادرة' : 'Departure city'}
                    className="flex-1 outline-none text-sm font-bold text-[#0F2A47] bg-transparent min-w-0" />
                  <datalist id="cities-from">
                    {allCitiesFrom.map(c => <option key={c} value={c} />)}
                  </datalist>
                </div>
              </div>

              <button onClick={swap} className="w-10 h-10 bg-[#0F2A47] rounded-xl flex items-center justify-center flex-shrink-0 hover:bg-[#1a4a6b] transition">
                <ArrowLeftRight size={16} className="text-white" />
              </button>

              <div className="flex-1 bg-[#F8FAFC] rounded-2xl p-3">
                <p className="text-[10px] font-black text-gray-400 mb-1 uppercase tracking-wide">{isAr ? 'إلى' : 'TO'}</p>
                <div className="flex items-center gap-2">
                  <PlaneLanding size={14} className="text-[#C8A951] flex-shrink-0" />
                  <input value={toCity} onChange={e => setToCity(e.target.value)}
                    list="cities-to"
                    placeholder={isAr ? 'مدينة الوصول' : 'Arrival city'}
                    className="flex-1 outline-none text-sm font-bold text-[#0F2A47] bg-transparent min-w-0" />
                  <datalist id="cities-to">
                    {allCitiesTo.map(c => <option key={c} value={c} />)}
                  </datalist>
                </div>
              </div>
            </div>

            {/* Date + Passengers */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-[#F8FAFC] rounded-2xl p-3">
                <p className="text-[10px] font-black text-gray-400 mb-1 uppercase tracking-wide">{isAr ? 'تاريخ السفر' : 'DATE'}</p>
                <input type="date" value={tripDate} onChange={e => setTripDate(e.target.value)}
                  className="w-full outline-none text-sm font-bold text-[#0F2A47] bg-transparent" />
              </div>
              <div className="bg-[#F8FAFC] rounded-2xl p-3">
                <p className="text-[10px] font-black text-gray-400 mb-1 uppercase tracking-wide">{isAr ? 'المسافرون' : 'PASSENGERS'}</p>
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-[#C8A951]" />
                  <div className="flex items-center gap-2">
                    <button onClick={() => setPaxCount(p => Math.max(1, p-1))} className="w-6 h-6 bg-white border border-gray-200 rounded-lg text-xs font-black flex items-center justify-center">−</button>
                    <span className="font-black text-[#0F2A47] w-4 text-center text-sm">{paxCount}</span>
                    <button onClick={() => setPaxCount(p => p+1)} className="w-6 h-6 bg-[#0F2A47] rounded-lg text-xs font-black flex items-center justify-center text-white">+</button>
                  </div>
                </div>
              </div>
            </div>

            <button onClick={() => setSearched(true)}
              className="w-full bg-[#C8A951] hover:bg-[#b8993f] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition text-sm">
              <Search size={18} />
              {isAr ? 'ابحث عن الرحلات' : 'Search Flights'}
            </button>
          </div>
        </div>
      </div>

      {/* RESULTS */}
      <div className="max-w-3xl mx-auto px-4 -mt-6 pb-10">

        {/* FILTER BAR */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 mb-4 flex items-center gap-2 overflow-x-auto">
          <button onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black flex-shrink-0 transition ${showFilters ? 'bg-[#0F2A47] text-white' : 'bg-[#F8FAFC] text-gray-600'}`}>
            <SlidersHorizontal size={13} />
            {isAr ? 'فلاتر' : 'Filters'}
          </button>

          <div className="w-px h-6 bg-gray-200 flex-shrink-0" />

          {/* Sort */}
          <span className="text-xs text-gray-400 flex-shrink-0">{isAr ? 'ترتيب:' : 'Sort:'}</span>
          {[
            { key: 'price', labelAr: 'الأرخص', labelEn: 'Cheapest' },
            { key: 'duration', labelAr: 'الأسرع', labelEn: 'Fastest' },
            { key: 'departure', labelAr: 'الأبكر', labelEn: 'Earliest' },
          ].map(s => (
            <button key={s.key} onClick={() => setSortBy(s.key)}
              className={`px-3 py-2 rounded-xl text-xs font-black flex-shrink-0 transition ${sortBy === s.key ? 'bg-[#C8A951] text-white' : 'bg-[#F8FAFC] text-gray-500'}`}>
              {isAr ? s.labelAr : s.labelEn}
            </button>
          ))}

          <div className="ms-auto flex-shrink-0 text-xs text-gray-400 font-bold">
            {filtered.length} {isAr ? 'رحلة' : 'flights'}
          </div>
        </div>

        {/* EXPANDED FILTERS */}
        {showFilters && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4 space-y-4">
            {/* Class */}
            <div>
              <p className="text-xs font-black text-gray-600 mb-2">{isAr ? 'درجة السفر' : 'Travel Class'}</p>
              <div className="flex gap-2 flex-wrap">
                {['all', 'Economy', 'Business', 'First'].map(c => (
                  <button key={c} onClick={() => setClassFilter(c)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${classFilter === c ? 'bg-[#0F2A47] text-white' : 'bg-[#F8FAFC] text-gray-500'}`}>
                    {c === 'all' ? (isAr ? 'الكل' : 'All') : c === 'Economy' ? (isAr ? 'اقتصادي' : 'Economy') : c === 'Business' ? (isAr ? 'أعمال' : 'Business') : (isAr ? 'أولى' : 'First')}
                  </button>
                ))}
              </div>
            </div>

            {/* Airline */}
            <div>
              <p className="text-xs font-black text-gray-600 mb-2">{isAr ? 'شركة الطيران' : 'Airline'}</p>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => setAirlineFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${airlineFilter === 'all' ? 'bg-[#0F2A47] text-white' : 'bg-[#F8FAFC] text-gray-500'}`}>
                  {isAr ? 'الكل' : 'All'}
                </button>
                {allAirlines.map(a => (
                  <button key={a} onClick={() => setAirlineFilter(a)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1 ${airlineFilter === a ? 'bg-[#0F2A47] text-white' : 'bg-[#F8FAFC] text-gray-500'}`}>
                    {AIRLINE_LOGOS[a] || '✈️'} {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <p className="text-xs font-black text-gray-600 mb-2">
                {isAr ? 'الحد الأقصى للسعر:' : 'Max Price:'} <span className="text-[#C8A951]">{maxPrice} {isAr ? 'ريال' : 'SAR'}</span>
              </p>
              <input type="range" min={minPrice} max={maxPriceAll} value={maxPrice}
                onChange={e => setMaxPrice(+e.target.value)} step="50"
                className="w-full accent-[#C8A951]" />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{minPrice} {isAr ? 'ريال' : 'SAR'}</span>
                <span>{maxPriceAll} {isAr ? 'ريال' : 'SAR'}</span>
              </div>
            </div>
          </div>
        )}

        {/* FLIGHT CARDS */}
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#C8A951] border-t-transparent rounded-full animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl">
            <p className="text-4xl mb-3">✈️</p>
            <p className="font-black text-gray-500 text-lg">{isAr ? 'لا توجد رحلات' : 'No flights found'}</p>
            <p className="text-gray-400 text-sm mt-1">{isAr ? 'جرب تغيير الفلاتر' : 'Try changing filters'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(f => {
              const dur = getDuration(f.departure, f.arrival)
              const fromFlag = CITY_FLAGS[f.from_en] || '🌍'
              const toFlag = CITY_FLAGS[f.to_en] || '🌍'
              const isLast = f.seats_available <= 15
              return (
                <div key={f.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition">
                  {/* Top bar */}
                  <div className="flex items-center justify-between px-4 py-2.5 bg-[#F8FAFC] border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{AIRLINE_LOGOS[f.airline] || '✈️'}</span>
                      <span className="font-black text-[#0F2A47] text-sm">{f.airline}</span>
                      <span className="text-xs text-gray-400">· {f.flight_number}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isLast && <span className="text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-full font-bold">⚡ {isAr ? 'آخر المقاعد' : 'Last seats'}</span>}
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${f.class_en === 'Business' ? 'bg-amber-100 text-amber-700' : f.class_en === 'First' ? 'bg-purple-100 text-purple-700' : 'bg-blue-50 text-blue-600'}`}>
                        {isAr ? f.class_ar : f.class_en}
                      </span>
                    </div>
                  </div>

                  {/* Route */}
                  <div className="px-4 py-4">
                    <div className="flex items-center justify-between mb-3">
                      {/* From */}
                      <div className="text-start w-24">
                        <div className="flex items-center gap-1 mb-0.5">
                          <span className="text-lg">{fromFlag}</span>
                          <span className="text-xl font-black text-[#0F2A47]">{f.departure?.split(' ')[1]?.slice(0,5)}</span>
                        </div>
                        <p className="font-bold text-sm text-[#0F2A47]">{isAr ? f.from_ar : f.from_en}</p>
                        <p className="text-xs text-gray-400">{formatDate(f.departure)}</p>
                      </div>

                      {/* Middle */}
                      <div className="flex-1 flex flex-col items-center px-3">
                        <div className="flex items-center w-full gap-1">
                          <div className="w-2 h-2 rounded-full bg-[#C8A951] flex-shrink-0" />
                          <div className="flex-1 h-px bg-gradient-to-r from-[#C8A951] to-[#0F2A47]" />
                          <PlaneTakeoff size={16} className="text-[#0F2A47] flex-shrink-0" />
                          <div className="flex-1 h-px bg-gradient-to-r from-[#0F2A47] to-[#C8A951]" />
                          <div className="w-2 h-2 rounded-full bg-[#0F2A47] flex-shrink-0" />
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock size={10} className="text-gray-400" />
                          <span className="text-xs text-gray-400 font-bold">{dur.text}</span>
                        </div>
                        <span className="text-xs text-gray-300 mt-0.5">{isAr ? 'مباشر' : 'Direct'}</span>
                      </div>

                      {/* To */}
                      <div className="text-end w-24">
                        <div className="flex items-center gap-1 mb-0.5 justify-end">
                          <span className="text-xl font-black text-[#0F2A47]">{f.arrival?.split(' ')[1]?.slice(0,5)}</span>
                          <span className="text-lg">{toFlag}</span>
                        </div>
                        <p className="font-bold text-sm text-[#0F2A47]">{isAr ? f.to_ar : f.to_en}</p>
                        <p className="text-xs text-gray-400">{formatDate(f.arrival)}</p>
                      </div>
                    </div>

                    {/* Bottom */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><Users size={11} />{f.seats_available} {isAr ? 'مقعد' : 'seats'}</span>
                        <span className="text-gray-300">|</span>
                        <span>{isAr ? 'توصيل مجاني للمطار' : 'Free airport transfer'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-end">
                          <p className="text-xl font-black text-[#C8A951]">{(f.price * paxCount).toLocaleString()}</p>
                          <p className="text-xs text-gray-400">{isAr ? 'ريال' : 'SAR'} {paxCount > 1 ? `× ${paxCount}` : ''}</p>
                        </div>
                        <button onClick={() => openBooking(f)}
                          className="bg-[#0F2A47] hover:bg-[#1a4a6b] text-white font-black px-5 py-2.5 rounded-xl text-sm transition">
                          {isAr ? 'احجز' : 'Book'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* BOOKING MODAL */}
      {activeFlight && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setActiveFlight(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-t-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h2 className="font-black text-[#0F2A47] text-lg">{isAr ? 'تأكيد الحجز' : 'Confirm Booking'}</h2>
                <p className="text-xs text-gray-400">{activeFlight.airline} · {activeFlight.flight_number}</p>
              </div>
              <button onClick={() => setActiveFlight(null)} className="p-2 bg-[#F8FAFC] rounded-xl"><X size={16} /></button>
            </div>

            {submitted ? (
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={40} className="text-green-500" />
                </div>
                <h3 className="font-black text-[#0F2A47] text-xl mb-1">{isAr ? 'تم تأكيد الحجز!' : 'Booking Confirmed!'}</h3>
                <p className="text-gray-400 text-sm mb-1">{activeFlight.flight_number}</p>
                <p className="text-gray-400 text-sm mb-1">{isAr ? activeFlight.from_ar : activeFlight.from_en} → {isAr ? activeFlight.to_ar : activeFlight.to_en}</p>
                <p className="font-black text-[#C8A951] text-2xl mt-3 mb-6">{activeFlight.price * passengers} {isAr ? 'ريال' : 'SAR'}</p>
                <p className="text-xs text-gray-400 mb-6">{isAr ? 'سيصلك رقم الحجز على جوالك' : 'Booking reference will be sent to your phone'}</p>
                <button onClick={() => setActiveFlight(null)} className="bg-[#0F2A47] text-white font-black px-10 py-3 rounded-2xl">{isAr ? 'حسناً' : 'Done'}</button>
              </div>
            ) : (
              <div className="p-5 space-y-4">
                {/* Flight Summary Card */}
                <div className="bg-gradient-to-r from-[#0F2A47] to-[#1a3a5c] rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-center">
                      <p className="text-2xl font-black text-white">{activeFlight.departure?.split(' ')[1]?.slice(0,5)}</p>
                      <p className="text-sm font-bold text-white/80">{isAr ? activeFlight.from_ar : activeFlight.from_en}</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <PlaneTakeoff size={20} className="text-[#C8A951]" />
                      <p className="text-xs text-white/50 mt-1">{getDuration(activeFlight.departure, activeFlight.arrival).text}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-white">{activeFlight.arrival?.split(' ')[1]?.slice(0,5)}</p>
                      <p className="text-sm font-bold text-white/80">{isAr ? activeFlight.to_ar : activeFlight.to_en}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-white/50 border-t border-white/10 pt-2">
                    <span>{activeFlight.airline} · {activeFlight.flight_number}</span>
                    <span>{isAr ? activeFlight.class_ar : activeFlight.class_en}</span>
                  </div>
                </div>

                {/* Passengers */}
                <div className="flex items-center justify-between bg-[#F8FAFC] rounded-2xl p-4">
                  <span className="font-black text-[#0F2A47] text-sm flex items-center gap-2"><Users size={16} />{isAr ? 'المسافرون' : 'Passengers'}</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setPassengers(p => Math.max(1, p-1))} className="w-9 h-9 bg-white border border-gray-200 rounded-xl flex items-center justify-center font-black text-lg">−</button>
                    <span className="font-black text-[#0F2A47] w-6 text-center text-lg">{passengers}</span>
                    <button onClick={() => setPassengers(p => Math.min(activeFlight.seats_available, p+1))} className="w-9 h-9 bg-[#0F2A47] rounded-xl flex items-center justify-center text-white font-black text-lg">+</button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-gray-600 block mb-1.5">{isAr ? 'اسم المسافر الرئيسي *' : 'Lead Passenger Name *'}</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder={isAr ? 'كما في جواز السفر' : 'As in passport'}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C8A951]" />
                </div>
                <div>
                  <label className="text-xs font-black text-gray-600 block mb-1.5">{isAr ? 'رقم الجوال *' : 'Phone *'}</label>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+966 5X XXX XXXX"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C8A951]" />
                </div>
                <div>
                  <label className="text-xs font-black text-gray-600 block mb-1.5">{isAr ? 'رقم جواز السفر' : 'Passport Number'}</label>
                  <input value={form.passport} onChange={e => setForm(f => ({ ...f, passport: e.target.value }))}
                    placeholder="A12345678"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C8A951]" />
                </div>

                {/* Total */}
                <div className="bg-[#F8FAFC] rounded-2xl p-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">{passengers} × {activeFlight.price} {isAr ? 'ريال' : 'SAR'}</span>
                    <span className="font-black text-[#0F2A47]">{activeFlight.price * passengers} {isAr ? 'ريال' : 'SAR'}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">{isAr ? 'الضرائب والرسوم' : 'Taxes & fees'}</span>
                    <span className="text-green-600 font-bold">{isAr ? 'مشمولة' : 'Included'}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between">
                    <span className="font-black text-[#0F2A47]">{isAr ? 'الإجمالي' : 'Total'}</span>
                    <span className="font-black text-[#C8A951] text-xl">{activeFlight.price * passengers} {isAr ? 'ريال' : 'SAR'}</span>
                  </div>
                </div>

                <button onClick={() => { if (form.name && form.phone) setSubmitted(true) }}
                  disabled={!form.name || !form.phone}
                  className="w-full bg-[#C8A951] hover:bg-[#b8993f] text-white font-black py-4 rounded-2xl disabled:opacity-50 flex items-center justify-center gap-2 transition text-sm">
                  <PlaneTakeoff size={18} />
                  {isAr ? 'تأكيد الحجز والدفع' : 'Confirm & Pay'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
