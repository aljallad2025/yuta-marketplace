import { useState } from 'react'
import { Save, Plus, X, Image, Tag, Trash2, Edit2, Check } from 'lucide-react'
import { useCategories } from '../../store/categoriesStore'
import { useLang } from '../../i18n/LangContext'

const promoCodes = [
  { code: 'SUMU10', discount: '25 AED', type: 'Fixed', uses: 142, limit: 500, active: true },
  { code: 'WELCOME20', discount: '20%', type: 'Percent', uses: 89, limit: 200, active: true },
  { code: 'TAXI15', discount: '15 AED', type: 'Fixed', uses: 234, limit: 300, active: false },
]

const banners = [
  { id: 1, titleAr: 'عروض رمضان', titleEn: 'Ramadan Offers', subAr: 'خصم ٤٠٪ على المتاجر المختارة', subEn: '40% off selected stores', active: true },
  { id: 2, titleAr: 'توصيل مجاني', titleEn: 'Free Delivery', subAr: 'للطلب الأول للأعضاء الجدد', subEn: 'First order for new users', active: true },
  { id: 3, titleAr: 'عروض التاكسي', titleEn: 'Taxi Promo', subAr: 'رحلات من ٣ درهم', subEn: 'Rides from 3 AED', active: false },
]

const EMOJI_OPTIONS = ['🍔', '🛒', '🧹', '💄', '💊', '🏪', '🍰', '📱', '🌸', '🐾', '📚', '🧴', '🏋️', '🍕', '☕', '🎮', '👗', '🏠', '🚗', '✈️']

export default function AdminSettings() {
  const { t, isAr } = useLang()
  const { categories, addCategory, updateCategory, deleteCategory, toggleCategory } = useCategories()
  const [deliveryFees, setDeliveryFees] = useState({ base: 5, freeAbove: 50, perKm: 1.5 })
  const [surgePricing, setSurgePricing] = useState({ multiplier: 1.5, threshold: 80 })
  const [showAddCat, setShowAddCat] = useState(false)
  const [editingCat, setEditingCat] = useState(null)
  const [newCat, setNewCat] = useState({ emoji: '🏪', labelEn: '', labelAr: '' })

  const handleAddCategory = () => {
    if (!newCat.labelEn && !newCat.labelAr) return
    addCategory(newCat)
    setNewCat({ emoji: '🏪', labelEn: '', labelAr: '' })
    setShowAddCat(false)
  }

  const handleUpdateCategory = (id) => {
    updateCategory(id, editingCat)
    setEditingCat(null)
  }

  return (
    <div className="p-6 space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
      <div>
        <h1 className="text-2xl font-black text-[#0F2A47]">{t('platformSettings')}</h1>
        <p className="text-sm text-[#666]">{isAr ? 'إدارة الأقسام والرسوم والعروض' : 'Manage categories, fees, banners and more'}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ===== CATEGORIES - Dynamic ===== */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8E4DC] lg:col-span-2">
          <div className="p-4 border-b border-[#F0ECE4] flex items-center justify-between">
            <h2 className="font-black text-[#0F2A47]">{t('serviceCategories')}</h2>
            <button onClick={() => setShowAddCat(!showAddCat)}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#0F2A47] text-white text-xs font-bold rounded-xl">
              <Plus size={13} /> {t('addCategory')}
            </button>
          </div>

          {/* Add category form */}
          {showAddCat && (
            <div className="p-4 bg-[#FBF8F2] border-b border-[#F0ECE4]">
              <p className="font-bold text-[#0F2A47] text-sm mb-3">{t('addCategory')}</p>
              <div className="flex flex-wrap gap-3 mb-3">
                <div>
                  <p className="text-xs text-[#666] mb-1.5">{t('categoryEmoji')}</p>
                  <div className="flex flex-wrap gap-1.5 max-w-xs">
                    {EMOJI_OPTIONS.map(emoji => (
                      <button key={emoji} onClick={() => setNewCat(c => ({ ...c, emoji }))}
                        className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center border-2 transition-all ${
                          newCat.emoji === emoji ? 'border-[#C8A951] bg-[#C8A951]/10' : 'border-[#E8E4DC] bg-white'
                        }`}>{emoji}</button>
                    ))}
                  </div>
                </div>
                <div className="flex-1 min-w-48">
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs font-semibold text-[#444] block mb-1">Name (English)</label>
                      <input value={newCat.labelEn} onChange={e => setNewCat(c => ({ ...c, labelEn: e.target.value }))}
                        placeholder="e.g. Restaurants"
                        className="w-full border border-[#E8E4DC] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#C8A951]" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#444] block mb-1">الاسم بالعربي</label>
                      <input value={newCat.labelAr} onChange={e => setNewCat(c => ({ ...c, labelAr: e.target.value }))}
                        placeholder="مثال: المطاعم" dir="rtl"
                        className="w-full border border-[#E8E4DC] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#C8A951]" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleAddCategory}
                  className="px-4 py-2 bg-[#0F2A47] text-white text-xs font-bold rounded-xl">{t('saveCategory')}</button>
                <button onClick={() => setShowAddCat(false)}
                  className="px-4 py-2 bg-white text-[#666] text-xs font-semibold rounded-xl border border-[#E8E4DC]">{t('cancel')}</button>
              </div>
            </div>
          )}

          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {categories.map(cat => (
              <div key={cat.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                cat.active ? 'border-[#E8E4DC] bg-[#FBF8F2]' : 'border-[#E8E4DC] bg-white opacity-50'
              }`}>
                {editingCat?.id === cat.id ? (
                  <div className="flex-1 space-y-1">
                    <div className="flex gap-1.5">
                      <input value={editingCat.emoji} onChange={e => setEditingCat(c => ({ ...c, emoji: e.target.value }))}
                        className="w-10 border border-[#E8E4DC] rounded-lg px-2 py-1 text-sm text-center outline-none" />
                      <input value={editingCat.labelEn} onChange={e => setEditingCat(c => ({ ...c, labelEn: e.target.value }))}
                        className="flex-1 border border-[#E8E4DC] rounded-lg px-2 py-1 text-xs outline-none" placeholder="English name" />
                    </div>
                    <input value={editingCat.labelAr} onChange={e => setEditingCat(c => ({ ...c, labelAr: e.target.value }))}
                      className="w-full border border-[#E8E4DC] rounded-lg px-2 py-1 text-xs outline-none" placeholder="الاسم عربي" dir="rtl" />
                    <div className="flex gap-1.5 mt-1">
                      <button onClick={() => handleUpdateCategory(cat.id)} className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><Check size={12}/></button>
                      <button onClick={() => setEditingCat(null)} className="p-1.5 bg-[#F8F6F1] text-[#666] rounded-lg"><X size={12}/></button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="text-2xl">{cat.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#0F2A47] text-sm truncate">{cat.labelEn}</p>
                      <p className="text-xs text-[#666] truncate">{cat.labelAr}</p>
                      <p className="text-[10px] text-[#999]">{cat.count} {isAr ? 'متجر' : 'stores'}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {/* Toggle */}
                      <button onClick={() => toggleCategory(cat.id)}
                        className={`w-9 h-5 rounded-full relative transition-colors ${cat.active ? 'bg-[#0F2A47]' : 'bg-[#E8E4DC]'}`}>
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${cat.active ? 'left-4' : 'left-0.5'}`}></div>
                      </button>
                      <button onClick={() => setEditingCat({ ...cat })} className="p-1 hover:bg-[#E8E4DC] rounded-lg text-[#666]"><Edit2 size={11}/></button>
                      <button onClick={() => deleteCategory(cat.id)} className="p-1 hover:bg-red-50 rounded-lg text-red-400"><Trash2 size={11}/></button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Fees */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8E4DC]">
          <div className="p-4 border-b border-[#F0ECE4]">
            <h2 className="font-black text-[#0F2A47]">{isAr ? 'رسوم التوصيل' : 'Delivery Fee Settings'}</h2>
          </div>
          <div className="p-4 space-y-4">
            {[
              { label: isAr ? 'رسوم التوصيل الأساسية (درهم)' : 'Base Delivery Fee (AED)', key: 'base' },
              { label: isAr ? 'توصيل مجاني فوق (درهم)' : 'Free Delivery Above (AED)', key: 'freeAbove' },
              { label: isAr ? 'سعر الكيلومتر (درهم)' : 'Per Km Rate (AED)', key: 'perKm' },
            ].map(field => (
              <div key={field.key}>
                <label className="text-xs font-bold text-[#444] mb-1.5 block">{field.label}</label>
                <input type="number" value={deliveryFees[field.key]}
                  onChange={e => setDeliveryFees(f => ({ ...f, [field.key]: +e.target.value }))}
                  className="w-full border border-[#E8E4DC] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#C8A951]" />
              </div>
            ))}
            <button className="w-full py-2.5 bg-[#0F2A47] text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2">
              <Save size={14} /> {isAr ? 'حفظ إعدادات التوصيل' : 'Save Delivery Settings'}
            </button>
          </div>
        </div>

        {/* Surge Pricing */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8E4DC]">
          <div className="p-4 border-b border-[#F0ECE4]">
            <h2 className="font-black text-[#0F2A47]">{isAr ? 'أسعار التاكسي المتغيرة' : 'Taxi Surge Pricing'}</h2>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="text-xs font-bold text-[#444] mb-2 block">{isAr ? 'مضاعف السعر' : 'Surge Multiplier'}</label>
              <div className="flex items-center gap-3">
                <input type="range" min="1" max="3" step="0.1" value={surgePricing.multiplier}
                  onChange={e => setSurgePricing(s => ({ ...s, multiplier: +e.target.value }))}
                  className="flex-1 accent-[#C8A951]" />
                <span className="font-black text-[#C8A951] w-12 text-right">{surgePricing.multiplier}x</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-[#444] mb-2 block">{isAr ? 'حد الطلب (%)' : 'Demand Threshold (%)'}</label>
              <div className="flex items-center gap-3">
                <input type="range" min="50" max="100" step="5" value={surgePricing.threshold}
                  onChange={e => setSurgePricing(s => ({ ...s, threshold: +e.target.value }))}
                  className="flex-1 accent-[#0F2A47]" />
                <span className="font-black text-[#0F2A47] w-12 text-right">{surgePricing.threshold}%</span>
              </div>
            </div>
            <div className="bg-[#C8A951]/10 border border-[#C8A951]/30 rounded-xl p-3">
              <p className="text-xs text-[#a88b3a] leading-relaxed">
                {isAr
                  ? `يُفعَّل التسعير المتغير عندما يتجاوز طلب السائق ${surgePricing.threshold}٪، مع مضاعف ${surgePricing.multiplier}x`
                  : `Surge activates at ${surgePricing.threshold}% demand with ${surgePricing.multiplier}x multiplier`}
              </p>
            </div>
            <button className="w-full py-2.5 bg-[#0F2A47] text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2">
              <Save size={14} /> {isAr ? 'حفظ إعدادات التاكسي' : 'Save Surge Settings'}
            </button>
          </div>
        </div>

        {/* Promo Codes */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8E4DC]">
          <div className="p-4 border-b border-[#F0ECE4] flex items-center justify-between">
            <h2 className="font-black text-[#0F2A47]">{isAr ? 'أكواد الخصم' : 'Promo Codes'}</h2>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C8A951] text-[#0F2A47] text-xs font-black rounded-xl">
              <Plus size={12} /> {isAr ? 'كود جديد' : 'New Code'}
            </button>
          </div>
          <div className="p-4 space-y-2">
            {promoCodes.map(promo => (
              <div key={promo.code} className="flex items-center gap-3 p-3 bg-[#FBF8F2] rounded-xl">
                <div className="p-2 bg-[#C8A951]/15 rounded-lg">
                  <Tag size={14} className="text-[#a88b3a]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-mono font-black text-sm text-[#0F2A47]">{promo.code}</p>
                    <span className="text-xs text-[#C8A951] font-black">{promo.discount} off</span>
                  </div>
                  <p className="text-xs text-[#666]">{promo.uses}/{promo.limit} {isAr ? 'استخدام' : 'uses'}</p>
                </div>
                <div className={`w-10 h-5 rounded-full ${promo.active ? 'bg-emerald-500' : 'bg-[#E8E4DC]'} relative cursor-pointer`}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${promo.active ? 'left-5' : 'left-0.5'}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* App Banners */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8E4DC]">
          <div className="p-4 border-b border-[#F0ECE4] flex items-center justify-between">
            <h2 className="font-black text-[#0F2A47]">{isAr ? 'بانرات التطبيق' : 'App Banners'}</h2>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F2A47] text-white text-xs font-bold rounded-xl">
              <Image size={12} /> {isAr ? 'إضافة بانر' : 'Add Banner'}
            </button>
          </div>
          <div className="p-4 space-y-3">
            {banners.map(banner => (
              <div key={banner.id} className={`rounded-xl p-3 border-2 transition-all flex items-center gap-3 ${
                banner.active ? 'border-[#C8A951]/40 bg-[#C8A951]/5' : 'border-[#E8E4DC] bg-[#FBF8F2] opacity-60'
              }`}>
                <div className="flex-1">
                  <p className="font-bold text-sm text-[#222]">{isAr ? banner.titleAr : banner.titleEn}</p>
                  <p className="text-xs text-[#666]">{isAr ? banner.subAr : banner.subEn}</p>
                </div>
                <div className={`w-9 h-5 rounded-full ${banner.active ? 'bg-[#C8A951]' : 'bg-[#E8E4DC]'} relative cursor-pointer flex-shrink-0`}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${banner.active ? 'left-4' : 'left-0.5'}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
