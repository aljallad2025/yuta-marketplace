import { User, MapPin, CreditCard, Wallet, Package, Car, Bell, Settings, ChevronRight, Shield, LogOut, Star } from 'lucide-react'

const menuItems = [
  { icon: MapPin, label: 'Saved Addresses', color: '#0F2A47' },
  { icon: CreditCard, label: 'Payment Methods', color: '#C8A951' },
  { icon: Wallet, label: 'My Wallet', color: '#2ECC71' },
  { icon: Package, label: 'Order History', color: '#3498DB' },
  { icon: Car, label: 'Ride History', color: '#9B59B6' },
  { icon: Bell, label: 'Notifications', color: '#E74C3C' },
  { icon: Settings, label: 'Settings', color: '#666' },
]

export default function MobileAccount() {
  return (
    <div className="bg-[#F8F6F1]">
      {/* Profile */}
      <div className="bg-[#0F2A47] px-4 pt-2 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#C8A951] rounded-full flex items-center justify-center shadow-lg">
            <User size={20} className="text-[#0F2A47]" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-white text-sm">Ahmed Al Mansouri</p>
            <p className="text-white/50 text-[10px]">ahmed.mansouri@email.com</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Star size={10} className="fill-[#C8A951] text-[#C8A951]" />
              <span className="text-[#C8A951] text-[10px] font-medium">Gold Member</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[['14', 'Orders'], ['8', 'Rides'], ['2,450', 'Points']].map(([val, label]) => (
            <div key={label} className="bg-white/10 rounded-xl py-2 text-center">
              <p className="text-white font-bold text-sm">{val}</p>
              <p className="text-white/50 text-[9px]">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Wallet */}
      <div className="px-3 mt-3">
        <div className="bg-gradient-to-r from-[#0F2A47] to-[#1a3a5c] rounded-2xl p-4 flex items-center gap-3">
          <Wallet size={24} className="text-[#C8A951]" />
          <div className="flex-1">
            <p className="text-white/60 text-[10px]">Wallet Balance</p>
            <p className="text-white font-bold text-lg">150.00 AED</p>
          </div>
          <button className="px-3 py-1.5 bg-[#C8A951] text-[#0F2A47] text-xs font-bold rounded-xl">Top Up</button>
        </div>
      </div>

      {/* Menu */}
      <div className="px-3 mt-3">
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8E6E1] overflow-hidden">
          {menuItems.map((item, i) => (
            <button key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-[#F8F6F1] ${
                i < menuItems.length - 1 ? 'border-b border-[#F0EEE9]' : ''
              }`}>
              <div className="p-2 rounded-lg" style={{ backgroundColor: item.color + '15' }}>
                <item.icon size={15} style={{ color: item.color }} />
              </div>
              <span className="flex-1 text-xs font-medium text-[#222] text-left">{item.label}</span>
              <ChevronRight size={13} className="text-[#C8A951]" />
            </button>
          ))}
        </div>
      </div>

      <div className="px-3 mt-3 pb-4">
        <button className="w-full flex items-center gap-2 justify-center py-3 text-red-600 bg-white rounded-xl border border-red-100 text-xs font-medium">
          <LogOut size={13} /> Sign Out
        </button>
      </div>
    </div>
  )
}
