import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, X, Check, Search, ChevronDown } from 'lucide-react'
import { useLang } from '../../i18n/LangContext'
import axios from 'axios'

const api = axios.create({ baseURL: '/api' })
api.interceptors.request.use(c => {
  const t = localStorage.getItem('sumu_token')
  if (t) c.headers.Authorization = `Bearer ${t}`
  return c
})

const TABS = [
  { key: 'hotels',    labelAr: 'فنادق',       labelEn: 'Hotels',    emoji: '🏨' },
  { key: 'flights',   labelAr: 'طيران',       labelEn: 'Flights',   emoji: '✈️' },
  { key: 'doctors',   labelAr: 'أطباء',       labelEn: 'Doctors',   emoji: '🩺' },
  { key: 'insurance', labelAr: 'تأمين',       labelEn: 'Insurance', emoji: '🛡️' },
  { key: 'pharmacy',  labelAr: 'صيدلية',      labelEn: 'Pharmacy',  emoji: '💊' },
  { key: 'cosmetics', labelAr: 'كوزماتكس',    labelEn: 'Cosmetics', emoji: '💄' },
]

const FIELDS = {
  hotels:    [
    { key: 'store_id',       labelAr: 'رقم المتجر',        labelEn: 'Store ID',         type: 'number' },
    { key: 'room_type_ar',   labelAr: 'نوع الغرفة (ع)',    labelEn: 'Room Type (AR)',    type: 'text', dir: 'rtl' },
    { key: 'room_type_en',   labelAr: 'نوع الغرفة (إنج)',  labelEn: 'Room Type (EN)',    type: 'text' },
    { key: 'price_per_night',labelAr: 'السعر/ليلة',        labelEn: 'Price/Night',       type: 'number' },
    { key: 'max_guests',     labelAr: 'أقصى ضيوف',         labelEn: 'Max Guests',        type: 'number' },
    { key: 'check_in',       labelAr: 'وقت الدخول',        labelEn: 'Check-in',          type: 'text' },
    { key: 'check_out',      labelAr: 'وقت الخروج',        labelEn: 'Check-out',         type: 'text' },
  ],
  flights:   [
    { key: 'store_id',       labelAr: 'رقم المتجر',        labelEn: 'Store ID',          type: 'number' },
    { key: 'flight_number',  labelAr: 'رقم الرحلة',        labelEn: 'Flight No.',        type: 'text' },
    { key: 'airline',        labelAr: 'شركة الطيران',      labelEn: 'Airline',           type: 'text' },
    { key: 'from_ar',        labelAr: 'من (ع)',            labelEn: 'From (AR)',         type: 'text', dir: 'rtl' },
    { key: 'from_en',        labelAr: 'من (إنج)',          labelEn: 'From (EN)',         type: 'text' },
    { key: 'to_ar',          labelAr: 'إلى (ع)',           labelEn: 'To (AR)',           type: 'text', dir: 'rtl' },
    { key: 'to_en',          labelAr: 'إلى (إنج)',         labelEn: 'To (EN)',           type: 'text' },
    { key: 'departure',      labelAr: 'وقت الإقلاع',       labelEn: 'Departure',         type: 'text' },
    { key: 'arrival',        labelAr: 'وقت الوصول',        labelEn: 'Arrival',           type: 'text' },
    { key: 'class_ar',       labelAr: 'الدرجة (ع)',        labelEn: 'Class (AR)',        type: 'text', dir: 'rtl' },
    { key: 'class_en',       labelAr: 'الدرجة (إنج)',      labelEn: 'Class (EN)',        type: 'text' },
    { key: 'price',          labelAr: 'السعر',             labelEn: 'Price',             type: 'number' },
    { key: 'seats_available',labelAr: 'المقاعد المتاحة',   labelEn: 'Seats Available',   type: 'number' },
  ],
  doctors:   [
    { key: 'store_id',           labelAr: 'رقم المتجر',       labelEn: 'Store ID',           type: 'number' },
    { key: 'name_ar',            labelAr: 'الاسم (ع)',        labelEn: 'Name (AR)',          type: 'text', dir: 'rtl' },
    { key: 'name_en',            labelAr: 'الاسم (إنج)',      labelEn: 'Name (EN)',          type: 'text' },
    { key: 'specialty_ar',       labelAr: 'التخصص (ع)',      labelEn: 'Specialty (AR)',     type: 'text', dir: 'rtl' },
    { key: 'specialty_en',       labelAr: 'التخصص (إنج)',    labelEn: 'Specialty (EN)',     type: 'text' },
    { key: 'price_consultation', labelAr: 'سعر الاستشارة',   labelEn: 'Consultation Price', type: 'number' },
    { key: 'experience_years',   labelAr: 'سنوات الخبرة',    labelEn: 'Experience (yrs)',   type: 'number' },
  ],
  insurance: [
    { key: 'store_id',      labelAr: 'رقم المتجر',     labelEn: 'Store ID',        type: 'number' },
    { key: 'plan_name_ar',  labelAr: 'اسم الخطة (ع)',  labelEn: 'Plan Name (AR)',  type: 'text', dir: 'rtl' },
    { key: 'plan_name_en',  labelAr: 'اسم الخطة (إنج)',labelEn: 'Plan Name (EN)',  type: 'text' },
    { key: 'type_ar',       labelAr: 'النوع (ع)',      labelEn: 'Type (AR)',       type: 'text', dir: 'rtl' },
    { key: 'type_en',       labelAr: 'النوع (إنج)',    labelEn: 'Type (EN)',       type: 'text' },
    { key: 'price_monthly', labelAr: 'السعر/شهر',      labelEn: 'Monthly Price',   type: 'number' },
    { key: 'price_yearly',  labelAr: 'السعر/سنة',      labelEn: 'Yearly Price',    type: 'number' },
    { key: 'max_coverage',  labelAr: 'أقصى تغطية',     labelEn: 'Max Coverage',    type: 'number' },
  ],
  pharmacy:  [
    { key: 'store_id',            labelAr: 'رقم المتجر',      labelEn: 'Store ID',            type: 'number' },
    { key: 'name_ar',             labelAr: 'الاسم (ع)',       labelEn: 'Name (AR)',           type: 'text', dir: 'rtl' },
    { key: 'name_en',             labelAr: 'الاسم (إنج)',     labelEn: 'Name (EN)',           type: 'text' },
    { key: 'generic_name',        labelAr: 'الاسم العلمي',    labelEn: 'Generic Name',        type: 'text' },
    { key: 'price',               labelAr: 'السعر',           labelEn: 'Price',               type: 'number' },
    { key: 'stock',               labelAr: 'المخزون',         labelEn: 'Stock',               type: 'number' },
    { key: 'category_ar',         labelAr: 'الفئة (ع)',       labelEn: 'Category (AR)',       type: 'text', dir: 'rtl' },
    { key: 'category_en',         labelAr: 'الفئة (إنج)',     labelEn: 'Category (EN)',       type: 'text' },
  ],
  cosmetics: [
    { key: 'store_id',     labelAr: 'رقم المتجر',    labelEn: 'Store ID',      type: 'number' },
    { key: 'name_ar',      labelAr: 'الاسم (ع)',     labelEn: 'Name (AR)',     type: 'text', dir: 'rtl' },
    { key: 'name_en',      labelAr: 'الاسم (إنج)',   labelEn: 'Name (EN)',     type: 'text' },
    { key: 'brand',        labelAr: 'الماركة',       labelEn: 'Brand',         type: 'text' },
    { key: 'price',        labelAr: 'السعر',         labelEn: 'Price',         type: 'number' },
    { key: 'stock',        labelAr: 'المخزون',       labelEn: 'Stock',         type: 'number' },
    { key: 'category_ar',  labelAr: 'الفئة (ع)',     labelEn: 'Category (AR)', type: 'text', dir: 'rtl' },
    { key: 'category_en',  labelAr: 'الفئة (إنج)',   labelEn: 'Category (EN)', type: 'text' },
    { key: 'skin_type_ar', labelAr: 'نوع البشرة (ع)',labelEn: 'Skin Type (AR)',type: 'text', dir: 'rtl' },
    { key: 'skin_type_en', labelAr: 'نوع البشرة (إ)',labelEn: 'Skin Type (EN)',type: 'text' },
  ],
}

function emptyForm(tab) {
  const obj = {}
  FIELDS[tab].forEach(f => { obj[f.key] = '' })
  return obj
}

function getLabel(item, tab, isAr) {
  if (tab === 'hotels')    return isAr ? item.room_type_ar    : item.room_type_en
  if (tab === 'flights')   return `${item.airline || ''} ${item.flight_number || ''} ${item.from_en || ''} → ${item.to_en || ''}`
  if (tab === 'doctors')   return isAr ? item.name_ar         : item.name_en
  if (tab === 'insurance') return isAr ? item.plan_name_ar    : item.plan_name_en
  if (tab === 'pharmacy')  return isAr ? item.name_ar         : item.name_en
  if (tab === 'cosmetics') return isAr ? item.name_ar         : item.name_en
  return item.id
}

function getSubLabel(item, tab, isAr) {
  if (tab === 'hotels')    return `${item.price_per_night || 0} / night • max ${item.max_guests || 0} guests`
  if (tab === 'flights')   return `${item.departure || ''} → ${item.arrival || ''} • ${item.price || 0}`
  if (tab === 'doctors')   return isAr ? item.specialty_ar : item.specialty_en
  if (tab === 'insurance') return `${item.price_monthly || 0}/mo • ${item.price_yearly || 0}/yr`
  if (tab === 'pharmacy')  return `${item.price || 0} • stock: ${item.stock || 0}`
  if (tab === 'cosmetics') return `${item.brand || ''} • ${item.price || 0}`
  return ''
}

export default function AdminCatalog() {
  const { isAr } = useLang()
  const [tab, setTab] = useState('hotels')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState(emptyForm('hotels'))
  const [editId, setEditId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [saving, setSaving] = useState(false)

  const load = async (t) => {
    setLoading(true)
    try {
      const res = await api.get(`/catalog/${t}`)
      setItems(Array.isArray(res.data) ? res.data : [])
    } catch { setItems([]) }
    setLoading(false)
  }

  useEffect(() => { load(tab); setSearch(''); setShowAdd(false); setEditId(null); setForm(emptyForm(tab)) }, [tab])

  const handleAdd = async () => {
    setSaving(true)
    try {
      await api.post(`/catalog/${tab}`, form)
      await load(tab)
      setForm(emptyForm(tab))
      setShowAdd(false)
    } catch(e) { alert(e?.response?.data?.error || 'Error') }
    setSaving(false)
  }

  const handleEdit = async (id) => {
    setSaving(true)
    try {
      await api.put(`/catalog/${tab}/${id}`, editForm)
      await load(tab)
      setEditId(null)
    } catch(e) { alert(e?.response?.data?.error || 'Error') }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    if (!confirm(isAr ? 'حذف هذا العنصر؟' : 'Delete this item?')) return
    try {
      await api.delete(`/catalog/${tab}/${id}`)
      setItems(prev => prev.filter(i => i.id !== id))
    } catch(e) { alert('Error') }
  }

  const filtered = items.filter(item => {
    const label = getLabel(item, tab, isAr) || ''
    return label.toLowerCase().includes(search.toLowerCase())
  })

  const fields = FIELDS[tab]
  const currentTab = TABS.find(t => t.key === tab)

  return (
    <div className="p-6 space-y-5" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#0F2A47]">{isAr ? 'إدارة الكاتالوج' : 'Catalog Management'}</h1>
          <p className="text-sm text-[#666]">{isAr ? `${filtered.length} عنصر` : `${filtered.length} items`}</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#0F2A47] text-white text-sm font-black rounded-xl">
          <Plus size={14} /> {isAr ? 'إضافة' : 'Add'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-black transition-all ${tab === t.key ? 'bg-[#0F2A47] text-white' : 'bg-white border border-[#E8E4DC] text-[#444] hover:border-[#0F2A47]'}`}>
            <span>{t.emoji}</span>
            <span>{isAr ? t.labelAr : t.labelEn}</span>
          </button>
        ))}
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="bg-white rounded-2xl border-2 border-[#C8A951] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-[#0F2A47]">{isAr ? `إضافة ${currentTab?.labelAr}` : `Add ${currentTab?.labelEn}`}</h3>
            <button onClick={() => setShowAdd(false)} className="p-1 rounded-lg hover:bg-[#FBF8F2] text-[#999]"><X size={16} /></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {fields.map(f => (
              <div key={f.key}>
                <label className="text-xs font-black text-[#444] block mb-1">{isAr ? f.labelAr : f.labelEn}</label>
                <input type={f.type} value={form[f.key] || ''} dir={f.dir || 'ltr'}
                  onChange={e => setForm(p => ({ ...p, [f.key]: f.type === 'number' ? +e.target.value : e.target.value }))}
                  className="w-full border border-[#E8E4DC] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#C8A951]" />
              </div>
            ))}
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm text-[#666] border border-[#E8E4DC] rounded-xl font-black">{isAr ? 'إلغاء' : 'Cancel'}</button>
            <button onClick={handleAdd} disabled={saving} className="px-5 py-2 bg-[#C8A951] text-[#0F2A47] text-sm font-black rounded-xl disabled:opacity-60">
              {saving ? (isAr ? 'جارٍ الحفظ...' : 'Saving...') : (isAr ? 'إضافة' : 'Add')}
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="flex items-center bg-white rounded-xl px-4 py-2.5 gap-2 shadow-sm border border-[#E8E4DC]">
        <Search size={16} className="text-[#999]" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder={isAr ? 'بحث...' : 'Search...'}
          className="flex-1 outline-none text-sm bg-transparent" />
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-16 text-[#999] text-sm">{isAr ? 'جارٍ التحميل...' : 'Loading...'}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-[#999]">
          <p className="text-4xl mb-3">{currentTab?.emoji}</p>
          <p className="font-black text-[#444]">{isAr ? 'لا توجد عناصر بعد' : 'No items yet'}</p>
          <p className="text-sm mt-1">{isAr ? 'أضف أول عنصر بالضغط على زر الإضافة' : 'Add your first item using the Add button'}</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8E4DC] overflow-hidden">
          {filtered.map((item, i) => (
            <div key={item.id} className={`${i < filtered.length - 1 ? 'border-b border-[#F0ECE4]' : ''}`}>
              {editId === item.id ? (
                <div className="p-4 space-y-3 bg-[#FBF8F2]">
                  <div className="grid grid-cols-2 gap-3">
                    {fields.filter(f => f.key !== 'store_id').map(f => (
                      <div key={f.key}>
                        <label className="text-xs font-black text-[#444] block mb-1">{isAr ? f.labelAr : f.labelEn}</label>
                        <input type={f.type} value={editForm[f.key] ?? ''} dir={f.dir || 'ltr'}
                          onChange={e => setEditForm(p => ({ ...p, [f.key]: f.type === 'number' ? +e.target.value : e.target.value }))}
                          className="w-full border border-[#E8E4DC] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#C8A951] bg-white" />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(item.id)} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white text-xs font-black rounded-xl disabled:opacity-60"><Check size={13} /> {isAr ? 'حفظ' : 'Save'}</button>
                    <button onClick={() => setEditId(null)} className="flex items-center gap-1.5 px-4 py-2 border border-[#E8E4DC] text-[#666] text-xs font-black rounded-xl"><X size={13} /> {isAr ? 'إلغاء' : 'Cancel'}</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between px-4 py-3.5 hover:bg-[#FBF8F2]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#C8A951]/15 rounded-xl flex items-center justify-center text-lg">{currentTab?.emoji}</div>
                    <div>
                      <p className="font-black text-sm text-[#222]">{getLabel(item, tab, isAr)}</p>
                      <p className="text-xs text-[#999]">{getSubLabel(item, tab, isAr)} <span className="text-[#CCC]">• #{item.id}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => { setEditId(item.id); setEditForm({...item}) }} className="p-1.5 hover:bg-white rounded-lg text-[#666] hover:text-[#0F2A47]"><Edit2 size={13} /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-400"><Trash2 size={13} /></button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
