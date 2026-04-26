import { useState } from 'react'
import { Search, CheckCircle, XCircle, Eye, Edit2, Trash2, Plus, Star, X, Check } from 'lucide-react'
import Badge from '../../components/Badge'
import { useLang } from '../../i18n/LangContext'
import { useStores } from '../../store/storesStore.jsx'
import { useCategories } from '../../store/categoriesStore.jsx'

const EMOJIS = ['🍽️','🍔','🌯','🛒','💊','💄','🧹','🏪','🍞','📱','☕','🍕','🎂','🍜','🥗','🧴','💐','🍣','🎮','🏋️']

export default function AdminStores() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [showAdd, setShowAdd] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editDraft, setEditDraft] = useState({})
  const [newStore, setNewStore] = useState({ nameEn: '', nameAr: '', catId: 1, emoji: '🏪', deliveryFee: 0, minOrder: 0, commission: 10, ownerEn: '', ownerAr: '', phone: '' })
  const { t, isAr } = useLang()
  const { stores, addStore, updateStore, deleteStore, toggleStore, approveStore } = useStores()
  const { categories } = useCategories()

  const filterLabels = {
    all: isAr ? 'الكل' : 'All',
    active: isAr ? 'نشط' : 'Active',
    inactive: isAr ? 'غير نشط' : 'Inactive',
  }

  const headers = isAr
    ? ['المتجر', 'القسم', 'المالك', 'الحالة', 'التقييم', 'الطلبات', 'العمولة', 'الإيرادات', 'إجراءات']
    : ['Store', 'Category', 'Owner', 'Status', 'Rating', 'Orders', 'Commission', 'Revenue', 'Actions']

  const filtered = stores.filter(s => {
    const name = isAr ? s.nameAr : s.nameEn
    const matchSearch = name.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || (filter === 'active' ? s.active : !s.active)
    return matchSearch && matchFilter
  })

  const handleAdd = () => {
    if (!newStore.nameEn && !newStore.nameAr) return
    const cat = categories.find(c => c.id === newStore.catId)
    addStore({ ...newStore, bg: '#F0F9F8', tag: null, time: '30–45', timeAr: '٣٠–٤٥ دق', active: true, open: true })
    setNewStore({ nameEn: '', nameAr: '', catId: 1, emoji: '🏪', deliveryFee: 0, minOrder: 0, commission: 10, ownerEn: '', ownerAr: '', phone: '' })
    setShowAdd(false)
  }

  const startEdit = (store) => {
    setEditingId(store.id)
    setEditDraft({ nameEn: store.nameEn, nameAr: store.nameAr, emoji: store.emoji, catId: store.catId, deliveryFee: store.deliveryFee, minOrder: store.minOrder, commission: store.commission })
  }

  const confirmEdit = (id) => { updateStore(id, editDraft); setEditingId(null) }

  const getCatLabel = (catId) => {
    const cat = categories.find(c => c.id === catId)
    if (!cat) return ''
    return isAr ? cat.labelAr : cat.labelEn
  }

  return (
    <div className="p-6 space-y-5" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#0D1B4B]">{t('storeManagement')}</h1>
          <p className="text-sm text-[#666]">
            {isAr ? `${stores.filter(s=>s.active).length} متجر نشط — يظهر في الموقع والتطبيق` : `${stores.filter(s=>s.active).length} active stores — visible on website & app`}
          </p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#0D1B4B] text-white text-sm font-black rounded-xl">
          <Plus size={14} /> {isAr ? 'إضافة متجر' : 'Add Store'}
        </button>
      </div>

      {/* Live sync banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2 text-sm text-emerald-700">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse flex-shrink-0"></div>
        <span className="font-black">{isAr ? 'مزامنة فورية:' : 'Live Sync:'}</span>
        <span>{isAr ? 'المتاجر النشطة تظهر مباشرةً في الموقع والتطبيق' : 'Active stores appear instantly on website & mobile app'}</span>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="bg-white rounded-2xl border-2 border-[#00C9A7] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-[#0D1B4B]">{isAr ? 'متجر جديد' : 'New Store'}</h3>
            <button onClick={() => setShowAdd(false)} className="p-1 rounded-lg hover:bg-[#F0F9F8] text-[#999]"><X size={16} /></button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {EMOJIS.map(e => (
              <button key={e} onClick={() => setNewStore(s => ({ ...s, emoji: e }))}
                className={`w-9 h-9 rounded-xl text-xl flex items-center justify-center border-2 transition-all ${newStore.emoji === e ? 'border-[#00C9A7] bg-[#00C9A7]/10 scale-110' : 'border-[#D0EDEA]'}`}>{e}</button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-black text-[#444] block mb-1">{isAr ? 'اسم المتجر (إنجليزي)' : 'Store Name (EN)'}</label>
              <input value={newStore.nameEn} onChange={e => setNewStore(s => ({ ...s, nameEn: e.target.value }))} placeholder="e.g. Baharat Restaurant" className="w-full border border-[#D0EDEA] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#00C9A7]" dir="ltr" /></div>
            <div><label className="text-xs font-black text-[#444] block mb-1">{isAr ? 'اسم المتجر (عربي)' : 'Store Name (AR)'}</label>
              <input value={newStore.nameAr} onChange={e => setNewStore(s => ({ ...s, nameAr: e.target.value }))} placeholder="مثال: مطعم بهارات" className="w-full border border-[#D0EDEA] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#00C9A7]" dir="rtl" /></div>
            <div><label className="text-xs font-black text-[#444] block mb-1">{isAr ? 'القسم' : 'Category'}</label>
              <select value={newStore.catId} onChange={e => setNewStore(s => ({ ...s, catId: +e.target.value }))} className="w-full border border-[#D0EDEA] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#00C9A7] bg-white">
                {categories.filter(c => c.active).map(c => <option key={c.id} value={c.id}>{c.emoji} {isAr ? c.labelAr : c.labelEn}</option>)}
              </select></div>
            <div><label className="text-xs font-black text-[#444] block mb-1">{isAr ? 'العمولة %' : 'Commission %'}</label>
              <input type="number" value={newStore.commission} onChange={e => setNewStore(s => ({ ...s, commission: +e.target.value }))} className="w-full border border-[#D0EDEA] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#00C9A7]" /></div>
            <div><label className="text-xs font-black text-[#444] block mb-1">{isAr ? 'اسم المالك (إنجليزي)' : 'Owner Name (EN)'}</label>
              <input value={newStore.ownerEn} onChange={e => setNewStore(s => ({ ...s, ownerEn: e.target.value }))} className="w-full border border-[#D0EDEA] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#00C9A7]" dir="ltr" /></div>
            <div><label className="text-xs font-black text-[#444] block mb-1">{isAr ? 'اسم المالك (عربي)' : 'Owner Name (AR)'}</label>
              <input value={newStore.ownerAr} onChange={e => setNewStore(s => ({ ...s, ownerAr: e.target.value }))} className="w-full border border-[#D0EDEA] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#00C9A7]" dir="rtl" /></div>
            <div><label className="text-xs font-black text-[#444] block mb-1">{isAr ? 'رسوم التوصيل (درهم)' : 'Delivery Fee (SAR)'}</label>
              <input type="number" value={newStore.deliveryFee} onChange={e => setNewStore(s => ({ ...s, deliveryFee: +e.target.value }))} className="w-full border border-[#D0EDEA] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#00C9A7]" /></div>
            <div><label className="text-xs font-black text-[#444] block mb-1">{isAr ? 'الحد الأدنى للطلب' : 'Min. Order (SAR)'}</label>
              <input type="number" value={newStore.minOrder} onChange={e => setNewStore(s => ({ ...s, minOrder: +e.target.value }))} className="w-full border border-[#D0EDEA] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#00C9A7]" /></div>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm text-[#666] border border-[#D0EDEA] rounded-xl font-black">{isAr ? 'إلغاء' : 'Cancel'}</button>
            <button onClick={handleAdd} className="px-5 py-2 bg-[#00C9A7] text-[#0D1B4B] text-sm font-black rounded-xl">{isAr ? 'إضافة المتجر' : 'Add Store'}</button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3">
        <div className="flex-1 flex items-center bg-white rounded-xl px-4 py-2.5 gap-2 shadow-sm border border-[#D0EDEA]">
          <Search size={16} className="text-[#999]" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={isAr ? 'ابحث عن المتاجر...' : 'Search stores...'}
            className="flex-1 outline-none text-sm bg-transparent text-[#222]" dir={isAr ? 'rtl' : 'ltr'} />
        </div>
        {Object.keys(filterLabels).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2.5 rounded-xl text-sm font-black ${filter === f ? 'bg-[#0D1B4B] text-white' : 'bg-white text-[#444] border border-[#D0EDEA]'}`}>
            {filterLabels[f]}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#D0EDEA] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F0F9F8] border-b border-[#D0EDEA]">
                {headers.map(h => (
                  <th key={h} className="text-start px-4 py-3.5 text-xs font-black text-[#666] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((store, i) => (
                <tr key={store.id} className={`${i < filtered.length - 1 ? 'border-b border-[#F0ECE4]' : ''} hover:bg-[#F0F9F8] ${!store.active ? 'opacity-60' : ''}`}>
                  {editingId === store.id ? (
                    <td colSpan={9} className="px-4 py-4">
                      <div className="grid grid-cols-4 gap-3">
                        <input value={editDraft.nameEn} onChange={e => setEditDraft(d => ({ ...d, nameEn: e.target.value }))} placeholder="Name EN" className="border border-[#D0EDEA] rounded-xl px-3 py-2 text-sm outline-none" dir="ltr" />
                        <input value={editDraft.nameAr} onChange={e => setEditDraft(d => ({ ...d, nameAr: e.target.value }))} placeholder="الاسم عربي" className="border border-[#D0EDEA] rounded-xl px-3 py-2 text-sm outline-none" dir="rtl" />
                        <select value={editDraft.catId} onChange={e => setEditDraft(d => ({ ...d, catId: +e.target.value }))} className="border border-[#D0EDEA] rounded-xl px-3 py-2 text-sm outline-none bg-white">
                          {categories.map(c => <option key={c.id} value={c.id}>{c.emoji} {isAr ? c.labelAr : c.labelEn}</option>)}
                        </select>
                        <input type="number" value={editDraft.commission} onChange={e => setEditDraft(d => ({ ...d, commission: +e.target.value }))} placeholder="Commission %" className="border border-[#D0EDEA] rounded-xl px-3 py-2 text-sm outline-none" />
                        <div className="flex gap-2 col-span-4">
                          <button onClick={() => confirmEdit(store.id)} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white text-xs font-black rounded-xl"><Check size={13} /> {isAr ? 'حفظ' : 'Save'}</button>
                          <button onClick={() => setEditingId(null)} className="flex items-center gap-1.5 px-4 py-2 border border-[#D0EDEA] text-[#666] text-xs font-black rounded-xl"><X size={13} /> {isAr ? 'إلغاء' : 'Cancel'}</button>
                        </div>
                      </div>
                    </td>
                  ) : (
                    <>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-[#00C9A7]/20 rounded-xl flex items-center justify-center text-xl">{store.emoji}</div>
                          <div>
                            <p className="font-black text-sm text-[#222]">{isAr ? store.nameAr : store.nameEn}</p>
                            <p className="text-xs text-[#999] font-mono">#{store.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-xs text-[#666]">{getCatLabel(store.catId)}</td>
                      <td className="px-4 py-4 text-sm text-[#444]">{isAr ? (store.ownerAr || '-') : (store.ownerEn || '-')}</td>
                      <td className="px-4 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-black ${store.active ? 'bg-emerald-100 text-emerald-700' : 'bg-[#F0ECE4] text-[#999]'}`}>
                          {store.active ? (isAr ? '● نشط' : '● Active') : (isAr ? '○ معطّل' : '○ Disabled')}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {store.rating > 0 ? (
                          <div className="flex items-center gap-1"><Star size={12} className="fill-[#00C9A7] text-[#00C9A7]" /><span className="text-sm font-black text-[#222]">{store.rating}</span></div>
                        ) : <span className="text-xs text-[#999]">{isAr ? 'جديد' : 'New'}</span>}
                      </td>
                      <td className="px-4 py-4 text-sm font-black text-[#222]">{(store.orders||0).toLocaleString()}</td>
                      <td className="px-4 py-4"><span className="text-sm font-black text-[#00C9A7]">{store.commission||0}%</span></td>
                      <td className="px-4 py-4 text-sm font-black text-[#0D1B4B]">{(store.revenue||0).toLocaleString()} {isAr ? 'د' : 'SAR'}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          <button onClick={() => startEdit(store)} className="p-1.5 hover:bg-[#F0F9F8] rounded-lg text-[#666] hover:text-[#0D1B4B]"><Edit2 size={13} /></button>
                          <button onClick={() => toggleStore(store.id)} className={`p-1.5 rounded-lg text-xs font-black ${store.active ? 'hover:bg-red-50 text-red-400' : 'hover:bg-emerald-50 text-emerald-600'}`}>
                            {store.active ? <XCircle size={13} /> : <CheckCircle size={13} />}
                          </button>
                          <button onClick={() => deleteStore(store.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-400"><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
