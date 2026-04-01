import { useState } from 'react'
import { Clock, Package, ChevronRight, MapPin, Star, RotateCcw } from 'lucide-react'
import Badge from '../components/Badge'
import { useLang } from '../i18n/LangContext'

const orders = [
  { id: 'SUW-2841', storeEn: 'Baharat Restaurant', storeAr: 'مطعم بهارات', itemsEn: ['Mixed Grill Platter', 'Lamb Ouzi x2'], itemsAr: ['طبق المشاوي المشكلة', 'لحم أوزي ×٢'], status: 'on_the_way', total: 254, dateEn: 'Today, 12:45 PM', dateAr: 'اليوم، ١٢:٤٥ م', eta: '12', etaAr: '١٢', emoji: '🍽️' },
  { id: 'SUW-2810', storeEn: 'Alshifa Pharmacy', storeAr: 'صيدلية الشفاء', itemsEn: ['Panadol x2', 'Vitamin C'], itemsAr: ['بنادول ×٢', 'فيتامين C'], status: 'completed', total: 48, dateEn: 'Yesterday, 8:20 AM', dateAr: 'أمس، ٨:٢٠ ص', emoji: '💊' },
  { id: 'SUW-2789', storeEn: 'Fresh Mart', storeAr: 'فريش مارت', itemsEn: ['Groceries (12 items)'], itemsAr: ['بقالة (١٢ منتج)'], status: 'completed', total: 187, dateEn: 'Mar 28, 5:30 PM', dateAr: '٢٨ مارس، ٥:٣٠ م', emoji: '🛒' },
  { id: 'SUW-2760', storeEn: 'Burgetino', storeAr: 'برجتينو', itemsEn: ['Beef Burger x2', 'Fries x2'], itemsAr: ['برجر لحم ×٢', 'بطاطس ×٢'], status: 'cancelled', total: 96, dateEn: 'Mar 25, 1:00 PM', dateAr: '٢٥ مارس، ١:٠٠ م', emoji: '🍔' },
]

const steps = ['pending', 'accepted', 'preparing', 'on_the_way', 'delivered']
const stepsEn = ['Pending', 'Accepted', 'Preparing', 'On the way', 'Delivered']
const stepsAr = ['قيد الانتظار', 'تم القبول', 'جاري التحضير', 'في الطريق', 'تم التوصيل']

export default function WebOrders() {
  const [activeTab, setActiveTab] = useState('all')
  const [expanded, setExpanded] = useState('SUW-2841')
  const { t, isAr } = useLang()

  const tabs = [
    { id: 'all', label: t('all') },
    { id: 'active', label: t('active') },
    { id: 'completed', label: t('completed') },
    { id: 'cancelled', label: t('cancelled') },
  ]

  const filtered = orders.filter(o => {
    if (activeTab === 'all') return true
    if (activeTab === 'active') return ['pending', 'accepted', 'preparing', 'on_the_way'].includes(o.status)
    if (activeTab === 'completed') return o.status === 'completed'
    if (activeTab === 'cancelled') return o.status === 'cancelled'
    return true
  })

  const getActiveStep = (status) => steps.indexOf(status)

  return (
    <div className="min-h-screen bg-[#FBF8F2]" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="bg-[#0F2A47] py-7 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-black text-white">{t('myOrders')}</h1>
          <p className="text-white/50 text-sm mt-1">{t('trackAndManage')}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-5">
        {/* Tabs */}
        <div className="flex gap-1 mb-5 bg-white rounded-2xl p-1 shadow-sm border border-[#E8E4DC]">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id ? 'bg-[#0F2A47] text-white' : 'text-[#666] hover:text-[#222]'
              }`}>{tab.label}</button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map(order => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-[#E8E4DC] overflow-hidden">
              <button onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                className="w-full p-4 flex items-center gap-4 text-left hover:bg-[#FBF8F2]/50">
                <div className="w-12 h-12 rounded-xl bg-[#FBF8F2] flex items-center justify-center text-2xl border border-[#E8E4DC]">{order.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-black text-[#0F2A47] text-sm">{isAr ? order.storeAr : order.storeEn}</p>
                    <Badge status={order.status} label={isAr
                      ? (order.status === 'on_the_way' ? 'في الطريق' : order.status === 'completed' ? 'مكتمل' : order.status === 'cancelled' ? 'ملغي' : order.status === 'pending' ? 'قيد الانتظار' : order.status === 'preparing' ? 'يُحضَّر' : order.status)
                      : undefined} />
                  </div>
                  <p className="text-xs text-[#999] mt-0.5">{order.id} · {isAr ? order.dateAr : order.dateEn}</p>
                  <p className="text-xs text-[#888] mt-0.5 truncate">{(isAr ? order.itemsAr : order.itemsEn).join('، ')}</p>
                </div>
                <div className="text-right flex-shrink-0 ms-2">
                  <p className="font-black text-[#0F2A47] text-sm">{order.total} {isAr ? 'د' : 'AED'}</p>
                  <ChevronRight size={14} className={`text-[#C8A951] ms-auto mt-1 transition-transform ${expanded === order.id ? 'rotate-90' : ''}`} />
                </div>
              </button>

              {expanded === order.id && (
                <div className="border-t border-[#F0ECE4] p-4">
                  {/* Tracking steps */}
                  {['on_the_way', 'preparing', 'accepted', 'pending'].includes(order.status) && (
                    <div className="mb-4">
                      <p className="text-xs font-black text-[#444] mb-3 uppercase tracking-wide">
                        {isAr ? 'تتبع الطلب' : 'Order Status'}
                      </p>
                      <div className="flex items-center">
                        {(isAr ? stepsAr : stepsEn).map((step, i) => {
                          const active = i <= getActiveStep(order.status)
                          return (
                            <div key={step} className="flex items-center flex-1 last:flex-none">
                              <div className="flex flex-col items-center">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black ${active ? 'bg-[#0F2A47] text-white' : 'bg-[#E8E4DC] text-[#999]'}`}>
                                  {i < getActiveStep(order.status) ? '✓' : '●'}
                                </div>
                                <p className="mt-1 text-center font-semibold" style={{ fontSize: 8, color: active ? '#0F2A47' : '#bbb', whiteSpace: 'nowrap' }}>{step}</p>
                              </div>
                              {i < steps.length - 1 && (
                                <div className={`flex-1 h-0.5 mx-1 ${i < getActiveStep(order.status) ? 'bg-[#C8A951]' : 'bg-[#E8E4DC]'}`}></div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                      {order.eta && (
                        <p className="text-xs text-emerald-600 font-black mt-3 flex items-center gap-1">
                          <Clock size={12} /> {t('arriving')} ~{isAr ? order.etaAr : order.eta} {isAr ? 'دقيقة' : 'min'}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="space-y-1 mb-4">
                    {(isAr ? order.itemsAr : order.itemsEn).map((item, i) => (
                      <p key={i} className="text-sm text-[#555] font-semibold flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#C8A951] rounded-full flex-shrink-0"></span>{item}
                      </p>
                    ))}
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {order.status === 'completed' && (
                      <>
                        <button className="flex items-center gap-1.5 px-3 py-2 bg-[#0F2A47] text-white text-xs font-bold rounded-xl">
                          <RotateCcw size={12} /> {t('reorder')}
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-2 bg-[#FBF8F2] text-[#444] text-xs font-bold rounded-xl border border-[#E8E4DC]">
                          <Star size={12} /> {t('rate')}
                        </button>
                      </>
                    )}
                    {order.status === 'on_the_way' && (
                      <button className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200">
                        <MapPin size={12} /> {t('trackLive')}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Package size={48} className="text-[#C8A951] mx-auto mb-4" />
            <p className="font-bold text-[#666]">{t('noOrders')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
