import { Home, Grid, Package, Car, User } from 'lucide-react'
import { useLang } from '../i18n/LangContext'
import { MobileProvider, useMobile } from '../store/mobileStore.jsx'

import MobileHome from './mobile/MobileHome'
import MobileCategories from './mobile/MobileCategories'
import MobileOrders from './mobile/MobileOrders'
import MobileTaxi from './mobile/MobileTaxi'
import MobileAccount from './mobile/MobileAccount'
import MobileStoreView from './mobile/MobileStoreView'
import MobileCart from './mobile/MobileCart'
import MobileCheckout from './mobile/MobileCheckout'
import MobileOrderPlaced from './mobile/MobileOrderPlaced'

const TABS = [
  { id: 'home',    icon: Home,    labelAr: 'الرئيسية', labelEn: 'Home' },
  { id: 'stores',  icon: Grid,    labelAr: 'المتاجر',  labelEn: 'Stores' },
  { id: 'orders',  icon: Package, labelAr: 'طلباتي',   labelEn: 'Orders' },
  { id: 'taxi',    icon: Car,     labelAr: 'تاكسي',    labelEn: 'Taxi' },
  { id: 'account', icon: User,    labelAr: 'حسابي',    labelEn: 'Account' },
]

function MobileAppInner() {
  const { isAr } = useLang()
  const { activeTab, setActiveTab, view, cartCount, orders } = useMobile()

  const activeOrders = orders.filter(o => ['preparing', 'on_the_way', 'pending'].includes(o.status)).length

  // Overlay views take over the whole screen
  const overlayView = ['store', 'cart', 'checkout', 'orderPlaced', 'orderTracking'].includes(view)

  const renderContent = () => {
    // Overlay views render regardless of tab
    if (view === 'store')        return <MobileStoreView />
    if (view === 'cart')         return <MobileCart />
    if (view === 'checkout')     return <MobileCheckout />
    if (view === 'orderPlaced')  return <MobileOrderPlaced />

    // Tab-based views
    switch (activeTab) {
      case 'home':    return <MobileHome />
      case 'stores':  return <MobileCategories />
      case 'orders':  return <MobileOrders />
      case 'taxi':    return <MobileTaxi />
      case 'account': return <MobileAccount />
      default:        return <MobileHome />
    }
  }

  return (
    <div
      className="fixed inset-0 bg-[#FBF8F2] flex flex-col overflow-hidden"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Safe-area top spacer */}
      <div className="bg-[#0F2A47] flex-shrink-0" style={{ height: 'env(safe-area-inset-top, 0px)' }} />

      {/* Page content */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        {renderContent()}
      </div>

      {/* Bottom Nav — hide during overlay views that go full-screen */}
      {!overlayView && (
        <div
          className="bg-white border-t border-[#E8E4DC] flex-shrink-0"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}
        >
          <div className="flex items-center justify-around px-1 py-1.5">
            {TABS.map(tab => {
              const isActive = activeTab === tab.id
              const badge = tab.id === 'orders' && activeOrders > 0
                ? activeOrders
                : tab.id === 'stores' && cartCount > 0
                ? cartCount
                : null
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all min-w-0 relative ${
                    isActive ? 'text-[#0F2A47]' : 'text-[#bbb]'
                  }`}
                >
                  {badge && (
                    <span className="absolute top-0 end-1 w-4 h-4 bg-[#C8A951] rounded-full text-[7px] font-black text-[#0F2A47] flex items-center justify-center z-10">
                      {badge}
                    </span>
                  )}
                  <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-[#0F2A47]/10' : ''}`}>
                    <tab.icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                  </div>
                  <span className="text-[9px] font-bold truncate">
                    {isAr ? tab.labelAr : tab.labelEn}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default function MobileApp() {
  return (
    <MobileProvider>
      <MobileAppInner />
    </MobileProvider>
  )
}
