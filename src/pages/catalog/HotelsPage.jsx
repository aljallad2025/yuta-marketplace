import { useState, useEffect, useMemo } from 'react'
import {
  Search, Star, Users, ArrowLeft, X, CheckCircle,
  SlidersHorizontal, MapPin, Wifi, Coffee,
  Car, Wind, ChevronRight, ChevronLeft, Heart,
  Shield, Award, Camera, Bed, Maximize2,
  Moon, Calendar, Check
} from 'lucide-react'
import { useLang } from '../../i18n/LangContext'
import { useNavigate } from 'react-router-dom'

const AMENITY_ICONS = {
  'واي فاي': '📶', 'WiFi': '📶',
  'مواقف': '🚗', 'Parking': '🚗',
  'مكيف': '❄️', 'AC': '❄️',
  'إفطار': '☕', 'Breakfast': '☕',
  'مسبح': '🏊', 'Pool': '🏊',
  'جاكوزي': '🛁', 'Jacuzzi': '🛁',
  'مطعم': '🍽️', 'Restaurant': '🍽️',
  'صالة رياضية': '🏋️', 'Gym': '🏋️',
}

const HOTEL_IMAGES = {
  11: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
  12: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80',
}

const ROOM_IMAGES = {
  'غرفة مفردة': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
  'Single Room': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
  'جناح فندقي': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
  'Suite': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
  'default': 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80',
}

function parseAmenities(a) {
  try { return JSON.parse(a) } catch { return (a || '').split(',').map(x => x.trim()).filter(Boolean) }
}

function StarRating({ rating = 4.5, size = 12 }) {
  const stars = Math.round(rating)
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={size}
          className={i <= stars ? 'fill-[#C8A951] text-[#C8A951]' : 'text-gray-200 fill-gray-200'} />
      ))}
    </div>
  )
}

function HotelCard({ store, roomCount, onSelect, isAr, isFav, onFav }) {
  const img = HOTEL_IMAGES[store.id] || 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80'
  const minPrice = store.min_price || 450
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-[#EEEAE2] hover:shadow-xl transition-all duration-300 group">
      <div className="relative h-52 overflow-hidden">
        <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <button
          onClick={e => { e.stopPropagation(); onFav() }}
          className={`absolute top-3 end-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm transition ${isFav ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-400 hover:text-red-500'}`}>
          <Heart size={16} className={isFav ? 'fill-white' : ''} />
        </button>
        <div className="absolute bottom-3 start-3">
          <span className="bg-[#C8A951] text-white text-xs font-black px-3 py-1 rounded-full">
            {isAr ? 'أفضل سعر' : 'Best Price'}
          </span>
        </div>
        <div className="absolute bottom-3 end-3 bg-white/90 backdrop-blur-sm rounded-xl px-2 py-1 flex items-center gap-1">
          <Camera size={11} className="text-gray-500" />
          <span className="text-xs text-gray-600 font-bold">8+</span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0 me-3">
            <h3 className="font-black text-[#0F2A47] text-base leading-tight">
              {isAr ? store.name_ar : store.name_en}
            </h3>
            <div className="flex items-center gap-1 mt-1">
              <MapPin size={11} className="text-gray-400 flex-shrink-0" />
              <span className="text-xs text-gray-400 truncate">
                {isAr ? (store.address_ar || 'الرياض، المملكة العربية السعودية') : (store.address_en || 'Riyadh, Saudi Arabia')}
              </span>
            </div>
          </div>
          <div className="text-end flex-shrink-0">
            <div className="text-lg font-black text-[#0F2A47]">{isAr ? 'من ' + minPrice : 'From ' + minPrice}</div>
            <div className="text-xs text-gray-400">{isAr ? 'ريال/ليلة' : 'SAR/night'}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={store.rating || 4.5} />
          <span className="text-xs font-black text-[#C8A951]">{store.rating || '4.5'}</span>
          <span className="text-xs text-gray-400">({isAr ? '٢٤٠ تقييم' : '240 reviews'})</span>
        </div>
        <div className="flex items-center gap-1.5 mb-4 flex-wrap">
          {['Wifi','Parking','Pool'].map(a => (
            <span key={a} className="flex items-center gap-1 text-xs bg-[#FBF8F2] text-gray-500 px-2 py-1 rounded-lg">
              {AMENITY_ICONS[a] || '✓'} {isAr ? (a === 'Wifi' ? 'واي فاي' : a === 'Parking' ? 'مواقف' : 'مسبح') : a}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Bed size={12} /> {roomCount} {isAr ? 'غرفة متاحة' : 'rooms available'}
          </span>
          <button onClick={() => onSelect(store)}
            className="bg-[#0F2A47] hover:bg-[#1a4a6b] text-white font-black px-5 py-2.5 rounded-xl text-sm transition flex items-center gap-1.5">
            {isAr ? 'عرض الغرف' : 'View Rooms'}
            <ChevronRight size={14} style={{ transform: isAr ? 'rotate(180deg)' : undefined }} />
          </button>
        </div>
      </div>
    </div>
  )
}

function RoomCard({ room, onBook, isAr, nights }) {
  const [imgIdx, setImgIdx] = useState(0)
  const amenities = parseAmenities(room.amenities)
  const imgs = [
    ROOM_IMAGES[isAr ? room.room_type_ar : room.room_type_en] || ROOM_IMAGES.default,
    ROOM_IMAGES.default,
  ]
  const total = room.price_per_night * (nights || 1)
  return (
    <div className="bg-white rounded-3xl border border-[#EEEAE2] overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative h-48 overflow-hidden">
        <img src={imgs[imgIdx]} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        {imgs.length > 1 && (
          <>
            <button onClick={() => setImgIdx(i => (i - 1 + imgs.length) % imgs.length)}
              className="absolute start-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center">
              <ChevronLeft size={14} />
            </button>
            <button onClick={() => setImgIdx(i => (i + 1) % imgs.length)}
              className="absolute end-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center">
              <ChevronRight size={14} />
            </button>
          </>
        )}
        <div className="absolute bottom-2 start-3 flex gap-1">
          {imgs.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${imgIdx === i ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`} />
          ))}
        </div>
        <div className="absolute top-3 end-3">
          <span className={`text-xs px-2.5 py-1 rounded-full font-black ${room.available ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
            {room.available ? (isAr ? '✓ متاح' : '✓ Available') : (isAr ? 'محجوز' : 'Booked')}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-black text-[#0F2A47] text-base">{isAr ? room.room_type_ar : room.room_type_en}</h3>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 flex-wrap">
              <span className="flex items-center gap-1"><Users size={11} />{room.max_guests} {isAr ? 'ضيوف' : 'guests'}</span>
              <span className="flex items-center gap-1"><Maximize2 size={11} />{room.size_sqm || 35} m²</span>
              <span className="flex items-center gap-1"><Bed size={11} />{isAr ? 'سرير كبير' : 'King Bed'}</span>
            </div>
          </div>
          <div className="text-end flex-shrink-0 ms-2">
            <div className="text-2xl font-black text-[#C8A951]">{room.price_per_night}</div>
            <div className="text-xs text-gray-400">{isAr ? 'ريال/ليلة' : 'SAR/night'}</div>
          </div>
        </div>
        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {amenities.map((a, i) => (
              <span key={i} className="flex items-center gap-1 text-xs bg-[#FBF8F2] text-gray-600 px-2 py-1 rounded-lg font-medium">
                {AMENITY_ICONS[a] || '✓'} {a}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-4 bg-[#FBF8F2] rounded-xl p-2.5 flex-wrap">
          <span className="flex items-center gap-1"><Check size={11} className="text-green-500" />{isAr ? 'إلغاء مجاني' : 'Free cancellation'}</span>
          <span className="flex items-center gap-1"><Shield size={11} className="text-blue-500" />{isAr ? 'دفع آمن' : 'Secure pay'}</span>
        </div>
        {nights > 0 && (
          <div className="flex items-center justify-between mb-3 text-sm border-t border-[#EEEAE2] pt-3">
            <span className="text-gray-400">{nights} {isAr ? 'ليلة' : 'nights'} × {room.price_per_night}</span>
            <span className="font-black text-[#0F2A47] text-base">{total} {isAr ? 'ريال' : 'SAR'}</span>
          </div>
        )}
        <button onClick={() => onBook(room)} disabled={!room.available}
          className="w-full bg-[#C8A951] hover:bg-[#b8993f] disabled:opacity-40 text-white font-black py-3.5 rounded-2xl text-sm transition flex items-center justify-center gap-2">
          <Calendar size={16} />
          {isAr ? 'احجز هذه الغرفة' : 'Book This Room'}
        </button>
      </div>
    </div>
  )
}

export default function HotelsPage() {
  const { isAr } = useLang()
  const navigate = useNavigate()
  const [stores, setStores] = useState([])
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeStore, setActiveStore] = useState(null)
  const [activeRoom, setActiveRoom] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)
  const [showFilters, setShowFilters] = useState(false)
  const [maxPrice, setMaxPrice] = useState(5000)
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState('rating')
  const [form, setForm] = useState({ name: '', phone: '', requests: '' })

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 1
    const diff = (new Date(checkOut) - new Date(checkIn)) / 86400000
    return diff > 0 ? diff : 1
  }, [checkIn, checkOut])

  useEffect(() => {
    Promise.all([
      fetch('/api/stores?category=hotels').then(r => r.json()),
      fetch('/api/catalog/hotels').then(r => r.json())
    ]).then(([s, r]) => {
      setStores(Array.isArray(s) ? s : [])
      setRooms(Array.isArray(r) ? r : [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const storeRooms = useMemo(() =>
    activeStore ? rooms.filter(r => r.store_id === activeStore.id) : [],
    [activeStore, rooms]
  )

  const filteredStores = useMemo(() => {
    let result = [...stores]
    result = result.filter(s => {
      const prices = rooms.filter(r => r.store_id === s.id).map(r => r.price_per_night)
      return prices.length === 0 || Math.min(...prices) <= maxPrice
    })
    if (minRating > 0) result = result.filter(s => (s.rating || 4.5) >= minRating)
    result.sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 4.5) - (a.rating || 4.5)
      const aMin = Math.min(...rooms.filter(r => r.store_id === a.id).map(r => r.price_per_night), 9999)
      const bMin = Math.min(...rooms.filter(r => r.store_id === b.id).map(r => r.price_per_night), 9999)
      return sortBy === 'price_asc' ? aMin - bMin : bMin - aMin
    })
    return result
  }, [stores, rooms, maxPrice, minRating, sortBy])

  const openBooking = (room) => { setActiveRoom(room); setSubmitted(false); setForm({ name: '', phone: '', requests: '' }) }
  const toggleFav = (id) => setFavorites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id])
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-[#F0F4F8]" dir={isAr ? 'rtl' : 'ltr'}>

      <div className="bg-gradient-to-br from-[#0F2A47] via-[#1a3a5c] to-[#0a1f36] px-4 pt-8 pb-20">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => activeStore ? setActiveStore(null) : navigate('/web')}
            className="mb-5 flex items-center gap-2 text-white/50 hover:text-white/80 text-sm transition">
            <ArrowLeft size={15} style={{ transform: isAr ? 'rotate(180deg)' : undefined }} />
            {activeStore ? (isAr ? 'الفنادق' : 'Hotels') : (isAr ? 'الرئيسية' : 'Home')}
          </button>

          {!activeStore ? (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 bg-white/10 rounded-2xl flex items-center justify-center text-2xl">🏨</div>
                <div>
                  <h1 className="text-3xl font-black text-white">{isAr ? 'الفنادق' : 'Hotels'}</h1>
                  <p className="text-white/40 text-xs mt-0.5">{isAr ? 'ابحث وقارن أفضل الفنادق' : 'Search & compare top hotels'}</p>
                </div>
              </div>
              <div className="bg-white rounded-3xl p-5 shadow-2xl">
                <div className="bg-[#F8FAFC] rounded-2xl p-3.5 mb-3">
                  <p className="text-[10px] font-black text-gray-400 mb-1 uppercase tracking-widest">{isAr ? 'الوجهة' : 'DESTINATION'}</p>
                  <div className="flex items-center gap-2">
                    <MapPin size={15} className="text-[#C8A951] flex-shrink-0" />
                    <input placeholder={isAr ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia'}
                      className="flex-1 outline-none text-sm font-bold text-[#0F2A47] bg-transparent" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-[#F8FAFC] rounded-2xl p-3.5">
                    <p className="text-[10px] font-black text-gray-400 mb-1 uppercase tracking-widest">{isAr ? 'الوصول' : 'CHECK-IN'}</p>
                    <input type="date" min={today} value={checkIn} onChange={e => setCheckIn(e.target.value)}
                      className="w-full outline-none text-sm font-bold text-[#0F2A47] bg-transparent" />
                  </div>
                  <div className="bg-[#F8FAFC] rounded-2xl p-3.5">
                    <p className="text-[10px] font-black text-gray-400 mb-1 uppercase tracking-widest">{isAr ? 'المغادرة' : 'CHECK-OUT'}</p>
                    <input type="date" min={checkIn || today} value={checkOut} onChange={e => setCheckOut(e.target.value)}
                      className="w-full outline-none text-sm font-bold text-[#0F2A47] bg-transparent" />
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 bg-[#F8FAFC] rounded-2xl p-3.5">
                    <p className="text-[10px] font-black text-gray-400 mb-1 uppercase tracking-widest">{isAr ? 'الضيوف' : 'GUESTS'}</p>
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-[#C8A951]" />
                      <button onClick={() => setGuests(g => Math.max(1, g - 1))} className="w-6 h-6 bg-white border border-gray-200 rounded-lg text-xs font-black flex items-center justify-center">−</button>
                      <span className="font-black text-[#0F2A47] w-4 text-center text-sm">{guests}</span>
                      <button onClick={() => setGuests(g => g + 1)} className="w-6 h-6 bg-[#0F2A47] rounded-lg text-xs font-black text-white flex items-center justify-center">+</button>
                    </div>
                  </div>
                  {checkIn && checkOut && nights > 0 && (
                    <div className="bg-[#0F2A47] rounded-2xl px-4 py-3.5 text-center flex-shrink-0">
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{isAr ? 'المدة' : 'NIGHTS'}</p>
                      <p className="text-xl font-black text-[#C8A951]">{nights}</p>
                    </div>
                  )}
                </div>
                <button onClick={() => {}}
                  className="w-full bg-[#C8A951] hover:bg-[#b8993f] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition text-sm">
                  <Search size={18} />
                  {isAr ? 'ابحث عن فندق' : 'Search Hotels'}
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-white/20">
                <img src={HOTEL_IMAGES[activeStore.id] || 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=200&q=80'}
                  alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-xl font-black text-white">{isAr ? activeStore.name_ar : activeStore.name_en}</h1>
                <StarRating rating={activeStore.rating || 4.5} />
                <p className="text-white/40 text-xs mt-1">{storeRooms.length} {isAr ? 'غرفة وجناح' : 'rooms & suites'}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-6 pb-12">
        {!activeStore ? (
          <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 mb-4 flex items-center gap-2 overflow-x-auto">
              <button onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black flex-shrink-0 transition ${showFilters ? 'bg-[#0F2A47] text-white' : 'bg-[#F8FAFC] text-gray-600'}`}>
                <SlidersHorizontal size={13} />
                {isAr ? 'فلاتر' : 'Filters'}
              </button>
              <div className="w-px h-6 bg-gray-100 flex-shrink-0" />
              {[
                { key: 'rating', ar: 'الأعلى تقييماً', en: 'Top Rated' },
                { key: 'price_asc', ar: 'الأرخص', en: 'Cheapest' },
                { key: 'price_desc', ar: 'فاخر', en: 'Luxury' },
              ].map(s => (
                <button key={s.key} onClick={() => setSortBy(s.key)}
                  className={`px-3 py-2 rounded-xl text-xs font-black flex-shrink-0 transition ${sortBy === s.key ? 'bg-[#C8A951] text-white' : 'bg-[#F8FAFC] text-gray-500'}`}>
                  {isAr ? s.ar : s.en}
                </button>
              ))}
              <div className="ms-auto text-xs text-gray-400 font-bold flex-shrink-0">
                {filteredStores.length} {isAr ? 'فندق' : 'hotels'}
              </div>
            </div>

            {showFilters && (
              <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 space-y-4">
                <div>
                  <p className="text-xs font-black text-gray-600 mb-2">
                    {isAr ? 'الحد الأقصى للسعر: ' : 'Max Price: '}
                    <span className="text-[#C8A951]">{maxPrice} {isAr ? 'ريال/ليلة' : 'SAR/night'}</span>
                  </p>
                  <input type="range" min={100} max={5000} value={maxPrice}
                    onChange={e => setMaxPrice(+e.target.value)} step={50}
                    className="w-full accent-[#C8A951]" />
                </div>
                <div>
                  <p className="text-xs font-black text-gray-600 mb-2">{isAr ? 'الحد الأدنى للتقييم' : 'Min Rating'}</p>
                  <div className="flex gap-2 flex-wrap">
                    {[0, 3, 4, 4.5].map(r => (
                      <button key={r} onClick={() => setMinRating(r)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${minRating === r ? 'bg-[#0F2A47] text-white' : 'bg-[#F8FAFC] text-gray-500'}`}>
                        {r === 0 ? (isAr ? 'الكل' : 'All') : r + '+ ⭐'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-[#C8A951] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                {filteredStores.map(store => (
                  <HotelCard key={store.id} store={store}
                    roomCount={rooms.filter(r => r.store_id === store.id && r.available).length}
                    onSelect={setActiveStore} isAr={isAr}
                    isFav={favorites.includes(store.id)} onFav={() => toggleFav(store.id)} />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {(checkIn || checkOut) && (
              <div className="bg-white rounded-2xl border border-gray-100 p-3 mb-4 flex items-center gap-3 text-sm">
                <Calendar size={15} className="text-[#C8A951]" />
                <span className="text-gray-500">{checkIn || '—'} → {checkOut || '—'}</span>
                <span className="ms-auto flex items-center gap-1 font-black text-[#0F2A47]">
                  <Moon size={13} /> {nights} {isAr ? 'ليالي' : 'nights'}
                </span>
              </div>
            )}
            {storeRooms.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl text-gray-400">
                <p className="text-4xl mb-3">🏨</p>
                <p className="font-black text-lg">{isAr ? 'لا توجد غرف' : 'No rooms'}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {storeRooms.map(room => (
                  <RoomCard key={room.id} room={room} onBook={openBooking} isAr={isAr} nights={nights} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {activeRoom && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setActiveRoom(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-t-3xl w-full max-w-lg max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="h-36 relative overflow-hidden rounded-t-3xl">
              <img src={ROOM_IMAGES[isAr ? activeRoom.room_type_ar : activeRoom.room_type_en] || ROOM_IMAGES.default}
                alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <button onClick={() => setActiveRoom(null)}
                className="absolute top-3 end-3 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
                <X size={16} />
              </button>
              <div className="absolute bottom-3 start-4">
                <p className="font-black text-white text-lg">{isAr ? activeRoom.room_type_ar : activeRoom.room_type_en}</p>
                <p className="text-white/60 text-xs">{activeRoom.max_guests} {isAr ? 'ضيوف' : 'guests'}</p>
              </div>
            </div>

            {submitted ? (
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={40} className="text-green-500" />
                </div>
                <h3 className="font-black text-[#0F2A47] text-2xl mb-1">{isAr ? 'تم الحجز! 🎉' : 'Booked! 🎉'}</h3>
                <p className="text-gray-400 text-sm mb-1">{isAr ? activeRoom.room_type_ar : activeRoom.room_type_en}</p>
                {checkIn && checkOut && <p className="text-gray-400 text-sm mb-2">{checkIn} → {checkOut}</p>}
                <p className="font-black text-[#C8A951] text-3xl mt-3">{activeRoom.price_per_night * nights} {isAr ? 'ريال' : 'SAR'}</p>
                <p className="text-xs text-gray-400 mt-1 mb-6">{nights} {isAr ? 'ليلة' : 'nights'} × {activeRoom.price_per_night}</p>
                <div className="bg-[#FBF8F2] rounded-2xl p-4 text-start mb-6 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-gray-500"><Check size={12} className="text-green-500" />{isAr ? 'سيصلك رقم الحجز على جوالك' : 'Booking ref sent to your phone'}</div>
                  <div className="flex items-center gap-2 text-xs text-gray-500"><Check size={12} className="text-green-500" />{isAr ? 'إلغاء مجاني حتى 24 ساعة قبل الوصول' : 'Free cancellation up to 24h before'}</div>
                </div>
                <button onClick={() => setActiveRoom(null)} className="bg-[#0F2A47] text-white font-black px-10 py-3.5 rounded-2xl">
                  {isAr ? 'رائع، شكراً!' : 'Great, Thanks!'}
                </button>
              </div>
            ) : (
              <div className="p-5 space-y-4">
                <div className="bg-gradient-to-r from-[#0F2A47] to-[#1a3a5c] rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-white/50 text-xs uppercase tracking-wide">{isAr ? 'الوصول' : 'CHECK-IN'}</p>
                      <p className="font-black text-white">{checkIn || (isAr ? 'حدد التاريخ' : 'Select date')}</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <Moon size={16} className="text-[#C8A951]" />
                      <p className="text-xs text-white/50 mt-0.5">{nights} {isAr ? 'ليلة' : 'nights'}</p>
                    </div>
                    <div className="text-end">
                      <p className="text-white/50 text-xs uppercase tracking-wide">{isAr ? 'المغادرة' : 'CHECK-OUT'}</p>
                      <p className="font-black text-white">{checkOut || (isAr ? 'حدد التاريخ' : 'Select date')}</p>
                    </div>
                  </div>
                  <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                    <span className="text-white/50 text-xs">{activeRoom.price_per_night} × {nights} {isAr ? 'ليلة' : 'nights'}</span>
                    <span className="font-black text-[#C8A951] text-xl">{activeRoom.price_per_night * nights} {isAr ? 'ريال' : 'SAR'}</span>
                  </div>
                </div>

                {(!checkIn || !checkOut) && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-black text-gray-600 block mb-1.5">{isAr ? 'تاريخ الوصول *' : 'Check-in *'}</label>
                      <input type="date" min={today} value={checkIn} onChange={e => setCheckIn(e.target.value)}
                        className="w-full border border-[#E8E4DC] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#C8A951]" />
                    </div>
                    <div>
                      <label className="text-xs font-black text-gray-600 block mb-1.5">{isAr ? 'تاريخ المغادرة *' : 'Check-out *'}</label>
                      <input type="date" min={checkIn || today} value={checkOut} onChange={e => setCheckOut(e.target.value)}
                        className="w-full border border-[#E8E4DC] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#C8A951]" />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between bg-[#F8FAFC] rounded-2xl p-4">
                  <span className="font-black text-[#0F2A47] text-sm flex items-center gap-2">
                    <Users size={16} />{isAr ? 'عدد الضيوف' : 'Guests'}
                  </span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setGuests(g => Math.max(1, g - 1))} className="w-9 h-9 bg-white border border-gray-200 rounded-xl flex items-center justify-center font-black text-lg">−</button>
                    <span className="font-black text-[#0F2A47] w-5 text-center text-lg">{guests}</span>
                    <button onClick={() => setGuests(g => Math.min(activeRoom.max_guests, g + 1))} className="w-9 h-9 bg-[#0F2A47] rounded-xl flex items-center justify-center text-white font-black text-lg">+</button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-gray-600 block mb-1.5">{isAr ? 'الاسم الكامل *' : 'Full Name *'}</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder={isAr ? 'محمد أحمد الشمري' : 'John Smith'}
                    className="w-full border border-[#E8E4DC] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C8A951]" />
                </div>
                <div>
                  <label className="text-xs font-black text-gray-600 block mb-1.5">{isAr ? 'رقم الجوال *' : 'Phone *'}</label>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+966 5X XXX XXXX"
                    className="w-full border border-[#E8E4DC] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C8A951]" />
                </div>
                <div>
                  <label className="text-xs font-black text-gray-600 block mb-1.5">{isAr ? 'طلبات خاصة (اختياري)' : 'Special Requests (optional)'}</label>
                  <textarea value={form.requests} onChange={e => setForm(f => ({ ...f, requests: e.target.value }))}
                    rows={2} placeholder={isAr ? 'سرير إضافي، طابق عالٍ...' : 'Extra bed, high floor...'}
                    className="w-full border border-[#E8E4DC] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C8A951] resize-none" />
                </div>

                <div className="bg-[#FBF8F2] rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500"><Check size={12} className="text-green-500 flex-shrink-0" />{isAr ? 'إلغاء مجاني حتى 24 ساعة قبل الوصول' : 'Free cancellation up to 24h before check-in'}</div>
                  <div className="flex items-center gap-2 text-xs text-gray-500"><Shield size={12} className="text-blue-500 flex-shrink-0" />{isAr ? 'دفع آمن ومشفر' : 'Secure & encrypted payment'}</div>
                  <div className="flex items-center gap-2 text-xs text-gray-500"><Award size={12} className="text-[#C8A951] flex-shrink-0" />{isAr ? 'أفضل سعر مضمون' : 'Best price guaranteed'}</div>
                </div>

                <button onClick={() => { if (form.name && form.phone) setSubmitted(true) }}
                  disabled={!form.name || !form.phone}
                  className="w-full bg-[#C8A951] hover:bg-[#b8993f] disabled:opacity-50 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition text-sm">
                  <Calendar size={18} />
                  {isAr ? 'تأكيد الحجز · ' + (activeRoom.price_per_night * nights) + ' ريال' : 'Confirm · ' + (activeRoom.price_per_night * nights) + ' SAR'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
