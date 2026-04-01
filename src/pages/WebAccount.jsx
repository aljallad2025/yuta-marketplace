import { Link } from 'react-router-dom'
import { User, MapPin, CreditCard, Wallet, Package, Car, Bell, Settings, ChevronRight, Star, Shield, LogOut } from 'lucide-react'

const menuItems = [
  { icon: MapPin, label: 'Saved Addresses', desc: '3 addresses saved', color: '#0F2A47', href: '#' },
  { icon: CreditCard, label: 'Payment Methods', desc: 'Visa **** 4892', color: '#C8A951', href: '#' },
  { icon: Wallet, label: 'My Wallet', desc: 'Balance: 150.00 AED', color: '#2ECC71', href: '#' },
  { icon: Package, label: 'Order History', desc: '14 orders placed', color: '#3498DB', href: '/web/orders' },
  { icon: Car, label: 'Ride History', desc: '8 rides taken', color: '#9B59B6', href: '#' },
  { icon: Bell, label: 'Notifications', desc: 'All notifications on', color: '#E74C3C', href: '#' },
  { icon: Settings, label: 'Settings', desc: 'App preferences', color: '#666', href: '#' },
]

export default function WebAccount() {
  return (
    <div className="min-h-screen bg-[#F8F6F1]">
      {/* Profile header */}
      <div className="bg-[#0F2A47] px-4 pb-8 pt-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#C8A951] rounded-full flex items-center justify-center shadow-lg">
              <User size={28} className="text-[#0F2A47]" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white">Ahmed Al Mansouri</h1>
              <p className="text-white/60 text-sm">ahmed.mansouri@email.com</p>
              <div className="flex items-center gap-2 mt-1">
                <Star size={12} className="fill-[#C8A951] text-[#C8A951]" />
                <span className="text-[#C8A951] text-xs font-medium">Gold Member</span>
                <span className="text-white/40 text-xs">· Member since Jan 2024</span>
              </div>
            </div>
            <button className="p-2 bg-white/10 rounded-xl hover:bg-white/20">
              <Settings size={16} className="text-white" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              { label: 'Orders', value: '14' },
              { label: 'Rides', value: '8' },
              { label: 'Saved', value: '3' },
            ].map(s => (
              <div key={s.label} className="bg-white/10 rounded-xl py-3 text-center">
                <p className="text-xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-white/60">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Wallet Card */}
        <div className="bg-gradient-to-r from-[#0F2A47] to-[#1a3a5c] rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">SUMU Wallet Balance</p>
              <p className="text-3xl font-bold mt-1">150.00 <span className="text-lg font-normal text-white/70">AED</span></p>
            </div>
            <div className="p-4 bg-[#C8A951]/20 rounded-xl">
              <Wallet size={28} className="text-[#C8A951]" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="flex-1 py-2.5 bg-[#C8A951] text-[#0F2A47] font-semibold text-sm rounded-xl">Top Up</button>
            <button className="flex-1 py-2.5 bg-white/10 text-white font-semibold text-sm rounded-xl border border-white/20">Transfer</button>
          </div>
        </div>

        {/* Menu items */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8E6E1] overflow-hidden">
          {menuItems.map((item, i) => (
            <Link key={item.label} to={item.href}
              className={`flex items-center gap-4 px-4 py-4 hover:bg-[#F8F6F1] transition-colors ${
                i < menuItems.length - 1 ? 'border-b border-[#F0EEE9]' : ''
              }`}>
              <div className="p-2.5 rounded-xl" style={{ backgroundColor: item.color + '15' }}>
                <item.icon size={18} style={{ color: item.color }} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-[#222] text-sm">{item.label}</p>
                <p className="text-xs text-[#666]">{item.desc}</p>
              </div>
              <ChevronRight size={16} className="text-[#C8A951]" />
            </Link>
          ))}
        </div>

        {/* Loyalty points */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8E6E1]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Shield size={18} className="text-[#C8A951]" />
              <p className="font-semibold text-[#0F2A47]">Loyalty Points</p>
            </div>
            <span className="text-sm font-bold text-[#C8A951]">2,450 pts</span>
          </div>
          <div className="w-full bg-[#E8E6E1] rounded-full h-2">
            <div className="bg-[#C8A951] h-2 rounded-full" style={{ width: '65%' }}></div>
          </div>
          <p className="text-xs text-[#666] mt-2">1,300 more points to reach Platinum</p>
        </div>

        <button className="w-full flex items-center gap-2 justify-center py-3.5 text-red-600 bg-white rounded-xl border border-red-100 hover:bg-red-50 font-medium text-sm">
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  )
}
