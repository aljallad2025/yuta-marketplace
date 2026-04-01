import { useState } from 'react'
import { Search, MapPin, Car, Star, DollarSign, X, CheckCircle } from 'lucide-react'
import Badge from '../../components/Badge'

const rides = [
  { id: 'RID-441', customer: 'Ahmed M.', driver: 'Hassan M.', from: 'Dubai Mall', to: 'Dubai Airport T3', type: 'Economy', fare: 42, status: 'completed', date: 'Today, 9:15 AM', rating: 5 },
  { id: 'RID-440', customer: 'Fatima K.', driver: 'Yusuf K.', from: 'JBR Beach', to: 'Mall of Emirates', type: 'Comfort', fare: 28, status: 'on_the_way', date: 'Today, 1:30 PM', rating: null },
  { id: 'RID-439', customer: 'Omar S.', driver: null, from: 'Business Bay', to: 'Palm Jumeirah', type: 'Premium', fare: 55, status: 'pending', date: 'Today, 1:45 PM', rating: null },
  { id: 'RID-438', customer: 'Layla A.', driver: 'Mohammed A.', from: 'Downtown', to: 'Sharjah', type: 'XL', fare: 88, status: 'completed', date: 'Yesterday, 7:30 PM', rating: 4 },
  { id: 'RID-437', customer: 'Khalid R.', driver: null, from: 'Burj Khalifa', to: 'Marina Walk', type: 'Economy', fare: 22, status: 'cancelled', date: 'Yesterday, 3:00 PM', rating: null },
]

export default function AdminTaxi() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = rides.filter(r => {
    const matchSearch = r.id.toLowerCase().includes(search.toLowerCase()) || r.customer.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || r.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F2A47]">Taxi & Ride Management</h1>
          <p className="text-sm text-[#666]">38 active rides right now</p>
        </div>
        <button className="px-4 py-2.5 bg-[#C8A951] text-[#0F2A47] text-sm font-bold rounded-xl">Export Report</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Active Rides', count: 38, color: '#3498DB' },
          { label: 'Completed Today', count: 142, color: '#2ECC71' },
          { label: 'Pending Assignment', count: 7, color: '#F39C12' },
          { label: 'Cancelled Today', count: 12, color: '#E74C3C' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-[#E8E6E1] text-center">
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.count}</p>
            <p className="text-xs text-[#666] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="flex-1 flex items-center bg-white rounded-xl px-4 py-2.5 gap-2 shadow-sm border border-[#E8E6E1]">
          <Search size={16} className="text-[#999]" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by ride ID or customer..."
            className="flex-1 outline-none text-sm bg-transparent text-[#222]" />
        </div>
        {['all', 'pending', 'on_the_way', 'completed', 'cancelled'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3 py-2.5 rounded-xl text-xs font-medium capitalize whitespace-nowrap ${
              statusFilter === s ? 'bg-[#0F2A47] text-white' : 'bg-white text-[#444] border border-[#E8E6E1]'
            }`}>
            {s === 'on_the_way' ? 'Active' : s}
          </button>
        ))}
      </div>

      {/* Rides table */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8E6E1] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8F6F1] border-b border-[#E8E6E1]">
                {['Ride ID', 'Customer', 'Route', 'Driver', 'Type', 'Fare', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3.5 text-xs font-semibold text-[#666] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((ride, i) => (
                <tr key={ride.id} className={`${i < filtered.length - 1 ? 'border-b border-[#F0EEE9]' : ''} hover:bg-[#F8F6F1]`}>
                  <td className="px-4 py-3.5 font-mono text-xs text-[#0F2A47] font-semibold">{ride.id}</td>
                  <td className="px-4 py-3.5 text-sm text-[#444]">{ride.customer}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1 text-xs text-[#666]">
                      <MapPin size={10} className="text-emerald-500 flex-shrink-0" />
                      <span className="truncate max-w-24">{ride.from}</span>
                      <span>→</span>
                      <MapPin size={10} className="text-red-500 flex-shrink-0" />
                      <span className="truncate max-w-24">{ride.to}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm">
                    {ride.driver ? (
                      <span className="text-[#444]">{ride.driver}</span>
                    ) : (
                      <button className="text-xs text-[#C8A951] border border-[#C8A951]/30 px-2 py-0.5 rounded-full">Assign</button>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs bg-[#0F2A47]/10 text-[#0F2A47] px-2 py-0.5 rounded-full font-medium">{ride.type}</span>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-sm text-[#222]">{ride.fare} AED</td>
                  <td className="px-4 py-3.5"><Badge status={ride.status} /></td>
                  <td className="px-4 py-3.5 text-xs text-[#666] whitespace-nowrap">{ride.date}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 hover:bg-[#F8F6F1] rounded-lg text-[#666] hover:text-[#0F2A47]"><Car size={13} /></button>
                      {ride.status !== 'completed' && ride.status !== 'cancelled' && (
                        <button className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"><X size={13} /></button>
                      )}
                      {ride.status === 'completed' && ride.rating && (
                        <div className="flex items-center gap-0.5 text-xs">
                          <Star size={11} className="fill-[#C8A951] text-[#C8A951]" />
                          <span className="text-[#666]">{ride.rating}</span>
                        </div>
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
