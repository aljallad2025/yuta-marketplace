import { Link } from 'react-router-dom'
import { Smartphone, Monitor, Truck, Store, ShoppingBag, Car, MapPin, Star, Shield, Zap, Package, ArrowLeft, ArrowRight } from 'lucide-react'
import { useLang } from '../i18n/LangContext'
import LangToggle from '../components/LangToggle'

export default function HomePage() {
  const { isAr } = useLang()
  const dir = isAr ? 'rtl' : 'ltr'

  const features = [
    { icon: ShoppingBag, titleAr: 'تسوق بسهولة', titleEn: 'Shop Easily', descAr: 'آلاف المنتجات من أفضل المتاجر', descEn: 'Thousands of products from top stores', color: '#C8A951' },
    { icon: Car, titleAr: 'تاكسي فوري', titleEn: 'Instant Taxi', descAr: 'احجز رحلتك في ثوانٍ', descEn: 'Book your ride in seconds', color: '#2ECC71' },
    { icon: Package, titleAr: 'توصيل سريع', titleEn: 'Fast Delivery', descAr: 'نوصل طلبك لباب بيتك', descEn: 'We deliver to your doorstep', color: '#3498DB' },
    { icon: Shield, titleAr: 'دفع آمن', titleEn: 'Secure Payment', descAr: 'جميع المدفوعات مشفرة 100%', descEn: 'All payments 100% encrypted', color: '#9B59B6' },
    { icon: MapPin, titleAr: 'تتبع مباشر', titleEn: 'Live Tracking', descAr: 'تابع طلبك على الخريطة', descEn: 'Track your order on the map', color: '#E74C3C' },
    { icon: Star, titleAr: 'تقييمات موثوقة', titleEn: 'Trusted Reviews', descAr: 'اختر بثقة بناءً على تقييمات حقيقية', descEn: 'Choose based on real reviews', color: '#F39C12' },
  ]

  const stats = [
    { numAr: '+١٠٠٠', numEn: '1000+', labelAr: 'متجر نشط', labelEn: 'Active Stores' },
    { numAr: '+٥٠٠٠', numEn: '5000+', labelAr: 'عميل سعيد', labelEn: 'Happy Customers' },
    { numAr: '+٢٠٠', numEn: '200+', labelAr: 'سائق محترف', labelEn: 'Pro Drivers' },
    { numAr: '٢٤/٧', numEn: '24/7', labelAr: 'دعم متواصل', labelEn: 'Support' },
  ]

  const portals = [
    { icon: Monitor, labelAr: 'المنصة الإلكترونية', labelEn: 'Web Platform', descAr: 'تسوق وحجز تاكسي', descEn: 'Shop and book taxi', href: '/web', color: '#C8A951' },
    { icon: Smartphone, labelAr: 'تطبيق الجوال', labelEn: 'Mobile App', descAr: 'تجربة جوال متكاملة', descEn: 'Complete mobile experience', href: '/mobile', color: '#2ECC71' },
    { icon: Store, labelAr: 'بوابة المورد', labelEn: 'Vendor Portal', descAr: 'أدر متجرك بسهولة', descEn: 'Manage your store easily', href: '/vendor/login', color: '#9B59B6' },
    { icon: Truck, labelAr: 'بوابة السائق', labelEn: 'Driver Portal', descAr: 'استقبل طلبات واكسب', descEn: 'Receive orders and earn', href: '/driver/login', color: '#E74C3C' },
  ]

  return (
    <div className="min-h-screen bg-[#0A1F3D] text-white" dir={dir}>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A1F3D]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-[#C8A951]">سمو</span>
            <span className="text-2xl font-black text-white">SUMU</span>
          </div>
          <div className="flex items-center gap-3">
            <LangToggle />
            <Link to="/login" className="text-sm text-white/70 hover:text-white transition px-3 py-1.5">{isAr ? 'دخول' : 'Login'}</Link>
            <Link to="/web" className="bg-[#C8A951] text-[#0A1F3D] text-sm font-bold px-4 py-2 rounded-xl hover:bg-[#d4b55a] transition">{isAr ? 'ابدأ الآن' : 'Get Started'}</Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4 text-center relative overflow-hidden">
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-[#C8A951]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <div className="inline-flex items-center gap-2 bg-[#C8A951]/10 border border-[#C8A951]/30 rounded-full px-4 py-2 text-sm text-[#C8A951] mb-6">
            <Zap size={14} />{isAr ? 'منصة الخليج المتكاملة' : 'The Gulf Integrated Platform'}
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            <span className="text-[#C8A951]">{isAr ? 'سمو' : 'SUMU'}</span><br />
            <span className="text-white text-3xl md:text-5xl font-bold">{isAr ? 'كل احتياجاتك في مكان واحد' : 'Everything You Need in One Place'}</span>
          </h1>
          <p className="text-white/60 text-lg mb-10 max-w-2xl mx-auto">{isAr ? 'مطاعم · سوبرماركت · تاكسي · توصيل' : 'Restaurants · Supermarket · Taxi · Delivery'}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/web" className="bg-[#C8A951] text-[#0A1F3D] font-black px-8 py-4 rounded-2xl text-lg hover:bg-[#d4b55a] transition flex items-center gap-2">
              {isAr ? 'ابدأ التسوق' : 'Start Shopping'}{isAr ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
            </Link>
            <Link to="/mobile" className="border border-white/20 text-white font-semibold px-8 py-4 rounded-2xl text-lg hover:bg-white/5 transition">{isAr ? 'تطبيق الجوال' : 'Mobile App'}</Link>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 border-y border-white/10">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="text-3xl font-black text-[#C8A951]">{isAr ? s.numAr : s.numEn}</div>
              <div className="text-white/50 text-sm mt-1">{isAr ? s.labelAr : s.labelEn}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-3">{isAr ? 'لماذا سمو؟' : 'Why SUMU?'}</h2>
            <p className="text-white/50">{isAr ? 'كل ما تحتاجه في منصة واحدة' : 'Everything you need in one platform'}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: f.color + '20' }}>
                  <f.icon size={24} style={{ color: f.color }} />
                </div>
                <h3 className="font-bold text-white mb-2">{isAr ? f.titleAr : f.titleEn}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{isAr ? f.descAr : f.descEn}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white/3">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-3">{isAr ? 'اختر منصتك' : 'Choose Your Platform'}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {portals.map((p, i) => (
              <Link key={i} to={p.href} className="bg-[#0F2A47] border border-white/10 rounded-2xl p-6 hover:border-[#C8A951]/50 transition">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: p.color + '20' }}>
                  <p.icon size={28} style={{ color: p.color }} />
                </div>
                <h3 className="font-bold text-white mb-2">{isAr ? p.labelAr : p.labelEn}</h3>
                <p className="text-white/50 text-sm mb-4">{isAr ? p.descAr : p.descEn}</p>
                <div className="flex items-center gap-1 text-[#C8A951] text-sm font-semibold">
                  {isAr ? 'فتح' : 'Open'}{isAr ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-white mb-4">{isAr ? 'جاهز للبدء؟' : 'Ready to Start?'}</h2>
          <p className="text-white/50 mb-8">{isAr ? 'انضم إلى آلاف العملاء الراضين' : 'Join thousands of satisfied customers'}</p>
          <Link to="/web" className="bg-[#C8A951] text-[#0A1F3D] font-black px-10 py-4 rounded-2xl text-lg hover:bg-[#d4b55a] transition inline-flex items-center gap-2">
            {isAr ? 'ابدأ مجاناً' : 'Start for Free'}{isAr ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8 px-4 text-center">
        <div className="flex flex-wrap items-center justify-center gap-4 text-white/40 text-sm mb-4">
          <Link to="/web/privacy" className="hover:text-white transition">{isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}</Link>
          <span>·</span>
          <Link to="/web/contact" className="hover:text-white transition">{isAr ? 'تواصل معنا' : 'Contact Us'}</Link>
          <span>·</span>
          <Link to="/admin/login" className="hover:text-white transition">{isAr ? 'لوحة الإدارة' : 'Admin'}</Link>
        </div>
        <p className="text-white/20 text-xs">© 2026 سمو SUMU — {isAr ? 'جميع الحقوق محفوظة' : 'All rights reserved'}</p>
      </footer>
    </div>
  )
}
