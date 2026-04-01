import { useState } from 'react'
import { Search, UserCheck, UserX, Eye, MapPin, Star, Package } from 'lucide-react'
import Badge from '../../components/Badge'

const drivers = [
  { id: 'DRV-001', name: 'Mohammed Al Ameri', phone: '+971 50 111 2222', vehicle: 'Toyota Corolla · DXB 1234', status: 'delivering', rating: 4.9, trips: 284, earnings: 12400, location: 'Dubai Marina', approved: true },
  { id: 'DRV-002', name: 'Yusuf Al Kaabi', phone: '+971 55 222 3333', vehicle: 'Honda Civic · SHJ 5678', status: 'available', rating: 4.7, trips: 156, earnings: 7800, location: 'Downtown Dubai', approved: true },
  { id: 'DRV-003', name: 'Ibrahim Saeed', phone: '+971 52 333 4444', vehicle: 'Nissan Altima · ABD 9012', status: 'delivering', rating: 4.8, trips: 312, earnings: 15600, location: 'JBR Beach', approved: true },
  { id: 'DRV-004', name: 'Hassan Al Mulla', phone: '+971 56 444 5555', vehicle: 'Toyota Camry · DXB 3421', status: 'on_ride', rating: 4.9, trips: 421, earnings: 19200, location: 'Business Bay', approved: true },
  { id: 'DRV-005', name: 'Ali Rashid', phone: '+971 50 555 6666', vehicle: 'Hyundai Sonata · SHJ 7890', status: 'inactive', rating: 4.5, trips: 89, earnings: 4200, location: 'Sharjah', approved: false },
]

export default function AdminDrivers() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = drivers.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' ||
      (filter === 'active' && ['delivering', 'available', 'on_ride'].includes(d.status)) ||
      (filter === 'pending' && !d.approved) ||
      (filter === 'inactive' && d.status === 'inactive')
    return matchSearch && matchFilter
  })

  const getStatusLabel = (status) => {
    if (status === 'delivering') return 'Delivering'
    if (status === 'on_ride') return 'On Ride'
    if (status === 'available') return 'Available'
    return status
  }

  const getStatusBadge = (status) => {
    if (status === 'delivering') return 'on_the_way'
    if (status === 'on_ride') return 'accepted'
    if (status === 'available') return 'active'
    return 'inactive'
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F2A47]">Driver Management</h1>
          <p className="text-sm text-[#666]">142 active drivers on platform</p>
        </div>
        <button className="px-4 py-2.5 bg-[#0F2A47] text-white text-sm font-semibold rounded-xl">+ Add Driver</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Online', count: 38, color: '#2ECC71' },
          { label: 'Delivering', count: 24, color: '#3498DB' },
          { label: 'On Ride', count: 12, color: '#9B59B6' },
          { label: 'Pending Approval', count: 5, color: '#F39C12' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-[#E8E6E1] text-center">
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.count}</p>
            <p className="text-xs text-[#666] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <div className="flex-1 flex items-center bg-white rounded-xl px-4 py-2.5 gap-2 shadow-sm border border-[#E8E6E1]">
          <Search size={16} className="text-[#999]" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search drivers..."
            className="flex-1 outline-none text-sm bg-transparent text-[#222]" />
        </div>
        {['all', 'active', 'pending', 'inactive'].map(f => (
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
                {['Driver', 'Vehicle', 'Status', 'Rating', 'Trips', 'Earnings', 'Location', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3.5 text-xs font-semibold text-[#666] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((driver, i) => (
                <tr key={driver.id} className={`${i < filtered.length - 1 ? 'border-b border-[#F0EEE9]' : ''} hover:bg-[#F8F6F1]`}>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#0F2A47] rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {driver.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-[#222]">{driver.name}</p>
                        <p className="text-xs text-[#999]">{driver.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-xs text-[#666]">{driver.vehicle}</td>
                  <td className="px-4 py-4"><Badge status={getStatusBadge(driver.status)} label={getStatusLabel(driver.status)} /></td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <Star size={12} className="fill-[#C8A951] text-[#C8A951]" />
                      <span className="text-sm font-semibold text-[#222]">{driver.rating}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-[#222]">{driver.trips}</td>
                  <td className="px-4 py-4 text-sm text-[#0F2A47] font-semibold">{driver.earnings.toLocaleString()} AED</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 text-xs text-[#666]">
                      <MapPin size={11} className="text-[#C8A951]" /> {driver.location}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 hover:bg-[#F8F6F1] rounded-lg text-[#666] hover:text-[#0F2A47]"><Eye size={13} /></button>
                      {!driver.approved ? (
                        <button className="p-1.5 hover:bg-green-50 rounded-lg text-green-600"><UserCheck size={13} /></button>
                      ) : (
                        <button className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"><UserX size={13} /></button>
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
