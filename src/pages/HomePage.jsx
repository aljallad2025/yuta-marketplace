import { Link } from 'react-router-dom'
import { Smartphone, Monitor, Settings, ArrowRight, Star, Shield, Zap, Truck } from 'lucide-react'
import { useLang } from '../i18n/LangContext'
import LangToggle from '../components/LangToggle'

export default function HomePage() {
  const { isAr } = useLang()

  const platforms = [
    {
      icon: Monitor,
      labelEn: 'Web Platform',
      labelAr: 'المنصة الإلكترونية',
      descEn: 'Customer-facing marketplace, delivery & taxi booking portal',
      descAr: 'بوابة التسوق ومتجر التوصيل وحجز التاكسي للعملاء',
      href: '/web',
      color: '#C8A951',
      featuresEn: ['Home & Discovery', 'Marketplace', 'Checkout', 'Taxi Booking', 'Order Tracking'],
      featuresAr: ['الرئيسية والاكتشاف', 'المتجر', 'إتمام الطلب', 'حجز التاكسي', 'تتبع الطلبات'],
    },
    {
      icon: Smartphone,
      labelEn: 'Mobile App',
      labelAr: 'تطبيق الجوال',
      descEn: 'Interactive phone UI simulation of the SUMU mobile app',
      descAr: 'محاكاة تفاعلية لواجهة تطبيق سمو للجوال',
      href: '/mobile',
      color: '#2ECC71',
      featuresEn: ['Home Screen', 'Categories', 'Orders', 'Taxi', 'Account'],
      featuresAr: ['الشاشة الرئيسية', 'الأقسام', 'الطلبات', 'التاكسي', 'الحساب'],
    },
    {
      icon: Settings,
      labelEn: 'Admin Dashboard',
      labelAr: 'لوحة الإدارة',
      descEn: 'Full control panel for managing the entire platform',
      descAr: 'لوحة تحكم كاملة لإدارة المنصة بأكملها',
      href: '/admin',
      color: '#3498DB',
      featuresEn: ['Analytics', 'Users & Stores', 'Categories', 'Orders', 'Live Map', 'Financial'],
      featuresAr: ['التحليلات', 'المستخدمون والمتاجر', 'الأقسام', 'الطلبات', 'الخريطة المباشرة', 'الإدارة المالية'],
    },
    {
      icon: Truck,
      labelEn: 'Driver Portal',
      labelAr: 'بوابة موظف التوصيل',
      descEn: 'Delivery driver dashboard — orders, map, earnings & history',
      descAr: 'واجهة موظف التوصيل — الطلبات والخريطة والأرباح والسجل',
      href: '/driver',
      color: '#E74C3C',
      featuresEn: ['New Orders', 'Accept / Decline', 'Live Navigation', 'Earnings', 'History'],
      featuresAr: ['طلبات جديدة', 'قبول / رفض', 'ملاحة مباشرة', 'الأرباح', 'السجل'],
    },
  ]

  return (
    <div className="min-h-screen bg-[#0F2A47] flex flex-col items-center justify-center px-4 py-12" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Lang toggle */}
      <div className="absolute top-4 end-4">
        <LangToggle className="border-white/20 bg-white/10 hover:bg-white/20 text-white" />
      </div>

      {/* Brand header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <img src="/sumu-logo.png" alt="SUMU" className="w-24 h-24 object-contain drop-shadow-2xl" />
        </div>
        <div className="mb-2">
          <span className="text-4xl font-black text-[#C8A951] tracking-widest">سمو</span>
          <span className="text-white/40 mx-3 text-3xl">·</span>
          <span className="text-4xl font-black text-white tracking-[0.2em]">SUMU</span>
        </div>
        <p className="text-white/50 text-base max-w-md mx-auto mt-3">
          {isAr ? 'منصة الخليج المتكاملة — مطاعم · سوبرماركت · تاكسي · توصيل' : 'Premium Gulf platform — Restaurants · Supermarket · Taxi · Delivery'}
        </p>
      </div>

      {/* Platform cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl mb-10">
        {platforms.map(platform => (
          <Link key={platform.labelEn} to={platform.href}
            className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#C8A951]/50 rounded-2xl p-6 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: platform.color + '20' }}>
                <platform.icon size={22} style={{ color: platform.color }} />
              </div>
              <h2 className="font-black text-white text-lg">{isAr ? platform.labelAr : platform.labelEn}</h2>
            </div>
            <p className="text-white/50 text-sm mb-4 leading-relaxed">{isAr ? platform.descAr : platform.descEn}</p>
            <ul className="space-y-1.5 mb-5">
              {(isAr ? platform.featuresAr : platform.featuresEn).map(f => (
                <li key={f} className="flex items-center gap-2 text-xs text-white/60">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: platform.color }}></div>
                  {f}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2 text-sm font-black group-hover:gap-3 transition-all" style={{ color: platform.color }}>
              {isAr ? `افتح ${platform.labelAr}` : `Open ${platform.labelEn}`}
              <ArrowRight size={14} style={{ transform: isAr ? 'rotate(180deg)' : undefined }} />
            </div>
          </Link>
        ))}
      </div>

      {/* Brand attributes */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-white/40 text-sm">
        <div className="flex items-center gap-2"><Star size={14} className="text-[#C8A951]" /> {isAr ? 'علامة خليجية فاخرة' : 'Premium Gulf Brand'}</div>
        <div className="flex items-center gap-2"><Shield size={14} className="text-[#C8A951]" /> {isAr ? 'تصميم احترافي' : 'Enterprise-Grade Design'}</div>
        <div className="flex items-center gap-2"><Zap size={14} className="text-[#C8A951]" /> {isAr ? 'واجهة جاهزة للإنتاج' : 'Production-Ready UI'}</div>
      </div>

      <p className="text-white/20 text-xs mt-8">React + Vite + Tailwind CSS</p>
    </div>
  )
}
