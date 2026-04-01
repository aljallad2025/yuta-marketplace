import { useState } from 'react'
import Badge from '../../components/Badge'
import { Clock } from 'lucide-react'
import { useLang } from '../../i18n/LangContext'

const orders = [
  { id: 'SUW-2841', storeEn: 'Baharat Restaurant', storeAr: 'مطعم بهارات', status: 'on_the_way', total: 254, dateEn: 'Today', dateAr: 'اليوم', etaEn: '12 min', etaAr: '١٢ دقيقة', emoji: '🍽️' },
  { id: 'SUW-2810', storeEn: 'Al Shifa Pharmacy', storeAr: 'صيدلية الشفاء', status: 'completed', total: 48, dateEn: 'Yesterday', dateAr: 'أمس', emoji: '💊' },
  { id: 'SUW-2789', storeEn: 'Fresh Mart', storeAr: 'فريش مارت', status: 'completed', total: 187, dateEn: 'Mar 28', dateAr: '٢٨ مارس', emoji: '🛒' },
  { id: 'SUW-2760', storeEn: 'Burgetino', storeAr: 'برجتينو', status: 'cancelled', total: 96, dateEn: 'Mar 25', dateAr: '٢٥ مارس', emoji: '🍔' },
]

export default function MobileOrders() {
  const [tab, setTab] = useState('all')
  const { t, isAr } = useLang()

  const tabsData = [
    { key: 'all', labelEn: 'All', labelAr: 'الكل' },
    { key: 'active', labelEn: 'Active', labelAr: 'نشط' },
    { key: 'done', labelEn: 'Done', labelAr: 'مكتمل' },
  ]

  const filtered = orders.filter(o => {
    if (tab === 'active') return ['on_the_way', 'preparing', 'pending'].includes(o.status)
    if (tab === 'done') return ['completed', 'cancelled'].includes(o.status)
    return true
  })

  return (
    <div className="bg-[#FBF8F2]" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="bg-[#0F2A47] px-4 pt-2 pb-4">
        <h2 className="text-white font-black text-base mb-3">{t('myOrders')}</h2>
        <div className="flex gap-1 bg-white/10 rounded-xl p-1">
          {tabsData.map(tb => (
            <button key={tb.key} onClick={() => setTab(tb.key)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all ${
                tab === tb.key ? 'bg-white text-[#0F2A47]' : 'text-white/70'
              }`}>{isAr ? tb.labelAr : tb.labelEn}</button>
          ))}
        </div>
      </div>

      <div className="p-3 space-y-2.5">
        {filtered.map(order => (
          <div key={order.id} className="bg-white rounded-2xl p-3 shadow-sm border border-[#E8E4DC]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FBF8F2] rounded-xl flex items-center justify-center text-xl">
                {order.emoji}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-black text-[#222] text-xs">{isAr ? order.storeAr : order.storeEn}</p>
                  <Badge status={order.status} label={isAr
                    ? (order.status === 'on_the_way' ? 'في الطريق' : order.status === 'completed' ? 'مكتمل' : order.status === 'cancelled' ? 'ملغي' : order.status)
                    : undefined} className="text-[9px]" />
                </div>
                <p className="text-[10px] text-[#666] mt-0.5">{order.id} · {isAr ? order.dateAr : order.dateEn}</p>
              </div>
            </div>

            {order.status === 'on_the_way' && (
              <div className="mt-3 bg-emerald-50 rounded-xl p-2.5 flex items-center gap-2">
                <Clock size={12} className="text-emerald-600" />
                <p className="text-xs text-emerald-700 font-black">
                  {isAr ? `يصل خلال ~${order.etaAr}` : `Arriving in ~${order.etaEn}`}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#F0ECE4]">
              <p className="font-black text-[#0F2A47] text-sm">{order.total} {isAr ? 'د' : 'AED'}</p>
              {order.status === 'completed' ? (
                <div className="flex gap-1.5">
                  <button className="px-2.5 py-1.5 bg-[#0F2A47] text-white text-[10px] rounded-lg font-black">{t('reorder')}</button>
                  <button className="px-2.5 py-1.5 bg-[#FBF8F2] text-[#444] text-[10px] rounded-lg border border-[#E8E4DC]">{t('rate')}</button>
                </div>
              ) : order.status === 'on_the_way' ? (
                <button className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 text-[10px] rounded-lg border border-emerald-200 font-black">{t('trackLive')}</button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
