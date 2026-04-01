import { Users, Store, Car, Package, TrendingUp, DollarSign, Zap, Clock } from 'lucide-react'
import StatCard from '../../components/StatCard'
import Badge from '../../components/Badge'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

const revenueData = [
  { day: 'Mon', revenue: 8400, orders: 124 },
  { day: 'Tue', revenue: 9200, orders: 138 },
  { day: 'Wed', revenue: 7800, orders: 115 },
  { day: 'Thu', revenue: 11400, orders: 162 },
  { day: 'Fri', revenue: 14200, orders: 198 },
  { day: 'Sat', revenue: 16800, orders: 230 },
  { day: 'Sun', revenue: 13500, orders: 189 },
]

const categoryData = [
  { name: 'Restaurants', value: 42, color: '#0F2A47' },
  { name: 'Supermarket', value: 18, color: '#C8A951' },
  { name: 'Pharmacy', value: 14, color: '#2ECC71' },
  { name: 'Beauty', value: 12, color: '#9B59B6' },
  { name: 'Other', value: 14, color: '#E8E6E1' },
]

const recentOrders = [
  { id: 'SUW-2841', customer: 'Ahmed M.', store: 'Baharat Rest.', total: 254, status: 'on_the_way' },
  { id: 'SUW-2840', customer: 'Fatima K.', store: 'Fresh Mart', total: 187, status: 'preparing' },
  { id: 'SUW-2839', customer: 'Omar S.', store: 'Al Shifa Pharmacy', total: 48, status: 'completed' },
  { id: 'SUW-2838', customer: 'Layla A.', store: 'Burgetino', total: 96, status: 'pending' },
  { id: 'SUW-2837', customer: 'Khalid R.', store: 'TechZone', total: 420, status: 'accepted' },
]

const activeDrivers = [
  { name: 'Mohammed A.', status: 'delivering', orders: 2, location: 'Dubai Marina' },
  { name: 'Yusuf K.', status: 'available', orders: 0, location: 'Downtown Dubai' },
  { name: 'Ibrahim S.', status: 'delivering', orders: 1, location: 'JBR Beach' },
  { name: 'Hassan M.', status: 'on_ride', orders: 0, location: 'Business Bay' },
]

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F2A47]">Dashboard</h1>
          <p className="text-[#666] text-sm mt-0.5">Tuesday, 1 April 2026</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="text-sm border border-[#E8E6E1] rounded-xl px-4 py-2.5 bg-white text-[#222] outline-none shadow-sm">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>This month</option>
          </select>
          <button className="px-4 py-2.5 bg-[#0F2A47] text-white text-sm font-semibold rounded-xl shadow-sm">
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value="12,847" change="+8.2%" changeType="up" icon={Users} color="#0F2A47" />
        <StatCard label="Active Stores" value="284" change="+3.1%" changeType="up" icon={Store} color="#C8A951" />
        <StatCard label="Active Drivers" value="142" change="+5.4%" changeType="up" icon={Car} color="#2ECC71" />
        <StatCard label="Orders Today" value="346" change="+12.7%" changeType="up" icon={Package} color="#3498DB" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Revenue Today" value="81,420 AED" change="+15.3%" changeType="up" icon={DollarSign} color="#C8A951" />
        <StatCard label="Active Rides" value="38" change="+2" changeType="up" icon={Zap} color="#9B59B6" />
        <StatCard label="Avg. Delivery" value="22 min" change="-3 min" changeType="up" icon={Clock} color="#0F2A47" />
        <StatCard label="Commission" value="8,142 AED" change="+15.3%" changeType="up" icon={TrendingUp} color="#E74C3C" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-[#E8E6E1]">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-[#0F2A47]">Revenue & Orders</h2>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-[#0F2A47] inline-block"></span> Revenue</span>
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-[#C8A951] inline-block"></span> Orders</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EEE9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E8E6E1', fontSize: 12 }} />
              <Line type="monotone" dataKey="revenue" stroke="#0F2A47" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="orders" stroke="#C8A951" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category breakdown */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8E6E1]">
          <h2 className="font-semibold text-[#0F2A47] mb-5">Orders by Category</h2>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                {categoryData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">
            {categoryData.map(d => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }}></div>
                <span className="flex-1 text-[#666]">{d.name}</span>
                <span className="font-semibold text-[#222]">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8E6E1] overflow-hidden">
          <div className="p-4 border-b border-[#F0EEE9] flex items-center justify-between">
            <h2 className="font-semibold text-[#0F2A47]">Recent Orders</h2>
            <a href="/admin/orders" className="text-xs text-[#C8A951] font-medium">View all →</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8F6F1]">
                  {['Order ID', 'Customer', 'Store', 'Total', 'Status'].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-[#666] whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, i) => (
                  <tr key={order.id} className={`${i < recentOrders.length - 1 ? 'border-b border-[#F0EEE9]' : ''} hover:bg-[#F8F6F1]`}>
                    <td className="px-4 py-3 text-xs font-mono font-semibold text-[#0F2A47]">{order.id}</td>
                    <td className="px-4 py-3 text-xs text-[#444]">{order.customer}</td>
                    <td className="px-4 py-3 text-xs text-[#666]">{order.store}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-[#222]">{order.total} AED</td>
                    <td className="px-4 py-3"><Badge status={order.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Drivers */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8E6E1] overflow-hidden">
          <div className="p-4 border-b border-[#F0EEE9] flex items-center justify-between">
            <h2 className="font-semibold text-[#0F2A47]">Active Drivers</h2>
            <a href="/admin/drivers" className="text-xs text-[#C8A951] font-medium">View all →</a>
          </div>
          <div className="p-4 space-y-3">
            {activeDrivers.map(driver => (
              <div key={driver.name} className="flex items-center gap-3 p-3 bg-[#F8F6F1] rounded-xl">
                <div className="w-9 h-9 bg-[#0F2A47] rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {driver.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#222]">{driver.name}</p>
                  <p className="text-xs text-[#666]">{driver.location}</p>
                </div>
                <div className="text-right">
                  <Badge status={
                    driver.status === 'delivering' ? 'on_the_way' :
                    driver.status === 'on_ride' ? 'accepted' : 'active'
                  } label={driver.status === 'delivering' ? 'Delivering' : driver.status === 'on_ride' ? 'On Ride' : 'Available'} />
                  {driver.orders > 0 && (
                    <p className="text-[10px] text-[#666] mt-0.5">{driver.orders} order{driver.orders > 1 ? 's' : ''}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
