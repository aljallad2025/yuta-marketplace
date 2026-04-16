import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  FlatList, Alert, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS, SPACING, RADIUS, SHADOWS, FONTS } from '../constants/theme';
import { PRODUCTS } from '../constants/data';
import { storeService } from '../services/api';

export default function StoreScreen({ navigation, route }) {
  const { store } = route.params;
  const { isAr, cart, addToCart, removeFromCart, cartCount, currentStore } = useApp();
  const insets = useSafeAreaInsets();

  // جلب المنتجات من Supabase مع fallback للبيانات المحلية
  const [products, setProducts] = useState(PRODUCTS[store.id] || []);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    setLoadingProducts(true);
    storeService.getProducts(store.id)
      .then(data => {
        if (data?.length) {
          // تطبيع البيانات من Supabase
          const normalized = data.map(p => ({
            ...p,
            nameAr: p.name_ar || p.nameAr,
            nameEn: p.name_en || p.nameEn,
            descriptionAr: p.description_ar || p.descriptionAr,
            descriptionEn: p.description_en || p.descriptionEn,
          }));
          setProducts(normalized);
        }
      })
      .catch(() => {}) // يبقى على البيانات المحلية
      .finally(() => setLoadingProducts(false));
  }, [store.id]);

  const categories = [...new Set(products.map(p => p.category))];
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    if (categories.length && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [products]);

  const t = (ar, en) => isAr ? ar : en;

  // تطبيع بيانات المتجر
  const storeName = isAr ? (store.name_ar || store.nameAr) : (store.name_en || store.nameEn);
  const storeDesc = isAr ? (store.description_ar || store.descriptionAr) : (store.description_en || store.descriptionEn);
  const deliveryFeeDisplay = (store.delivery_fee ?? store.deliveryFee) === 0
    ? t('توصيل مجاني', 'Free')
    : `${store.delivery_fee ?? store.deliveryFee} AED`;

  const getQty = (productId) => {
    const item = cart.find(i => i.id === productId);
    return item ? item.qty : 0;
  };

  const handleAdd = (product) => {
    if (currentStore && currentStore.id !== store.id && cart.length > 0) {
      Alert.alert(
        t('تغيير المتجر؟', 'Change store?'),
        t('سيتم حذف سلة التسوق الحالية', 'Your current cart will be cleared'),
        [
          { text: t('إلغاء', 'Cancel'), style: 'cancel' },
          { text: t('تأكيد', 'Confirm'), onPress: () => addToCart(product, store) },
        ]
      );
    } else {
      addToCart(product, store);
    }
  };

  const filteredProducts = products.filter(p => p.category === activeCategory);
  const storeCartCount = cart.filter(i => i.storeId === store.id).reduce((s, i) => s + i.qty, 0);
  const storeCartTotal = cart.filter(i => i.storeId === store.id).reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <View style={styles.container}>
      {/* Hero */}
      <View style={[styles.hero, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.heroEmoji}>{store.emoji}</Text>
        <View style={styles.heroInfo}>
          <Text style={styles.heroName}>{storeName}</Text>
          <Text style={styles.heroDesc}>{storeDesc}</Text>
          <View style={styles.heroMeta}>
            <View style={styles.badge}><Text style={styles.badgeText}>⭐ {store.rating}</Text></View>
            <View style={styles.badge}><Text style={styles.badgeText}>🕐 {store.delivery_time || store.deliveryTime} min</Text></View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{deliveryFeeDisplay}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Category tabs */}
      <View style={styles.tabs}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={c => c}
          contentContainerStyle={{ paddingHorizontal: SPACING.lg, gap: SPACING.sm }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.tab, activeCategory === item && styles.activeTab]}
              onPress={() => setActiveCategory(item)}
            >
              <Text style={[styles.tabText, activeCategory === item && styles.activeTabText]}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Products */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {filteredProducts.map(product => {
          const qty = getQty(product.id);
          return (
            <View key={product.id} style={[styles.productCard, SHADOWS.sm]}>
              <View style={styles.productEmoji}>
                <Text style={{ fontSize: 36 }}>{product.emoji}</Text>
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{isAr ? product.nameAr : product.nameEn}</Text>
                <Text style={styles.productDesc} numberOfLines={2}>
                  {isAr ? product.descriptionAr : product.descriptionEn}
                </Text>
                <Text style={styles.productPrice}>{product.price} AED</Text>
              </View>
              <View style={styles.qtyControl}>
                {qty === 0 ? (
                  <TouchableOpacity style={styles.addBtn} onPress={() => handleAdd(product)}>
                    <Ionicons name="add" size={20} color="#fff" />
                  </TouchableOpacity>
                ) : (
                  <View style={styles.qtyRow}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => removeFromCart(product.id)}
                    >
                      <Ionicons name="remove" size={18} color={COLORS.primary} />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{qty}</Text>
                    <TouchableOpacity
                      style={styles.qtyBtnFill}
                      onPress={() => handleAdd(product)}
                    >
                      <Ionicons name="add" size={18} color="#fff" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Cart Footer */}
      {storeCartCount > 0 && (
        <View style={[styles.cartFooter, { paddingBottom: insets.bottom + SPACING.md }]}>
          <TouchableOpacity
            style={styles.cartBtn}
            onPress={() => navigation.navigate('Cart')}
          >
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{storeCartCount}</Text>
            </View>
            <Text style={styles.cartBtnText}>{t('عرض السلة', 'View Cart')}</Text>
            <Text style={styles.cartBtnTotal}>{storeCartTotal} AED</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  hero: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    alignItems: 'center',
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: SPACING.sm,
    padding: 4,
  },
  heroEmoji: { fontSize: 72, marginBottom: SPACING.sm },
  heroInfo: { alignItems: 'center' },
  heroName: { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: '#fff', marginBottom: 4 },
  heroDesc: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.8)', marginBottom: SPACING.md, textAlign: 'center' },
  heroMeta: { flexDirection: 'row', gap: 8 },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  tabs: {
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: SPACING.sm,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeTab: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tabText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  activeTabText: { color: '#fff' },
  productCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  productEmoji: {
    width: 64, height: 64,
    backgroundColor: '#F0EDE6',
    borderRadius: RADIUS.md,
    alignItems: 'center', justifyContent: 'center',
    marginEnd: SPACING.md,
  },
  productInfo: { flex: 1, marginEnd: SPACING.sm },
  productName: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  productDesc: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 4 },
  productPrice: { fontSize: FONTS.sizes.md, fontWeight: '800', color: COLORS.gold },
  qtyControl: { alignItems: 'center', justifyContent: 'center' },
  addBtn: {
    backgroundColor: COLORS.primary,
    width: 36, height: 36,
    borderRadius: RADIUS.full,
    alignItems: 'center', justifyContent: 'center',
  },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyBtn: {
    width: 30, height: 30,
    borderRadius: 15,
    borderWidth: 1.5, borderColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  qtyBtnFill: {
    width: 30, height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  qtyText: { fontSize: 16, fontWeight: '800', color: COLORS.primary, minWidth: 20, textAlign: 'center' },
  cartFooter: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    backgroundColor: 'transparent',
  },
  cartBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: 16,
  },
  cartBadge: {
    backgroundColor: COLORS.gold,
    width: 26, height: 26,
    borderRadius: 13,
    alignItems: 'center', justifyContent: 'center',
    marginEnd: 12,
  },
  cartBadgeText: { fontSize: 12, fontWeight: '800', color: COLORS.primary },
  cartBtnText: { flex: 1, color: '#fff', fontSize: FONTS.sizes.md, fontWeight: '700' },
  cartBtnTotal: { color: COLORS.gold, fontSize: FONTS.sizes.md, fontWeight: '800' },
});
