import { useState } from 'react'
import { User, MapPin, CreditCard, Wallet, Package, Car, Bell, Settings, ChevronRight, LogOut, Star, X, Plus, Globe } from 'lucide-react'
import { useLang } from '../../i18n/LangContext'
import { useMobile } from '../../store/mobileStore.jsx'

export default function MobileAccount() {
  const { isAr, setLang, lang } = useLang()
  const { walletBalance, topUpWallet, addresses, addAddress, orders } = useMobile()
  const [topUpModal, setTopUpModal] = useState(false)
  const [topUpAmt, setTopUpAmt] = useState(null)
  const [addAddrModal, setAddAddrModal] = useState(false)
  const [newAddr, setNewAddr] = useState({ labelEn: '', labelAr: '', addr: '' })
  const [activeSection, setActiveSection] = useState(null)

  const completedOrders = orders.filter(o => o.status === 'completed').length
  const ridesCount = 8
  const points = completedOrders * 180 + 450

  const menuItems = [
    { id: 'addresses', icon: MapPin,     labelEn: 'Saved Addresses', labelAr: 'العناوين المحفوظة', color: '#0F2A47' },
    { id: 'payment',   icon: CreditCard, labelEn: 'Payment Methods', labelAr: 'طرق الدفع',         color: '#C8A951' },
    { id: 'wallet',    icon: Wallet,     labelEn: 'My Wallet',       labelAr: 'محفظتي',            color: '#2ECC71' },
    { id: 'orders',    icon: Package,    labelEn: 'Order History',   labelAr: 'سجل الطلبات',      color: '#3498DB' },
    { id: 'rides',     icon: Car,        labelEn: 'Ride History',    labelAr: 'سجل الرحلات',      color: '#9B59B6' },
    { id: 'notifs',    icon: Bell,       labelEn: 'Notifications',   labelAr: 'الإشعارات',         color: '#E74C3C' },
    { id: 'lang',      icon: Globe,      labelEn: 'Language',        labelAr: 'اللغة',             color: '#00BCD4' },
    { id: 'settings',  icon: Settings,   labelEn: 'Settings',        labelAr: 'الإعدادات',         color: '#666' },
  ]

  const handleMenuItem = (id) => {
    if (id === 'wallet') { setTopUpModal(true); return }
    if (id === 'addresses') { setActiveSection('addresses'); return }
    if (id === 'lang') { setLang(lang === 'ar' ? 'en' : 'ar'); return }
    setActiveSection(id)
  }

  return (
    <div className="bg-[#FBF8F2] min-h-full" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-[#0F2A47] px-4 pt-2 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-[#C8A951] rounded-full flex items-center justify-center shadow-lg">
            <User size={22} className="text-[#0F2A47]" />
          </div>
          <div className="flex-1">
            <p className="font-black text-white text-sm">{isAr ? 'أحمد المنصوري' : 'Ahmed Al Mansouri'}</p>
            <p className="text-white/50 text-[10px]">ahmed.mansouri@email.com</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Star size={10} className="fill-[#C8A951] text-[#C8A951]" />
              <span className="text-[#C8A951] text-[10px] font-black">{isAr ? 'عضو ذهبي' : 'Gold Member'}</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            { val: completedOrders || 14, labelEn: 'Orders', labelAr: 'طلب' },
            { val: ridesCount, labelEn: 'Rides', labelAr: 'رحلة' },
            { val: points.toLocaleString(), labelEn: 'Points', labelAr: 'نقطة' },
          ].map(s => (
            <div key={s.labelEn} className="bg-white/10 rounded-xl py-2 text-center">
              <p className="text-white font-black text-sm">{s.val}</p>
              <p className="text-white/50 text-[9px]">{isAr ? s.labelAr : s.labelEn}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Wallet Card */}
      <div className="px-3 mt-3">
        <button
          onClick={() => setTopUpModal(true)}
          className="w-full bg-gradient-to-r from-[#0F2A47] to-[#1a3a5c] rounded-2xl p-4 flex items-center gap-3 active:opacity-90 text-start"
        >
          <Wallet size={24} className="text-[#C8A951]" />
          <div className="flex-1">
            <p className="text-white/60 text-[10px]">{isAr ? 'رصيد المحفظة' : 'Wallet Balance'}</p>
            <p className="text-white font-black text-lg">{walletBalance.toFixed(2)} <span className="text-sm text-white/50">{isAr ? 'درهم' : 'AED'}</span></p>
          </div>
          <span className="px-3 py-1.5 bg-[#C8A951] text-[#0F2A47] text-xs font-black rounded-xl">
            {isAr ? 'شحن' : 'Top Up'}
          </span>
        </button>
      </div>

      {/* Menu */}
      <div className="px-3 mt-3">
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8E4DC] overflow-hidden">
          {menuItems.map((item, i) => (
            <button
              key={item.id}
              onClick={() => handleMenuItem(item.id)}
              className={"w-full flex items-center gap-3 px-4 py-3.5 active:bg-[#FBF8F2] " +
                (i < menuItems.length - 1 ? 'border-b border-[#F0ECE4]' : '')}
            >
              <div className="p-2 rounded-lg" style={{ backgroundColor: item.color + '18' }}>
                <item.icon size={15} style={{ color: item.color }} />
              </div>
              <span className="flex-1 text-xs font-black text-[#222] text-start">
                {isAr ? item.labelAr : item.labelEn}
              </span>
              {item.id === 'lang' && (
                <span className="text-[10px] text-[#C8A951] font-bold me-2">
                  {lang === 'ar' ? 'English' : 'العربية'}
                </span>
              )}
              <ChevronRight size={13} className="text-[#C8A951]" style={{ transform: isAr ? 'rotate(180deg)' : undefined }} />
            </button>
          ))}
        </div>
      </div>

      <div className="px-3 mt-3 pb-4">
        <button className="w-full flex items-center gap-2 justify-center py-3 text-red-600 bg-white rounded-xl border border-red-100 text-xs font-black active:bg-red-50">
          <LogOut size={13} /> {isAr ? 'تسجيل الخروج' : 'Sign Out'}
        </button>
      </div>

      {/* Wallet Top-Up Modal */}
      {topUpModal && (
        <div className="fixed inset-0 z-50 flex items-end" dir={isAr ? 'rtl' : 'ltr'}>
          <div className="absolute inset-0 bg-black/40" onClick={() => { setTopUpModal(false); setTopUpAmt(null) }} />
          <div className="relative w-full bg-white rounded-t-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <p className="font-black text-[#0F2A47] text-sm">{isAr ? 'شحن المحفظة' : 'Top Up Wallet'}</p>
              <button onClick={() => { setTopUpModal(false); setTopUpAmt(null) }}><X size={18} className="text-[#999]" /></button>
            </div>
            <p className="text-xs text-[#999] mb-1">{isAr ? 'الرصيد الحالي' : 'Current balance'}</p>
            <p className="font-black text-[#0F2A47] text-2xl mb-4">{walletBalance.toFixed(2)} <span className="text-sm text-[#999]">{isAr ? 'درهم' : 'AED'}</span></p>
            <p className="text-xs font-black text-[#0F2A47] mb-2">{isAr ? 'اختر المبلغ' : 'Choose Amount'}</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[50, 100, 200, 300, 500, 1000].map(amt => (
                <button
                  key={amt}
                  onClick={() => setTopUpAmt(amt)}
                  className={"py-2.5 rounded-xl text-sm font-black border transition-all " +
                    (topUpAmt === amt ? 'bg-[#0F2A47] text-white border-[#0F2A47]' : 'bg-[#FBF8F2] text-[#0F2A47] border-[#E8E4DC]')}
                >
                  {amt}
                </button>
              ))}
            </div>
            <button
              disabled={!topUpAmt}
              onClick={() => { topUpWallet(topUpAmt); setTopUpModal(false); setTopUpAmt(null) }}
              className="w-full py-3.5 bg-[#0F2A47] text-white font-black rounded-2xl text-sm disabled:opacity-40 active:opacity-90"
            >
              {topUpAmt ? `${isAr ? 'شحن' : 'Add'} ${topUpAmt} ${isAr ? 'درهم' : 'AED'}` : (isAr ? 'اختر مبلغاً' : 'Select an amount')}
            </button>
          </div>
        </div>
      )}

      {/* Addresses Modal */}
      {activeSection === 'addresses' && (
        <div className="fixed inset-0 z-50 flex items-end" dir={isAr ? 'rtl' : 'ltr'}>
          <div className="absolute inset-0 bg-black/40" onClick={() => { setActiveSection(null); setAddAddrModal(false) }} />
          <div className="relative w-full bg-white rounded-t-3xl max-h-[80vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-4 py-4 border-b border-[#F0ECE4]">
              <p className="font-black text-[#0F2A47] text-sm">{isAr ? 'عناويني' : 'My Addresses'}</p>
              <button onClick={() => setActiveSection(null)}><X size={18} className="text-[#999]" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {addresses.map(addr => (
                <div key={addr.id} className="flex items-center gap-3 bg-[#FBF8F2] rounded-xl p-3 border border-[#E8E4DC]">
                  <MapPin size={16} className="text-[#C8A951] flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-black text-xs text-[#0F2A47]">{isAr ? addr.labelAr : addr.labelEn}</p>
                    <p className="text-[10px] text-[#999] mt-0.5">{addr.addr}</p>
                  </div>
                </div>
              ))}
            </div>
            {!addAddrModal ? (
              <div className="p-4 border-t border-[#F0ECE4]">
                <button
                  onClick={() => setAddAddrModal(true)}
                  className="w-full py-3 bg-[#0F2A47] text-white font-black rounded-xl text-sm flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> {isAr ? 'إضافة عنوان' : 'Add Address'}
                </button>
              </div>
            ) : (
              <div className="p-4 border-t border-[#F0ECE4] space-y-2">
                <input
                  value={newAddr.labelEn}
                  onChange={e => setNewAddr(p => ({ ...p, labelEn: e.target.value, labelAr: e.target.value }))}
                  placeholder={isAr ? 'اسم العنوان (مثال: البيت)' : 'Label (e.g. Home)'}
                  className="w-full border border-[#E8E4DC] rounded-xl px-3 py-2.5 text-xs outline-none"
                />
                <input
                  value={newAddr.addr}
                  onChange={e => setNewAddr(p => ({ ...p, addr: e.target.value }))}
                  placeholder={isAr ? 'تفاصيل العنوان' : 'Full address'}
                  className="w-full border border-[#E8E4DC] rounded-xl px-3 py-2.5 text-xs outline-none"
                />
                <button
                  disabled={!newAddr.labelEn || !newAddr.addr}
                  onClick={() => {
                    addAddress(newAddr)
                    setNewAddr({ labelEn: '', labelAr: '', addr: '' })
                    setAddAddrModal(false)
                  }}
                  className="w-full py-3 bg-[#0F2A47] text-white font-black rounded-xl text-sm disabled:opacity-40"
                >
                  {isAr ? 'حفظ' : 'Save'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
