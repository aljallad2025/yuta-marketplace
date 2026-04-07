import { useLang } from '../../i18n/LangContext'
import { Star, TrendingUp, ThumbsUp } from 'lucide-react'

const reviews = [
  { id: 1, customerAr: 'نورة الكثيري', customerEn: 'Noura Al Ketheri', rating: 5, commentAr: 'طعام رائع وتوصيل سريع! المشاوي كانت لذيذة جداً', commentEn: 'Amazing food and fast delivery! The grills were delicious', date: '2025-04-05', order: 'ORD-5001', likes: 4 },
  { id: 2, customerAr: 'فيصل الزهراني', customerEn: 'Faisal Al Zahrani', rating: 4, commentAr: 'الأكل كويس بس التأخير شوي', commentEn: 'Good food but a bit late', date: '2025-04-04', order: 'ORD-4990', likes: 1 },
  { id: 3, customerAr: 'سارة البلوشي', customerEn: 'Sara Al Balushi', rating: 5, commentAr: 'دائماً مميز، أفضل مطعم في المنطقة', commentEn: 'Always excellent, best restaurant in the area', date: '2025-04-03', order: 'ORD-4980', likes: 7 },
  { id: 4, customerAr: 'محمد القحطاني', customerEn: 'Mohammed Al Qahtani', rating: 3, commentAr: 'الطعام عادي، ينقصه البهارات', commentEn: 'Average food, needs more spices', date: '2025-04-02', order: 'ORD-4975', likes: 0 },
  { id: 5, customerAr: 'لطيفة المنصوري', customerEn: 'Latifa Al Mansoori', rating: 5, commentAr: 'ممتاز كالعادة! شكراً للشيف', commentEn: 'Excellent as always! Thanks to the chef', date: '2025-04-01', order: 'ORD-4960', likes: 3 },
]

function Stars({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={14} fill={s <= rating ? '#C8A951' : 'none'} stroke={s <= rating ? '#C8A951' : '#ddd'} />
      ))}
    </div>
  )
}

export default function VendorReviews() {
  const { isAr } = useLang()

  const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
  const dist = [5,4,3,2,1].map(r => ({ rating: r, count: reviews.filter(rv => rv.rating === r).length }))

  return (
    <div className="p-6" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="mb-6">
        <h1 className="text-xl font-black text-[#0F2A47]">{isAr ? 'التقييمات والمراجعات' : 'Ratings & Reviews'}</h1>
        <p className="text-sm text-[#888] mt-0.5">{reviews.length} {isAr ? 'تقييم' : 'reviews'}</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Overall rating */}
        <div className="bg-[#0F2A47] rounded-2xl p-5 text-center">
          <p className="text-6xl font-black text-[#C8A951]">{avgRating.toFixed(1)}</p>
          <Stars rating={Math.round(avgRating)} />
          <p className="text-white/60 text-sm mt-2">{isAr ? 'من 5' : 'out of 5'}</p>
        </div>
        {/* Distribution */}
        <div className="bg-white rounded-2xl border border-[#E8E4DC] p-5">
          <p className="font-black text-[#0F2A47] mb-3 text-sm">{isAr ? 'توزيع التقييمات' : 'Rating Distribution'}</p>
          <div className="space-y-2">
            {dist.map(d => (
              <div key={d.rating} className="flex items-center gap-2">
                <span className="text-xs font-black text-[#666] w-4">{d.rating}</span>
                <Star size={11} fill="#C8A951" stroke="#C8A951" />
                <div className="flex-1 h-2 bg-[#F0ECE4] rounded-full overflow-hidden">
                  <div className="h-full bg-[#C8A951] rounded-full transition-all"
                    style={{ width: `${reviews.length > 0 ? (d.count / reviews.length) * 100 : 0}%` }}></div>
                </div>
                <span className="text-xs text-[#888] w-4">{d.count}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Quick stats */}
        <div className="bg-white rounded-2xl border border-[#E8E4DC] p-5">
          <p className="font-black text-[#0F2A47] mb-3 text-sm">{isAr ? 'الملخص' : 'Summary'}</p>
          <div className="space-y-3">
            {[
              { labelAr: 'تقييمات 5 نجوم', labelEn: '5-Star Reviews', value: reviews.filter(r => r.rating === 5).length, icon: '⭐' },
              { labelAr: 'معدل الرضا', labelEn: 'Satisfaction Rate', value: `${Math.round(reviews.filter(r => r.rating >= 4).length / reviews.length * 100)}%`, icon: '😊' },
              { labelAr: 'أحدث تقييم', labelEn: 'Latest Review', value: '5 ⭐', icon: '🆕' },
            ].map(s => (
              <div key={s.labelEn} className="flex items-center justify-between">
                <span className="text-sm text-[#666]">{s.icon} {isAr ? s.labelAr : s.labelEn}</span>
                <span className="font-black text-[#0F2A47] text-sm">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-3">
        {reviews.map(r => (
          <div key={r.id} className="bg-white rounded-2xl border border-[#E8E4DC] p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#0F2A47] rounded-full flex items-center justify-center text-sm font-black text-[#C8A951]">
                  {(isAr ? r.customerAr : r.customerEn)[0]}
                </div>
                <div>
                  <p className="font-black text-[#222] text-sm">{isAr ? r.customerAr : r.customerEn}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Stars rating={r.rating} />
                    <span className="text-xs text-[#888]">· {r.date}</span>
                  </div>
                </div>
              </div>
              <span className="text-xs text-[#999] bg-[#F0ECE4] px-2 py-1 rounded-lg">{r.order}</span>
            </div>
            <p className="text-sm text-[#444] leading-relaxed">{isAr ? r.commentAr : r.commentEn}</p>
            <div className="flex items-center gap-2 mt-3">
              <button className="flex items-center gap-1 text-xs text-[#888] hover:text-[#C8A951] font-black">
                <ThumbsUp size={12} /> {r.likes} {isAr ? 'مفيد' : 'Helpful'}
              </button>
              <button className="text-xs text-[#C8A951] font-black hover:underline">
                {isAr ? 'الرد على التقييم' : 'Reply'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
