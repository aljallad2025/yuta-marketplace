import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const MobileContext = createContext()

// ─── Seed data ───────────────────────────────────────────────────────────────
const SEED_PRODUCTS = {
  1: [ // Baharat Restaurant
    { id: 101, nameAr: 'شاورما دجاج',     nameEn: 'Chicken Shawarma',  price: 35,  emoji: '🌯', desc: 'خبز طازج، صوص ثوم' },
    { id: 102, nameAr: 'برجر لحم',        nameEn: 'Beef Burger',       price: 48,  emoji: '🍔', desc: 'لحم أنجوس ١٨٠ غ' },
    { id: 103, nameAr: 'مندي دجاج',       nameEn: 'Chicken Mandi',     price: 89,  emoji: '🍚', desc: 'أرز بسمتي، بهارات خاصة' },
    { id: 104, nameAr: 'فلافل ساندويش',   nameEn: 'Falafel Sandwich',  price: 22,  emoji: '🥙', desc: 'طازج يومياً' },
    { id: 105, nameAr: 'حمص بالطحينة',    nameEn: 'Hummus',            price: 18,  emoji: '🫙', desc: 'مع زيت زيتون' },
    { id: 106, nameAr: 'عصير ليمون نعناع',nameEn: 'Lemon Mint Juice',  price: 15,  emoji: '🍹', desc: 'طازج' },
  ],
  2: [ // Burgetino
    { id: 201, nameAr: 'برجر كلاسيك',    nameEn: 'Classic Burger',    price: 42,  emoji: '🍔', desc: '200g beef patty' },
    { id: 202, nameAr: 'تشيز برجر',      nameEn: 'Cheese Burger',     price: 49,  emoji: '🧀', desc: 'Double cheddar' },
    { id: 203, nameAr: 'برجر دجاج مقرمش',nameEn: 'Crispy Chicken',    price: 45,  emoji: '🍗', desc: 'Crispy fried chicken' },
    { id: 204, nameAr: 'بطاطس مقلية',    nameEn: 'French Fries',      price: 18,  emoji: '🍟', desc: 'مقرمشة مع الصوص' },
    { id: 205, nameAr: 'كولسلو',         nameEn: 'Coleslaw',          price: 12,  emoji: '🥗', desc: 'طازج يومياً' },
  ],
  3: [ // Al Shifa Pharmacy
    { id: 301, nameAr: 'باراسيتامول',     nameEn: 'Paracetamol 500mg', price: 12,  emoji: '💊', desc: '20 tablets' },
    { id: 302, nameAr: 'فيتامين سي',      nameEn: 'Vitamin C 1000mg',  price: 28,  emoji: '🍊', desc: '30 effervescent tablets' },
    { id: 303, nameAr: 'معقم يد',         nameEn: 'Hand Sanitizer',    price: 15,  emoji: '🧴', desc: '500ml' },
    { id: 304, nameAr: 'ماسك طبي',        nameEn: 'Medical Mask',      price: 8,   emoji: '😷', desc: 'Pack of 10' },
    { id: 305, nameAr: 'كريم أساس',       nameEn: 'Sunscreen SPF50',   price: 45,  emoji: '🧴', desc: 'Broad spectrum' },
  ],
  4: [ // Fresh Mart
    { id: 401, nameAr: 'طماطم طازجة',    nameEn: 'Fresh Tomatoes',    price: 6,   emoji: '🍅', desc: '1kg' },
    { id: 402, nameAr: 'موز',            nameEn: 'Bananas',           price: 8,   emoji: '🍌', desc: '1kg' },
    { id: 403, nameAr: 'تفاح أحمر',      nameEn: 'Red Apples',        price: 12,  emoji: '🍎', desc: '1kg' },
    { id: 404, nameAr: 'حليب طازج',      nameEn: 'Fresh Milk',        price: 9,   emoji: '🥛', desc: '1L' },
    { id: 405, nameAr: 'خبز تنور',       nameEn: 'Tandoor Bread',     price: 3,   emoji: '🫓', desc: '5 pieces' },
    { id: 406, nameAr: 'بيض طازج',       nameEn: 'Fresh Eggs',        price: 14,  emoji: '🥚', desc: '12 eggs' },
  ],
}

const SEED_ORDERS = [
  { id: 'SUW-2841', storeId: 1, storeAr: 'مطعم بهارات', storeEn: 'Baharat Restaurant', status: 'on_the_way', total: 254, eta: '12', emoji: '🍽️', date: new Date(Date.now() - 3600000).toISOString(), items: [{nameAr:'شاورما دجاج',nameEn:'Chicken Shawarma',qty:2,price:35},{nameAr:'عصير ليمون',nameEn:'Lemon Juice',qty:1,price:15}] },
  { id: 'SUW-2810', storeId: 3, storeAr: 'صيدلية الشفاء', storeEn: 'Al Shifa Pharmacy', status: 'completed', total: 48, emoji: '💊', date: new Date(Date.now() - 86400000).toISOString(), items: [{nameAr:'فيتامين سي',nameEn:'Vitamin C',qty:1,price:28},{nameAr:'باراسيتامول',nameEn:'Paracetamol',qty:2,price:12}] },
  { id: 'SUW-2789', storeId: 4, storeAr: 'فريش مارت', storeEn: 'Fresh Mart', status: 'completed', total: 187, emoji: '🛒', date: new Date(Date.now() - 172800000).toISOString(), items: [{nameAr:'طماطم',nameEn:'Tomatoes',qty:5,price:6},{nameAr:'موز',nameEn:'Bananas',qty:3,price:8}] },
  { id: 'SUW-2760', storeId: 2, storeAr: 'برجتينو', storeEn: 'Burgetino', status: 'cancelled', total: 96, emoji: '🍔', date: new Date(Date.now() - 432000000).toISOString(), items: [{nameAr:'برجر كلاسيك',nameEn:'Classic Burger',qty:2,price:42}] },
]

const SEED_STORES = [
  { id: 1, nameAr: 'مطعم بهارات', nameEn: 'Baharat Restaurant', emoji: '🍽️', bg: '#FFF3E0', rating: 4.8, time: '25-35', timeAr: '٢٥-٣٥', catId: 1, tagEn: 'Popular', tagAr: 'الأكثر طلباً', deliveryFee: 5, minOrder: 30, open: true },
  { id: 2, nameAr: 'برجتينو',     nameEn: 'Burgetino',           emoji: '🍔', bg: '#E8F5E9', rating: 4.6, time: '20-30', timeAr: '٢٠-٣٠', catId: 1, tagEn: 'New',     tagAr: 'جديد',         deliveryFee: 0, minOrder: 20, open: true },
  { id: 3, nameAr: 'صيدلية الشفاء',nameEn: 'Al Shifa Pharmacy',  emoji: '💊', bg: '#E3F2FD', rating: 4.9, time: '15-25', timeAr: '١٥-٢٥', catId: 5, tagEn: '24/7',   tagAr: 'مفتوح ٢٤ ساعة', deliveryFee: 0, minOrder: 0,  open: true },
  { id: 4, nameAr: 'فريش مارت',   nameEn: 'Fresh Mart',          emoji: '🛒', bg: '#F3E5F5', rating: 4.5, time: '30-45', timeAr: '٣٠-٤٥', catId: 2, tagEn: 'Free Delivery',tagAr: 'توصيل مجاني', deliveryFee: 0, minOrder: 50, open: true },
  { id: 5, nameAr: 'مخبز السنابل', nameEn: 'Al Sanabel Bakery',  emoji: '🥐', bg: '#FFF8E1', rating: 4.7, time: '10-20', timeAr: '١٠-٢٠', catId: 6, tagEn: 'Fresh',  tagAr: 'طازج يومياً', deliveryFee: 3, minOrder: 15, open: true },
  { id: 6, nameAr: 'الرياضة بلس',  nameEn: 'Sports Plus',         emoji: '⚽', bg: '#E8EAF6', rating: 4.4, time: '45-60', timeAr: '٤٥-٦٠', catId: 8, tagEn: 'Sports', tagAr: 'رياضة',       deliveryFee: 8, minOrder: 80, open: false },
]

const SEED_CATEGORIES = [
  { id: 1, labelAr: 'مطاعم',    labelEn: 'Restaurants',  emoji: '🍽️', count: 24 },
  { id: 2, labelAr: 'سوبرماركت',labelEn: 'Supermarket',  emoji: '🛒', count: 8  },
  { id: 3, labelAr: 'مقاهي',    labelEn: 'Cafés',        emoji: '☕', count: 12 },
  { id: 4, labelAr: 'حلويات',   labelEn: 'Desserts',     emoji: '🧁', count: 9  },
  { id: 5, labelAr: 'صيدليات',  labelEn: 'Pharmacies',   emoji: '💊', count: 6  },
  { id: 6, labelAr: 'مخابز',    labelEn: 'Bakeries',     emoji: '🥐', count: 7  },
  { id: 7, labelAr: 'إلكترونيات',labelEn: 'Electronics', emoji: '📱', count: 5  },
  { id: 8, labelAr: 'رياضة',    labelEn: 'Sports',       emoji: '⚽', count: 4  },
  { id: 9, labelAr: 'أزياء',    labelEn: 'Fashion',      emoji: '👗', count: 11 },
  { id: 10,labelAr: 'زهور',     labelEn: 'Flowers',      emoji: '🌸', count: 3  },
  { id: 11,labelAr: 'تجميل',    labelEn: 'Beauty',       emoji: '💄', count: 8  },
  { id: 12,labelAr: 'أدوات منزلية',labelEn: 'Home',     emoji: '🏠', count: 6  },
]

export function MobileProvider({ children }) {
  // ── Cart ──────────────────────────────────────────────────────────
  const [cart, setCart] = useState([]) // {product, qty, storeId}
  const [cartStoreId, setCartStoreId] = useState(null)

  // ── Orders ────────────────────────────────────────────────────────
  const [orders, setOrders] = useState(SEED_ORDERS)

  // ── Navigation ────────────────────────────────────────────────────
  const [view, setView] = useState('home') // 'home'|'store'|'cart'|'checkout'|'orderPlaced'|'orderTracking'
  const [viewData, setViewData] = useState(null) // store obj, order obj, etc.

  // ── Wishlist ──────────────────────────────────────────────────────
  const [wishlist, setWishlist] = useState([])

  // ── Notifications ─────────────────────────────────────────────────
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, ar: 'طلبك #SUW-2841 في الطريق إليك!', en: 'Your order #SUW-2841 is on the way!', read: false, time: '5m' },
    { id: 2, ar: 'عرض خاص: توصيل مجاني على أول طلب', en: 'Special offer: Free delivery on first order', read: false, time: '1h' },
    { id: 3, ar: 'مطعم بهارات أضاف منيو رمضان', en: 'Baharat Restaurant added Ramadan menu', read: true, time: '3h' },
  ])

  // ── Search ────────────────────────────────────────────────────────
  const [searchOpen, setSearchOpen] = useState(false)

  // ── Wallet ────────────────────────────────────────────────────────
  const [walletBalance, setWalletBalance] = useState(150)

  // ── Active tab ────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('home')

  // ── Promo code ────────────────────────────────────────────────────
  const [appliedPromo, setAppliedPromo] = useState(null)

  // ── Rating modal ──────────────────────────────────────────────────
  const [ratingModal, setRatingModal] = useState(null) // {order}

  // ── Address ───────────────────────────────────────────────────────
  const [addresses, setAddresses] = useState([
    { id: 1, labelAr: 'البيت', labelEn: 'Home', addr: 'Dubai Marina, Tower 3, Apt 402' },
    { id: 2, labelAr: 'العمل', labelEn: 'Work', addr: 'DIFC Gate Village, Building 4' },
  ])
  const [selectedAddress, setSelectedAddress] = useState(1)

  // ── Cart helpers ──────────────────────────────────────────────────
  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0)
  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const unreadNotifs = notifications.filter(n => !n.read).length

  const addToCart = useCallback((product, storeId) => {
    if (cartStoreId && cartStoreId !== storeId) {
      // Different store — clear cart
      setCart([{ product, qty: 1, storeId }])
      setCartStoreId(storeId)
      return
    }
    setCartStoreId(storeId)
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id)
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { product, qty: 1, storeId }]
    })
  }, [cartStoreId])

  const removeFromCart = useCallback((productId) => {
    setCart(prev => {
      const updated = prev.map(i => i.product.id === productId ? { ...i, qty: i.qty - 1 } : i).filter(i => i.qty > 0)
      if (updated.length === 0) setCartStoreId(null)
      return updated
    })
  }, [])

  const clearCart = useCallback(() => { setCart([]); setCartStoreId(null) }, [])

  const getQty = useCallback((productId) => {
    return cart.find(i => i.product.id === productId)?.qty || 0
  }, [cart])

  // ── Store navigation ──────────────────────────────────────────────
  const openStore = useCallback((store) => {
    setView('store')
    setViewData({ store, products: SEED_PRODUCTS[store.id] || [] })
  }, [])

  const goBack = useCallback(() => {
    setView('home')
    setViewData(null)
  }, [])

  const openCart = useCallback(() => setView('cart'), [])
  const openCheckout = useCallback(() => setView('checkout'), [])

  // ── Place order ───────────────────────────────────────────────────
  const placeOrder = useCallback((paymentMethod = 'wallet') => {
    const store = SEED_STORES.find(s => s.id === cartStoreId)
    const orderId = `SUW-${Math.floor(Math.random() * 9000) + 1000}`
    const items = cart.map(i => ({ nameAr: i.product.nameAr, nameEn: i.product.nameEn, qty: i.qty, price: i.product.price }))
    const newOrder = {
      id: orderId,
      storeId: cartStoreId,
      storeAr: store?.nameAr || 'المتجر',
      storeEn: store?.nameEn || 'Store',
      emoji: store?.emoji || '🏪',
      status: 'preparing',
      total: cartTotal + (store?.deliveryFee || 0),
      eta: '25',
      date: new Date().toISOString(),
      items,
    }
    if (paymentMethod === 'wallet') {
      setWalletBalance(prev => prev - newOrder.total)
    }
    setOrders(prev => [newOrder, ...prev])
    clearCart()
    setAppliedPromo(null)
    setView('orderPlaced')
    setViewData({ order: newOrder })
    // Add notification
    setNotifications(prev => [{
      id: Date.now(), ar: `طلبك ${orderId} قيد التحضير!`, en: `Your order ${orderId} is being prepared!`, read: false, time: 'الآن'
    }, ...prev])
  }, [cart, cartStoreId, cartTotal, clearCart])

  // ── Reorder ───────────────────────────────────────────────────────
  const reorder = useCallback((order) => {
    const store = SEED_STORES.find(s => s.id === order.storeId)
    if (store) openStore(store)
  }, [openStore])

  // ── Wishlist ──────────────────────────────────────────────────────
  const toggleWishlist = useCallback((storeId) => {
    setWishlist(prev => prev.includes(storeId) ? prev.filter(id => id !== storeId) : [...prev, storeId])
  }, [])

  // ── Mark notifs read ──────────────────────────────────────────────
  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  // ── Apply promo ───────────────────────────────────────────────────
  const applyPromo = useCallback((code) => {
    const promos = { 'YUTA10': 10, 'YUTA20': 20, 'WELCOME': 15 }
    const discount = promos[code.toUpperCase()]
    if (discount) { setAppliedPromo({ code: code.toUpperCase(), discount }); return true }
    return false
  }, [])

  // ── Top up wallet ─────────────────────────────────────────────────
  const topUpWallet = useCallback((amount) => {
    setWalletBalance(prev => prev + amount)
    setNotifications(prev => [{ id: Date.now(), ar: `تم إضافة ${amount} درهم لمحفظتك`, en: `${amount} AED added to your wallet`, read: false, time: 'الآن' }, ...prev])
  }, [])

  // ── Order tracking ────────────────────────────────────────────────
  const openTracking = useCallback((order) => {
    setView('orderTracking')
    setViewData({ order })
  }, [])

  // ── Navigate tab ──────────────────────────────────────────────────
  const navigateTo = useCallback((tab) => {
    setActiveTab(tab)
    setView('home')
    setViewData(null)
  }, [])

  return (
    <MobileContext.Provider value={{
      // Data
      stores: SEED_STORES, categories: SEED_CATEGORIES, orders, addresses, walletBalance,
      // Cart
      cart, cartTotal, cartCount, cartStoreId, addToCart, removeFromCart, clearCart, getQty,
      // Navigation
      view, viewData, openStore, goBack, openCart, openCheckout, activeTab, setActiveTab: navigateTo,
      // Orders
      placeOrder, reorder, openTracking,
      // Wishlist
      wishlist, toggleWishlist,
      // Notifications
      notifications, unreadNotifs, notifOpen, setNotifOpen, markAllRead,
      // Search
      searchOpen, setSearchOpen,
      // Promo
      appliedPromo, applyPromo,
      // Wallet
      topUpWallet,
      // Address
      selectedAddress, setSelectedAddress, addAddress: (a) => setAddresses(prev => [...prev, { id: Date.now(), ...a }]),
      // Rating
      ratingModal, setRatingModal,
    }}>
      {children}
    </MobileContext.Provider>
  )
}

export const useMobile = () => useContext(MobileContext)
export { SEED_STORES, SEED_CATEGORIES, SEED_PRODUCTS }
