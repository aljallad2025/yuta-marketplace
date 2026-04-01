import { useState } from 'react'
import { Search, Filter, MoreVertical, UserCheck, UserX, Edit2, Eye } from 'lucide-react'
import Badge from '../../components/Badge'

const users = [
  { id: 'USR-001', name: 'Ahmed Al Mansouri', email: 'ahmed@email.com', phone: '+971 50 123 4567', status: 'active', orders: 14, joined: 'Jan 12, 2024', wallet: 150 },
  { id: 'USR-002', name: 'Fatima Al Rashidi', email: 'fatima@email.com', phone: '+971 55 234 5678', status: 'active', orders: 8, joined: 'Feb 3, 2024', wallet: 0 },
  { id: 'USR-003', name: 'Omar Khalid', email: 'omar@email.com', phone: '+971 52 345 6789', status: 'suspended', orders: 2, joined: 'Mar 15, 2024', wallet: 75 },
  { id: 'USR-004', name: 'Layla Hassan', email: 'layla@email.com', phone: '+971 56 456 7890', status: 'active', orders: 22, joined: 'Nov 20, 2023', wallet: 320 },
  { id: 'USR-005', name: 'Khalid Ibrahim', email: 'khalid@email.com', phone: '+971 50 567 8901', status: 'active', orders: 5, joined: 'Mar 28, 2024', wallet: 0 },
  { id: 'USR-006', name: 'Sara Mohammed', email: 'sara@email.com', phone: '+971 55 678 9012', status: 'inactive', orders: 0, joined: 'Mar 30, 2024', wallet: 0 },
]

export default function AdminUsers() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || u.status === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F2A47]">User Management</h1>
          <p className="text-sm text-[#666]">{users.length} total users registered</p>
        </div>
        <button className="px-4 py-2.5 bg-[#0F2A47] text-white text-sm font-semibold rounded-xl">+ Invite User</button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center bg-white rounded-xl px-4 py-2.5 gap-2 shadow-sm border border-[#E8E6E1]">
          <Search size={16} className="text-[#999]" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search users by name or email..."
            className="flex-1 outline-none text-sm bg-transparent text-[#222]" />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'suspended', 'inactive'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${
                filter === f ? 'bg-[#0F2A47] text-white' : 'bg-white text-[#444] border border-[#E8E6E1]'
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8E6E1] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8F6F1] border-b border-[#E8E6E1]">
                {['User', 'Contact', 'Status', 'Orders', 'Wallet', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-[#666] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => (
                <tr key={user.id} className={`${i < filtered.length - 1 ? 'border-b border-[#F0EEE9]' : ''} hover:bg-[#F8F6F1] transition-colors`}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#0F2A47] rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-[#222] text-sm">{user.name}</p>
                        <p className="text-xs text-[#999] font-mono">{user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-[#444]">{user.email}</p>
                    <p className="text-xs text-[#666]">{user.phone}</p>
                  </td>
                  <td className="px-5 py-4"><Badge status={user.status} /></td>
                  <td className="px-5 py-4 text-sm font-semibold text-[#222]">{user.orders}</td>
                  <td className="px-5 py-4 text-sm text-[#444]">{user.wallet > 0 ? `${user.wallet} AED` : '—'}</td>
                  <td className="px-5 py-4 text-xs text-[#666]">{user.joined}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 hover:bg-[#F8F6F1] rounded-lg text-[#666] hover:text-[#0F2A47]"><Eye size={14} /></button>
                      <button className="p-1.5 hover:bg-[#F8F6F1] rounded-lg text-[#666] hover:text-[#0F2A47]"><Edit2 size={14} /></button>
                      {user.status === 'active' ? (
                        <button className="p-1.5 hover:bg-red-50 rounded-lg text-[#666] hover:text-red-600"><UserX size={14} /></button>
                      ) : (
                        <button className="p-1.5 hover:bg-green-50 rounded-lg text-[#666] hover:text-green-600"><UserCheck size={14} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-[#F0EEE9] flex items-center justify-between text-xs text-[#666]">
          <span>Showing {filtered.length} of {users.length} users</span>
          <div className="flex gap-1">
            {[1, 2, 3].map(p => (
              <button key={p} className={`w-7 h-7 rounded-lg ${p === 1 ? 'bg-[#0F2A47] text-white' : 'hover:bg-[#F8F6F1] text-[#666]'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
