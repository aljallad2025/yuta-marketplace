import { useLang } from '../../i18n/LangContext'
import { useApp } from '../../store/appStore'
import { useAuth } from '../../store/authStore'
import { useStores } from '../../store/storesStore'
import { ShoppingBag, Package, DollarSign, Star, Clock, TrendingUp, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Badge from '../../components/Badge'

const statusMap = {
  pending:    { ar: 'قيد الانتظار', en: 'Pending',    color: 'pending' },
  accepted:   { ar: 'مقبول',        en: 'Accepted',   color: 'accepted' },
  preparing:  { ar: 'يتحضر',        en: 'Preparing',  color: 'preparing' },
  on_the_way: { ar: 'في الطريق',    en: 'On the Way', color: 'on_the_way' },
  completed:  { ar: 'مكتمل',        en: 'Completed',  color: 'completed' },
  cancelled:  { ar: 'ملغي',         en: 'Cancelled',  color: 'cancelled' },
}

const chartData = [
  { day: 'السبت', orders: 12 },
  { day: 'الأحد', orders: 18 },
  { day: 'الاثنين', orders: 14 },
  { day: 'الثلاثاء', orders: 22 },
  { day: 'الأربعاء', orders: 19 },
  { day: 'الخميس', orders: 28 },
  { day: 'الجمعة', orders: 35 },
]

export default function VendorDashboard() {
  const { isAr } = useLang()
  const { getStoreOrders, getStoreStats, getStoreProducts, updateOrderStatus } = useApp()
  const { currentUser } = useAuth()
  const activeVendorId = currentUser?.storeId || currentUser?.store_id || 1
  const { stores } = useStores()

  const store = stores.find(s => s.id === activeVendorId) || stores[0]
  const storeId = store?.id || 1
  const stats = getStoreStats(storeId)
  const orders = getStoreOrders(storeId)
  const products = getStoreProducts(storeId)
  const recentOrders = orders.slice(0, 5)
  const pendingOrders = orders.filter(o => o.status === 'pending')

  const statCards = [
    { icon: ShoppingBag, labelAr: 'طلبات اليوم', labelEn: "Today's Orders", value: stats.todayOrders, color: '#3498DB', bg: '#EBF5FB' },
    { icon: CheckCircle, labelAr: 'طلبات مكتملة', labelEn: 'Completed', value: stats.completedOrders, color: '#2ECC71', bg: '#EAFAF1' },
    { icon: AlertCircle, labelAr: 'قيد التنفيذ', labelEn: 'In Progress', value: stats.pendingOrders, color: '#F39C12', bg: '#FEF9E7' },
    { icon: DollarSign, labelAr: 'إجمالي الإيرادات', labelEn: 'Total Revenue', value: `${stats.revenue.toLocaleString()} ${isAr ? 'د' : 'AED'}`, color: '#00C9A7', bg: '#FEF9EE' },
    { icon: Package, labelAr: 'المنتجات النشطة', labelEn: 'Active Products', value: products.filter(p => p.active).length, color: '#9B59B6', bg: '#F5EEF8' },
    { icon: Star, labelAr: 'التقييم', labelEn: 'Rating', value: `${store?.rating || 0} ⭐`, color: '#E67E22', bg: '#FEF0E7' },
  ]

  return (
    <div className="p-6" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Welcome */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#0D1B4B]">
            {isAr ? `مرحباً، ${store?.ownerAr || 'المورد'}` : `Welcome, ${store?.ownerEn || 'Vendor'}`}
          </h1>
          <p className="text-[#888] text-sm mt-1">{isAr ? 'إليك ملخص متجرك اليوم' : "Here's your store summary today"}</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-[#D0EDEA] rounded-xl px-3 py-2">
          <div className={`w-2 h-2 rounded-full ${store?.active ? 'bg-emerald-500 animate-pulse' : 'bg-red-400'}`}></div>
          <span className="text-sm font-black text-[#0D1B4B]">
            {store?.active ? (isAr ? 'المتجر مفتوح' : 'Store is Open') : (isAr ? 'المتجر مغلق' : 'Store Closed')}
          </span>
        </div>
      </div>

      {/* Pending alert */}
      {pendingOrders.length > 0 && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <AlertCircle size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="font-black text-amber-800 text-sm">
                {isAr ? `لديك ${pendingOrders.length} طلب${pendingOrders.length > 1 ? 'ات' : ''} بانتظار التأكيد` : `You have ${pendingOrders.length} order${pendingOrders.length > 1 ? 's' : ''} awaiting confirmation`}
              </p>
              <p className="text-amber-600 text-xs">{isAr ? 'يرجى تأكيد الطلبات في أقرب وقت' : 'Please confirm orders as soon as possible'}</p>
            </div>
          </div>
          <button
            onClick={() => window.location.href = '/vendor/orders'}
            className="px-4 py-2 bg-amber-600 text-white text-xs font-black rounded-xl hover:bg-amber-700"
          >
            {isAr ? 'عرض الطلبات' : 'View Orders'}
          </button>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {statCards.map(card => (
          <div key={card.labelEn} className="bg-white rounded-2xl border border-[#D0EDEA] p-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ background: card.bg }}>
              <card.icon size={17} style={{ color: card.color }} />
            </div>
            <p className="text-xl font-black text-[#0D1B4B]">{card.value}</p>
            <p className="text-xs text-[#888] mt-0.5">{isAr ? card.labelAr : card.labelEn}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#D0EDEA] p-5">
          <h2 className="font-black text-[#0D1B4B] mb-4">{isAr ? 'الطلبات خلال الأسبوع' : 'Orders This Week'}</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0ECE4" />
              <XAxis dataKey={isAr ? 'day' : 'day'} tick={{ fontSize: 11, fill: '#888' }} />
              <YAxis tick={{ fontSize: 11, fill: '#888' }} />
              <Tooltip />
              <Line type="monotone" dataKey="orders" stroke="#00C9A7" strokeWidth={2.5} dot={{ fill: '#00C9A7', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl border border-[#D0EDEA] p-5">
          <h2 className="font-black text-[#0D1B4B] mb-4">{isAr ? 'إجراءات سريعة' : 'Quick Actions'}</h2>
          <div className="space-y-2">
            {[
              { labelAr: 'إضافة منتج جديد', labelEn: 'Add New Product', href: '/vendor/products', icon: '➕', color: '#3498DB' },
              { labelAr: 'الطلبات المعلقة', labelEn: 'Pending Orders', href: '/vendor/orders', icon: '⏳', color: '#F39C12', badge: pendingOrders.length },
              { labelAr: 'تقرير الأرباح', labelEn: 'Earnings Report', href: '/vendor/analytics', icon: '📊', color: '#2ECC71' },
              { labelAr: 'إعدادات المتجر', labelEn: 'Store Settings', href: '/vendor/settings', icon: '⚙️', color: '#9B59B6' },
            ].map(action => (
              <a key={action.labelEn} href={action.href}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F0F9F8] transition-colors border border-[#D0EDEA]">
                <span className="text-xl">{action.icon}</span>
                <span className="flex-1 text-sm font-black text-[#0D1B4B]">{isAr ? action.labelAr : action.labelEn}</span>
                {action.badge > 0 && (
                  <span className="w-5 h-5 bg-[#E74C3C] text-white text-[10px] font-black rounded-full flex items-center justify-center">{action.badge}</span>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="mt-4 bg-white rounded-2xl border border-[#D0EDEA] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0ECE4]">
          <h2 className="font-black text-[#0D1B4B]">{isAr ? 'آخر الطلبات' : 'Recent Orders'}</h2>
          <a href="/vendor/orders" className="text-xs font-black text-[#00C9A7] hover:underline">{isAr ? 'عرض الكل' : 'View All'}</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F0F9F8]">
              <tr>
                {[
                  isAr ? 'رقم الطلب' : 'Order ID',
                  isAr ? 'العميل' : 'Customer',
                  isAr ? 'المبلغ' : 'Amount',
                  isAr ? 'الحالة' : 'Status',
                  isAr ? 'الوقت' : 'Time',
                  isAr ? 'إجراء' : 'Action',
                ].map(h => (
                  <th key={h} className="px-4 py-3 text-start text-xs font-black text-[#888] uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0ECE4]">
              {recentOrders.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-[#999] text-sm">{isAr ? 'لا توجد طلبات' : 'No orders yet'}</td></tr>
              ) : recentOrders.map(order => (
                <tr key={order.id} className="hover:bg-[#F0F9F8]">
                  <td className="px-4 py-3 font-black text-[#0D1B4B] text-sm">{order.id}</td>
                  <td className="px-4 py-3 text-sm text-[#444]">{isAr ? order.customerNameAr : order.customerNameEn}</td>
                  <td className="px-4 py-3 font-black text-[#222] text-sm">{order.total} {isAr ? 'د' : 'AED'}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusMap[order.status]?.color || 'pending'}>
                      {isAr ? statusMap[order.status]?.ar : statusMap[order.status]?.en}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#888]">
                    {new Date(order.createdAt).toLocaleTimeString(isAr ? 'ar-AE' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-3">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        className="px-3 py-1.5 bg-[#0D1B4B] text-white text-xs font-black rounded-lg hover:bg-[#0A3D8F]"
                      >
                        {isAr ? 'قبول' : 'Accept'}
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'accepted')}
                        className="px-3 py-1.5 bg-[#2ECC71] text-white text-xs font-black rounded-lg hover:bg-green-600"
                      >
                        {isAr ? 'جاهز' : 'Ready'}
                      </button>
                    )}
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
