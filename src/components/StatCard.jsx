import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatCard({ label, value, change, changeType = 'up', icon: Icon, color = '#0D1B4B' }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E8E6E1] hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#666] font-medium">{label}</p>
          <p className="text-2xl font-bold text-[#222] mt-1">{value}</p>
          {change && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${changeType === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
              {changeType === 'up' ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              <span>{change} vs last month</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="p-3 rounded-xl" style={{ backgroundColor: color + '15' }}>
            <Icon size={22} style={{ color }} />
          </div>
        )}
      </div>
    </div>
  )
}
