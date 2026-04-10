import React, { createContext, useContext, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isAr, setIsAr] = useState(true);
  const [cart, setCart] = useState([]);
  const [currentStore, setCurrentStore] = useState(null);
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState({
    name: 'أحمد محمد',
    nameEn: 'Ahmed Mohamed',
    phone: '+971 50 123 4567',
    email: 'ahmed@email.com',
    wallet: 150.0,
    avatar: '👤',
  });
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const toggleLang = useCallback(() => setIsAr(v => !v), []);

  const addToCart = useCallback((product, store) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...product, qty: 1, storeId: store.id, storeName: isAr ? store.nameAr : store.nameEn }];
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

  const placeOrder = useCallback((deliveryAddress, paymentMethod) => {
    const newOrder = {
      id: `ORD-${Date.now()}`,
      items: [...cart],
      store: currentStore,
      total: cartTotal + (currentStore?.deliveryFee || 0),
      deliveryFee: currentStore?.deliveryFee || 0,
      status: 'pending',
      statusAr: 'في الانتظار',
      deliveryAddress,
      paymentMethod,
      createdAt: new Date().toISOString(),
      eta: 30,
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  }, [cart, currentStore, cartTotal, clearCart]);

  const activeOrders = orders.filter(o => ['pending', 'preparing', 'on_the_way'].includes(o.status));

  return (
    <AppContext.Provider value={{
      isAr, toggleLang,
      cart, addToCart, removeFromCart, clearCart,
      cartTotal, cartCount,
      currentStore, setCurrentStore,
      orders, placeOrder, activeOrders,
      user, setUser,
      isLoggedIn, setIsLoggedIn,
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
