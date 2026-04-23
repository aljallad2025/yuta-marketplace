import { useState } from 'react'
import { ArrowLeft, ChevronRight, Clock, Package, Zap, Truck, MapPin, Navigation, Phone, Star, CheckCircle, X, Shield, Search } from 'lucide-react'
import { useLang } from '../../i18n/LangContext'
import { useNavigate } from 'react-router-dom'

const ff = "'Cairo','Tajawal',sans-serif"
const navy = '#0F2A47', navyDark = '#0a1e33', gold = '#C8A951'

const SERVICES = [
  {
    id: 'express',
    emoji: '⚡',
    nameAr: 'توصيل سريع',
    nameEn: 'Express Delivery',
    descAr: 'توصيل خلال 30 دقيقة لأي مكان',
    descEn: 'Delivery within 30 minutes anywhere',
    gradient: ['#0F2A47', '#1a3a5c'],
    accent: gold,
    eta: '15-30',
    price: 1.5,
    tag: { ar: 'الأسرع', en: 'Fastest' },
    features: [
      { ar: 'تتبع مباشر', en: 'Live tracking' },
      { ar: 'تأمين الشحنة', en: 'Shipment insurance' },
      { ar: 'إشعارات فورية', en: 'Instant notifications' },
    ]
  },
  {
    id: 'cargo',
    emoji: '📦',
    nameAr: 'توصيل بضائع',
    nameEn: 'Cargo Delivery',
    descAr: 'شحن البضائع والطرود الثقيلة',
    descEn: 'Ship heavy goods and packages',
    gradient: ['#7C3AED', '#5B21B6'],
    accent: '#C4B5FD',
    eta: '60-120',
    price: 3.0,
    tag: { ar: 'للأعمال', en: 'Business' },
    features: [
      { ar: 'حتى 100 كغ', en: 'Up to 100 kg' },
      { ar: 'سيارة مخصصة', en: 'Dedicated vehicle' },
      { ar: 'توصيل مجدول', en: 'Scheduled delivery' },
    ]
  },
  {
    id: 'private',
    emoji: '🚐',
    nameAr: 'توصيل خاص',
    nameEn: 'Private Delivery',
    descAr: 'سائق خاص مخصص لك طوال اليوم',
    descEn: 'Dedicated private driver all day',
    gradient: ['#065F46', '#047857'],
    accent: '#6EE7B7',
    eta: 'حسب الطلب',
    price: 8.0,
    tag: { ar: 'بريميوم', en: 'Premium' },
    features: [
      { ar: 'سائق حصري', en: 'Exclusive driver' },
      { ar: 'أولوية قصوى', en: 'Top priority' },
      { ar: 'دعم 24/7', en: '24/7 support' },
    ]
  },
]

const SIZES = [
  { id: 'small',  emoji: '📫', ar: 'صغير',  en: 'Small',  ar2: 'حتى 1 كغ',   en2: 'Up to 1kg',   extra: 0 },
  { id: 'medium', emoji: '📦', ar: 'وسط',   en: 'Medium', ar2: 'حتى 5 كغ',   en2: 'Up to 5kg',   extra: 0.5 },
  { id: 'large',  emoji: '🗃️', ar: 'كبير',  en: 'Large',  ar2: 'حتى 20 كغ',  en2: 'Up to 20kg',  extra: 1.5 },
  { id: 'xl',     emoji: '🏗️', ar: 'ضخم',   en: 'XL',     ar2: 'حتى 100 كغ', en2: 'Up to 100kg', extra: 4.0 },
]

const DRIVERS = [
  { nameAr: 'أحمد الدوسري',  nameEn: 'Ahmed Al-Dosari',  plate: '1234 BH', rating: 4.9, trips: 1840, vehicle: '🚐' },
  { nameAr: 'سعيد المطيري',  nameEn: 'Saeed Al-Mutairi', plate: '5678 BH', rating: 4.8, trips: 1230, vehicle: '🚚' },
  { nameAr: 'خالد الزهراني', nameEn: 'Khalid Al-Zahrani', plate: '9012 BH', rating: 4.95,trips: 2100, vehicle: '🚐' },
]

const QUICK = [
  { ar: '🏠 المنزل', en: '🏠 Home' },
  { ar: '🏢 العمل', en: '🏢 Work' },
  { ar: '🏥 المستشفى', en: '🏥 Hospital' },
  { ar: '✈️ المطار', en: '✈️ Airport' },
  { ar: '🏪 السوق', en: '🏪 Market' },
]

export default function DeliveryPage() {
  const { isAr } = useLang()
  const navigate = useNavigate()
  const T = (ar, en) => isAr ? ar : en
  const dir = isAr ? 'rtl' : 'ltr'

  const [step, setStep]       = useState('home')
  const [service, setService] = useState(null)
  const [from, setFrom]       = useState('')
  const [to, setTo]           = useState('')
  const [size, setSize]       = useState('small')
  const [note, setNote]       = useState('')
  const [busy, setBusy]       = useState(false)
  const [driver, setDriver]   = useState(null)
  const [cd, setCd]           = useState(null)

  const sel = SIZES.find(s => s.id === size)
  const totalPrice = service ? (service.price + sel.extra).toFixed(3) : 0

  const startService = (s) => { setService(s); setStep('book') }

  const confirm = () => {
    if (!from || !to) return
    setBusy(true)
    setTimeout(() => {
      const d = DRIVERS[Math.floor(Math.random() * DRIVERS.length)]
      setDriver(d)
      let c = parseInt(service.eta) || 20
      setCd(c)
      setStep('track')
      setBusy(false)
      const iv = setInterval(() => {
        c -= 1; setCd(c)
        if (c <= 0) { clearInterval(iv); setStep('done') }
      }, 1000)
    }, 2000)
  }

  const reset = () => {
    setStep('home'); setService(null); setFrom(''); setTo('')
    setSize('small'); setNote(''); setDriver(null); setCd(null)
  }

  const card = { background: '#fff', borderRadius: 20, border: '1px solid #E5E7EB', boxShadow: '0 2px 12px rgba(0,0,0,.06)' }
  const btn  = (on) => ({ width: '100%', padding: '16px 0', borderRadius: 16, background: on ? `linear-gradient(135deg,${navy},#1a3a5c)` : '#E5E7EB', color: on ? '#fff' : '#9CA3AF', fontWeight: 900, fontSize: 16, fontFamily: ff, border: 'none', cursor: on ? 'pointer' : 'not-allowed', boxShadow: on ? `0 6px 20px rgba(15,42,71,.3)` : 'none', transition: 'all .25s' })

  /* ══ TRACKING ══ */
  if (step === 'track' && driver) return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: ff, direction: dir }}>
      {/* fake map */}
      <div style={{ height: 220, background: `linear-gradient(135deg,${navyDark},${navy})`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: .07 }}>
          {[200,150,100,60].map(s => <div key={s} style={{ position: 'absolute', width: s*2, height: s*2, borderRadius: '50%', border: '1px solid #fff' }}/>)}
        </div>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 220">
          <path d="M 60 180 Q 200 80 340 50" stroke={gold} strokeWidth="3" fill="none" strokeDasharray="10 5"/>
          <circle cx="60" cy="180" r="9" fill="#16A34A"/>
          <circle cx="340" cy="50" r="9" fill={gold}/>
          <text x="195" y="120" fontSize="28" textAnchor="middle">{service.emoji}</text>
        </svg>
        <div style={{ position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(8px)', borderRadius: 10, padding: '6px 16px', color: '#fff', fontWeight: 800, fontSize: 12, whiteSpace: 'nowrap' }}>
          {service.emoji} {T('الطرد في الطريق', 'Package on the way')}
        </div>
      </div>

      {/* countdown bar */}
      <div style={{ background: `linear-gradient(135deg,${navyDark},${navy})`, padding: '16px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 52, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{cd}</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.6)', marginTop: 4, letterSpacing: 2, textTransform: 'uppercase' }}>{T('دقيقة للوصول', 'MINUTES AWAY')}</div>
        <div style={{ marginTop: 10, background: 'rgba(255,255,255,.2)', borderRadius: 99, height: 4 }}>
          <div style={{ height: 4, borderRadius: 99, background: gold, width: `${Math.max(5, Math.min(97, (1 - cd / (parseInt(service.eta) || 20)) * 100))}%`, transition: 'width 1s ease' }}/>
        </div>
      </div>

      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* driver card */}
        <div style={{ ...card, padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 13 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg,${navyDark},${navy})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>{driver.vehicle}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 900, fontSize: 15, color: '#111827', marginBottom: 2 }}>{isAr ? driver.nameAr : driver.nameEn}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                <Star size={12} fill="#F59E0B" color="#F59E0B"/>
                <span style={{ fontWeight: 700, fontSize: 12 }}>{driver.rating}</span>
                <span style={{ fontSize: 11, color: '#9CA3AF' }}>· {driver.trips.toLocaleString()} {T('رحلة', 'trips')}</span>
              </div>
              <span style={{ fontSize: 11, color: '#fff', background: navy, padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>{driver.plate}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 900, fontSize: 20, color: navy }}>{totalPrice}</div>
              <div style={{ fontSize: 11, color: '#9CA3AF' }}>BHD</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ flex: 1, padding: '11px 0', borderRadius: 12, border: '1.5px solid #E5E7EB', background: '#F9FAFB', color: '#374151', fontWeight: 700, fontSize: 13, fontFamily: ff, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Phone size={14}/>{T('اتصال', 'Call')}
            </button>
            <button style={{ flex: 1, padding: '11px 0', borderRadius: 12, border: '1.5px solid #E5E7EB', background: '#F9FAFB', color: '#374151', fontWeight: 700, fontSize: 13, fontFamily: ff, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Shield size={14}/>{T('تتبع', 'Track')}
            </button>
            <button onClick={reset} style={{ padding: '11px 14px', borderRadius: 12, border: '1.5px solid #FEE2E2', background: '#FFF5F5', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <X size={14}/>
            </button>
          </div>
        </div>

        {/* route */}
        <div style={{ ...card, padding: '13px 16px', display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flexShrink: 0 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#16A34A' }}/>
            <div style={{ width: 1, height: 18, background: '#E5E7EB' }}/>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: gold }}/>
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: 12, color: '#374151', fontWeight: 600, marginBottom: 5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{from}</div>
            <div style={{ fontSize: 12, color: '#6B7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{to}</div>
          </div>
          <div style={{ flexShrink: 0, textAlign: 'center' }}>
            <div style={{ fontSize: 20 }}>{sel.emoji}</div>
            <div style={{ fontSize: 10, color: '#9CA3AF' }}>{isAr ? sel.ar : sel.en}</div>
          </div>
        </div>
      </div>
      <style>{'@keyframes sp{to{transform:rotate(360deg)}}'}</style>
    </div>
  )

  /* ══ DONE ══ */
  if (step === 'done') return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: ff, direction: dir, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'linear-gradient(135deg,#DCFCE7,#BBF7D0)', border: '3px solid #16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 46, marginBottom: 18 }}>✅</div>
      <div style={{ fontWeight: 900, fontSize: 24, color: '#111827', marginBottom: 6, textAlign: 'center' }}>{T('تم التوصيل!', 'Delivered!')}</div>
      <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 32, textAlign: 'center' }}>{T('شكراً لاستخدامك سمو توصيل', 'Thanks for using SUMU Delivery')}</div>
      <div style={{ ...card, padding: '20px 28px', marginBottom: 20, width: '100%', maxWidth: 320, textAlign: 'center' }}>
        <div style={{ fontSize: 13, color: '#374151', fontWeight: 700, marginBottom: 6 }}>{T('الإجمالي المدفوع', 'Total Paid')}</div>
        <div style={{ fontWeight: 900, fontSize: 32, color: navy }}>{totalPrice} <span style={{ fontSize: 16, color: '#9CA3AF' }}>BHD</span></div>
      </div>
      <button style={{ ...btn(true), maxWidth: 320 }} onClick={reset}>{T('📦 طلب جديد', '📦 New Order')}</button>
    </div>
  )

  /* ══ BOOKING FORM ══ */
  if (step === 'book' && service) return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: ff, direction: dir }}>
      {/* header */}
      <div style={{ background: `linear-gradient(135deg,${service.gradient[0]},${service.gradient[1]})`, padding: '18px 18px 28px' }}>
        <button onClick={() => setStep('home')} style={{ background: 'rgba(255,255,255,.15)', border: 'none', borderRadius: 12, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', marginBottom: 14 }}>
          <ArrowLeft size={17} style={{ transform: isAr ? 'scaleX(-1)' : 'none' }}/>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 52, height: 52, background: 'rgba(255,255,255,.15)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>{service.emoji}</div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 20, color: '#fff' }}>{isAr ? service.nameAr : service.nameEn}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.65)' }}>{isAr ? service.descAr : service.descEn}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 14, marginTop: -8 }}>
        {/* location */}
        <div style={{ ...card, padding: '16px' }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: '#111827', marginBottom: 12 }}>{T('المواقع', 'Locations')}</div>
          {[
            { lbl: T('من', 'FROM'), val: from, set: setFrom, dot: '#16A34A', ph: T('📍 عنوان الاستلام', '📍 Pickup address') },
            { lbl: T('إلى', 'TO'),  val: to,   set: setTo,   dot: gold,     ph: T('🎯 عنوان التوصيل', '🎯 Delivery address') },
          ].map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 12, border: `1.5px solid ${r.val ? r.dot : '#E5E7EB'}`, background: r.val ? `${r.dot}0d` : '#F9FAFB', marginBottom: i === 0 ? 10 : 0, transition: 'all .2s' }}>
              <div style={{ width: 9, height: 9, borderRadius: '50%', background: r.dot, flexShrink: 0 }}/>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 700, letterSpacing: .5, marginBottom: 1 }}>{r.lbl}</div>
                <input value={r.val} onChange={e => r.set(e.target.value)} placeholder={r.ph}
                  style={{ width: '100%', border: 'none', outline: 'none', fontSize: 13, fontFamily: ff, fontWeight: r.val ? 700 : 400, color: r.val ? '#111827' : '#9CA3AF', background: 'transparent' }}/>
              </div>
              {r.val && <button onClick={() => r.set('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 2 }}><X size={14}/></button>}
            </div>
          ))}
          {/* quick locations */}
          <div style={{ display: 'flex', gap: 6, marginTop: 10, overflowX: 'auto', paddingBottom: 2 }}>
            {QUICK.map((q, i) => (
              <button key={i} onClick={() => setTo(isAr ? q.ar.split(' ')[1] : q.en.split(' ')[1])}
                style={{ whiteSpace: 'nowrap', background: '#F3F4F6', border: 'none', borderRadius: 8, padding: '5px 10px', fontSize: 11, fontFamily: ff, fontWeight: 700, color: '#374151', cursor: 'pointer', flexShrink: 0 }}>
                {isAr ? q.ar : q.en}
              </button>
            ))}
          </div>
        </div>

        {/* package size */}
        <div style={{ ...card, padding: '16px' }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: '#111827', marginBottom: 12 }}>{T('حجم الشحنة', 'Package Size')}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {SIZES.map(s => {
              const on = size === s.id
              return (
                <button key={s.id} onClick={() => setSize(s.id)} style={{ padding: '12px', borderRadius: 14, border: `2px solid ${on ? gold : '#E5E7EB'}`, background: on ? '#FFFBEF' : '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all .2s', boxShadow: on ? `0 4px 12px rgba(200,169,81,.2)` : 'none' }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>{s.emoji}</div>
                  <div style={{ fontWeight: 900, fontSize: 13, color: '#111827' }}>{isAr ? s.ar : s.en}</div>
                  <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 4 }}>{isAr ? s.ar2 : s.en2}</div>
                  <div style={{ fontWeight: 900, fontSize: 13, color: on ? navy : '#9CA3AF' }}>
                    +{s.extra.toFixed(3)} BHD
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* note */}
        <div style={{ ...card, padding: '16px' }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: '#111827', marginBottom: 10 }}>{T('ملاحظات', 'Notes')}</div>
          <textarea value={note} onChange={e => setNote(e.target.value)} rows={2}
            placeholder={T('تعليمات خاصة للسائق... (اختياري)', 'Special instructions for driver... (optional)')}
            style={{ width: '100%', border: '1.5px solid #E5E7EB', borderRadius: 12, padding: '12px', fontSize: 13, fontFamily: ff, color: '#374151', outline: 'none', resize: 'none', background: '#F9FAFB', boxSizing: 'border-box' }}/>
        </div>

        {/* price summary */}
        <div style={{ background: `linear-gradient(135deg,${service.gradient[0]},${service.gradient[1]})`, borderRadius: 20, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.6)', marginBottom: 3 }}>{T('الإجمالي المتوقع', 'Estimated Total')}</div>
            <div style={{ fontWeight: 900, fontSize: 30, color: service.accent }}>{totalPrice} <span style={{ fontSize: 14, opacity: .8 }}>BHD</span></div>
          </div>
          <div style={{ textAlign: isAr ? 'left' : 'right' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.6)', marginBottom: 3 }}>{T('الوقت المتوقع', 'ETA')}</div>
            <div style={{ fontWeight: 900, fontSize: 18, color: '#fff' }}>{service.eta} <span style={{ fontSize: 12, opacity: .7 }}>{T('دق', 'min')}</span></div>
          </div>
        </div>

        <button style={btn(from && to && !busy)} onClick={confirm} disabled={!from || !to || busy}>
          {busy
            ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <span style={{ width: 18, height: 18, border: '3px solid rgba(255,255,255,.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'sp .8s linear infinite' }}/>
                {T('جارٍ البحث عن سائق...', 'Finding driver...')}
              </span>
            : T(`${service.emoji} اطلب الآن · ${totalPrice} BHD`, `${service.emoji} Book Now · ${totalPrice} BHD`)
          }
        </button>
      </div>
      <style>{'@keyframes sp{to{transform:rotate(360deg)}}'}</style>
    </div>
  )

  /* ══ HOME ══ */
  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: ff, direction: dir }}>
      {/* header */}
      <div style={{ background: `linear-gradient(135deg,${navyDark},${navy})`, padding: '20px 18px 32px' }}>
        <button onClick={() => navigate('/web')} style={{ background: 'rgba(255,255,255,.12)', border: 'none', borderRadius: 12, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: 'rgba(255,255,255,.7)', fontSize: 13, fontFamily: ff, fontWeight: 700, marginBottom: 18 }}>
          <ArrowLeft size={15} style={{ transform: isAr ? 'scaleX(-1)' : 'none' }}/>{T('الرئيسية', 'Home')}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
          <div style={{ width: 52, height: 52, background: 'rgba(255,255,255,.12)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, border: `1px solid ${gold}44` }}>📦</div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 24, color: '#fff' }}>{T('سمو توصيل', 'SUMU Delivery')}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,.55)', marginTop: 2 }}>{T('سريع · موثوق · آمن', 'Fast · Reliable · Secure')}</div>
          </div>
        </div>

        {/* stats strip */}
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          {[
            { n: '15K+', ar: 'توصيلة', en: 'Deliveries' },
            { n: '4.9★', ar: 'تقييم', en: 'Rating' },
            { n: '30', ar: 'دقيقة', en: 'Min avg' },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, background: 'rgba(255,255,255,.1)', borderRadius: 12, padding: '10px 8px', textAlign: 'center' }}>
              <div style={{ fontWeight: 900, fontSize: 16, color: gold }}>{s.n}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,.55)', marginTop: 2 }}>{isAr ? s.ar : s.en}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 16px 32px', marginTop: -14 }}>
        {/* services */}
        <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12, marginTop: 24 }}>{T('اختر الخدمة', 'Choose Service')}</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {SERVICES.map(s => (
            <button key={s.id} onClick={() => startService(s)} style={{ background: `linear-gradient(135deg,${s.gradient[0]},${s.gradient[1]})`, borderRadius: 22, padding: '18px 20px', border: 'none', cursor: 'pointer', textAlign: isAr ? 'right' : 'left', transition: 'transform .15s, box-shadow .15s', boxShadow: '0 6px 24px rgba(0,0,0,.15)', fontFamily: ff }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(0,0,0,.2)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,.15)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ width: 58, height: 58, background: 'rgba(255,255,255,.15)', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, flexShrink: 0 }}>{s.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <div style={{ fontWeight: 900, fontSize: 18, color: '#fff' }}>{isAr ? s.nameAr : s.nameEn}</div>
                    <span style={{ fontSize: 10, fontWeight: 800, color: s.gradient[0], background: s.accent, padding: '2px 8px', borderRadius: 99 }}>{isAr ? s.tag.ar : s.tag.en}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,.65)', marginBottom: 10 }}>{isAr ? s.descAr : s.descEn}</div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: s.accent }}><Clock size={11}/>{s.eta} {T('دق', 'min')}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,.8)' }}>{T('من', 'from')} {s.price.toFixed(3)} BHD</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                    {s.features.map((f, i) => (
                      <span key={i} style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.7)', background: 'rgba(255,255,255,.12)', padding: '3px 8px', borderRadius: 6 }}>
                        ✓ {isAr ? f.ar : f.en}
                      </span>
                    ))}
                  </div>
                </div>
                <ChevronRight size={20} color="rgba(255,255,255,.4)" style={{ marginTop: 4, transform: isAr ? 'scaleX(-1)' : 'none', flexShrink: 0 }}/>
              </div>
            </button>
          ))}
        </div>

        {/* online drivers */}
        <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', margin: '24px 0 12px' }}>{T('السائقون المتاحون', 'Available Drivers')}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {DRIVERS.map((d, i) => (
            <div key={i} style={{ ...card, padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 46, height: 46, background: `linear-gradient(135deg,${navyDark},${navy})`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{d.vehicle}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 900, fontSize: 14, color: '#111827' }}>{isAr ? d.nameAr : d.nameEn}</div>
                <div style={{ fontSize: 11, color: '#9CA3AF' }}>{d.plate}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', marginBottom: 4 }}>
                  <Star size={11} fill="#F59E0B" color="#F59E0B"/>
                  <span style={{ fontWeight: 800, fontSize: 12, color: '#374151' }}>{d.rating}</span>
                </div>
                <span style={{ fontSize: 10, fontWeight: 800, color: '#16A34A', background: '#F0FDF4', padding: '2px 8px', borderRadius: 99 }}>{T('متاح', 'Online')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
