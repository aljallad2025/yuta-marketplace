import { useState } from 'react'
import { Search, UserCheck, UserX, Eye, MapPin, Star } from 'lucide-react'
import Badge from '../../components/Badge'
import { useLang } from '../../i18n/LangContext'

const drivers = [
  { id: 'DRV-001', nameEn: 'Mohammed Al Ameri', nameAr: 'محمد العامري', phone: '+971 50 111 2222', vehicle: 'Toyota Corolla · DXB 1234', status: 'delivering', rating: 4.9, trips: 284, earnings: 12400, locationEn: 'Dubai Marina', locationAr: 'دبي مارينا', approved: true },
  { id: 'DRV-002', nameEn: 'Yusuf Al Kaabi', nameAr: 'يوسف الكعبي', phone: '+971 55 222 3333', vehicle: 'Honda Civic · SHJ 5678', status: 'available', rating: 4.7, trips: 156, earnings: 7800, locationEn: 'Downtown Dubai', locationAr: 'وسط مدينة دبي', approved: true },
  { id: 'DRV-003', nameEn: 'Ibrahim Saeed', nameAr: 'إبراهيم سعيد', phone: '+971 52 333 4444', vehicle: 'Nissan Altima · ABD 9012', status: 'delivering', rating: 4.8, trips: 312, earnings: 15600, locationEn: 'JBR Beach', locationAr: 'شاطئ JBR', approved: true },
  { id: 'DRV-004', nameEn: 'Hassan Al Mulla', nameAr: 'حسن الملا', phone: '+971 56 444 5555', vehicle: 'Toyota Camry · DXB 3421', status: 'on_ride', rating: 4.9, trips: 421, earnings: 19200, locationEn: 'Business Bay', locationAr: 'خليج الأعمال', approved: true },
  { id: 'DRV-005', nameEn: 'Ali Rashid', nameAr: 'علي راشد', phone: '+971 50 555 6666', vehicle: 'Hyundai Sonata · SHJ 7890', status: 'inactive', rating: 4.5, trips: 89, earnings: 4200, locationEn: 'Sharjah', locationAr: 'الشارقة', approved: false },
]

export default function AdminDrivers() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const { t, isAr } = useLang()

  const filterLabels = {
    all: isAr ? 'الكل' : 'All',
    active: isAr ? 'نشط' : 'Active',
    pending: isAr ? 'بانتظار الموافقة' : 'Pending',
    inactive: isAr ? 'غير نشط' : 'Inactive',
  }

  const getStatusBadge = (status) => {
    if (status === 'delivering') return 'on_the_way'
    if (status === 'on_ride') return 'accepted'
    if (status === 'available') return 'active'
    return 'inactive'
  }

  const getStatusLabel = (status) => {
    if (status === 'delivering') return isAr ? 'يوصّل' : 'Delivering'
    if (status === 'on_ride') return isAr ? 'في رحلة' : 'On Ride'
    if (status === 'available') return isAr ? 'متاح' : 'Available'
    return isAr ? 'غير نشط' : 'Inactive'
  }

  const headers = isAr
    ? ['السائق', 'المركبة', 'الحالة', 'التقييم', 'الرحلات', 'الأرباح', 'الموقع', 'إجراءات']
    : ['Driver', 'Vehicle', 'Status', 'Rating', 'Trips', 'Earnings', 'Location', 'Actions']

  const stats = [
    { labelEn: 'Online', labelAr: 'متصل', count: 38, color: '#2ECC71' },
    { labelEn: 'Delivering', labelAr: 'يوصّل', count: 24, color: '#3498DB' },
    { labelEn: 'On Ride', labelAr: 'في رحلة', count: 12, color: '#9B59B6' },
    { labelEn: 'Pending Approval', labelAr: 'بانتظار الموافقة', count: 5, color: '#F39C12' },
  ]

  const filtered = drivers.filter(d => {
    const name = isAr ? d.nameAr : d.nameEn
    const matchSearch = name.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' ||
      (filter === 'active' && ['delivering', 'available', 'on_ride'].includes(d.status)) ||
      (filter === 'pending' && !d.approved) ||
      (filter === 'inactive' && d.status === 'inactive')
    return matchSearch && matchFilter
  })

  return (
    <div className="p-6 space-y-5" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#0F2A47]">{t('driverManagement')}</h1>
          <p className="text-sm text-[#666]">{isAr ? '١٤٢ سائق نشط على المنصة' : '142 active drivers on platform'}</p>
        </div>
        <button className="px-4 py-2.5 bg-[#0F2A47] text-white text-sm font-black rounded-xl">
          {isAr ? '+ إضافة سائق' : '+ Add Driver'}
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.labelEn} className="bg-white rounded-xl p-4 shadow-sm border border-[#E8E4DC] text-center">
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.count}</p>
            <p className="text-xs text-[#666] mt-0.5">{isAr ? s.labelAr : s.labelEn}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <div className="flex-1 flex items-center bg-white rounded-xl px-4 py-2.5 gap-2 shadow-sm border border-[#E8E4DC]">
          <Search size={16} className="text-[#999]" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={isAr ? 'ابحث عن السائقين...' : 'Search drivers...'}
            className="flex-1 outline-none text-sm bg-transparent text-[#222]"
            dir={isAr ? 'rtl' : 'ltr'} />
        </div>
        {Object.keys(filterLabels).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2.5 rounded-xl text-sm font-black ${
              filter === f ? 'bg-[#0F2A47] text-white' : 'bg-white text-[#444] border border-[#E8E4DC]'
            }`}>{filterLabels[f]}</button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#E8E4DC] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#FBF8F2] border-b border-[#E8E4DC]">
                {headers.map(h => (
                  <th key={h} className="text-start px-4 py-3.5 text-xs font-black text-[#666] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((driver, i) => (
                <tr key={driver.id} className={`${i < filtered.length - 1 ? 'border-b border-[#F0ECE4]' : ''} hover:bg-[#FBF8F2]`}>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#0F2A47] rounded-full flex items-center justify-center text-white font-black text-sm">
                        {(isAr ? driver.nameAr : driver.nameEn).charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-sm text-[#222]">{isAr ? driver.nameAr : driver.nameEn}</p>
                        <p className="text-xs text-[#999]">{driver.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-xs text-[#666]">{driver.vehicle}</td>
                  <td className="px-4 py-4"><Badge status={getStatusBadge(driver.status)} label={getStatusLabel(driver.status)} /></td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <Star size={12} className="fill-[#C8A951] text-[#C8A951]" />
                      <span className="text-sm font-black text-[#222]">{driver.rating}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm font-black text-[#222]">{driver.trips}</td>
                  <td className="px-4 py-4 text-sm text-[#0F2A47] font-black">{driver.earnings.toLocaleString()} {isAr ? 'د' : 'AED'}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 text-xs text-[#666]">
                      <MapPin size={11} className="text-[#C8A951]" /> {isAr ? driver.locationAr : driver.locationEn}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 hover:bg-[#FBF8F2] rounded-lg text-[#666] hover:text-[#0F2A47]"><Eye size={13} /></button>
                      {!driver.approved ? (
                        <button className="p-1.5 hover:bg-green-50 rounded-lg text-green-600"><UserCheck size={13} /></button>
                      ) : (
                        <button className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"><UserX size={13} /></button>
                      )}
                    </div>
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
