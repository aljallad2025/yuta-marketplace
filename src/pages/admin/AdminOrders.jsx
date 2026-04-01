import { useState } from 'react'
import { Search, Eye, Edit2, X, Check, RefreshCw } from 'lucide-react'
import Badge from '../../components/Badge'

const allOrders = [
  { id: 'SUW-2841', customer: 'Ahmed Al Mansouri', store: 'Baharat Restaurant', driver: 'Mohammed A.', items: 3, total: 254, status: 'on_the_way', date: 'Apr 1, 12:45 PM', address: 'Villa 12, Al Wasl Rd' },
  { id: 'SUW-2840', customer: 'Fatima Al Rashidi', store: 'Fresh Mart', driver: 'Ibrahim S.', items: 12, total: 187, status: 'preparing', date: 'Apr 1, 12:30 PM', address: 'Apt 5B, JBR' },
  { id: 'SUW-2839', customer: 'Omar Khalid', store: 'Al Shifa Pharmacy', driver: 'Yusuf K.', items: 2, total: 48, status: 'completed', date: 'Apr 1, 11:20 AM', address: 'Villa 7, Jumeirah' },
  { id: 'SUW-2838', customer: 'Layla Hassan', store: 'Burgetino', driver: null, items: 4, total: 96, status: 'pending', date: 'Apr 1, 1:00 PM', address: 'Tower 3, Downtown' },
  { id: 'SUW-2837', customer: 'Khalid Ibrahim', store: 'TechZone Electronics', driver: null, items: 1, total: 420, status: 'accepted', date: 'Apr 1, 12:55 PM', address: 'Office 202, DIFC' },
  { id: 'SUW-2836', customer: 'Sara Mohammed', store: 'Baharat Restaurant', driver: null, items: 2, total: 115, status: 'cancelled', date: 'Apr 1, 10:00 AM', address: 'Marina Walk' },
]

const statusOptions = ['all', 'pending', 'accepted', 'preparing', 'on_the_way', 'completed', 'cancelled']

export default function AdminOrders() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [selected, setSelected] = useState(null)

  const filtered = allOrders.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
                        o.customer.toLowerCase().includes(search.toLowerCase())
    const matchStatus = status === 'all' || o.status === status
    return matchSearch && matchStatus
  })

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F2A47]">Order Management</h1>
          <p className="text-sm text-[#666]">346 orders today</p>
        </div>
        <button className="px-4 py-2.5 bg-[#C8A951] text-[#0F2A47] text-sm font-bold rounded-xl">Export CSV</button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Pending', count: 8, color: '#F39C12' },
          { label: 'Active', count: 24, color: '#3498DB' },
          { label: 'Completed', count: 298, color: '#2ECC71' },
          { label: 'Cancelled', count: 16, color: '#E74C3C' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-[#E8E6E1] text-center">
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.count}</p>
            <p className="text-xs text-[#666] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center bg-white rounded-xl px-4 py-2.5 gap-2 shadow-sm border border-[#E8E6E1]">
          <Search size={16} className="text-[#999]" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by order ID or customer..."
            className="flex-1 outline-none text-sm bg-transparent text-[#222]" />
        </div>
        <div className="flex gap-1 overflow-x-auto">
          {statusOptions.map(s => (
            <button key={s} onClick={() => setStatus(s)}
              className={`px-3 py-2.5 rounded-xl text-xs font-medium capitalize whitespace-nowrap transition-all ${
                status === s ? 'bg-[#0F2A47] text-white' : 'bg-white text-[#444] border border-[#E8E6E1]'
              }`}>
              {s === 'on_the_way' ? 'On the way' : s}
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
                {['Order', 'Customer', 'Store', 'Driver', 'Total', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3.5 text-xs font-semibold text-[#666] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((order, i) => (
                <tr key={order.id} className={`${i < filtered.length - 1 ? 'border-b border-[#F0EEE9]' : ''} hover:bg-[#F8F6F1] cursor-pointer`}
                  onClick={() => setSelected(selected?.id === order.id ? null : order)}>
                  <td className="px-4 py-3.5">
                    <p className="font-mono font-semibold text-xs text-[#0F2A47]">{order.id}</p>
                    <p className="text-[10px] text-[#999]">{order.items} items</p>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-[#444]">{order.customer}</td>
                  <td className="px-4 py-3.5 text-sm text-[#666]">{order.store}</td>
                  <td className="px-4 py-3.5 text-sm">
                    {order.driver ? (
                      <span className="text-[#444]">{order.driver}</span>
                    ) : (
                      <button className="text-xs text-[#C8A951] font-medium border border-[#C8A951]/30 px-2 py-0.5 rounded-full hover:bg-[#C8A951]/10">Assign</button>
                    )}
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-sm text-[#222]">{order.total} AED</td>
                  <td className="px-4 py-3.5"><Badge status={order.status} /></td>
                  <td className="px-4 py-3.5 text-xs text-[#666] whitespace-nowrap">{order.date}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                      <button className="p-1.5 hover:bg-[#F8F6F1] rounded-lg text-[#666] hover:text-[#0F2A47]"><Eye size={13} /></button>
                      <button className="p-1.5 hover:bg-[#F8F6F1] rounded-lg text-[#666] hover:text-[#0F2A47]"><Edit2 size={13} /></button>
                      <button className="p-1.5 hover:bg-red-50 rounded-lg text-[#666] hover:text-red-600"><X size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order detail panel */}
        {selected && (
          <div className="border-t border-[#E8E6E1] bg-[#F8F6F1] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#0F2A47]">Order Details — {selected.id}</h3>
              <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-[#E8E6E1] rounded-lg">
                <X size={15} className="text-[#666]" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div><p className="text-xs text-[#666]">Customer</p><p className="font-medium text-sm text-[#222]">{selected.customer}</p></div>
              <div><p className="text-xs text-[#666]">Store</p><p className="font-medium text-sm text-[#222]">{selected.store}</p></div>
              <div><p className="text-xs text-[#666]">Address</p><p className="font-medium text-sm text-[#222]">{selected.address}</p></div>
              <div><p className="text-xs text-[#666]">Total</p><p className="font-bold text-sm text-[#0F2A47]">{selected.total} AED</p></div>
            </div>
            <div className="flex gap-2">
              {['Mark Preparing', 'Assign Driver', 'Cancel Order', 'Issue Refund'].map(action => (
                <button key={action} className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                  action.includes('Cancel') || action.includes('Refund')
                    ? 'border-red-200 text-red-600 hover:bg-red-50'
                    : 'border-[#E8E6E1] text-[#444] hover:bg-white hover:border-[#0F2A47]/20'
                }`}>
                  {action}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="px-5 py-3 border-t border-[#F0EEE9] flex items-center justify-between text-xs text-[#666]">
          <span>Showing {filtered.length} of {allOrders.length} orders</span>
          <div className="flex gap-1">
            {[1, 2, 3, '...', 18].map((p, i) => (
              <button key={i} className={`w-7 h-7 rounded-lg ${p === 1 ? 'bg-[#0F2A47] text-white' : 'hover:bg-[#F8F6F1] text-[#666]'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
