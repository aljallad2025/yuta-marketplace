import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, MapPin, ChevronRight, Zap, Star, Clock, ArrowUpRight } from 'lucide-react'
import { useLang } from '../i18n/LangContext'
import { useCategories } from '../store/categoriesStore.jsx'

const CATEGORY_PATHS = {
  restaurant: '/web/restaurants',
  supermarket: '/web/supermarket',
  pharmacy: '/web/pharmacy',
  cosmetics: '/web/cosmetics',
  delivery: '/web/delivery',
  hotels: '/web/hotels',
  flights: '/web/flights',
  doctors: '/web/doctors',
  insurance: '/web/insurance',
}

const HERO_SLIDES = [
  { tag: 'FAST DELIVERY', titleEn: 'Everything\nDelivered Fast', titleTh: 'ส่งทุกอย่าง\nรวดเร็ว', titleLo: 'ສົ່ງທຸກຢ່າງ\nໄວ', titleVi: 'Giao mọi thứ\nNhanh chóng', titleAr: 'كل شيء\nيصلك سريعاً', accent: '#00C9A7', bg: 'linear-gradient(135deg, #0D1B4B 0%, #0A3D8F 100%)', },
  { tag: 'RIDE & GO', titleEn: 'Your City,\nYour Ride', titleTh: 'เมืองของคุณ\nการเดินทาง', titleLo: 'ເມືອງຂອງທ່ານ\nການເດີນທາງ', titleVi: 'Thành phố\nCủa bạn', titleAr: 'مدينتك\nرحلتك', accent: '#00E5CC', bg: 'linear-gradient(135deg, #061230 0%, #0D1B4B 100%)', },
  { tag: 'BEST DEALS', titleEn: 'Premium\nAt Low Price', titleTh: 'พรีเมียม\nราคาถูก', titleLo: 'ພຣີມຽມ\nລາຄາຖືກ', titleVi: 'Cao cấp\nGiá tốt', titleAr: 'مميز\nبسعر منخفض', accent: '#FFD700', bg: 'linear-gradient(135deg, #0A3D8F 0%, #061230 100%)', },
]

const LANG_LABELS = { en: 'EN', th: 'ไทย', lo: 'ລາວ', vi: 'VI', ar: 'ع' }

function getTitle(slide, lang) {
  if (lang === 'th') return slide.titleTh
  if (lang === 'lo') return slide.titleLo
  if (lang === 'vi') return slide.titleVi
  if (lang === 'ar') return slide.titleAr
  return slide.titleEn
}

export default function WebHome() {
  const [slide, setSlide] = useState(0)
  const [search, setSearch] = useState('')
  const { isAr, lang, setLang } = useLang()
  const { categories } = useCategories()
  const navigate = useNavigate()
  const activeCategories = categories.filter(c => c.active)

  useEffect(() => {
    const id = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 4000)
    return () => clearInterval(id)
  }, [])

  const current = HERO_SLIDES[slide]
  const titleLines = getTitle(current, lang).split('\n')

  return (
    <div className="min-h-screen" style={{ background: '#080F1E' }} dir={isAr ? 'rtl' : 'ltr'}>


      {/* HERO */}
      <div style={{ minHeight: 360, background: current.bg, transition: 'background 0.8s ease', position: 'relative', overflow: 'hidden' }} className="px-4 pt-8 pb-6 flex flex-col justify-between">
        <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%', border: `2px solid ${current.accent}20` }} />
        <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%', border: `2px solid ${current.accent}30` }} />
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: 180, height: 180, borderRadius: '50%', border: `1px solid ${current.accent}15` }} />

        <div className="max-w-2xl mx-auto w-full relative z-10">
          <div style={{ background: `${current.accent}20`, border: `1px solid ${current.accent}40`, borderRadius: 20, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', marginBottom: 16 }}>
            <Zap size={11} style={{ color: current.accent }} />
            <span style={{ color: current.accent, fontSize: 10, fontWeight: 800, letterSpacing: 2 }}>{current.tag}</span>
          </div>
          <div style={{ marginBottom: 24 }}>
            {titleLines.map((line, i) => (
              <div key={i} style={{ fontSize: 40, fontWeight: 900, lineHeight: 1.1, color: i === 0 ? '#fff' : current.accent, letterSpacing: -1 }}>{line}</div>
            ))}
          </div>
          <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 16, padding: '6px 6px 6px 16px', display: 'flex', alignItems: 'center', gap: 8, maxWidth: 480 }}>
            <Search size={16} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder={lang === 'ar' ? 'ابحث عن متجر أو منتج...' : lang === 'th' ? 'ค้นหาร้านค้า...' : lang === 'lo' ? 'ຄົ້ນຫາ...' : lang === 'vi' ? 'Tìm kiếm...' : 'Search stores & products...'}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 14 }} />
            <button style={{ background: current.accent, color: '#0D1B4B', fontWeight: 800, fontSize: 13, padding: '10px 20px', borderRadius: 12, border: 'none', cursor: 'pointer' }}>
              {lang === 'ar' ? 'بحث' : lang === 'th' ? 'ค้นหา' : lang === 'lo' ? 'ຄົ້ນ' : lang === 'vi' ? 'Tìm' : 'Search'}
            </button>
          </div>
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            <MapPin size={12} style={{ color: current.accent }} />
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
              {lang === 'th' ? 'กรุงเทพฯ, ประเทศไทย' : lang === 'lo' ? 'ວຽງຈັນ, ລາວ' : lang === 'vi' ? 'Hà Nội, Việt Nam' : lang === 'ar' ? 'دبي، الإمارات' : 'Bangkok, Thailand'}
            </span>
          </div>
        </div>
        <div className="flex justify-center gap-2 mt-4 relative z-10">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)}
              style={{ width: i === slide ? 24 : 6, height: 6, borderRadius: 3, background: i === slide ? current.accent : 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', transition: 'all 0.3s' }} />
          ))}
        </div>
      </div>

      {/* STATS */}
      <div style={{ background: '#0D1B4B', borderTop: '1px solid rgba(0,201,167,0.1)', borderBottom: '1px solid rgba(0,201,167,0.1)' }} className="px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-around">
          {[
            { num: '500+', en: 'Stores', th: 'ร้านค้า', lo: 'ຮ້ານ', vi: 'Cửa hàng', ar: 'متجر' },
            { num: '15 min', en: 'Avg delivery', th: 'เฉลี่ย', lo: 'ສະເລ່ຍ', vi: 'Trung bình', ar: 'متوسط' },
            { num: '4.9★', en: 'Rating', th: 'คะแนน', lo: 'ຄະແນນ', vi: 'Đánh giá', ar: 'تقييم' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div style={{ color: '#00C9A7', fontWeight: 900, fontSize: 16 }}>{s.num}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, marginTop: 2 }}>
                {lang === 'th' ? s.th : lang === 'lo' ? s.lo : lang === 'vi' ? s.vi : lang === 'ar' ? s.ar : s.en}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 18 }}>
            {lang === 'th' ? 'หมวดหมู่' : lang === 'lo' ? 'ໝວດໝູ່' : lang === 'vi' ? 'Danh mục' : lang === 'ar' ? 'الأقسام' : 'Categories'}
          </h2>
          <Link to="/web/categories" style={{ color: '#00C9A7', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
            {lang === 'ar' ? 'عرض الكل' : lang === 'th' ? 'ดูทั้งหมด' : lang === 'lo' ? 'ເບິ່ງທັງໝົດ' : lang === 'vi' ? 'Xem tất cả' : 'View all'}
            <ArrowUpRight size={13} />
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {activeCategories.slice(0, 8).map(cat => (
            <button key={cat.id} onClick={() => navigate(CATEGORY_PATHS[cat.slug] || '/web/marketplace')}
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '14px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <div style={{ fontSize: 26 }}>{cat.emoji || cat.icon}</div>
              <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 10, fontWeight: 700, textAlign: 'center', lineHeight: 1.3 }}>
                {isAr ? cat.name_ar : cat.name_en}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* PROMO */}
      <div className="px-4 pb-6 max-w-2xl mx-auto">
        <div style={{ background: 'linear-gradient(135deg, #00C9A7 0%, #0A3D8F 100%)', borderRadius: 20, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', right: -20, top: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
          <div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 4 }}>LIMITED OFFER</div>
            <div style={{ color: '#fff', fontSize: 20, fontWeight: 900, lineHeight: 1.3 }}>
              {lang === 'th' ? 'ส่งฟรีออเดอร์แรก' : lang === 'lo' ? 'ສົ່ງຟຣີຄັ້ງທຳອິດ' : lang === 'vi' ? 'Miễn phí giao hàng' : lang === 'ar' ? 'توصيل مجاني للطلب الأول' : 'Free Delivery First Order'}
            </div>
          </div>
          <Link to="/web/marketplace" style={{ background: '#fff', color: '#0D1B4B', fontWeight: 900, fontSize: 13, padding: '10px 18px', borderRadius: 12, whiteSpace: 'nowrap', textDecoration: 'none', zIndex: 1, position: 'relative' }}>
            {lang === 'th' ? 'สั่งเลย' : lang === 'lo' ? 'ສັ່ງດຽວນີ້' : lang === 'vi' ? 'Đặt ngay' : lang === 'ar' ? 'اطلب الآن' : 'Order Now'}
          </Link>
        </div>
      </div>

      {/* FEATURED STORES */}
      <div className="px-4 pb-24 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 18 }}>
            {lang === 'th' ? 'ร้านค้าแนะนำ' : lang === 'lo' ? 'ຮ້ານແນະນຳ' : lang === 'vi' ? 'Cửa hàng nổi bật' : lang === 'ar' ? 'المتاجر المميزة' : 'Featured Stores'}
          </h2>
          <Link to="/web/marketplace" style={{ color: '#00C9A7', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
            {lang === 'ar' ? 'عرض الكل' : 'View all'} <ArrowUpRight size={13} />
          </Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { en: 'Baharat Restaurant', ar: 'مطعم بهارات', th: 'ร้านบาฮารัต', lo: 'ຮ້ານບາຮາລັດ', vi: 'Nhà hàng Baharat', emoji: '🍽️', rating: 4.9, time: '20', tag: 'POPULAR', tagColor: '#00C9A7' },
            { en: 'Burgetino', ar: 'برجتينو', th: 'เบอร์เกตติโน', lo: 'ເບີເກທີໂນ', vi: 'Burgetino', emoji: '🍔', rating: 4.8, time: '30', tag: 'NEW', tagColor: '#FFD700' },
            { en: 'Al Shifa Pharmacy', ar: 'صيدلية الشفاء', th: 'ร้านขายยา', lo: 'ຮ້ານຂາຍຢາ', vi: 'Nhà thuốc', emoji: '💊', rating: 4.9, time: '15', tag: 'FAST', tagColor: '#00E5CC' },
          ].map((store, i) => {
            const name = lang === 'ar' ? store.ar : lang === 'th' ? store.th : lang === 'lo' ? store.lo : lang === 'vi' ? store.vi : store.en
            return (
              <div key={i} onClick={() => navigate('/web/marketplace')}
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(0,201,167,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>{store.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>{name}</span>
                    <span style={{ background: `${store.tagColor}20`, color: store.tagColor, fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 6, letterSpacing: 1 }}>{store.tag}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ color: '#00C9A7', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}><Star size={11} style={{ fill: '#00C9A7' }} />{store.rating}</span>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 3 }}><Clock size={11} />{store.time} min</span>
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0, transform: isAr ? 'rotate(180deg)' : undefined }} />
              </div>
            )
          })}
        </div>
      </div>

      {/* BOTTOM NAV */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(8,15,30,0.97)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(0,201,167,0.15)', padding: '8px 0', zIndex: 50 }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', maxWidth: 480, margin: '0 auto' }}>
          {[
            { icon: '🏠', en: 'Home', th: 'หน้าแรก', lo: 'ຫຼັກ', vi: 'Trang chủ', ar: 'الرئيسية', path: '/web' },
            { icon: '🏪', en: 'Stores', th: 'ร้านค้า', lo: 'ຮ້ານ', vi: 'Cửa hàng', ar: 'المتاجر', path: '/web/marketplace' },
            { icon: '📦', en: 'Orders', th: 'คำสั่ง', lo: 'ຄຳສັ່ງ', vi: 'Đơn hàng', ar: 'طلباتي', path: '/web/orders' },
            { icon: '👤', en: 'Account', th: 'บัญชี', lo: 'ບັນຊີ', vi: 'Tài khoản', ar: 'حسابي', path: '/web/account' },
          ].map((item, i) => (
            <Link key={i} to={item.path} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, textDecoration: 'none', padding: '4px 12px' }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700 }}>
                {lang === 'th' ? item.th : lang === 'lo' ? item.lo : lang === 'vi' ? item.vi : lang === 'ar' ? item.ar : item.en}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
