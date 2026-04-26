import { useState } from 'react'
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, Store, Car, Package, Navigation, Map, DollarSign,
  Tag, Settings, Bell, Search, Menu, Wallet, BarChart3, LogOut, Shield, CheckSquare
} from 'lucide-react'
import YutaLogo from '../../components/YutaLogo'
import LangToggle from '../../components/LangToggle'
import { useLang } from '../../i18n/LangContext'
import { useAuth } from '../../store/authStore'

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const { t, isAr } = useLang()
  const { logout, getPendingVendors, getPendingDrivers, currentUser } = useAuth()
  const pendingCount = getPendingVendors().length + getPendingDrivers().length

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const navGroups = [
    {
      label: isAr ? 'نظرة عامة' : 'Overview',
      items: [
        { icon: LayoutDashboard, label: t('dashboard'), href: '/admin' },
        { icon: BarChart3, label: t('analytics'), href: '/admin/analytics' },
      ]
    },
    {
      label: isAr ? 'الإدارة' : 'Management',
      items: [
        { icon: Users, label: isAr ? 'المستخدمون' : 'Users', href: '/admin/users' },
        { icon: Store, label: isAr ? 'المتاجر' : 'Stores', href: '/admin/stores' },
        { icon: Car, label: isAr ? 'السائقون' : 'Drivers', href: '/admin/drivers' },
        { icon: Package, label: isAr ? 'الطلبات' : 'Orders', href: '/admin/orders' },
        { icon: Tag, label: isAr ? 'الأقسام' : 'Categories', href: '/admin/categories' },
        { icon: CheckSquare, label: isAr ? 'الموافقات' : 'Approvals', href: '/admin/approvals', badge: pendingCount || null },
      ]
    },
    {
      label: isAr ? 'الخدمات' : 'Services',
      items: [
        { icon: Navigation, label: isAr ? 'التاكسي' : 'Taxi / Rides', href: '/admin/taxi' },
        { icon: Map, label: isAr ? 'الخريطة المباشرة' : 'Live Map', href: '/admin/map' },
      ]
    },
    {
      label: isAr ? 'المالية' : 'Finance',
      items: [
        { icon: DollarSign, label: isAr ? 'المالية' : 'Financial', href: '/admin/financial' },
        { icon: Wallet, label: isAr ? 'المحافظ' : 'Wallets', href: '/admin/wallets' },
      ]
    },
    {
      label: isAr ? 'النظام' : 'System',
      items: [
        { icon: Settings, label: isAr ? 'الإعدادات' : 'Settings', href: '/admin/settings' },
      ]
    }
  ]

  return (
    <div className="flex h-screen bg-[#F0F9F8] overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-16'} bg-[#0D1B4B] flex flex-col flex-shrink-0 overflow-hidden transition-all duration-200`}>
        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10 flex-shrink-0">
          <YutaLogo size={30} variant="icon" />
          {sidebarOpen && (
            <div>
              <p className="text-[#00C9A7] font-black text-sm tracking-widest">يوتا YUTA</p>
              <p className="text-white/40 text-[10px]">{t('adminPanel')}</p>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-3">
          {navGroups.map(group => (
            <div key={group.label} className="mb-3">
              {sidebarOpen && (
                <p className="text-white/30 text-[9px] font-black uppercase tracking-wider px-4 mb-1">{group.label}</p>
              )}
              {group.items.map(item => {
                const isActive = location.pathname === item.href ||
                  (item.href !== '/admin' && location.pathname.startsWith(item.href))
                return (
                  <Link key={item.href} to={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 mx-2 rounded-xl mb-0.5 transition-all ${
                      isActive ? 'bg-[#00C9A7] text-[#0D1B4B]' : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}>
                    <item.icon size={16} className="flex-shrink-0" />
                    {sidebarOpen && <span className="text-sm font-bold flex-1">{item.label}</span>}
                    {item.badge && (
                      <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-[#0D1B4B] text-[#00C9A7]' : 'bg-[#E74C3C] text-white'}`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3 flex-shrink-0">
          {sidebarOpen && (
            <div className="flex items-center gap-2 mb-3 px-2">
              <div className="w-7 h-7 bg-[#00C9A7] rounded-full flex items-center justify-center flex-shrink-0">
                <Shield size={12} className="text-[#0D1B4B]" />
              </div>
              <div className="min-w-0">
                <p className="text-white text-xs font-black truncate">{currentUser?.nameAr || t('superAdmin')}</p>
                <p className="text-white/40 text-[9px] truncate">{currentUser?.email || 'admin@yuta.ae'}</p>
              </div>
            </div>
          )}
          <button onClick={handleLogout} className="flex items-center gap-2 text-white/50 hover:text-white text-xs px-2 py-1 font-semibold w-full">
            <LogOut size={14} />
            {sidebarOpen && t('signOut')}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="bg-white border-b border-[#D0EDEA] px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-[#F0F9F8] text-[#666]">
            <Menu size={17} />
          </button>
          <div className="flex items-center bg-[#F0F9F8] rounded-xl px-3 py-2 gap-2 flex-1 max-w-sm">
            <Search size={14} className="text-[#999]" />
            <input placeholder={isAr ? 'بحث...' : 'Search...'} className="flex-1 outline-none text-sm bg-transparent text-[#222] font-medium" dir={isAr ? 'rtl' : 'ltr'} />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <LangToggle className="border-[#D0EDEA]" />
            <Link to="/admin/approvals" className="relative p-2 rounded-lg hover:bg-[#F0F9F8] text-[#666]">
              <Bell size={17} />
              {pendingCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#E74C3C] rounded-full text-[9px] text-white font-black flex items-center justify-center">{pendingCount}</span>
              )}
            </Link>
            <div className="w-8 h-8 bg-[#0D1B4B] rounded-full flex items-center justify-center">
              <Shield size={13} className="text-[#00C9A7]" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
