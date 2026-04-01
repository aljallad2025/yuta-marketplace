import { Users, Store, Car, Package, TrendingUp, DollarSign, Zap, Clock } from 'lucide-react'
import StatCard from '../../components/StatCard'
import Badge from '../../components/Badge'
import { useLang } from '../../i18n/LangContext'
import LangToggle from '../../components/LangToggle'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

const revenueData = [
  { day: 'Mon', dayAr: 'الإث', revenue: 8400, orders: 124 },
  { day: 'Tue', dayAr: 'الثل', revenue: 9200, orders: 138 },
  { day: 'Wed', dayAr: 'الأر', revenue: 7800, orders: 115 },
  { day: 'Thu', dayAr: 'الخم', revenue: 11400, orders: 162 },
  { day: 'Fri', dayAr: 'الجم', revenue: 14200, orders: 198 },
  { day: 'Sat', dayAr: 'السب', revenue: 16800, orders: 230 },
  { day: 'Sun', dayAr: 'الأح', revenue: 13500, orders: 189 },
]

const categoryData = [
  { nameEn: 'Restaurants', nameAr: 'المطاعم', value: 42, color: '#0F2A47' },
  { nameEn: 'Supermarket', nameAr: 'السوبرماركت', value: 18, color: '#C8A951' },
  { nameEn: 'Pharmacy', nameAr: 'الصيدليات', value: 14, color: '#2ECC71' },
  { nameEn: 'Beauty', nameAr: 'التجميل', value: 12, color: '#9B59B6' },
  { nameEn: 'Rida Clean', nameAr: 'ريدا كلين', value: 8, color: '#3498DB' },
  { nameEn: 'Other', nameAr: 'أخرى', value: 6, color: '#E8E4DC' },
]

const recentOrders = [
  { id: 'SUW-2841', customerEn: 'Ahmed M.', customerAr: 'أحمد م.', storeEn: 'Baharat Rest.', storeAr: 'مطعم بهارات', total: 254, status: 'on_the_way' },
  { id: 'SUW-2840', customerEn: 'Fatima K.', customerAr: 'فاطمة ك.', storeEn: 'Fresh Mart', storeAr: 'فريش مارت', total: 187, status: 'preparing' },
  { id: 'SUW-2839', customerEn: 'Omar S.', customerAr: 'عمر س.', storeEn: 'Alshifa Pharmacy', storeAr: 'صيدلية الشفاء', total: 48, status: 'completed' },
  { id: 'SUW-2838', customerEn: 'Layla A.', customerAr: 'ليلى أ.', storeEn: 'Burgetino', storeAr: 'برجتينو', total: 96, status: 'pending' },
  { id: 'SUW-2837', customerEn: 'Khalid R.', customerAr: 'خالد ر.', storeEn: 'TechZone', storeAr: 'تك زون', total: 420, status: 'accepted' },
]

const activeDrivers = [
  { nameEn: 'Mohammed A.', nameAr: 'محمد أ.', status: 'delivering', orders: 2, locationEn: 'Dubai Marina', locationAr: 'دبي مارينا' },
  { nameEn: 'Yusuf K.', nameAr: 'يوسف ك.', status: 'available', orders: 0, locationEn: 'Downtown', locationAr: 'وسط المدينة' },
  { nameEn: 'Ibrahim S.', nameAr: 'إبراهيم س.', status: 'delivering', orders: 1, locationEn: 'JBR Beach', locationAr: 'شاطئ JBR' },
  { nameEn: 'Hassan M.', nameAr: 'حسن م.', status: 'on_ride', orders: 0, locationEn: 'Business Bay', locationAr: 'خليج الأعمال' },
]

export default function AdminDashboard() {
  const { t, isAr } = useLang()
  const chartData = revenueData.map(d => ({ ...d, dayLabel: isAr ? d.dayAr : d.day }))

  return (
    <div className="p-6 space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#0F2A47]">{t('dashboard')}</h1>
          <p className="text-[#666] text-sm mt-0.5">{isAr ? 'الثلاثاء، ١ أبريل ٢٠٢٦' : 'Tuesday, 1 April 2026'}</p>
        </div>
        <div className="flex items-center gap-3">
          <LangToggle className="border-[#E8E4DC]" />
          <select className="text-sm border border-[#E8E4DC] rounded-xl px-4 py-2.5 bg-white text-[#222] outline-none shadow-sm font-semibold">
            <option>{isAr ? 'آخر ٧ أيام' : 'Last 7 days'}</option>
            <option>{isAr ? 'آخر ٣٠ يوم' : 'Last 30 days'}</option>
          </select>
          <button className="px-4 py-2.5 bg-[#0F2A47] text-white text-sm font-bold rounded-xl shadow-sm">
            {t('exportReport')}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label={t('totalUsers')} value="12,847" change="+8.2%" changeType="up" icon={Users} color="#0F2A47" />
        <StatCard label={t('activeStores')} value="284" change="+3.1%" changeType="up" icon={Store} color="#C8A951" />
        <StatCard label={t('activeDrivers')} value="142" change="+5.4%" changeType="up" icon={Car} color="#2ECC71" />
        <StatCard label={t('ordersToday')} value="346" change="+12.7%" changeType="up" icon={Package} color="#3498DB" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label={t('revenueToday')} value="81,420 AED" change="+15.3%" changeType="up" icon={DollarSign} color="#C8A951" />
        <StatCard label={t('activeRides')} value="38" change="+2" changeType="up" icon={Zap} color="#9B59B6" />
        <StatCard label={t('avgDelivery')} value={isAr ? '٢٢ دقيقة' : '22 min'} change="-3 min" changeType="up" icon={Clock} color="#0F2A47" />
        <StatCard label={t('commission')} value="8,142 AED" change="+15.3%" changeType="up" icon={TrendingUp} color="#E74C3C" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-[#E8E4DC]">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-black text-[#0F2A47]">{isAr ? 'الإيرادات والطلبات' : 'Revenue & Orders'}</h2>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-[#0F2A47] inline-block rounded"></span> {isAr ? 'الإيرادات' : 'Revenue'}</span>
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-[#C8A951] inline-block rounded"></span> {isAr ? 'الطلبات' : 'Orders'}</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0ECE4" />
              <XAxis dataKey="dayLabel" tick={{ fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E8E4DC', fontSize: 12 }} />
              <Line type="monotone" dataKey="revenue" stroke="#0F2A47" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="orders" stroke="#C8A951" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8E4DC]">
          <h2 className="font-black text-[#0F2A47] mb-5">{isAr ? 'الطلبات حسب القسم' : 'Orders by Category'}</h2>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={38} outerRadius={62} dataKey="value" paddingAngle={3}>
                {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-3">
            {categoryData.map(d => (
              <div key={d.nameEn} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }}></div>
                <span className="flex-1 text-[#666]">{isAr ? d.nameAr : d.nameEn}</span>
                <span className="font-black text-[#222]">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8E4DC] overflow-hidden">
          <div className="p-4 border-b border-[#F0ECE4] flex items-center justify-between">
            <h2 className="font-black text-[#0F2A47]">{isAr ? 'آخر الطلبات' : 'Recent Orders'}</h2>
            <a href="/admin/orders" className="text-xs text-[#C8A951] font-black">{t('viewAll')} →</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#FBF8F2]">
                  {[isAr ? 'رقم الطلب' : 'Order', isAr ? 'العميل' : 'Customer', isAr ? 'المتجر' : 'Store', isAr ? 'الإجمالي' : 'Total', isAr ? 'الحالة' : 'Status'].map(h => (
                    <th key={h} className="text-right px-4 py-2.5 text-xs font-black text-[#666] whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, i) => (
                  <tr key={order.id} className={`${i < recentOrders.length - 1 ? 'border-b border-[#F0ECE4]' : ''} hover:bg-[#FBF8F2]`}>
                    <td className="px-4 py-3 text-xs font-mono font-black text-[#0F2A47]">{order.id}</td>
                    <td className="px-4 py-3 text-xs text-[#444] font-semibold">{isAr ? order.customerAr : order.customerEn}</td>
                    <td className="px-4 py-3 text-xs text-[#666]">{isAr ? order.storeAr : order.storeEn}</td>
                    <td className="px-4 py-3 text-xs font-black text-[#222]">{order.total} {isAr ? 'د' : 'AED'}</td>
                    <td className="px-4 py-3"><Badge status={order.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#E8E4DC] overflow-hidden">
          <div className="p-4 border-b border-[#F0ECE4] flex items-center justify-between">
            <h2 className="font-black text-[#0F2A47]">{isAr ? 'السائقون النشطون' : 'Active Drivers'}</h2>
            <a href="/admin/drivers" className="text-xs text-[#C8A951] font-black">{t('viewAll')} →</a>
          </div>
          <div className="p-4 space-y-2.5">
            {activeDrivers.map(driver => (
              <div key={driver.nameEn} className="flex items-center gap-3 p-3 bg-[#FBF8F2] rounded-xl">
                <div className="w-9 h-9 bg-[#0F2A47] rounded-full flex items-center justify-center text-white text-sm font-black">
                  {(isAr ? driver.nameAr : driver.nameEn).charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black text-[#222]">{isAr ? driver.nameAr : driver.nameEn}</p>
                  <p className="text-xs text-[#666]">{isAr ? driver.locationAr : driver.locationEn}</p>
                </div>
                <div className="text-right">
                  <Badge status={driver.status === 'delivering' ? 'on_the_way' : driver.status === 'on_ride' ? 'accepted' : 'active'}
                    label={isAr
                      ? (driver.status === 'delivering' ? 'يوصّل' : driver.status === 'on_ride' ? 'في رحلة' : 'متاح')
                      : (driver.status === 'delivering' ? 'Delivering' : driver.status === 'on_ride' ? 'On Ride' : 'Available')} />
                  {driver.orders > 0 && <p className="text-[10px] text-[#666] mt-0.5">{driver.orders} {isAr ? 'طلب' : 'orders'}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
