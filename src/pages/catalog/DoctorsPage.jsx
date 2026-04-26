import { useState, useEffect } from 'react'
import { Search, Star, ArrowLeft, X, CheckCircle, MapPin, Globe, Clock, Award, Heart, ChevronRight, Calendar, User } from 'lucide-react'
import { useLang } from '../../i18n/LangContext'
import { useNavigate } from 'react-router-dom'

function getLabel(lang, ar, en, th, lo, vi) {
  if (lang === 'ar') return ar
  if (lang === 'th') return th || en
  if (lang === 'lo') return lo || en
  if (lang === 'vi') return vi || en
  return en
}

function StarRating({ rating, count }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ display: 'flex', gap: 2 }}>
        {[1,2,3,4,5].map(i => (
          <Star key={i} size={13} style={{ fill: i <= Math.round(rating) ? '#00C9A7' : 'rgba(255,255,255,0.15)', color: i <= Math.round(rating) ? '#00C9A7' : 'rgba(255,255,255,0.15)' }} />
        ))}
      </div>
      <span style={{ color: '#00C9A7', fontWeight: 800, fontSize: 13 }}>{rating}</span>
      {count && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>({count})</span>}
    </div>
  )
}

function DoctorProfile({ doc, lang, isAr, onBook, onBack }) {
  const [activeTab, setActiveTab] = useState('info')
  const parse = (v) => { try { return JSON.parse(v) } catch { return (v||'').split(',').map(x=>x.trim()).filter(Boolean) } }

  const tabs = [
    { key: 'info', en: 'About', ar: 'عن الطبيب', th: 'เกี่ยวกับ', lo: 'ກ່ຽວກັບ', vi: 'Giới thiệu' },
    { key: 'schedule', en: 'Schedule', ar: 'المواعيد', th: 'ตารางเวลา', lo: 'ຕາຕະລາງ', vi: 'Lịch khám' },
    { key: 'reviews', en: 'Reviews', ar: 'التقييمات', th: 'รีวิว', lo: 'ການທົບທວນ', vi: 'Đánh giá' },
  ]

  const fakeReviews = [
    { name: 'Ahmed M.', rating: 5, text: 'Excellent doctor, very professional and caring.', date: '2 days ago' },
    { name: 'Sara K.', rating: 5, text: 'Great experience, highly recommended!', date: '1 week ago' },
    { name: 'Omar R.', rating: 4, text: 'Very knowledgeable and thorough consultation.', date: '2 weeks ago' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#080F1E' }}>
      {/* HERO with photo */}
      <div style={{ position: 'relative', height: 280, overflow: 'hidden' }}>
        <img src={doc.photo || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80'}
          alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(8,15,30,0.3) 0%, rgba(8,15,30,0.95) 100%)' }} />

        <button onClick={onBack}
          style={{ position: 'absolute', top: 16, left: isAr ? undefined : 16, right: isAr ? 16 : undefined, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: 10, cursor: 'pointer', color: '#fff' }}>
          <ArrowLeft size={18} style={{ transform: isAr ? 'rotate(180deg)' : undefined }} />
        </button>

        <button style={{ position: 'absolute', top: 16, right: isAr ? undefined : 16, left: isAr ? 16 : undefined, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: 10, cursor: 'pointer', color: '#fff' }}>
          <Heart size={18} />
        </button>

        <div style={{ position: 'absolute', bottom: 20, left: 16, right: 16 }}>
          <div style={{ display: 'inline-block', background: 'rgba(0,201,167,0.2)', border: '1px solid rgba(0,201,167,0.4)', borderRadius: 20, padding: '3px 10px', marginBottom: 8 }}>
            <span style={{ color: '#00C9A7', fontSize: 11, fontWeight: 800, letterSpacing: 1 }}>{isAr ? doc.specialty_ar : doc.specialty_en}</span>
          </div>
          <h1 style={{ color: '#fff', fontWeight: 900, fontSize: 24, margin: '0 0 6px' }}>{isAr ? doc.name_ar : doc.name_en}</h1>
          <StarRating rating={doc.rating || 4.8} count={doc.reviews_count} />
        </div>
      </div>

      {/* QUICK STATS */}
      <div style={{ background: '#0D1B4B', borderTop: '1px solid rgba(0,201,167,0.15)', borderBottom: '1px solid rgba(0,201,167,0.15)', padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', maxWidth: 500, margin: '0 auto' }}>
          {[
            { icon: <Award size={16} style={{ color: '#00C9A7' }} />, val: `${doc.experience_years}+`, label: getLabel(lang, 'سنة خبرة', 'Yrs Exp', 'ปีประสบการณ์', 'ປີ', 'Năm KN') },
            { icon: <User size={16} style={{ color: '#00C9A7' }} />, val: doc.reviews_count || 0, label: getLabel(lang, 'مريض', 'Patients', 'ผู้ป่วย', 'ຄົນເຈັບ', 'Bệnh nhân') },
            { icon: <Star size={16} style={{ color: '#00C9A7' }} />, val: doc.rating || '4.8', label: getLabel(lang, 'تقييم', 'Rating', 'คะแนน', 'ຄະແນນ', 'Đánh giá') },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>{s.icon}</div>
              <div style={{ color: '#fff', fontWeight: 900, fontSize: 18 }}>{s.val}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TABS */}
      <div style={{ background: '#080F1E', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 16px', display: 'flex', gap: 4 }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            style={{ background: 'none', border: 'none', borderBottom: activeTab === tab.key ? '2px solid #00C9A7' : '2px solid transparent', color: activeTab === tab.key ? '#00C9A7' : 'rgba(255,255,255,0.4)', fontWeight: 700, fontSize: 13, padding: '14px 16px', cursor: 'pointer', transition: 'all 0.2s' }}>
            {getLabel(lang, tab.ar, tab.en, tab.th, tab.lo, tab.vi)}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div style={{ padding: '20px 16px', maxWidth: 600, margin: '0 auto', paddingBottom: 120 }}>
        {activeTab === 'info' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Bio */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 16 }}>
              <h3 style={{ color: '#00C9A7', fontWeight: 800, fontSize: 13, letterSpacing: 1, marginBottom: 10 }}>
                {getLabel(lang, 'نبذة عن الطبيب', 'ABOUT', 'เกี่ยวกับ', 'ກ່ຽວກັບ', 'GIỚI THIỆU')}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                {isAr ? doc.bio_ar : doc.bio_en}
              </p>
            </div>

            {/* Location */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 16 }}>
              <h3 style={{ color: '#00C9A7', fontWeight: 800, fontSize: 13, letterSpacing: 1, marginBottom: 10 }}>
                {getLabel(lang, 'الموقع', 'LOCATION', 'ที่ตั้ง', 'ສະຖານທີ່', 'ĐỊA ĐIỂM')}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapPin size={16} style={{ color: '#00C9A7', flexShrink: 0 }} />
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                  {isAr ? doc.location_ar : doc.location_en}
                </span>
              </div>
            </div>

            {/* Languages */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 16 }}>
              <h3 style={{ color: '#00C9A7', fontWeight: 800, fontSize: 13, letterSpacing: 1, marginBottom: 10 }}>
                {getLabel(lang, 'اللغات', 'LANGUAGES', 'ภาษา', 'ພາສາ', 'NGÔN NGỮ')}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {(doc.languages || 'Arabic,English').split(',').map((l, i) => (
                  <span key={i} style={{ background: 'rgba(0,201,167,0.1)', border: '1px solid rgba(0,201,167,0.2)', color: '#00C9A7', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Globe size={11} />{l.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 16 }}>
              <h3 style={{ color: '#00C9A7', fontWeight: 800, fontSize: 13, letterSpacing: 1, marginBottom: 14 }}>
                {getLabel(lang, 'الأيام المتاحة', 'AVAILABLE DAYS', 'วันที่ว่าง', 'ວັນທີ່ວ່າງ', 'NGÀY CÓ THỂ')}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {parse(doc.available_days).map((d, i) => (
                  <div key={i} style={{ background: 'rgba(0,201,167,0.1)', border: '1px solid rgba(0,201,167,0.25)', borderRadius: 12, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Calendar size={13} style={{ color: '#00C9A7' }} />
                    <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>{d}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 16 }}>
              <h3 style={{ color: '#00C9A7', fontWeight: 800, fontSize: 13, letterSpacing: 1, marginBottom: 14 }}>
                {getLabel(lang, 'الأوقات المتاحة', 'AVAILABLE TIMES', 'เวลาที่ว่าง', 'ເວລາທີ່ວ່າງ', 'GIỜ CÓ THỂ')}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {parse(doc.available_times).map((t, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Clock size={13} style={{ color: 'rgba(255,255,255,0.5)' }} />
                    <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: 'rgba(0,201,167,0.08)', border: '1px solid rgba(0,201,167,0.15)', borderRadius: 16, padding: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#00C9A7', fontWeight: 900, fontSize: 40, lineHeight: 1 }}>{doc.rating || '4.8'}</div>
                <StarRating rating={doc.rating || 4.8} />
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 4 }}>{doc.reviews_count} {getLabel(lang, 'تقييم', 'reviews', 'รีวิว', 'ການທົບທວນ', 'đánh giá')}</div>
              </div>
              <div style={{ flex: 1 }}>
                {[5,4,3,2,1].map(n => (
                  <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, width: 8 }}>{n}</span>
                    <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: n === 5 ? '70%' : n === 4 ? '20%' : '5%', height: '100%', background: '#00C9A7', borderRadius: 2 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {fakeReviews.map((r, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #00C9A7, #0A3D8F)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 12 }}>{r.name[0]}</div>
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{r.name}</span>
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>{r.date}</span>
                </div>
                <StarRating rating={r.rating} />
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 8, lineHeight: 1.5 }}>{r.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BOOK BUTTON */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '12px 16px', background: 'rgba(8,15,30,0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(0,201,167,0.15)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{getLabel(lang, 'رسوم الاستشارة', 'Consultation fee', 'ค่าปรึกษา', 'ຄ່າປຶກສາ', 'Phí tư vấn')}</div>
            <div style={{ color: '#fff', fontWeight: 900, fontSize: 22 }}>{doc.price_consultation} <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>{getLabel(lang, 'ريال', 'SAR', 'บาท', 'ກີບ', 'VND')}</span></div>
          </div>
          <button onClick={() => onBook(doc)}
            style={{ background: 'linear-gradient(135deg, #00C9A7, #0A3D8F)', color: '#fff', fontWeight: 800, fontSize: 15, padding: '14px 28px', borderRadius: 14, border: 'none', cursor: 'pointer' }}>
            {getLabel(lang, 'احجز موعد', 'Book Now', 'จองเลย', 'ຈອງດຽວນີ້', 'Đặt lịch')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function DoctorsPage() {
  const { isAr, lang } = useLang()
  const navigate = useNavigate()
  const [stores, setStores] = useState([])
  const [doctors, setDoctors] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [activeStore, setActiveStore] = useState(null)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
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

  const parse = (v) => { try { return JSON.parse(v) } catch { return (v||'').split(',').map(x=>x.trim()).filter(Boolean) } }
  const storeDocs = activeStore ? doctors.filter(d => d.store_id === activeStore.id) : []
  const filteredStores = stores.filter(s => (isAr ? s.name_ar : s.name_en)?.toLowerCase().includes(search.toLowerCase()))

  const openBooking = (doc) => { setActiveDoctor(doc); setDay(''); setTime(''); setSubmitted(false); setForm({ name: '', phone: '', notes: '' }) }

  if (selectedDoctor) {
    return <DoctorProfile doc={selectedDoctor} lang={lang} isAr={isAr} onBook={openBooking} onBack={() => setSelectedDoctor(null)} />
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080F1E' }} dir={isAr ? 'rtl' : 'ltr'}>
      <div style={{ background: 'linear-gradient(135deg, #0D1B4B 0%, #0A3D8F 100%)', padding: '32px 16px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', border: '2px solid rgba(0,201,167,0.15)' }} />
        <div className="max-w-2xl mx-auto relative z-10">
          <button onClick={() => activeStore ? setActiveStore(null) : navigate('/web')}
            style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, background: 'none', border: 'none', cursor: 'pointer' }}>
            <ArrowLeft size={15} style={{ transform: isAr ? 'rotate(180deg)' : undefined }} />
            {activeStore ? getLabel(lang, 'الأطباء', 'Doctors', 'แพทย์', 'ທ່ານໝໍ', 'Bác sĩ') : getLabel(lang, 'الرئيسية', 'Home', 'หน้าแรก', 'ຫຼັກ', 'Trang chủ')}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(0,201,167,0.15)', border: '1px solid rgba(0,201,167,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>👨‍⚕️</div>
            <div>
              <h1 style={{ color: '#fff', fontWeight: 900, fontSize: 22, margin: 0 }}>
                {activeStore ? (isAr ? activeStore.name_ar : activeStore.name_en) : getLabel(lang, 'الأطباء المتخصصون', 'Specialist Doctors', 'แพทย์เฉพาะทาง', 'ທ່ານໝໍຊ່ຽວຊານ', 'Bác sĩ chuyên khoa')}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>
                {activeStore ? `${storeDocs.length} ${getLabel(lang,'طبيب','doctors','แพทย์','ທ່ານໝໍ','bác sĩ')}` : `${filteredStores.length} ${getLabel(lang,'عيادة','clinics','คลินิก','ຄລີນິກ','phòng khám')}`}
              </p>
            </div>
          </div>
          {!activeStore && (
            <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Search size={15} style={{ color: 'rgba(255,255,255,0.4)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder={getLabel(lang,'ابحث عن عيادة...','Search clinics...','ค้นหาคลินิก...','ຄົ້ນຫາ...','Tìm kiếm...')}
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 13 }} />
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: 16 }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <div style={{ width: 36, height: 36, border: '3px solid rgba(0,201,167,0.3)', borderTop: '3px solid #00C9A7', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : !activeStore ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredStores.map(store => (
              <button key={store.id} onClick={() => setActiveStore(store)}
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: 16, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', textAlign: 'start', width: '100%' }}>
                <div style={{ width: 60, height: 60, borderRadius: 16, background: 'linear-gradient(135deg, rgba(0,201,167,0.2), rgba(10,61,143,0.3))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>{store.logo || '🏥'}</div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 15, margin: '0 0 4px' }}>{isAr ? store.name_ar : store.name_en}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: '#00C9A7', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}><Star size={11} style={{ fill: '#00C9A7' }} />{store.rating || '4.8'}</span>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{doctors.filter(d => d.store_id === store.id).length} {getLabel(lang,'طبيب','doctors','แพทย์','ທ່ານໝໍ','bác sĩ')}</span>
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: 'rgba(255,255,255,0.2)', transform: isAr ? 'rotate(180deg)' : undefined }} />
              </button>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {storeDocs.map(doc => (
              <div key={doc.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden', cursor: 'pointer' }}
                onClick={() => setSelectedDoctor(doc)}>
                <div style={{ display: 'flex', gap: 0 }}>
                  <img src={doc.photo || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&q=80'}
                    alt="" style={{ width: 100, height: 120, objectFit: 'cover', flexShrink: 0 }} />
                  <div style={{ padding: '14px 14px', flex: 1 }}>
                    <h3 style={{ color: '#fff', fontWeight: 900, fontSize: 15, margin: '0 0 4px' }}>{isAr ? doc.name_ar : doc.name_en}</h3>
                    <p style={{ color: '#00C9A7', fontSize: 12, fontWeight: 700, margin: '0 0 6px' }}>{isAr ? doc.specialty_ar : doc.specialty_en}</p>
                    <StarRating rating={doc.rating || 4.8} count={doc.reviews_count} />
                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Award size={10} />{doc.experience_years} {getLabel(lang,'سنة','yrs','ปี','ປີ','năm')}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: '#fff', fontWeight: 900, fontSize: 16 }}>{doc.price_consultation} <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>{getLabel(lang,'ريال','SAR','บาท','ກີບ','VND')}</span></span>
                  <button onClick={e => { e.stopPropagation(); openBooking(doc) }}
                    style={{ background: 'linear-gradient(135deg, #00C9A7, #0A3D8F)', color: '#fff', fontWeight: 700, fontSize: 12, padding: '8px 16px', borderRadius: 10, border: 'none', cursor: 'pointer' }}>
                    {getLabel(lang,'احجز','Book','จอง','ຈອງ','Đặt')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {activeDoctor && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={() => setActiveDoctor(null)}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }} />
          <div style={{ position: 'relative', background: '#0D1B4B', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', border: '1px solid rgba(0,201,167,0.2)', borderBottom: 'none' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ background: 'linear-gradient(135deg, rgba(0,201,167,0.15), rgba(10,61,143,0.2))', padding: 20, borderBottom: '1px solid rgba(0,201,167,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 18, margin: 0 }}>{getLabel(lang,'حجز موعد','Book Appointment','จองนัดหมาย','ຈອງນັດ','Đặt lịch hẹn')}</h2>
                <p style={{ color: '#00C9A7', fontSize: 13, margin: '3px 0 0', fontWeight: 700 }}>{isAr ? activeDoctor.name_ar : activeDoctor.name_en}</p>
              </div>
              <button onClick={() => setActiveDoctor(null)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 10, padding: 8, cursor: 'pointer', color: '#fff' }}><X size={16} /></button>
            </div>
            {submitted ? (
              <div style={{ padding: 40, textAlign: 'center' }}>
                <div style={{ width: 72, height: 72, background: 'rgba(0,201,167,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CheckCircle size={36} style={{ color: '#00C9A7' }} />
                </div>
                <h3 style={{ color: '#fff', fontWeight: 900, fontSize: 22, marginBottom: 8 }}>{getLabel(lang,'تم تأكيد الحجز!','Booking Confirmed!','จองสำเร็จ!','ຈອງສຳເລັດ!','Thành công!')}</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>{day} — {time}</p>
                <button onClick={() => setActiveDoctor(null)} style={{ background: 'linear-gradient(135deg, #00C9A7, #0A3D8F)', color: '#fff', fontWeight: 800, padding: '12px 32px', borderRadius: 14, border: 'none', cursor: 'pointer', fontSize: 15 }}>
                  {getLabel(lang,'حسناً','Done','เสร็จ','ສຳເລັດ','Xong')}
                </button>
              </div>
            ) : (
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, marginBottom: 8, letterSpacing: 1 }}>{getLabel(lang,'اختر اليوم','SELECT DAY','เลือกวัน','ເລືອກວັນ','CHỌN NGÀY')}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {parse(activeDoctor.available_days).map((d, i) => (
                      <button key={i} onClick={() => setDay(d)} style={{ background: day===d?'#00C9A7':'rgba(255,255,255,0.06)', color: day===d?'#0D1B4B':'rgba(255,255,255,0.7)', border: `1px solid ${day===d?'#00C9A7':'rgba(255,255,255,0.1)'}`, borderRadius: 10, padding: '8px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>{d}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, marginBottom: 8, letterSpacing: 1 }}>{getLabel(lang,'اختر الوقت','SELECT TIME','เลือกเวลา','ເລືອກເວລາ','CHỌN GIỜ')}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {parse(activeDoctor.available_times).map((t, i) => (
                      <button key={i} onClick={() => setTime(t)} style={{ background: time===t?'rgba(0,201,167,0.2)':'rgba(255,255,255,0.06)', color: time===t?'#00C9A7':'rgba(255,255,255,0.7)', border: `1px solid ${time===t?'#00C9A7':'rgba(255,255,255,0.1)'}`, borderRadius: 10, padding: '8px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>{t}</button>
                    ))}
                  </div>
                </div>
                {[{key:'name',label:getLabel(lang,'الاسم *','Full Name *','ชื่อ *','ຊື່ *','Họ tên *')},{key:'phone',label:getLabel(lang,'الجوال *','Phone *','โทรศัพท์ *','ໂທລະສັບ *','Điện thoại *')},{key:'notes',label:getLabel(lang,'ملاحظات','Notes','หมายเหตุ','ໝາຍເຫດ','Ghi chú')}].map(f => (
                  <div key={f.key}>
                    <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6 }}>{f.label}</label>
                    <input value={form[f.key]} onChange={e => setForm(p=>({...p,[f.key]:e.target.value}))}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 14px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                ))}
                <button onClick={() => { if(form.name&&form.phone&&day&&time) setSubmitted(true) }}
                  disabled={!form.name||!form.phone||!day||!time}
                  style={{ background: form.name&&form.phone&&day&&time?'linear-gradient(135deg, #00C9A7, #0A3D8F)':'rgba(255,255,255,0.1)', color:'#fff', fontWeight:800, fontSize:15, padding:14, borderRadius:14, border:'none', cursor:'pointer', opacity: form.name&&form.phone&&day&&time?1:0.5 }}>
                  {getLabel(lang,'تأكيد الحجز','Confirm Booking','ยืนยัน','ຢືນຢັນ','Xác nhận')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
