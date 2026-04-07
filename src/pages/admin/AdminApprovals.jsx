import { useState } from 'react'
import { CheckCircle, XCircle, Clock, Users, Store, Truck, Eye, Ban } from 'lucide-react'
import { useLang } from '../../i18n/LangContext'
import { useAuth } from '../../store/authStore'
import Badge from '../../components/Badge'

export default function AdminApprovals() {
  const { isAr } = useLang()
  const { users, approveUser, rejectUser, suspendUser, deleteUser } = useAuth()
  const [tab, setTab] = useState('pending')
  const [detail, setDetail] = useState(null)

  const vendorUsers = users.filter(u => u.role === 'vendor')
  const driverUsers = users.filter(u => u.role === 'driver')
  const pendingAll = users.filter(u => ['vendor', 'driver'].includes(u.role) && u.status === 'pending')
  const approvedAll = users.filter(u => ['vendor', 'driver'].includes(u.role) && u.status === 'approved')
  const rejectedAll = users.filter(u => ['vendor', 'driver'].includes(u.role) && u.status === 'rejected')
  const suspendedAll = users.filter(u => ['vendor', 'driver'].includes(u.role) && u.status === 'suspended')

  const listMap = { pending: pendingAll, approved: approvedAll, rejected: rejectedAll, suspended: suspendedAll }
  const list = listMap[tab] || []

  const statusColors = { pending: 'pending', approved: 'approved', rejected: 'cancelled', suspended: 'suspended' }

  return (
    <div className="p-6" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#0F2A47]">{isAr ? 'إدارة الطلبات والموافقات' : 'Approvals Management'}</h1>
        <p className="text-sm text-[#666] mt-0.5">{isAr ? 'مراجعة طلبات الموردين والسائقين' : 'Review vendor and driver applications'}</p>
      </div>

      {/* Alert for pending */}
      {pendingAll.length > 0 && (
        <div className="mb-5 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
          <Clock size={20} className="text-amber-600 flex-shrink-0" />
          <p className="font-black text-amber-800 text-sm">
            {isAr
              ? `لديك ${pendingAll.length} طلب${pendingAll.length > 1 ? 'ات' : ''} تنتظر موافقتك`
              : `You have ${pendingAll.length} application${pendingAll.length > 1 ? 's' : ''} awaiting your approval`}
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { labelAr: 'قيد الانتظار', labelEn: 'Pending', count: pendingAll.length, color: '#F39C12', icon: Clock },
          { labelAr: 'معتمد', labelEn: 'Approved', count: approvedAll.length, color: '#2ECC71', icon: CheckCircle },
          { labelAr: 'مرفوض', labelEn: 'Rejected', count: rejectedAll.length, color: '#E74C3C', icon: XCircle },
          { labelAr: 'موقوف', labelEn: 'Suspended', count: suspendedAll.length, color: '#E67E22', icon: Ban },
        ].map(s => (
          <div key={s.labelEn} className="bg-white rounded-2xl border border-[#E8E4DC] p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.color + '20' }}>
              <s.icon size={18} style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-xl font-black text-[#0F2A47]">{s.count}</p>
              <p className="text-xs text-[#888]">{isAr ? s.labelAr : s.labelEn}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {[
          { key: 'pending', ar: 'قيد الانتظار', en: 'Pending', count: pendingAll.length },
          { key: 'approved', ar: 'معتمدون', en: 'Approved', count: approvedAll.length },
          { key: 'rejected', ar: 'مرفوضون', en: 'Rejected', count: rejectedAll.length },
          { key: 'suspended', ar: 'موقوفون', en: 'Suspended', count: suspendedAll.length },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-black whitespace-nowrap transition-all ${tab === t.key ? 'bg-[#0F2A47] text-white' : 'bg-white border border-[#E8E4DC] text-[#666]'}`}>
            {isAr ? t.ar : t.en}
            {t.count > 0 && (
              <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center ${tab === t.key ? 'bg-white/20 text-white' : 'bg-[#F0ECE4] text-[#666]'}`}>{t.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {list.length === 0 ? (
          <div className="text-center py-14 bg-white rounded-2xl border border-[#E8E4DC]">
            <div className="text-4xl mb-3">{tab === 'pending' ? '✅' : '📋'}</div>
            <p className="font-black text-[#444]">{isAr ? 'لا توجد طلبات' : 'No applications'}</p>
          </div>
        ) : list.map(u => (
          <div key={u.id} className={`bg-white rounded-2xl border-2 overflow-hidden transition-all ${u.status === 'pending' ? 'border-amber-300' : 'border-[#E8E4DC]'}`}>
            <div className="p-4 flex items-center gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 bg-[#FBF8F2] rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 border border-[#E8E4DC]">
                {u.avatar || (u.role === 'vendor' ? '🏪' : '🚗')}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-black text-[#0F2A47] text-sm">{isAr ? u.nameAr : u.nameEn}</span>
                  <Badge
                    variant={u.role === 'vendor' ? 'blue' : 'gold'}
                    label={u.role === 'vendor' ? (isAr ? 'مورد' : 'Vendor') : (isAr ? 'سائق' : 'Driver')}
                  />
                  <Badge
                    variant={statusColors[u.status] || 'inactive'}
                    label={
                      u.status === 'pending' ? (isAr ? 'انتظار' : 'Pending') :
                      u.status === 'approved' ? (isAr ? 'معتمد' : 'Approved') :
                      u.status === 'rejected' ? (isAr ? 'مرفوض' : 'Rejected') :
                      (isAr ? 'موقوف' : 'Suspended')
                    }
                  />
                </div>
                <p className="text-xs text-[#888] mt-0.5">@{u.username} · {u.email || u.phone}</p>
                {u.appliedAt && (
                  <p className="text-xs text-[#aaa] mt-0.5">{isAr ? `تاريخ الطلب: ${u.appliedAt}` : `Applied: ${u.appliedAt}`}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-shrink-0">
                {u.status === 'pending' && (
                  <>
                    <button onClick={() => approveUser(u.id)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white text-xs font-black rounded-xl hover:bg-emerald-700">
                      <CheckCircle size={13} /> {isAr ? 'موافقة' : 'Approve'}
                    </button>
                    <button onClick={() => rejectUser(u.id)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 text-xs font-black rounded-xl border border-red-200 hover:bg-red-100">
                      <XCircle size={13} /> {isAr ? 'رفض' : 'Reject'}
                    </button>
                  </>
                )}
                {u.status === 'approved' && (
                  <button onClick={() => suspendUser(u.id)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 text-amber-700 text-xs font-black rounded-xl border border-amber-200 hover:bg-amber-100">
                    <Ban size={13} /> {isAr ? 'تعليق' : 'Suspend'}
                  </button>
                )}
                {(u.status === 'rejected' || u.status === 'suspended') && (
                  <button onClick={() => approveUser(u.id)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 text-xs font-black rounded-xl border border-emerald-200 hover:bg-emerald-100">
                    <CheckCircle size={13} /> {isAr ? 'إعادة تفعيل' : 'Reactivate'}
                  </button>
                )}
                <button onClick={() => setDetail(detail?.id === u.id ? null : u)}
                  className="p-2 border border-[#E8E4DC] rounded-xl hover:bg-[#FBF8F2] text-[#888]">
                  <Eye size={14} />
                </button>
              </div>
            </div>

            {/* Expanded detail */}
            {detail?.id === u.id && (
              <div className="border-t border-[#F0ECE4] px-4 py-3 bg-[#FBF8F2]/50">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div><p className="text-[10px] font-black text-[#666] uppercase">{isAr ? 'الاسم الكامل' : 'Full Name'}</p><p className="text-sm font-black text-[#222] mt-0.5">{isAr ? u.nameAr : u.nameEn}</p></div>
                  <div><p className="text-[10px] font-black text-[#666] uppercase">{isAr ? 'اسم المستخدم' : 'Username'}</p><p className="text-sm text-[#444] mt-0.5 font-mono">@{u.username}</p></div>
                  <div><p className="text-[10px] font-black text-[#666] uppercase">{isAr ? 'الهاتف' : 'Phone'}</p><p className="text-sm text-[#444] mt-0.5">{u.phone || '—'}</p></div>
                  <div><p className="text-[10px] font-black text-[#666] uppercase">{isAr ? 'البريد' : 'Email'}</p><p className="text-sm text-[#444] mt-0.5 truncate">{u.email || '—'}</p></div>
                  {u.role === 'driver' && u.vehicleAr && (
                    <div><p className="text-[10px] font-black text-[#666] uppercase">{isAr ? 'المركبة' : 'Vehicle'}</p><p className="text-sm text-[#444] mt-0.5">{isAr ? u.vehicleAr : u.vehicleEn}</p></div>
                  )}
                  {u.plate && (
                    <div><p className="text-[10px] font-black text-[#666] uppercase">{isAr ? 'اللوحة' : 'Plate'}</p><p className="text-sm text-[#444] mt-0.5">{u.plate}</p></div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
