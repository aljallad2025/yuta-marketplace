import { useState } from 'react'
import { RefreshCw, MapPin, Car, Package, Filter } from 'lucide-react'
import Badge from '../../components/Badge'

const drivers = [
  { id: 'D1', name: 'Mohammed A.', status: 'delivering', x: 120, y: 140, orders: 2 },
  { id: 'D2', name: 'Yusuf K.', status: 'available', x: 280, y: 200, orders: 0 },
  { id: 'D3', name: 'Ibrahim S.', status: 'delivering', x: 440, y: 110, orders: 1 },
  { id: 'D4', name: 'Hassan M.', status: 'on_ride', x: 350, y: 280, orders: 0 },
  { id: 'D5', name: 'Ali R.', status: 'available', x: 180, y: 300, orders: 0 },
  { id: 'D6', name: 'Saeed K.', status: 'delivering', x: 520, y: 220, orders: 3 },
]

const orders_active = [
  { id: 'SUW-2841', customer: 'Ahmed M.', from: 'Baharat Rest.', status: 'on_the_way', driver: 'Mohammed A.', x: 95, y: 160 },
  { id: 'SUW-2840', customer: 'Fatima K.', from: 'Fresh Mart', status: 'preparing', driver: null, x: 310, y: 175 },
  { id: 'SUW-2838', customer: 'Layla H.', from: 'Burgetino', status: 'pending', driver: null, x: 460, y: 240 },
]

export default function AdminLiveMap() {
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F2A47]">Live Delivery Map</h1>
          <p className="text-sm text-[#666]">Real-time driver and order tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E8E6E1] rounded-xl text-sm text-[#444] shadow-sm">
            <RefreshCw size={14} className="text-[#C8A951]" /> Refresh
          </button>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-emerald-600 font-medium">Live</span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Drivers Online', value: drivers.length, color: '#2ECC71' },
          { label: 'Delivering', value: drivers.filter(d => d.status === 'delivering').length, color: '#3498DB' },
          { label: 'Active Orders', value: orders_active.length, color: '#F39C12' },
          { label: 'On Rides', value: drivers.filter(d => d.status === 'on_ride').length, color: '#9B59B6' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-[#E8E6E1] text-center">
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[#666] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Map */}
        <div className="lg:col-span-2 bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E8E6E1]">
          <div className="p-3 border-b border-[#F0EEE9] flex items-center gap-3">
            <div className="flex items-center gap-4 text-xs">
              {[
                { color: '#2ECC71', label: 'Available' },
                { color: '#3498DB', label: 'Delivering' },
                { color: '#9B59B6', label: 'On Ride' },
                { color: '#F39C12', label: 'Order (pending)' },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: l.color }}></div>
                  <span className="text-[#666]">{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Simulated map */}
          <div className="relative bg-[#e8f4e4] overflow-hidden" style={{ height: '480px' }}>
            {/* Grid */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 640 480">
              {/* Background roads */}
              {[0,80,160,240,320,400,480,560,640].map(x => (
                <line key={x} x1={x} y1="0" x2={x} y2="480" stroke="#c8e6c9" strokeWidth="1"/>
              ))}
              {[0,80,160,240,320,400,480].map(y => (
                <line key={y} x1="0" y1={y} x2="640" y2={y} stroke="#c8e6c9" strokeWidth="1"/>
              ))}

              {/* Main roads */}
              <line x1="0" y1="160" x2="640" y2="160" stroke="#b2dfdb" strokeWidth="6"/>
              <line x1="0" y1="320" x2="640" y2="320" stroke="#b2dfdb" strokeWidth="6"/>
              <line x1="160" y1="0" x2="160" y2="480" stroke="#b2dfdb" strokeWidth="6"/>
              <line x1="400" y1="0" x2="400" y2="480" stroke="#b2dfdb" strokeWidth="6"/>

              {/* Orders */}
              {orders_active.map(order => (
                <g key={order.id}>
                  <circle cx={order.x} cy={order.y} r="14" fill={
                    order.status === 'on_the_way' ? '#3498DB' : order.status === 'preparing' ? '#9B59B6' : '#F39C12'
                  } opacity="0.85" />
                  <text x={order.x} y={order.y + 4} textAnchor="middle" fill="white" fontSize="10">📦</text>
                </g>
              ))}

              {/* Drivers */}
              {drivers.map(driver => (
                <g key={driver.id} onClick={() => setSelected(driver)} style={{ cursor: 'pointer' }}>
                  <circle cx={driver.x} cy={driver.y} r="16"
                    fill={driver.status === 'delivering' ? '#3498DB' : driver.status === 'on_ride' ? '#9B59B6' : '#2ECC71'}
                    stroke="white" strokeWidth="2" opacity="0.9"/>
                  <text x={driver.x} y={driver.y + 4} textAnchor="middle" fill="white" fontSize="11">🚗</text>
                  {driver.status === 'delivering' && (
                    <circle cx={driver.x + 11} cy={driver.y - 11} r="7" fill="#E74C3C" />
                  )}
                  {driver.status === 'delivering' && (
                    <text x={driver.x + 11} y={driver.y - 7} textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">
                      {driver.orders}
                    </text>
                  )}
                </g>
              ))}

              {/* Labels */}
              <text x="20" y="200" fill="#666" fontSize="10" opacity="0.7">Dubai Marina</text>
              <text x="290" y="100" fill="#666" fontSize="10" opacity="0.7">Downtown Dubai</text>
              <text x="430" y="360" fill="#666" fontSize="10" opacity="0.7">Business Bay</text>
              <text x="80" y="380" fill="#666" fontSize="10" opacity="0.7">JBR</text>
            </svg>

            {/* Selected driver popup */}
            {selected && (
              <div className="absolute top-4 left-4 bg-white rounded-xl p-3 shadow-lg border border-[#E8E6E1] w-48">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-xs text-[#0F2A47]">{selected.name}</p>
                  <button onClick={() => setSelected(null)} className="text-[#999] hover:text-[#666] text-xs">✕</button>
                </div>
                <Badge status={selected.status === 'delivering' ? 'on_the_way' : selected.status === 'on_ride' ? 'accepted' : 'active'}
                  label={selected.status === 'delivering' ? 'Delivering' : selected.status === 'on_ride' ? 'On Ride' : 'Available'} />
                {selected.orders > 0 && <p className="text-xs text-[#666] mt-1">{selected.orders} active order(s)</p>}
                <button className="mt-2 w-full py-1.5 bg-[#0F2A47] text-white text-xs rounded-lg font-medium">View Details</button>
              </div>
            )}
          </div>
        </div>

        {/* Driver list */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8E6E1]">
          <div className="p-4 border-b border-[#F0EEE9]">
            <h2 className="font-semibold text-[#0F2A47]">Drivers</h2>
          </div>
          <div className="p-3 space-y-2 overflow-y-auto" style={{ maxHeight: '520px' }}>
            {drivers.map(driver => (
              <button key={driver.id} onClick={() => setSelected(driver)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                  selected?.id === driver.id ? 'border-[#0F2A47] bg-[#0F2A47]/5' : 'border-[#F0EEE9] hover:border-[#C8A951]/30'
                }`}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: driver.status === 'delivering' ? '#3498DB' : driver.status === 'on_ride' ? '#9B59B6' : '#2ECC71' }}>
                  {driver.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-xs text-[#222]">{driver.name}</p>
                  <Badge status={driver.status === 'delivering' ? 'on_the_way' : driver.status === 'on_ride' ? 'accepted' : 'active'}
                    label={driver.status === 'delivering' ? 'Delivering' : driver.status === 'on_ride' ? 'On Ride' : 'Available'}
                    className="mt-0.5" />
                </div>
                {driver.orders > 0 && (
                  <div className="w-5 h-5 bg-[#E74C3C] rounded-full flex items-center justify-center">
                    <span className="text-white text-[9px] font-bold">{driver.orders}</span>
                  </div>
                )}
              </button>
            ))}

            {/* Active orders */}
            <div className="pt-3 mt-3 border-t border-[#F0EEE9]">
              <p className="text-xs font-semibold text-[#444] mb-2">Active Orders</p>
              {orders_active.map(order => (
                <div key={order.id} className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F8F6F1] mb-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                    style={{ backgroundColor: order.status === 'on_the_way' ? '#3498DB20' : '#F3930220' }}>
                    📦
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-[#222]">{order.id}</p>
                    <p className="text-[10px] text-[#666]">{order.from}</p>
                  </div>
                  <Badge status={order.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
