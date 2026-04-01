import { useState } from 'react'
import Badge from '../../components/Badge'
import { Clock, Star } from 'lucide-react'

const orders = [
  { id: 'SUW-2841', store: 'Baharat Restaurant', status: 'on_the_way', total: 254, date: 'Today', eta: '12 min', emoji: '🍽️' },
  { id: 'SUW-2810', store: 'Al Shifa Pharmacy', status: 'completed', total: 48, date: 'Yesterday', emoji: '💊' },
  { id: 'SUW-2789', store: 'Fresh Mart', status: 'completed', total: 187, date: 'Mar 28', emoji: '🛒' },
  { id: 'SUW-2760', store: 'Burgetino', status: 'cancelled', total: 96, date: 'Mar 25', emoji: '🍔' },
]

const tabs = ['All', 'Active', 'Done']

export default function MobileOrders() {
  const [tab, setTab] = useState('All')

  const filtered = orders.filter(o => {
    if (tab === 'Active') return ['on_the_way', 'preparing', 'pending'].includes(o.status)
    if (tab === 'Done') return ['completed', 'cancelled'].includes(o.status)
    return true
  })

  return (
    <div className="bg-[#F8F6F1]">
      <div className="bg-[#0F2A47] px-4 pt-2 pb-4">
        <h2 className="text-white font-bold text-base mb-3">My Orders</h2>
        <div className="flex gap-1 bg-white/10 rounded-xl p-1">
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                tab === t ? 'bg-white text-[#0F2A47]' : 'text-white/70'
              }`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="p-3 space-y-2.5">
        {filtered.map(order => (
          <div key={order.id} className="bg-white rounded-2xl p-3 shadow-sm border border-[#E8E6E1]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#F8F6F1] rounded-xl flex items-center justify-center text-xl">
                {order.emoji}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-[#222] text-xs">{order.store}</p>
                  <Badge status={order.status} className="text-[9px]" />
                </div>
                <p className="text-[10px] text-[#666] mt-0.5">{order.id} · {order.date}</p>
              </div>
            </div>

            {order.status === 'on_the_way' && (
              <div className="mt-3 bg-emerald-50 rounded-xl p-2.5 flex items-center gap-2">
                <Clock size={12} className="text-emerald-600" />
                <p className="text-xs text-emerald-700 font-medium">Arriving in ~{order.eta}</p>
              </div>
            )}

            <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#F0EEE9]">
              <p className="font-bold text-[#0F2A47] text-sm">{order.total} AED</p>
              {order.status === 'completed' ? (
                <div className="flex gap-1.5">
                  <button className="px-2.5 py-1.5 bg-[#0F2A47] text-white text-[10px] rounded-lg font-medium">Reorder</button>
                  <button className="px-2.5 py-1.5 bg-[#F8F6F1] text-[#444] text-[10px] rounded-lg border border-[#E8E6E1]">Rate</button>
                </div>
              ) : order.status === 'on_the_way' ? (
                <button className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 text-[10px] rounded-lg border border-emerald-200 font-medium">Track</button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
