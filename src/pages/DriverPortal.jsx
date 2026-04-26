import { useState } from 'react'
import { Package, Car, CheckCircle, Clock, MapPin, Phone, Navigation, Bell, DollarSign, Star, LogOut, ChevronRight, RefreshCw } from 'lucide-react'
import { useLang } from '../i18n/LangContext'
import LangToggle from '../components/LangToggle'

const pendingOrders = [
  { id: 'ORD-4821', type: 'delivery', storeEn: 'Baharat Restaurant', storeAr: 'مطعم بهارات', itemsEn: '2x Mixed Grill, 1x Juice', itemsAr: '٢ مشاوي مشكلة، ١ عصير', fromEn: 'Dubai Marina, Block A', fromAr: 'دبي مارينا، مبنى A', toEn: 'JBR Beach Residence', toAr: 'مساكن شاطئ JBR', distance: '3.2 km', earning: 18, eta: '12 min', urgent: true },
  { id: 'ORD-4820', type: 'delivery', storeEn: 'Fresh Mart', storeAr: 'فريش مارت', itemsEn: '1x Grocery bag', itemsAr: '١ حقيبة بقالة', fromEn: 'Barsha Heights', fromAr: 'برشا هايتس', toEn: 'Al Quoz Residence', toAr: 'مساكن القوز', distance: '5.8 km', earning: 24, eta: '22 min', urgent: false },
]

const todayStats = [
  { labelEn: 'Deliveries', labelAr: 'التوصيلات', value: 14, icon: Package, color: '#3498DB' },
  { labelEn: 'Earnings', labelAr: 'الأرباح', value: '186 AED', valueAr: '١٨٦ درهم', icon: DollarSign, color: '#2ECC71' },
  { labelEn: 'Avg Rating', labelAr: 'متوسط التقييم', value: '4.9 ⭐', icon: Star, color: '#00C9A7' },
  { labelEn: 'Km Driven', labelAr: 'المسافة', value: '48 km', icon: Car, color: '#9B59B6' },
]

const recentDeliveries = [
  { id: 'ORD-4819', storeEn: 'Rida Clean', storeAr: 'ريدا كلين', toEn: 'Business Bay', toAr: 'خليج الأعمال', earning: 15, rating: 5, time: '1:10 PM' },
  { id: 'ORD-4818', storeEn: 'Baharat Restaurant', storeAr: 'مطعم بهارات', toEn: 'Downtown Dubai', toAr: 'وسط مدينة دبي', earning: 22, rating: 5, time: '12:30 PM' },
  { id: 'ORD-4817', storeEn: 'Fresh Mart', storeAr: 'فريش مارت', toEn: 'DIFC', toAr: 'مركز دبي المالي', earning: 19, rating: 4, time: '11:45 AM' },
  { id: 'ORD-4816', storeEn: 'Al Shifa Pharmacy', storeAr: 'صيدلية الشفاء', toEn: 'Palm Jumeirah', toAr: 'نخلة جميرا', earning: 28, rating: 5, time: '10:20 AM' },
]

export default function DriverPortal() {
  const [online, setOnline] = useState(true)
  const [activeDelivery, setActiveDelivery] = useState(null)
  const [tab, setTab] = useState('orders') // orders | history | earnings
  const { isAr } = useLang()

  const acceptOrder = (order) => setActiveDelivery(order)
  const completeDelivery = () => setActiveDelivery(null)

  return (
    <div className="min-h-screen bg-[#F0F9F8] font-[Tajawal,Cairo,Inter,sans-serif]" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-[#0D1B4B] px-4 pt-4 pb-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00C9A7] rounded-full flex items-center justify-center font-black text-[#0D1B4B]">م</div>
            <div>
              <p className="font-black text-white text-sm">{isAr ? 'محمد العامري' : 'Mohammed Al Ameri'}</p>
              <p className="text-white/50 text-xs">DRV-001 · Toyota Corolla</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LangToggle className="border-white/20 bg-white/10 text-white" />
            <button className="relative p-2 text-white/60 hover:text-white">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#E74C3C] rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Online toggle */}
        <div className="bg-white/10 rounded-2xl p-3 flex items-center justify-between">
          <div>
            <p className="font-black text-white text-sm">{isAr ? 'الحالة' : 'Status'}</p>
            <p className={`text-sm font-black mt-0.5 ${online ? 'text-emerald-400' : 'text-white/40'}`}>
              {online ? (isAr ? '● متصل — يستقبل طلبات' : '● Online — Receiving orders') : (isAr ? '○ غير متصل' : '○ Offline')}
            </p>
          </div>
          <button onClick={() => setOnline(!online)}
            className={`relative w-14 h-7 rounded-full transition-all duration-300 ${online ? 'bg-emerald-500' : 'bg-white/20'}`}>
            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${online ? (isAr ? 'left-1' : 'left-8') : (isAr ? 'left-8' : 'left-1')}`}></div>
          </button>
        </div>

        {/* Today stats */}
        <div className="grid grid-cols-4 gap-2 mt-3">
          {todayStats.map(s => (
            <div key={s.labelEn} className="bg-white/10 rounded-xl p-2.5 text-center">
              <p className="text-white font-black text-sm">{s.value}</p>
              <p className="text-white/50 text-[9px] mt-0.5">{isAr ? s.labelAr : s.labelEn}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Active delivery banner */}
      {activeDelivery && (
        <div className="mx-4 -mt-3 bg-[#00C9A7] rounded-2xl p-4 shadow-xl relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="font-black text-[#0D1B4B] text-sm">🚴 {isAr ? 'توصيل نشط' : 'Active Delivery'} — {activeDelivery.id}</span>
            <span className="text-[#0D1B4B]/70 text-xs font-black">{activeDelivery.distance}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#0D1B4B] mb-3">
            <MapPin size={13} className="text-[#0D1B4B]/60 flex-shrink-0" />
            <span className="truncate font-black">{isAr ? activeDelivery.toAr : activeDelivery.toEn}</span>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#0D1B4B] text-white text-xs font-black rounded-xl">
              <Navigation size={13} /> {isAr ? 'فتح الخريطة' : 'Open Map'}
            </button>
            <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white text-[#0D1B4B] text-xs font-black rounded-xl">
              <Phone size={13} /> {isAr ? 'اتصال بالعميل' : 'Call Customer'}
            </button>
            <button onClick={completeDelivery}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-600 text-white text-xs font-black rounded-xl">
              <CheckCircle size={13} /> {getL(lang,'Delivered','จัดส่งแล้ว','ສົ່ງແລ້ວ','Đã giao')}
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-[#D0EDEA] bg-white mt-3 px-4">
        {[
          { key: 'orders', labelEn: 'New Orders', labelAr: 'طلبات جديدة' },
          { key: 'history', labelEn: 'History', labelAr: 'السجل' },
          { key: 'earnings', labelEn: 'Earnings', labelAr: 'الأرباح' },
        ].map(tb => (
          <button key={tb.key} onClick={() => setTab(tb.key)}
            className={`flex-1 py-3 text-sm font-black border-b-2 transition-all ${
              tab === tb.key ? 'border-[#00C9A7] text-[#0D1B4B]' : 'border-transparent text-[#999]'
            }`}>
            {isAr ? tb.labelAr : tb.labelEn}
          </button>
        ))}
      </div>

      <div className="px-4 py-4">
        {/* New Orders tab */}
        {tab === 'orders' && (
          <div className="space-y-3">
            {!online ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-3">😴</div>
                <p className="font-black text-[#444]">{isAr ? 'أنت غير متصل' : 'You are offline'}</p>
                <p className="text-sm text-[#999] mt-1">{isAr ? 'فعّل الاتصال لاستقبال الطلبات' : 'Go online to receive orders'}</p>
                <button onClick={() => setOnline(true)} className="mt-4 px-5 py-2.5 bg-[#0D1B4B] text-white text-sm font-black rounded-xl">
                  {isAr ? 'الاتصال الآن' : 'Go Online'}
                </button>
              </div>
            ) : pendingOrders.map(order => (
              <div key={order.id} className={`bg-white rounded-2xl border-2 shadow-sm p-4 ${order.urgent ? 'border-[#E74C3C]/40' : 'border-[#D0EDEA]'}`}>
                {order.urgent && (
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="w-2 h-2 bg-[#E74C3C] rounded-full animate-pulse"></span>
                    <span className="text-xs font-black text-[#E74C3C]">{isAr ? 'طلب عاجل' : 'Urgent Order'}</span>
                  </div>
                )}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-black text-[#0D1B4B] text-sm">{isAr ? order.storeAr : order.storeEn}</p>
                    <p className="text-xs text-[#666] mt-0.5">{isAr ? order.itemsAr : order.itemsEn}</p>
                  </div>
                  <div className="text-end">
                    <p className="font-black text-[#2ECC71] text-lg">{order.earning} <span className="text-xs">{isAr ? 'د' : 'AED'}</span></p>
                    <p className="text-xs text-[#999]">{order.distance}</p>
                  </div>
                </div>
                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center gap-2 text-xs text-[#666]">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0"></div>
                    <span className="truncate">{isAr ? order.fromAr : order.fromEn}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#666]">
                    <div className="w-2 h-2 bg-[#E74C3C] rounded-full flex-shrink-0"></div>
                    <span className="truncate">{isAr ? order.toAr : order.toEn}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-[#666]">
                    <Clock size={11} /> {order.eta}
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-2 border border-[#D0EDEA] text-[#666] text-xs font-black rounded-xl hover:bg-[#F0F9F8]">
                      {isAr ? 'رفض' : 'Decline'}
                    </button>
                    <button onClick={() => acceptOrder(order)}
                      className="px-4 py-2 bg-[#0D1B4B] text-white text-xs font-black rounded-xl">
                      {isAr ? '✓ قبول الطلب' : '✓ Accept Order'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {online && pendingOrders.length === 0 && (
              <div className="text-center py-12">
                <div className="text-5xl mb-3">⏳</div>
                <p className="font-black text-[#444]">{isAr ? 'في انتظار الطلبات...' : 'Waiting for orders...'}</p>
              </div>
            )}
          </div>
        )}

        {/* History tab */}
        {tab === 'history' && (
          <div className="space-y-3">
            {recentDeliveries.map((d, i) => (
              <div key={d.id} className="bg-white rounded-2xl border border-[#D0EDEA] p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0D1B4B]/5 rounded-xl flex items-center justify-center text-xl flex-shrink-0">📦</div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm text-[#222]">{isAr ? d.storeAr : d.storeEn}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <MapPin size={10} className="text-[#00C9A7]" />
                    <span className="text-xs text-[#666] truncate">{isAr ? d.toAr : d.toEn}</span>
                    <span className="text-xs text-[#999]">· {d.time}</span>
                  </div>
                </div>
                <div className="text-end flex-shrink-0">
                  <p className="font-black text-[#2ECC71]">+{d.earning} {isAr ? 'د' : 'AED'}</p>
                  <div className="flex items-center gap-0.5 justify-end mt-0.5">
                    {'⭐'.repeat(d.rating)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Earnings tab */}
        {tab === 'earnings' && (
          <div className="space-y-4">
            <div className="bg-[#0D1B4B] rounded-2xl p-5 text-center">
              <p className="text-white/60 text-sm">{isAr ? 'أرباح اليوم' : "Today's Earnings"}</p>
              <p className="text-4xl font-black text-[#00C9A7] mt-1">186</p>
              <p className="text-white/60 text-sm">{isAr ? 'درهم' : 'AED'}</p>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { labelEn: 'This Week', labelAr: 'هذا الأسبوع', val: '1,240' },
                  { labelEn: 'This Month', labelAr: 'هذا الشهر', val: '4,820' },
                  { labelEn: 'Total', labelAr: 'الإجمالي', val: '12,400' },
                ].map(e => (
                  <div key={e.labelEn} className="bg-white/10 rounded-xl p-2.5 text-center">
                    <p className="text-white font-black text-sm">{e.val}</p>
                    <p className="text-white/50 text-[10px]">{isAr ? e.labelAr : e.labelEn}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#D0EDEA] p-4">
              <h3 className="font-black text-[#0D1B4B] mb-3">{isAr ? 'ملخص اليوم' : "Today's Summary"}</h3>
              {[
                { labelEn: 'Deliveries Completed', labelAr: 'توصيلات منجزة', val: 14 },
                { labelEn: 'Average per Delivery', labelAr: 'متوسط كل توصيلة', val: `13.3 ${isAr ? 'د' : 'AED'}` },
                { labelEn: 'Tips Received', labelAr: 'البقشيش', val: `22 ${isAr ? 'د' : 'AED'}` },
                { labelEn: 'Online Hours', labelAr: 'ساعات الاتصال', val: '7.5h' },
              ].map(item => (
                <div key={item.labelEn} className="flex items-center justify-between py-2.5 border-b border-[#F0ECE4] last:border-0">
                  <span className="text-sm text-[#666]">{isAr ? item.labelAr : item.labelEn}</span>
                  <span className="font-black text-[#222] text-sm">{item.val}</span>
                </div>
              ))}
            </div>

            <button className="w-full py-3 bg-[#00C9A7] text-[#0D1B4B] font-black rounded-xl flex items-center justify-center gap-2">
              <DollarSign size={16} /> {isAr ? 'طلب سحب الأرباح' : 'Request Payout'}
            </button>
          </div>
        )}
      </div>

      {/* Bottom logout */}
      <div className="px-4 pb-6 mt-2">
        <button className="w-full flex items-center justify-center gap-2 py-3 text-[#666] bg-white border border-[#D0EDEA] rounded-xl text-sm font-black">
          <LogOut size={14} /> {getL(lang,'Sign Out','ออกจากระบบ','ອອກ','Đăng xuất')}
        </button>
      </div>
    </div>
  )
}
