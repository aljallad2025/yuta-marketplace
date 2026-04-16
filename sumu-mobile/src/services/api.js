import { supabase } from '../lib/supabase';

// ─── المصادقة ─────────────────────────────────────────────────────────────────

export const authService = {
  // تسجيل الدخول برقم الهاتف أو البريد
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  // إنشاء حساب جديد
  signUp: async (email, password, name, phone) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, phone } },
    });
    if (error) throw error;
    return data;
  },

  // تسجيل الخروج
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // الجلسة الحالية
  getSession: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  // الاستماع لتغييرات الحالة
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// ─── الملف الشخصي ─────────────────────────────────────────────────────────────

export const profileService = {
  getProfile: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data;
  },

  updateProfile: async (userId, updates) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

// ─── المتاجر والمنتجات ────────────────────────────────────────────────────────

export const storeService = {
  getStores: async (category = null) => {
    let query = supabase.from('stores').select('*').order('is_featured', { ascending: false });
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  getFeaturedStores: async () => {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('is_featured', true)
      .order('rating', { ascending: false });
    if (error) throw error;
    return data;
  },

  searchStores: async (query) => {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .or(`name_ar.ilike.%${query}%,name_en.ilike.%${query}%`);
    if (error) throw error;
    return data;
  },

  getProducts: async (storeId) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('store_id', storeId)
      .eq('is_available', true)
      .order('category');
    if (error) throw error;
    return data;
  },
};

// ─── الفئات ────────────────────────────────────────────────────────────────────

export const categoryService = {
  getCategories: async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order');
    if (error) throw error;
    return data;
  },
};

// ─── العروض ────────────────────────────────────────────────────────────────────

export const offerService = {
  getOffers: async () => {
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    if (error) throw error;
    return data;
  },
};

// ─── الطلبات ───────────────────────────────────────────────────────────────────

export const orderService = {
  createOrder: async (orderData) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('orders')
      .insert({ ...orderData, user_id: user?.id })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  getOrders: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  updateOrderStatus: async (orderId, status) => {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // الاستماع الفوري لتحديثات الطلب
  subscribeToOrder: (orderId, callback) => {
    return supabase
      .channel(`order-${orderId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${orderId}`,
      }, payload => callback(payload.new))
      .subscribe();
  },
};

// ─── رحلات التاكسي ────────────────────────────────────────────────────────────

export const taxiService = {
  createRide: async (rideData) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('taxi_rides')
      .insert({ ...rideData, user_id: user?.id })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  getRides: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data, error } = await supabase
      .from('taxi_rides')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
};
