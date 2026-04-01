import { DollarSign, TrendingUp, ArrowDownCircle, CheckCircle, XCircle, Download } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Badge from '../../components/Badge'
import { useLang } from '../../i18n/LangContext'

const monthlyData = [
  { month: 'Oct', revenue: 145000, commission: 14500 },
  { month: 'Nov', revenue: 182000, commission: 18200 },
  { month: 'Dec', revenue: 248000, commission: 24800 },
  { month: 'Jan', revenue: 196000, commission: 19600 },
  { month: 'Feb', revenue: 224000, commission: 22400 },
  { month: 'Mar', revenue: 268000, commission: 26800 },
]

const withdrawals = [
  { id: 'WD-1024', nameEn: 'Mohammed Al Ameri', nameAr: 'محمد العامري', typeEn: 'Driver', typeAr: 'سائق', amount: 1240, status: 'pending', date: 'Apr 1' },
  { id: 'WD-1023', nameEn: 'Baharat Restaurant', nameAr: 'مطعم بهارات', typeEn: 'Store', typeAr: 'متجر', amount: 4860, status: 'completed', date: 'Mar 31' },
  { id: 'WD-1022', nameEn: 'Yusuf Al Kaabi', nameAr: 'يوسف الكعبي', typeEn: 'Driver', typeAr: 'سائق', amount: 780, status: 'pending', date: 'Mar 31' },
  { id: 'WD-1021', nameEn: 'Fresh Mart', nameAr: 'فريش مارت', typeEn: 'Store', typeAr: 'متجر', amount: 3820, status: 'completed', date: 'Mar 30' },
  { id: 'WD-1020', nameEn: 'Ibrahim Saeed', nameAr: 'إبراهيم سعيد', typeEn: 'Driver', typeAr: 'سائق', amount: 1560, status: 'completed', date: 'Mar 30' },
]

export default function AdminFinancial() {
  const { t, isAr } = useLang()

  const kpis = [
    { labelEn: 'Total Revenue (Mar)', labelAr: 'إجمالي الإيرادات (مارس)', value: '268,000', icon: DollarSign, color: '#0F2A47', change: '+19.6%' },
    { labelEn: 'Commission Earned', labelAr: 'العمولة المحققة', value: '26,800', icon: TrendingUp, color: '#C8A951', change: '+19.6%' },
    { labelEn: 'Pending Payouts', labelAr: 'مدفوعات معلقة', value: '24,600', icon: ArrowDownCircle, color: '#E74C3C', changeEn: '12 requests', changeAr: '١٢ طلب' },
    { labelEn: 'Completed Payouts', labelAr: 'مدفوعات مكتملة', value: '142,000', icon: CheckCircle, color: '#2ECC71', changeEn: 'This month', changeAr: 'هذا الشهر' },
  ]

  const commissions = [
    { catEn: 'Restaurants', catAr: 'المطاعم', rate: 12 },
    { catEn: 'Supermarket', catAr: 'سوبرماركت', rate: 10 },
    { catEn: 'Pharmacy', catAr: 'صيدلية', rate: 8 },
    { catEn: 'Beauty', catAr: 'مستحضرات التجميل', rate: 15 },
    { catEn: 'Electronics', catAr: 'إلكترونيات', rate: 8 },
    { catEn: 'General Stores', catAr: 'محلات عامة', rate: 10 },
  ]

  const wdHeaders = isAr
    ? ['المعرف', 'الاسم', 'النوع', 'المبلغ', 'الحالة', 'التاريخ', 'إجراءات']
    : ['ID', 'Name', 'Type', 'Amount', 'Status', 'Date', 'Actions']

  return (
    <div className="p-6 space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#0F2A47]">{t('financial')}</h1>
          <p className="text-sm text-[#666]">{isAr ? 'الإيرادات والعمولات والمدفوعات' : 'Revenue, commissions & payouts overview'}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#C8A951] text-[#0F2A47] text-sm font-black rounded-xl">
          <Download size={15} /> {t('exportCSV')}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(card => (
          <div key={card.labelEn} className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8E4DC]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-[#666] font-semibold">{isAr ? card.labelAr : card.labelEn}</p>
                <p className="text-xl font-black text-[#222] mt-1 leading-tight">{card.value} {isAr ? 'د' : 'AED'}</p>
                <p className="text-xs text-emerald-600 font-black mt-1">
                  {card.change || (isAr ? card.changeAr : card.changeEn)}
                </p>
              </div>
              <div className="p-3 rounded-xl" style={{ backgroundColor: card.color + '15' }}>
                <card.icon size={20} style={{ color: card.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8E4DC]">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-black text-[#0F2A47]">
            {isAr ? 'الإيرادات مقابل العمولة (٦ أشهر)' : 'Revenue vs Commission (6 months)'}
          </h2>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-[#0F2A47] inline-block"></span> {isAr ? 'الإيرادات' : 'Revenue'}</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-[#C8A951] inline-block"></span> {isAr ? 'العمولة' : 'Commission'}</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={monthlyData} barSize={18} barGap={6}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0ECE4" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#666' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E8E4DC', fontSize: 12 }} />
            <Bar dataKey="revenue" fill="#0F2A47" radius={[4, 4, 0, 0]} />
            <Bar dataKey="commission" fill="#C8A951" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8E4DC]">
        <h2 className="font-black text-[#0F2A47] mb-4">
          {isAr ? 'إعدادات العمولة حسب القسم' : 'Commission Settings by Category'}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {commissions.map(c => (
            <div key={c.catEn} className="flex items-center justify-between p-3 bg-[#FBF8F2] rounded-xl">
              <p className="text-sm font-black text-[#444]">{isAr ? c.catAr : c.catEn}</p>
              <div className="flex items-center gap-2">
                <span className="font-black text-[#C8A951] text-sm">{c.rate}%</span>
                <button className="text-xs text-[#0F2A47] underline">{isAr ? 'تعديل' : 'Edit'}</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#E8E4DC] overflow-hidden">
        <div className="p-4 border-b border-[#F0ECE4] flex items-center justify-between">
          <h2 className="font-black text-[#0F2A47]">{isAr ? 'طلبات السحب' : 'Withdrawal Requests'}</h2>
          <span className="text-xs bg-[#E74C3C]/10 text-[#E74C3C] px-2 py-0.5 rounded-full font-black">
            {isAr ? '٢ معلق' : '2 pending'}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#FBF8F2] border-b border-[#E8E4DC]">
                {wdHeaders.map(h => (
                  <th key={h} className="text-start px-4 py-3 text-xs font-black text-[#666] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((w, i) => (
                <tr key={w.id} className={`${i < withdrawals.length - 1 ? 'border-b border-[#F0ECE4]' : ''} hover:bg-[#FBF8F2]`}>
                  <td className="px-4 py-3.5 font-mono text-xs text-[#0F2A47] font-black">{w.id}</td>
                  <td className="px-4 py-3.5 text-sm text-[#444]">{isAr ? w.nameAr : w.nameEn}</td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-black ${
                      w.typeEn === 'Driver' ? 'bg-[#0F2A47]/10 text-[#0F2A47]' : 'bg-[#C8A951]/15 text-[#a88b3a]'
                    }`}>{isAr ? w.typeAr : w.typeEn}</span>
                  </td>
                  <td className="px-4 py-3.5 font-black text-sm text-[#222]">{w.amount.toLocaleString()} {isAr ? 'د' : 'AED'}</td>
                  <td className="px-4 py-3.5">
                    <Badge status={w.status} label={isAr ? (w.status === 'pending' ? 'معلق' : 'مكتمل') : undefined} />
                  </td>
                  <td className="px-4 py-3.5 text-xs text-[#666]">{w.date}</td>
                  <td className="px-4 py-3.5">
                    {w.status === 'pending' ? (
                      <div className="flex gap-1.5">
                        <button className="p-1.5 hover:bg-green-50 rounded-lg text-green-600"><CheckCircle size={14} /></button>
                        <button className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"><XCircle size={14} /></button>
                      </div>
                    ) : <span className="text-xs text-[#999]">{isAr ? 'تمت المعالجة' : 'Processed'}</span>}
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
