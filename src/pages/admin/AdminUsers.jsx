import { useState, useEffect } from 'react'
import { Search, UserCheck, UserX, Edit2, Eye } from 'lucide-react'
import Badge from '../../components/Badge'
import { useLang } from '../../i18n/LangContext'
import { useApp } from '../../store/appStore'

export default function AdminUsers() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const { t, isAr } = useLang()
  const { users: rawUsers, loadUsers, orders } = useApp()
  useEffect(() => { loadUsers() }, [loadUsers])
  const users = rawUsers.map(u => ({
    ...u,
    nameAr: u.nameAr || u.name_ar || '',
    nameEn: u.nameEn || u.name_en || '',
    orders: orders.filter(o => (o.customerId || o.customer_id) === u.id).length || u.totalOrders || 0,
    joined: u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', {month:'short', year:'numeric'}) : '',
  }))

  const filterLabels = {
    all: isAr ? 'الكل' : 'All',
    active: isAr ? 'نشط' : 'Active',
    suspended: isAr ? 'موقوف' : 'Suspended',
    inactive: isAr ? 'غير نشط' : 'Inactive',
  }

  const headers = isAr
    ? ['المستخدم', 'التواصل', 'الحالة', 'الطلبات', 'المحفظة', 'تاريخ الانضمام', 'إجراءات']
    : ['User', 'Contact', 'Status', 'Orders', 'Wallet', 'Joined', 'Actions']

  const filtered = users.filter(u => {
    const name = isAr ? u.nameAr : u.nameEn
    const matchSearch = name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || u.status === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="p-6 space-y-5" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#0F2A47]">{t('userManagement')}</h1>
          <p className="text-sm text-[#666]">
            {isAr ? `${users.length} مستخدم مسجل` : `${users.length} total users registered`}
          </p>
        </div>
        <button className="px-4 py-2.5 bg-[#0F2A47] text-white text-sm font-black rounded-xl">
          {isAr ? '+ دعوة مستخدم' : '+ Invite User'}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center bg-white rounded-xl px-4 py-2.5 gap-2 shadow-sm border border-[#E8E4DC]">
          <Search size={16} className="text-[#999]" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={isAr ? 'ابحث بالاسم أو البريد الإلكتروني...' : 'Search users by name or email...'}
            className="flex-1 outline-none text-sm bg-transparent text-[#222]"
            dir={isAr ? 'rtl' : 'ltr'} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {Object.keys(filterLabels).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-sm font-black transition-all ${
                filter === f ? 'bg-[#0F2A47] text-white' : 'bg-white text-[#444] border border-[#E8E4DC]'
              }`}>
              {filterLabels[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#E8E4DC] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#FBF8F2] border-b border-[#E8E4DC]">
                {headers.map(h => (
                  <th key={h} className="text-start px-5 py-3.5 text-xs font-black text-[#666] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => (
                <tr key={user.id} className={`${i < filtered.length - 1 ? 'border-b border-[#F0ECE4]' : ''} hover:bg-[#FBF8F2] transition-colors`}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#0F2A47] rounded-full flex items-center justify-center text-white text-sm font-black">
                        {(isAr ? user.nameAr : user.nameEn).charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-[#222] text-sm">{isAr ? user.nameAr : user.nameEn}</p>
                        <p className="text-xs text-[#999] font-mono">{user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-[#444]">{user.email}</p>
                    <p className="text-xs text-[#666]">{user.phone}</p>
                  </td>
                  <td className="px-5 py-4">
                    <Badge status={user.status} label={
                      isAr ? (user.status === 'active' ? 'نشط' : user.status === 'suspended' ? 'موقوف' : 'غير نشط') : undefined
                    } />
                  </td>
                  <td className="px-5 py-4 text-sm font-black text-[#222]">{user.orders}</td>
                  <td className="px-5 py-4 text-sm text-[#444]">{user.wallet > 0 ? `${user.wallet} ${isAr ? 'د' : 'SAR'}` : '—'}</td>
                  <td className="px-5 py-4 text-xs text-[#666]">{user.joined}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 hover:bg-[#FBF8F2] rounded-lg text-[#666] hover:text-[#0F2A47]"><Eye size={14} /></button>
                      <button className="p-1.5 hover:bg-[#FBF8F2] rounded-lg text-[#666] hover:text-[#0F2A47]"><Edit2 size={14} /></button>
                      {user.status === 'active' ? (
                        <button className="p-1.5 hover:bg-red-50 rounded-lg text-[#666] hover:text-red-600"><UserX size={14} /></button>
                      ) : (
                        <button className="p-1.5 hover:bg-green-50 rounded-lg text-[#666] hover:text-green-600"><UserCheck size={14} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-[#F0ECE4] flex items-center justify-between text-xs text-[#666]">
          <span>{isAr ? `عرض ${filtered.length} من ${users.length} مستخدم` : `Showing ${filtered.length} of ${users.length} users`}</span>
          <div className="flex gap-1">
            {[1, 2, 3].map(p => (
              <button key={p} className={`w-7 h-7 rounded-lg ${p === 1 ? 'bg-[#0F2A47] text-white' : 'hover:bg-[#FBF8F2] text-[#666]'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
