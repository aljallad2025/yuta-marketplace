import { useState, createContext, useContext } from 'react'

const defaultStores = [
  { id: 1, nameAr: 'مطعم بهارات', nameEn: 'Baharat Restaurant', catId: 1, rating: 4.9, time: '20–30', timeAr: '٢٠–٣٠ دق', minOrder: 15, deliveryFee: 0, open: true, tag: 'popular', bg: '#FFF3E0', emoji: '🍽️', active: true, ownerEn: 'Khalid Al Nasser', ownerAr: 'خالد الناصر', phone: '+971501112222', commission: 12, revenue: 48600, orders: 1240 },
  { id: 2, nameAr: 'برجتينو', nameEn: 'Burgetino', catId: 1, rating: 4.8, time: '25–40', timeAr: '٢٥–٤٠ دق', minOrder: 10, deliveryFee: 2, open: true, tag: 'new', bg: '#E8F5E9', emoji: '🍔', active: true, ownerEn: 'Saeed Hamdan', ownerAr: 'سعيد حمدان', phone: '+971552223333', commission: 12, revenue: 22000, orders: 580 },
  { id: 3, nameAr: 'صيدلية الشفاء', nameEn: 'Al Shifa Pharmacy', catId: 5, rating: 4.9, time: '10–20', timeAr: '١٠–٢٠ دق', minOrder: 0, deliveryFee: 0, open: true, tag: 'open24', bg: '#E3F2FD', emoji: '💊', active: true, ownerEn: 'Dr. Fatima Hassan', ownerAr: 'د. فاطمة حسن', phone: '+971523334444', commission: 8, revenue: 22800, orders: 640 },
  { id: 4, nameAr: 'فريش مارت', nameEn: 'Fresh Mart', catId: 2, rating: 4.7, time: '30–45', timeAr: '٣٠–٤٥ دق', minOrder: 30, deliveryFee: 0, open: true, tag: 'free', bg: '#F3E5F5', emoji: '🛒', active: true, ownerEn: 'Ahmed Saeed', ownerAr: 'أحمد سعيد', phone: '+971564445555', commission: 10, revenue: 38200, orders: 890 },
  { id: 5, nameAr: 'ريدا كلين', nameEn: 'Rida Clean', catId: 3, rating: 4.6, time: '45–60', timeAr: '٤٥–٦٠ دق', minOrder: 50, deliveryFee: 5, open: true, tag: null, bg: '#E0F2F1', emoji: '🧹', active: true, ownerEn: 'Rida Services', ownerAr: 'خدمات ريدا', phone: '+971505556666', commission: 10, revenue: 14600, orders: 280 },
  { id: 6, nameAr: 'غلامور للتجميل', nameEn: 'Glamour Beauty', catId: 4, rating: 4.5, time: '45–60', timeAr: '٤٥–٦٠ دق', minOrder: 50, deliveryFee: 5, open: true, tag: null, bg: '#FCE4EC', emoji: '💄', active: true, ownerEn: 'Sara Mohammed', ownerAr: 'سارة محمد', phone: '+971556667777', commission: 15, revenue: 18400, orders: 320 },
  { id: 7, nameAr: 'النور العام', nameEn: 'Al Noor General', catId: 6, rating: 4.4, time: '20–30', timeAr: '٢٠–٣٠ دق', minOrder: 0, deliveryFee: 2, open: true, tag: null, bg: '#FFF8E1', emoji: '🏪', active: true, ownerEn: 'Noor Al Hamdan', ownerAr: 'نور الحمدان', phone: '+971507778888', commission: 10, revenue: 9800, orders: 210 },
  { id: 8, nameAr: 'مخبز الفرن الذهبي', nameEn: 'Golden Oven Bakery', catId: 7, rating: 4.6, time: '20–35', timeAr: '٢٠–٣٥ دق', minOrder: 20, deliveryFee: 0, open: true, tag: 'popular', bg: '#FBE9E7', emoji: '🍞', active: true, ownerEn: 'Ibrahim Yusuf', ownerAr: 'إبراهيم يوسف', phone: '+971508889999', commission: 12, revenue: 16200, orders: 420 },
  { id: 9, nameAr: 'تك زون إلكترونيات', nameEn: 'TechZone Electronics', catId: 8, rating: 4.5, time: '60–90', timeAr: '٦٠–٩٠ دق', minOrder: 100, deliveryFee: 10, open: false, tag: null, bg: '#E0F7FA', emoji: '📱', active: false, ownerEn: 'Omar Al Rashidi', ownerAr: 'عمر الراشدي', phone: '+971509990000', commission: 8, revenue: 28900, orders: 145 },
]

const StoresContext = createContext()

export function StoresProvider({ children }) {
  const [stores, setStores] = useState(defaultStores)

  const addStore = (store) => setStores(prev => [
    ...prev,
    { id: Date.now(), ...store, active: true, open: true, rating: 0, orders: 0, revenue: 0 }
  ])

  const updateStore = (id, updates) => setStores(prev =>
    prev.map(s => s.id === id ? { ...s, ...updates } : s)
  )

  const deleteStore = (id) => setStores(prev => prev.filter(s => s.id !== id))

  const toggleStore = (id) => setStores(prev =>
    prev.map(s => s.id === id ? { ...s, active: !s.active, open: !s.active } : s)
  )

  const approveStore = (id) => updateStore(id, { active: true, open: true, status: 'active' })

  return (
    <StoresContext.Provider value={{ stores, addStore, updateStore, deleteStore, toggleStore, approveStore }}>
      {children}
    </StoresContext.Provider>
  )
}

export const useStores = () => useContext(StoresContext)
