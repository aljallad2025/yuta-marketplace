import { useState } from 'react'
import { ToggleLeft, ToggleRight, Edit2, Check, X } from 'lucide-react'
import { useCategories } from '../../store/categoriesStore.jsx'
import { useLang } from '../../i18n/LangContext'

export default function AdminCategories() {
  const { isAr } = useLang()
  const { categories, toggleCategory, updateCategory } = useCategories()
  const [editingId, setEditingId] = useState(null)
  const [editDraft, setEditDraft] = useState({})

  const startEdit = (cat) => {
    setEditingId(cat.id)
    setEditDraft({ labelAr: cat.labelAr, labelEn: cat.labelEn, emoji: cat.emoji, path: cat.path })
  }

  const saveEdit = async () => {
    await updateCategory(editingId, {
      name_ar: editDraft.labelAr,
      name_en: editDraft.labelEn,
      emoji: editDraft.emoji,
      path: editDraft.path
    })
    setEditingId(null)
  }

  return (
    <div className="p-6" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="mb-6">
        <h1 className="text-xl font-black text-[#0D1B4B]">{isAr ? 'إدارة الفئات' : 'Manage Categories'}</h1>
        <p className="text-sm text-gray-400 mt-0.5">{isAr ? 'فعّل أو عطّل الفئات التي تظهر في الموقع والتطبيق' : 'Enable or disable categories shown on the site and app'}</p>
      </div>

      <div className="space-y-3 max-w-2xl">
        {categories.map(cat => (
          <div key={cat.id} className={`bg-white rounded-2xl border-2 transition ${cat.active ? 'border-[#00C9A7]/40' : 'border-[#D0EDEA]'} p-4`}>
            {editingId === cat.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <input value={editDraft.emoji} onChange={e => setEditDraft(d => ({ ...d, emoji: e.target.value }))}
                    className="border border-[#D0EDEA] rounded-xl px-3 py-2 text-sm text-center outline-none" placeholder="emoji" />
                  <input value={editDraft.labelAr} onChange={e => setEditDraft(d => ({ ...d, labelAr: e.target.value }))}
                    className="border border-[#D0EDEA] rounded-xl px-3 py-2 text-sm outline-none" placeholder="الاسم عربي" dir="rtl" />
                  <input value={editDraft.labelEn} onChange={e => setEditDraft(d => ({ ...d, labelEn: e.target.value }))}
                    className="border border-[#D0EDEA] rounded-xl px-3 py-2 text-sm outline-none" placeholder="Name EN" />
                </div>
                <input value={editDraft.path} onChange={e => setEditDraft(d => ({ ...d, path: e.target.value }))}
                  className="w-full border border-[#D0EDEA] rounded-xl px-3 py-2 text-sm outline-none font-mono" placeholder="/web/..." />
                <div className="flex gap-2">
                  <button onClick={saveEdit} className="flex items-center gap-1 bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-black">
                    <Check size={14} /> {isAr ? 'حفظ' : 'Save'}
                  </button>
                  <button onClick={() => setEditingId(null)} className="flex items-center gap-1 bg-gray-100 text-gray-600 px-4 py-2 rounded-xl text-sm font-black">
                    <X size={14} /> {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cat.emoji}</span>
                  <div>
                    <p className="font-black text-[#0D1B4B]">{isAr ? cat.labelAr : cat.labelEn}</p>
                    <p className="text-xs text-gray-400 font-mono">{cat.path}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${cat.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                    {cat.active ? (isAr ? 'مفعّل' : 'Active') : (isAr ? 'معطّل' : 'Inactive')}
                  </span>
                  <button onClick={() => startEdit(cat)} className="p-2 bg-[#F0F9F8] rounded-lg hover:bg-[#D0EDEA] transition">
                    <Edit2 size={14} className="text-[#0D1B4B]" />
                  </button>
                  <button onClick={() => toggleCategory(cat.id)}>
                    {cat.active
                      ? <ToggleRight size={36} className="text-green-500" />
                      : <ToggleLeft size={36} className="text-gray-300" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-[#F0F9F8] rounded-2xl max-w-2xl">
        <p className="text-xs text-gray-400 flex items-center gap-2">
          <span className="text-lg">💡</span>
          {isAr ? 'التغييرات تظهر فوراً في الموقع والتطبيق بدون الحاجة لإعادة تشغيل' : 'Changes appear instantly on the site and app without restart'}
        </p>
      </div>
    </div>
  )
}
