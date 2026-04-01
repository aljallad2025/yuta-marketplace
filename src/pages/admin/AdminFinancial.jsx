import { DollarSign, TrendingUp, ArrowDownCircle, CheckCircle, XCircle, Download } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Badge from '../../components/Badge'

const monthlyData = [
  { month: 'Oct', revenue: 145000, commission: 14500 },
  { month: 'Nov', revenue: 182000, commission: 18200 },
  { month: 'Dec', revenue: 248000, commission: 24800 },
  { month: 'Jan', revenue: 196000, commission: 19600 },
  { month: 'Feb', revenue: 224000, commission: 22400 },
  { month: 'Mar', revenue: 268000, commission: 26800 },
]

const withdrawals = [
  { id: 'WD-1024', name: 'Mohammed Al Ameri', type: 'Driver', amount: 1240, status: 'pending', date: 'Apr 1' },
  { id: 'WD-1023', name: 'Baharat Restaurant', type: 'Store', amount: 4860, status: 'completed', date: 'Mar 31' },
  { id: 'WD-1022', name: 'Yusuf Al Kaabi', type: 'Driver', amount: 780, status: 'pending', date: 'Mar 31' },
  { id: 'WD-1021', name: 'Fresh Mart', type: 'Store', amount: 3820, status: 'completed', date: 'Mar 30' },
  { id: 'WD-1020', name: 'Ibrahim Saeed', type: 'Driver', amount: 1560, status: 'completed', date: 'Mar 30' },
]

export default function AdminFinancial() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F2A47]">Financial Control</h1>
          <p className="text-sm text-[#666]">Revenue, commissions & payouts overview</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#C8A951] text-[#0F2A47] text-sm font-bold rounded-xl">
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue (Mar)', value: '268,000 AED', icon: DollarSign, color: '#0F2A47', change: '+19.6%' },
          { label: 'Commission Earned', value: '26,800 AED', icon: TrendingUp, color: '#C8A951', change: '+19.6%' },
          { label: 'Pending Payouts', value: '24,600 AED', icon: ArrowDownCircle, color: '#E74C3C', change: '12 requests' },
          { label: 'Completed Payouts', value: '142,000 AED', icon: CheckCircle, color: '#2ECC71', change: 'This month' },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8E6E1]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-[#666] font-medium">{card.label}</p>
                <p className="text-xl font-bold text-[#222] mt-1 leading-tight">{card.value}</p>
                <p className="text-xs text-emerald-600 font-medium mt-1">{card.change}</p>
              </div>
              <div className="p-3 rounded-xl" style={{ backgroundColor: card.color + '15' }}>
                <card.icon size={20} style={{ color: card.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8E6E1]">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-[#0F2A47]">Revenue vs Commission (6 months)</h2>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-[#0F2A47] inline-block"></span> Revenue</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-[#C8A951] inline-block"></span> Commission</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={monthlyData} barSize={18} barGap={6}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0EEE9" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#666' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E8E6E1', fontSize: 12 }} />
            <Bar dataKey="revenue" fill="#0F2A47" radius={[4, 4, 0, 0]} />
            <Bar dataKey="commission" fill="#C8A951" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Commission settings */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8E6E1]">
        <h2 className="font-semibold text-[#0F2A47] mb-4">Commission Settings by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { cat: 'Restaurants', rate: 12 }, { cat: 'Supermarket', rate: 10 },
            { cat: 'Pharmacy', rate: 8 }, { cat: 'Beauty', rate: 15 },
            { cat: 'Electronics', rate: 8 }, { cat: 'General Stores', rate: 10 },
          ].map(c => (
            <div key={c.cat} className="flex items-center justify-between p-3 bg-[#F8F6F1] rounded-xl">
              <p className="text-sm font-medium text-[#444]">{c.cat}</p>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#C8A951] text-sm">{c.rate}%</span>
                <button className="text-xs text-[#0F2A47] underline">Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Withdrawal Requests */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8E6E1] overflow-hidden">
        <div className="p-4 border-b border-[#F0EEE9] flex items-center justify-between">
          <h2 className="font-semibold text-[#0F2A47]">Withdrawal Requests</h2>
          <span className="text-xs bg-[#E74C3C]/10 text-[#E74C3C] px-2 py-0.5 rounded-full font-medium">2 pending</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8F6F1] border-b border-[#E8E6E1]">
                {['ID', 'Name', 'Type', 'Amount', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#666] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((w, i) => (
                <tr key={w.id} className={`${i < withdrawals.length - 1 ? 'border-b border-[#F0EEE9]' : ''} hover:bg-[#F8F6F1]`}>
                  <td className="px-4 py-3.5 font-mono text-xs text-[#0F2A47] font-semibold">{w.id}</td>
                  <td className="px-4 py-3.5 text-sm text-[#444]">{w.name}</td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      w.type === 'Driver' ? 'bg-[#0F2A47]/10 text-[#0F2A47]' : 'bg-[#C8A951]/15 text-[#a88b3a]'
                    }`}>{w.type}</span>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-sm text-[#222]">{w.amount.toLocaleString()} AED</td>
                  <td className="px-4 py-3.5"><Badge status={w.status} /></td>
                  <td className="px-4 py-3.5 text-xs text-[#666]">{w.date}</td>
                  <td className="px-4 py-3.5">
                    {w.status === 'pending' ? (
                      <div className="flex gap-1.5">
                        <button className="p-1.5 hover:bg-green-50 rounded-lg text-green-600"><CheckCircle size={14} /></button>
                        <button className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"><XCircle size={14} /></button>
                      </div>
                    ) : <span className="text-xs text-[#999]">Processed</span>}
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
