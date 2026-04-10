import { useState } from 'react'
import { useLang } from '../../i18n/LangContext'
import { useStores } from '../../store/storesStore'
import { useApp } from '../../store/appStore'
import { useAuth } from '../../store/authStore'
import { Store, Clock, Phone, DollarSign, ToggleLeft, ToggleRight, Save, CheckCircle } from 'lucide-react'

export default function VendorSettings() {
  const { isAr } = useLang()
  const { currentUser } = useAuth()
  const activeVendorId = currentUser?.storeId || currentUser?.store_id || 1
  const { stores, updateStore } = useStores()
  const store = stores.find(s => s.id === activeVendorId) || stores[0]

  const [form, setForm] = useState({
    nameAr: store?.nameAr || '',
    nameEn: store?.nameEn || '',
    phone: store?.phone || '',
    minOrder: store?.minOrder || 0,
    deliveryFee: store?.deliveryFee || 0,
    time: store?.time || '',
    open: store?.open ?? true,
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    updateStore(store?.id || form)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="p-6 max-w-2xl" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="mb-6">
        <h1 className="text-xl font-black text-[#0F2A47]">{isAr ? 'إعدادات المتجر' : 'Store Settings'}</h1>
        <p className="text-sm text-[#888] mt-0.5">{isAr ? 'تعديل معلومات وإعدادات متجرك' : 'Edit your store information and settings'}</p>
      </div>

      {saved && (
        <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
          <CheckCircle size={18} className="text-emerald-600" />
          <p className="font-black text-emerald-700 text-sm">{isAr ? 'تم حفظ الإعدادات بنجاح!' : 'Settings saved successfully!'}</p>
        </div>
      )}

      {/* Store status */}
      <div className="bg-white rounded-2xl border border-[#E8E4DC] p-5 mb-4">
        <h2 className="font-black text-[#0F2A47] mb-4 flex items-center gap-2">
          <Store size={16} /> {isAr ? 'حالة المتجر' : 'Store Status'}
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-black text-[#222] text-sm">{isAr ? 'فتح المتجر للطلبات' : 'Open Store for Orders'}</p>
            <p className="text-xs text-[#888] mt-0.5">
              {form.open ? (isAr ? 'المتجر يستقبل الطلبات الآن' : 'Store is receiving orders') : (isAr ? 'المتجر مغلق' : 'Store is closed')}
            </p>
          </div>
          <button onClick={() => setForm(f => ({ ...f, open: !f.open }))}>
            {form.open
              ? <ToggleRight size={32} className="text-emerald-500" />
              : <ToggleLeft size={32} className="text-[#ccc]" />
            }
          </button>
        </div>
      </div>

      {/* Basic info */}
      <div className="bg-white rounded-2xl border border-[#E8E4DC] p-5 mb-4">
        <h2 className="font-black text-[#0F2A47] mb-4 flex items-center gap-2">
          <Store size={16} /> {isAr ? 'معلومات المتجر' : 'Store Information'}
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-[#666] mb-1.5">{isAr ? 'اسم المتجر (عربي)' : 'Store Name (Arabic)'}</label>
              <input value={form.nameAr} onChange={e => setForm(f => ({ ...f, nameAr: e.target.value }))}
                className="w-full border border-[#E8E4DC] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#C8A951]" dir="rtl" />
            </div>
            <div>
              <label className="block text-xs font-black text-[#666] mb-1.5">{isAr ? 'اسم المتجر (إنجليزي)' : 'Store Name (English)'}</label>
              <input value={form.nameEn} onChange={e => setForm(f => ({ ...f, nameEn: e.target.value }))}
                className="w-full border border-[#E8E4DC] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#C8A951]" dir="ltr" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-black text-[#666] mb-1.5 flex items-center gap-1">
              <Phone size={11} /> {isAr ? 'رقم الهاتف' : 'Phone Number'}
            </label>
            <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              className="w-full border border-[#E8E4DC] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#C8A951]" dir="ltr" />
          </div>
        </div>
      </div>

      {/* Delivery settings */}
      <div className="bg-white rounded-2xl border border-[#E8E4DC] p-5 mb-4">
        <h2 className="font-black text-[#0F2A47] mb-4 flex items-center gap-2">
          <Clock size={16} /> {isAr ? 'إعدادات التوصيل' : 'Delivery Settings'}
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-black text-[#666] mb-1.5">{isAr ? 'الحد الأدنى للطلب (د)' : 'Min Order (AED)'}</label>
            <input type="number" min="0" value={form.minOrder} onChange={e => setForm(f => ({ ...f, minOrder: Number(e.target.value) }))}
              className="w-full border border-[#E8E4DC] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#C8A951]" />
          </div>
          <div>
            <label className="block text-xs font-black text-[#666] mb-1.5">{isAr ? 'رسوم التوصيل (د)' : 'Delivery Fee (AED)'}</label>
            <input type="number" min="0" value={form.deliveryFee} onChange={e => setForm(f => ({ ...f, deliveryFee: Number(e.target.value) }))}
              className="w-full border border-[#E8E4DC] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#C8A951]" />
          </div>
          <div>
            <label className="block text-xs font-black text-[#666] mb-1.5">{isAr ? 'وقت التوصيل' : 'Delivery Time'}</label>
            <input value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
              placeholder="20–35"
              className="w-full border border-[#E8E4DC] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#C8A951]" />
          </div>
        </div>
      </div>

      {/* Save button */}
      <button onClick={handleSave}
        className="w-full py-3.5 bg-[#0F2A47] text-white font-black rounded-2xl text-sm flex items-center justify-center gap-2 hover:bg-[#1a3a5c] transition-colors">
        <Save size={16} /> {isAr ? 'حفظ الإعدادات' : 'Save Settings'}
      </button>
    </div>
  )
}
