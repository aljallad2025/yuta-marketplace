import { useState } from 'react'
import {
  Package, Car, CheckCircle, Clock, MapPin, Phone, Navigation,
  Bell, DollarSign, Star, LogOut, ChevronRight, RefreshCw, X,
  TrendingUp, Wallet, BarChart3, Settings, Home, History
} from 'lucide-react'
import { useLang } from '../../i18n/LangContext'
import LangToggle from '../../components/LangToggle'
import { useApp } from '../../store/appStore'
import { useAuth } from '../../store/authStore'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

const earningsWeekly = [
  { day: 'السبت', dayEn: 'Sat', earn: 186 },
  { day: 'الأحد', dayEn: 'Sun', earn: 220 },
  { day: 'الاثنين', dayEn: 'Mon', earn: 155 },
  { day: 'الثلاثاء', dayEn: 'Tue', earn: 270 },
  { day: 'الأربعاء', dayEn: 'Wed', earn: 198 },
  { day: 'الخميس', dayEn: 'Thu', earn: 315 },
  { day: 'الجمعة', dayEn: 'Fri', earn: 290 },
]

export default function DriverDashboard() {
  const [online, setOnline] = useState(true)
  const [activeDelivery, setActiveDelivery] = useState(null)
  const [tab, setTab] = useState('orders')
  const [showSuccess, setShowSuccess] = useState(false)
  const navigate = useNavigate()
  const { isAr } = useLang()
  const { logout, currentUser } = useAuth()
  const {
    orders, updateOrderStatus, drivers, updateDriver,
    getDriverOrders, getDriverStats, notifications, unreadCount
  } = useApp()

  // Use logged-in driver's ID from auth
  const loggedDriverId = currentUser?.driverId || currentUser?.driver_id
  const driver = drivers.find(d => d.id === loggedDriverId) || drivers[0]
  const driverStats = getDriverStats(loggedDriverId)

  // Available orders: accepted by store, no driver yet
  const availableOrders = orders.filter(o => o.status === 'accepted' && !o.driverId)
  // My active deliveries
  const myDeliveries = orders.filter(o => o.driverId === loggedDriverId && o.status === 'on_the_way')
  // My history
  const myHistory = orders.filter(o => o.driverId === loggedDriverId && o.status === 'completed')

  const acceptOrder = (order) => {
    updateOrderStatus(order.id, 'on_the_way', loggedDriverId)
    setActiveDelivery(order)
  }

  const completeDelivery = () => {
    if (activeDelivery) {
      updateOrderStatus(activeDelivery.id, 'completed')
      setActiveDelivery(null)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }
  }

  const todayStats = [
    { labelEn: 'Deliveries', labelAr: 'التوصيلات', value: driverStats.todayDeliveries || myHistory.length, icon: Package, color: '#3498DB' },
    { labelEn: 'Earnings', labelAr: 'الأرباح', value: `${driverStats.todayEarnings || (myHistory.length * 15)} ${isAr ? 'د' : 'AED'}`, icon: DollarSign, color: '#2ECC71' },
    { labelEn: 'Rating', labelAr: 'التقييم', value: `${driver?.rating || 4.9} ⭐`, icon: Star, color: '#C8A951' },
    { labelEn: 'Active', labelAr: 'نشط', value: myDeliveries.length > 0 ? (isAr ? 'يوصّل' : 'Delivering') : (online ? (isAr ? 'جاهز' : 'Ready') : (isAr ? 'مغلق' : 'Offline')), icon: Car, color: '#9B59B6' },
  ]

  return (
    <div className="min-h-screen bg-[#FBF8F2] font-[Tajawal,Cairo,Inter,sans-serif]" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Success toast */}
      {showSuccess && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 font-black text-sm">
          <CheckCircle size={16} /> {isAr ? '✓ تم التوصيل بنجاح!' : '✓ Delivery completed!'}
        </div>
      )}

      {/* Header */}
      <div className="bg-[#0F2A47] px-4 pt-4 pb-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#C8A951] rounded-full flex items-center justify-center font-black text-[#0F2A47] text-sm">
              {(isAr ? driver?.nameAr : driver?.nameEn)?.[0] || 'م'}
            </div>
            <div>
              <p className="font-black text-white text-sm">{isAr ? driver?.nameAr : driver?.nameEn}</p>
              <p className="text-white/50 text-xs">{driver?.id} · {isAr ? driver?.vehicleAr : driver?.vehicleEn}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LangToggle className="border-white/20 bg-white/10 text-white" />
            <button className="relative p-2 text-white/60 hover:text-white">
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#E74C3C] rounded-full text-[9px] text-white font-black flex items-center justify-center">{unreadCount}</span>
              )}
            </button>
            <button onClick={() => { logout(); navigate('/driver/login') }} className="p-2 text-white/60 hover:text-white">
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Online toggle */}
        <div className="bg-white/10 rounded-2xl p-3 flex items-center justify-between mb-3">
          <div>
            <p className="font-black text-white text-sm">{isAr ? 'الحالة' : 'Status'}</p>
            <p className={`text-sm font-black mt-0.5 ${online ? 'text-emerald-400' : 'text-white/40'}`}>
              {online
                ? (myDeliveries.length > 0 ? (isAr ? '🚴 يوصّل حالياً' : '🚴 Currently Delivering') : (isAr ? '● متصل — يستقبل طلبات' : '● Online — Receiving orders'))
                : (isAr ? '○ غير متصل' : '○ Offline')}
            </p>
          </div>
          <button onClick={() => setOnline(!online)}
            className={`relative w-14 h-7 rounded-full transition-all duration-300 ${online ? 'bg-emerald-500' : 'bg-white/20'}`}>
            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${online ? (isAr ? 'left-1' : 'left-8') : (isAr ? 'left-8' : 'left-1')}`}></div>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          {todayStats.map(s => (
            <div key={s.labelEn} className="bg-white/10 rounded-xl p-2.5 text-center">
              <s.icon size={14} style={{ color: s.color }} className="mx-auto mb-1" />
              <p className="text-white font-black text-xs">{s.value}</p>
              <p className="text-white/50 text-[9px] mt-0.5">{isAr ? s.labelAr : s.labelEn}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Active delivery banner */}
      {activeDelivery && (
        <div className="mx-4 -mt-3 bg-[#C8A951] rounded-2xl p-4 shadow-xl relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="font-black text-[#0F2A47] text-sm">🚴 {isAr ? 'توصيل نشط' : 'Active Delivery'} — {activeDelivery.id}</span>
            <span className="text-[#0F2A47]/70 text-xs font-black">~3.5 km</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#0F2A47] mb-3">
            <MapPin size={13} />
            <span className="font-black truncate">{isAr ? activeDelivery.addressAr : activeDelivery.addressEn}</span>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#0F2A47] text-white text-xs font-black rounded-xl">
              <Navigation size={13} /> {isAr ? 'خريطة' : 'Map'}
            </button>
            <a href={`tel:${activeDelivery.customerPhone}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white text-[#0F2A47] text-xs font-black rounded-xl">
              <Phone size={13} /> {isAr ? 'اتصال' : 'Call'}
            </a>
            <button onClick={completeDelivery}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-600 text-white text-xs font-black rounded-xl">
              <CheckCircle size={13} /> {isAr ? 'تم' : 'Done'}
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className={`flex border-b border-[#E8E4DC] bg-white px-4 ${activeDelivery ? 'mt-2' : 'mt-3'}`}>
        {[
          { key: 'orders', labelEn: 'Available', labelAr: 'متاحة', count: availableOrders.length },
          { key: 'active', labelEn: 'Active', labelAr: 'نشط', count: myDeliveries.length },
          { key: 'history', labelEn: 'History', labelAr: 'السجل', count: null },
          { key: 'earnings', labelEn: 'Earnings', labelAr: 'الأرباح', count: null },
        ].map(tb => (
          <button key={tb.key} onClick={() => setTab(tb.key)}
            className={`flex-1 py-3 text-xs font-black border-b-2 transition-all flex items-center justify-center gap-1 ${
              tab === tb.key ? 'border-[#C8A951] text-[#0F2A47]' : 'border-transparent text-[#999]'
            }`}>
            {isAr ? tb.labelAr : tb.labelEn}
            {tb.count > 0 && (
              <span className="w-4 h-4 bg-[#E74C3C] text-white text-[9px] rounded-full flex items-center justify-center">{tb.count}</span>
            )}
          </button>
        ))}
      </div>

      <div className="px-4 py-4">
        {/* Available orders */}
        {tab === 'orders' && (
          <div className="space-y-3">
            {!online ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-3">😴</div>
                <p className="font-black text-[#444]">{isAr ? 'أنت غير متصل' : 'You are offline'}</p>
                <button onClick={() => setOnline(true)} className="mt-4 px-5 py-2.5 bg-[#0F2A47] text-white text-sm font-black rounded-xl">
                  {isAr ? 'الاتصال الآن' : 'Go Online'}
                </button>
              </div>
            ) : availableOrders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-3">⏳</div>
                <p className="font-black text-[#444]">{isAr ? 'في انتظار الطلبات...' : 'Waiting for orders...'}</p>
                <p className="text-sm text-[#999] mt-1">{isAr ? 'ستظهر الطلبات هنا فور تحضيرها' : 'Orders will appear here once ready'}</p>
              </div>
            ) : availableOrders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl border-2 border-[#E8E4DC] p-4 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-black text-[#0F2A47] text-sm">{order.id}</p>
                    <p className="text-xs text-[#666] mt-0.5">{order.items.length} {isAr ? 'منتجات' : 'items'} · {isAr ? order.customerNameAr : order.customerNameEn}</p>
                  </div>
                  <div className="text-end">
                    <p className="font-black text-[#2ECC71] text-lg">15 <span className="text-xs">{isAr ? 'د' : 'AED'}</span></p>
                    <p className="text-xs text-[#999]">~3.2 km</p>
                  </div>
                </div>
                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center gap-2 text-xs text-[#666]">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span>{isAr ? 'الاستلام من المتجر' : 'Pickup from store'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#666]">
                    <div className="w-2 h-2 bg-[#E74C3C] rounded-full"></div>
                    <span className="truncate">{isAr ? order.addressAr : order.addressEn}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateOrderStatus(order.id, 'accepted')}
                    className="flex-1 py-2 border border-[#E8E4DC] text-[#666] text-xs font-black rounded-xl hover:bg-[#FBF8F2]">
                    {isAr ? 'تجاهل' : 'Skip'}
                  </button>
                  <button onClick={() => acceptOrder(order)}
                    className="flex-1 py-2 bg-[#0F2A47] text-white text-xs font-black rounded-xl">
                    ✓ {isAr ? 'قبول الطلب' : 'Accept Order'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Active deliveries */}
        {tab === 'active' && (
          <div className="space-y-3">
            {myDeliveries.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-3">🛵</div>
                <p className="font-black text-[#444]">{isAr ? 'لا توجد توصيلات نشطة' : 'No active deliveries'}</p>
              </div>
            ) : myDeliveries.map(order => (
              <div key={order.id} className="bg-white rounded-2xl border-2 border-[#C8A951]/40 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-black text-[#0F2A47]">{order.id}</span>
                  <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">{isAr ? 'في الطريق' : 'On the Way'}</span>
                </div>
                <div className="flex items-start gap-2 mb-3">
                  <MapPin size={14} className="text-[#C8A951] mt-0.5" />
                  <span className="text-sm text-[#444]">{isAr ? order.addressAr : order.addressEn}</span>
                </div>
                <div className="flex gap-2">
                  <a href={`tel:${order.customerPhone}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-[#E8E4DC] text-[#0F2A47] text-xs font-black rounded-xl">
                    <Phone size={13} /> {isAr ? 'اتصال' : 'Call'}
                  </a>
                  <button onClick={() => { updateOrderStatus(order.id, 'completed'); setShowSuccess(true); setTimeout(() => setShowSuccess(false), 3000) }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-emerald-600 text-white text-xs font-black rounded-xl">
                    <CheckCircle size={13} /> {isAr ? 'تم التوصيل' : 'Delivered'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* History */}
        {tab === 'history' && (
          <div className="space-y-3">
            {myHistory.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-3">📦</div>
                <p className="font-black text-[#444]">{isAr ? 'لا توجد توصيلات مكتملة' : 'No completed deliveries'}</p>
              </div>
            ) : myHistory.map(order => (
              <div key={order.id} className="bg-white rounded-2xl border border-[#E8E4DC] p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">📦</div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm text-[#222]">{order.id}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <MapPin size={10} className="text-[#C8A951]" />
                    <span className="text-xs text-[#666] truncate">{isAr ? order.addressAr : order.addressEn}</span>
                  </div>
                </div>
                <div className="text-end flex-shrink-0">
                  <p className="font-black text-[#2ECC71]">+15 {isAr ? 'د' : 'AED'}</p>
                  <p className="text-xs text-[#999]">⭐⭐⭐⭐⭐</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Earnings */}
        {tab === 'earnings' && (
          <div className="space-y-4">
            <div className="bg-[#0F2A47] rounded-2xl p-5 text-center">
              <p className="text-white/60 text-sm">{isAr ? 'أرباح اليوم' : "Today's Earnings"}</p>
              <p className="text-4xl font-black text-[#C8A951] mt-1">{driverStats.todayEarnings || myHistory.length * 15}</p>
              <p className="text-white/60 text-sm">{isAr ? 'درهم' : 'AED'}</p>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { labelEn: 'This Week', labelAr: 'الأسبوع', val: '1,634' },
                  { labelEn: 'This Month', labelAr: 'الشهر', val: '4,820' },
                  { labelEn: 'Total', labelAr: 'الإجمالي', val: driver?.earnings?.toLocaleString() || '12,400' },
                ].map(e => (
                  <div key={e.labelEn} className="bg-white/10 rounded-xl p-2.5 text-center">
                    <p className="text-white font-black text-sm">{e.val}</p>
                    <p className="text-white/50 text-[10px]">{isAr ? e.labelAr : e.labelEn}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly chart */}
            <div className="bg-white rounded-2xl border border-[#E8E4DC] p-4">
              <h3 className="font-black text-[#0F2A47] mb-3 text-sm">{isAr ? 'الأرباح اليومية' : 'Daily Earnings'}</h3>
              <ResponsiveContainer width="100%" height={130}>
                <BarChart data={earningsWeekly}>
                  <XAxis dataKey={isAr ? 'day' : 'dayEn'} tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="earn" fill="#C8A951" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8E4DC] p-4">
              <h3 className="font-black text-[#0F2A47] mb-3 text-sm">{isAr ? 'ملخص اليوم' : "Today's Summary"}</h3>
              {[
                { labelEn: 'Completed Deliveries', labelAr: 'توصيلات منجزة', val: driverStats.todayDeliveries || myHistory.length },
                { labelEn: 'Avg per Delivery', labelAr: 'متوسط كل توصيلة', val: `15 ${isAr ? 'د' : 'AED'}` },
                { labelEn: 'Online Hours', labelAr: 'ساعات الاتصال', val: '7.5h' },
                { labelEn: 'Total Trips', labelAr: 'إجمالي الرحلات', val: driver?.trips || 1240 },
              ].map(item => (
                <div key={item.labelEn} className="flex items-center justify-between py-2.5 border-b border-[#F0ECE4] last:border-0">
                  <span className="text-sm text-[#666]">{isAr ? item.labelAr : item.labelEn}</span>
                  <span className="font-black text-[#222] text-sm">{item.val}</span>
                </div>
              ))}
            </div>

            <button className="w-full py-3 bg-[#C8A951] text-[#0F2A47] font-black rounded-xl flex items-center justify-center gap-2">
              <DollarSign size={16} /> {isAr ? 'طلب سحب الأرباح' : 'Request Payout'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
