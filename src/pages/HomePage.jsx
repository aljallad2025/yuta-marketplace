import { Link } from 'react-router-dom'
import { Smartphone, Monitor, Settings, ArrowRight, Star, Shield, Zap, Truck, Store, ChevronRight, Package } from 'lucide-react'
import { useLang } from '../i18n/LangContext'
import LangToggle from '../components/LangToggle'

export default function HomePage() {
  const { isAr } = useLang()

  const platforms = [
    {
      icon: Monitor,
      labelEn: 'Web Platform',
      labelAr: 'المنصة الإلكترونية',
      descEn: 'Customer marketplace, delivery & taxi booking',
      descAr: 'بوابة التسوق والتوصيل وحجز التاكسي للعملاء',
      href: '/web',
      color: '#C8A951',
      badge: null,
      featuresEn: ['Home & Discovery', 'Marketplace', 'Checkout', 'Taxi Booking', 'Order Tracking'],
      featuresAr: ['الرئيسية والاكتشاف', 'المتجر', 'إتمام الطلب', 'حجز التاكسي', 'تتبع الطلبات'],
    },
    {
      icon: Smartphone,
      labelEn: 'Mobile App',
      labelAr: 'تطبيق الجوال',
      descEn: 'Interactive simulation of the SUMU mobile app',
      descAr: 'محاكاة تفاعلية لتطبيق سمو للجوال',
      href: '/mobile',
      color: '#2ECC71',
      badge: null,
      featuresEn: ['Home Screen', 'Store Browse', 'Orders', 'Taxi', 'Account'],
      featuresAr: ['الشاشة الرئيسية', 'تصفح المتاجر', 'الطلبات', 'التاكسي', 'الحساب'],
    },
    {
      icon: Settings,
      labelEn: 'Admin Dashboard',
      labelAr: 'لوحة الإدارة',
      descEn: 'Full control panel for the entire platform',
      descAr: 'لوحة تحكم كاملة لإدارة المنصة بأكملها',
      href: '/admin/login',
      color: '#3498DB',
      badge: isAr ? 'مدير' : 'Admin',
      featuresEn: ['Analytics', 'Users & Stores', 'Categories', 'Orders', 'Live Map', 'Financial'],
      featuresAr: ['التحليلات', 'المستخدمون والمتاجر', 'الأقسام', 'الطلبات', 'الخريطة المباشرة', 'المالية'],
    },
    {
      icon: Store,
      labelEn: 'Vendor Dashboard',
      labelAr: 'لوحة المورد / المتجر',
      descEn: 'Store owner portal — products, orders & analytics',
      descAr: 'بوابة صاحب المتجر — المنتجات والطلبات والإحصائيات',
      href: '/vendor/login',
      color: '#9B59B6',
      badge: isAr ? 'مورد' : 'Vendor',
      featuresEn: ['Product Management', 'Order Control', 'Analytics', 'Wallet', 'Reviews', 'Settings'],
      featuresAr: ['إدارة المنتجات', 'التحكم بالطلبات', 'الإحصائيات', 'المحفظة', 'التقييمات', 'الإعدادات'],
    },
    {
      icon: Truck,
      labelEn: 'Driver Dashboard',
      labelAr: 'لوحة موظف التوصيل',
      descEn: 'Driver portal — real-time orders, earnings & history',
      descAr: 'بوابة السائق — الطلبات الفورية والأرباح والسجل',
      href: '/driver/login',
      color: '#E74C3C',
      badge: isAr ? 'سائق' : 'Driver',
      featuresEn: ['Available Orders', 'Active Deliveries', 'Earnings Charts', 'History', 'Online Toggle'],
      featuresAr: ['الطلبات المتاحة', 'التوصيلات النشطة', 'مخططات الأرباح', 'السجل', 'تبديل الاتصال'],
    },
    {
      icon: Package,
      labelEn: 'React Native App',
      labelAr: 'تطبيق React Native',
      descEn: 'Full mobile app — export as APK / IPA',
      descAr: 'تطبيق جوال كامل — تصدير كـ APK / IPA',
      href: '/react-native',
      color: '#00D4FF',
      badge: isAr ? 'جديد ✨' : 'New ✨',
      featuresEn: ['Expo SDK 52', 'Bottom Tab Nav', 'Cart & Checkout', 'Taxi Booking', 'EAS Build Ready'],
      featuresAr: ['Expo SDK 52', 'تنقل بالتبويبات', 'سلة ودفع', 'حجز التاكسي', 'جاهز لـ EAS Build'],
    },
  ]

  return (
    <div className="min-h-screen bg-[#0F2A47] flex flex-col items-center justify-center px-4 py-12" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Lang toggle */}
      <div className="absolute top-4 end-4">
        <LangToggle className="border-white/20 bg-white/10 hover:bg-white/20 text-white" />
      </div>

      {/* Brand header */}
      <div className="text-center mb-10">
        <div className="flex justify-center mb-5">
          <div className="w-20 h-20 bg-[#C8A951]/20 rounded-3xl flex items-center justify-center text-5xl">🏆</div>
        </div>
        <div className="mb-2 flex items-center justify-center gap-3">
          <span className="text-4xl font-black text-[#C8A951] tracking-widest">سمو</span>
          <span className="text-white/30 text-3xl">·</span>
          <span className="text-4xl font-black text-white tracking-[0.2em]">SUMU</span>
        </div>
        <p className="text-white/50 text-sm max-w-md mx-auto mt-2">
          {isAr ? 'منصة الخليج المتكاملة — مطاعم · سوبرماركت · تاكسي · توصيل' : 'Premium Gulf super-app — Restaurants · Supermarket · Taxi · Delivery'}
        </p>
      </div>

      {/* Platform cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 w-full max-w-6xl mb-8">
        {platforms.map(platform => (
          <Link key={platform.labelEn} to={platform.href}
            className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#C8A951]/50 rounded-2xl p-5 transition-all hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl" style={{ backgroundColor: platform.color + '25' }}>
                <platform.icon size={20} style={{ color: platform.color }} />
              </div>
              {platform.badge && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full border" style={{ color: platform.color, borderColor: platform.color + '40', backgroundColor: platform.color + '15' }}>
                  {platform.badge}
                </span>
              )}
            </div>
            <h2 className="font-black text-white text-sm mb-1">{isAr ? platform.labelAr : platform.labelEn}</h2>
            <p className="text-white/40 text-xs mb-3 leading-relaxed">{isAr ? platform.descAr : platform.descEn}</p>
            <ul className="space-y-1 mb-4">
              {(isAr ? platform.featuresAr : platform.featuresEn).map(f => (
                <li key={f} className="flex items-center gap-1.5 text-[11px] text-white/50">
                  <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: platform.color }}></div>
                  {f}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-1.5 text-xs font-black group-hover:gap-2 transition-all" style={{ color: platform.color }}>
              {isAr ? 'فتح' : 'Open'}
              <ChevronRight size={12} style={{ transform: isAr ? 'rotate(180deg)' : undefined }} />
            </div>
          </Link>
        ))}
      </div>

      {/* Brand attributes */}
      <div className="flex flex-wrap items-center justify-center gap-5 text-white/40 text-xs">
        <div className="flex items-center gap-1.5"><Star size={12} className="text-[#C8A951]" /> {isAr ? 'علامة خليجية فاخرة' : 'Premium Gulf Brand'}</div>
        <div className="flex items-center gap-1.5"><Shield size={12} className="text-[#C8A951]" /> {isAr ? 'تصميم احترافي' : 'Enterprise Design'}</div>
        <div className="flex items-center gap-1.5"><Zap size={12} className="text-[#C8A951]" /> {isAr ? 'بيانات حية مترابطة' : 'Live Connected Data'}</div>
      </div>

      <p className="text-white/15 text-[10px] mt-6">React 19 + Vite + Tailwind CSS · SUMU Platform v2.0</p>
    </div>
  )
}
