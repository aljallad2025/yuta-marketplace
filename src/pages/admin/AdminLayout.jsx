import { useState } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import {
  LayoutDashboard, Users, Store, Car, Package, Navigation, Map, DollarSign,
  Settings, Bell, Search, Menu, Wallet, BarChart3,
  LogOut, Shield
} from 'lucide-react'
import SumuLogo from '../../components/SumuLogo'

const navGroups = [
  {
    label: 'Overview',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
      { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
    ]
  },
  {
    label: 'Management',
    items: [
      { icon: Users, label: 'Users', href: '/admin/users' },
      { icon: Store, label: 'Stores', href: '/admin/stores' },
      { icon: Car, label: 'Drivers', href: '/admin/drivers' },
      { icon: Package, label: 'Orders', href: '/admin/orders' },
    ]
  },
  {
    label: 'Services',
    items: [
      { icon: Navigation, label: 'Taxi / Rides', href: '/admin/taxi' },
      { icon: Map, label: 'Live Map', href: '/admin/map' },
    ]
  },
  {
    label: 'Finance',
    items: [
      { icon: DollarSign, label: 'Financial', href: '/admin/financial' },
      { icon: Wallet, label: 'Wallets', href: '/admin/wallets' },
    ]
  },
  {
    label: 'System',
    items: [
      { icon: Settings, label: 'Settings', href: '/admin/settings' },
    ]
  }
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()

  return (
    <div className="flex h-screen bg-[#F8F6F1] overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-16'} bg-[#0F2A47] flex flex-col flex-shrink-0 overflow-hidden transition-all duration-200`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10 flex-shrink-0">
          <SumuLogo size={30} variant="icon" />
          {sidebarOpen && (
            <div>
              <p className="text-[#C8A951] font-bold text-sm tracking-widest">SUMU</p>
              <p className="text-white/40 text-[10px]">Admin Panel</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3">
          {navGroups.map(group => (
            <div key={group.label} className="mb-3">
              {sidebarOpen && (
                <p className="text-white/30 text-[9px] font-bold uppercase tracking-wider px-4 mb-1">{group.label}</p>
              )}
              {group.items.map(item => {
                const isActive = location.pathname === item.href ||
                  (item.href !== '/admin' && location.pathname.startsWith(item.href))
                return (
                  <Link key={item.href} to={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 mx-2 rounded-xl mb-0.5 transition-all ${
                      isActive ? 'bg-[#C8A951] text-[#0F2A47]' : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}>
                    <item.icon size={16} className="flex-shrink-0" />
                    {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/10 p-3 flex-shrink-0">
          {sidebarOpen && (
            <div className="flex items-center gap-2 mb-3 px-2">
              <div className="w-7 h-7 bg-[#C8A951] rounded-full flex items-center justify-center flex-shrink-0">
                <Shield size={12} className="text-[#0F2A47]" />
              </div>
              <div className="min-w-0">
                <p className="text-white text-xs font-medium truncate">Super Admin</p>
                <p className="text-white/40 text-[9px] truncate">admin@sumu.ae</p>
              </div>
            </div>
          )}
          <button className="flex items-center gap-2 text-white/50 hover:text-white text-xs px-2 py-1">
            <LogOut size={14} />
            {sidebarOpen && 'Sign out'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-[#E8E6E1] px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-[#F8F6F1] text-[#666]">
            <Menu size={17} />
          </button>
          <div className="flex items-center bg-[#F8F6F1] rounded-xl px-3 py-2 gap-2 flex-1 max-w-sm">
            <Search size={14} className="text-[#999]" />
            <input placeholder="Search..." className="flex-1 outline-none text-sm bg-transparent text-[#222]" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="relative p-2 rounded-lg hover:bg-[#F8F6F1] text-[#666]">
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#E74C3C] rounded-full"></span>
            </button>
            <div className="w-8 h-8 bg-[#0F2A47] rounded-full flex items-center justify-center">
              <Shield size={13} className="text-[#C8A951]" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
