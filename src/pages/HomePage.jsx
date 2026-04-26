import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Smartphone, Monitor, Truck, Store, ShoppingBag, Car, MapPin, Star, Shield, Zap, Package, ArrowRight, Globe, ChevronDown } from 'lucide-react'
import { useLang } from '../i18n/LangContext'

const LANG_LABELS = { en: 'EN', th: 'ไทย', lo: 'ລາວ', vi: 'VI', ar: 'ع' }

function getL(lang, ar, en, th, lo, vi) {
  if (lang==='ar') return ar
  if (lang==='th') return th||en
  if (lang==='lo') return lo||en
  if (lang==='vi') return vi||en
  return en
}

export default function HomePage() {
  const { lang, setLang } = useLang()
  const [langOpen, setLangOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    const id = setInterval(() => setTick(t => t+1), 3000)
    return () => { window.removeEventListener('scroll', onScroll); clearInterval(id) }
  }, [])

  const words = ['Delivery', 'Taxi', 'Shopping', 'Doctors', 'Hotels', 'Flights']
  const wordsLoc = {
    th: ['จัดส่ง', 'แท็กซี่', 'ช้อปปิ้ง', 'แพทย์', 'โรงแรม', 'เที่ยวบิน'],
    lo: ['ສົ່ງ', 'ແທັກຊີ', 'ຊື້ເຄື່ອງ', 'ທ່ານໝໍ', 'ໂຮງແຮມ', 'ສາຍການບິນ'],
    vi: ['Giao hàng', 'Taxi', 'Mua sắm', 'Bác sĩ', 'Khách sạn', 'Chuyến bay'],
    ar: ['توصيل', 'تاكسي', 'تسوق', 'أطباء', 'فنادق', 'طيران'],
  }
  const currentWords = wordsLoc[lang] || words
  const currentWord = currentWords[tick % currentWords.length]

  return (
    <div style={{ minHeight: '100vh', background: '#080F1E', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? 'rgba(8,15,30,0.97)' : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : undefined, borderBottom: scrolled ? '1px solid rgba(0,201,167,0.15)' : 'none', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.3s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #00C9A7, #0A3D8F)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 60 60" fill="none">
              <path d="M10 8 L30 32 L50 8" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M30 32 L30 54" stroke="white" strokeWidth="7" strokeLinecap="round"/>
              <path d="M4 30 L18 30" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.7"/>
              <path d="M2 36 L14 36" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
            </svg>
          </div>
          <span style={{ fontWeight: 900, fontSize: 22, letterSpacing: 3, color: '#fff' }}>YUTA</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setLangOpen(v=>!v)}
              style={{ background: 'rgba(0,201,167,0.1)', border: '1px solid rgba(0,201,167,0.3)', borderRadius: 8, color: '#00C9A7', fontSize: 12, fontWeight: 700, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Globe size={13} />{LANG_LABELS[lang]}<ChevronDown size={11} />
            </button>
            {langOpen && (
              <div style={{ position: 'absolute', top: 38, right: 0, background: '#0D1B4B', border: '1px solid rgba(0,201,167,0.2)', borderRadius: 12, minWidth: 90, zIndex: 200, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
                {Object.entries(LANG_LABELS).map(([code, label]) => (
                  <button key={code} onClick={() => { setLang(code); setLangOpen(false) }}
                    style={{ color: lang===code?'#00C9A7':'#aaa', background: lang===code?'rgba(0,201,167,0.1)':'transparent', fontSize: 13, fontWeight: 700, padding: '10px 16px', width: '100%', textAlign: 'start', border: 'none', cursor: 'pointer', display: 'block' }}>
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Link to="/web"
            style={{ background: 'linear-gradient(135deg, #00C9A7, #0A3D8F)', color: '#fff', fontWeight: 800, fontSize: 13, padding: '8px 20px', borderRadius: 10, textDecoration: 'none' }}>
            {getL(lang,'ابدأ الآن','Get Started','เริ่มเลย','ເລີ່ມ','Bắt đầu')}
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* BG effects */}
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,201,167,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '40%', right: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(10,61,143,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(0,201,167,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 800 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,201,167,0.1)', border: '1px solid rgba(0,201,167,0.25)', borderRadius: 30, padding: '6px 16px', marginBottom: 32 }}>
            <Zap size={13} style={{ color: '#00C9A7' }} />
            <span style={{ color: '#00C9A7', fontSize: 12, fontWeight: 700, letterSpacing: 2 }}>
              {getL(lang,'المنصة المتكاملة','THE ALL-IN-ONE PLATFORM','แพลตฟอร์มครบครัน','ແພລດຟອມຄົບວົງຈອນ','NỀN TẢNG TOÀN DIỆN')}
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(48px, 8vw, 88px)', fontWeight: 900, lineHeight: 1.05, marginBottom: 8, letterSpacing: -2 }}>
            <span style={{ color: '#fff' }}>YUTA</span>
          </h1>

          <div style={{ fontSize: 'clamp(24px, 4vw, 42px)', fontWeight: 900, marginBottom: 24, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>{getL(lang,'كل شيء','Everything','ทุกอย่าง','ທຸກຢ່າງ','Tất cả')}</span>
            <span style={{ color: '#00C9A7', transition: 'opacity 0.5s', display: 'inline-block' }}>{currentWord}</span>
          </div>

          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 18, marginBottom: 40, maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.7 }}>
            {getL(lang,
              'مطاعم · تاكسي · فنادق · طيران · أطباء · صيدليات — كل شيء في مكان واحد',
              'Restaurants · Taxi · Hotels · Flights · Doctors · Pharmacies — All in one place',
              'ร้านอาหาร · แท็กซี่ · โรงแรม · เที่ยวบิน · แพทย์ · ร้านยา — ทุกอย่างในที่เดียว',
              'ຮ້ານອາຫານ · ແທັກຊີ · ໂຮງແຮມ · ສາຍການບິນ · ທ່ານໝໍ — ທຸກຢ່າງໃນທີ່ດຽວ',
              'Nhà hàng · Taxi · Khách sạn · Chuyến bay · Bác sĩ — Tất cả trong một nơi'
            )}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            <Link to="/web"
              style={{ background: 'linear-gradient(135deg, #00C9A7 0%, #0A3D8F 100%)', color: '#fff', fontWeight: 800, fontSize: 16, padding: '16px 36px', borderRadius: 16, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 32px rgba(0,201,167,0.3)' }}>
              {getL(lang,'ابدأ التسوق','Start Shopping','เริ่มช้อปปิ้ง','ເລີ່ມຊື້ເຄື່ອງ','Bắt đầu mua sắm')}
              <ArrowRight size={18} />
            </Link>
            <Link to="/mobile"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontWeight: 700, fontSize: 16, padding: '16px 32px', borderRadius: 16, textDecoration: 'none' }}>
              {getL(lang,'تطبيق الجوال','Mobile App','แอปมือถือ','ແອັບ','Ứng dụng')}
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: 0.4 }}>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, transparent, #00C9A7)' }} />
          <ChevronDown size={16} style={{ color: '#00C9A7' }} />
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: '60px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(13,27,75,0.5)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24, textAlign: 'center' }}>
          {[
            { num: '500+', en: 'Stores', ar: 'متجر', th: 'ร้านค้า', lo: 'ຮ້ານ', vi: 'Cửa hàng' },
            { num: '50K+', en: 'Customers', ar: 'عميل', th: 'ลูกค้า', lo: 'ລູກຄ້າ', vi: 'Khách hàng' },
            { num: '200+', en: 'Drivers', ar: 'سائق', th: 'คนขับ', lo: 'ຄົນຂັບ', vi: 'Tài xế' },
            { num: '24/7', en: 'Support', ar: 'دعم', th: 'บริการ', lo: 'ບໍລິການ', vi: 'Hỗ trợ' },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: 36, fontWeight: 900, color: '#00C9A7', marginBottom: 6 }}>{s.num}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{getL(lang,s.ar,s.en,s.th,s.lo,s.vi)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ color: '#00C9A7', fontSize: 12, fontWeight: 800, letterSpacing: 3, marginBottom: 12 }}>SERVICES</div>
            <h2 style={{ fontSize: 38, fontWeight: 900, margin: 0 }}>
              {getL(lang,'خدماتنا','What We Offer','บริการของเรา','ການບໍລິການ','Dịch vụ')}
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {[
              { icon: ShoppingBag, en: 'Shopping', ar: 'تسوق', th: 'ช้อปปิ้ง', lo: 'ຊື້ເຄື່ອງ', vi: 'Mua sắm', desc_en: 'Thousands of products', desc_ar: 'آلاف المنتجات', color: '#00C9A7' },
              { icon: Car, en: 'Taxi', ar: 'تاكسي', th: 'แท็กซี่', lo: 'ແທັກຊີ', vi: 'Taxi', desc_en: 'Fast rides anywhere', desc_ar: 'رحلات سريعة', color: '#00E5CC' },
              { icon: Package, en: 'Delivery', ar: 'توصيل', th: 'จัดส่ง', lo: 'ສົ່ງ', vi: 'Giao hàng', desc_en: 'To your doorstep', desc_ar: 'لباب بيتك', color: '#2ECC71' },
              { icon: MapPin, en: 'Doctors', ar: 'أطباء', th: 'แพทย์', lo: 'ທ່ານໝໍ', vi: 'Bác sĩ', desc_en: 'Book appointments', desc_ar: 'احجز موعد', color: '#3498DB' },
              { icon: Monitor, en: 'Hotels', ar: 'فنادق', th: 'โรงแรม', lo: 'ໂຮງແຮມ', vi: 'Khách sạn', desc_en: 'Best rates guaranteed', desc_ar: 'أفضل الأسعار', color: '#9B59B6' },
              { icon: Zap, en: 'Flights', ar: 'طيران', th: 'เที่ยวบิน', lo: 'ສາຍການບິນ', vi: 'Chuyến bay', desc_en: 'Compare & book', desc_ar: 'قارن واحجز', color: '#E74C3C' },
            ].map((s, i) => (
              <Link key={i} to="/web"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 24, textDecoration: 'none', display: 'block', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(0,201,167,0.05)'; e.currentTarget.style.borderColor='rgba(0,201,167,0.2)' }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.07)' }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <s.icon size={22} style={{ color: s.color }} />
                </div>
                <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 16, margin: '0 0 6px' }}>{getL(lang,s.ar,s.en,s.th,s.lo,s.vi)}</h3>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>{lang==='ar'?s.desc_ar:s.desc_en}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PORTALS */}
      <section style={{ padding: '80px 24px', background: 'rgba(13,27,75,0.3)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ color: '#00C9A7', fontSize: 12, fontWeight: 800, letterSpacing: 3, marginBottom: 12 }}>PLATFORMS</div>
            <h2 style={{ fontSize: 36, fontWeight: 900, margin: 0 }}>
              {getL(lang,'اختر منصتك','Choose Your Platform','เลือกแพลตฟอร์ม','ເລືອກ','Chọn nền tảng')}
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
            {[
              { icon: Monitor, en: 'Web Platform', ar: 'المنصة الإلكترونية', th: 'เว็บไซต์', lo: 'ເວັບໄຊ', vi: 'Website', desc_en: 'Shop and book services online', desc_ar: 'تسوق واحجز الخدمات', href: '/web', color: '#00C9A7' },
              { icon: Smartphone, en: 'Mobile App', ar: 'تطبيق الجوال', th: 'แอปมือถือ', lo: 'ແອັບ', vi: 'Ứng dụng', desc_en: 'Download our mobile app', desc_ar: 'حمل تطبيقنا', href: '/mobile', color: '#2ECC71' },
              { icon: Store, en: 'Vendor Portal', ar: 'بوابة المورد', th: 'พอร์ทัลร้านค้า', lo: 'ຜູ້ຂາຍ', vi: 'Nhà bán hàng', desc_en: 'Manage your store easily', desc_ar: 'أدر متجرك بسهولة', href: '/vendor/login', color: '#9B59B6' },
              { icon: Truck, en: 'Driver Portal', ar: 'بوابة السائق', th: 'พอร์ทัลคนขับ', lo: 'ຄົນຂັບ', vi: 'Tài xế', desc_en: 'Receive orders and earn', desc_ar: 'استقبل طلبات واكسب', href: '/driver/login', color: '#E74C3C' },
            ].map((p, i) => (
              <Link key={i} to={p.href}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '28px 24px', textDecoration: 'none', display: 'flex', alignItems: 'flex-start', gap: 16 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=p.color+'40' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.08)' }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: `${p.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <p.icon size={24} style={{ color: p.color }} />
                </div>
                <div>
                  <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 16, margin: '0 0 6px' }}>{getL(lang,p.ar,p.en,p.th,p.lo,p.vi)}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '0 0 12px' }}>{lang==='ar'?p.desc_ar:p.desc_en}</p>
                  <div style={{ color: p.color, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                    {getL(lang,'فتح','Open','เปิด','ເປີດ','Mở')} <ArrowRight size={13} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(0,201,167,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 42, fontWeight: 900, marginBottom: 16 }}>
            {getL(lang,'جاهز للبدء؟','Ready to Start?','พร้อมเริ่มต้น?','ພ້ອມເລີ່ມ?','Sẵn sàng bắt đầu?')}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16, marginBottom: 36 }}>
            {getL(lang,'انضم إلى آلاف العملاء الراضين','Join thousands of happy customers','ร่วมกับลูกค้าหลายพันคน','ເຂົ້າຮ່ວມກັບລູກຄ້າ','Tham gia cùng hàng nghìn khách hàng')}
          </p>
          <Link to="/web"
            style={{ background: 'linear-gradient(135deg, #00C9A7, #0A3D8F)', color: '#fff', fontWeight: 800, fontSize: 18, padding: '18px 48px', borderRadius: 18, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10, boxShadow: '0 12px 40px rgba(0,201,167,0.25)' }}>
            {getL(lang,'ابدأ مجاناً','Start for Free','เริ่มฟรี','ເລີ່ມຟຣີ','Bắt đầu miễn phí')}
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16, marginBottom: 16 }}>
          {[
            { en: 'Privacy Policy', ar: 'سياسة الخصوصية', href: '/web/privacy' },
            { en: 'Contact Us', ar: 'تواصل معنا', href: '/web/contact' },
            { en: 'Admin', ar: 'الإدارة', href: '/admin/login' },
          ].map((l, i) => (
            <Link key={i} to={l.href} style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, textDecoration: 'none' }}>
              {lang==='ar'?l.ar:l.en}
            </Link>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: 'linear-gradient(135deg, #00C9A7, #0A3D8F)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 60 60" fill="none">
              <path d="M10 8 L30 32 L50 8" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M30 32 L30 54" stroke="white" strokeWidth="7" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>© 2026 YUTA — {getL(lang,'جميع الحقوق محفوظة','All rights reserved','สงวนลิขสิทธิ์','ສະຫງວນລິຂະສິດ','Bản quyền thuộc về YUTA')}</span>
        </div>
      </footer>
    </div>
  )
}
