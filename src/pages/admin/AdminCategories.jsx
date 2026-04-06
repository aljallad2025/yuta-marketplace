import { useState } from 'react'
import { Plus, Trash2, Edit2, Check, X, ToggleLeft, ToggleRight, Grid3X3, Globe, Smartphone } from 'lucide-react'
import { useCategories } from '../../store/categoriesStore.jsx'
import { useLang } from '../../i18n/LangContext'

const EMOJI_OPTIONS = [
  '🍔','🛒','🧹','💄','💊','🏪','🍰','📱','🌸','🐾',
  '📚','🧴','🏋️','🍕','☕','🎮','👗','🏠','🚗','✈️',
  '🍣','🧆','🥗','🍦','🧃','🪴','👟','🏥','🧸','🔑',
]

export default function AdminCategories() {
  const { t, isAr } = useLang()
  const { categories, addCategory, updateCategory, deleteCategory, toggleCategory } = useCategories()

  const [showAdd, setShowAdd] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editDraft, setEditDraft] = useState({})
  const [newCat, setNewCat] = useState({ emoji: '🏪', labelEn: '', labelAr: '' })

  const handleAdd = () => {
    if (!newCat.labelEn && !newCat.labelAr) return
    addCategory(newCat)
    setNewCat({ emoji: '🏪', labelEn: '', labelAr: '' })
    setShowAdd(false)
  }

  const startEdit = (cat) => {
    setEditingId(cat.id)
    setEditDraft({ emoji: cat.emoji, labelEn: cat.labelEn, labelAr: cat.labelAr })
  }

  const confirmEdit = (id) => {
    updateCategory(id, editDraft)
    setEditingId(null)
  }

  const activeCount = categories.filter(c => c.active).length

  return (
    <div className="p-6 space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#0F2A47]">
            {isAr ? 'إدارة الأقسام' : 'Category Management'}
          </h1>
          <p className="text-sm text-[#666] mt-0.5">
            {isAr
              ? 'الأقسام المفعّلة تظهر مباشرةً في الموقع والتطبيق'
              : 'Active categories appear live on the website & mobile app'}
          </p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0F2A47] text-white text-sm font-black rounded-xl shadow-sm hover:bg-[#1a3a5c] transition-colors">
          <Plus size={15} />
          {isAr ? 'إضافة قسم' : 'Add Category'}
        </button>
      </div>

      {/* Live sync banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="font-black text-emerald-700 text-sm">
            {isAr ? 'مزامنة فورية' : 'Live Sync'}
          </span>
        </div>
        <span className="text-emerald-600 text-sm">
          {isAr
            ? `${activeCount} قسم مفعّل — يظهر حالياً في الموقع الإلكتروني وتطبيق الجوال`
            : `${activeCount} active categories — currently showing on website & mobile app`}
        </span>
        <div className="ms-auto flex items-center gap-3 text-xs text-emerald-600">
          <span className="flex items-center gap-1"><Globe size={12} /> {isAr ? 'الموقع' : 'Website'}</span>
          <span className="flex items-center gap-1"><Smartphone size={12} /> {isAr ? 'التطبيق' : 'Mobile App'}</span>
        </div>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="bg-white rounded-2xl border-2 border-[#C8A951] shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-[#0F2A47]">{isAr ? 'قسم جديد' : 'New Category'}</h3>
            <button onClick={() => setShowAdd(false)} className="p-1 rounded-lg hover:bg-[#FBF8F2] text-[#999]">
              <X size={16} />
            </button>
          </div>
          <div className="space-y-4">
            {/* Emoji picker */}
            <div>
              <p className="text-xs font-black text-[#444] mb-2">{isAr ? 'اختر رمزاً' : 'Choose Emoji'}</p>
              <div className="flex flex-wrap gap-1.5">
                {EMOJI_OPTIONS.map(e => (
                  <button key={e} onClick={() => setNewCat(c => ({ ...c, emoji: e }))}
                    className={`w-9 h-9 rounded-xl text-xl flex items-center justify-center border-2 transition-all ${
                      newCat.emoji === e ? 'border-[#C8A951] bg-[#C8A951]/10 scale-110' : 'border-[#E8E4DC] bg-white hover:border-[#C8A951]/40'
                    }`}>{e}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-[#444] block mb-1">
                  {isAr ? 'الاسم بالإنجليزية' : 'Name (English)'}
                </label>
                <input value={newCat.labelEn} onChange={e => setNewCat(c => ({ ...c, labelEn: e.target.value }))}
                  placeholder="e.g. Restaurants"
                  className="w-full border border-[#E8E4DC] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#C8A951]"
                  dir="ltr" />
              </div>
              <div>
                <label className="text-xs font-black text-[#444] block mb-1">
                  {isAr ? 'الاسم بالعربية' : 'Name (Arabic)'}
                </label>
                <input value={newCat.labelAr} onChange={e => setNewCat(c => ({ ...c, labelAr: e.target.value }))}
                  placeholder="مثال: المطاعم"
                  className="w-full border border-[#E8E4DC] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#C8A951]"
                  dir="rtl" />
              </div>
            </div>
            {/* Preview */}
            {(newCat.labelEn || newCat.labelAr) && (
              <div className="bg-[#FBF8F2] rounded-xl p-3">
                <p className="text-xs text-[#666] mb-2">{isAr ? 'معاينة' : 'Preview'}</p>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-[#0F2A47]/5 rounded-xl flex items-center justify-center text-2xl">{newCat.emoji}</div>
                  <div>
                    <p className="font-black text-[#222] text-sm">{isAr ? newCat.labelAr : newCat.labelEn}</p>
                    <p className="text-xs text-[#999]">{isAr ? newCat.labelEn : newCat.labelAr}</p>
                  </div>
                </div>
              </div>
            )}
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowAdd(false)}
                className="px-4 py-2 text-sm text-[#666] border border-[#E8E4DC] rounded-xl font-black hover:bg-[#FBF8F2]">
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button onClick={handleAdd}
                className="px-5 py-2 bg-[#C8A951] text-[#0F2A47] text-sm font-black rounded-xl hover:bg-[#b8993f] transition-colors">
                {isAr ? 'إضافة القسم' : 'Add Category'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#E8E4DC] text-center">
          <p className="text-3xl font-black text-[#0F2A47]">{categories.length}</p>
          <p className="text-xs text-[#666] mt-1">{isAr ? 'إجمالي الأقسام' : 'Total Categories'}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#E8E4DC] text-center">
          <p className="text-3xl font-black text-emerald-600">{activeCount}</p>
          <p className="text-xs text-[#666] mt-1">{isAr ? 'مفعّل' : 'Active'}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#E8E4DC] text-center">
          <p className="text-3xl font-black text-[#999]">{categories.length - activeCount}</p>
          <p className="text-xs text-[#666] mt-1">{isAr ? 'معطّل' : 'Disabled'}</p>
        </div>
      </div>

      {/* Categories grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {categories.map(cat => (
          <div key={cat.id}
            className={`bg-white rounded-2xl border-2 shadow-sm transition-all ${
              cat.active ? 'border-[#E8E4DC]' : 'border-[#F0ECE4] opacity-60'
            }`}>
            <div className="p-4">
              {editingId === cat.id ? (
                /* Edit mode */
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {EMOJI_OPTIONS.map(e => (
                      <button key={e} onClick={() => setEditDraft(d => ({ ...d, emoji: e }))}
                        className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center border-2 transition-all ${
                          editDraft.emoji === e ? 'border-[#C8A951] bg-[#C8A951]/10' : 'border-[#E8E4DC]'
                        }`}>{e}</button>
                    ))}
                  </div>
                  <input value={editDraft.labelEn} onChange={e => setEditDraft(d => ({ ...d, labelEn: e.target.value }))}
                    placeholder="English name"
                    className="w-full border border-[#E8E4DC] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#C8A951]"
                    dir="ltr" />
                  <input value={editDraft.labelAr} onChange={e => setEditDraft(d => ({ ...d, labelAr: e.target.value }))}
                    placeholder="الاسم بالعربية"
                    className="w-full border border-[#E8E4DC] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#C8A951]"
                    dir="rtl" />
                  <div className="flex gap-2">
                    <button onClick={() => confirmEdit(cat.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-500 text-white text-xs font-black rounded-xl">
                      <Check size={13} /> {isAr ? 'حفظ' : 'Save'}
                    </button>
                    <button onClick={() => setEditingId(null)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-[#E8E4DC] text-[#666] text-xs font-black rounded-xl">
                      <X size={13} /> {isAr ? 'إلغاء' : 'Cancel'}
                    </button>
                  </div>
                </div>
              ) : (
                /* View mode */
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${
                      cat.active ? 'bg-[#0F2A47]/5' : 'bg-[#F0ECE4]'
                    }`}>
                      {cat.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-[#222] truncate">
                        {isAr ? cat.labelAr : cat.labelEn}
                      </p>
                      <p className="text-xs text-[#999] truncate">
                        {isAr ? cat.labelEn : cat.labelAr}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                          cat.active ? 'bg-emerald-100 text-emerald-700' : 'bg-[#F0ECE4] text-[#999]'
                        }`}>
                          {cat.active ? (isAr ? '● مفعّل' : '● Active') : (isAr ? '○ معطّل' : '○ Disabled')}
                        </span>
                        {cat.count !== undefined && (
                          <span className="text-[10px] text-[#999]">{cat.count} {isAr ? 'متجر' : 'stores'}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-[#F0ECE4]">
                    <button onClick={() => toggleCategory(cat.id)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-black transition-all ${
                        cat.active
                          ? 'bg-[#F0ECE4] text-[#666] hover:bg-red-50 hover:text-red-600'
                          : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                      }`}>
                      {cat.active
                        ? <><ToggleRight size={13} /> {isAr ? 'تعطيل' : 'Disable'}</>
                        : <><ToggleLeft size={13} /> {isAr ? 'تفعيل' : 'Enable'}</>
                      }
                    </button>
                    <button onClick={() => startEdit(cat)}
                      className="p-2 rounded-xl border border-[#E8E4DC] text-[#666] hover:border-[#0F2A47] hover:text-[#0F2A47] transition-all">
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => deleteCategory(cat.id)}
                      className="p-2 rounded-xl border border-[#E8E4DC] text-[#666] hover:border-red-300 hover:text-red-500 transition-all">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Where shown */}
      <div className="bg-[#0F2A47] rounded-2xl p-5 text-white">
        <div className="flex items-center gap-2 mb-4">
          <Grid3X3 size={16} className="text-[#C8A951]" />
          <h3 className="font-black text-sm">
            {isAr ? 'أين تظهر هذه الأقسام؟' : 'Where do these categories appear?'}
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: '🌐', titleEn: 'Website Home', titleAr: 'الصفحة الرئيسية للموقع', descEn: 'Category grid on homepage', descAr: 'شبكة الأقسام في الصفحة الرئيسية' },
            { icon: '🛒', titleEn: 'Marketplace', titleAr: 'المتجر الإلكتروني', descEn: 'Filter tabs for browsing stores', descAr: 'تبويبات التصفية لتصفح المتاجر' },
            { icon: '📱', titleEn: 'Mobile App', titleAr: 'تطبيق الجوال', descEn: 'Categories tab & home screen', descAr: 'تبويب الأقسام والشاشة الرئيسية' },
          ].map(loc => (
            <div key={loc.titleEn} className="bg-white/5 rounded-xl p-3 flex items-start gap-3">
              <span className="text-2xl">{loc.icon}</span>
              <div>
                <p className="font-black text-white text-sm">{isAr ? loc.titleAr : loc.titleEn}</p>
                <p className="text-white/50 text-xs mt-0.5">{isAr ? loc.descAr : loc.descEn}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
