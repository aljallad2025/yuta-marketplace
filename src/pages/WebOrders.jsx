import { useState } from 'react'
import { Clock, Package, ChevronRight, MapPin, Star, RotateCcw } from 'lucide-react'
import Badge from '../components/Badge'

const orders = [
  { id: 'SUW-2841', store: 'Baharat Restaurant', items: ['Mixed Grill Platter', 'Lamb Ouzi x2'], status: 'on_the_way', total: 254, date: 'Today, 12:45 PM', eta: '12 min', emoji: '🍽️' },
  { id: 'SUW-2810', store: 'Al Shifa Pharmacy', items: ['Panadol x2', 'Vitamin C'], status: 'completed', total: 48, date: 'Yesterday, 8:20 AM', emoji: '💊' },
  { id: 'SUW-2789', store: 'Fresh Mart', items: ['Groceries (12 items)'], status: 'completed', total: 187, date: 'Mar 28, 5:30 PM', emoji: '🛒' },
  { id: 'SUW-2760', store: 'Burgetino', items: ['Beef Burger x2', 'Fries x2', 'Cola x2'], status: 'cancelled', total: 96, date: 'Mar 25, 1:00 PM', emoji: '🍔' },
]

const tabs = ['All', 'Active', 'Completed', 'Cancelled']

export default function WebOrders() {
  const [activeTab, setActiveTab] = useState('All')
  const [expanded, setExpanded] = useState('SUW-2841')

  const filtered = orders.filter(o => {
    if (activeTab === 'All') return true
    if (activeTab === 'Active') return ['pending', 'accepted', 'preparing', 'on_the_way'].includes(o.status)
    if (activeTab === 'Completed') return o.status === 'completed'
    if (activeTab === 'Cancelled') return o.status === 'cancelled'
    return true
  })

  const steps = ['Pending', 'Accepted', 'Preparing', 'On the way', 'Delivered']
  const activeStep = 3 // on_the_way

  return (
    <div className="min-h-screen bg-[#F8F6F1]">
      <div className="bg-[#0F2A47] py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-white">My Orders</h1>
          <p className="text-white/60 text-sm mt-1">Track and manage your orders</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-1 mb-5 bg-white rounded-xl p-1 shadow-sm border border-[#E8E6E1]">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab ? 'bg-[#0F2A47] text-white' : 'text-[#666] hover:text-[#222]'
              }`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Orders */}
        <div className="space-y-3">
          {filtered.map(order => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-[#E8E6E1] overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                className="w-full p-4 flex items-center gap-4 text-left hover:bg-[#F8F6F1]/50">
                <div className="w-12 h-12 rounded-xl bg-[#F8F6F1] flex items-center justify-center text-2xl">
                  {order.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-[#222] text-sm">{order.store}</p>
                    <Badge status={order.status} />
                  </div>
                  <p className="text-xs text-[#666] mt-0.5">{order.id} · {order.date}</p>
                  <p className="text-xs text-[#888] mt-0.5 truncate">{order.items.join(', ')}</p>
                </div>
                <div className="text-right ml-3">
                  <p className="font-bold text-[#0F2A47] text-sm">{order.total} AED</p>
                  <ChevronRight size={14} className={`text-[#666] ml-auto mt-1 transition-transform ${expanded === order.id ? 'rotate-90' : ''}`} />
                </div>
              </button>

              {/* Expanded details */}
              {expanded === order.id && (
                <div className="border-t border-[#F0EEE9] p-4">
                  {/* Order tracking */}
                  {['on_the_way', 'preparing', 'accepted'].includes(order.status) && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-[#444] mb-3 uppercase tracking-wide">Order Status</p>
                      <div className="flex items-center">
                        {steps.map((step, i) => (
                          <div key={step} className="flex items-center flex-1 last:flex-none">
                            <div className="flex flex-col items-center">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                                i <= activeStep ? 'bg-[#0F2A47] text-white' : 'bg-[#E8E6E1] text-[#999]'
                              }`}>
                                {i < activeStep ? '✓' : i === activeStep ? '●' : '○'}
                              </div>
                              <p className={`text-xs mt-1 ${i <= activeStep ? 'text-[#0F2A47] font-medium' : 'text-[#999]'}`}
                                style={{ fontSize: '9px', whiteSpace: 'nowrap' }}>
                                {step}
                              </p>
                            </div>
                            {i < steps.length - 1 && (
                              <div className={`flex-1 h-0.5 mx-1 ${i < activeStep ? 'bg-[#0F2A47]' : 'bg-[#E8E6E1]'}`}></div>
                            )}
                          </div>
                        ))}
                      </div>
                      {order.eta && (
                        <p className="text-xs text-emerald-600 font-medium mt-3 flex items-center gap-1">
                          <Clock size={12} /> Arriving in ~{order.eta}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Items */}
                  <div className="space-y-1 mb-4">
                    {order.items.map(item => (
                      <p key={item} className="text-sm text-[#555] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#C8A951] rounded-full"></span>
                        {item}
                      </p>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {order.status === 'completed' && (
                      <>
                        <button className="flex items-center gap-2 px-3 py-2 bg-[#0F2A47] text-white text-xs font-medium rounded-lg">
                          <RotateCcw size={12} /> Reorder
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 bg-[#F8F6F1] text-[#444] text-xs font-medium rounded-lg border border-[#E8E6E1]">
                          <Star size={12} /> Rate
                        </button>
                      </>
                    )}
                    {order.status === 'on_the_way' && (
                      <button className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg border border-emerald-200">
                        <MapPin size={12} /> Track Live
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Package size={48} className="text-[#C8A951] mx-auto mb-4" />
            <p className="font-medium text-[#666]">No orders in this category</p>
          </div>
        )}
      </div>
    </div>
  )
}
