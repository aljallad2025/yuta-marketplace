import { useState, useMemo } from 'react'
import { RefreshCw } from 'lucide-react'
import Badge from '../../components/Badge'
import { useLang } from '../../i18n/LangContext'
import { useApp } from '../../store/appStore'
import { useStores } from '../../store/storesStore'

export default function AdminLiveMap() {
  const [selected, setSelected] = useState(null)
  const { t, isAr } = useLang()

  const stats = [
    { labelEn: 'Drivers Online', labelAr: 'السائقون متصلون', value: driversData.length, color: '#2ECC71' },
    { labelEn: 'Delivering', labelAr: 'يوصّل', value: driversData.filter(d => d.status === 'delivering').length, color: '#3498DB' },
    { labelEn: 'Active Orders', labelAr: 'طلبات نشطة', value: orders_active.length, color: '#F39C12' },
    { labelEn: 'On Rides', labelAr: 'في رحلات', value: driversData.filter(d => d.status === 'on_ride').length, color: '#9B59B6' },
  ]

  const legend = [
    { color: '#2ECC71', labelEn: 'Available', labelAr: 'متاح' },
    { color: '#3498DB', labelEn: 'Delivering', labelAr: 'يوصّل' },
    { color: '#9B59B6', labelEn: 'On Ride', labelAr: 'في رحلة' },
    { color: '#F39C12', labelEn: 'Order', labelAr: 'طلب' },
  ]

  const getStatusLabel = (status) => {
    if (status === 'delivering') return isAr ? 'يوصّل' : 'Delivering'
    if (status === 'on_ride') return isAr ? 'في رحلة' : 'On Ride'
    return isAr ? 'متاح' : 'Available'
  }

  const getStatusBadge = (status) => {
    if (status === 'delivering') return 'on_the_way'
    if (status === 'on_ride') return 'accepted'
    return 'active'
  }

  return (
    <div className="p-6 space-y-5" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#0F2A47]">{t('liveMap')}</h1>
          <p className="text-sm text-[#666]">{isAr ? 'تتبع السائقين والطلبات في الوقت الفعلي' : 'Real-time driver and order tracking'}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E8E4DC] rounded-xl text-sm text-[#444] shadow-sm">
            <RefreshCw size={14} className="text-[#C8A951]" /> {isAr ? 'تحديث' : 'Refresh'}
          </button>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-emerald-600 font-black">{isAr ? 'مباشر' : 'Live'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.labelEn} className="bg-white rounded-xl p-4 shadow-sm border border-[#E8E4DC] text-center">
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[#666] mt-0.5">{isAr ? s.labelAr : s.labelEn}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E8E4DC]">
          <div className="p-3 border-b border-[#F0ECE4] flex items-center gap-4">
            {legend.map(l => (
              <div key={l.labelEn} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: l.color }}></div>
                <span className="text-[#666] text-xs">{isAr ? l.labelAr : l.labelEn}</span>
              </div>
            ))}
          </div>

          <div className="relative bg-[#e8f4e4] overflow-hidden" style={{ height: '480px' }}>
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 640 480">
              {[0,80,160,240,320,400,480,560,640].map(x => (
                <line key={x} x1={x} y1="0" x2={x} y2="480" stroke="#c8e6c9" strokeWidth="1"/>
              ))}
              {[0,80,160,240,320,400,480].map(y => (
                <line key={y} x1="0" y1={y} x2="640" y2={y} stroke="#c8e6c9" strokeWidth="1"/>
              ))}
              <line x1="0" y1="160" x2="640" y2="160" stroke="#b2dfdb" strokeWidth="6"/>
              <line x1="0" y1="320" x2="640" y2="320" stroke="#b2dfdb" strokeWidth="6"/>
              <line x1="160" y1="0" x2="160" y2="480" stroke="#b2dfdb" strokeWidth="6"/>
              <line x1="400" y1="0" x2="400" y2="480" stroke="#b2dfdb" strokeWidth="6"/>

              {orders_active.map(order => (
                <g key={order.id}>
                  <circle cx={order.x} cy={order.y} r="14"
                    fill={order.status === 'on_the_way' ? '#3498DB' : order.status === 'preparing' ? '#9B59B6' : '#F39C12'}
                    opacity="0.85" />
                  <text x={order.x} y={order.y + 4} textAnchor="middle" fill="white" fontSize="10">📦</text>
                </g>
              ))}

              {driversData.map(driver => (
                <g key={driver.id} onClick={() => setSelected(driver)} style={{ cursor: 'pointer' }}>
                  <circle cx={driver.x} cy={driver.y} r="16"
                    fill={driver.status === 'delivering' ? '#3498DB' : driver.status === 'on_ride' ? '#9B59B6' : '#2ECC71'}
                    stroke="white" strokeWidth="2" opacity="0.9"/>
                  <text x={driver.x} y={driver.y + 4} textAnchor="middle" fill="white" fontSize="11">🚗</text>
                  {driver.status === 'delivering' && (
                    <>
                      <circle cx={driver.x + 11} cy={driver.y - 11} r="7" fill="#E74C3C" />
                      <text x={driver.x + 11} y={driver.y - 7} textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">
                        {driver.orders}
                      </text>
                    </>
                  )}
                </g>
              ))}

              <text x="20" y="200" fill="#666" fontSize="10" opacity="0.7">{isAr ? 'دبي مارينا' : 'Dubai Marina'}</text>
              <text x="290" y="100" fill="#666" fontSize="10" opacity="0.7">{isAr ? 'وسط المدينة' : 'Downtown Dubai'}</text>
              <text x="430" y="360" fill="#666" fontSize="10" opacity="0.7">{isAr ? 'خليج الأعمال' : 'Business Bay'}</text>
              <text x="80" y="380" fill="#666" fontSize="10" opacity="0.7">JBR</text>
            </svg>

            {selected && (
              <div className="absolute top-4 start-4 bg-white rounded-xl p-3 shadow-lg border border-[#E8E4DC] w-48">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-black text-xs text-[#0F2A47]">{isAr ? selected.nameAr : selected.nameEn}</p>
                  <button onClick={() => setSelected(null)} className="text-[#999] hover:text-[#666] text-xs">✕</button>
                </div>
                <Badge status={getStatusBadge(selected.status)} label={getStatusLabel(selected.status)} />
                {selected.orders > 0 && (
                  <p className="text-xs text-[#666] mt-1">
                    {isAr ? `${selected.orders} طلبات نشطة` : `${selected.orders} active order(s)`}
                  </p>
                )}
                <button className="mt-2 w-full py-1.5 bg-[#0F2A47] text-white text-xs rounded-lg font-black">
                  {isAr ? 'عرض التفاصيل' : 'View Details'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#E8E4DC]">
          <div className="p-4 border-b border-[#F0ECE4]">
            <h2 className="font-black text-[#0F2A47]">{isAr ? 'السائقون' : 'Drivers'}</h2>
          </div>
          <div className="p-3 space-y-2 overflow-y-auto" style={{ maxHeight: '520px' }}>
            {driversData.map(driver => (
              <button key={driver.id} onClick={() => setSelected(driver)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-start ${
                  selected?.id === driver.id ? 'border-[#0F2A47] bg-[#0F2A47]/5' : 'border-[#F0ECE4] hover:border-[#C8A951]/30'
                }`}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-sm"
                  style={{ backgroundColor: driver.status === 'delivering' ? '#3498DB' : driver.status === 'on_ride' ? '#9B59B6' : '#2ECC71' }}>
                  {(isAr ? driver.nameAr : driver.nameEn).charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-black text-xs text-[#222]">{isAr ? driver.nameAr : driver.nameEn}</p>
                  <Badge status={getStatusBadge(driver.status)} label={getStatusLabel(driver.status)} className="mt-0.5" />
                </div>
                {driver.orders > 0 && (
                  <div className="w-5 h-5 bg-[#E74C3C] rounded-full flex items-center justify-center">
                    <span className="text-white text-[9px] font-black">{driver.orders}</span>
                  </div>
                )}
              </button>
            ))}

            <div className="pt-3 mt-3 border-t border-[#F0ECE4]">
              <p className="text-xs font-black text-[#444] mb-2">{isAr ? 'الطلبات النشطة' : 'Active Orders'}</p>
              {orders_active.map(order => (
                <div key={order.id} className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FBF8F2] mb-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                    style={{ backgroundColor: order.status === 'on_the_way' ? '#3498DB20' : '#F3930220' }}>
                    📦
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-black text-[#222]">{order.id}</p>
                    <p className="text-[10px] text-[#666]">{isAr ? order.fromAr : order.fromEn}</p>
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
