import { useState } from 'react'
import MobileHome from './mobile/MobileHome'
import MobileCategories from './mobile/MobileCategories'
import MobileOrders from './mobile/MobileOrders'
import MobileTaxi from './mobile/MobileTaxi'
import MobileAccount from './mobile/MobileAccount'
import { Home, Grid, Package, Car, User } from 'lucide-react'

const tabs = [
  { id: 'home', label: 'Home', icon: Home, component: MobileHome },
  { id: 'categories', label: 'Categories', icon: Grid, component: MobileCategories },
  { id: 'orders', label: 'Orders', icon: Package, component: MobileOrders },
  { id: 'taxi', label: 'Taxi', icon: Car, component: MobileTaxi },
  { id: 'account', label: 'Account', icon: User, component: MobileAccount },
]

export default function MobileApp() {
  const [activeTab, setActiveTab] = useState('home')
  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center py-10 px-4">
      <div className="text-center mb-0">
        <div className="relative mx-auto" style={{ width: '390px' }}>
          {/* Phone shell */}
          <div className="relative bg-[#0F2A47] rounded-[48px] p-[3px] shadow-2xl"
            style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)' }}>
            {/* Screen */}
            <div className="bg-[#F8F6F1] rounded-[45px] overflow-hidden relative" style={{ height: '780px' }}>
              {/* Status bar */}
              <div className="bg-[#0F2A47] px-6 pt-4 pb-2 flex items-center justify-between">
                <span className="text-white text-xs font-semibold">9:41</span>
                <div className="w-28 h-5 bg-[#0F2A47] rounded-full absolute top-2 left-1/2 -translate-x-1/2 z-10"></div>
                <div className="flex items-center gap-1">
                  <span className="text-white text-xs">●●●●</span>
                  <span className="text-white text-xs">WiFi</span>
                  <span className="text-white text-xs">🔋</span>
                </div>
              </div>

              {/* Scrollable content */}
              <div className="overflow-y-auto" style={{ height: 'calc(780px - 56px - 60px)' }}>
                {ActiveComponent && <ActiveComponent />}
              </div>

              {/* Bottom Navigation */}
              <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E8E6E1] px-2 py-2">
                <div className="flex items-center justify-around">
                  {tabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                      className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                        activeTab === tab.id ? 'text-[#0F2A47]' : 'text-[#999]'
                      }`}>
                      <div className={`p-1.5 rounded-xl ${activeTab === tab.id ? 'bg-[#0F2A47]/10' : ''}`}>
                        <tab.icon size={18} strokeWidth={activeTab === tab.id ? 2.5 : 1.8} />
                      </div>
                      <span className={`text-[9px] font-medium ${activeTab === tab.id ? 'text-[#0F2A47]' : 'text-[#999]'}`}>
                        {tab.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Side buttons */}
          <div className="absolute top-24 -right-1 w-1 h-12 bg-[#0F2A47] rounded-r-full"></div>
          <div className="absolute top-20 -left-1 w-1 h-8 bg-[#0F2A47] rounded-l-full"></div>
          <div className="absolute top-32 -left-1 w-1 h-16 bg-[#0F2A47] rounded-l-full"></div>
          <div className="absolute top-52 -left-1 w-1 h-16 bg-[#0F2A47] rounded-l-full"></div>
        </div>

        <p className="text-white/40 text-sm mt-6">SUMU Mobile App Preview</p>
        <p className="text-white/20 text-xs mt-1">Tap tabs to navigate between screens</p>
      </div>
    </div>
  )
}
