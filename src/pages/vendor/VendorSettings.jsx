import { useState, useRef } from 'react'
import { useLang } from '../../i18n/LangContext'
import { useAuth } from '../../store/authStore'
import { Store, Clock, Phone, DollarSign, ToggleLeft, ToggleRight, Save, CheckCircle, Upload, Image } from 'lucide-react'

export default function VendorSettings() {
  const { isAr } = useLang()
  const { currentUser, token } = useAuth()
  const storeId = currentUser?.storeId || currentUser?.store_id || 1

  const [store, setStore] = useState(null)
  const [form, setForm] = useState({})
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingBg, setUploadingBg] = useState(false)
  const logoRef = useRef()
  const bgRef = useRef()

  useState(() => {
    fetch('/api/stores/' + storeId)
      .then(r => r.json())
      .then(s => {
        setStore(s)
        setForm({
          name_ar: s.name_ar || '',
          name_en: s.name_en || '',
          phone: s.phone || '',
          min_order: s.min_order || 0,
          delivery_fee: s.delivery_fee || 0,
          delivery_time: s.delivery_time || '',
          is_open: s.is_open ?? 1,
          logo: s.logo || '',
          cover_image: s.cover_image || '',
          address_ar: s.address_ar || '',
          address_en: s.address_en || '',
        })
      })
  }, [])

  const uploadImage = async (file, field, setUploading) => {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('image', file)
      const res = await fetch('/api/uploads/image', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token },
        body: fd,
      })
      const data = await res.json()
      if (data.url) setForm(f => ({ ...f, [field]: data.url }))
    } catch (e) {
      setError(isAr ? 'فشل رفع الصورة' : 'Upload failed')
    }
    setUploading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/stores/' + storeId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify(form),
      })
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000) }
      else setError(isAr ? 'فشل الحفظ' : 'Save failed')
    } catch { setError(isAr ? 'خطأ في الاتصال' : 'Connection error') }
    setSaving(false)
  }

  if (!store) return <div className="p-6 flex justify-center"><div className="w-8 h-8 border-4 border-[#00C9A7] border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="p-6 max-w-2xl" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="mb-6">
        <h1 className="text-xl font-black text-[#0D1B4B]">{isAr ? 'إعدادات المتجر' : 'Store Settings'}</h1>
        <p className="text-sm text-[#888] mt-0.5">{isAr ? 'تعديل معلومات وإعدادات متجرك' : 'Edit your store information'}</p>
      </div>

      {saved && <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
        <CheckCircle size={18} className="text-emerald-600" />
        <p className="font-black text-emerald-700 text-sm">{isAr ? 'تم الحفظ بنجاح!' : 'Saved successfully!'}</p>
      </div>}
      {error && <div className="mb-4 bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm font-bold">{error}</div>}

      {/* صورة الغلاف */}
      <div className="bg-white rounded-2xl border border-[#D0EDEA] p-5 mb-4">
        <h2 className="font-black text-[#0D1B4B] mb-4 flex items-center gap-2"><Image size={16} />{isAr ? 'صورة الغلاف' : 'Cover Image'}</h2>
        <div className="relative h-36 bg-gradient-to-br from-[#0D1B4B] to-[#0A3D8F] rounded-xl overflow-hidden mb-3 flex items-center justify-center cursor-pointer"
          onClick={() => bgRef.current.click()}>
          {form.cover_image
            ? <img src={form.cover_image} className="w-full h-full object-cover" />
            : <div className="text-white/40 flex flex-col items-center gap-2"><Upload size={28} /><span className="text-xs">{isAr ? 'اضغط لرفع صورة الغلاف' : 'Click to upload cover'}</span></div>}
          {uploadingBg && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" /></div>}
        </div>
        <input ref={bgRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files[0] && uploadImage(e.target.files[0], 'cover_image', setUploadingBg)} />
        <button onClick={() => bgRef.current.click()} className="text-xs text-[#00C9A7] font-bold flex items-center gap-1"><Upload size={12} />{isAr ? 'رفع صورة غلاف' : 'Upload cover image'}</button>
      </div>

      {/* الشعار */}
      <div className="bg-white rounded-2xl border border-[#D0EDEA] p-5 mb-4">
        <h2 className="font-black text-[#0D1B4B] mb-4 flex items-center gap-2"><Store size={16} />{isAr ? 'شعار المتجر' : 'Store Logo'}</h2>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-[#F0F9F8] rounded-2xl border-2 border-dashed border-[#D0EDEA] flex items-center justify-center overflow-hidden cursor-pointer flex-shrink-0"
            onClick={() => logoRef.current.click()}>
            {form.logo?.startsWith('/') || form.logo?.startsWith('http')
              ? <img src={form.logo} className="w-full h-full object-cover" />
              : <span className="text-3xl">{form.logo || '🏪'}</span>}
            {uploadingLogo && <div className="absolute w-20 h-20 bg-black/50 flex items-center justify-center rounded-2xl"><div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" /></div>}
          </div>
          <div>
            <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files[0] && uploadImage(e.target.files[0], 'logo', setUploadingLogo)} />
            <button onClick={() => logoRef.current.click()} className="bg-[#0D1B4B] text-white text-xs font-black px-4 py-2 rounded-xl mb-2 flex items-center gap-1"><Upload size={12} />{isAr ? 'رفع شعار' : 'Upload logo'}</button>
            <p className="text-xs text-gray-400">{isAr ? 'أو استخدم إيموجي:' : 'Or use emoji:'}</p>
            <input value={form.logo} onChange={e => setForm(f => ({ ...f, logo: e.target.value }))}
              className="border border-[#D0EDEA] rounded-xl px-3 py-1.5 text-sm outline-none w-24 mt-1" placeholder="🏪" />
          </div>
        </div>
      </div>

      {/* حالة المتجر */}
      <div className="bg-white rounded-2xl border border-[#D0EDEA] p-5 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-black text-[#222] text-sm">{isAr ? 'فتح المتجر للطلبات' : 'Open for Orders'}</p>
            <p className="text-xs text-[#888] mt-0.5">{form.is_open ? (isAr ? 'مفتوح' : 'Open') : (isAr ? 'مغلق' : 'Closed')}</p>
          </div>
          <button onClick={() => setForm(f => ({ ...f, is_open: f.is_open ? 0 : 1 }))}>
            {form.is_open ? <ToggleRight size={32} className="text-emerald-500" /> : <ToggleLeft size={32} className="text-[#ccc]" />}
          </button>
        </div>
      </div>

      {/* معلومات المتجر */}
      <div className="bg-white rounded-2xl border border-[#D0EDEA] p-5 mb-4">
        <h2 className="font-black text-[#0D1B4B] mb-4 flex items-center gap-2"><Store size={16} />{isAr ? 'معلومات المتجر' : 'Store Information'}</h2>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-[#666] mb-1.5">{isAr ? 'الاسم (عربي)' : 'Name (Arabic)'}</label>
              <input value={form.name_ar} onChange={e => setForm(f => ({ ...f, name_ar: e.target.value }))}
                className="w-full border border-[#D0EDEA] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#00C9A7]" dir="rtl" />
            </div>
            <div>
              <label className="block text-xs font-black text-[#666] mb-1.5">{isAr ? 'الاسم (إنجليزي)' : 'Name (English)'}</label>
              <input value={form.name_en} onChange={e => setForm(f => ({ ...f, name_en: e.target.value }))}
                className="w-full border border-[#D0EDEA] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#00C9A7]" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-black text-[#666] mb-1.5"><Phone size={11} className="inline ml-1" />{isAr ? 'رقم الهاتف' : 'Phone'}</label>
            <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              className="w-full border border-[#D0EDEA] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#00C9A7]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-[#666] mb-1.5">{isAr ? 'العنوان (عربي)' : 'Address (Arabic)'}</label>
              <input value={form.address_ar} onChange={e => setForm(f => ({ ...f, address_ar: e.target.value }))}
                className="w-full border border-[#D0EDEA] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#00C9A7]" dir="rtl" />
            </div>
            <div>
              <label className="block text-xs font-black text-[#666] mb-1.5">{isAr ? 'العنوان (إنجليزي)' : 'Address (English)'}</label>
              <input value={form.address_en} onChange={e => setForm(f => ({ ...f, address_en: e.target.value }))}
                className="w-full border border-[#D0EDEA] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#00C9A7]" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-black text-[#666] mb-1.5"><DollarSign size={11} className="inline" />{isAr ? 'حد أدنى (ريال)' : 'Min Order (SAR)'}</label>
              <input type="number" value={form.min_order} onChange={e => setForm(f => ({ ...f, min_order: +e.target.value }))}
                className="w-full border border-[#D0EDEA] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#00C9A7]" />
            </div>
            <div>
              <label className="block text-xs font-black text-[#666] mb-1.5">{isAr ? 'رسوم التوصيل' : 'Delivery Fee'}</label>
              <input type="number" value={form.delivery_fee} onChange={e => setForm(f => ({ ...f, delivery_fee: +e.target.value }))}
                className="w-full border border-[#D0EDEA] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#00C9A7]" />
            </div>
            <div>
              <label className="block text-xs font-black text-[#666] mb-1.5"><Clock size={11} className="inline" />{isAr ? 'وقت التوصيل' : 'Delivery Time'}</label>
              <input value={form.delivery_time} onChange={e => setForm(f => ({ ...f, delivery_time: e.target.value }))}
                className="w-full border border-[#D0EDEA] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#00C9A7]" placeholder="30-45" />
            </div>
          </div>
        </div>
      </div>

      <button onClick={handleSave} disabled={saving}
        className="w-full bg-[#0D1B4B] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-60">
        <Save size={16} />{saving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ الإعدادات' : 'Save Settings')}
      </button>
    </div>
  )
}
