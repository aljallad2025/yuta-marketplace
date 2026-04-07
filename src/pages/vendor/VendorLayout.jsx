import { useState } from 'react'
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, ShoppingBag, BarChart3, Settings,
  Bell, Menu, LogOut, Store, Star, ChevronDown, MessageSquare,
  Wallet, Tag, Clock
} from 'lucide-react'
import { useLang } from '../../i18n/LangContext'
import LangToggle from '../../components/LangToggle'
import { useApp } from '../../store/appStore'
import { useStores } from '../../store/storesStore'
import { useAuth } from '../../store/authStore'
import SumuLogo from '../../components/SumuLogo'

export default function VendorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [notifOpen, setNotifOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { isAr } = useLang()
  const { logout, currentUser } = useAuth()
  const { notifications, markNotificationRead, markAllNotificationsRead, unreadCount, activeVendorId, setActiveVendorId } = useApp()
  const { stores } = useStores()

  // Use logged-in vendor's storeId from auth session
  const loggedStoreId = currentUser?.storeId || activeVendorId
  const vendorStore = stores.find(s => s.id === loggedStoreId) || stores[0]
  // Filter notifs relevant to this store
  const vendorNotifs = notifications.filter(n => !n.storeId || n.storeId === loggedStoreId).slice(0, 8)

  const navItems = [
    { icon: LayoutDashboard, labelAr: 'الرئيسية', labelEn: 'Dashboard', href: '/vendor' },
    { icon: Package, labelAr: 'المنتجات', labelEn: 'Products', href: '/vendor/products' },
    { icon: ShoppingBag, labelAr: 'الطلبات', labelEn: 'Orders', href: '/vendor/orders' },
    { icon: BarChart3, labelAr: 'الإحصائيات', labelEn: 'Analytics', href: '/vendor/analytics' },
    { icon: Wallet, labelAr: 'المحفظة', labelEn: 'Wallet', href: '/vendor/wallet' },
    { icon: MessageSquare, labelAr: 'التقييمات', labelEn: 'Reviews', href: '/vendor/reviews' },
    { icon: Settings, labelAr: 'الإعدادات', labelEn: 'Settings', href: '/vendor/settings' },
  ]

  return (
    <div className="flex h-screen bg-[#FBF8F2] overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-56' : 'w-14'} bg-[#0F2A47] flex flex-col flex-shrink-0 overflow-hidden transition-all duration-200`}>
        {/* Logo */}
        <div className="flex items-center gap-2 px-3 py-4 border-b border-white/10">
          <SumuLogo size={28} variant="icon" />
          {sidebarOpen && (
            <div className="min-w-0">
              <p className="text-[#C8A951] font-black text-xs tracking-widest">سمو SUMU</p>
              <p className="text-white/40 text-[9px]">{isAr ? 'بوابة المورد' : 'Vendor Portal'}</p>
            </div>
          )}
        </div>

        {/* Store selector */}
        {sidebarOpen && (
          <div className="mx-3 mt-3 bg-white/10 rounded-xl p-2.5">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{vendorStore?.emoji || '🏪'}</span>
              <div className="min-w-0 flex-1">
                <p className="text-white text-xs font-black truncate">{isAr ? vendorStore?.nameAr : vendorStore?.nameEn}</p>
                <div className="flex items-center gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${vendorStore?.active ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                  <p className="text-white/50 text-[9px]">{vendorStore?.active ? (isAr ? 'مفتوح' : 'Open') : (isAr ? 'مغلق' : 'Closed')}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 space-y-0.5">
          {navItems.map(item => {
            const isActive = location.pathname === item.href ||
              (item.href !== '/vendor' && location.pathname.startsWith(item.href))
            return (
              <Link key={item.href} to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 mx-2 rounded-xl transition-all ${
                  isActive ? 'bg-[#C8A951] text-[#0F2A47]' : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}>
                <item.icon size={16} className="flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-bold">{isAr ? item.labelAr : item.labelEn}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/10 p-3">
          {sidebarOpen && (
            <div className="flex items-center gap-2 mb-3 px-1">
              <div className="w-7 h-7 bg-[#C8A951] rounded-full flex items-center justify-center flex-shrink-0 text-sm font-black text-[#0F2A47]">
                {(isAr ? vendorStore?.ownerAr : vendorStore?.ownerEn)?.[0] || 'م'}
              </div>
              <div className="min-w-0">
                <p className="text-white text-xs font-black truncate">{isAr ? vendorStore?.ownerAr : vendorStore?.ownerEn}</p>
                <p className="text-white/40 text-[9px] truncate">{vendorStore?.phone}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <button onClick={() => { logout(); navigate('/vendor/login') }}
              className="flex items-center gap-1.5 text-white/50 hover:text-white text-xs px-2 py-1 font-semibold">
              <LogOut size={13} />
              {sidebarOpen && (isAr ? 'خروج' : 'Sign Out')}
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-[#E8E4DC] px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-[#FBF8F2] text-[#666]">
            <Menu size={17} />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm text-[#999]">
            <Store size={14} className="text-[#C8A951]" />
            <span className="font-black text-[#0F2A47]">{isAr ? vendorStore?.nameAr : vendorStore?.nameEn}</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <LangToggle className="border-[#E8E4DC]" />

            {/* Notifications */}
            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-lg hover:bg-[#FBF8F2] text-[#666]">
                <Bell size={17} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#E74C3C] rounded-full text-[9px] text-white font-black flex items-center justify-center">{unreadCount}</span>
                )}
              </button>
              {notifOpen && (
                <div className={`absolute top-full mt-1 w-72 bg-white rounded-2xl shadow-2xl border border-[#E8E4DC] z-50 ${isAr ? 'left-0' : 'right-0'}`}>
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[#F0ECE4]">
                    <p className="font-black text-[#0F2A47] text-sm">{isAr ? 'الإشعارات' : 'Notifications'}</p>
                    <button onClick={markAllNotificationsRead} className="text-xs text-[#C8A951] font-black">{isAr ? 'قراءة الكل' : 'Mark all read'}</button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {vendorNotifs.length === 0 ? (
                      <p className="text-center text-sm text-[#999] py-6">{isAr ? 'لا توجد إشعارات' : 'No notifications'}</p>
                    ) : vendorNotifs.map(n => (
                      <button key={n.id} onClick={() => markNotificationRead(n.id)}
                        className={`w-full text-start px-4 py-3 hover:bg-[#FBF8F2] border-b border-[#F0ECE4] last:border-0 ${!n.read ? 'bg-blue-50/40' : ''}`}>
                        <p className="text-sm font-black text-[#222]">{isAr ? n.titleAr : n.titleEn}</p>
                        <p className="text-xs text-[#666] mt-0.5">{isAr ? n.msgAr : n.msgEn}</p>
                        <p className="text-[10px] text-[#999] mt-1">{new Date(n.time).toLocaleTimeString(isAr ? 'ar-AE' : 'en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Store selector */}
            <select
              value={activeVendorId}
              onChange={e => setActiveVendorId(Number(e.target.value))}
              className="text-xs font-black border border-[#E8E4DC] rounded-xl px-2 py-1.5 bg-[#FBF8F2] text-[#0F2A47] outline-none"
            >
              {stores.map(s => (
                <option key={s.id} value={s.id}>{isAr ? s.nameAr : s.nameEn}</option>
              ))}
            </select>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
