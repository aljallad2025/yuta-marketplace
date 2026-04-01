import { useState } from 'react'
import MobileHome from './mobile/MobileHome'
import MobileCategories from './mobile/MobileCategories'
import MobileOrders from './mobile/MobileOrders'
import MobileTaxi from './mobile/MobileTaxi'
import MobileAccount from './mobile/MobileAccount'
import { Home, Grid, Package, Car, User } from 'lucide-react'
import LangToggle from '../components/LangToggle'
import { useLang } from '../i18n/LangContext'

export default function MobileApp() {
  const [activeTab, setActiveTab] = useState('home')
  const { t } = useLang()

  const tabs = [
    { id: 'home', icon: Home, component: MobileHome },
    { id: 'stores', icon: Grid, component: MobileCategories },
    { id: 'orders', icon: Package, component: MobileOrders },
    { id: 'taxi', icon: Car, component: MobileTaxi },
    { id: 'account', icon: User, component: MobileAccount },
  ]

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex flex-col items-center justify-center py-8 px-4">
      {/* Controls */}
      <div className="flex items-center gap-4 mb-6">
        <p className="text-white/40 text-sm font-semibold tracking-wide">SUMU Mobile Preview</p>
        <LangToggle className="border-white/20 bg-white/5 hover:bg-white/10" />
      </div>

      {/* Phone shell */}
      <div className="relative mx-auto" style={{ width: 390 }}>
        <div className="relative bg-[#0F2A47] rounded-[48px] p-[3px] shadow-2xl"
          style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(200,169,81,0.2), inset 0 0 0 1px rgba(255,255,255,0.05)' }}>

          <div className="bg-[#FBF8F2] rounded-[45px] overflow-hidden relative" style={{ height: 780 }}>
            {/* Status bar */}
            <div className="bg-[#0F2A47] px-6 pt-4 pb-2 flex items-center justify-between relative">
              <span className="text-white text-xs font-bold">9:41</span>
              <div className="w-28 h-5 bg-[#0F2A47] rounded-full absolute top-2 left-1/2 -translate-x-1/2 z-10"></div>
              <div className="flex items-center gap-1.5">
                <span className="text-white text-[10px]">●●●●</span>
                <span className="text-white text-[10px] font-medium">WiFi</span>
                <span className="text-white text-[10px]">🔋</span>
              </div>
            </div>

            {/* Screen content */}
            <div className="overflow-y-auto" style={{ height: 'calc(780px - 54px - 62px)' }}>
              {ActiveComponent && <ActiveComponent />}
            </div>

            {/* Bottom nav */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E8E4DC] px-3 py-2.5" style={{ borderRadius: '0 0 45px 45px' }}>
              <div className="flex items-center justify-around">
                {tabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
                      activeTab === tab.id ? 'text-[#0F2A47]' : 'text-[#bbb]'
                    }`}>
                    <div className={`p-1.5 rounded-xl ${activeTab === tab.id ? 'bg-[#0F2A47]/10' : ''}`}>
                      <tab.icon size={17} strokeWidth={activeTab === tab.id ? 2.5 : 1.8} />
                    </div>
                    <span className={`text-[9px] font-bold ${activeTab === tab.id ? 'text-[#0F2A47]' : 'text-[#bbb]'}`}>
                      {t(tab.id === 'stores' ? 'stores' : tab.id)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Side buttons */}
        <div className="absolute top-24 -right-[3px] w-[3px] h-12 bg-[#C8A951]/40 rounded-r-full"></div>
        <div className="absolute top-20 -left-[3px] w-[3px] h-8 bg-[#C8A951]/40 rounded-l-full"></div>
        <div className="absolute top-32 -left-[3px] w-[3px] h-14 bg-[#C8A951]/40 rounded-l-full"></div>
        <div className="absolute top-50 -left-[3px] w-[3px] h-14 bg-[#C8A951]/40 rounded-l-full"></div>
      </div>

      <p className="text-white/20 text-xs mt-6">{t('appTagline')}</p>
    </div>
  )
}
