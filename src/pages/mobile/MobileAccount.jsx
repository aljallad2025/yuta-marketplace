import { User, MapPin, CreditCard, Wallet, Package, Car, Bell, Settings, ChevronRight, LogOut, Star } from 'lucide-react'
import { useLang } from '../../i18n/LangContext'

export default function MobileAccount() {
  const { t, isAr } = useLang()

  const menuItems = [
    { icon: MapPin, labelEn: 'Saved Addresses', labelAr: 'العناوين المحفوظة', color: '#0F2A47' },
    { icon: CreditCard, labelEn: 'Payment Methods', labelAr: 'طرق الدفع', color: '#C8A951' },
    { icon: Wallet, labelEn: 'My Wallet', labelAr: 'محفظتي', color: '#2ECC71' },
    { icon: Package, labelEn: 'Order History', labelAr: 'سجل الطلبات', color: '#3498DB' },
    { icon: Car, labelEn: 'Ride History', labelAr: 'سجل الرحلات', color: '#9B59B6' },
    { icon: Bell, labelEn: 'Notifications', labelAr: 'الإشعارات', color: '#E74C3C' },
    { icon: Settings, labelEn: 'Settings', labelAr: 'الإعدادات', color: '#666' },
  ]

  return (
    <div className="bg-[#FBF8F2]" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="bg-[#0F2A47] px-4 pt-2 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#C8A951] rounded-full flex items-center justify-center shadow-lg">
            <User size={20} className="text-[#0F2A47]" />
          </div>
          <div className="flex-1">
            <p className="font-black text-white text-sm">{isAr ? 'أحمد المنصوري' : 'Ahmed Al Mansouri'}</p>
            <p className="text-white/50 text-[10px]">ahmed.mansouri@email.com</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Star size={10} className="fill-[#C8A951] text-[#C8A951]" />
              <span className="text-[#C8A951] text-[10px] font-black">{t('goldMember')}</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            { val: '14', labelEn: 'Orders', labelAr: 'طلب' },
            { val: '8',  labelEn: 'Rides',  labelAr: 'رحلة' },
            { val: '2,450', labelEn: 'Points', labelAr: 'نقطة' },
          ].map(s => (
            <div key={s.labelEn} className="bg-white/10 rounded-xl py-2 text-center">
              <p className="text-white font-black text-sm">{s.val}</p>
              <p className="text-white/50 text-[9px]">{isAr ? s.labelAr : s.labelEn}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-3 mt-3">
        <div className="bg-gradient-to-r from-[#0F2A47] to-[#1a3a5c] rounded-2xl p-4 flex items-center gap-3">
          <Wallet size={24} className="text-[#C8A951]" />
          <div className="flex-1">
            <p className="text-white/60 text-[10px]">{t('walletBalance')}</p>
            <p className="text-white font-black text-lg">150.00 <span className="text-sm text-white/50">{isAr ? 'درهم' : 'AED'}</span></p>
          </div>
          <button className="px-3 py-1.5 bg-[#C8A951] text-[#0F2A47] text-xs font-black rounded-xl">{t('topUp')}</button>
        </div>
      </div>

      <div className="px-3 mt-3">
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8E4DC] overflow-hidden">
          {menuItems.map((item, i) => (
            <button key={item.labelEn}
              className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-[#FBF8F2] ${
                i < menuItems.length - 1 ? 'border-b border-[#F0ECE4]' : ''
              }`}>
              <div className="p-2 rounded-lg" style={{ backgroundColor: item.color + '15' }}>
                <item.icon size={15} style={{ color: item.color }} />
              </div>
              <span className="flex-1 text-xs font-black text-[#222] text-start">
                {isAr ? item.labelAr : item.labelEn}
              </span>
              <ChevronRight size={13} className="text-[#C8A951]" style={{ transform: isAr ? 'rotate(180deg)' : undefined }} />
            </button>
          ))}
        </div>
      </div>

      <div className="px-3 mt-3 pb-4">
        <button className="w-full flex items-center gap-2 justify-center py-3 text-red-600 bg-white rounded-xl border border-red-100 text-xs font-black">
          <LogOut size={13} /> {t('signOut')}
        </button>
      </div>
    </div>
  )
}
