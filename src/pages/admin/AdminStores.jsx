import { useState } from 'react'
import { Search, CheckCircle, XCircle, Eye, Edit2, Star } from 'lucide-react'
import Badge from '../../components/Badge'

const stores = [
  { id: 'STR-001', name: 'Baharat Restaurant', category: 'Restaurants', owner: 'Khalid Al Nasser', status: 'active', rating: 4.9, orders: 1240, commission: 12, revenue: 48600, joined: 'Jan 2024' },
  { id: 'STR-002', name: 'Fresh Mart', category: 'Supermarket', owner: 'Ahmed Saeed', status: 'active', rating: 4.7, orders: 890, commission: 10, revenue: 38200, joined: 'Feb 2024' },
  { id: 'STR-003', name: 'Al Shifa Pharmacy', category: 'Pharmacy', owner: 'Dr. Fatima Hassan', status: 'active', rating: 4.9, orders: 640, commission: 8, revenue: 22800, joined: 'Jan 2024' },
  { id: 'STR-004', name: 'Glamour Beauty', category: 'Beauty', owner: 'Sara Mohammed', status: 'active', rating: 4.6, orders: 320, commission: 15, revenue: 18400, joined: 'Mar 2024' },
  { id: 'STR-005', name: 'TechZone Electronics', category: 'Electronics', owner: 'Omar Al Rashidi', status: 'inactive', rating: 4.5, orders: 145, commission: 8, revenue: 28900, joined: 'Mar 2024' },
  { id: 'STR-006', name: 'Desert Sweets', category: 'Restaurants', owner: 'Ibrahim Yusuf', status: 'pending', rating: 0, orders: 0, commission: 12, revenue: 0, joined: 'Apr 2024' },
]

export default function AdminStores() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = stores.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || s.status === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F2A47]">Store Management</h1>
          <p className="text-sm text-[#666]">284 active stores on platform</p>
        </div>
        <button className="px-4 py-2.5 bg-[#0F2A47] text-white text-sm font-semibold rounded-xl">+ Add Store</button>
      </div>

      <div className="flex gap-3">
        <div className="flex-1 flex items-center bg-white rounded-xl px-4 py-2.5 gap-2 shadow-sm border border-[#E8E6E1]">
          <Search size={16} className="text-[#999]" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search stores..."
            className="flex-1 outline-none text-sm bg-transparent text-[#222]" />
        </div>
        {['all', 'active', 'inactive', 'pending'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium capitalize ${
              filter === f ? 'bg-[#0F2A47] text-white' : 'bg-white text-[#444] border border-[#E8E6E1]'
            }`}>{f}</button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#E8E6E1] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8F6F1] border-b border-[#E8E6E1]">
                {['Store', 'Category', 'Owner', 'Status', 'Rating', 'Orders', 'Commission', 'Revenue', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3.5 text-xs font-semibold text-[#666] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((store, i) => (
                <tr key={store.id} className={`${i < filtered.length - 1 ? 'border-b border-[#F0EEE9]' : ''} hover:bg-[#F8F6F1]`}>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#C8A951]/20 rounded-xl flex items-center justify-center text-lg">
                        {store.category === 'Restaurants' ? '🍽️' : store.category === 'Supermarket' ? '🛒' : store.category === 'Pharmacy' ? '💊' : store.category === 'Beauty' ? '💄' : '📱'}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-[#222]">{store.name}</p>
                        <p className="text-xs text-[#999] font-mono">{store.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-xs text-[#666]">{store.category}</td>
                  <td className="px-4 py-4 text-sm text-[#444]">{store.owner}</td>
                  <td className="px-4 py-4"><Badge status={store.status} /></td>
                  <td className="px-4 py-4">
                    {store.rating > 0 ? (
                      <div className="flex items-center gap-1">
                        <Star size={12} className="fill-[#C8A951] text-[#C8A951]" />
                        <span className="text-sm font-semibold text-[#222]">{store.rating}</span>
                      </div>
                    ) : <span className="text-xs text-[#999]">New</span>}
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-[#222]">{store.orders.toLocaleString()}</td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-semibold text-[#C8A951]">{store.commission}%</span>
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-[#0F2A47]">{store.revenue.toLocaleString()} AED</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 hover:bg-[#F8F6F1] rounded-lg text-[#666] hover:text-[#0F2A47]"><Eye size={13} /></button>
                      <button className="p-1.5 hover:bg-[#F8F6F1] rounded-lg text-[#666] hover:text-[#0F2A47]"><Edit2 size={13} /></button>
                      {store.status === 'pending' && (
                        <>
                          <button className="p-1.5 hover:bg-green-50 rounded-lg text-green-600"><CheckCircle size={13} /></button>
                          <button className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"><XCircle size={13} /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
