import { useLang } from '../../i18n/LangContext'
import { useApp } from '../../store/appStore'
import { useStores } from '../../store/storesStore'
import { TrendingUp, DollarSign, ShoppingBag, Star, Users, Package } from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

const weeklyData = [
  { day: 'السبت',   dayEn: 'Sat', orders: 12, revenue: 580 },
  { day: 'الأحد',  dayEn: 'Sun', orders: 18, revenue: 860 },
  { day: 'الاثنين', dayEn: 'Mon', orders: 14, revenue: 670 },
  { day: 'الثلاثاء',dayEn: 'Tue', orders: 22, revenue: 1040 },
  { day: 'الأربعاء',dayEn: 'Wed', orders: 19, revenue: 910 },
  { day: 'الخميس', dayEn: 'Thu', orders: 28, revenue: 1340 },
  { day: 'الجمعة', dayEn: 'Fri', orders: 35, revenue: 1680 },
]

const categoryData = [
  { name: 'مشويات', nameEn: 'Grills', value: 45, color: '#C8A951' },
  { name: 'مشروبات', nameEn: 'Drinks', value: 20, color: '#3498DB' },
  { name: 'أرز', nameEn: 'Rice', value: 20, color: '#2ECC71' },
  { name: 'مقبلات', nameEn: 'Starters', value: 15, color: '#E74C3C' },
]

export default function VendorAnalytics() {
  const { isAr } = useLang()
  const { getStoreOrders, getStoreStats, activeVendorId } = useApp()
  const { stores } = useStores()

  const store = stores.find(s => s.id === activeVendorId) || stores[0]
  const stats = getStoreStats(activeVendorId)
  const orders = getStoreOrders(activeVendorId)

  const completionRate = stats.totalOrders > 0
    ? Math.round((stats.completedOrders / stats.totalOrders) * 100)
    : 0

  const kpis = [
    { icon: ShoppingBag, labelAr: 'إجمالي الطلبات', labelEn: 'Total Orders', value: stats.totalOrders, color: '#3498DB', change: '+12%' },
    { icon: DollarSign, labelAr: 'الإيرادات', labelEn: 'Revenue', value: `${stats.revenue.toLocaleString()} AED`, color: '#C8A951', change: '+8%' },
    { icon: TrendingUp, labelAr: 'معدل الإكمال', labelEn: 'Completion Rate', value: `${completionRate}%`, color: '#2ECC71', change: '+2%' },
    { icon: Star, labelAr: 'التقييم', labelEn: 'Rating', value: `${store?.rating || 0} / 5`, color: '#E67E22', change: 'Stable' },
  ]

  return (
    <div className="p-6" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="mb-6">
        <h1 className="text-xl font-black text-[#0F2A47]">{isAr ? 'الإحصائيات والتقارير' : 'Analytics & Reports'}</h1>
        <p className="text-sm text-[#888] mt-0.5">{isAr ? 'بيانات أداء متجرك' : 'Your store performance data'}</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map(kpi => (
          <div key={kpi.labelEn} className="bg-white rounded-2xl border border-[#E8E4DC] p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: kpi.color + '20' }}>
                <kpi.icon size={16} style={{ color: kpi.color }} />
              </div>
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{kpi.change}</span>
            </div>
            <p className="text-2xl font-black text-[#0F2A47]">{kpi.value}</p>
            <p className="text-xs text-[#888] mt-0.5">{isAr ? kpi.labelAr : kpi.labelEn}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Weekly orders */}
        <div className="bg-white rounded-2xl border border-[#E8E4DC] p-5">
          <h2 className="font-black text-[#0F2A47] mb-4">{isAr ? 'الطلبات اليومية - هذا الأسبوع' : 'Daily Orders - This Week'}</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0ECE4" />
              <XAxis dataKey={isAr ? 'day' : 'dayEn'} tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="orders" fill="#0F2A47" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue chart */}
        <div className="bg-white rounded-2xl border border-[#E8E4DC] p-5">
          <h2 className="font-black text-[#0F2A47] mb-4">{isAr ? 'الإيرادات اليومية (د.إ)' : 'Daily Revenue (AED)'}</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0ECE4" />
              <XAxis dataKey={isAr ? 'day' : 'dayEn'} tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#C8A951" strokeWidth={2.5} dot={{ r: 4, fill: '#C8A951' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Category breakdown */}
        <div className="bg-white rounded-2xl border border-[#E8E4DC] p-5">
          <h2 className="font-black text-[#0F2A47] mb-4">{isAr ? 'المبيعات حسب الفئة' : 'Sales by Category'}</h2>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                  {categoryData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {categoryData.map(cat => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: cat.color }}></div>
                    <span className="text-sm text-[#444]">{isAr ? cat.name : cat.nameEn}</span>
                  </div>
                  <span className="text-sm font-black text-[#222]">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance summary */}
        <div className="bg-white rounded-2xl border border-[#E8E4DC] p-5">
          <h2 className="font-black text-[#0F2A47] mb-4">{isAr ? 'ملخص الأداء' : 'Performance Summary'}</h2>
          <div className="space-y-3">
            {[
              { labelAr: 'متوسط قيمة الطلب', labelEn: 'Avg Order Value', value: stats.totalOrders > 0 ? `${Math.round(stats.revenue / stats.totalOrders)} AED` : '0 AED' },
              { labelAr: 'طلبات اليوم', labelEn: "Today's Orders", value: stats.todayOrders },
              { labelAr: 'معدل الإلغاء', labelEn: 'Cancellation Rate', value: stats.totalOrders > 0 ? `${Math.round(((orders.filter(o => o.status === 'cancelled').length) / stats.totalOrders) * 100)}%` : '0%' },
              { labelAr: 'أكثر منتج مطلوب', labelEn: 'Top Product', value: isAr ? 'مشاوي مشكلة' : 'Mixed Grill' },
              { labelAr: 'وقت التحضير المتوسط', labelEn: 'Avg Prep Time', value: '18 min' },
              { labelAr: 'عملاء جدد هذا الأسبوع', labelEn: 'New Customers', value: 24 },
            ].map(item => (
              <div key={item.labelEn} className="flex items-center justify-between py-2.5 border-b border-[#F0ECE4] last:border-0">
                <span className="text-sm text-[#666]">{isAr ? item.labelAr : item.labelEn}</span>
                <span className="font-black text-[#0F2A47] text-sm">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
