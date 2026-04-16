import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { COLORS, SPACING, RADIUS, FONTS } from '../constants/theme';
import { STORES, CATEGORIES } from '../constants/data';
import { storeService, categoryService } from '../services/api';
import StoreCard from '../components/StoreCard';

export default function StoresScreen({ navigation, route }) {
  const { isAr } = useApp();
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState(route?.params?.categoryId || 'all');
  const [stores, setStores] = useState(STORES);
  const [categories, setCategories] = useState(CATEGORIES);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const t = (ar, en) => isAr ? ar : en;

  const fetchData = useCallback(async () => {
    try {
      const [storesData, catsData] = await Promise.all([
        storeService.getStores(activeCategory === 'all' ? null : activeCategory),
        categoryService.getCategories(),
      ]);
      if (storesData?.length) setStores(storesData);
      if (catsData?.length) setCategories(catsData);
    } catch (e) {}
  }, [activeCategory]);

  useEffect(() => {
    setLoading(true);
    fetchData().finally(() => setLoading(false));
  }, [activeCategory]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  // تطبيع البيانات
  const normalizeStore = (s) => ({
    ...s,
    nameAr: s.name_ar || s.nameAr,
    nameEn: s.name_en || s.nameEn,
    deliveryTime: s.delivery_time || s.deliveryTime,
    deliveryFee: s.delivery_fee ?? s.deliveryFee,
    minOrder: s.min_order || s.minOrder,
    reviewCount: s.review_count || s.reviewCount,
    isOpen: s.is_open ?? s.isOpen ?? true,
    isFeatured: s.is_featured ?? s.isFeatured ?? false,
    badge: s.badge_ar || s.badge,
    name_ar: s.name_ar || s.nameAr,
    name_en: s.name_en || s.nameEn,
    delivery_fee: s.delivery_fee ?? s.deliveryFee,
  });

  const normalizedStores = stores.map(normalizeStore);
  const filtered = activeCategory === 'all'
    ? normalizedStores
    : normalizedStores.filter(s => s.category === activeCategory);

  const normalizeCategory = (c) => ({
    id: c.id,
    nameAr: c.name_ar || c.nameAr,
    nameEn: c.name_en || c.nameEn,
    icon: c.icon,
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('المتاجر', 'Stores')}</Text>
      </View>

      {/* الفئات */}
      <View style={styles.tabsContainer}>
        <FlatList
          data={categories.map(normalizeCategory)}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingHorizontal: SPACING.lg, gap: SPACING.sm, paddingVertical: SPACING.sm }}
          renderItem={({ item }) => {
            const isActive = activeCategory === item.id;
            return (
              <TouchableOpacity
                style={[styles.tab, isActive && styles.activeTab]}
                onPress={() => setActiveCategory(item.id)}
              >
                <Text style={styles.tabEmoji}>{item.icon}</Text>
                <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                  {isAr ? item.nameAr : item.nameEn}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* المتاجر */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.storesList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      >
        {loading && !refreshing ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
        ) : (
          <>
            <Text style={styles.count}>
              {t(`${filtered.length} متجر`, `${filtered.length} stores`)}
            </Text>
            {filtered.map(store => (
              <StoreCard
                key={store.id}
                store={store}
                onPress={() => navigation.navigate('Store', { store })}
              />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: COLORS.primary },
  tabsContainer: {
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabEmoji: { fontSize: 16 },
  tabText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  activeTabText: { color: '#fff' },
  storesList: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: 20,
  },
  count: { fontSize: 13, color: COLORS.textSecondary, marginBottom: SPACING.md },
});
