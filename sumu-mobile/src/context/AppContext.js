import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService, profileService, orderService } from '../services/api';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isAr, setIsAr] = useState(true);
  const [cart, setCart] = useState([]);
  const [currentStore, setCurrentStore] = useState(null);
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // ─── استرجاع اللغة المحفوظة ────────────────────────────────────────────────
  useEffect(() => {
    AsyncStorage.getItem('lang').then(val => {
      if (val !== null) setIsAr(val === 'ar');
    });
  }, []);

  const toggleLang = useCallback(() => {
    setIsAr(v => {
      const next = !v;
      AsyncStorage.setItem('lang', next ? 'ar' : 'en');
      return next;
    });
  }, []);

  // ─── الاستماع لحالة المصادقة ───────────────────────────────────────────────
  useEffect(() => {
    authService.getSession().then(sess => {
      setSession(sess);
      setIsLoggedIn(!!sess);
      if (sess?.user) {
        setUser(sess.user);
        loadProfile(sess.user.id);
        loadOrders();
      }
      setAuthLoading(false);
    });

    const { data: { subscription } } = authService.onAuthStateChange(async (event, sess) => {
      setSession(sess);
      setIsLoggedIn(!!sess);
      if (sess?.user) {
        setUser(sess.user);
        loadProfile(sess.user.id);
        loadOrders();
      } else {
        setUser(null);
        setProfile(null);
        setOrders([]);
      }
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ─── تحميل الملف الشخصي ────────────────────────────────────────────────────
  const loadProfile = async (userId) => {
    try {
      const p = await profileService.getProfile(userId);
      setProfile(p);
    } catch (e) {
      // Profile may not exist yet if just created
    }
  };

  // ─── تحميل الطلبات ────────────────────────────────────────────────────────
  const loadOrders = async () => {
    try {
      const data = await orderService.getOrders();
      setOrders(data || []);
    } catch (e) {
      console.log('loadOrders error:', e.message);
    }
  };

  // ─── تسجيل الخروج ────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    await authService.signOut();
    setCart([]);
    setCurrentStore(null);
  }, []);

  // ─── إدارة السلة ──────────────────────────────────────────────────────────
  const addToCart = useCallback((product, store) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...product, qty: 1, storeId: store.id, storeName: isAr ? store.name_ar : store.name_en }];
    });
    setCurrentStore(store);
  }, [isAr]);

  const removeFromCart = useCallback((productId) => {
    setCart(prev => {
      const updated = prev.map(i => i.id === productId ? { ...i, qty: i.qty - 1 } : i).filter(i => i.qty > 0);
      if (updated.length === 0) setCurrentStore(null);
      return updated;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setCurrentStore(null);
  }, []);

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  // ─── تأكيد الطلب وحفظه في قاعدة البيانات ──────────────────────────────────
  const placeOrder = useCallback(async (deliveryAddress, paymentMethod, notes = '') => {
    const orderId = `ORD-${Date.now()}`;
    const orderData = {
      id: orderId,
      store_id: currentStore?.id,
      store_name_ar: currentStore?.name_ar,
      store_name_en: currentStore?.name_en,
      store_emoji: currentStore?.emoji,
      items: cart.map(i => ({
        id: i.id,
        name_ar: i.name_ar,
        name_en: i.name_en,
        price: i.price,
        qty: i.qty,
        emoji: i.emoji,
      })),
      total: cartTotal + (currentStore?.delivery_fee || 0),
      delivery_fee: currentStore?.delivery_fee || 0,
      delivery_address: deliveryAddress,
      payment_method: paymentMethod,
      notes,
      status: 'pending',
      eta: 30,
    };

    try {
      // حفظ في Supabase
      const saved = await orderService.createOrder(orderData);
      setOrders(prev => [saved, ...prev]);
      clearCart();
      return saved;
    } catch (e) {
      // في حالة فشل الاتصال، احفظ محلياً
      const localOrder = { ...orderData, createdAt: new Date().toISOString() };
      setOrders(prev => [localOrder, ...prev]);
      clearCart();
      return localOrder;
    }
  }, [cart, currentStore, cartTotal, clearCart]);

  const activeOrders = orders.filter(o => ['pending', 'preparing', 'on_the_way'].includes(o.status));

  // ─── البيانات المتاحة للتطبيق ────────────────────────────────────────────
  return (
    <AppContext.Provider value={{
      // اللغة
      isAr, toggleLang,

      // السلة
      cart, addToCart, removeFromCart, clearCart,
      cartTotal, cartCount,
      currentStore, setCurrentStore,

      // الطلبات
      orders, placeOrder, activeOrders, loadOrders,

      // المستخدم والملف الشخصي
      user, setUser,
      profile, setProfile, loadProfile,
      session,

      // حالة التسجيل
      isLoggedIn, setIsLoggedIn,
      authLoading,
      logout,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
