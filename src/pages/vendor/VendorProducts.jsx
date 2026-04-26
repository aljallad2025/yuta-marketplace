import { useState, useEffect, useRef } from 'react'
import { Plus, Pencil, Trash2, Search, X, Save, Upload } from 'lucide-react'
import { useLang } from '../../i18n/LangContext'
import { useAuth } from '../../store/authStore'

export default function VendorProducts() {
  const { isAr } = useLang()
  const { currentUser, token } = useAuth()
  const storeId = currentUser?.storeId || currentUser?.store_id || 1

  const [store, setStore] = useState(null)
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingImg, setUploadingImg] = useState(false)
  const imgRef = useRef()

  const fetchData = () => {
    setLoading(true)
    Promise.all([
      fetch('/api/stores/' + storeId).then(r => r.json()),
      fetch('/api/products?store_id=' + storeId).then(r => r.json())
    ]).then(([s, p]) => {
      setStore(s)
      setProducts(Array.isArray(p) ? p : [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const getDefaultForm = () => {
    if (!store) return {}
    if (store.category === 'restaurant') return { name_ar: '', name_en: '', price: '', category_ar: '', category_en: '', description_ar: '', description_en: '', emoji: '🍔', stock: 99, active: 1 }
    if (store.category === 'supermarket') return { name_ar: '', name_en: '', price: '', category_ar: '', category_en: '', description_ar: '', description_en: '', emoji: '🛒', stock: '', active: 1 }
    if (store.category === 'pharmacy') return { name_ar: '', name_en: '', price: '', generic_name: '', category_ar: '', category_en: '', requires_prescription: 0, stock: '', active: 1 }
    return { name_ar: '', name_en: '', price: '', description_ar: '', description_en: '', emoji: '🏪', stock: '', active: 1 }
  }

  const openAdd = () => { setForm(getDefaultForm()); setEditing(null); setShowModal(true) }
  const openEdit = (p) => { setForm({ ...p }); setEditing(p.id); setShowModal(true) }

  const uploadImage = async (file) => {
    setUploadingImg(true)
    const fd = new FormData()
    fd.append('image', file)
    const res = await fetch('/api/uploads/image', { method: 'POST', headers: { Authorization: 'Bearer ' + token }, body: fd })
    const data = await res.json()
    if (data.url) setForm(f => ({ ...f, image: data.url, emoji: data.url }))
    setUploadingImg(false)
  }

  const handleSave = async () => {
    setSaving(true)
    const method = editing ? 'PUT' : 'POST'
    const url = editing ? '/api/products/' + editing : '/api/products'
    const body = { ...form, store_id: storeId, price: Number(form.price), stock: Number(form.stock) || 0 }
    await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: JSON.stringify(body) })
    setSaving(false)
    setShowModal(false)
    fetchData()
  }

  const handleDelete = async (id) => {
    if (!confirm(isAr ? 'حذف المنتج؟' : 'Delete product?')) return
    await fetch('/api/products/' + id, { method: 'DELETE', headers: { Authorization: 'Bearer ' + token } })
    fetchData()
  }

  const filtered = products.filter(p => (isAr ? p.name_ar : p.name_en)?.toLowerCase().includes(search.toLowerCase()))

  const renderFormFields = () => {
    if (!store) return null
    const cat = store.category
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-black text-gray-600 block mb-1">{isAr ? 'الاسم (عربي)' : 'Name (Arabic)'}</label>
            <input value={form.name_ar || ''} onChange={e => setForm(f => ({ ...f, name_ar: e.target.value }))} dir="rtl"
              className="w-full border border-[#D0EDEA] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#00C9A7]" />
          </div>
          <div>
            <label className="text-xs font-black text-gray-600 block mb-1">{isAr ? 'الاسم (إنجليزي)' : 'Name (English)'}</label>
            <input value={form.name_en || ''} onChange={e => setForm(f => ({ ...f, name_en: e.target.value }))}
              className="w-full border border-[#D0EDEA] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#00C9A7]" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-black text-gray-600 block mb-1">{isAr ? 'السعر (ريال)' : 'Price (SAR)'}</label>
            <input type="number" value={form.price || ''} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
              className="w-full border border-[#D0EDEA] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#00C9A7]" />
          </div>
          <div>
            <label className="text-xs font-black text-gray-600 block mb-1">{isAr ? 'المخزون' : 'Stock'}</label>
            <input type="number" value={form.stock || ''} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
              className="w-full border border-[#D0EDEA] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#00C9A7]" />
          </div>
        </div>

        {(cat === 'restaurant' || cat === 'supermarket') && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-gray-600 block mb-1">{isAr ? 'القسم (عربي)' : 'Category (AR)'}</label>
              <input value={form.category_ar || ''} onChange={e => setForm(f => ({ ...f, category_ar: e.target.value }))} dir="rtl"
                className="w-full border border-[#D0EDEA] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#00C9A7]" placeholder={cat === 'restaurant' ? 'مشاوي' : 'مشروبات'} />
            </div>
            <div>
              <label className="text-xs font-black text-gray-600 block mb-1">{isAr ? 'القسم (إنجليزي)' : 'Category (EN)'}</label>
              <input value={form.category_en || ''} onChange={e => setForm(f => ({ ...f, category_en: e.target.value }))}
                className="w-full border border-[#D0EDEA] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#00C9A7]" placeholder={cat === 'restaurant' ? 'Grills' : 'Beverages'} />
            </div>
          </div>
        )}

        {cat === 'restaurant' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-gray-600 block mb-1">{isAr ? 'الوصف (عربي)' : 'Description (AR)'}</label>
              <textarea value={form.description_ar || ''} onChange={e => setForm(f => ({ ...f, description_ar: e.target.value }))} dir="rtl" rows={2}
                className="w-full border border-[#D0EDEA] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#00C9A7]" />
            </div>
            <div>
              <label className="text-xs font-black text-gray-600 block mb-1">{isAr ? 'الوصف (إنجليزي)' : 'Description (EN)'}</label>
              <textarea value={form.description_en || ''} onChange={e => setForm(f => ({ ...f, description_en: e.target.value }))} rows={2}
                className="w-full border border-[#D0EDEA] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#00C9A7]" />
            </div>
          </div>
        )}

        {cat === 'pharmacy' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-gray-600 block mb-1">{isAr ? 'الاسم العلمي' : 'Generic Name'}</label>
              <input value={form.generic_name || ''} onChange={e => setForm(f => ({ ...f, generic_name: e.target.value }))}
                className="w-full border border-[#D0EDEA] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#00C9A7]" />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={!!form.requires_prescription} onChange={e => setForm(f => ({ ...f, requires_prescription: e.target.checked ? 1 : 0 }))} />
                <span className="text-sm font-bold text-gray-600">{isAr ? 'يحتاج وصفة' : 'Requires Rx'}</span>
              </label>
            </div>
          </div>
        )}

        <div>
          <label className="text-xs font-black text-gray-600 block mb-1">{isAr ? 'صورة / إيموجي' : 'Image / Emoji'}</label>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-[#F0F9F8] rounded-xl border border-[#D0EDEA] flex items-center justify-center text-2xl overflow-hidden flex-shrink-0">
              {form.emoji?.startsWith('/') || form.emoji?.startsWith('http')
                ? <img src={form.emoji} className="w-full h-full object-cover" />
                : form.emoji || '🏪'}
            </div>
            <div className="flex-1 space-y-2">
              <input value={form.emoji || ''} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} placeholder="🍔"
                className="w-full border border-[#D0EDEA] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#00C9A7]" />
              <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files[0] && uploadImage(e.target.files[0])} />
              <button onClick={() => imgRef.current.click()} className="text-xs text-[#00C9A7] font-bold flex items-center gap-1">
                <Upload size={12} />{uploadingImg ? (isAr ? 'جاري الرفع...' : 'Uploading...') : (isAr ? 'رفع صورة' : 'Upload image')}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-[#0D1B4B]">{isAr ? 'المنتجات' : 'Products'}</h1>
          <p className="text-sm text-gray-400">{store ? (isAr ? store.name_ar : store.name_en) : ''} · {products.length} {isAr ? 'منتج' : 'items'}</p>
        </div>
        <button onClick={openAdd} className="bg-[#0D1B4B] text-white font-black px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm">
          <Plus size={16} />{isAr ? 'إضافة منتج' : 'Add Product'}
        </button>
      </div>

      <div className="flex items-center bg-white border border-[#D0EDEA] rounded-xl px-4 py-2.5 gap-2 mb-5">
        <Search size={15} className="text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder={isAr ? 'ابحث...' : 'Search...'}
          className="flex-1 outline-none text-sm bg-transparent" />
      </div>

      {loading ? <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-[#00C9A7] border-t-transparent rounded-full animate-spin" /></div>
      : filtered.length === 0 ? <div className="text-center py-20 text-gray-400">{isAr ? 'لا توجد منتجات' : 'No products'}</div>
      : <div className="space-y-3">
          {filtered.map(p => (
            <div key={p.id} className="bg-white rounded-2xl border border-[#D0EDEA] p-4 flex items-center gap-4">
              <div className="w-14 h-14 bg-[#F0F9F8] rounded-xl flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
                {p.emoji?.startsWith('/') || p.emoji?.startsWith('http') ? <img src={p.emoji} className="w-full h-full object-cover" /> : p.emoji || '🏪'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-[#0D1B4B] text-sm">{isAr ? p.name_ar : p.name_en}</p>
                <p className="text-xs text-gray-400">{isAr ? p.category_ar : p.category_en}</p>
                <p className="text-[#00C9A7] font-black text-sm">{p.price} {isAr ? 'ريال' : 'SAR'}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(p)} className="p-2 bg-[#F0F9F8] rounded-lg"><Pencil size={14} className="text-[#0D1B4B]" /></button>
                <button onClick={() => handleDelete(p.id)} className="p-2 bg-red-50 rounded-lg"><Trash2 size={14} className="text-red-500" /></button>
              </div>
            </div>
          ))}
        </div>}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[#D0EDEA]">
              <h2 className="font-black text-[#0D1B4B]">{editing ? (isAr ? 'تعديل منتج' : 'Edit Product') : (isAr ? 'إضافة منتج' : 'Add Product')}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 bg-[#F0F9F8] rounded-xl"><X size={16} /></button>
            </div>
            <div className="p-5">{renderFormFields()}</div>
            <div className="p-5 border-t border-[#D0EDEA]">
              <button onClick={handleSave} disabled={saving} className="w-full bg-[#0D1B4B] text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60">
                <Save size={16} />{saving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ' : 'Save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
