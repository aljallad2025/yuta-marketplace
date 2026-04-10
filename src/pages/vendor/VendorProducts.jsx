import { useState } from 'react'
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Search, Package, X } from 'lucide-react'
import { useLang } from '../../i18n/LangContext'
import { useApp } from '../../store/appStore'
import { useAuth } from '../../store/authStore'

const EMOJIS = ['🍔','🍗','🥩','🍕','🍝','🥗','🍜','🍣','🥙','🌮','🍱','🥘','🍛','🧆','🥪','🍞','🥛','🥚','🧃','🍊','💊','🧴','💄','🛒','📱','🔌','🧹','🏪','🫘','🍰','🍩','☕']

const defaultForm = { nameAr: '', nameEn: '', price: '', category: '', image: '🍔', stock: '', description: '', active: true }

export default function VendorProducts() {
  const { isAr } = useLang()
  const { getStoreProducts, addProduct, updateProduct, deleteProduct, toggleProduct } = useApp()
  const { currentUser } = useAuth()
  const activeVendorId = currentUser?.storeId || currentUser?.store_id || 1
  const products = getStoreProducts(activeVendorId)

  const [search, setSearch] = useState('')
  const [form, setForm] = useState(defaultForm)
  const [editing, setEditing] = useState(null) // product id or null
  const [showModal, setShowModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const filtered = products.filter(p =>
    (isAr ? p.nameAr : p.nameEn).toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => {
    setForm(defaultForm)
    setEditing(null)
    setShowModal(true)
  }

  const openEdit = (p) => {
    setForm({ nameAr: p.nameAr, nameEn: p.nameEn, price: p.price, category: p.category, image: p.image, stock: p.stock, description: p.description || '', active: p.active })
    setEditing(p.id)
    setShowModal(true)
  }

  const handleSubmit = () => {
    if (!form.nameAr || !form.nameEn || !form.price) return
    const data = { ...form, price: Number(form.price), stock: Number(form.stock), storeId: activeVendorId }
    if (editing) {
      updateProduct(editing, data)
    } else {
      addProduct(data)
    }
    setShowModal(false)
    setEditing(null)
    setForm(defaultForm)
  }

  const confirmDelete = (id) => {
    deleteProduct(id)
    setDeleteConfirm(null)
  }

  return (
    <div className="p-6" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-[#0F2A47]">{isAr ? 'إدارة المنتجات' : 'Product Management'}</h1>
          <p className="text-sm text-[#888] mt-0.5">{products.length} {isAr ? 'منتج' : 'products'}</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0F2A47] text-white text-sm font-black rounded-xl hover:bg-[#1a3a5c]">
          <Plus size={16} /> {isAr ? 'إضافة منتج' : 'Add Product'}
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center bg-white border border-[#E8E4DC] rounded-xl px-3 py-2.5 gap-2 mb-4 max-w-sm">
        <Search size={14} className="text-[#999]" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={isAr ? 'بحث في المنتجات...' : 'Search products...'}
          className="flex-1 outline-none text-sm bg-transparent"
          dir={isAr ? 'rtl' : 'ltr'}
        />
      </div>

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-3">📦</div>
          <p className="font-black text-[#444]">{isAr ? 'لا توجد منتجات' : 'No products yet'}</p>
          <button onClick={openAdd} className="mt-4 px-5 py-2.5 bg-[#0F2A47] text-white font-black rounded-xl text-sm">
            {isAr ? 'أضف أول منتج' : 'Add First Product'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(p => (
            <div key={p.id} className={`bg-white rounded-2xl border-2 ${p.active ? 'border-[#E8E4DC]' : 'border-red-100'} p-4`}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-14 h-14 bg-[#FBF8F2] rounded-xl flex items-center justify-center text-3xl">{p.image}</div>
                <div className="flex items-center gap-1">
                  <button onClick={() => toggleProduct(p.id)} className="p-1.5 rounded-lg hover:bg-[#FBF8F2] text-[#888]">
                    {p.active ? <ToggleRight size={18} className="text-emerald-500" /> : <ToggleLeft size={18} />}
                  </button>
                  <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-[#FBF8F2] text-[#666]"><Pencil size={14} /></button>
                  <button onClick={() => setDeleteConfirm(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400"><Trash2 size={14} /></button>
                </div>
              </div>
              <p className="font-black text-[#0F2A47] text-sm">{isAr ? p.nameAr : p.nameEn}</p>
              <p className="text-xs text-[#888] mt-0.5">{p.category}</p>
              {p.description && <p className="text-xs text-[#aaa] mt-1 line-clamp-2">{p.description}</p>}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F0ECE4]">
                <p className="font-black text-[#C8A951] text-lg">{p.price} <span className="text-xs text-[#888]">{isAr ? 'د' : 'AED'}</span></p>
                <div className="flex items-center gap-1.5">
                  <Package size={12} className="text-[#888]" />
                  <span className="text-xs text-[#888]">{isAr ? `مخزون: ${p.stock}` : `Stock: ${p.stock}`}</span>
                </div>
              </div>
              {!p.active && (
                <p className="text-[10px] font-black text-red-500 mt-2 text-center">{isAr ? 'غير متاح' : 'Inactive'}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" dir={isAr ? 'rtl' : 'ltr'}>
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E4DC]">
              <h2 className="font-black text-[#0F2A47]">
                {editing ? (isAr ? 'تعديل المنتج' : 'Edit Product') : (isAr ? 'إضافة منتج جديد' : 'Add New Product')}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-[#FBF8F2]"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Emoji picker */}
              <div>
                <label className="block text-xs font-black text-[#666] mb-2">{isAr ? 'الأيقونة' : 'Icon'}</label>
                <div className="flex flex-wrap gap-1.5">
                  {EMOJIS.map(e => (
                    <button key={e} onClick={() => setForm(f => ({ ...f, image: e }))}
                      className={`w-9 h-9 text-xl rounded-xl border-2 transition-all ${form.image === e ? 'border-[#C8A951] bg-amber-50' : 'border-[#E8E4DC] hover:border-[#C8A951]'}`}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              {/* Name AR */}
              <div>
                <label className="block text-xs font-black text-[#666] mb-1.5">{isAr ? 'اسم المنتج (عربي)' : 'Product Name (Arabic)'}</label>
                <input value={form.nameAr} onChange={e => setForm(f => ({ ...f, nameAr: e.target.value }))}
                  className="w-full border border-[#E8E4DC] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#C8A951]" dir="rtl" />
              </div>
              {/* Name EN */}
              <div>
                <label className="block text-xs font-black text-[#666] mb-1.5">{isAr ? 'اسم المنتج (إنجليزي)' : 'Product Name (English)'}</label>
                <input value={form.nameEn} onChange={e => setForm(f => ({ ...f, nameEn: e.target.value }))}
                  className="w-full border border-[#E8E4DC] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#C8A951]" dir="ltr" />
              </div>
              {/* Category */}
              <div>
                <label className="block text-xs font-black text-[#666] mb-1.5">{isAr ? 'الفئة' : 'Category'}</label>
                <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  placeholder={isAr ? 'مثال: مشويات، مشروبات...' : 'e.g. Grills, Drinks...'}
                  className="w-full border border-[#E8E4DC] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#C8A951]" />
              </div>
              {/* Price & Stock */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-[#666] mb-1.5">{isAr ? 'السعر (د.إ)' : 'Price (AED)'}</label>
                  <input type="number" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    className="w-full border border-[#E8E4DC] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#C8A951]" />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#666] mb-1.5">{isAr ? 'المخزون' : 'Stock'}</label>
                  <input type="number" min="0" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                    className="w-full border border-[#E8E4DC] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#C8A951]" />
                </div>
              </div>
              {/* Description */}
              <div>
                <label className="block text-xs font-black text-[#666] mb-1.5">{isAr ? 'الوصف' : 'Description'}</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3} className="w-full border border-[#E8E4DC] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#C8A951] resize-none" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-[#E8E4DC] flex gap-3">
              <button onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 border border-[#E8E4DC] text-[#666] font-black rounded-xl text-sm hover:bg-[#FBF8F2]">
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button onClick={handleSubmit}
                className="flex-1 py-2.5 bg-[#0F2A47] text-white font-black rounded-xl text-sm hover:bg-[#1a3a5c]">
                {editing ? (isAr ? 'حفظ التغييرات' : 'Save Changes') : (isAr ? 'إضافة المنتج' : 'Add Product')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="text-center">
              <div className="text-5xl mb-3">🗑️</div>
              <h3 className="font-black text-[#0F2A47] text-lg mb-2">{isAr ? 'حذف المنتج؟' : 'Delete Product?'}</h3>
              <p className="text-sm text-[#666] mb-5">{isAr ? 'هذا الإجراء لا يمكن التراجع عنه' : 'This action cannot be undone'}</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 border border-[#E8E4DC] text-[#666] font-black rounded-xl text-sm">
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button onClick={() => confirmDelete(deleteConfirm)}
                  className="flex-1 py-2.5 bg-red-500 text-white font-black rounded-xl text-sm">
                  {isAr ? 'حذف' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
