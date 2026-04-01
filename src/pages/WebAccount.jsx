import { Link } from 'react-router-dom'
import { User, MapPin, CreditCard, Wallet, Package, Car, Bell, Settings, ChevronRight, Star, Shield, LogOut } from 'lucide-react'
import { useLang } from '../i18n/LangContext'
import LangToggle from '../components/LangToggle'

export default function WebAccount() {
  const { t, isAr } = useLang()

  const menuItems = [
    { icon: MapPin, label: t('savedAddresses'), desc: isAr ? '٣ عناوين محفوظة' : '3 addresses saved', color: '#0F2A47', href: '#' },
    { icon: CreditCard, label: t('paymentMethods'), desc: isAr ? 'فيزا **** ٤٨٩٢' : 'Visa **** 4892', color: '#C8A951', href: '#' },
    { icon: Wallet, label: t('myWallet'), desc: isAr ? 'الرصيد: ١٥٠.٠٠ درهم' : 'Balance: 150.00 AED', color: '#2ECC71', href: '#' },
    { icon: Package, label: t('orderHistory'), desc: isAr ? '١٤ طلب' : '14 orders placed', color: '#3498DB', href: '/web/orders' },
    { icon: Car, label: t('rideHistory'), desc: isAr ? '٨ رحلات' : '8 rides taken', color: '#9B59B6', href: '#' },
    { icon: Bell, label: t('notifications'), desc: isAr ? 'كل الإشعارات مفعلة' : 'All notifications on', color: '#E74C3C', href: '#' },
    { icon: Settings, label: t('settings'), desc: isAr ? 'تفضيلات التطبيق' : 'App preferences', color: '#666', href: '#' },
  ]

  return (
    <div className="min-h-screen bg-[#FBF8F2]" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Profile header */}
      <div className="bg-[#0F2A47] px-4 pb-8 pt-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#C8A951] rounded-full flex items-center justify-center shadow-lg">
              <User size={28} className="text-[#0F2A47]" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-black text-white">
                {isAr ? 'أحمد المنصوري' : 'Ahmed Al Mansouri'}
              </h1>
              <p className="text-white/50 text-sm">ahmed.mansouri@email.com</p>
              <div className="flex items-center gap-2 mt-1">
                <Star size={12} className="fill-[#C8A951] text-[#C8A951]" />
                <span className="text-[#C8A951] text-xs font-black">{t('goldMember')}</span>
                <span className="text-white/30 text-xs">· {isAr ? 'عضو منذ يناير ٢٠٢٤' : 'Member since Jan 2024'}</span>
              </div>
            </div>
            <LangToggle className="border-white/20 bg-white/10 hover:bg-white/20" />
          </div>

          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              { label: t('ordersCount'), value: '14' },
              { label: t('ridesCount'), value: '8' },
              { label: t('points'), value: '2,450' },
            ].map(s => (
              <div key={s.label} className="bg-white/10 rounded-xl py-3 text-center">
                <p className="text-xl font-black text-white">{s.value}</p>
                <p className="text-xs text-white/50">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        {/* Wallet */}
        <div className="bg-gradient-to-r from-[#0F2A47] to-[#1a3a5c] rounded-2xl p-5 text-white shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-sm">{t('walletBalance')}</p>
              <p className="text-3xl font-black mt-1">
                150.00 <span className="text-lg font-semibold text-white/50">{isAr ? 'درهم' : 'AED'}</span>
              </p>
            </div>
            <div className="p-4 bg-[#C8A951]/20 rounded-xl">
              <Wallet size={28} className="text-[#C8A951]" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="flex-1 py-2.5 bg-[#C8A951] text-[#0F2A47] font-black text-sm rounded-xl">{t('topUp')}</button>
            <button className="flex-1 py-2.5 bg-white/10 text-white font-black text-sm rounded-xl border border-white/20">{t('transfer')}</button>
          </div>
        </div>

        {/* Menu */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8E4DC] overflow-hidden">
          {menuItems.map((item, i) => (
            <Link key={item.label} to={item.href}
              className={`flex items-center gap-4 px-4 py-4 hover:bg-[#FBF8F2] transition-colors ${i < menuItems.length - 1 ? 'border-b border-[#F0ECE4]' : ''}`}>
              <div className="p-2.5 rounded-xl" style={{ backgroundColor: item.color + '15' }}>
                <item.icon size={18} style={{ color: item.color }} />
              </div>
              <div className="flex-1">
                <p className="font-black text-[#222] text-sm">{item.label}</p>
                <p className="text-xs text-[#666]">{item.desc}</p>
              </div>
              <ChevronRight size={16} className="text-[#C8A951]" style={{ transform: isAr ? 'rotate(180deg)' : undefined }} />
            </Link>
          ))}
        </div>

        {/* Loyalty */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8E4DC]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Shield size={18} className="text-[#C8A951]" />
              <p className="font-black text-[#0F2A47]">{t('loyaltyPoints')}</p>
            </div>
            <span className="text-sm font-black text-[#C8A951]">
              {isAr ? '٢٬٤٥٠ نقطة' : '2,450 pts'}
            </span>
          </div>
          <div className="w-full bg-[#E8E4DC] rounded-full h-2">
            <div className="bg-[#C8A951] h-2 rounded-full" style={{ width: '65%' }}></div>
          </div>
          <p className="text-xs text-[#666] mt-2">
            {isAr ? '١٬٣٠٠ نقطة إضافية للوصول لمستوى البلاتينيوم' : '1,300 more points to reach Platinum'}
          </p>
        </div>

        <button className="w-full flex items-center gap-2 justify-center py-3.5 text-red-600 bg-white rounded-2xl border border-red-100 hover:bg-red-50 font-black text-sm">
          <LogOut size={16} /> {t('signOut')}
        </button>
      </div>
    </div>
  )
}
